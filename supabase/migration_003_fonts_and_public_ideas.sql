-- Run this in the Supabase SQL editor in addition to schema.sql,
-- migration_001, and migration_002.

-- ---------- Font choice on editable text content ----------
alter table lessons add column if not exists font text not null default 'hand';
alter table ideas add column if not exists font text not null default 'hand';
alter table notebook_entries add column if not exists font text not null default 'hand';
alter table graveyard_items add column if not exists font text not null default 'hand';
alter table failure_entries add column if not exists font text not null default 'hand';

-- ---------- Ideas: open up to visitor submissions ----------
alter table ideas add column if not exists approved boolean not null default false;
alter table ideas add column if not exists submitted_by text;

-- Ideas Hamza adds himself through the edit UI are saved as already
-- approved (see IdeaForm) — this default only matters for the public
-- suggestion form.

drop policy if exists "public read ideas" on ideas;
create policy "public read approved ideas" on ideas
  for select using (approved = true);
create policy "owner read all ideas" on ideas
  for select using (auth.role() = 'authenticated');
create policy "public insert ideas" on ideas
  for insert with check (true);
