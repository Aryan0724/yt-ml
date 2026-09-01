-- ============================================================
-- AlgoPilot Analysis History Schema
-- Table referenced by lib/supabase.ts → saveAnalysisHistory / getAnalysisHistory
-- Run this in Supabase SQL Editor to create the missing table
-- ============================================================

CREATE TABLE IF NOT EXISTS analysis_history (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  niche       TEXT NOT NULL,
  sensitivity TEXT NOT NULL DEFAULT 'Balanced',
  score       INTEGER NOT NULL DEFAULT 0,
  tier        TEXT NOT NULL DEFAULT 'C',
  reliability TEXT NOT NULL DEFAULT 'Medium',
  risk_level  TEXT NOT NULL DEFAULT 'Medium',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (beta testers logging their runs)
DROP POLICY IF EXISTS "Allow public insert on analysis_history" ON analysis_history;
CREATE POLICY "Allow public insert on analysis_history"
  ON analysis_history FOR INSERT
  WITH CHECK (true);

-- Allow anyone to SELECT (dashboard history view)
DROP POLICY IF EXISTS "Allow public select on analysis_history" ON analysis_history;
CREATE POLICY "Allow public select on analysis_history"
  ON analysis_history FOR SELECT
  USING (true);

-- Index for fast history retrieval ordered by time
CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at
  ON analysis_history (created_at DESC);

SELECT 'analysis_history table created successfully.' AS status;
