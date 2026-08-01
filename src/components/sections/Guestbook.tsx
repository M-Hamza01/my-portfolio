"use client";

import { useEffect, useState } from "react";
import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { StickyNote } from "@/components/scrapbook/StickyNote";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { createClient } from "@/lib/supabase/client";
import { useIsOwner } from "@/lib/useIsOwner";

const STICKY_COLORS = ["yellow", "pink", "blue", "green"] as const;

interface GuestbookProps {
  entries: { id: string; name: string; note: string; date: string }[];
}

interface PendingEntry {
  id: string;
  name: string;
  note: string;
  created_at: string;
  approved: boolean;
}

function ModerationPanel() {
  const [pending, setPending] = useState<PendingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("guestbook_entries")
      .select("*")
      .order("created_at", { ascending: false });
    setPending((data as PendingEntry[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    load();
  }, []);

  async function approve(id: string) {
    const supabase = createClient();
    await supabase.from("guestbook_entries").update({ approved: true }).eq("id", id);
    setPending((prev) => prev.map((p) => (p.id === id ? { ...p, approved: true } : p)));
  }

  async function remove(id: string) {
    const supabase = createClient();
    await supabase.from("guestbook_entries").delete().eq("id", id);
    setPending((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) return null;

  return (
    <NotebookCard id="guestbook-moderation" variant="grid" className="mb-8">
      <p className="mb-3 font-(family-name:--font-mono) text-xs tracking-widest text-(--color-ink-faint) uppercase">
        Moderation (only you can see this)
      </p>
      {pending.length === 0 ? (
        <p className="text-sm text-(--color-ink-faint)">No guestbook entries yet.</p>
      ) : (
        <ul className="space-y-3">
          {pending.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-3 border-b border-(--color-paper-line) pb-2 text-sm"
            >
              <div>
                <p>
                  <span className="font-bold">{entry.name}</span>{" "}
                  <span className="text-(--color-ink-soft)">— {entry.note}</span>
                </p>
                <p className="font-(family-name:--font-mono) text-[10px] text-(--color-ink-faint)">
                  {entry.approved ? "approved" : "pending"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {!entry.approved && (
                  <button
                    type="button"
                    onClick={() => approve(entry.id)}
                    className="font-(family-name:--font-mono) text-xs text-(--color-pen-blue) underline"
                  >
                    Approve
                  </button>
                )}
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
      )}
    </NotebookCard>
  );
}

export function Guestbook({ entries }: GuestbookProps) {
  const { isOwner } = useIsOwner();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !note.trim()) return;
    setStatus("sending");
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("guestbook_entries")
        .insert({ name: name.trim(), note: note.trim(), approved: false });
      if (error) throw error;
      setStatus("sent");
      setName("");
      setNote("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="guestbook" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-2 font-(family-name:--font-display) text-3xl font-bold">
        Guestbook
      </h2>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        Leave a note if you like the work!
      </HandwrittenLabel>

      {isOwner && <ModerationPanel />}

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-wrap items-start gap-5">
          {entries.map((entry, i) => (
            <StickyNote
              key={entry.id}
              id={entry.id}
              color={STICKY_COLORS[i % STICKY_COLORS.length]}
              className="w-56"
            >
              <p className="font-bold">{entry.name}</p>
              <p className="mt-1 text-sm opacity-90">{entry.note}</p>
              <p className="mt-2 font-(family-name:--font-mono) text-[10px] opacity-60">
                {entry.date}
              </p>
            </StickyNote>
          ))}
        </div>

        <NotebookCard id="guestbook-form" variant="ruled">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="gb-name" className="mb-1 block text-xs text-(--color-ink-faint)">
                Your name
              </label>
              <input
                id="gb-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={60}
                className="w-full border-b border-(--color-paper-line) bg-transparent py-1.5 font-(family-name:--font-hand) text-lg text-(--color-ink) outline-none focus:border-(--color-pen-blue)"
                placeholder="Ali Raza"
              />
            </div>
            <div>
              <label htmlFor="gb-note" className="mb-1 block text-xs text-(--color-ink-faint)">
                Your note
              </label>
              <textarea
                id="gb-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                required
                maxLength={280}
                rows={3}
                className="w-full resize-none border-b border-(--color-paper-line) bg-transparent py-1.5 font-(family-name:--font-hand) text-lg text-(--color-ink) outline-none focus:border-(--color-pen-blue)"
                placeholder="Loved the scrapbook vibe!"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-fit border border-(--color-ink) px-4 py-2 font-(family-name:--font-mono) text-xs tracking-wide uppercase transition-colors hover:bg-(--color-ink) hover:text-(--color-paper) disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Sign the guestbook"}
            </button>

            {status === "sent" && (
              <p className="font-(family-name:--font-hand) text-sm text-(--color-pen-blue)">
                Thanks! Your note is waiting for approval, then it&apos;ll show up above.
              </p>
            )}
            {status === "error" && (
              <p className="font-(family-name:--font-hand) text-sm text-(--color-stamp-red)">
                Couldn&apos;t submit right now — the guestbook backend isn&apos;t connected yet.
              </p>
            )}
          </form>
        </NotebookCard>
      </div>
    </section>
  );
}
