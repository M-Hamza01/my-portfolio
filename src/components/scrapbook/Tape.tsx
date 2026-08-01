"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type TapeColor = "kraft" | "white" | "washi-blue";

const colorMap: Record<TapeColor, string> = {
  kraft: "bg-[#cbb28a]/70",
  white: "bg-white/60",
  "washi-blue": "bg-[#b9cede]/70",
};

interface TapeProps {
  /** Rotation in degrees. Positive tilts clockwise. */
  rotate?: number;
  /** Width in pixels. */
  width?: number;
  color?: TapeColor;
  className?: string;
}

/**
 * A short strip of "tape" meant to sit at the corner/edge of a
 * PolaroidCard or NotebookCard, half on / half off the element.
 * Stretches very subtly on hover of its parent (parent should have
 * `group` class for that to trigger).
 */
export function Tape({
  rotate = -4,
  width = 70,
  color = "kraft",
  className,
}: TapeProps) {
  return (
    <motion.div
      aria-hidden
      className={cn(
        "pointer-events-none absolute h-6 shadow-sm",
        colorMap[color],
        className
      )}
      style={{
        width,
        rotate,
        boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
      }}
      initial={{ scaleX: 1 }}
      whileHover={{ scaleX: 1.04 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* torn-edge texture using repeating gradient on both short ends */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(100deg, transparent 0 2px, rgba(0,0,0,0.15) 2px 3px)",
        }}
      />
    </motion.div>
  );
}
