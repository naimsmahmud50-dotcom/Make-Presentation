/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Client-Side Git Repository Ingestor (GitHub / GitLab)
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Fetches and synthesizes live presentation decks directly from public Git repositories
 * (GitHub / GitLab) without requiring the user to clone or download files locally first.
 *
 * [ZERO-UPLOAD PRIVACY GUARANTEE]:
 * Requests are dispatched directly from the client's browser to the public Git REST APIs.
 * No intermediate server or third-party proxy is used; all token parsing and AST analysis
 * runs strictly inside the browser.
 *
 * [ENGINEERING NOTES]:
 * - Use `fetchRepoTree(repoUrl)` with any standard web URL, e.g.:
 *     `https://github.com/langchain-ai/langchain`
 *     `https://github.com/vercel/next.js`
 * - Fallback cascade checks `main` branch first, then `master`.
 * =========================================================================================
 */

import { IGNORED_PATTERNS, normalizePath } from './tree-scanner.js';

/**
 * Extracts owner, repo, and branch from GitHub or GitLab URLs
 * @param {string} rawUrl
 * @returns {{ platform: string, owner: string, repo: string, branch: string }}
 */
export function parseGitUrl(rawUrl) {
  const clean = rawUrl.trim().replace(/\/+$/, '');
  const matchGithub = clean.match(/github\.com\/([^/]+)\/([^/]+)(?:\/tree\/([^/]+))?/i);
  if (matchGithub) {
    return {
      platform: 'github',
      owner: matchGithub[1],
      repo: matchGithub[2].replace(/\.git$/i, ''),
      branch: matchGithub[3] || 'main'
    };
  }

  const matchGitlab = clean.match(/gitlab\.com\/([^/]+)\/([^/]+)(?:\/-\/tree\/([^/]+))?/i);
  if (matchGitlab) {
    return {
      platform: 'gitlab',
      owner: matchGitlab[1],
      repo: matchGitlab[2].replace(/\.git$/i, ''),
      branch: matchGitlab[3] || 'main'
    };
  }

  throw new Error('Please enter a valid GitHub or GitLab repository URL (e.g. https://github.com/owner/repo)');
}

/**
 * Fetches the recursive Git tree from GitHub REST API
 * @param {string} owner
 * @param {string} repo
 * @param {string} branch
 * @returns {Promise<{ tree: Array<Object>, branch: string }>}
 */
async function fetchGithubTree(owner, repo, branch = 'main') {
  let apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  let response = await fetch(apiUrl);

  // If 'main' fails, retry with 'master'
  if (!response.ok && branch === 'main') {
    const fallbackUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`;
    const fallbackRes = await fetch(fallbackUrl);
    if (fallbackRes.ok) {
      response = fallbackRes;
      branch = 'master';
    }
  }

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('GitHub API rate limit reached for anonymous requests. Please try another repo or drop local folder.');
    } else if (response.status === 404) {
      throw new Error(`Repository "${owner}/${repo}" was not found or is private.`);
    }
    throw new Error(`GitHub API error (${response.status}): Could not load repository tree.`);
  }

  const data = await response.json();
  if (!data.tree || !Array.isArray(data.tree)) {
    throw new Error('Repository returned empty or invalid tree structure.');
  }

  return { tree: data.tree, branch };
}

/**
 * Fetches text content of a single raw file from GitHub
 * @param {string} owner
 * @param {string} repo
 * @param {string} branch
 * @param {string} path
 * @returns {Promise<string>}
 */
export async function fetchGithubRawFile(owner, repo, branch, path) {
  try {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.text();
    }
  } catch (err) {
    console.warn('[GitFetcher] Failed to fetch raw file', path, err);
  }
  return '';
}

/**
 * Fetches public repository and constructs FileNode tree for APEXFLOW OS
 * @param {string} repoUrl
 * @returns {Promise<{ root: Object, meta: Object, rawPackageJson: string, rawRequirementsTxt: string }>}
 */
export async function ingestGitRepository(repoUrl) {
  const { platform, owner, repo, branch: requestedBranch } = parseGitUrl(repoUrl);
  const { tree: gitItems, branch } = await fetchGithubTree(owner, repo, requestedBranch);

  const root = {
    name: repo,
    path: '',
    isDirectory: true,
    children: []
  };

  let rawPackageJson = '';
  let rawRequirementsTxt = '';

  // Process and filter files
  for (const item of gitItems) {
    const cleanPath = normalizePath(item.path);
    if (!cleanPath) continue;

    const parts = cleanPath.split('/');
    if (parts.some(p => IGNORED_PATTERNS.includes(p))) continue;

    if (item.type === 'blob') {
      let current = root;
      for (let pIdx = 0; pIdx < parts.length; pIdx++) {
        const part = parts[pIdx];
        const isFile = pIdx === parts.length - 1;

        if (isFile) {
          const fileNode = {
            name: part,
            path: cleanPath,
            isDirectory: false,
            size: item.size || 0,
            extension: part.includes('.') ? part.split('.').pop().toLowerCase() : '',
            async text() {
              return await fetchGithubRawFile(owner, repo, branch, cleanPath);
            }
          };

          // Fetch critical manifest files in parallel
          if (part === 'package.json' && !rawPackageJson) {
            rawPackageJson = await fetchGithubRawFile(owner, repo, branch, cleanPath);
            fileNode._cachedText = rawPackageJson;
          } else if (part === 'requirements.txt' && !rawRequirementsTxt) {
            rawRequirementsTxt = await fetchGithubRawFile(owner, repo, branch, cleanPath);
            fileNode._cachedText = rawRequirementsTxt;
          }

          current.children.push(fileNode);
        } else {
          let dir = current.children.find(c => c.isDirectory && c.name === part);
          if (!dir) {
            dir = {
              name: part,
              path: parts.slice(0, pIdx + 1).join('/'),
              isDirectory: true,
              children: []
            };
            current.children.push(dir);
          }
          current = dir;
        }
      }
    }
  }

  const meta = {
    owner,
    repo,
    branch,
    platform,
    url: repoUrl,
    totalFilesCount: gitItems.filter(i => i.type === 'blob').length
  };

  return { root, meta, rawPackageJson, rawRequirementsTxt };
}
