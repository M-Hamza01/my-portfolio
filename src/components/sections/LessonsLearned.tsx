"use client";

import { useState } from "react";
import { StickyNote } from "@/components/scrapbook/StickyNote";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { EditableWrapper } from "@/components/admin/EditableWrapper";
import { FontSelect } from "@/components/admin/FontSelect";
import { fontStyle } from "@/lib/fonts";
import { createClient } from "@/lib/supabase/client";
import type { LessonData } from "@/data/lessons";

const COLORS: LessonData["color"][] = ["yellow", "pink", "blue", "green"];

const swatchClass: Record<LessonData["color"], string> = {
  yellow: "bg-(--color-sticky-yellow)",
  pink: "bg-(--color-sticky-pink)",
  blue: "bg-(--color-sticky-blue)",
  green: "bg-(--color-sticky-green)",
};

function LessonForm({
  lesson,
  onSaved,
  onDeleted,
  close,
}: {
  lesson?: LessonData;
  onSaved: (l: LessonData) => void;
  onDeleted?: (id: string) => void;
  close: () => void;
}) {
  const [text, setText] = useState(lesson?.text ?? "");
  const [color, setColor] = useState<LessonData["color"]>(lesson?.color ?? "yellow");
  const [font, setFont] = useState(lesson?.font ?? "hand");
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave() {
    if (!text.trim()) return;
    setBusy(true);
    setErrorMsg(null);
    const supabase = createClient();
    if (lesson) {
      const { error } = await supabase
        .from("lessons")
        .update({ text: text.trim(), color, font })
        .eq("id", lesson.id);
      setBusy(false);
      if (error) return setErrorMsg(error.message);
      onSaved({ id: lesson.id, text: text.trim(), color, font });
    } else {
      const { data, error } = await supabase
        .from("lessons")
        .insert({ text: text.trim(), color, font, sort_order: 0 })
        .select()
        .single();
      setBusy(false);
      if (error || !data) return setErrorMsg(error?.message ?? "Couldn't save.");
      onSaved({ id: data.id, text: data.text, color: data.color, font: data.font });
    }
    close();
  }

  async function handleDelete() {
    if (!lesson) return;
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("lessons").delete().eq("id", lesson.id);
    setBusy(false);
    if (error) return setErrorMsg(error.message);
    onDeleted?.(lesson.id);
    close();
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Lesson</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
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
      <FontSelect value={font} onChange={setFont} />
      {errorMsg && <p className="text-xs text-(--color-stamp-red)">{errorMsg}</p>}
      <div className="flex items-center justify-between">
        {lesson ? (
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

export function LessonsLearned({ lessons: initial }: { lessons: LessonData[] }) {
  const [lessons, setLessons] = useState(initial);

  return (
    <section id="lessons" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-2 font-(family-name:--font-display) text-3xl font-bold">
        Lessons Learned
      </h2>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        Notes to my future self.
      </HandwrittenLabel>

      <div className="flex flex-wrap gap-6">
        {lessons.map((lesson) => (
          <EditableWrapper
            key={lesson.id}
            label="Edit lesson"
            renderEditor={(close) => (
              <LessonForm
                lesson={lesson}
                close={close}
                onSaved={(updated) =>
                  setLessons((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
                }
                onDeleted={(id) => setLessons((prev) => prev.filter((l) => l.id !== id))}
              />
            )}
          >
            <StickyNote id={lesson.id} color={lesson.color} className="w-48">
              <p className="text-lg leading-snug" style={fontStyle(lesson.font)}>
                {lesson.text}
              </p>
            </StickyNote>
          </EditableWrapper>
        ))}

        <EditableWrapper
          mode="add"
          label="Add lesson"
          renderEditor={(close) => (
            <LessonForm
              close={close}
              onSaved={(created) => setLessons((prev) => [...prev, created])}
            />
          )}
        >
          <div className="flex w-48 items-center justify-center border-2 border-dashed border-(--color-paper-line) p-4 text-sm text-(--color-ink-faint)">
            + Add lesson
          </div>
        </EditableWrapper>
      </div>
    </section>
  );
}
