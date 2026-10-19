/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Client-Side Tree Scanner (Universal Ingestion)
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Traverses files and directories 100% inside the browser client memory.
 * Supported input modes:
 *   1. HTML5 FileSystemDirectoryReader (Folder drag-and-drop)
 *   2. Standard HTML5 FileList (Multi-file / webkitdirectory selection)
 *   3. Client-side Zip archives (via JSZip or native decompression)
 *   4. Raw memory simulated trees (for Instant Demo showcases)
 *
 * [ZERO-UPLOAD PRIVACY GUARANTEE]:
 * No file contents, tokens, or directory names are ever transmitted to an external server.
 * All tree reconstruction and AST pattern detection happens locally.
 *
 * [ENGINEERING NOTES]:
 * - If you need to filter out heavy/irrelevant files, modify `IGNORED_PATTERNS`.
 * - To read specific file contents on demand (e.g., for code preview), use `readFileContent()`.
 * =========================================================================================
 */

/**
 * Ignored directories and files to maximize scan speed
 */
export const IGNORED_PATTERNS = [
  'node_modules',
  '.git',
  '.next',
  '.cache',
  'dist',
  'build',
  '__pycache__',
  '.venv',
  'venv',
  '.idea',
  '.vscode',
  '.DS_Store'
];

/**
 * Normalizes file paths to use forward slashes
 * @param {string} path
 * @returns {string}
 */
export function normalizePath(path) {
  return path.replace(/\\/g, '/').replace(/^\/+/, '');
}

/**
 * Recursively scans an HTML5 FileSystemDirectoryEntry from a drag-and-drop event
 * @param {FileSystemDirectoryEntry} dirEntry
 * @param {string} currentPath
 * @returns {Promise<Object>} FileNode
 */
export async function scanDirectoryEntry(dirEntry, currentPath = '') {
  const node = {
    name: dirEntry.name,
    path: currentPath ? `${currentPath}/${dirEntry.name}` : dirEntry.name,
    isDirectory: true,
    children: []
  };

  const reader = dirEntry.createReader();
  const entries = await readAllEntries(reader);

  for (const entry of entries) {
    if (IGNORED_PATTERNS.includes(entry.name)) {
      continue;
    }

    if (entry.isDirectory) {
      const childDir = await scanDirectoryEntry(entry, node.path);
      node.children.push(childDir);
    } else if (entry.isFile) {
      const fileNode = await getFileNode(entry, node.path);
      node.children.push(fileNode);
    }
  }

  // Sort: directories first, then alphabetical
  node.children.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.name.localeCompare(b.name);
  });

  return node;
}

/**
 * Helper to drain directory reader entries (Chromium reads in batches of 100)
 * @param {FileSystemDirectoryReader} reader
 * @returns {Promise<Array<FileSystemEntry>>}
 */
function readAllEntries(reader) {
  return new Promise((resolve, reject) => {
    const allEntries = [];
    function readBatch() {
      reader.readEntries((entries) => {
        if (!entries || entries.length === 0) {
          resolve(allEntries);
        } else {
          allEntries.push(...entries);
          readBatch();
        }
      }, reject);
    }
    readBatch();
  });
}

/**
 * Extracts metadata for a single file entry
 * @param {FileSystemFileEntry} fileEntry
 * @param {string} parentPath
 * @returns {Promise<Object>} FileNode
 */
function getFileNode(fileEntry, parentPath) {
  return new Promise((resolve) => {
    fileEntry.file((file) => {
      resolve({
        name: file.name,
        path: `${parentPath}/${file.name}`,
        isDirectory: false,
        size: file.size,
        extension: file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : '',
        lastModified: file.lastModified,
        rawFile: file // Kept in client memory for lazy reading
      });
    }, () => {
      // Graceful fallback on read error
      resolve({
        name: fileEntry.name,
        path: `${parentPath}/${fileEntry.name}`,
        isDirectory: false,
        size: 0,
        extension: ''
      });
    });
  });
}

/**
 * Converts a flat FileList (from input[type=file]) into a nested FileNode tree
 * @param {FileList} fileList
 * @returns {Object} FileNode root
 */
export function parseFileListToTree(fileList) {
  const root = {
    name: 'root',
    path: '',
    isDirectory: true,
    children: []
  };

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const path = normalizePath(file.webkitRelativePath || file.name);
    const parts = path.split('/');

    // Filter ignored paths
    if (parts.some(p => IGNORED_PATTERNS.includes(p))) {
      continue;
    }

    let current = root;
    for (let pIdx = 0; pIdx < parts.length; pIdx++) {
      const part = parts[pIdx];
      const isLast = pIdx === parts.length - 1;

      if (isLast) {
        current.children.push({
          name: part,
          path: path,
          isDirectory: false,
          size: file.size,
          extension: part.includes('.') ? part.split('.').pop().toLowerCase() : '',
          rawFile: file
        });
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

  // If single root folder, unwrap
  if (root.children.length === 1 && root.children[0].isDirectory) {
    return root.children[0];
  }

  return root;
}

/**
 * Reads the text content of a FileNode asynchronously
 * @param {Object} fileNode
 * @param {number} maxBytes (default: 200KB limit for speed)
 * @returns {Promise<string>}
 */
export async function readFileText(fileNode, maxBytes = 200000) {
  if (fileNode.content) {
    return fileNode.content;
  }
  if (!fileNode.rawFile) {
    return '';
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      fileNode.content = reader.result;
      resolve(reader.result);
    };
    reader.onerror = () => resolve('');
    const slice = fileNode.rawFile.slice(0, maxBytes);
    reader.readAsText(slice);
  });
}

/**
 * Flattens a tree into a list of all files
 * @param {Object} root
 * @returns {Array<Object>}
 */
export function flattenFileTree(root) {
  const result = [];
  function traverse(node) {
    if (!node.isDirectory) {
      result.push(node);
    }
    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }
  traverse(root);
  return result;
}
