"use client";

import { useEffect, useState } from "react";
import { StickyNote } from "@/components/scrapbook/StickyNote";
import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { Doodle } from "@/components/scrapbook/Doodle";
import { EditableWrapper } from "@/components/admin/EditableWrapper";
import { FontSelect } from "@/components/admin/FontSelect";
import { fontStyle } from "@/lib/fonts";
import { createClient } from "@/lib/supabase/client";
import { useIsOwner } from "@/lib/useIsOwner";
import type { IdeaData } from "@/data/ideas";

const COLORS: IdeaData["color"][] = ["yellow", "pink", "blue", "green"];
const swatchClass: Record<IdeaData["color"], string> = {
  yellow: "bg-(--color-sticky-yellow)",
  pink: "bg-(--color-sticky-pink)",
  blue: "bg-(--color-sticky-blue)",
  green: "bg-(--color-sticky-green)",
};

/** Hamza's own edit/add form — saves as already-approved. */
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
  const [font, setFont] = useState(idea?.font ?? "hand");
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave() {
    if (!title.trim()) return;
    setBusy(true);
    setErrorMsg(null);
    const supabase = createClient();
    const payload = {
      title: title.trim(),
      category: category.trim(),
      note: note.trim(),
      font,
      approved: true,
    };
    if (idea) {
      const { error } = await supabase.from("ideas").update(payload).eq("id", idea.id);
      setBusy(false);
      if (error) return setErrorMsg(error.message);
      onSaved({ ...payload, id: idea.id, color });
    } else {
      const { data, error } = await supabase.from("ideas").insert(payload).select().single();
      setBusy(false);
      if (error || !data) return setErrorMsg(error?.message ?? "Couldn't save.");
      onSaved({
        id: data.id,
        title: data.title,
        category: data.category,
        note: data.note,
        color,
        font: data.font,
      });
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
      <FontSelect value={font} onChange={setFont} />
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

/** Always-visible public tile — anyone can suggest an idea. Goes into
 *  moderation (approved: false) until Hamza approves it. */
function SuggestIdeaTile({ onSubmitted }: { onSubmitted: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setStatus("sending");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("ideas").insert({
        title: title.trim(),
        category: category.trim() || "Community",
        note: note.trim(),
        submitted_by: submittedBy.trim() || null,
        approved: false,
      });
      if (error) throw error;
      setStatus("sent");
      setTitle("");
      setCategory("");
      setNote("");
      setSubmittedBy("");
      onSubmitted();
    } catch {
      setStatus("error");
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-52 flex-col items-center justify-center gap-2 border-2 border-dashed border-(--color-pen-blue)/50 p-6 text-center text-sm text-(--color-pen-blue) transition-colors hover:bg-(--color-pen-blue)/5"
      >
        <Doodle name="bulb" width={22} onScroll={false} />
        Got an idea?
        <span className="text-xs text-(--color-pen-blue)/80">Suggest it →</span>
      </button>
    );
  }

  return (
    <div className="w-64 border border-(--color-paper-line) bg-white p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <p className="mb-1 font-(family-name:--font-mono) text-[10px] tracking-widest text-(--color-ink-faint) uppercase">
          Suggest an idea
        </p>
        <input
          placeholder="Idea title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={60}
          required
          className="border-b border-(--color-paper-line) bg-transparent py-1 text-sm outline-none focus:border-(--color-pen-blue)"
        />
        <input
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          maxLength={30}
          className="border-b border-(--color-paper-line) bg-transparent py-1 text-sm outline-none focus:border-(--color-pen-blue)"
        />
        <textarea
          placeholder="Why would this be useful?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          maxLength={140}
          className="resize-none border-b border-(--color-paper-line) bg-transparent py-1 text-sm outline-none focus:border-(--color-pen-blue)"
        />
        <input
          placeholder="Your name (optional)"
          value={submittedBy}
          onChange={(e) => setSubmittedBy(e.target.value)}
          maxLength={40}
          className="border-b border-(--color-paper-line) bg-transparent py-1 text-sm outline-none focus:border-(--color-pen-blue)"
        />
        <div className="flex items-center justify-between pt-1">
          <button type="button" onClick={() => setOpen(false)} className="text-xs text-(--color-ink-faint)">
            Cancel
          </button>
          <button
            type="submit"
            disabled={status === "sending"}
            className="border border-(--color-ink) px-3 py-1 font-(family-name:--font-mono) text-[11px] uppercase hover:bg-(--color-ink) hover:text-(--color-paper) disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : "Submit"}
          </button>
        </div>
        {status === "sent" && (
          <p className="text-xs text-(--color-pen-blue)">Thanks! It&apos;ll show up once approved 🙂</p>
        )}
        {status === "error" && (
          <p className="text-xs text-(--color-stamp-red)">Couldn&apos;t submit right now — try again later.</p>
        )}
      </form>
    </div>
  );
}

interface PendingIdea {
  id: string;
  title: string;
  category: string;
  note: string;
  submitted_by: string | null;
  approved: boolean;
}

/** Owner-only — lists every unapproved suggestion with Approve/Delete. */
function IdeaModerationPanel({ onApprove }: { onApprove: (idea: IdeaData) => void }) {
  const [pending, setPending] = useState<PendingIdea[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("ideas")
      .select("*")
      .eq("approved", false)
      .order("created_at", { ascending: false });
    setPending((data as PendingIdea[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    load();
  }, []);

  async function approve(entry: PendingIdea) {
    const supabase = createClient();
    const { error } = await supabase.from("ideas").update({ approved: true }).eq("id", entry.id);
    if (error) return;
    setPending((prev) => prev.filter((p) => p.id !== entry.id));
    onApprove({
      id: entry.id,
      title: entry.title,
      category: entry.category,
      note: entry.note,
      color: COLORS[0],
      submittedBy: entry.submitted_by,
    });
  }

  async function remove(id: string) {
    const supabase = createClient();
    await supabase.from("ideas").delete().eq("id", id);
    setPending((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading || pending.length === 0) return null;

  return (
    <NotebookCard id="idea-moderation" variant="grid" className="mb-8">
      <p className="mb-3 font-(family-name:--font-mono) text-xs tracking-widest text-(--color-ink-faint) uppercase">
        Suggested by visitors — pending approval
      </p>
      <ul className="space-y-3">
        {pending.map((entry) => (
          <li
            key={entry.id}
            className="flex items-center justify-between gap-3 border-b border-(--color-paper-line) pb-2 text-sm"
          >
            <div>
              <p>
                <span className="font-bold">{entry.title}</span>{" "}
                <span className="text-(--color-ink-soft)">— {entry.note}</span>
              </p>
              <p className="font-(family-name:--font-mono) text-[10px] text-(--color-ink-faint)">
                {entry.category || "Community"} · from {entry.submitted_by || "Anonymous"}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => approve(entry)}
                className="font-(family-name:--font-mono) text-xs text-(--color-pen-blue) underline"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => remove(entry.id)}
                className="font-(family-name:--font-mono) text-xs text-(--color-stamp-red) underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </NotebookCard>
  );
}

export function IdeaParkingLot({ ideas: initial }: { ideas: IdeaData[] }) {
  const [ideas, setIdeas] = useState(initial);
  const { isOwner } = useIsOwner();

  return (
    <section id="ideas" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-2 flex items-center gap-3">
        <h2 className="font-(family-name:--font-display) text-3xl font-bold">
          Idea Parking Lot
        </h2>
        <Doodle name="bulb" width={26} className="text-(--color-stamp-red)" />
      </div>
      <HandwrittenLabel as="p" size="sm" className="mb-6 text-(--color-ink-faint)">
        Ideas for another day — got one? Add it below.
      </HandwrittenLabel>

      {isOwner && <IdeaModerationPanel onApprove={(idea) => setIdeas((prev) => [idea, ...prev])} />}

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
              <div style={fontStyle(idea.font)}>
                <p className="text-lg font-bold">{idea.title}</p>
                <p className="mt-2 text-sm opacity-80">{idea.note}</p>
              </div>
              <p className="mt-3 font-(family-name:--font-mono) text-[10px] tracking-widest uppercase opacity-60">
                {idea.category}
                {idea.submittedBy ? ` · from ${idea.submittedBy}` : ""}
              </p>
            </StickyNote>
          </EditableWrapper>
        ))}

        <SuggestIdeaTile onSubmitted={() => {}} />

        <EditableWrapper
          mode="add"
          label="Add idea"
          renderEditor={(close) => (
            <IdeaForm close={close} onSaved={(created) => setIdeas((prev) => [...prev, created])} />
          )}
        >
          <div className="flex w-52 items-center justify-center border-2 border-dashed border-(--color-paper-line) p-8 text-sm text-(--color-ink-faint)">
            + Add idea (owner)
          </div>
        </EditableWrapper>
      </div>
    </section>
  );
}
