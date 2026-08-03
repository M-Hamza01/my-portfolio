import { cn } from "@/lib/utils";

interface HandwrittenLabelProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  color?: "ink" | "pen-blue" | "stamp-red";
  className?: string;
  as?: "span" | "div" | "p";
}

const sizeMap = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
};

const colorMap = {
  ink: "text-(--color-ink-soft)",
  "pen-blue": "text-(--color-pen-blue)",
  "stamp-red": "text-(--color-stamp-red)",
};

/** Margin annotations, arrows-with-text, asides — the "voice in the margin". */
export function HandwrittenLabel({
  children,
  size = "md",
  color = "ink",
  className,
  as: Tag = "span",
}: HandwrittenLabelProps) {
  return (
    <Tag
      className={cn(
        "font-hand leading-snug",
        sizeMap[size],
        colorMap[color],
        className
      )}
    >
      {children}
    </Tag>
  );
}
