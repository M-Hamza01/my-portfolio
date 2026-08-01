import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { StickyNote } from "@/components/scrapbook/StickyNote";
import { DeviceMockup } from "@/components/scrapbook/DeviceMockup";
import { Stamp } from "@/components/scrapbook/Stamp";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { Doodle } from "@/components/scrapbook/Doodle";
import { CURRENT_DESK as D } from "@/data/currentDesk";

export function CurrentDesk() {
  return (
    <section id="current-desk" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-2 font-(family-name:--font-display) text-3xl font-bold">
        Current Desk
      </h2>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        What I&apos;m working on right now.
      </HandwrittenLabel>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr_auto]">
        <NotebookCard id="current-desk-main" className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-(family-name:--font-display) text-xl font-bold">
                {D.projectName}
              </h3>
              <p className="mt-1 text-sm text-(--color-ink-soft)">{D.blurb}</p>
            </div>
            <Stamp color="blue" rotate={-4}>In Progress</Stamp>
          </div>

          <StickyNote id="current-desk-why" color="yellow" size="sm" className="w-fit max-w-xs">
            <span className="font-bold">Why? </span>
            {D.why}
          </StickyNote>
        </NotebookCard>

        <NotebookCard id="current-desk-progress" variant="grid" className="flex flex-col gap-5">
          <div>
            <div className="mb-1 flex items-center justify-between font-(family-name:--font-mono) text-xs text-(--color-ink-soft)">
              <span>Progress</span>
              <span>{D.progressPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-(--color-paper-dark)">
              <div
                className="h-full rounded-full bg-(--color-pen-blue)"
                style={{ width: `${D.progressPercent}%` }}
              />
            </div>
          </div>

          <div>
            <p className="font-(family-name:--font-mono) text-xs text-(--color-ink-faint) uppercase">
              Currently stuck on
            </p>
            <p className="mt-1 text-sm text-(--color-ink-soft)">{D.stuckOn}</p>
          </div>

          <div>
            <p className="mb-2 font-(family-name:--font-mono) text-xs text-(--color-ink-faint) uppercase">
              Focus
            </p>
            <ul className="space-y-1.5">
              {D.focus.map((item) => (
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
          </div>

          <div>
            <p className="font-(family-name:--font-mono) text-xs text-(--color-ink-faint) uppercase">
              Thinking about
            </p>
            <p className="mt-1 text-sm text-(--color-ink-soft)">{D.thinkingAbout}</p>
          </div>

          <div className="flex items-center gap-2 border-t border-(--color-paper-line) pt-3">
            <p className="font-(family-name:--font-mono) text-xs text-(--color-ink-faint) uppercase">
              Next milestone
            </p>
            <p className="font-(family-name:--font-hand) text-base text-(--color-ink)">
              {D.nextMilestone}
            </p>
            <Doodle name="flag" width={16} onScroll={false} className="text-(--color-stamp-red)" />
          </div>
        </NotebookCard>

        <div className="flex justify-center lg:block">
          <DeviceMockup kind="phone" className="w-32" />
        </div>
      </div>
    </section>
  );
}
