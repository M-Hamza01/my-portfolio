-- Hamza's Lab — content schema
-- Run this in the Supabase SQL editor once the project is created.
-- Every table maps 1:1 to a section on the site (see src/types/content.ts).

create extension if not exists "pgcrypto";

-- ---------- PROJECTS ----------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  platform text not null default '',
  status text not null default 'in-progress' check (status in ('shipped','in-progress','paused')),
  summary text not null default '',
  why_built text not null default '',
  problem_it_solves text not null default '',
  biggest_challenge text not null default '',
  biggest_mistake text not null default '',
  proud_of text not null default '',
  improve_today text not null default '',
  stack text[] not null default '{}',
  cover_image_url text,
  link_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- GRAVEYARD ----------
create table if not exists graveyard_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'paused' check (status in ('paused','abandoned')),
  reason text not null default '',
  lesson text not null default '',
  created_at timestamptz not null default now()
);

-- ---------- IDEAS ----------
create table if not exists ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '',
  note text not null default '',
  created_at timestamptz not null default now()
);

-- ---------- FAILURE WALL ----------
create table if not exists failure_entries (
  id uuid primary key default gen_random_uuid(),
  entry text not null,
  created_at timestamptz not null default now()
);

-- ---------- ENGINEERING NOTEBOOK ----------
create table if not exists notebook_entries (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null default current_date,
  body text not null,
  tag text,
  created_at timestamptz not null default now()
);

-- ---------- LESSONS LEARNED ----------
create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  color text not null default 'yellow' check (color in ('yellow','pink','blue','green')),
  sort_order int not null default 0
);

-- ---------- NOW ----------
create table if not exists now_status (
  id uuid primary key default gen_random_uuid(),
  month_label text not null,
  items jsonb not null default '[]',
  footer_note text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------- TIMELINE ----------
create table if not exists timeline_nodes (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  date_label text not null,
  icon text not null default '',
  sort_order int not null default 0
);

-- ---------- GUESTBOOK ----------
create table if not exists guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  note text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- ================= ROW LEVEL SECURITY =================
alter table projects enable row level security;
alter table graveyard_items enable row level security;
alter table ideas enable row level security;
alter table failure_entries enable row level security;
alter table notebook_entries enable row level security;
alter table lessons enable row level security;
alter table now_status enable row level security;
alter table timeline_nodes enable row level security;
alter table guestbook_entries enable row level security;

-- Public can read everything...
create policy "public read projects" on projects for select using (true);
create policy "public read graveyard" on graveyard_items for select using (true);
create policy "public read ideas" on ideas for select using (true);
create policy "public read failures" on failure_entries for select using (true);
create policy "public read notebook" on notebook_entries for select using (true);
create policy "public read lessons" on lessons for select using (true);
create policy "public read now" on now_status for select using (true);
create policy "public read timeline" on timeline_nodes for select using (true);
-- ...except guestbook, where only approved entries are public
create policy "public read approved guestbook" on guestbook_entries
  for select using (approved = true);

-- Only the authenticated owner (Hamza, signed in via Supabase Auth) can write.
-- Replace auth.uid() check with your own user id once you've created your
-- Supabase auth user, OR keep this generic "any authenticated user" rule if
-- you are the only account that will ever exist in this project.
create policy "owner write projects" on projects for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "owner write graveyard" on graveyard_items for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "owner write ideas" on ideas for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "owner write failures" on failure_entries for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "owner write notebook" on notebook_entries for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "owner write lessons" on lessons for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "owner write now" on now_status for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "owner write timeline" on timeline_nodes for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Guestbook: anyone can insert (public submissions), only the owner can
-- update (approve) or delete.
create policy "public insert guestbook" on guestbook_entries
  for insert with check (true);
create policy "owner moderate guestbook" on guestbook_entries
  for update using (auth.role() = 'authenticated');
create policy "owner delete guestbook" on guestbook_entries
  for delete using (auth.role() = 'authenticated');
