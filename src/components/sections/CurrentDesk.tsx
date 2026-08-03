"use client";

import { useState } from "react";
import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { StickyNote } from "@/components/scrapbook/StickyNote";
import { DeviceMockup } from "@/components/scrapbook/DeviceMockup";
import { ProgressBar } from "@/components/scrapbook/ProgressBar";
import { Stamp } from "@/components/scrapbook/Stamp";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { Doodle } from "@/components/scrapbook/Doodle";
import { EditableWrapper } from "@/components/admin/EditableWrapper";
import { createClient } from "@/lib/supabase/client";
import { mockupKindForPlatform } from "@/lib/utils";
import type { CURRENT_DESK as CurrentDeskShape } from "@/data/currentDesk";
import type { ProjectData } from "@/data/projects";

type DeskData = typeof CurrentDeskShape & {
  id?: string | null;
  projectId?: string | null;
  coverImageUrl?: string | null;
  platform?: string | null;
};

function DeskForm({
  desk,
  projects,
  onSaved,
  close,
}: {
  desk: DeskData;
  projects: ProjectData[];
  onSaved: (d: DeskData) => void;
  close: () => void;
}) {
  const [projectId, setProjectId] = useState<string>(desk.projectId ?? "");
  const [projectName, setProjectName] = useState(desk.projectName);
  const [blurb, setBlurb] = useState(desk.blurb);
  const [why, setWhy] = useState(desk.why);
  const [progressPercent, setProgressPercent] = useState(desk.progressPercent);
  const [stuckOn, setStuckOn] = useState(desk.stuckOn);
  const [thinkingAbout, setThinkingAbout] = useState(desk.thinkingAbout);
  const [nextMilestone, setNextMilestone] = useState(desk.nextMilestone);
  const [focus, setFocus] = useState(desk.focus);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function updateFocus(i: number, patch: Partial<{ text: string; done: boolean }>) {
    setFocus((prev) => prev.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  }

  function removeFocus(i: number) {
    setFocus((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handlePickProject(id: string) {
    setProjectId(id);
    const p = projects.find((proj) => proj.id === id);
    if (p) {
      // Autofill from the project — still editable afterward.
      setProjectName(p.title);
      setBlurb(p.summary);
      if (p.whyBuilt) setWhy(p.whyBuilt);
      if (p.biggestChallenge) setStuckOn(p.biggestChallenge);
    }
  }

  async function handleSave() {
    setBusy(true);
    setErrorMsg(null);
    const supabase = createClient();
    const payload = {
      project_id: projectId || null,
      project_name: projectName.trim(),
      blurb: blurb.trim(),
      why: why.trim(),
      progress_percent: progressPercent,
      stuck_on: stuckOn.trim(),
      thinking_about: thinkingAbout.trim(),
      next_milestone: nextMilestone.trim(),
      focus: focus.filter((f) => f.text.trim() !== ""),
    };
    await supabase.from("current_desk_meta").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error } = await supabase.from("current_desk_meta").insert(payload);
    setBusy(false);
    if (error) return setErrorMsg(error.message);

    const linked = projects.find((p) => p.id === projectId);
    onSaved({
      projectId: payload.project_id,
      coverImageUrl: linked?.coverImageUrl ?? null,
      platform: linked?.platform ?? null,
      projectName: payload.project_name,
      blurb: payload.blurb,
      why: payload.why,
      progressPercent: payload.progress_percent,
      stuckOn: payload.stuck_on,
      thinkingAbout: payload.thinking_about,
      nextMilestone: payload.next_milestone,
      focus: payload.focus,
    });
    close();
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">
          Link to a project (fills the mockup + autofills fields)
        </label>
        <select
          value={projectId}
          onChange={(e) => handlePickProject(e.target.value)}
          className="w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
        >
          <option value="">— No linked project —</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Project name</label>
        <input value={projectName} onChange={(e) => setProjectName(e.target.value)}
          className="w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Blurb</label>
        <textarea value={blurb} onChange={(e) => setBlurb(e.target.value)} rows={2}
          className="w-full resize-none border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Why (sticky note)</label>
        <textarea value={why} onChange={(e) => setWhy(e.target.value)} rows={2}
          className="w-full resize-none border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Progress: {progressPercent}%</label>
        <input type="range" min={0} max={100} value={progressPercent}
          onChange={(e) => setProgressPercent(Number(e.target.value))} className="w-full" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Currently stuck on</label>
        <input value={stuckOn} onChange={(e) => setStuckOn(e.target.value)}
          className="w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)" />
      </div>
      <div>
        <label className="mb-2 block text-xs text-(--color-ink-faint)">Focus checklist</label>
        <div className="flex flex-col gap-2">
          {focus.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="checkbox" checked={f.done} onChange={(e) => updateFocus(i, { done: e.target.checked })} />
              <input value={f.text} onChange={(e) => updateFocus(i, { text: e.target.value })}
                className="flex-1 border border-(--color-paper-line) bg-white p-1.5 text-sm outline-none focus:border-(--color-pen-blue)" />
              <button type="button" onClick={() => removeFocus(i)} aria-label="Remove" className="text-xs text-(--color-stamp-red)">✕</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setFocus((p) => [...p, { text: "", done: false }])}
          className="mt-2 font-(family-name:--font-mono) text-xs text-(--color-pen-blue) underline">+ add focus item</button>
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Thinking about</label>
        <input value={thinkingAbout} onChange={(e) => setThinkingAbout(e.target.value)}
          className="w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Next milestone</label>
        <input value={nextMilestone} onChange={(e) => setNextMilestone(e.target.value)}
          className="w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)" />
      </div>
      {errorMsg && <p className="text-xs text-(--color-stamp-red)">{errorMsg}</p>}
      <button type="button" onClick={handleSave} disabled={busy}
        className="self-end border border-(--color-ink) px-4 py-1.5 font-(family-name:--font-mono) text-xs uppercase hover:bg-(--color-ink) hover:text-(--color-paper) disabled:opacity-50">
        {busy ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

export function CurrentDesk({ desk: initial, projects }: { desk: DeskData; projects: ProjectData[] }) {
  const [D, setD] = useState(initial);

  return (
    <section id="current-desk" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-2 font-(family-name:--font-display) text-3xl font-bold">
        Current Desk
      </h2>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        What I&apos;m working on right now.
      </HandwrittenLabel>

      <EditableWrapper label="Edit current desk" renderEditor={(close) => (
        <DeskForm desk={D} projects={projects} onSaved={setD} close={close} />
      )}>
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_auto]">
          <NotebookCard id="current-desk-main" className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-(family-name:--font-display) text-xl font-bold">{D.projectName}</h3>
                <p className="mt-1 text-sm text-(--color-ink-soft)">{D.blurb}</p>
              </div>
              <Stamp color="blue" rotate={-4}>In Progress</Stamp>
            </div>
            <StickyNote id="current-desk-why" color="yellow" size="sm" className="w-fit max-w-xs">
              <span className="font-(family-name:--font-body)">
                <span className="font-bold">Why? </span>
                {D.why}
              </span>
            </StickyNote>
          </NotebookCard>

          <NotebookCard id="current-desk-progress" variant="grid" className="flex flex-col gap-5">
            <div>
              <div className="mb-1 flex items-center justify-between font-(family-name:--font-mono) text-xs text-(--color-ink-soft)">
                <span>Progress</span>
                <span>{D.progressPercent}%</span>
              </div>
              <ProgressBar percent={D.progressPercent} />
            </div>
            <div>
              <p className="font-(family-name:--font-mono) text-xs text-(--color-ink-faint) uppercase">Currently stuck on</p>
              <p className="mt-1 text-sm text-(--color-ink-soft)">{D.stuckOn}</p>
            </div>
            <div>
              <p className="mb-2 font-(family-name:--font-mono) text-xs text-(--color-ink-faint) uppercase">Focus</p>
              <ul className="space-y-1.5">
                {D.focus.map((item, i) =>
                  item.text.trim() === "" ? null : (
                    <li key={i} className="flex items-center gap-2 text-sm text-(--color-ink-soft)">
                      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[2px] border border-(--color-ink-faint)" aria-hidden>
                        {item.done && <Doodle name="tick" width={10} onScroll={false} className="text-(--color-ink)" />}
                      </span>
                      {item.text}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <p className="font-(family-name:--font-mono) text-xs text-(--color-ink-faint) uppercase">Thinking about</p>
              <p className="mt-1 text-sm text-(--color-ink-soft)">{D.thinkingAbout}</p>
            </div>
            <div className="flex items-center gap-2 border-t border-(--color-paper-line) pt-3">
              <p className="font-(family-name:--font-mono) text-xs text-(--color-ink-faint) uppercase">Next milestone</p>
              <p className="font-(family-name:--font-body) text-base text-(--color-ink)">{D.nextMilestone}</p>
              <Doodle name="flag" width={16} onScroll={false} className="text-(--color-stamp-red)" />
            </div>
          </NotebookCard>

          <div className="flex justify-center lg:block">
            <DeviceMockup
              kind={mockupKindForPlatform(D.platform ?? "Android")}
              imageUrl={D.coverImageUrl}
              imageAlt={`${D.projectName} screenshot`}
            />
          </div>
        </div>
      </EditableWrapper>
    </section>
  );
}
