# Quickstart & Verification Guide: APEXFLOW OS

## 1. Prerequisites
* **Node.js:** v18.18+ or v20+ (LTS recommended)
* **Package Manager:** `pnpm` (recommended), `npm`, or `bun`
* **Modern Web Browser:** Chrome 110+, Edge 110+, Brave, Firefox 115+, or Safari 16.4+ (supporting HTML5 File System Access API & WebAssembly)

---

## 2. Installation & Setup

```bash
# Clone or navigate to the repository
cd apexflow-os

# Install dependencies
npm install

# Run the local development server
npm run dev
```

Visit `http://localhost:3000` to launch APEXFLOW OS.

---

## 3. Core Verification Scenarios

### Scenario 1: Drag-and-Drop Ingestion (Universal Parsing)
1. Navigate to `/` (Master Hero & Dropzone).
2. Drag and drop any folder (e.g. `sample-projects/facebook-automation` or any local GitHub repo).
3. **Expected Result:**
   - Ingestion completes in $<1.8$ seconds.
   - Shows detected archetype (e.g. `TYPE_A_AUTOMATION` with 98% confidence).
   - Generates interactive presentation deck and redirects to `/stage/[id]`.

### Scenario 2: 2D Living Pipeline & 3D Holodeck Switch
1. On `/stage/[id]`, navigate to **Stage 2 (Architecture Canvas)**.
2. Observe glowing SVG data pulses traveling along edges between nodes.
3. Click any node: frosted glass code drawer slides open showing highlighted code via Shiki.
4. Press `'3'` on keyboard:
   - Smooth camera zoom into **3D Holodeck Galaxy** (Three.js).
   - Nodes render as 3D crystalline server blades floating in a cosmic particle cloud.
   - Press `'3'` again to return seamlessly to 2D view.

### Scenario 3: Real In-Browser Sandbox Execution (Pyodide)
1. Advance to **Stage 3 (Sandbox Execution)**.
2. Click **"Simulate Trigger"**.
3. **Expected Result:**
   - WebAssembly Pyodide loads and executes the Python automation script.
   - Cyber-terminal streams live color-coded logs (`[TRIGGER]`, `[AI ENGINE]`, `[DATABASE]`, `[SUCCESS 200 OK]`).
   - Tactile mechanical audio clicks play synchronously with log lines.

### Scenario 4: Audience Mobile QR Remote
1. Press `'Q'` anywhere on the stage.
2. QR code modal appears with session URL (e.g. `http://localhost:3000/remote/[sessionId]`).
3. Open the URL in a separate browser tab or mobile phone.
4. Tap emoji reactions (`🔥`, `🚀`, `👏`).
5. **Expected Result:** Emojis instantly float upward across the presentation stage with realistic physics in real-time.

### Scenario 5: Presenter War Room Dual-Screen
1. Press `'P'` on the keyboard.
2. A separate popup or secondary window opens at `/war-room/[id]`.
3. Presenter view displays teleprompter notes, speaking speed coach, laser pointer toggle (`'L'`), spotlight toggle (`'S'`), and live pen (`'D'`).

### Scenario 6: 1-Click Offline Export
1. In `/admin.html` or `/stage.html`, click **"Export Standalone HTML"**.
2. Saves a single `.html` file.
3. Disconnect Wi-Fi and open `presentation.html` directly in the browser: presentation runs 100% smoothly offline.

### Scenario 7: Real-World Ingestion Stress Benchmark (Phase 31)
1. On `index.html`, open the Ingestion Benchmarking HUD.
2. Select 500, 2,500, or 10,000 synthetic polyglot files (or select one of the 4 Enterprise Architecture models).
3. **Expected Result:**
   - Ingestion completes under 2.0s.
   - Shows live traversal QPS, memory delta, and archetype confidence indicator.

### Scenario 8: 1-Click Executive Keynote Preset Loading (Phase 32)
1. On `index.html` or `admin.html`, open the **"Keynote Templates"** gallery.
2. Select **"Series A/B Investor Pitch"** or **"Board Security Briefing"**.
3. **Expected Result:**
   - Pre-populated presentation slides load instantly into the stage engine.
   - All financial ROI models, STRIDE threat matrices, and architecture topologies reflect the scenario.

### Scenario 9: Human Rehearsal Playbook & Speech Cadence Coach (Phase 33)
1. On `stage.html`, press `Shift+Z` or click the dock icon to open the **Human Rehearsal Playbook HUD**.
2. Speak into microphone:
   - Dynamic WPM gauge calculates pace in real-time.
   - Soft-amber warnings trigger if speaking too fast (>160 WPM) or too slow (<100 WPM).
   - Slide countdown shows remaining budgeted seconds.
3. Finish rehearsal:
   - Receives Executive Confidence Scorecard (0–100%) and debrief report.

