# Data Models & Schemas: APEXFLOW OS

## 1. Core Domain Types

```typescript
// 1. Project Archetype Classification
export type ProjectArchetype = 
  | 'TYPE_A_AUTOMATION'    // n8n, LangChain, Celery, bot.py, Playwright
  | 'TYPE_B_WEB_FRONTEND'   // Next.js, React, Vite, Vue, Tailwind
  | 'TYPE_C_BACKEND_API'    // FastAPI, Express, Django, Go, Docker
  | 'TYPE_D_DATA_ML'        // Jupyter, PyTorch, Pandas, Scikit-learn
  | 'TYPE_E_MOBILE_DESKTOP' // Flutter, React Native, Electron
  | 'TYPE_F_GENERIC';       // Any other codebase fallback

// 2. Ingested Project Manifest
export interface ProjectManifest {
  id: string;
  name: string;
  tagline: string;
  category: string;
  archetype: ProjectArchetype;
  confidenceScore: number;
  detectedFrameworks: string[];
  techStack: TechPill[];
  entrypoints: string[];
  readmeSummary?: string;
  stats: {
    totalFiles: number;
    totalLinesOfCode: number;
    languageBreakdown: Record<string, number>;
    estimatedRunTimeMs: number;
  };
  fileTree: FileNode;
  createdAt: number;
  updatedAt: number;
}

export interface TechPill {
  name: string;
  version?: string;
  category: 'core' | 'database' | 'ai' | 'automation' | 'utility';
  icon: string;
  color: string;
  docUrl?: string;
}

export interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  language?: string;
  children?: FileNode[];
  content?: string; // Loaded on demand for code inspection
}

// 3. Living Architecture Pipeline Graph (2D & 3D)
export interface PipelineGraph {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
}

export interface PipelineNode {
  id: string;
  label: string;
  type: 'trigger' | 'processor' | 'ai_agent' | 'database' | 'api_gateway' | 'output';
  filePath?: string;
  codeSnippet?: string;
  language?: string;
  position: { x: number; y: number; z?: number }; // 2D (x,y) and 3D (z)
  metrics?: {
    latencyMs?: number;
    throughput?: string;
    status: 'idle' | 'active' | 'executing' | 'success' | 'error';
  };
  details: {
    description: string;
    talkingPoints: string[];
  };
}

export interface PipelineEdge {
  id: string;
  source: string;
  target: string;
  protocol?: 'REST' | 'gRPC' | 'WebSocket' | 'PubSub' | 'Queue';
  animated: boolean;
  glowColor?: string;
}

// 4. Slide Deck & Presentation Configuration
export interface PresentationConfig {
  id: string;
  projectId: string;
  theme: {
    primaryColor: string; // e.g. #00F0FF (Neon Cyan)
    secondaryColor: string; // e.g. #8B5CF6 (Cyber Violet)
    backgroundOled: string; // #030508
    fontFamily: string;
    brandingLogoUrl?: string;
    watermarkText?: string;
  };
  activeStages: PresentationStageType[];
  stageSettings: {
    hero: {
      radarEnabled: boolean;
      ambientParticles: boolean;
    };
    architecture: {
      defaultView: '2D' | '3D';
      autoRotate3D: boolean;
      particleSpeed: number;
    };
    sandbox: {
      runtime: 'pyodide' | 'mock_simulator';
      autoRunOnEntry: boolean;
      terminalTheme: 'phosphor_green' | 'amber' | 'cyber_cyan';
    };
    deviceFrame: {
      initialDevice: 'apple_xdr' | 'iphone_16' | 'ipad_pro';
      targetUrl?: string;
    };
    bentoRoi: {
      hoursSavedPerWeek: number;
      efficiencyMultiplier: string;
      reliabilityPercentage: string;
      beforeManualDescription: string;
      afterAutomatedDescription: string;
    };
    audienceRemote: {
      allowLiveEmoji: boolean;
      allowWebhookTrigger: boolean;
      activePoll?: {
        question: string;
        options: string[];
        votes: Record<number, number>;
      };
    };
  };
}

export type PresentationStageType = 
  | 'STAGE_1_HERO'
  | 'STAGE_2_ARCHITECTURE'
  | 'STAGE_3_SANDBOX'
  | 'STAGE_4_DEVICE_FRAME'
  | 'STAGE_5_BENTO_ROI'
  | 'STAGE_6_AUDIENCE_REMOTE';

// 5. Presenter War Room State
export interface WarRoomState {
  currentStageIndex: number;
  totalStages: number;
  elapsedSeconds: number;
  pacing: {
    wordsPerMinute: number;
    status: 'too_slow' | 'optimal' | 'too_fast';
  };
  activeTool: 'none' | 'laser' | 'spotlight' | 'pen';
  laserCoordinates: { x: number; y: number } | null;
  spotlightCoordinates: { x: number; y: number } | null;
  annotations: Array<{
    type: 'path' | 'arrow' | 'rect';
    color: string;
    points: Array<{ x: number; y: number }>;
  }>;
}

// 7. Ingestion Stress Benchmark Model (Phase 31)
export interface IngestionBenchmarkResult {
  fileCount: number;
  durationMs: number;
  traversalQps: number;
  memoryDeltaMb: number;
  archetypeDetected: ProjectArchetype;
  confidenceScore: number;
  isRealWorldModel: boolean;
  modelName?: string;
  timestamp: string;
}

// 8. Executive Keynote Preset Template Model (Phase 32)
export interface ExecutiveKeynoteTemplate {
  id: string;
  title: string;
  subtitle: string;
  industry: 'FinTech' | 'CyberSecurity' | 'OpenSource' | 'AI_Enterprise' | 'Cloud_DR';
  badge: string;
  targetAudience: 'Investors' | 'Board of Directors' | 'Engineers' | 'C-Suite' | 'Incident Team';
  estimatedDurationMins: number;
  slidesCount: number;
  narrativeFlow: string[];
  metricsPills: Array<{ label: string; value: string; color: string }>;
  defaultManifest: Partial<ProjectManifest>;
}

// 9. Human Rehearsal Playbook & Confidence Scorecard (Phase 33)
export interface HumanRehearsalSession {
  sessionId: string;
  totalDurationSeconds: number;
  averageWpm: number;
  pacingStabilityScore: number; // 0 - 100%
  fillerWordCount: number;
  slideOverages: Array<{ slideIndex: number; budgetedSecs: number; actualSecs: number }>;
  executiveConfidenceScore: number; // 0 - 100%
  recommendations: string[];
  timestamp: string;
}
```

