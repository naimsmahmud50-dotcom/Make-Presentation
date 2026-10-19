/**
 * ═══════════════════════════════════════════════════════════════════════════
 * [MODULE]: REAL-TIME PEER & REMOTE SYNCHRONIZATION BUS (src/lib/remote/remote-sync.js)
 * [PURPOSE]: Sub-Millisecond Peer Communication & Dynamic Audience Interaction Engine
 * [ARCHITECTURE & INTEGRATION]:
 *    - BroadcastChannel ('apexflow-remote-sync') with LocalStorage cross-tab fallback.
 *    - Coordinates:
 *        1. Audience Mobile Smart Phone Remotes (`remote.html`)
 *        2. Main Stage Keynote Presentation Canvas (`stage.html`)
 *        3. Presenter Dual-Screen Teleprompter War Room (`war-room.html`)
 *        4. Enterprise Admin Panel & Slide Studio (`admin.html`)
 *    - Features:
 *        • Real-Time Audience Live Poll Studio & Voting Engine (Task T073)
 *        • White-Box DOM Sanitization via `escapeHTML()` to prevent XSS (Task T075)
 *        • Presentation Clock Bridge & Stage Navigation
 *        • Presenter Whisper Prompts & Audience Q&A Spotlight
 * [ENGINEERING NOTE]:
 *    All event payloads are sanitized and broadcast in-memory. Zero bytes leave browser memory.
 *    Use `escapeHTML()` before rendering any remote user-provided string into innerHTML.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { inputShield } from '../security/input-shield.js';

/**
 * Escapes unsafe HTML characters to prevent XSS injections (Task T075 & T100 / Strix whitebox)
 * @param {string} str Untrusted text
 * @returns {string} Sanitized text safe for innerHTML insertion
 */
export function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return inputShield ? inputShield.escapeHtml(str) : str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export class RemoteSyncEngine {
  constructor(channelName = 'apexflow-remote-sync') {
    this.channelName = channelName;
    this.broadcastChannel = null;
    this.listeners = [];
    this.senderId = 'client_' + Math.random().toString(36).substring(2, 9);

    this.initChannel();
  }

  initChannel() {
    // 1. BroadcastChannel if supported
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(this.channelName);
        this.broadcastChannel.onmessage = (event) => {
          this.notifyListeners(event.data);
        };
      } catch (err) {
        console.warn('[RemoteSync] BroadcastChannel fallback to StorageEvents:', err);
      }
    }

    // 2. Storage event fallback for cross-tab redundancy
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === this.channelName && event.newValue) {
          try {
            const data = JSON.parse(event.newValue);
            this.notifyListeners(data);
          } catch (e) {
            // ignore malformed
          }
        }
      });
    }
  }

  /**
   * Broadcast an event to all connected instances
   * @param {Object} data 
   */
  broadcast(data) {
    const payload = {
      ...data,
      senderId: this.senderId,
      timestamp: Date.now()
    };

    // Send via BroadcastChannel
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(payload);
    }

    // Write to LocalStorage to trigger storage event on other tabs/windows
    try {
      localStorage.setItem(this.channelName, JSON.stringify(payload));
    } catch (e) {
      // Storage quota or sandboxing
    }

    // Also notify local listeners in current window
    this.notifyListeners(payload);
  }

  /**
   * Send live emoji reaction
   * @param {string} emoji 
   */
  sendReaction(emoji) {
    this.broadcast({
      type: 'REACTION',
      emoji: escapeHTML(emoji)
    });
  }

  /**
   * Send live simulated webhook trigger
   * @param {Object} payload 
   */
  sendWebhookTrigger(payload = {}) {
    this.broadcast({
      type: 'WEBHOOK_TRIGGER',
      payload
    });
  }

  // ================= DYNAMIC AUDIENCE POLL ENGINE (Task T073) =================

  /**
   * Default active poll template
   */
  getDefaultPoll() {
    return {
      id: 'poll_prod_ready',
      question: 'Is this architecture ready for Tier-1 Enterprise Production deployment?',
      options: [
        { id: 'opt_0', text: 'Deploy to Production Now (Grade A+)', votes: 48 },
        { id: 'opt_1', text: 'Approve Pending Multi-Region Canary', votes: 26 },
        { id: 'opt_2', text: 'Run Additional Chaos Injection Drills', votes: 7 }
      ],
      status: 'ACTIVE',
      totalVotes: 81,
      winnerId: null
    };
  }

  /**
   * Retrieves active dynamic poll state from localStorage
   * @returns {Object}
   */
  getActivePoll() {
    try {
      const stored = localStorage.getItem('apexflow_active_poll');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    const defaultPoll = this.getDefaultPoll();
    try {
      localStorage.setItem('apexflow_active_poll', JSON.stringify(defaultPoll));
    } catch (e) {}
    return defaultPoll;
  }

  /**
   * Creates or updates a live audience poll and broadcasts to all peers
   * @param {Object} pollData 
   */
  createOrUpdatePoll(pollData) {
    const current = this.getActivePoll();
    const updated = {
      ...current,
      ...pollData,
      id: pollData.id || current.id || ('poll_' + Date.now()),
      question: escapeHTML(pollData.question || current.question),
      options: (pollData.options || current.options).map(opt => ({
        id: opt.id,
        text: escapeHTML(opt.text),
        votes: typeof opt.votes === 'number' ? opt.votes : 0
      })),
      totalVotes: (pollData.options || current.options).reduce((sum, opt) => sum + (opt.votes || 0), 0),
      status: pollData.status || current.status || 'ACTIVE',
      winnerId: pollData.winnerId || null,
      updatedAt: Date.now()
    };

    try {
      localStorage.setItem('apexflow_active_poll', JSON.stringify(updated));
    } catch (e) {}

    this.broadcast({
      type: 'POLL_CREATE_OR_UPDATE',
      poll: updated
    });
    return updated;
  }

  /**
   * Casts a dynamic vote for a given poll option
   * @param {string} pollId 
   * @param {string} optionId 
   */
  submitDynamicPollVote(pollId, optionId) {
    const poll = this.getActivePoll();
    if (poll.status !== 'ACTIVE') return poll;

    const opt = poll.options.find(o => o.id === optionId);
    if (opt) {
      opt.votes = (opt.votes || 0) + 1;
      poll.totalVotes = poll.options.reduce((sum, o) => sum + (o.votes || 0), 0);
      try {
        localStorage.setItem('apexflow_active_poll', JSON.stringify(poll));
      } catch (e) {}

      this.broadcast({
        type: 'POLL_VOTE',
        pollId,
        optionId,
        poll
      });
    }
    return poll;
  }

  /**
   * Closes the active poll and computes winner
   * @param {string} pollId 
   */
  closePoll(pollId) {
    const poll = this.getActivePoll();
    poll.status = 'CLOSED';

    // Find option with maximum votes
    let maxVotes = -1;
    let winner = null;
    poll.options.forEach(o => {
      if (o.votes > maxVotes) {
        maxVotes = o.votes;
        winner = o;
      }
    });
    poll.winnerId = winner ? winner.id : null;
    poll.winner = winner ? winner.text : null;

    try {
      localStorage.setItem('apexflow_active_poll', JSON.stringify(poll));
    } catch (e) {}

    this.broadcast({
      type: 'POLL_STATUS_CHANGE',
      pollId,
      status: 'CLOSED',
      poll
    });
    return poll;
  }

  /**
   * Resets active poll votes to 0
   * @param {string} pollId 
   */
  resetPoll(pollId) {
    const poll = this.getActivePoll();
    poll.options.forEach(o => { o.votes = 0; });
    poll.totalVotes = 0;
    poll.status = 'ACTIVE';
    poll.winnerId = null;
    poll.winner = null;

    try {
      localStorage.setItem('apexflow_active_poll', JSON.stringify(poll));
    } catch (e) {}

    this.broadcast({
      type: 'POLL_STATUS_CHANGE',
      pollId,
      status: 'ACTIVE',
      poll
    });
    return poll;
  }

  /**
   * Toggles the floating Live Poll Stage Visualizer overlay on stage.html
   * @param {boolean} [forceState]
   */
  toggleStagePollOverlay(forceState = null) {
    this.broadcast({
      type: 'POLL_STAGE_OVERLAY_TOGGLE',
      forceState
    });
  }

  /**
   * Legacy Poll submit vote (backwards compatibility with Stage 6 baseline)
   * @param {string} pollId 
   * @param {number} optionIndex 
   */
  submitPollVote(pollId, optionIndex) {
    const storageKey = `apexflow_poll_${pollId}`;
    let tallies = [0, 0, 0];
    try {
      const existing = localStorage.getItem(storageKey);
      if (existing) tallies = JSON.parse(existing);
      tallies[optionIndex] = (tallies[optionIndex] || 0) + 1;
      localStorage.setItem(storageKey, JSON.stringify(tallies));
    } catch (e) {}

    this.broadcast({
      type: 'POLL_VOTE',
      pollId,
      optionIndex,
      tallies
    });

    // Also dispatch dynamic vote if option exists
    const optId = `opt_${optionIndex}`;
    this.submitDynamicPollVote(pollId, optId);
  }

  /**
   * Get current poll tallies (backwards compatibility)
   * @param {string} pollId 
   * @returns {Array<number>}
   */
  getPollTallies(pollId) {
    const storageKey = `apexflow_poll_${pollId}`;
    try {
      const existing = localStorage.getItem(storageKey);
      if (existing) return JSON.parse(existing);
    } catch (e) {}
    const dynamicPoll = this.getActivePoll();
    if (dynamicPoll && Array.isArray(dynamicPoll.options)) {
      return dynamicPoll.options.map(o => o.votes || 0);
    }
    return [14, 28, 9];
  }

  // ================= PRESENTER & STAGE SYNC =================

  /**
   * Remote control stage navigation
   * @param {'next' | 'prev' | 'jump'} action 
   * @param {number} [stageIndex] 
   */
  navigateStage(action, stageIndex = null) {
    this.broadcast({
      type: 'STAGE_NAV',
      action,
      stageIndex
    });
  }

  /**
   * Synchronize Stage Clock & Presenter Timer across War Room and Stage
   * @param {Object} timerState 
   */
  syncStageTimer(timerState) {
    this.broadcast({
      type: 'STAGE_TIMER_SYNC',
      ...timerState
    });
  }

  /**
   * Send discreet whisper hint from War Room to Stage prompter HUD
   * @param {Object} whisper 
   */
  sendPresenterWhisper({ title, text, category = 'DEFENSE', autoDismissSec = 12 }) {
    this.broadcast({
      type: 'PRESENTER_WHISPER',
      title: escapeHTML(title),
      text: escapeHTML(text),
      category: escapeHTML(category),
      autoDismissSec
    });
  }

  /**
   * Broadcast custom slide ordering & visibility from Slide Studio
   * @param {Object} config 
   */
  broadcastSlideOrder({ slideOrder, hiddenSlides }) {
    this.broadcast({
      type: 'SLIDE_STUDIO_SYNC',
      slideOrder,
      hiddenSlides
    });
  }

  /**
   * Broadcast custom brand white-labeling theme
   * @param {Object} theme 
   */
  broadcastThemeBrand({ brandName, accentColor, watermark }) {
    this.broadcast({
      type: 'THEME_BRAND_SYNC',
      brandName: escapeHTML(brandName),
      accentColor: escapeHTML(accentColor),
      watermark: escapeHTML(watermark)
    });
  }

  /**
   * Submit an audience question from mobile remote
   * @param {Object} question
   */
  sendAudienceQuestion({ id = 'q_' + Date.now(), text, author = 'Audience Member' }) {
    this.broadcast({
      type: 'AUDIENCE_QUESTION',
      id: escapeHTML(id),
      text: escapeHTML(text),
      author: escapeHTML(author),
      timestamp: Date.now(),
      upvotes: 1
    });
  }

  /**
   * Upvote an existing audience question
   * @param {string} questionId
   */
  upvoteAudienceQuestion(questionId) {
    this.broadcast({
      type: 'QUESTION_UPVOTE',
      questionId: escapeHTML(questionId)
    });
  }

  /**
   * Push spotlight audience question onto main stage HUD
   * @param {Object} question
   */
  spotlightAudienceQuestion(question) {
    this.broadcast({
      type: 'SPOTLIGHT_QUESTION',
      question: {
        ...question,
        id: escapeHTML(question.id),
        text: escapeHTML(question.text),
        author: escapeHTML(question.author)
      }
    });
  }

  /**
   * Subscribe to incoming sync messages
   * @param {Function} callback 
   */
  onEvent(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners(data) {
    if (!data) return;
    const sanitizedData = inputShield ? inputShield.deepSanitizeObject(data) : data;
    this.listeners.forEach(fn => {
      try {
        fn(sanitizedData);
      } catch (err) {
        console.error('[RemoteSync] Listener exception:', err);
      }
    });
  }
}

export const remoteSync = new RemoteSyncEngine();
