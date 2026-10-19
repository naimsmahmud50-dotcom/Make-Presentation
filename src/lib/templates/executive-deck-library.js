/**
 * =========================================================================================
 * [MODULE] APEXFLOW OS — Executive Pre-Built Keynote Template Library (Task T157)
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Curated repository of 5 production-grade keynote templates for technical leaders:
 *   1. Series A/B Technical Due Diligence & Architecture Moat Pitch
 *   2. Board of Directors Cloud Modernization & STRIDE Security Briefing
 *   3. Major Developer Conference Keynote with Live Interactive Playground
 *   4. C-Suite Annual Engineering Strategy & Autonomous AI Adoption
 *   5. Mission-Critical Outage Post-Mortem & Multi-Cloud DR Replay
 *
 * Each template provides pre-configured slides, talking points, metrics, and architecture.
 * =========================================================================================
 */

import { ARCHETYPES } from '../types.js';
import { inputShield } from '../security/input-shield.js';

export const EXECUTIVE_KEYNOTE_TEMPLATES = [
  {
    id: 'template_series_a_pitch',
    title: 'Series A/B Technical Due Diligence',
    subtitle: 'Architecture Moat, Defensibility & Scale Economics',
    industry: 'Venture Capital',
    badge: 'INVESTOR DECK',
    badgeColor: '#00F0FF',
    targetAudience: 'Lead Technical Partners & Institutional Investors',
    estimatedDurationMins: 20,
    slidesCount: 6,
    metricsPills: [
      { label: 'Gross Margin', value: '84.2%', color: '#10B981' },
      { label: 'P99 Latency', value: '< 8.4ms', color: '#00F0FF' },
      { label: 'Egress Costs', value: '$0 / mo (Zero-Upload)', color: '#8B5CF6' }
    ],
    narrativeFlow: [
      'Problem: Legacy enterprise systems bleed millions in cloud egress and manual latency overhead',
      'The Moat: Hardware-accelerated client-side WebAssembly computation and distributed edge cache',
      'Live Proof: 120 FPS interactive 3D architecture holodeck rendering 50,000 requests/sec',
      'FinOps ROI: 74% reduction in annual cloud spend ($2.4M ARR saved across pilot cohorts)',
      'The Ask: $18M Series A to scale global edge orchestration and developer ecosystem'
    ],
    defaultManifest: {
      name: 'TitanScale Series A Deck',
      tagline: 'High-Throughput Autonomous Edge Compute & Moat Due Diligence',
      category: 'Investor Keynote',
      archetype: ARCHETYPES.TYPE_C_BACKEND_API,
      confidenceScore: 0.99,
      detectedFrameworks: ['rust', 'wasm', 'grpc', 'kubernetes', 'timescaledb'],
      techStack: [
        { name: 'Rust Core', category: 'core', color: '#DEA584', icon: 'cpu' },
        { name: 'WebAssembly Edge', category: 'utility', color: '#654FF0', icon: 'zap' },
        { name: 'gRPC Fabric', category: 'core', color: '#244C5A', icon: 'layers' },
        { name: 'TimescaleDB', category: 'database', color: '#FDB515', icon: 'database' }
      ],
      stats: {
        totalFiles: 184,
        totalLinesOfCode: 24600,
        languageBreakdown: { rs: 140, proto: 24, toml: 12, sql: 8 },
        estimatedRunTimeMs: 420
      }
    }
  },
  {
    id: 'template_board_security',
    title: 'Board of Directors Security & Modernization',
    subtitle: 'Air-Gapped Architecture, STRIDE Risk Mitigation & SOC 2 Compliance',
    industry: 'CyberSecurity',
    badge: 'BOARD BRIEFING',
    badgeColor: '#EF4444',
    targetAudience: 'Audit & Risk Committee, CISO, Board of Directors',
    estimatedDurationMins: 15,
    slidesCount: 6,
    metricsPills: [
      { label: 'Air-Gap Integrity', value: '100% Certified', color: '#10B981' },
      { label: 'STRIDE Score', value: '98.5 / 100', color: '#00F0FF' },
      { label: 'RTO / RPO', value: '< 1.2s / 0 RPO', color: '#F59E0B' }
    ],
    narrativeFlow: [
      'Executive Threat Landscape: Rising state-sponsored supply chain and credential attacks',
      'Air-Gapped Privacy Architecture: Zero-Upload memory containment eliminates external attack surface',
      'STRIDE Matrix Review: Spoofing, Tampering, and Information Disclosure eliminated at edge',
      'Disaster Recovery Stopwatch: Automated multi-cloud failover proof with zero data loss',
      'Governance Assurance: SOC 2 Type II and ISO 27001 evidence ledger compliance'
    ],
    defaultManifest: {
      name: 'Board Security & Modernization',
      tagline: 'Enterprise Zero-Trust Defense, STRIDE Threat Posture & Audit Evidence',
      category: 'Governance Keynote',
      archetype: ARCHETYPES.TYPE_A_AUTOMATION,
      confidenceScore: 0.99,
      detectedFrameworks: ['vault', 'openfga', 'spiffe', 'envoy', 'postgresql'],
      techStack: [
        { name: 'HashiCorp Vault', category: 'utility', color: '#FBBF24', icon: 'shield' },
        { name: 'OpenFGA AuthZ', category: 'core', color: '#10B981', icon: 'key' },
        { name: 'SPIFFE/SPIRE', category: 'utility', color: '#00F0FF', icon: 'lock' },
        { name: 'Audit PostgreSQL', category: 'database', color: '#336791', icon: 'database' }
      ],
      stats: {
        totalFiles: 122,
        totalLinesOfCode: 14200,
        languageBreakdown: { go: 80, yml: 25, json: 12, sql: 5 },
        estimatedRunTimeMs: 760
      }
    }
  },
  {
    id: 'template_dev_conf_keynote',
    title: 'Developer Conference Keynote',
    subtitle: 'Building Distributed Systems that Never Fail at 100M+ Scale',
    industry: 'Engineering',
    badge: 'TECH KEYNOTE',
    badgeColor: '#8B5CF6',
    targetAudience: 'Software Engineers, Architects & Technology Community',
    estimatedDurationMins: 35,
    slidesCount: 6,
    metricsPills: [
      { label: 'QPS Benchmark', value: '1.2M QPS', color: '#10B981' },
      { label: 'Event Lag', value: '< 1.4ms', color: '#00F0FF' },
      { label: 'Active Shards', value: '1,024 Nodes', color: '#8B5CF6' }
    ],
    narrativeFlow: [
      'The Paradigm Shift: From brittle monoliths to autonomous event-driven micro-shards',
      'The 3D Living Pipeline: Real-time visual exploration of distributed consensus and Raft quorum',
      'Live Chaos Engineering: Injecting 500ms network partition and watching circuit breakers heal',
      'Real-Time WebAssembly Execution: Running Rust compiled sandboxes directly in the stage browser',
      'Developer Ergonomics: Hands-free voice commands, instant git branch diffs, and open source release'
    ],
    defaultManifest: {
      name: 'Distributed Systems Keynote',
      tagline: 'High-Concurrency Event Mesh, Raft Consensus & 120 FPS 3D Holodeck',
      category: 'Developer Keynote',
      archetype: ARCHETYPES.TYPE_C_BACKEND_API,
      confidenceScore: 0.98,
      detectedFrameworks: ['rust', 'tokio', 'kafka', 'threejs', 'redis'],
      techStack: [
        { name: 'Rust Tokio', category: 'core', color: '#DEA584', icon: 'cpu' },
        { name: 'Apache Kafka', category: 'automation', color: '#E42528', icon: 'layers' },
        { name: 'Three.js 3D', category: 'utility', color: '#00F0FF', icon: 'globe' },
        { name: 'Redis Streams', category: 'database', color: '#DC2626', icon: 'database' }
      ],
      stats: {
        totalFiles: 210,
        totalLinesOfCode: 31200,
        languageBreakdown: { rs: 160, ts: 30, proto: 12, yml: 8 },
        estimatedRunTimeMs: 510
      }
    }
  },
  {
    id: 'template_enterprise_ai',
    title: 'Enterprise AI & Autonomous Agents',
    subtitle: 'Operationalizing Multi-Modal LLMs & Vector Shards in Production',
    industry: 'Artificial Intelligence',
    badge: 'AI STRATEGY',
    badgeColor: '#10B981',
    targetAudience: 'CTO, CIO, VP AI/ML, Enterprise Engineering Leaders',
    estimatedDurationMins: 25,
    slidesCount: 6,
    metricsPills: [
      { label: 'Token Efficiency', value: '92.4%', color: '#10B981' },
      { label: 'Vector Recall', value: '99.1% @ 10ms', color: '#00F0FF' },
      { label: 'GPU Cost Savings', value: '$1.8M Annual', color: '#F59E0B' }
    ],
    narrativeFlow: [
      'The Enterprise Challenge: GenAI proof-of-concepts failing to survive enterprise production scale',
      'Autonomous Agent Architecture: Hierarchical supervisor agents orchestrating specialized workers',
      'Vector Sharding & Memory: Distributed cosine search over 500M enterprise embeddings in client memory',
      'Cost Governance: Dynamic prompt caching and small-model routing cutting API spend by 68%',
      'Enterprise Rollout Roadmap: Phased deployment across CRM, customer support, and code assist'
    ],
    defaultManifest: {
      name: 'Enterprise AI Agent Strategy',
      tagline: 'Autonomous Multi-Agent Mesh, Vector Indexing & GPU FinOps Optimization',
      category: 'AI Keynote',
      archetype: ARCHETYPES.TYPE_D_DATA_ML,
      confidenceScore: 0.99,
      detectedFrameworks: ['pytorch', 'langchain', 'fastapi', 'qdrant', 'celery'],
      techStack: [
        { name: 'PyTorch ML', category: 'ai', color: '#EE4C2C', icon: 'cpu' },
        { name: 'LangChain Agents', category: 'automation', color: '#00F0FF', icon: 'layers' },
        { name: 'Qdrant VectorDB', category: 'database', color: '#DC2626', icon: 'database' },
        { name: 'FastAPI Ingress', category: 'core', color: '#059669', icon: 'server' }
      ],
      stats: {
        totalFiles: 145,
        totalLinesOfCode: 18400,
        languageBreakdown: { py: 115, ipynb: 15, yml: 10, sql: 5 },
        estimatedRunTimeMs: 890
      }
    }
  },
  {
    id: 'template_incident_postmortem',
    title: 'Mission-Critical Outage Post-Mortem',
    subtitle: 'Zero-Downtime Failover, Root-Cause Waterfall & DR Remediation',
    industry: 'Reliability Engineering',
    badge: 'INCIDENT REVIEW',
    badgeColor: '#F59E0B',
    targetAudience: 'Executive Incident Review Board, SRE Leads & Customers',
    estimatedDurationMins: 20,
    slidesCount: 6,
    metricsPills: [
      { label: 'Time to Recovery', value: '1.18 seconds', color: '#10B981' },
      { label: 'Data Loss (RPO)', value: '0 bytes', color: '#00F0FF' },
      { label: 'Availability SLA', value: '99.995%', color: '#10B981' }
    ],
    narrativeFlow: [
      'The Incident Timeline: T+0 to T+4 minutes microservice failure cascade and telemetry anomalies',
      'Root-Cause Waterfall: Upstream payment processor timeout exhausting connection pools',
      'Circuit Breaker Response: Automated autonomous isolation within 240ms preventing global outage',
      'Multi-Cloud DR Failover: 1.18-second instantaneous traffic diversion to secondary cloud region',
      'Remediation Ledger: Permanent architectural fixes, chaos testing additions, and SLA protection'
    ],
    defaultManifest: {
      name: 'Incident Post-Mortem & DR Replay',
      tagline: 'High-Stakes Post-Mortem, Latency Waterfall & Multi-Cloud Circuit Breaker Healing',
      category: 'SRE Keynote',
      archetype: ARCHETYPES.TYPE_C_BACKEND_API,
      confidenceScore: 0.99,
      detectedFrameworks: ['envoy', 'prometheus', 'opentelemetry', 'redis', 'postgres'],
      techStack: [
        { name: 'Envoy Gateways', category: 'utility', color: '#8B5CF6', icon: 'shield' },
        { name: 'OpenTelemetry', category: 'utility', color: '#F59E0B', icon: 'activity' },
        { name: 'Prometheus Alerting', category: 'utility', color: '#EF4444', icon: 'bell' },
        { name: 'PostgreSQL Active-Active', category: 'database', color: '#336791', icon: 'database' }
      ],
      stats: {
        totalFiles: 130,
        totalLinesOfCode: 16800,
        languageBreakdown: { go: 85, yml: 30, proto: 10, sh: 5 },
        estimatedRunTimeMs: 640
      }
    }
  }
];

export class ExecutiveDeckLibrary {
  constructor() {
    this.templates = EXECUTIVE_KEYNOTE_TEMPLATES;
  }

  /**
   * Returns all available keynote templates
   */
  getAllTemplates() {
    return this.templates;
  }

  /**
   * Finds a template by its unique identifier
   * @param {string} id 
   * @returns {Object|null}
   */
  getTemplateById(id) {
    const cleanId = inputShield.sanitizeString(id);
    return this.templates.find(t => t.id === cleanId) || null;
  }

  /**
   * Synthesizes an APEXFLOW project manifest from a template
   * @param {string} id 
   * @returns {Object} ProjectManifest
   */
  synthesizeManifest(id) {
    const tpl = this.getTemplateById(id);
    if (!tpl) throw new Error(`Keynote template not found: ${id}`);

    return {
      id: tpl.id,
      name: tpl.defaultManifest.name,
      tagline: tpl.defaultManifest.tagline,
      category: tpl.defaultManifest.category,
      archetype: tpl.defaultManifest.archetype,
      confidenceScore: tpl.defaultManifest.confidenceScore,
      detectedFrameworks: tpl.defaultManifest.detectedFrameworks,
      techStack: tpl.defaultManifest.techStack,
      stats: tpl.defaultManifest.stats,
      templateMetadata: {
        templateId: tpl.id,
        title: tpl.title,
        subtitle: tpl.subtitle,
        industry: tpl.industry,
        targetAudience: tpl.targetAudience,
        metricsPills: tpl.metricsPills,
        narrativeFlow: tpl.narrativeFlow
      },
      fileTree: {
        name: tpl.defaultManifest.name,
        path: '/',
        isDirectory: true,
        children: []
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  /**
   * Instantiates a full project record containing manifest and default pipeline graph
   * @param {string} id
   * @returns {{ manifest: Object, pipelineGraph: Object }}
   */
  instantiateProject(id) {
    const manifest = this.synthesizeManifest(id);
    const pipelineGraph = {
      stages: (manifest.templateMetadata?.narrativeFlow || []).map((step, idx) => ({
        index: idx,
        name: step.stage,
        focus: step.focus,
        hook: step.hook
      }))
    };
    return { manifest, pipelineGraph };
  }
}

export const executiveDeckLibrary = new ExecutiveDeckLibrary();
