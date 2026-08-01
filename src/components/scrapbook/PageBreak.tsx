import { cn } from "@/lib/utils";

interface PageBreakProps {
  className?: string;
}

/**
 * The site's one recurring signature element: every section is a
 * "page," and every page break shows a torn edge stitched to the next
 * one — literal notebook pages, not a decorative divider. Kept
 * identical everywhere so it reads as structure, not ornament.
 */
export function PageBreak({ className }: PageBreakProps) {
  return (
    <div className={cn("relative h-10 w-full overflow-hidden", className)} aria-hidden>
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-(--color-paper)"
      >
        <path
          d="M0,18 L40,14 L80,20 L120,10 L160,22 L200,12 L240,19 L280,9 L320,21
             L360,13 L400,20 L440,11 L480,18 L520,10 L560,22 L600,14 L640,19
             L680,9 L720,20 L760,12 L800,18 L840,10 L880,21 L920,13 L960,19
             L1000,9 L1040,20 L1080,12 L1120,18 L1160,11 L1200,17 L1200,40 L0,40 Z"
          fill="currentColor"
        />
      </svg>
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-(--color-paper-line)"
      >
        <path
          d="M0,18 L40,14 L80,20 L120,10 L160,22 L200,12 L240,19 L280,9 L320,21
             L360,13 L400,20 L440,11 L480,18 L520,10 L560,22 L600,14 L640,19
             L680,9 L720,20 L760,12 L800,18 L840,10 L880,21 L920,13 L960,19
             L1000,9 L1040,20 L1080,12 L1120,18 L1160,11 L1200,17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 4"
        />
      </svg>
    </div>
  );
}
