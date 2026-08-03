"use client";

import { useState } from "react";
import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { Stamp } from "@/components/scrapbook/Stamp";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { Doodle } from "@/components/scrapbook/Doodle";
import { EditableWrapper } from "@/components/admin/EditableWrapper";
import { FontSelect } from "@/components/admin/FontSelect";
import { fontStyle } from "@/lib/fonts";
import { createClient } from "@/lib/supabase/client";
import type { GraveyardItemData } from "@/data/graveyard";

function GraveyardForm({
  item,
  onSaved,
  onDeleted,
  close,
}: {
  item?: GraveyardItemData;
  onSaved: (i: GraveyardItemData) => void;
  onDeleted?: (id: string) => void;
  close: () => void;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [status, setStatus] = useState<GraveyardItemData["status"]>(item?.status ?? "abandoned");
  const [reason, setReason] = useState(item?.reason ?? "");
  const [lesson, setLesson] = useState(item?.lesson ?? "");
  const [font, setFont] = useState(item?.font ?? "hand");
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave() {
    if (!name.trim()) return;
    setBusy(true);
    setErrorMsg(null);
    const supabase = createClient();
    const payload = { name: name.trim(), status, reason: reason.trim(), lesson: lesson.trim(), font };
    if (item) {
      const { error } = await supabase.from("graveyard_items").update(payload).eq("id", item.id);
      setBusy(false);
      if (error) return setErrorMsg(error.message);
      onSaved({ ...payload, id: item.id });
    } else {
      const { data, error } = await supabase
        .from("graveyard_items")
        .insert(payload)
        .select()
        .single();
      setBusy(false);
      if (error || !data) return setErrorMsg(error?.message ?? "Couldn't save.");
      onSaved({ id: data.id, name: data.name, status: data.status, reason: data.reason, lesson: data.lesson, font: data.font });
    }
    close();
  }

  async function handleDelete() {
    if (!item) return;
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("graveyard_items").delete().eq("id", item.id);
    setBusy(false);
    if (error) return setErrorMsg(error.message);
    onDeleted?.(item.id);
    close();
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Project name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          className="w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Status</label>
        <div className="flex gap-2">
          {(["paused", "abandoned"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`border px-3 py-1 font-(family-name:--font-mono) text-xs uppercase ${
                status === s
                  ? "border-(--color-ink) bg-(--color-ink) text-(--color-paper)"
                  : "border-(--color-paper-line) text-(--color-ink-soft)"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          maxLength={200}
          className="w-full resize-none border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Lesson</label>
        <textarea
          value={lesson}
          onChange={(e) => setLesson(e.target.value)}
          rows={2}
          maxLength={140}
          className="w-full resize-none border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
        />
      </div>
      <FontSelect value={font} onChange={setFont} />
      {errorMsg && <p className="text-xs text-(--color-stamp-red)">{errorMsg}</p>}
      <div className="flex items-center justify-between">
        {item ? (
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

export function Graveyard({ items: initial }: { items: GraveyardItemData[] }) {
  const [items, setItems] = useState(initial);

  return (
    <section id="graveyard" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-2 flex items-center gap-3">
        <h2 className="font-(family-name:--font-display) text-3xl font-bold">
          Project Graveyard
        </h2>
        <Stamp color="ink" rotate={6}>R.I.P.</Stamp>
      </div>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        Not every idea makes it. And that&apos;s okay.
      </HandwrittenLabel>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <EditableWrapper
            key={item.id}
            label="Edit graveyard entry"
            renderEditor={(close) => (
              <GraveyardForm
                item={item}
                close={close}
                onSaved={(updated) =>
                  setItems((prev) => prev.map((g) => (g.id === updated.id ? updated : g)))
                }
                onDeleted={(id) => setItems((prev) => prev.filter((g) => g.id !== id))}
              />
            )}
          >
            <NotebookCard
              id={item.id}
              torn="top"
              className="flex h-full flex-col gap-3 bg-(--color-paper-dark)/40"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-(family-name:--font-display) text-lg font-bold">
                  {item.name}
                </h3>
                <Doodle
                  name={item.status === "abandoned" ? "dustbin" : "time"}
                  width={22}
                  className="text-(--color-ink-faint)"
                />
              </div>

              <div>
                <p className="font-(family-name:--font-mono) text-[10px] tracking-widest text-(--color-ink-faint) uppercase">
                  Status
                </p>
                <p
                  className={
                    item.status === "abandoned"
                      ? "text-sm font-semibold text-(--color-stamp-red)"
                      : "text-sm font-semibold text-(--color-pen-blue)"
                  }
                >
                  {item.status === "abandoned" ? "Abandoned" : "Paused"}
                </p>
              </div>

              <div>
                <p className="font-(family-name:--font-mono) text-[10px] tracking-widest text-(--color-ink-faint) uppercase">
                  Reason
                </p>
                <p className="text-sm text-(--color-ink-soft)">{item.reason}</p>
              </div>

              <div className="border-t border-(--color-paper-line) pt-3">
                <p className="font-(family-name:--font-mono) text-[10px] tracking-widest text-(--color-ink-faint) uppercase">
                  Lesson
                </p>
                <p className="font-hand text-base text-(--color-ink)" style={fontStyle(item.font)}>
                  {item.lesson}
                </p>
              </div>
            </NotebookCard>
          </EditableWrapper>
        ))}

        <EditableWrapper
          mode="add"
          label="Add graveyard entry"
          renderEditor={(close) => (
            <GraveyardForm close={close} onSaved={(created) => setItems((prev) => [...prev, created])} />
          )}
        >
          <div className="flex min-h-[12rem] items-center justify-center border-2 border-dashed border-(--color-paper-line) p-8 text-sm text-(--color-ink-faint)">
            + Add graveyard entry
          </div>
        </EditableWrapper>
      </div>
    </section>
  );
}
