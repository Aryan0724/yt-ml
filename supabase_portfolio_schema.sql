-- ==========================================
-- PREYT: PORTFOLIO SCHEMA UPDATE
-- ==========================================

-- Add the new column to the beta_waitlist table
ALTER TABLE beta_waitlist ADD COLUMN IF NOT EXISTS is_featured_in_portfolio BOOLEAN DEFAULT false;

-- We also need to refresh the postgrest cache if needed so the API detects the new columns
NOTIFY pgrst, 'reload schema';
