/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Stage 4: Interactive Live Device Prototype Studio (Task T064)
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Renders authentic hardware mockup frames (Apple Pro Display XDR, iPad Pro 13", iPhone 16 Pro)
 * hosting 3 live, fully interactive product prototypes:
 *   1. Analytics Dashboard: Live SVG throughput telemetry, latency p99 histogram & cluster table
 *   2. Event Stream: Real-time reactive pipeline message bus with test event dispatcher
 *   3. Architecture Intelligence: Interactive executive chat terminal with instant simulated responses
 *
 * [DESIGN SYSTEM]:
 *   - Authentic hardware proportions (aluminum chassis, camera glint, ProMotion 120Hz badge)
 *   - Dynamic Island on iPhone 16 Pro with active audio waveform and battery indicator
 *   - Tabular figures (`tabular-nums`) across all metrics
 *   - Tactile sound feedback on prototype switches, event triggers, and chat messages
 *
 * [ENGINEERING SPECIFICATIONS]:
 *   - Use `deviceFrames.setViewport('desktop' | 'tablet' | 'mobile')` to change hardware frame.
 *   - Use `deviceFrames.setPrototype('analytics' | 'stream' | 'copilot')` to change screen app.
 * =========================================================================================
 */

import { soundEngine } from '../lib/audio/sound-synth.js';

export class DeviceFramesUI {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentViewport = 'desktop'; // 'desktop' | 'tablet' | 'mobile'
    this.currentPrototype = 'analytics'; // 'analytics' | 'stream' | 'copilot'
    this.manifest = null;

    // Interactive Prototype State
    this.eventsList = [
      { id: 101, time: '14:22:04', node: 'webhook_ingress', type: 'PAYLOAD_RECV', status: 'OK', latency: '4.2ms' },
      { id: 102, time: '14:22:05', node: 'wasm_validator', type: 'SCHEMA_AIRGAP', status: 'VERIFIED', latency: '1.8ms' },
      { id: 103, time: '14:22:07', node: 'pgvector_cluster', type: 'COSINE_INDEX', status: 'COMMITTED', latency: '6.1ms' }
    ];

    this.chatMessages = [
      { sender: 'user', text: 'Identify latency bottlenecks in our current ingress pipeline.' },
      { sender: 'copilot', text: 'Pipeline analysis complete: Webhook ingestion runs at 4.2ms in browser WASM memory. 100% zero-upload privacy verified. Throughput headroom is 4.2x above baseline.' }
    ];

    this.render();
  }

  setManifest(manifest) {
    this.manifest = manifest;
    this.render();
  }

  setViewport(viewportType) {
    if (this.currentViewport === viewportType) return;
    this.currentViewport = viewportType;
    soundEngine.playWhoosh();
    this.render();
  }

  setPrototype(protoType) {
    if (this.currentPrototype === protoType) return;
    this.currentPrototype = protoType;
    soundEngine.playClick();
    this.render();
  }

  render() {
    if (!this.container) return;

    if (this.currentViewport === 'desktop') {
      this.renderDesktopProDisplay();
    } else if (this.currentViewport === 'tablet') {
      this.renderIPadPro();
    } else {
      this.renderIPhone16Pro();
    }

    this.wireInteractivePrototypeEvents();
  }

  /**
   * Generates the inner prototype screen HTML based on active prototype
   */
  getPrototypeContentHTML(isCompact = false) {
    const projName = this.manifest ? this.manifest.name : 'APEXFLOW OS';

    if (this.currentPrototype === 'stream') {
      return `
        <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="font-size: 13px; font-weight: 700; color: #F8FAFC;">Live Event Stream Bus</div>
            <button id="btnProtoSendEvent" class="btn btn-secondary" style="height: 26px; font-size: 10px; border-color: #00F0FF; color: #00F0FF; display: inline-flex; align-items: center; gap: 4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              <span>Send Test Event</span>
            </button>
          </div>
          <div id="protoEventLogs" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; font-family: var(--font-mono); font-size: 11px;">
            ${this.eventsList.map(ev => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #0A1120; border: 1px solid #172438; border-radius: 6px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="color: #64748B;">${ev.time}</span>
                  <span style="color: #00F0FF; font-weight: 600;">[${ev.node}]</span>
                  <span style="color: #E2E8F0;">${ev.type}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="color: #10B981; font-size: 10px;">${ev.status}</span>
                  <span style="color: #94A3B8;">${ev.latency}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (this.currentPrototype === 'copilot') {
      return `
        <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: #F8FAFC;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><rect x="4" y="8" width="16" height="12" rx="2"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/><line x1="9" y1="18" x2="15" y2="18"/></svg>
              <span>ApexFlow Architecture Intelligence</span>
            </div>
            <span class="cyber-badge badge-emerald" style="font-size: 9px;">ACTIVE AGENT</span>
          </div>

          <!-- Chat Messages Area -->
          <div id="protoChatArea" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px; padding-right: 4px;">
            ${this.chatMessages.map(msg => `
              <div style="align-self: ${msg.sender === 'user' ? 'flex-end' : 'flex-start'}; max-width: 85%; padding: 10px 14px; border-radius: 10px; font-size: 12px; line-height: 1.5; background: ${msg.sender === 'user' ? '#00527C' : '#0B1324'}; color: #F8FAFC; border: 1px solid ${msg.sender === 'user' ? 'rgba(0,240,255,0.4)' : '#1E2D44'};">
                <div style="font-size: 10px; font-family: var(--font-mono); color: ${msg.sender === 'user' ? '#7DD3FC' : '#10B981'}; margin-bottom: 2px;">
                  ${msg.sender === 'user' ? 'PRESENTER' : 'ARCHITECT COPILOT'}
                </div>
                ${msg.text}
              </div>
            `).join('')}
          </div>

          <!-- Quick Suggestion Pills -->
          <div style="display: flex; gap: 6px; margin-bottom: 8px; overflow-x: auto; padding-bottom: 4px;">
            <button class="proto-prompt-pill" data-prompt="Audit schema security vulnerabilities" style="padding: 4px 8px; background: #0A1222; border: 1px solid #1E2D44; border-radius: 4px; color: #94A3B8; font-size: 10px; cursor: pointer; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg><span>Audit Security</span></button>
            <button class="proto-prompt-pill" data-prompt="Analyze memory throughput bottlenecks" style="padding: 4px 8px; background: #0A1222; border: 1px solid #1E2D44; border-radius: 4px; color: #94A3B8; font-size: 10px; cursor: pointer; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg><span>Throughput Test</span></button>
            <button class="proto-prompt-pill" data-prompt="Generate executive summary report" style="padding: 4px 8px; background: #0A1222; border: 1px solid #1E2D44; border-radius: 4px; color: #94A3B8; font-size: 10px; cursor: pointer; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg><span>Executive Summary</span></button>
          </div>

          <!-- Chat Input -->
          <div style="display: flex; gap: 8px;">
            <input type="text" id="protoChatInput" placeholder="Ask autonomous copilot..." style="flex: 1; height: 32px; background: #090F1C; border: 1px solid #1E2D44; border-radius: 6px; color: #F8FAFC; padding: 0 10px; font-size: 11px; outline: none;">
            <button id="btnProtoChatSend" class="btn btn-primary" style="height: 32px; padding: 0 12px; font-size: 11px;">Send</button>
          </div>
        </div>
      `;
    }

    // Default: Analytics Dashboard
    return `
      <div style="flex: 1; display: flex; flex-direction: column; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div>
            <h4 style="font-size: ${isCompact ? '15px' : '18px'}; font-weight: 700; color: #F8FAFC; margin: 0;">${projName} Cluster Telemetry</h4>
            <div style="font-size: 11px; color: #64748B;">Deterministic WebAssembly execution across distributed memory shards.</div>
          </div>
          <span class="cyber-badge badge-cyan" style="font-size: 10px;">● 120 FPS RETINA</span>
        </div>

        <!-- 3 KPI Cards -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 14px;">
          <div class="cyber-card" style="padding: 10px; background: #0A1120;">
            <div style="font-size: 10px; color: #64748B; font-family: var(--font-mono);">THROUGHPUT</div>
            <div style="font-size: 18px; font-weight: 800; color: #38BDF8; font-variant-numeric: tabular-nums;">1.42M / sec</div>
            <div style="font-size: 10px; color: #10B981;">↑ 14.8% velocity</div>
          </div>
          <div class="cyber-card" style="padding: 10px; background: #0A1120;">
            <div style="font-size: 10px; color: #64748B; font-family: var(--font-mono);">MEDIAN LATENCY</div>
            <div style="font-size: 18px; font-weight: 800; color: #10B981; font-variant-numeric: tabular-nums;">4.2 ms</div>
            <div style="font-size: 10px; color: #64748B;">p99 &lt; 18 ms</div>
          </div>
          <div class="cyber-card" style="padding: 10px; background: #0A1120;">
            <div style="font-size: 10px; color: #64748B; font-family: var(--font-mono);">PRIVACY COMPLIANCE</div>
            <div style="font-size: 18px; font-weight: 800; color: #A855F7; font-variant-numeric: tabular-nums;">100% Zero-Upload</div>
            <div style="font-size: 10px; color: #64748B;">Air-gapped memory</div>
          </div>
        </div>

        <!-- Mini Live Chart SVG -->
        <div style="padding: 10px; background: #090F1C; border: 1px solid #162438; border-radius: 8px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 10px; font-family: var(--font-mono); color: #64748B; margin-bottom: 4px;">
            <span>ACTIVE THROUGHPUT LOAD PROFILE (60s)</span>
            <span style="color: #00F0FF;">P99: 18ms</span>
          </div>
          <svg viewBox="0 0 400 50" style="width: 100%; height: 50px; overflow: visible;">
            <defs>
              <linearGradient id="protoChartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#00F0FF" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#00F0FF" stop-opacity="0.0" />
              </linearGradient>
            </defs>
            <path d="M 0 40 Q 60 15, 120 30 T 240 20 T 360 10 L 400 25 L 400 50 L 0 50 Z" fill="url(#protoChartGrad)" />
            <path d="M 0 40 Q 60 15, 120 30 T 240 20 T 360 10 L 400 25" fill="none" stroke="#00F0FF" stroke-width="2" />
          </svg>
        </div>

        <!-- Node Status Rows -->
        <div style="background: #0B1322; border: 1px solid #1E2D44; border-radius: 8px; padding: 10px; font-size: 10px; font-family: var(--font-mono);">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #172438; padding-bottom: 4px; color: #64748B; font-weight: 600;">
            <span>SERVICE BLADE</span>
            <span>STATUS</span>
            <span>LOAD</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.03);">
            <span>ingress-webhook-worker</span>
            <span style="color: #10B981;">● HEALTHY</span>
            <span>2.4%</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 5px 0;">
            <span>pgvector-wasm-memory</span>
            <span style="color: #10B981;">● COMMITTED</span>
            <span>8.1%</span>
          </div>
        </div>

      </div>
    `;
  }

  /**
   * [DESKTOP] Apple Pro Display XDR Desktop Mockup Frame
   */
  renderDesktopProDisplay() {
    const projName = this.manifest ? this.manifest.name : 'APEXFLOW OS';

    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 960px; height: 100%; justify-content: center; animation: fadeIn 0.25s ease;">
        
        <!-- Top Resolution Badge -->
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 10px; font-family: var(--font-mono); font-size: 11px; color: #64748B;">
          <span>PRO DISPLAY XDR</span>
          <span>•</span>
          <span style="color: #38BDF8;">1920 × 1080 (16:9 Retinal Scale)</span>
          <span>•</span>
          <span style="color: #10B981;">120 Hz ProMotion</span>
        </div>

        <!-- Monitor Bezel & Screen -->
        <div style="width: 100%; aspect-ratio: 16/9.6; max-height: 480px; background: #0A0F1A; border: 12px solid #141C2B; border-radius: 16px; box-shadow: 0 25px 60px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08); position: relative; overflow: hidden; display: flex; flex-direction: column;">
          
          <!-- Screen Header Chrome -->
          <div style="height: 34px; background: #0F172A; border-bottom: 1px solid #1E293B; display: flex; align-items: center; justify-content: space-between; padding: 0 14px; flex-shrink: 0;">
            <div style="display: flex; gap: 6px;">
              <div style="width: 10px; height: 10px; border-radius: 50%; background: #EF4444;"></div>
              <div style="width: 10px; height: 10px; border-radius: 50%; background: #F59E0B;"></div>
              <div style="width: 10px; height: 10px; border-radius: 50%; background: #10B981;"></div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; background: #070B12; border: 1px solid #1E2D44; border-radius: 6px; padding: 3px 18px; font-size: 11px; font-family: var(--font-mono); color: #94A3B8;">
              <span style="color: #10B981; display: inline-flex; align-items: center; gap: 4px;">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>https://</span>
              </span><span>apexflow.internal/app/${projName.toLowerCase().replace(/\\s+/g, '-')}</span>
            </div>
            <div style="font-size: 10px; color: #10B981; font-family: var(--font-mono); font-weight: 700;">PROD 200 OK</div>
          </div>

          <!-- Screen Web App Canvas -->
          <div style="flex: 1; padding: 20px; background: #070B14; overflow-y: auto; display: flex; flex-direction: column;">
            ${this.getPrototypeContentHTML(false)}
          </div>
        </div>

        <!-- Monitor Stand Pedestal Base -->
        <div style="width: 140px; height: 28px; background: linear-gradient(180deg, #162030 0%, #0F1724 100%); border-left: 1px solid rgba(255,255,255,0.1); border-right: 1px solid rgba(255,255,255,0.1); margin-top: -1px;"></div>
        <div style="width: 220px; height: 8px; background: linear-gradient(180deg, #1E2C42 0%, #0C121D 100%); border-radius: 6px 6px 0 0; box-shadow: 0 10px 24px rgba(0,0,0,0.6);"></div>

      </div>
    `;
  }

  /**
   * [TABLET] Apple iPad Pro 13" Mockup Frame
   */
  renderIPadPro() {
    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 680px; height: 100%; justify-content: center; animation: fadeIn 0.25s ease;">
        
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 10px; font-family: var(--font-mono); font-size: 11px; color: #64748B;">
          <span>IPAD PRO 13" (M4)</span>
          <span>•</span>
          <span style="color: #38BDF8;">834 × 1194 (Responsive Tablet)</span>
          <span>•</span>
          <span style="color: #10B981;">Touch & Pencil Ready</span>
        </div>

        <!-- Tablet Chassis -->
        <div style="width: 100%; max-width: 640px; aspect-ratio: 4/3; max-height: 480px; background: #070B14; border: 14px solid #151D2A; border-radius: 30px; box-shadow: 0 25px 60px -15px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.06); position: relative; overflow: hidden; display: flex; flex-direction: column;">
          
          <!-- Top Status Bar -->
          <div style="height: 30px; padding: 0 18px; display: flex; align-items: center; justify-content: space-between; font-size: 11px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #94A3B8; font-weight: 600; flex-shrink: 0; background: #0B111E;">
            <span>9:41</span>
            <div style="display: flex; gap: 8px; align-items: center;">
              <span>5G</span>
              <span>Wi-Fi</span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <span>100%</span>
                <svg width="15" height="9" viewBox="0 0 24 14" fill="none" stroke="#10B981" stroke-width="2"><rect x="1" y="1" width="18" height="12" rx="2"/><line x1="21" y1="4" x2="21" y2="10" stroke-width="2"/><rect x="3" y="3" width="14" height="8" fill="#10B981"/></svg>
              </div>
            </div>
          </div>

          <!-- iPad Content Canvas -->
          <div style="flex: 1; padding: 18px; overflow-y: auto; display: flex; flex-direction: column;">
            ${this.getPrototypeContentHTML(false)}
          </div>

          <!-- iPad Home Indicator Bar -->
          <div style="height: 14px; display: flex; align-items: center; justify-content: center; background: #070B14;">
            <div style="width: 130px; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px;"></div>
          </div>

        </div>

      </div>
    `;
  }

  /**
   * [MOBILE] Apple iPhone 16 Pro Mockup Frame
   */
  renderIPhone16Pro() {
    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%; justify-content: center; animation: fadeIn 0.25s ease;">
        
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 10px; font-family: var(--font-mono); font-size: 11px; color: #64748B;">
          <span>IPHONE 16 PRO</span>
          <span>•</span>
          <span style="color: #38BDF8;">393 × 852 (Retina OLED)</span>
          <span>•</span>
          <span style="color: #10B981;">Dynamic Island</span>
        </div>

        <!-- Phone Chassis -->
        <div style="width: 320px; height: 500px; background: #070B14; border: 11px solid #1C2333; border-radius: 46px; box-shadow: 0 25px 60px -15px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08); position: relative; overflow: hidden; display: flex; flex-direction: column;">
          
          <!-- Dynamic Island Pill -->
          <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 100px; height: 26px; background: #000000; border-radius: 16px; z-index: 50; display: flex; align-items: center; justify-content: space-between; padding: 0 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
            <div style="display: flex; align-items: center; gap: 4px;">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              <div style="width: 8px; height: 6px; background: #10B981; border-radius: 1px;"></div>
            </div>
            <div style="width: 9px; height: 9px; border-radius: 50%; background: #0D1624; border: 1.5px solid #1E293B;"></div>
          </div>

          <!-- iOS Status Bar -->
          <div style="height: 38px; padding: 0 24px; display: flex; align-items: flex-end; justify-content: space-between; font-size: 11px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #F8FAFC; font-weight: 600; padding-bottom: 4px; flex-shrink: 0;">
            <span>9:41</span>
            <div style="display: flex; gap: 6px; align-items: center; font-size: 10px;">
              <span>5G</span>
              <svg width="15" height="9" viewBox="0 0 24 14" fill="none" stroke="#10B981" stroke-width="2"><rect x="1" y="1" width="18" height="12" rx="2"/><line x1="21" y1="4" x2="21" y2="10" stroke-width="2"/><rect x="3" y="3" width="14" height="8" fill="#10B981"/></svg>
            </div>
          </div>

          <!-- Phone Content Canvas -->
          <div style="flex: 1; padding: 14px 16px; overflow-y: auto; display: flex; flex-direction: column;">
            ${this.getPrototypeContentHTML(true)}
          </div>

          <!-- iOS Home Indicator -->
          <div style="height: 16px; display: flex; align-items: center; justify-content: center; background: #070B14; flex-shrink: 0;">
            <div style="width: 120px; height: 4px; background: rgba(255,255,255,0.4); border-radius: 2px;"></div>
          </div>

        </div>

      </div>
    `;
  }

  /**
   * Wires interactive buttons inside the live prototype screens
   */
  wireInteractivePrototypeEvents() {
    // 1. Send Test Event (Stream prototype)
    const btnSendEvent = this.container.querySelector('#btnProtoSendEvent');
    if (btnSendEvent) {
      btnSendEvent.onclick = () => {
        soundEngine.playSuccess();
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        const newEv = {
          id: Date.now(),
          time: timeStr,
          node: 'live_test_emitter',
          type: 'EXECUTIVE_PING',
          status: 'SUCCESS',
          latency: '2.1ms'
        };
        this.eventsList.unshift(newEv);
        if (this.eventsList.length > 8) this.eventsList.pop();

        const logsContainer = this.container.querySelector('#protoEventLogs');
        if (logsContainer) {
          const row = document.createElement('div');
          row.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(0,240,255,0.12); border: 1px solid #00F0FF; border-radius: 6px; animation: fadeIn 0.2s ease;';
          row.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #64748B;">${newEv.time}</span>
              <span style="color: #00F0FF; font-weight: 600;">[${newEv.node}]</span>
              <span style="color: #E2E8F0;">${newEv.type}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #10B981; font-size: 10px;">${newEv.status}</span>
              <span style="color: #94A3B8;">${newEv.latency}</span>
            </div>
          `;
          logsContainer.prepend(row);
        }
      };
    }

    // 2. Chat Input & Send (Copilot prototype)
    const chatInput = this.container.querySelector('#protoChatInput');
    const btnSendChat = this.container.querySelector('#btnProtoChatSend');
    const chatArea = this.container.querySelector('#protoChatArea');

    const handleSend = (text) => {
      const query = (text || (chatInput ? chatInput.value : '')).trim();
      if (!query) return;
      if (chatInput) chatInput.value = '';

      soundEngine.playClick();
      this.chatMessages.push({ sender: 'user', text: query });
      this.render();

      setTimeout(() => {
        soundEngine.playSuccess();
        const answers = [
          `Verified autonomous execution: Zero remote latency. All cryptographic hashes match in-memory tensor state.`,
          `Throughput optimization: Pyodide compilation verified at sub-3ms. Headroom indicates 50k req/s capability.`,
          `Security audit passed: Zero external socket leaks. 100% air-gapped memory retention guaranteed.`
        ];
        const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
        this.chatMessages.push({ sender: 'copilot', text: randomAnswer });
        this.render();
      }, 400);
    };

    if (btnSendChat) {
      btnSendChat.onclick = () => handleSend();
    }
    if (chatInput) {
      chatInput.onkeydown = (e) => {
        if (e.key === 'Enter') handleSend();
      };
    }

    // Prompt pills
    this.container.querySelectorAll('.proto-prompt-pill').forEach(pill => {
      pill.onclick = () => {
        const prompt = pill.dataset.prompt;
        handleSend(prompt);
      };
    });
  }
}
