import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { EditablePolaroid } from "@/components/scrapbook/EditablePolaroid";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { Doodle } from "@/components/scrapbook/Doodle";
import { RANDOM_FACTS } from "@/data/randomFacts";

export function RandomFacts({ siteImages }: { siteImages: Record<string, string> }) {
  return (
    <section id="random-facts" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-2 flex items-center gap-3">
        <h2 className="font-(family-name:--font-display) text-3xl font-bold">
          Random Facts
        </h2>
        <Doodle name="sparkle1" width={22} className="text-(--color-stamp-red)" />
      </div>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        Little things about me.
      </HandwrittenLabel>

      <div className="grid items-start gap-8 sm:grid-cols-[1fr_auto]">
        <NotebookCard id="random-facts-list" variant="grid">
          <dl className="divide-y divide-(--color-paper-line)">
            {RANDOM_FACTS.map((fact) => (
              <div key={fact.label} className="flex items-center justify-between gap-4 py-3">
                <dt className="font-(family-name:--font-mono) text-xs text-(--color-ink-faint) uppercase">
                  {fact.label}
                </dt>
                <dd className="font-hand text-lg text-(--color-ink)">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </NotebookCard>

        <EditablePolaroid
          imageKey="random-facts-photo"
          defaultSrc="/placeholder-desk.svg"
          initialSrc={siteImages["random-facts-photo"]}
          alt="Somewhere I like"
          caption="Mountains, mostly."
          width={190}
          rotate={5}
        />
      </div>
    </section>
  );
}
