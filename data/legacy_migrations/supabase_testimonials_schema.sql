-- Testimonials Schema for Supabase
-- Contains user reviews and social proof for the landing page

CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subs TEXT NOT NULL,
    text TEXT NOT NULL,
    img TEXT NOT NULL,
    handle TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active testimonials
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.testimonials FOR SELECT 
USING (active = true);

-- Allow authenticated admins to insert/update/delete
-- Assuming standard authenticated access, or a specific admin role
CREATE POLICY "Admins can insert testimonials" 
ON public.testimonials FOR INSERT 
WITH CHECK (true); -- In a real production app, restrict this via auth.uid()

CREATE POLICY "Admins can update testimonials" 
ON public.testimonials FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete testimonials" 
ON public.testimonials FOR DELETE 
USING (true);
