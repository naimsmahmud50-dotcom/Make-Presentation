/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Live Chaos Engineering & Resilience Simulator
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Keynote demonstration weapon allowing presenters to inject live infrastructure faults
 * into the architecture graph on Stage 2 and 3D Holodeck:
 *   1. Latency Spike (+450ms): Proves asynchronous queue buffering & graceful degradation
 *   2. Node Crash / Pod Kill: Proves circuit breaker tripping and self-healing replica failover
 *   3. Real-time visual rerouting of animated SVG photon edges
 *   4. Transient executive status HUD alerts & auditory feedback
 *
 * [DESIGN SYSTEM] UI/UX PRO MAX INTELLIGENCE:
 *   - Pulse warnings with glowing OLED amber (`#F59E0B`) and rose (`#F43F5E`) borders
 *   - Smooth 4-second auto-recovery cycle proving self-healing resilience on stage
 *   - Zero external infrastructure required; fully simulated in client-side memory
 *
 * [ENGINEERING NOTES]:
 *   - Access via `stageController.chaosSimulator.injectLatency(nodeId)` or `.killNode(nodeId)`
 *   - To trigger on currently selected node, pass `nodeId` from Node Inspector
 * =========================================================================================
 */

import { soundEngine } from '../lib/audio/sound-synth.js';

export class ChaosEngineeringSimulator {
  constructor(stageController) {
    this.stageController = stageController;
    this.activeChaos = new Map(); // nodeId -> { type, timeoutId }
  }

  /**
   * Injects latency spike into a specific node or first available node
   * @param {string} [nodeId]
   */
  injectLatency(nodeId) {
    const targetId = nodeId || this.getDefaultNodeId();
    if (!targetId) return;

    soundEngine.playWarning();
    const nodeEl = document.querySelector(`.pipeline-node-card[data-node-id="${targetId}"]`);
    const nodeData = this.findNodeData(targetId);
    const nodeLabel = nodeData?.label || targetId;

    // Apply latency visual style
    if (nodeEl) {
      nodeEl.classList.add('chaos-latency-spike');
      const badge = nodeEl.querySelector('.cyber-badge');
      if (badge) badge.textContent = '[LAG: 450ms]';
    }

    this.showChaosHUD(`[CHAOS INJECTED] +450ms Latency Spike on [${nodeLabel}]. Testing backpressure...`, 'amber');

    // Auto-recover after 4.5 seconds
    if (this.activeChaos.has(targetId)) {
      clearTimeout(this.activeChaos.get(targetId).timeoutId);
    }

    const timeoutId = setTimeout(() => {
      this.recoverNode(targetId, 'latency');
    }, 4500);

    this.activeChaos.set(targetId, { type: 'latency', timeoutId });
  }

  /**
   * Simulates sudden node crash / pod termination and circuit breaker failover
   * @param {string} [nodeId]
   */
  killNode(nodeId) {
    const targetId = nodeId || this.getDefaultNodeId();
    if (!targetId) return;

    soundEngine.playWarning();
    const nodeEl = document.querySelector(`.pipeline-node-card[data-node-id="${targetId}"]`);
    const nodeData = this.findNodeData(targetId);
    const nodeLabel = nodeData?.label || targetId;

    if (nodeEl) {
      nodeEl.classList.add('chaos-node-killed');
      const badge = nodeEl.querySelector('.cyber-badge');
      if (badge) badge.textContent = '[DEGRADED: 0/3]';
    }

    this.showChaosHUD(`[FAULT INJECTED] [${nodeLabel}] Crashed! Circuit Breaker TRIPPED → Traffic rerouted to replica.`, 'rose');

    if (this.activeChaos.has(targetId)) {
      clearTimeout(this.activeChaos.get(targetId).timeoutId);
    }

    const timeoutId = setTimeout(() => {
      this.recoverNode(targetId, 'crash');
    }, 4500);

    this.activeChaos.set(targetId, { type: 'crash', timeoutId });
  }

  recoverNode(nodeId, faultType) {
    const nodeEl = document.querySelector(`.pipeline-node-card[data-node-id="${nodeId}"]`);
    const nodeData = this.findNodeData(nodeId);
    const nodeLabel = nodeData?.label || nodeId;

    if (nodeEl) {
      nodeEl.classList.remove('chaos-latency-spike', 'chaos-node-killed');
      const badge = nodeEl.querySelector('.cyber-badge');
      if (badge && nodeData) {
        badge.textContent = nodeData.badge || 'LIVE';
      }
    }

    this.activeChaos.delete(nodeId);
    soundEngine.playSuccess();

    if (faultType === 'latency') {
      this.showChaosHUD(`[RESILIENCE VERIFIED] Adaptive backpressure stabilized. [${nodeLabel}] p99 returned to 8ms.`, 'emerald');
    } else {
      this.showChaosHUD(`[SELF-HEALING VERIFIED] Kubernetes restarted [${nodeLabel}] pods (3/3). Circuit Breaker CLOSED.`, 'emerald');
    }
  }

  resetAll() {
    this.activeChaos.forEach((val, id) => {
      clearTimeout(val.timeoutId);
      this.recoverNode(id, val.type);
    });
    this.activeChaos.clear();
  }

  showChaosHUD(message, tone = 'amber') {
    let alertEl = document.getElementById('chaosStatusAlert');
    if (!alertEl) {
      alertEl = document.createElement('div');
      alertEl.id = 'chaosStatusAlert';
      alertEl.style.position = 'fixed';
      alertEl.style.bottom = '80px';
      alertEl.style.left = '50%';
      alertEl.style.transform = 'translateX(-50%)';
      alertEl.style.padding = '10px 20px';
      alertEl.style.borderRadius = '8px';
      alertEl.style.fontSize = '12px';
      alertEl.style.fontFamily = 'var(--font-mono)';
      alertEl.style.fontWeight = '600';
      alertEl.style.zIndex = '9997';
      alertEl.style.backdropFilter = 'blur(16px)';
      alertEl.style.transition = 'all 0.3s ease';
      alertEl.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
      document.body.appendChild(alertEl);
    }

    if (tone === 'rose') {
      alertEl.style.background = 'rgba(244, 63, 94, 0.16)';
      alertEl.style.border = '1px solid #F43F5E';
      alertEl.style.color = '#FDA4AF';
    } else if (tone === 'emerald') {
      alertEl.style.background = 'rgba(16, 185, 129, 0.16)';
      alertEl.style.border = '1px solid #10B981';
      alertEl.style.color = '#6EE7B7';
    } else {
      alertEl.style.background = 'rgba(245, 158, 11, 0.16)';
      alertEl.style.border = '1px solid #F59E0B';
      alertEl.style.color = '#FCD34D';
    }

    alertEl.textContent = message;
    alertEl.style.display = 'block';
    alertEl.style.opacity = '1';

    setTimeout(() => {
      alertEl.style.opacity = '0';
      setTimeout(() => { alertEl.style.display = 'none'; }, 300);
    }, 4200);
  }

  getDefaultNodeId() {
    const nodes = this.stageController?.pipelineGraph?.nodes;
    if (nodes && nodes.length > 0) {
      // Pick second node (typically worker or queue) or first
      return nodes[1]?.id || nodes[0]?.id;
    }
    return null;
  }

  findNodeData(nodeId) {
    const nodes = this.stageController?.pipelineGraph?.nodes;
    return nodes?.find(n => n.id === nodeId);
  }
}
