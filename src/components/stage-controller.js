/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Master 120 FPS Executive Keynote Presentation Stage Controller
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Powers the stage runtime (`stage.html`). Coordinates:
 *   1. Stage Progression (Stages 1 through 6) with smooth easing & audio cues
 *   2. Client-Side Executive Voice Narration & Word-Boundary Karaoke Ticker (T048, Hotkey 'V')
 *   3. Audience Live Q&A Backchannel & Question Spotlight HUD Overlay (T049, Hotkey 'U')
 *   4. Keynote Session Recorder & Instant Replay Engine (T050, Hotkey 'R')
 *   5. Audio-Reactive Three.js Holodeck Gravitational Wave Field (T051)
 *   6. Keynote Progress Ribbon & Top Header Project Switcher (#stageProjectSelect)
 *   7. Synchronized Stage Clock Bridge (T044) with real-time countdown & overtime pulses
 *   8. Discreet Presenter Whisper HUD Overlay (T047, Hotkey 'W') for live objection prompts
 *   9. Real-Time Dynamic White-Label & Custom Branding Theme Engine (T046)
 *  10. Dynamic Slide Studio Reordering & Visibility Configuration (T045)
 *  11. In-Stage Speaker Notes Prompter HUD (Hotkey 'N') with slide-by-slide talking points
 *  12. Slide Deck Light Table / Grid Overview (Hotkey 'G') with 6 interactive jump cards
 *  13. Autoplay Keynote Walkthrough Mode (Hotkey 'A') with timed cycling & whoosh sounds
 *  14. 16:9 Landscape Print / PDF Slide Deck Exporter (Hotkey 'E' / Button 'PDF')
 *  15. Living 2D Pipeline Graph & Frosted Glass Code Drawer Inspector
 *  16. Real in-browser Pyodide simulation sandbox & streaming cyber-terminal
 *  17. Responsive Apple Studio / iPhone device frame viewports
 *  18. Bento Grid ROI matrix & Before/After interactive slider
 *  19. Audience QR Remote modal & floating physics emoji particles
 *  20. Stage Weapons: Laser Pointer ('L'), Spotlight Mode ('S'), Live Pen ('D')
 *  21. Executive Cinematic Director Mode (T052, Hotkey 'C'): Autonomous camera sweeps
 *  22. Executive Ambient Harmonic Drone Soundscape (T053, Hotkey 'M')
 *  23. Floating Frosted Glass Executive Dock (T054, Hotkey 'H')
 *  24. Standalone Offline HTML Player Bundle Exporter (T055)
 *  25. 3D Holodeck Spatial Multi-Theme Shader Engine (T057, Hotkey 'T')
 *  26. In-Stage Live Node Architecture Modifier & Playground (T058, Button 'Add Node')
 *  27. 1-Click Cinematic Keynote Video Teaser Generator (T059, Hotkey 'K')
 *  28. Live Audience Pulse & Heatmap HUD (T060)
 *  29. Universal Spotlight Executive Command Palette (T062, Hotkey 'Cmd+K' / 'Ctrl+K')
 *  30. Interactive Architecture Subsystem Tier Filter Bar on Stage 2 (T082)
 *  31. Executive Project Comparison & Multi-Deck Differential Matrix (T083, Hotkey 'J')
 *  32. Executive Presentation Briefing Card & One-Pager Exporter (T084, Hotkey 'B')
 *  33. Live Architecture Packet Flow & Data Trace Animator (T087, Hotkey 'Z')
 *  34. Executive Pitch Deck Readiness Audit Scorecard & Rehearsal Analyzer (T088, Hotkey 'I')
 *  35. High-Precision Dual-Screen Keynote Presenter Mirror Engine (T089, Hotkey 'W' / Mirror)
 *
 * [HARDWARE STAGE SHORTCUTS]:
 *   - [Space] or [→] : Next Stage
 *   - [←]           : Previous Stage
 *   - [1] - [6]     : Direct Stage Jump
 *   - [Cmd+K] / [Ctrl+K] : Universal Spotlight Executive Command Palette
 *   - [Z]           : Toggle Animated Architecture Packet Flow & Data Trace
 *   - [I]           : Toggle Executive Pitch Deck Readiness Audit Scorecard
 *   - [J]           : Toggle Executive Architecture Comparison & Differential Matrix
 *   - [B]           : Export Executive Presentation 1-Page Briefing Sheet
 *   - [C]           : Toggle Cinematic Director Mode (autonomous 3D camera orbit)
 *   - [M]           : Toggle Executive Ambient Soundscape (55Hz/82Hz drone)
 *   - [H]           : Toggle Executive Dock Visibility
 *   - [T]           : Cycle 3D Spatial Holodeck Theme (Neon, Chrome, Gold, Obsidian)
 *   - [K]           : Export 10s 60 FPS 1080p Cinematic Keynote Teaser Video
 *   - [V]           : Toggle Executive Voiceover & Karaoke Ticker
 *   - [R]           : Toggle Keynote Session Recording
 *   - [U]           : Toggle Audience Question Spotlight HUD
 *   - [A]           : Toggle Autoplay Keynote Walkthrough
 *   - [G]           : Toggle Slide Deck Light Table Grid
 *   - [N]           : Toggle In-Stage Speaker Notes Prompter
 *   - [W]           : Toggle Presenter Whisper HUD Overlay
 *   - [E]           : Export 16:9 Landscape PDF Slide Deck
 *   - [3]           : Toggle 2D / 3D Holodeck Mode
 *   - [L]           : Toggle Laser Pointer
 *   - [S]           : Toggle Spotlight Mode
 *   - [D]           : Toggle Neon Drawing Pen ('X' or 'C' when drawing to clear)
 *   - [Q]           : Toggle Audience QR Remote
 *   - [F]           : Toggle Fullscreen Mode
 *   - [P]           : Open Presenter War Room Console
 *
 * [ENGINEERING SPECIFICATIONS]:
 * - When adding new slide stages, update `SLIDE_TITLES` in `updateSlideProgress()`,
 *   `NOTES_DATA` in `updateSpeakerNotesContent()`, and `SLIDES_OVERVIEW` in `populateSlidesGrid()`.
 * - All state and projects are 100% client-side (Zero-Upload Guarantee).
 * =========================================================================================
 */

import { projectVault } from '../lib/storage/project-vault.js';
import { soundEngine } from '../lib/audio/sound-synth.js';
import { STAGES, ARCHETYPE_METADATA } from '../lib/types.js';
import { mountHolographicRadar } from './hero-radar.js';
import { renderHighlightedCode } from '../lib/syntax/code-highlighter.js';
import { HolodeckGalaxyEngine } from './holodeck-engine.js';
import { CyberTerminalUI } from './cyber-terminal.js';
import { sandboxRunner } from '../lib/pyodide/sandbox-runner.js';
import { DeviceFramesUI } from './device-frames.js';
import { BentoRoiUI } from './bento-roi.js';
import { FloatingEmojiCanvas } from './floating-particles.js';
import { remoteSync } from '../lib/remote/remote-sync.js';
import { supabaseRealtime } from '../lib/remote/supabase-sync.js';
import { mountApiPlayground } from './api-playground.js';
import { mountMlGauges } from './ml-gauges.js';
import { mountScreenSimulator, mountConstellationNebula } from './screen-simulator.js';
import { voiceNarrator } from '../lib/audio/voice-narrator.js';
import { sessionRecorder } from '../lib/export/session-recorder.js';
import { offlineBundler } from '../lib/export/single-file-bundler.js';
import { keynoteTeaser } from '../lib/export/keynote-teaser.js';
import { vectorExporter } from '../lib/export/vector-exporter.js';
import { ExecutiveCommandPalette } from './command-palette.js';
import { ExecutiveNodeInspector } from './node-inspector.js';
import { ChaosEngineeringSimulator } from './chaos-simulator.js';
import { TeleprompterHUD } from './teleprompter-hud.js';
import { ScenarioEngine } from './scenario-engine.js';
import { ComparisonMatrix } from './comparison-matrix.js';
import { briefingExporter } from '../lib/export/briefing-exporter.js';
import { PacketFlowTracer } from './packet-tracer.js';
import { ExecutiveReadinessAudit } from './readiness-audit.js';
import { presenterMirror } from '../lib/remote/presenter-mirror.js';
import { ArchitectureTimeMachine } from './time-machine.js';
import { inputShield } from '../lib/security/input-shield.js';
import { annotationCanvas } from './annotation-canvas.js';
import { finOpsCalculator } from './finops-calculator.js';
import { offlineVault } from '../lib/storage/offline-vault.js';
import { audienceHeatmap } from './audience-heatmap.js';
import { keynoteSubtitles } from './translation-subtitles.js';
import { keynoteWatermark } from '../lib/security/keynote-watermark.js';
import { architectureCopilot } from './architecture-copilot.js';
import { latencyWaterfall } from './latency-waterfall.js';
import { mermaidExporter } from '../lib/export/mermaid-exporter.js';
import { chaosEngineeringHUD } from './chaos-engineering-hud.js';
import { rehearsalEvaluator } from './rehearsal-evaluator.js';
import { executiveDeckPackager } from '../lib/export/executive-deck-packager.js';
import { topologyComparator } from './topology-comparator.js';
import { threatModeler } from './threat-modeler.js';
import { sentimentCloud } from './sentiment-cloud.js';
import { disasterRecoveryHUD } from './dr-failover-hud.js';
import { complianceLedger } from './compliance-ledger.js';
import { slidePosterRenderer } from '../lib/export/slide-poster-renderer.js';
import { objectionDefenseHUD } from './objection-defense-hud.js';
import { voiceCommanderHUD } from './voice-commander.js';
import { spatialGestureEngine } from './spatial-gesture-engine.js';
import { whiteLabelManager } from './white-label-manager.js';
import { clientPortalGateway } from './client-portal-gateway.js';
import { humanRehearsalPlaybook } from './human-rehearsal-playbook.js';

class StageController {
  constructor() {
    this.currentStageIndex = 0;
    this.manifest = null;
    this.pipelineGraph = null;
    this.nodeInspector = null;
    this.chaosSimulator = new ChaosEngineeringSimulator(this);
    this.vectorExporter = vectorExporter;
    this.annotationCanvas = annotationCanvas;
    this.finOpsCalculator = finOpsCalculator;
    this.offlineVault = offlineVault;
    this.audienceHeatmap = audienceHeatmap;
    this.keynoteSubtitles = keynoteSubtitles;
    this.keynoteWatermark = keynoteWatermark;
    this.architectureCopilot = architectureCopilot;
    this.architectureCopilot.stageController = this;
    this.latencyWaterfall = latencyWaterfall;
    this.latencyWaterfall.stageController = this;
    this.mermaidExporter = mermaidExporter;
    this.mermaidExporter.stageController = this;
    this.chaosEngineeringHUD = chaosEngineeringHUD;
    this.chaosEngineeringHUD.stageController = this;
    this.rehearsalEvaluator = rehearsalEvaluator;
    this.rehearsalEvaluator.stageController = this;
    this.executiveDeckPackager = executiveDeckPackager;
    this.executiveDeckPackager.stageController = this;
    this.topologyComparator = topologyComparator;
    this.topologyComparator.stageController = this;
    this.threatModeler = threatModeler;
    this.threatModeler.stageController = this;
    this.sentimentCloud = sentimentCloud;
    this.sentimentCloud.stageController = this;
    this.disasterRecoveryHUD = disasterRecoveryHUD;
    this.disasterRecoveryHUD.stageController = this;
    this.complianceLedger = complianceLedger;
    this.complianceLedger.stageController = this;
    this.slidePosterRenderer = slidePosterRenderer;
    this.slidePosterRenderer.stageController = this;
    this.objectionDefenseHUD = objectionDefenseHUD;
    this.objectionDefenseHUD.stageController = this;
    this.voiceCommanderHUD = voiceCommanderHUD;
    this.voiceCommanderHUD.stageController = this;
    this.spatialGestureEngine = spatialGestureEngine;
    this.spatialGestureEngine.stageController = this;
    this.whiteLabelManager = whiteLabelManager;
    this.whiteLabelManager.stageController = this;
    this.clientPortalGateway = clientPortalGateway;
    this.clientPortalGateway.stageController = this;
    this.humanRehearsalPlaybook = humanRehearsalPlaybook;
    this.humanRehearsalPlaybook.stageController = this;
    this.isStagePollHUDOpen = false;
    this.selectedVectorTheme = 'oled';
    this.stageEntryTime = Date.now();
    this.isLaserActive = false;
    this.isSpotlightActive = false;
    this.is3DActive = false;
    this.laserDot = null;
    this.spotlightMask = null;
    this.terminalInterval = null;
    this.holodeckEngine = null;
    this.cyberTerminal = null;
    this.deviceFrames = null;
    this.bentoRoi = null;
    this.emojiCanvas = null;
    this.isPenActive = false;
    this.penCanvas = null;
    this.penCtx = null;
    this.isDrawing = false;

    // Phase 7: Executive Keynote Presentation Deck State
    this.isAutoplay = false;
    this.autoplayTimer = null;
    this.isSpeakerNotesOpen = false;
    this.isSlidesGridOpen = false;

    // Phase 9: Whisper HUD, Clock Bridge, Theme & Custom Slide Order
    this.whisperTimeout = null;
    this.customSlideOrder = [0, 1, 2, 3, 4, 5];
    this.hiddenSlides = new Set();

    // Phase 10: Audio Narration, Session Recording & Live Q&A Spotlight
    this.isNarrating = false;
    this.isRecording = false;
    this.currentSpotlightQuestion = null;

    // Phase 11: Executive Cinematic Director Mode & Soundscapes
    this.isDirectorMode = false;
    this.isSoundscapeActive = false;

    // Phase 12: Spatial Multi-Theme Shaders, Live Node Modifier & Teaser Video
    this.audiencePulse = 98;
    this.isGeneratingTeaser = false;

    // Phase 13: Universal Executive Command Palette (Cmd+K)
    this.commandPalette = null;

    // Phase 16: Executive Teleprompter HUD & Scenario Engine
    this.teleprompterHUD = null;
    this.scenarioEngine = null;

    // Phase 17: Interactive Architecture Subsystem Tier Filter Bar & Executive Matrix
    this.comparisonMatrix = null;
    this.activeTierFilter = 'all';

    // Phase 18: Packet Flow Tracer, Readiness Audit & Presenter Mirror
    this.packetTracer = null;
    this.readinessAudit = null;

    // Phase 20: Architecture Evolution Time-Machine (Task T099)
    this.timeMachine = null;
  }

  async init() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    // Retrieve all saved projects (auto-seeds 3 master demos if empty)
    const allProjects = await projectVault.listAllProjects();

    if (projectId) {
      const record = await projectVault.getProject(projectId);
      if (record) {
        this.manifest = record.manifest;
        this.pipelineGraph = record.pipelineGraph;
      }
    }

    // Fallback if no project ID in query or not found
    if (!this.manifest) {
      if (allProjects && allProjects.length > 0) {
        this.manifest = allProjects[0].manifest;
        this.pipelineGraph = allProjects[0].pipelineGraph;
      } else {
        window.location.href = 'index.html';
        return;
      }
    }

    // Populate Keynote Project Switcher Dropdown (#stageProjectSelect)
    const selectEl = document.getElementById('stageProjectSelect');
    if (selectEl && allProjects && allProjects.length > 0) {
      selectEl.innerHTML = allProjects.map(p => `
        <option value="${inputShield.escapeHtml(p.id)}" ${p.id === this.manifest.id ? 'selected' : ''}>
          ${inputShield.escapeHtml(p.name)}
        </option>
      `).join('');

      selectEl.addEventListener('change', (e) => {
        const newId = e.target.value;
        if (newId && newId !== this.manifest.id) {
          soundEngine.playWhoosh();
          window.location.search = `?id=${encodeURIComponent(newId)}`;
        }
      });
    }

    this.setupStageDOM();
    this.setupKeyboardShortcuts();
    this.setupStageWeapons();
    this.setupRemoteSync();

    // Phase 13, 14, 16, 17 & 18: Initialize Executive Palettes, Inspectors, Prompter, Scenarios, Matrices & Tracers
    this.commandPalette = new ExecutiveCommandPalette(this);
    this.nodeInspector = new ExecutiveNodeInspector(this);
    this.teleprompterHUD = new TeleprompterHUD(this);
    this.scenarioEngine = new ScenarioEngine(this);
    this.comparisonMatrix = new ComparisonMatrix(this);
    this.setupTierFilters();
    this.packetTracer = new PacketFlowTracer(this);
    this.readinessAudit = new ExecutiveReadinessAudit(this);
    this.timeMachine = new ArchitectureTimeMachine(this);

    // Phase 21: Mount Autonomous Offline PWA Vault Badge
    this.offlineVault.mountBadge('offlineVaultContainer');

    // Phase 18: Presenter Mirror Inbound Sync
    presenterMirror.onEvent((event) => {
      if (event.type === 'STAGE_NAV_COMMAND') {
        if (event.payload?.action === 'jump' && typeof event.payload?.stageIndex === 'number') {
          this.goToStage(event.payload.stageIndex);
        } else if (event.payload?.action === 'next') {
          this.nextStage();
        } else if (event.payload?.action === 'prev') {
          this.prevStage();
        }
      }
    });

    // Phase 9: Initialize Brand Theme & Custom Slide Sequence
    this.applyBrandTheme();
    try {
      const savedConfig = localStorage.getItem(`apexflow_slide_config_${this.manifest.id}`);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (Array.isArray(parsed.slideOrder)) this.customSlideOrder = parsed.slideOrder;
        if (Array.isArray(parsed.hiddenSlides)) this.hiddenSlides = new Set(parsed.hiddenSlides);
      }
    } catch (e) {}

    this.renderCurrentStage();
  }

  setupRemoteSync() {
    const canvas = document.getElementById('floatingEmojiCanvas');
    if (canvas) {
      this.emojiCanvas = new FloatingEmojiCanvas(canvas);
    }

    remoteSync.onEvent((event) => {
      this.pulseAudienceEngagement(event.type);
      if (event.type === 'REACTION') {
        if (this.emojiCanvas) this.emojiCanvas.spawn(event.emoji);
        if (this.isRecording) sessionRecorder.record('EMOJI_BURST', { emoji: event.emoji });
      } else if (event.type === 'STAGE_NAV') {
        if (event.action === 'next') this.nextStage();
        if (event.action === 'prev') this.prevStage();
        if (event.action === 'jump' && event.stageIndex !== undefined) this.goToStage(event.stageIndex);
      } else if (event.type === 'STAGE_TIMER_SYNC') {
        this.updateClockBridge(event);
      } else if (event.type === 'PRESENTER_WHISPER') {
        this.displayPresenterWhisper(event);
      } else if (event.type === 'THEME_BRAND_SYNC') {
        this.applyBrandTheme(event);
      } else if (event.type === 'SLIDE_STUDIO_SYNC') {
        this.applySlideStudioConfig(event);
      } else if (event.type === 'WEBHOOK_TRIGGER') {
        if (this.currentStageIndex === 2) {
          this.runSimulationSandbox();
        } else if (this.emojiCanvas) {
          this.emojiCanvas.burst('surge', 6);
        }
        if (this.isRecording) sessionRecorder.record('WEBHOOK_TRIGGER', { payload: event.payload });
      } else if (event.type === 'POLL_VOTE') {
        if (event.tallies) this.updateStagePollUI(event.tallies);
        if (event.poll) this.renderStagePollHUD(event.poll);
        this.recordInteraction('pollVotes');
        if (this.isRecording) sessionRecorder.record('POLL_VOTE', { tallies: event.tallies, poll: event.poll });
      } else if (event.type === 'POLL_CREATE_OR_UPDATE') {
        if (event.poll) this.renderStagePollHUD(event.poll);
      } else if (event.type === 'POLL_STATUS_CHANGE') {
        if (event.poll) this.renderStagePollHUD(event.poll);
      } else if (event.type === 'POLL_STAGE_OVERLAY_TOGGLE') {
        this.toggleStagePollHUD(event.forceState);
      } else if (event.type === 'SPOTLIGHT_QUESTION') {
        this.showSpotlightQuestion(event.question);
      }
    });

    // Supabase Realtime synchronization bridge (Task T184)
    supabaseRealtime.initialize().then(() => {
      this.updateSupabaseStagePill();
    });

    supabaseRealtime.on('status', () => {
      this.updateSupabaseStagePill();
    });

    supabaseRealtime.on('SLIDE_CHANGE', (data) => {
      if (typeof data?.slideIndex === 'number' && data.slideIndex !== this.currentStageIndex) {
        this.goToStage(data.slideIndex, false);
      }
    });

    supabaseRealtime.on('REACTION_BURST', (data) => {
      const type = data?.reactionType || 'priority';
      if (this.emojiCanvas) this.emojiCanvas.spawn(type);
      this.pulseAudienceEngagement('REACTION');
      if (this.isRecording) sessionRecorder.record('EMOJI_BURST', { emoji: type });
    });
  }

  updateSupabaseStagePill() {
    const pill = document.getElementById('stageSupabaseSyncPill');
    const dot = document.getElementById('stageSupabaseDot');
    const text = document.getElementById('stageSupabaseText');
    if (!pill || !dot || !text) return;

    if (supabaseRealtime.isConnected) {
      pill.className = 'cyber-badge badge-cyan';
      dot.style.background = '#38BDF8';
      text.textContent = `Supabase Mesh (${supabaseRealtime.roomCode})`;
    } else if (supabaseRealtime.connectionState === 'connecting') {
      pill.className = 'cyber-badge badge-violet';
      dot.style.background = '#8B5CF6';
      text.textContent = 'Connecting Cloud...';
    } else {
      pill.className = 'cyber-badge badge-emerald';
      dot.style.background = '#10B981';
      text.textContent = 'Local Air-Gap';
    }
  }

  setupStageDOM() {
    // Stage elements
    this.laserDot = document.getElementById('laserDot');
    this.spotlightMask = document.getElementById('spotlightMask');

    // Populate Project Title & Metadata (safe check for element existence)
    const projNameEl = document.getElementById('stageProjectName');
    if (projNameEl) projNameEl.textContent = this.manifest.name;

    const badgeEl = document.getElementById('stageArchetypeBadge');
    if (badgeEl && this.manifest.archetype && ARCHETYPE_METADATA[this.manifest.archetype]) {
      badgeEl.textContent = ARCHETYPE_METADATA[this.manifest.archetype].name;
      badgeEl.style.color = ARCHETYPE_METADATA[this.manifest.archetype].badgeColor;
      badgeEl.style.borderColor = ARCHETYPE_METADATA[this.manifest.archetype].badgeColor;
    }

    // Navigation buttons
    document.getElementById('btnPrevStage').addEventListener('click', () => this.prevStage());
    document.getElementById('btnNextStage').addEventListener('click', () => this.nextStage());

    // Keynote Deck Navigation Buttons (Phase 7)
    const autoplayBtn = document.getElementById('btnAutoplay');
    if (autoplayBtn) {
      autoplayBtn.addEventListener('click', () => this.toggleAutoplay());
    }

    const slidesGridBtn = document.getElementById('btnSlidesGrid');
    if (slidesGridBtn) {
      slidesGridBtn.addEventListener('click', () => this.toggleSlidesGrid());
    }
    const closeSlidesGridBtn = document.getElementById('btnCloseSlidesGrid');
    if (closeSlidesGridBtn) {
      closeSlidesGridBtn.addEventListener('click', () => this.toggleSlidesGrid(false));
    }

    const speakerNotesBtn = document.getElementById('btnSpeakerNotes');
    if (speakerNotesBtn) {
      speakerNotesBtn.addEventListener('click', () => this.toggleSpeakerNotes());
    }
    const closeSpeakerNotesBtn = document.getElementById('btnCloseSpeakerNotes');
    if (closeSpeakerNotesBtn) {
      closeSpeakerNotesBtn.addEventListener('click', () => this.toggleSpeakerNotes(false));
    }

    const exportPdfBtn = document.getElementById('btnExportPdf');
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', () => this.exportPdfDeck());
    }

    // Stage tabs
    document.querySelectorAll('.stage-nav-pill').forEach((pill, idx) => {
      pill.addEventListener('click', () => {
        soundEngine.playClick();
        this.goToStage(idx);
      });
    });

    // Close code drawer
    const closeBtn = document.getElementById('closeCodeDrawer');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        soundEngine.playClick();
        document.getElementById('codeDrawer').style.transform = 'translateX(100%)';
      });
    }

    // Simulate trigger in Stage 3
    const simBtn = document.getElementById('btnSimulateTrigger');
    if (simBtn) {
      simBtn.addEventListener('click', () => this.runSimulationSandbox());
    }

    // QR Remote toggle
    const qrBtn = document.getElementById('btnToggleQr');
    if (qrBtn) {
      qrBtn.addEventListener('click', () => this.toggleQrModal());
    }

    // Close Presenter Whisper HUD
    const closeWhisperBtn = document.getElementById('btnCloseWhisper');
    if (closeWhisperBtn) {
      closeWhisperBtn.addEventListener('click', () => this.togglePresenterWhisper(false));
    }

    // Phase 10: Executive Voiceover & Keynote Session Recording
    const voiceBtn = document.getElementById('btnVoiceNarrate');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => this.toggleVoiceNarration());
    }

    const stopNarrationBtn = document.getElementById('btnStopNarration');
    if (stopNarrationBtn) {
      stopNarrationBtn.addEventListener('click', () => this.toggleVoiceNarration(false));
    }

    const langSelect = document.getElementById('narratorLangSelect');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        voiceNarrator.setLanguage(e.target.value);
        if (this.isNarrating) {
          this.narrateCurrentSlide();
        }
      });
    }

    const recordBtn = document.getElementById('btnRecordSession');
    if (recordBtn) {
      recordBtn.addEventListener('click', () => this.toggleSessionRecording());
    }

    const closeSpotlightBtn = document.getElementById('btnCloseSpotlightQuestion');
    if (closeSpotlightBtn) {
      closeSpotlightBtn.addEventListener('click', () => this.dismissSpotlightQuestion());
    }

    // Phase 11: Floating Frosted Glass Executive Dock (Task T054)
    const dockPrev = document.getElementById('dockBtnPrev');
    if (dockPrev) dockPrev.addEventListener('click', () => this.prevStage());

    const dockNext = document.getElementById('dockBtnNext');
    if (dockNext) dockNext.addEventListener('click', () => this.nextStage());

    document.querySelectorAll('#dockStagePills .dock-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const stageIdx = parseInt(pill.dataset.stage, 10);
        this.goToStage(stageIdx);
      });
    });

    const dockDirector = document.getElementById('dockBtnDirector');
    if (dockDirector) dockDirector.addEventListener('click', () => this.toggleDirectorMode());

    const dockSoundscape = document.getElementById('dockBtnSoundscape');
    if (dockSoundscape) dockSoundscape.addEventListener('click', () => this.toggleExecutiveSoundscape());

    const dockVoice = document.getElementById('dockBtnVoice');
    if (dockVoice) dockVoice.addEventListener('click', () => this.toggleVoiceNarration());

    const dockRecord = document.getElementById('dockBtnRecord');
    if (dockRecord) dockRecord.addEventListener('click', () => this.toggleSessionRecording());

    const dockLaser = document.getElementById('dockBtnLaser');
    if (dockLaser) dockLaser.addEventListener('click', () => this.toggleLaserPointer());

    const dockSpotlight = document.getElementById('dockBtnSpotlight');
    if (dockSpotlight) dockSpotlight.addEventListener('click', () => this.toggleSpotlight());

    const dockPen = document.getElementById('dockBtnPen');
    if (dockPen) dockPen.addEventListener('click', () => this.toggleDrawingPen());

    const dockNotes = document.getElementById('dockBtnNotes');
    if (dockNotes) dockNotes.addEventListener('click', () => this.toggleSpeakerNotes());

    const dockGrid = document.getElementById('dockBtnGrid');
    if (dockGrid) dockGrid.addEventListener('click', () => this.toggleSlidesGrid());

    const dockQr = document.getElementById('dockBtnQr');
    if (dockQr) dockQr.addEventListener('click', () => this.toggleQrModal());

    const dockFullscreen = document.getElementById('dockBtnFullscreen');
    if (dockFullscreen) dockFullscreen.addEventListener('click', () => this.toggleFullscreen());

    const exportBundleBtn = document.getElementById('btnExportBundle');
    if (exportBundleBtn) exportBundleBtn.addEventListener('click', () => this.exportStandaloneBundle());

    // Phase 12: Spatial Themes, Node Injection & Teaser Generator (Tasks T057, T058, T059)
    const themeBtn = document.getElementById('btnCycleHolodeckTheme');
    if (themeBtn) themeBtn.addEventListener('click', () => this.cycleSpatialTheme());

    const dockThemeBtn = document.getElementById('dockBtnTheme');
    if (dockThemeBtn) dockThemeBtn.addEventListener('click', () => this.cycleSpatialTheme());

    const addNodeBtn = document.getElementById('btnAddStageNode');
    if (addNodeBtn) addNodeBtn.addEventListener('click', () => this.openAddNodeModal());

    const closeNodeModalBtn = document.getElementById('btnCloseAddNodeModal');
    if (closeNodeModalBtn) closeNodeModalBtn.addEventListener('click', () => this.closeAddNodeModal());

    const cancelNodeModalBtn = document.getElementById('btnCancelAddNode');
    if (cancelNodeModalBtn) cancelNodeModalBtn.addEventListener('click', () => this.closeAddNodeModal());

    const confirmNodeModalBtn = document.getElementById('btnConfirmAddNode');
    if (confirmNodeModalBtn) confirmNodeModalBtn.addEventListener('click', () => this.submitAddNode());

    const teaserBtn = document.getElementById('btnRecordTeaser');
    if (teaserBtn) teaserBtn.addEventListener('click', () => this.recordCinematicTeaser());

    const dockTeaserBtn = document.getElementById('dockBtnTeaser');
    if (dockTeaserBtn) dockTeaserBtn.addEventListener('click', () => this.recordCinematicTeaser());

    // Phase 13: Universal Spotlight Command Palette (Cmd+K)
    const paletteBtn = document.getElementById('btnCommandPalette');
    if (paletteBtn) paletteBtn.addEventListener('click', () => {
      if (this.commandPalette) this.commandPalette.open();
    });

    const dockPaletteBtn = document.getElementById('dockBtnPalette');
    if (dockPaletteBtn) dockPaletteBtn.addEventListener('click', () => {
      if (this.commandPalette) this.commandPalette.open();
    });

    // Phase 15: Vector Slide Exporter & Audience Live Poll HUD (Tasks T072, T073)
    const dockVectorBtn = document.getElementById('dockBtnVector');
    if (dockVectorBtn) dockVectorBtn.addEventListener('click', () => this.openVectorExportModal());

    const dockPollBtn = document.getElementById('dockBtnPoll');
    if (dockPollBtn) dockPollBtn.addEventListener('click', () => this.toggleStagePollHUD());

    // Phase 16: Teleprompter HUD & Scenario Engine (Tasks T077, T078)
    const dockPrompterBtn = document.getElementById('dockBtnPrompter');
    if (dockPrompterBtn) dockPrompterBtn.addEventListener('click', () => this.toggleTeleprompterHUD());

    const dockScenarioBtn = document.getElementById('dockBtnScenario');
    if (dockScenarioBtn) dockScenarioBtn.addEventListener('click', () => this.toggleScenarioEngine());

    const closePollHudBtn = document.getElementById('btnCloseStagePollHUD');
    if (closePollHudBtn) closePollHudBtn.addEventListener('click', () => this.toggleStagePollHUD(false));

    const closeVectorBtn = document.getElementById('btnCloseVectorModal');
    if (closeVectorBtn) closeVectorBtn.addEventListener('click', () => this.closeVectorExportModal());

    document.querySelectorAll('.vector-theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.vector-theme-btn').forEach(b => {
          b.classList.remove('active');
          b.style.borderColor = '';
          b.style.color = '';
          b.style.background = '';
        });
        btn.classList.add('active');
        btn.style.borderColor = '#00F0FF';
        btn.style.color = '#00F0FF';
        btn.style.background = 'rgba(0,240,255,0.12)';
        this.selectedVectorTheme = btn.dataset.theme;
        soundEngine.playClick();
      });
    });

    const btnDlCurSvg = document.getElementById('btnDownloadCurrentSlideSVG');
    if (btnDlCurSvg) btnDlCurSvg.addEventListener('click', () => this.downloadCurrentSlideVector());

    const btnCopySvg = document.getElementById('btnCopySlideSVG');
    if (btnCopySvg) btnCopySvg.addEventListener('click', () => this.copyCurrentSlideVector());

    const btnDlDeck = document.getElementById('btnDownloadFullDeckPackage');
    if (btnDlDeck) btnDlDeck.addEventListener('click', () => this.downloadFullVectorDeckPackage());

    // Phase 17: Executive Comparison Matrix & 1-Page Briefing Exporter (Tasks T083, T084)
    const dockCompareBtn = document.getElementById('dockBtnCompare');
    if (dockCompareBtn) {
      dockCompareBtn.addEventListener('click', () => {
        if (this.comparisonMatrix) this.comparisonMatrix.toggle();
      });
    }

    const dockBriefingBtn = document.getElementById('dockBtnBriefing');
    if (dockBriefingBtn) {
      dockBriefingBtn.addEventListener('click', () => {
        briefingExporter.downloadBriefingHTML(this.manifest, this.pipelineGraph);
      });
    }

    // Phase 18: Packet Flow Tracer, Readiness Audit & Presenter Mirror (Tasks T087, T088, T089)
    const btnTraceFlow = document.getElementById('btnTracePacketFlow');
    if (btnTraceFlow) {
      btnTraceFlow.addEventListener('click', () => {
        this.packetTracer?.toggle();
      });
    }

    const dockTraceBtn = document.getElementById('dockBtnTrace');
    if (dockTraceBtn) {
      dockTraceBtn.addEventListener('click', () => {
        this.packetTracer?.toggle();
      });
    }

    const dockAuditBtn = document.getElementById('dockBtnAudit');
    if (dockAuditBtn) {
      dockAuditBtn.addEventListener('click', () => {
        this.readinessAudit?.toggle();
      });
    }

    const dockMirrorBtn = document.getElementById('dockBtnMirror');
    if (dockMirrorBtn) {
      dockMirrorBtn.addEventListener('click', () => {
        presenterMirror.openMirrorWindow(this.manifest?.id);
      });
    }

    const dockTimeBtn = document.getElementById('dockBtnTimeMachine');
    if (dockTimeBtn) {
      dockTimeBtn.addEventListener('click', () => {
        this.toggleTimeMachine();
      });
    }

    const dockFinOpsBtn = document.getElementById('dockBtnFinOps');
    if (dockFinOpsBtn) {
      dockFinOpsBtn.addEventListener('click', () => {
        this.toggleFinOpsCalculator();
      });
    }

    const dockHeatmapBtn = document.getElementById('dockBtnHeatmap');
    if (dockHeatmapBtn) {
      dockHeatmapBtn.addEventListener('click', () => {
        this.toggleAudienceHeatmap();
      });
    }

    const dockSubtitlesBtn = document.getElementById('dockBtnSubtitles');
    if (dockSubtitlesBtn) {
      dockSubtitlesBtn.addEventListener('click', () => {
        this.toggleKeynoteSubtitles();
      });
    }

    const dockWatermarkBtn = document.getElementById('dockBtnWatermark');
    if (dockWatermarkBtn) {
      dockWatermarkBtn.addEventListener('click', () => {
        this.toggleKeynoteWatermark();
      });
    }

    const dockCopilotBtn = document.getElementById('dockBtnCopilot');
    if (dockCopilotBtn) {
      dockCopilotBtn.addEventListener('click', () => {
        this.toggleArchitectureCopilot();
      });
    }

    const dockWaterfallBtn = document.getElementById('dockBtnWaterfall');
    if (dockWaterfallBtn) {
      dockWaterfallBtn.addEventListener('click', () => {
        this.toggleLatencyWaterfall();
      });
    }

    const dockMermaidBtn = document.getElementById('dockBtnMermaid');
    if (dockMermaidBtn) {
      dockMermaidBtn.addEventListener('click', () => {
        this.toggleMermaidExporter();
      });
    }

    const dockChaosBtn = document.getElementById('dockBtnChaos');
    if (dockChaosBtn) {
      dockChaosBtn.addEventListener('click', () => {
        this.toggleChaosEngineering();
      });
    }

    const dockRehearsalBtn = document.getElementById('dockBtnRehearsal');
    if (dockRehearsalBtn) {
      dockRehearsalBtn.addEventListener('click', () => {
        this.toggleRehearsalEvaluator();
      });
    }

    const dockPackagerBtn = document.getElementById('dockBtnPackager');
    if (dockPackagerBtn) {
      dockPackagerBtn.addEventListener('click', () => {
        this.toggleExecutivePackager();
      });
    }

    const dockTopologyDiffBtn = document.getElementById('dockBtnTopologyDiff');
    if (dockTopologyDiffBtn) {
      dockTopologyDiffBtn.addEventListener('click', () => {
        this.toggleTopologyComparator();
      });
    }

    const dockThreatBtn = document.getElementById('dockBtnThreat');
    if (dockThreatBtn) {
      dockThreatBtn.addEventListener('click', () => {
        this.toggleThreatModeler();
      });
    }

    const dockSentimentBtn = document.getElementById('dockBtnSentiment');
    if (dockSentimentBtn) {
      dockSentimentBtn.addEventListener('click', () => {
        this.toggleSentimentCloud();
      });
    }

    const dockDRBtn = document.getElementById('dockBtnDR');
    if (dockDRBtn) {
      dockDRBtn.addEventListener('click', () => {
        this.toggleDRFailoverHUD();
      });
    }

    const dockComplianceBtn = document.getElementById('dockBtnCompliance');
    if (dockComplianceBtn) {
      dockComplianceBtn.addEventListener('click', () => {
        this.toggleComplianceLedger();
      });
    }

    const dockPosterBtn = document.getElementById('dockBtnPoster');
    if (dockPosterBtn) {
      dockPosterBtn.addEventListener('click', () => {
        this.toggleSlidePoster();
      });
    }

    const dockObjectionBtn = document.getElementById('dockBtnObjection');
    if (dockObjectionBtn) {
      dockObjectionBtn.addEventListener('click', () => {
        this.toggleObjectionDefense();
      });
    }

    const dockVoiceBtn = document.getElementById('dockBtnVoiceCmd');
    if (dockVoiceBtn) {
      dockVoiceBtn.addEventListener('click', () => {
        this.toggleVoiceCommander();
      });
    }

    const dockGestureBtn = document.getElementById('dockBtnGesture');
    if (dockGestureBtn) {
      dockGestureBtn.addEventListener('click', () => {
        this.toggleSpatialGesture();
      });
    }

    const dockWhiteLabelBtn = document.getElementById('dockBtnWhiteLabel');
    if (dockWhiteLabelBtn) {
      dockWhiteLabelBtn.addEventListener('click', () => {
        this.toggleWhiteLabel();
      });
    }

    const dockPortalBtn = document.getElementById('dockBtnClientPortal');
    if (dockPortalBtn) {
      dockPortalBtn.addEventListener('click', () => {
        this.toggleClientPortal();
      });
    }

    const dockRehearsalPlaybookBtn = document.getElementById('dockBtnRehearsalPlaybook');
    if (dockRehearsalPlaybookBtn) {
      dockRehearsalPlaybookBtn.addEventListener('click', () => {
        this.toggleRehearsalPlaybook();
      });
    }
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignore if typing inside input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.key) {
        case ' ':
        case 'ArrowRight':
          e.preventDefault();
          this.nextStage();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.prevStage();
          break;
        case '1': case '2': case '3': case '4': case '5': case '6':
          if (e.key === '3' && this.currentStageIndex === 1) {
            // Toggle 3D Holodeck on Stage 2
            this.toggle3DHolodeck();
          } else {
            this.goToStage(parseInt(e.key) - 1);
          }
          break;
        case 'v': case 'V':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleVoiceCommander();
          } else {
            this.toggleVoiceNarration();
          }
          break;
        case 'r': case 'R':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleRehearsalEvaluator();
          } else {
            this.toggleSessionRecording();
          }
          break;
        case 'u': case 'U':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleComplianceLedger();
          } else {
            this.toggleSpotlightQuestionHUD();
          }
          break;
        case 'a': case 'A':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleArchitectureCopilot();
          } else {
            this.toggleAutoplay();
          }
          break;
        case 'g': case 'G':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleSpatialGesture();
          } else {
            this.toggleSlidesGrid();
          }
          break;
        case 'n': case 'N':
          this.toggleSpeakerNotes();
          break;
        case 'w': case 'W':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleKeynoteWatermark();
          } else {
            this.togglePresenterWhisper();
          }
          break;
        case 'e': case 'E':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleThreatModeler();
          } else {
            this.exportPdfDeck();
          }
          break;
        case 'l': case 'L':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleWhiteLabel();
          } else {
            this.toggleLaserPointer();
          }
          break;
        case 's': case 'S':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleKeynoteSubtitles();
          } else {
            this.toggleSpotlight();
          }
          break;
        case 'q': case 'Q':
          this.toggleQrModal();
          break;
        case 'f': case 'F':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleFinOpsCalculator();
          } else {
            this.toggleFullscreen();
          }
          break;
        case 'p': case 'P':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleLatencyWaterfall();
          } else {
            this.openWarRoom();
          }
          break;
        case 'd': case 'D':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleTopologyComparator();
          } else {
            this.toggleDrawingPen();
          }
          break;
        case 'c': case 'C':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleChaosEngineering();
          } else if (this.isPenActive) {
            this.clearDrawingPen();
          } else {
            this.toggleDirectorMode();
          }
          break;
        case 'x': case 'X':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleObjectionDefense();
          } else {
            this.clearDrawingPen();
          }
          break;
        case 'm': case 'M':
          if (e.shiftKey) {
            this.toggleTimeMachine();
          } else {
            this.toggleExecutiveSoundscape();
          }
          break;
        case 'h': case 'H':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleAudienceHeatmap();
          } else {
            this.toggleExecutiveDockHUD();
          }
          break;
        case 't': case 'T':
          if (e.shiftKey) {
            this.cycleSpatialTheme();
          } else {
            this.toggleTeleprompterHUD();
          }
          break;
        case 'y': case 'Y':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleDRFailoverHUD();
          } else {
            this.toggleScenarioEngine();
          }
          break;
        case 'k': case 'K':
          this.recordCinematicTeaser();
          break;
        case 'o': case 'O':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleSentimentCloud();
          } else {
            this.toggleStagePollHUD();
          }
          break;
        case 'j': case 'J':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleClientPortal();
          } else if (this.comparisonMatrix) {
            this.comparisonMatrix.toggle();
          }
          break;
        case 'b': case 'B':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleSlidePoster();
          } else {
            briefingExporter.downloadBriefingHTML(this.manifest, this.pipelineGraph);
          }
          break;
        case 'z': case 'Z':
          if (e.shiftKey) {
            e.preventDefault();
            this.toggleRehearsalPlaybook();
          } else {
            if (this.currentStageIndex !== 1) this.goToStage(1);
            this.packetTracer?.toggle();
          }
          break;
        case 'i': case 'I':
          this.readinessAudit?.toggle();
          break;
        case 'Escape':
          this.dismissModals();
          break;
      }
    });
  }

  nextStage() {
    const visibleSequence = this.customSlideOrder.filter(idx => !this.hiddenSlides.has(idx));
    const currentSeqPos = visibleSequence.indexOf(this.currentStageIndex);
    const prevStage = this.currentStageIndex;
    if (currentSeqPos !== -1 && currentSeqPos < visibleSequence.length - 1) {
      soundEngine.playWhoosh();
      this.currentStageIndex = visibleSequence[currentSeqPos + 1];
      this.recordSlideDwell(prevStage, this.currentStageIndex);
      this.renderCurrentStage();
    } else if (currentSeqPos === -1 && this.currentStageIndex < 5) {
      soundEngine.playWhoosh();
      this.currentStageIndex++;
      this.recordSlideDwell(prevStage, this.currentStageIndex);
      this.renderCurrentStage();
    }
  }

  prevStage() {
    const visibleSequence = this.customSlideOrder.filter(idx => !this.hiddenSlides.has(idx));
    const currentSeqPos = visibleSequence.indexOf(this.currentStageIndex);
    const prevStage = this.currentStageIndex;
    if (currentSeqPos > 0) {
      soundEngine.playWhoosh();
      this.currentStageIndex = visibleSequence[currentSeqPos - 1];
      this.recordSlideDwell(prevStage, this.currentStageIndex);
      this.renderCurrentStage();
    } else if (currentSeqPos === -1 && this.currentStageIndex > 0) {
      soundEngine.playWhoosh();
      this.currentStageIndex--;
      this.recordSlideDwell(prevStage, this.currentStageIndex);
      this.renderCurrentStage();
    }
  }

  goToStage(idx) {
    if (idx >= 0 && idx <= 5 && idx !== this.currentStageIndex) {
      soundEngine.playWhoosh();
      const prevStage = this.currentStageIndex;
      this.currentStageIndex = idx;
      this.recordSlideDwell(prevStage, this.currentStageIndex);
      this.renderCurrentStage();
    }
  }

  renderCurrentStage() {
    this.humanRehearsalPlaybook?.syncCurrentSlide(this.currentStageIndex);

    // Hide all stage sections
    for (let i = 1; i <= 6; i++) {
      const sec = document.getElementById(`stageSection${i}`);
      if (sec) sec.style.display = (i === this.currentStageIndex + 1) ? 'block' : 'none';
    }

    // Update nav pills
    document.querySelectorAll('.stage-nav-pill').forEach((pill, idx) => {
      if (idx === this.currentStageIndex) {
        pill.classList.add('badge-cyan');
        pill.style.background = 'rgba(0,240,255,0.15)';
      } else {
        pill.classList.remove('badge-cyan');
        pill.style.background = 'transparent';
      }
    });

    // Populate specific stage views
    switch (this.currentStageIndex) {
      case 0: this.renderStage1Hero(); break;
      case 1: this.renderStage2Architecture(); break;
      case 2: this.renderStage3Sandbox(); break;
      case 3: this.renderStage4DeviceFrames(); break;
      case 4: this.renderStage5BentoMatrix(); break;
      case 5: this.renderStage6AudienceRemote(); break;
    }

    // Phase 7: Update Keynote Progress Ribbon, Prompter Notes & Light Table
    this.updateSlideProgress();
    this.updateSpeakerNotesContent();

    // Broadcast live slide state to Supabase Realtime Mesh (Task T184)
    supabaseRealtime.broadcast('SLIDE_CHANGE', {
      slideIndex: this.currentStageIndex,
      totalSlides: 6,
      timestamp: Date.now()
    });
    if (this.isSlidesGridOpen) {
      this.populateSlidesGrid();
    }

    // Phase 16: Sync Teleprompter HUD with Current Stage Talking Points (T077)
    if (this.teleprompterHUD) {
      this.teleprompterHUD.syncStageScript(this.currentStageIndex);
    }

    // Phase 10: Automatic Executive Voice Narration & Session Recording per Slide
    if (this.isNarrating) {
      this.narrateCurrentSlide();
    }
    if (this.isRecording) {
      sessionRecorder.record('STAGE_JUMP', { stageIndex: this.currentStageIndex });
    }

    // Phase 11: Update Floating Executive Control Dock Pills & Play Harmonic Chime (T053, T054)
    document.querySelectorAll('#dockStagePills .dock-pill').forEach(pill => {
      const pIdx = parseInt(pill.dataset.stage, 10);
      pill.classList.toggle('active', pIdx === this.currentStageIndex);
    });
    soundEngine.playSlideChime();

    // Phase 18: Broadcast state to Dual-Screen Presenter Mirror & Confidence Monitors (Task T089)
    presenterMirror.broadcastStageState(this.currentStageIndex, this.manifest, this.pipelineGraph);

    // If Director Mode is active, coordinate 3D spatial orbit
    if (this.isDirectorMode && this.holodeckEngine && this.is3DActive) {
      this.holodeckEngine.directorLastSwitchTime = Date.now();
    }
  }

  // ================= STAGE 1: HERO & RADAR =================
  renderStage1Hero() {
    document.getElementById('heroTitle').textContent = this.manifest.name;
    document.getElementById('heroTagline').textContent = this.manifest.tagline;
    
    // Tech stack pills
    const container = document.getElementById('heroTechPills');
    if (container) {
      container.innerHTML = this.manifest.techStack.map(t => `
        <span class="cyber-badge" style="color: ${inputShield.escapeHtml(t.color || 'var(--accent-cyan)')}; border-color: ${inputShield.escapeHtml(t.color || 'var(--accent-cyan)')};">
          ${inputShield.escapeHtml(t.name)}
        </span>
      `).join('');
    }

    // Stat boxes
    document.getElementById('heroStatFiles').textContent = this.manifest.stats.totalFiles || '38';
    document.getElementById('heroStatLoc').textContent = this.manifest.stats.totalLinesOfCode 
      ? (this.manifest.stats.totalLinesOfCode).toLocaleString() 
      : '3,840';
    document.getElementById('heroStatScore').textContent = `${Math.round(this.manifest.confidenceScore * 100)}%`;

    // Holographic Animated Radar Mount
    const radarContainer = document.getElementById('holographicRadarContainer');
    if (radarContainer) {
      mountHolographicRadar(radarContainer, this.manifest.techStack);
    }
  }

  // ================= STAGE 2: 2D/3D ARCHITECTURE =================
  renderStage2Architecture() {
    const canvas = document.getElementById('pipelineSvgCanvas');
    const nodesContainer = document.getElementById('pipelineNodesContainer');
    if (!canvas || !nodesContainer || !this.pipelineGraph) return;

    nodesContainer.innerHTML = '';
    canvas.innerHTML = '';

    const nodes = this.pipelineGraph.nodes || [];
    const edges = this.pipelineGraph.edges || [];

    // Render Edges as animated SVG lines
    edges.forEach(edge => {
      const srcNode = nodes.find(n => n.id === edge.source);
      const tgtNode = nodes.find(n => n.id === edge.target);
      if (srcNode && tgtNode) {
        const x1 = srcNode.position2D.x + 220;
        const y1 = srcNode.position2D.y + 60;
        const x2 = tgtNode.position2D.x;
        const y2 = tgtNode.position2D.y + 60;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const dx = (x2 - x1) * 0.5;
        path.setAttribute('d', `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`);
        path.setAttribute('stroke', edge.color || '#00F0FF');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('class', 'photon-edge');
        canvas.appendChild(path);

        // Protocol badge in center
        const badgeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        badgeText.setAttribute('x', (x1 + x2) / 2);
        badgeText.setAttribute('y', (y1 + y2) / 2 - 8);
        badgeText.setAttribute('fill', '#94A3B8');
        badgeText.setAttribute('font-size', '11');
        badgeText.setAttribute('font-family', 'JetBrains Mono');
        badgeText.setAttribute('text-anchor', 'middle');
        badgeText.textContent = edge.protocol || 'Data Bus';
        canvas.appendChild(badgeText);
      }
    });

    // Render 2D Node Cards
    nodes.forEach(node => {
      const card = document.createElement('div');
      card.className = 'cyber-card pipeline-node-card';
      card.dataset.nodeId = node.id;
      card.dataset.tier = this.getNodeTier(node);
      card.style.position = 'absolute';
      card.style.left = `${node.position2D.x}px`;
      card.style.top = `${node.position2D.y}px`;
      card.style.width = '220px';
      card.style.padding = '16px';
      card.style.cursor = 'pointer';

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="cyber-badge" style="color: ${node.color}; font-size: 10px; padding: 2px 8px;">
            ${node.badge}
          </span>
          <span style="font-size: 11px; color: var(--accent-emerald);">● LIVE</span>
        </div>
        <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: var(--text-primary);">
          ${node.label}
        </div>
        <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">
          ${node.sublabel}
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; font-family: var(--font-mono); color: var(--text-dim); border-top: 1px solid var(--border-subtle); padding-top: 8px;">
          <span>${node.metrics?.latency || '8ms'}</span>
          <span style="color: var(--accent-cyan);">Inspect &gt;</span>
        </div>
      `;

      card.addEventListener('click', () => {
        soundEngine.playClick();
        this.openCodeDrawer(node);
      });

      nodesContainer.appendChild(card);
    });

    // Phase 17: Update or preserve subsystem tier filter selection
    if (this.activeTierFilter && this.activeTierFilter !== 'all') {
      this.filterSubsystemTier(this.activeTierFilter);
    } else {
      const countDisplay = document.getElementById('tierActiveNodesDisplay');
      if (countDisplay) countDisplay.textContent = `${nodes.length} Subsystems`;
    }
  }

  /**
   * Evaluates the subsystem architectural tier of a node (Task T082)
   */
  getNodeTier(node) {
    if (!node) return 'compute';
    const text = `${node.badge || ''} ${node.label || ''} ${node.sublabel || ''} ${node.filePath || ''}`.toLowerCase();
    if (text.includes('gateway') || text.includes('ingress') || text.includes('client') || text.includes('api') || text.includes('frontend')) {
      return 'ingress';
    }
    if (text.includes('db') || text.includes('storage') || text.includes('redis') || text.includes('postgres') || text.includes('sql') || text.includes('finops') || text.includes('data')) {
      return 'data';
    }
    if (text.includes('edge') || text.includes('hardware') || text.includes('webrtc') || text.includes('device') || text.includes('mesh') || text.includes('embedded') || text.includes('sensor')) {
      return 'edge';
    }
    return 'compute';
  }

  /**
   * Initializes tier filter button click listeners (Task T082)
   */
  setupTierFilters() {
    const filterBar = document.getElementById('subsystemTierFilterBar');
    if (!filterBar) return;

    filterBar.querySelectorAll('.tier-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tier = btn.dataset.tier || 'all';
        this.filterSubsystemTier(tier);
      });
    });
  }

  /**
   * Filters Stage 2 architectural subsystems with smooth opacity & line dimming (Task T082)
   */
  filterSubsystemTier(tierKey) {
    this.activeTierFilter = tierKey;
    soundEngine.playClick();

    // Update button active state
    const filterBar = document.getElementById('subsystemTierFilterBar');
    if (filterBar) {
      filterBar.querySelectorAll('.tier-filter-btn').forEach(btn => {
        const isMatch = btn.dataset.tier === tierKey;
        btn.classList.toggle('active', isMatch);
        if (isMatch) {
          btn.style.borderColor = '#00F0FF';
          btn.style.color = '#00F0FF';
          btn.style.background = 'rgba(0, 240, 255, 0.12)';
        } else {
          btn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          btn.style.color = 'var(--text-muted)';
          btn.style.background = 'rgba(255, 255, 255, 0.03)';
        }
      });
    }

    // Filter 2D Node Cards
    const nodeCards = document.querySelectorAll('.pipeline-node-card');
    let visibleCount = 0;
    let totalLatency = 0;

    nodeCards.forEach(card => {
      const cardTier = card.dataset.tier || 'compute';
      const isVisible = (tierKey === 'all' || cardTier === tierKey);
      if (isVisible) {
        card.style.opacity = '1';
        card.style.filter = 'none';
        card.style.pointerEvents = 'auto';
        visibleCount++;
        const latText = card.querySelector('span:first-child')?.textContent || '8ms';
        const latVal = parseInt(latText, 10) || 8;
        totalLatency += latVal;
      } else {
        card.style.opacity = '0.22';
        card.style.filter = 'grayscale(80%)';
        card.style.pointerEvents = 'none';
      }
    });

    // Update active edges on SVG canvas
    const svgPaths = document.querySelectorAll('#pipelineSvgCanvas path.photon-edge');
    svgPaths.forEach(path => {
      if (tierKey === 'all') {
        path.style.opacity = '1';
        path.style.strokeWidth = '2';
      } else {
        path.style.opacity = '0.25';
        path.style.strokeWidth = '1';
      }
    });

    // Update display counter & telemetry
    const countDisplay = document.getElementById('tierActiveNodesDisplay');
    if (countDisplay) {
      countDisplay.textContent = `${visibleCount} Subsystems`;
    }

    const latencySummary = document.getElementById('tierLatencySummary');
    if (latencySummary) {
      const avgLat = visibleCount > 0 ? Math.round(totalLatency / visibleCount) : 8;
      latencySummary.textContent = `${avgLat}ms Avg Latency`;
    }
  }

  openCodeDrawer(node) {
    if (this.nodeInspector) {
      this.nodeInspector.inspect(node);
      return;
    }

    const drawer = document.getElementById('codeDrawer');
    if (!drawer) return;

    document.getElementById('drawerNodeTitle').textContent = node.label;
    document.getElementById('drawerNodeFile').textContent = node.filePath || 'Source Code';
    document.getElementById('drawerNodeDesc').textContent = node.details.description;
    
    const pointsList = document.getElementById('drawerTalkingPoints');
    pointsList.innerHTML = (node.details.talkingPoints || []).map(p => `<li>${inputShield.escapeHtml(p)}</li>`).join('');

    const codeContainer = document.getElementById('drawerCodeContainer');
    if (codeContainer) {
      renderHighlightedCode(codeContainer, node.codeSnippet || '// No code preview available', 'python');
    }

    drawer.style.transform = 'translateX(0)';
  }

  toggle3DHolodeck() {
    this.is3DActive = !this.is3DActive;
    soundEngine.playWhoosh();

    const canvas2D = document.getElementById('stage2DView');
    const holodeck3D = document.getElementById('stage3DView');

    if (this.is3DActive) {
      canvas2D.style.display = 'none';
      holodeck3D.style.display = 'block';
      document.getElementById('btn3DToggle').textContent = '2D Diagram View (Press 3)';

      const canvas = document.getElementById('holodeckCanvas');
      if (canvas && !this.holodeckEngine) {
        this.holodeckEngine = new HolodeckGalaxyEngine(canvas, (selectedNode) => {
          soundEngine.playClick();
          this.openCodeDrawer(selectedNode);
        });
        if (this.pipelineGraph && this.pipelineGraph.nodes) {
          this.holodeckEngine.loadNodes(this.pipelineGraph.nodes);
        }
      }
      if (this.holodeckEngine) {
        this.holodeckEngine.start();
      }
    } else {
      canvas2D.style.display = 'block';
      holodeck3D.style.display = 'none';
      document.getElementById('btn3DToggle').textContent = '3D Holodeck Galaxy (Press 3)';
      if (this.holodeckEngine) {
        this.holodeckEngine.stop();
      }
    }
  }

  // ================= STAGE 3: EXECUTION SANDBOX & ARCHETYPE RUNTIMES =================
  renderStage3Sandbox() {
    const mount = document.getElementById('cyberTerminalMount');
    if (!mount) return;

    // Type C (Backend APIs & Services): Mount Interactive API Playground & SQL Schema
    if (this.manifest && this.manifest.archetype === 'TYPE_C') {
      mountApiPlayground(mount, this.manifest);
      const statusPill = document.getElementById('sandboxStatusPill');
      if (statusPill) {
        statusPill.textContent = 'REST API & SQL READY';
        statusPill.className = 'cyber-badge badge-cyan';
      }
      return;
    }

    // Type D (Data Science & ML): Mount Accuracy/Loss Gauges & Training Telemetry
    if (this.manifest && this.manifest.archetype === 'TYPE_D') {
      mountMlGauges(mount, this.manifest);
      const statusPill = document.getElementById('sandboxStatusPill');
      if (statusPill) {
        statusPill.textContent = 'NEURAL WEIGHTS LOADED';
        statusPill.className = 'cyber-badge badge-violet';
      }
      return;
    }

    // Default: Pyodide WebAssembly Cyber Terminal (Type A, B, etc.)
    if (!this.cyberTerminal) {
      this.cyberTerminal = new CyberTerminalUI(mount);
    }
  }

  async runSimulationSandbox() {
    soundEngine.playClick();
    if (this.isRecording) {
      sessionRecorder.record('SANDBOX_EXECUTE', { stageIndex: this.currentStageIndex });
    }
    const statusPill = document.getElementById('sandboxStatusPill');
    if (statusPill) {
      statusPill.textContent = 'EXECUTING (Pyodide WASM)';
      statusPill.className = 'cyber-badge badge-cyan';
    }

    if (this.cyberTerminal) {
      this.cyberTerminal.clear();
      this.cyberTerminal.setStatus('● EXECUTING PIPELINE...', '#00F0FF');
    }

    await sandboxRunner.executePipeline(
      this.manifest,
      (log) => {
        if (this.cyberTerminal) {
          this.cyberTerminal.appendLog(log);
        }
      },
      (nodeId) => {
        this.pulseNode(nodeId);
      }
    );

    soundEngine.playSuccess();
    if (statusPill) {
      statusPill.textContent = 'EXECUTION SUCCESS (200 OK)';
      statusPill.className = 'cyber-badge badge-emerald';
    }
    if (this.cyberTerminal) {
      this.cyberTerminal.setStatus('● SUCCESS (200 OK)', '#10B981');
    }
  }

  pulseNode(nodeId) {
    if (!nodeId) return;
    const card = document.querySelector(`.pipeline-node-card[data-node-id="${nodeId}"]`);
    if (card) {
      card.style.transition = 'all 0.15s ease';
      card.style.boxShadow = '0 0 35px #00F0FF, inset 0 0 15px rgba(0,240,255,0.4)';
      card.style.borderColor = '#00F0FF';
      card.style.transform = 'scale(1.04)';
      setTimeout(() => {
        card.style.boxShadow = '';
        card.style.borderColor = '';
        card.style.transform = '';
      }, 500);
    }
  }

  // ================= STAGE 4: DEVICE FRAMES & SCREEN SIMULATORS =================
  renderStage4DeviceFrames() {
    const frame = document.getElementById('mockupFrame');
    if (!frame) return;

    // Type E (Mobile & Desktop Apps): Mount Screen Flow Simulator
    if (this.manifest && this.manifest.archetype === 'TYPE_E') {
      mountScreenSimulator(frame, this.manifest);
      return;
    }

    // Type F (Generic / Unknown): Mount Universal File Constellation Nebula
    if (this.manifest && this.manifest.archetype === 'TYPE_F') {
      mountConstellationNebula(frame, this.manifest);
      return;
    }

    // Default: Apple Studio Display XDR & iPhone 16 Pro Viewport Frames (Type A, B, C, D)
    if (!this.deviceFrames) {
      this.deviceFrames = new DeviceFramesUI(frame);
      this.deviceFrames.setManifest(this.manifest);
    } else if (this.deviceFrames) {
      this.deviceFrames.setManifest(this.manifest);
    }

    document.querySelectorAll('.viewport-btn').forEach(btn => {
      btn.onclick = () => {
        const target = btn.dataset.viewport;
        if (this.deviceFrames) {
          this.deviceFrames.setViewport(target);
        }
        document.querySelectorAll('.viewport-btn').forEach(b => {
          b.className = (b === btn) ? 'btn btn-primary viewport-btn' : 'btn btn-secondary viewport-btn';
        });
      };
    });

    document.querySelectorAll('.proto-btn').forEach(btn => {
      btn.onclick = () => {
        const proto = btn.dataset.proto;
        if (this.deviceFrames) {
          this.deviceFrames.setPrototype(proto);
        }
        document.querySelectorAll('.proto-btn').forEach(b => {
          const isActive = (b === btn);
          b.className = isActive ? 'proto-btn active btn btn-secondary' : 'proto-btn btn btn-secondary';
          b.style.borderColor = isActive ? '#00F0FF' : '';
          b.style.color = isActive ? '#00F0FF' : '';
          b.style.background = isActive ? 'rgba(0,240,255,0.12)' : '';
        });
      };
    });
  }

  // ================= STAGE 5: BENTO ROI =================
  renderStage5BentoMatrix() {
    const mount = document.getElementById('bentoRoiMount');
    if (mount && !this.bentoRoi) {
      this.bentoRoi = new BentoRoiUI(mount);
    } else if (this.bentoRoi) {
      this.bentoRoi.startCountUp();
    }
  }

  // ================= STAGE 6: AUDIENCE REMOTE =================
  renderStage6AudienceRemote() {
    const tallies = remoteSync.getPollTallies('arch_value_poll');
    this.updateStagePollUI(tallies);

    document.querySelectorAll('.reaction-trigger-btn').forEach(btn => {
      btn.onclick = () => {
        const reaction = btn.dataset.reaction || btn.dataset.emoji || 'priority';
        if (this.emojiCanvas) {
          this.emojiCanvas.spawn(reaction);
        }
        remoteSync.sendReaction(reaction);
      };
    });
  }

  updateStagePollUI(tallies) {
    if (!tallies) return;
    const total = tallies.reduce((a, b) => a + b, 0) || 1;
    tallies.forEach((count, idx) => {
      const pct = Math.round((count / total) * 100);
      const bar = document.getElementById(`stagePollBar${idx}`);
      const label = document.getElementById(`stagePollPct${idx}`);
      if (bar) bar.style.width = `${pct}%`;
      if (label) label.textContent = `${pct}% (${count})`;
    });
  }

  // ================= STAGE WEAPONS =================
  setupStageWeapons() {
    this.penCanvas = document.getElementById('drawingPenCanvas');
    if (this.penCanvas) {
      this.resizePenCanvas();
      window.addEventListener('resize', () => this.resizePenCanvas());
      this.penCtx = this.penCanvas.getContext('2d');

      this.penCanvas.addEventListener('mousedown', (e) => {
        if (!this.isPenActive) return;
        this.isDrawing = true;
        this.penCtx.beginPath();
        this.penCtx.moveTo(e.clientX, e.clientY);
        this.penCtx.strokeStyle = '#00F0FF';
        this.penCtx.lineWidth = 3.5;
        this.penCtx.lineCap = 'round';
        this.penCtx.lineJoin = 'round';
        this.penCtx.shadowColor = '#00F0FF';
        this.penCtx.shadowBlur = 10;
        if (this.isRecording) {
          sessionRecorder.record('PEN_STROKE_START', { x: e.clientX, y: e.clientY });
        }
      });

      this.penCanvas.addEventListener('mousemove', (e) => {
        if (this.isDrawing && this.isPenActive && this.penCtx) {
          this.penCtx.lineTo(e.clientX, e.clientY);
          this.penCtx.stroke();
          if (this.isRecording) {
            sessionRecorder.record('PEN_STROKE_MOVE', { x: e.clientX, y: e.clientY });
          }
        }
      });

      window.addEventListener('mouseup', () => {
        this.isDrawing = false;
      });
    }

    window.addEventListener('mousemove', (e) => {
      if (this.isLaserActive && this.laserDot) {
        this.laserDot.style.left = `${e.clientX}px`;
        this.laserDot.style.top = `${e.clientY}px`;
        if (this.isRecording) {
          sessionRecorder.record('LASER_POS', { x: e.clientX, y: e.clientY });
        }
      }
      if (this.isSpotlightActive && this.spotlightMask) {
        this.spotlightMask.style.setProperty('--mouse-x', `${e.clientX}px`);
        this.spotlightMask.style.setProperty('--mouse-y', `${e.clientY}px`);
        if (this.isRecording) {
          sessionRecorder.record('SPOTLIGHT_POS', { x: e.clientX, y: e.clientY });
        }
      }
    });
  }

  resizePenCanvas() {
    if (!this.penCanvas) return;
    this.penCanvas.width = window.innerWidth;
    this.penCanvas.height = window.innerHeight;
  }

  toggleDrawingPen() {
    soundEngine.playClick();
    const nextMode = this.annotationCanvas.activeMode === 'DRAW' ? 'NONE' : 'DRAW';
    this.annotationCanvas.setMode(nextMode);
    this.isPenActive = (nextMode === 'DRAW');
    const dockBtn = document.getElementById('dockBtnPen');
    if (dockBtn) dockBtn.classList.toggle('active', this.isPenActive);
    if (this.isPenActive) this.recordInteraction('penDraws');
  }

  clearDrawingPen() {
    soundEngine.playWhoosh();
    this.annotationCanvas.clear();
  }

  toggleLaserPointer() {
    soundEngine.playLaser();
    const nextMode = this.annotationCanvas.activeMode === 'LASER' ? 'NONE' : 'LASER';
    this.annotationCanvas.setMode(nextMode);
    this.isLaserActive = (nextMode === 'LASER');
    const dockBtn = document.getElementById('dockBtnLaser');
    if (dockBtn) dockBtn.classList.toggle('active', this.isLaserActive);
    if (this.isLaserActive) this.recordInteraction('laserClicks');
  }

  toggleSpotlight() {
    soundEngine.playClick();
    const nextMode = this.annotationCanvas.activeMode === 'SPOTLIGHT' ? 'NONE' : 'SPOTLIGHT';
    this.annotationCanvas.setMode(nextMode);
    this.isSpotlightActive = (nextMode === 'SPOTLIGHT');
    const dockBtn = document.getElementById('dockBtnSpotlight');
    if (dockBtn) dockBtn.classList.toggle('active', this.isSpotlightActive);
    if (this.isSpotlightActive) this.recordInteraction('spotlightCount');
  }

  toggleQrModal() {
    soundEngine.playClick();
    const modal = document.getElementById('qrModal');
    if (modal) {
      modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
    }
  }

  toggleFullscreen() {
    soundEngine.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  openWarRoom() {
    soundEngine.playWhoosh();
    window.open(`war-room.html?id=${this.manifest.id}`, '_blank', 'width=1100,height=800');
  }

  // ================= PHASE 7: KEYNOTE PRESENTATION DECK METHODS =================

  /**
   * Updates Keynote Slide Progress Ribbon & Header Badges (Task T032)
   */
  updateSlideProgress() {
    const SLIDE_TITLES = [
      'EXECUTIVE SUMMARY & PROBLEM STATEMENT',
      'ARCHITECTURAL BLUEPRINT & 2D/3D HOLODECK',
      'IN-BROWSER CPYTHON EXECUTION SANDBOX',
      'MULTI-DEVICE RESPONSIVE VIEWPORTS',
      'BENTO-GRID ROI & BUSINESS IMPACT MATRIX',
      'AUDIENCE LIVE ENGAGEMENT & QR REMOTE'
    ];

    const numBadge = document.getElementById('currentSlideNumberBadge');
    if (numBadge) numBadge.textContent = `SLIDE ${this.currentStageIndex + 1} OF 6`;

    const titleBadge = document.getElementById('currentSlideTitleBadge');
    if (titleBadge) titleBadge.textContent = SLIDE_TITLES[this.currentStageIndex];

    const pct = Math.round(((this.currentStageIndex + 1) / 6) * 100);
    const pctEl = document.getElementById('slideProgressPct');
    if (pctEl) pctEl.textContent = `${pct}%`;

    const barEl = document.getElementById('slideProgressBar');
    if (barEl) barEl.style.width = `${pct}%`;
  }

  /**
   * Toggles In-Stage Speaker Notes Prompter HUD (Task T033, Hotkey 'N')
   */
  toggleSpeakerNotes(forceState = null) {
    this.isSpeakerNotesOpen = (forceState !== null) ? forceState : !this.isSpeakerNotesOpen;
    soundEngine.playClick();
    
    const hud = document.getElementById('speakerNotesHUD');
    if (hud) {
      if (this.isSpeakerNotesOpen) {
        this.updateSpeakerNotesContent();
        hud.classList.add('active');
      } else {
        hud.classList.remove('active');
      }
    }

    const btn = document.getElementById('btnSpeakerNotes');
    if (btn) {
      btn.style.borderColor = this.isSpeakerNotesOpen ? 'var(--accent-cyan)' : '';
      btn.style.color = this.isSpeakerNotesOpen ? 'var(--accent-cyan)' : '';
    }

    const dockBtn = document.getElementById('dockBtnNotes');
    if (dockBtn) dockBtn.classList.toggle('active', this.isSpeakerNotesOpen);
  }

  /**
   * Renders executive prompter notes tailored to the active slide and project manifest (Task T033)
   */
  updateSpeakerNotesContent() {
    const contentEl = document.getElementById('speakerNotesContent');
    if (!contentEl) return;

    const name = this.manifest ? this.manifest.name : 'System';
    const archetype = this.manifest && ARCHETYPE_METADATA[this.manifest.archetype] 
      ? ARCHETYPE_METADATA[this.manifest.archetype].name 
      : 'Engineering System';
    const files = this.manifest && this.manifest.stats ? this.manifest.stats.totalFiles || 38 : 38;
    const loc = this.manifest && this.manifest.stats ? (this.manifest.stats.totalLinesOfCode || 3840).toLocaleString() : '3,840';
    const tech = this.manifest && this.manifest.techStack ? this.manifest.techStack.map(t => t.name).join(', ') : 'Python, WebAssembly';

    const NOTES_DATA = [
      {
        slide: 1,
        title: 'Problem & Executive Vision',
        talkingPoints: [
          `Frame the high-stakes problem: Traditional pipelines suffer 35+ hours/week in manual friction and human incident overhead.`,
          `Introduce ${name}: Classifies as "${archetype}" with zero-upload client privacy and ${files} verified source files (${loc} LOC).`,
          `Direct attention to the center Holographic Tech Stack Radar highlighting core technologies: ${tech}.`,
          `Transition cue: "Now let's open the hood and see the 2D/3D living architecture that powers this engine."`
        ]
      },
      {
        slide: 2,
        title: 'Living Architecture (2D Pipeline & 3D Holodeck)',
        talkingPoints: [
          `Explain the dynamic directed acyclic graph: Glowing photon particles represent deterministic data flow between triggers, agents, and datastores.`,
          `Live interaction: Click any node to open the frosted glass syntax inspector with token-level highlighting.`,
          `Showstopper move: Press [3] or click "3D Holodeck Galaxy" to transform into a 1,200-particle orbital Three.js environment.`,
          `Transition cue: "Architecture is nothing without runtime verification. Let's execute real Python code right here in the browser."`
        ]
      },
      {
        slide: 3,
        title: 'In-Browser Execution Sandbox (CPython WebAssembly)',
        talkingPoints: [
          `Zero-Upload Privacy Guarantee: Point out that Pyodide executes raw Python 3.11 bytecode completely client-side in WebAssembly.`,
          `Click "Simulate Trigger Event" to stream real-time logs through the retro-modern Cyber Terminal with authentic audio keystrokes.`,
          `Observe the photon surge propagating through the pipeline nodes simultaneously.`,
          `Transition cue: "Our backend is proven. How does this look across the hardware our clients and operators use daily?"`
        ]
      },
      {
        slide: 4,
        title: 'Responsive Hardware Viewports',
        talkingPoints: [
          `Demonstrate Apple Pro Display XDR (32-inch 6K desktop) viewport with metal bezel and high-density UI layout.`,
          `Toggle to iPhone 16 Pro mockup to showcase mobile responsiveness and interactive Dynamic Island pill.`,
          `Emphasize responsive precision: zero layout shift across all form factors.`,
          `Transition cue: "Great technology must translate to balance-sheet return. Let's look at the Bento ROI matrix."`
        ]
      },
      {
        slide: 5,
        title: 'Bento-Grid ROI & Business Impact Matrix',
        talkingPoints: [
          `Highlight key business indicators: 84% reduction in incident triage latency, 99.98% operational uptime, and $142K/year saved.`,
          `Interactive Demo: Drag the Before vs. After comparison slider to visually contrast chaotic legacy processes against APEXFLOW OS.`,
          `Call out the dynamic ROI calculator: show how scaling team headcount yields quadratic compounding efficiency.`,
          `Transition cue: "Finally, let's engage the audience directly through our mobile second-screen remote."`
        ]
      },
      {
        slide: 6,
        title: 'Audience Live Engagement & WebRTC Remote',
        talkingPoints: [
          `Invite stakeholders or audience members to scan the on-screen QR code using any mobile camera.`,
          `Demonstrate instant PWA connection with zero app-store download needed.`,
          `Trigger live executive reaction pulses (Priority, Velocity, Endorse, Insight, Surge) and watch the 120 FPS stage-side photon simulation burst in real time.`,
          `Review real-time audience voting tallies synchronized across BroadcastChannel and WebRTC.`,
          `Closing Executive Call to Action: Summarize ROI, offer offline standalone deck bundle, and open floor for Q&A.`
        ]
      }
    ];

    const currentData = NOTES_DATA[this.currentStageIndex];
    contentEl.innerHTML = `
      <div style="font-weight: 700; color: #38BDF8; margin-bottom: 8px; font-family: var(--font-mono); font-size: 12px;">
        SLIDE ${currentData.slide}: ${currentData.title.toUpperCase()}
      </div>
      <ul style="margin: 0; padding-left: 20px; color: #CBD5E1; font-size: 12.5px; line-height: 1.65;">
        ${currentData.talkingPoints.map(point => `<li style="margin-bottom: 6px;">${point}</li>`).join('')}
      </ul>
    `;
  }

  /**
   * Toggles Slide Deck Light Table / Grid Overview Modal (Task T034, Hotkey 'G')
   */
  toggleSlidesGrid(forceState = null) {
    this.isSlidesGridOpen = (forceState !== null) ? forceState : !this.isSlidesGridOpen;
    soundEngine.playClick();
    
    const modal = document.getElementById('slidesGridModal');
    if (modal) {
      modal.style.display = this.isSlidesGridOpen ? 'flex' : 'none';
      if (this.isSlidesGridOpen) {
        this.populateSlidesGrid();
      }
    }

    const dockBtn = document.getElementById('dockBtnGrid');
    if (dockBtn) dockBtn.classList.toggle('active', this.isSlidesGridOpen);
  }

  /**
   * Populates the 6-slide light table overview cards (Task T034)
   */
  populateSlidesGrid() {
    const gridContainer = document.getElementById('slidesGridContainer');
    if (!gridContainer) return;

    const SLIDES_OVERVIEW = [
      {
        num: '01',
        title: 'Problem & Vision',
        desc: 'Executive summary, pain points vs APEXFLOW solution, holographic tech radar.',
        tag: 'Executive',
        color: '#38BDF8'
      },
      {
        num: '02',
        title: 'Living Architecture',
        desc: '2D directed graph with animated photon pulses & 3D Three.js Holodeck.',
        tag: 'Architecture',
        color: '#A855F7'
      },
      {
        num: '03',
        title: 'Execution Sandbox',
        desc: '100% in-browser WebAssembly Pyodide runtime & Cyber Terminal.',
        tag: 'Runtime',
        color: '#10B981'
      },
      {
        num: '04',
        title: 'Hardware Mockups',
        desc: 'Apple Pro Display XDR & iPhone 16 Pro responsive viewports.',
        tag: 'Responsive',
        color: '#00F0FF'
      },
      {
        num: '05',
        title: 'Bento ROI Matrix',
        desc: 'Real-time metrics, Before/After slider & economic ROI calculations.',
        tag: 'Business',
        color: '#F59E0B'
      },
      {
        num: '06',
        title: 'Audience Remote',
        desc: 'QR smartphone PWA, live emoji physics canvas & voting tallies.',
        tag: 'Interactive',
        color: '#EC4899'
      }
    ];

    gridContainer.innerHTML = SLIDES_OVERVIEW.map((s, idx) => {
      const isCurrent = (idx === this.currentStageIndex);
      return `
        <div class="slides-grid-card ${isCurrent ? 'current' : ''}" data-slide-index="${idx}">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: ${s.color};">
              SLIDE ${s.num}
            </span>
            <span class="cyber-badge" style="font-size: 9px; padding: 1px 6px; border-color: ${s.color}; color: ${s.color};">
              ${s.tag}
            </span>
          </div>
          
          <div>
            <h4 style="font-size: 15px; font-weight: 700; color: #F8FAFC; margin: 8px 0 4px 0;">
              ${s.title}
            </h4>
            <p style="font-size: 11px; color: #94A3B8; margin: 0; line-height: 1.4;">
              ${s.desc}
            </p>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-family: var(--font-mono); color: #64748B;">
            <span style="color: ${isCurrent ? '#10B981' : '#64748B'}; font-weight: ${isCurrent ? '700' : '400'};">
              ${isCurrent ? '● Active Slide' : 'Click to Jump'}
            </span>
            <span style="color: ${s.color}; font-weight: 700;">→</span>
          </div>
        </div>
      `;
    }).join('');

    // Attach click events
    gridContainer.querySelectorAll('.slides-grid-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.slideIndex, 10);
        this.goToStage(idx);
        this.toggleSlidesGrid(false);
      });
    });
  }

  /**
   * Toggles Autoplay Keynote Walkthrough Mode (Task T035, Hotkey 'A')
   */
  toggleAutoplay(forceState = null) {
    this.isAutoplay = (forceState !== null) ? forceState : !this.isAutoplay;
    soundEngine.playClick();
    const btn = document.getElementById('btnAutoplay');

    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }

    if (this.isAutoplay) {
      if (btn) {
        btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg><span>Pause (A)</span>`;
        btn.style.borderColor = '#10B981';
        btn.style.color = '#10B981';
        btn.style.boxShadow = '0 0 16px rgba(16,185,129,0.35)';
      }
      // Advance every 9 seconds automatically
      this.autoplayTimer = setInterval(() => {
        if (this.currentStageIndex >= 5) {
          this.goToStage(0);
        } else {
          this.nextStage();
        }
      }, 9000);
    } else {
      if (btn) {
        btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg><span>Autoplay (A)</span>`;
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.style.boxShadow = '';
      }
    }
  }

  /**
   * Exports 16:9 Landscape PDF Slide Deck (Task T036, Hotkey 'E')
   */
  exportPdfDeck() {
    soundEngine.playWhoosh();
    this.dismissModals();
    if (this.isAutoplay) this.toggleAutoplay(false);

    // Yield control so layout finishes settling before browser print dialog
    setTimeout(() => {
      window.print();
    }, 200);
  }

  // ================= PHASE 9: WHISPER HUD, CLOCK BRIDGE & BRAND THEMES =================

  /**
   * Updates Synchronized Stage Clock Bridge display (Task T044)
   */
  updateClockBridge(event) {
    const clockEl = document.getElementById('stageClockBridgeText');
    const clockBox = document.getElementById('stageClockBridgeContainer');
    if (!clockEl || !event.displayString) return;

    clockEl.textContent = event.displayString;
    if (clockBox) {
      if (event.isOvertime) {
        clockBox.style.borderColor = '#EF4444';
        clockBox.style.background = 'rgba(239, 68, 68, 0.16)';
        clockEl.style.color = '#EF4444';
      } else if (event.isWarning) {
        clockBox.style.borderColor = '#F59E0B';
        clockBox.style.background = 'rgba(245, 158, 11, 0.16)';
        clockEl.style.color = '#F59E0B';
      } else {
        clockBox.style.borderColor = 'rgba(0, 240, 255, 0.25)';
        clockBox.style.background = 'rgba(0, 240, 255, 0.06)';
        clockEl.style.color = 'var(--accent-cyan)';
      }
    }
  }

  /**
   * Displays discreet presenter whisper prompt from War Room (Task T047)
   */
  displayPresenterWhisper({ title, text, category = 'DEFENSE', autoDismissSec = 14 }) {
    const hud = document.getElementById('presenterWhisperHUD');
    const titleEl = document.getElementById('whisperTitle');
    const contentEl = document.getElementById('whisperContent');
    const badgeEl = document.getElementById('whisperCategoryBadge');
    if (!hud) return;

    soundEngine.playSuccess();
    if (titleEl) titleEl.textContent = title;
    if (contentEl) contentEl.textContent = text;
    if (badgeEl) badgeEl.textContent = `WHISPER • ${category}`;

    hud.style.display = 'block';
    if (this.whisperTimeout) clearTimeout(this.whisperTimeout);
    if (autoDismissSec > 0) {
      this.whisperTimeout = setTimeout(() => {
        hud.style.display = 'none';
      }, autoDismissSec * 1000);
    }
  }

  /**
   * Toggles Presenter Whisper HUD manually (Hotkey 'W')
   */
  togglePresenterWhisper(forceState = null) {
    const hud = document.getElementById('presenterWhisperHUD');
    if (!hud) return;
    const shouldShow = (forceState !== null) ? forceState : (hud.style.display === 'none' || !hud.style.display);
    hud.style.display = shouldShow ? 'block' : 'none';
    soundEngine.playClick();
  }

  /**
   * Applies custom brand white-labeling and watermark (Task T046)
   */
  applyBrandTheme(theme = null) {
    if (!theme) {
      try {
        const stored = localStorage.getItem('apexflow_brand_theme');
        if (stored) theme = JSON.parse(stored);
      } catch (e) {}
    }
    if (!theme) return;

    if (theme.accentColor) {
      document.documentElement.style.setProperty('--accent-cyan', theme.accentColor);
      document.documentElement.style.setProperty('--border-glow', theme.accentColor);
      document.documentElement.style.setProperty('--accent-cyan-glow', `${theme.accentColor}55`);
    }

    const watermarkEl = document.getElementById('stageWatermark');
    if (watermarkEl) {
      if (theme.watermark && theme.watermark.trim().length > 0) {
        watermarkEl.textContent = theme.watermark;
        watermarkEl.style.display = 'block';
      } else {
        watermarkEl.style.display = 'none';
      }
    }
  }

  /**
   * Updates custom slide ordering & hidden visibility from Slide Studio (Task T045)
   */
  applySlideStudioConfig({ slideOrder, hiddenSlides }) {
    if (Array.isArray(slideOrder)) this.customSlideOrder = slideOrder;
    if (Array.isArray(hiddenSlides)) this.hiddenSlides = new Set(hiddenSlides);
    this.updateSlideProgress();
  }

  // ================= PHASE 10: VOICE NARRATION, SESSION RECORDER & Q&A SPOTLIGHT =================

  /**
   * Retrieves talking points for a given slide index (Task T048)
   * @param {number} stageIndex
   * @returns {string[]}
   */
  getSlideTalkingPoints(stageIndex) {
    const name = this.manifest ? this.manifest.name : 'System';
    const archetype = this.manifest && ARCHETYPE_METADATA[this.manifest.archetype] 
      ? ARCHETYPE_METADATA[this.manifest.archetype].name 
      : 'Engineering System';
    const files = this.manifest && this.manifest.stats ? this.manifest.stats.totalFiles || 38 : 38;
    const loc = this.manifest && this.manifest.stats ? (this.manifest.stats.totalLinesOfCode || 3840).toLocaleString() : '3,840';
    const tech = this.manifest && this.manifest.techStack ? this.manifest.techStack.map(t => t.name).join(', ') : 'Python, WebAssembly';

    const points = [
      [
        `Frame the high-stakes problem: Traditional pipelines suffer 35+ hours per week in manual friction and human incident overhead.`,
        `Introduce ${name}: Classifies as ${archetype} with zero-upload client privacy and ${files} verified source files (${loc} LOC).`,
        `Direct attention to the center Holographic Tech Stack Radar highlighting core technologies: ${tech}.`,
        `Transition cue: Now let us open the hood and see the 2D and 3D living architecture that powers this engine.`
      ],
      [
        `Explain the dynamic directed acyclic graph: Glowing photon particles represent deterministic data flow between triggers, agents, and datastores.`,
        `Live interaction: Click any node to open the frosted glass syntax inspector with token-level highlighting.`,
        `Showstopper move: Press 3 or click 3D Holodeck Galaxy to transform into a 1,200-particle orbital Three.js environment.`,
        `Transition cue: Architecture is nothing without runtime verification. Let us execute real Python code right here in the browser.`
      ],
      [
        `Zero-Upload Privacy Guarantee: Pyodide executes raw Python 3.11 bytecode completely client-side in WebAssembly.`,
        `Click Simulate Trigger Event to stream real-time logs through the retro-modern Cyber Terminal with authentic audio keystrokes.`,
        `Observe the photon surge propagating through the pipeline nodes simultaneously.`,
        `Transition cue: Our backend is proven. How does this look across the hardware our clients and operators use daily?`
      ],
      [
        `Demonstrate Apple Pro Display XDR 32-inch 6K desktop viewport with metal bezel and high-density UI layout.`,
        `Toggle to iPhone 16 Pro mockup to showcase mobile responsiveness and interactive Dynamic Island pill.`,
        `Emphasize responsive precision: zero layout shift across all form factors.`,
        `Transition cue: Great technology must translate to balance-sheet return. Let us look at the Bento ROI matrix.`
      ],
      [
        `Highlight key business indicators: 84% reduction in incident triage latency, 99.98% operational uptime, and $142,000 saved per year.`,
        `Interactive Demo: Drag the Before vs. After comparison slider to visually contrast chaotic legacy processes against APEXFLOW OS.`,
        `Call out the dynamic ROI calculator: show how scaling team headcount yields quadratic compounding efficiency.`,
        `Transition cue: Finally, let us engage the audience directly through our mobile second-screen remote.`
      ],
      [
        `Invite stakeholders or audience members to scan the on-screen QR code using any mobile camera.`,
        `Demonstrate instant PWA connection with zero app-store download needed.`,
        `Send live emoji reactions and watch the 120 FPS stage-side physics simulation burst in real time.`,
        `Review real-time audience voting tallies synchronized across BroadcastChannel and WebRTC.`,
        `Closing Executive Call to Action: Summarize ROI, offer offline standalone deck bundle, and open floor for Q&A.`
      ]
    ];

    return points[stageIndex] || [
      `Review key architectural milestones for this stage.`,
      `Highlight client-side performance, zero latency, and verified stability.`
    ];
  }

  /**
   * Toggles Client-Side Executive Voice Narration (Task T048, Hotkey 'V')
   */
  toggleVoiceNarration(forceState = null) {
    this.isNarrating = (forceState !== null) ? forceState : !this.isNarrating;
    soundEngine.playClick();

    const btn = document.getElementById('btnVoiceNarrate');
    const ticker = document.getElementById('narrationKaraokeTicker');
    const dockVoice = document.getElementById('dockBtnVoice');

    if (this.isNarrating) {
      if (btn) {
        btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> <span>Speaking (V)</span>';
        btn.style.borderColor = 'var(--accent-cyan)';
        btn.style.color = 'var(--accent-cyan)';
        btn.style.background = 'rgba(0, 240, 255, 0.12)';
      }
      if (dockVoice) dockVoice.classList.add('active');
      this.narrateCurrentSlide();
    } else {
      if (btn) {
        btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> <span>Voice (V)</span>';
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.style.background = '';
      }
      if (dockVoice) dockVoice.classList.remove('active');
      if (ticker) ticker.style.display = 'none';
      voiceNarrator.stop();
      if (this.holodeckEngine) {
        this.holodeckEngine.setAudioReactive(false);
      }
    }
  }

  /**
   * Narrates the active slide using Web Speech API with real-time karaoke subtitles
   */
  narrateCurrentSlide() {
    if (!this.isNarrating) return;

    const SLIDE_TITLES = [
      'Executive Summary & Problem Statement',
      'Architectural Blueprint & Living Pipeline',
      'In-Browser WebAssembly Execution Sandbox',
      'Multi-Device Responsive Hardware Viewports',
      'Bento-Grid ROI & Business Impact Matrix',
      'Audience Live Engagement & WebRTC Remote'
    ];

    const title = SLIDE_TITLES[this.currentStageIndex] || 'Keynote Slide';
    const points = this.getSlideTalkingPoints(this.currentStageIndex);
    const archetype = this.manifest ? this.manifest.archetype : 'TYPE_A';

    const ticker = document.getElementById('narrationKaraokeTicker');
    const tickerText = document.getElementById('karaokeTickerText');
    if (ticker) ticker.style.display = 'flex';

    if (this.isRecording) {
      sessionRecorder.record('VOICE_NARRATION_START', {
        slideIndex: this.currentStageIndex,
        title
      });
    }

    voiceNarrator.narrateSlide({
      slideIndex: this.currentStageIndex,
      title,
      points,
      archetype,
      onStart: (fullText) => {
        if (tickerText) tickerText.textContent = fullText;
        if (this.holodeckEngine) {
          this.holodeckEngine.setAudioReactive(true, 1.8);
        }
      },
      onBoundary: (data) => {
        const spokenWord = data?.spokenWord || data?.word || '';
        const charIdx = data?.charIdx !== undefined ? data.charIdx : (data?.charIndex || 0);
        const fullScript = data?.fullScript || data?.text || '';
        if (tickerText && fullScript) {
          const before = fullScript.slice(0, charIdx);
          const after = fullScript.slice(charIdx + (spokenWord ? spokenWord.length : 4));
          tickerText.innerHTML = `${before}<span style="color: #00F0FF; font-weight: 700; text-shadow: 0 0 10px rgba(0,240,255,0.8); background: rgba(0,240,255,0.18); padding: 2px 4px; border-radius: 4px;">${spokenWord}</span>${after}`;
        }
        if (this.holodeckEngine) {
          this.holodeckEngine.setAudioReactive(true, 2.2);
        }
      },
      onEnd: () => {
        if (ticker) ticker.style.display = 'none';
        if (this.holodeckEngine) {
          this.holodeckEngine.setAudioReactive(false);
        }
      }
    });
  }

  /**
   * Toggles Keynote Presentation Session Recording & Offline Export (Task T050, Hotkey 'R')
   */
  toggleSessionRecording(forceState = null) {
    this.isRecording = (forceState !== null) ? forceState : !this.isRecording;
    const btn = document.getElementById('btnRecordSession');
    const dockRecord = document.getElementById('dockBtnRecord');

    if (this.isRecording) {
      soundEngine.playSuccess();
      sessionRecorder.startRecording({
        projectId: this.manifest ? this.manifest.id : 'default',
        projectName: this.manifest ? this.manifest.name : 'APEXFLOW Presentation',
        initialStageIndex: this.currentStageIndex
      });

      if (btn) {
        btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="5" y="5" width="14" height="14" rx="2"/></svg> <span>Stop Rec (R)</span>';
        btn.style.borderColor = '#EF4444';
        btn.style.color = '#EF4444';
        btn.style.background = 'rgba(239, 68, 68, 0.16)';
      }
      if (dockRecord) dockRecord.classList.add('active-record');
    } else {
      soundEngine.playSuccess();
      const sessionData = sessionRecorder.stopRecording();
      if (btn) {
        btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="#EF4444"/></svg> <span>Record (R)</span>';
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.style.background = '';
      }
      if (dockRecord) dockRecord.classList.remove('active-record');

      if (sessionData) {
        try {
          localStorage.setItem('apexflow_latest_recorded_session', JSON.stringify(sessionData));
        } catch (e) {}
        sessionRecorder.downloadSessionFile(sessionData);
      }
    }
  }

  /**
   * Displays audience question spotlight on stage (Task T049, Hotkey 'U')
   * @param {Object} question
   */
  showSpotlightQuestion(question) {
    if (!question) return;
    this.currentSpotlightQuestion = question;
    soundEngine.playSuccess();

    const hud = document.getElementById('audienceQASpotlightHUD');
    const authorEl = document.getElementById('spotlightQuestionAuthor');
    const textEl = document.getElementById('spotlightQuestionText');
    const upvotesEl = document.getElementById('spotlightQuestionUpvotes');

    if (authorEl) authorEl.textContent = `by ${question.author || 'Audience Member'}`;
    if (textEl) textEl.textContent = `"${question.text || ''}"`;
    if (upvotesEl) upvotesEl.textContent = `▲ ${question.upvotes || 1} Upvote${(question.upvotes || 1) > 1 ? 's' : ''}`;

    if (hud) hud.style.display = 'block';

    if (this.isRecording) {
      sessionRecorder.record('SPOTLIGHT_QUESTION', { question });
    }
  }

  /**
   * Manually toggles Audience Question Spotlight HUD
   */
  toggleSpotlightQuestionHUD(forceState = null) {
    const hud = document.getElementById('audienceQASpotlightHUD');
    if (!hud) return;
    const shouldShow = (forceState !== null) ? forceState : (hud.style.display === 'none' || !hud.style.display);
    hud.style.display = shouldShow ? 'block' : 'none';
    soundEngine.playClick();
  }

  /**
   * Dismisses the Audience Question Spotlight HUD
   */
  dismissSpotlightQuestion() {
    const hud = document.getElementById('audienceQASpotlightHUD');
    if (hud) hud.style.display = 'none';
    soundEngine.playClick();
  }

  // ================= PHASE 11: DIRECTOR MODE, SOUNDSCAPE & STANDALONE EXPORT =================

  /**
   * Toggles Cinematic Director Mode with automated 3D spatial camera sweeps (Task T052, Hotkey 'C')
   */
  toggleDirectorMode(forceState = null) {
    this.isDirectorMode = (forceState !== null) ? forceState : !this.isDirectorMode;
    soundEngine.playWhoosh();

    if (this.isDirectorMode) {
      // If not currently on architecture stage, smoothly jump to it
      if (this.currentStageIndex !== 1) {
        this.goToStage(1);
      }
      // Ensure 3D holodeck mode is activated
      if (!this.is3DActive) {
        this.toggle3DHolodeck();
      }
      if (this.holodeckEngine) {
        this.holodeckEngine.toggleDirectorMode(true);
      }
    } else {
      if (this.holodeckEngine) {
        this.holodeckEngine.toggleDirectorMode(false);
      }
    }

    const dockBtn = document.getElementById('dockBtnDirector');
    if (dockBtn) dockBtn.classList.toggle('active', this.isDirectorMode);

    if (this.isRecording) {
      sessionRecorder.record('DIRECTOR_MODE', { active: this.isDirectorMode });
    }
    return this.isDirectorMode;
  }

  /**
   * Toggles executive ambient harmonic drone soundscape (Task T053, Hotkey 'M')
   */
  toggleExecutiveSoundscape(forceState = null) {
    const active = soundEngine.toggleExecutiveSoundscape(forceState);
    this.isSoundscapeActive = active;

    const dockBtn = document.getElementById('dockBtnSoundscape');
    if (dockBtn) dockBtn.classList.toggle('active', this.isSoundscapeActive);

    if (this.isRecording) {
      sessionRecorder.record('SOUNDSCAPE', { active: this.isSoundscapeActive });
    }
    return this.isSoundscapeActive;
  }

  /**
   * Toggles Executive Dock Visibility (Hotkey 'H')
   */
  toggleExecutiveDockHUD() {
    const dock = document.getElementById('executiveDock');
    if (!dock) return;
    const isHidden = (dock.style.display === 'none');
    dock.style.display = isHidden ? 'flex' : 'none';
    soundEngine.playClick();
  }

  /**
   * Generates and downloads the 100% self-contained standalone offline HTML keynote player (Task T055)
   */
  async exportStandaloneBundle() {
    soundEngine.playSuccess();
    await offlineBundler.downloadOfflineHTML({
      manifest: this.manifest,
      pipelineGraph: this.pipelineGraph
    });
  }

  /**
   * Cycles 3D Spatial Holodeck Theme (Task T057, Hotkey 'T')
   */
  cycleSpatialTheme() {
    soundEngine.playClick();
    if (!this.holodeckEngine) {
      const canvas = document.getElementById('holodeckCanvas');
      if (canvas) {
        this.holodeckEngine = new HolodeckGalaxyEngine(canvas, (node) => {
          this.openCodeDrawer(node);
        });
        if (this.pipelineGraph && this.pipelineGraph.nodes) {
          this.holodeckEngine.loadNodes(this.pipelineGraph.nodes);
        }
      }
    }
    if (this.holodeckEngine) {
      const theme = this.holodeckEngine.cycleTheme();
      const topBtn = document.getElementById('btnCycleHolodeckTheme');
      if (topBtn) topBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"></path></svg><span>Theme: ${theme.name.split(' ')[0]}</span>`;
      const dockBtn = document.getElementById('dockBtnTheme');
      if (dockBtn) {
        dockBtn.title = `Spatial Theme: ${theme.name} (T)`;
      }
    }
  }

  /**
   * Opens the in-stage Live Node Modifier Modal (Task T058)
   */
  openAddNodeModal() {
    soundEngine.playClick();
    const modal = document.getElementById('addNodeModal');
    if (!modal) return;
    modal.style.display = 'flex';
    const input = document.getElementById('newNodeLabel');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 50);
    }
  }

  /**
   * Closes the in-stage Live Node Modifier Modal (Task T058)
   */
  closeAddNodeModal() {
    soundEngine.playClick();
    const modal = document.getElementById('addNodeModal');
    if (modal) modal.style.display = 'none';
  }

  /**
   * Submits new node form and injects node into architecture (Task T058)
   */
  submitAddNode() {
    const labelInput = document.getElementById('newNodeLabel');
    const badgeSelect = document.getElementById('newNodeBadge');
    const descInput = document.getElementById('newNodeDesc');

    const label = (labelInput && labelInput.value.trim()) ? labelInput.value.trim() : `Microservice_${Date.now().toString().slice(-4)}`;
    const badge = (badgeSelect && badgeSelect.value) ? badgeSelect.value : 'PIPELINE';
    const desc = (descInput && descInput.value.trim()) ? descInput.value.trim() : 'Reactive stream processing node provisioned live on stage.';

    this.addNewArchitectureNode(label, badge, desc);
    this.closeAddNodeModal();
  }

  /**
   * Injects new reactive microservice node into pipeline graph (Task T058)
   */
  addNewArchitectureNode(label, badge, desc) {
    if (!this.pipelineGraph) {
      this.pipelineGraph = { nodes: [], edges: [] };
    }
    if (!this.pipelineGraph.nodes) this.pipelineGraph.nodes = [];
    if (!this.pipelineGraph.edges) this.pipelineGraph.edges = [];

    const colors = {
      'STORAGE': '#10B981',
      'AI / ML': '#A855F7',
      'SECURITY': '#EF4444',
      'PIPELINE': '#00F0FF',
      'GATEWAY': '#F59E0B'
    };
    const nodeColor = colors[badge] || '#00F0FF';
    const nodeIndex = this.pipelineGraph.nodes.length;
    const newNodeId = `node_injected_${Date.now()}`;

    // Compute layout position in grid
    const col = nodeIndex % 3;
    const row = Math.floor(nodeIndex / 3);
    const posX = 60 + col * 260;
    const posY = 60 + row * 160;

    const newNode = {
      id: newNodeId,
      label: label,
      sublabel: desc.length > 38 ? desc.slice(0, 35) + '...' : desc,
      badge: badge,
      color: nodeColor,
      filePath: `services/${label.toLowerCase().replace(/[^a-z0-9]/g, '_')}_service.py`,
      position2D: { x: posX, y: posY },
      position3D: {
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 400,
        z: (Math.random() - 0.5) * 500
      },
      metrics: {
        latency: `${Math.floor(Math.random() * 6 + 2)}ms`,
        throughput: '12.4k req/s'
      },
      details: {
        description: desc,
        talkingPoints: [
          `Dynamically provisioned live on stage: ${label}`,
          `Zero-copy in-browser pipeline bus connection with sub-5ms latency`,
          `Hot-swappable microservice blade maintaining state integrity`
        ]
      },
      codeSnippet: `"""\n[SERVICE]: ${label} [${badge}]\nProvisioned live on stage during executive demonstration.\nZero-Upload client memory stream pipeline.\n"""\n\nimport asyncio\n\nasync def process_telemetry_stream(payload: dict) -> dict:\n    """Execute in-memory transformation"""\n    return {\n        "status": "PROCESSED",\n        "node_id": "${newNodeId}",\n        "badge": "${badge}",\n        "result": payload.get("data", {})\n    }\n`
    };

    this.pipelineGraph.nodes.push(newNode);

    // Wire edge from previous node if exists
    if (this.pipelineGraph.nodes.length > 1) {
      const prevNode = this.pipelineGraph.nodes[this.pipelineGraph.nodes.length - 2];
      this.pipelineGraph.edges.push({
        id: `edge_${prevNode.id}_${newNodeId}`,
        source: prevNode.id,
        target: newNodeId,
        protocol: 'gRPC / Zero-Copy',
        color: nodeColor
      });
    }

    // Re-render 2D
    this.renderStage2Architecture();

    // Reload 3D if active
    if (this.holodeckEngine) {
      this.holodeckEngine.loadNodes(this.pipelineGraph.nodes);
    }

    soundEngine.playSuccess();

    if (this.isRecording) {
      sessionRecorder.record('NODE_INJECTED', { label, badge, id: newNodeId });
    }
  }

  /**
   * Generates and downloads a 10s 60 FPS 1080p Cinematic Keynote Teaser (Task T059, Hotkey 'K')
   */
  async recordCinematicTeaser() {
    if (this.isGeneratingTeaser) return;
    this.isGeneratingTeaser = true;
    soundEngine.playWhoosh();

    const topBtn = document.getElementById('btnRecordTeaser');
    const dockBtn = document.getElementById('dockBtnTeaser');

    if (topBtn) {
      topBtn.disabled = true;
      topBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-telemetry"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle></svg><span>Rendering 0%...</span>`;
    }
    if (dockBtn) {
      dockBtn.classList.add('active');
    }

    try {
      await keynoteTeaser.generateTeaser(this.manifest, (progress) => {
        const pct = Math.round(progress * 100);
        if (topBtn) topBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-telemetry"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle></svg><span>Rendering ${pct}%...</span>`;
      });
    } catch (err) {
      console.error('Teaser generation failed:', err);
    } finally {
      this.isGeneratingTeaser = false;
      if (topBtn) {
        topBtn.disabled = false;
        topBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg><span>Teaser (K)</span>`;
      }
      if (dockBtn) {
        dockBtn.classList.remove('active');
      }
    }
  }

  /**
   * Real-time audience pulse & sentiment telemetry update (Task T060)
   */
  pulseAudienceEngagement(eventType) {
    if (['REACTION', 'AUDIENCE_QUESTION', 'QUESTION_UPVOTE', 'POLL_VOTE', 'WEBHOOK_TRIGGER'].includes(eventType)) {
      this.audiencePulse = Math.min(99, this.audiencePulse + 0.4);
      const textEl = document.getElementById('stageAudiencePulseText');
      if (textEl) {
        textEl.textContent = `PULSE: ${Math.round(this.audiencePulse)}%`;
      }
      const badge = document.getElementById('stageAudiencePulseBadge');
      if (badge) {
        badge.style.transform = 'scale(1.12)';
        badge.style.borderColor = '#10B981';
        badge.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.4)';
        setTimeout(() => {
          badge.style.transform = 'scale(1)';
          badge.style.boxShadow = 'none';
        }, 350);
      }
    }
  }

  // ================= PHASE 15: VECTOR EXPORTER, LIVE POLL HUD & DWELL TIME TELEMETRY (Tasks T072, T073, T074) =================

  /**
   * Records slide dwell duration and interaction analytics (Task T074)
   * @param {number} fromIndex 
   * @param {number} toIndex 
   */
  recordSlideDwell(fromIndex, toIndex) {
    const now = Date.now();
    const dwellDurationSec = Math.max(1, Math.round((now - this.stageEntryTime) / 1000));
    this.stageEntryTime = now;

    try {
      const storageKey = 'apexflow_dwell_analytics';
      let data = {
        totalSeconds: 0,
        slides: {
          0: { dwellSec: 0, visits: 0 },
          1: { dwellSec: 0, visits: 0 },
          2: { dwellSec: 0, visits: 0 },
          3: { dwellSec: 0, visits: 0 },
          4: { dwellSec: 0, visits: 0 },
          5: { dwellSec: 0, visits: 0 }
        },
        interactions: {
          laserClicks: 0,
          spotlightCount: 0,
          penDraws: 0,
          nodeInspections: 0,
          pollVotes: 0
        },
        lastUpdated: now
      };

      const existing = localStorage.getItem(storageKey);
      if (existing) {
        data = { ...data, ...JSON.parse(existing) };
      }

      data.totalSeconds += dwellDurationSec;
      if (!data.slides[fromIndex]) {
        data.slides[fromIndex] = { dwellSec: 0, visits: 0 };
      }
      data.slides[fromIndex].dwellSec += dwellDurationSec;
      data.slides[fromIndex].visits = (data.slides[fromIndex].visits || 0) + 1;
      data.lastUpdated = now;

      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {}
  }

  /**
   * Increments specific user interaction counter in analytics
   * @param {string} interactionType 
   */
  recordInteraction(interactionType) {
    try {
      const storageKey = 'apexflow_dwell_analytics';
      const existing = localStorage.getItem(storageKey);
      let data = existing ? JSON.parse(existing) : { interactions: {} };
      if (!data.interactions) data.interactions = {};
      data.interactions[interactionType] = (data.interactions[interactionType] || 0) + 1;
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {}
  }

  /**
   * Opens the Vector Presentation Slide Exporter modal (Task T072)
   */
  openVectorExportModal() {
    soundEngine.playClick();
    this.dismissModals();
    const modal = document.getElementById('vectorExportModal');
    const label = document.getElementById('vectorCurrentSlideLabel');
    if (label) label.textContent = `Slide ${this.currentStageIndex + 1}`;
    if (modal) modal.style.display = 'flex';
  }

  /**
   * Closes the Vector Presentation Slide Exporter modal
   */
  closeVectorExportModal() {
    soundEngine.playClick();
    const modal = document.getElementById('vectorExportModal');
    if (modal) modal.style.display = 'none';
  }

  /**
   * Downloads current active slide as a 4K resolution-independent SVG
   */
  downloadCurrentSlideVector() {
    this.vectorExporter.downloadSlideSVG(
      this.currentStageIndex + 1,
      this.manifest,
      this.selectedVectorTheme
    );
  }

  /**
   * Copies current slide SVG code to clipboard for Figma/Illustrator
   */
  async copyCurrentSlideVector() {
    const success = await this.vectorExporter.copySlideSVGToClipboard(
      this.currentStageIndex + 1,
      this.manifest,
      this.selectedVectorTheme
    );
    const btn = document.getElementById('btnCopySlideSVG');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = success ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span style="margin-left:4px;">SVG Copied!</span>` : '<span>Clipboard Blocked</span>';
      btn.style.borderColor = success ? '#10B981' : '#EF4444';
      btn.style.color = success ? '#10B981' : '#EF4444';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 2000);
    }
  }

  /**
   * Downloads full 6-slide vector keynote deck package
   */
  downloadFullVectorDeckPackage() {
    this.vectorExporter.downloadFullDeckPackage(
      this.manifest,
      this.selectedVectorTheme
    );
  }

  /**
   * Toggles the floating Live Poll Stage Visualizer HUD (Task T073, Hotkey 'O')
   */
  toggleStagePollHUD(forceState = null) {
    const hud = document.getElementById('audienceLivePollHUD');
    if (!hud) return;

    this.isStagePollHUDOpen = (forceState !== null) ? forceState : !this.isStagePollHUDOpen;
    hud.style.display = this.isStagePollHUDOpen ? 'block' : 'none';
    const dockBtn = document.getElementById('dockBtnPoll');
    if (dockBtn) dockBtn.classList.toggle('active', this.isStagePollHUDOpen);

    if (this.isStagePollHUDOpen) {
      soundEngine.playSuccess();
      this.renderStagePollHUD();
    } else {
      soundEngine.playClick();
    }
  }

  /**
   * Renders the dynamic options, progress bars, and winner celebration in Live Poll HUD
   * @param {Object} [poll] Optional active poll object
   */
  renderStagePollHUD(poll = null) {
    const activePoll = poll || remoteSync.getActivePoll();
    const qEl = document.getElementById('stagePollQuestion');
    const badgeEl = document.getElementById('stagePollStatusBadge');
    const totalEl = document.getElementById('stagePollTotalVotes');
    const listEl = document.getElementById('stagePollOptionsList');
    const winnerBanner = document.getElementById('stagePollWinnerBanner');
    const winnerText = document.getElementById('stagePollWinnerText');

    if (!listEl) return;

    if (qEl && activePoll.question) {
      qEl.textContent = activePoll.question;
    }

    if (badgeEl) {
      badgeEl.textContent = activePoll.status || 'ACTIVE';
      badgeEl.className = activePoll.status === 'CLOSED'
        ? 'cyber-badge badge-rose'
        : 'cyber-badge badge-emerald';
    }

    const totalVotes = activePoll.totalVotes || 0;
    if (totalEl) {
      totalEl.textContent = `TOTAL: ${totalVotes} Vote${totalVotes === 1 ? '' : 's'}`;
    }

    // Render Options
    const options = activePoll.options || [];
    listEl.innerHTML = options.map((opt, idx) => {
      const votes = opt.votes || 0;
      const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
      const isWinner = activePoll.status === 'CLOSED' && activePoll.winnerId === opt.id;
      const colors = ['#00F0FF', '#00FF9D', '#8B5CF6', '#F59E0B', '#EC4899'];
      const color = colors[idx % colors.length];
      const safeText = inputShield ? inputShield.escapeHtml(opt.text) : opt.text;

      return `
        <div style="background: rgba(11, 19, 34, 0.85); border: 1px solid ${isWinner ? color : 'rgba(255,255,255,0.1)'}; border-radius: 10px; padding: 10px 14px; position: relative; overflow: hidden; box-shadow: ${isWinner ? `0 0 16px ${color}44` : 'none'};">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: ${pct}%; background: ${color}22; border-right: 2px solid ${color}; transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);"></div>
          <div style="display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 2;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 11px; font-family: var(--font-mono); font-weight: 700; color: ${color};">0${idx + 1}</span>
              <span style="font-size: 12px; font-weight: 600; color: #F8FAFC;">${safeText}</span>
              ${isWinner ? `<span style="display:inline-flex; align-items:center; color:${color}; margin-left:6px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="${color}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><span style="font-size:9px; font-weight:700; margin-left:3px; letter-spacing:0.05em;">WINNER</span></span>` : ''}
            </div>
            <div style="display: flex; align-items: baseline; gap: 8px;">
              <span style="font-size: 10px; color: #64748B; font-family: var(--font-mono);">${votes} votes</span>
              <span style="font-size: 13px; font-weight: 800; font-family: var(--font-mono); color: ${color};">${pct}%</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Winner Banner
    if (winnerBanner) {
      if (activePoll.status === 'CLOSED' && (activePoll.winner || activePoll.winnerId)) {
        winnerBanner.style.display = 'block';
        if (winnerText) winnerText.textContent = activePoll.winner || 'Consensus Confirmed';
        if (this.emojiCanvas) {
          this.emojiCanvas.burst('surge', 10);
        }
      } else {
        winnerBanner.style.display = 'none';
      }
    }
  }

  dismissModals() {
    const addNodeModal = document.getElementById('addNodeModal');
    if (addNodeModal) addNodeModal.style.display = 'none';

    const vectorModal = document.getElementById('vectorExportModal');
    if (vectorModal) vectorModal.style.display = 'none';

    const stagePollHud = document.getElementById('audienceLivePollHUD');
    if (stagePollHud) {
      stagePollHud.style.display = 'none';
      this.isStagePollHUDOpen = false;
      const dockPoll = document.getElementById('dockBtnPoll');
      if (dockPoll) dockPoll.classList.remove('active');
    }

    const qrModal = document.getElementById('qrModal');
    if (qrModal) qrModal.style.display = 'none';

    const whisperHud = document.getElementById('presenterWhisperHUD');
    if (whisperHud) whisperHud.style.display = 'none';

    const spotlightHUD = document.getElementById('audienceQASpotlightHUD');
    if (spotlightHUD) spotlightHUD.style.display = 'none';

    const ticker = document.getElementById('narrationKaraokeTicker');
    if (ticker) ticker.style.display = 'none';

    const slidesGridModal = document.getElementById('slidesGridModal');
    if (slidesGridModal) {
      slidesGridModal.style.display = 'none';
      this.isSlidesGridOpen = false;
    }

    const speakerNotesHUD = document.getElementById('speakerNotesHUD');
    if (speakerNotesHUD) {
      speakerNotesHUD.classList.remove('active');
      this.isSpeakerNotesOpen = false;
    }

    const codeDrawer = document.getElementById('codeDrawer');
    if (codeDrawer) codeDrawer.style.transform = 'translateX(100%)';
    this.nodeInspector?.close();

    if (this.commandPalette && this.commandPalette.isOpen) {
      this.commandPalette.close();
    }

    if (this.teleprompterHUD && this.teleprompterHUD.isOpen) {
      this.teleprompterHUD.close();
      const dockPrompter = document.getElementById('dockBtnPrompter');
      if (dockPrompter) dockPrompter.classList.remove('active');
    }

    if (this.scenarioEngine && this.scenarioEngine.isOpen) {
      this.scenarioEngine.close();
      const dockScenario = document.getElementById('dockBtnScenario');
      if (dockScenario) dockScenario.classList.remove('active');
    }

    if (this.comparisonMatrix && this.comparisonMatrix.isOpen) {
      this.comparisonMatrix.close();
      const dockCompare = document.getElementById('dockBtnCompare');
      if (dockCompare) dockCompare.classList.remove('active');
    }

    if (this.packetTracer && this.packetTracer.isActive) {
      this.packetTracer.stop();
      const dockTr = document.getElementById('dockBtnTrace');
      if (dockTr) dockTr.classList.remove('active');
    }

    if (this.readinessAudit && this.readinessAudit.isOpen) {
      this.readinessAudit.close();
      const dockAud = document.getElementById('dockBtnAudit');
      if (dockAud) dockAud.classList.remove('active');
    }

    if (this.timeMachine && this.timeMachine.isOpen) {
      this.timeMachine.toggle();
      const dockTm = document.getElementById('dockBtnTimeMachine');
      if (dockTm) dockTm.classList.remove('active');
    }

    if (this.isLaserActive) this.toggleLaserPointer();
    if (this.isSpotlightActive) this.toggleSpotlight();
  }

  /**
   * Toggles the Architecture Evolution Time-Machine (Task T099)
   */
  toggleTimeMachine() {
    if (this.timeMachine) {
      this.timeMachine.toggle();
      const dockTm = document.getElementById('dockBtnTimeMachine');
      if (dockTm) {
        if (this.timeMachine.isOpen) dockTm.classList.add('active');
        else dockTm.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Executive Teleprompter & Speaker HUD (Task T077)
   */
  toggleTeleprompterHUD() {
    if (this.teleprompterHUD) {
      this.teleprompterHUD.toggle();
      const dockPrompter = document.getElementById('dockBtnPrompter');
      if (dockPrompter) {
        if (this.teleprompterHUD.isOpen) dockPrompter.classList.add('active');
        else dockPrompter.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Dynamic What-If Scenario Engine HUD (Task T078)
   */
  toggleScenarioEngine() {
    if (this.scenarioEngine) {
      this.scenarioEngine.toggle();
      const dockScenario = document.getElementById('dockBtnScenario');
      if (dockScenario) {
        if (this.scenarioEngine.isOpen) dockScenario.classList.add('active');
        else dockScenario.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Cloud FinOps & Infrastructure Unit Economics Calculator (Task T103)
   */
  toggleFinOpsCalculator() {
    if (this.finOpsCalculator) {
      this.finOpsCalculator.toggle();
      const dockFinOps = document.getElementById('dockBtnFinOps');
      if (dockFinOps) {
        if (this.finOpsCalculator.isOpen) dockFinOps.classList.add('active');
        else dockFinOps.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Live Audience Engagement Heatmap HUD (Task T107)
   */
  toggleAudienceHeatmap() {
    if (this.audienceHeatmap) {
      this.audienceHeatmap.toggle();
      const dockHeatmap = document.getElementById('dockBtnHeatmap');
      if (dockHeatmap) {
        if (this.audienceHeatmap.isOpen) dockHeatmap.classList.add('active');
        else dockHeatmap.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Autonomous Multi-Language Keynote Subtitles Engine (Task T108)
   */
  toggleKeynoteSubtitles() {
    if (this.keynoteSubtitles) {
      this.keynoteSubtitles.toggle();
      const dockSubs = document.getElementById('dockBtnSubtitles');
      if (dockSubs) {
        if (this.keynoteSubtitles.isOpen) dockSubs.classList.add('active');
        else dockSubs.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Keynote DRM Watermarking & Steganography (Task T109)
   */
  toggleKeynoteWatermark() {
    if (this.keynoteWatermark) {
      this.keynoteWatermark.openConfigModal();
    }
  }

  /**
   * Toggles the Autonomous Architecture Voice AI Copilot (Task T112)
   */
  toggleArchitectureCopilot() {
    if (this.architectureCopilot) {
      this.architectureCopilot.toggle();
      const dockCopilot = document.getElementById('dockBtnCopilot');
      if (dockCopilot) {
        if (this.architectureCopilot.isOpen) dockCopilot.classList.add('active');
        else dockCopilot.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Live Distributed Latency Waterfall & Profiler (Task T113)
   */
  toggleLatencyWaterfall() {
    if (this.latencyWaterfall) {
      this.latencyWaterfall.toggle();
      const dockWaterfall = document.getElementById('dockBtnWaterfall');
      if (dockWaterfall) {
        if (this.latencyWaterfall.isOpen) dockWaterfall.classList.add('active');
        else dockWaterfall.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Mermaid.js & Markdown Architecture Exporter (Task T114)
   */
  toggleMermaidExporter() {
    if (this.mermaidExporter) {
      this.mermaidExporter.toggle();
      const dockMermaid = document.getElementById('dockBtnMermaid');
      if (dockMermaid) {
        if (this.mermaidExporter.isOpen) dockMermaid.classList.add('active');
        else dockMermaid.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Live Distributed Chaos Engineering HUD (Task T117)
   */
  toggleChaosEngineering() {
    if (this.chaosEngineeringHUD) {
      this.chaosEngineeringHUD.toggle();
      const dockChaos = document.getElementById('dockBtnChaos');
      if (dockChaos) {
        if (this.chaosEngineeringHUD.isOpen) dockChaos.classList.add('active');
        else dockChaos.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Pitch Deck Rehearsal AI Verbal Pace Scorecard (Task T118)
   */
  toggleRehearsalEvaluator() {
    if (this.rehearsalEvaluator) {
      this.rehearsalEvaluator.toggle();
      const dockRehearsal = document.getElementById('dockBtnRehearsal');
      if (dockRehearsal) {
        if (this.rehearsalEvaluator.isOpen) dockRehearsal.classList.add('active');
        else dockRehearsal.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Executive 4K Slide Deck Exporter & Presentation Packager (Task T119)
   */
  toggleExecutivePackager() {
    if (this.executiveDeckPackager) {
      this.executiveDeckPackager.toggle();
      const dockPackager = document.getElementById('dockBtnPackager');
      if (dockPackager) {
        if (this.executiveDeckPackager.isOpen) dockPackager.classList.add('active');
        else dockPackager.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Autonomous Architecture Topology Diff & Version Comparator HUD (Task T122)
   */
  toggleTopologyComparator() {
    if (this.topologyComparator) {
      this.topologyComparator.toggle();
      const dockDiff = document.getElementById('dockBtnTopologyDiff');
      if (dockDiff) {
        if (this.topologyComparator.isOpen) dockDiff.classList.add('active');
        else dockDiff.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Architectural Threat Modeling & STRIDE Security Posture Scorecard (Task T123)
   */
  toggleThreatModeler() {
    if (this.threatModeler) {
      this.threatModeler.toggle();
      const dockThreat = document.getElementById('dockBtnThreat');
      if (dockThreat) {
        if (this.threatModeler.isOpen) dockThreat.classList.add('active');
        else dockThreat.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Real-Time Audience Sentiment Cloud & Opinion Pulse HUD (Task T124)
   */
  toggleSentimentCloud() {
    if (this.sentimentCloud) {
      this.sentimentCloud.toggle();
      const dockPulse = document.getElementById('dockBtnSentiment');
      if (dockPulse) {
        if (this.sentimentCloud.isOpen) dockPulse.classList.add('active');
        else dockPulse.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Multi-Cloud Disaster Recovery Failover Simulator HUD (Task T127)
   */
  toggleDRFailoverHUD() {
    if (this.disasterRecoveryHUD) {
      this.disasterRecoveryHUD.toggle();
      const dockDR = document.getElementById('dockBtnDR');
      if (dockDR) {
        if (this.disasterRecoveryHUD.isOpen) dockDR.classList.add('active');
        else dockDR.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the SOC 2, ISO 27001 & HIPAA Compliance Evidence Ledger (Task T128)
   */
  toggleComplianceLedger() {
    if (this.complianceLedger) {
      this.complianceLedger.toggle();
      const dockComp = document.getElementById('dockBtnCompliance');
      if (dockComp) {
        if (this.complianceLedger.isOpen) dockComp.classList.add('active');
        else dockComp.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Executive 4K Slide Poster & Architecture Starchart Renderer (Task T129)
   */
  toggleSlidePoster() {
    if (this.slidePosterRenderer) {
      this.slidePosterRenderer.toggle();
      const dockPoster = document.getElementById('dockBtnPoster');
      if (dockPoster) {
        if (this.slidePosterRenderer.isOpen) dockPoster.classList.add('active');
        else dockPoster.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Executive AI Objection Defense & Investor Q&A Simulator HUD (Task T132)
   */
  toggleObjectionDefense() {
    if (this.objectionDefenseHUD) {
      this.objectionDefenseHUD.toggle();
      const dockObj = document.getElementById('dockBtnObjection');
      if (dockObj) {
        if (this.objectionDefenseHUD.isOpen) dockObj.classList.add('active');
        else dockObj.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Hands-Free Voice Commander HUD (Task T137)
   */
  toggleVoiceCommander() {
    if (this.voiceCommanderHUD) {
      this.voiceCommanderHUD.toggle();
      const dockVoice = document.getElementById('dockBtnVoiceCmd');
      if (dockVoice) {
        if (this.voiceCommanderHUD.isOpen) dockVoice.classList.add('active');
        else dockVoice.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Enterprise White-Label Brand Customizer (Task T142)
   */
  toggleWhiteLabel() {
    if (this.whiteLabelManager) {
      this.whiteLabelManager.toggle();
      const dockBrand = document.getElementById('dockBtnWhiteLabel');
      if (dockBrand) {
        if (this.whiteLabelManager.isOpen) dockBrand.classList.add('active');
        else dockBrand.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Executive Client Presentation Portal Gateway (Task T143)
   */
  toggleClientPortal() {
    if (this.clientPortalGateway) {
      this.clientPortalGateway.toggle();
      const dockPortal = document.getElementById('dockBtnClientPortal');
      if (dockPortal) {
        if (this.clientPortalGateway.isOpen) dockPortal.classList.add('active');
        else dockPortal.classList.remove('active');
      }
    }
  }

  /**
   * Toggles the Human Rehearsal Playbook & Speech Cadence Coach (Task T162)
   */
  toggleRehearsalPlaybook() {
    if (this.humanRehearsalPlaybook) {
      this.humanRehearsalPlaybook.toggle();
      const dockRehearsal = document.getElementById('dockBtnRehearsalPlaybook');
      if (dockRehearsal) {
        if (this.humanRehearsalPlaybook.isOpen) dockRehearsal.classList.add('active');
        else dockRehearsal.classList.remove('active');
      }
    }
  }
}

// Instantiate and initialize
document.addEventListener('DOMContentLoaded', () => {
  const stage = new StageController();
  stage.init();
});
