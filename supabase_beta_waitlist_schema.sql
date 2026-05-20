-- ============================================================
-- AlgoPilot Beta Waitlist Schema — Production v2
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Drop old tables if you want a clean slate (OPTIONAL — comment out if you want to keep waitlist_users)
-- DROP TABLE IF EXISTS scan_usage_logs CASCADE;
-- DROP TABLE IF EXISTS beta_waitlist CASCADE;

-- 2. Create beta_waitlist table
CREATE TABLE IF NOT EXISTS beta_waitlist (
  id TEXT PRIMARY KEY DEFAULT ('bw_' || substr(md5(random()::text), 1, 12)),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  youtube_channel TEXT NOT NULL,
  niche TEXT NOT NULL DEFAULT 'Other',
  country TEXT NOT NULL DEFAULT 'Unknown',
  subscriber_count BIGINT NOT NULL DEFAULT 0,
  why_join TEXT NOT NULL DEFAULT '',
  consent_public_showcase BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending',
  daily_usage_limit INTEGER NOT NULL DEFAULT 3,
  usage_remaining INTEGER NOT NULL DEFAULT 3,
  beta_access_token TEXT,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  last_login TIMESTAMPTZ,
  total_scans_used INTEGER NOT NULL DEFAULT 0
);

-- 3. Create scan_usage_logs table
CREATE TABLE IF NOT EXISTS scan_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES beta_waitlist(id) ON DELETE CASCADE NOT NULL,
  scan_type TEXT NOT NULL DEFAULT 'thumbnail_analysis',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  niche TEXT,
  country TEXT
);

-- 4. Enable Row Level Security
ALTER TABLE beta_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_usage_logs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for beta_waitlist
-- Allow anonymous users to INSERT (waitlist form submissions)
DROP POLICY IF EXISTS "Allow public inserts on beta_waitlist" ON beta_waitlist;
CREATE POLICY "Allow public inserts on beta_waitlist"
  ON beta_waitlist FOR INSERT
  WITH CHECK (true);

-- Allow anyone to SELECT (admin dashboard reads with service key bypass)
DROP POLICY IF EXISTS "Allow public select on beta_waitlist" ON beta_waitlist;
CREATE POLICY "Allow public select on beta_waitlist"
  ON beta_waitlist FOR SELECT
  USING (true);

-- Allow updates (admin approvals/rejections via service role)
DROP POLICY IF EXISTS "Allow public update on beta_waitlist" ON beta_waitlist;
CREATE POLICY "Allow public update on beta_waitlist"
  ON beta_waitlist FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow deletes (admin)
DROP POLICY IF EXISTS "Allow public delete on beta_waitlist" ON beta_waitlist;
CREATE POLICY "Allow public delete on beta_waitlist"
  ON beta_waitlist FOR DELETE
  USING (true);

-- 6. RLS Policies for scan_usage_logs
DROP POLICY IF EXISTS "Allow public insert on scan_usage_logs" ON scan_usage_logs;
CREATE POLICY "Allow public insert on scan_usage_logs"
  ON scan_usage_logs FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on scan_usage_logs" ON scan_usage_logs;
CREATE POLICY "Allow public select on scan_usage_logs"
  ON scan_usage_logs FOR SELECT
  USING (true);

-- 7. Enable Realtime on beta_waitlist (for admin dashboard live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE beta_waitlist;

-- Done!
SELECT 'beta_waitlist and scan_usage_logs tables created successfully.' AS status;
