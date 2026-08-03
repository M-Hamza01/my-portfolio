export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  platform: string;
  status: "shipped" | "in-progress" | "paused";
  summary: string;
  stack: string[];
  linkUrl: string | null;
  githubUrl?: string | null;
  coverImageUrl?: string | null;
  whyBuilt?: string;
  problemItSolves?: string;
  biggestChallenge?: string;
  biggestMistake?: string;
  proudOf?: string;
  improveToday?: string;
}

export const FEATURED_PROJECTS: ProjectData[] = [
  {
    id: "nust-one",
    slug: "nust-one",
    title: "NUST One",
    platform: "Android",
    status: "shipped",
    summary:
      "An all-in-one app for NUST students to access portals, announcements, and more.",
    stack: ["Flutter", "Firebase", "REST API"],
    linkUrl: null,
    whyBuilt: "NUST students juggle five different portals just to check basic info. I wanted one app that did it all.",
    problemItSolves: "Fragmented access to university services — timetables, announcements, results — scattered across logins.",
    biggestChallenge: "Scraping and normalizing data from portals that were never built with an API in mind.",
    biggestMistake: "Underestimated how often the university would change portal layouts without warning.",
    proudOf: "It's the first thing I shipped that strangers actually use daily.",
    improveToday: "I'd build a proper backend instead of scraping live on every request.",
  },
  {
    id: "billcheck",
    slug: "billcheck",
    title: "BillCheck",
    platform: "Android",
    status: "in-progress",
    summary: "Check & download electricity bills in Pakistan. Fast, beautiful, simple.",
    stack: ["Flutter", "Firebase", "PDF", "Web Scraping"],
    linkUrl: null,
    whyBuilt: "Parents kept asking me to download bills. That's how this started.",
    problemItSolves: "Downloading a utility bill in Pakistan usually means five ad-filled steps on a slow government site.",
    biggestChallenge: "Finding reliable, stable bill sources that don't break every few weeks.",
    biggestMistake: "Spent two weeks redesigning the UI before the core download flow even worked reliably.",
    proudOf: "The first version that actually felt calm to use, not cluttered.",
    improveToday: "I'd validate the scraping approach with 10 real users before building any UI at all.",
  },
  {
    id: "zivxio",
    slug: "zivxio",
    title: "ZivXio Website",
    platform: "Web",
    status: "shipped",
    summary: "My personal brand website to showcase projects and share learnings.",
    stack: ["Next.js", "Tailwind", "Framer Motion"],
    linkUrl: null,
    whyBuilt: "Wanted a place that felt like me instead of a template portfolio.",
    problemItSolves: "Most portfolios only show finished work — this one shows the process too.",
    biggestChallenge: "Balancing 'clean layout' with 'handmade personality' without it turning into visual chaos.",
    biggestMistake: "Tried to build every section pixel-perfect before shipping anything.",
    proudOf: "The whole thing is a reusable design system, not one-off pages.",
    improveToday: "I'd ship the barebones version in week one and layer personality on top.",
  },
];
