import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { TOOLS } from "@/data/toolbox";

export function Toolbox() {
  return (
    <section id="toolbox" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-2 font-(family-name:--font-display) text-3xl font-bold">
        Tools I Reach For
      </h2>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        These are my go-to tools.
      </HandwrittenLabel>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
        {TOOLS.map(({ id, name, icon: Icon }) => (
          <div
            key={id}
            className="flex flex-col items-center gap-2 border border-(--color-paper-line) bg-white/60 px-3 py-5 text-center transition-transform hover:-translate-y-1"
          >
            <Icon size={28} className="text-(--color-ink)" />
            <span className="font-(family-name:--font-mono) text-[11px] text-(--color-ink-soft)">
              {name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
