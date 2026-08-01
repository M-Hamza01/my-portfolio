"use client";

import { motion } from "framer-motion";
import { Doodle } from "@/components/scrapbook/Doodle";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { TIMELINE } from "@/data/timeline";

export function Timeline() {
  return (
    <section id="timeline" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-2 font-(family-name:--font-display) text-3xl font-bold">
        My Journey So Far
      </h2>
      <HandwrittenLabel as="p" size="sm" className="mb-12 text-(--color-ink-faint)">
        It&apos;s a journey, not a race.
      </HandwrittenLabel>

      <div className="relative">
        {/* connecting line */}
        <div
          aria-hidden
          className="absolute top-7 right-6 left-6 hidden border-t-2 border-dashed border-(--color-paper-line) md:block"
        />

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-6 md:gap-x-2">
          {TIMELINE.map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-(--color-ink) bg-(--color-paper) text-(--color-ink-soft)">
                <Doodle name={node.icon} width={26} onScroll={false} />
              </div>
              <p className="mt-3 max-w-[9rem] text-xs leading-snug text-(--color-ink)">
                {node.label}
              </p>
              <p className="mt-1 font-(family-name:--font-mono) text-[10px] text-(--color-ink-faint)">
                {node.date}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
