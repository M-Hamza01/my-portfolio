-- Migration 2 — Current Desk meta
-- Run this in the Supabase SQL editor (after schema.sql).
-- Current Desk shows a handful of fields that don't map cleanly onto a
-- single project row (progress %, a checklist, "thinking about"), so
-- it gets its own tiny singleton table instead of stretching the
-- projects table to fit.

create table if not exists current_desk_meta (
  id uuid primary key default gen_random_uuid(),
  project_name text not null default '',
  blurb text not null default '',
  why text not null default '',
  progress_percent int not null default 0,
  stuck_on text not null default '',
  thinking_about text not null default '',
  next_milestone text not null default '',
  focus jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

alter table current_desk_meta enable row level security;

create policy "public read current desk" on current_desk_meta
  for select using (true);

create policy "owner write current desk" on current_desk_meta for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
