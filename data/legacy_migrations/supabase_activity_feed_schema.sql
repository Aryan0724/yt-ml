-- ========================================================
-- ⚡ ALGAPILOT CREATOR INTELLIGENCE LIVE ACTIVITY FEED SCHEMA
-- ========================================================

-- Table to store real-time activities for social proof feed
create table if not exists activity_feed (
  id uuid default gen_random_uuid() primary key,
  user_id text references beta_waitlist(id) on delete set null,
  channel_id text, -- Custom YouTube handle/link
  country text not null, -- E.g. 'United States', 'India', 'Japan', etc.
  city text not null, -- E.g. 'Austin', 'Mumbai', 'Tokyo', etc.
  niche text not null, -- E.g. 'Gaming', 'Tech', 'Entertainment', 'Comedy'
  action_type text not null, -- E.g. 'analyzed_thumbnails', 'optimized_clarity', 'compared_titles', 'generated_strategy', 'applied_for_showcase'
  timestamp timestamp with time zone not null default now(),
  consent_public_showcase boolean not null default false,
  allow_live_feed boolean not null default false
);

-- Enable Row Level Security (RLS)
alter table activity_feed enable row level security;

-- Drop existing policies if they exist (prevents conflicts)
drop policy if exists "Allow public read access to activity_feed" on activity_feed;
drop policy if exists "Allow public insert to activity_feed" on activity_feed;

-- Create policies for public access
create policy "Allow public read access to activity_feed"
  on activity_feed for select
  using (true);

create policy "Allow public insert to activity_feed"
  on activity_feed for insert
  with check (true);

-- Create index on timestamp for rapid sorting
create index if not exists idx_activity_feed_timestamp on activity_feed(timestamp desc);
