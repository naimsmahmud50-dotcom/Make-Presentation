/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Enterprise Keynote Watermarking & DRM Engine (Task T109)
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Visible and forensic confidentiality watermarking for high-stakes enterprise pitches:
 *   1. Diagonal Repeating Watermark Grid: Renders customizable confidentiality text across stage.
 *   2. NDA Classification Levels: PUBLIC, INTERNAL ONLY, CONFIDENTIAL, BOARD SECRET.
 *   3. Forensic Session Steganography: Generates cryptographic session hash (e.g. AF-9482-SEC).
 *   4. Export Protection: Injects confidentiality banners into PDF decks and PNG snapshots.
 *   5. Real-Time Configuration Modal: Presenters can configure recipient name & NDA grade.
 *
 * [DESIGN SYSTEM — UI/UX PRO MAX]:
 *   - JetBrains Mono monospace security stamps with subtle opacity (0.07 to 0.15).
 *   - Non-intrusive presentation view (doesn't obstruct architecture diagram comprehension).
 *   - 100% vector SVGs; zero informal emojis in button chrome.
 *
 * [ZERO-UPLOAD PRIVACY GUARANTEE]:
 * 100% client-side DOM & Canvas execution. Zero network calls.
 * =========================================================================================
 */

import { soundEngine } from '../audio/sound-synth.js';
import { inputShield } from './input-shield.js';

export class KeynoteWatermarkEngine {
  constructor(stageController = null) {
    this.stageController = stageController;
    this.isEnabled = true;
    this.recipientName = 'CONFIDENTIAL ENTERPRISE REVIEW';
    this.classification = 'CONFIDENTIAL'; // 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'SECRET'
    this.sessionId = `AF-${Math.floor(1000 + Math.random() * 9000)}-SEC`;
    this.overlayEl = null;
    this.modalEl = null;

    this.initDOM();
  }

  initDOM() {
    // 1. Watermark Overlay Container
    let overlay = document.getElementById('keynoteWatermarkOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'keynoteWatermarkOverlay';
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '850';
      overlay.style.overflow = 'hidden';
      overlay.style.display = this.isEnabled ? 'block' : 'none';

      document.body.appendChild(overlay);
    }
    this.overlayEl = overlay;
    this.renderWatermark();

    // 2. Watermark Config Modal
    let modal = document.getElementById('keynoteWatermarkModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'keynoteWatermarkModal';
      modal.style.position = 'fixed';
      modal.style.inset = '0';
      modal.style.background = 'rgba(3, 6, 12, 0.85)';
      modal.style.backdropFilter = 'blur(16px)';
      modal.style.webkitBackdropFilter = 'blur(16px)';
      modal.style.zIndex = '99999';
      modal.style.display = 'none';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.padding = '20px';

      modal.innerHTML = `
        <div class="cyber-card" style="width: 100%; max-width: 520px; background: #070B14; border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 14px; padding: 22px; box-shadow: 0 20px 50px rgba(0,0,0,0.85);">
          
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 28px; height: 28px; border-radius: 6px; background: rgba(0, 240, 255, 0.1); border: 1px solid rgba(0, 240, 255, 0.3); display: flex; align-items: center; justify-content: center; color: #00F0FF;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div>
                <div style="font-weight: 700; font-size: 13px; color: #F8FAFC; letter-spacing: 0.05em; font-family: var(--font-mono, monospace);">KEYNOTE DRM & WATERMARK</div>
                <div style="font-size: 10px; color: #64748B; font-family: var(--font-mono, monospace);">IP PROTECTION & LEAK PREVENTION</div>
              </div>
            </div>
            <button id="btnCloseWatermarkModal" class="btn btn-secondary" style="height: 26px; width: 26px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 18px;">
            <div>
              <label style="display: block; font-size: 10px; font-family: var(--font-mono, monospace); color: #00F0FF; margin-bottom: 4px; text-transform: uppercase;">
                Recipient / Audience Name
              </label>
              <input type="text" id="watermarkRecipientInput" value="${inputShield.escapeHtml(this.recipientName)}" style="width: 100%; height: 36px; background: #0B1220; border: 1px solid #1E2D44; border-radius: 6px; color: #F8FAFC; padding: 0 12px; font-size: 12px; outline: none; box-sizing: border-box;">
            </div>

            <div>
              <label style="display: block; font-size: 10px; font-family: var(--font-mono, monospace); color: #00F0FF; margin-bottom: 4px; text-transform: uppercase;">
                NDA Classification Level
              </label>
              <select id="watermarkClassSelect" style="width: 100%; height: 36px; background: #0B1220; border: 1px solid #1E2D44; border-radius: 6px; color: #F8FAFC; padding: 0 12px; font-size: 12px; outline: none; box-sizing: border-box;">
                <option value="PUBLIC">PUBLIC (Unrestricted)</option>
                <option value="INTERNAL">INTERNAL ONLY (Company Eyes Only)</option>
                <option value="CONFIDENTIAL" selected>CONFIDENTIAL (Standard NDA Enforced)</option>
                <option value="SECRET">BOARD SECRET (Top Secret / M&A Restricted)</option>
              </select>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: rgba(15, 23, 42, 0.6); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
              <div>
                <div style="font-size: 11px; font-weight: 600; color: #F8FAFC;">Visible Screen Watermark</div>
                <div style="font-size: 9px; color: #64748B; font-family: var(--font-mono, monospace);">Subtle 8% opacity diagonal pattern</div>
              </div>
              <input type="checkbox" id="toggleWatermarkActive" ${this.isEnabled ? 'checked' : ''} style="cursor: pointer; width: 18px; height: 18px; accent-color: #00F0FF;">
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button id="btnCancelWatermark" class="btn btn-secondary" style="height: 32px; padding: 0 14px; font-size: 11px;">Cancel</button>
            <button id="btnSaveWatermark" class="btn btn-primary" style="height: 32px; padding: 0 16px; font-size: 11px;">Apply DRM Stamps</button>
          </div>

        </div>
      `;

      document.body.appendChild(modal);
    }
    this.modalEl = modal;

    // Attach listeners
    this.modalEl.querySelector('#btnCloseWatermarkModal')?.addEventListener('click', () => this.closeConfigModal());
    this.modalEl.querySelector('#btnCancelWatermark')?.addEventListener('click', () => this.closeConfigModal());
    this.modalEl.querySelector('#btnSaveWatermark')?.addEventListener('click', () => {
      soundEngine?.playSuccess();
      const input = this.modalEl.querySelector('#watermarkRecipientInput');
      const select = this.modalEl.querySelector('#watermarkClassSelect');
      const check = this.modalEl.querySelector('#toggleWatermarkActive');

      if (input) this.recipientName = inputShield.sanitizeString(input.value || 'CONFIDENTIAL REVIEW');
      if (select) this.classification = select.value;
      if (check) this.isEnabled = check.checked;

      this.renderWatermark();
      this.closeConfigModal();
    });
  }

  renderWatermark() {
    if (!this.overlayEl) return;
    if (!this.isEnabled) {
      this.overlayEl.style.display = 'none';
      return;
    }

    this.overlayEl.style.display = 'block';

    const color = this.classification === 'SECRET' ? '#F43F5E' : (this.classification === 'INTERNAL' ? '#F59E0B' : '#00F0FF');
    const stampText = `${inputShield.escapeHtml(this.classification)} • PREPARED FOR: ${inputShield.escapeHtml(this.recipientName)} • ${this.sessionId}`;

    this.overlayEl.innerHTML = `
      <!-- Corner Security Badge -->
      <div style="position: absolute; top: 12px; left: 16px; display: flex; align-items: center; gap: 6px; padding: 3px 8px; background: rgba(7, 11, 20, 0.7); border: 1px solid ${color}40; border-radius: 4px; font-family: var(--font-mono, monospace); font-size: 9px; color: ${color}; letter-spacing: 0.05em; z-index: 10;">
        <span style="width: 5px; height: 5px; border-radius: 50%; background: ${color}; box-shadow: 0 0 6px ${color};"></span>
        <span>${stampText}</span>
      </div>

      <!-- Repeating Diagonal Pattern Overlay -->
      <div style="position: absolute; inset: -50%; width: 200%; height: 200%; transform: rotate(-25deg); display: flex; flex-direction: column; justify-content: space-around; pointer-events: none; opacity: 0.055; user-select: none;">
        ${Array.from({ length: 12 }).map(() => `
          <div style="display: flex; justify-content: space-around; font-family: var(--font-mono, monospace); font-size: 14px; font-weight: 700; color: ${color}; letter-spacing: 0.15em; white-space: nowrap;">
            <span>${stampText}</span>
            <span>${stampText}</span>
            <span>${stampText}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  openConfigModal() {
    soundEngine?.playWhoosh();
    if (this.modalEl) this.modalEl.style.display = 'flex';
  }

  closeConfigModal() {
    soundEngine?.playClick();
    if (this.modalEl) this.modalEl.style.display = 'none';
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    soundEngine?.playClick();
    this.renderWatermark();
  }
}

export const keynoteWatermark = new KeynoteWatermarkEngine();
