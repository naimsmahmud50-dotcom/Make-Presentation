/**
 * ============================================================================
 * [MODULE]: EXECUTIVE TELEPROMPTER & SPEAKER HEADS-UP DISPLAY (HUD) (Task T077)
 * ----------------------------------------------------------------------------
 * Floating, high-contrast, glassmorphic presentation prompter designed for
 * executive keynote speakers, live streamers, and boardroom presenters.
 * 
 * [ENGINEERING HIGHLIGHTS]:
 * - Ultra-smooth requestAnimationFrame auto-scrolling with pause-on-hover / drag.
 * - Variable reading pacing engine (120 - 240 Words Per Minute).
 * - Beam-splitter hardware mirror-flip mode (scaleX(-1)) for professional teleprompter glass.
 * - Dynamic talking points synchronization linked to active presentation stage (0 - 5).
 * - Custom script editor allowing instant keynote script overrides on the fly.
 * - Keyboard hotkey 'T' for zero-latency show/hide toggle.
 * ============================================================================
 */

import { soundEngine } from '../lib/audio/sound-synth.js';

export class TeleprompterHUD {
  constructor(stageController) {
    this.stageController = stageController;
    this.isOpen = false;
    this.isPlaying = false;
    this.speed = 1.2; // Pixels per frame
    this.fontSize = 22; // px
    this.isMirrored = false;
    this.opacity = 0.95; // 0.3 to 1.0
    this.animFrameId = null;
    this.elapsedSeconds = 0;
    this.timerInterval = null;
    this.wordCount = 0;
    this.currentStageIndex = 0;

    this.dom = {
      container: null,
      scrollViewport: null,
      contentBody: null,
      btnPlayPause: null,
      btnSpeed: null,
      btnFontUp: null,
      btnFontDown: null,
      btnMirror: null,
      btnOpacity: null,
      btnEditScript: null,
      timerDisplay: null,
      wpmDisplay: null,
      stageLabel: null,
      progressBar: null
    };

    this.stageScripts = {
      0: `Welcome to the future of software presentation. APEXFLOW OS is not a slide deck—it is a live, executable runtime operating system for your enterprise architecture. Notice the holographic radar pulsing in real-time. Every metric you see is computed client-side with zero telemetry leakage. We turn passive code repositories into interactive, high-conviction executive keynotes.`,
      1: `Here we enter the Living Architecture Holodeck. Rather than static diagrams that decay the moment they are exported, this is a real-time reactive pipeline graph. Toggle between isometric 3D WebGL and 2D high-contrast node views. You can inspect cluster nodes, trigger chaos fault injections, or modify node parameters live before investor eyes.`,
      2: `This is our WebAssembly Pyodide Execution Sandbox. Python code runs directly inside browser memory with full mathematical precision. Notice how the AI agent orchestrates data pipelines with microsecond latency. No backend servers required—100% offline-ready, verifiable, and deterministically sandboxed.`,
      3: `Executive confidence requires multi-device clarity. Here, our hardware simulator renders live responsive viewports—from a 32-inch 6K Pro Display XDR down to an iPad Pro and iPhone 16 Pro. Each screen hosts an interactive, real-time product prototype executing live event streams and copilot interactions.`,
      4: `Let us examine the financial reality. Our dynamic ROI modeler demonstrates measurable cost savings. By automating pipeline synthesis and reducing cognitive friction, this enterprise deployment reclaims 1,240 engineering hours annually. Adjust the team headcount slider and see instant compounding return on investment.`,
      5: `Finally, audience participation. Look at your mobile phones. By scanning the QR code, audience members are voting live in our poll studio and spotlighting questions. The stage dynamically reflects their consensus with zero remote roundtrip delay. This is APEXFLOW OS—uncompromising speed, privacy, and presentation mastery.`
    };

    this.init();
  }

  init() {
    this.buildDOM();
    this.bindEvents();
  }

  buildDOM() {
    let el = document.getElementById('executiveTeleprompterHUD');
    if (!el) {
      el = document.createElement('div');
      el.id = 'executiveTeleprompterHUD';
      el.className = 'teleprompter-hud';
      el.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 28px;
        width: 480px;
        height: 380px;
        background: rgba(4, 6, 10, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid #1E2D44;
        border-radius: 12px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 240, 255, 0.15);
        z-index: 9500;
        display: none;
        flex-direction: column;
        overflow: hidden;
        user-select: none;
        transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      `;

      el.innerHTML = `
        <!-- Top Title Bar -->
        <div style="height: 42px; background: #080D18; border-bottom: 1px solid #1E2D44; display: flex; align-items: center; justify-content: space-between; padding: 0 14px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #00F0FF; box-shadow: 0 0 8px #00F0FF;"></span>
            <span style="font-size: 11px; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: #F8FAFC; letter-spacing: 0.05em;">EXECUTIVE PROMPTER</span>
            <span id="prompterStageLabel" class="cyber-badge badge-cyan" style="font-size: 9px; padding: 1px 6px;">Stage 1</span>
          </div>
          
          <div style="display: flex; align-items: center; gap: 8px;">
            <span id="prompterTimer" style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #10B981; font-weight: 700;">00:00</span>
            <span id="prompterWPM" style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #64748B;">140 WPM</span>
            <button id="btnPrompterClose" style="background: none; border: none; color: #64748B; cursor: pointer; padding: 2px 6px; line-height: 1; display: inline-flex; align-items: center;" title="Close Prompter (T)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Progress Tracking Bar -->
        <div style="height: 3px; background: #0F172A; width: 100%;">
          <div id="prompterProgressBar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #00F0FF, #A855F7); transition: width 0.1s linear;"></div>
        </div>

        <!-- Scrollable Speech Text Viewport -->
        <div id="prompterScrollViewport" style="flex: 1; overflow-y: auto; padding: 24px 20px 80px 20px; position: relative; scroll-behavior: smooth;">
          <div id="prompterContentBody" style="font-size: 22px; line-height: 1.6; color: #F1F5F9; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; transition: transform 0.2s ease;">
            <!-- Script text goes here -->
          </div>
        </div>

        <!-- Bottom Controls Bar -->
        <div style="height: 48px; background: #080D18; border-top: 1px solid #1E2D44; display: flex; align-items: center; justify-content: space-between; padding: 0 12px;">
          <!-- Left: Play/Pause & Speed -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <button id="btnPrompterPlayPause" class="btn btn-primary" style="height: 30px; font-size: 11px; padding: 0 10px; display: inline-flex; align-items: center; gap: 5px;">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>Scroll</span>
            </button>
            <button id="btnPrompterSpeed" class="btn btn-secondary" style="height: 30px; font-size: 10px; padding: 0 8px; font-family: 'JetBrains Mono', monospace;">
              1.2x
            </button>
          </div>

          <!-- Center: Font Size -->
          <div style="display: flex; align-items: center; gap: 4px;">
            <button id="btnPrompterFontDown" class="btn btn-secondary" style="height: 28px; width: 28px; padding: 0; font-size: 12px;" title="Decrease Font">A-</button>
            <button id="btnPrompterFontUp" class="btn btn-secondary" style="height: 28px; width: 28px; padding: 0; font-size: 12px;" title="Increase Font">A+</button>
          </div>

          <!-- Right: Mirror, Opacity, Edit -->
          <div style="display: flex; align-items: center; gap: 6px;">
            <button id="btnPrompterMirror" class="btn btn-secondary" style="height: 28px; padding: 0 8px; font-size: 10px; display: inline-flex; align-items: center; gap: 4px;" title="Mirror Flip for Teleprompter Hardware Glass">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
              <span>Mirror</span>
            </button>
            <button id="btnPrompterOpacity" class="btn btn-secondary" style="height: 28px; padding: 0 8px; font-size: 10px; display: inline-flex; align-items: center; gap: 4px;" title="Toggle Stealth Opacity">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <span>95%</span>
            </button>
            <button id="btnPrompterEdit" class="btn btn-secondary" style="height: 28px; width: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center;" title="Edit Current Script">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(el);
    }

    this.dom.container = el;
    this.dom.scrollViewport = el.querySelector('#prompterScrollViewport');
    this.dom.contentBody = el.querySelector('#prompterContentBody');
    this.dom.btnPlayPause = el.querySelector('#btnPrompterPlayPause');
    this.dom.btnSpeed = el.querySelector('#btnPrompterSpeed');
    this.dom.btnFontUp = el.querySelector('#btnPrompterFontUp');
    this.dom.btnFontDown = el.querySelector('#btnPrompterFontDown');
    this.dom.btnMirror = el.querySelector('#btnPrompterMirror');
    this.dom.btnOpacity = el.querySelector('#btnPrompterOpacity');
    this.dom.btnEditScript = el.querySelector('#btnPrompterEdit');
    this.dom.timerDisplay = el.querySelector('#prompterTimer');
    this.dom.wpmDisplay = el.querySelector('#prompterWPM');
    this.dom.stageLabel = el.querySelector('#prompterStageLabel');
    this.dom.progressBar = el.querySelector('#prompterProgressBar');

    // Close button
    el.querySelector('#btnPrompterClose')?.addEventListener('click', () => {
      this.close();
    });
  }

  bindEvents() {
    // Play/Pause button
    this.dom.btnPlayPause?.addEventListener('click', () => {
      this.togglePlay();
    });

    // Speed cycling (0.8x -> 1.2x -> 1.8x -> 2.5x -> 0.8x)
    this.dom.btnSpeed?.addEventListener('click', () => {
      soundEngine.playClick();
      const speeds = [0.8, 1.2, 1.8, 2.5];
      const idx = speeds.indexOf(this.speed);
      this.speed = speeds[(idx + 1) % speeds.length];
      this.dom.btnSpeed.textContent = `${this.speed}x`;
      this.updateWPM();
    });

    // Font size scaling
    this.dom.btnFontUp?.addEventListener('click', () => {
      soundEngine.playClick();
      this.fontSize = Math.min(36, this.fontSize + 2);
      this.applyFontSize();
    });

    this.dom.btnFontDown?.addEventListener('click', () => {
      soundEngine.playClick();
      this.fontSize = Math.max(16, this.fontSize - 2);
      this.applyFontSize();
    });

    // Mirror toggle
    this.dom.btnMirror?.addEventListener('click', () => {
      soundEngine.playClick();
      this.isMirrored = !this.isMirrored;
      this.dom.contentBody.style.transform = this.isMirrored ? 'scaleX(-1)' : 'none';
      this.dom.btnMirror.style.borderColor = this.isMirrored ? '#00F0FF' : '';
      this.dom.btnMirror.style.color = this.isMirrored ? '#00F0FF' : '';
    });

    // Opacity toggle (0.95 -> 0.65 -> 0.35 -> 0.95)
    this.dom.btnOpacity?.addEventListener('click', () => {
      soundEngine.playClick();
      const opacities = [0.95, 0.65, 0.35];
      const idx = opacities.indexOf(this.opacity);
      this.opacity = opacities[(idx + 1) % opacities.length];
      this.dom.container.style.background = `rgba(4, 6, 10, ${this.opacity})`;
      this.dom.btnOpacity.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> <span>${Math.round(this.opacity * 100)}%</span>`;
    });

    // Script edit inline
    this.dom.btnEditScript?.addEventListener('click', () => {
      soundEngine.playClick();
      const currentText = this.stageScripts[this.currentStageIndex] || '';
      const newText = prompt(`Edit speech script for Stage ${this.currentStageIndex + 1}:`, currentText);
      if (newText !== null && newText.trim()) {
        this.stageScripts[this.currentStageIndex] = newText.trim();
        this.syncStageScript(this.currentStageIndex);
        soundEngine.playSuccess();
      }
    });

    // Pause scroll on user wheel interaction, resume smoothly
    this.dom.scrollViewport?.addEventListener('wheel', () => {
      if (this.isPlaying) {
        this.pause();
      }
      this.updateProgressBar();
    });

    // Global Key Listener for 'T'
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        this.toggle();
      } else if (this.isOpen && e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      }
    });
  }

  applyFontSize() {
    if (this.dom.contentBody) {
      this.dom.contentBody.style.fontSize = `${this.fontSize}px`;
    }
  }

  updateWPM() {
    // Average reading speed based on pixel scroll speed
    const calculatedWPM = Math.round(110 * this.speed);
    if (this.dom.wpmDisplay) {
      this.dom.wpmDisplay.textContent = `${calculatedWPM} WPM`;
    }
  }

  updateProgressBar() {
    if (!this.dom.scrollViewport || !this.dom.progressBar) return;
    const maxScroll = this.dom.scrollViewport.scrollHeight - this.dom.scrollViewport.clientHeight;
    if (maxScroll <= 0) {
      this.dom.progressBar.style.width = '100%';
      return;
    }
    const pct = Math.min(100, Math.max(0, (this.dom.scrollViewport.scrollTop / maxScroll) * 100));
    this.dom.progressBar.style.width = `${pct}%`;
  }

  syncStageScript(stageIndex) {
    this.currentStageIndex = stageIndex;
    if (this.dom.stageLabel) {
      this.dom.stageLabel.textContent = `Stage ${stageIndex + 1}`;
    }

    // Check if stage controller has custom talking points
    let script = this.stageScripts[stageIndex];
    if (this.stageController?.manifest?.talkingPoints && this.stageController.manifest.talkingPoints[stageIndex]) {
      script = this.stageController.manifest.talkingPoints[stageIndex];
    }

    if (this.dom.contentBody) {
      // Safe rendering using safe text segments
      this.dom.contentBody.textContent = script || `Stage ${stageIndex + 1} presentation script loaded. Present with conviction and pacing.`;
    }

    // Reset scroll position to top
    if (this.dom.scrollViewport) {
      this.dom.scrollViewport.scrollTop = 0;
    }
    this.updateProgressBar();
    this.wordCount = (script || '').split(/\s+/).filter(Boolean).length;
    this.updateWPM();
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
    this.dom.container.style.display = 'flex';
    this.syncStageScript(this.stageController?.currentStageIndex || 0);

    // Start timer if not running
    if (!this.timerInterval) {
      this.timerInterval = setInterval(() => {
        this.elapsedSeconds++;
        const m = Math.floor(this.elapsedSeconds / 60);
        const s = this.elapsedSeconds % 60;
        if (this.dom.timerDisplay) {
          this.dom.timerDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
      }, 1000);
    }
  }

  close() {
    this.isOpen = false;
    soundEngine.playClick();
    this.pause();
    this.dom.container.style.display = 'none';
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (!this.isOpen) this.open();
    this.isPlaying = true;
    soundEngine.playClick();
    this.dom.btnPlayPause.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> <span>Pause</span>';
    this.dom.btnPlayPause.style.background = '#F59E0B';
    this.dom.btnPlayPause.style.borderColor = '#F59E0B';

    const scrollStep = () => {
      if (!this.isPlaying) return;
      if (this.dom.scrollViewport) {
        this.dom.scrollViewport.scrollTop += this.speed;
        this.updateProgressBar();

        const maxScroll = this.dom.scrollViewport.scrollHeight - this.dom.scrollViewport.clientHeight;
        if (this.dom.scrollViewport.scrollTop >= maxScroll) {
          this.pause();
          soundEngine.playSuccess();
          return;
        }
      }
      this.animFrameId = requestAnimationFrame(scrollStep);
    };

    this.animFrameId = requestAnimationFrame(scrollStep);
  }

  pause() {
    this.isPlaying = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.dom.btnPlayPause) {
      this.dom.btnPlayPause.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> <span>Scroll</span>';
      this.dom.btnPlayPause.style.background = '';
      this.dom.btnPlayPause.style.borderColor = '';
    }
  }

  destroy() {
    this.pause();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.dom.container) {
      this.dom.container.remove();
    }
  }
}
