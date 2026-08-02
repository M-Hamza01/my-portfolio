import { createClient } from "@/lib/supabase/server";
import { TIMELINE, type TimelineNodeData } from "@/data/timeline";
import { FEATURED_PROJECTS, type ProjectData } from "@/data/projects";
import { CURRENT_DESK } from "@/data/currentDesk";
import { GRAVEYARD, type GraveyardItemData } from "@/data/graveyard";
import { IDEAS, type IdeaData } from "@/data/ideas";
import { FAILURES, type FailureData } from "@/data/failures";
import { LESSONS, type LessonData } from "@/data/lessons";
import { NOTEBOOK_ENTRIES, type NotebookEntryData } from "@/data/notebookEntries";
import { NOW } from "@/data/now";
import { SEED_GUESTBOOK } from "@/data/guestbookSeed";
import type { DoodleName } from "@/lib/doodleLibrary";

/**
 * Every getX() below: try Supabase, fall back to the matching seed
 * file in src/data/ on any error or empty result. That fallback is
 * what keeps the site looking complete on day one, before any real
 * content has been added through the edit UI.
 */

export async function getTimeline(): Promise<TimelineNodeData[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("timeline_nodes")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return TIMELINE;
    return data.map((row) => ({
      id: row.id,
      label: row.label,
      date: row.date_label,
      icon: row.icon as DoodleName,
    }));
  } catch {
    return TIMELINE;
  }
}

export async function getFeaturedProjects(): Promise<ProjectData[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return FEATURED_PROJECTS;
    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      platform: row.platform,
      status: row.status,
      summary: row.summary,
      stack: row.stack ?? [],
      linkUrl: row.link_url,
      whyBuilt: row.why_built,
      problemItSolves: row.problem_it_solves,
      biggestChallenge: row.biggest_challenge,
      biggestMistake: row.biggest_mistake,
      proudOf: row.proud_of,
      improveToday: row.improve_today,
    }));
  } catch {
    return FEATURED_PROJECTS;
  }
}

export async function getCurrentDesk() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("current_desk_meta")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return CURRENT_DESK;
    return {
      id: data.id as string,
      projectName: data.project_name,
      blurb: data.blurb,
      why: data.why,
      progressPercent: data.progress_percent,
      stuckOn: data.stuck_on,
      thinkingAbout: data.thinking_about,
      nextMilestone: data.next_milestone,
      focus: data.focus as { text: string; done: boolean }[],
    };
  } catch {
    return CURRENT_DESK;
  }
}

export async function getGraveyard(): Promise<GraveyardItemData[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("graveyard_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return GRAVEYARD;
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      status: row.status,
      reason: row.reason,
      lesson: row.lesson,
      font: row.font ?? "hand",
    }));
  } catch {
    return GRAVEYARD;
  }
}

export async function getIdeas(): Promise<IdeaData[]> {
  const colors = ["yellow", "pink", "blue", "green"] as const;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ideas")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return IDEAS;
    return data.map((row, i) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      note: row.note,
      color: colors[i % colors.length],
      font: row.font ?? "hand",
      submittedBy: row.submitted_by,
    }));
  } catch {
    return IDEAS;
  }
}

export async function getFailures(): Promise<FailureData[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("failure_entries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return FAILURES;
    return data.map((row) => ({ id: row.id, entry: row.entry, font: row.font ?? "hand" }));
  } catch {
    return FAILURES;
  }
}

export async function getLessons(): Promise<LessonData[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return LESSONS;
    return data.map((row) => ({
      id: row.id,
      text: row.text,
      color: row.color,
      font: row.font ?? "hand",
    }));
  } catch {
    return LESSONS;
  }
}

export async function getNotebookEntries(): Promise<NotebookEntryData[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notebook_entries")
      .select("*")
      .order("entry_date", { ascending: false })
      .limit(6);
    if (error || !data || data.length === 0) return NOTEBOOK_ENTRIES;
    return data.map((row) => ({
      id: row.id,
      date: new Date(row.entry_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      body: row.body,
      tag: row.tag ?? "Note",
      font: row.font ?? "hand",
    }));
  } catch {
    return NOTEBOOK_ENTRIES;
  }
}

export async function getNowStatus() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("now_status")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return { id: null as string | null, ...NOW };
    return {
      id: data.id as string,
      monthLabel: data.month_label,
      items: data.items as { text: string; done: boolean }[],
      footerNote: data.footer_note,
    };
  } catch {
    return { id: null as string | null, ...NOW };
  }
}

export async function getApprovedGuestbook() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("guestbook_entries")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(12);
    if (error || !data || data.length === 0) return SEED_GUESTBOOK;
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      note: row.note,
      doodleDataUrl: row.doodle_data_url ?? undefined,
      date: new Date(row.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }));
  } catch {
    return SEED_GUESTBOOK;
  }
}
