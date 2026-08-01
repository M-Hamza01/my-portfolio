"use client";

import { useState } from "react";
import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { EditableWrapper } from "@/components/admin/EditableWrapper";
import { createClient } from "@/lib/supabase/client";
import type { NotebookEntryData } from "@/data/notebookEntries";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function EntryForm({
  entry,
  onSaved,
  onDeleted,
  close,
}: {
  entry?: NotebookEntryData;
  onSaved: (e: NotebookEntryData) => void;
  onDeleted?: (id: string) => void;
  close: () => void;
}) {
  const [body, setBody] = useState(entry?.body ?? "");
  const [tag, setTag] = useState(entry?.tag ?? "");
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave() {
    if (!body.trim()) return;
    setBusy(true);
    setErrorMsg(null);
    const supabase = createClient();
    if (entry) {
      const { error } = await supabase
        .from("notebook_entries")
        .update({ body: body.trim(), tag: tag.trim() })
        .eq("id", entry.id);
      setBusy(false);
      if (error) return setErrorMsg(error.message);
      onSaved({ ...entry, body: body.trim(), tag: tag.trim() });
    } else {
      const { data, error } = await supabase
        .from("notebook_entries")
        .insert({ body: body.trim(), tag: tag.trim() })
        .select()
        .single();
      setBusy(false);
      if (error || !data) return setErrorMsg(error?.message ?? "Couldn't save.");
      onSaved({ id: data.id, body: data.body, tag: data.tag, date: formatDate(data.entry_date) });
    }
    close();
  }

  async function handleDelete() {
    if (!entry) return;
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("notebook_entries").delete().eq("id", entry.id);
    setBusy(false);
    if (error) return setErrorMsg(error.message);
    onDeleted?.(entry.id);
    close();
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Entry</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          maxLength={300}
          className="w-full resize-none border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">
          Tag (e.g. Product, UI/UX, Reflection)
        </label>
        <input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          maxLength={30}
          className="w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
        />
      </div>
      {errorMsg && <p className="text-xs text-(--color-stamp-red)">{errorMsg}</p>}
      <div className="flex items-center justify-between">
        {entry ? (
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

export function EngineeringNotebook({ entries: initial }: { entries: NotebookEntryData[] }) {
  const [entries, setEntries] = useState(initial);

  return (
    <section id="notebook" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-2 flex items-end justify-between">
        <h2 className="font-(family-name:--font-display) text-3xl font-bold">
          Engineering Notebook
        </h2>
        <a
          href="#notebook"
          className="hidden font-(family-name:--font-mono) text-xs text-(--color-pen-blue) underline underline-offset-4 sm:inline"
        >
          View all notes
        </a>
      </div>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        Random notes from the journey.
      </HandwrittenLabel>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <EditableWrapper
            key={entry.id}
            label="Edit notebook entry"
            renderEditor={(close) => (
              <EntryForm
                entry={entry}
                close={close}
                onSaved={(updated) =>
                  setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
                }
                onDeleted={(id) => setEntries((prev) => prev.filter((e) => e.id !== id))}
              />
            )}
          >
            <NotebookCard id={entry.id} variant="ruled" className="flex h-full flex-col gap-3">
              <p className="font-(family-name:--font-mono) text-xs text-(--color-ink-faint)">
                {entry.date}
              </p>
              <p className="flex-1 text-sm text-(--color-ink-soft)">{entry.body}</p>
              <span className="w-fit rounded-full bg-(--color-paper-dark) px-2.5 py-0.5 font-(family-name:--font-mono) text-[10px] tracking-wide text-(--color-ink-soft) uppercase">
                {entry.tag}
              </span>
            </NotebookCard>
          </EditableWrapper>
        ))}

        <EditableWrapper
          mode="add"
          label="Add notebook entry"
          renderEditor={(close) => (
            <EntryForm close={close} onSaved={(created) => setEntries((prev) => [created, ...prev])} />
          )}
        >
          <div className="flex min-h-[10rem] items-center justify-center border-2 border-dashed border-(--color-paper-line) p-8 text-sm text-(--color-ink-faint)">
            + Add entry
          </div>
        </EditableWrapper>
      </div>
    </section>
  );
}
