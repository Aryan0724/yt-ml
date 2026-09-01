-- ============================================================
-- PreYT V2: Telemetry Schema (Phase 3)
-- Orchestrated observability for the ML and AI pipelines
-- Run this in Supabase SQL Editor
-- ============================================================

-- 0. ENUM TYPES
CREATE TYPE analysis_status AS ENUM ('success', 'fallback', 'error');
CREATE TYPE ai_error_type AS ENUM ('quota_exhausted', 'authentication', 'timeout', 'rate_limit', 'validation', 'provider_error', 'unknown');

-- 1. ANALYSES TABLE
-- Tracks the overall lifecycle of an HTTP request.
CREATE TABLE IF NOT EXISTS analyses (
    analysis_id UUID PRIMARY KEY,
    user_id TEXT, -- Nullable, for future auth binding
    workspace_id UUID, -- Nullable, for future multitenancy
    project_id UUID, -- Nullable, for future projects
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status analysis_status NOT NULL,
    engine_version TEXT NOT NULL,
    schema_version TEXT NOT NULL,
    input_hash TEXT NOT NULL,
    image_dimensions TEXT,
    input_metadata JSONB DEFAULT '{}'::JSONB,
    engine_result JSONB DEFAULT '{}'::JSONB,
    final_result JSONB DEFAULT '{}'::JSONB,
    latency_ms INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS for analyses
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Server-side routes are allowed to insert and select
DROP POLICY IF EXISTS "Allow service role insert for analyses" ON analyses;
CREATE POLICY "Allow service role insert for analyses"
    ON analyses FOR ALL
    USING (true)
    WITH CHECK (true);

-- Index for analytics querying
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_status ON analyses (status);

-- 2. AI REQUESTS TABLE
-- Tracks every generative AI interaction linked to an analysis
CREATE TABLE IF NOT EXISTS ai_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID REFERENCES analyses(analysis_id) ON DELETE CASCADE,
    source TEXT NOT NULL DEFAULT 'unknown',
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    prompt_version TEXT NOT NULL,
    status analysis_status NOT NULL,
    latency_ms INTEGER NOT NULL DEFAULT 0,
    retry_count INTEGER NOT NULL DEFAULT 0,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    error_type ai_error_type,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for ai_requests
ALTER TABLE ai_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service role all for ai_requests" ON ai_requests;
CREATE POLICY "Allow service role all for ai_requests"
    ON ai_requests FOR ALL
    USING (true)
    WITH CHECK (true);

-- Index for AI analytics
CREATE INDEX IF NOT EXISTS idx_ai_requests_analysis_id ON ai_requests (analysis_id);

-- 3. AI ERRORS TABLE
-- Deep debugging trace for AI failures
CREATE TABLE IF NOT EXISTS ai_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID REFERENCES analyses(analysis_id) ON DELETE CASCADE,
    ai_request_id UUID REFERENCES ai_requests(id) ON DELETE CASCADE,
    error_type ai_error_type NOT NULL,
    source TEXT NOT NULL DEFAULT 'unknown',
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for ai_errors
ALTER TABLE ai_errors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service role all for ai_errors" ON ai_errors;
CREATE POLICY "Allow service role all for ai_errors"
    ON ai_errors FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_ai_errors_analysis_id ON ai_errors (analysis_id);

SELECT 'Telemetry tables created successfully.' AS status;
