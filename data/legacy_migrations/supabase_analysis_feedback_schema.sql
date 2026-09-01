-- Analysis Feedback Schema for Supabase
-- Stores user ratings and comments after receiving an analysis report

CREATE TABLE IF NOT EXISTS public.analysis_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id TEXT, -- Optional correlation to a specific analysis
    user_id TEXT, -- Optional user identifier if logged in
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.analysis_feedback ENABLE ROW LEVEL SECURITY;

-- Allow users to insert feedback
CREATE POLICY "Anyone can insert feedback" 
ON public.analysis_feedback FOR INSERT 
WITH CHECK (true);

-- Allow admins to read feedback
CREATE POLICY "Admins can view feedback" 
ON public.analysis_feedback FOR SELECT 
USING (true); -- In production, restrict to admin role
