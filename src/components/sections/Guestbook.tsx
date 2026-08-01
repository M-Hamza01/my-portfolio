"use client";

import { useState } from "react";
import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { StickyNote } from "@/components/scrapbook/StickyNote";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { createClient } from "@/lib/supabase/client";
import { SEED_GUESTBOOK } from "@/data/guestbookSeed";

const STICKY_COLORS = ["yellow", "pink", "blue", "green"] as const;

export function Guestbook() {
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

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-wrap items-start gap-5">
          {SEED_GUESTBOOK.map((entry, i) => (
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
