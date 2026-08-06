"use client";

import { useState } from "react";
import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { EditablePolaroid } from "@/components/scrapbook/EditablePolaroid";
import { StickyNote } from "@/components/scrapbook/StickyNote";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { EditableWrapper } from "@/components/admin/EditableWrapper";
import { FontSelect } from "@/components/admin/FontSelect";
import { fontStyle } from "@/lib/fonts";
import { createClient } from "@/lib/supabase/client";
import type { FailureData } from "@/data/failures";

function FailureForm({
  failure,
  onSaved,
  onDeleted,
  close,
}: {
  failure?: FailureData;
  onSaved: (f: FailureData) => void;
  onDeleted?: (id: string) => void;
  close: () => void;
}) {
  const [entry, setEntry] = useState(failure?.entry ?? "");
  const [font, setFont] = useState(failure?.font ?? "hand");
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave() {
    if (!entry.trim()) return;
    setBusy(true);
    setErrorMsg(null);
    const supabase = createClient();
    if (failure) {
      const { error } = await supabase
        .from("failure_entries")
        .update({ entry: entry.trim(), font })
        .eq("id", failure.id);
      setBusy(false);
      if (error) return setErrorMsg(error.message);
      onSaved({ id: failure.id, entry: entry.trim(), font });
    } else {
      const { data, error } = await supabase
        .from("failure_entries")
        .insert({ entry: entry.trim(), font })
        .select()
        .single();
      setBusy(false);
      if (error || !data) return setErrorMsg(error?.message ?? "Couldn't save.");
      onSaved({ id: data.id, entry: data.entry, font: data.font });
    }
    close();
  }

  async function handleDelete() {
    if (!failure) return;
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("failure_entries").delete().eq("id", failure.id);
    setBusy(false);
    if (error) return setErrorMsg(error.message);
    onDeleted?.(failure.id);
    close();
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Failure</label>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          rows={2}
          maxLength={140}
          className="w-full resize-none border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
        />
      </div>
      <FontSelect value={font} onChange={setFont} />
      {errorMsg && <p className="text-xs text-(--color-stamp-red)">{errorMsg}</p>}
      <div className="flex items-center justify-between">
        {failure ? (
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

export function FailureWall({ failures: initial, siteImages }: { failures: FailureData[]; siteImages: Record<string, string> }) {
  const [failures, setFailures] = useState(initial);

  return (
    <section id="failure-wall" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-2 font-(family-name:--font-display) text-3xl font-bold">
        Failure Wall
      </h2>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        Because failures teach the best lessons.
      </HandwrittenLabel>

      <div className="grid items-start gap-8 sm:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <EditablePolaroid
            imageKey="failure-photo"
            defaultSrc="/placeholder-failure.svg"
            initialSrc={siteImages["failure-photo"]}
            alt="It's part of the process"
            caption="It's part of the process"
            width={180}
            rotate={-4}
          />
          <StickyNote id="keep-learning" color="green" size="sm">
            Keep Learning 🙂
          </StickyNote>
        </div>

        <NotebookCard id="failure-list" variant="ruled" torn="bottom">
          <ul className="space-y-3">
            {failures.map((f) => (
              <EditableWrapper
                key={f.id}
                label="Edit failure"
                renderEditor={(close) => (
                  <FailureForm
                    failure={f}
                    close={close}
                    onSaved={(updated) =>
                      setFailures((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
                    }
                    onDeleted={(id) => setFailures((prev) => prev.filter((x) => x.id !== id))}
                  />
                )}
              >
                <li className="flex items-start gap-2 text-sm text-(--color-ink-soft)">
                  <span className="mt-0.5 font-bold text-(--color-stamp-red)">✕</span>
                  <span className="whitespace-pre-wrap" style={fontStyle(f.font)}>{f.entry}</span>
                </li>
              </EditableWrapper>
            ))}
          </ul>

          <EditableWrapper
            mode="add"
            label="Add failure"
            renderEditor={(close) => (
              <FailureForm
                close={close}
                onSaved={(created) => setFailures((prev) => [created, ...prev])}
              />
            )}
          >
            <div className="mt-4 border-2 border-dashed border-(--color-paper-line) p-3 text-center text-sm text-(--color-ink-faint)">
              + Add failure
            </div>
          </EditableWrapper>
        </NotebookCard>
      </div>
    </section>
  );
}
