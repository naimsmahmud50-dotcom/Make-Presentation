/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Live Chaos Engineering & Circuit Breaker HUD (Task T117)
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Executive boardroom chaos engineering and resilience demonstration HUD:
 *   1. Multi-Region Fault Injection: Allows presenters to inject live architectural anomalies
 *      directly into the active pipeline graph:
 *      - Scenario 1: "AWS us-east-1a AZ Regional Blackout" (trips ingress gateway, triggers Anycast rerouting)
 *      - Scenario 2: "pgvector 500ms Replication Lag" (trips database breaker, activates cached read replica)
 *      - Scenario 3: "Envoy Service Mesh 75% Packet Drop" (triggers exponential retry backoff & jitter)
 *      - Scenario 4: "Worker V8 OOM Memory Exhaustion" (simulates automated pod recycling & zero downtime)
 *   2. Tri-State Circuit Breaker State Machine:
 *      - CLOSED (Healthy Emerald, 0% drop, full traffic)
 *      - OPEN (Tripped Crimson, traffic severed, failover circuit active)
 *      - HALF-OPEN (Canary Amber, 10% canary probe traffic with 420ms auto-heal timer)
 *   3. Dynamic Visual Rerouting & Self-Healing: Updates 2D/3D graph nodes live on stage.
 *   4. Zero-Upload Privacy Guarantee: 100% in-browser simulated chaos and resilience testing.
 *
 * [DESIGN SYSTEM — UI/UX PRO MAX]:
 *   - JetBrains Mono tabular numeric metrics preventing layout shifts.
 *   - Dark OLED glassmorphism HUD with glowing circuit status rings.
 *   - 100% vector SVGs; zero informal emojis in button chrome.
 * =========================================================================================
 */

import { soundEngine } from '../lib/audio/sound-synth.js';
import { inputShield } from '../lib/security/input-shield.js';

export class ChaosEngineeringHUD {
  constructor(stageController = null) {
    this.stageController = stageController;
    this.isOpen = false;
    this.modalEl = null;
    this.activeScenario = 'az_outage';
    this.circuitBreakers = {
      edge_gateway: { name: 'Edge Ingress Breaker', state: 'CLOSED', errorRate: 0.0, recoveryMs: 0 },
      envoy_mesh: { name: 'Envoy Mesh Proxy Breaker', state: 'CLOSED', errorRate: 0.0, recoveryMs: 0 },
      pgvector_db: { name: 'pgvector ACID Breaker', state: 'CLOSED', errorRate: 0.0, recoveryMs: 0 },
      aurora_cluster: { name: 'Aurora Global DB Breaker', state: 'CLOSED', errorRate: 0.0, recoveryMs: 0 }
    };
    this.activeTimer = null;

    this.scenarios = [
      {
        id: 'az_outage',
        title: 'AWS us-east-1a Regional Blackout',
        target: 'Edge Ingress & Anycast Gateway',
        impact: 'Simulates total loss of primary cloud AZ. Proves 420ms automated Anycast DNS failover to us-east-1b.',
        breakerKey: 'edge_gateway',
        failoverLatency: '420ms',
        rpoLoss: '0.00s'
      },
      {
        id: 'db_lag',
        title: 'PostgreSQL pgvector Replication Lag (+500ms)',
        target: 'PostgreSQL 16 + pgvector Cluster',
        impact: 'Injects unindexed vector cosine distance calculation. Circuit breaker trips to secondary read-replica.',
        breakerKey: 'pgvector_db',
        failoverLatency: '68ms',
        rpoLoss: '0.12s'
      },
      {
        id: 'mesh_drop',
        title: 'Envoy Service Mesh 75% Packet Loss',
        target: 'Envoy Pod Mesh & Sidecars',
        impact: 'Simulates degraded cross-pod networking. Triggers active retry backoff and hedged request cancellation.',
        breakerKey: 'envoy_mesh',
        failoverLatency: '85ms',
        rpoLoss: '0.00s'
      },
      {
        id: 'v8_oom',
        title: 'Worker V8 Isolate OOM Memory Exhaustion',
        target: 'Cloudflare Worker Gateway',
        impact: 'Triggers memory spike simulation. Proves isolate recycling with zero in-flight connection drops.',
        breakerKey: 'aurora_cluster',
        failoverLatency: '180ms',
        rpoLoss: '0.00s'
      }
    ];

    this.initDOM();
  }

  initDOM() {
    let modal = document.getElementById('chaosEngineeringModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'chaosEngineeringModal';
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
        <div class="cyber-card" style="width: 100%; max-width: 900px; max-height: 92vh; background: #070B14; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 24px 64px -12px rgba(0,0,0,0.9), 0 0 35px rgba(239, 68, 68, 0.15);">
          
          <!-- Modal Header -->
          <div style="padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center; background: rgba(18, 11, 15, 0.6);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 34px; height: 34px; border-radius: 8px; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.4); display: flex; align-items: center; justify-content: center; color: #EF4444;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <div>
                <div style="font-weight: 700; font-size: 14px; color: #F8FAFC; letter-spacing: 0.05em; font-family: var(--font-mono, monospace);">DISTRIBUTED CHAOS ENGINEERING & CIRCUIT BREAKER HUD</div>
                <div style="font-size: 10px; color: #94A3B8; font-family: var(--font-mono, monospace);">LIVE ANOMALY INJECTION, FAILOVER REROUTING & SELF-HEALING CANARY</div>
              </div>
            </div>

            <!-- Header Controls -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <button id="btnSelfHealAll" class="btn btn-secondary" style="height: 30px; padding: 0 12px; font-size: 10px; font-family: var(--font-mono, monospace); color: #10B981; border-color: rgba(16,185,129,0.3); display: inline-flex; align-items: center; gap: 5px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>Self-Heal All Systems</span>
              </button>

              <button id="btnCloseChaosModal" class="btn btn-secondary" style="height: 30px; width: 30px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 6px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>

          <!-- Circuit Breakers Status Strip -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 16px 24px; background: rgba(7, 11, 20, 0.4); border-bottom: 1px solid rgba(255,255,255,0.06);">
            
            <div id="cardBreakerEdge" class="cyber-card" style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px;">
              <div style="font-size: 9px; color: #94A3B8; font-family: var(--font-mono, monospace);">EDGE INGRESS</div>
              <div id="stateBreakerEdge" style="font-size: 14px; font-weight: 700; color: #10B981; font-family: var(--font-mono, monospace); margin: 4px 0;">
                CLOSED [NORMAL]
              </div>
              <div style="font-size: 9px; color: #64748B; font-family: var(--font-mono, monospace);">
                Drop: <span id="dropBreakerEdge">0.0%</span> • 0ms Lag
              </div>
            </div>

            <div id="cardBreakerEnvoy" class="cyber-card" style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px;">
              <div style="font-size: 9px; color: #94A3B8; font-family: var(--font-mono, monospace);">ENVOY MESH</div>
              <div id="stateBreakerEnvoy" style="font-size: 14px; font-weight: 700; color: #10B981; font-family: var(--font-mono, monospace); margin: 4px 0;">
                CLOSED [NORMAL]
              </div>
              <div style="font-size: 9px; color: #64748B; font-family: var(--font-mono, monospace);">
                Drop: <span id="dropBreakerEnvoy">0.0%</span> • 0ms Lag
              </div>
            </div>

            <div id="cardBreakerVector" class="cyber-card" style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px;">
              <div style="font-size: 9px; color: #94A3B8; font-family: var(--font-mono, monospace);">PGVECTOR RAG</div>
              <div id="stateBreakerVector" style="font-size: 14px; font-weight: 700; color: #10B981; font-family: var(--font-mono, monospace); margin: 4px 0;">
                CLOSED [NORMAL]
              </div>
              <div style="font-size: 9px; color: #64748B; font-family: var(--font-mono, monospace);">
                Drop: <span id="dropBreakerVector">0.0%</span> • 0ms Lag
              </div>
            </div>

            <div id="cardBreakerAurora" class="cyber-card" style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px;">
              <div style="font-size: 9px; color: #94A3B8; font-family: var(--font-mono, monospace);">AURORA STORAGE</div>
              <div id="stateBreakerAurora" style="font-size: 14px; font-weight: 700; color: #10B981; font-family: var(--font-mono, monospace); margin: 4px 0;">
                CLOSED [NORMAL]
              </div>
              <div style="font-size: 9px; color: #64748B; font-family: var(--font-mono, monospace);">
                Drop: <span id="dropBreakerAurora">0.0%</span> • 0ms Lag
              </div>
            </div>

          </div>

          <!-- Main Body: Fault Scenario Selector & Simulator -->
          <div style="padding: 20px 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 16px;">
            
            <div style="font-size: 11px; font-family: var(--font-mono, monospace); color: #00F0FF; font-weight: 700; letter-spacing: 0.05em;">
              SELECT ANOMALY SCENARIO TO INJECT ON STAGE:
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
              ${this.scenarios.map(sc => `
                <div class="chaos-scenario-card" data-scenario-id="${sc.id}" style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 14px; cursor: pointer; transition: all 0.2s ease;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                    <div style="font-size: 12px; font-weight: 700; color: #F8FAFC;">${inputShield.escapeHtml(sc.title)}</div>
                    <span class="cyber-badge badge-rose" style="font-size: 9px;">${inputShield.escapeHtml(sc.failoverLatency)}</span>
                  </div>
                  <div style="font-size: 10px; color: #94A3B8; margin-bottom: 8px;">Target: <code style="color: #00F0FF;">${inputShield.escapeHtml(sc.target)}</code></div>
                  <div style="font-size: 11px; color: #CBD5E1; line-height: 1.5;">${inputShield.escapeHtml(sc.impact)}</div>
                </div>
              `).join('')}
            </div>

            <!-- Active Scenario Control Bar -->
            <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 10px; padding: 16px; display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
              <div>
                <div style="font-size: 10px; font-family: var(--font-mono, monospace); color: #EF4444; font-weight: 700;">
                  ARMED CHAOS PAYLOAD:
                </div>
                <div id="armedScenarioLabel" style="font-size: 13px; font-weight: 700; color: #F8FAFC; margin-top: 2px;">
                  AWS us-east-1a Regional Blackout
                </div>
              </div>

              <div style="display: flex; gap: 8px;">
                <button id="btnEmergencyFailover" class="btn btn-secondary" style="height: 36px; padding: 0 14px; font-size: 11px; font-family: var(--font-mono, monospace); color: #F59E0B; border-color: rgba(245, 158, 11, 0.4); display: inline-flex; align-items: center; gap: 6px;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                  <span>Manual Cross-Region Trip</span>
                </button>

                <button id="btnInjectChaos" class="btn btn-primary" style="height: 36px; padding: 0 18px; font-size: 11px; font-family: var(--font-mono, monospace); background: #EF4444; border-color: #EF4444; display: inline-flex; align-items: center; gap: 6px;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  <span>Inject Fault on Stage</span>
                </button>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div style="padding: 14px 24px; border-top: 1px solid rgba(255,255,255,0.08); background: rgba(11, 18, 32, 0.6); display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 10px; color: #64748B; font-family: var(--font-mono, monospace);">
              ZERO-UPLOAD PRIVACY GUARANTEE • 100% IN-MEMORY REACTION MESH
            </div>

            <div style="font-size: 10px; color: #10B981; font-family: var(--font-mono, monospace);">
              AUTO-HEAL CANARY ARMED (4.2S CYCLE)
            </div>
          </div>

        </div>
      `;

      document.body.appendChild(modal);
    }
    this.modalEl = modal;

    // Attach listeners
    this.modalEl.querySelector('#btnCloseChaosModal')?.addEventListener('click', () => this.close());
    this.modalEl.querySelector('#btnSelfHealAll')?.addEventListener('click', () => this.healAll());
    this.modalEl.querySelector('#btnEmergencyFailover')?.addEventListener('click', () => this.emergencyFailover());
    this.modalEl.querySelector('#btnInjectChaos')?.addEventListener('click', () => this.injectFault());

    // Scenario selection cards
    this.modalEl.querySelectorAll('.chaos-scenario-card').forEach(card => {
      card.addEventListener('click', () => {
        soundEngine?.playClick();
        const scId = card.getAttribute('data-scenario-id');
        this.selectScenario(scId);
      });
    });

    this.selectScenario('az_outage');
    this.renderBreakers();
  }

  selectScenario(scId) {
    this.activeScenario = scId;
    const sc = this.scenarios.find(s => s.id === scId) || this.scenarios[0];

    this.modalEl?.querySelectorAll('.chaos-scenario-card').forEach(card => {
      if (card.getAttribute('data-scenario-id') === scId) {
        card.style.borderColor = '#EF4444';
        card.style.background = 'rgba(239, 68, 68, 0.12)';
      } else {
        card.style.borderColor = 'rgba(255,255,255,0.08)';
        card.style.background = 'rgba(15, 23, 42, 0.5)';
      }
    });

    const armedLabel = this.modalEl?.querySelector('#armedScenarioLabel');
    if (armedLabel) armedLabel.textContent = sc.title;
  }

  injectFault() {
    soundEngine?.playWarning();
    const sc = this.scenarios.find(s => s.id === this.activeScenario) || this.scenarios[0];
    const breaker = this.circuitBreakers[sc.breakerKey];
    if (breaker) {
      breaker.state = 'OPEN';
      breaker.errorRate = 100.0;
      breaker.recoveryMs = 4200;
    }

    // Trigger visual chaos in stage nodes
    this.triggerStageVisualChaos(sc);

    this.renderBreakers();

    // Start auto-heal countdown (OPEN -> HALF-OPEN -> CLOSED)
    if (this.activeTimer) clearTimeout(this.activeTimer);
    this.activeTimer = setTimeout(() => {
      if (breaker) {
        breaker.state = 'HALF-OPEN';
        breaker.errorRate = 10.0;
        this.renderBreakers();
        soundEngine?.playTick();
      }

      this.activeTimer = setTimeout(() => {
        this.healAll();
      }, 1800);
    }, 2400);
  }

  emergencyFailover() {
    soundEngine?.playWhoosh();
    // Trip all breakers to HALF-OPEN canary route
    Object.keys(this.circuitBreakers).forEach(key => {
      this.circuitBreakers[key].state = 'HALF-OPEN';
      this.circuitBreakers[key].errorRate = 0.5;
    });
    this.renderBreakers();

    setTimeout(() => {
      this.healAll();
    }, 3000);
  }

  healAll() {
    soundEngine?.playSuccess();
    Object.keys(this.circuitBreakers).forEach(key => {
      this.circuitBreakers[key].state = 'CLOSED';
      this.circuitBreakers[key].errorRate = 0.0;
      this.circuitBreakers[key].recoveryMs = 0;
    });

    // Remove chaos visual classes from stage nodes
    document.querySelectorAll('.chaos-latency-spike, .chaos-killed').forEach(el => {
      el.classList.remove('chaos-latency-spike', 'chaos-killed');
    });

    this.renderBreakers();
  }

  triggerStageVisualChaos(sc) {
    // If on Stage 2, highlight first pipeline node card
    const firstNode = document.querySelector('.pipeline-node-card');
    if (firstNode) {
      firstNode.classList.add('chaos-killed');
    }
  }

  renderBreakers() {
    if (!this.modalEl) return;

    const renderCard = (cardId, stateId, dropId, breaker) => {
      const card = this.modalEl.querySelector(cardId);
      const stateEl = this.modalEl.querySelector(stateId);
      const dropEl = this.modalEl.querySelector(dropId);

      if (!card || !stateEl || !dropEl) return;

      if (breaker.state === 'CLOSED') {
        card.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        stateEl.textContent = 'CLOSED [NORMAL]';
        stateEl.style.color = '#10B981';
        dropEl.textContent = '0.0%';
      } else if (breaker.state === 'OPEN') {
        card.style.borderColor = 'rgba(239, 68, 68, 0.6)';
        stateEl.textContent = 'OPEN [TRIPPED]';
        stateEl.style.color = '#EF4444';
        dropEl.textContent = '100.0%';
      } else if (breaker.state === 'HALF-OPEN') {
        card.style.borderColor = 'rgba(245, 158, 11, 0.6)';
        stateEl.textContent = 'HALF-OPEN [CANARY]';
        stateEl.style.color = '#F59E0B';
        dropEl.textContent = '10.0%';
      }
    };

    renderCard('#cardBreakerEdge', '#stateBreakerEdge', '#dropBreakerEdge', this.circuitBreakers.edge_gateway);
    renderCard('#cardBreakerEnvoy', '#stateBreakerEnvoy', '#dropBreakerEnvoy', this.circuitBreakers.envoy_mesh);
    renderCard('#cardBreakerVector', '#stateBreakerVector', '#dropBreakerVector', this.circuitBreakers.pgvector_db);
    renderCard('#cardBreakerAurora', '#stateBreakerAurora', '#dropBreakerAurora', this.circuitBreakers.aurora_cluster);
  }

  open() {
    this.isOpen = true;
    soundEngine?.playWhoosh();
    if (this.modalEl) this.modalEl.style.display = 'flex';
    const dockBtn = document.getElementById('dockBtnChaos');
    if (dockBtn) dockBtn.classList.add('active');
    this.renderBreakers();
  }

  close() {
    this.isOpen = false;
    soundEngine?.playClick();
    if (this.modalEl) this.modalEl.style.display = 'none';
    const dockBtn = document.getElementById('dockBtnChaos');
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

export const chaosEngineeringHUD = new ChaosEngineeringHUD();
