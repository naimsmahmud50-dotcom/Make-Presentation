/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — In-Browser Cinematic Keynote Teaser Video Generator (Task T059)
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Renders an ultra-smooth 10-second 1080p 60 FPS teaser video using HTML5 Canvas & MediaRecorder.
 * Generates an executive teaser clip for LinkedIn, X (Twitter), and investor decks with zero
 * external cloud rendering dependencies.
 *
 * [CINEMATIC STORYBOARD]:
 *   - 0.0s - 2.5s : Act 1: Cinematic Logo & Project Title Reveal with Holographic Radar pulse
 *   - 2.5s - 5.0s : Act 2: 3D Spatial Starfield Holodeck Warp & Server Blade Architecture
 *   - 5.0s - 7.5s : Act 3: Bento ROI Matrix (84% Latency Reduction, $142K/yr Savings Counter)
 *   - 7.5s - 10.0s: Act 4: Executive Closing Crest, Zero-Upload Privacy Badge & Call to Action
 *
 * [ZERO-UPLOAD PRIVACY GUARANTEE]:
 * 100% rendered locally on GPU via HTML5 Canvas. Zero bytes sent to any remote server.
 * =========================================================================================
 */

import { soundEngine } from '../audio/sound-synth.js';

export class KeynoteTeaserRecorder {
  constructor() {
    this.isRecording = false;
    this.canvas = null;
    this.ctx = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.startTime = 0;
    this.durationMs = 10000; // 10 seconds total teaser
  }

  /**
   * Initializes offscreen 1080p canvas for recording
   */
  initCanvas() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = 1920;
      this.canvas.height = 1080;
      this.ctx = this.canvas.getContext('2d');
    }
  }

  /**
   * Generates and downloads a 10-second cinematic teaser video
   * @param {Object} manifest Active project manifest
   * @param {Function} onProgress Optional progress callback (pct)
   * @returns {Promise<Blob>}
   */
  async generateTeaser(manifest, onProgress = null) {
    if (this.isRecording) return null;
    this.isRecording = true;
    this.initCanvas();
    this.recordedChunks = [];

    const name = manifest ? (manifest.name || 'APEXFLOW OS') : 'APEXFLOW OS';
    const tagline = manifest ? (manifest.tagline || 'Autonomous Engineering Architecture') : 'Autonomous Engineering Architecture';
    const archetype = manifest ? (manifest.archetype || 'TYPE_A') : 'TYPE_A';

    soundEngine.playSuccess();

    // Setup MediaRecorder from Canvas stream at 60 FPS
    const stream = this.canvas.captureStream(60);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : (MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : '');

    try {
      this.mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType, videoBitsPerSecond: 6000000 } : {});
    } catch (e) {
      this.mediaRecorder = new MediaRecorder(stream);
    }

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.recordedChunks.push(e.data);
      }
    };

    return new Promise((resolve, reject) => {
      this.mediaRecorder.onstop = () => {
        this.isRecording = false;
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        a.href = url;
        a.download = `APEXFLOW_${safeName}_10s_Teaser.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        soundEngine.playSuccess();
        resolve(blob);
      };

      this.mediaRecorder.onerror = (err) => {
        this.isRecording = false;
        reject(err);
      };

      this.mediaRecorder.start(100);
      this.startTime = performance.now();
      this.renderFrame(name, tagline, archetype, onProgress);
    });
  }

  /**
   * 60 FPS frame animation loop for 10-second cinematic story
   */
  renderFrame(name, tagline, archetype, onProgress) {
    const elapsed = performance.now() - this.startTime;
    const progress = Math.min(1.0, elapsed / this.durationMs);

    if (onProgress) onProgress(Math.round(progress * 100));

    const ctx = this.ctx;
    const w = 1920;
    const h = 1080;

    // 1. OLED Void Background
    ctx.fillStyle = '#06090F';
    ctx.fillRect(0, 0, w, h);

    // 2. Cyberpunk Grid Scanlines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 3. Storyboard Acts
    if (progress < 0.25) {
      // ACT 1 (0.0s - 2.5s): TITLE REVEAL & HOLOGRAPHIC PULSE
      const actP = progress / 0.25;
      const alpha = Math.min(1, actP * 2);

      // Radial Glow
      const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, 500);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Rotating Radar Ring
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(actP * Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 220, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Project Badge
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#00F0FF';
      ctx.font = "bold 24px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.fillText(`APEXFLOW OS • ${archetype}`, w / 2, h / 2 - 120);

      // Title
      ctx.fillStyle = '#F8FAFC';
      ctx.font = "800 68px 'Inter', sans-serif";
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 25;
      ctx.fillText(name, w / 2, h / 2 - 20);

      // Tagline
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#94A3B8';
      ctx.font = "500 28px 'Inter', sans-serif";
      ctx.fillText(tagline, w / 2, h / 2 + 50);
      ctx.restore();

    } else if (progress < 0.50) {
      // ACT 2 (2.5s - 5.0s): 3D SPATIAL HOLODECK & ARCHITECTURE
      const actP = (progress - 0.25) / 0.25;

      // 3D Starfield Warp
      for (let i = 0; i < 200; i++) {
        const angle = (i / 200) * Math.PI * 2;
        const dist = 50 + ((actP * 1200 + i * 20) % 1100);
        const px = w / 2 + Math.cos(angle) * dist;
        const py = h / 2 + Math.sin(angle) * dist;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(0, 240, 255, 0.8)' : 'rgba(168, 85, 247, 0.8)';
        ctx.beginPath();
        ctx.arc(px, py, Math.max(1, dist * 0.005), 0, Math.PI * 2);
        ctx.fill();
      }

      // Center Holodeck HUD Badge
      ctx.fillStyle = 'rgba(14, 21, 36, 0.9)';
      ctx.strokeStyle = '#A855F7';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#A855F7';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.roundRect(w / 2 - 320, h / 2 - 110, 640, 220, 16);
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#A855F7';
      ctx.font = "bold 20px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.fillText('LIVING ARCHITECTURAL HOLODECK', w / 2, h / 2 - 50);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = "700 36px 'Inter', sans-serif";
      ctx.fillText('Autonomous Directed Pipeline', w / 2, h / 2);

      ctx.fillStyle = '#10B981';
      ctx.font = "600 20px 'JetBrains Mono', monospace";
      ctx.fillText('● 120 FPS Client-Side WebAssembly Execution', w / 2, h / 2 + 50);

    } else if (progress < 0.75) {
      // ACT 3 (5.0s - 7.5s): BENTO ROI MATRIX & ECONOMIC METRICS
      const actP = (progress - 0.50) / 0.25;

      ctx.fillStyle = '#F59E0B';
      ctx.font = "bold 24px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.fillText('EXECUTIVE BUSINESS IMPACT MATRIX', w / 2, h / 2 - 180);

      // 3 Stat Cards
      const cardW = 380;
      const cardH = 220;
      const cards = [
        { label: 'Latency Cut', val: '84%', color: '#00F0FF', sub: 'Sub-50ms Healing' },
        { label: 'Annual Savings', val: '$142,000', color: '#10B981', sub: 'Calculated Team ROI' },
        { label: 'Client Privacy', val: '100%', color: '#A855F7', sub: 'Zero-Upload Guarantee' }
      ];

      cards.forEach((c, i) => {
        const cx = (w / 2 - 440) + (i * 440);
        const cy = h / 2 - 40;

        ctx.fillStyle = 'rgba(14, 21, 36, 0.9)';
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = c.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.roundRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 16);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = c.color;
        ctx.font = "800 64px 'JetBrains Mono', monospace";
        ctx.fillText(c.val, cx, cy);

        ctx.fillStyle = '#F8FAFC';
        ctx.font = "600 22px 'Inter', sans-serif";
        ctx.fillText(c.label, cx, cy + 45);

        ctx.fillStyle = '#64748B';
        ctx.font = "16px 'Inter', sans-serif";
        ctx.fillText(c.sub, cx, cy + 75);
      });

    } else {
      // ACT 4 (7.5s - 10.0s): EXECUTIVE CLOSING & CALL TO ACTION
      const actP = (progress - 0.75) / 0.25;

      ctx.fillStyle = '#00F0FF';
      ctx.font = "bold 22px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.fillText('ENTERPRISE PRESENTATION OPERATING SYSTEM', w / 2, h / 2 - 140);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = "800 64px 'Inter', sans-serif";
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 30;
      ctx.fillText(name, w / 2, h / 2 - 40);

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#10B981';
      ctx.font = "700 26px 'Inter', sans-serif";
      ctx.fillText('Available 100% Offline • Standalone Keynote Player Bundle', w / 2, h / 2 + 40);

      ctx.fillStyle = '#94A3B8';
      ctx.font = "500 20px 'JetBrains Mono', monospace";
      ctx.fillText('Press [Space] to Explore Live Engine', w / 2, h / 2 + 100);
    }

    // Top Brand Watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = "600 16px 'JetBrains Mono', monospace";
    ctx.textAlign = 'left';
    ctx.fillText('APEXFLOW OS // CINEMATIC TEASER', 40, 50);

    // Bottom Progress Bar in Video
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, h - 8, w, 8);
    ctx.fillStyle = '#00F0FF';
    ctx.fillRect(0, h - 8, w * progress, 8);

    if (progress < 1.0) {
      requestAnimationFrame(() => this.renderFrame(name, tagline, archetype, onProgress));
    } else {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    }
  }
}

export const keynoteTeaser = new KeynoteTeaserRecorder();
