"use client";

import { useState } from "react";
import { SiGithub } from "react-icons/si";
import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { DeviceMockup } from "@/components/scrapbook/DeviceMockup";
import { Stamp } from "@/components/scrapbook/Stamp";
import { mockupKindForPlatform } from "@/lib/utils";
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

const REFLECTION_FIELDS: { key: keyof ProjectData; label: string }[] = [
  { key: "whyBuilt", label: "Why I built it" },
  { key: "problemItSolves", label: "Problem it solves" },
  { key: "biggestChallenge", label: "Biggest challenge" },
  { key: "biggestMistake", label: "Biggest mistake" },
  { key: "proudOf", label: "Proud of" },
  { key: "improveToday", label: "Improve today" },
];

export function ProjectCard({ project }: { project: ProjectData }) {
  const [expanded, setExpanded] = useState(false);
  const hasReflection = REFLECTION_FIELDS.some((f) => project[f.key]);

  return (
    <NotebookCard id={project.id} className="flex h-full flex-col gap-4">
      <div className="mb-1 flex h-40 items-center justify-center">
        <DeviceMockup
          kind={mockupKindForPlatform(project.platform)}
          size="sm"
          imageUrl={project.coverImageUrl}
          imageAlt={`${project.title} screenshot`}
        />
      </div>

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

      {hasReflection && (
        <div className="border-t border-(--color-paper-line) pt-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="font-(family-name:--font-mono) text-xs text-(--color-pen-blue) underline underline-offset-4"
          >
            {expanded ? "Hide the story ↑" : "Read the story →"}
          </button>

          {expanded && (
            <div className="mt-3 space-y-2.5">
              {REFLECTION_FIELDS.map(
                ({ key, label }) =>
                  project[key] && (
                    <div key={key}>
                      <p className="font-(family-name:--font-mono) text-[10px] tracking-widest text-(--color-ink-faint) uppercase">
                        {label}
                      </p>
                      <p className="text-sm text-(--color-ink-soft)">{project[key] as string}</p>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <Stamp color={statusColor[project.status]} rotate={-3}>
          {statusLabel[project.status]}
        </Stamp>
        <div className="flex items-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              aria-label="View on GitHub"
              className="text-(--color-ink-soft) hover:text-(--color-ink)"
            >
              <SiGithub size={15} />
            </a>
          )}
          {project.linkUrl ? (
            <a
              href={project.linkUrl}
              className="font-(family-name:--font-body) text-sm font-medium text-(--color-pen-blue) underline decoration-dashed underline-offset-4"
            >
              View details →
            </a>
          ) : (
            <span className="font-(family-name:--font-body) text-sm text-(--color-ink-faint)">
              coming soon
            </span>
          )}
        </div>
      </div>
    </NotebookCard>
  );
}
