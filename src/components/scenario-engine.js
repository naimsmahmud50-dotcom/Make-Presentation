/**
 * ============================================================================
 * [MODULE]: EXECUTIVE DYNAMIC "WHAT-IF" SCENARIO & STRESS ENGINE (Task T078)
 * ----------------------------------------------------------------------------
 * Interactive multi-scenario state mutator for high-stakes executive boardroom
 * presentations, investor pitches, and architecture resilience demonstrations.
 * 
 * [ENGINEERING HIGHLIGHTS]:
 * - 4 Enterprise Scenario Presets: Baseline, Hyper-Growth (10M), Black Swan Failover, FinOps Optimization.
 * - Reactive Graph Mutation: dynamically injects scaling pods, trips circuit breakers, and reroutes traffic.
 * - Cross-Stage Telemetry Propagation: mutates Stage 2 living architecture and Stage 5 Bento ROI in real-time.
 * - Non-destructive mutation: instant reset back to baseline enterprise manifest with 1 click.
 * - Hotkey 'Y' / Command Palette integration.
 * ============================================================================
 */

import { soundEngine } from '../lib/audio/sound-synth.js';

export class ScenarioEngine {
  constructor(stageController) {
    this.stageController = stageController;
    this.activeScenario = 'baseline';
    this.isOpen = false;
    this.autoRecoveryTimer = null;

    this.scenarios = {
      baseline: {
        id: 'baseline',
        name: 'Standard Enterprise',
        badge: 'BASELINE',
        badgeClass: 'badge-cyan',
        traffic: '1.2M req/day',
        latency: '14ms p99',
        sla: '99.99%',
        cost: '$184,000 / yr',
        savings: '$124,000',
        hoursReclaimed: '1,240 hrs',
        multiplier: '3.4x ROI',
        description: 'Standard enterprise baseline architecture operating within nominal SLA and budget parameters.'
      },
      hypergrowth: {
        id: 'hypergrowth',
        name: 'Hyper-Growth (10M Surge)',
        badge: '10M REQ/S',
        badgeClass: 'badge-purple',
        traffic: '864M req/day',
        latency: '18ms p99',
        sla: '99.998%',
        cost: '$240,000 / yr',
        savings: '$520,000',
        hoursReclaimed: '4,800 hrs',
        multiplier: '5.2x ROI',
        description: 'Global traffic spike handled seamlessly via distributed Edge Kubernetes mesh and auto-scaling pods.'
      },
      blackswan: {
        id: 'blackswan',
        name: 'Black Swan Outage & Auto-Failover',
        badge: 'FAILOVER',
        badgeClass: 'badge-rose',
        traffic: 'Emergency Reroute',
        latency: '82ms Failover',
        sla: '99.995%',
        cost: '$0 Downtime',
        savings: '$380,000 SLA preserved',
        hoursReclaimed: '2,400 hrs',
        multiplier: '4.6x ROI',
        description: 'Primary cloud gateway severed. Automatic zero-loss circuit breaker failover to secondary edge in 82ms.'
      },
      finops: {
        id: 'finops',
        name: 'FinOps Cloud Cost Optimization',
        badge: '68% FINOPS',
        badgeClass: 'badge-emerald',
        traffic: 'Optimized 1.2M',
        latency: '11ms p99',
        sla: '99.99%',
        cost: '$58,800 / yr',
        savings: '$249,200',
        hoursReclaimed: '1,890 hrs',
        multiplier: '6.8x ROI',
        description: 'Eliminates redundant ingress compute and idle database replicas, slashing annual cloud expenditure by 68%.'
      }
    };

    this.dom = {
      hud: null,
      selectorContainer: null,
      metricsStrip: null
    };

    this.init();
  }

  init() {
    this.buildDOM();
    this.bindEvents();
  }

  buildDOM() {
    let hud = document.getElementById('executiveScenarioHUD');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'executiveScenarioHUD';
      hud.className = 'scenario-hud';
      hud.style.cssText = `
        position: fixed;
        top: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(4, 6, 10, 0.94);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid #1E2D44;
        border-radius: 40px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(168, 85, 247, 0.2);
        z-index: 9400;
        padding: 6px 14px;
        display: none;
        align-items: center;
        gap: 12px;
        user-select: none;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      `;

      hud.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; border-right: 1px solid #1E2D44; padding-right: 12px;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #A855F7; box-shadow: 0 0 8px #A855F7;"></span>
          <span style="font-size: 11px; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: #F8FAFC; letter-spacing: 0.05em;">SCENARIO:</span>
        </div>

        <div id="scenarioPillsContainer" style="display: flex; align-items: center; gap: 6px;">
          <!-- Scenario pills injected here -->
        </div>

        <div id="scenarioMetricsStrip" style="display: flex; align-items: center; gap: 10px; border-left: 1px solid #1E2D44; padding-left: 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px;">
          <span id="metricTraffic" style="color: #00F0FF;">1.2M req/day</span>
          <span style="color: #334155;">•</span>
          <span id="metricLatency" style="color: #10B981;">14ms p99</span>
          <span style="color: #334155;">•</span>
          <span id="metricSLA" style="color: #F59E0B;">99.99%</span>
        </div>

        <button id="btnScenarioClose" style="background: none; border: none; color: #64748B; cursor: pointer; padding: 2px 6px; margin-left: 4px; display: inline-flex; align-items: center;" title="Close Scenario HUD (Y)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      `;

      document.body.appendChild(hud);
    }

    this.dom.hud = hud;
    this.dom.selectorContainer = hud.querySelector('#scenarioPillsContainer');
    this.dom.metricsStrip = hud.querySelector('#scenarioMetricsStrip');

    this.renderPills();
  }

  renderPills() {
    if (!this.dom.selectorContainer) return;
    this.dom.selectorContainer.innerHTML = '';

    Object.keys(this.scenarios).forEach(key => {
      const sc = this.scenarios[key];
      const btn = document.createElement('button');
      const isActive = this.activeScenario === key;

      btn.className = `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`;
      btn.style.cssText = `
        height: 28px;
        padding: 0 10px;
        font-size: 11px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: all 0.2s ease;
        ${isActive ? 'box-shadow: 0 0 12px rgba(0, 240, 255, 0.4);' : ''}
      `;

      btn.innerHTML = `<span>${sc.badge}</span>`;
      btn.title = `${sc.name}: ${sc.description}`;

      btn.addEventListener('click', () => {
        this.applyScenario(key);
      });

      this.dom.selectorContainer.appendChild(btn);
    });
  }

  bindEvents() {
    this.dom.hud.querySelector('#btnScenarioClose')?.addEventListener('click', () => {
      this.close();
    });

    // Global Key Listener for 'Y'
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    soundEngine.playWhoosh();
    this.dom.hud.style.display = 'flex';
    this.updateMetricsDisplay();
  }

  close() {
    this.isOpen = false;
    soundEngine.playClick();
    this.dom.hud.style.display = 'none';
  }

  applyScenario(scenarioKey) {
    const sc = this.scenarios[scenarioKey];
    if (!sc) return;

    this.activeScenario = scenarioKey;
    soundEngine.playSuccess();
    this.renderPills();
    this.updateMetricsDisplay();

    // Broadcast notice to presenter whisper HUD if available
    if (this.stageController?.showWhisperMessage) {
      this.stageController.showWhisperMessage(`SCENARIO ACTIVATED: ${sc.name.toUpperCase()}`);
    }

    // 1. Mutate Stage 5 Bento ROI if visible or rendered
    this.mutateROI(sc);

    // 2. Mutate Living Architecture in Stage 2
    this.mutateArchitectureGraph(scenarioKey);
  }

  updateMetricsDisplay() {
    const sc = this.scenarios[this.activeScenario];
    if (!sc) return;

    const elTraffic = document.getElementById('metricTraffic');
    const elLatency = document.getElementById('metricLatency');
    const elSLA = document.getElementById('metricSLA');

    if (elTraffic) elTraffic.textContent = sc.traffic;
    if (elLatency) elLatency.textContent = sc.latency;
    if (elSLA) elSLA.textContent = sc.sla;
  }

  mutateROI(sc) {
    // Dynamic recalculation of Stage 5 Bento ROI cards
    const elSavings = document.querySelector('.roi-card-value');
    if (elSavings) {
      elSavings.textContent = sc.savings;
      elSavings.style.color = sc.id === 'finops' ? '#10B981' : '#00F0FF';
    }

    const roiValues = document.querySelectorAll('.bento-metric-value');
    if (roiValues.length >= 3) {
      roiValues[0].textContent = sc.savings;
      roiValues[1].textContent = sc.hoursReclaimed;
      roiValues[2].textContent = sc.multiplier;
    }
  }

  mutateArchitectureGraph(scenarioKey) {
    // Stage 2 Living Architecture Holodeck reactive visual mutations
    const stage2 = document.getElementById('stage-1'); // Index 1 is Stage 2
    if (!stage2) return;

    // Reset previous mutation classes
    stage2.classList.remove('scenario-hypergrowth', 'scenario-blackswan', 'scenario-finops');

    if (scenarioKey === 'hypergrowth') {
      stage2.classList.add('scenario-hypergrowth');
      if (this.stageController?.holodeckEngine?.nodes) {
        // Boost particle flow speed
        this.stageController.holodeckEngine.trafficSpeedMultiplier = 2.8;
      }
    } else if (scenarioKey === 'blackswan') {
      stage2.classList.add('scenario-blackswan');
      soundEngine.playWarning();

      // Trigger circuit breaker visual pulse
      const badge = document.getElementById('pulseRateBadge');
      if (badge) {
        badge.textContent = '[FAILOVER: 82ms ACTIVE]';
        badge.style.borderColor = '#EF4444';
        badge.style.color = '#EF4444';
      }

      // Auto-heal after 4 seconds
      if (this.autoRecoveryTimer) clearTimeout(this.autoRecoveryTimer);
      this.autoRecoveryTimer = setTimeout(() => {
        if (badge) {
          badge.textContent = '[AUTO-HEALED: 99.995% SLA]';
          badge.style.borderColor = '#10B981';
          badge.style.color = '#10B981';
        }
        soundEngine.playSuccess();
      }, 3500);
    } else if (scenarioKey === 'finops') {
      stage2.classList.add('scenario-finops');
      if (this.stageController?.holodeckEngine?.nodes) {
        this.stageController.holodeckEngine.trafficSpeedMultiplier = 0.9;
      }
    } else {
      // Baseline
      if (this.stageController?.holodeckEngine) {
        this.stageController.holodeckEngine.trafficSpeedMultiplier = 1.0;
      }
      const badge = document.getElementById('pulseRateBadge');
      if (badge) {
        badge.textContent = '● 98.4% NOMINAL';
        badge.style.borderColor = '#00F0FF';
        badge.style.color = '#00F0FF';
      }
    }
  }

  destroy() {
    if (this.autoRecoveryTimer) clearTimeout(this.autoRecoveryTimer);
    if (this.dom.hud) this.dom.hud.remove();
  }
}
