/**
 * Generates a CSS clip-path polygon() string that turns a straight
 * rectangle edge into an irregular torn-paper edge. Works on any
 * background because it clips the element's actual shape rather than
 * painting a matching strip on top of it.
 *
 * Deterministic per `seed` (stable across re-renders / SSR + client).
 */
function hash(seed: string, salt: number) {
  let h = 0;
  const s = seed + String(salt);
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h % 1000) / 1000;
}

interface TornClipPathOptions {
  top?: boolean;
  bottom?: boolean;
  /** Max depth of the tear, as a % of element height. */
  depth?: number;
  segments?: number;
}

export function tornClipPath(
  seed: string,
  { top = true, bottom = false, depth = 3, segments = 10 }: TornClipPathOptions = {}
) {
  const points: string[] = [];

  if (top) {
    for (let i = 0; i <= segments; i++) {
      const x = (100 / segments) * i;
      const y = hash(seed, i) * depth;
      points.push(`${x}% ${y}%`);
    }
  } else {
    points.push("0% 0%", "100% 0%");
  }

  if (bottom) {
    for (let i = segments; i >= 0; i--) {
      const x = (100 / segments) * i;
      const y = 100 - hash(seed, i + 100) * depth;
      points.push(`${x}% ${y}%`);
    }
  } else {
    points.push("100% 100%", "0% 100%");
  }

  return `polygon(${points.join(", ")})`;
}
