import type { CSSProperties } from "react";

export interface FontOption {
  id: string;
  label: string;
  cssVar: string;
}

/**
 * Every editable text field that supports font choice picks from this
 * list, stores the `id` in the database, and renders with fontStyle(id).
 *
 * "custom-1" and "custom-2" are Hamza's own fonts (see src/fonts/ and
 * layout.tsx). "hand" aliases to custom-1 by default (see globals.css),
 * so most handwriting-styled content already uses it automatically.
 */
export const FONT_OPTIONS: FontOption[] = [
  { id: "hand", label: "Handwriting (default)", cssVar: "--font-hand" },
  { id: "display", label: "Display (Space Grotesk)", cssVar: "--font-display" },
  { id: "body", label: "Body (Inter)", cssVar: "--font-body" },
  { id: "mono", label: "Mono (JetBrains)", cssVar: "--font-mono" },
  { id: "custom-1", label: "Hamza's Handwriting", cssVar: "--font-custom-1" },
  { id: "custom-2", label: "Elms Sans", cssVar: "--font-custom-2" },
];

export const DEFAULT_FONT_ID = "hand";

export function fontStyle(id?: string | null): CSSProperties {
  const opt = FONT_OPTIONS.find((f) => f.id === id) ?? FONT_OPTIONS[0];
  return { fontFamily: `var(${opt.cssVar})` };
}
