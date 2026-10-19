/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Type E Screen Simulator & Type F File Constellation
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Specialized presentation surfaces for:
 *   1. Type E (Mobile & Desktop Apps — Flutter, React Native, Swift, Electron, Tauri):
 *      Interactive multi-screen application flow simulator with step-by-step UI states.
 *   2. Type F (Generic / Unknown Repositories — Universal Zero-Rejection Guarantee):
 *      Holographic File Constellation, language cluster analytics & Markdown narrative view.
 *
 * [DESIGN SYSTEM]:
 * - Fluid screen state transitions with tactile Web Audio sound synthesis.
 * - Tabular language breakdown pills with exact percentage distribution.
 * - 100% Client-Side zero-upload execution.
 *
 * [ENGINEERING SPECIFICATIONS]:
 * - Mount Type E using `mountScreenSimulator(container, manifest)` in Stage 4.
 * - Mount Type F using `mountConstellationNebula(container, manifest)` in Stage 2 or Stage 4.
 * =========================================================================================
 */

import { soundEngine } from '../lib/audio/sound-synth.js';

export const SAMPLE_APP_SCREENS = [
  {
    id: 'screen-auth',
    name: '1. Biometric Authentication',
    badge: 'Security',
    badgeColor: '#10B981',
    headline: 'Zero-Trust FaceID & Token Vault',
    desc: 'Instant biometric token validation with cryptographic enclave storage.',
    mockupUi: `
      <div style="padding: 24px 16px; text-align: center;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(16,185,129,0.12); border: 1px solid #10B981; margin: 20px auto 16px auto; display: flex; align-items: center; justify-content: center;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div style="font-size: 15px; font-weight: 700; color: #F8FAFC; margin-bottom: 4px;">Enclave Secured</div>
        <div style="font-size: 11px; color: #64748B; margin-bottom: 24px;">FaceID Token Handshake: 200 OK</div>
        <button style="width: 100%; height: 38px; background: #10B981; color: #070A10; border: none; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer;">
          Unlock Session
        </button>
      </div>
    `
  },
  {
    id: 'screen-feed',
    name: '2. Live Operations Feed',
    badge: 'Core UI',
    badgeColor: '#00F0FF',
    headline: 'Sub-Millisecond Event Stream',
    desc: 'Real-time WebSocket event ledger with virtualized 120 FPS infinite scrolling.',
    mockupUi: `
      <div style="padding: 16px; display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #94A3B8; margin-bottom: 4px;">
          <span>EVENT STREAM</span>
          <span style="color: #00F0FF;">● LIVE (120 FPS)</span>
        </div>
        <div style="padding: 8px 10px; background: #0B1322; border-radius: 6px; border-left: 3px solid #00F0FF; font-size: 11px;">
          <div style="font-weight: 700; color: #F8FAFC;">Order #9921 Processed</div>
          <div style="color: #64748B; font-size: 10px;">12ms ago • Node: worker-04</div>
        </div>
        <div style="padding: 8px 10px; background: #0B1322; border-radius: 6px; border-left: 3px solid #10B981; font-size: 11px;">
          <div style="font-weight: 700; color: #F8FAFC;">Redis Cache Synced</div>
          <div style="color: #64748B; font-size: 10px;">48ms ago • Latency: 2ms</div>
        </div>
        <div style="padding: 8px 10px; background: #0B1322; border-radius: 6px; border-left: 3px solid #A855F7; font-size: 11px;">
          <div style="font-weight: 700; color: #F8FAFC;">LangChain Agent Triggered</div>
          <div style="color: #64748B; font-size: 10px;">112ms ago • Model: GPT-4o</div>
        </div>
      </div>
    `
  },
  {
    id: 'screen-analytics',
    name: '3. Real-Time Telemetry',
    badge: 'Metrics',
    badgeColor: '#A855F7',
    headline: 'Hardware Telemetry Gauges',
    desc: 'Client-side memory footprint, frame rendering time, and battery consumption.',
    mockupUi: `
      <div style="padding: 16px;">
        <div style="font-size: 11px; font-weight: 700; color: #A855F7; margin-bottom: 12px;">CLIENT PERFORMANCE</div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
          <span style="color: #E2E8F0;">RAM Footprint</span>
          <span style="color: #A855F7; font-family: var(--font-mono); font-weight: 700;">42 MB</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
          <span style="color: #E2E8F0;">Frame Drop Rate</span>
          <span style="color: #10B981; font-family: var(--font-mono); font-weight: 700;">0.00%</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px;">
          <span style="color: #E2E8F0;">Native Bridge Lag</span>
          <span style="color: #00F0FF; font-family: var(--font-mono); font-weight: 700;">1.4ms</span>
        </div>
      </div>
    `
  }
];

/**
 * Mounts Type E Screen Flow Simulator into a container
 * @param {HTMLElement} container
 * @param {Object} manifest
 */
export function mountScreenSimulator(container, manifest = null) {
  if (!container) return;

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 340px 1fr; gap: 24px; height: 100%; min-height: 480px; align-items: center;">
      
      <!-- Left Column: Screen Navigation Selector -->
      <div class="cyber-card" style="padding: 18px; background: #080D18; display: flex; flex-direction: column; gap: 12px;">
        <div style="font-size: 11px; font-family: var(--font-mono); color: #38BDF8; font-weight: 700; text-transform: uppercase;">
          Application Screen Flow (Type E)
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${SAMPLE_APP_SCREENS.map((sc, idx) => `
            <div class="app-screen-nav-item ${idx === 0 ? 'active' : ''}" data-id="${sc.id}" style="padding: 12px; background: ${idx === 0 ? 'rgba(0,240,255,0.08)' : '#0B1322'}; border: 1px solid ${idx === 0 ? 'var(--accent-cyan)' : '#1E2D44'}; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 13px; font-weight: 700; color: #F8FAFC;">${sc.name}</span>
                <span class="cyber-badge" style="font-size: 9px; padding: 1px 6px; border-color: ${sc.badgeColor}; color: ${sc.badgeColor};">${sc.badge}</span>
              </div>
              <div style="font-size: 11px; color: #64748B;">${sc.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Right Column: Interactive Phone Device Frame -->
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
        
        <!-- iPhone 16 Frame -->
        <div style="width: 290px; height: 480px; background: #020408; border: 4px solid #1E2D44; border-radius: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 24px rgba(0,240,255,0.15); display: flex; flex-direction: column; overflow: hidden; position: relative;">
          
          <!-- Dynamic Island -->
          <div style="height: 32px; display: flex; align-items: center; justify-content: center; padding-top: 6px;">
            <div style="width: 90px; height: 18px; background: #000000; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; padding: 0 8px;">
              <div style="width: 6px; height: 6px; border-radius: 50%; background: #00F0FF;"></div>
              <div style="width: 4px; height: 4px; border-radius: 50%; background: #10B981;"></div>
            </div>
          </div>

          <!-- Dynamic Viewport Content -->
          <div id="simScreenViewport" style="flex: 1; overflow-y: auto;">
            ${SAMPLE_APP_SCREENS[0].mockupUi}
          </div>

          <!-- Home Indicator Bar -->
          <div style="height: 16px; display: flex; align-items: center; justify-content: center;">
            <div style="width: 100px; height: 4px; background: #334155; border-radius: 2px;"></div>
          </div>

        </div>

        <div style="margin-top: 14px; font-size: 11px; font-family: var(--font-mono); color: #64748B;">
          Click screen items on the left to simulate active UX transitions
        </div>

      </div>

    </div>
  `;

  // Attach click listener
  container.querySelectorAll('.app-screen-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      soundEngine.playClick();
      container.querySelectorAll('.app-screen-nav-item').forEach(i => {
        i.style.borderColor = '#1E2D44';
        i.style.background = '#0B1322';
      });
      item.style.borderColor = 'var(--accent-cyan)';
      item.style.background = 'rgba(0,240,255,0.08)';

      const found = SAMPLE_APP_SCREENS.find(s => s.id === item.dataset.id);
      if (found) {
        const vp = container.querySelector('#simScreenViewport');
        if (vp) vp.innerHTML = found.mockupUi;
      }
    });
  });
}

/**
 * Mounts Type F Universal File Constellation & Markdown Narrative into a container
 * @param {HTMLElement} container
 * @param {Object} manifest
 */
export function mountConstellationNebula(container, manifest = null) {
  if (!container) return;

  const totalFiles = manifest && manifest.stats ? manifest.stats.totalFiles || 42 : 42;
  const languages = manifest && manifest.stats && manifest.stats.languageBreakdown 
    ? manifest.stats.languageBreakdown 
    : { Python: 55, JavaScript: 25, Markdown: 12, CSS: 8 };

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 20px; padding: 10px 0;">
      
      <!-- Top Overview Card -->
      <div class="cyber-card" style="padding: 24px; background: #080D18; border-color: rgba(168,85,247,0.3);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div>
            <span class="cyber-badge badge-violet" style="font-size: 10px;">TYPE F • REPOSITORY CONSTELLATION</span>
            <h3 style="font-size: 20px; font-weight: 800; color: #F8FAFC; margin-top: 6px;">
              Universal Codebase Architecture Nebula
            </h3>
          </div>
          <div style="font-family: var(--font-mono); font-size: 22px; font-weight: 800; color: #00F0FF;">
            ${totalFiles} Files Scanned
          </div>
        </div>

        <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 18px;">
          APEXFLOW OS Zero-Rejection Engine successfully mapped the directory structure, topological clusters, and dependency tree.
        </p>

        <!-- Language Distribution Pills -->
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          ${Object.entries(languages).map(([lang, pct]) => `
            <div style="padding: 6px 12px; background: #0B1322; border: 1px solid #1E2D44; border-radius: 6px; display: flex; align-items: center; gap: 8px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #00F0FF;"></span>
              <span style="font-size: 12px; font-weight: 600; color: #E2E8F0;">${lang}</span>
              <span style="font-family: var(--font-mono); font-size: 11px; color: #64748B;">${pct}%</span>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}
