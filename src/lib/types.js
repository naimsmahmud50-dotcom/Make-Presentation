/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Core Data Contracts, Types & Schemas
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * This module defines the foundational TypeScript / JSDoc domain entities and constants
 * used across the entire APEXFLOW OS ecosystem. It acts as the single source of truth for:
 *   1. Project Archetype Classification (Types A through F)
 *   2. Ingested Project Manifests and File Tree representations
 *   3. 2D/3D Living Pipeline Graph (Nodes, Edges, Protocols)
 *   4. Slide Deck Configuration & Stage State Models
 *   5. Presenter War-Room State and Audience Remote Payloads
 *
 * [NOTE] DEVELOPER NOTE FOR FUTURE EXTENSIONS:
 * - If you are adding a new project archetype (e.g., Embedded / IoT), add it to `ARCHETYPES`
 *   and update `polymorphic-detector.js` accordingly.
 * - All state entities here are JSON-serializable to ensure compatibility with IndexedDB,
 *   Web Workers, WebRTC data channels, and 1-Click offline HTML bundles.
 * =========================================================================================
 */

/**
 * The 6 Supported Project Archetypes
 * @readonly
 * @enum {string}
 */
export const ARCHETYPES = {
  TYPE_A_AUTOMATION: 'TYPE_A_AUTOMATION',     // n8n, LangChain, Celery, bot.py, Playwright
  TYPE_B_WEB_FRONTEND: 'TYPE_B_WEB_FRONTEND', // Next.js, React, Vite, Vue, Tailwind
  TYPE_C_BACKEND_API: 'TYPE_C_BACKEND_API',   // FastAPI, Express, Django, Go, Docker
  TYPE_D_DATA_ML: 'TYPE_D_DATA_ML',           // Jupyter notebooks, PyTorch, Pandas, scikit-learn
  TYPE_E_MOBILE_DESKTOP: 'TYPE_E_MOBILE_DESKTOP', // Flutter, React Native, Electron
  TYPE_F_GENERIC: 'TYPE_F_GENERIC'            // Any unrecognized codebase (0% rejection fallback)
};

/**
 * Human-readable Archetype Metadata
 */
export const ARCHETYPE_METADATA = {
  TYPE_A_AUTOMATION: {
    id: 'TYPE_A_AUTOMATION',
    name: 'Automation & AI Bots',
    shortName: 'Type A: Automation',
    badgeColor: '#00F0FF',
    accentColor: 'rgb(0, 240, 255)',
    description: 'Autonomous bots, cron pipelines, and multi-agent workflows.',
    defaultStage: 'STAGE_2_ARCHITECTURE',
    hasSandbox: true
  },
  TYPE_B_WEB_FRONTEND: {
    id: 'TYPE_B_WEB_FRONTEND',
    name: 'Web & Frontend Applications',
    shortName: 'Type B: Web App',
    badgeColor: '#10B981',
    accentColor: 'rgb(16, 185, 129)',
    description: 'Modern reactive user interfaces, component trees, and web platforms.',
    defaultStage: 'STAGE_4_DEVICE_FRAME',
    hasSandbox: false
  },
  TYPE_C_BACKEND_API: {
    id: 'TYPE_C_BACKEND_API',
    name: 'Backend APIs & Microservices',
    shortName: 'Type C: API Service',
    badgeColor: '#A855F7',
    accentColor: 'rgb(168, 85, 247)',
    description: 'RESTful/gRPC microservices, database schemas, and API playgrounds.',
    defaultStage: 'STAGE_2_ARCHITECTURE',
    hasSandbox: true
  },
  TYPE_D_DATA_ML: {
    id: 'TYPE_D_DATA_ML',
    name: 'Data Science & ML Pipelines',
    shortName: 'Type D: ML Pipeline',
    badgeColor: '#F59E0B',
    accentColor: 'rgb(245, 158, 11)',
    description: 'Machine learning models, dataset transformations, and inference flows.',
    defaultStage: 'STAGE_3_SANDBOX',
    hasSandbox: true
  },
  TYPE_E_MOBILE_DESKTOP: {
    id: 'TYPE_E_MOBILE_DESKTOP',
    name: 'Mobile & Desktop Applications',
    shortName: 'Type E: Multi-Device',
    badgeColor: '#38BDF8',
    accentColor: 'rgb(56, 189, 248)',
    description: 'Cross-platform mobile apps and desktop client software.',
    defaultStage: 'STAGE_4_DEVICE_FRAME',
    hasSandbox: false
  },
  TYPE_F_GENERIC: {
    id: 'TYPE_F_GENERIC',
    name: 'Generic Codebase Constellation',
    shortName: 'Type F: Universal',
    badgeColor: '#F43F5E',
    accentColor: 'rgb(244, 63, 94)',
    description: 'Universal fallback: file hierarchy constellation and markdown narrative.',
    defaultStage: 'STAGE_1_HERO',
    hasSandbox: false
  }
};

/**
 * The 6 Breakthrough Presentation Stages
 * @readonly
 * @enum {string}
 */
export const STAGES = {
  STAGE_1_HERO: 'STAGE_1_HERO',
  STAGE_2_ARCHITECTURE: 'STAGE_2_ARCHITECTURE',
  STAGE_3_SANDBOX: 'STAGE_3_SANDBOX',
  STAGE_4_DEVICE_FRAME: 'STAGE_4_DEVICE_FRAME',
  STAGE_5_BENTO_ROI: 'STAGE_5_BENTO_ROI',
  STAGE_6_AUDIENCE_REMOTE: 'STAGE_6_AUDIENCE_REMOTE'
};

/**
 * Stage display metadata
 */
export const STAGE_CONFIGS = [
  { id: STAGES.STAGE_1_HERO, title: 'Cinematic Hero', subtitle: 'Holographic Tech Radar', shortcut: '1' },
  { id: STAGES.STAGE_2_ARCHITECTURE, title: 'Living Architecture', subtitle: '2D Flow / 3D Holodeck', shortcut: '2' },
  { id: STAGES.STAGE_3_SANDBOX, title: 'Execution Sandbox', subtitle: 'Pyodide WASM Terminal', shortcut: '3' },
  { id: STAGES.STAGE_4_DEVICE_FRAME, title: 'Responsive Mockups', subtitle: 'Apple Pro XDR & iPhone', shortcut: '4' },
  { id: STAGES.STAGE_5_BENTO_ROI, title: 'Impact Matrix', subtitle: 'Bento ROI & Before/After', shortcut: '5' },
  { id: STAGES.STAGE_6_AUDIENCE_REMOTE, title: 'Audience Remote', subtitle: 'Live QR Sync & Emojis', shortcut: '6' }
];

/**
 * Creates an empty, valid Project Manifest
 * @param {string} name
 * @returns {Object} ProjectManifest
 */
export function createEmptyManifest(name = 'Untitled Project') {
  return {
    id: 'proj_' + Math.random().toString(36).substring(2, 9),
    name: name,
    tagline: 'High-Impact Engineering Architecture',
    category: 'Software Engineering',
    archetype: ARCHETYPES.TYPE_F_GENERIC,
    confidenceScore: 1.0,
    detectedFrameworks: [],
    techStack: [],
    entrypoints: [],
    readmeSummary: '',
    stats: {
      totalFiles: 0,
      totalLinesOfCode: 0,
      languageBreakdown: {},
      estimatedRunTimeMs: 0
    },
    fileTree: {
      name: name,
      path: '/',
      isDirectory: true,
      children: []
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}
