-- Run this in the Supabase SQL editor in addition to migrations 001-005.

-- ---------- Current Desk -> linked project ----------
alter table current_desk_meta add column if not exists project_id uuid references projects(id) on delete set null;

-- ---------- Site images (Hero portrait, About desk photo, etc.) ----------
create table if not exists site_images (
  key text primary key,
  url text not null,
  updated_at timestamptz not null default now()
);

alter table site_images enable row level security;

create policy "public read site images" on site_images for select using (true);
create policy "owner write site images" on site_images for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
