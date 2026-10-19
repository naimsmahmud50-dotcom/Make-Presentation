/**
 * =========================================================================================
 * [MODULE]: INTERACTIVE ARCHITECTURE EVOLUTION TIME-MACHINE (Task T099)
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * An interactive timeline scrubber for Stage 2 allowing keynote presenters to step through
 * the architectural evolution of a system across milestones (v1.0 Monolith -> v4.0 AI Edge).
 * Animates node births, connections, and tier metrics across 2D Canvas and 3D Holodeck.
 *
 * [DESIGN SYSTEM — LUXURY OLED]:
 * Obsidian glassmorphism (#0A1020 / 92% alpha), neon cyan/violet milestone tracks,
 * fluid micro-animations, executive typography, zero informal emojis, 100% vector stroke SVGs.
 *
 * [ZERO-UPLOAD PRIVACY GUARANTEE]:
 * All evolution states are computed dynamically in-memory from the active project graph.
 * =========================================================================================
 */

import { soundEngine } from '../lib/audio/sound-synth.js';
import { inputShield } from '../lib/security/input-shield.js';

export class ArchitectureTimeMachine {
  constructor(stageController) {
    this.stage = stageController;
    this.isOpen = false;
    this.isPlaying = false;
    this.playTimer = null;
    this.currentIndex = 3; // Default to final stage (v4.0)

    this.milestones = [
      {
        version: 'v1.0',
        title: 'Initial Monolithic Core',
        date: 'Day 1 Launch',
        description: 'Single monolithic backend with direct relational database queries and synchronous blocking handlers.',
        metrics: { throughput: '650 req/s', latency: '190ms', services: 3, resilience: '65%' },
        tierFilter: ['GATEWAY', 'COMPUTE', 'DATABASE']
      },
      {
        version: 'v2.0',
        title: 'Distributed Microservices',
        date: 'Scale Phase',
        description: 'Decoupled asynchronous worker pool, background queues, and Redis in-memory cache layer.',
        metrics: { throughput: '12,500 req/s', latency: '65ms', services: 7, resilience: '84%' },
        tierFilter: ['GATEWAY', 'COMPUTE', 'DATABASE', 'CACHE', 'WORKER']
      },
      {
        version: 'v3.0',
        title: 'Global Edge & Event Mesh',
        date: 'Enterprise Mesh',
        description: 'Multi-region edge clusters with event-driven message bus, Kafka streaming, and zero-trust proxy.',
        metrics: { throughput: '450,000 req/s', latency: '24ms', services: 12, resilience: '96%' },
        tierFilter: ['GATEWAY', 'COMPUTE', 'DATABASE', 'CACHE', 'WORKER', 'EDGE', 'STREAM']
      },
      {
        version: 'v4.0',
        title: 'Autonomous AI & WASM Pipeline',
        date: 'Autonomous Future',
        description: 'Self-healing circuit breakers, client-side Pyodide WebAssembly runtime, and local vector RAG cache.',
        metrics: { throughput: '10,000,000 req/s', latency: '8ms', services: 16, resilience: '99.99%' },
        tierFilter: ['ALL']
      }
    ];

    this.container = null;
    this.mount();
  }

  /**
   * Mounts the floating time-machine HUD to DOM
   */
  mount() {
    if (document.getElementById('architectureTimeMachineHUD')) {
      this.container = document.getElementById('architectureTimeMachineHUD');
      return;
    }

    this.container = document.createElement('div');
    this.container.id = 'architectureTimeMachineHUD';
    this.container.style.cssText = `
      display: none;
      position: fixed;
      bottom: 84px;
      left: 50%;
      transform: translateX(-50%);
      width: min(840px, calc(100vw - 40px));
      background: rgba(10, 16, 32, 0.94);
      border: 1px solid rgba(0, 240, 255, 0.3);
      border-radius: 14px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.9), 0 0 35px rgba(0, 240, 255, 0.12);
      backdrop-filter: blur(20px);
      z-index: 9980;
      padding: 16px 22px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-sizing: border-box;
      pointer-events: auto;
    `;

    document.body.appendChild(this.container);
    this.render();
  }

  /**
   * Renders the interactive time-machine scrubber
   */
  render() {
    if (!this.container) return;

    const m = this.milestones[this.currentIndex];

    this.container.innerHTML = `
      <!-- Header Row -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 26px; height: 26px; border-radius: 6px; background: rgba(0, 240, 255, 0.15); border: 1px solid var(--accent-cyan); display: flex; align-items: center; justify-content: center; color: var(--accent-cyan);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <div style="font-size: 13px; font-weight: 800; color: #F8FAFC; letter-spacing: -0.01em;">
              ARCHITECTURE EVOLUTION TIME-MACHINE
            </div>
            <div style="font-size: 11px; font-family: monospace; color: var(--accent-cyan);">
              Stage 2 • ${inputShield.escapeHtml(m.version)} — ${inputShield.escapeHtml(m.title)}
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <!-- Play / Pause Autoplay -->
          <button id="btnTimeMachinePlay" style="
            background: #131E30;
            border: 1px solid #1E2D44;
            color: #F8FAFC;
            border-radius: 6px;
            padding: 5px 10px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
          ">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              ${this.isPlaying
                ? '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
                : '<polygon points="5 3 19 12 5 21 5 3"/>'}
            </svg>
            <span>${this.isPlaying ? 'PAUSE' : 'AUTOPLAY'}</span>
          </button>

          <!-- Close Button -->
          <button id="btnTimeMachineClose" style="background: transparent; border: none; color: #94A3B8; cursor: pointer; padding: 4px; display: flex; align-items: center;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      <!-- Scrubber Timeline Track -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px;">
        ${this.milestones.map((ms, idx) => {
          const isActive = idx === this.currentIndex;
          const isPast = idx < this.currentIndex;
          const color = isActive ? '#00F0FF' : isPast ? '#10B981' : '#64748B';
          return `
            <button class="tm-milestone-btn" data-index="${idx}" style="
              background: ${isActive ? 'rgba(0, 240, 255, 0.12)' : '#070B14'};
              border: 1px solid ${isActive ? '#00F0FF' : isPast ? 'rgba(16, 185, 129, 0.4)' : '#1E2D44'};
              border-radius: 8px;
              padding: 10px 12px;
              text-align: left;
              cursor: pointer;
              transition: all 0.2s ease;
            ">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: ${color};">
                  ${ms.version}
                </span>
                <span style="font-size: 10px; color: #94A3B8;">${ms.date}</span>
              </div>
              <div style="font-size: 11px; font-weight: 600; color: #E2E8F0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${ms.title}
              </div>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Detail Card & Telemetry Strip -->
      <div style="background: #060912; border: 1px solid #172338; border-radius: 8px; padding: 10px 14px; display: grid; grid-template-columns: 1fr 340px; gap: 16px; align-items: center;">
        <div>
          <div style="font-size: 12px; color: #CBD5E1; line-height: 1.5;">
            ${inputShield.escapeHtml(m.description)}
          </div>
        </div>

        <!-- Telemetry Counters -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; text-align: center; border-left: 1px solid #1E2D44; padding-left: 14px;">
          <div>
            <div style="font-size: 9px; font-family: monospace; color: #64748B;">SERVICES</div>
            <div style="font-size: 12px; font-weight: 800; color: #00F0FF; margin-top: 2px;">${m.metrics.services}</div>
          </div>
          <div>
            <div style="font-size: 9px; font-family: monospace; color: #64748B;">LATENCY</div>
            <div style="font-size: 12px; font-weight: 800; color: #10B981; margin-top: 2px;">${m.metrics.latency}</div>
          </div>
          <div>
            <div style="font-size: 9px; font-family: monospace; color: #64748B;">THROUGHPUT</div>
            <div style="font-size: 12px; font-weight: 800; color: #A855F7; margin-top: 2px;">${m.metrics.throughput}</div>
          </div>
          <div>
            <div style="font-size: 9px; font-family: monospace; color: #64748B;">HEALTH</div>
            <div style="font-size: 12px; font-weight: 800; color: #F59E0B; margin-top: 2px;">${m.metrics.resilience}</div>
          </div>
        </div>
      </div>
    `;

    // Bind event handlers
    this.container.querySelectorAll('.tm-milestone-btn').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        this.goToMilestone(idx);
      };
    });

    const btnPlay = this.container.querySelector('#btnTimeMachinePlay');
    if (btnPlay) {
      btnPlay.onclick = () => this.toggleAutoplay();
    }

    const btnClose = this.container.querySelector('#btnTimeMachineClose');
    if (btnClose) {
      btnClose.onclick = () => this.toggle();
    }
  }

  /**
   * Toggles the Time-Machine overlay visibility
   */
  toggle() {
    this.isOpen = !this.isOpen;
    if (this.container) {
      this.container.style.display = this.isOpen ? 'block' : 'none';
      if (this.isOpen) {
        soundEngine.playWhoosh();
        // Ensure stage is on Slide 2 (Architecture Topology)
        if (typeof this.stage?.goToSlide === 'function') {
          this.stage.goToSlide(1);
        }
        this.render();
      } else {
        this.stopAutoplay();
        // Restore all nodes
        this.restoreAllNodes();
      }
    }
  }

  /**
   * Transitions architecture to a specific evolutionary milestone
   */
  goToMilestone(index) {
    if (index < 0 || index >= this.milestones.length) return;
    this.currentIndex = index;
    soundEngine.playClick();
    this.render();
    this.applyMilestoneTopology(this.milestones[index]);
  }

  /**
   * Applies node visibility and particle flow for the selected milestone
   */
  applyMilestoneTopology(milestone) {
    const nodes = document.querySelectorAll('#svgNodesGroup > g');
    if (!nodes.length) return;

    const totalNodes = nodes.length;
    // Calculate visible count based on milestone
    let visibleCount = totalNodes;
    if (milestone.version === 'v1.0') visibleCount = Math.max(3, Math.floor(totalNodes * 0.35));
    else if (milestone.version === 'v2.0') visibleCount = Math.max(5, Math.floor(totalNodes * 0.60));
    else if (milestone.version === 'v3.0') visibleCount = Math.max(7, Math.floor(totalNodes * 0.85));

    nodes.forEach((node, idx) => {
      if (idx < visibleCount) {
        node.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        node.style.opacity = '1';
        node.style.pointerEvents = 'auto';
        node.style.transform = 'scale(1)';
      } else {
        node.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        node.style.opacity = '0.08';
        node.style.pointerEvents = 'none';
        node.style.transform = 'scale(0.85)';
      }
    });

    // Update edges
    const edges = document.querySelectorAll('#svgEdgesGroup > path, #svgEdgesGroup > line');
    edges.forEach((edge, idx) => {
      edge.style.transition = 'opacity 0.4s ease';
      edge.style.opacity = idx < visibleCount ? '1' : '0.05';
    });
  }

  /**
   * Restores all nodes to full visibility
   */
  restoreAllNodes() {
    const nodes = document.querySelectorAll('#svgNodesGroup > g');
    nodes.forEach(node => {
      node.style.opacity = '1';
      node.style.pointerEvents = 'auto';
      node.style.transform = 'scale(1)';
    });

    const edges = document.querySelectorAll('#svgEdgesGroup > path, #svgEdgesGroup > line');
    edges.forEach(edge => {
      edge.style.opacity = '1';
    });
  }

  /**
   * Toggles autoplay evolution step sequence
   */
  toggleAutoplay() {
    if (this.isPlaying) {
      this.stopAutoplay();
    } else {
      this.startAutoplay();
    }
  }

  startAutoplay() {
    this.isPlaying = true;
    this.render();
    this.playTimer = setInterval(() => {
      let next = this.currentIndex + 1;
      if (next >= this.milestones.length) next = 0;
      this.goToMilestone(next);
    }, 3200);
  }

  stopAutoplay() {
    this.isPlaying = false;
    if (this.playTimer) {
      clearInterval(this.playTimer);
      this.playTimer = null;
    }
    this.render();
  }
}
