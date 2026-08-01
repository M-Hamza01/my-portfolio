import { StickyNote } from "@/components/scrapbook/StickyNote";
import { PolaroidCard } from "@/components/scrapbook/PolaroidCard";
import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { Tape } from "@/components/scrapbook/Tape";
import { Doodle } from "@/components/scrapbook/Doodle";
import { Stamp } from "@/components/scrapbook/Stamp";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { PageBreak } from "@/components/scrapbook/PageBreak";
import { DOODLES } from "@/lib/doodleLibrary";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-16">
      <p className="mb-4 font-(family-name:--font-mono) text-xs tracking-widest text-(--color-ink-faint) uppercase">
        {title}
      </p>
      <div className="flex flex-wrap items-end gap-6">{children}</div>
    </div>
  );
}

export default function Sandbox() {
  const allDoodleNames = Object.keys(DOODLES) as (keyof typeof DOODLES)[];

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-2 font-(family-name:--font-display) text-3xl font-bold">
        Design system sandbox
      </h1>
      <p className="mb-12 text-(--color-ink-soft)">
        Every reusable scrapbook component, in isolation. Not part of the real
        site — just here for QA as we build.
      </p>

      <Block title="StickyNote — hand-cut edge + curled corner">
        <StickyNote id="s1" color="yellow">Ship it.</StickyNote>
        <StickyNote id="s2" color="pink">Users don&apos;t care about architecture.</StickyNote>
        <StickyNote id="s3" color="blue">Done &gt; Perfect</StickyNote>
        <StickyNote id="s4" color="green">Most bugs happen because I assumed something.</StickyNote>
      </Block>

      <Block title="PolaroidCard">
        <PolaroidCard id="p1" src="/placeholder-portrait.svg" alt="demo" caption="Exploring. Building. Becoming." />
        <PolaroidCard id="p2" src="/placeholder-desk.svg" alt="demo" caption="Current desk" rotate={-6} />
      </Block>

      <Block title="NotebookCard — plain / ruled / grid, torn edges">
        <NotebookCard id="nb-plain" className="w-64">Plain, no tear.</NotebookCard>
        <NotebookCard id="nb-ruled" variant="ruled" torn="top" className="w-64">Ruled, torn top — used for About Me / reflective text.</NotebookCard>
        <NotebookCard id="nb-grid" variant="grid" torn="both" className="w-64">Grid, torn both edges — used for engineering / technical entries.</NotebookCard>
      </Block>

      <Block title="Tape">
        <div className="relative h-16 w-40 bg-white shadow">
          <Tape rotate={-6} className="-top-3 left-4" />
        </div>
      </Block>

      <Block title="Stamp">
        <Stamp color="red">Under construction</Stamp>
        <Stamp color="ink">Shipped</Stamp>
        <Stamp color="blue">Paused</Stamp>
      </Block>

      <Block title="HandwrittenLabel">
        <HandwrittenLabel size="lg">I&apos;m learning how to ship.</HandwrittenLabel>
        <HandwrittenLabel size="md" color="pen-blue">One day at a time.</HandwrittenLabel>
        <HandwrittenLabel size="sm" color="stamp-red">Learned the hard way (many times).</HandwrittenLabel>
      </Block>

      <div className="mb-16">
        <p className="mb-4 font-(family-name:--font-mono) text-xs tracking-widest text-(--color-ink-faint) uppercase">
          Doodle library — {allDoodleNames.length} hand-drawn marks, draw themselves on scroll
        </p>
        <div className="grid grid-cols-4 gap-x-6 gap-y-8 sm:grid-cols-6 md:grid-cols-8">
          {allDoodleNames.map((name) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <Doodle name={name} width={40} />
              <span className="font-(family-name:--font-mono) text-[10px] text-(--color-ink-faint)">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mb-4 font-(family-name:--font-mono) text-xs tracking-widest text-(--color-ink-faint) uppercase">
        PageBreak
      </p>
      <PageBreak />
    </main>
  );
}
