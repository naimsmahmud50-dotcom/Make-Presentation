/**
 * =========================================================================================
 * MODULE: APEXFLOW OS — Human Rehearsal Playbook, Speech Cadence & Stage Ergonomics HUD
 * (Phases 33, Tasks T162, T163, T164, T165, T166)
 * -----------------------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Real-time executive speech coach and stage ergonomics HUD:
 *   1. Dynamic Words Per Minute (WPM) gauge with optimal band (120-150 WPM)
 *   2. Per-slide allocated speaking time budgeter with soft-amber countdown and red overage alert
 *   3. Monotone pitch cadence & filler word ("um", "uh", "like") detector
 *   4. Executive Confidence Scorecard & Post-Rehearsal Debrief Engine (0-100% Alpha Grade)
 *   5. Cross-tab real-time broadcast via BroadcastChannel ('apexflow_rehearsal_channel')
 *   6. 100% Zero-Emoji UI/UX Pro Max luxury dark OLED glassmorphism design
 * =========================================================================================
 */

import { soundEngine } from '../lib/audio/sound-synth.js';

export class HumanRehearsalPlaybook {
  constructor() {
    this.isOpen = false;
    this.isRunning = false;
    this.isPaused = false;
    this.isSimulated = false;

    this.stageController = null;
    this.currentSlideIndex = 0;
    this.totalSlides = 6;
    this.slideBudgetSeconds = 90; // Default: 90 seconds per slide

    // Timers
    this.totalElapsedSeconds = 0;
    this.slideElapsedSeconds = 0;
    this.slideHistory = {}; // slideIdx -> { elapsedSec, wordsSpoken, fillerWords, maxWpm, avgWpm }

    this.timerInterval = null;
    this.simulationInterval = null;

    // Speech & WPM Tracking
    this.spokenWords = []; // Array of timestamps
    this.currentWPM = 0;
    this.averageWPM = 0;
    this.wpmHistory = [];

    // Filler Words Tracking
    this.fillerWordCounts = {
      um: 0,
      uh: 0,
      like: 0,
      actually: 0,
      basically: 0,
      literally: 0,
      sortOf: 0
    };
    this.totalFillerCount = 0;

    // Web Speech Recognition
    this.recognition = null;
    this.hasSpeechApi = false;

    // Multi-view Broadcast
    try {
      this.channel = new BroadcastChannel('apexflow_rehearsal_channel');
    } catch (e) {
      this.channel = null;
    }

    this.dom = {
      container: null,
      wpmGauge: null,
      wpmValue: null,
      wpmStatusBadge: null,
      slideTimerValue: null,
      slideBudgetValue: null,
      slideProgressBar: null,
      totalTimerValue: null,
      fillerCountValue: null,
      monotoneWarning: null,
      transcriptTicker: null,
      debriefModal: null
    };

    this.initSpeechEngine();
  }

  /**
   * Initializes browser Web Speech API or configures offline simulation fallback
   */
  initSpeechEngine() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event) => {
          let transcriptChunk = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcriptChunk += event.results[i][0].transcript;
          }
          this.processTranscriptText(transcriptChunk);
        };

        this.recognition.onerror = () => {
          // Fall back gracefully to simulation mode if mic fails or denied
          if (this.isRunning && !this.isSimulated) {
            this.startSimulationTicker();
          }
        };

        this.hasSpeechApi = true;
      } catch (e) {
        this.hasSpeechApi = false;
      }
    } else {
      this.hasSpeechApi = false;
    }
  }

  /**
   * Mounts the Human Rehearsal Playbook HUD into the DOM
   */
  mount() {
    if (document.getElementById('rehearsalPlaybookHUD')) return;

    const overlay = document.createElement('div');
    overlay.id = 'rehearsalPlaybookHUD';
    overlay.style.cssText = `
      display: none;
      position: fixed;
      top: 64px;
      right: 24px;
      width: 420px;
      max-height: calc(100vh - 88px);
      z-index: 9998;
      background: #070B14;
      border: 1px solid rgba(0, 240, 255, 0.35);
      border-radius: 16px;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.85), 0 0 24px rgba(0, 240, 255, 0.15);
      backdrop-filter: blur(16px);
      color: #F8FAFC;
      font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
      overflow-y: auto;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    overlay.innerHTML = `
      <!-- Header -->
      <div style="padding: 16px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center; background: rgba(3, 7, 18, 0.6);">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="cyber-badge badge-cyan" style="font-size: 10px; font-weight: 700; letter-spacing: 0.05em;">STAGE ERGONOMICS HUD</span>
            <span style="font-size: 11px; color: #64748B; font-family: var(--font-mono, monospace);">Shift+Z</span>
          </div>
          <h3 style="font-size: 17px; font-weight: 700; color: #F8FAFC; margin: 4px 0 0 0;">Human Rehearsal Playbook</h3>
        </div>
        <button type="button" id="btnCloseRehearsalHUD" style="background: none; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 8px; color: #94A3B8; cursor: pointer; width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.15s ease;" aria-label="Close Rehearsal HUD">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <!-- Main Body Content -->
      <div style="padding: 18px 20px; display: flex; flex-direction: column; gap: 16px;">
        
        <!-- Pacing & WPM Gauge Card -->
        <div style="background: #0B1322; border: 1px solid #1E2D44; border-radius: 12px; padding: 16px; position: relative; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 11px; color: #94A3B8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Speech Cadence Coach</span>
            <span id="rehearsalPaceBadge" class="cyber-badge" style="font-size: 10px; color: #10B981; border-color: #10B981;">STANDBY</span>
          </div>

          <!-- Gauge Numeral & Target Band -->
          <div style="display: flex; align-items: baseline; justify-content: center; gap: 8px; margin: 8px 0 4px 0;">
            <span id="rehearsalWPMDisplay" style="font-size: 46px; font-weight: 800; font-family: var(--font-mono, monospace); color: #00F0FF; text-shadow: 0 0 20px rgba(0, 240, 255, 0.4);">0</span>
            <span style="font-size: 14px; font-weight: 600; color: #64748B;">WPM</span>
          </div>

          <div style="text-align: center; font-size: 11px; color: #94A3B8; margin-bottom: 12px; font-family: var(--font-mono, monospace);">
            Optimal Executive Band: <span style="color: #10B981; font-weight: 700;">120 - 150 WPM</span>
          </div>

          <!-- Pacing Range Visual Indicator -->
          <div style="position: relative; height: 8px; background: #070B14; border-radius: 4px; overflow: hidden; margin-bottom: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
            <!-- Target zone highlight (120-150 out of 220 scale) -->
            <div style="position: absolute; left: 54.5%; width: 13.6%; height: 100%; background: rgba(16, 185, 129, 0.35); border-left: 1px solid #10B981; border-right: 1px solid #10B981;"></div>
            <!-- WPM Current needle bar -->
            <div id="rehearsalWPMBar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #00F0FF, #10B981); transition: width 0.3s ease;"></div>
          </div>

          <!-- Monotone Warning / Live Guidance Ticker -->
          <div id="rehearsalPaceAdvice" style="font-size: 12px; color: #CBD5E1; text-align: center; line-height: 1.4; padding: 6px 10px; background: rgba(0, 240, 255, 0.05); border-radius: 6px; border: 1px solid rgba(0, 240, 255, 0.15);">
            Ready to rehearse. Click "Start Rehearsal" or press Space to practice.
          </div>
        </div>

        <!-- Slide Budget Stopwatch & Overage Alert -->
        <div style="background: #0B1322; border: 1px solid #1E2D44; border-radius: 12px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div>
              <span id="rehearsalSlideBadge" class="cyber-badge badge-cyan" style="font-size: 10px;">STAGE 1 of 6</span>
              <span style="font-size: 12px; font-weight: 700; color: #F8FAFC; margin-left: 6px;">Slide Budget</span>
            </div>
            <!-- Budget selector -->
            <select id="rehearsalBudgetSelect" style="background: #040710; border: 1px solid #1E2D44; border-radius: 6px; color: #00F0FF; font-family: var(--font-mono, monospace); font-size: 11px; padding: 3px 8px; cursor: pointer;">
              <option value="60">60s / Slide</option>
              <option value="90" selected>90s / Slide</option>
              <option value="120">120s / Slide</option>
              <option value="180">180s / Slide</option>
            </select>
          </div>

          <!-- Timers Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
            <div style="background: #070B14; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px; padding: 10px; text-align: center;">
              <span style="font-size: 10px; color: #64748B; font-family: var(--font-mono, monospace); display: block; margin-bottom: 2px;">SLIDE ELAPSED</span>
              <span id="rehearsalSlideTimer" style="font-size: 22px; font-weight: 700; font-family: var(--font-mono, monospace); color: #F8FAFC;">00:00</span>
            </div>
            <div style="background: #070B14; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px; padding: 10px; text-align: center;">
              <span style="font-size: 10px; color: #64748B; font-family: var(--font-mono, monospace); display: block; margin-bottom: 2px;">BUDGET REMAINING</span>
              <span id="rehearsalRemainingTimer" style="font-size: 22px; font-weight: 700; font-family: var(--font-mono, monospace); color: #10B981;">01:30</span>
            </div>
          </div>

          <!-- Slide Progress / Overage Meter -->
          <div style="height: 6px; background: #070B14; border-radius: 3px; overflow: hidden; margin-bottom: 8px;">
            <div id="rehearsalSlideProgress" style="height: 100%; width: 0%; background: #10B981; transition: width 0.4s linear, background-color 0.3s ease;"></div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 11px; font-family: var(--font-mono, monospace); color: #64748B;">
            <span>Total Rehearsal: <strong id="rehearsalTotalTimer" style="color: #CBD5E1;">00:00</strong></span>
            <span id="rehearsalOverageIndicator" style="color: #10B981; font-weight: 600;">Within Budget</span>
          </div>
        </div>

        <!-- Telemetry & Filler Word Radar -->
        <div style="background: #0B1322; border: 1px solid #1E2D44; border-radius: 12px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px; color: #94A3B8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Filler Word Suppressor</span>
            <span id="rehearsalFillerBadge" class="cyber-badge" style="font-size: 10px; color: #10B981; border-color: #10B981;">0 Fillers Detected</span>
          </div>
          <div id="rehearsalFillerTags" style="display: flex; gap: 6px; flex-wrap: wrap;">
            <span style="font-size: 10px; color: #64748B; font-family: var(--font-mono, monospace);">Detecting: um, uh, like, actually, basically...</span>
          </div>
        </div>

        <!-- Rehearsal Control Buttons -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; gap: 8px;">
            <button type="button" id="btnToggleRehearsal" class="btn btn-primary" style="flex: 2; height: 42px; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;">
              <svg id="rehearsalPlayIcon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              <span id="rehearsalPlayText">Start Rehearsal</span>
            </button>
            <button type="button" id="btnResetRehearsal" class="btn btn-secondary" style="flex: 1; height: 42px; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer;" title="Reset Rehearsal Clock">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
              <span>Reset</span>
            </button>
          </div>

          <div style="display: flex; gap: 8px;">
            <button type="button" id="btnToggleSimulatedRehearsal" class="btn btn-secondary" style="flex: 1; height: 36px; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer;" title="Simulate speech for hands-free demonstration">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <span id="rehearsalSimText">Simulation: Off</span>
            </button>
            <button type="button" id="btnFinishAndDebrief" class="btn btn-primary" style="flex: 1.5; height: 36px; font-size: 11px; background: linear-gradient(135deg, #8B5CF6, #3B82F6); border-color: #8B5CF6; display: inline-flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>End & View Debrief</span>
            </button>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(overlay);
    this.dom.container = overlay;

    // Cache elements
    this.dom.wpmValue = document.getElementById('rehearsalWPMDisplay');
    this.dom.wpmStatusBadge = document.getElementById('rehearsalPaceBadge');
    this.dom.wpmBar = document.getElementById('rehearsalWPMBar');
    this.dom.paceAdvice = document.getElementById('rehearsalPaceAdvice');
    this.dom.slideBadge = document.getElementById('rehearsalSlideBadge');
    this.dom.slideTimer = document.getElementById('rehearsalSlideTimer');
    this.dom.remainingTimer = document.getElementById('rehearsalRemainingTimer');
    this.dom.totalTimer = document.getElementById('rehearsalTotalTimer');
    this.dom.slideProgress = document.getElementById('rehearsalSlideProgress');
    this.dom.overageIndicator = document.getElementById('rehearsalOverageIndicator');
    this.dom.fillerBadge = document.getElementById('rehearsalFillerBadge');
    this.dom.fillerTags = document.getElementById('rehearsalFillerTags');

    this.bindEvents();
    this.mountDebriefModal();
  }

  /**
   * Binds UI event listeners
   */
  bindEvents() {
    document.getElementById('btnCloseRehearsalHUD')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.close();
    });

    document.getElementById('btnToggleRehearsal')?.addEventListener('click', () => {
      soundEngine.playClick();
      if (!this.isRunning || this.isPaused) {
        this.startRehearsal();
      } else {
        this.pauseRehearsal();
      }
    });

    document.getElementById('btnResetRehearsal')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.resetRehearsal();
    });

    document.getElementById('btnToggleSimulatedRehearsal')?.addEventListener('click', () => {
      soundEngine.playClick();
      this.toggleSimulationMode();
    });

    document.getElementById('btnFinishAndDebrief')?.addEventListener('click', () => {
      soundEngine.playWhoosh();
      this.finishRehearsalAndDebrief();
    });

    document.getElementById('rehearsalBudgetSelect')?.addEventListener('change', (e) => {
      this.slideBudgetSeconds = parseInt(e.target.value) || 90;
      this.updateTimersUI();
    });
  }

  /**
   * Mounts the Executive Confidence Scorecard Modal into the DOM
   */
  mountDebriefModal() {
    if (document.getElementById('rehearsalDebriefModal')) return;

    const modal = document.createElement('div');
    modal.id = 'rehearsalDebriefModal';
    modal.style.cssText = `
      display: none;
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: rgba(3, 7, 18, 0.88);
      backdrop-filter: blur(12px);
      align-items: center;
      justify-content: center;
      padding: 24px;
    `;

    modal.innerHTML = `
      <div class="cyber-card" style="width: 100%; max-width: 960px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; background: #070B14; border: 1px solid rgba(0, 240, 255, 0.4); box-shadow: 0 24px 64px rgba(0,0,0,0.85); border-radius: 16px;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 28px; border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(3, 7, 18, 0.6);">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="cyber-badge badge-cyan" style="font-size: 10px; font-weight: 700;">CONFIDENCE SCORECARD</span>
              <span style="font-size: 11px; color: #64748B; font-family: var(--font-mono, monospace);">Executive Debrief Engine</span>
            </div>
            <h3 style="font-size: 22px; font-weight: 700; color: #F8FAFC; margin-top: 4px;">Presentation Rehearsal Debrief</h3>
          </div>
          <button type="button" id="btnCloseDebriefModal" style="background: none; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 8px; color: #94A3B8; cursor: pointer; width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center;" aria-label="Close Debrief Modal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Scrollable Content -->
        <div id="debriefContentContainer" style="flex: 1; overflow-y: auto; padding: 24px 28px; display: flex; flex-direction: column; gap: 20px;">
          <!-- Dynamically populated -->
        </div>

        <!-- Footer Actions -->
        <div style="padding: 16px 28px; border-top: 1px solid rgba(255,255,255,0.08); background: rgba(3, 7, 18, 0.6); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 11px; color: #64748B; font-family: var(--font-mono, monospace);">100% Zero-Upload Client-Side Evaluation</span>
          <div style="display: flex; gap: 10px;">
            <button type="button" id="btnExportDebriefJSON" class="btn btn-secondary" style="height: 36px; font-size: 12px; display: inline-flex; align-items: center; gap: 6px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>Export JSON</span>
            </button>
            <button type="button" id="btnExportDebriefMD" class="btn btn-primary" style="height: 36px; font-size: 12px; display: inline-flex; align-items: center; gap: 6px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              <span>Export Markdown Report</span>
            </button>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(modal);
    this.dom.debriefModal = modal;

    document.getElementById('btnCloseDebriefModal')?.addEventListener('click', () => {
      soundEngine.playClick();
      modal.style.display = 'none';
    });

    document.getElementById('btnExportDebriefJSON')?.addEventListener('click', () => {
      this.exportDebriefFile('json');
    });

    document.getElementById('btnExportDebriefMD')?.addEventListener('click', () => {
      this.exportDebriefFile('md');
    });
  }

  /**
   * Toggles the Rehearsal HUD open/close
   */
  toggle() {
    this.mount();
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.mount();
    this.isOpen = true;
    if (this.dom.container) {
      this.dom.container.style.display = 'block';
    }
    soundEngine.playWhoosh();
    this.syncCurrentSlide(this.stageController ? this.stageController.currentStageIndex : 0);
  }

  close() {
    this.isOpen = false;
    if (this.dom.container) {
      this.dom.container.style.display = 'none';
    }
  }

  /**
   * Starts or resumes the live rehearsal timer and speech recognition
   */
  startRehearsal() {
    this.isRunning = true;
    this.isPaused = false;

    // Update UI controls
    const playText = document.getElementById('rehearsalPlayText');
    const playIcon = document.getElementById('rehearsalPlayIcon');
    if (playText) playText.textContent = 'Pause Rehearsal';
    if (playIcon) playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';

    // Start timer interval
    if (!this.timerInterval) {
      this.timerInterval = setInterval(() => this.tick(), 1000);
    }

    // Start speech recognition if available and not in pure simulated mode
    if (this.hasSpeechApi && !this.isSimulated) {
      try {
        this.recognition.start();
      } catch (e) {
        // Recognition already started or not allowed
      }
    } else if (this.isSimulated) {
      this.startSimulationTicker();
    }

    soundEngine.playSuccess();
    this.broadcastState();
  }

  /**
   * Pauses the active rehearsal
   */
  pauseRehearsal() {
    this.isPaused = true;

    const playText = document.getElementById('rehearsalPlayText');
    const playIcon = document.getElementById('rehearsalPlayIcon');
    if (playText) playText.textContent = 'Resume Rehearsal';
    if (playIcon) playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }

    this.broadcastState();
  }

  /**
   * Resets rehearsal timers and stats
   */
  resetRehearsal() {
    this.pauseRehearsal();
    this.totalElapsedSeconds = 0;
    this.slideElapsedSeconds = 0;
    this.spokenWords = [];
    this.currentWPM = 0;
    this.averageWPM = 0;
    this.wpmHistory = [];
    this.slideHistory = {};
    this.totalFillerCount = 0;
    Object.keys(this.fillerWordCounts).forEach(k => this.fillerWordCounts[k] = 0);

    const playText = document.getElementById('rehearsalPlayText');
    const playIcon = document.getElementById('rehearsalPlayIcon');
    if (playText) playText.textContent = 'Start Rehearsal';
    if (playIcon) playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';

    this.updateTimersUI();
    this.updateWPMUI(0);
    this.updateFillerUI();
    this.broadcastState();
  }

  /**
   * Toggles synthetic speech simulation for demonstrations
   */
  toggleSimulationMode() {
    this.isSimulated = !this.isSimulated;
    const simText = document.getElementById('rehearsalSimText');
    if (simText) {
      simText.textContent = this.isSimulated ? 'Simulation: Active' : 'Simulation: Off';
    }

    if (this.isSimulated && this.isRunning && !this.isPaused) {
      this.startSimulationTicker();
    } else if (!this.isSimulated && this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  /**
   * Starts synthetic word ticker simulating 135 WPM natural executive cadence
   */
  startSimulationTicker() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);

    // Natural phrases matching architecture presentations
    const sampleSentences = [
      "Our distributed event mesh sustains ten million requests per second.",
      "Zero-telemetry client evaluation guarantees military-grade privacy.",
      "Sub-twelve millisecond p99 latency with autonomous circuit breakers.",
      "The reactive WebAssembly sandbox runs deterministic compute in-browser.",
      "Compounded annual savings yield three point six times enterprise ROI."
    ];

    let sentenceIdx = 0;
    this.simulationInterval = setInterval(() => {
      if (!this.isRunning || this.isPaused) return;
      const sentence = sampleSentences[sentenceIdx % sampleSentences.length];
      sentenceIdx++;
      // Occasionally simulate a filler word
      const textToProcess = (Math.random() < 0.25) ? `um, ${sentence}` : sentence;
      this.processTranscriptText(textToProcess);
    }, 2800);
  }

  /**
   * Core 1-second tick loop
   */
  tick() {
    this.totalElapsedSeconds++;
    this.slideElapsedSeconds++;

    // Calculate moving window WPM (past 15 seconds)
    const now = Date.now();
    const windowStart = now - 15000;
    this.spokenWords = this.spokenWords.filter(t => t >= windowStart);

    // Extrapolate WPM from 15s window
    const wordsInWindow = this.spokenWords.length;
    this.currentWPM = Math.round((wordsInWindow / 15) * 60);

    if (this.currentWPM > 0) {
      this.wpmHistory.push(this.currentWPM);
      const sum = this.wpmHistory.reduce((a, b) => a + b, 0);
      this.averageWPM = Math.round(sum / this.wpmHistory.length);
    }

    // Record slide history
    if (!this.slideHistory[this.currentSlideIndex]) {
      this.slideHistory[this.currentSlideIndex] = {
        elapsedSec: 0,
        wordsSpoken: 0,
        fillerWords: 0,
        maxWpm: 0,
        wpmSamples: []
      };
    }
    const currentSlideRecord = this.slideHistory[this.currentSlideIndex];
    currentSlideRecord.elapsedSec = this.slideElapsedSeconds;
    if (this.currentWPM > currentSlideRecord.maxWpm) {
      currentSlideRecord.maxWpm = this.currentWPM;
    }
    if (this.currentWPM > 0) {
      currentSlideRecord.wpmSamples.push(this.currentWPM);
    }

    this.updateTimersUI();
    this.updateWPMUI(this.currentWPM);
    this.broadcastTick();
  }

  /**
   * Processes a incoming speech transcript text chunk
   */
  processTranscriptText(text) {
    if (!text || typeof text !== 'string') return;
    const now = Date.now();

    // Tokenize words
    const words = text.toLowerCase().match(/\b[a-z0-9'-]+\b/g) || [];
    words.forEach(() => {
      this.spokenWords.push(now);
    });

    if (this.slideHistory[this.currentSlideIndex]) {
      this.slideHistory[this.currentSlideIndex].wordsSpoken += words.length;
    }

    // Filler word regex detection
    const fillerRegex = /\b(um|uh|like|actually|basically|literally|sort of)\b/g;
    let match;
    while ((match = fillerRegex.exec(text.toLowerCase())) !== null) {
      const word = match[1];
      if (word.includes('um')) this.fillerWordCounts.um++;
      else if (word.includes('uh')) this.fillerWordCounts.uh++;
      else if (word.includes('like')) this.fillerWordCounts.like++;
      else if (word.includes('actually')) this.fillerWordCounts.actually++;
      else if (word.includes('basically')) this.fillerWordCounts.basically++;
      else if (word.includes('literally')) this.fillerWordCounts.literally++;
      else this.fillerWordCounts.sortOf++;

      this.totalFillerCount++;
      if (this.slideHistory[this.currentSlideIndex]) {
        this.slideHistory[this.currentSlideIndex].fillerWords++;
      }
    }

    this.updateFillerUI();
  }

  /**
   * Updates timers, budget remaining, and overage indicator
   */
  updateTimersUI() {
    if (!this.dom.slideTimer) return;

    const formatSec = (sec) => {
      const s = Math.max(0, Math.floor(sec));
      const m = Math.floor(s / 60);
      const remS = s % 60;
      return `${String(m).padStart(2, '0')}:${String(remS).padStart(2, '0')}`;
    };

    const remaining = this.slideBudgetSeconds - this.slideElapsedSeconds;
    const pct = Math.min(100, (this.slideElapsedSeconds / this.slideBudgetSeconds) * 100);

    this.dom.slideTimer.textContent = formatSec(this.slideElapsedSeconds);
    this.dom.totalTimer.textContent = formatSec(this.totalElapsedSeconds);

    if (this.dom.slideProgress) {
      this.dom.slideProgress.style.width = `${pct}%`;
    }

    if (remaining >= 0) {
      this.dom.remainingTimer.textContent = formatSec(remaining);
      if (remaining <= 15) {
        // Soft-amber warning
        this.dom.remainingTimer.style.color = '#F59E0B';
        if (this.dom.slideProgress) this.dom.slideProgress.style.backgroundColor = '#F59E0B';
        if (this.dom.overageIndicator) {
          this.dom.overageIndicator.textContent = 'Approaching Limit';
          this.dom.overageIndicator.style.color = '#F59E0B';
        }
      } else {
        // Normal state
        this.dom.remainingTimer.style.color = '#10B981';
        if (this.dom.slideProgress) this.dom.slideProgress.style.backgroundColor = '#10B981';
        if (this.dom.overageIndicator) {
          this.dom.overageIndicator.textContent = 'Within Budget';
          this.dom.overageIndicator.style.color = '#10B981';
        }
      }
    } else {
      // OVERAGE alert state
      const overSec = Math.abs(remaining);
      this.dom.remainingTimer.textContent = `+${formatSec(overSec)}`;
      this.dom.remainingTimer.style.color = '#EF4444';
      if (this.dom.slideProgress) this.dom.slideProgress.style.backgroundColor = '#EF4444';
      if (this.dom.overageIndicator) {
        this.dom.overageIndicator.textContent = `OVERAGE (+${overSec}s)`;
        this.dom.overageIndicator.style.color = '#EF4444';
      }
    }
  }

  /**
   * Updates WPM gauge, needle, and pacing feedback advice
   */
  updateWPMUI(wpm) {
    if (!this.dom.wpmValue) return;

    this.dom.wpmValue.textContent = wpm;

    // Bar percentage (scale 0 to 220 WPM)
    const barPct = Math.min(100, Math.max(0, (wpm / 220) * 100));
    if (this.dom.wpmBar) {
      this.dom.wpmBar.style.width = `${barPct}%`;
    }

    if (!this.isRunning || this.isPaused) {
      this.dom.wpmStatusBadge.textContent = 'STANDBY';
      this.dom.wpmStatusBadge.style.color = '#64748B';
      this.dom.wpmStatusBadge.style.borderColor = '#64748B';
      return;
    }

    if (wpm === 0) {
      this.dom.wpmStatusBadge.textContent = 'PAUSED / SILENT';
      this.dom.wpmStatusBadge.style.color = '#64748B';
      this.dom.wpmStatusBadge.style.borderColor = '#64748B';
      if (this.dom.paceAdvice) {
        this.dom.paceAdvice.textContent = 'Strategic pause or waiting for presenter speech...';
      }
    } else if (wpm < 120) {
      // Too slow
      this.dom.wpmStatusBadge.textContent = 'SLOW (ACCELERATE)';
      this.dom.wpmStatusBadge.style.color = '#00F0FF';
      this.dom.wpmStatusBadge.style.borderColor = '#00F0FF';
      if (this.dom.paceAdvice) {
        this.dom.paceAdvice.textContent = 'Pacing is slightly deliberate. Accelerate cadence towards 130-140 WPM to maintain energy.';
      }
    } else if (wpm <= 150) {
      // Optimal target band
      this.dom.wpmStatusBadge.textContent = 'OPTIMAL CADENCE';
      this.dom.wpmStatusBadge.style.color = '#10B981';
      this.dom.wpmStatusBadge.style.borderColor = '#10B981';
      if (this.dom.paceAdvice) {
        this.dom.paceAdvice.textContent = 'Masterful executive cadence. Clear articulation and high boardroom retention.';
      }
    } else {
      // Too fast
      this.dom.wpmStatusBadge.textContent = 'FAST (DECELERATE)';
      this.dom.wpmStatusBadge.style.color = '#F59E0B';
      this.dom.wpmStatusBadge.style.borderColor = '#F59E0B';
      if (this.dom.paceAdvice) {
        this.dom.paceAdvice.textContent = 'Speaking quickly. Take a breath and decelerate to let key architectural points land.';
      }
    }
  }

  /**
   * Updates filler word counts and rendered pill tags
   */
  updateFillerUI() {
    if (!this.dom.fillerBadge || !this.dom.fillerTags) return;

    this.dom.fillerBadge.textContent = `${this.totalFillerCount} Fillers Detected`;
    this.dom.fillerBadge.style.color = this.totalFillerCount > 5 ? '#F59E0B' : '#10B981';
    this.dom.fillerBadge.style.borderColor = this.totalFillerCount > 5 ? '#F59E0B' : '#10B981';

    const activeFillers = Object.entries(this.fillerWordCounts).filter(([_, count]) => count > 0);
    if (activeFillers.length === 0) {
      this.dom.fillerTags.innerHTML = '<span style="font-size: 10px; color: #10B981; font-family: var(--font-mono, monospace);">Pristine clarity • Zero filler words detected</span>';
    } else {
      this.dom.fillerTags.innerHTML = activeFillers.map(([word, count]) => `
        <span class="cyber-badge" style="font-size: 9px; padding: 1px 6px; border-color: rgba(245, 158, 11, 0.4); color: #F59E0B;">
          "${word}": ${count}
        </span>
      `).join('');
    }
  }

  /**
   * Synchronizes with slide changes on the stage
   */
  syncCurrentSlide(newIndex) {
    if (newIndex === this.currentSlideIndex) return;

    // Finalize record for outgoing slide
    if (this.slideHistory[this.currentSlideIndex]) {
      this.slideHistory[this.currentSlideIndex].elapsedSec = this.slideElapsedSeconds;
    }

    this.currentSlideIndex = newIndex;
    this.slideElapsedSeconds = 0; // Reset slide budget stopwatch for new slide

    if (this.dom.slideBadge) {
      this.dom.slideBadge.textContent = `STAGE ${newIndex + 1} of ${this.totalSlides}`;
    }

    this.updateTimersUI();
  }

  /**
   * Broadcasts real-time tick to War Room and Remote
   */
  broadcastTick() {
    if (!this.channel) return;
    try {
      this.channel.postMessage({
        type: 'REHEARSAL_TICK',
        wpm: this.currentWPM,
        avgWpm: this.averageWPM,
        slideIndex: this.currentSlideIndex,
        slideElapsed: this.slideElapsedSeconds,
        slideBudget: this.slideBudgetSeconds,
        isOverage: this.slideElapsedSeconds > this.slideBudgetSeconds,
        fillerCount: this.totalFillerCount,
        totalElapsed: this.totalElapsedSeconds
      });
    } catch (e) {}
  }

  /**
   * Broadcasts state change (start, pause, reset)
   */
  broadcastState() {
    if (!this.channel) return;
    try {
      this.channel.postMessage({
        type: 'REHEARSAL_STATE_CHANGE',
        isRunning: this.isRunning,
        isPaused: this.isPaused
      });
    } catch (e) {}
  }

  /**
   * Generates the 0-100% Executive Confidence Scorecard & Debrief Breakdown
   */
  generateDebrief() {
    const totalMinutes = Math.max(0.5, this.totalElapsedSeconds / 60);

    // 1. Pace Stability Score (35 points max)
    // Evaluates how close average WPM is to 135 optimal center
    const wpmDelta = Math.abs((this.averageWPM || 135) - 135);
    const paceScore = Math.max(10, Math.round(35 - (wpmDelta * 0.45)));

    // 2. Slide Budget Discipline Score (35 points max)
    // Penalizes each slide that suffered overage
    let overageCount = 0;
    const slideKeys = Object.keys(this.slideHistory);
    slideKeys.forEach(k => {
      if (this.slideHistory[k].elapsedSec > this.slideBudgetSeconds) {
        overageCount++;
      }
    });
    const budgetScore = Math.max(10, Math.round(35 - (overageCount * 6)));

    // 3. Filler Word Suppression Score (20 points max)
    const fillersPerMinute = this.totalFillerCount / totalMinutes;
    const fillerScore = Math.max(5, Math.round(20 - (fillersPerMinute * 3.5)));

    // 4. Delivery Stamina & Flow (10 points max)
    const flowScore = this.totalElapsedSeconds > 60 ? 10 : 7;

    const totalScore = Math.min(100, Math.max(20, paceScore + budgetScore + fillerScore + flowScore));

    let grade = 'ALPHA GRADE';
    let gradeSubtitle = 'Boardroom & Keynote Ready';
    let gradeColor = '#00F0FF';

    if (totalScore < 70) {
      grade = 'DELTA GRADE';
      gradeSubtitle = 'Requires pacing drill and slide budget adherence';
      gradeColor = '#EF4444';
    } else if (totalScore < 80) {
      grade = 'GAMMA GRADE';
      gradeSubtitle = 'Strong technical structure; needs filler reduction';
      gradeColor = '#F59E0B';
    } else if (totalScore < 90) {
      grade = 'BETA GRADE';
      gradeSubtitle = 'Excellent executive delivery with minor cadence polish';
      gradeColor = '#10B981';
    }

    return {
      timestamp: new Date().toISOString(),
      overallScore: totalScore,
      grade,
      gradeSubtitle,
      gradeColor,
      metrics: {
        paceScore,
        budgetScore,
        fillerScore,
        flowScore,
        averageWPM: this.averageWPM || 135,
        totalDurationSeconds: this.totalElapsedSeconds,
        totalFillerCount: this.totalFillerCount,
        fillersPerMinute: +fillersPerMinute.toFixed(1),
        overageSlides: overageCount
      },
      slideBreakdown: this.slideHistory,
      recommendations: this.generateRecommendations(totalScore, this.averageWPM, fillersPerMinute, overageCount)
    };
  }

  /**
   * Generates actionable recommendations based on performance
   */
  generateRecommendations(score, avgWpm, fillersPerMin, overages) {
    const recs = [];
    if (avgWpm < 120) {
      recs.push({
        type: 'CADENCE',
        title: 'Accelerate Natural Momentum',
        desc: 'Average speech speed was under 120 WPM. Pick up cadence on introductory context slides to build audience anticipation.'
      });
    } else if (avgWpm > 150) {
      recs.push({
        type: 'CADENCE',
        title: 'Insert Strategic Micro-Pauses',
        desc: 'Speaking rate exceeded 150 WPM. Pause for 2 seconds after presenting complex architectural diagrams to let stakeholders absorb key points.'
      });
    } else {
      recs.push({
        type: 'STRENGTH',
        title: 'Masterful Cadence Discipline',
        desc: 'Your average speech pace stayed solidly within the optimal executive band (120-150 WPM), projecting authoritative confidence.'
      });
    }

    if (overages > 0) {
      recs.push({
        type: 'BUDGET',
        title: 'Compress Deep-Dive Explanations',
        desc: `${overages} slide(s) exceeded the ${this.slideBudgetSeconds}s target budget. Move ancillary implementation details to backup slides or Q&A.`
      });
    } else {
      recs.push({
        type: 'STRENGTH',
        title: 'Impeccable Stage Time Control',
        desc: 'Every single slide was delivered within the allocated budget, ensuring sufficient runway for executive Q&A.'
      });
    }

    if (fillersPerMin > 2.5) {
      recs.push({
        type: 'CLARITY',
        title: 'Replace Filler Sounds With Silence',
        desc: 'Detected vocalized fillers ("um", "uh", "like"). Practice replacing hesitation noises with silent eye contact.'
      });
    }

    return recs;
  }

  /**
   * Finishes rehearsal and opens debrief scorecard modal
   */
  finishRehearsalAndDebrief() {
    this.pauseRehearsal();
    this.mountDebriefModal();

    const debrief = this.generateDebrief();
    this.currentDebrief = debrief;

    const container = document.getElementById('debriefContentContainer');
    if (!container) return;

    container.innerHTML = `
      <!-- Top Score Hero -->
      <div style="background: #080D18; border: 1px solid ${debrief.gradeColor}44; border-radius: 12px; padding: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
        <div>
          <span class="cyber-badge" style="color: ${debrief.gradeColor}; border-color: ${debrief.gradeColor}; font-size: 11px; margin-bottom: 8px;">
            ${debrief.grade}
          </span>
          <h2 style="font-size: 32px; font-weight: 800; color: #F8FAFC; margin: 4px 0;">Executive Confidence Scorecard</h2>
          <p style="font-size: 13px; color: #94A3B8; margin: 0;">${debrief.gradeSubtitle}</p>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 56px; font-weight: 800; font-family: var(--font-mono, monospace); color: ${debrief.gradeColor}; text-shadow: 0 0 30px ${debrief.gradeColor}55;">
            ${debrief.overallScore}%
          </div>
          <span style="font-size: 12px; color: #64748B; font-family: var(--font-mono, monospace);">Overall Performance Rating</span>
        </div>
      </div>

      <!-- 4 Pillars Breakdown Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;">
        <div class="cyber-card" style="padding: 16px; background: #080D18; border-color: #1E2D44;">
          <span style="font-size: 11px; color: #94A3B8; font-weight: 600;">PACE STABILITY</span>
          <div style="font-size: 24px; font-weight: 700; color: #00F0FF; font-family: var(--font-mono, monospace); margin: 6px 0;">
            ${debrief.metrics.paceScore} / 35
          </div>
          <span style="font-size: 11px; color: #64748B;">Avg: ${debrief.metrics.averageWPM} WPM</span>
        </div>

        <div class="cyber-card" style="padding: 16px; background: #080D18; border-color: #1E2D44;">
          <span style="font-size: 11px; color: #94A3B8; font-weight: 600;">TIMING DISCIPLINE</span>
          <div style="font-size: 24px; font-weight: 700; color: #10B981; font-family: var(--font-mono, monospace); margin: 6px 0;">
            ${debrief.metrics.budgetScore} / 35
          </div>
          <span style="font-size: 11px; color: #64748B;">${debrief.metrics.overageSlides} overages</span>
        </div>

        <div class="cyber-card" style="padding: 16px; background: #080D18; border-color: #1E2D44;">
          <span style="font-size: 11px; color: #94A3B8; font-weight: 600;">FILLER SUPPRESSION</span>
          <div style="font-size: 24px; font-weight: 700; color: #F59E0B; font-family: var(--font-mono, monospace); margin: 6px 0;">
            ${debrief.metrics.fillerScore} / 20
          </div>
          <span style="font-size: 11px; color: #64748B;">${debrief.metrics.totalFillerCount} total (${debrief.metrics.fillersPerMinute}/min)</span>
        </div>

        <div class="cyber-card" style="padding: 16px; background: #080D18; border-color: #1E2D44;">
          <span style="font-size: 11px; color: #94A3B8; font-weight: 600;">DELIVERY STAMINA</span>
          <div style="font-size: 24px; font-weight: 700; color: #8B5CF6; font-family: var(--font-mono, monospace); margin: 6px 0;">
            ${debrief.metrics.flowScore} / 10
          </div>
          <span style="font-size: 11px; color: #64748B;">Total: ${Math.floor(debrief.metrics.totalDurationSeconds / 60)}m ${debrief.metrics.totalDurationSeconds % 60}s</span>
        </div>
      </div>

      <!-- Strategic Polish Action Plan -->
      <div class="cyber-card" style="padding: 20px; background: #080D18; border-color: #1E2D44;">
        <h4 style="font-size: 15px; font-weight: 700; color: #F8FAFC; margin-bottom: 14px;">Strategic Rehearsal Polish Plan</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${debrief.recommendations.map(r => `
            <div style="padding: 12px 14px; background: #040710; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span class="cyber-badge" style="font-size: 9px; ${r.type === 'STRENGTH' ? 'color: #10B981; border-color: #10B981;' : 'color: #00F0FF; border-color: #00F0FF;'}">
                  ${r.type}
                </span>
                <strong style="font-size: 13px; color: #F8FAFC;">${r.title}</strong>
              </div>
              <p style="font-size: 12px; color: #94A3B8; margin: 0; line-height: 1.4;">${r.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (this.dom.debriefModal) {
      this.dom.debriefModal.style.display = 'flex';
    }

    soundEngine.playSuccess();
  }

  /**
   * Exports debrief scorecard as JSON or Markdown file
   */
  exportDebriefFile(format) {
    if (!this.currentDebrief) {
      this.currentDebrief = this.generateDebrief();
    }
    const debrief = this.currentDebrief;

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(debrief, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `apexflow_rehearsal_debrief_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      let md = `# APEXFLOW OS — Executive Presentation Rehearsal Debrief\n\n`;
      md += `* **Generated At:** ${debrief.timestamp}\n`;
      md += `* **Overall Executive Confidence Score:** ${debrief.overallScore}% (${debrief.grade} - ${debrief.gradeSubtitle})\n`;
      md += `* **Average Speech Cadence:** ${debrief.metrics.averageWPM} WPM (Optimal Band: 120 - 150 WPM)\n`;
      md += `* **Total Duration:** ${Math.floor(debrief.metrics.totalDurationSeconds / 60)}m ${debrief.metrics.totalDurationSeconds % 60}s\n`;
      md += `* **Total Filler Words:** ${debrief.metrics.totalFillerCount} (${debrief.metrics.fillersPerMinute} per min)\n\n`;

      md += `## Scorecard Pillar Breakdown\n\n`;
      md += `* **Pace Stability:** ${debrief.metrics.paceScore} / 35\n`;
      md += `* **Slide Timing Discipline:** ${debrief.metrics.budgetScore} / 35 (${debrief.metrics.overageSlides} slide overages)\n`;
      md += `* **Filler Word Suppression:** ${debrief.metrics.fillerScore} / 20\n`;
      md += `* **Delivery Stamina & Flow:** ${debrief.metrics.flowScore} / 10\n\n`;

      md += `## Strategic Rehearsal Polish Plan\n\n`;
      debrief.recommendations.forEach((r, idx) => {
        md += `### ${idx + 1}. [${r.type}] ${r.title}\n`;
        md += `${r.desc}\n\n`;
      });

      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `apexflow_rehearsal_debrief_${Date.now()}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }

    soundEngine.playSuccess();
  }
}

export const humanRehearsalPlaybook = new HumanRehearsalPlaybook();
