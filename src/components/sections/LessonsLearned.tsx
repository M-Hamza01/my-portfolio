import { StickyNote } from "@/components/scrapbook/StickyNote";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { LESSONS } from "@/data/lessons";

export function LessonsLearned() {
  return (
    <section id="lessons" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-2 font-(family-name:--font-display) text-3xl font-bold">
        Lessons Learned
      </h2>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        Notes to my future self.
      </HandwrittenLabel>

      <div className="flex flex-wrap gap-6">
        {LESSONS.map((lesson) => (
          <StickyNote key={lesson.id} id={lesson.id} color={lesson.color} className="w-48">
            <p className="text-lg leading-snug">{lesson.text}</p>
          </StickyNote>
        ))}
      </div>
    </section>
  );
}
