"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { DOODLES, type DoodleName } from "@/lib/doodleLibrary";

interface DoodleProps {
  /**
   * Name of a curated doodle from the external hand-drawn library
   * (see src/lib/doodleLibrary.ts). Use this for anything that isn't
   * a tiny custom mark — arrows, lightbulbs, books, stars, etc.
   */
  name?: DoodleName;
  /** One or more SVG path "d" strings — for small custom marks only
   *  (underlines, simple arrows). Ignored if `name` is set. */
  paths?: string[];
  viewBox?: string;
  width?: number;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  /** Draw once when scrolled into view (default) or immediately. */
  onScroll?: boolean;
}

/**
 * A single hand-drawn illustration (arrow, scribble, underline, small
 * icon) that draws itself once when it enters the viewport. Meant to be
 * used sparingly — one or two per section, as a margin annotation, not
 * as background wallpaper.
 */
export function Doodle({
  name,
  paths: customPaths,
  viewBox: customViewBox,
  width = 64,
  strokeColor = "currentColor",
  strokeWidth,
  className,
  onScroll = true,
}: DoodleProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const shouldDraw = onScroll ? inView : true;

  const libraryEntry = name ? DOODLES[name] : undefined;
  const paths = libraryEntry?.paths ?? customPaths ?? [];
  const viewBox = libraryEntry?.viewBox ?? customViewBox ?? "0 0 100 100";
  // Library paths are drawn at native (chunkier) proportions; custom
  // one-off marks read better thinner.
  const finalStrokeWidth = strokeWidth ?? (libraryEntry ? 1.6 : 2.5);

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      width={width}
      className={cn("overflow-visible text-(--color-ink-soft)", className)}
      fill="none"
      aria-hidden
    >
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={strokeColor}
          strokeWidth={finalStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={shouldDraw ? { pathLength: 1, opacity: 1 } : {}}
          transition={{
            pathLength: { duration: 0.9, delay: i * 0.25, ease: "easeInOut" },
            opacity: { duration: 0.2, delay: i * 0.25 },
          }}
        />
      ))}
    </svg>
  );
}
