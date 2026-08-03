import Link from "next/link";
import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { Stamp } from "@/components/scrapbook/Stamp";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { Doodle } from "@/components/scrapbook/Doodle";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-20">
      <NotebookCard id="404-card" torn="both" className="max-w-sm text-center">
        <Doodle name="question-mark1" width={40} className="mx-auto mb-3 text-(--color-ink-faint)" />
        <h1 className="font-(family-name:--font-display) text-2xl font-bold">
          This page doesn&apos;t exist. Yet?
        </h1>
        <p className="mt-3 text-sm text-(--color-ink-soft)">
          Either I never built it, or I tore this page out of the notebook
          for being a bad idea. Both happen more than I&apos;d like to admit.
        </p>
        <HandwrittenLabel as="p" size="md" color="pen-blue" className="mt-4">
          Probably belongs in the graveyard, honestly.
        </HandwrittenLabel>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Stamp color="red" rotate={-4}>404</Stamp>
          <Link
            href="/"
            className="font-(family-name:--font-mono) text-xs text-(--color-pen-blue) underline underline-offset-4"
          >
            Back to the notebook →
          </Link>
        </div>
      </NotebookCard>
    </main>
  );
}
