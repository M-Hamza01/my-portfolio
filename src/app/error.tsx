"use client";

import { useEffect } from "react";
import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { Stamp } from "@/components/scrapbook/Stamp";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { Doodle } from "@/components/scrapbook/Doodle";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-20">
      <NotebookCard id="error-card" torn="both" className="max-w-sm text-center">
        <Doodle name="no" width={40} className="mx-auto mb-3 text-(--color-stamp-red)" />
        <h1 className="font-(family-name:--font-display) text-2xl font-bold">
          Well, that broke.
        </h1>
        <p className="mt-3 text-sm text-(--color-ink-soft)">
          Something on this page isn&apos;t wired up right yet — this one&apos;s
          on me, not you. It&apos;ll probably end up on the Failure Wall.
        </p>
        <HandwrittenLabel as="p" size="md" color="pen-blue" className="mt-4">
          Learned the hard way (many times), remember?
        </HandwrittenLabel>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Stamp color="red" rotate={-4}>Broken</Stamp>
          <button
            type="button"
            onClick={reset}
            className="font-(family-name:--font-mono) text-xs text-(--color-pen-blue) underline underline-offset-4"
          >
            Try again →
          </button>
        </div>
      </NotebookCard>
    </main>
  );
}
