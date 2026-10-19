/**
 * =========================================================================================
 * [MODULE]: ENTERPRISE ZERO-TRUST SECURITY SANITIZER & INPUT SHIELD (Task T097)
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Pure client-side zero-dependency security shield providing deep input sanitization,
 * safe innerHTML injection, prototype-pollution defense, and unsafe URL blocking across
 * all APEXFLOW OS presentation engines and importers.
 *
 * [ZERO-UPLOAD PRIVACY GUARANTEE]:
 * Operates strictly within browser memory via HTML5 DOMParser. Zero telemetry leakage.
 * =========================================================================================
 */

export class InputShield {
  constructor() {
    this.allowedTags = new Set([
      'a', 'b', 'strong', 'i', 'em', 'u', 'span', 'p', 'div', 'br', 'hr',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'code', 'pre',
      'kbd', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'svg', 'g', 'path', 'line', 'polyline', 'polygon', 'rect', 'circle', 'text', 'defs', 'lineargradient', 'stop'
    ]);

    this.allowedAttributes = new Set([
      'class', 'style', 'id', 'title', 'aria-label', 'aria-hidden', 'role',
      'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
      'viewbox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin',
      'cx', 'cy', 'r', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points', 'd', 'transform',
      'opacity', 'font-family', 'font-size', 'font-weight', 'text-anchor', 'data-action', 'data-id', 'data-tier'
    ]);

    this.unsafeProtocols = ['javascript:', 'vbscript:', 'data:text/html', 'data:text/javascript'];
  }

  /**
   * Encodes HTML entities for safe string interpolation
   * @param {string} str - Raw string
   * @returns {string} Safe escaped HTML string
   */
  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Validates URLs and prevents javascript: or dangerous pseudo-protocol injection
   * @param {string} url - Target URL
   * @returns {string} Sanitized URL or safe fallback
   */
  safeUrl(url) {
    if (!url || typeof url !== 'string') return '#';
    const clean = url.trim().toLowerCase();
    for (const proto of this.unsafeProtocols) {
      if (clean.startsWith(proto)) {
        console.warn('[InputShield] Blocked dangerous protocol URL:', clean);
        return 'about:blank#blocked-protocol';
      }
    }
    return url.trim();
  }

  /**
   * Sanitizes rich HTML snippets using browser-native DOMParser
   * Strips unauthorized tags, removes all inline 'on*' event handlers, and enforces safe URLs
   * @param {string} rawHtml - Unsanitized HTML string
   * @returns {string} Clean, safe HTML string
   */
  sanitizeHtml(rawHtml) {
    if (!rawHtml || typeof rawHtml !== 'string') return '';

    // Fast path: if string contains no angle brackets, just escape
    if (!rawHtml.includes('<') && !rawHtml.includes('>')) {
      return this.escapeHtml(rawHtml);
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');
      this._cleanNode(doc.body);
      return doc.body.innerHTML;
    } catch (err) {
      console.warn('[InputShield] DOMParser failed, falling back to escapeHtml:', err);
      return this.escapeHtml(rawHtml);
    }
  }

  /**
   * Recursively sanitizes a DOM tree node
   * @private
   */
  _cleanNode(node) {
    const children = Array.from(node.childNodes);

    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tagName = child.tagName.toLowerCase();

        // Disallow non-whitelisted tags
        if (!this.allowedTags.has(tagName)) {
          // Replace tag with text content
          const textNode = document.createTextNode(child.textContent || '');
          node.replaceChild(textNode, child);
          continue;
        }

        // Sanitize attributes
        const attrs = Array.from(child.attributes);
        for (const attr of attrs) {
          const attrName = attr.name.toLowerCase();

          // Block all on* inline event handlers (e.g. onerror, onload, onclick)
          if (attrName.startsWith('on')) {
            child.removeAttribute(attr.name);
            continue;
          }

          // Check if attribute is in whitelist
          if (!this.allowedAttributes.has(attrName) && !attrName.startsWith('data-')) {
            child.removeAttribute(attr.name);
            continue;
          }

          // Check href and src attributes for script injection
          if (attrName === 'href' || attrName === 'src') {
            const val = attr.value.trim().toLowerCase();
            for (const proto of this.unsafeProtocols) {
              if (val.startsWith(proto)) {
                child.setAttribute(attr.name, 'about:blank#blocked');
                break;
              }
            }
          }
        }

        // Recursively clean children
        this._cleanNode(child);
      }
    }
  }

  /**
   * Safe DOM innerHTML setter helper
   * @param {HTMLElement} element - Target container element
   * @param {string} rawHtml - Raw HTML content
   */
  safeSetInnerHTML(element, rawHtml) {
    if (!element) return;
    element.innerHTML = this.sanitizeHtml(rawHtml);
  }

  /**
   * Deeply sanitizes JSON payloads, preventing Prototype Pollution attacks
   * Strips __proto__, constructor, and prototype properties recursively
   * @param {any} obj - Target object or array
   * @returns {any} Deeply sanitized clone
   */
  deepSanitizeObject(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.deepSanitizeObject(item));
    }

    const clean = Object.create(null);
    for (const [key, value] of Object.entries(obj)) {
      // Block prototype pollution vectors
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        console.warn(`[InputShield] Blocked prototype pollution key: "${key}"`);
        continue;
      }

      if (typeof value === 'string') {
        clean[key] = value.trim();
      } else if (typeof value === 'object' && value !== null) {
        clean[key] = this.deepSanitizeObject(value);
      } else {
        clean[key] = value;
      }
    }

    return clean;
  }
}

export const inputShield = new InputShield();
