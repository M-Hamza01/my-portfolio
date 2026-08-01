import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { Doodle } from "@/components/scrapbook/Doodle";
import { NOW } from "@/data/now";

export function Now() {
  return (
    <section id="now" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-2 flex items-center gap-3">
        <h2 className="font-(family-name:--font-display) text-3xl font-bold">Now</h2>
        <Doodle name="rewind" width={22} className="text-(--color-ink-faint)" />
      </div>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        What I&apos;m up to this month.
      </HandwrittenLabel>

      <NotebookCard id="now-card" torn="top" className="max-w-md">
        <p className="mb-4 font-(family-name:--font-display) text-lg font-bold">
          {NOW.monthLabel}
        </p>
        <ul className="space-y-2.5">
          {NOW.items.map((item) => (
            <li key={item.text} className="flex items-center gap-2 text-sm text-(--color-ink-soft)">
              <span
                className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[2px] border border-(--color-ink-faint)"
                aria-hidden
              >
                {item.done && (
                  <Doodle name="tick" width={10} onScroll={false} className="text-(--color-ink)" />
                )}
              </span>
              {item.text}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between border-t border-(--color-paper-line) pt-4">
          <HandwrittenLabel size="md" color="pen-blue">
            {NOW.footerNote}
          </HandwrittenLabel>
          <Doodle name="flight" width={26} className="text-(--color-stamp-red)" />
        </div>
      </NotebookCard>
    </section>
  );
}
