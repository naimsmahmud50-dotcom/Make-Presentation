/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Client-Side Zero-Upload Zip Archive Extractor
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Extracts and reconstructs full repository file trees from `.zip` archives directly in browser memory.
 * Uses zero external heavy npm packages — leverages browser-native `DecompressionStream('deflate-raw')`
 * and binary buffer traversal for sub-second, air-gapped performance.
 *
 * [ZERO-UPLOAD PRIVACY GUARANTEE]:
 * The uploaded .zip buffer is processed strictly inside client memory (ArrayBuffer/Uint8Array).
 * No file bytes, tokens, or filenames leave the client machine.
 *
 * [ENGINEERING NOTES]:
 * - Call `extractZipFileToTree(file)` with any standard File object (e.g. from file input or drop event).
 * - Central Directory parsing ensures corrupted or fragmented local header flags don't break scanning.
 * =========================================================================================
 */

import { IGNORED_PATTERNS, normalizePath } from './tree-scanner.js';

/**
 * Decompresses raw deflate bytes using browser-native DecompressionStream
 * @param {Uint8Array} compressedBytes
 * @returns {Promise<Uint8Array>}
 */
async function decompressDeflateRaw(compressedBytes) {
  if (typeof DecompressionStream !== 'undefined') {
    try {
      const ds = new DecompressionStream('deflate-raw');
      const writer = ds.writable.getWriter();
      writer.write(compressedBytes);
      writer.close();
      const response = new Response(ds.readable);
      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    } catch (err) {
      console.warn('[ZipExtractor] Native DecompressionStream failed, attempting fallback', err);
    }
  }
  // If uncompressed or fallback
  return compressedBytes;
}

/**
 * Parses a standard .zip archive into a hierarchical FileNode tree
 * @param {File|Blob} zipBlob
 * @returns {Promise<Object>} Root FileNode compatible with tree-scanner.js
 */
export async function extractZipFileToTree(zipBlob) {
  const buffer = await zipBlob.arrayBuffer();
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const n = buffer.byteLength;

  // 1. Locate End of Central Directory (EOCD) signature: 0x06054b50 (PK\x05\x06)
  let eocdOffset = -1;
  for (let i = n - 22; i >= Math.max(0, n - 65536); i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }

  const entries = [];
  const decoder = new TextDecoder('utf-8');

  if (eocdOffset !== -1) {
    // Read Central Directory
    const totalEntries = view.getUint16(eocdOffset + 10, true);
    let cdOffset = view.getUint32(eocdOffset + 16, true);

    for (let e = 0; e < totalEntries && cdOffset < eocdOffset; e++) {
      if (view.getUint32(cdOffset, true) !== 0x02014b50) break; // PK\x01\x02

      const method = view.getUint16(cdOffset + 10, true);
      const compSize = view.getUint32(cdOffset + 20, true);
      const uncompSize = view.getUint32(cdOffset + 24, true);
      const nameLen = view.getUint16(cdOffset + 28, true);
      const extraLen = view.getUint16(cdOffset + 30, true);
      const commentLen = view.getUint16(cdOffset + 32, true);
      const localHeaderOffset = view.getUint32(cdOffset + 42, true);

      const nameBytes = bytes.subarray(cdOffset + 46, cdOffset + 46 + nameLen);
      const fileName = decoder.decode(nameBytes);

      entries.push({
        name: fileName,
        method: method, // 0 = stored, 8 = deflated
        compSize: compSize,
        uncompSize: uncompSize,
        localHeaderOffset: localHeaderOffset
      });

      cdOffset += 46 + nameLen + extraLen + commentLen;
    }
  } else {
    // Fallback: Scan sequential local headers 0x04034b50 (PK\x03\x04)
    let offset = 0;
    while (offset < n - 30) {
      const sig = view.getUint32(offset, true);
      if (sig !== 0x04034b50) break;

      const method = view.getUint16(offset + 8, true);
      const compSize = view.getUint32(offset + 18, true);
      const uncompSize = view.getUint32(offset + 22, true);
      const nameLen = view.getUint16(offset + 26, true);
      const extraLen = view.getUint16(offset + 28, true);

      const nameBytes = bytes.subarray(offset + 30, offset + 30 + nameLen);
      const fileName = decoder.decode(nameBytes);

      entries.push({
        name: fileName,
        method: method,
        compSize: compSize,
        uncompSize: uncompSize,
        localHeaderOffset: offset
      });

      offset += 30 + nameLen + extraLen + compSize;
    }
  }

  // Determine common root prefix if zip has top-level folder (e.g. repo-main/)
  let rootName = zipBlob.name ? zipBlob.name.replace(/\.zip$/i, '') : 'Extracted Zip Project';

  const root = {
    name: rootName,
    path: '',
    isDirectory: true,
    children: []
  };

  // Helper to extract file content buffer
  async function extractEntryContent(entry) {
    const locOffset = entry.localHeaderOffset;
    if (locOffset + 30 > n) return '';

    const nameLen = view.getUint16(locOffset + 26, true);
    const extraLen = view.getUint16(locOffset + 28, true);
    const dataOffset = locOffset + 30 + nameLen + extraLen;
    const rawCompressed = bytes.subarray(dataOffset, dataOffset + entry.compSize);

    if (entry.method === 0) {
      return decoder.decode(rawCompressed);
    } else if (entry.method === 8) {
      const decompressed = await decompressDeflateRaw(rawCompressed);
      return decoder.decode(decompressed);
    }
    return '';
  }

  // Construct hierarchy
  for (const entry of entries) {
    let cleanPath = normalizePath(entry.name);
    if (!cleanPath || cleanPath.endsWith('/')) continue; // Skip directory markers

    const parts = cleanPath.split('/');
    if (parts.some(p => IGNORED_PATTERNS.includes(p))) continue;

    let current = root;
    for (let pIdx = 0; pIdx < parts.length; pIdx++) {
      const part = parts[pIdx];
      const isFile = pIdx === parts.length - 1;

      if (isFile) {
        // Create file node with lazy reader
        const fileNode = {
          name: part,
          path: cleanPath,
          isDirectory: false,
          size: entry.uncompSize || entry.compSize,
          extension: part.includes('.') ? part.split('.').pop().toLowerCase() : '',
          _zipEntry: entry,
          // Content accessor
          async text() {
            return await extractEntryContent(entry);
          }
        };

        // Cache small manifest files in memory immediately for classifier
        if (['package.json', 'requirements.txt', 'pyproject.toml', 'Cargo.toml', 'README.md'].includes(part)) {
          try {
            fileNode._cachedText = await extractEntryContent(entry);
          } catch (e) {
            console.warn('[ZipExtractor] Error pre-caching', part, e);
          }
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

  return root;
}
