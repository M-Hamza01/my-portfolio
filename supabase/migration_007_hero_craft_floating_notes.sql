-- Run this in the Supabase SQL editor in addition to migrations 001-006.

-- ---------- Hero status bar (Home section, owner-editable) ----------
create table if not exists hero_status (
  id uuid primary key default gen_random_uuid(),
  percent int not null default 72,
  label text not null default 'Loading...',
  updated_at timestamptz not null default now()
);

alter table hero_status enable row level security;
create policy "public read hero status" on hero_status for select using (true);
create policy "owner write hero status" on hero_status for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------- Craft skills ("Also, I try everything" in About) ----------
create table if not exists craft_skills (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  color text not null default 'yellow' check (color in ('yellow','pink','blue','green')),
  font text not null default 'hand',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table craft_skills enable row level security;
create policy "public read craft skills" on craft_skills for select using (true);
create policy "owner write craft skills" on craft_skills for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------- Floating sticky notes (draggable, owner-placed decorations) ----------
create table if not exists floating_notes (
  id uuid primary key default gen_random_uuid(),
  text text not null default 'Write something!',
  color text not null default 'yellow' check (color in ('yellow','pink','blue','green')),
  font text not null default 'hand',
  rotate real not null default 0,
  pos_x real not null default 100,
  pos_y real not null default 400,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table floating_notes enable row level security;
create policy "public read floating notes" on floating_notes for select using (true);
create policy "owner write floating notes" on floating_notes for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
