/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Type C Interactive API Playground & SQL Schema Visualizer
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Provides specialized runtime interactive demonstration surfaces for Type C archetypes
 * (Backend APIs, Microservices, and Databases — FastAPI, Express, Django, Go, Docker):
 *   1. Live REST / GraphQL Endpoint Explorer with parameter payload tweaking.
 *   2. Interactive Send Request simulator with sub-20ms latency telemetry & JSON viewer.
 *   3. Relational SQL Database Schema Viewer showing tables, primary keys, and relations.
 *
 * [DESIGN SYSTEM]:
 * - High-contrast method badges (GET = #10B981, POST = #00F0FF, PUT = #F59E0B, DELETE = #EF4444).
 * - JetBrains Mono tabular data with terminal syntax styling.
 * - 100% Client-Side zero-latency execution.
 *
 * [ENGINEERING SPECIFICATIONS]:
 * - Mount with `mountApiPlayground(container, manifest)` into Stage 3 or Stage 4.
 * - Call `mountSqlSchemaViewer(container, manifest)` to render relational ER entity cards.
 * =========================================================================================
 */

import { soundEngine } from '../lib/audio/sound-synth.js';

export const SAMPLE_API_ENDPOINTS = [
  {
    id: 'ep-health',
    method: 'GET',
    path: '/api/v1/health',
    desc: 'Cluster liveness, readiness probe & database connection ping',
    headers: { 'Accept': 'application/json' },
    requestBody: null,
    latency: '4ms',
    status: 200,
    statusText: 'OK',
    response: {
      status: 'healthy',
      uptime_seconds: 384912,
      database: 'connected',
      redis_cache: 'synced',
      version: '1.4.2'
    }
  },
  {
    id: 'ep-auth',
    method: 'POST',
    path: '/api/v1/auth/token',
    desc: 'OAuth2 JWT token exchange with rate-limiting check',
    headers: { 'Content-Type': 'application/json' },
    requestBody: {
      client_id: 'client_apex_prod_09',
      grant_type: 'client_credentials',
      scope: 'write:transactions read:audit'
    },
    latency: '18ms',
    status: 200,
    statusText: 'OK',
    response: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-zG7...',
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'write:transactions read:audit'
    }
  },
  {
    id: 'ep-checkout',
    method: 'POST',
    path: '/api/v1/payments/process',
    desc: 'Idempotent card transaction dispatch via Stripe webhook broker',
    headers: { 'Content-Type': 'application/json', 'X-Idempotency-Key': 'key_984a1c' },
    requestBody: {
      order_id: 'ord_998124',
      amount_cents: 14900,
      currency: 'USD',
      customer_email: 'executive@enterprise.org'
    },
    latency: '24ms',
    status: 201,
    statusText: 'Created',
    response: {
      transaction_id: 'txn_349912803',
      order_id: 'ord_998124',
      status: 'settled',
      settlement_channel: 'visa_credit',
      fee_cents: 432,
      risk_score: 0.02
    }
  },
  {
    id: 'ep-orders',
    method: 'GET',
    path: '/api/v1/orders?status=active&limit=5',
    desc: 'High-throughput paginated query with secondary index lookup',
    headers: { 'Accept': 'application/json' },
    requestBody: null,
    latency: '12ms',
    status: 200,
    statusText: 'OK',
    response: {
      total_count: 1420,
      page: 1,
      items: [
        { id: 'ord_998124', status: 'settled', total: 149.00 },
        { id: 'ord_998123', status: 'fulfilled', total: 89.50 },
        { id: 'ord_998122', status: 'processing', total: 2450.00 }
      ]
    }
  }
];

export const SAMPLE_SQL_TABLES = [
  {
    tableName: 'users',
    desc: 'Core identity & API consumer credentials',
    columns: [
      { name: 'id', type: 'UUID', key: 'PK' },
      { name: 'email', type: 'VARCHAR(255)', key: 'UNIQUE' },
      { name: 'hashed_password', type: 'VARCHAR(255)', key: '' },
      { name: 'role', type: 'ENUM', key: '' },
      { name: 'created_at', type: 'TIMESTAMP', key: '' }
    ]
  },
  {
    tableName: 'orders',
    desc: 'Transactional purchase manifests',
    columns: [
      { name: 'id', type: 'UUID', key: 'PK' },
      { name: 'user_id', type: 'UUID', key: 'FK -> users.id' },
      { name: 'total_cents', type: 'BIGINT', key: '' },
      { name: 'status', type: 'VARCHAR(32)', key: '' },
      { name: 'currency', type: 'CHAR(3)', key: '' }
    ]
  },
  {
    tableName: 'audit_logs',
    desc: 'Cryptographic immutable operation ledger',
    columns: [
      { name: 'log_id', type: 'BIGSERIAL', key: 'PK' },
      { name: 'entity_id', type: 'UUID', key: 'INDEX' },
      { name: 'action', type: 'VARCHAR(64)', key: '' },
      { name: 'ip_address', type: 'INET', key: '' },
      { name: 'executed_at', type: 'TIMESTAMP', key: '' }
    ]
  }
];

/**
 * Mounts the Interactive API Endpoint Playground into a container
 * @param {HTMLElement} container
 * @param {Object} manifest
 */
export function mountApiPlayground(container, manifest = null) {
  if (!container) return;

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 320px 1fr; gap: 20px; height: 100%; min-height: 480px;">
      
      <!-- Left Column: Endpoints List -->
      <div class="cyber-card" style="padding: 16px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; background: #080D18;">
        <div style="font-size: 11px; font-weight: 700; color: #38BDF8; font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 4px;">
          API Route Registry
        </div>
        <div id="endpointListContainer" style="display: flex; flex-direction: column; gap: 8px;">
          ${SAMPLE_API_ENDPOINTS.map((ep, idx) => `
            <div class="api-endpoint-card ${idx === 0 ? 'active' : ''}" data-id="${ep.id}" style="padding: 10px 12px; background: ${idx === 0 ? 'rgba(0,240,255,0.08)' : '#0B1322'}; border: 1px solid ${idx === 0 ? 'var(--accent-cyan)' : '#1E2D44'}; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span class="cyber-badge" style="font-size: 10px; padding: 1px 6px; font-weight: 700; background: transparent; border-color: ${getMethodColor(ep.method)}; color: ${getMethodColor(ep.method)};">
                  ${ep.method}
                </span>
                <span style="font-family: var(--font-mono); font-size: 12px; color: #F8FAFC; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${ep.path}
                </span>
              </div>
              <div style="font-size: 11px; color: #64748B; line-height: 1.3;">
                ${ep.desc}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Right Column: Interactive Request & Response Workspace -->
      <div class="cyber-card" style="padding: 20px; display: flex; flex-direction: column; gap: 14px; background: #080D18;">
        
        <!-- Top Endpoint Info & Action Button -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span id="activeMethodBadge" class="cyber-badge" style="font-size: 11px; padding: 2px 8px; font-weight: 700; color: #10B981; border-color: #10B981;">
              GET
            </span>
            <span id="activePathText" style="font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: #F8FAFC;">
              /api/v1/health
            </span>
          </div>

          <button id="btnSendApiRequest" class="btn btn-primary" style="height: 36px; padding: 0 16px; font-size: 12px; display: inline-flex; align-items: center; gap: 6px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            <span>Send Request</span>
          </button>
        </div>

        <!-- Description Note -->
        <div id="activeDescText" style="font-size: 12px; color: #94A3B8;">
          Cluster liveness, readiness probe & database connection ping
        </div>

        <!-- Request Body / Headers View (collapsible) -->
        <div id="requestPayloadBox" style="background: #0B1322; border: 1px solid #1E2D44; border-radius: 8px; padding: 12px; display: none;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: #A855F7; margin-bottom: 6px; font-weight: 700;">REQUEST PAYLOAD (JSON)</div>
          <pre id="requestJsonPre" style="margin: 0; font-family: var(--font-mono); font-size: 12px; color: #CBD5E1;"></pre>
        </div>

        <!-- Response Console -->
        <div style="flex: 1; display: flex; flex-direction: column; background: #04070D; border: 1px solid #16243A; border-radius: 8px; padding: 14px; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid #1E2D44; padding-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 11px; font-family: var(--font-mono); color: #64748B;">RESPONSE:</span>
              <span id="resStatusBadge" class="cyber-badge badge-emerald" style="font-size: 10px; padding: 1px 6px;">200 OK</span>
            </div>
            <div style="font-size: 11px; font-family: var(--font-mono); color: #38BDF8;">
              LATENCY: <span id="resLatencySpan" style="font-weight: 700;">4ms</span>
            </div>
          </div>

          <pre id="responseJsonPre" style="flex: 1; margin: 0; font-family: var(--font-mono); font-size: 12px; color: #00F0FF; overflow-y: auto; line-height: 1.5;"></pre>
        </div>

      </div>

    </div>
  `;

  let currentEp = SAMPLE_API_ENDPOINTS[0];

  function renderActiveEndpoint(ep) {
    currentEp = ep;
    document.getElementById('activeMethodBadge').textContent = ep.method;
    document.getElementById('activeMethodBadge').style.color = getMethodColor(ep.method);
    document.getElementById('activeMethodBadge').style.borderColor = getMethodColor(ep.method);
    document.getElementById('activePathText').textContent = ep.path;
    document.getElementById('activeDescText').textContent = ep.desc;

    const payloadBox = document.getElementById('requestPayloadBox');
    if (ep.requestBody) {
      payloadBox.style.display = 'block';
      document.getElementById('requestJsonPre').textContent = JSON.stringify(ep.requestBody, null, 2);
    } else {
      payloadBox.style.display = 'none';
    }

    // Default response preview
    document.getElementById('resStatusBadge').textContent = `${ep.status} ${ep.statusText}`;
    document.getElementById('resLatencySpan').textContent = ep.latency;
    document.getElementById('responseJsonPre').textContent = JSON.stringify(ep.response, null, 2);
  }

  // Attach card clicks
  container.querySelectorAll('.api-endpoint-card').forEach(card => {
    card.addEventListener('click', () => {
      soundEngine.playClick();
      container.querySelectorAll('.api-endpoint-card').forEach(c => {
        c.style.borderColor = '#1E2D44';
        c.style.background = '#0B1322';
      });
      card.style.borderColor = 'var(--accent-cyan)';
      card.style.background = 'rgba(0,240,255,0.08)';

      const found = SAMPLE_API_ENDPOINTS.find(e => e.id === card.dataset.id);
      if (found) renderActiveEndpoint(found);
    });
  });

  // Attach Send button
  const sendBtn = container.querySelector('#btnSendApiRequest');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      soundEngine.playWhoosh();
      sendBtn.disabled = true;
      sendBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-telemetry"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle></svg><span>Transmitting...</span>`;

      const resBadge = document.getElementById('resStatusBadge');
      resBadge.textContent = '...';

      setTimeout(() => {
        soundEngine.playSuccess();
        sendBtn.disabled = false;
        sendBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg><span>Send Request</span>`;

        resBadge.textContent = `${currentEp.status} ${currentEp.statusText}`;
        document.getElementById('resLatencySpan').textContent = currentEp.latency;
        document.getElementById('responseJsonPre').textContent = JSON.stringify(currentEp.response, null, 2);
      }, 240);
    });
  }

  renderActiveEndpoint(currentEp);
}

/**
 * Returns consistent accent color per HTTP method
 */
function getMethodColor(method) {
  switch (method) {
    case 'GET': return '#10B981';
    case 'POST': return '#00F0FF';
    case 'PUT': return '#F59E0B';
    case 'DELETE': return '#EF4444';
    default: return '#A855F7';
  }
}

/**
 * Mounts Relational SQL Database Schema Viewer into a container
 * @param {HTMLElement} container
 */
export function mountSqlSchemaViewer(container) {
  if (!container) return;

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; padding: 10px 0;">
      ${SAMPLE_SQL_TABLES.map(tbl => `
        <div class="cyber-card" style="padding: 16px; background: #080D18; border-color: #1E2E48;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
              <span style="font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: #F8FAFC;">
                ${tbl.tableName}
              </span>
            </div>
            <span class="cyber-badge" style="font-size: 9px; padding: 1px 6px;">TABLE</span>
          </div>

          <div style="font-size: 11px; color: #64748B; margin-bottom: 12px;">
            ${tbl.desc}
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${tbl.columns.map(col => `
              <div style="display: flex; justify-content: space-between; font-size: 11px; font-family: var(--font-mono); padding: 4px 6px; background: #0B1322; border-radius: 4px;">
                <span style="color: #E2E8F0; font-weight: 600;">${col.name}</span>
                <div style="display: flex; gap: 8px;">
                  <span style="color: #38BDF8;">${col.type}</span>
                  ${col.key ? `<span style="color: #A855F7; font-weight: 700;">${col.key}</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
