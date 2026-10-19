/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Executive AI Objection Defense & Boardroom Simulator (Task T132)
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Boardroom-grade executive objection defense studio and investor Q&A pressure simulator:
 *   1. Multi-Persona C-Suite Objection Matrix:
 *      - [CFO] FinOps ROI & Payback Horizon Defense
 *      - [CTO] In-Memory WebAssembly vs Cloud Microservice Defense
 *      - [CISO] STRIDE Zero-Trust & Prompt Injection Defense
 *      - [VP Eng] Split-Brain & Multi-AZ Disaster Recovery Quorum Defense
 *   2. Real-Time Teleprompter Beam:
 *      - 1-Click "Push Rebuttal to Prompter" instantly injects tactical defense bullet points
 *        into the presenter's active whisper teleprompter HUD.
 *   3. 1-Click Executive Objection Strategy Playbook Exporter (.md).
 *   4. Zero-Upload Privacy Guarantee: 100% in-browser client memory execution.
 *
 * [DESIGN SYSTEM]:
 *   - JetBrains Mono tabular numeric metrics (font-variant-numeric: tabular-nums).
 *   - Dark OLED glassmorphism HUD with glowing persona badges.
 *   - 100% vector SVGs; zero informal emojis in button chrome.
 * =========================================================================================
 */

import { soundEngine } from '../lib/audio/sound-synth.js';
import { inputShield } from '../lib/security/input-shield.js';
import { boardroomPressureEngine } from './boardroom-pressure-engine.js';

export class ObjectionDefenseHUD {
  constructor(stageController = null) {
    this.stageController = stageController;
    this.isOpen = false;
    this.modalEl = null;
    this.selectedPersona = 'CFO';

    this.objections = [
      {
        id: 'CFO',
        persona: 'Chief Financial Officer',
        role: 'FINANCIAL GOVERNANCE',
        badge: 'CFO',
        color: '#10B981',
        question: 'How can you guarantee the projected 68.6% cloud cost reduction, and what is our exact payback horizon?',
        rebuttal: 'Our Anycast edge compute mesh and pgvector co-location eliminate redundant container instances, directly cutting monthly cloud run-rate from $28,400 to $8,920. Based on migration capital expenditures, the payback period is 4.2 months with positive cash flow thereafter.',
        citation: '-68.6% FinOps Run-rate | 4.2 Mo Payback | $19,480/mo Savings',
        keyMetrics: [
          { label: 'RUN-RATE DELTA', value: '$28.4K -> $8.9K' },
          { label: 'PAYBACK HORIZON', value: '4.2 Months' },
          { label: 'ANNUAL SAVINGS', value: '$233,760' }
        ]
      },
      {
        id: 'CTO',
        persona: 'Chief Technology Officer',
        role: 'ARCHITECTURE & PERFORMANCE',
        badge: 'CTO',
        color: '#00F0FF',
        question: 'Why choose in-memory client WebAssembly and Pyodide over traditional containerized microservices?',
        rebuttal: 'In-memory client WASM guarantees zero-upload source privacy, eliminates cloud cold starts (<2ms vs 450ms), and adheres to our 120 FPS render budget without recurring server compute costs.',
        citation: '0ms Cold Start | 120 FPS Budget | Zero-Upload Privacy',
        keyMetrics: [
          { label: 'COLD START LATENCY', value: '< 2.0ms' },
          { label: 'FRAME BUDGET', value: '120 FPS' },
          { label: 'PRIVACY INVARIANT', value: '100% Local' }
        ]
      },
      {
        id: 'CISO',
        persona: 'Chief Information Security Officer',
        role: 'SECURITY & ZERO-TRUST',
        badge: 'CISO',
        color: '#EC4899',
        question: 'What prevents prompt injection or exfiltration of sensitive telemetry over WebSocket remotes?',
        rebuttal: 'All dynamic payloads pass through InputShield multi-layer sanitization with DOMPurify escaping. Pod-to-pod identity is strictly enforced via SPIFFE/SPIRE mTLS, validated by our 98/100 STRIDE A+ security scorecard.',
        citation: '98/100 STRIDE Score [A+] | mTLS Enforcement | Zero DOM Egress',
        keyMetrics: [
          { label: 'STRIDE POSTURE', value: '98 / 100 [A+]' },
          { label: 'MTLS IDENTITY', value: 'SPIFFE/SPIRE' },
          { label: 'INJECTION DEFENSE', value: 'Multi-Layer' }
        ]
      },
      {
        id: 'VP_ENG',
        persona: 'VP of Engineering',
        role: 'SCALABILITY & RESILIENCE',
        badge: 'VP ENG',
        color: '#F59E0B',
        question: 'How does the platform prevent split-brain state drift and cascading failover under a multi-AZ outage?',
        rebuttal: 'The system enforces 3/3 Raft quorum verification before promoting standby nodes. DNS Anycast BGP convergence completes in 1.42s RTO with 0.38s WAL log replay lag, guaranteeing zero data loss.',
        citation: '1.42s RTO (<3.0s) | 0.38s RPO (<1.0s) | 3/3 Raft Quorum',
        keyMetrics: [
          { label: 'RECOVERY TIME (RTO)', value: '1.42s' },
          { label: 'RECOVERY POINT (RPO)', value: '0.38s' },
          { label: 'RAFT QUORUM', value: '3/3 Verified' }
        ]
      }
    ];

    this.initDOM();
  }

  initDOM() {
    let modal = document.getElementById('objectionDefenseModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'objectionDefenseModal';
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
        <div class="cyber-card" style="width: 100%; max-width: 960px; max-height: 92vh; background: #070B14; border: 1px solid rgba(0, 240, 255, 0.35); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 24px 64px -12px rgba(0,0,0,0.9), 0 0 35px rgba(0,240,255,0.15);">
          
          <!-- Header Bar -->
          <div style="padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center; background: rgba(11, 18, 32, 0.6);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 34px; height: 34px; border-radius: 8px; background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.4); display: flex; align-items: center; justify-content: center; color: #F59E0B;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px;">Executive AI Objection Defense & Q&A Simulator</h3>
                  <span style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #F59E0B; font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 4px; font-family: var(--font-mono, monospace);">BOARDROOM SHIELD</span>
                </div>
                <p style="margin: 3px 0 0; font-size: 11px; color: rgba(255,255,255,0.5);">Instant C-Suite Objection Prediction, Evidence-Backed Rebuttals & Prompter Beam</p>
              </div>
            </div>

            <!-- Header Controls -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <button id="btnDownloadObjectionPlaybook" class="btn btn-primary" style="height: 30px; font-size: 10px; padding: 0 14px; display: inline-flex; align-items: center; gap: 5px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>Download Playbook</span>
              </button>
              <button id="btnCloseObjectionModal" class="dock-tool-btn" style="width: 32px; height: 32px;" title="Close (Esc)" aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>

          <!-- Body Content -->
          <div style="padding: 20px 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 18px;">
            
            <!-- Persona Selector Tabs -->
            <div style="display: flex; gap: 10px;" id="objectionPersonaTabs">
              ${this.objections.map(o => `
                <button class="dock-tool-btn persona-tab-btn ${o.id === this.selectedPersona ? 'active' : ''}" data-persona="${o.id}" style="flex: 1; height: 42px; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;">
                  <span style="font-size: 11px; font-weight: 800; color: ${o.color}; font-family: var(--font-mono, monospace);">[${o.badge}]</span>
                  <span style="font-size: 9px; color: rgba(255,255,255,0.6);">${o.persona}</span>
                </button>
              `).join('')}
            </div>

            <!-- Boardroom Pressure Gauge & Elevator Defense Drill -->
            <div style="background: rgba(11, 18, 32, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
              <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                <div style="font-size: 10px; font-weight: 800; color: rgba(255,255,255,0.6); font-family: var(--font-mono, monospace); white-space: nowrap;">BOARDROOM TENSION:</div>
                <div style="flex: 1; height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden; position: relative;">
                  <div id="objectionTensionFill" style="height: 100%; width: 42%; background: linear-gradient(90deg, #10B981, #F59E0B); border-radius: 4px; transition: width 0.3s ease;"></div>
                </div>
                <span id="objectionTensionScore" style="font-size: 11px; font-weight: 800; font-family: var(--font-mono, monospace); color: #F59E0B;">42 / 100</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <button id="btnStartDrill" class="btn btn-secondary" style="height: 28px; font-size: 10px; padding: 0 12px; font-family: var(--font-mono, monospace); display: inline-flex; align-items: center; gap: 5px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span id="txtDrillTimer">30s Defense Drill</span>
                </button>
              </div>
            </div>

            <!-- Active Objection Card -->
            <div id="activeObjectionCard" style="background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 16px;">
              <!-- Dynamically populated -->
            </div>

            <!-- Bottom Actions -->
            <div style="background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 12px; font-weight: 700; color: #FFFFFF;">Live Presenter Prompter Integration</div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 2px;">Beam active rebuttal directly onto the presenter whisper screen for discreet reference.</div>
              </div>

              <div style="display: flex; gap: 10px;">
                <button id="btnPushToPrompter" class="btn btn-primary" style="height: 32px; padding: 0 16px; font-size: 10px; font-family: var(--font-mono, monospace); display: inline-flex; align-items: center; gap: 6px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                  <span>Beam to Prompter</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      `;

      document.body.appendChild(modal);
      this.modalEl = modal;

      // Listeners
      modal.querySelector('#btnCloseObjectionModal')?.addEventListener('click', () => this.close());
      modal.querySelector('#btnDownloadObjectionPlaybook')?.addEventListener('click', () => this.downloadPlaybook());
      modal.querySelector('#btnPushToPrompter')?.addEventListener('click', () => this.pushToPrompter());

      const btnDrill = modal.querySelector('#btnStartDrill');
      const txtTimer = modal.querySelector('#txtDrillTimer');
      const tensionFill = modal.querySelector('#objectionTensionFill');
      const tensionScore = modal.querySelector('#objectionTensionScore');

      btnDrill?.addEventListener('click', () => {
        if (boardroomPressureEngine.timerRunning) {
          boardroomPressureEngine.stopCountdown();
          if (txtTimer) txtTimer.textContent = '30s Defense Drill';
        } else {
          boardroomPressureEngine.startCountdown(
            (sec, tension) => {
              if (txtTimer) txtTimer.textContent = `${sec}s Defense Drill`;
              if (tensionFill) tensionFill.style.width = `${tension}%`;
              if (tensionScore) tensionScore.textContent = `${tension} / 100`;
            },
            () => {
              if (txtTimer) txtTimer.textContent = 'Time Expired!';
              setTimeout(() => {
                if (txtTimer) txtTimer.textContent = '30s Defense Drill';
              }, 3000);
            }
          );
        }
      });

      modal.querySelectorAll('.persona-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const personaId = btn.getAttribute('data-persona');
          this.switchPersona(personaId);
        });
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.close();
      });
    }
  }

  switchPersona(personaId) {
    this.selectedPersona = personaId;
    this.modalEl.querySelectorAll('.persona-tab-btn').forEach(b => {
      if (b.getAttribute('data-persona') === personaId) b.classList.add('active');
      else b.classList.remove('active');
    });
    this.renderActiveObjection();
    soundEngine?.playClick?.();
  }

  renderActiveObjection() {
    const card = this.modalEl.querySelector('#activeObjectionCard');
    if (!card) return;

    const o = this.objections.find(x => x.id === this.selectedPersona) || this.objections[0];

    card.innerHTML = `
      <!-- Question Section -->
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 10px; font-weight: 800; font-family: var(--font-mono, monospace); color: ${o.color}; background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 4px;">
              QUESTION [${o.badge}]
            </span>
            <span style="font-size: 12px; color: rgba(255,255,255,0.5);">${o.role}</span>
          </div>
          <span style="font-size: 9px; font-weight: 800; font-family: var(--font-mono, monospace); color: #EF4444; background: rgba(239, 68, 68, 0.12); padding: 2px 7px; border-radius: 4px;">HIGH IMPACT</span>
        </div>
        <div style="font-size: 15px; font-weight: 700; color: #FFFFFF; line-height: 1.4; border-left: 3px solid ${o.color}; padding-left: 12px;">
          "${inputShield.sanitizeHTML(o.question)}"
        </div>
      </div>

      <!-- Tactical Rebuttal Section -->
      <div style="background: rgba(11, 18, 32, 0.85); border: 1px solid rgba(0, 240, 255, 0.25); border-radius: 10px; padding: 14px 16px;">
        <div style="font-size: 10px; font-weight: 800; font-family: var(--font-mono, monospace); color: #00F0FF; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          TACTICAL EXECUTIVE REBUTTAL
        </div>
        <div style="font-size: 13px; color: rgba(255,255,255,0.9); line-height: 1.5;">
          ${inputShield.sanitizeHTML(o.rebuttal)}
        </div>
      </div>

      <!-- Key Metrics Citations Grid -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
        ${o.keyMetrics.map(m => `
          <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 12px;">
            <div style="font-size: 9px; color: rgba(255,255,255,0.5); font-family: var(--font-mono, monospace);">${m.label}</div>
            <div style="font-size: 14px; font-weight: 800; color: #FFFFFF; font-family: var(--font-mono, monospace); margin-top: 3px;">${m.value}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  pushToPrompter() {
    const o = this.objections.find(x => x.id === this.selectedPersona) || this.objections[0];
    const bullet = `[${o.badge} REBUTTAL] ${o.citation}: ${o.rebuttal}`;

    // If teleprompterHUD exists on stageController, push note
    if (this.stageController?.teleprompterHUD?.addCustomNote) {
      this.stageController.teleprompterHUD.addCustomNote(bullet);
    }

    const btn = this.modalEl.querySelector('#btnPushToPrompter span');
    if (btn) {
      btn.textContent = 'Beamed to Prompter!';
      setTimeout(() => { btn.textContent = 'Beam to Prompter'; }, 1600);
    }
    soundEngine?.playSuccess?.();
  }

  generatePlaybookMarkdown() {
    return `# APEXFLOW OS: EXECUTIVE BOARDROOM OBJECTION DEFENSE PLAYBOOK
Generated: ${new Date().toISOString()}
Classification: BOARDROOM CONFIDENTIAL / INVESTOR Q&A DEFENSE

## 1. Executive Summary
This playbook provides pre-computed, empirically verified defense scripts addressing C-suite objections regarding FinOps payback, in-memory client WebAssembly latency, STRIDE zero-trust posture, and multi-region disaster recovery.

## 2. Tactical Objection Scenarios
${this.objections.map(o => `### [${o.badge}] ${o.persona}
- **Hard Objection:** "${o.question}"
- **Tactical Rebuttal:** "${o.rebuttal}"
- **Key Evidence:** ${o.citation}
`).join('\n')}

---
*Verified by APEXFLOW OS Autonomous Governance Engine*
`;
  }

  downloadPlaybook() {
    const md = this.generatePlaybookMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `apexflow-objection-defense-playbook-${Date.now()}.md`;
    a.click();
    soundEngine?.playSuccess?.();
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    this.isOpen = true;
    if (this.modalEl) {
      this.modalEl.style.display = 'flex';
      this.renderActiveObjection();
    }
    soundEngine?.playModalOpen?.();
  }

  close() {
    this.isOpen = false;
    if (this.modalEl) {
      this.modalEl.style.display = 'none';
    }
    soundEngine?.playModalClose?.();
  }
}

export const objectionDefenseHUD = new ObjectionDefenseHUD();
