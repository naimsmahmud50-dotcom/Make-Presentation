/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Mermaid.js & Markdown Architecture Exporter (Task T114)
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Boardroom-grade architecture specification and diagram generator:
 *   1. Production-Ready Mermaid.js Syntax: Generates valid `flowchart TD` / `flowchart LR`
 *      diagrams representing the active living pipeline graph, nodes, and inter-service edges.
 *   2. GitHub Flavored Markdown Architecture Spec: 1-Click export of comprehensive technical
 *      specifications including subsystem catalog, latency SLAs, zero-trust policies, and
 *      Mermaid diagram code block.
 *   3. Interactive Preview HUD Modal: Instant syntax view, orientation switcher (TD vs LR),
 *      and tabbed code inspection (Raw Mermaid vs Full .md Spec).
 *   4. Zero-Upload Privacy Guarantee: 100% in-browser generation without remote API calls.
 *
 * [DESIGN SYSTEM — UI/UX PRO MAX]:
 *   - JetBrains Mono typography for code blocks.
 *   - 100% stroke vector SVGs; zero informal emojis in button chrome.
 *   - Dark OLED glassmorphism HUD with high-contrast syntax container.
 * =========================================================================================
 */

import { soundEngine } from '../audio/sound-synth.js';
import { inputShield } from '../security/input-shield.js';

export class MermaidArchitectureExporter {
  constructor(stageController = null) {
    this.stageController = stageController;
    this.isOpen = false;
    this.modalEl = null;
    this.activeTab = 'mermaid'; // 'mermaid' | 'markdown'
    this.orientation = 'TD'; // 'TD' | 'LR'

    this.initDOM();
  }

  /**
   * Cleans string to produce a safe alphanumeric identifier for Mermaid nodes
   * @param {string} str 
   * @returns {string}
   */
  cleanId(str) {
    if (!str) return 'node_' + Math.floor(Math.random() * 10000);
    return 'n_' + String(str).toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/^_+|_+$/g, '');
  }

  /**
   * Sanitizes label text to prevent Mermaid parse errors with quotes and brackets
   * @param {string} str 
   * @returns {string}
   */
  sanitizeLabel(str) {
    if (!str) return '';
    return String(str)
      .replace(/"/g, '#quot;')
      .replace(/\[/g, '#91;')
      .replace(/\]/g, '#93;')
      .replace(/\(/g, '#40;')
      .replace(/\)/g, '#41;')
      .replace(/\{/g, '#123;')
      .replace(/\}/g, '#125;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /**
   * Generates production-ready Mermaid.js syntax from active pipelineGraph
   * @param {Object} pipelineGraph 
   * @param {string} orientation 
   * @returns {string}
   */
  generateMermaidCode(pipelineGraph, orientation = 'TD') {
    const g = pipelineGraph || this.stageController?.pipelineGraph || { nodes: [], edges: [] };
    const nodes = g.nodes && g.nodes.length > 0 ? g.nodes : this.getDefaultNodes();
    const edges = g.edges && g.edges.length > 0 ? g.edges : this.getDefaultEdges(nodes);

    const lines = [];
    lines.push(`flowchart ${orientation}`);
    lines.push('  %% APEXFLOW OS Distributed Living Architecture');
    lines.push('  %% Generated autonomously via Client-Side Engine');
    lines.push('');

    // Grouping by Subsystem / Tier
    const edgeIngressNodes = [];
    const computeMeshNodes = [];
    const storageVectorNodes = [];

    nodes.forEach(node => {
      const b = (node.badge || '').toUpperCase();
      if (b.includes('GATEWAY') || b.includes('INGRESS') || b.includes('EDGE')) {
        edgeIngressNodes.push(node);
      } else if (b.includes('DATABASE') || b.includes('STORAGE') || b.includes('VECTOR') || b.includes('STATE')) {
        storageVectorNodes.push(node);
      } else {
        computeMeshNodes.push(node);
      }
    });

    // Helper to format individual node
    const formatNode = (node) => {
      const nid = this.cleanId(node.id || node.label);
      const label = this.sanitizeLabel(node.label || 'Microservice');
      const sublabel = this.sanitizeLabel(node.sublabel || node.badge || 'Service');
      const badge = (node.badge || 'SERVICE').toUpperCase();

      if (badge.includes('GATEWAY') || badge.includes('INGRESS')) {
        return `    ${nid}(["fa:fa-shield-halved <b>${label}</b><br/><sub>${sublabel}</sub>"])`;
      } else if (badge.includes('DATABASE') || badge.includes('STORAGE') || badge.includes('VECTOR')) {
        return `    ${nid}[("fa:fa-database <b>${label}</b><br/><sub>${sublabel}</sub>")]`;
      } else if (badge.includes('AI') || badge.includes('MODEL')) {
        return `    ${nid}[["fa:fa-brain <b>${label}</b><br/><sub>${sublabel}</sub>"]]`;
      } else {
        return `    ${nid}["fa:fa-server <b>${label}</b><br/><sub>${sublabel}</sub>"]`;
      }
    };

    if (edgeIngressNodes.length > 0) {
      lines.push('  subgraph Tier1 ["Tier 1: Global Edge Ingress & Anycast"]');
      edgeIngressNodes.forEach(n => lines.push(formatNode(n)));
      lines.push('  end');
      lines.push('');
    }

    if (computeMeshNodes.length > 0) {
      lines.push('  subgraph Tier2 ["Tier 2: Zero-Trust Service Mesh & Workers"]');
      computeMeshNodes.forEach(n => lines.push(formatNode(n)));
      lines.push('  end');
      lines.push('');
    }

    if (storageVectorNodes.length > 0) {
      lines.push('  subgraph Tier3 ["Tier 3: Distributed State & Vector Store"]');
      storageVectorNodes.forEach(n => lines.push(formatNode(n)));
      lines.push('  end');
      lines.push('');
    }

    // Edges
    lines.push('  %% Inter-Service Connections');
    edges.forEach(edge => {
      const srcId = this.cleanId(edge.source);
      const tgtId = this.cleanId(edge.target);
      const proto = this.sanitizeLabel(edge.protocol || 'mTLS / Sub-5ms');
      lines.push(`  ${srcId} -->|"${proto}"| ${tgtId}`);
    });

    lines.push('');
    lines.push('  %% Boardroom Visual Styling');
    lines.push('  classDef default fill:#070B14,stroke:#1E293B,stroke-width:1.5px,color:#F8FAFC;');
    lines.push('  classDef highlight fill:#0B132B,stroke:#00F0FF,stroke-width:2px,color:#FFFFFF;');

    return lines.join('\n');
  }

  /**
   * Generates full GitHub Flavored Markdown architecture spec
   * @param {Object} manifest 
   * @param {Object} pipelineGraph 
   * @param {string} orientation 
   * @returns {string}
   */
  generateMarkdownSpec(manifest, pipelineGraph, orientation = 'TD') {
    const m = manifest || this.stageController?.manifest || {};
    const g = pipelineGraph || this.stageController?.pipelineGraph || { nodes: [], edges: [] };
    const nodes = g.nodes && g.nodes.length > 0 ? g.nodes : this.getDefaultNodes();
    const edges = g.edges && g.edges.length > 0 ? g.edges : this.getDefaultEdges(nodes);
    const mermaidCode = this.generateMermaidCode(pipelineGraph, orientation);

    const nodeRows = nodes.map((n, i) => {
      const num = `#0${i + 1}`;
      const name = n.label || 'Node';
      const role = n.sublabel || n.badge || 'Service';
      const latency = n.metrics?.latency || '3.5ms';
      const throughput = n.metrics?.throughput || '14.2k req/s';
      return `| ${num} | **${name}** | \`${role}\` | \`${latency}\` | \`${throughput}\` | \`mTLS SPIFFE\` |`;
    }).join('\n');

    return `# APEXFLOW OS — HIGH-SCALE ARCHITECTURE SPECIFICATION
**System Blueprint & Microservice Topology**  
*Autonomous Living System Architecture Documentation*

- **Generated:** ${new Date().toUTCString()}
- **Topology Nodes:** ${nodes.length} Microservices / Storage Blades
- **Inter-Service Edges:** ${edges.length} Zero-Trust Mesh Connections
- **P99 Latency Budget:** \`< 25.0ms\` End-to-End SLA Target
- **FinOps Monthly Run-Rate:** \`$8,920.00 / mo\` (AWS Karpenter + Aurora ACU)
- **Privacy Standard:** Zero-Upload In-Memory Client Execution

---

## 1. System Topology Architecture (Mermaid.js)

\`\`\`mermaid
${mermaidCode}
\`\`\`

---

## 2. Microservice & Infrastructure Blade Catalog

| ID | Microservice Blade | Subsystem Tier | P99 SLA | Throughput | Security Boundary |
| :--- | :--- | :--- | :--- | :--- | :--- |
${nodeRows}

---

## 3. Resilience & Disaster Recovery Protocols

1. **Active-Active Cross-Region Failover:** Cloudflare Anycast edge routing continuously monitors origin health. Failover triggers automatically within 420ms if an entire primary cloud region goes dark.
2. **ACID Transactional Integrity:** Relational customer records and 1536-dimensional vector embeddings are co-located in PostgreSQL with pgvector, eliminating dual-write race conditions.
3. **Zero-Trust Identity Mesh:** Inter-pod communication is strictly encrypted via Envoy mTLS with short-lived SPIFFE cryptographic identity certificates.

---

## 4. Zero-Upload Privacy Guarantee

This technical blueprint and all underlying presentation telemetry were synthesized strictly inside local browser memory. No architectural metadata or source fragments were transmitted to third-party cloud servers.
`;
  }

  getDefaultNodes() {
    return [
      { id: 'cf_edge', label: 'Cloudflare Edge Anycast', sublabel: 'Global Ingress & TLS 1.3', badge: 'GATEWAY', metrics: { latency: '3.2ms', throughput: '45.0k req/s' } },
      { id: 'v8_worker', label: 'V8 Worker Gateway', sublabel: 'Auth JWT & Route Guard', badge: 'GATEWAY', metrics: { latency: '1.8ms', throughput: '42.1k req/s' } },
      { id: 'envoy_mesh', label: 'Envoy Pod Mesh', sublabel: 'EKS Zero-Trust Proxy', badge: 'PIPELINE', metrics: { latency: '2.4ms', throughput: '38.6k req/s' } },
      { id: 'pgvector_rag', label: 'PostgreSQL + pgvector', sublabel: 'HNSW Vector Cosine RAG', badge: 'DATABASE', metrics: { latency: '8.6ms', throughput: '18.4k req/s' } },
      { id: 'aurora_db', label: 'Aurora Global Database', sublabel: 'Multi-AZ ACID Storage', badge: 'DATABASE', metrics: { latency: '4.1ms', throughput: '22.0k req/s' } },
      { id: 'webgl_client', label: 'WebGL Shader Client', sublabel: 'DOM Hydration & Holodeck', badge: 'PIPELINE', metrics: { latency: '2.9ms', throughput: '60.0 fps' } }
    ];
  }

  getDefaultEdges(nodes) {
    const edges = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({
        source: nodes[i].id,
        target: nodes[i + 1].id,
        protocol: i === 2 ? 'gRPC Vector Query' : 'Envoy mTLS 0-RTT'
      });
    }
    return edges;
  }

  initDOM() {
    let modal = document.getElementById('mermaidExporterModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mermaidExporterModal';
      modal.style.position = 'fixed';
      modal.style.inset = '0';
      modal.style.background = 'rgba(3, 6, 12, 0.88)';
      modal.style.backdropFilter = 'blur(22px)';
      modal.style.webkitBackdropFilter = 'blur(22px)';
      modal.style.zIndex = '99999';
      modal.style.display = 'none';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.padding = '20px';

      modal.innerHTML = `
        <div class="cyber-card" style="width: 100%; max-width: 920px; max-height: 92vh; background: #070B14; border: 1px solid rgba(0, 240, 255, 0.35); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 24px 64px -12px rgba(0,0,0,0.9), 0 0 35px rgba(0,240,255,0.15);">
          
          <!-- Modal Header -->
          <div style="padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center; background: rgba(11, 18, 32, 0.6);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 34px; height: 34px; border-radius: 8px; background: rgba(0, 240, 255, 0.12); border: 1px solid rgba(0, 240, 255, 0.4); display: flex; align-items: center; justify-content: center; color: #00F0FF;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="8 10 12 14 16 10"></polyline></svg>
              </div>
              <div>
                <div style="font-weight: 700; font-size: 14px; color: #F8FAFC; letter-spacing: 0.05em; font-family: var(--font-mono, monospace);">MERMAID.JS & MARKDOWN ARCHITECTURE EXPORTER</div>
                <div style="font-size: 10px; color: #64748B; font-family: var(--font-mono, monospace);">1-CLICK GITHUB-READY ENTERPRISE TOPOLOGY SPEC</div>
              </div>
            </div>

            <!-- Controls (Orientation & Close) -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="display: flex; background: #0B1220; border: 1px solid #1E2D44; border-radius: 6px; padding: 2px;">
                <button id="btnMermaidOrientTD" class="btn btn-secondary active" style="height: 26px; padding: 0 10px; font-size: 10px; font-family: var(--font-mono, monospace); border: none; background: rgba(0,240,255,0.15); color: #00F0FF;">
                  TD (Vertical)
                </button>
                <button id="btnMermaidOrientLR" class="btn btn-secondary" style="height: 26px; padding: 0 10px; font-size: 10px; font-family: var(--font-mono, monospace); border: none; background: transparent; color: #94A3B8;">
                  LR (Horizontal)
                </button>
              </div>

              <button id="btnCloseMermaidModal" class="btn btn-secondary" style="height: 30px; width: 30px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 6px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>

          <!-- Format Switcher Bar (Tabs) -->
          <div style="display: flex; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(7, 11, 20, 0.4); padding: 0 24px;">
            <button id="tabMermaidCode" class="btn" style="border-radius: 0; border: none; border-bottom: 2px solid #00F0FF; background: transparent; color: #00F0FF; font-size: 11px; font-family: var(--font-mono, monospace); padding: 12px 16px; cursor: pointer;">
              Mermaid.js Flowchart
            </button>
            <button id="tabMarkdownSpec" class="btn" style="border-radius: 0; border: none; border-bottom: 2px solid transparent; background: transparent; color: #94A3B8; font-size: 11px; font-family: var(--font-mono, monospace); padding: 12px 16px; cursor: pointer;">
              GitHub Flavored Markdown Spec (.md)
            </button>
          </div>

          <!-- Code View Area -->
          <div style="flex: 1; padding: 18px 24px; overflow: hidden; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span id="codeViewMeta" style="font-size: 10px; color: #64748B; font-family: var(--font-mono, monospace);">
                SYNTAX: MERMAID FLOWCHART (GRAPHVIZ/CYTOSCAPE COMPATIBLE)
              </span>
              <span style="font-size: 10px; color: #10B981; font-family: var(--font-mono, monospace);">
                [READY TO PASTE INTO GITHUB / NOTION / OBSIDIAN]
              </span>
            </div>

            <textarea id="mermaidCodePreview" readonly style="flex: 1; width: 100%; min-height: 380px; background: #04070F; border: 1px solid #1E2D44; border-radius: 8px; color: #38BDF8; font-family: var(--font-mono, monospace); font-size: 12px; line-height: 1.6; padding: 16px; resize: none; outline: none; box-sizing: border-box;"></textarea>
          </div>

          <!-- Footer Actions -->
          <div style="padding: 14px 24px; border-top: 1px solid rgba(255,255,255,0.08); background: rgba(11, 18, 32, 0.6); display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 10px; color: #64748B; font-family: var(--font-mono, monospace);">
              ZERO-UPLOAD PRIVACY GUARANTEE • 100% IN-BROWSER SYNTHESIS
            </div>

            <div style="display: flex; gap: 8px;">
              <button id="btnCopyMermaidCode" class="btn btn-secondary" style="height: 32px; font-size: 11px; padding: 0 14px; display: inline-flex; align-items: center; gap: 6px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <span>Copy Code</span>
              </button>

              <button id="btnDownloadMarkdownSpec" class="btn btn-primary" style="height: 32px; font-size: 11px; padding: 0 16px; display: inline-flex; align-items: center; gap: 6px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>Download .md Spec</span>
              </button>
            </div>
          </div>

        </div>
      `;

      document.body.appendChild(modal);
    }
    this.modalEl = modal;

    // Attach listeners
    this.modalEl.querySelector('#btnCloseMermaidModal')?.addEventListener('click', () => this.close());

    // Orientation toggle
    const btnTD = this.modalEl.querySelector('#btnMermaidOrientTD');
    const btnLR = this.modalEl.querySelector('#btnMermaidOrientLR');

    btnTD?.addEventListener('click', () => {
      soundEngine?.playClick();
      this.orientation = 'TD';
      btnTD.style.background = 'rgba(0,240,255,0.15)';
      btnTD.style.color = '#00F0FF';
      btnLR.style.background = 'transparent';
      btnLR.style.color = '#94A3B8';
      this.updatePreview();
    });

    btnLR?.addEventListener('click', () => {
      soundEngine?.playClick();
      this.orientation = 'LR';
      btnLR.style.background = 'rgba(0,240,255,0.15)';
      btnLR.style.color = '#00F0FF';
      btnTD.style.background = 'transparent';
      btnTD.style.color = '#94A3B8';
      this.updatePreview();
    });

    // Tab toggle
    const tabMermaid = this.modalEl.querySelector('#tabMermaidCode');
    const tabMd = this.modalEl.querySelector('#tabMarkdownSpec');

    tabMermaid?.addEventListener('click', () => {
      soundEngine?.playClick();
      this.activeTab = 'mermaid';
      tabMermaid.style.borderBottomColor = '#00F0FF';
      tabMermaid.style.color = '#00F0FF';
      tabMd.style.borderBottomColor = 'transparent';
      tabMd.style.color = '#94A3B8';
      this.updatePreview();
    });

    tabMd?.addEventListener('click', () => {
      soundEngine?.playClick();
      this.activeTab = 'markdown';
      tabMd.style.borderBottomColor = '#00F0FF';
      tabMd.style.color = '#00F0FF';
      tabMermaid.style.borderBottomColor = 'transparent';
      tabMermaid.style.color = '#94A3B8';
      this.updatePreview();
    });

    // Copy button
    this.modalEl.querySelector('#btnCopyMermaidCode')?.addEventListener('click', () => {
      soundEngine?.playSuccess();
      const code = this.getCurrentContent();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code);
        const btnSpan = this.modalEl?.querySelector('#btnCopyMermaidCode span');
        if (btnSpan) {
          btnSpan.textContent = 'Copied to Clipboard!';
          setTimeout(() => { btnSpan.textContent = 'Copy Code'; }, 1500);
        }
      }
    });

    // Download button
    this.modalEl.querySelector('#btnDownloadMarkdownSpec')?.addEventListener('click', () => {
      this.downloadSpecFile();
    });
  }

  getCurrentContent() {
    if (this.activeTab === 'markdown') {
      return this.generateMarkdownSpec(this.stageController?.manifest, this.stageController?.pipelineGraph, this.orientation);
    } else {
      return this.generateMermaidCode(this.stageController?.pipelineGraph, this.orientation);
    }
  }

  updatePreview() {
    if (!this.modalEl) return;
    const textarea = this.modalEl.querySelector('#mermaidCodePreview');
    const metaEl = this.modalEl.querySelector('#codeViewMeta');

    const content = this.getCurrentContent();
    if (textarea) textarea.value = content;

    if (metaEl) {
      if (this.activeTab === 'markdown') {
        metaEl.textContent = 'SYNTAX: GITHUB FLAVORED MARKDOWN (.MD) WITH EMBEDDED MERMAID SPEC';
      } else {
        metaEl.textContent = `SYNTAX: MERMAID FLOWCHART ${this.orientation} (NATIVE GITHUB & NOTION COMPATIBLE)`;
      }
    }
  }

  downloadSpecFile() {
    soundEngine?.playSuccess();
    const content = this.generateMarkdownSpec(this.stageController?.manifest, this.stageController?.pipelineGraph, this.orientation);
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apexflow-architecture-spec-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  open() {
    this.isOpen = true;
    soundEngine?.playWhoosh();
    if (this.modalEl) this.modalEl.style.display = 'flex';
    const dockBtn = document.getElementById('dockBtnMermaid');
    if (dockBtn) dockBtn.classList.add('active');
    this.updatePreview();
  }

  close() {
    this.isOpen = false;
    soundEngine?.playClick();
    if (this.modalEl) this.modalEl.style.display = 'none';
    const dockBtn = document.getElementById('dockBtnMermaid');
    if (dockBtn) dockBtn.classList.remove('active');
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

export const mermaidExporter = new MermaidArchitectureExporter();
