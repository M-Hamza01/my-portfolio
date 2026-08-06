"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CloudinaryUpload } from "@/components/admin/CloudinaryUpload";
import type { ProjectData } from "@/data/projects";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function isSlugConflict(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  return error.code === "23505" || /projects_slug_key/i.test(error.message ?? "");
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
  defaultFeatured = true,
  onSaved,
  onDeleted,
  close,
}: {
  project?: ProjectData;
  /** Only used when creating a new project (not editing). */
  defaultFeatured?: boolean;
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
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(project?.coverImageUrl ?? "");
  const [whyBuilt, setWhyBuilt] = useState(project?.whyBuilt ?? "");
  const [problemItSolves, setProblemItSolves] = useState(project?.problemItSolves ?? "");
  const [biggestChallenge, setBiggestChallenge] = useState(project?.biggestChallenge ?? "");
  const [biggestMistake, setBiggestMistake] = useState(project?.biggestMistake ?? "");
  const [proudOf, setProudOf] = useState(project?.proudOf ?? "");
  const [improveToday, setImproveToday] = useState(project?.improveToday ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? defaultFeatured);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave() {
    if (!title.trim() || !summary.trim()) return;
    setBusy(true);
    setErrorMsg(null);
    const supabase = createClient();
    const basePayload = {
      title: title.trim(),
      platform: platform.trim(),
      status,
      summary: summary.trim(),
      stack: stack.split(",").map((s) => s.trim()).filter(Boolean),
      link_url: linkUrl.trim() || null,
      github_url: githubUrl.trim() || null,
      cover_image_url: coverImageUrl.trim() || null,
      why_built: whyBuilt.trim(),
      problem_it_solves: problemItSolves.trim(),
      biggest_challenge: biggestChallenge.trim(),
      biggest_mistake: biggestMistake.trim(),
      proud_of: proudOf.trim(),
      improve_today: improveToday.trim(),
      featured,
    };

    if (project) {
      // Editing keeps the existing slug — no regeneration, no collision risk.
      const { error } = await supabase.from("projects").update({ ...basePayload, slug: project.slug }).eq("id", project.id);
      setBusy(false);
      if (error) return setErrorMsg(error.message);
      onSaved({
        id: project.id,
        slug: project.slug,
        title: basePayload.title,
        platform: basePayload.platform,
        status: basePayload.status,
        summary: basePayload.summary,
        stack: basePayload.stack,
        linkUrl: basePayload.link_url,
        githubUrl: basePayload.github_url,
        coverImageUrl: basePayload.cover_image_url,
        whyBuilt: basePayload.why_built,
        problemItSolves: basePayload.problem_it_solves,
        biggestChallenge: basePayload.biggest_challenge,
        biggestMistake: basePayload.biggest_mistake,
        proudOf: basePayload.proud_of,
        improveToday: basePayload.improve_today,
        featured: basePayload.featured,
      });
    } else {
      // New project: try the title's slug, and if another project
      // already has it, quietly retry with -2, -3, etc. instead of
      // surfacing a raw database error.
      const baseSlug = slugify(title) || "project";
      let data = null;
      let error: { code?: string; message?: string } | null = null;
      for (let attempt = 0; attempt < 8; attempt++) {
        const candidateSlug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
        const result = await supabase
          .from("projects")
          .insert({ ...basePayload, slug: candidateSlug })
          .select()
          .single();
        if (!result.error) {
          data = result.data;
          error = null;
          break;
        }
        error = result.error;
        if (!isSlugConflict(error)) break;
      }
      setBusy(false);
      if (error || !data) {
        return setErrorMsg(
          isSlugConflict(error)
            ? "Couldn't find a free URL for this project — try tweaking the title slightly."
            : error?.message ?? "Couldn't save."
        );
      }
      onSaved({
        id: data.id,
        slug: data.slug,
        title: data.title,
        platform: data.platform,
        status: data.status,
        summary: data.summary,
        stack: data.stack ?? [],
        linkUrl: data.link_url,
        githubUrl: data.github_url,
        coverImageUrl: data.cover_image_url,
        whyBuilt: data.why_built,
        problemItSolves: data.problem_it_solves,
        biggestChallenge: data.biggest_challenge,
        biggestMistake: data.biggest_mistake,
        proudOf: data.proud_of,
        improveToday: data.improve_today,
        featured: data.featured,
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
        <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={inputClass}>
          <option value="Android">Android</option>
          <option value="iOS">iOS</option>
          <option value="Web">Web</option>
          <option value="Desktop">Desktop</option>
          <option value="C++">C++</option>
          <option value="Java">Java</option>
          <option value="Other">Other</option>
        </select>
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
      <Field label="Live app / details link (optional)">
        <input
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://zivxio.vercel.app/nustone"
          className={inputClass}
        />
      </Field>
      <Field label="GitHub link (optional)">
        <input
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/yourname/project"
          className={inputClass}
        />
      </Field>
      <CloudinaryUpload value={coverImageUrl} onChange={setCoverImageUrl} label="Cover image / screenshot" />

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

      <label className="flex items-center gap-2 text-sm text-(--color-ink-soft)">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Show in Featured Projects (top 6 on the homepage)
      </label>

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
