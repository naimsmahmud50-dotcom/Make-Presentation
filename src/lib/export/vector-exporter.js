/**
 * ═══════════════════════════════════════════════════════════════════════════
 * [MODULE]: VECTOR PRESENTATION SLIDE EXPORT STUDIO (src/lib/export/vector-exporter.js)
 * [PURPOSE]: High-Fidelity 4K Vector SVG & Standalone Slide Deck Generator (Task T072)
 * [ARCHITECTURE & INTEGRATION]:
 *    - Pure client-side SVG generation producing 1920x1080 resolution-independent vector slides.
 *    - 3 Professional Executive Themes:
 *        1. 'oled': Deep Cyberpunk Luxury (#04060A with Cyan, Emerald, and Violet glows).
 *        2. 'light': Executive Boardroom Pristine (Clean Slate/White with high-contrast inks).
 *        3. 'transparent': Pure vector elements without background (perfect for Keynote/PowerPoint/Figma).
 *    - Direct SVG download, 1-Click Clipboard copy for Figma/Illustrator, and Full Multi-Slide Deck Bundler.
 * [ENGINEERING NOTE]:
 *    All slides are rendered as pure SVG DOM strings with vector gradients, filters, and crisp paths.
 *    No external network assets or web fonts required; uses native system font stacks and embedded SVG defs.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { soundEngine } from '../audio/sound-synth.js';

export class VectorSlideExporter {
  constructor() {
    this.width = 1920;
    this.height = 1080;
  }

  /**
   * Returns theme color definitions for SVG rendering
   * @param {string} theme 'oled' | 'light' | 'transparent'
   * @returns {Object}
   */
  getThemePalette(theme = 'oled') {
    if (theme === 'light') {
      return {
        bg: '#F8FAFC',
        cardBg: '#FFFFFF',
        cardBorder: '#E2E8F0',
        textPrimary: '#0F172A',
        textSecondary: '#475569',
        textMuted: '#94A3B8',
        accentCyan: '#0284C7',
        accentEmerald: '#059669',
        accentViolet: '#7C3AED',
        accentAmber: '#D97706',
        gridLine: '#E2E8F0',
        glowFilter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.06))',
      };
    }

    if (theme === 'transparent') {
      return {
        bg: 'none',
        cardBg: 'rgba(7, 10, 18, 0.75)',
        cardBorder: 'rgba(0, 240, 255, 0.25)',
        textPrimary: '#FFFFFF',
        textSecondary: '#94A3B8',
        textMuted: '#64748B',
        accentCyan: '#00F0FF',
        accentEmerald: '#00FF9D',
        accentViolet: '#8B5CF6',
        accentAmber: '#FFB800',
        gridLine: 'rgba(255, 255, 255, 0.05)',
        glowFilter: 'drop-shadow(0 0 12px rgba(0,240,255,0.4))',
      };
    }

    // Default: 'oled'
    return {
      bg: '#04060A',
      cardBg: '#070A12',
      cardBorder: 'rgba(0, 240, 255, 0.2)',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      accentCyan: '#00F0FF',
      accentEmerald: '#00FF9D',
      accentViolet: '#8B5CF6',
      accentAmber: '#FFB800',
      gridLine: 'rgba(255, 255, 255, 0.04)',
      glowFilter: 'drop-shadow(0 0 16px rgba(0,240,255,0.35))',
    };
  }

  /**
   * Generates common SVG <defs> block (gradients, glow filters, fonts)
   */
  getDefs(theme, pal) {
    return `
    <defs>
      <!-- Background Gradients -->
      <radialGradient id="radialGlow" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stop-color="${pal.accentCyan}" stop-opacity="${theme === 'light' ? '0.08' : '0.15'}" />
        <stop offset="60%" stop-color="${pal.accentViolet}" stop-opacity="${theme === 'light' ? '0.03' : '0.06'}" />
        <stop offset="100%" stop-color="${pal.bg === 'none' ? '#000000' : pal.bg}" stop-opacity="${pal.bg === 'none' ? '0' : '1'}" />
      </radialGradient>

      <linearGradient id="cyanEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${pal.accentCyan}" />
        <stop offset="100%" stop-color="${pal.accentEmerald}" />
      </linearGradient>

      <linearGradient id="violetCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${pal.accentViolet}" />
        <stop offset="100%" stop-color="${pal.accentCyan}" />
      </linearGradient>

      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${pal.cardBg}" stop-opacity="0.95" />
        <stop offset="100%" stop-color="${pal.cardBg}" stop-opacity="0.80" />
      </linearGradient>

      <!-- Glow Filters -->
      <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <!-- Grid Pattern -->
      <pattern id="dotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="1" fill="${pal.gridLine}" />
      </pattern>
    </defs>
    `;
  }

  /**
   * Generates Slide 1: Hero Radar & Executive Ingestion
   */
  generateSlide1(manifest, pal, theme) {
    const title = manifest?.name || 'APEXFLOW OS';
    const tagline = manifest?.tagline || 'Autonomous Engineering Architecture Engine';
    const archetype = manifest?.archetype || 'TYPE_A (Distributed Event Architecture)';
    const files = manifest?.stats?.files || 428;
    const lines = manifest?.stats?.lines || '64.2K';

    return `
      <!-- Slide 1: Hero Radar & Architecture -->
      <!-- Center Radar System -->
      <g transform="translate(1380, 540)">
        <!-- Concentric Radar Rings -->
        <circle r="340" fill="none" stroke="${pal.gridLine}" stroke-width="1.5" stroke-dasharray="4,6" />
        <circle r="260" fill="none" stroke="${pal.cardBorder}" stroke-width="1.5" opacity="0.6" />
        <circle r="180" fill="none" stroke="${pal.gridLine}" stroke-width="1.5" stroke-dasharray="6,4" />
        <circle r="100" fill="none" stroke="${pal.accentCyan}" stroke-width="2" opacity="0.8" />
        <circle r="20" fill="${pal.accentCyan}" opacity="0.9" filter="url(#neonGlow)" />

        <!-- Radar Crosshairs -->
        <line x1="-360" y1="0" x2="360" y2="0" stroke="${pal.gridLine}" stroke-width="1" />
        <line x1="0" y1="-360" x2="0" y2="360" stroke="${pal.gridLine}" stroke-width="1" />

        <!-- Radar Vector Blip Points -->
        <g transform="translate(140, -110)">
          <circle r="6" fill="${pal.accentEmerald}" filter="url(#neonGlow)" />
          <text x="12" y="4" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="${pal.accentEmerald}">KAFKA BROKER</text>
        </g>
        <g transform="translate(-160, 90)">
          <circle r="6" fill="${pal.accentCyan}" filter="url(#neonGlow)" />
          <text x="12" y="4" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="${pal.accentCyan}">VECTOR DB (PINECONE)</text>
        </g>
        <g transform="translate(90, 160)">
          <circle r="6" fill="${pal.accentViolet}" filter="url(#neonGlow)" />
          <text x="12" y="4" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="${pal.accentViolet}">AI AGENT CLUSTER</text>
        </g>
        <g transform="translate(-110, -180)">
          <circle r="5" fill="${pal.accentAmber}" filter="url(#neonGlow)" />
          <text x="12" y="4" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="${pal.accentAmber}">EDGE GATEWAY</text>
        </g>

        <!-- Radar Sweep Indicator Vector -->
        <line x1="0" y1="0" x2="240" y2="-240" stroke="url(#cyanEmeraldGrad)" stroke-width="2.5" opacity="0.8" />
        <polygon points="0,0 240,-240 280,-180" fill="url(#cyanEmeraldGrad)" opacity="0.12" />
      </g>

      <!-- Left Hero Typography & Badges -->
      <g transform="translate(160, 280)">
        <!-- Archetype Chip -->
        <rect x="0" y="0" width="360" height="36" rx="18" fill="${pal.cardBg}" stroke="${pal.accentCyan}" stroke-width="1.5" />
        <circle cx="18" cy="18" r="5" fill="${pal.accentCyan}" filter="url(#neonGlow)" />
        <text x="34" y="23" font-family="monospace" font-size="13" font-weight="700" fill="${pal.accentCyan}" letter-spacing="1.5">ARCHETYPE: ${archetype}</text>

        <!-- Main Headline -->
        <text x="0" y="110" font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-size="64" font-weight="900" fill="${pal.textPrimary}" letter-spacing="-1">
          ${title}
        </text>

        <!-- Subtitle -->
        <text x="0" y="165" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="400" fill="${pal.textSecondary}">
          ${tagline}
        </text>

        <!-- Metric Badges Row -->
        <g transform="translate(0, 220)">
          <!-- Files Badge -->
          <rect x="0" y="0" width="160" height="80" rx="12" fill="${pal.cardBg}" stroke="${pal.cardBorder}" stroke-width="1.5" />
          <text x="24" y="32" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="${pal.textMuted}" letter-spacing="1">PROJECT ASSETS</text>
          <text x="24" y="62" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="${pal.accentCyan}">${files} Files</text>

          <!-- Lines of Code Badge -->
          <rect x="180" y="0" width="160" height="80" rx="12" fill="${pal.cardBg}" stroke="${pal.cardBorder}" stroke-width="1.5" />
          <text x="204" y="32" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="${pal.textMuted}" letter-spacing="1">SYNTACTIC DEPTH</text>
          <text x="204" y="62" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="${pal.accentEmerald}">${lines} LoC</text>

          <!-- SLA Badge -->
          <rect x="360" y="0" width="160" height="80" rx="12" fill="${pal.cardBg}" stroke="${pal.cardBorder}" stroke-width="1.5" />
          <text x="384" y="32" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="${pal.textMuted}" letter-spacing="1">SYSTEM UPTIME</text>
          <text x="384" y="62" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="${pal.accentViolet}">99.99% SLA</text>
        </g>

        <!-- Tech Stack Vector Pills -->
        <g transform="translate(0, 340)">
          <text x="0" y="0" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="${pal.textMuted}" letter-spacing="2">ACTIVE PIPELINE DRIVERS</text>
          <g transform="translate(0, 16)">
            <rect x="0" y="0" width="110" height="30" rx="6" fill="${pal.cardBg}" stroke="${pal.cardBorder}" />
            <text x="18" y="19" font-family="monospace" font-size="12" fill="${pal.textPrimary}">WebAssembly</text>

            <rect x="125" y="0" width="90" height="30" rx="6" fill="${pal.cardBg}" stroke="${pal.cardBorder}" />
            <text x="143" y="19" font-family="monospace" font-size="12" fill="${pal.textPrimary}">Three.js</text>

            <rect x="230" y="0" width="115" height="30" rx="6" fill="${pal.cardBg}" stroke="${pal.cardBorder}" />
            <text x="248" y="19" font-family="monospace" font-size="12" fill="${pal.textPrimary}">WebRTC Mesh</text>

            <rect x="360" y="0" width="105" height="30" rx="6" fill="${pal.cardBg}" stroke="${pal.cardBorder}" />
            <text x="378" y="19" font-family="monospace" font-size="12" fill="${pal.textPrimary}">Web Audio</text>
          </g>
        </g>
      </g>
    `;
  }

  /**
   * Generates Slide 2: 2D Living Pipeline & Architecture Topology
   */
  generateSlide2(manifest, pal, theme) {
    return `
      <!-- Slide 2: 2D Living Pipeline Architecture -->
      <g transform="translate(160, 140)">
        <text x="0" y="40" font-family="monospace" font-size="14" font-weight="700" fill="${pal.accentCyan}" letter-spacing="2">STAGE 02 // TOPOLOGY DEEP-DIVE</text>
        <text x="0" y="90" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="${pal.textPrimary}">Living Microservice Pipeline</text>
        <text x="0" y="125" font-family="system-ui, sans-serif" font-size="18" fill="${pal.textSecondary}">Autonomous high-throughput event fabric with sub-millisecond dispatch</text>
      </g>

      <!-- Interconnecting Bezier Paths -->
      <g fill="none" stroke-width="3">
        <!-- Path 1 -> 2 -->
        <path d="M 380 480 C 470 480, 520 480, 610 480" stroke="${pal.accentCyan}" opacity="0.7" />
        <circle cx="495" cy="480" r="4" fill="${pal.accentCyan}" filter="url(#neonGlow)" />

        <!-- Path 2 -> 3 (Branch Up) -->
        <path d="M 870 480 C 960 480, 960 380, 1050 380" stroke="${pal.accentEmerald}" opacity="0.8" />
        <circle cx="960" cy="430" r="4" fill="${pal.accentEmerald}" filter="url(#neonGlow)" />

        <!-- Path 2 -> 4 (Branch Down) -->
        <path d="M 870 480 C 960 480, 960 580, 1050 580" stroke="${pal.accentViolet}" opacity="0.8" />
        <circle cx="960" cy="530" r="4" fill="${pal.accentViolet}" filter="url(#neonGlow)" />

        <!-- Path 3 & 4 -> 5 -->
        <path d="M 1310 380 C 1400 380, 1400 480, 1490 480" stroke="${pal.accentEmerald}" opacity="0.7" />
        <path d="M 1310 580 C 1400 580, 1400 480, 1490 480" stroke="${pal.accentViolet}" opacity="0.7" />
      </g>

      <!-- Node 1: Ingestion Gateway -->
      <g transform="translate(140, 410)">
        <rect width="240" height="140" rx="14" fill="${pal.cardBg}" stroke="${pal.accentCyan}" stroke-width="2" filter="${pal.glowFilter}" />
        <rect x="0" y="0" width="240" height="34" rx="14" fill="${pal.cardBorder}" opacity="0.4" />
        <circle cx="20" cy="17" r="5" fill="${pal.accentCyan}" filter="url(#neonGlow)" />
        <text x="34" y="21" font-family="monospace" font-size="11" font-weight="700" fill="${pal.accentCyan}">INGRESS GATEWAY</text>
        <text x="20" y="68" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="${pal.textPrimary}">HTTP/3 Webhook</text>
        <text x="20" y="92" font-family="system-ui, sans-serif" font-size="12" fill="${pal.textSecondary}">14,200 req/sec</text>
        <rect x="20" y="106" width="70" height="20" rx="4" fill="${pal.cardBorder}" />
        <text x="28" y="120" font-family="monospace" font-size="10" fill="${pal.accentCyan}">p99: 1.2ms</text>
      </g>

      <!-- Node 2: Stream Parser & Broker -->
      <g transform="translate(610, 410)">
        <rect width="260" height="140" rx="14" fill="${pal.cardBg}" stroke="${pal.accentCyan}" stroke-width="2" filter="${pal.glowFilter}" />
        <rect x="0" y="0" width="260" height="34" rx="14" fill="${pal.cardBorder}" opacity="0.4" />
        <circle cx="20" cy="17" r="5" fill="${pal.accentCyan}" filter="url(#neonGlow)" />
        <text x="34" y="21" font-family="monospace" font-size="11" font-weight="700" fill="${pal.accentCyan}">EVENT DISPATCHER</text>
        <text x="20" y="68" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="${pal.textPrimary}">Kafka Partition Hub</text>
        <text x="20" y="92" font-family="system-ui, sans-serif" font-size="12" fill="${pal.textSecondary}">Zero Message Loss</text>
        <rect x="20" y="106" width="80" height="20" rx="4" fill="${pal.cardBorder}" />
        <text x="28" y="120" font-family="monospace" font-size="10" fill="${pal.accentEmerald}">100% HEALTH</text>
      </g>

      <!-- Node 3: AI Inference Engine -->
      <g transform="translate(1050, 310)">
        <rect width="260" height="140" rx="14" fill="${pal.cardBg}" stroke="${pal.accentEmerald}" stroke-width="2" filter="${pal.glowFilter}" />
        <rect x="0" y="0" width="260" height="34" rx="14" fill="${pal.cardBorder}" opacity="0.4" />
        <circle cx="20" cy="17" r="5" fill="${pal.accentEmerald}" filter="url(#neonGlow)" />
        <text x="34" y="21" font-family="monospace" font-size="11" font-weight="700" fill="${pal.accentEmerald}">AI AGENT CLUSTER</text>
        <text x="20" y="68" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="${pal.textPrimary}">Deep Reasoning LLM</text>
        <text x="20" y="92" font-family="system-ui, sans-serif" font-size="12" fill="${pal.textSecondary}">TensorRT-LLM 8x H100</text>
        <rect x="20" y="106" width="86" height="20" rx="4" fill="${pal.cardBorder}" />
        <text x="28" y="120" font-family="monospace" font-size="10" fill="${pal.accentEmerald}">TOKENS: 4.8K/s</text>
      </g>

      <!-- Node 4: Vector Memory Sink -->
      <g transform="translate(1050, 510)">
        <rect width="260" height="140" rx="14" fill="${pal.cardBg}" stroke="${pal.accentViolet}" stroke-width="2" filter="${pal.glowFilter}" />
        <rect x="0" y="0" width="260" height="34" rx="14" fill="${pal.cardBorder}" opacity="0.4" />
        <circle cx="20" cy="17" r="5" fill="${pal.accentViolet}" filter="url(#neonGlow)" />
        <text x="34" y="21" font-family="monospace" font-size="11" font-weight="700" fill="${pal.accentViolet}">VECTOR REPOSITORY</text>
        <text x="20" y="68" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="${pal.textPrimary}">Milvus + HNSW Index</text>
        <text x="20" y="92" font-family="system-ui, sans-serif" font-size="12" fill="${pal.textSecondary}">1536-dim Embeddings</text>
        <rect x="20" y="106" width="82" height="20" rx="4" fill="${pal.cardBorder}" />
        <text x="28" y="120" font-family="monospace" font-size="10" fill="${pal.accentViolet}">p99: 4.8ms</text>
      </g>

      <!-- Node 5: Real-Time Egress -->
      <g transform="translate(1490, 410)">
        <rect width="260" height="140" rx="14" fill="${pal.cardBg}" stroke="${pal.accentCyan}" stroke-width="2" filter="${pal.glowFilter}" />
        <rect x="0" y="0" width="260" height="34" rx="14" fill="${pal.cardBorder}" opacity="0.4" />
        <circle cx="20" cy="17" r="5" fill="${pal.accentCyan}" filter="url(#neonGlow)" />
        <text x="34" y="21" font-family="monospace" font-size="11" font-weight="700" fill="${pal.accentCyan}">SYNCHRONIZED EGRESS</text>
        <text x="20" y="68" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="${pal.textPrimary}">WebRTC Mesh Bus</text>
        <text x="20" y="92" font-family="system-ui, sans-serif" font-size="12" fill="${pal.textSecondary}">100,000+ Concurrent</text>
        <rect x="20" y="106" width="80" height="20" rx="4" fill="${pal.cardBorder}" />
        <text x="28" y="120" font-family="monospace" font-size="10" fill="${pal.accentCyan}">GLOBAL SYNC</text>
      </g>

      <!-- Bottom Pipeline Metrics Ribbon -->
      <g transform="translate(140, 840)">
        <rect width="1610" height="80" rx="12" fill="${pal.cardBg}" stroke="${pal.cardBorder}" stroke-width="1.5" />
        <text x="40" y="46" font-family="monospace" font-size="13" font-weight="700" fill="${pal.textMuted}">FABRIC TELEMETRY:</text>
        <text x="240" y="46" font-family="monospace" font-size="13" fill="${pal.textPrimary}">THROUGHPUT: <tspan fill="${pal.accentCyan}" font-weight="700">1.82 GB/s</tspan></text>
        <text x="560" y="46" font-family="monospace" font-size="13" fill="${pal.textPrimary}">ERROR RATE: <tspan fill="${pal.accentEmerald}" font-weight="700">0.0001%</tspan></text>
        <text x="880" y="46" font-family="monospace" font-size="13" fill="${pal.textPrimary}">END-TO-END LATENCY: <tspan fill="${pal.accentViolet}" font-weight="700">18.4ms</tspan></text>
        <text x="1260" y="46" font-family="monospace" font-size="13" fill="${pal.textPrimary}">CHAOS DEFENSE: <tspan fill="${pal.accentAmber}" font-weight="700">ARMED</tspan></text>
      </g>
    `;
  }

  /**
   * Generates Slide 3: Pyodide Sandbox & Cyber Terminal
   */
  generateSlide3(manifest, pal, theme) {
    return `
      <!-- Slide 3: In-Browser Pyodide Execution -->
      <g transform="translate(160, 140)">
        <text x="0" y="40" font-family="monospace" font-size="14" font-weight="700" fill="${pal.accentEmerald}" letter-spacing="2">STAGE 03 // LIVE EXECUTION SANDBOX</text>
        <text x="0" y="90" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="${pal.textPrimary}">Pyodide WebAssembly Terminal</text>
        <text x="0" y="125" font-family="system-ui, sans-serif" font-size="18" fill="${pal.textSecondary}">100% In-Browser CPython 3.11 with zero backend dependency</text>
      </g>

      <!-- Terminal Window Vector -->
      <g transform="translate(160, 310)">
        <!-- Outer Frame -->
        <rect width="1600" height="640" rx="14" fill="${pal.cardBg}" stroke="${pal.accentEmerald}" stroke-width="2" filter="${pal.glowFilter}" />
        
        <!-- Header Bar -->
        <rect width="1600" height="44" rx="14" fill="${pal.cardBorder}" opacity="0.3" />
        <!-- macOS Window Dots -->
        <circle cx="28" cy="22" r="6" fill="#EF4444" />
        <circle cx="48" cy="22" r="6" fill="#F59E0B" />
        <circle cx="68" cy="22" r="6" fill="#10B981" />
        <text x="100" y="27" font-family="monospace" font-size="12" font-weight="700" fill="${pal.textMuted}">terminal@apexflow-os: ~/sandboxes/pyodide-engine (Python 3.11.3 WebAssembly)</text>

        <!-- Code Block -->
        <g transform="translate(40, 90)" font-family="monospace" font-size="17" line-height="28">
          <text x="0" y="0" fill="${pal.textMuted}">01 <tspan fill="${pal.accentViolet}">import</tspan> numpy <tspan fill="${pal.accentViolet}">as</tspan> np</text>
          <text x="0" y="36" fill="${pal.textMuted}">02 <tspan fill="${pal.accentViolet}">from</tspan> apexflow.engine <tspan fill="${pal.accentViolet}">import</tspan> AutonomousPipeline, EventStream</text>
          <text x="0" y="72" fill="${pal.textMuted}">03 </text>
          <text x="0" y="108" fill="${pal.textMuted}">04 <tspan fill="${pal.accentEmerald}"># Synthesize 100,000 real-time telemetry packets</tspan></text>
          <text x="0" y="144" fill="${pal.textMuted}">05 pipeline = AutonomousPipeline(cluster_id=<tspan fill="${pal.accentAmber}">"prod-us-east-1"</tspan>)</text>
          <text x="0" y="180" fill="${pal.textMuted}">06 latency_matrix = np.random.exponential(scale=<tspan fill="${pal.accentCyan}">14.2</tspan>, size=<tspan fill="${pal.accentCyan}">100000</tspan>)</text>
          <text x="0" y="216" fill="${pal.textMuted}">07 p99_latency = np.percentile(latency_matrix, <tspan fill="${pal.accentCyan}">99.0</tspan>)</text>
          <text x="0" y="252" fill="${pal.textMuted}">08 print(<tspan fill="${pal.accentAmber}">f"[APEXFLOW] Pipeline SLA p99: {p99_latency:.2f}ms | Verified: 100%"</tspan>)</text>
        </g>

        <!-- Divider -->
        <line x1="40" y1="410" x2="1560" y2="410" stroke="${pal.gridLine}" stroke-width="1.5" />

        <!-- Console Stream Output -->
        <g transform="translate(40, 460)" font-family="monospace" font-size="15">
          <text x="0" y="0" fill="${pal.accentCyan}">[2026-10-14T19:08:42Z] [INFO] [Pyodide Engine] WebAssembly runtime initialized in 312ms.</text>
          <text x="0" y="32" fill="${pal.accentEmerald}">[2026-10-14T19:08:43Z] [SUCCESS] [Telemetry Simulation] 100,000 events processed across 6 worker threads.</text>
          <text x="0" y="64" fill="${pal.accentAmber}">[2026-10-14T19:08:43Z] [BENCHMARK] Pipeline SLA p99: 18.34ms | Memory Consumption: 22.4 MB</text>
          <text x="0" y="96" fill="${pal.textPrimary}">[2026-10-14T19:08:43Z] [OUTPUT] Zero-Upload Guarantee validated: 0 bytes dispatched externally.</text>
        </g>
      </g>
    `;
  }

  /**
   * Generates Slide 4: Responsive Multi-Device Studio
   */
  generateSlide4(manifest, pal, theme) {
    return `
      <!-- Slide 4: Responsive Multi-Device Studio -->
      <g transform="translate(160, 140)">
        <text x="0" y="40" font-family="monospace" font-size="14" font-weight="700" fill="${pal.accentCyan}" letter-spacing="2">STAGE 04 // RESPONSIVE PROTOTYPE STUDIO</text>
        <text x="0" y="90" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="${pal.textPrimary}">Universal Device Hardware Frames</text>
        <text x="0" y="125" font-family="system-ui, sans-serif" font-size="18" fill="${pal.textSecondary}">Pro Display XDR & iPhone 16 Pro high-resolution interactive viewport simulations</text>
      </g>

      <!-- Desktop Display XDR Frame -->
      <g transform="translate(160, 310)">
        <!-- Outer Monitor Bezel -->
        <rect width="1000" height="580" rx="18" fill="#18181B" stroke="#27272A" stroke-width="4" filter="${pal.glowFilter}" />
        <!-- Screen Bezel -->
        <rect x="14" y="14" width="972" height="552" rx="10" fill="${pal.cardBg}" />

        <!-- Mockup Content Inside Desktop Screen -->
        <g transform="translate(34, 34)">
          <!-- Top App Bar -->
          <rect width="932" height="40" rx="6" fill="${pal.cardBorder}" opacity="0.3" />
          <text x="20" y="26" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="${pal.accentCyan}">APEXFLOW ENTERPRISE HUD</text>
          <text x="800" y="26" font-family="monospace" font-size="11" fill="${pal.textMuted}">4K RETINA (6016x3384)</text>

          <!-- 3 Micro-Cards Inside Desktop -->
          <rect x="0" y="60" width="290" height="180" rx="8" fill="${pal.cardBorder}" opacity="0.2" />
          <text x="20" y="96" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="${pal.textPrimary}">Global Event Mesh</text>
          <text x="20" y="130" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="${pal.accentCyan}">1.84M</text>
          <text x="20" y="154" font-family="system-ui, sans-serif" font-size="12" fill="${pal.textMuted}">Live Events / Sec</text>

          <rect x="310" y="60" width="290" height="180" rx="8" fill="${pal.cardBorder}" opacity="0.2" />
          <text x="330" y="96" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="${pal.textPrimary}">AI Copilot Threads</text>
          <text x="330" y="130" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="${pal.accentEmerald}">99.98%</text>
          <text x="330" y="154" font-family="system-ui, sans-serif" font-size="12" fill="${pal.textMuted}">Accuracy Rating</text>

          <rect x="620" y="60" width="290" height="180" rx="8" fill="${pal.cardBorder}" opacity="0.2" />
          <text x="640" y="96" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="${pal.textPrimary}">Resilience Index</text>
          <text x="640" y="130" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="${pal.accentViolet}">Grade A+</text>
          <text x="640" y="154" font-family="system-ui, sans-serif" font-size="12" fill="${pal.textMuted}">Zero Failure Recovery</text>

          <!-- SVG Mini Line Chart -->
          <g transform="translate(0, 260)">
            <rect width="932" height="200" rx="8" fill="${pal.cardBorder}" opacity="0.15" />
            <path d="M 40 140 Q 200 40, 360 90 T 680 50 T 900 30" fill="none" stroke="url(#cyanEmeraldGrad)" stroke-width="3" />
            <text x="40" y="34" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="${pal.textMuted}">REAL-TIME BANDWIDTH TRAFFIC DISPATCH</text>
          </g>
        </g>

        <!-- Monitor Stand Base -->
        <polygon points="440,580 470,660 530,660 560,580" fill="#27272A" />
        <rect x="420" y="660" width="160" height="16" rx="4" fill="#3F3F46" />
      </g>

      <!-- Mobile iPhone 16 Pro Frame -->
      <g transform="translate(1260, 260)">
        <!-- Titanium Chassis -->
        <rect width="360" height="710" rx="52" fill="#18181B" stroke="#3F3F46" stroke-width="5" filter="${pal.glowFilter}" />
        <!-- Screen Bezel -->
        <rect x="12" y="12" width="336" height="686" rx="44" fill="${pal.cardBg}" />

        <!-- Dynamic Island -->
        <rect x="130" y="24" width="100" height="26" rx="13" fill="#000000" />
        <circle cx="150" cy="37" r="4" fill="#111827" />

        <!-- Mobile Screen Content -->
        <g transform="translate(32, 80)">
          <text x="0" y="20" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="${pal.accentCyan}">AUDIENCE REMOTE</text>
          <text x="0" y="56" font-family="system-ui, sans-serif" font-size="24" font-weight="900" fill="${pal.textPrimary}">Live Reaction</text>

          <!-- Mobile Reaction Buttons -->
          <g transform="translate(0, 80)">
            <rect width="272" height="60" rx="14" fill="${pal.cardBorder}" opacity="0.4" />
            <g transform="translate(20, 18)" stroke="${pal.accentCyan}" stroke-width="2" fill="none">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
            </g>
            <text x="60" y="36" font-family="system-ui, sans-serif" font-size="15" font-weight="700" fill="${pal.textPrimary}">Deploy Architecture</text>
          </g>

          <g transform="translate(0, 160)">
            <rect width="272" height="60" rx="14" fill="${pal.cardBorder}" opacity="0.4" />
            <g transform="translate(20, 18)" stroke="${pal.accentViolet}" stroke-width="2" fill="none">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </g>
            <text x="60" y="36" font-family="system-ui, sans-serif" font-size="15" font-weight="700" fill="${pal.textPrimary}">Performance Burst</text>
          </g>

          <!-- Mobile Voting Mini Card -->
          <g transform="translate(0, 260)">
            <rect width="272" height="180" rx="14" fill="${pal.cardBorder}" opacity="0.25" stroke="${pal.accentEmerald}" />
            <text x="16" y="32" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="${pal.accentEmerald}">LIVE AUDIENCE POLL</text>
            <text x="16" y="60" font-family="system-ui, sans-serif" font-size="13" fill="${pal.textPrimary}">Production Readiness?</text>
            <!-- Progress Bar -->
            <rect x="16" y="80" width="240" height="12" rx="6" fill="${pal.cardBorder}" />
            <rect x="16" y="80" width="220" height="12" rx="6" fill="${pal.accentEmerald}" />
            <text x="16" y="120" font-family="monospace" font-size="12" fill="${pal.textPrimary}">94% YES (482 Votes)</text>
          </g>
        </g>
      </g>
    `;
  }

  /**
   * Generates Slide 5: Bento ROI & Strategic Impact Matrix
   */
  generateSlide5(manifest, pal, theme) {
    return `
      <!-- Slide 5: Bento ROI & Strategic Financial Impact -->
      <g transform="translate(160, 140)">
        <text x="0" y="40" font-family="monospace" font-size="14" font-weight="700" fill="${pal.accentViolet}" letter-spacing="2">STAGE 05 // QUANTIFIABLE VALUE CREATION</text>
        <text x="0" y="90" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="${pal.textPrimary}">Executive ROI & Impact Matrix</text>
        <text x="0" y="125" font-family="system-ui, sans-serif" font-size="18" fill="${pal.textSecondary}">Hard financial returns, reclaimed engineering capacity, and speed multiplication</text>
      </g>

      <g transform="translate(160, 310)">
        <!-- Bento Card 1: Annual Savings (Large) -->
        <g transform="translate(0, 0)">
          <rect width="780" height="300" rx="18" fill="${pal.cardBg}" stroke="${pal.accentCyan}" stroke-width="2" filter="${pal.glowFilter}" />
          <text x="40" y="56" font-family="monospace" font-size="13" font-weight="700" fill="${pal.accentCyan}" letter-spacing="1">PROJECTED ANNUAL SAVINGS</text>
          <text x="40" y="146" font-family="system-ui, sans-serif" font-size="72" font-weight="900" fill="url(#cyanEmeraldGrad)">$480,000</text>
          <text x="40" y="196" font-family="system-ui, sans-serif" font-size="20" fill="${pal.textSecondary}">Direct infrastructure offloading and automated orchestration</text>
          
          <!-- Mini Progress -->
          <rect x="40" y="236" width="700" height="10" rx="5" fill="${pal.cardBorder}" />
          <rect x="40" y="236" width="580" height="10" rx="5" fill="url(#cyanEmeraldGrad)" />
          <text x="40" y="270" font-family="monospace" font-size="12" fill="${pal.textMuted}">82% INFRASTRUCTURE OVERHEAD REDUCTION</text>
        </g>

        <!-- Bento Card 2: Hours Reclaimed -->
        <g transform="translate(820, 0)">
          <rect width="780" height="300" rx="18" fill="${pal.cardBg}" stroke="${pal.accentEmerald}" stroke-width="2" filter="${pal.glowFilter}" />
          <text x="40" y="56" font-family="monospace" font-size="13" font-weight="700" fill="${pal.accentEmerald}" letter-spacing="1">ENGINEERING HOURS RECLAIMED</text>
          <text x="40" y="146" font-family="system-ui, sans-serif" font-size="72" font-weight="900" fill="${pal.accentEmerald}">1,420 hrs</text>
          <text x="40" y="196" font-family="system-ui, sans-serif" font-size="20" fill="${pal.textSecondary}">Manual boilerplate, pipeline configuration, and triage eliminated</text>
          
          <rect x="40" y="236" width="700" height="10" rx="5" fill="${pal.cardBorder}" />
          <rect x="40" y="236" width="620" height="10" rx="5" fill="${pal.accentEmerald}" />
          <text x="40" y="270" font-family="monospace" font-size="12" fill="${pal.textMuted}">EQUIVALENT TO +3.2 SENIOR ARCHITECTS CAPACITY</text>
        </g>

        <!-- Bento Card 3: Payback Multiple -->
        <g transform="translate(0, 330)">
          <rect width="500" height="280" rx="18" fill="${pal.cardBg}" stroke="${pal.accentViolet}" stroke-width="2" filter="${pal.glowFilter}" />
          <text x="36" y="50" font-family="monospace" font-size="12" font-weight="700" fill="${pal.accentViolet}" letter-spacing="1">NET RETURN MULTIPLE</text>
          <text x="36" y="130" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="${pal.accentViolet}">3.8x ROI</text>
          <text x="36" y="174" font-family="system-ui, sans-serif" font-size="16" fill="${pal.textSecondary}">Break-even achieved in 42 days</text>
          <text x="36" y="210" font-family="monospace" font-size="12" fill="${pal.accentViolet}">● Zero Vendor Lock-in</text>
          <text x="36" y="234" font-family="monospace" font-size="12" fill="${pal.accentViolet}">● 100% Client Memory Executable</text>
        </g>

        <!-- Bento Card 4: Delivery Velocity -->
        <g transform="translate(530, 330)">
          <rect width="500" height="280" rx="18" fill="${pal.cardBg}" stroke="${pal.accentAmber}" stroke-width="2" filter="${pal.glowFilter}" />
          <text x="36" y="50" font-family="monospace" font-size="12" font-weight="700" fill="${pal.accentAmber}" letter-spacing="1">TIME TO MARKET</text>
          <text x="36" y="130" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="${pal.accentAmber}">14 Days</text>
          <text x="36" y="174" font-family="system-ui, sans-serif" font-size="16" fill="${pal.textSecondary}">From concept to production deployment</text>
          <text x="36" y="210" font-family="monospace" font-size="12" fill="${pal.accentAmber}">● -65% QA Verification Cycles</text>
          <text x="36" y="234" font-family="monospace" font-size="12" fill="${pal.accentAmber}">● Instant Executive Stakeholder Buy-in</text>
        </g>

        <!-- Bento Card 5: Autonomous Reliability -->
        <g transform="translate(1060, 330)">
          <rect width="540" height="280" rx="18" fill="${pal.cardBg}" stroke="${pal.accentCyan}" stroke-width="2" filter="${pal.glowFilter}" />
          <text x="36" y="50" font-family="monospace" font-size="12" font-weight="700" fill="${pal.accentCyan}" letter-spacing="1">RESILIENCE SCORE</text>
          <text x="36" y="130" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="${pal.accentCyan}">99.99%</text>
          <text x="36" y="174" font-family="system-ui, sans-serif" font-size="16" fill="${pal.textSecondary}">Fault-tolerant self-healing topology</text>
          <text x="36" y="210" font-family="monospace" font-size="12" fill="${pal.accentCyan}">● Auto-failover circuit breakers</text>
          <text x="36" y="234" font-family="monospace" font-size="12" fill="${pal.accentCyan}">● Chaos Engineering tested</text>
        </g>
      </g>
    `;
  }

  /**
   * Generates Slide 6: Audience Remote & Final Closing Crest
   */
  generateSlide6(manifest, pal, theme) {
    const title = manifest?.name || 'APEXFLOW OS';

    return `
      <!-- Slide 6: Audience Synchronized Remote & Closing -->
      <g transform="translate(160, 140)">
        <text x="0" y="40" font-family="monospace" font-size="14" font-weight="700" fill="${pal.accentCyan}" letter-spacing="2">STAGE 06 // AUDIENCE ENGAGEMENT & CLOSE</text>
        <text x="0" y="90" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="${pal.textPrimary}">Executive Buy-In & Next Horizons</text>
        <text x="0" y="125" font-family="system-ui, sans-serif" font-size="18" fill="${pal.textSecondary}">Synchronized mobile consensus and production rollout clearance</text>
      </g>

      <g transform="translate(160, 310)">
        <!-- Left: Stylized Vector QR & Connect Card -->
        <g transform="translate(0, 0)">
          <rect width="640" height="610" rx="18" fill="${pal.cardBg}" stroke="${pal.accentCyan}" stroke-width="2" filter="${pal.glowFilter}" />
          <text x="40" y="56" font-family="monospace" font-size="13" font-weight="700" fill="${pal.accentCyan}">MOBILE SYNC PORTAL</text>
          
          <!-- Stylized QR Frame -->
          <g transform="translate(180, 100)">
            <rect width="280" height="280" rx="14" fill="#FFFFFF" />
            <!-- Inner QR Finder Patterns -->
            <rect x="20" y="20" width="70" height="70" rx="8" fill="#000000" />
            <rect x="35" y="35" width="40" height="40" rx="4" fill="#FFFFFF" />
            <rect x="45" y="45" width="20" height="20" rx="2" fill="#000000" />

            <rect x="190" y="20" width="70" height="70" rx="8" fill="#000000" />
            <rect x="205" y="35" width="40" height="40" rx="4" fill="#FFFFFF" />
            <rect x="215" y="45" width="20" height="20" rx="2" fill="#000000" />

            <rect x="20" y="190" width="70" height="70" rx="8" fill="#000000" />
            <rect x="35" y="205" width="40" height="40" rx="4" fill="#FFFFFF" />
            <rect x="45" y="215" width="20" height="20" rx="2" fill="#000000" />

            <!-- Random-looking QR Data Bits -->
            <rect x="110" y="30" width="50" height="15" fill="#000000" />
            <rect x="110" y="60" width="30" height="30" fill="#000000" />
            <rect x="120" y="120" width="40" height="40" fill="#000000" />
            <rect x="40" y="110" width="40" height="40" fill="#000000" />
            <rect x="200" y="110" width="50" height="50" fill="#000000" />
            <rect x="110" y="180" width="60" height="40" fill="#000000" />
            <rect x="190" y="180" width="40" height="30" fill="#000000" />
            <rect x="180" y="230" width="70" height="30" fill="#000000" />
          </g>

          <text x="320" y="440" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="${pal.textPrimary}" text-anchor="middle">Scan to Trigger Live Polls</text>
          <text x="320" y="470" font-family="monospace" font-size="13" fill="${pal.textSecondary}" text-anchor="middle">Zero App Install • WebRTC DataChannel</text>
        </g>

        <!-- Right: Executive Verification Crest & Sign-Off -->
        <g transform="translate(680, 0)">
          <rect width="920" height="610" rx="18" fill="${pal.cardBg}" stroke="${pal.accentEmerald}" stroke-width="2" filter="${pal.glowFilter}" />
          
          <g transform="translate(60, 60)">
            <text x="0" y="30" font-family="monospace" font-size="13" font-weight="700" fill="${pal.accentEmerald}">PRODUCTION READINESS VERIFICATION</text>
            <text x="0" y="90" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="${pal.textPrimary}">Architecture Certified</text>
            <text x="0" y="130" font-family="system-ui, sans-serif" font-size="18" fill="${pal.textSecondary}">Audience consensus reached with 98.4% stakeholder approval.</text>

            <!-- 3 Feature Verification Points -->
            <g transform="translate(0, 180)">
              <circle cx="16" cy="16" r="14" fill="${pal.cardBorder}" />
              <polyline points="10,16 14,20 22,12" fill="none" stroke="${pal.accentEmerald}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              <text x="44" y="22" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="${pal.textPrimary}">Zero Data Exfiltration Guarantee (100% In-Memory)</text>

              <circle cx="16" cy="76" r="14" fill="${pal.cardBorder}" />
              <polyline points="10,76 14,80 22,72" fill="none" stroke="${pal.accentEmerald}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              <text x="44" y="82" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="${pal.textPrimary}">Complete 2D/3D Spatial & Python Runtime Interoperability</text>

              <circle cx="16" cy="136" r="14" fill="${pal.cardBorder}" />
              <polyline points="10,136 14,140 22,132" fill="none" stroke="${pal.accentEmerald}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              <text x="44" y="142" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="${pal.textPrimary}">Single-File Standalone Portability with Multi-Lingual Subtitles</text>
            </g>

            <!-- Closing Crest Box -->
            <g transform="translate(0, 360)">
              <rect width="800" height="90" rx="14" fill="${pal.cardBorder}" opacity="0.3" />
              <text x="30" y="40" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="${pal.accentCyan}">${title}</text>
              <text x="30" y="68" font-family="monospace" font-size="13" fill="${pal.textMuted}">DEPLOYMENT WINDOW: IMMEDIATE • EXECUTIVE SIGN-OFF CONFIRMED</text>
            </g>
          </g>
        </g>
      </g>
    `;
  }

  /**
   * Generates a single slide's full standalone SVG document
   * @param {number} stageNumber 1 to 6
   * @param {Object} manifest
   * @param {string} theme 'oled' | 'light' | 'transparent'
   * @returns {string} XML SVG string
   */
  generateSlideSVG(stageNumber = 1, manifest = null, theme = 'oled') {
    const pal = this.getThemePalette(theme);
    const defs = this.getDefs(theme, pal);

    let stageContent = '';
    switch (Number(stageNumber)) {
      case 1:
        stageContent = this.generateSlide1(manifest, pal, theme);
        break;
      case 2:
        stageContent = this.generateSlide2(manifest, pal, theme);
        break;
      case 3:
        stageContent = this.generateSlide3(manifest, pal, theme);
        break;
      case 4:
        stageContent = this.generateSlide4(manifest, pal, theme);
        break;
      case 5:
        stageContent = this.generateSlide5(manifest, pal, theme);
        break;
      case 6:
        stageContent = this.generateSlide6(manifest, pal, theme);
        break;
      default:
        stageContent = this.generateSlide1(manifest, pal, theme);
    }

    const bgRect = theme === 'transparent'
      ? ''
      : `<rect width="1920" height="1080" fill="${pal.bg}" />
         <rect width="1920" height="1080" fill="url(#radialGlow)" />
         <rect width="1920" height="1080" fill="url(#dotGrid)" opacity="${theme === 'light' ? '0.3' : '0.4'}" />`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  ${defs}
  <!-- Background -->
  ${bgRect}

  <!-- Header Slide Tag -->
  <g transform="translate(160, 60)">
    <text font-family="monospace" font-size="12" font-weight="700" fill="${pal.textMuted}" letter-spacing="3">APEXFLOW OS // EXECUTIVE KEYNOTE DECK // SLIDE 0${stageNumber} OF 06</text>
  </g>

  <!-- Slide Content -->
  ${stageContent}

  <!-- Footer Watermark & Timestamp -->
  <g transform="translate(160, 1020)">
    <text font-family="monospace" font-size="11" fill="${pal.textMuted}">RENDERED IN VECTOR 4K // ZERO-UPLOAD ENCLAVE // APEXFLOW PLATFORM v1.0.0</text>
    <text x="1600" y="0" font-family="monospace" font-size="11" fill="${pal.textMuted}" text-anchor="end">CONFIDENTIAL // BOARD-LEVEL REVIEW</text>
  </g>
</svg>`;
  }

  /**
   * Triggers download of an individual slide SVG
   */
  downloadSlideSVG(stageNumber = 1, manifest = null, theme = 'oled') {
    const svgCode = this.generateSlideSVG(stageNumber, manifest, theme);
    const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (manifest?.name || 'APEXFLOW_OS').replace(/[^a-zA-Z0-9_-]/g, '_');
    a.href = url;
    a.download = `${safeName}_Slide_0${stageNumber}_${theme}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    soundEngine.playSuccess();
    return true;
  }

  /**
   * Copies slide SVG text directly to clipboard for Figma / Illustrator
   */
  async copySlideSVGToClipboard(stageNumber = 1, manifest = null, theme = 'oled') {
    const svgCode = this.generateSlideSVG(stageNumber, manifest, theme);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(svgCode);
      soundEngine.playSuccess();
      return true;
    }
    return false;
  }

  /**
   * Generates and downloads a self-contained multi-slide HTML Vector Keynote Deck
   * Includes all 6 slides embedded as scalable vector SVGs with keyboard navigation
   */
  downloadFullDeckPackage(manifest = null, theme = 'oled') {
    const slides = [1, 2, 3, 4, 5, 6].map(num => this.generateSlideSVG(num, manifest, theme));
    const safeName = (manifest?.name || 'APEXFLOW_OS').replace(/[^a-zA-Z0-9_-]/g, '_');
    const pal = this.getThemePalette(theme);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${manifest?.name || 'APEXFLOW OS'} — Executive Vector Presentation Deck</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: ${pal.bg === 'none' ? '#04060A' : pal.bg};
      color: ${pal.textPrimary};
      font-family: system-ui, -apple-system, sans-serif;
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .deck-nav {
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(7, 10, 18, 0.85);
      border: 1px solid rgba(0, 240, 255, 0.25);
      backdrop-filter: blur(16px);
      padding: 8px 18px;
      border-radius: 999px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .nav-btn {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.15);
      color: #fff;
      padding: 6px 14px;
      border-radius: 999px;
      cursor: pointer;
      font-family: monospace;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    .nav-btn:hover {
      background: rgba(0, 240, 255, 0.2);
      border-color: #00F0FF;
    }
    .slide-indicator {
      font-family: monospace;
      font-size: 13px;
      font-weight: 700;
      color: #00F0FF;
      min-width: 90px;
      text-align: center;
    }
    .slide-viewport {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }
    .slide-container {
      width: 100%;
      max-width: 1720px;
      aspect-ratio: 16/9;
      display: none;
      filter: drop-shadow(0 20px 50px rgba(0,0,0,0.6));
    }
    .slide-container.active {
      display: block;
      animation: fadeIn 0.3s ease;
    }
    .slide-container svg {
      width: 100%;
      height: 100%;
      display: block;
      border-radius: 12px;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }
    @media print {
      .deck-nav { display: none; }
      body { overflow: visible; height: auto; }
      .slide-container { display: block !important; page-break-after: always; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="deck-nav">
    <button class="nav-btn" onclick="prevSlide()" style="display: inline-flex; align-items: center; gap: 5px;">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
      <span>Prev</span>
    </button>
    <span class="slide-indicator" id="slideCount">Slide 1 / 6</span>
    <button class="nav-btn" onclick="nextSlide()" style="display: inline-flex; align-items: center; gap: 5px;">
      <span>Next</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
    </button>
    <button class="nav-btn" onclick="window.print()" style="display: inline-flex; align-items: center; gap: 6px;">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
      <span>Print / PDF</span>
    </button>
  </div>

  <div class="slide-viewport">
    ${slides.map((svg, idx) => `
      <div class="slide-container ${idx === 0 ? 'active' : ''}" id="slide-${idx + 1}">
        ${svg.replace(/<\?xml.*?\?>/, '')}
      </div>
    `).join('')}
  </div>

  <script>
    let current = 1;
    const total = 6;
    function showSlide(num) {
      if (num < 1) num = 1;
      if (num > total) num = total;
      current = num;
      document.querySelectorAll('.slide-container').forEach((el, i) => {
        el.classList.toggle('active', (i + 1) === current);
      });
      document.getElementById('slideCount').textContent = 'Slide ' + current + ' / ' + total;
    }
    function nextSlide() { showSlide(current + 1); }
    function prevSlide() { showSlide(current - 1); }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') nextSlide();
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') prevSlide();
      if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
      }
    });
  </script>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}_Vector_Keynote_Deck_${theme}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    soundEngine.playSuccess();
    return true;
  }
}

export const vectorExporter = new VectorSlideExporter();
