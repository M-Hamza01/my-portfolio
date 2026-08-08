"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { FloatingStickyNote } from "@/components/scrapbook/FloatingStickyNote";
import { createClient } from "@/lib/supabase/client";
import { useIsOwner } from "@/lib/useIsOwner";
import type { FloatingNoteData } from "@/lib/supabase/queries";

interface AnchorOffset {
  x: number;
  y: number;
}

/** Finds the section whose vertical span contains the viewport's
 *  center — used both to pick a home for new notes and (implicitly,
 *  via the same section elements) to anchor existing ones. */
function findCurrentSectionId(): string {
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const viewportCenter = window.innerHeight / 2;
  for (const el of sections) {
    const rect = el.getBoundingClientRect();
    if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
      return el.id;
    }
  }
  return sections[0]?.id ?? "home";
}

/** Measures where every note's anchor section currently sits relative
 *  to <main> — done live, not stored, which is what makes this
 *  correct regardless of how much owner-only UI (the "+ Add" tiles)
 *  is or isn't adding height above it for the current viewer. */
function resolveAnchorOffsets(notes: FloatingNoteData[]): Record<string, AnchorOffset> {
  const mainEl = document.querySelector("main");
  const mainRect = mainEl?.getBoundingClientRect();
  const offsets: Record<string, AnchorOffset> = {};
  for (const note of notes) {
    if (offsets[note.sectionId]) continue;
    const sectionEl = document.getElementById(note.sectionId);
    if (!sectionEl || !mainRect) {
      offsets[note.sectionId] = { x: 0, y: 0 };
      continue;
    }
    const sectionRect = sectionEl.getBoundingClientRect();
    offsets[note.sectionId] = {
      x: sectionRect.left - mainRect.left,
      y: sectionRect.top - mainRect.top,
    };
  }
  return offsets;
}

export function FloatingNotesLayer({ notes: initial }: { notes: FloatingNoteData[] }) {
  const { isOwner, loading } = useIsOwner();
  const [notes, setNotes] = useState(initial);
  const [anchorOffsets, setAnchorOffsets] = useState<Record<string, AnchorOffset> | null>(null);

  useEffect(() => {
    // Wait for the owner-check to resolve first — signing in adds
    // owner-only UI (heights change), so measuring before that settles
    // would immediately be stale.
    if (loading) return;

    function recompute() {
      setAnchorOffsets(resolveAnchorOffsets(notes));
    }
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [notes, loading]);

  async function handleAdd() {
    const sectionId = findCurrentSectionId();
    const supabase = createClient();
    const payload = {
      text: "Write something!",
      color: "yellow",
      font: "hand",
      rotate: Math.random() * 10 - 5,
      pos_x: 40 + Math.random() * 120,
      pos_y: 80 + Math.random() * 120,
      width: 190,
      height: 170,
      section_id: sectionId,
    };
    const { data, error } = await supabase.from("floating_notes").insert(payload).select().single();
    if (error || !data) return;
    setNotes((prev) => [
      ...prev,
      {
        id: data.id,
        text: data.text,
        color: data.color,
        font: data.font,
        rotate: data.rotate,
        posX: data.pos_x,
        posY: data.pos_y,
        width: data.width,
        height: data.height,
        sectionId: data.section_id,
      },
    ]);
  }

  // Render nothing until offsets are measured — avoids a flash of
  // wrongly-positioned notes before the first measurement lands.
  if (!anchorOffsets) return null;

  return (
    <>
      {/* Positions are anchored to a section (not raw page pixels), but
          that anchoring is still measured against the full-width page
          canvas at a desktop viewport — doesn't translate to narrow
          screens, so this stays a desktop-only embellishment, same
          breakpoint the sidebar itself switches at. */}
      <div className="hidden lg:contents">
        {notes.map((note) => (
          <FloatingStickyNote
            key={note.id}
            note={note}
            isOwner={isOwner}
            anchorOffset={anchorOffsets[note.sectionId] ?? { x: 0, y: 0 }}
            onUpdate={(updated) => setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))}
            onDelete={(id) => setNotes((prev) => prev.filter((n) => n.id !== id))}
          />
        ))}

        {isOwner && (
          <button
            type="button"
            onClick={handleAdd}
            aria-label="Add sticky note"
            className="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-(--color-ink) bg-(--color-sticky-yellow) text-(--color-ink) shadow-lg transition-transform hover:scale-105"
          >
            <Plus size={20} />
          </button>
        )}
      </div>
    </>
  );
}
