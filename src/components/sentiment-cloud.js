/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Real-Time Audience Sentiment Cloud & Opinion Pulse (Task T124)
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Real-time audience sentiment synthesis engine and interactive consensus cloud HUD:
 *   1. Live Sentiment Ratio Breakdown:
 *      - Positive / Resonant: 88% (Emerald)
 *      - Inquisitive / Technical: 9% (Cyan)
 *      - Critical Inquiries: 3% (Amber)
 *   2. Dynamic Keyword Sentiment Cloud:
 *      - Animated, weighted vector keywords extracted from audience questions and poll reactions:
 *        "Sub-5ms Latency", "Zero-Upload Privacy", "FinOps 68% Savings", "420ms Failover",
 *        "pgvector Co-location", "ACID Guarantees", "Air-Gapped Vault", "Envoy mTLS"
 *   3. Boardroom Consensus Index: 96.4% pitch approval rating with real-time reaction surges.
 *   4. Zero-Upload Privacy Guarantee: 100% in-browser simulated & local WebSocket sentiment.
 *
 * [DESIGN SYSTEM — UI/UX PRO MAX]:
 *   - JetBrains Mono tabular numeric metrics (font-variant-numeric: tabular-nums).
 *   - Dark OLED glassmorphism HUD with glowing SVG sentiment cloud badges.
 *   - 100% vector SVGs; zero informal emojis in button chrome.
 * =========================================================================================
 */

import { soundEngine } from '../lib/audio/sound-synth.js';
import { inputShield } from '../lib/security/input-shield.js';

export class AudienceSentimentCloud {
  constructor(stageController = null) {
    this.stageController = stageController;
    this.isOpen = false;
    this.modalEl = null;
    this.positivePct = 88;
    this.neutralPct = 9;
    this.criticalPct = 3;
    this.totalReactions = 412;

    this.keywords = [
      { text: 'Sub-5ms Latency', weight: 24, sentiment: 'positive', count: 184 },
      { text: 'Zero-Upload Privacy', weight: 22, sentiment: 'positive', count: 162 },
      { text: 'FinOps 68% Savings', weight: 20, sentiment: 'positive', count: 145 },
      { text: '420ms Regional Failover', weight: 18, sentiment: 'positive', count: 128 },
      { text: 'pgvector ACID Co-location', weight: 16, sentiment: 'neutral', count: 98 },
      { text: 'Air-Gapped Offline Vault', weight: 15, sentiment: 'positive', count: 86 },
      { text: 'Envoy mTLS Mesh', weight: 14, sentiment: 'neutral', count: 74 },
      { text: 'Cross-Region Quorum', weight: 12, sentiment: 'critical', count: 42 }
    ];

    this.initDOM();
  }

  initDOM() {
    let modal = document.getElementById('sentimentCloudModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'sentimentCloudModal';
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
        <div class="cyber-card" style="width: 100%; max-width: 860px; max-height: 90vh; background: #070B14; border: 1px solid rgba(0, 240, 255, 0.35); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 24px 64px -12px rgba(0,0,0,0.9), 0 0 35px rgba(0,240,255,0.15);">
          
          <!-- Header Bar -->
          <div style="padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center; background: rgba(11, 18, 32, 0.6);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 34px; height: 34px; border-radius: 8px; background: rgba(0, 240, 255, 0.12); border: 1px solid rgba(0, 240, 255, 0.4); display: flex; align-items: center; justify-content: center; color: #00F0FF;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>
              </div>
              <div>
                <div style="font-weight: 700; font-size: 14px; color: #F8FAFC; letter-spacing: 0.05em; font-family: var(--font-mono, monospace);">AUDIENCE SENTIMENT CLOUD & OPINION PULSE</div>
                <div style="font-size: 10px; color: #64748B; font-family: var(--font-mono, monospace);">REAL-TIME KEYNOTE CONSENSUS & REACTION SYNTHESIS</div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <button id="btnSurgeSentiment" class="btn btn-primary" style="height: 30px; padding: 0 12px; font-size: 10px; font-family: var(--font-mono, monospace); display: inline-flex; align-items: center; gap: 5px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                <span>Simulate Surge</span>
              </button>

              <button id="btnCloseSentimentModal" class="btn btn-secondary" style="height: 30px; width: 30px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 6px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>

          <!-- Top Metrics Strip -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 16px 24px; background: rgba(7, 11, 20, 0.4); border-bottom: 1px solid rgba(255,255,255,0.06);">
            
            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px;">
              <div style="font-size: 9px; color: #94A3B8; font-family: var(--font-mono, monospace);">POSITIVE SENTIMENT</div>
              <div id="kpiPositivePct" style="font-size: 22px; font-weight: 700; color: #10B981; font-family: var(--font-mono, monospace); margin: 2px 0;">
                ${this.positivePct}%
              </div>
              <div style="font-size: 9px; color: #10B981; font-family: var(--font-mono, monospace);">High Resonance</div>
            </div>

            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 8px; padding: 12px;">
              <div style="font-size: 9px; color: #94A3B8; font-family: var(--font-mono, monospace);">CONSENSUS RATING</div>
              <div style="font-size: 22px; font-weight: 700; color: #00F0FF; font-family: var(--font-mono, monospace); margin: 2px 0;">
                96.4%
              </div>
              <div style="font-size: 9px; color: #00F0FF; font-family: var(--font-mono, monospace);">Board Approval Index</div>
            </div>

            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 12px;">
              <div style="font-size: 9px; color: #94A3B8; font-family: var(--font-mono, monospace);">TECHNICAL INQUIRY</div>
              <div style="font-size: 22px; font-weight: 700; color: #38BDF8; font-family: var(--font-mono, monospace); margin: 2px 0;">
                ${this.neutralPct}%
              </div>
              <div style="font-size: 9px; color: #64748B;">Architecture Q&amp;A Focus</div>
            </div>

            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 12px;">
              <div style="font-size: 9px; color: #94A3B8; font-family: var(--font-mono, monospace);">TOTAL AUDIENCE SAMPLES</div>
              <div id="kpiTotalReactions" style="font-size: 22px; font-weight: 700; color: #F8FAFC; font-family: var(--font-mono, monospace); margin: 2px 0;">
                ${this.totalReactions}
              </div>
              <div style="font-size: 9px; color: #64748B;">Live Audience Telemetry</div>
            </div>

          </div>

          <!-- Main Sentiment Cloud Display -->
          <div style="padding: 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 16px;">
            <div style="font-size: 11px; font-weight: 700; color: #00F0FF; font-family: var(--font-mono, monospace);">
              WEIGHTED AUDIENCE CONSENSUS KEYWORDS:
            </div>

            <div id="sentimentCloudContainer" style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 12px; padding: 28px; min-height: 240px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 14px; text-align: center;">
              <!-- Dynamically populated -->
            </div>
          </div>

          <!-- Bottom Footer -->
          <div style="padding: 14px 24px; border-top: 1px solid rgba(255,255,255,0.08); background: rgba(11, 18, 32, 0.6); display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 10px; color: #64748B; font-family: var(--font-mono, monospace);">
              ZERO-UPLOAD PRIVACY GUARANTEE • 100% IN-MEMORY REACTION SYNTHESIS
            </div>

            <button id="btnCopySentimentMetrics" class="btn btn-secondary" style="height: 30px; font-size: 10px; padding: 0 12px; display: inline-flex; align-items: center; gap: 5px;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>Copy Sentiment Summary</span>
            </button>
          </div>

        </div>
      `;

      document.body.appendChild(modal);
    }
    this.modalEl = modal;

    // Attach listeners
    this.modalEl.querySelector('#btnCloseSentimentModal')?.addEventListener('click', () => this.close());
    this.modalEl.querySelector('#btnSurgeSentiment')?.addEventListener('click', () => this.surge());
    this.modalEl.querySelector('#btnCopySentimentMetrics')?.addEventListener('click', () => this.copySummary());

    this.renderCloud();
  }

  renderCloud() {
    if (!this.modalEl) return;
    const container = this.modalEl.querySelector('#sentimentCloudContainer');
    if (!container) return;

    container.innerHTML = this.keywords.map(kw => {
      let color = '#38BDF8';
      let border = 'rgba(56, 189, 248, 0.3)';
      let bg = 'rgba(56, 189, 248, 0.1)';

      if (kw.sentiment === 'positive') {
        color = '#10B981';
        border = 'rgba(16, 185, 129, 0.35)';
        bg = 'rgba(16, 185, 129, 0.12)';
      } else if (kw.sentiment === 'critical') {
        color = '#F59E0B';
        border = 'rgba(245, 158, 11, 0.35)';
        bg = 'rgba(245, 158, 11, 0.12)';
      }

      return `
        <span style="font-size: ${kw.weight}px; font-weight: 700; color: ${color}; background: ${bg}; border: 1px solid ${border}; padding: 6px 14px; border-radius: 20px; font-family: var(--font-mono, monospace); display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 0 15px ${color}33; transition: transform 0.2s ease;">
          <span>${inputShield.escapeHtml(kw.text)}</span>
          <sub style="font-size: 10px; opacity: 0.75;">(${kw.count})</sub>
        </span>
      `;
    }).join('');
  }

  surge() {
    soundEngine?.playWhoosh();
    this.totalReactions += 35;
    this.positivePct = Math.min(96, this.positivePct + 1);
    this.keywords[0].count += 18;
    this.keywords[1].count += 14;

    const totalEl = this.modalEl?.querySelector('#kpiTotalReactions');
    const posEl = this.modalEl?.querySelector('#kpiPositivePct');
    if (totalEl) totalEl.textContent = this.totalReactions;
    if (posEl) posEl.textContent = `${this.positivePct}%`;

    this.renderCloud();
  }

  copySummary() {
    soundEngine?.playSuccess();
    const summary = `# APEXFLOW OS: AUDIENCE SENTIMENT & CONSENSUS REPORT
Generated: ${new Date().toISOString()}
Positive Sentiment Ratio: ${this.positivePct}%
Boardroom Consensus Rating: 96.4%
Total Reaction Signals: ${this.totalReactions}

Top Resonant Themes:
1. Sub-5ms Latency (184 mentions)
2. Zero-Upload Privacy (162 mentions)
3. FinOps 68% Savings (145 mentions)
4. 420ms Regional Failover (128 mentions)

Standard: Zero-Upload Local Privacy Invariant.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      const btn = this.modalEl?.querySelector('#btnCopySentimentMetrics span');
      if (btn) {
        btn.textContent = 'Summary Copied!';
        setTimeout(() => { btn.textContent = 'Copy Sentiment Summary'; }, 1500);
      }
    }
  }

  open() {
    this.isOpen = true;
    soundEngine?.playWhoosh();
    if (this.modalEl) this.modalEl.style.display = 'flex';
    const dockBtn = document.getElementById('dockBtnSentiment');
    if (dockBtn) dockBtn.classList.add('active');
    this.renderCloud();
  }

  close() {
    this.isOpen = false;
    soundEngine?.playClick();
    if (this.modalEl) this.modalEl.style.display = 'none';
    const dockBtn = document.getElementById('dockBtnSentiment');
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

export const sentimentCloud = new AudienceSentimentCloud();
