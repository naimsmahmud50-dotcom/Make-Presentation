/**
 * =========================================================================================
 * MODULE: APEXFLOW OS — Universal Spotlight Executive Command Palette (Task T062)
 * -----------------------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Provides a Raycast / Spotlight / Linear-style executive command palette (Cmd+K / Ctrl+K).
 * Allows instant, keyboard-driven access to all slides, presentation tools, spatial themes,
 * audio synthesizers, recording sessions, and export pipelines.
 *
 * LUXURY OLED DESIGN SPECIFICATIONS (UI/UX Pro Max):
 *   - Palette Container: #080D18 with 28px backdrop blur and 1px cyan/subtle border
 *   - Search Input: Zero-latency fuzzy multi-token matcher with live result counter
 *   - Item Highlighting: Active cursor with glowing neon-cyan pill and keyboard shortcuts
 *   - Soundscapes: Tactile Web Audio tick on navigation and success chime on execution
 *   - Full Keyboard Control: ArrowUp, ArrowDown, Enter, Escape, Cmd+K / Ctrl+K
 *
 * ZERO-UPLOAD GUARANTEE:
 * 100% in-browser memory execution. Zero network round-trips.
 * =========================================================================================
 */

import { soundEngine } from '../lib/audio/sound-synth.js';

export class ExecutiveCommandPalette {
  /**
   * @param {Object} stageController Reference to the main StageController instance
   */
  constructor(stageController) {
    this.stage = stageController;
    this.isOpen = false;
    this.selectedIndex = 0;
    this.filteredCommands = [];
    this.modalEl = null;
    this.inputEl = null;
    this.listEl = null;

    this.commands = this.buildRegistry();
    this.initDOM();
    this.setupListeners();
  }

  /**
   * Builds the comprehensive registry of executable keynote actions
   */
  buildRegistry() {
    return [
      // Navigation
      {
        id: 'nav_slide_1',
        title: 'Jump to Slide 1: Problem & Vision',
        category: 'NAVIGATION',
        badge: 'SLIDE 1',
        hotkey: '1',
        keywords: ['hero', 'problem', 'vision', 'stats', 'radar'],
        action: () => this.stage.goToStage(0)
      },
      {
        id: 'nav_slide_2',
        title: 'Jump to Slide 2: Living Architecture',
        category: 'NAVIGATION',
        badge: 'SLIDE 2',
        hotkey: '2',
        keywords: ['architecture', 'pipeline', 'graph', 'nodes', 'holodeck', '3d'],
        action: () => this.stage.goToStage(1)
      },
      {
        id: 'nav_slide_3',
        title: 'Jump to Slide 3: WebAssembly Sandbox',
        category: 'NAVIGATION',
        badge: 'SLIDE 3',
        hotkey: '3',
        keywords: ['sandbox', 'terminal', 'python', 'pyodide', 'execution', 'wasm'],
        action: () => this.stage.goToStage(2)
      },
      {
        id: 'nav_slide_4',
        title: 'Jump to Slide 4: Responsive Device Frames',
        category: 'NAVIGATION',
        badge: 'SLIDE 4',
        hotkey: '4',
        keywords: ['device', 'mobile', 'tablet', 'desktop', 'apple', 'xdr', 'iphone'],
        action: () => this.stage.goToStage(3)
      },
      {
        id: 'nav_slide_5',
        title: 'Jump to Slide 5: Bento ROI & Financial Modeler',
        category: 'NAVIGATION',
        badge: 'SLIDE 5',
        hotkey: '5',
        keywords: ['roi', 'bento', 'cost', 'savings', 'headcount', 'calculator'],
        action: () => this.stage.goToStage(4)
      },
      {
        id: 'nav_slide_6',
        title: 'Jump to Slide 6: Audience Mobile Remote',
        category: 'NAVIGATION',
        badge: 'SLIDE 6',
        hotkey: '6',
        keywords: ['remote', 'audience', 'qr', 'sync', 'reactions', 'poll'],
        action: () => this.stage.goToStage(5)
      },

      // Stage Presentation Weapons
      {
        id: 'tool_laser',
        title: 'Toggle Laser Pointer',
        category: 'PRESENTATION TOOLS',
        badge: 'TOOL',
        hotkey: 'L',
        keywords: ['laser', 'pointer', 'red', 'dot', 'focus'],
        action: () => this.stage.toggleLaserPointer()
      },
      {
        id: 'tool_spotlight',
        title: 'Toggle Spotlight Dimming Mode',
        category: 'PRESENTATION TOOLS',
        badge: 'TOOL',
        hotkey: 'S',
        keywords: ['spotlight', 'dim', 'focus', 'circle'],
        action: () => this.stage.toggleSpotlight()
      },
      {
        id: 'tool_pen',
        title: 'Toggle Neon Drawing Pen',
        category: 'PRESENTATION TOOLS',
        badge: 'TOOL',
        hotkey: 'D',
        keywords: ['pen', 'draw', 'annotate', 'markup'],
        action: () => this.stage.toggleDrawingPen()
      },
      {
        id: 'tool_clear_pen',
        title: 'Clear Screen Annotations & Drawings',
        category: 'PRESENTATION TOOLS',
        badge: 'CLEAR',
        hotkey: 'C',
        keywords: ['clear', 'erase', 'clean'],
        action: () => this.stage.clearDrawingPen()
      },
      {
        id: 'tool_snapshot_annotation',
        title: 'Export Annotation Snapshot PNG',
        category: 'PRESENTATION TOOLS',
        badge: 'EXPORT',
        keywords: ['snapshot', 'annotation', 'png', 'camera', 'screenshot'],
        action: () => this.stage.annotationCanvas?.exportSnapshot()
      },
      {
        id: 'tool_notes',
        title: 'Toggle Speaker Prompter Notes HUD',
        category: 'PRESENTATION TOOLS',
        badge: 'HUD',
        hotkey: 'N',
        keywords: ['notes', 'prompter', 'script', 'talking points'],
        action: () => this.stage.toggleSpeakerNotes()
      },
      {
        id: 'tool_grid',
        title: 'Toggle Slide Light Table / Grid Overview',
        category: 'PRESENTATION TOOLS',
        badge: 'OVERVIEW',
        hotkey: 'G',
        keywords: ['grid', 'table', 'overview', 'thumbnails'],
        action: () => this.stage.toggleSlidesGrid()
      },
      {
        id: 'tool_whisper',
        title: 'Toggle Presenter Objection Defense Whisper HUD',
        category: 'PRESENTATION TOOLS',
        badge: 'DEFENSE',
        hotkey: 'W',
        keywords: ['whisper', 'objection', 'defense', 'q&a'],
        action: () => this.stage.togglePresenterWhisper()
      },

      // Cinematics & Spatial Themes
      {
        id: 'mode_director',
        title: 'Toggle Autonomous Cinematic Director Mode',
        category: 'CINEMATICS',
        badge: 'DIRECTOR',
        hotkey: 'C',
        keywords: ['director', 'camera', 'orbit', 'sweep', 'cinematic'],
        action: () => this.stage.toggleDirectorMode()
      },
      {
        id: 'mode_theme',
        title: 'Cycle 3D Spatial Shader Theme (Neon / Chrome / Gold / Obsidian)',
        category: 'CINEMATICS',
        badge: 'SHADER',
        hotkey: 'T',
        keywords: ['theme', 'shader', 'spatial', 'color', 'neon', 'chrome', 'gold', 'obsidian'],
        action: () => this.stage.cycleSpatialTheme()
      },
      {
        id: 'mode_3d',
        title: 'Toggle 3D Holodeck Starfield View (Stage 2)',
        category: 'CINEMATICS',
        badge: '3D',
        hotkey: '3',
        keywords: ['3d', 'holodeck', 'galaxy', 'starfield', 'orbit'],
        action: () => this.stage.toggle3DHolodeck()
      },
      {
        id: 'mode_soundscape',
        title: 'Toggle Executive Ambient Harmonic Drone Soundscape',
        category: 'AUDIO',
        badge: 'AMBIENCE',
        hotkey: 'M',
        keywords: ['ambience', 'soundscape', 'drone', 'audio', 'music', 'sound'],
        action: () => this.stage.toggleExecutiveSoundscape()
      },
      {
        id: 'mode_voice',
        title: 'Toggle Executive Voiceover & Subtitle Karaoke Ticker',
        category: 'AUDIO',
        badge: 'VOICE',
        hotkey: 'V',
        keywords: ['voice', 'narration', 'speech', 'audio', 'subtitles', 'karaoke'],
        action: () => this.stage.toggleVoiceNarration()
      },
      {
        id: 'mode_autoplay',
        title: 'Toggle Autoplay Keynote Walkthrough Mode',
        category: 'CINEMATICS',
        badge: 'AUTOPLAY',
        hotkey: 'A',
        keywords: ['autoplay', 'walkthrough', 'loop', 'auto'],
        action: () => this.stage.toggleAutoplay()
      },

      // Live Architecture & Export Pipelines
      {
        id: 'action_add_node',
        title: 'Inject Live Microservice Node to Architecture',
        category: 'ARCHITECTURE',
        badge: 'MODIFIER',
        hotkey: 'Stage 2',
        keywords: ['add', 'inject', 'node', 'microservice', 'service'],
        action: () => this.stage.openAddNodeModal()
      },
      {
        id: 'action_teaser',
        title: 'Export 10s 60 FPS 1080p Cinematic Keynote Teaser Video',
        category: 'EXPORTS',
        badge: 'VIDEO',
        hotkey: 'K',
        keywords: ['teaser', 'video', 'render', 'social', 'download', 'webm', 'export'],
        action: () => this.stage.recordCinematicTeaser()
      },
      {
        id: 'action_vector_modal',
        title: 'Open Vector Presentation Slide Export Studio',
        category: 'EXPORTS',
        badge: 'VECTOR 4K',
        hotkey: 'Vector',
        keywords: ['vector', 'svg', 'figma', 'illustrator', '4k', 'slides', 'export'],
        action: () => this.stage.openVectorExportModal()
      },
      {
        id: 'action_vector_current_oled',
        title: 'Export Current Slide to 4K Vector SVG (OLED Dark)',
        category: 'EXPORTS',
        badge: 'SVG OLED',
        hotkey: 'SVG',
        keywords: ['vector', 'svg', 'dark', 'oled', 'current', 'slide', 'download'],
        action: () => {
          this.stage.selectedVectorTheme = 'oled';
          this.stage.downloadCurrentSlideVector();
        }
      },
      {
        id: 'action_vector_current_light',
        title: 'Export Current Slide to 4K Vector SVG (Print Clean Light)',
        category: 'EXPORTS',
        badge: 'SVG LIGHT',
        hotkey: 'SVG',
        keywords: ['vector', 'svg', 'light', 'print', 'white', 'current', 'slide'],
        action: () => {
          this.stage.selectedVectorTheme = 'light';
          this.stage.downloadCurrentSlideVector();
        }
      },
      {
        id: 'action_vector_deck_package',
        title: 'Download Full 6-Slide Vector Keynote Deck Package (HTML + SVGs)',
        category: 'EXPORTS',
        badge: 'DECK BUNDLE',
        hotkey: 'DECK',
        keywords: ['vector', 'package', 'full', 'all', 'deck', 'bundle', 'html', 'svg'],
        action: () => this.stage.downloadFullVectorDeckPackage()
      },
      {
        id: 'action_poll_stage_hud',
        title: 'Toggle Audience Live Poll Stage Visualizer HUD',
        category: 'INTERACTIVE',
        badge: 'POLL HUD',
        hotkey: 'O',
        keywords: ['poll', 'voting', 'audience', 'hud', 'consensus', 'results'],
        action: () => this.stage.toggleStagePollHUD()
      },
      // Phase 16: Teleprompter & What-If Scenario Commands (Tasks T077, T078)
      {
        id: 'action_teleprompter_hud',
        title: 'Toggle Executive Teleprompter & Speaker HUD',
        category: 'PRESENTER HUD',
        badge: 'PROMPTER',
        hotkey: 'T',
        keywords: ['prompter', 'teleprompter', 'speech', 'script', 'auto-scroll', 'wpm', 'hud'],
        action: () => this.stage.toggleTeleprompterHUD()
      },
      {
        id: 'action_time_machine',
        title: 'Launch Architecture Evolution Time-Machine (v1.0 → v4.0)',
        category: 'STAGE',
        badge: 'TIMELINE',
        hotkey: 'Shift+M',
        keywords: ['timemachine', 'timeline', 'evolution', 'history', 'migration', 'monolith', 'microservices'],
        action: () => this.stage.toggleTimeMachine()
      },
      {
        id: 'action_scenario_hud',
        title: 'Toggle Dynamic What-If Scenario & Stress Engine',
        category: 'SCENARIOS',
        badge: 'SCENARIO HUD',
        hotkey: 'Y',
        keywords: ['scenario', 'what-if', 'stress', 'simulation', 'resilience', 'failover', 'surge'],
        action: () => this.stage.toggleScenarioEngine()
      },
      {
        id: 'scenario_hypergrowth',
        title: 'Activate Hyper-Growth Surge Scenario (10M req/s)',
        category: 'SCENARIOS',
        badge: 'HYPERGROWTH',
        hotkey: 'Surge',
        keywords: ['hypergrowth', 'surge', 'scale', 'traffic', '10m', 'kubernetes'],
        action: () => {
          if (!this.stage.scenarioEngine?.isOpen) this.stage.toggleScenarioEngine();
          this.stage.scenarioEngine?.applyScenario('hypergrowth');
        }
      },
      {
        id: 'scenario_blackswan',
        title: 'Trigger Black Swan Outage & Circuit Breaker Auto-Failover',
        category: 'SCENARIOS',
        badge: 'FAILOVER',
        hotkey: 'Outage',
        keywords: ['blackswan', 'outage', 'failover', 'circuit', 'breaker', 'disaster'],
        action: () => {
          if (!this.stage.scenarioEngine?.isOpen) this.stage.toggleScenarioEngine();
          this.stage.scenarioEngine?.applyScenario('blackswan');
        }
      },
      {
        id: 'scenario_finops',
        title: 'Activate FinOps Cloud Cost Optimization (68% Savings)',
        category: 'SCENARIOS',
        badge: 'FINOPS',
        hotkey: 'FinOps',
        keywords: ['finops', 'savings', 'cost', 'cloud', 'budget', 'roi', 'efficiency'],
        action: () => {
          if (!this.stage.scenarioEngine?.isOpen) this.stage.toggleScenarioEngine();
          this.stage.scenarioEngine?.applyScenario('finops');
        }
      },
      {
        id: 'action_finops_calculator',
        title: 'Open Cloud FinOps & Infrastructure Unit Economics Calculator',
        category: 'FINOPS & ECONOMICS',
        badge: 'FINOPS',
        hotkey: 'Shift+F',
        keywords: ['finops', 'calculator', 'cost', 'cloud', 'economics', 'runrate', 'bom', 'pricing', 'aws', 'kubernetes', 'unit'],
        action: () => this.stage.toggleFinOpsCalculator()
      },
      {
        id: 'action_heatmap_hud',
        title: 'Toggle Audience Attention Heatmap & Engagement HUD',
        category: 'TELEMETRY & AUDIENCE',
        badge: 'HEATMAP',
        hotkey: 'Shift+H',
        keywords: ['heatmap', 'attention', 'engagement', 'analytics', 'hotspot', 'focus', 'audience'],
        action: () => this.stage.toggleAudienceHeatmap()
      },
      {
        id: 'action_subtitles_toggle',
        title: 'Toggle Multi-Language Keynote Subtitles & Translation Ribbon',
        category: 'ACCESSIBILITY & TRANSLATION',
        badge: 'SUBTITLES',
        hotkey: 'Shift+S',
        keywords: ['subtitles', 'translation', 'language', 'bengali', 'spanish', 'japanese', 'german', 'french', 'mandarin', 'arabic'],
        action: () => this.stage.toggleKeynoteSubtitles()
      },
      {
        id: 'action_watermark_config',
        title: 'Configure Keynote Watermark & Steganographic DRM Stamps',
        category: 'SECURITY & DRM',
        badge: 'DRM',
        hotkey: 'Shift+W',
        keywords: ['watermark', 'drm', 'confidential', 'nda', 'security', 'leak', 'steganography', 'brand'],
        action: () => this.stage.toggleKeynoteWatermark()
      },
      {
        id: 'action_architecture_copilot',
        title: 'Open Autonomous Architecture Voice AI Copilot & Q&A HUD',
        category: 'AI & COPILOT',
        badge: 'COPILOT',
        hotkey: 'Shift+A',
        keywords: ['copilot', 'ai', 'voice', 'assistant', 'architecture', 'qa', 'speech', 'pgvector', 'failover'],
        action: () => this.stage.toggleArchitectureCopilot()
      },
      {
        id: 'action_latency_waterfall',
        title: 'Open Live Distributed Latency Waterfall & Critical Path Profiler',
        category: 'TELEMETRY & PROFILING',
        badge: 'PROFILER',
        hotkey: 'Shift+P',
        keywords: ['waterfall', 'latency', 'trace', 'profiler', 'bottleneck', 'distributed', 'cloudflare', 'envoy', 'aurora', 'benchmark'],
        action: () => this.stage.toggleLatencyWaterfall()
      },
      {
        id: 'action_export_mermaid',
        title: 'Export Mermaid.js & GitHub Flavored Markdown Architecture Spec',
        category: 'EXPORTS',
        badge: 'MERMAID',
        hotkey: 'Mermaid',
        keywords: ['mermaid', 'diagram', 'markdown', 'spec', 'export', 'architecture', 'flowchart', 'github'],
        action: () => this.stage.toggleMermaidExporter()
      },
      {
        id: 'action_chaos_engineering',
        title: 'Open Live Distributed Chaos Engineering & Circuit Breaker HUD',
        category: 'RESILIENCE & CHAOS',
        badge: 'CHAOS',
        hotkey: 'Shift+C',
        keywords: ['chaos', 'fault', 'circuit', 'breaker', 'outage', 'failover', 'blackout', 'resilience', 'packet'],
        action: () => this.stage.toggleChaosEngineering()
      },
      {
        id: 'action_rehearsal_evaluator',
        title: 'Open Pitch Rehearsal AI Verbal Pace Analyzer & Scorecard',
        category: 'PRESENTER COACHING',
        badge: 'REHEARSE',
        hotkey: 'Shift+R',
        keywords: ['rehearsal', 'wpm', 'pace', 'coach', 'speaking', 'scorecard', 'filler', 'readiness', 'voice'],
        action: () => this.stage.toggleRehearsalEvaluator()
      },
      {
        id: 'action_executive_packager',
        title: 'Export Executive 4K Slide Deck & Briefing Package',
        category: 'EXPORTS',
        badge: 'PACKAGE',
        hotkey: 'Package',
        keywords: ['package', 'bundle', 'executive', 'deck', 'briefing', 'html', 'markdown', 'export', 'boardroom'],
        action: () => this.stage.toggleExecutivePackager()
      },
      {
        id: 'action_topology_comparator',
        title: 'Open Autonomous Architecture Topology Diff & Version Comparator HUD',
        category: 'ARCHITECTURE COMPARISON',
        badge: 'DIFF',
        hotkey: 'Shift+D',
        keywords: ['topology', 'diff', 'compare', 'version', 'baseline', 'monolith', 'microservices', 'delta', 'latency', 'finops'],
        action: () => this.stage.toggleTopologyComparator()
      },
      {
        id: 'action_threat_modeler',
        title: 'Open Architectural STRIDE Threat Modeler & Security Scorecard',
        category: 'SECURITY & GOVERNANCE',
        badge: 'STRIDE',
        hotkey: 'Shift+E',
        keywords: ['threat', 'stride', 'security', 'cve', 'mitigation', 'soc2', 'scorecard', 'audit', 'compliance', 'attestation'],
        action: () => this.stage.toggleThreatModeler()
      },
      {
        id: 'action_sentiment_cloud',
        title: 'Open Real-Time Audience Sentiment Cloud & Opinion Pulse HUD',
        category: 'AUDIENCE INTELLIGENCE',
        badge: 'PULSE',
        hotkey: 'Shift+O',
        keywords: ['sentiment', 'audience', 'cloud', 'opinion', 'pulse', 'reactions', 'engagement', 'boardroom', 'consensus'],
        action: () => this.stage.toggleSentimentCloud()
      },
      {
        id: 'action_dr_failover',
        title: 'Open Multi-Cloud Disaster Recovery Failover Simulator & RTO/RPO HUD',
        category: 'RESILIENCE & RECOVERY',
        badge: 'DR',
        hotkey: 'Shift+Y',
        keywords: ['disaster', 'recovery', 'failover', 'rto', 'rpo', 'multi-cloud', 'aws', 'gcp', 'blackout', 'bgp', 'anycast'],
        action: () => this.stage.toggleDRFailoverHUD()
      },
      {
        id: 'action_compliance_ledger',
        title: 'Open SOC2, ISO 27001 & HIPAA Compliance Evidence Ledger',
        category: 'SECURITY & GOVERNANCE',
        badge: 'SOC2',
        hotkey: 'Shift+U',
        keywords: ['compliance', 'soc2', 'iso27001', 'hipaa', 'audit', 'evidence', 'sha256', 'cryptographic', 'deloitte', 'pwc'],
        action: () => this.stage.toggleComplianceLedger()
      },
      {
        id: 'action_slide_poster',
        title: 'Render & Export Executive 4K Slide Poster & Starchart One-Pager',
        category: 'EXPORTS',
        badge: 'POSTER',
        hotkey: 'Shift+B',
        keywords: ['poster', 'starchart', 'infographic', '4k', 'print', 'one-pager', 'boardroom', 'blueprint', 'export'],
        action: () => this.stage.toggleSlidePoster()
      },
      {
        id: 'action_objection_defense',
        title: 'Open Executive AI Objection Defense & Investor Q&A Boardroom Simulator',
        category: 'PRESENTER WEAPONS',
        badge: 'DEFENSE',
        hotkey: 'Shift+X',
        keywords: ['objection', 'defense', 'boardroom', 'investor', 'q&a', 'cfo', 'cto', 'ciso', 'vp', 'tension', 'prompter', 'rebuttal'],
        action: () => this.stage.toggleObjectionDefense()
      },
      {
        id: 'action_rehearsal_playbook',
        title: 'Open Human Rehearsal Playbook & Speech Cadence Coach',
        category: 'PRESENTER WEAPONS',
        badge: 'COACH',
        hotkey: 'Shift+Z',
        keywords: ['rehearsal', 'coach', 'speech', 'cadence', 'wpm', 'pace', 'budget', 'stopwatch', 'filler', 'debrief', 'scorecard'],
        action: () => this.stage.toggleRehearsalPlaybook()
      },
      {
        id: 'action_voice_commander',
        title: 'Toggle Hands-Free Voice Commander HUD & Acoustic Intent Parser',
        category: 'PRESENTER WEAPONS',
        badge: 'VOICE CMD',
        hotkey: 'Shift+V',
        keywords: ['voice', 'commander', 'speech', 'microphone', 'hands-free', 'acoustic', 'macro', 'intent'],
        action: () => this.stage.toggleVoiceCommander()
      },
      {
        id: 'action_spatial_gesture',
        title: 'Toggle Optical Spatial Gesture Navigation Engine',
        category: 'PRESENTER WEAPONS',
        badge: 'GESTURE',
        hotkey: 'Shift+G',
        keywords: ['gesture', 'spatial', 'camera', 'optical', 'swipe', 'motion', 'hands-free', 'zero-touch'],
        action: () => this.stage.toggleSpatialGesture()
      },
      {
        id: 'action_white_label',
        title: 'Open Enterprise Multi-Tenant White-Label Customizer HUD',
        category: 'ENTERPRISE & BRANDING',
        badge: 'BRANDING',
        hotkey: 'Shift+L',
        keywords: ['white-label', 'branding', 'tenant', 'corporate', 'logo', 'theme', 'color', 'palette'],
        action: () => this.stage.toggleWhiteLabel()
      },
      {
        id: 'action_client_portal',
        title: 'Open Executive Client Presentation Portal & RBAC Gateway',
        category: 'ENTERPRISE & BRANDING',
        badge: 'RBAC',
        hotkey: 'Shift+J',
        keywords: ['portal', 'rbac', 'client', 'gateway', 'roles', 'vip', 'auditor', 'share', 'token'],
        action: () => this.stage.toggleClientPortal()
      },
      {
        id: 'action_pdf',
        title: 'Export 16:9 Landscape PDF Slide Deck',
        category: 'EXPORTS',
        badge: 'PDF',
        hotkey: 'E',
        keywords: ['pdf', 'print', 'slides', 'deck', 'export'],
        action: () => this.stage.exportPdfDeck()
      },
      {
        id: 'action_bundle',
        title: 'Export Standalone 1-Click Offline HTML Player Bundle',
        category: 'EXPORTS',
        badge: 'BUNDLE',
        hotkey: 'Export',
        keywords: ['bundle', 'offline', 'standalone', 'html', 'package'],
        action: () => this.stage.exportStandaloneBundle()
      },
      {
        id: 'action_record_session',
        title: 'Start / Stop Keynote Session Audio-Visual Recording',
        category: 'EXPORTS',
        badge: 'RECORD',
        hotkey: 'R',
        keywords: ['record', 'session', 'replay', 'telemetry'],
        action: () => this.stage.toggleSessionRecording()
      },
      {
        id: 'action_war_room',
        title: 'Open Dual-Screen Presenter War Room Console',
        category: 'PRESENTER',
        badge: 'CONSOLE',
        hotkey: 'P',
        keywords: ['war room', 'console', 'presenter', 'dual screen'],
        action: () => this.stage.openWarRoom()
      },
      {
        id: 'action_qr',
        title: 'Open Audience QR Remote Pairing Dialog',
        category: 'AUDIENCE',
        badge: 'QR',
        hotkey: 'Q',
        keywords: ['qr', 'mobile', 'remote', 'pair', 'connect'],
        action: () => this.stage.toggleQrModal()
      },
      {
        id: 'action_fullscreen',
        title: 'Toggle Presentation Fullscreen Display',
        category: 'STAGE',
        badge: 'DISPLAY',
        hotkey: 'F',
        keywords: ['fullscreen', 'expand', 'projector'],
        action: () => this.stage.toggleFullscreen()
      },

      // Phase 14: Chaos Engineering Resilience Demonstrator
      {
        id: 'chaos_latency',
        title: 'Chaos: Inject +450ms Latency Spike (Test Backpressure)',
        category: 'RESILIENCE / CHAOS',
        badge: 'CHAOS',
        hotkey: 'Chaos',
        keywords: ['chaos', 'latency', 'lag', 'fault', 'resilience', 'spike'],
        action: () => this.stage.chaosSimulator?.injectLatency()
      },
      {
        id: 'chaos_kill',
        title: 'Chaos: Crash Microservice Pod (Test Zero-Downtime Failover)',
        category: 'RESILIENCE / CHAOS',
        badge: 'CHAOS',
        hotkey: 'Crash',
        keywords: ['chaos', 'kill', 'crash', 'failover', 'pod', 'circuit breaker'],
        action: () => this.stage.chaosSimulator?.killNode()
      },
      {
        id: 'chaos_reset',
        title: 'Chaos: Reset All Injected Faults (Restore System Normalcy)',
        category: 'RESILIENCE / CHAOS',
        badge: 'RESTORE',
        hotkey: 'Reset',
        keywords: ['chaos', 'reset', 'restore', 'recover', 'normal'],
        action: () => this.stage.chaosSimulator?.resetAll()
      },

      // Phase 14: International Executive Language Subtitles
      {
        id: 'lang_ja',
        title: 'Subtitles & Voice: Switch Language to Japanese (日本語)',
        category: 'INTERNATIONAL',
        badge: 'JA',
        hotkey: 'Lang',
        keywords: ['language', 'japanese', 'nihongo', 'subtitle', 'voice'],
        action: () => {
          const select = document.getElementById('narratorLangSelect');
          if (select) select.value = 'ja';
          import('../lib/audio/voice-narrator.js').then(m => m.voiceNarrator.setLanguage('ja'));
        }
      },
      {
        id: 'lang_de',
        title: 'Subtitles & Voice: Switch Language to German (Deutsch)',
        category: 'INTERNATIONAL',
        badge: 'DE',
        hotkey: 'Lang',
        keywords: ['language', 'german', 'deutsch', 'subtitle', 'voice'],
        action: () => {
          const select = document.getElementById('narratorLangSelect');
          if (select) select.value = 'de';
          import('../lib/audio/voice-narrator.js').then(m => m.voiceNarrator.setLanguage('de'));
        }
      },
      {
        id: 'lang_es',
        title: 'Subtitles & Voice: Switch Language to Spanish (Español)',
        category: 'INTERNATIONAL',
        badge: 'ES',
        hotkey: 'Lang',
        keywords: ['language', 'spanish', 'espanol', 'subtitle', 'voice'],
        action: () => {
          const select = document.getElementById('narratorLangSelect');
          if (select) select.value = 'es';
          import('../lib/audio/voice-narrator.js').then(m => m.voiceNarrator.setLanguage('es'));
        }
      },
      {
        id: 'lang_fr',
        title: 'Subtitles & Voice: Switch Language to French (Français)',
        category: 'INTERNATIONAL',
        badge: 'FR',
        hotkey: 'Lang',
        keywords: ['language', 'french', 'francais', 'subtitle', 'voice'],
        action: () => {
          const select = document.getElementById('narratorLangSelect');
          if (select) select.value = 'fr';
          import('../lib/audio/voice-narrator.js').then(m => m.voiceNarrator.setLanguage('fr'));
        }
      },
      {
        id: 'lang_zh',
        title: 'Subtitles & Voice: Switch Language to Mandarin Chinese (中文)',
        category: 'INTERNATIONAL',
        badge: 'ZH',
        hotkey: 'Lang',
        keywords: ['language', 'chinese', 'mandarin', 'subtitle', 'voice'],
        action: () => {
          const select = document.getElementById('narratorLangSelect');
          if (select) select.value = 'zh';
          import('../lib/audio/voice-narrator.js').then(m => m.voiceNarrator.setLanguage('zh'));
        }
      },
      {
        id: 'lang_bn',
        title: 'Subtitles & Voice: Switch Language to Bengali (বাংলা)',
        category: 'INTERNATIONAL',
        badge: 'BN',
        hotkey: 'Lang',
        keywords: ['language', 'bengali', 'bangla', 'subtitle', 'voice'],
        action: () => {
          const select = document.getElementById('narratorLangSelect');
          if (select) select.value = 'bn';
          import('../lib/audio/voice-narrator.js').then(m => m.voiceNarrator.setLanguage('bn'));
        }
      },
      {
        id: 'lang_en',
        title: 'Subtitles & Voice: Switch Language to English (US)',
        category: 'INTERNATIONAL',
        badge: 'EN',
        hotkey: 'Lang',
        keywords: ['language', 'english', 'subtitle', 'voice'],
        action: () => {
          const select = document.getElementById('narratorLangSelect');
          if (select) select.value = 'en';
          import('../lib/audio/voice-narrator.js').then(m => m.voiceNarrator.setLanguage('en'));
        }
      },

      // Phase 17: Subsystem Filters, Comparison Matrix & Briefing Sheet (Tasks T082, T083, T084)
      {
        id: 'action_compare_matrix',
        title: 'Open Executive Architecture Comparison & Differential Matrix',
        category: 'EXECUTIVE INTELLIGENCE',
        badge: 'COMPARE',
        hotkey: 'J',
        keywords: ['compare', 'matrix', 'benchmark', 'differential', 'side by side', 'competitor', 'delta'],
        action: () => {
          if (this.stage.comparisonMatrix) this.stage.comparisonMatrix.toggle();
        }
      },
      {
        id: 'action_export_briefing',
        title: 'Export Executive Presentation 1-Page Briefing Sheet (HTML / Print A4)',
        category: 'EXPORTS',
        badge: 'BRIEFING',
        hotkey: 'B',
        keywords: ['briefing', 'one pager', 'a4', 'print', 'summary', 'executive', 'export'],
        action: () => {
          import('../lib/export/briefing-exporter.js').then(m => {
            m.briefingExporter.downloadBriefingHTML(this.stage.manifest, this.stage.pipelineGraph);
          });
        }
      },
      {
        id: 'action_filter_all_tiers',
        title: 'Architecture Filter: Show All Subsystem Tiers',
        category: 'ARCHITECTURE',
        badge: 'TIER: ALL',
        hotkey: 'Tiers',
        keywords: ['tier', 'filter', 'all', 'subsystems', 'architecture'],
        action: () => {
          if (this.stage.currentStageIndex !== 1) this.stage.goToStage(1);
          this.stage.filterSubsystemTier('all');
        }
      },
      {
        id: 'action_filter_ingress',
        title: 'Architecture Filter: Ingress & API Gateway Subsystems',
        category: 'ARCHITECTURE',
        badge: 'TIER: INGRESS',
        hotkey: 'Ingress',
        keywords: ['tier', 'filter', 'ingress', 'gateway', 'api', 'subsystems'],
        action: () => {
          if (this.stage.currentStageIndex !== 1) this.stage.goToStage(1);
          this.stage.filterSubsystemTier('ingress');
        }
      },
      {
        id: 'action_filter_compute',
        title: 'Architecture Filter: Compute & AI Agent Orchestration Subsystems',
        category: 'ARCHITECTURE',
        badge: 'TIER: COMPUTE',
        hotkey: 'Compute',
        keywords: ['tier', 'filter', 'compute', 'worker', 'ai', 'agent', 'subsystems'],
        action: () => {
          if (this.stage.currentStageIndex !== 1) this.stage.goToStage(1);
          this.stage.filterSubsystemTier('compute');
        }
      },
      {
        id: 'action_filter_data',
        title: 'Architecture Filter: Data, Persistence & Storage Subsystems',
        category: 'ARCHITECTURE',
        badge: 'TIER: DATA',
        hotkey: 'Data',
        keywords: ['tier', 'filter', 'data', 'db', 'storage', 'postgres', 'redis', 'subsystems'],
        action: () => {
          if (this.stage.currentStageIndex !== 1) this.stage.goToStage(1);
          this.stage.filterSubsystemTier('data');
        }
      },
      {
        id: 'action_filter_edge',
        title: 'Architecture Filter: Edge & Real-Time Hardware Subsystems',
        category: 'ARCHITECTURE',
        badge: 'TIER: EDGE',
        hotkey: 'Edge',
        keywords: ['tier', 'filter', 'edge', 'hardware', 'webrtc', 'device', 'mesh', 'subsystems'],
        action: () => {
          if (this.stage.currentStageIndex !== 1) this.stage.goToStage(1);
          this.stage.filterSubsystemTier('edge');
        }
      },

      // Phase 18: Packet Tracer, Readiness Audit & Presenter Mirror (Tasks T087, T088, T089)
      {
        id: 'action_trace_packet',
        title: 'Trigger Animated Packet Flow & Hop Latency Trace (Stage 2)',
        category: 'ARCHITECTURE',
        badge: 'TRACE FLOW',
        hotkey: 'Z',
        keywords: ['trace', 'packet', 'flow', 'hops', 'latency', 'particles', 'svg', 'network'],
        action: () => {
          if (this.stage.currentStageIndex !== 1) this.stage.goToStage(1);
          this.stage.packetTracer?.toggle();
        }
      },
      {
        id: 'action_pitch_audit',
        title: 'Run Executive Pitch Deck Readiness Audit Scorecard',
        category: 'EXECUTIVE INTELLIGENCE',
        badge: 'AUDIT',
        hotkey: 'I',
        keywords: ['audit', 'readiness', 'scorecard', 'rehearsal', 'quality', 'eval', 'certificate'],
        action: () => {
          this.stage.readinessAudit?.toggle();
        }
      },
      {
        id: 'action_launch_mirror',
        title: 'Launch Dual-Screen Presenter Confidence Mirror Window',
        category: 'PRESENTER',
        badge: 'MIRROR',
        hotkey: 'Mirror',
        keywords: ['mirror', 'dual screen', 'presenter', 'confidence monitor', 'next slide', 'sync'],
        action: () => {
          import('../lib/remote/presenter-mirror.js').then(m => {
            m.presenterMirror.openMirrorWindow(this.stage.manifest?.id);
          });
        }
      }
    ];
  }

  /**
   * Builds the OLED modal DOM structure for the command palette
   */
  initDOM() {
    let modal = document.getElementById('executiveCommandPaletteModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'executiveCommandPaletteModal';
      modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(3, 5, 8, 0.82);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        z-index: 99999;
        display: none;
        align-items: flex-start;
        justify-content: center;
        padding-top: 14vh;
        box-sizing: border-box;
      `;

      modal.innerHTML = `
        <div style="
          width: 640px;
          max-width: 92vw;
          background: #080D18;
          border: 1px solid rgba(0, 240, 255, 0.35);
          border-radius: 14px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(0, 240, 255, 0.12);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        ">
          <!-- Search Header -->
          <div style="display: flex; align-items: center; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); background: #0A1120;">
            <span style="font-size: 14px; margin-right: 12px; color: var(--accent-cyan); display: flex; align-items: center;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input type="text" id="paletteSearchInput" placeholder="Type a command or jump to slide..." autocomplete="off" spellcheck="false" style="
              flex: 1;
              background: transparent;
              border: none;
              outline: none;
              color: #F8FAFC;
              font-size: 15px;
              font-family: var(--font-sans);
              font-weight: 500;
            " />
            <div style="display: flex; align-items: center; gap: 6px;">
              <kbd style="padding: 2px 7px; background: #131E30; border: 1px solid #1E2D44; border-radius: 4px; font-size: 10px; font-family: var(--font-mono); color: #94A3B8;">ESC</kbd>
            </div>
          </div>

          <!-- Command List -->
          <div id="paletteCommandsList" style="
            max-height: 380px;
            overflow-y: auto;
            padding: 8px 10px;
            display: flex;
            flex-direction: column;
            gap: 4px;
          ">
            <!-- Dynamically populated -->
          </div>

          <!-- Palette Footer -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 18px;
            background: #05080E;
            border-top: 1px solid rgba(255,255,255,0.06);
            font-size: 11px;
            font-family: var(--font-mono);
            color: #64748B;
          ">
            <div style="display: flex; gap: 12px; align-items: center;">
              <span><strong style="color: #94A3B8;">↑↓</strong> Navigate</span>
              <span><strong style="color: #94A3B8;">↵</strong> Select</span>
              <span><strong style="color: #94A3B8;">ESC</strong> Exit</span>
            </div>
            <span id="paletteResultCount" style="color: var(--accent-cyan);">24 Actions Available</span>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
    }

    this.modalEl = modal;
    this.inputEl = modal.querySelector('#paletteSearchInput');
    this.listEl = modal.querySelector('#paletteCommandsList');

    // Close on backdrop click
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.close();
      }
    });
  }

  /**
   * Sets up global keyboard shortcuts and input filters
   */
  setupListeners() {
    window.addEventListener('keydown', (e) => {
      // Cmd+K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        this.toggle();
        return;
      }

      if (!this.isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.moveSelection(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.moveSelection(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.executeSelected();
      }
    });

    if (this.inputEl) {
      this.inputEl.addEventListener('input', () => {
        this.filter(this.inputEl.value);
      });
    }
  }

  /**
   * Opens the command palette
   */
  open() {
    this.isOpen = true;
    this.modalEl.style.display = 'flex';
    soundEngine.playWhoosh();
    this.filter('');
    if (this.inputEl) {
      this.inputEl.value = '';
      setTimeout(() => this.inputEl.focus(), 30);
    }
  }

  /**
   * Closes the command palette
   */
  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.modalEl.style.display = 'none';
    soundEngine.playClick();
  }

  /**
   * Toggles the command palette open/closed
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Filters commands by query string with fuzzy matching
   * @param {string} query
   */
  filter(query) {
    const q = (query || '').toLowerCase().trim();
    if (!q) {
      this.filteredCommands = [...this.commands];
    } else {
      const tokens = q.split(/\s+/);
      this.filteredCommands = this.commands.filter(cmd => {
        const text = `${cmd.title} ${cmd.category} ${cmd.badge} ${cmd.hotkey} ${(cmd.keywords || []).join(' ')}`.toLowerCase();
        return tokens.every(tok => text.includes(tok));
      });
    }

    this.selectedIndex = 0;
    this.renderList();
  }

  /**
   * Renders the filtered command list
   */
  renderList() {
    if (!this.listEl) return;
    this.listEl.innerHTML = '';

    const countEl = this.modalEl.querySelector('#paletteResultCount');
    if (countEl) {
      countEl.textContent = `${this.filteredCommands.length} Action${this.filteredCommands.length === 1 ? '' : 's'} Available`;
    }

    if (this.filteredCommands.length === 0) {
      this.listEl.innerHTML = `
        <div style="padding: 24px 16px; text-align: center; color: #64748B; font-size: 13px;">
          No matching executive commands found.
        </div>
      `;
      return;
    }

    this.filteredCommands.forEach((cmd, idx) => {
      const isSelected = idx === this.selectedIndex;
      const row = document.createElement('div');
      row.className = `palette-row ${isSelected ? 'selected' : ''}`;
      row.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 9px 14px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.15s ease;
        background: ${isSelected ? 'rgba(0, 240, 255, 0.12)' : 'transparent'};
        border: 1px solid ${isSelected ? 'rgba(0, 240, 255, 0.4)' : 'transparent'};
      `;

      row.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; flex: 1; overflow: hidden;">
          <span class="cyber-badge" style="
            font-size: 9px;
            padding: 1px 6px;
            color: ${isSelected ? '#00F0FF' : '#94A3B8'};
            border-color: ${isSelected ? '#00F0FF' : '#334155'};
            background: #06090F;
          ">
            ${cmd.badge}
          </span>
          <span style="
            font-size: 13px;
            font-weight: 500;
            color: ${isSelected ? '#FFFFFF' : '#CBD5E1'};
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          ">
            ${cmd.title}
          </span>
        </div>
        ${cmd.hotkey ? `
          <kbd style="
            padding: 2px 7px;
            background: #0B1322;
            border: 1px solid #1E2D44;
            border-radius: 4px;
            font-size: 10px;
            font-family: var(--font-mono);
            color: ${isSelected ? '#00F0FF' : '#64748B'};
            margin-left: 12px;
          ">${cmd.hotkey}</kbd>
        ` : ''}
      `;

      row.addEventListener('mouseenter', () => {
        this.selectedIndex = idx;
        this.updateSelectionStyles();
      });

      row.addEventListener('click', () => {
        this.executeCommand(cmd);
      });

      this.listEl.appendChild(row);
    });
  }

  /**
   * Updates row background and border styles without full DOM rerender
   */
  updateSelectionStyles() {
    const rows = this.listEl.querySelectorAll('.palette-row');
    rows.forEach((row, idx) => {
      const isSelected = idx === this.selectedIndex;
      row.style.background = isSelected ? 'rgba(0, 240, 255, 0.12)' : 'transparent';
      row.style.borderColor = isSelected ? 'rgba(0, 240, 255, 0.4)' : 'transparent';
    });
  }

  /**
   * Moves selection up or down
   * @param {number} delta
   */
  moveSelection(delta) {
    if (this.filteredCommands.length === 0) return;
    soundEngine.playClick();
    this.selectedIndex = (this.selectedIndex + delta + this.filteredCommands.length) % this.filteredCommands.length;
    this.updateSelectionStyles();

    // Scroll active item into view
    const activeRow = this.listEl.children[this.selectedIndex];
    if (activeRow) {
      activeRow.scrollIntoView({ block: 'nearest' });
    }
  }

  /**
   * Executes the currently highlighted command
   */
  executeSelected() {
    if (this.filteredCommands.length === 0) return;
    const cmd = this.filteredCommands[this.selectedIndex];
    if (cmd) {
      this.executeCommand(cmd);
    }
  }

  /**
   * Executes a command and closes the palette
   * @param {Object} cmd
   */
  executeCommand(cmd) {
    this.close();
    soundEngine.playSuccess();
    try {
      cmd.action();
    } catch (err) {
      console.error('Command execution failed:', err);
    }
  }
}
