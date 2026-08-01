import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { DeviceMockup } from "@/components/scrapbook/DeviceMockup";
import { Stamp } from "@/components/scrapbook/Stamp";
import type { ProjectData } from "@/data/projects";

const statusColor = {
  shipped: "ink",
  "in-progress": "blue",
  paused: "red",
} as const;

const statusLabel = {
  shipped: "Shipped",
  "in-progress": "In Progress",
  paused: "Paused",
} as const;

export function ProjectCard({ project }: { project: ProjectData }) {
  return (
    <NotebookCard id={project.id} className="flex h-full flex-col gap-4">
      <DeviceMockup kind={project.platform === "Web" ? "web" : "phone"} className="mb-1" />

      <div>
        <div className="mb-1 flex items-center justify-between gap-2">
          <h3 className="font-(family-name:--font-display) text-lg font-bold">
            {project.title}
          </h3>
          <span className="font-(family-name:--font-mono) text-[10px] text-(--color-ink-faint) uppercase">
            {project.platform}
          </span>
        </div>
        <p className="text-sm text-(--color-ink-soft)">{project.summary}</p>
      </div>

      <p className="font-(family-name:--font-mono) text-xs text-(--color-ink-faint)">
        Tech: {project.stack.join(", ")}
      </p>

      <div className="mt-auto flex items-center justify-between pt-2">
        <Stamp color={statusColor[project.status]} rotate={-3}>
          {statusLabel[project.status]}
        </Stamp>
        {project.linkUrl ? (
          <a
            href={project.linkUrl}
            className="font-(family-name:--font-hand) text-base text-(--color-pen-blue) underline decoration-dashed underline-offset-4"
          >
            View project →
          </a>
        ) : (
          <span className="font-(family-name:--font-hand) text-base text-(--color-ink-faint)">
            coming soon
          </span>
        )}
      </div>
    </NotebookCard>
  );
}
