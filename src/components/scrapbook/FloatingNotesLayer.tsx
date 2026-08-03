"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { FloatingStickyNote } from "@/components/scrapbook/FloatingStickyNote";
import { createClient } from "@/lib/supabase/client";
import { useIsOwner } from "@/lib/useIsOwner";
import type { FloatingNoteData } from "@/lib/supabase/queries";

export function FloatingNotesLayer({ notes: initial }: { notes: FloatingNoteData[] }) {
  const { isOwner } = useIsOwner();
  const [notes, setNotes] = useState(initial);

  async function handleAdd() {
    const supabase = createClient();
    const payload = {
      text: "Write something!",
      color: "yellow",
      font: "hand",
      rotate: Math.random() * 10 - 5,
      pos_x: 40 + Math.random() * 200,
      pos_y: window.scrollY + 220,
      width: 190,
      height: 170,
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
      },
    ]);
  }

  return (
    <>
      {notes.map((note) => (
        <FloatingStickyNote
          key={note.id}
          note={note}
          isOwner={isOwner}
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
    </>
  );
}
