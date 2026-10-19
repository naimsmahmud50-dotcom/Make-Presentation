/**
 * =========================================================================================
 * MODULE: APEXFLOW OS — Service Worker Engine & Autonomous Offline Vault (Phase 34, Task T167)
 * -----------------------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Provides 100% air-gapped, zero-latency offline operation for all executive presentations.
 *   1. Pre-caches all 5 HTML presenter views (Stage, War Room, Admin, Remote, Ingestion).
 *   2. Caches all CSS stylesheets, Three.js shaders, WebAudio assets & JS modules.
 *   3. Intelligent Cache-First strategy with Stale-While-Revalidate for local assets.
 *   4. Zero-network fallback guarantees high-stakes keynotes never fail during WiFi drops.
 * =========================================================================================
 */

const CACHE_NAME = 'apexflow-vault-v2.1';

const STATIC_PRECACHE = [
  './',
  './index.html',
  './stage.html',
  './admin.html',
  './war-room.html',
  './remote.html',
  './manifest.json',
  './icon.svg',
  './src/styles/main.css',
  './src/styles/shaders.css',
  
  // Core Presentation Components
  './src/components/annotation-canvas.js',
  './src/components/api-playground.js',
  './src/components/architecture-copilot.js',
  './src/components/bento-roi.js',
  './src/components/boardroom-pressure-engine.js',
  './src/components/chaos-engineering-hud.js',
  './src/components/chaos-simulator.js',
  './src/components/client-portal-gateway.js',
  './src/components/command-palette.js',
  './src/components/comparison-matrix.js',
  './src/components/compliance-ledger.js',
  './src/components/cyber-terminal.js',
  './src/components/device-frames.js',
  './src/components/dr-failover-hud.js',
  './src/components/finops-calculator.js',
  './src/components/floating-particles.js',
  './src/components/hero-radar.js',
  './src/components/holodeck-engine.js',
  './src/components/human-rehearsal-playbook.js',
  './src/components/landing.js',
  './src/components/latency-waterfall.js',
  './src/components/ml-gauges.js',
  './src/components/node-inspector.js',
  './src/components/objection-defense-hud.js',
  './src/components/packet-tracer.js',
  './src/components/readiness-audit.js',
  './src/components/rehearsal-evaluator.js',
  './src/components/resilience-boundary.js',
  './src/components/scenario-engine.js',
  './src/components/screen-simulator.js',
  './src/components/sentiment-cloud.js',
  './src/components/spatial-gesture-engine.js',
  './src/components/stage-controller.js',
  './src/components/teleprompter-hud.js',
  './src/components/threat-modeler.js',
  './src/components/time-machine.js',
  './src/components/topology-comparator.js',
  './src/components/audience-heatmap.js',
  './src/components/translation-subtitles.js',
  './src/components/voice-commander.js',
  './src/components/white-label-manager.js',

  // Core Libraries & Engines
  './src/lib/analyzers/git-fetcher.js',
  './src/lib/analyzers/markdown-deck-importer.js',
  './src/lib/analyzers/pipeline-synthesizer.js',
  './src/lib/analyzers/polymorphic-detector.js',
  './src/lib/analyzers/sample-demos.js',
  './src/lib/analyzers/stress-benchmarker.js',
  './src/lib/analyzers/tree-scanner.js',
  './src/lib/analyzers/zip-extractor.js',
  './src/lib/audio/sound-synth.js',
  './src/lib/audio/voice-macros.js',
  './src/lib/audio/voice-narrator.js',
  './src/lib/export/briefing-exporter.js',
  './src/lib/export/executive-deck-packager.js',
  './src/lib/export/investor-qa-packager.js',
  './src/lib/export/keynote-teaser.js',
  './src/lib/export/mermaid-exporter.js',
  './src/lib/export/session-recorder.js',
  './src/lib/export/single-file-bundler.js',
  './src/lib/export/slide-poster-renderer.js',
  './src/lib/export/vector-exporter.js',
  './src/lib/pyodide/sandbox-runner.js',
  './src/lib/remote/presenter-mirror.js',
  './src/lib/remote/remote-sync.js',
  './src/lib/security/input-shield.js',
  './src/lib/security/keynote-watermark.js',
  './src/lib/storage/project-vault.js',
  './src/lib/storage/offline-vault.js',
  './src/lib/storage/tenant-config.js',
  './src/lib/syntax/code-highlighter.js',
  './src/lib/templates/executive-deck-library.js',
  './src/lib/types.js'
];

// 1. Install Event: Pre-cache all static assets immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Use allSettled so missing individual assets don't abort entire precache
      const results = await Promise.allSettled(
        STATIC_PRECACHE.map(url =>
          fetch(url, { cache: 'no-cache' }).then(res => {
            if (res.ok) return cache.put(url, res);
            throw new Error(`Failed to fetch ${url}`);
          })
        )
      );
      const cachedCount = results.filter(r => r.status === 'fulfilled').length;
      console.log(`[OfflineVault SW] Pre-cached ${cachedCount}/${STATIC_PRECACHE.length} core assets.`);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Claim control & delete stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log(`[OfflineVault SW] Purging obsolete cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Cache-First strategy with background update & navigation fallback
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Ignore browser extensions & non-http protocols
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached immediately; fetch fresh in background if online (Stale-While-Revalidate)
        if (navigator.onLine && url.origin === self.location.origin) {
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
          }).catch(() => {
            // Background update failed silently; cached response already served
          });
        }
        return cachedResponse;
      }

      // Not in cache: fetch from network and cache dynamically
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      }).catch(async () => {
        // Network failed & not in cache: serve offline HTML fallback for navigation
        if (request.mode === 'navigate') {
          const fallback = await caches.match('./stage.html') || await caches.match('./index.html');
          if (fallback) return fallback;
        }
        return new Response('Autonomous Offline Vault: Network unavailable and asset not cached.', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' }
        });
      });
    })
  );
});

// 4. Message Communication
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'PURGE_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      event.ports?.[0]?.postMessage({ status: 'PURGED' });
    });
  }
});
