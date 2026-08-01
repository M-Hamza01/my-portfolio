import { ProjectCard } from "@/components/sections/ProjectCard";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { FEATURED_PROJECTS } from "@/data/projects";

export function FeaturedProjects() {
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
          href="#projects"
          className="hidden font-(family-name:--font-mono) text-xs text-(--color-pen-blue) underline underline-offset-4 sm:inline"
        >
          See all projects
        </a>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
