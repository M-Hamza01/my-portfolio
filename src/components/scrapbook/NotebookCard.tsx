"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { tornClipPath } from "@/lib/tornClipPath";

interface NotebookCardProps {
  /** Stable id used to seed the torn-edge shape — pass something
   *  unique per card (e.g. a project slug) so the tear doesn't shift
   *  between renders. */
  id: string;
  variant?: "plain" | "ruled" | "grid";
  className?: string;
  children: React.ReactNode;
  /** Give the card a torn top edge, bottom edge, or both. */
  torn?: "top" | "bottom" | "both" | "none";
  hover?: boolean;
}

/**
 * The workhorse container: a paper card with a fiber-grain texture and
 * an actually-torn edge (via clip-path, not a border trick) when
 * `torn` is set. This is the "Apple-level layout" half of the brief —
 * kept quiet and consistent so the decoration components (Tape,
 * StickyNote, Doodle) can do the personality work on top of it.
 */
export function NotebookCard({
  id,
  variant = "plain",
  className,
  children,
  torn = "none",
  hover = true,
}: NotebookCardProps) {
  const clipPath =
    torn === "none"
      ? undefined
      : tornClipPath(id, {
          top: torn === "top" || torn === "both",
          bottom: torn === "bottom" || torn === "both",
          depth: 2.5,
        });

  return (
    <motion.div
      className={cn(
        "paper-fiber relative border border-(--color-paper-line) bg-white/80 p-6 shadow-sm",
        variant === "ruled" && "bg-ruled",
        variant === "grid" && "bg-grid",
        className
      )}
      style={clipPath ? { clipPath, paddingTop: torn !== "none" ? "1.75rem" : undefined } : undefined}
      whileHover={
        hover ? { y: -3, boxShadow: "0 10px 24px rgba(43,38,32,0.12)" } : undefined
      }
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
    >
      {children}
    </motion.div>
  );
}
