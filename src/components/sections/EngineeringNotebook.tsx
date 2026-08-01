import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { NOTEBOOK_ENTRIES } from "@/data/notebookEntries";

export function EngineeringNotebook() {
  return (
    <section id="notebook" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-2 flex items-end justify-between">
        <h2 className="font-(family-name:--font-display) text-3xl font-bold">
          Engineering Notebook
        </h2>
        <a
          href="#notebook"
          className="hidden font-(family-name:--font-mono) text-xs text-(--color-pen-blue) underline underline-offset-4 sm:inline"
        >
          View all notes
        </a>
      </div>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        Random notes from the journey.
      </HandwrittenLabel>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {NOTEBOOK_ENTRIES.map((entry) => (
          <NotebookCard key={entry.id} id={entry.id} variant="ruled" className="flex flex-col gap-3">
            <p className="font-(family-name:--font-mono) text-xs text-(--color-ink-faint)">
              {entry.date}
            </p>
            <p className="flex-1 text-sm text-(--color-ink-soft)">{entry.body}</p>
            <span className="w-fit rounded-full bg-(--color-paper-dark) px-2.5 py-0.5 font-(family-name:--font-mono) text-[10px] tracking-wide text-(--color-ink-soft) uppercase">
              {entry.tag}
            </span>
          </NotebookCard>
        ))}
      </div>
    </section>
  );
}
