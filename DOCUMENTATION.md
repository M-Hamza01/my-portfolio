# Hamza's Lab — Full Documentation

A personal portfolio built as a "living engineering notebook" — scrapbook/notebook visual
language (torn paper, sticky notes, polaroids, doodles) on top of a clean, modern layout.
Nearly everything on the site is editable in place by the owner, with no admin dashboard —
the site itself *is* the admin, gated behind a sign-in.


---

## 1. Tech stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4** (CSS-based theme via `@theme inline` and `@utility` in `globals.css`,
  not a `tailwind.config.ts` file)
- **Framer Motion** — scroll animations, draggable/resizable floating notes, doodle drawing
- **Supabase** — Postgres database, Auth (single owner account), Row Level Security
- **Cloudinary** — image hosting for project screenshots (unsigned browser uploads, no SDK)
- **lucide-react** + **react-icons** (`si` simple-icons set, `fa6` for LinkedIn) — icons

No ORM. All Supabase access goes through `@supabase/supabase-js` via two thin client
wrappers (`src/lib/supabase/client.ts` for the browser, `src/lib/supabase/server.ts` for
Server Components) and one central query file (`src/lib/supabase/queries.ts`).

## 2. Folder structure

```
src/
  app/
    page.tsx              Homepage — fetches everything, renders all sections
    layout.tsx             Root layout — font loading happens here (see §4)
    globals.css             Design tokens, custom utilities, scrollbar, paper texture
    not-found.tsx            Custom 404
    error.tsx                 Custom error boundary
    admin/login/page.tsx        Owner sign-in (email + password)
    projects/page.tsx            All Projects page (not just the featured 6)
    sandbox/page.tsx              Design-system component gallery (dev tool, not linked in nav)

  components/
    scrapbook/              The reusable design-system components (see §5)
    sections/                One file per homepage section (see §6)
    admin/                     EditableWrapper, FontSelect, CloudinaryUpload
    layout/                      Sidebar (nav + owner sign-in/out)

  data/                    Seed/fallback content — one file per section's shape.
                           Used when a Supabase table is empty/unreachable, so the
                           site never looks broken on a fresh database.

  lib/
    supabase/               client.ts, server.ts, queries.ts (all data reads)
    fonts.ts                  Font picker registry + fontStyle() helper
    doodleLibrary.ts           74 hand-drawn doodle paths (see §8)
    stickyNoteAssets.ts         Real sticky-note image registry (see §9)
    tornClipPath.ts              Generates the torn-paper clip-path shapes
    cloudinary.ts                  Unsigned upload helper
    useIsOwner.ts                   Hook: is the signed-in user the owner?
    utils.ts                         cn(), seededRotation(), mockupKindForPlatform()

  fonts/                   Hamza's real font files (next/font/local sources)
  types/content.ts         Legacy shared TS interfaces (mostly superseded by
                            per-file types in data/*.ts now)

public/
  sticky-notes/            Real sticky-note SVG assets (10 colors), used only by
                           the floating draggable note feature
  extra-doodles/            65 unused Figma doodles, kept for future use (see §8)
  hamza-profile.jpeg, placeholder-*.svg    Default images before real ones are uploaded

supabase/
  schema.sql                Base schema — run first
  migration_00N_*.sql         Run in numeric order after schema.sql (see §12)
```

## 3. Design philosophy (for future changes)

- **Structure stays clean; scrapbook elements are a decoration layer on top.** Every
  section uses the same grid/spacing conventions. Tape, sticky notes, curled corners,
  and doodles are applied via dedicated components, never hand-rolled per section.
- **Handwriting font is for personality; professional font is for anything functional
  or informational.** Buttons, links, data values (e.g. "Next milestone"), and
  explanatory content use `font-body` (Inter). Personal reflections, taglines, and
  asides use `font-hand`. This was a deliberate fix partway through the project — see
  the git history / conversation for the reasoning if it ever seems inconsistent.
- **One signature structural element**: `PageBreak` (torn/stitched divider) between
  every section, reinforcing "these are physical notebook pages."

## 4. Font system

Six selectable fonts, defined in `src/lib/fonts.ts` (`FONT_OPTIONS`):

| id | Displayed as | CSS var | Notes |
|---|---|---|---|
| `hand` | Handwriting (default) | `--font-hand` | Aliases to `custom-1` |
| `display` | Display (Space Grotesk)* | `--font-display` | *Label is stale — see below |
| `body` | Body (Inter) | `--font-body` | |
| `mono` | Mono (JetBrains) | `--font-mono` | |
| `custom-1` | Hamza's Handwriting | `--font-custom-1` | Real font, `src/fonts/HamzasHandwriting.ttf` |
| `custom-2` | Elms Sans | `--font-custom-2` | Real font, `src/fonts/ElmsSans-Variable.ttf` |

**Important history**: `--font-display` originally pointed at Google's Space Grotesk, then
was switched to alias `--font-custom-2` (Elms Sans) site-wide as the heading font. The
`FONT_OPTIONS` label still says "Space Grotesk" — cosmetic only, doesn't affect rendering.
Fix the label in `src/lib/fonts.ts` if it bothers you.

**Critical structural detail — do not move this**: the `next/font/local` and
`next/font/google` `variable` classes are applied to `<html>` in `layout.tsx`, NOT
`<body>`. `globals.css`'s `:root` block (which *is* `<html>`) references these same CSS
variables. CSS custom properties only resolve from the same element or an ancestor, never
a descendant — so if the font classes were ever moved back onto `<body>`, every font
`var()` reference in `:root` would silently fail and font changes would appear to do
nothing. This exact bug happened once already.

**`fontStyle(id)`** (in `lib/fonts.ts`) returns a React inline `style` object for content
where the font is stored per-row in the database (see §7). It also applies a slight
italic + letter-spacing tweak automatically whenever the resolved font is the real
handwriting font (`hand` or `custom-1`) — matches the `.font-hand` Tailwind utility
defined via `@utility` in `globals.css`, which does the same for static JSX usage.

**Which content gets a font picker**: Lessons, Ideas (both owner and public-submitted),
Failures, Graveyard (lesson line only), Notebook entries, Craft Skills, and floating
sticky notes. Timeline, Projects, and Now deliberately do **not** — those read as
structural/informational rather than personal-voice.

## 5. The design-system components (`src/components/scrapbook/`)

| Component | What it does |
|---|---|
| `StickyNote` | CSS-drawn sticky note (torn clip-path edge + curled corner + paper grain). Used site-wide for personal-reflection content (Lessons, Ideas, Craft Skills, Current Desk's "Why"). **Not** the same as the floating note — see §9 for why these were kept separate. |
| `PolaroidCard` | Photo frame with tape + rotation. Takes `unoptimized` for data-URL sources (guestbook doodles). |
| `EditablePolaroid` | Wraps `PolaroidCard` with an owner-only pencil icon that opens a Cloudinary upload panel, persisting to the `site_images` table. Used for Hero portrait, About desk photo, Random Facts photo, Failure Wall photo. |
| `NotebookCard` | The workhorse container — plain/ruled/grid variants, optional torn top/bottom edge via `tornClipPath`. |
| `Tape`, `Stamp`, `HandwrittenLabel` | Small decorative primitives. |
| `Doodle` | Renders a hand-drawn line-art doodle by name (from `doodleLibrary.ts`) or custom path data, drawing itself on scroll into view via `pathLength` animation. |
| `PageBreak` | The torn/stitched section divider. |
| `DeviceMockup` | Phone/web/code frame for project screenshots. See §10. |
| `ProgressBar` | Animated fill-on-scroll progress bar, used by Hero and Current Desk. |
| `DoodleCanvas` | The guestbook's drawing pad — pen/eraser/colors/sizes/undo-redo, Ctrl+Z shortcuts. See §11. |
| `FloatingStickyNote`, `FloatingNotesLayer` | The draggable/resizable personal sticky notes. See §9. |

## 6. Sections (`src/components/sections/`), in page order

Each section is `<id>` on the homepage, listed in the sidebar nav (`Sidebar.tsx`).

1. **Hero** (`#home`) — title, tagline, editable animated progress bar (owner-editable
   via `hero_status` table), editable portrait.
2. **About** (`#about`) — bio paragraphs (static, edit the JSX directly), plus the
   **"Also, I try everything"** craft-skills list — full CRUD, `craft_skills` table.
3. **Timeline** (`#timeline`) — journey nodes with doodle icons, full CRUD,
   `timeline_nodes` table. Dashed connecting line only correctly aligns with the first
   row when the grid wraps on narrow screens (known cosmetic limitation).
4. **Featured Projects** (`#projects`) — top 6 projects (by `sort_order`, `featured =
   true`). "See all projects" links to `/projects`.
5. **Current Desk** (`#current-desk`) — singleton (`current_desk_meta` table), can be
   linked to a project (autofills fields, pulls its screenshot into the mockup).
6. **Project Graveyard** (`#graveyard`) — abandoned/paused projects, full CRUD.
7. **Idea Parking Lot** (`#ideas`) — the one section with **public submissions**.
   Visitors get an always-visible "Suggest an idea" tile (no sign-in) that inserts with
   `approved: false`. Owner sees a moderation panel to approve/delete pending
   suggestions; owner's own additions via the pencil/+ icons save as already-approved.
8. **Failure Wall** (`#failure-wall`) — full CRUD, owner-only (not public).
9. **Lessons Learned** (`#lessons`) — full CRUD.
10. **Engineering Notebook** (`#notebook`) — full CRUD.
11. **Toolbox** (`#toolbox`) — static data (`data/toolbox.ts`), not DB-backed by design
    (personal-profile facts that don't change often).
12. **Random Facts** (`#random-facts`) — static data + one editable photo.
13. **Guestbook** (`#guestbook`) — see §11, the biggest custom feature.
14. **Now** (`#now`) — singleton (`now_status` table), editable checklist.
15. **Contact** (`#contact`) — static links (email, LinkedIn, GitHub, Instagram),
    `data/contact.ts`.

**Floating sticky notes** render as an additional layer over the whole page (see §9),
not tied to any single section.

## 7. The editing system

**Owner detection**: `useIsOwner()` (`lib/useIsOwner.ts`) checks for an active Supabase
Auth session client-side. There's exactly one real "owner" concept: any authenticated
user in this Supabase project is treated as the owner (RLS policies check
`auth.role() = 'authenticated'`, not a specific user ID). This is fine as long as only
one account exists in the project — if you ever add other Supabase Auth users to this
project for any reason, tighten the RLS policies first.

**Sign in**: `/admin/login`, email + password (create the account in Supabase dashboard
→ Authentication → Users). Sidebar shows "Owner sign in" / "Sign out" accordingly.

**`EditableWrapper`** (`components/admin/EditableWrapper.tsx`) is the core mechanism:
wraps any content block, shows a pencil icon (mode="edit") or a dashed "+" tile
(mode="add") only when `isOwner`, opens a slide-over drawer containing whatever form you
pass as `renderEditor`. When signed out, `mode="add"` tiles render nothing at all (not
just hidden pencil) so visitors never see empty "+" placeholders.

**Pattern for every CRUD section**: parent component holds a `useState` array seeded
from the server-fetched prop; each item is wrapped in `EditableWrapper` with a
`<Thing>Form` component that does the Supabase insert/update/delete directly (client-side,
relies on RLS) and calls `onSaved`/`onDeleted` to update local state immediately — no
page reload, no refetch.

**`FontSelect`** — dropdown of `FONT_OPTIONS`, dropped into any form that supports
per-row font choice.

**`CloudinaryUpload`** — file input → `uploadToCloudinary()` → returns a URL, used by
`ProjectForm` (cover image) and `EditablePolaroid` (site photos).

## 8. The doodle library

`src/lib/doodleLibrary.ts` — 74 hand-drawn line-art doodles, **sourced from
[Iconoodle](https://github.com/NK2552003/Iconoodle) (MIT licensed)**, "handmade doodled
icons" pack. Each entry is `{ viewBox, paths: string[] }` — raw SVG path data, rendered
via the `Doodle` component with `stroke="currentColor"` so they inherit whatever text
color class is applied, and animated with a `pathLength` scroll-draw effect.

To add a new doodle: extract path `d` data from an SVG (same process as the original
extraction — see conversation history if you need the exact script), add an entry to the
`DOODLES` object, reference it by key via `<Doodle name="your-key" />`.

**`public/extra-doodles/`** — a separate, unused 65-file pack of Figma Community SVGs
(full illustrations, not just paths). Not wired into the `Doodle` component. See the
`README.md` in that folder for how to pull one in if wanted later.

## 9. Sticky notes — two separate systems (important, don't merge them)

1. **Site-wide `StickyNote`** (CSS-drawn) — used in Lessons, Ideas, Craft Skills,
   Current Desk's "Why" note. Torn-paper clip-path + curled corner + paper grain, all
   generated in code (`tornClipPath.ts` + Tailwind).
2. **`FloatingStickyNote`** (real image assets) — the draggable, resizable, fully
   customizable personal note feature. Uses real photo-realistic sticky-note SVGs
   (`public/sticky-notes/*.svg`, from a Figma Community pack, with the pack's original
   placeholder "lorem ipsum" scribble text stripped out — see `lib/stickyNoteAssets.ts`
   for the color→asset registry, 10 colors available here vs. 4 for the CSS notes).

**These were unified once, then deliberately reverted** — real image assets for every
sticky note site-wide made longer text pieces look inconsistent (the image has to
stretch to fit varying content, and the visible "paper" area within the image's canvas
is a % of the canvas, not the full box, causing text-overflow bugs at different sizes).
Keep them separate.

**Floating notes are desktop-only (`lg:` breakpoint and up).** Position is stored as
absolute pixels (`pos_x`/`pos_y` on `floating_notes`) relative to the full-width page —
calibrated for whatever desktop width the owner was viewing at. This does not translate
to narrow viewports (a note near the right edge on a 1400px screen would be off-screen
on a 375px phone), so the whole layer (notes + the "+" add button) is hidden below `lg`
via a `hidden lg:contents` wrapper in `FloatingNotesLayer`.

**Floating note text overlay**: positioned via a percentage-based inset box (`top: 30%,
left: 30%, right: 10%, bottom: 20%` as of the last tuning pass), not fixed padding —
required because the visible "paper" region inside the SVG's own canvas is itself a
percentage of that canvas (there's a transparent curl/shadow margin around it), so fixed
pixel padding would put text outside the paper at different note sizes.

**Resize**: drag the corner handle, or type exact px values in the edit panel (both
write to the same `width`/`height` columns). Constrained to 120–420px per side.

## 10. Project mockups (`DeviceMockup`)

Three frame kinds — `mockupKindForPlatform()` in `lib/utils.ts` maps a project's
`platform` field to one:

- **Android / iOS** → `"phone"` frame
- **Web / Desktop** → `"web"` frame (browser chrome)
- **C++ / Java / Other** → `"code"` frame (terminal window) — added because semester/
  console projects don't have a "screen" to show; a phone or browser frame would
  misrepresent them.

Sizes are **fixed pixel dimensions per kind+size combo** (`SIZES` map in
`DeviceMockup.tsx`), deliberately not CSS `aspect-ratio` + an external height cap —
those fight each other and distort the frame. `size="sm"` is used in grid contexts
(Featured Projects, All Projects) where every card needs the same visual footprint
regardless of frame shape; `size="md"` (default) is for standalone use (Current Desk).

## 11. The Guestbook (the biggest custom feature)

Visitors draw with `DoodleCanvas` (pen, eraser — which paints opaque white, not true
alpha transparency, to avoid see-through artifacts — 6 colors, 3 brush sizes, undo/redo
via a stroke-list history, Ctrl+Z / Ctrl+Shift+Z keyboard shortcuts that don't hijack
native text-undo while typing in the name/caption fields), add a name (required) and
caption (optional), submit. **A doodle is required** — no more text-only guestbook
entries; old ones are filtered out of the display.

Doodles are exported via `canvas.toDataURL('image/png')` and stored as a **base64 data
URL directly in the `guestbook_entries.doodle_data_url` column** — not Supabase Storage.
Deliberate tradeoff: kept setup to one migration instead of also configuring a storage
bucket + policies. Fine for a personal-portfolio guestbook's traffic; worth revisiting
if it ever gets heavy.

**Display**: a single collaged "board" (not individual polaroid cards), paginated 15 at
a time ("Load more" button — not infinite scroll, not a scrollable inner container,
both of which caused earlier bugs with tooltip clipping). Hover/tap a doodle to see a
tooltip with name + caption, positioned above the doodle (not below) specifically to
avoid bleeding into whatever section comes next.

**Moderation** (owner-only, top of section when signed in): pending entries shown by
default with an "Approve all (N)" button; already-approved entries collapse behind a
"View approved (N)" toggle so it doesn't become infinite scroll-through-history.

## 12. Supabase setup

Run in the SQL editor, **in order**:

1. `schema.sql` — base tables: `projects`, `graveyard_items`, `ideas`, `failure_entries`,
   `notebook_entries`, `lessons`, `now_status`, `timeline_nodes`, `guestbook_entries`,
   plus RLS (public read, owner write via `auth.role() = 'authenticated'`).
2. `migration_001_guestbook_owner_read.sql` — lets the owner SELECT unapproved guestbook
   rows (original schema only allowed reading approved ones).
3. `migration_002_current_desk.sql` — `current_desk_meta` table (singleton pattern:
   delete-all-then-insert on every save, like `now_status`).
4. `migration_003_fonts_and_public_ideas.sql` — adds `font` column to lessons/ideas/
   notebook_entries/graveyard_items/failure_entries; adds `approved` + `submitted_by` to
   `ideas` and switches its RLS to public-insert + approved-only public-read.
5. `migration_004_guestbook_doodle.sql` — `doodle_data_url` column, makes `note` nullable.
6. `migration_005_project_github.sql` — `github_url` column on `projects`.
7. `migration_006_current_desk_link_and_site_images.sql` — `current_desk_meta.project_id`
   FK (for the project-picker/linked-mockup feature); new `site_images` table
   (key→url store for the editable polaroid photos).
8. `migration_007_hero_craft_floating_notes.sql` — three new tables: `hero_status`,
   `craft_skills`, `floating_notes`.
9. `migration_008_real_sticky_assets.sql` — `width`/`height` columns on `floating_notes`;
   expands its `color` check constraint from 4 values to the full 10-color palette.

**`projects` table columns of note**: `slug` (unique — see the collision-retry logic in
`ProjectForm.tsx`, which tries `-2`, `-3`, etc. on conflict rather than surfacing a raw
DB error), `featured` (boolean, controls Featured Projects homepage visibility — always
editable now, not just at creation), `cover_image_url`, `github_url`, `link_url` (the
"live app / details" link, e.g. `zivxio.vercel.app/nustone`), plus the six reflection
fields (`why_built`, `problem_it_solves`, `biggest_challenge`, `biggest_mistake`,
`proud_of`, `improve_today`) shown behind a "Read the story →" toggle on each card.

## 13. Environment variables (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

Cloudinary preset must be **unsigned** (Settings → Upload → Upload presets → Signing
Mode: Unsigned) — that's what lets the browser upload directly from the owner-only edit
forms without a server-side signing step. See `src/lib/cloudinary.ts` header comment for
the full setup walkthrough.

## 14. Known gaps / things intentionally left as-is

- **VS Code and ChatGPT** have no official brand marks available in the icon libraries
  used (`react-icons/si`) — generic `lucide-react` stand-ins (`Code2`, `Bot`) used
  instead of misrepresenting a brand.
- **Java** has no available icon either — used a `Coffee` icon as an intentional joke,
  see comment in `data/toolbox.ts`.
- **LinkedIn** isn't in the `simple-icons` set at all — sourced from `react-icons/fa6`
  instead (`FaLinkedin`).
- **Toolbox and Random Facts are static**, not DB-backed — deliberate, since they're
  personal-profile facts that don't change often; ask if you want them made editable
  later, same CRUD pattern would apply.
- **Mobile timeline line** only visually connects the first row (see §6).
- **Floating notes are desktop-only** (see §9) — a proper mobile version would need
  percentage-based or otherwise viewport-relative positioning, not a small fix.

## 15. Local development

```bash
npm install
cp .env.example .env.local   # fill in the four values from §13
npm run dev
```

Visit `/sandbox` to see every design-system component in isolation — useful for
checking a component change without hunting through a real section for it.

Build check before shipping changes: `npm run build` (also runs the TypeScript check).
`npx eslint .` for lint.
