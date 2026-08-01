-- Run this in the Supabase SQL editor in addition to schema.sql.
-- Without it, the owner moderation panel can update/delete pending
-- guestbook entries but can't SELECT them to display in the first place.

create policy "owner read all guestbook" on guestbook_entries
  for select using (auth.role() = 'authenticated');
