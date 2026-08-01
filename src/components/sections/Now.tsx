"use client";

import { useState } from "react";
import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { Doodle } from "@/components/scrapbook/Doodle";
import { EditableWrapper } from "@/components/admin/EditableWrapper";
import { createClient } from "@/lib/supabase/client";

interface NowShape {
  id: string | null;
  monthLabel: string;
  items: { text: string; done: boolean }[];
  footerNote: string;
}

function NowForm({ now, onSaved, close }: { now: NowShape; onSaved: (n: NowShape) => void; close: () => void }) {
  const [monthLabel, setMonthLabel] = useState(now.monthLabel);
  const [items, setItems] = useState(now.items);
  const [footerNote, setFooterNote] = useState(now.footerNote);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function updateItem(i: number, text: string) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, text } : it)));
  }
  function toggleItem(i: number) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, done: !it.done } : it)));
  }
  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setBusy(true);
    setErrorMsg(null);
    const supabase = createClient();
    const payload = { month_label: monthLabel.trim(), items, footer_note: footerNote.trim() };

    const query = now.id
      ? supabase.from("now_status").update(payload).eq("id", now.id).select().single()
      : supabase.from("now_status").insert(payload).select().single();

    const { data, error } = await query;
    setBusy(false);
    if (error || !data) return setErrorMsg(error?.message ?? "Couldn't save.");
    onSaved({ id: data.id, monthLabel: data.month_label, items: data.items, footerNote: data.footer_note });
    close();
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Month label</label>
        <input
          value={monthLabel}
          onChange={(e) => setMonthLabel(e.target.value)}
          className="w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Checklist</label>
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="checkbox" checked={item.done} onChange={() => toggleItem(i)} />
              <input
                value={item.text}
                onChange={(e) => updateItem(i, e.target.value)}
                className="flex-1 border border-(--color-paper-line) bg-white p-1.5 text-sm outline-none focus:border-(--color-pen-blue)"
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-xs text-(--color-stamp-red)"
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setItems((prev) => [...prev, { text: "", done: false }])}
            className="w-fit font-(family-name:--font-mono) text-xs text-(--color-pen-blue) underline"
          >
            + Add item
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Footer note</label>
        <input
          value={footerNote}
          onChange={(e) => setFooterNote(e.target.value)}
          className="w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
        />
      </div>

      {errorMsg && <p className="text-xs text-(--color-stamp-red)">{errorMsg}</p>}
      <button
        type="button"
        onClick={handleSave}
        disabled={busy}
        className="w-fit border border-(--color-ink) px-4 py-1.5 font-(family-name:--font-mono) text-xs uppercase hover:bg-(--color-ink) hover:text-(--color-paper) disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

export function Now({ now: initial }: { now: NowShape }) {
  const [now, setNow] = useState(initial);

  return (
    <section id="now" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-2 flex items-center gap-3">
        <h2 className="font-(family-name:--font-display) text-3xl font-bold">Now</h2>
        <Doodle name="rewind" width={22} className="text-(--color-ink-faint)" />
      </div>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        What I&apos;m up to this month.
      </HandwrittenLabel>

      <EditableWrapper
        label="Edit this month"
        renderEditor={(close) => <NowForm now={now} close={close} onSaved={setNow} />}
      >
        <NotebookCard id="now-card" torn="top" className="max-w-md">
          <p className="mb-4 font-(family-name:--font-display) text-lg font-bold">
            {now.monthLabel}
          </p>
          <ul className="space-y-2.5">
            {now.items.map((item) => (
              <li key={item.text} className="flex items-center gap-2 text-sm text-(--color-ink-soft)">
                <span
                  className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[2px] border border-(--color-ink-faint)"
                  aria-hidden
                >
                  {item.done && (
                    <Doodle name="tick" width={10} onScroll={false} className="text-(--color-ink)" />
                  )}
                </span>
                {item.text}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between border-t border-(--color-paper-line) pt-4">
            <HandwrittenLabel size="md" color="pen-blue">
              {now.footerNote}
            </HandwrittenLabel>
            <Doodle name="flight" width={26} className="text-(--color-stamp-red)" />
          </div>
        </NotebookCard>
      </EditableWrapper>
    </section>
  );
}
