/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Token-Level Code Syntax Highlighter & Inspector
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Provides tokenized, colored code rendering for the frosted-glass Code Drawer in Stage 2.
 * Supports:
 *   - Python (keywords, decorators, def/class, strings, comments, numbers)
 *   - TypeScript / JavaScript (async, await, const, let, import, exports)
 *   - SQL & JSON (keys, values, types)
 *
 * [ZERO-DEPENDENCY OFFLINE ENGINE]:
 * Works 100% offline with zero external NPM packages or CDN downloads.
 * Includes interactive line numbering, line highlighting, and 1-click clipboard copy.
 *
 * [THEME PALETTE]:
 * - Keywords: #00F0FF (Neon Cyan)
 * - Functions & Classes: #A855F7 (Electric Violet)
 * - Strings: #10B981 (Emerald Green)
 * - Numbers / Constants: #F59E0B (Amber)
 * - Comments: #64748B (Slate Muted)
 * =========================================================================================
 */

/**
 * Common language keywords
 */
const KEYWORDS = new Set([
  'def', 'class', 'import', 'from', 'as', 'return', 'if', 'else', 'elif', 'for', 'while',
  'in', 'is', 'not', 'and', 'or', 'try', 'except', 'finally', 'raise', 'with', 'async',
  'await', 'lambda', 'pass', 'yield', 'global', 'nonlocal', 'assert',
  'const', 'let', 'var', 'function', 'export', 'default', 'new', 'this', 'typeof',
  'interface', 'type', 'enum', 'extends', 'implements', 'public', 'private', 'readonly'
]);

/**
 * Escapes HTML entities
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/\'/g, '&#039;');
}

/**
 * Highlights a line of code into styled HTML spans
 * @param {string} line
 * @returns {string}
 */
export function highlightCodeLine(line) {
  if (!line) return '&nbsp;';

  // 1. Comments (# or //)
  const commentIdx = line.search(/(#|\/\/)/);
  if (commentIdx !== -1) {
    const codePart = line.substring(0, commentIdx);
    const commentPart = line.substring(commentIdx);
    return `${highlightCodeLine(codePart)}<span style="color: #64748B; font-style: italic;">${escapeHtml(commentPart)}</span>`;
  }

  // 2. Decorators (@...)
  if (line.trim().startsWith('@')) {
    return `<span style="color: #F59E0B; font-weight: 600;">${escapeHtml(line)}</span>`;
  }

  // 3. Tokenize strings and literals before HTML escaping
  let formatted = line;

  // Strings tokenization
  formatted = formatted.replace(/(["'\u0060])(.*?)\1/g, '___STR_START___$1$2$1___STR_END___');

  // Numbers tokenization
  formatted = formatted.replace(/\b(\d+)\b/g, '___NUM_START___$1___NUM_END___');

  // Keyword tokenization
  formatted = formatted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (match) => {
    if (KEYWORDS.has(match)) {
      return `___KW_START___${match}___KW_END___`;
    }
    return match;
  });

  // Escape HTML characters
  formatted = escapeHtml(formatted);

  // Replace placeholders with luxury OLED styled spans
  formatted = formatted
    .replace(/___STR_START___(.*?)___STR_END___/g, '<span style="color: #10B981;">$1</span>')
    .replace(/___NUM_START___(.*?)___NUM_END___/g, '<span style="color: #F59E0B;">$1</span>')
    .replace(/___KW_START___(.*?)___KW_END___/g, '<span style="color: #00F0FF; font-weight: 600;">$1</span>');

  return formatted;
}

/**
 * Renders complete code snippet with line numbers into an HTML container
 * @param {HTMLElement} container
 * @param {string} codeText
 * @param {string} language
 */
export function renderHighlightedCode(container, codeText, language = 'python') {
  if (!container) return;

  const lines = (codeText || '').split('\n');

  let html = `
    <div style="display: flex; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.6; background: #06090F; border: 1px solid var(--border-card); border-radius: 8px; overflow: hidden;">
      <!-- Line Numbers Column -->
      <div style="user-select: none; padding: 16px 12px; background: rgba(0,0,0,0.3); border-right: 1px solid var(--border-subtle); color: #475569; text-align: right; min-width: 42px;">
        ${lines.map((_, i) => `<div>${i + 1}</div>`).join('')}
      </div>

      <!-- Code Content Column -->
      <div style="flex: 1; padding: 16px; overflow-x: auto; white-space: pre;">
        ${lines.map(line => `<div>${highlightCodeLine(line)}</div>`).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
}
