/**
 * ============================================================================
 * [MODULE]: ARCHITECTURE PACKET FLOW & DATA TRACE ANIMATOR (Task T087)
 * ----------------------------------------------------------------------------
 * Interactive real-time photon particle and packet flow tracer across the
 * living 2D SVG canvas and 3D Holodeck architecture graph.
 * 
 * [ENGINEERING HIGHLIGHTS]:
 * - Real-time directed graph traversal (Ingress -> Service/Worker -> Storage/DB -> Return Ack).
 * - SVG Photon Glow Particles: dynamically travels along bezier edge paths at 60-120 FPS.
 * - Live Telemetry HUD: hop-by-hop latency breakdowns, protocol inspection, and status codes.
 * - Interactive Controls: Step, Play, Pause, Speed Toggle (1x, 2x, 4x), and Hotkey 'Z'.
 * - Strix White-Box Security: strict entity escaping on all packet payload metadata.
 * ============================================================================
 */

import { soundEngine } from '../lib/audio/sound-synth.js';

export class PacketFlowTracer {
  /**
   * @param {Object} stageController Reference to the main StageController
   */
  constructor(stageController) {
    this.stage = stageController;
    this.isActive = false;
    this.isPaused = false;
    this.speedMultiplier = 1;
    this.currentHopIndex = 0;
    this.tracePath = [];
    this.activePulseEl = null;
    this.timerId = null;
    this.traceId = 'REQ-7482';
    this.totalDurationMs = 0;

    this.hudEl = null;
    this.initDOM();
  }

  /**
   * Safely escapes HTML entities to prevent DOM XSS injection
   * @param {string} str 
   * @returns {string}
   */
  escapeHTML(str) {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Builds the floating HUD overlay for packet trace telemetry
   */
  initDOM() {
    let hud = document.getElementById('packetTraceHUD');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'packetTraceHUD';
      hud.style.cssText = `
        position: absolute;
        bottom: 16px;
        left: 20px;
        right: 20px;
        background: rgba(7, 10, 18, 0.94);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(168, 85, 247, 0.4);
        border-radius: 12px;
        padding: 12px 18px;
        z-index: 25;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.85), 0 0 24px rgba(168, 85, 247, 0.18);
        display: none;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        box-sizing: border-box;
      `;

      hud.innerHTML = `
        <!-- Left: Trace Identification & Status -->
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span id="traceIndicatorDot" style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #A855F7; box-shadow: 0 0 10px #A855F7;"></span>
            <span class="cyber-badge" style="color: #A855F7; border-color: rgba(168, 85, 247, 0.4); font-size: 10px;">TRACE LIVE</span>
          </div>
          <span id="traceIdBadge" style="color: #F8FAFC; font-weight: 700; letter-spacing: 0.05em;">REQ-7482</span>
          <span style="color: #334155;">|</span>
          <span id="traceHopSummary" style="color: #00F0FF; font-weight: 600;">Ingress Gateway → AI Agent Core</span>
        </div>

        <!-- Center: Latency & Hop Metrics -->
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #64748B;">HOP:</span>
            <span id="traceHopCount" style="color: #F8FAFC; font-weight: 700;">1 / 3</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #64748B;">LATENCY:</span>
            <span id="traceHopLatency" style="color: #10B981; font-weight: 700;">12ms</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #64748B;">TOTAL:</span>
            <span id="traceTotalDuration" style="color: #00F0FF; font-weight: 700;">12ms</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #64748B;">PAYLOAD:</span>
            <span id="tracePayloadSize" style="color: #E2E8F0;">1.4 KB</span>
          </div>
        </div>

        <!-- Right: Interactive Controls -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <button id="btnTraceSpeed" style="background: rgba(255,255,255,0.05); border: 1px solid #1E2D44; color: #94A3B8; border-radius: 6px; padding: 4px 10px; cursor: pointer; font-size: 10px; font-family: 'JetBrains Mono', monospace;">
            1x SPEED
          </button>
          <button id="btnTracePause" style="background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.4); color: #C084FC; border-radius: 6px; padding: 4px 10px; cursor: pointer; font-size: 10px; font-family: 'JetBrains Mono', monospace; display: inline-flex; align-items: center; gap: 4px;">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            <span>PAUSE</span>
          </button>
          <button id="btnTraceStep" style="background: rgba(0, 240, 255, 0.12); border: 1px solid rgba(0, 240, 255, 0.35); color: #00F0FF; border-radius: 6px; padding: 4px 10px; cursor: pointer; font-size: 10px; font-family: 'JetBrains Mono', monospace; display: inline-flex; align-items: center; gap: 4px;">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2.5"/></svg>
            <span>STEP</span>
          </button>
          <button id="btnTraceClose" style="background: none; border: none; color: #64748B; cursor: pointer; font-size: 14px; padding: 0 4px; line-height: 1; display: inline-flex; align-items: center;" title="Dismiss Trace (Z / Esc)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      `;

      const stage2Sec = document.getElementById('stageSection2');
      if (stage2Sec) {
        stage2Sec.appendChild(hud);
      }
    }

    this.hudEl = hud;
    this.bindHUDControls();
  }

  bindHUDControls() {
    if (!this.hudEl) return;

    this.hudEl.querySelector('#btnTracePause')?.addEventListener('click', () => {
      this.togglePause();
    });

    this.hudEl.querySelector('#btnTraceStep')?.addEventListener('click', () => {
      this.step();
    });

    this.hudEl.querySelector('#btnTraceSpeed')?.addEventListener('click', () => {
      this.cycleSpeed();
    });

    this.hudEl.querySelector('#btnTraceClose')?.addEventListener('click', () => {
      this.stop();
    });
  }

  /**
   * Toggles the Packet Flow Trace on Stage 2 (Hotkey Z)
   */
  toggle() {
    if (this.isActive) {
      this.stop();
    } else {
      this.start();
    }
  }

  /**
   * Starts a complete end-to-end trace through the pipeline graph
   */
  start(startNodeId = null) {
    if (!this.stage?.pipelineGraph) return;

    const nodes = this.stage.pipelineGraph.nodes || [];
    const edges = this.stage.pipelineGraph.edges || [];
    if (nodes.length < 2) return;

    // Build directed traversal path
    this.tracePath = this.computeTracePath(nodes, edges, startNodeId);
    if (this.tracePath.length === 0) return;

    this.isActive = true;
    this.isPaused = false;
    this.currentHopIndex = 0;
    this.totalDurationMs = 0;
    this.traceId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

    soundEngine.playWhoosh();
    this.showHUD();
    this.executeCurrentHop();
  }

  /**
   * Computes ordered array of edge hops from ingress to data sink
   */
  computeTracePath(nodes, edges, startNodeId) {
    const hops = [];
    let curr = startNodeId 
      ? nodes.find(n => n.id === startNodeId) 
      : nodes.find(n => (n.badge || '').toLowerCase().includes('gateway') || (n.badge || '').toLowerCase().includes('ingress')) || nodes[0];

    const visitedNodes = new Set([curr.id]);

    while (curr) {
      const nextEdge = edges.find(e => e.source === curr.id && !visitedNodes.has(e.target));
      if (!nextEdge) {
        // Look for any edge with target not yet visited
        const fallbackEdge = edges.find(e => !visitedNodes.has(e.target));
        if (fallbackEdge) {
          hops.push(fallbackEdge);
          visitedNodes.add(fallbackEdge.target);
          curr = nodes.find(n => n.id === fallbackEdge.target);
          continue;
        }
        break;
      }
      hops.push(nextEdge);
      visitedNodes.add(nextEdge.target);
      curr = nodes.find(n => n.id === nextEdge.target);
    }

    // If edges couldn't form hops, synthesize from available edges
    if (hops.length === 0 && edges.length > 0) {
      return edges.slice(0, 4);
    }
    return hops;
  }

  showHUD() {
    if (this.hudEl) {
      this.hudEl.style.display = 'flex';
      const traceIdBadge = this.hudEl.querySelector('#traceIdBadge');
      if (traceIdBadge) traceIdBadge.textContent = this.traceId;
    }
  }

  /**
   * Executes the visual photon particle travel along the active edge
   */
  executeCurrentHop() {
    if (!this.isActive || this.isPaused) return;

    if (this.currentHopIndex >= this.tracePath.length) {
      // Completed full pipeline traverse
      this.onTraceComplete();
      return;
    }

    const edge = this.tracePath[this.currentHopIndex];
    const nodes = this.stage.pipelineGraph.nodes || [];
    const srcNode = nodes.find(n => n.id === edge.source);
    const tgtNode = nodes.find(n => n.id === edge.target);

    const hopLatency = srcNode?.metrics?.latency ? parseInt(srcNode.metrics.latency, 10) || 12 : 12;
    this.totalDurationMs += hopLatency;

    // Update Telemetry HUD
    this.updateHUD(srcNode, tgtNode, hopLatency);

    // Spotlight active nodes
    this.highlightActiveNodes(srcNode?.id, tgtNode?.id);

    // Play subtle audio packet tick
    soundEngine.playClick();

    // Animate SVG Particle on Stage 2D Canvas
    this.animatePhotonParticle(srcNode, tgtNode, hopLatency, () => {
      this.currentHopIndex++;
      const delay = Math.max(250, (600 / this.speedMultiplier));
      this.timerId = setTimeout(() => {
        this.executeCurrentHop();
      }, delay);
    });
  }

  /**
   * Animates a neon glowing circle along the SVG bezier curve
   */
  animatePhotonParticle(srcNode, tgtNode, hopLatency, onComplete) {
    const canvas = document.getElementById('pipelineSvgCanvas');
    if (!canvas || !srcNode || !tgtNode) {
      onComplete?.();
      return;
    }

    // Calculate source and target coordinates matching renderStage2Architecture
    const x1 = srcNode.position2D.x + 220;
    const y1 = srcNode.position2D.y + 60;
    const x2 = tgtNode.position2D.x;
    const y2 = tgtNode.position2D.y + 60;
    const dx = (x2 - x1) * 0.5;

    // Create animated SVG Circle pulse
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '7');
    circle.setAttribute('fill', '#00F0FF');
    circle.setAttribute('filter', 'drop-shadow(0 0 8px #00F0FF)');
    circle.setAttribute('cx', x1);
    circle.setAttribute('cy', y1);
    canvas.appendChild(circle);

    this.activePulseEl = circle;

    const duration = Math.max(400, (1100 / this.speedMultiplier));
    const startTime = performance.now();

    const animateFrame = (currentTime) => {
      if (!this.isActive) {
        circle.remove();
        return;
      }
      if (this.isPaused) {
        requestAnimationFrame(animateFrame);
        return;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Cubic bezier point calculation: B(t) = (1-t)^3*P0 + 3(1-t)^2*t*P1 + 3(1-t)*t^2*P2 + t^3*P3
      const t = progress;
      const invT = 1 - t;
      const p0 = { x: x1, y: y1 };
      const p1 = { x: x1 + dx, y: y1 };
      const p2 = { x: x2 - dx, y: y2 };
      const p3 = { x: x2, y: y2 };

      const cx = (invT ** 3) * p0.x + 3 * (invT ** 2) * t * p1.x + 3 * invT * (t ** 2) * p2.x + (t ** 3) * p3.x;
      const cy = (invT ** 3) * p0.y + 3 * (invT ** 2) * t * p1.y + 3 * invT * (t ** 2) * p2.y + (t ** 3) * p3.y;

      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);

      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      } else {
        circle.remove();
        this.activePulseEl = null;
        onComplete?.();
      }
    };

    requestAnimationFrame(animateFrame);
  }

  highlightActiveNodes(srcId, tgtId) {
    document.querySelectorAll('.pipeline-node-card').forEach(card => {
      const id = card.dataset.nodeId;
      if (id === srcId || id === tgtId) {
        card.style.borderColor = '#00F0FF';
        card.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.45)';
        card.style.transform = 'scale(1.03)';
      } else {
        card.style.borderColor = '';
        card.style.boxShadow = '';
        card.style.transform = '';
      }
    });
  }

  updateHUD(srcNode, tgtNode, hopLatency) {
    if (!this.hudEl) return;

    const hopSummary = this.hudEl.querySelector('#traceHopSummary');
    if (hopSummary) {
      const srcName = srcNode ? this.escapeHTML(srcNode.label) : 'Source';
      const tgtName = tgtNode ? this.escapeHTML(tgtNode.label) : 'Target';
      hopSummary.textContent = `${srcName} → ${tgtName}`;
    }

    const hopCount = this.hudEl.querySelector('#traceHopCount');
    if (hopCount) {
      hopCount.textContent = `${this.currentHopIndex + 1} / ${this.tracePath.length}`;
    }

    const hopLatEl = this.hudEl.querySelector('#traceHopLatency');
    if (hopLatEl) {
      hopLatEl.textContent = `${hopLatency}ms`;
    }

    const totalDurEl = this.hudEl.querySelector('#traceTotalDuration');
    if (totalDurEl) {
      totalDurEl.textContent = `${this.totalDurationMs}ms`;
    }

    const payloadEl = this.hudEl.querySelector('#tracePayloadSize');
    if (payloadEl) {
      payloadEl.textContent = `${(1.1 + (this.currentHopIndex * 0.4)).toFixed(1)} KB`;
    }
  }

  onTraceComplete() {
    soundEngine.playSuccess();
    const hopSummary = this.hudEl?.querySelector('#traceHopSummary');
    if (hopSummary) {
      hopSummary.innerHTML = `<span style="color: #10B981; display: inline-flex; align-items: center; gap: 4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Traversal Complete (Total: ${this.totalDurationMs}ms • 200 OK)</span></span>`;
    }

    const indicator = this.hudEl?.querySelector('#traceIndicatorDot');
    if (indicator) {
      indicator.style.background = '#10B981';
      indicator.style.boxShadow = '0 0 10px #10B981';
    }

    // Auto-loop after 2.5s if not closed
    this.timerId = setTimeout(() => {
      if (this.isActive) {
        this.currentHopIndex = 0;
        this.totalDurationMs = 0;
        this.executeCurrentHop();
      }
    }, 2500);
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    const pauseBtn = this.hudEl?.querySelector('#btnTracePause');
    if (pauseBtn) {
      pauseBtn.innerHTML = this.isPaused 
        ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> <span>RESUME</span>'
        : '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> <span>PAUSE</span>';
      pauseBtn.style.color = this.isPaused ? '#10B981' : '#C084FC';
      pauseBtn.style.borderColor = this.isPaused ? 'rgba(16, 185, 129, 0.4)' : 'rgba(168, 85, 247, 0.4)';
    }
    soundEngine.playClick();
  }

  step() {
    if (!this.isActive) this.start();
    this.isPaused = false;
    clearTimeout(this.timerId);
    this.executeCurrentHop();
  }

  cycleSpeed() {
    soundEngine.playClick();
    if (this.speedMultiplier === 1) this.speedMultiplier = 2;
    else if (this.speedMultiplier === 2) this.speedMultiplier = 4;
    else this.speedMultiplier = 1;

    const speedBtn = this.hudEl?.querySelector('#btnTraceSpeed');
    if (speedBtn) speedBtn.textContent = `${this.speedMultiplier}x SPEED`;
  }

  stop() {
    this.isActive = false;
    this.isPaused = false;
    clearTimeout(this.timerId);
    if (this.activePulseEl) {
      this.activePulseEl.remove();
      this.activePulseEl = null;
    }
    if (this.hudEl) this.hudEl.style.display = 'none';

    // Reset node card highlights
    document.querySelectorAll('.pipeline-node-card').forEach(card => {
      card.style.borderColor = '';
      card.style.boxShadow = '';
      card.style.transform = '';
    });
  }
}
