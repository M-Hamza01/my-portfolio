import { cn } from "@/lib/utils";

type StampColor = "red" | "ink" | "blue";

const colorMap: Record<StampColor, string> = {
  red: "border-(--color-stamp-red) text-(--color-stamp-red)",
  ink: "border-(--color-ink) text-(--color-ink)",
  blue: "border-(--color-pen-blue) text-(--color-pen-blue)",
};

interface StampProps {
  children: React.ReactNode;
  color?: StampColor;
  rotate?: number;
  className?: string;
}

/** A worn rubber-stamp mark, e.g. "UNDER CONSTRUCTION", "PAUSED", "SHIPPED". */
export function Stamp({ children, color = "red", rotate = -6, className }: StampProps) {
  return (
    <span
      className={cn(
        "inline-block border-[3px] px-3 py-1 font-(family-name:--font-mono) text-xs font-bold tracking-widest uppercase opacity-80",
        colorMap[color],
        className
      )}
      style={{
        rotate: `${rotate}deg`,
        borderRadius: "2px / 4px",
        mixBlendMode: "multiply",
      }}
    >
      {children}
    </span>
  );
}
