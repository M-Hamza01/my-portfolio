"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { ProjectForm } from "@/components/sections/ProjectForm";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { EditableWrapper } from "@/components/admin/EditableWrapper";
import type { ProjectData } from "@/data/projects";

const MAX_FEATURED_DISPLAY = 6;

export function FeaturedProjects({ projects: initial }: { projects: ProjectData[] }) {
  const [projects, setProjects] = useState(initial.slice(0, MAX_FEATURED_DISPLAY));

  function handleProjectSaved(updated: ProjectData) {
    setProjects((prev) => {
      // If it got unfeatured in this edit, drop it from this section —
      // it still exists, just lives on the All Projects page now.
      if (updated.featured === false) {
        return prev.filter((p) => p.id !== updated.id);
      }
      const exists = prev.some((p) => p.id === updated.id);
      if (exists) return prev.map((p) => (p.id === updated.id ? updated : p));
      if (prev.length >= MAX_FEATURED_DISPLAY) return prev; // already full
      return [...prev, updated];
    });
  }

  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-(family-name:--font-display) text-3xl font-bold">
            Featured Projects
          </h2>
          <HandwrittenLabel as="p" size="sm" className="mt-1 text-(--color-ink-faint)">
            Things I&apos;m proud of.
          </HandwrittenLabel>
        </div>
        <a
          href="/projects"
          className="hidden font-(family-name:--font-mono) text-xs text-(--color-pen-blue) underline underline-offset-4 sm:inline"
        >
          See all projects →
        </a>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <EditableWrapper
            key={project.id}
            label="Edit project"
            renderEditor={(close) => (
              <ProjectForm
                project={project}
                close={close}
                onSaved={handleProjectSaved}
                onDeleted={(id) => setProjects((prev) => prev.filter((p) => p.id !== id))}
              />
            )}
          >
            <ProjectCard project={project} />
          </EditableWrapper>
        ))}

        {projects.length < MAX_FEATURED_DISPLAY && (
          <EditableWrapper
            mode="add"
            label="Add project"
            renderEditor={(close) => (
              <ProjectForm defaultFeatured close={close} onSaved={(created) => setProjects((prev) => [...prev, created])} />
            )}
          >
            <div className="flex min-h-[16rem] items-center justify-center border-2 border-dashed border-(--color-paper-line) p-8 text-sm text-(--color-ink-faint)">
              + Add project
            </div>
          </EditableWrapper>
        )}
      </div>

      <a
        href="/projects"
        className="mt-6 block text-center font-(family-name:--font-mono) text-xs text-(--color-pen-blue) underline underline-offset-4 sm:hidden"
      >
        See all projects →
      </a>
    </section>
  );
}
