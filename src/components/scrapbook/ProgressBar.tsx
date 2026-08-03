"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percent: number;
  className?: string;
}

export function ProgressBar({ percent, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full border border-(--color-ink-faint) bg-(--color-paper-dark)",
        className
      )}
    >
      <motion.div
        className="relative h-full rounded-full bg-(--color-pen-blue)"
        initial={{ width: 0 }}
        whileInView={{ width: `${clamped}%` }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      >
        <span
          aria-hidden
          className="absolute top-1/2 right-0 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-(--color-paper) bg-(--color-ink) shadow-sm"
        />
      </motion.div>
    </div>
  );
}
