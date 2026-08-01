import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Deterministic "random" rotation so server and client render the same
 * value (avoids hydration mismatches) while still looking hand-placed.
 * Pass any stable string (an id, a title) as the seed.
 */
export function seededRotation(seed: string, range = 4): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const normalized = (hash % 1000) / 1000; // -1..1
  return normalized * range;
}
