/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Procedural Web Audio API Executive Sound Synthesizer
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Generates tactile, luxury soundscapes & audio cues purely via the browser's Web Audio API.
 * Eliminates external audio file dependencies (0 KB overhead, <5ms latency, 100% offline).
 *
 * [ACOUSTIC SYNTHESIS — UI/UX PRO MAX]:
 *   1. `playClick()`: Mechanical luxury keyboard click on button interactions
 *   2. `playWhoosh()`: Low-frequency sub-bass spatial whoosh on slide jumps
 *   3. `playLaser(pan)`: High-frequency emerald/ruby pulse with stereo panning (-1.0 to 1.0)
 *   4. `playSuccess()`: Ascending cyber chime upon sandbox execution
 *   5. `playSlideChime()`: Major 9th crystal chime on slide completion
 *   6. `toggleExecutiveSoundscape(enable)`: Multi-layer harmonic warmth drone (55Hz/82Hz)
 *
 * [ENGINEERING NOTES]:
 * - Call `soundEngine.playLaser(xNormalized * 2 - 1)` to pan audio directly with mouse X position.
 * - Call `soundEngine.toggleExecutiveSoundscape(!soundEngine.isSoundscapeActive)` for keynote immersion.
 * =========================================================================================
 */

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isSoundscapeActive = false;
    this.soundscapeNodes = null;
  }

  /**
   * Initializes the AudioContext on first user interaction
   */
  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.isMuted && this.soundscapeNodes) {
      this.soundscapeNodes.gain.gain.setValueAtTime(0, this.ctx.currentTime);
    } else if (!this.isMuted && this.soundscapeNodes) {
      this.soundscapeNodes.gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
    }
  }

  /**
   * Tactile mechanical button click (Apple/Linear precision)
   */
  playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  /**
   * Stage transition whoosh with low-pass resonance
   */
  playWhoosh() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(240, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.12);
    filter.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.28);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(260, this.ctx.currentTime + 0.12);
    osc.frequency.exponentialRampToValueAtTime(55, this.ctx.currentTime + 0.28);

    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.16, this.ctx.currentTime + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.28);
  }

  /**
   * Laser pointer activation pulse with optional stereo panning (-1.0 to 1.0)
   * @param {number} pan
   */
  playLaser(pan = 0.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(2400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);

    // Stereo Panning if supported
    if (this.ctx.createStereoPanner) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), this.ctx.currentTime);
      gain.connect(panner);
      panner.connect(this.ctx.destination);
    } else {
      gain.connect(this.ctx.destination);
    }

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  /**
   * Execution success chime (ascending arpeggio)
   */
  playSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.08, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.25);
    });
  }

  /**
   * Crystal Major 9th chime on slide completion or milestone
   */
  playSlideChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Cmaj9 harmonic stack: C5 (523Hz), E5 (659Hz), G5 (784Hz), B5 (988Hz), D6 (1175Hz)
    [523.25, 659.25, 783.99, 987.77, 1174.66].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.06, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.6);
    });
  }

  /**
   * Toggles executive ambient harmonic soundscape (Warm 55Hz/82Hz Keynote Drone)
   * @param {boolean} enable
   */
  toggleExecutiveSoundscape(enable = null) {
    this.initContext();
    if (!this.ctx) return false;

    if (enable === null) {
      enable = !this.isSoundscapeActive;
    }

    if (!enable) {
      if (this.soundscapeNodes) {
        try {
          this.soundscapeNodes.oscRoot.stop();
          this.soundscapeNodes.oscFifth.stop();
          this.soundscapeNodes.oscLFO.stop();
        } catch (e) {}
        this.soundscapeNodes = null;
      }
      this.isSoundscapeActive = false;
      return false;
    }

    if (this.isSoundscapeActive && this.soundscapeNodes) return true;

    // Harmonic Multi-Oscillator Architecture
    const oscRoot = this.ctx.createOscillator();
    const oscFifth = this.ctx.createOscillator();
    const oscLFO = this.ctx.createOscillator();

    const gainRoot = this.ctx.createGain();
    const gainFifth = this.ctx.createGain();
    const masterGain = this.ctx.createGain();
    const lowpass = this.ctx.createBiquadFilter();

    // 55Hz Root (A1)
    oscRoot.type = 'sine';
    oscRoot.frequency.setValueAtTime(55, this.ctx.currentTime);
    gainRoot.gain.setValueAtTime(0.02, this.ctx.currentTime);

    // 82.4Hz Perfect Fifth (E2)
    oscFifth.type = 'sine';
    oscFifth.frequency.setValueAtTime(82.41, this.ctx.currentTime);
    gainFifth.gain.setValueAtTime(0.012, this.ctx.currentTime);

    // 0.15 Hz Slow LFO for organic breathing volume modulation
    oscLFO.type = 'sine';
    oscLFO.frequency.setValueAtTime(0.15, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.005, this.ctx.currentTime);
    oscLFO.connect(lfoGain);
    lfoGain.connect(masterGain.gain);

    // Warm Low-Pass Filter
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(280, this.ctx.currentTime);

    masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.022, this.ctx.currentTime);

    oscRoot.connect(gainRoot);
    oscFifth.connect(gainFifth);
    gainRoot.connect(lowpass);
    gainFifth.connect(lowpass);
    lowpass.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    oscRoot.start();
    oscFifth.start();
    oscLFO.start();

    this.soundscapeNodes = {
      oscRoot,
      oscFifth,
      oscLFO,
      gain: masterGain
    };
    this.isSoundscapeActive = true;
    return true;
  }
}

export const soundEngine = new SoundSynthesizer();
