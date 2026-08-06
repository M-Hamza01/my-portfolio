"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { ProjectForm } from "@/components/sections/ProjectForm";
import { EditableWrapper } from "@/components/admin/EditableWrapper";
import type { ProjectData } from "@/data/projects";

export function AllProjectsGrid({ projects: initial }: { projects: ProjectData[] }) {
  const [projects, setProjects] = useState(initial);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <EditableWrapper
          key={project.id}
          label="Edit project"
          renderEditor={(close) => (
            <ProjectForm
              project={project}
              close={close}
              onSaved={(updated) =>
                setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
              }
              onDeleted={(id) => setProjects((prev) => prev.filter((p) => p.id !== id))}
            />
          )}
        >
          <ProjectCard project={project} />
        </EditableWrapper>
      ))}

      <EditableWrapper
        mode="add"
        label="Add project"
        renderEditor={(close) => (
          <ProjectForm
            defaultFeatured={false}
            close={close}
            onSaved={(created) => setProjects((prev) => [...prev, created])}
          />
        )}
      >
        <div className="flex min-h-[16rem] items-center justify-center border-2 border-dashed border-(--color-paper-line) p-8 text-sm text-(--color-ink-faint)">
          + Add project
        </div>
      </EditableWrapper>
    </div>
  );
}
