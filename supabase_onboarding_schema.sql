-- ==========================================
-- ⚡ ALGAPILOT CREATOR ONBOARDING SCHEMA MIGRATION
-- ==========================================

-- TABLE: waitlist_users
create table waitlist_users (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null unique,
  youtube_channel text not null,
  niche text not null,
  subscriber_count integer not null default 0,
  upload_frequency text not null,
  reason_for_joining text not null,
  status text not null default 'pending', -- 'pending', 'approved', 'rejected', 'suspended'
  applied_at timestamp with time zone not null default now(),
  approved_at timestamp with time zone,
  last_login timestamp with time zone,
  total_logins integer not null default 0,
  total_analyses integer not null default 0,
  last_analysis_at timestamp with time zone,
  notes text default '',
  beta_access_token text not null
);

-- TABLE: usage_logs
create table usage_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references waitlist_users(id) on delete cascade not null,
  event_type text not null, -- 'login', 'logout', 'thumbnail_analysis', 'comparison_analysis', 'feedback_submission'
  timestamp timestamp with time zone not null default now(),
  metadata jsonb default '{}'::jsonb
);

-- Enable Row Level Security (RLS)
alter table waitlist_users enable row level security;
alter table usage_logs enable row level security;

-- Policies for waitlist_users
create policy "Allow anonymous inserts to waitlist_users" 
  on waitlist_users for insert 
  with check (true);

create policy "Allow select check during login for waitlist_users"
  on waitlist_users for select
  using (true);

create policy "Allow update for auth users or service roles"
  on waitlist_users for update
  using (true)
  with check (true);

-- Policies for usage_logs
create policy "Allow insert for usage_logs"
  on usage_logs for insert
  with check (true);

create policy "Allow select for usage_logs"
  on usage_logs for select
  using (true);

-- TABLE: system_configs (OAuth & Features Storage)
create table if not exists system_configs (
  key text primary key,
  value jsonb default '{}'::jsonb
);

-- Enable RLS and add policies
alter table system_configs enable row level security;

create policy "Allow public read for system_configs"
  on system_configs for select
  using (true);

create policy "Allow all updates for service roles"
  on system_configs
  using (true)
  with check (true);

