-- Run this in the Supabase SQL editor in addition to migrations 001-003.
-- Supports the new doodle-canvas guestbook: visitors draw instead of
-- (or alongside) writing a note.

alter table guestbook_entries add column if not exists doodle_data_url text;
alter table guestbook_entries alter column note drop not null;
alter table guestbook_entries alter column note set default '';

-- Note on approach: the doodle is stored as a base64 PNG data URL
-- directly in this text column rather than in Supabase Storage. That
-- keeps setup to a single migration (no bucket/policy config), which
-- is the right tradeoff for a personal-portfolio guestbook. If this
-- ever gets heavy guestbook traffic, moving doodle images to a
-- Storage bucket (storing just the URL here instead of the full data
-- URL) would be the natural next step — ask if you want that swap.
