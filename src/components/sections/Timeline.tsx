"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Doodle } from "@/components/scrapbook/Doodle";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { EditableWrapper } from "@/components/admin/EditableWrapper";
import { createClient } from "@/lib/supabase/client";
import { DOODLES, type DoodleName } from "@/lib/doodleLibrary";
import type { TimelineNodeData } from "@/data/timeline";

const DOODLE_NAMES = Object.keys(DOODLES) as DoodleName[];

function NodeForm({
  node,
  onSaved,
  onDeleted,
  close,
}: {
  node?: TimelineNodeData;
  onSaved: (n: TimelineNodeData) => void;
  onDeleted?: (id: string) => void;
  close: () => void;
}) {
  const [label, setLabel] = useState(node?.label ?? "");
  const [date, setDate] = useState(node?.date ?? "");
  const [icon, setIcon] = useState<string>(node?.icon ?? "sparkle");
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave() {
    if (!label.trim() || !date.trim()) return;
    setBusy(true);
    setErrorMsg(null);
    const supabase = createClient();
    const payload = { label: label.trim(), date_label: date.trim(), icon };
    if (node) {
      const { error } = await supabase.from("timeline_nodes").update(payload).eq("id", node.id);
      setBusy(false);
      if (error) return setErrorMsg(error.message);
      onSaved({ id: node.id, label: payload.label, date: payload.date_label, icon: icon as DoodleName });
    } else {
      const { data, error } = await supabase.from("timeline_nodes").insert(payload).select().single();
      setBusy(false);
      if (error || !data) return setErrorMsg(error?.message ?? "Couldn't save.");
      onSaved({ id: data.id, label: data.label, date: data.date_label, icon: data.icon as DoodleName });
    }
    close();
  }

  async function handleDelete() {
    if (!node) return;
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("timeline_nodes").delete().eq("id", node.id);
    setBusy(false);
    if (error) return setErrorMsg(error.message);
    onDeleted?.(node.id);
    close();
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Label</label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          maxLength={80}
          className="w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Date label</label>
        <input
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Jan 2025"
          maxLength={20}
          className="w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-(--color-ink-faint)">Icon</label>
        <input
          list="doodle-names"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
        />
        <datalist id="doodle-names">
          {DOODLE_NAMES.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
        <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-full border border-(--color-ink-faint)">
          {DOODLES[icon as DoodleName] ? (
            <Doodle name={icon as DoodleName} width={20} onScroll={false} />
          ) : (
            <span className="text-xs text-(--color-stamp-red)">?</span>
          )}
        </div>
      </div>
      {errorMsg && <p className="text-xs text-(--color-stamp-red)">{errorMsg}</p>}
      <div className="flex items-center justify-between">
        {node ? (
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

export function Timeline({ nodes: initial }: { nodes: TimelineNodeData[] }) {
  const [nodes, setNodes] = useState(initial);

  return (
    <section id="timeline" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-2 font-(family-name:--font-display) text-3xl font-bold">
        My Journey So Far
      </h2>
      <HandwrittenLabel as="p" size="sm" className="mb-12 text-(--color-ink-faint)">
        It&apos;s a journey, not a race.
      </HandwrittenLabel>

      <div className="relative">
        <div
          aria-hidden
          className="absolute top-7 right-6 left-6 hidden border-t-2 border-dashed border-(--color-paper-line) md:block"
        />

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-6 md:gap-x-2">
          {nodes.map((node, i) => (
            <EditableWrapper
              key={node.id}
              label="Edit timeline entry"
              renderEditor={(close) => (
                <NodeForm
                  node={node}
                  close={close}
                  onSaved={(updated) =>
                    setNodes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
                  }
                  onDeleted={(id) => setNodes((prev) => prev.filter((n) => n.id !== id))}
                />
              )}
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-(--color-ink) bg-(--color-paper) text-(--color-ink-soft)">
                  <Doodle name={node.icon} width={26} onScroll={false} />
                </div>
                <p className="mt-3 max-w-[9rem] text-xs leading-snug text-(--color-ink)">
                  {node.label}
                </p>
                <p className="mt-1 font-(family-name:--font-mono) text-[10px] text-(--color-ink-faint)">
                  {node.date}
                </p>
              </motion.div>
            </EditableWrapper>
          ))}

          <EditableWrapper
            mode="add"
            label="Add timeline entry"
            renderEditor={(close) => (
              <NodeForm close={close} onSaved={(created) => setNodes((prev) => [...prev, created])} />
            )}
          >
            <div className="flex flex-col items-center justify-center gap-2 text-(--color-ink-faint)">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-(--color-paper-line)">
                +
              </div>
              <p className="text-xs">Add</p>
            </div>
          </EditableWrapper>
        </div>
      </div>
    </section>
  );
}
