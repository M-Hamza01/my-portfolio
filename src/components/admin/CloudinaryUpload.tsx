"use client";

import { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface CloudinaryUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
}

export function CloudinaryUpload({ value, onChange, label = "Cover image" }: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="mb-1 block text-xs text-(--color-ink-faint)">{label}</label>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element -- preview of an already-uploaded remote URL, no optimization win here
        <img
          src={value}
          alt="Preview"
          className="mb-2 h-28 w-full rounded border border-(--color-paper-line) object-cover"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={uploading}
        className="w-full text-xs text-(--color-ink-soft) file:mr-3 file:border file:border-(--color-paper-line) file:bg-white file:px-2 file:py-1 file:text-xs"
      />
      {uploading && <p className="mt-1 text-xs text-(--color-ink-faint)">Uploading…</p>}
      {error && <p className="mt-1 text-xs text-(--color-stamp-red)">{error}</p>}
    </div>
  );
}
