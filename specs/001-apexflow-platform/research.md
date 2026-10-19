# Research & Technical Decisions: APEXFLOW OS

## Decision 1: 2D & 3D Dual-Layer Visual Engine

### Context
The platform needs to visualize complex software architecture both as an interactive 2D node flow with data packet pulses and as a 3D Holodeck spatial universe.

### Decision
* **2D Layer:** `@xyflow/react` (React Flow v12) with custom SVG edge markers and CSS keyframe glowing photon pulses.
* **3D Layer:** `Three.js` with `@react-three/fiber` and `@react-three/drei` for crystalline server blade nodes and orbital camera physics.
* **Camera Transition:** Smooth camera lerp with GSAP / Framer Motion when toggling between 2D and 3D with hotkey `'3'`.

### Rationale
* React Flow provides rock-solid node layout algorithms (Dagre / Elkjs), pan-zoom physics, and code drawer accessibility.
* Three.js enables GPU-accelerated spatial rendering with post-processing bloom shaders without stuttering at 120 FPS.

---

## Decision 2: In-Browser Code Execution (Sandbox)

### Context
Stage 3 must prove the software actually works in front of clients or investors without spinning up expensive cloud containers or risking security vulnerabilities.

### Decision
* **Python Automation / ML:** `Pyodide` (CPython WebAssembly port). Loads in a dedicated Web Worker to prevent UI blocking.
* **JavaScript / Node / APIs:** Sandboxed iframe execution with proxy interceptors and synthetic response generation for mock external APIs (Stripe, OpenAI, Telegram).
* **Terminal UI:** Custom React terminal component with canvas-rendered phosphor scanlines, streaming typewriter logs, and ANSI color decoding.

### Rationale
* Zero backend server hosting costs, zero latency, and 100% offline-compatible. Code runs entirely in user's browser memory.

---

## Decision 3: Client-Side Audio Design (Tactile Sound)

### Context
Stage presentations require high-end audio feedback (mechanical clicks, laser buzz, server hums, bass drops), but external MP3 downloads can fail on slow connections or offline modes.

### Decision
* Custom `Web Audio API` Procedural Sound Synthesizer (`lib/audio/sound-synth.ts`).
* Generates pure sinusoidal, square, and filtered noise pulses programmatically for clicks, thuds, whooshes, and laser sounds without needing any external audio files. Pre-recorded luxury audio files remain an optional enhancement.

### Rationale
* 0 KB network payload, zero load delay, instant latency (<5ms), guaranteed offline operation.

---

## Decision 4: Audience Remote & QR Synchronization

### Context
Audiences need to scan a QR code with their mobile devices to send live emoji reactions and trigger sandbox webhooks without creating accounts or downloading apps.

### Decision
* **Local / Air-gapped Stage Mode:** WebRTC DataChannel via peer-to-peer QR signaling, with fallback to local network WebSocket or local BroadcastChannel / localStorage sync for dual-screen setups on the same machine.
* **Cloud / Distributed Mode:** Lightweight WebSocket relay (Supabase Realtime or PartyKit / Socket.io microservice).
* **Security:** Cryptographic session tokens generated per presentation stage. Rate-limited emoji bursts (max 5/sec per client) to avoid stage flooding.

---

## Decision 5: 1-Click Single-File Offline HTML Export

### Context
Presenters frequently speak in venues with unstable Wi-Fi, air-gapped auditoriums, or airplanes. The presentation must run reliably from a USB drive.

### Decision
* Vite / Rollup custom packaging script in `lib/export/offline-bundler.ts` that inlines CSS, minified JS, base64 assets, and a lightweight Pyodide WASM bootstrap into a single self-contained `.html` document.

### Rationale
* Absolute resilience. Presenters can open `presentation.html` in Chrome, Safari, or Edge without running `npm start` or connecting to the internet.
