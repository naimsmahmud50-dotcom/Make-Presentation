# Project Constitution: APEXFLOW OS

## Core Engineering Principles & Architectural Axioms

### 1. Zero-Upload Privacy First
* All file parsing, AST analysis, dependency graph generation, and code execution MUST occur entirely inside the user's browser client memory (via HTML5 File System Access API, Web Workers, and WebAssembly).
* No user source code, API keys, credentials, or proprietary intellectual property shall ever be transmitted to external cloud servers unless explicitly opted into cloud sharing with client consent.

### 2. 120 FPS Hardware-Accelerated Visual Budget
* Every visual interaction, transitions, node pulsing, and 3D holodeck orbital camera motion must maintain a target 120 FPS (minimum 60 FPS on lower-tier hardware).
* Heavy compute operations (directory scanning, AST parsing, Pyodide initialization, syntax highlighting) MUST run on Web Workers or chunked micro-tasks to avoid blocking the main rendering thread.

### 3. Universal Polymorphic Ingestion (Zero-Rejection Guarantee)
* No project directory shall ever produce a fatal ingestion failure.
* The polymorphic classifier engine must support 6 defined archetypes (Automation & AI Bots, Web & Frontend, Backend APIs, Data Science & ML, Mobile & Desktop, Generic Repositories).
* Any unknown or unconventional folder structure must gracefully resolve to Archetype F (Generic Constellation) with extracted metrics, README narration, and file hierarchy exploration.

### 4. Authentic Live Execution & Verification
* Whenever interactive execution is showcased, it must leverage real execution runtimes (Pyodide WebAssembly for Python, isolated JS sandboxes for web scripts) with realistic streaming terminal logs, photon pulse animations, and real-time state feedback.
* Audiences must be capable of interacting in real-time via QR WebRTC/WebSocket remotes to trigger demo webhooks and interactive reactions.

### 5. 100% Offline Resilience & Self-Contained Portability
* The platform must provide a 1-Click "Offline HTML Bundle" export capable of running fully from a USB thumb drive or air-gapped laptop without active internet connectivity.
* Sound effects, core styling, fonts, and WebAssembly runtimes should have reliable local fallbacks and IndexedDB persistent caching.

### 6. Design System: Cybernetic Luxury & Enterprise White-Labeling
* The visual language follows an ultra-premium aesthetic: OLED deep dark background (`#030508` / `#06080D`), luminous holographic glassmorphism, glowing cybernetic edges, metallic 3D lighting, and Apple-grade Bento Grids.
* Full white-label support: seamless injection of client brand colors, logos, watermarks, and custom domain configurations.
