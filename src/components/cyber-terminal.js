/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Stage 3: Human-Crafted Developer Cyber Terminal
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Renders the Stage 3 authentic developer terminal. Built with deliberate human craftsmanship
 * inspired by modern tools like Linear, Raycast, and VS Code.
 *
 * [UI SPECIFICATIONS — UI/UX PRO MAX]:
 *   - Authentic macOS-style window buttons (Red, Amber, Emerald)
 *   - Tab header bar: Active Session, WASM Engine, Memory Footprint
 *   - Real-time streaming log lines with precise timestamping
 *   - Micro-badges: [INGRESS], [LLM AGENT], [POSTGRES], [DISPATCH]
 *   - Latency badges: [18ms], [194ms]
 *   - Integrated audio ticks synchronized to each incoming log
 *   - "Copy Output" and "Clear Logs" action buttons
 * =========================================================================================
 */

import { soundEngine } from '../lib/audio/sound-synth.js';
import { inputShield } from '../lib/security/input-shield.js';

export class CyberTerminalUI {
  constructor(containerElement) {
    this.container = containerElement;
    this.logsContainer = null;
    this.statusPill = null;
    this.logHistory = [];
    this.renderTerminalFrame();
  }

  /**
   * Builds the authentic terminal chrome and controls
   */
  renderTerminalFrame() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="cyber-card" style="height: 100%; display: flex; flex-direction: column; padding: 0; background: #070B12; border-color: #1E2D44; overflow: hidden; box-shadow: 0 12px 48px -10px rgba(0,0,0,0.7);">
        
        <!-- Terminal Top Header Bar -->
        <div style="height: 44px; background: #0D1424; border-bottom: 1px solid #1A263A; display: flex; align-items: center; justify-content: space-between; padding: 0 16px;">
          
          <!-- Window Controls -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 11px; height: 11px; border-radius: 50%; background: #EF4444; border: 1px solid rgba(0,0,0,0.2);"></div>
            <div style="width: 11px; height: 11px; border-radius: 50%; background: #F59E0B; border: 1px solid rgba(0,0,0,0.2);"></div>
            <div style="width: 11px; height: 11px; border-radius: 50%; background: #10B981; border: 1px solid rgba(0,0,0,0.2);"></div>
            <span style="margin-left: 12px; font-size: 12px; font-family: var(--font-mono); color: #94A3B8; font-weight: 500;">
              bash - apexflow-runtime (pyodide.wasm)
            </span>
          </div>

          <!-- Active Tabs & Memory -->
          <div style="display: flex; align-items: center; gap: 12px; font-family: var(--font-mono); font-size: 11px;">
            <span style="color: #64748B;">RAM: <strong>48.2 MB</strong></span>
            <span style="color: #64748B;">•</span>
            <span id="termStatusBadge" style="color: #10B981; font-weight: 600;">● READY</span>
            <button id="btnCopyTerminalLogs" class="btn btn-secondary" style="height: 26px; padding: 0 8px; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;" title="Copy all logs">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>Copy</span>
            </button>
            <button id="btnClearTerminalLogs" class="btn btn-secondary" style="height: 26px; padding: 0 8px; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;" title="Clear terminal">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              <span>Clear</span>
            </button>
          </div>

        </div>

        <!-- Terminal Logs Body -->
        <div id="termLogsBody" style="flex: 1; padding: 20px 24px; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.8; overflow-y: auto; color: #E2E8F0; background: #06090F;">
          <div style="color: #475569; margin-bottom: 8px;">
            // APEXFLOW OS Execution Sandbox initialized.<br/>
            // Click "Simulate Trigger Event" to execute pipeline in browser memory.
          </div>
        </div>

        <!-- Terminal Bottom Status Footer -->
        <div style="height: 32px; background: #0A0F1A; border-top: 1px solid #162236; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; font-size: 11px; font-family: var(--font-mono); color: #64748B;">
          <div>Encoding: UTF-8 • Shell: WebAssembly CPython 3.11</div>
          <div id="termEventCount">0 events logged</div>
        </div>

      </div>
    `;

    this.logsContainer = document.getElementById('termLogsBody');
    this.statusPill = document.getElementById('termStatusBadge');

    // Setup Copy & Clear buttons
    document.getElementById('btnClearTerminalLogs')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.clear();
    });

    const copyBtn = document.getElementById('btnCopyTerminalLogs');
    copyBtn?.addEventListener('click', () => {
      soundEngine.playClick();
      const text = this.logHistory.map(l => `[${l.timestamp}] ${l.badge} ${l.message}`).join('\n');
      navigator.clipboard.writeText(text);
      copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span style="color:#10B981;">Copied</span>`;
      setTimeout(() => {
        copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copy</span>`;
      }, 1800);
    });
  }

  /**
   * Appends a single structured log line with typewriter sound
   * @param {Object} log
   */
  appendLog(log) {
    if (!this.logsContainer) return;
    this.logHistory.push(log);
    soundEngine.playClick();

    const line = document.createElement('div');
    line.style.display = 'flex';
    line.style.alignItems = 'baseline';
    line.style.gap = '10px';
    line.style.marginBottom = '6px';
    line.style.animation = 'fadeIn 0.15s ease-out';

    const safeTime = inputShield ? inputShield.escapeHtml(log.timestamp ? log.timestamp.split(' ')[1] : '') : '';
    const safeBadge = inputShield ? inputShield.escapeHtml(log.badge) : log.badge;
    const safeMsg = inputShield ? inputShield.escapeHtml(log.message) : log.message;
    const safeLatency = log.latencyMs ? inputShield.escapeHtml(log.latencyMs) : null;
    const safeColor = inputShield ? inputShield.escapeHtml(log.color || '#38BDF8') : (log.color || '#38BDF8');

    line.innerHTML = `
      <span style="color: #64748B; font-size: 11px; flex-shrink: 0;">${safeTime}</span>
      <span style="color: ${safeColor}; font-weight: 700; flex-shrink: 0;">${safeBadge}</span>
      <span style="color: #F8FAFC; flex: 1;">${safeMsg}</span>
      ${safeLatency ? `<span style="font-size: 11px; color: #475569; padding: 1px 6px; background: rgba(255,255,255,0.05); border-radius: 4px;">${safeLatency}ms</span>` : ''}
    `;

    this.logsContainer.appendChild(line);
    this.logsContainer.scrollTop = this.logsContainer.scrollHeight;

    const countEl = document.getElementById('termEventCount');
    if (countEl) countEl.textContent = `${this.logHistory.length} events logged`;
  }

  setStatus(text, color = '#10B981') {
    if (this.statusPill) {
      this.statusPill.textContent = text;
      this.statusPill.style.color = color;
    }
  }

  clear() {
    this.logHistory = [];
    if (this.logsContainer) {
      this.logsContainer.innerHTML = '<div style="color: #475569;">// Terminal cleared. Ready for next trigger.</div>';
    }
    const countEl = document.getElementById('termEventCount');
    if (countEl) countEl.textContent = '0 events logged';
    this.setStatus('● READY', '#10B981');
  }
}
