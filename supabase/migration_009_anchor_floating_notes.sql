-- Run this in the Supabase SQL editor in addition to migrations 001-008.
--
-- Floating notes previously stored pos_x/pos_y as raw pixel coordinates
-- relative to the whole page. That broke because every editable section
-- has owner-only UI (the "+ Add" tiles) that only takes up layout space
-- when signed in — so the page is a different total height for the
-- owner vs. a visitor, and a note's fixed page-wide coordinate drifted
-- further off the deeper into the page it was placed.
--
-- Fix: notes are now anchored to a specific section (section_id), and
-- pos_x/pos_y are reinterpreted as an offset from THAT section's own
-- top-left corner, measured live at render time — always correct
-- regardless of how much owner-only content exists above it.

alter table floating_notes add column if not exists section_id text not null default 'home';

-- NOTE: any notes placed before this migration have pos_x/pos_y values
-- that were meant as whole-page coordinates, not section-relative ones.
-- They'll likely render in an unexpected spot within the 'home' section
-- after this runs — just drag them back into place once, they'll be
-- correct from then on.
