import Image from "next/image";
import { cn } from "@/lib/utils";

interface DeviceMockupProps {
  kind: "phone" | "web" | "code";
  /** "sm" for grid cards where every card needs the same visual
   *  footprint regardless of frame shape (Featured Projects). "md" for
   *  a standalone mockup with more room (Current Desk). */
  size?: "sm" | "md";
  /** Real screenshot URL (e.g. from Cloudinary). Falls back to the
   *  placeholder frame silhouette when not provided. */
  imageUrl?: string | null;
  imageAlt?: string;
  className?: string;
}

// Fixed pixel dimensions per kind/size — deliberately not relying on
// CSS aspect-ratio + an external height cap fighting each other,
// which distorts the frame. Phone is naturally taller than web/code
// at the same visual "weight," so these are tuned to look balanced
// side by side in a grid, not to share an identical box size.
const SIZES = {
  phone: { sm: "h-[150px] w-[75px]", md: "h-[224px] w-[112px]" },
  web: { sm: "h-[120px] w-[160px]", md: "h-[180px] w-[240px]" },
  code: { sm: "h-[120px] w-[160px]", md: "h-[180px] w-[240px]" },
};

/**
 * Device frame for a project screenshot. Android/iOS get a phone
 * frame, Web/Desktop get a browser-chrome frame, and anything without
 * a real UI (C++, Java, semester/console projects) gets a terminal
 * frame instead — a screenshot still slots in if one exists, it just
 * isn't pretending to be a phone or browser it isn't.
 */
export function DeviceMockup({
  kind,
  size = "md",
  imageUrl,
  imageAlt = "",
  className,
}: DeviceMockupProps) {
  if (kind === "web") {
    return (
      <div
        className={cn(
          "mx-auto flex flex-col overflow-hidden rounded-md border-2 border-(--color-ink) bg-(--color-paper-dark)",
          SIZES.web[size],
          className
        )}
      >
        <div className="flex items-center gap-1.5 border-b-2 border-(--color-ink) px-2 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-(--color-ink-faint)" />
          <span className="h-1.5 w-1.5 rounded-full bg-(--color-ink-faint)" />
          <span className="h-1.5 w-1.5 rounded-full bg-(--color-ink-faint)" />
        </div>
        {imageUrl ? (
          <div className="relative flex-1">
            <Image src={imageUrl} alt={imageAlt} fill className="object-cover object-top" />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-1/2 w-2/3 rounded-sm bg-(--color-paper-line)" />
          </div>
        )}
      </div>
    );
  }

  if (kind === "code") {
    return (
      <div
        className={cn(
          "mx-auto flex flex-col overflow-hidden rounded-md border-2 border-(--color-ink) bg-[#241f1a]",
          SIZES.code[size],
          className
        )}
      >
        <div className="flex items-center gap-1.5 border-b border-white/10 px-2 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-(--color-stamp-red)/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-(--color-sticky-yellow)/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-(--color-sticky-green)/70" />
        </div>
        {imageUrl ? (
          <div className="relative flex-1">
            <Image src={imageUrl} alt={imageAlt} fill className="object-cover object-top" />
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-1.5 p-3 font-(family-name:--font-mono) text-[10px] text-white/40">
            <p>$ compiling...</p>
            <p className="text-white/25">{"// no screenshot yet"}</p>
            <p className="text-white/25">{"// still a real project though"}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mx-auto flex flex-col overflow-hidden rounded-[1.1rem] border-2 border-(--color-ink) bg-(--color-paper-dark)",
        SIZES.phone[size],
        imageUrl ? "" : "p-1.5",
        className
      )}
    >
      {imageUrl ? (
        <div className="relative flex-1">
          <Image src={imageUrl} alt={imageAlt} fill className="object-cover" />
          <div className="absolute top-1.5 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-(--color-ink)/70" />
        </div>
      ) : (
        <>
          <div className="mx-auto mb-1 h-1 w-6 rounded-full bg-(--color-ink)" />
          <div className="flex flex-1 flex-col gap-1.5 rounded-md bg-white/50 p-1.5">
            <div className="h-2 w-3/4 rounded-sm bg-(--color-paper-line)" />
            <div className="h-8 w-full rounded-sm bg-(--color-paper-line)" />
            <div className="h-8 w-full rounded-sm bg-(--color-paper-line)" />
          </div>
        </>
      )}
    </div>
  );
}
