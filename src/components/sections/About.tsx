import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { StickyNote } from "@/components/scrapbook/StickyNote";
import { PolaroidCard } from "@/components/scrapbook/PolaroidCard";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { Doodle } from "@/components/scrapbook/Doodle";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-10 flex items-center gap-3 font-(family-name:--font-display) text-3xl font-bold">
        About Me
        <Doodle name="scribble2" width={36} className="text-(--color-stamp-red)" />
      </h2>

      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <NotebookCard id="about-notes" variant="ruled" torn="top" className="space-y-4 text-(--color-ink-soft)">
          <p>Software Engineering student.</p>
          <p>I like building products that normal people actually use.</p>
          <p>Currently obsessed with making utility apps feel premium.</p>
          <p>I have way too many unfinished ideas.</p>
          <p>Sometimes I spend more time redesigning a screen than writing the backend.</p>
          <HandwrittenLabel size="md" color="pen-blue" className="block pt-2">
            I&apos;m learning how to ship.
          </HandwrittenLabel>
        </NotebookCard>

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-4">
            <StickyNote id="sticky-overthinker" color="yellow" size="sm">
              Overthinker
            </StickyNote>
            <StickyNote id="sticky-problemsolver" color="blue" size="sm">
              Problem Solver
            </StickyNote>
            <StickyNote id="sticky-tealover" color="pink" size="sm">
              Tea Lover
            </StickyNote>
          </div>

          <div className="flex justify-center lg:justify-start">
            <PolaroidCard
              id="about-desk"
              src="/placeholder-desk.svg"
              alt="Hamza's workspace"
              caption="One day at a time. Keep shipping."
              width={200}
              rotate={-3}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
