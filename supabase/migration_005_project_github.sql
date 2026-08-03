-- Run this in the Supabase SQL editor in addition to migrations 001-004.

alter table projects add column if not exists github_url text;

-- Note: `cover_image_url` and `link_url` already existed from schema.sql.
-- link_url is used as the "view project" / live-demo reference
-- (e.g. https://zivxio.vercel.app/nustone) — no migration needed for it,
-- it just wasn't exposed in the edit form until this update.
