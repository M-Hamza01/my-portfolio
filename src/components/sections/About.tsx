"use client";

import { useState } from "react";
import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { StickyNote } from "@/components/scrapbook/StickyNote";
import { EditablePolaroid } from "@/components/scrapbook/EditablePolaroid";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { Doodle } from "@/components/scrapbook/Doodle";
import { EditableWrapper } from "@/components/admin/EditableWrapper";
import { FontSelect } from "@/components/admin/FontSelect";
import { fontStyle } from "@/lib/fonts";
import { createClient } from "@/lib/supabase/client";
import type { CraftSkillData } from "@/data/craftSkills";

const COLORS: CraftSkillData["color"][] = ["yellow", "pink", "blue", "green"];
const swatchClass: Record<CraftSkillData["color"], string> = {
  yellow: "bg-(--color-sticky-yellow)",
  pink: "bg-(--color-sticky-pink)",
  blue: "bg-(--color-sticky-blue)",
  green: "bg-(--color-sticky-green)",
};

function CraftSkillForm({
  skill,
  onSaved,
  onDeleted,
  close,
}: {
  skill?: CraftSkillData;
  onSaved: (s: CraftSkillData) => void;
  onDeleted?: (id: string) => void;
  close: () => void;
}) {
  const [title, setTitle] = useState(skill?.title ?? "");
  const [description, setDescription] = useState(skill?.description ?? "");
  const [color, setColor] = useState<CraftSkillData["color"]>(skill?.color ?? "yellow");
  const [font, setFont] = useState(skill?.font ?? "hand");
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave() {
    if (!title.trim()) return;
    setBusy(true);
    setErrorMsg(null);
    const supabase = createClient();
    const payload = { title: title.trim(), description: description.trim(), color, font };
    if (skill) {
      const { error } = await supabase.from("craft_skills").update(payload).eq("id", skill.id);
      setBusy(false);
      if (error) return setErrorMsg(error.message);
      onSaved({ ...payload, id: skill.id });
    } else {
      const { data, error } = await supabase.from("craft_skills").insert(payload).select().single();
      setBusy(false);
      if (error || !data) return setErrorMsg(error?.message ?? "Couldn't save.");
      onSaved({ id: data.id, title: data.title, description: data.description, color: data.color, font: data.font });
    }
    close();
  }

  async function handleDelete() {
    if (!skill) return;
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("craft_skills").delete().eq("id", skill.id);
    setBusy(false);
    if (error) return setErrorMsg(error.message);
    onDeleted?.(skill.id);
    close();
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={40}
          className="w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Story</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={220}
          className="w-full resize-none border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Color</label>
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button key={c} type="button" onClick={() => setColor(c)} aria-label={c}
              className={`h-7 w-7 rounded-full ${swatchClass[c]} border-2 ${color === c ? "border-(--color-ink)" : "border-transparent"}`} />
          ))}
        </div>
      </div>
      <FontSelect value={font} onChange={setFont} />
      {errorMsg && <p className="text-xs text-(--color-stamp-red)">{errorMsg}</p>}
      <div className="flex items-center justify-between">
        {skill ? (
          <button type="button" onClick={handleDelete} disabled={busy}
            className="font-(family-name:--font-mono) text-xs text-(--color-stamp-red) underline">Delete</button>
        ) : <span />}
        <button type="button" onClick={handleSave} disabled={busy}
          className="border border-(--color-ink) px-4 py-1.5 font-(family-name:--font-mono) text-xs uppercase hover:bg-(--color-ink) hover:text-(--color-paper) disabled:opacity-50">
          {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

export function About({
  siteImages,
  craftSkills: initial,
}: {
  siteImages: Record<string, string>;
  craftSkills: CraftSkillData[];
}) {
  const [craftSkills, setCraftSkills] = useState(initial);

  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-10 flex items-center gap-3 font-(family-name:--font-display) text-3xl font-bold">
        About Me
        <Doodle name="scribble2" width={36} className="text-(--color-stamp-red)" />
      </h2>

      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <NotebookCard id="about-notes" variant="ruled" torn="top" className="space-y-4 text-(--color-ink-soft)">
          <p>Software Engineering student at NUST Islamabad — two semesters in.</p>
          <p>I like building products that normal people actually use.</p>
          <p>Currently obsessed with making utility apps feel premium.</p>
          <p>I always try to do something new.</p>
          <p>I have way too many unfinished ideas.</p>
          <p>Sometimes I spend more time redesigning a screen than writing the backend.</p>
          <HandwrittenLabel size="md" color="pen-blue" className="block pt-2">
            I&apos;m learning how to ship.
          </HandwrittenLabel>
        </NotebookCard>

        <div className="flex flex-col gap-6">
          <div className="flex justify-center lg:justify-start">
            <EditablePolaroid
              imageKey="about-desk"
              defaultSrc="/placeholder-desk.svg"
              initialSrc={siteImages["about-desk"]}
              alt="Hamza's workspace"
              caption="One day at a time. Keep shipping."
              width={200}
              rotate={-3}
            />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-6 flex items-center gap-3">
          <h3 className="font-(family-name:--font-display) text-xl font-bold">
            Also, I try everything
          </h3>
          <Doodle name="magic" width={24} className="text-(--color-pen-blue)" />
        </div>

        <div className="flex flex-wrap gap-5">
          {craftSkills.map((skill) => (
            <EditableWrapper
              key={skill.id}
              label="Edit craft skill"
              renderEditor={(close) => (
                <CraftSkillForm
                  skill={skill}
                  close={close}
                  onSaved={(updated) => setCraftSkills((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))}
                  onDeleted={(id) => setCraftSkills((prev) => prev.filter((s) => s.id !== id))}
                />
              )}
            >
              <StickyNote id={skill.id} color={skill.color} className="w-60">
                <p className="font-bold">{skill.title}</p>
                <p className="mt-1 text-sm opacity-80" style={fontStyle(skill.font)}>
                  {skill.description}
                </p>
              </StickyNote>
            </EditableWrapper>
          ))}

          <EditableWrapper
            mode="add"
            label="Add craft skill"
            renderEditor={(close) => (
              <CraftSkillForm close={close} onSaved={(created) => setCraftSkills((prev) => [...prev, created])} />
            )}
          >
            <div className="flex w-60 items-center justify-center border-2 border-dashed border-(--color-paper-line) p-8 text-sm text-(--color-ink-faint)">
              + Add something else
            </div>
          </EditableWrapper>
        </div>

        <HandwrittenLabel as="p" size="md" color="pen-blue" className="mt-6">
          Turns out debugging isn&apos;t just a software thing.
        </HandwrittenLabel>
      </div>
    </section>
  );
}
