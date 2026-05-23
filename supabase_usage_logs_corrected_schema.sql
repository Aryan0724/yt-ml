-- ============================================================
-- AlgoPilot Corrected Usage Logs Schema
-- Replaces the usage_logs definition from supabase_onboarding_schema.sql
-- This version correctly references beta_waitlist(id) which is TEXT not UUID
-- Run this in Supabase SQL Editor
-- ============================================================

-- Drop old table if using the legacy waitlist_users UUID reference
-- DROP TABLE IF EXISTS usage_logs CASCADE;

-- Create the corrected usage_logs table
CREATE TABLE IF NOT EXISTS usage_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     TEXT REFERENCES beta_waitlist(id) ON DELETE CASCADE NOT NULL,
  event_type  TEXT NOT NULL, -- 'login', 'logout', 'thumbnail_analysis', 'comparison_analysis', 'feedback_submission'
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata    JSONB DEFAULT '{}'::JSONB
);

-- Enable Row Level Security
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Allow inserts from server-side routes
DROP POLICY IF EXISTS "Allow insert for usage_logs" ON usage_logs;
CREATE POLICY "Allow insert for usage_logs"
  ON usage_logs FOR INSERT
  WITH CHECK (true);

-- Allow reads for admin dashboard
DROP POLICY IF EXISTS "Allow select for usage_logs" ON usage_logs;
CREATE POLICY "Allow select for usage_logs"
  ON usage_logs FOR SELECT
  USING (true);

-- Index for fast queries by user and time
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_timestamp ON usage_logs (timestamp DESC);

SELECT 'usage_logs table (corrected schema) created successfully.' AS status;
