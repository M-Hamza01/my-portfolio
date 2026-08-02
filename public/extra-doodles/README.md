# Extra doodles (not wired in yet)

65 hand-drawn SVGs from a Figma Community pack, dropped here for later use.
Filenames double as tag lists (e.g. "arrow, hand drawn, scribble, doodle, undo, return, 15.svg"),
so grep this folder by keyword to find something specific.

These are **not** part of the `doodleLibrary.ts` system yet (that one is
sourced from Iconoodle and used by the `<Doodle name="..." />` component).
To wire one of these in as a proper animated line-drawing doodle, its SVG
`<path d="...">` data would need to be extracted and added to
`src/lib/doodleLibrary.ts` the same way the Iconoodle set was — ask Claude
to do this for a specific file/keyword when you want it.

Simpler option: use one directly as a static image (`<img src="/extra-doodles/...">`)
anywhere a static illustration (not a scroll-drawn one) would work.
