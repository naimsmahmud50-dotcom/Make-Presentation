/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Executive Architecture Node Inspector Drawer
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Slide-over luxury frosted OLED telemetry drawer opened when a presenter or executive
 * clicks any architecture node in Stage 2 (Topology) or source module in Stage 3 (Sandbox).
 * 
 * Provides high-stakes executive intelligence:
 *   1. Real-Time SLI/SLA Health Telemetry (99.99% Availability, p99 Latency, Pod Replicas)
 *   2. Upstream Ingress & Downstream Egress Dependency Flow Topology
 *   3. Live Executable Code Snippet with Syntax Highlighting & 1-Click Clipboard Copy
 *   4. Instant Interactive Test Invocation (Simulated JSON Payload & Latency Response)
 *   5. Integrated Chaos Resilience Injection Hooks (Latency Spike +450ms, Failover Kill)
 *
 * [DESIGN SYSTEM] UI/UX PRO MAX INTELLIGENCE:
 *   - Dark luxury OLED palette (`#070A12`) with frosted glass backdrop blur (24px)
 *   - JetBrains Mono tabular telemetry figures for zero layout shift
 *   - Spring-physics slide-over entrance with escape key dismissal
 *
 * [ENGINEERING NOTES]:
 *   - Initialize with `const inspector = new ExecutiveNodeInspector(stageController);`
 *   - Call `inspector.inspect(node)` with any node object containing { id, label, filePath, details, codeSnippet }
 *   - Hook custom chaos triggers via `stageController.chaosSimulator`
 * =========================================================================================
 */

import { renderHighlightedCode } from '../lib/syntax/code-highlighter.js';
import { soundEngine } from '../lib/audio/sound-synth.js';

export class ExecutiveNodeInspector {
  constructor(stageController) {
    this.stageController = stageController;
    this.currentNode = null;
    this.isOpen = false;
    this.drawerEl = null;

    this.initDOM();
  }

  initDOM() {
    this.drawerEl = document.getElementById('codeDrawer');
    if (!this.drawerEl) return;

    // Attach close button
    const closeBtn = document.getElementById('closeCodeDrawer');
    if (closeBtn) {
      closeBtn.onclick = () => this.close();
    }

    // Attach copy snippet button
    const copyBtn = document.getElementById('btnCopySnippet');
    if (copyBtn) {
      copyBtn.onclick = () => this.copySnippet();
    }

    // Attach test invocation button if present
    const invokeBtn = document.getElementById('btnInspectorInvoke');
    if (invokeBtn) {
      invokeBtn.onclick = () => this.testInvokeNode();
    }

    // Attach chaos buttons if present
    const btnChaosLag = document.getElementById('btnInspectorChaosLag');
    if (btnChaosLag) {
      btnChaosLag.onclick = () => {
        if (this.stageController?.chaosSimulator && this.currentNode) {
          this.stageController.chaosSimulator.injectLatency(this.currentNode.id);
        }
      };
    }

    const btnChaosKill = document.getElementById('btnInspectorChaosKill');
    if (btnChaosKill) {
      btnChaosKill.onclick = () => {
        if (this.stageController?.chaosSimulator && this.currentNode) {
          this.stageController.chaosSimulator.killNode(this.currentNode.id);
        }
      };
    }
  }

  /**
   * Opens and populates the inspector with executive node telemetry
   * @param {Object} node
   */
  inspect(node) {
    if (!node || !this.drawerEl) return;
    this.currentNode = node;
    this.isOpen = true;

    // 1. Header Information
    const titleEl = document.getElementById('drawerNodeTitle');
    const fileEl = document.getElementById('drawerNodeFile');
    const descEl = document.getElementById('drawerNodeDesc');
    const badgeEl = document.getElementById('drawerNodeBadge');

    if (titleEl) titleEl.textContent = node.label || 'Architecture Node';
    if (fileEl) fileEl.textContent = node.filePath || (node.id ? `src/services/${node.id}.py` : 'module.py');
    if (descEl) descEl.textContent = node.details?.description || node.sublabel || 'Core processing blade executing deterministic microservices.';
    if (badgeEl) {
      badgeEl.textContent = node.badge || 'MICROSERVICE';
      badgeEl.style.color = node.color || '#00F0FF';
      badgeEl.style.borderColor = node.color || '#00F0FF';
    }

    // 2. Telemetry Gauges (SLI/SLA)
    const latencyEl = document.getElementById('drawerLatencyGauge');
    const uptimeEl = document.getElementById('drawerUptimeGauge');
    const replicasEl = document.getElementById('drawerReplicasGauge');

    if (latencyEl) latencyEl.textContent = node.metrics?.latency || '8ms p99';
    if (uptimeEl) uptimeEl.textContent = node.metrics?.uptime || '99.995%';
    if (replicasEl) replicasEl.textContent = node.metrics?.replicas || '3 / 3 Active';

    // 3. Upstream & Downstream Dependencies
    this.renderDependencies(node);

    // 4. Presenter Talking Points
    const pointsList = document.getElementById('drawerTalkingPoints');
    if (pointsList) {
      const points = node.details?.talkingPoints || [
        'Zero-downtime rolling upgrades via Kubernetes deployment spec',
        'In-memory hot cache layer guarantees sub-10ms response times',
        'Self-healing circuit breakers automatically isolate upstream network lag'
      ];
      pointsList.innerHTML = points.map(p => `<li>${p}</li>`).join('');
    }

    // 5. Code Snippet
    const codeContainer = document.getElementById('drawerCodeContainer');
    if (codeContainer) {
      const snippet = node.codeSnippet || this.generateDefaultSnippet(node);
      renderHighlightedCode(codeContainer, snippet, 'python');
    }

    // 6. Reset Test Invocation Box
    const responseBox = document.getElementById('inspectorInvokeResponse');
    if (responseBox) {
      responseBox.style.display = 'none';
      responseBox.textContent = '';
    }

    // Open Drawer with smooth slide animation
    this.drawerEl.style.transform = 'translateX(0)';
    soundEngine.playClick();
  }

  renderDependencies(node) {
    const upstreamContainer = document.getElementById('drawerUpstreamNodes');
    const downstreamContainer = document.getElementById('drawerDownstreamNodes');
    if (!upstreamContainer || !downstreamContainer) return;

    const graph = this.stageController?.pipelineGraph;
    const nodes = graph?.nodes || [];
    const edges = graph?.edges || [];

    // Find upstream callers (edges where target === node.id)
    const upstreamEdges = edges.filter(e => e.target === node.id);
    const upstreamNodes = upstreamEdges.map(e => nodes.find(n => n.id === e.source)).filter(Boolean);

    // Find downstream targets (edges where source === node.id)
    const downstreamEdges = edges.filter(e => e.source === node.id);
    const downstreamNodes = downstreamEdges.map(e => nodes.find(n => n.id === e.target)).filter(Boolean);

    upstreamContainer.innerHTML = upstreamNodes.length > 0 
      ? upstreamNodes.map(n => `<span class="cyber-badge" style="font-size: 10px; color: ${n.color || '#00F0FF'}; border-color: ${n.color || '#00F0FF'};">${n.label}</span>`).join(' ')
      : '<span style="font-size: 11px; color: #64748B;">None (Edge Entry Point)</span>';

    downstreamContainer.innerHTML = downstreamNodes.length > 0 
      ? downstreamNodes.map(n => `<span class="cyber-badge" style="font-size: 10px; color: ${n.color || '#10B981'}; border-color: ${n.color || '#10B981'};">${n.label}</span>`).join(' ')
      : '<span style="font-size: 11px; color: #64748B;">None (Terminal Sink)</span>';
  }

  testInvokeNode() {
    soundEngine.playClick();
    const btn = document.getElementById('btnInspectorInvoke');
    const resBox = document.getElementById('inspectorInvokeResponse');
    if (!btn || !resBox) return;

    btn.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-telemetry"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle></svg><span>Executing...</span>`;
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg><span>Test Invoke Node</span>`;
      btn.disabled = false;
      resBox.style.display = 'block';

      const mockPayload = {
        node_id: this.currentNode?.id || 'node_01',
        status: '200_OK',
        execution_time_ms: 6.4,
        timestamp: new Date().toISOString(),
        circuit_breaker: 'CLOSED_HEALTHY',
        output_records: 128
      };

      resBox.textContent = JSON.stringify(mockPayload, null, 2);
      soundEngine.playSuccess();
    }, 450);
  }

  copySnippet() {
    const snippet = this.currentNode?.codeSnippet || '';
    if (snippet) {
      navigator.clipboard.writeText(snippet);
      soundEngine.playClick();
      const copyBtn = document.getElementById('btnCopySnippet');
      if (copyBtn) {
        copyBtn.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span style="color:#10B981;">Copied!</span>`;
        setTimeout(() => {
          copyBtn.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copy Snippet</span>`;
        }, 1800);
      }
    }
  }

  generateDefaultSnippet(node) {
    return `# Service Blade: ${node.label || 'Node'}
import asyncio
from typing import Dict, Any

class ${node.id ? node.id.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() : 'ServiceBlade'}:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.is_healthy = True

    async def execute_task(self, event_payload: Dict[str, Any]) -> Dict[str, Any]:
        """Processes transaction with sub-10ms determinism."""
        await asyncio.sleep(0.008)
        return {
            "status": "PROCESSED",
            "node": "${node.label || 'Node'}",
            "records": len(event_payload.get("items", []))
        }
`;
  }

  close() {
    if (!this.drawerEl) return;
    this.drawerEl.style.transform = 'translateX(100%)';
    this.isOpen = false;
    soundEngine.playClick();
  }
}
