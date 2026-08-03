"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { PolaroidCard } from "@/components/scrapbook/PolaroidCard";
import { CloudinaryUpload } from "@/components/admin/CloudinaryUpload";
import { useIsOwner } from "@/lib/useIsOwner";
import { createClient } from "@/lib/supabase/client";

interface EditablePolaroidProps {
  /** Unique key in the site_images table, e.g. "hero-portrait". */
  imageKey: string;
  /** Falls back to this (a static public/ path) until a real photo is uploaded. */
  defaultSrc: string;
  /** Current value from the DB, if any (passed down from the server component). */
  initialSrc?: string;
  alt: string;
  caption?: string;
  rotate?: number;
  width?: number;
}

/**
 * A PolaroidCard that Hamza can replace in place. Regular visitors see
 * just the photo — the pencil icon and upload panel only render for
 * the signed-in owner.
 */
export function EditablePolaroid({
  imageKey,
  defaultSrc,
  initialSrc,
  alt,
  caption,
  rotate,
  width,
}: EditablePolaroidProps) {
  const { isOwner } = useIsOwner();
  const [src, setSrc] = useState(initialSrc || defaultSrc);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleUploaded(url: string) {
    setSaving(true);
    setErrorMsg(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("site_images")
      .upsert({ key: imageKey, url, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) return setErrorMsg(error.message);
    setSrc(url);
    setEditing(false);
  }

  return (
    <div className="group/polaroid relative inline-block">
      <PolaroidCard id={imageKey} src={src} alt={alt} caption={caption} rotate={rotate} width={width} />

      {isOwner && (
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          aria-label="Change photo"
          className="absolute -top-2 -right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-(--color-ink-faint) bg-white text-(--color-ink-soft) opacity-0 shadow-md transition-opacity group-hover/polaroid:opacity-100 focus-visible:opacity-100"
        >
          {editing ? <X size={14} /> : <Pencil size={14} />}
        </button>
      )}

      {editing && (
        <div className="absolute top-full left-0 z-20 mt-2 w-56 max-w-[85vw] border border-(--color-paper-line) bg-white p-3 shadow-lg">
          <CloudinaryUpload value={null} onChange={handleUploaded} label="Replace photo" />
          {saving && <p className="mt-1 text-xs text-(--color-ink-faint)">Saving…</p>}
          {errorMsg && <p className="mt-1 text-xs text-(--color-stamp-red)">{errorMsg}</p>}
        </div>
      )}
    </div>
  );
}
