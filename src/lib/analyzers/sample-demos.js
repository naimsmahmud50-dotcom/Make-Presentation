/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Pre-bundled Instant Demo Vault
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Provides instant, zero-upload realistic showcase repositories that presenters can load
 * with a single click. Ideal for client sales pitches, conference tests, and quick demos
 * when no local folder is immediately available.
 *
 * [INCLUDED SHOWCASES]:
 *   1. Facebook Automation Bot (Type A: LangChain, Celery, PostgreSQL)
 *   2. Next.js 15 AI E-Commerce Engine (Type B: React 19, Tailwind, Responsive Frames)
 *   3. High-Throughput Payments Microservice (Type C: FastAPI, Redis, Stripe, Docker)
 *
 * [ENGINEERING NOTES]:
 * - To add a new pre-bundled demo, add an entry to `SAMPLE_PROJECTS`.
 * =========================================================================================
 */

import { ARCHETYPES } from '../types.js';

export const SAMPLE_PROJECTS = [
  {
    id: 'demo_fb_automation',
    name: 'Facebook AI Comment & Lead Bot',
    tagline: 'Autonomous Social Engagement & CRM Pipeline',
    category: 'Automation & AI',
    archetype: ARCHETYPES.TYPE_A_AUTOMATION,
    confidenceScore: 0.98,
    detectedFrameworks: ['langchain', 'celery', 'n8n', 'playwright', 'postgresql'],
    techStack: [
      { name: 'LangChain AI', category: 'ai', color: '#00F0FF', icon: 'cpu' },
      { name: 'Celery Distributed', category: 'automation', color: '#37B24D', icon: 'clock' },
      { name: 'Playwright Browser', category: 'automation', color: '#45BA4B', icon: 'globe' },
      { name: 'PostgreSQL DB', category: 'database', color: '#336791', icon: 'database' }
    ],
    stats: {
      totalFiles: 42,
      totalLinesOfCode: 3840,
      languageBreakdown: { py: 28, json: 8, sql: 4, sh: 2 },
      estimatedRunTimeMs: 1400
    },
    demoSandboxScript: `# Autonomous Lead Extraction Bot
import time
import json

def process_facebook_webhook(event_id):
    print(f"[TRIGGER] Inbound Facebook Webhook received (ID: {event_id})")
    time.sleep(0.05)
    print("[AI CORE] Tokenizer loaded 128 comment threads into LangChain agent")
    time.sleep(0.08)
    print("[AI CORE] Extracted high-intent customer lead: @sarah_designs")
    time.sleep(0.04)
    print("[DATABASE] Synced record to PostgreSQL [Latency: 14ms]")
    time.sleep(0.02)
    print("[DISPATCH] Sent direct booking link via Telegram & CRM [Status 200 OK]")
    return {"status": "SUCCESS", "lead_captured": True}

process_facebook_webhook("984128")`
  },
  {
    id: 'demo_next_store',
    name: 'Next.js 15 Luxury Storefront',
    tagline: 'Ultra-Responsive Headless Commerce with Retina Mockups',
    category: 'Web & E-Commerce',
    archetype: ARCHETYPES.TYPE_B_WEB_FRONTEND,
    confidenceScore: 0.97,
    detectedFrameworks: ['next', 'react', 'tailwindcss', 'typescript'],
    techStack: [
      { name: 'Next.js 15', category: 'core', color: '#FFFFFF', icon: 'layers' },
      { name: 'React 19', category: 'core', color: '#61DAFB', icon: 'atom' },
      { name: 'Tailwind CSS v4', category: 'utility', color: '#38BDF8', icon: 'wind' },
      { name: 'TypeScript', category: 'core', color: '#3178C6', icon: 'code' }
    ],
    stats: {
      totalFiles: 68,
      totalLinesOfCode: 5210,
      languageBreakdown: { tsx: 35, ts: 20, css: 8, json: 5 },
      estimatedRunTimeMs: 950
    },
    demoSandboxScript: `console.log("Next.js 15 App Router compiled successfully in 120ms.");`
  },
  {
    id: 'demo_fastapi_microservice',
    name: 'Enterprise Billing Gateway',
    tagline: 'High-Concurrency Distributed Payment Microservice',
    category: 'Backend Microservices',
    archetype: ARCHETYPES.TYPE_C_BACKEND_API,
    confidenceScore: 0.99,
    detectedFrameworks: ['fastapi', 'docker', 'redis', 'postgresql'],
    techStack: [
      { name: 'FastAPI', category: 'core', color: '#059669', icon: 'server' },
      { name: 'Redis Cache', category: 'database', color: '#DC2626', icon: 'database' },
      { name: 'Docker Engine', category: 'utility', color: '#2496ED', icon: 'box' }
    ],
    stats: {
      totalFiles: 34,
      totalLinesOfCode: 2950,
      languageBreakdown: { py: 24, yml: 6, dockerfile: 2, sh: 2 },
      estimatedRunTimeMs: 1100
    },
    demoSandboxScript: `# High-Throughput Payment Ingress Gateway
print("[GATEWAY] Ingress routing to payment worker cluster...")
print("[AUTH] Validated HMAC JWT signature from client")
print("[REDIS] Distributed lock acquired: lock_order_88192")
print("[SUCCESS] Dispatched ledger settlement event [200 OK]")`
  },
  {
    id: 'demo_fintech_mesh',
    name: 'Enterprise FinTech Payment Mesh',
    tagline: 'Multi-Region Distributed Transaction & Settlement Ledger',
    category: 'FinTech & Banking',
    archetype: ARCHETYPES.TYPE_C_BACKEND_API,
    confidenceScore: 0.99,
    detectedFrameworks: ['go', 'kafka', 'postgresql', 'redis', 'kubernetes'],
    techStack: [
      { name: 'Go Microservices', category: 'core', color: '#00ADD8', icon: 'cpu' },
      { name: 'Apache Kafka', category: 'automation', color: '#E42528', icon: 'layers' },
      { name: 'PostgreSQL Ledger', category: 'database', color: '#336791', icon: 'database' },
      { name: 'Redis Sharding', category: 'database', color: '#DC2626', icon: 'database' }
    ],
    stats: {
      totalFiles: 142,
      totalLinesOfCode: 12480,
      languageBreakdown: { go: 92, sql: 24, yml: 16, proto: 10 },
      estimatedRunTimeMs: 650
    },
    demoSandboxScript: `package main
import "fmt"
func main() {
    fmt.Println("[KAFKA] Event ingested: tx_payload_882910")
    fmt.Println("[SECURITY] Zero-Trust mTLS token verified across shards")
    fmt.Println("[SETTLEMENT] Two-Phase Commit completed: 4.2ms")
}`
  },
  {
    id: 'demo_ai_vision_agent',
    name: 'Autonomous AI Vision Agent',
    tagline: 'Multi-Modal Neural Inference & Visual Vector Search',
    category: 'AI & Data Science',
    archetype: ARCHETYPES.TYPE_D_DATA_ML,
    confidenceScore: 0.98,
    detectedFrameworks: ['pytorch', 'fastapi', 'celery', 'vector_db'],
    techStack: [
      { name: 'PyTorch 2.2', category: 'ai', color: '#EE4C2C', icon: 'cpu' },
      { name: 'FastAPI Ingress', category: 'core', color: '#059669', icon: 'server' },
      { name: 'Qdrant VectorDB', category: 'database', color: '#DC2626', icon: 'database' },
      { name: 'Celery Distributed', category: 'automation', color: '#37B24D', icon: 'clock' }
    ],
    stats: {
      totalFiles: 86,
      totalLinesOfCode: 8940,
      languageBreakdown: { py: 68, ipynb: 10, yml: 5, sh: 3 },
      estimatedRunTimeMs: 1250
    },
    demoSandboxScript: `# Neural Inference Pipeline
print("[INFERENCE] Loading ViT-Large-Patch16 transformer weights...")
print("[VISION] Processed 1080p frame embedding: 1536 dimensions")
print("[VECTOR SEARCH] Cosine similarity top-1 match: 0.964 confidence")
print("[DISPATCH] Real-time bounding box telemetry broadcasted")`
  },
  {
    id: 'demo_k8s_mesh',
    name: 'Cloud-Native Kubernetes Service Mesh',
    tagline: 'Zero-Trust Istio/Envoy Traffic Governor & Observability',
    category: 'Cloud Infrastructure',
    archetype: ARCHETYPES.TYPE_C_BACKEND_API,
    confidenceScore: 0.99,
    detectedFrameworks: ['go', 'grpc', 'envoy', 'prometheus', 'helm'],
    techStack: [
      { name: 'Go 1.22', category: 'core', color: '#00ADD8', icon: 'code' },
      { name: 'gRPC v1.62', category: 'core', color: '#244c5a', icon: 'layers' },
      { name: 'Envoy Proxy', category: 'utility', color: '#8b5cf6', icon: 'shield' },
      { name: 'Prometheus Metrics', category: 'utility', color: '#f59e0b', icon: 'activity' }
    ],
    stats: {
      totalFiles: 178,
      totalLinesOfCode: 15600,
      languageBreakdown: { go: 110, yml: 45, proto: 15, sh: 8 },
      estimatedRunTimeMs: 820
    },
    demoSandboxScript: `fmt.Println("[ENVOY] Route rule matched: /api/v2/workload")
fmt.Println("[CIRCUIT BREAKER] Error rate: 0.001% (threshold 5%)")
fmt.Println("[METRICS] Exported 48 Prometheus telemetry gauges")`
  },
  {
    id: 'demo_ecommerce_global',
    name: 'Global High-Scale Storefront',
    tagline: 'Distributed Edge Commerce with Stripe & Headless CMS',
    category: 'Web & E-Commerce',
    archetype: ARCHETYPES.TYPE_B_WEB_FRONTEND,
    confidenceScore: 0.98,
    detectedFrameworks: ['next', 'react', 'graphql', 'stripe', 'tailwindcss'],
    techStack: [
      { name: 'Next.js 15 App Router', category: 'core', color: '#FFFFFF', icon: 'layers' },
      { name: 'GraphQL Apollo', category: 'core', color: '#E10098', icon: 'atom' },
      { name: 'Stripe Elements', category: 'utility', color: '#635BFF', icon: 'credit-card' },
      { name: 'Tailwind CSS v4', category: 'utility', color: '#38BDF8', icon: 'wind' }
    ],
    stats: {
      totalFiles: 115,
      totalLinesOfCode: 9840,
      languageBreakdown: { tsx: 62, ts: 30, css: 12, json: 11 },
      estimatedRunTimeMs: 780
    },
    demoSandboxScript: `console.log("[EDGE ROUTER] Rendered ISR catalog page in 18ms");
console.log("[CHECKOUT] Stripe payment intent tokenized: pi_991823");
console.log("[CART] Synced state across 4 global edge nodes");`
  }
];
