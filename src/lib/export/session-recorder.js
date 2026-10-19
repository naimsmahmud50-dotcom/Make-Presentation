/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Keynote Session Recorder & Instant Replay Engine
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Records live executive presentations and enables offline session playback (`stage.html` & `admin.html`).
 * Captures:
 *   1. Stage Navigation Timeline (`STAGE_JUMP` with slide indices and dwell times)
 *   2. Laser Pointer Coordinates & Spotlight Coordinates (`LASER_POS`, `SPOTLIGHT_POS`)
 *   3. Live Neon Pen Drawing Vector Strokes (`PEN_STROKE`)
 *   4. In-Browser Pyodide Execution Triggers (`SANDBOX_EXECUTE`)
 *   5. Audience Live Reactions & Votes (`EMOJI_BURST`, `POLL_VOTE`)
 *
 * [ZERO-UPLOAD GUARANTEE]:
 * Event streams are saved 100% locally in browser memory or downloaded as `.apexflow-session.json`.
 *
 * [ENGINEERING NOTES]:
 * - Call `sessionRecorder.startRecording({ projectId, projectName })`
 * - To record an event: `sessionRecorder.record('STAGE_JUMP', { stageIndex: 2 })`
 * - Call `sessionRecorder.stopRecording()` to obtain the serialized session payload.
 * - Call `sessionRecorder.play(sessionData, { onEvent, onProgress, onEnd })` for deterministic playback.
 * =========================================================================================
 */

export class SessionRecorderEngine {
  constructor() {
    this.isRecording = false;
    this.isPlaying = false;
    this.startTime = 0;
    this.events = [];
    this.metadata = null;
    this.playbackTimer = null;
  }

  /**
   * Starts a new presentation recording session
   * @param {Object} metadata
   */
  startRecording(metadata = {}) {
    this.isRecording = true;
    this.startTime = Date.now();
    this.events = [];
    this.metadata = {
      projectId: metadata.projectId || 'default',
      projectName: metadata.projectName || 'APEXFLOW Presentation',
      recordedAt: new Date().toISOString(),
      ...metadata
    };

    // Initial stage event
    this.record('STAGE_JUMP', { stageIndex: 0 });
  }

  /**
   * Records a timestamped event into the active session
   * @param {string} type
   * @param {Object} payload
   */
  record(type, payload = {}) {
    if (!this.isRecording) return;
    const deltaMs = Date.now() - this.startTime;
    this.events.push({
      deltaMs,
      type,
      payload
    });
  }

  /**
   * Stops recording and returns finalized session manifest
   * @returns {Object}
   */
  stopRecording() {
    if (!this.isRecording) return null;
    this.isRecording = false;
    const totalDurationMs = Date.now() - this.startTime;

    const sessionPayload = {
      schemaVersion: 'apexflow-session-v1.0.0',
      metadata: {
        ...this.metadata,
        totalDurationMs,
        eventCount: this.events.length
      },
      events: this.events
    };

    return sessionPayload;
  }

  /**
   * Triggers browser download of the recorded session JSON file
   * @param {Object} sessionPayload
   */
  downloadSessionFile(sessionPayload) {
    if (!sessionPayload) return;
    const jsonStr = JSON.stringify(sessionPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    const slug = (sessionPayload.metadata?.projectName || 'session').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.href = url;
    a.download = `${slug}-recording-${Date.now()}.apexflow-session.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Replays a recorded session with scaled playback speed
   * @param {Object} sessionPayload
   * @param {Object} callbacks
   * @param {number} speedMultiplier (e.g. 1.0, 1.5, 2.0)
   */
  play(sessionPayload, callbacks = {}, speedMultiplier = 1.0) {
    if (!sessionPayload || !sessionPayload.events || sessionPayload.events.length === 0) return;
    this.stopPlayback();

    this.isPlaying = true;
    const { onEvent, onProgress, onEnd } = callbacks;
    const events = [...sessionPayload.events];
    const totalDuration = sessionPayload.metadata?.totalDurationMs || events[events.length - 1].deltaMs;
    const playbackStart = Date.now();

    let eventIdx = 0;
    const checkInterval = setInterval(() => {
      if (!this.isPlaying) {
        clearInterval(checkInterval);
        return;
      }

      const elapsed = (Date.now() - playbackStart) * speedMultiplier;

      // Dispatch due events
      while (eventIdx < events.length && events[eventIdx].deltaMs <= elapsed) {
        const ev = events[eventIdx];
        if (onEvent) onEvent(ev.type, ev.payload);
        eventIdx++;
      }

      // Progress reporting
      const pct = Math.min(100, (elapsed / totalDuration) * 100);
      if (onProgress) onProgress(pct, elapsed, totalDuration);

      // End of playback
      if (eventIdx >= events.length || elapsed >= totalDuration) {
        clearInterval(checkInterval);
        this.isPlaying = false;
        if (onEnd) onEnd();
      }
    }, 16); // ~60fps checking frequency

    this.playbackTimer = checkInterval;
  }

  /**
   * Halts any running session playback
   */
  stopPlayback() {
    this.isPlaying = false;
    if (this.playbackTimer) {
      clearInterval(this.playbackTimer);
      this.playbackTimer = null;
    }
  }
}

export const sessionRecorder = new SessionRecorderEngine();
