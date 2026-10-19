/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Master 120 FPS Luminescent Micro-Photon Particle Canvas Engine
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * High-performance, GPU-accelerated 2D canvas physics simulation rendering executive
 * geometric photon embers, kinetic chevrons, radiant nodes, and energetic flares.
 * 
 * [DESIGN INTELLIGENCE]:
 * - 100% Vector Geometric Rendering (Zero Raw Emojis, Zero Raster Dependencies).
 * - Multi-layer radial luminance with specular core highlight.
 * - Buoyant upward impulse with sinusoidal micro-sway and rotational damping.
 * - Power-efficient event loop: automatically halts animation loop when zero particles are active.
 * =========================================================================================
 */

import { soundEngine } from '../lib/audio/sound-synth.js';

function mapReactionToArchetype(reactionKey) {
  const key = String(reactionKey || '').toLowerCase();
  if (key === 'priority' || key.includes('fire')) {
    return { archetype: 'diamond', color: '#F97316', glowColor: 'rgba(249, 115, 22, 0.5)', radius: 10 };
  }
  if (key === 'impact' || key === 'velocity' || key.includes('rocket')) {
    return { archetype: 'chevron', color: '#38BDF8', glowColor: 'rgba(56, 189, 248, 0.5)', radius: 11 };
  }
  if (key === 'endorse' || key.includes('applause') || key.includes('thumbs')) {
    return { archetype: 'node', color: '#10B981', glowColor: 'rgba(16, 185, 129, 0.5)', radius: 9 };
  }
  if (key === 'insight' || key.includes('idea') || key.includes('bulb')) {
    return { archetype: 'spark', color: '#FBBF24', glowColor: 'rgba(251, 191, 36, 0.5)', radius: 10 };
  }
  if (key === 'surge' || key.includes('energy') || key.includes('lightning')) {
    return { archetype: 'flare', color: '#A855F7', glowColor: 'rgba(168, 85, 247, 0.5)', radius: 11 };
  }
  return { archetype: 'ring', color: '#EC4899', glowColor: 'rgba(236, 72, 153, 0.5)', radius: 10 };
}

export class FloatingParticleCanvas {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.isRunning = false;
    this.animationId = null;

    if (this.canvas) {
      this.handleResize();
      window.addEventListener('resize', () => this.handleResize());
    }
  }

  handleResize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
    this.width = rect.width;
    this.height = rect.height;
  }

  /**
   * Spawns a floating luminescent geometric photon
   * @param {string} reaction Type or semantic key of the reaction
   * @param {number} [customX] Optional starting X coordinate
   */
  spawn(reaction = 'priority', customX = null) {
    if (!this.canvas || !this.ctx) return;
    try {
      soundEngine.playClick();
    } catch (_) {}

    const spec = mapReactionToArchetype(reaction);
    const startX = (customX !== null) 
      ? customX 
      : Math.floor(Math.random() * (this.width * 0.75)) + (this.width * 0.12);

    const particle = {
      archetype: spec.archetype,
      color: spec.color,
      glowColor: spec.glowColor,
      radius: spec.radius,
      baseX: startX,
      x: startX,
      y: this.height - 20,
      vy: -(3.2 + Math.random() * 2.6),
      amplitude: 14 + Math.random() * 18,
      frequency: 0.024 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
      rotation: (Math.random() - 0.5) * 0.3,
      rotationSpeed: (Math.random() - 0.5) * 0.025,
      scale: 0.3,
      targetScale: 1.0 + Math.random() * 0.3,
      alpha: 1.0,
      life: 0,
      maxLife: 150 + Math.floor(Math.random() * 60)
    };

    this.particles.push(particle);

    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  /**
   * Spawns a celebratory burst of multiple luminescent photons
   * @param {string} reaction 
   * @param {number} count 
   */
  burst(reaction = 'surge', count = 6) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.spawn(reaction);
      }, i * 85);
    }
  }

  drawParticle(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.scale(p.scale, p.scale);

    const color = p.color;
    const r = p.radius;

    // 1. Ambient Radial Glow
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.8);
    grad.addColorStop(0, p.glowColor);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 2.8, 0, Math.PI * 2);
    ctx.fill();

    // 2. High-precision vector geometric glyph
    ctx.fillStyle = color;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.2;

    switch (p.archetype) {
      case 'diamond': // Priority / Amber
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.4);
        ctx.lineTo(r, 0);
        ctx.lineTo(0, r * 1.4);
        ctx.lineTo(-r, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case 'chevron': // Velocity / Cyan
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.3);
        ctx.lineTo(r * 1.2, r * 0.9);
        ctx.lineTo(0, r * 0.3);
        ctx.lineTo(-r * 1.2, r * 0.9);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case 'node': // Endorse / Emerald
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'spark': // Insight / Gold
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const rad = (i % 2 === 0) ? r * 1.5 : r * 0.6;
          const a = (i * Math.PI) / 4;
          const px = Math.cos(a) * rad;
          const py = Math.sin(a) * rad;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case 'flare': // Surge / Violet
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.6);
        ctx.lineTo(r * 0.45, -r * 0.3);
        ctx.lineTo(r * 1.6, 0);
        ctx.lineTo(r * 0.45, r * 0.3);
        ctx.lineTo(0, r * 1.6);
        ctx.lineTo(-r * 0.45, r * 0.3);
        ctx.lineTo(-r * 1.6, 0);
        ctx.lineTo(-r * 0.45, -r * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case 'ring':
      default:
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  loop() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life++;

      // Update position
      p.y += p.vy;
      p.x = p.baseX + Math.sin(p.life * p.frequency + p.phase) * p.amplitude;
      p.rotation += p.rotationSpeed;

      // Scale spring
      p.scale += (p.targetScale - p.scale) * 0.08;

      // Alpha fade out in last 35% of life
      const remainingProgress = (p.maxLife - p.life) / p.maxLife;
      if (remainingProgress < 0.35) {
        p.alpha = Math.max(0, remainingProgress / 0.35);
      }

      // Draw luminescent geometric photon
      this.drawParticle(p);

      // Remove dead particles
      if (p.life >= p.maxLife || p.y < -50) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.loop());
    } else {
      this.isRunning = false;
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  destroy() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.particles = [];
  }
}

// Backward-compatible alias for existing modules
export const FloatingEmojiCanvas = FloatingParticleCanvas;
