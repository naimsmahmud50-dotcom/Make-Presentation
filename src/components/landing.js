/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Master Landing Page & Ingestion Controller
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Coordinates the master landing page UI, folder drag-and-drop interactions, file uploads,
 * Instant Demo showcase clicks, and real-time polymorphic scanning animations.
 *
 * [WORKFLOW]:
 *   1. User drags a folder or clicks a demo card.
 *   2. `tree-scanner.js` parses the files client-side.
 *   3. `polymorphic-detector.js` classifies the codebase into Archetypes A-F.
 *   4. `pipeline-synthesizer.js` auto-generates nodes, edges, and talking points.
 *   5. `project-vault.js` persists the manifest into IndexedDB.
 *   6. Displays the Scanning Radar Modal and smoothly redirects to `stage.html?id=...`.
 *
 * [ENGINEERING NOTES]:
 * - Audio triggers (`soundEngine.playClick()`, `soundEngine.playWhoosh()`) are hooked to
 *   interactive events. Use `soundEngine.setMuted()` if the user toggles sound.
 * =========================================================================================
 */

import { scanDirectoryEntry, parseFileListToTree, readFileText } from '../lib/analyzers/tree-scanner.js';
import { extractZipFileToTree } from '../lib/analyzers/zip-extractor.js';
import { ingestGitRepository } from '../lib/analyzers/git-fetcher.js';
import { classifyProject } from '../lib/analyzers/polymorphic-detector.js';
import { synthesizePipelineGraph } from '../lib/analyzers/pipeline-synthesizer.js';
import { SAMPLE_PROJECTS } from '../lib/analyzers/sample-demos.js';
import { projectVault } from '../lib/storage/project-vault.js';
import { soundEngine } from '../lib/audio/sound-synth.js';
import { ARCHETYPE_METADATA } from '../lib/types.js';
import { offlineVault } from '../lib/storage/offline-vault.js';
import { stressBenchmarker } from '../lib/analyzers/stress-benchmarker.js';
import { executiveDeckLibrary } from '../lib/templates/executive-deck-library.js';

class LandingController {
  constructor() {
    this.dropzone = null;
    this.folderInput = null;
    this.zipInput = null;
    this.githubInput = null;
    this.githubBtn = null;
    this.scanModal = null;
    this.soundToggleBtn = null;
    this.isMuted = false;
    this.selectedBenchmarkScale = 500;
  }

  /**
   * Initializes DOM event listeners, file inputs, git URL ingestor, and demo cards
   */
  init() {
    this.dropzone = document.getElementById('dropzone');
    this.folderInput = document.getElementById('folderInput');
    this.zipInput = document.getElementById('zipInput');
    this.githubInput = document.getElementById('githubRepoUrlInput');
    this.githubBtn = document.getElementById('btnFetchGithubRepo');
    this.scanModal = document.getElementById('scanModal');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');

    this.setupDropzoneEvents();
    this.setupFolderInput();
    this.setupZipInput();
    this.setupGithubInput();
    this.setupDemoCards();
    this.setupBenchmarkHUD();
    this.setupTemplateModal();
    this.setupAudioToggle();
    this.setupKeyboardShortcuts();

    // Phase 21: Mount Autonomous Offline PWA Vault Badge
    offlineVault.mountBadge('offlineVaultContainer');
  }

  /**
   * Sets up drag and drop listeners with glowing border feedback
   */
  setupDropzoneEvents() {
    if (!this.dropzone) return;

    ['dragenter', 'dragover'].forEach(eventName => {
      this.dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dropzone.classList.add('pulse-glow-cyan');
        this.dropzone.style.borderColor = 'var(--accent-cyan)';
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      this.dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dropzone.classList.remove('pulse-glow-cyan');
        this.dropzone.style.borderColor = 'var(--border-card)';
      });
    });

    this.dropzone.addEventListener('drop', async (e) => {
      soundEngine.playClick();
      const items = e.dataTransfer.items;
      if (!items || items.length === 0) return;

      const item = items[0];
      const entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;

      if (entry && entry.isDirectory) {
        await this.handleDirectoryEntry(entry);
      } else {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          const first = files[0];
          if (first.name.toLowerCase().endsWith('.zip') || first.type.includes('zip')) {
            await this.handleZipFile(first);
          } else {
            await this.handleFileList(files);
          }
        }
      }
    });
  }

  /**
   * Sets up native folder picker input
   */
  setupFolderInput() {
    if (!this.folderInput) return;
    this.folderInput.addEventListener('change', async (e) => {
      soundEngine.playClick();
      if (this.folderInput.files && this.folderInput.files.length > 0) {
        await this.handleFileList(this.folderInput.files);
      }
    });
  }

  /**
   * Sets up Zip file picker input (Task T039)
   */
  setupZipInput() {
    if (!this.zipInput) return;
    this.zipInput.addEventListener('change', async (e) => {
      soundEngine.playClick();
      if (this.zipInput.files && this.zipInput.files.length > 0) {
        await this.handleZipFile(this.zipInput.files[0]);
      }
    });
  }

  /**
   * Sets up GitHub/GitLab public repo URL fetcher (Task T039)
   */
  setupGithubInput() {
    if (!this.githubBtn || !this.githubInput) return;

    const triggerFetch = async () => {
      const url = this.githubInput.value.trim();
      if (!url) {
        alert('Please enter a public GitHub or GitLab repository URL (e.g. https://github.com/owner/repo)');
        return;
      }
      soundEngine.playClick();
      await this.handleGitUrl(url);
    };

    this.githubBtn.addEventListener('click', triggerFetch);
    this.githubInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerFetch();
      }
    });
  }

  /**
   * Handles FileSystemDirectoryEntry from drag & drop
   */
  async handleDirectoryEntry(dirEntry) {
    this.showScanningModal(dirEntry.name);
    soundEngine.playWhoosh();

    const startTime = performance.now();
    try {
      const tree = await scanDirectoryEntry(dirEntry);
      await this.processTreeAndLaunch(tree, startTime);
    } catch (err) {
      console.error('[LandingController] Directory scan failed:', err);
      alert('Could not scan directory: ' + (err.message || 'Permission denied or corrupted folder'));
      if (this.scanModal) this.scanModal.style.display = 'none';
    }
  }

  /**
   * Handles FileList from folder input
   */
  async handleFileList(files) {
    if (!files || !files.length) return;
    const rootName = files[0].webkitRelativePath 
      ? files[0].webkitRelativePath.split('/')[0] 
      : 'Dropped Project';

    this.showScanningModal(rootName);
    soundEngine.playWhoosh();

    const startTime = performance.now();
    try {
      const tree = parseFileListToTree(files);
      await this.processTreeAndLaunch(tree, startTime);
    } catch (err) {
      console.error('[LandingController] File list processing failed:', err);
      alert('Could not process folder: ' + (err.message || 'Failed to read files'));
      if (this.scanModal) this.scanModal.style.display = 'none';
    }
  }

  /**
   * Handles client-side in-memory extraction of .zip files (Task T037 / T039)
   */
  async handleZipFile(file) {
    this.showScanningModal(file.name);
    soundEngine.playWhoosh();

    const startTime = performance.now();
    try {
      this.updateScanStep('Decompressing Zip archive in client memory (Zero-Upload)...');
      const tree = await extractZipFileToTree(file);
      await this.processTreeAndLaunch(tree, startTime);
    } catch (err) {
      console.error('[LandingController] Zip extraction failed:', err);
      alert('Could not extract Zip file: ' + err.message);
      if (this.scanModal) this.scanModal.style.display = 'none';
    }
  }

  /**
   * Handles client-side ingestion of public Git repositories (Task T038 / T039)
   */
  async handleGitUrl(url) {
    this.showScanningModal(url);
    soundEngine.playWhoosh();

    const startTime = performance.now();
    try {
      this.updateScanStep('Contacting Git API & cloning recursive tree...');
      const { root, meta, rawPackageJson, rawRequirementsTxt } = await ingestGitRepository(url);
      await this.processTreeAndLaunch(root, startTime, rawPackageJson, rawRequirementsTxt);
    } catch (err) {
      console.error('[LandingController] Git fetch failed:', err);
      alert('Git Repository Import Error: ' + err.message);
      if (this.scanModal) this.scanModal.style.display = 'none';
    }
  }

  /**
   * Processes the parsed file tree and launches presentation
   */
  async processTreeAndLaunch(tree, startTime, preloadedPkg = '', preloadedReq = '') {
    this.updateScanStep('Inspecting manifest dependencies & AST structures...');

    // Try reading package.json and requirements.txt if present
    let rawPackageJson = preloadedPkg;
    let rawRequirementsTxt = preloadedReq;

    if (!rawPackageJson) {
      const pkgNode = this.findFileNode(tree, 'package.json');
      if (pkgNode) {
        rawPackageJson = pkgNode._cachedText || (pkgNode.text ? await pkgNode.text() : await readFileText(pkgNode));
      }
    }

    if (!rawRequirementsTxt) {
      const reqNode = this.findFileNode(tree, 'requirements.txt');
      if (reqNode) {
        rawRequirementsTxt = reqNode._cachedText || (reqNode.text ? await reqNode.text() : await readFileText(reqNode));
      }
    }

    this.updateScanStep('Running Polymorphic Classifier Engine...');
    const classification = classifyProject(tree, rawPackageJson, rawRequirementsTxt);

    const scanDuration = Math.round(performance.now() - startTime);

    const manifest = {
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      name: tree.name || 'Universal Project',
      tagline: ARCHETYPE_METADATA[classification.archetype].description,
      category: ARCHETYPE_METADATA[classification.archetype].name,
      archetype: classification.archetype,
      confidenceScore: classification.confidenceScore,
      detectedFrameworks: classification.detectedFrameworks,
      techStack: classification.techStack,
      stats: {
        totalFiles: classification.stats.totalFiles,
        languageBreakdown: classification.stats.languageBreakdown,
        estimatedRunTimeMs: scanDuration
      },
      fileTree: tree,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.updateScanStep('Synthesizing 2D Living Pipeline & 3D Holodeck...');
    const pipelineGraph = synthesizePipelineGraph(manifest);

    // Save to local vault
    await projectVault.saveProject(manifest, pipelineGraph);

    this.showScanSuccess(manifest);
    soundEngine.playSuccess();

    setTimeout(() => {
      window.location.href = `stage.html?id=${manifest.id}`;
    }, 1200);
  }

  /**
   * Sets up 1-Click Instant Demo Showcase cards
   */
  setupDemoCards() {
    const demoContainer = document.getElementById('demoContainer');
    if (!demoContainer) return;

    demoContainer.innerHTML = '';
    SAMPLE_PROJECTS.forEach(demo => {
      const card = document.createElement('div');
      card.className = 'cyber-card';
      card.style.cursor = 'pointer';

      const meta = ARCHETYPE_METADATA[demo.archetype];

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <span class="cyber-badge" style="color: ${meta.badgeColor}; border-color: ${meta.badgeColor};">
            ${meta.shortName}
          </span>
          <span style="font-size: 12px; color: var(--accent-emerald); font-weight: 600;">
            ${Math.round(demo.confidenceScore * 100)}% Match
          </span>
        </div>
        <h3 style="font-size: 18px; margin-bottom: 8px;">${demo.name}</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 18px; min-height: 40px;">${demo.tagline}</p>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
          ${demo.techStack.map(t => `
            <span style="font-size: 11px; padding: 2px 8px; background: rgba(255,255,255,0.06); border-radius: 4px; color: ${t.color}">
              ${t.name}
            </span>
          `).join('')}
        </div>
        <button class="btn btn-primary" style="width: 100%; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; gap: 6px;" data-demo-id="${demo.id}">
          <span>Launch Live Presentation</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      `;

      card.querySelector('button').addEventListener('click', async (e) => {
        e.stopPropagation();
        soundEngine.playClick();
        await this.launchDemoProject(demo);
      });

      card.addEventListener('click', async () => {
        soundEngine.playClick();
        await this.launchDemoProject(demo);
      });

      demoContainer.appendChild(card);
    });
  }

  /**
   * Sets up real-time Ingestion Stress Benchmarking & Telemetry HUD (Task T153)
   */
  setupBenchmarkHUD() {
    const scaleButtons = document.querySelectorAll('.btn-scale-select');
    const archSelect = document.getElementById('benchmarkArchetypeSelect');
    const runBtn = document.getElementById('btnRunBenchmark');
    const statusEl = document.getElementById('benchmarkStatusIndicator');

    const durationEl = document.getElementById('metricBenchDuration');
    const qpsEl = document.getElementById('metricBenchQps');
    const memoryEl = document.getElementById('metricBenchMemory');
    const confidenceEl = document.getElementById('metricBenchConfidence');
    const archetypeEl = document.getElementById('metricBenchArchetype');

    if (!runBtn) return;

    scaleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        soundEngine.playClick();
        scaleButtons.forEach(b => {
          b.classList.remove('active');
          b.style.borderColor = 'transparent';
          b.style.color = '#F8FAFC';
        });
        btn.classList.add('active');
        btn.style.borderColor = 'var(--accent-cyan)';
        btn.style.color = 'var(--accent-cyan)';
        this.selectedBenchmarkScale = parseInt(btn.dataset.scale, 10) || 500;
      });
    });

    runBtn.addEventListener('click', async () => {
      soundEngine.playClick();
      runBtn.disabled = true;
      runBtn.style.opacity = '0.6';
      if (statusEl) {
        statusEl.textContent = 'RUNNING BENCHMARK...';
        statusEl.style.color = 'var(--accent-amber)';
      }

      if (durationEl) durationEl.textContent = 'Measuring...';
      if (qpsEl) qpsEl.textContent = 'Calculating...';

      try {
        const arch = archSelect ? archSelect.value : 'polyglot';
        const res = await stressBenchmarker.runBenchmark(this.selectedBenchmarkScale, arch);

        soundEngine.playSuccess();

        if (durationEl) durationEl.textContent = `${res.durationMs} ms`;
        if (qpsEl) qpsEl.textContent = `${res.traversalQps.toLocaleString()} QPS`;
        if (memoryEl) memoryEl.textContent = `+${res.memoryDeltaMb} MB`;
        if (confidenceEl) confidenceEl.textContent = `${Math.round(res.confidenceScore * 100)}%`;
        if (archetypeEl) {
          archetypeEl.textContent = `Classified as ${res.archetypeDetected}`;
          archetypeEl.style.color = 'var(--accent-cyan)';
        }

        if (statusEl) {
          statusEl.textContent = `VERIFIED PASSED (${res.fileCount} Files in ${res.durationMs}ms)`;
          statusEl.style.color = '#10B981';
        }
      } catch (err) {
        console.error('[LandingController] Benchmark failed:', err);
        if (statusEl) {
          statusEl.textContent = 'BENCHMARK ERROR';
          statusEl.style.color = '#EF4444';
        }
      } finally {
        runBtn.disabled = false;
        runBtn.style.opacity = '1';
      }
    });
  }

  async launchDemoProject(demo) {
    this.showScanningModal(demo.name);
    soundEngine.playWhoosh();

    const manifest = {
      ...demo,
      fileTree: { name: demo.name, path: '/', isDirectory: true, children: [] },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const pipelineGraph = synthesizePipelineGraph(manifest);
    await projectVault.saveProject(manifest, pipelineGraph);

    setTimeout(() => {
      this.showScanSuccess(manifest);
      soundEngine.playSuccess();
      setTimeout(() => {
        window.location.href = `stage.html?id=${manifest.id}`;
      }, 1000);
    }, 600);
  }

  /**
   * Modal feedback handlers
   */
  showScanningModal(name) {
    if (!this.scanModal) return;
    this.scanModal.style.display = 'flex';
    document.getElementById('modalProjectName').textContent = name;
    document.getElementById('modalStepText').textContent = 'Traversing directory structure in browser memory...';
    document.getElementById('modalProgressBar').style.width = '35%';
  }

  updateScanStep(text) {
    const el = document.getElementById('modalStepText');
    const bar = document.getElementById('modalProgressBar');
    if (el) el.textContent = text;
    if (bar) bar.style.width = '75%';
  }

  showScanSuccess(manifest) {
    const meta = ARCHETYPE_METADATA[manifest.archetype];
    const el = document.getElementById('modalStepText');
    const bar = document.getElementById('modalProgressBar');
    if (el) el.innerHTML = `<strong style="color: ${meta.badgeColor}">Classified as ${meta.name} (${Math.round(manifest.confidenceScore * 100)}% Confidence)</strong>. Launching Stage...`;
    if (bar) bar.style.width = '100%';
  }

  setupAudioToggle() {
    if (!this.soundToggleBtn) return;
    this.soundToggleBtn.addEventListener('click', () => {
      this.isMuted = !this.isMuted;
      soundEngine.setMuted(this.isMuted);
      soundEngine.playClick();
      this.soundToggleBtn.innerHTML = this.isMuted
        ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px;"><line x1="1" y1="1" x2="23" y2="23"/><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg><span>Sound Muted</span>'
        : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg><span>Audio FX On</span>';
      this.soundToggleBtn.classList.toggle('badge-emerald', !this.isMuted);
    });
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.scanModal) {
        this.scanModal.style.display = 'none';
      }
    });
  }

  /**
   * Sets up 1-Click Executive Keynote Template Modal (Phase 32, T158)
   */
  setupTemplateModal() {
    const openBtn = document.getElementById('btnOpenKeynoteTemplates');
    const closeBtn = document.getElementById('btnCloseTemplateModal');
    const modal = document.getElementById('templateModal');
    const grid = document.getElementById('templateCardsGrid');

    if (!modal) return;

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        soundEngine.playClick();
        this.renderTemplateCards(grid);
        modal.style.display = 'flex';
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        soundEngine.playClick();
        modal.style.display = 'none';
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
      }
    });
  }

  renderTemplateCards(grid) {
    if (!grid) return;
    grid.innerHTML = '';
    const templates = executiveDeckLibrary.getAllTemplates();

    templates.forEach(tpl => {
      const card = document.createElement('div');
      card.className = 'cyber-card';
      card.style.background = 'rgba(14, 21, 36, 0.9)';
      card.style.border = '1px solid #1E2D44';
      card.style.padding = '20px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.justifyContent = 'space-between';
      card.style.borderRadius = '12px';

      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
            <span class="cyber-badge" style="color: ${tpl.badgeColor}; border-color: ${tpl.badgeColor}; font-size: 10px;">
              ${tpl.badge}
            </span>
            <span style="font-size: 11px; color: #64748B; font-family: var(--font-mono);">
              ${tpl.estimatedDurationMins}m • ${tpl.slidesCount} Slides
            </span>
          </div>

          <h4 style="font-size: 17px; font-weight: 700; color: #F8FAFC; margin: 0 0 4px 0;">${tpl.title}</h4>
          <p style="font-size: 12px; color: var(--text-muted); margin: 0 0 14px 0; line-height: 1.4;">${tpl.subtitle}</p>

          <div style="font-size: 11px; color: #94A3B8; margin-bottom: 12px; padding: 6px 10px; background: rgba(255,255,255,0.03); border-radius: 6px; border-left: 2px solid ${tpl.badgeColor};">
            <strong>Audience:</strong> ${tpl.targetAudience}
          </div>

          <!-- Metrics Pills -->
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px;">
            ${tpl.metricsPills.map(m => `
              <span style="font-size: 10px; padding: 3px 8px; background: #0A1120; border: 1px solid #172438; border-radius: 4px; color: ${m.color}; font-family: var(--font-mono);">
                ${m.label}: <strong>${m.value}</strong>
              </span>
            `).join('')}
          </div>
        </div>

        <button type="button" class="btn btn-primary btn-launch-template" data-template-id="${tpl.id}" style="width: 100%; height: 34px; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; margin-top: 10px;">
          <span>Launch Keynote Stage</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      `;

      card.querySelector('.btn-launch-template').addEventListener('click', async (e) => {
        e.stopPropagation();
        soundEngine.playClick();
        await this.launchTemplateKeynote(tpl.id);
      });

      card.addEventListener('click', async () => {
        soundEngine.playClick();
        await this.launchTemplateKeynote(tpl.id);
      });

      grid.appendChild(card);
    });
  }

  async launchTemplateKeynote(templateId) {
    const modal = document.getElementById('templateModal');
    if (modal) modal.style.display = 'none';

    const manifest = executiveDeckLibrary.synthesizeManifest(templateId);
    this.showScanningModal(manifest.name);
    soundEngine.playWhoosh();

    const pipelineGraph = synthesizePipelineGraph(manifest);
    await projectVault.saveProject(manifest, pipelineGraph);

    setTimeout(() => {
      this.showScanSuccess(manifest);
      soundEngine.playSuccess();
      setTimeout(() => {
        window.location.href = `stage.html?id=${manifest.id}`;
      }, 800);
    }, 500);
  }

  findFileNode(root, targetName) {
    if (!root) return null;
    if (root.name && root.name.toLowerCase() === targetName.toLowerCase()) {
      return root;
    }
    if (root.children) {
      for (const child of root.children) {
        const found = this.findFileNode(child, targetName);
        if (found) return found;
      }
    }
    return null;
  }
}

// Instantiate and initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const controller = new LandingController();
  controller.init();
});
