import Link from "next/link";
import { Sidebar, SidebarOffset } from "@/components/layout/Sidebar";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { AllProjectsGrid } from "@/components/sections/AllProjectsGrid";
import { getAllProjects } from "@/lib/supabase/queries";

export const metadata = {
  title: "All Projects — Hamza's Lab",
};

export default async function AllProjectsPage() {
  const projects = await getAllProjects();

  return (
    <>
      <Sidebar />
      <SidebarOffset>
        <main className="mx-auto max-w-5xl px-6 py-20">
          <Link
            href="/#projects"
            className="mb-6 inline-block font-(family-name:--font-mono) text-xs text-(--color-pen-blue) underline underline-offset-4"
          >
            ← Back to home
          </Link>
          <h1 className="font-(family-name:--font-display) text-3xl font-bold">All Projects</h1>
          <HandwrittenLabel as="p" size="sm" className="mt-1 mb-10 text-(--color-ink-faint)">
            Everything I&apos;ve built, not just the highlight reel.
          </HandwrittenLabel>

          <AllProjectsGrid projects={projects} />
        </main>
      </SidebarOffset>
    </>
  );
}
