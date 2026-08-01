import { cn } from "@/lib/utils";

interface DeviceMockupProps {
  kind: "phone" | "web";
  className?: string;
}

/**
 * A minimal line-drawn device frame. Stands in for a real screenshot
 * until project covers are uploaded — deliberately plain so it never
 * competes with an actual screenshot once one replaces it.
 */
export function DeviceMockup({ kind, className }: DeviceMockupProps) {
  if (kind === "web") {
    return (
      <div
        className={cn(
          "flex aspect-[4/3] w-full flex-col overflow-hidden rounded-md border-2 border-(--color-ink) bg-(--color-paper-dark)",
          className
        )}
      >
        <div className="flex items-center gap-1.5 border-b-2 border-(--color-ink) px-2 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-(--color-ink-faint)" />
          <span className="h-1.5 w-1.5 rounded-full bg-(--color-ink-faint)" />
          <span className="h-1.5 w-1.5 rounded-full bg-(--color-ink-faint)" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="h-1/2 w-2/3 rounded-sm bg-(--color-paper-line)" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mx-auto flex aspect-[9/18] w-28 flex-col overflow-hidden rounded-[1.1rem] border-2 border-(--color-ink) bg-(--color-paper-dark) p-1.5",
        className
      )}
    >
      <div className="mx-auto mb-1 h-1 w-6 rounded-full bg-(--color-ink)" />
      <div className="flex flex-1 flex-col gap-1.5 rounded-md bg-white/50 p-1.5">
        <div className="h-2 w-3/4 rounded-sm bg-(--color-paper-line)" />
        <div className="h-8 w-full rounded-sm bg-(--color-paper-line)" />
        <div className="h-8 w-full rounded-sm bg-(--color-paper-line)" />
      </div>
    </div>
  );
}
