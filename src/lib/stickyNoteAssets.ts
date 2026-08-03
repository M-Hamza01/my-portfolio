export interface StickyAsset {
  id: string;
  src: string;
  hex: string;
}

// Real photo-realistic sticky note assets (Figma Community pack) —
// paper shape, curled corner, and drop shadow are all baked into the
// SVG. The original pack also included a placeholder squiggle-text
// illustration on each one; that's been stripped out (see
// public/sticky-notes/*.svg) so real content can be laid over it.
export const STICKY_ASSETS: Record<string, StickyAsset> = {
  yellow: { id: "yellow", src: "/sticky-notes/yellow.svg", hex: "#FBD767" },
  "soft-yellow": { id: "soft-yellow", src: "/sticky-notes/soft-yellow.svg", hex: "#FDF5A3" },
  orange: { id: "orange", src: "/sticky-notes/orange.svg", hex: "#FFC470" },
  red: { id: "red", src: "/sticky-notes/red.svg", hex: "#FFAFA3" },
  pink: { id: "pink", src: "/sticky-notes/pink.svg", hex: "#FFBDF2" },
  mauve: { id: "mauve", src: "/sticky-notes/mauve.svg", hex: "#D9B8FF" },
  "sky-blue": { id: "sky-blue", src: "/sticky-notes/sky-blue.svg", hex: "#80CAFF" },
  "aqua-blue": { id: "aqua-blue", src: "/sticky-notes/aqua-blue.svg", hex: "#75D7F0" },
  green: { id: "green", src: "/sticky-notes/green.svg", hex: "#85E0A3" },
  grey: { id: "grey", src: "/sticky-notes/grey.svg", hex: "#E6E6E6" },
};

/** The site's existing 4-color semantic system (Lessons, Ideas, Craft
 *  Skills, etc.) maps onto four of the ten real assets. */
export const SEMANTIC_COLOR_MAP: Record<"yellow" | "pink" | "blue" | "green", string> = {
  yellow: "yellow",
  pink: "pink",
  blue: "sky-blue",
  green: "green",
};

export const ALL_STICKY_COLOR_IDS = Object.keys(STICKY_ASSETS);
