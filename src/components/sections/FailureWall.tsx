import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { PolaroidCard } from "@/components/scrapbook/PolaroidCard";
import { StickyNote } from "@/components/scrapbook/StickyNote";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { FAILURES } from "@/data/failures";

export function FailureWall() {
  return (
    <section id="failure-wall" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-2 font-(family-name:--font-display) text-3xl font-bold">
        Failure Wall
      </h2>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        Because failures teach the best lessons.
      </HandwrittenLabel>

      <div className="grid items-start gap-8 sm:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <PolaroidCard
            id="failure-photo"
            src="/placeholder-failure.svg"
            alt="It's part of the process"
            caption="It's part of the process"
            width={180}
            rotate={-4}
          />
          <StickyNote id="keep-learning" color="green" size="sm">
            Keep Learning 🙂
          </StickyNote>
        </div>

        <NotebookCard id="failure-list" variant="ruled" torn="bottom">
          <ul className="space-y-3">
            {FAILURES.map((f) => (
              <li key={f.id} className="flex items-start gap-2 text-sm text-(--color-ink-soft)">
                <span className="mt-0.5 font-bold text-(--color-stamp-red)">✕</span>
                {f.entry}
              </li>
            ))}
          </ul>
        </NotebookCard>
      </div>
    </section>
  );
}
