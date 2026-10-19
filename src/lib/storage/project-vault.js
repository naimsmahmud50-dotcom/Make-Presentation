/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Project Vault Storage Manager (IndexedDB / LocalStorage)
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Handles local persistence of imported projects, slide customizations, viewer telemetries,
 * and white-label branding tokens inside the browser.
 *
 * [ZERO-UPLOAD PRIVACY]:
 * All records remain strictly in the local client database. No data is sent to external
 * databases or cloud servers.
 *
 * [STORAGE STRATEGY]:
 * - Primary Engine: IndexedDB (Database: `ApexFlowOS_Vault`, Store: `projects`)
 * - Secondary Fallback: localStorage (for private browsing or older environments)
 *
 * [ENGINEERING NOTES]:
 * - Use `saveProject(manifest, graph, config)` to persist any newly imported project.
 * - Use `listAllProjects()` to populate the Enterprise Admin Vault library.
 * =========================================================================================
 */

import { SAMPLE_PROJECTS } from '../analyzers/sample-demos.js';
import { synthesizePipelineGraph } from '../analyzers/pipeline-synthesizer.js';
import { inputShield } from '../security/input-shield.js';

const DB_NAME = 'ApexFlowOS_Vault';
const DB_VERSION = 1;
const STORE_PROJECTS = 'projects';

class ProjectVaultStorage {
  constructor() {
    this.db = null;
    this.isReady = false;
  }

  /**
   * Initializes the IndexedDB instance
   * @returns {Promise<IDBDatabase>}
   */
  async init() {
    if (this.db) return this.db;
    if (typeof window === 'undefined' || !window.indexedDB) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
          const store = db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
          store.createIndex('archetype', 'archetype', { unique: false });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.isReady = true;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.warn('[ProjectVault] IndexedDB initialization failed, falling back to localStorage', event);
        resolve(null);
      };
    });
  }

  /**
   * Persists a project manifest and associated data with deep zero-trust sanitization
   * @param {Object} manifest
   * @param {Object} pipelineGraph
   * @param {Object} presentationConfig
   * @returns {Promise<boolean>}
   */
  async saveProject(manifest, pipelineGraph = null, presentationConfig = null) {
    if (!manifest || typeof manifest !== 'object') {
      console.warn('[ProjectVault] Ignored save of null/invalid manifest');
      return false;
    }

    const safeManifest = inputShield.deepSanitizeObject(manifest);
    if (!safeManifest.id) {
      safeManifest.id = 'proj_' + Math.random().toString(36).substring(2, 9);
    }

    const record = {
      id: safeManifest.id,
      name: safeManifest.name || 'Untitled Presentation',
      tagline: safeManifest.tagline || '',
      archetype: safeManifest.archetype || 'TYPE_A_ENTERPRISE_PIPELINE',
      manifest: safeManifest,
      pipelineGraph: pipelineGraph ? inputShield.deepSanitizeObject(pipelineGraph) : null,
      presentationConfig: presentationConfig ? inputShield.deepSanitizeObject(presentationConfig) : null,
      updatedAt: Date.now()
    };

    const db = await this.init();
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_PROJECTS, 'readwrite');
        const store = tx.objectStore(STORE_PROJECTS);
        const req = store.put(record);
        req.onsuccess = () => resolve(true);
        req.onerror = () => {
          this.saveToLocalStorage(record);
          resolve(true);
        };
      });
    } else {
      this.saveToLocalStorage(record);
      return true;
    }
  }

  /**
   * Automatically seeds pre-bundled sample presentations into the vault
   * @returns {Promise<Array<Object>>}
   */
  async seedDefaultDemos() {
    const seeded = [];
    for (const sample of SAMPLE_PROJECTS) {
      const graph = synthesizePipelineGraph(sample);
      await this.saveProject(sample, graph);
      seeded.push({
        id: sample.id,
        name: sample.name,
        tagline: sample.tagline,
        archetype: sample.archetype,
        manifest: sample,
        pipelineGraph: graph,
        updatedAt: Date.now()
      });
    }
    return seeded;
  }

  /**
   * Retrieves a single project by ID
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getProject(id) {
    let project = null;
    const db = await this.init();
    if (db) {
      project = await new Promise((resolve) => {
        const tx = db.transaction(STORE_PROJECTS, 'readonly');
        const store = tx.objectStore(STORE_PROJECTS);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || this.getFromLocalStorage(id));
        req.onerror = () => resolve(this.getFromLocalStorage(id));
      });
    } else {
      project = this.getFromLocalStorage(id);
    }

    if (!project) {
      const sample = SAMPLE_PROJECTS.find(s => s.id === id);
      if (sample) {
        const graph = synthesizePipelineGraph(sample);
        await this.saveProject(sample, graph);
        return {
          id: sample.id,
          name: sample.name,
          tagline: sample.tagline,
          archetype: sample.archetype,
          manifest: sample,
          pipelineGraph: graph,
          updatedAt: Date.now()
        };
      }
    }
    return project;
  }

  /**
   * Lists all saved projects ordered by latest updated.
   * Auto-seeds 3 rich master presentations if vault is currently empty.
   * @returns {Promise<Array<Object>>}
   */
  async listAllProjects() {
    const db = await this.init();
    if (db) {
      const list = await new Promise((resolve) => {
        const tx = db.transaction(STORE_PROJECTS, 'readonly');
        const store = tx.objectStore(STORE_PROJECTS);
        const req = store.getAll();
        req.onsuccess = () => {
          const items = req.result || [];
          items.sort((a, b) => b.updatedAt - a.updatedAt);
          resolve(items);
        };
        req.onerror = () => resolve(this.listFromLocalStorage());
      });

      if (!list || list.length === 0) {
        return await this.seedDefaultDemos();
      }
      return list;
    }

    const localList = this.listFromLocalStorage();
    if (!localList || localList.length === 0) {
      return await this.seedDefaultDemos();
    }
    return localList;
  }

  /**
   * Deletes a project by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteProject(id) {
    const db = await this.init();
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_PROJECTS, 'readwrite');
        const store = tx.objectStore(STORE_PROJECTS);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    }
    this.deleteFromLocalStorage(id);
    return true;
  }

  // LocalStorage Fallbacks
  saveToLocalStorage(record) {
    try {
      localStorage.setItem(`apex_proj_${record.id}`, JSON.stringify(record));
    } catch (e) {
      console.warn('[ProjectVault] LocalStorage quota exceeded', e);
    }
  }

  getFromLocalStorage(id) {
    try {
      const data = localStorage.getItem(`apex_proj_${id}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  listFromLocalStorage() {
    const list = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('apex_proj_')) {
          const item = JSON.parse(localStorage.getItem(key));
          if (item) list.push(item);
        }
      }
    } catch (e) {}
    list.sort((a, b) => b.updatedAt - a.updatedAt);
    return list;
  }

  deleteFromLocalStorage(id) {
    try {
      localStorage.removeItem(`apex_proj_${id}`);
    } catch (e) {}
  }
}

export const projectVault = new ProjectVaultStorage();
