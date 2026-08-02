"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn, seededRotation } from "@/lib/utils";
import { Tape } from "./Tape";

interface PolaroidCardProps {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  rotate?: number;
  width?: number;
  tape?: boolean;
  /** Set true for data: URLs (e.g. canvas doodles) — Next's image
   *  optimizer doesn't handle those. */
  unoptimized?: boolean;
  className?: string;
}

export function PolaroidCard({
  id,
  src,
  alt,
  caption,
  rotate,
  width = 220,
  tape = true,
  unoptimized = false,
  className,
}: PolaroidCardProps) {
  const finalRotate = rotate ?? seededRotation(id, 6);

  return (
    <motion.figure
      className={cn("group relative bg-white p-2.5 pb-4 shadow-lg", className)}
      style={{
        width,
        rotate: finalRotate,
        boxShadow: "4px 6px 14px rgba(43,38,32,0.22)",
      }}
      whileHover={{ rotate: finalRotate * 0.3, y: -3, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      {tape && (
        <Tape
          rotate={finalRotate > 0 ? -8 : 8}
          width={64}
          className="-top-3 left-1/2 -translate-x-1/2"
        />
      )}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-(--color-paper-dark)">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${width}px`}
          className="object-cover"
          unoptimized={unoptimized}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center font-(family-name:--font-hand) text-sm text-(--color-ink-soft)">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
