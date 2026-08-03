"use client";

import { motion } from "framer-motion";
import { cn, seededRotation } from "@/lib/utils";
import { tornClipPath } from "@/lib/tornClipPath";

type StickyColor = "yellow" | "pink" | "blue" | "green";

const colorMap: Record<StickyColor, string> = {
  yellow: "bg-(--color-sticky-yellow)",
  pink: "bg-(--color-sticky-pink)",
  blue: "bg-(--color-sticky-blue)",
  green: "bg-(--color-sticky-green)",
};

// A darker shade of each sticky color, used for the curled-corner
// shadow so the fold reads correctly against that note's own color.
const foldShadeMap: Record<StickyColor, string> = {
  yellow: "rgba(184, 149, 61, 0.35)",
  pink: "rgba(196, 108, 103, 0.3)",
  blue: "rgba(80, 121, 148, 0.28)",
  green: "rgba(112, 133, 78, 0.28)",
};

interface StickyNoteProps {
  id: string;
  color?: StickyColor;
  /** If not provided, a rotation is derived deterministically from id. */
  rotate?: number;
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

/**
 * A sticky note — hand-cut rather than a perfect rectangle (via a
 * seeded clip-path) with a curled corner and paper grain, so it reads
 * as a physical piece of paper rather than a colored div. Lifts and
 * straightens slightly on hover.
 */
export function StickyNote({
  id,
  color = "yellow",
  rotate,
  size = "md",
  className,
  children,
}: StickyNoteProps) {
  const finalRotate = rotate ?? seededRotation(id, 5);
  // Very shallow tear so it still reads as "cut", not "ripped" — sticky
  // pads are machine-cut with only slight irregularity.
  const clipPath = tornClipPath(id, { top: true, bottom: true, depth: 1.4, segments: 6 });

  return (
    <motion.div
      className={cn(
        "paper-fiber relative shadow-md",
        colorMap[color],
        size === "sm" ? "p-3 text-sm" : "p-4 text-base",
        className
      )}
      style={{
        rotate: finalRotate,
        clipPath,
        boxShadow: "3px 4px 8px rgba(43,38,32,0.18)",
      }}
      whileHover={{
        rotate: finalRotate * 0.25,
        y: -4,
        boxShadow: "5px 8px 16px rgba(43,38,32,0.24)",
      }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      {/* curled corner */}
      <div
        aria-hidden
        className="absolute right-0 bottom-0 h-4 w-4"
        style={{
          background: `linear-gradient(135deg, transparent 50%, ${foldShadeMap[color]} 50%)`,
          clipPath: "polygon(100% 0%, 0% 100%, 100% 100%)",
        }}
      />
      <div className="font-hand leading-snug text-(--color-ink)">
        {children}
      </div>
    </motion.div>
  );
}
