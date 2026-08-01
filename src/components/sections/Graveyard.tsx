import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { Stamp } from "@/components/scrapbook/Stamp";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { Doodle } from "@/components/scrapbook/Doodle";
import { GRAVEYARD } from "@/data/graveyard";

export function Graveyard() {
  return (
    <section id="graveyard" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-2 flex items-center gap-3">
        <h2 className="font-(family-name:--font-display) text-3xl font-bold">
          Project Graveyard
        </h2>
        <Stamp color="ink" rotate={6}>R.I.P.</Stamp>
      </div>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        Not every idea makes it. And that&apos;s okay.
      </HandwrittenLabel>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GRAVEYARD.map((item) => (
          <NotebookCard
            key={item.id}
            id={item.id}
            torn="top"
            className="flex flex-col gap-3 bg-(--color-paper-dark)/40"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-(family-name:--font-display) text-lg font-bold">
                {item.name}
              </h3>
              <Doodle
                name={item.status === "abandoned" ? "dustbin" : "time"}
                width={22}
                className="text-(--color-ink-faint)"
              />
            </div>

            <div>
              <p className="font-(family-name:--font-mono) text-[10px] tracking-widest text-(--color-ink-faint) uppercase">
                Status
              </p>
              <p
                className={
                  item.status === "abandoned"
                    ? "text-sm font-semibold text-(--color-stamp-red)"
                    : "text-sm font-semibold text-(--color-pen-blue)"
                }
              >
                {item.status === "abandoned" ? "Abandoned" : "Paused"}
              </p>
            </div>

            <div>
              <p className="font-(family-name:--font-mono) text-[10px] tracking-widest text-(--color-ink-faint) uppercase">
                Reason
              </p>
              <p className="text-sm text-(--color-ink-soft)">{item.reason}</p>
            </div>

            <div className="border-t border-(--color-paper-line) pt-3">
              <p className="font-(family-name:--font-mono) text-[10px] tracking-widest text-(--color-ink-faint) uppercase">
                Lesson
              </p>
              <p className="font-(family-name:--font-hand) text-base text-(--color-ink)">
                {item.lesson}
              </p>
            </div>
          </NotebookCard>
        ))}
      </div>
    </section>
  );
}
