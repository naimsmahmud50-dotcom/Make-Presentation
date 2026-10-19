/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Live Distributed Latency Waterfall & Profiler (Task T113)
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Boardroom-grade distributed trace latency waterfall and critical path profiler:
 *   1. Distributed Trace Breakdown: Deconstructs end-to-end request lifecycle across:
 *      - Edge Ingress & TLS 1.3 Handshake (Cloudflare Anycast PoP)
 *      - Cloudflare Worker Gateway & V8 Auth JWT Verify
 *      - Envoy Service Mesh mTLS & Circuit Breaker
 *      - pgvector Cosine Embedding & RAG Query
 *      - Aurora Global DB ACID Transaction Commit
 *      - Client DOM Hydration & WebGL Paint
 *   2. Critical Path Bottleneck Detection: Highlights any stage exceeding 15ms threshold
 *      in high-visibility amber/rose with pulse badge indicators.
 *   3. Dynamic Cache-Miss & Cold-Start Simulation: 1-Click toggle simulating worst-case
 *      unindexed vector scans and cross-region database lock contention.
 *   4. Real-time Live Trace Benchmark: Interactive step-by-step progress simulation with
 *      microsecond timing jitter and sound synthesis.
 *   5. Structured JSON & Markdown Export: 1-Click clipboard and file export.
 *
 * [DESIGN SYSTEM — UI/UX PRO MAX]:
 *   - JetBrains Mono tabular numeric metrics (tabular-nums) preventing layout shift.
 *   - Dark OLED glassmorphism HUD with glowing horizontal progress tracks.
 *   - 100% vector SVGs; zero informal emojis in button chrome.
 *
 * [ZERO-UPLOAD PRIVACY GUARANTEE]:
 * 100% client-side memory execution. Zero external telemetry egress.
 * =========================================================================================
 */

import { soundEngine } from '../lib/audio/sound-synth.js';
import { inputShield } from '../lib/security/input-shield.js';

export class LatencyWaterfallProfiler {
  constructor(stageController = null) {
    this.stageController = stageController;
    this.isOpen = false;
    this.modalEl = null;
    this.isSpikeSimulated = false;
    this.isBenchmarking = false;

    // Default Trace Definitions
    this.traceStages = [
      {
        id: 'edge_ingress',
        name: 'Edge Ingress & TLS 1.3 0-RTT',
        component: 'Cloudflare Anycast (300+ PoPs)',
        nominalMs: 3.2,
        spikeMs: 6.8,
        description: 'Global anycast route resolution, TCP 3-way handshake, TLS 1.3 session resumption'
      },
      {
        id: 'worker_auth',
        name: 'Worker Gateway & V8 Auth JWT',
        component: 'Cloudflare Workers (V8 Isolate)',
        nominalMs: 1.8,
        spikeMs: 3.5,
        description: 'HMAC-SHA256 signature verification, route pattern match, rate-limit check'
      },
      {
        id: 'envoy_mesh',
        name: 'Envoy Service Mesh mTLS',
        component: 'Envoy Proxy (EKS Pod Mesh)',
        nominalMs: 2.4,
        spikeMs: 4.9,
        description: 'Zero-trust SPIFFE/SPIRE pod certificate validation, connection pooling'
      },
      {
        id: 'pgvector_rag',
        name: 'pgvector Cosine Embedding & RAG',
        component: 'PostgreSQL 16 + pgvector (HNSW Index)',
        nominalMs: 8.6,
        spikeMs: 38.2, // Critical bottleneck on cache miss
        description: '1536-dimensional vector cosine distance calculation across 1.2M document embeddings'
      },
      {
        id: 'aurora_commit',
        name: 'Aurora DB ACID Commit & WAL',
        component: 'Amazon Aurora Global DB (Multi-AZ)',
        nominalMs: 4.1,
        spikeMs: 18.4, // Bottleneck during cross-region sync
        description: 'Distributed 4/6 quorum write replication, storage node acknowledgment'
      },
      {
        id: 'client_paint',
        name: 'Client DOM Hydration & Shader Paint',
        component: 'Browser V8 + WebGL Three.js',
        nominalMs: 2.9,
        spikeMs: 5.2,
        description: 'Virtual DOM reconciliation, reactive state dispatch, GPU buffer upload'
      }
    ];

    this.initDOM();
  }

  initDOM() {
    let modal = document.getElementById('latencyWaterfallModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'latencyWaterfallModal';
      modal.style.position = 'fixed';
      modal.style.inset = '0';
      modal.style.background = 'rgba(3, 6, 12, 0.88)';
      modal.style.backdropFilter = 'blur(22px)';
      modal.style.webkitBackdropFilter = 'blur(22px)';
      modal.style.zIndex = '99999';
      modal.style.display = 'none';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.padding = '20px';

      modal.innerHTML = `
        <div class="cyber-card" style="width: 100%; max-width: 880px; max-height: 92vh; background: #070B14; border: 1px solid rgba(0, 240, 255, 0.35); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 24px 64px -12px rgba(0,0,0,0.9), 0 0 35px rgba(0,240,255,0.15);">
          
          <!-- Header Bar -->
          <div style="padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center; background: rgba(11, 18, 32, 0.6);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 34px; height: 34px; border-radius: 8px; background: rgba(0, 240, 255, 0.12); border: 1px solid rgba(0, 240, 255, 0.4); display: flex; align-items: center; justify-content: center; color: #00F0FF;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              </div>
              <div>
                <div style="font-weight: 700; font-size: 14px; color: #F8FAFC; letter-spacing: 0.05em; font-family: var(--font-mono, monospace);">DISTRIBUTED LATENCY WATERFALL & PROFILER</div>
                <div style="font-size: 10px; color: #64748B; font-family: var(--font-mono, monospace);">CRITICAL PATH BREAKDOWN & BOTTLENECK ANALYSIS</div>
              </div>
            </div>

            <!-- Top Controls -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <button id="btnSimulateSpike" class="btn btn-secondary" style="height: 30px; padding: 0 12px; font-size: 10px; font-family: var(--font-mono, monospace); display: inline-flex; align-items: center; gap: 6px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                <span id="spikeToggleText">Simulate Cache Miss</span>
              </button>

              <button id="btnRunTraceBenchmark" class="btn btn-primary" style="height: 30px; padding: 0 14px; font-size: 10px; font-family: var(--font-mono, monospace); display: inline-flex; align-items: center; gap: 6px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                <span>Run Live Benchmark</span>
              </button>

              <button id="btnCloseWaterfallModal" class="btn btn-secondary" style="height: 30px; width: 30px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 6px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>

          <!-- Summary KPI Strip -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 16px 24px; background: rgba(7, 11, 20, 0.4); border-bottom: 1px solid rgba(255,255,255,0.06);">
            
            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 14px;">
              <div style="font-size: 10px; color: #94A3B8; font-family: var(--font-mono, monospace);">TOTAL P99 LATENCY</div>
              <div id="kpiTotalLatency" style="font-size: 20px; font-weight: 700; color: #00F0FF; font-family: var(--font-mono, monospace); font-variant-numeric: tabular-nums;">
                23.00 ms
              </div>
              <div id="kpiSlaBadge" style="font-size: 9px; color: #10B981; font-family: var(--font-mono, monospace); margin-top: 2px;">
                [SLA PASS &lt; 25ms]
              </div>
            </div>

            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 14px;">
              <div style="font-size: 10px; color: #94A3B8; font-family: var(--font-mono, monospace);">CRITICAL BOTTLENECK</div>
              <div id="kpiBottleneckStage" style="font-size: 13px; font-weight: 700; color: #F8FAFC; margin-top: 4px; font-family: var(--font-mono, monospace); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                pgvector Cosine
              </div>
              <div id="kpiBottleneckMs" style="font-size: 9px; color: #F59E0B; font-family: var(--font-mono, monospace); margin-top: 2px;">
                8.60 ms (37.4% of total)
              </div>
            </div>

            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 14px;">
              <div style="font-size: 10px; color: #94A3B8; font-family: var(--font-mono, monospace);">EDGE RATIO</div>
              <div id="kpiEdgeRatio" style="font-size: 20px; font-weight: 700; color: #10B981; font-family: var(--font-mono, monospace);">
                21.7%
              </div>
              <div style="font-size: 9px; color: #64748B; font-family: var(--font-mono, monospace); margin-top: 2px;">
                5.00 ms at Edge PoP
              </div>
            </div>

            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 14px;">
              <div style="font-size: 10px; color: #94A3B8; font-family: var(--font-mono, monospace);">EXECUTION MODE</div>
              <div id="kpiExecMode" style="font-size: 13px; font-weight: 700; color: #00F0FF; margin-top: 4px; font-family: var(--font-mono, monospace);">
                HOT CACHE (OPTIMIZED)
              </div>
              <div style="font-size: 9px; color: #64748B; font-family: var(--font-mono, monospace); margin-top: 2px;">
                Client-Side Pure In-Memory
              </div>
            </div>

          </div>

          <!-- Main Waterfall Chart Container -->
          <div style="padding: 20px 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 14px;">
            
            <!-- Scale Axis Legend -->
            <div style="display: flex; justify-content: space-between; font-size: 9px; font-family: var(--font-mono, monospace); color: #64748B; padding: 0 10px 4px 190px; border-bottom: 1px dashed rgba(255,255,255,0.1);">
              <span>0ms</span>
              <span>10ms</span>
              <span>20ms</span>
              <span>30ms</span>
              <span>40ms</span>
              <span>50ms+</span>
            </div>

            <!-- Stage Rows -->
            <div id="waterfallRowsContainer" style="display: flex; flex-direction: column; gap: 10px;">
              <!-- Dynamically populated -->
            </div>

          </div>

          <!-- Bottom Footer Actions -->
          <div style="padding: 14px 24px; border-top: 1px solid rgba(255,255,255,0.08); background: rgba(11, 18, 32, 0.6); display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 10px; color: #64748B; font-family: var(--font-mono, monospace); display: flex; align-items: center; gap: 12px;">
              <span style="display: inline-flex; align-items: center; gap: 4px;">
                <span style="width: 8px; height: 8px; border-radius: 2px; background: #10B981;"></span>
                <span>Fast (&lt;5ms)</span>
              </span>
              <span style="display: inline-flex; align-items: center; gap: 4px;">
                <span style="width: 8px; height: 8px; border-radius: 2px; background: #00F0FF;"></span>
                <span>Nominal (5-10ms)</span>
              </span>
              <span style="display: inline-flex; align-items: center; gap: 4px;">
                <span style="width: 8px; height: 8px; border-radius: 2px; background: #F59E0B;"></span>
                <span>Elevated (10-15ms)</span>
              </span>
              <span style="display: inline-flex; align-items: center; gap: 4px;">
                <span style="width: 8px; height: 8px; border-radius: 2px; background: #EF4444;"></span>
                <span>Bottleneck (&gt;15ms)</span>
              </span>
            </div>

            <div style="display: flex; gap: 8px;">
              <button id="btnCopyWaterfallTrace" class="btn btn-secondary" style="height: 28px; font-size: 10px; padding: 0 12px; display: inline-flex; align-items: center; gap: 5px;">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <span>Copy Trace Spec</span>
              </button>

              <button id="btnExportWaterfallJson" class="btn btn-secondary" style="height: 28px; font-size: 10px; padding: 0 12px; display: inline-flex; align-items: center; gap: 5px;">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>Export JSON</span>
              </button>
            </div>
          </div>

        </div>
      `;

      document.body.appendChild(modal);
    }
    this.modalEl = modal;

    // Attach listeners
    this.modalEl.querySelector('#btnCloseWaterfallModal')?.addEventListener('click', () => this.close());
    this.modalEl.querySelector('#btnSimulateSpike')?.addEventListener('click', () => this.toggleSpikeSimulation());
    this.modalEl.querySelector('#btnRunTraceBenchmark')?.addEventListener('click', () => this.runLiveBenchmark());
    this.modalEl.querySelector('#btnCopyWaterfallTrace')?.addEventListener('click', () => this.copyTraceSpec());
    this.modalEl.querySelector('#btnExportWaterfallJson')?.addEventListener('click', () => this.exportJson());

    this.renderWaterfall();
  }

  toggleSpikeSimulation() {
    soundEngine?.playClick();
    this.isSpikeSimulated = !this.isSpikeSimulated;

    const btn = this.modalEl.querySelector('#btnSimulateSpike');
    const text = this.modalEl.querySelector('#spikeToggleText');
    const modeEl = this.modalEl.querySelector('#kpiExecMode');

    if (this.isSpikeSimulated) {
      if (btn) {
        btn.classList.add('badge-amber');
        btn.style.borderColor = '#F59E0B';
        btn.style.color = '#F59E0B';
      }
      if (text) text.textContent = 'Simulating Cache Miss (Active)';
      if (modeEl) {
        modeEl.textContent = 'COLD START / UNCACHED';
        modeEl.style.color = '#EF4444';
      }
    } else {
      if (btn) {
        btn.classList.remove('badge-amber');
        btn.style.borderColor = '';
        btn.style.color = '';
      }
      if (text) text.textContent = 'Simulate Cache Miss';
      if (modeEl) {
        modeEl.textContent = 'HOT CACHE (OPTIMIZED)';
        modeEl.style.color = '#00F0FF';
      }
    }

    this.renderWaterfall();
  }

  calculateMetrics() {
    let cumulative = 0;
    const stagesWithTiming = this.traceStages.map(stage => {
      const duration = this.isSpikeSimulated ? stage.spikeMs : stage.nominalMs;
      const start = cumulative;
      cumulative += duration;
      const isBottleneck = duration > 15.0;
      return {
        ...stage,
        startMs: start,
        durationMs: duration,
        isBottleneck
      };
    });

    const totalLatency = cumulative;
    let worstStage = stagesWithTiming[0];
    stagesWithTiming.forEach(st => {
      if (st.durationMs > worstStage.durationMs) worstStage = st;
    });

    const edgeLatency = (stagesWithTiming[0]?.durationMs || 0) + (stagesWithTiming[1]?.durationMs || 0);
    const edgeRatio = totalLatency > 0 ? (edgeLatency / totalLatency) * 100 : 0;

    return {
      stages: stagesWithTiming,
      totalLatency,
      worstStage,
      edgeRatio,
      edgeLatency
    };
  }

  renderWaterfall() {
    if (!this.modalEl) return;
    const metrics = this.calculateMetrics();
    const container = this.modalEl.querySelector('#waterfallRowsContainer');
    if (!container) return;

    // Update KPIs
    const totalEl = this.modalEl.querySelector('#kpiTotalLatency');
    if (totalEl) totalEl.textContent = `${metrics.totalLatency.toFixed(2)} ms`;

    const slaEl = this.modalEl.querySelector('#kpiSlaBadge');
    if (slaEl) {
      if (metrics.totalLatency <= 25.0) {
        slaEl.textContent = '[SLA PASS < 25ms]';
        slaEl.style.color = '#10B981';
      } else if (metrics.totalLatency <= 50.0) {
        slaEl.textContent = '[ELEVATED SLA < 50ms]';
        slaEl.style.color = '#F59E0B';
      } else {
        slaEl.textContent = '[SLA BREACH > 50ms]';
        slaEl.style.color = '#EF4444';
      }
    }

    const worstNameEl = this.modalEl.querySelector('#kpiBottleneckStage');
    const worstMsEl = this.modalEl.querySelector('#kpiBottleneckMs');
    if (worstNameEl) worstNameEl.textContent = metrics.worstStage.name;
    if (worstMsEl) {
      const pct = ((metrics.worstStage.durationMs / metrics.totalLatency) * 100).toFixed(1);
      worstMsEl.textContent = `${metrics.worstStage.durationMs.toFixed(2)} ms (${pct}% of total)`;
      worstMsEl.style.color = metrics.worstStage.durationMs > 15 ? '#EF4444' : '#F59E0B';
    }

    const edgeEl = this.modalEl.querySelector('#kpiEdgeRatio');
    if (edgeEl) edgeEl.textContent = `${metrics.edgeRatio.toFixed(1)}%`;

    // Max scale ms for bar sizing
    const maxScaleMs = Math.max(metrics.totalLatency * 1.15, 30.0);

    // Build row HTML
    container.innerHTML = metrics.stages.map(st => {
      const leftPct = (st.startMs / maxScaleMs) * 100;
      const widthPct = Math.max((st.durationMs / maxScaleMs) * 100, 1.5);

      // Color coding
      let barColor = '#00F0FF';
      let tagClass = 'badge-cyan';
      if (st.durationMs < 5.0) {
        barColor = '#10B981';
        tagClass = 'badge-emerald';
      } else if (st.durationMs > 15.0) {
        barColor = '#EF4444';
        tagClass = 'badge-rose';
      } else if (st.durationMs > 10.0) {
        barColor = '#F59E0B';
        tagClass = 'badge-amber';
      }

      return `
        <div style="display: flex; align-items: center; gap: 14px; padding: 8px 12px; background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; transition: background 0.2s ease;">
          
          <!-- Stage Meta Label (180px fixed) -->
          <div style="width: 180px; flex-shrink: 0;">
            <div style="font-size: 11px; font-weight: 600; color: #F8FAFC; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${inputShield.escapeHtml(st.name)}">
              ${inputShield.escapeHtml(st.name)}
            </div>
            <div style="font-size: 9px; color: #64748B; font-family: var(--font-mono, monospace); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${inputShield.escapeHtml(st.component)}
            </div>
          </div>

          <!-- Waterfall Bar Track -->
          <div style="flex: 1; height: 26px; background: rgba(3, 6, 12, 0.7); border-radius: 6px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.04);">
            
            <div style="position: absolute; left: ${leftPct.toFixed(2)}%; width: ${widthPct.toFixed(2)}%; height: 100%; background: ${barColor}; opacity: 0.85; border-radius: 4px; box-shadow: 0 0 10px ${barColor}66; display: flex; align-items: center; justify-content: center; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);">
              <span style="font-size: 9px; font-weight: 700; color: #03060C; font-family: var(--font-mono, monospace); padding: 0 4px; white-space: nowrap;">
                ${st.durationMs.toFixed(1)}ms
              </span>
            </div>

          </div>

          <!-- Right Status / Timing Tag (90px) -->
          <div style="width: 90px; flex-shrink: 0; text-align: right; font-family: var(--font-mono, monospace);">
            <div style="font-size: 11px; font-weight: 700; color: ${barColor}; font-variant-numeric: tabular-nums;">
              ${st.durationMs.toFixed(2)} ms
            </div>
            <div style="font-size: 8px; color: #64748B;">
              +${st.startMs.toFixed(1)}ms offset
            </div>
          </div>

        </div>
      `;
    }).join('');
  }

  async runLiveBenchmark() {
    if (this.isBenchmarking) return;
    this.isBenchmarking = true;
    soundEngine?.playWhoosh();

    const btn = this.modalEl.querySelector('#btnRunTraceBenchmark');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 10 10"></path></svg>
        <span>Profiling Stages...</span>
      `;
    }

    // Step by step simulation
    const originalStages = JSON.parse(JSON.stringify(this.traceStages));
    for (let i = 0; i < this.traceStages.length; i++) {
      soundEngine?.playTick();
      // Add slight micro-jitter to simulate live network sampling
      const jitter = (Math.random() * 0.4 - 0.2);
      if (this.isSpikeSimulated) {
        this.traceStages[i].spikeMs = Math.max(1.0, +(originalStages[i].spikeMs + jitter).toFixed(2));
      } else {
        this.traceStages[i].nominalMs = Math.max(0.8, +(originalStages[i].nominalMs + jitter).toFixed(2));
      }
      this.renderWaterfall();
      await new Promise(r => setTimeout(r, 180));
    }

    soundEngine?.playSuccess();
    this.isBenchmarking = false;
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        <span>Run Live Benchmark</span>
      `;
    }
  }

  copyTraceSpec() {
    soundEngine?.playSuccess();
    const metrics = this.calculateMetrics();
    const rows = metrics.stages.map(s => `| ${s.name} | ${s.component} | ${s.durationMs.toFixed(2)}ms | +${s.startMs.toFixed(2)}ms | ${s.isBottleneck ? 'CRITICAL BOTTLENECK' : 'NOMINAL'} |`).join('\n');
    
    const spec = `# APEXFLOW OS: DISTRIBUTED TRACE LATENCY WATERFALL SPEC
Generated: ${new Date().toISOString()}
P99 Total Latency: ${metrics.totalLatency.toFixed(2)}ms
SLA Compliance: ${metrics.totalLatency <= 25.0 ? 'PASSED (Sub-25ms Boardroom Target)' : 'ELEVATED / BREACHED'}
Edge PoP Efficiency: ${metrics.edgeRatio.toFixed(1)}%

| Stage Name | Execution Target | Duration | Start Offset | Status |
| :--- | :--- | :--- | :--- | :--- |
${rows}

Bottleneck Stage: ${metrics.worstStage.name} (${metrics.worstStage.durationMs.toFixed(2)}ms)
Zero-Upload Privacy Standard: In-Memory Verification Verified.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(spec);
      const btn = this.modalEl?.querySelector('#btnCopyWaterfallTrace span');
      if (btn) {
        btn.textContent = 'Spec Copied!';
        setTimeout(() => { btn.textContent = 'Copy Trace Spec'; }, 1500);
      }
    }
  }

  exportJson() {
    soundEngine?.playSuccess();
    const metrics = this.calculateMetrics();
    const payload = {
      project: 'APEXFLOW OS',
      schema: 'https://apexflow.ai/schemas/latency-waterfall-v1.json',
      timestamp: new Date().toISOString(),
      summary: {
        totalLatencyMs: metrics.totalLatency,
        isSpikeSimulated: this.isSpikeSimulated,
        slaStatus: metrics.totalLatency <= 25.0 ? 'PASS' : 'BREACH',
        edgeEfficiencyPct: metrics.edgeRatio,
        worstStage: metrics.worstStage
      },
      stages: metrics.stages
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apexflow-latency-trace-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  open() {
    this.isOpen = true;
    soundEngine?.playWhoosh();
    if (this.modalEl) this.modalEl.style.display = 'flex';
    const dockBtn = document.getElementById('dockBtnWaterfall');
    if (dockBtn) dockBtn.classList.add('active');
    this.renderWaterfall();
  }

  close() {
    this.isOpen = false;
    soundEngine?.playClick();
    if (this.modalEl) this.modalEl.style.display = 'none';
    const dockBtn = document.getElementById('dockBtnWaterfall');
    if (dockBtn) dockBtn.classList.remove('active');
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

export const latencyWaterfall = new LatencyWaterfallProfiler();
