"use client";

import { useState } from "react";
import { StickyNote } from "@/components/scrapbook/StickyNote";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { Doodle } from "@/components/scrapbook/Doodle";
import { EditableWrapper } from "@/components/admin/EditableWrapper";
import { createClient } from "@/lib/supabase/client";
import type { IdeaData } from "@/data/ideas";

const COLORS: IdeaData["color"][] = ["yellow", "pink", "blue", "green"];
const swatchClass: Record<IdeaData["color"], string> = {
  yellow: "bg-(--color-sticky-yellow)",
  pink: "bg-(--color-sticky-pink)",
  blue: "bg-(--color-sticky-blue)",
  green: "bg-(--color-sticky-green)",
};

function IdeaForm({
  idea,
  onSaved,
  onDeleted,
  close,
}: {
  idea?: IdeaData;
  onSaved: (i: IdeaData) => void;
  onDeleted?: (id: string) => void;
  close: () => void;
}) {
  const [title, setTitle] = useState(idea?.title ?? "");
  const [category, setCategory] = useState(idea?.category ?? "");
  const [note, setNote] = useState(idea?.note ?? "");
  const [color, setColor] = useState<IdeaData["color"]>(idea?.color ?? "yellow");
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave() {
    if (!title.trim()) return;
    setBusy(true);
    setErrorMsg(null);
    const supabase = createClient();
    const payload = { title: title.trim(), category: category.trim(), note: note.trim() };
    if (idea) {
      const { error } = await supabase.from("ideas").update(payload).eq("id", idea.id);
      setBusy(false);
      if (error) return setErrorMsg(error.message);
      onSaved({ ...payload, id: idea.id, color });
    } else {
      const { data, error } = await supabase.from("ideas").insert(payload).select().single();
      setBusy(false);
      if (error || !data) return setErrorMsg(error?.message ?? "Couldn't save.");
      onSaved({ id: data.id, title: data.title, category: data.category, note: data.note, color });
    }
    close();
  }

  async function handleDelete() {
    if (!idea) return;
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("ideas").delete().eq("id", idea.id);
    setBusy(false);
    if (error) return setErrorMsg(error.message);
    onDeleted?.(idea.id);
    close();
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={60}
          className="w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          maxLength={30}
          className="w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          maxLength={140}
          className="w-full resize-none border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Color</label>
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={c}
              className={`h-7 w-7 rounded-full ${swatchClass[c]} border-2 ${
                color === c ? "border-(--color-ink)" : "border-transparent"
              }`}
            />
          ))}
        </div>
      </div>
      {errorMsg && <p className="text-xs text-(--color-stamp-red)">{errorMsg}</p>}
      <div className="flex items-center justify-between">
        {idea ? (
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

export function IdeaParkingLot({ ideas: initial }: { ideas: IdeaData[] }) {
  const [ideas, setIdeas] = useState(initial);

  return (
    <section id="ideas" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-2 flex items-center gap-3">
        <h2 className="font-(family-name:--font-display) text-3xl font-bold">
          Idea Parking Lot
        </h2>
        <Doodle name="bulb" width={26} className="text-(--color-stamp-red)" />
      </div>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        Ideas for another day.
      </HandwrittenLabel>

      <div className="flex flex-wrap gap-6">
        {ideas.map((idea) => (
          <EditableWrapper
            key={idea.id}
            label="Edit idea"
            renderEditor={(close) => (
              <IdeaForm
                idea={idea}
                close={close}
                onSaved={(updated) =>
                  setIdeas((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
                }
                onDeleted={(id) => setIdeas((prev) => prev.filter((i) => i.id !== id))}
              />
            )}
          >
            <StickyNote id={idea.id} color={idea.color} className="w-52">
              <p className="text-lg font-bold">{idea.title}</p>
              <p className="mt-2 text-sm opacity-80">{idea.note}</p>
              <p className="mt-3 font-(family-name:--font-mono) text-[10px] tracking-widest uppercase opacity-60">
                {idea.category}
              </p>
            </StickyNote>
          </EditableWrapper>
        ))}

        <EditableWrapper
          mode="add"
          label="Add idea"
          renderEditor={(close) => (
            <IdeaForm
              close={close}
              onSaved={(created) => setIdeas((prev) => [...prev, created])}
            />
          )}
        >
          <div className="flex w-52 items-center justify-center border-2 border-dashed border-(--color-paper-line) p-8 text-sm text-(--color-ink-faint)">
            + Add idea
          </div>
        </EditableWrapper>
      </div>
    </section>
  );
}
