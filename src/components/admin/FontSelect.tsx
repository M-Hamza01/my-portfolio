"use client";

import { FONT_OPTIONS, fontStyle } from "@/lib/fonts";

interface FontSelectProps {
  value: string;
  onChange: (id: string) => void;
  label?: string;
}

export function FontSelect({ value, onChange, label = "Font" }: FontSelectProps) {
  return (
    <div>
      <label className="mb-1 block text-xs text-(--color-ink-faint)">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-(--color-paper-line) bg-white p-2 text-sm outline-none focus:border-(--color-pen-blue)"
      >
        {FONT_OPTIONS.map((f) => (
          <option key={f.id} value={f.id} style={fontStyle(f.id)}>
            {f.label}
          </option>
        ))}
      </select>
    </div>
  );
}
