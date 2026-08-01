// Mirrors the Supabase schema in supabase/schema.sql.
// Every section on the site reads one of these shapes, so adding a
// field here + a migration is the only "code change" a new piece of
// content ever needs.

export interface Project {
  id: string;
  slug: string;
  title: string;
  platform: string; // "Android", "Web", "iOS"...
  status: "shipped" | "in-progress" | "paused";
  summary: string;
  why_built: string;
  problem_it_solves: string;
  biggest_challenge: string;
  biggest_mistake: string;
  proud_of: string;
  improve_today: string;
  stack: string[];
  cover_image_url: string | null;
  link_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GraveyardItem {
  id: string;
  name: string;
  status: "paused" | "abandoned";
  reason: string;
  lesson: string;
  created_at: string;
}

export interface IdeaItem {
  id: string;
  title: string;
  category: string;
  note: string;
  created_at: string;
}

export interface FailureEntry {
  id: string;
  entry: string;
  created_at: string;
}

export interface NotebookEntry {
  id: string;
  entry_date: string;
  body: string;
  tag: string | null;
  created_at: string;
}

export interface Lesson {
  id: string;
  text: string;
  color: "yellow" | "pink" | "blue" | "green";
  sort_order: number;
}

export interface NowStatus {
  id: string;
  month_label: string; // "July 2026"
  items: { text: string; done: boolean }[];
  footer_note: string;
  updated_at: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  note: string;
  approved: boolean;
  created_at: string;
}

export interface TimelineNode {
  id: string;
  label: string;
  date_label: string;
  icon: string;
  sort_order: number;
}
