-- ========================================================
-- ⚡ ALGAPILOT ENTERPRISE CMS & SEO OPERATING SYSTEM SCHEMA
-- ========================================================

-- Enable extensions if not exists
create extension if not exists "uuid-ossp";

-- 1. CMS ACCESS CONTROL (RBAC)
create table cms_users (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  full_name text not null,
  role text not null default 'Writer', -- 'Super Admin', 'Editor', 'Writer', 'SEO Manager'
  created_at timestamp with time zone not null default now(),
  status text not null default 'active' -- 'active', 'inactive', 'suspended'
);

-- 2. CATEGORIES & TOPIC CLUSTERS
create table cms_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  is_pillar boolean not null default false, -- Pillar Content / Topic Clustering
  created_at timestamp with time zone not null default now()
);

-- 3. TAGS
create table cms_tags (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  created_at timestamp with time zone not null default now()
);

-- 4. BLOG ARTICLES
create table cms_blogs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  content text not null, -- TipTap Rich-Text HTML or markdown content
  excerpt text,
  featured_image text,
  reading_time integer not null default 1,
  status text not null default 'Draft', -- 'Draft', 'In Review', 'Approved', 'Scheduled', 'Published'
  scheduled_for timestamp with time zone,
  published_at timestamp with time zone,
  author_id uuid references cms_users(id) on delete set null,
  category_id uuid references cms_categories(id) on delete set null,
  is_featured boolean not null default false,
  views_count integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Many-to-many relationship: blogs and tags
create table cms_blog_tags (
  blog_id uuid references cms_blogs(id) on delete cascade,
  tag_id uuid references cms_tags(id) on delete cascade,
  primary key (blog_id, tag_id)
);

-- 5. SEO METADATA LEDGER
create table cms_seo_metadata (
  id uuid default gen_random_uuid() primary key,
  blog_id uuid references cms_blogs(id) on delete cascade unique,
  seo_title text,
  meta_description text,
  focus_keyword text,
  secondary_keywords jsonb default '[]'::jsonb, -- Array of secondary keywords
  keyword_density numeric(4,2) default 0.00,
  canonical_url text,
  og_title text,
  og_description text,
  og_image text,
  twitter_card text default 'summary_large_image',
  schema_markup jsonb default '{}'::jsonb, -- Auto-generated JSON-LD Schema
  robots_index boolean not null default true, -- index/noindex
  robots_follow boolean not null default true, -- follow/nofollow
  readability_score integer default 0,
  seo_score integer default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- 6. MEDIA LIBRARY AND CDN ASSETS
create table cms_media (
  id uuid default gen_random_uuid() primary key,
  filename text not null,
  url text not null,
  folder text not null default 'blog-images', -- 'blog-images', 'OG-images', 'thumbnails', 'assets'
  size_bytes integer not null,
  mime_type text not null,
  alt_text text,
  uploaded_by uuid references cms_users(id) on delete set null,
  created_at timestamp with time zone not null default now()
);

-- 7. REVISION HISTORY (Notion/Linear style checkpoints)
create table cms_revisions (
  id uuid default gen_random_uuid() primary key,
  blog_id uuid references cms_blogs(id) on delete cascade,
  content_snapshot text not null,
  title_snapshot text not null,
  author_id uuid references cms_users(id) on delete set null,
  created_at timestamp with time zone not null default now()
);

-- 8. BACKLINK REGISTRY
create table cms_backlinks (
  id uuid default gen_random_uuid() primary key,
  source_url text not null,
  target_page text not null, -- The path or URL of the internal blog / landing page
  anchor_text text not null,
  backlink_type text not null default 'dofollow', -- 'dofollow', 'nofollow'
  status text not null default 'Active', -- 'Active', 'Outreached', 'Lost', 'Broken'
  created_by uuid references cms_users(id) on delete set null,
  created_at timestamp with time zone not null default now(),
  notes text
);

-- 9. CONTENT TELEMETRY & ANALYTICS (GSC / PostHog metrics cache)
create table cms_analytics (
  id uuid default gen_random_uuid() primary key,
  blog_id uuid references cms_blogs(id) on delete cascade,
  date date not null default current_date,
  impressions integer not null default 0,
  clicks integer not null default 0,
  ctr numeric(5,2) not null default 0.00,
  average_position numeric(4,1) not null default 0.0,
  sessions integer not null default 0,
  bounce_rate numeric(5,2) not null default 0.00,
  avg_engagement_time integer not null default 0, -- in seconds
  unique(blog_id, date)
);

-- ========================================================
-- RLS POLICIES & SEED DATA
-- ========================================================

-- Enable Row Level Security (RLS)
alter table cms_users enable row level security;
alter table cms_categories enable row level security;
alter table cms_tags enable row level security;
alter table cms_blogs enable row level security;
alter table cms_blog_tags enable row level security;
alter table cms_seo_metadata enable row level security;
alter table cms_media enable row level security;
alter table cms_revisions enable row level security;
alter table cms_backlinks enable row level security;
alter table cms_analytics enable row level security;

-- Bypass permissions for all selects and mutations (CMS routes use secure server-side supabase client)
create policy "Allow all selections and mutations for cms" on cms_users for all using (true) with check (true);
create policy "Allow all selections and mutations for cms_categories" on cms_categories for all using (true) with check (true);
create policy "Allow all selections and mutations for cms_tags" on cms_tags for all using (true) with check (true);
create policy "Allow all selections and mutations for cms_blogs" on cms_blogs for all using (true) with check (true);
create policy "Allow all selections and mutations for cms_blog_tags" on cms_blog_tags for all using (true) with check (true);
create policy "Allow all selections and mutations for cms_seo_metadata" on cms_seo_metadata for all using (true) with check (true);
create policy "Allow all selections and mutations for cms_media" on cms_media for all using (true) with check (true);
create policy "Allow all selections and mutations for cms_revisions" on cms_revisions for all using (true) with check (true);
create policy "Allow all selections and mutations for cms_backlinks" on cms_backlinks for all using (true) with check (true);
create policy "Allow all selections and mutations for cms_analytics" on cms_analytics for all using (true) with check (true);

-- ========================================================
-- INDEXES FOR INSTANT QUERIES
-- ========================================================
create index idx_cms_blogs_slug on cms_blogs(slug);
create index idx_cms_blogs_status on cms_blogs(status);
create index idx_cms_seo_blog_id on cms_seo_metadata(blog_id);
create index idx_cms_backlinks_status on cms_backlinks(status);
create index idx_cms_analytics_blog_date on cms_analytics(blog_id, date);
