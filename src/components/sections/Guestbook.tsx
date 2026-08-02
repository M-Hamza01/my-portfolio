"use client";

import { useEffect, useRef, useState } from "react";
import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { DoodleCanvas, type DoodleCanvasHandle } from "@/components/scrapbook/DoodleCanvas";
import { createClient } from "@/lib/supabase/client";
import { useIsOwner } from "@/lib/useIsOwner";
import { seededRotation } from "@/lib/utils";

interface GuestbookEntry {
  id: string;
  name: string;
  note: string;
  date: string;
  doodleDataUrl?: string;
}

interface GuestbookProps {
  entries: GuestbookEntry[];
}

interface ModerationEntry {
  id: string;
  name: string;
  note: string;
  created_at: string;
  approved: boolean;
  doodle_data_url: string | null;
}

/** Owner-only. Pending entries shown by default; approved history is
 *  collapsed behind "View approved" so it doesn't turn into an endless
 *  scroll of things already dealt with. */
function ModerationPanel() {
  const [all, setAll] = useState<ModerationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApproved, setShowApproved] = useState(false);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("guestbook_entries")
      .select("*")
      .order("created_at", { ascending: false });
    setAll((data as ModerationEntry[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    load();
  }, []);

  const pending = all.filter((e) => !e.approved);
  const approved = all.filter((e) => e.approved);

  async function approve(id: string) {
    const supabase = createClient();
    await supabase.from("guestbook_entries").update({ approved: true }).eq("id", id);
    setAll((prev) => prev.map((e) => (e.id === id ? { ...e, approved: true } : e)));
  }

  async function approveAll() {
    if (pending.length === 0) return;
    const supabase = createClient();
    const ids = pending.map((p) => p.id);
    await supabase.from("guestbook_entries").update({ approved: true }).in("id", ids);
    setAll((prev) => prev.map((e) => (ids.includes(e.id) ? { ...e, approved: true } : e)));
  }

  async function remove(id: string) {
    const supabase = createClient();
    await supabase.from("guestbook_entries").delete().eq("id", id);
    setAll((prev) => prev.filter((e) => e.id !== id));
  }

  if (loading) return null;

  const Row = ({ entry, showApprove }: { entry: ModerationEntry; showApprove: boolean }) => (
    <li className="flex items-center justify-between gap-3 border-b border-(--color-paper-line) pb-2 text-sm">
      <div className="flex items-center gap-3">
        {entry.doodle_data_url && (
          // eslint-disable-next-line @next/next/no-img-element -- data URL thumbnail
          <img
            src={entry.doodle_data_url}
            alt=""
            className="h-10 w-16 shrink-0 rounded-sm border border-(--color-paper-line) object-cover"
          />
        )}
        <div>
          <p>
            <span className="font-bold">{entry.name}</span>
            {entry.note && <span className="text-(--color-ink-soft)"> — {entry.note}</span>}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        {showApprove && (
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
  );

  return (
    <NotebookCard id="guestbook-moderation" variant="grid" className="mb-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-(family-name:--font-mono) text-xs tracking-widest text-(--color-ink-faint) uppercase">
          Moderation (only you can see this)
        </p>
        {pending.length > 0 && (
          <button
            type="button"
            onClick={approveAll}
            className="shrink-0 border border-(--color-ink) px-3 py-1 font-(family-name:--font-mono) text-[11px] uppercase hover:bg-(--color-ink) hover:text-(--color-paper)"
          >
            Approve all ({pending.length})
          </button>
        )}
      </div>

      {pending.length === 0 ? (
        <p className="text-sm text-(--color-ink-faint)">No pending doodles 🎉</p>
      ) : (
        <ul className="space-y-3">
          {pending.map((entry) => (
            <Row key={entry.id} entry={entry} showApprove />
          ))}
        </ul>
      )}

      {approved.length > 0 && (
        <div className="mt-4 border-t border-(--color-paper-line) pt-3">
          <button
            type="button"
            onClick={() => setShowApproved((v) => !v)}
            className="font-(family-name:--font-mono) text-xs text-(--color-pen-blue) underline"
          >
            {showApproved ? "Hide approved" : `View approved (${approved.length})`}
          </button>
          {showApproved && (
            <ul className="mt-3 space-y-3">
              {approved.map((entry) => (
                <Row key={entry.id} entry={entry} showApprove={false} />
              ))}
            </ul>
          )}
        </div>
      )}
    </NotebookCard>
  );
}

/** The board itself — every approved doodle collaged together, no
 *  individual card chrome. Hover (or tap) a doodle to see who drew it. */
function DoodleBoard({ entries }: { entries: GuestbookEntry[] }) {
  const [active, setActive] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center border-2 border-dashed border-(--color-paper-line) bg-(--color-paper-dark)/30">
        <p className="font-(family-name:--font-hand) text-lg text-(--color-ink-faint)">
          No doodles yet — be the first to make a mark ↑
        </p>
      </div>
    );
  }

  return (
    <div className="relative border border-(--color-paper-line) bg-(--color-paper-dark)/40 p-8">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="relative flex flex-wrap items-center justify-center gap-3">
        {entries.map((entry) => {
          const rotate = seededRotation(entry.id, 12);
          const isActive = active === entry.id;
          return (
            <div
              key={entry.id}
              className="group relative"
              style={{ rotate: `${rotate}deg` }}
              onMouseEnter={() => setActive(entry.id)}
              onMouseLeave={() => setActive((a) => (a === entry.id ? null : a))}
            >
              <button
                type="button"
                onClick={() => setActive((a) => (a === entry.id ? null : entry.id))}
                aria-label={`Doodle from ${entry.name}`}
                className="block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- data URL, next/image optimizer doesn't help here */}
                <img
                  src={entry.doodleDataUrl}
                  alt={`Doodle from ${entry.name}`}
                  className="h-28 w-44 cursor-pointer rounded-sm border border-white bg-white object-cover shadow-md transition-transform duration-200 group-hover:z-20 group-hover:scale-110"
                />
              </button>

              {isActive && (
                <div className="absolute top-full left-1/2 z-30 mt-2 w-max max-w-[180px] -translate-x-1/2 rounded bg-(--color-ink) px-2.5 py-1.5 text-center shadow-lg">
                  {entry.note && (
                    <p className="font-(family-name:--font-hand) text-sm text-(--color-paper)">
                      &ldquo;{entry.note}&rdquo;
                    </p>
                  )}
                  <p className="font-(family-name:--font-mono) text-[10px] text-(--color-paper)/70">
                    — {entry.name}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Guestbook({ entries }: GuestbookProps) {
  const { isOwner } = useIsOwner();
  const canvasRef = useRef<DoodleCanvasHandle>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const doodleEntries = entries.filter((e) => e.doodleDataUrl);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const isEmpty = canvasRef.current?.isEmpty() ?? true;
    if (isEmpty) {
      setErrorMsg("Draw something first — that's the whole point 🙂");
      return;
    }

    setStatus("sending");
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const doodleDataUrl = canvasRef.current?.getDataUrl() ?? null;
      const { error } = await supabase.from("guestbook_entries").insert({
        name: name.trim(),
        note: note.trim(),
        doodle_data_url: doodleDataUrl,
        approved: false,
      });
      if (error) throw error;
      setStatus("sent");
      setName("");
      setNote("");
      canvasRef.current?.clear();
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
        Grab your mouse and make it messier.
      </HandwrittenLabel>

      {isOwner && <ModerationPanel />}

      <div className="mb-12">
        <NotebookCard id="guestbook-canvas-form" variant="ruled">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <DoodleCanvas ref={canvasRef} />

            <div className="grid gap-4 sm:grid-cols-2">
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
                  Caption (optional)
                </label>
                <input
                  id="gb-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={140}
                  className="w-full border-b border-(--color-paper-line) bg-transparent py-1.5 font-(family-name:--font-hand) text-lg text-(--color-ink) outline-none focus:border-(--color-pen-blue)"
                  placeholder="Loved the scrapbook vibe!"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-fit border border-(--color-ink) px-4 py-2 font-(family-name:--font-mono) text-xs tracking-wide uppercase transition-colors hover:bg-(--color-ink) hover:text-(--color-paper) disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Leave your mark"}
            </button>

            {errorMsg && (
              <p className="font-(family-name:--font-hand) text-sm text-(--color-stamp-red)">
                {errorMsg}
              </p>
            )}
            {status === "sent" && (
              <p className="font-(family-name:--font-hand) text-sm text-(--color-pen-blue)">
                Thanks! Your doodle is waiting for approval, then it&apos;ll show up on the board.
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

      <DoodleBoard entries={doodleEntries} />
    </section>
  );
}
