"use client";

import { useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Pencil, X } from "lucide-react";
import { FontSelect } from "@/components/admin/FontSelect";
import { fontStyle } from "@/lib/fonts";
import { createClient } from "@/lib/supabase/client";
import { ALL_STICKY_COLOR_IDS, STICKY_ASSETS } from "@/lib/stickyNoteAssets";
import type { FloatingNoteData } from "@/lib/supabase/queries";

const MIN_SIZE = 120;
const MAX_SIZE = 420;

interface FloatingStickyNoteProps {
  note: FloatingNoteData;
  isOwner: boolean;
  onUpdate: (note: FloatingNoteData) => void;
  onDelete: (id: string) => void;
}

export function FloatingStickyNote({ note, isOwner, onUpdate, onDelete }: FloatingStickyNoteProps) {
  const x = useMotionValue(note.posX);
  const y = useMotionValue(note.posY);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(note.text);
  const [color, setColor] = useState(note.color);
  const [font, setFont] = useState(note.font);
  const [rotate, setRotate] = useState(note.rotate);
  const [size, setSize] = useState({ width: note.width, height: note.height });
  const [resizing, setResizing] = useState(false);
  const [busy, setBusy] = useState(false);

  const asset = STICKY_ASSETS[note.color] ?? STICKY_ASSETS.yellow;

  async function persist(patch: Record<string, unknown>) {
    const supabase = createClient();
    await supabase.from("floating_notes").update(patch).eq("id", note.id);
  }

  async function handleDragEnd() {
    const newX = x.get();
    const newY = y.get();
    onUpdate({ ...note, posX: newX, posY: newY });
    await persist({ pos_x: newX, pos_y: newY });
  }

  function handleResizeStart(e: React.PointerEvent) {
    e.stopPropagation();
    e.preventDefault();
    setResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = size.width;
    const startH = size.height;
    const live = { width: startW, height: startH };

    function handleMove(ev: PointerEvent) {
      const newW = Math.min(MAX_SIZE, Math.max(MIN_SIZE, startW + (ev.clientX - startX)));
      const newH = Math.min(MAX_SIZE, Math.max(MIN_SIZE, startH + (ev.clientY - startY)));
      live.width = newW;
      live.height = newH;
      setSize({ width: newW, height: newH });
    }
    async function handleUp() {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      setResizing(false);
      onUpdate({ ...note, width: live.width, height: live.height });
      await persist({ width: live.width, height: live.height });
    }
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }

  async function handleSave() {
    setBusy(true);
    const payload = {
      text: text.trim() || "Write something!",
      color,
      font,
      rotate,
      width: size.width,
      height: size.height,
    };
    await persist(payload);
    setBusy(false);
    onUpdate({ ...note, ...payload });
    setEditing(false);
  }

  async function handleDelete() {
    setBusy(true);
    const supabase = createClient();
    await supabase.from("floating_notes").delete().eq("id", note.id);
    setBusy(false);
    onDelete(note.id);
  }

  return (
    <motion.div
      drag={isOwner && !resizing}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      style={{ x, y, position: "absolute", top: 0, left: 0, zIndex: 40 }}
      className={isOwner ? "cursor-grab active:cursor-grabbing" : ""}
    >
      <div
        className="group/floatnote relative"
        style={{ width: size.width, height: size.height, rotate: `${note.rotate}deg` }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${asset.src})`, backgroundSize: "100% 100%" }}
        />
        {/* Text sits in a percentage-based safe zone matching the
            visible paper region inside the SVG's canvas (which has a
            transparent curl/shadow margin, mostly on the left) — using
            % inset here instead of fixed padding means the text stays
            inside the paper at any resize, not just the size this was
            tuned at. */}
        <div className="absolute overflow-hidden" style={{ top: "30%", left: "30%", right: "10%", bottom: "20%" }}>
          <p className="text-base leading-snug text-(--color-ink)" style={fontStyle(note.font)}>
            {note.text}
          </p>
        </div>

        {isOwner && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEditing((v) => !v);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Edit sticky note"
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-(--color-ink-faint) bg-white text-(--color-ink-soft) opacity-0 shadow-md transition-opacity group-hover/floatnote:opacity-100 focus-visible:opacity-100"
            >
              {editing ? <X size={12} /> : <Pencil size={12} />}
            </button>

            <div
              onPointerDown={handleResizeStart}
              aria-label="Resize sticky note"
              className="absolute right-1 bottom-1 h-4 w-4 cursor-nwse-resize opacity-0 transition-opacity group-hover/floatnote:opacity-100"
            >
              <svg viewBox="0 0 16 16" className="h-full w-full text-(--color-ink-faint)">
                <path d="M14 2L2 14M14 8L8 14M14 14L14 14" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </>
        )}

        {editing && (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute top-full left-0 z-50 mt-2 w-56 border border-(--color-paper-line) bg-white p-3 shadow-lg"
          >
            <div className="flex flex-col gap-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                maxLength={140}
                className="w-full resize-none border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
              />
              <div>
                <label className="mb-1 block text-xs text-(--color-ink-faint)">Color</label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_STICKY_COLOR_IDS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      aria-label={c}
                      className={`h-6 w-6 rounded-full border-2 ${
                        color === c ? "border-(--color-ink)" : "border-transparent"
                      }`}
                      style={{ backgroundColor: STICKY_ASSETS[c].hex }}
                    />
                  ))}
                </div>
              </div>
              <FontSelect value={font} onChange={setFont} />
              <div>
                <label className="mb-1 block text-xs text-(--color-ink-faint)">Tilt: {Math.round(rotate)}°</label>
                <input
                  type="range"
                  min={-20}
                  max={20}
                  value={rotate}
                  onChange={(e) => setRotate(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs text-(--color-ink-faint)">Width (px)</label>
                  <input
                    type="number"
                    min={MIN_SIZE}
                    max={MAX_SIZE}
                    value={Math.round(size.width)}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : Number(e.target.value);
                      if (!Number.isNaN(val)) setSize((s) => ({ ...s, width: val }));
                    }}
                    onBlur={() =>
                      setSize((s) => ({ ...s, width: Math.min(MAX_SIZE, Math.max(MIN_SIZE, s.width || MIN_SIZE)) }))
                    }
                    className="w-full border border-(--color-paper-line) bg-white p-1.5 text-sm outline-none focus:border-(--color-pen-blue)"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-(--color-ink-faint)">Height (px)</label>
                  <input
                    type="number"
                    min={MIN_SIZE}
                    max={MAX_SIZE}
                    value={Math.round(size.height)}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : Number(e.target.value);
                      if (!Number.isNaN(val)) setSize((s) => ({ ...s, height: val }));
                    }}
                    onBlur={() =>
                      setSize((s) => ({ ...s, height: Math.min(MAX_SIZE, Math.max(MIN_SIZE, s.height || MIN_SIZE)) }))
                    }
                    className="w-full border border-(--color-paper-line) bg-white p-1.5 text-sm outline-none focus:border-(--color-pen-blue)"
                  />
                </div>
              </div>
              <p className="text-[11px] text-(--color-ink-faint)">
                Or drag the corner of the note itself to resize freely.
              </p>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={busy}
                  className="font-(family-name:--font-mono) text-xs text-(--color-stamp-red) underline"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={busy}
                  className="border border-(--color-ink) px-3 py-1 font-(family-name:--font-mono) text-xs uppercase hover:bg-(--color-ink) hover:text-(--color-paper) disabled:opacity-50"
                >
                  {busy ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
