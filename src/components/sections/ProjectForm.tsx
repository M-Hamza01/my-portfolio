"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ProjectData } from "@/data/projects";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-(--color-ink-faint)">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)";

export function ProjectForm({
  project,
  onSaved,
  onDeleted,
  close,
}: {
  project?: ProjectData;
  onSaved: (p: ProjectData) => void;
  onDeleted?: (id: string) => void;
  close: () => void;
}) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [platform, setPlatform] = useState(project?.platform ?? "Android");
  const [status, setStatus] = useState<ProjectData["status"]>(project?.status ?? "in-progress");
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [stack, setStack] = useState(project?.stack.join(", ") ?? "");
  const [linkUrl, setLinkUrl] = useState(project?.linkUrl ?? "");
  const [whyBuilt, setWhyBuilt] = useState(project?.whyBuilt ?? "");
  const [problemItSolves, setProblemItSolves] = useState(project?.problemItSolves ?? "");
  const [biggestChallenge, setBiggestChallenge] = useState(project?.biggestChallenge ?? "");
  const [biggestMistake, setBiggestMistake] = useState(project?.biggestMistake ?? "");
  const [proudOf, setProudOf] = useState(project?.proudOf ?? "");
  const [improveToday, setImproveToday] = useState(project?.improveToday ?? "");
  const [featured, setFeatured] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave() {
    if (!title.trim() || !summary.trim()) return;
    setBusy(true);
    setErrorMsg(null);
    const supabase = createClient();
    const payload = {
      title: title.trim(),
      slug: project?.slug ?? slugify(title),
      platform: platform.trim(),
      status,
      summary: summary.trim(),
      stack: stack.split(",").map((s) => s.trim()).filter(Boolean),
      link_url: linkUrl.trim() || null,
      why_built: whyBuilt.trim(),
      problem_it_solves: problemItSolves.trim(),
      biggest_challenge: biggestChallenge.trim(),
      biggest_mistake: biggestMistake.trim(),
      proud_of: proudOf.trim(),
      improve_today: improveToday.trim(),
      featured,
    };

    if (project) {
      const { error } = await supabase.from("projects").update(payload).eq("id", project.id);
      setBusy(false);
      if (error) return setErrorMsg(error.message);
      onSaved({
        id: project.id,
        slug: payload.slug,
        title: payload.title,
        platform: payload.platform,
        status: payload.status,
        summary: payload.summary,
        stack: payload.stack,
        linkUrl: payload.link_url,
        whyBuilt: payload.why_built,
        problemItSolves: payload.problem_it_solves,
        biggestChallenge: payload.biggest_challenge,
        biggestMistake: payload.biggest_mistake,
        proudOf: payload.proud_of,
        improveToday: payload.improve_today,
      });
    } else {
      const { data, error } = await supabase.from("projects").insert(payload).select().single();
      setBusy(false);
      if (error || !data) return setErrorMsg(error?.message ?? "Couldn't save.");
      onSaved({
        id: data.id,
        slug: data.slug,
        title: data.title,
        platform: data.platform,
        status: data.status,
        summary: data.summary,
        stack: data.stack ?? [],
        linkUrl: data.link_url,
        whyBuilt: data.why_built,
        problemItSolves: data.problem_it_solves,
        biggestChallenge: data.biggest_challenge,
        biggestMistake: data.biggest_mistake,
        proudOf: data.proud_of,
        improveToday: data.improve_today,
      });
    }
    close();
  }

  async function handleDelete() {
    if (!project) return;
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", project.id);
    setBusy(false);
    if (error) return setErrorMsg(error.message);
    onDeleted?.(project.id);
    close();
  }

  return (
    <div className="flex flex-col gap-4">
      <Field label="Title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} className={inputClass} />
      </Field>
      <Field label="Platform">
        <input value={platform} onChange={(e) => setPlatform(e.target.value)} maxLength={30} className={inputClass} />
      </Field>
      <Field label="Status">
        <div className="flex gap-2">
          {(["shipped", "in-progress", "paused"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`border px-3 py-1 font-(family-name:--font-mono) text-[11px] uppercase ${
                status === s
                  ? "border-(--color-ink) bg-(--color-ink) text-(--color-paper)"
                  : "border-(--color-paper-line) text-(--color-ink-soft)"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Summary">
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
          maxLength={200}
          className={`${inputClass} resize-none`}
        />
      </Field>
      <Field label="Tech stack (comma separated)">
        <input value={stack} onChange={(e) => setStack(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Link URL (optional)">
        <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className={inputClass} />
      </Field>

      <hr className="border-(--color-paper-line)" />
      <p className="font-(family-name:--font-mono) text-[10px] tracking-widest text-(--color-ink-faint) uppercase">
        The reflection — what makes this more than a portfolio bullet
      </p>

      <Field label="Why I built it">
        <textarea value={whyBuilt} onChange={(e) => setWhyBuilt(e.target.value)} rows={2} maxLength={200} className={`${inputClass} resize-none`} />
      </Field>
      <Field label="Problem it solves">
        <textarea value={problemItSolves} onChange={(e) => setProblemItSolves(e.target.value)} rows={2} maxLength={200} className={`${inputClass} resize-none`} />
      </Field>
      <Field label="Biggest challenge">
        <textarea value={biggestChallenge} onChange={(e) => setBiggestChallenge(e.target.value)} rows={2} maxLength={200} className={`${inputClass} resize-none`} />
      </Field>
      <Field label="Biggest mistake">
        <textarea value={biggestMistake} onChange={(e) => setBiggestMistake(e.target.value)} rows={2} maxLength={200} className={`${inputClass} resize-none`} />
      </Field>
      <Field label="What I'm proud of">
        <textarea value={proudOf} onChange={(e) => setProudOf(e.target.value)} rows={2} maxLength={200} className={`${inputClass} resize-none`} />
      </Field>
      <Field label="What I'd improve today">
        <textarea value={improveToday} onChange={(e) => setImproveToday(e.target.value)} rows={2} maxLength={200} className={`${inputClass} resize-none`} />
      </Field>

      {!project && (
        <label className="flex items-center gap-2 text-sm text-(--color-ink-soft)">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Show in Featured Projects
        </label>
      )}

      {errorMsg && <p className="text-xs text-(--color-stamp-red)">{errorMsg}</p>}
      <div className="flex items-center justify-between pb-2">
        {project ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="font-(family-name:--font-mono) text-xs text-(--color-stamp-red) underline"
          >
            Delete
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          className="border border-(--color-ink) px-4 py-1.5 font-(family-name:--font-mono) text-xs uppercase hover:bg-(--color-ink) hover:text-(--color-paper) disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
