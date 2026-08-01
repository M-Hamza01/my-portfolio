import { StickyNote } from "@/components/scrapbook/StickyNote";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { Doodle } from "@/components/scrapbook/Doodle";
import { IDEAS } from "@/data/ideas";

export function IdeaParkingLot() {
  return (
    <section id="ideas" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-2 flex items-center gap-3">
        <h2 className="font-(family-name:--font-display) text-3xl font-bold">
          Idea Parking Lot
        </h2>
        <Doodle name="bulb" width={26} className="text-(--color-stamp-red)" />
      </div>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        Ideas for another day.
      </HandwrittenLabel>

      <div className="flex flex-wrap gap-6">
        {IDEAS.map((idea) => (
          <StickyNote key={idea.id} id={idea.id} color={idea.color} className="w-52">
            <p className="text-lg font-bold">{idea.title}</p>
            <p className="mt-2 text-sm opacity-80">{idea.note}</p>
            <p className="mt-3 font-(family-name:--font-mono) text-[10px] tracking-widest uppercase opacity-60">
              {idea.category}
            </p>
          </StickyNote>
        ))}
      </div>
    </section>
  );
}
