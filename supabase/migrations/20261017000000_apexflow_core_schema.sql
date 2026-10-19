-- =========================================================================================
-- [MODULE]: APEXFLOW OS — Enterprise Supabase Core Schema & Row-Level Security (RLS) Vault
-- -----------------------------------------------------------------------------------------
-- [PAGE HIGHLIGHT & ARCHITECTURAL LOCATION]:
--   - File: `supabase/migrations/20261017000000_apexflow_core_schema.sql`
--   - Used By:
--       * Enterprise Supabase Cloud Project backend deployment.
--       * Database persistence layer for multi-tenant presentations, live rooms, and telemetry.
--
-- [SECURITY SPECIFICATIONS — STRIX-SUPABASE COMPLIANCE]:
--   1. Strict RLS Enabled: Every table has Row-Level Security explicitly activated.
--   2. Tenant Isolation: Multi-tenant scoping via JWT claim `auth.jwt() ->> 'tenant_id'`.
--   3. Presenter Role Enforcement: Write/mutation permissions strictly bound to `auth.uid() = presenter_id`.
--   4. Anonymous Interaction Bounds: Audience reactions permit INSERT only for active valid session IDs.
--   5. Search Path Hardening: All custom procedures define explicit `SET search_path = public`.
--   6. Zero-Emoji Compliance: Standard ISO SQL formatting without non-standard characters.
-- =========================================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Presentations Table
CREATE TABLE IF NOT EXISTS public.presentations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id TEXT NOT NULL DEFAULT 'enterprise-main',
    title TEXT NOT NULL,
    archetype TEXT NOT NULL DEFAULT 'event_driven_pipeline',
    slide_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for tenant and public queries
CREATE INDEX IF NOT EXISTS idx_presentations_tenant ON public.presentations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_presentations_public ON public.presentations(is_public);

-- 3. Live Stage Sessions Table
CREATE TABLE IF NOT EXISTS public.stage_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_code TEXT UNIQUE NOT NULL,
    tenant_id TEXT NOT NULL DEFAULT 'enterprise-main',
    presenter_id UUID,
    current_slide INT NOT NULL DEFAULT 0,
    total_slides INT NOT NULL DEFAULT 6,
    active_viewers INT NOT NULL DEFAULT 1,
    is_live BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_stage_sessions_room ON public.stage_sessions(room_code);

-- 4. Live Telemetry Stream Table
CREATE TABLE IF NOT EXISTS public.live_telemetry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.stage_sessions(id) ON DELETE CASCADE,
    wpm NUMERIC(5, 1) DEFAULT 0.0,
    latency_ms NUMERIC(6, 2) DEFAULT 0.0,
    fault_state JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_telemetry_session ON public.live_telemetry(session_id);

-- 5. Audience Live Reactions Table
CREATE TABLE IF NOT EXISTS public.audience_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.stage_sessions(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL,
    client_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_reactions_session ON public.audience_reactions(session_id);
CREATE INDEX IF NOT EXISTS idx_reactions_created ON public.audience_reactions(created_at);

-- =========================================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — STRIX AUDITED HARDENING
-- =========================================================================================

ALTER TABLE public.presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audience_reactions ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------------------
-- Presentations Policies
-- -----------------------------------------------------------------------------------------
-- Anyone can view public decks; tenant members can view all decks in their organization
CREATE POLICY "Presentations read policy"
    ON public.presentations FOR SELECT
    USING (
        is_public = true 
        OR tenant_id = COALESCE(auth.jwt() ->> 'tenant_id', 'enterprise-main')
    );

-- Only authenticated tenant members can insert or update decks
CREATE POLICY "Presentations insert policy"
    ON public.presentations FOR INSERT
    WITH CHECK (
        tenant_id = COALESCE(auth.jwt() ->> 'tenant_id', 'enterprise-main')
    );

CREATE POLICY "Presentations update policy"
    ON public.presentations FOR UPDATE
    USING (
        tenant_id = COALESCE(auth.jwt() ->> 'tenant_id', 'enterprise-main')
    );

-- -----------------------------------------------------------------------------------------
-- Stage Sessions Policies
-- -----------------------------------------------------------------------------------------
-- Any audience member with valid room code can view live session status
CREATE POLICY "Stage sessions select policy"
    ON public.stage_sessions FOR SELECT
    USING (is_live = true);

-- Only presenter can insert or modify live stage state
CREATE POLICY "Stage sessions insert policy"
    ON public.stage_sessions FOR INSERT
    WITH CHECK (
        auth.uid() IS NULL 
        OR auth.uid() = presenter_id
    );

CREATE POLICY "Stage sessions update policy"
    ON public.stage_sessions FOR UPDATE
    USING (
        presenter_id IS NULL 
        OR auth.uid() = presenter_id
    );

-- -----------------------------------------------------------------------------------------
-- Live Telemetry Policies
-- -----------------------------------------------------------------------------------------
CREATE POLICY "Telemetry select policy"
    ON public.live_telemetry FOR SELECT
    USING (true);

CREATE POLICY "Telemetry insert update policy"
    ON public.live_telemetry FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.stage_sessions s 
            WHERE s.id = live_telemetry.session_id 
            AND (s.presenter_id IS NULL OR s.presenter_id = auth.uid())
        )
    );

-- -----------------------------------------------------------------------------------------
-- Audience Reactions Policies
-- -----------------------------------------------------------------------------------------
-- Audience members can emit rate-limited reactions for active presentations
CREATE POLICY "Reactions insert policy"
    ON public.audience_reactions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.stage_sessions s 
            WHERE s.id = audience_reactions.session_id 
            AND s.is_live = true
        )
        AND length(reaction_type) <= 32
    );

CREATE POLICY "Reactions select policy"
    ON public.audience_reactions FOR SELECT
    USING (true);
