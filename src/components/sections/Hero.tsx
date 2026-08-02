import { PolaroidCard } from "@/components/scrapbook/PolaroidCard";
import { Stamp } from "@/components/scrapbook/Stamp";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { Doodle } from "@/components/scrapbook/Doodle";

const CURRENT_STATUS_PERCENT = 72;

export function Hero() {
  return (
    <section id="home" className="relative mx-auto max-w-5xl px-6 pt-20 pb-24 lg:pt-28">
      <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative">
          <p className="mb-3 font-(family-name:--font-mono) text-xs tracking-widest text-(--color-ink-faint) uppercase">
            2025 — Present
          </p>
          <h1 className="font-(family-name:--font-display) text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
            Hamza&apos;s Lab
          </h1>
          <p className="mt-5 max-w-md font-(family-name:--font-hand) text-2xl text-(--color-ink-soft)">
            Building software. Breaking software. Learning why.
          </p>

          <div className="mt-10 max-w-xs">
            <div className="mb-1 flex items-center justify-between font-(family-name:--font-mono) text-xs text-(--color-ink-soft)">
              <span>Current status</span>
              <span>{CURRENT_STATUS_PERCENT}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-(--color-paper-dark)">
              <div
                className="h-full rounded-full bg-(--color-ink)"
                style={{ width: `${CURRENT_STATUS_PERCENT}%` }}
              />
            </div>
            <p className="mt-1 font-(family-name:--font-hand) text-sm text-(--color-ink-faint)">
              Loading...
            </p>
          </div>

          <Stamp className="mt-8">Under construction</Stamp>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <PolaroidCard
            id="hero-portrait"
            src="/hamza-profile.jpeg"
            alt="Hamza"
            caption="Exploring. Building. Becoming."
            width={240}
            rotate={4}
          />
          <Doodle
            name="sparkle"
            width={28}
            className="absolute -top-4 right-4 hidden text-(--color-stamp-red) sm:block"
          />
        </div>
      </div>

      <HandwrittenLabel
        as="div"
        size="sm"
        className="mt-16 max-w-xs text-(--color-ink-faint)"
      >
        scroll down, it gets messier (in a good way) ↓
      </HandwrittenLabel>
    </section>
  );
}
