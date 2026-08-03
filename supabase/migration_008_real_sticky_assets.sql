-- Run this in the Supabase SQL editor in addition to migrations 001-007.

-- ---------- Floating notes: resizable + full color palette ----------
alter table floating_notes add column if not exists width real not null default 190;
alter table floating_notes add column if not exists height real not null default 170;

alter table floating_notes drop constraint if exists floating_notes_color_check;
alter table floating_notes add constraint floating_notes_color_check
  check (color in ('yellow','soft-yellow','orange','red','pink','mauve','sky-blue','aqua-blue','green','grey'));
