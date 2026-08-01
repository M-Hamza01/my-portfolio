export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  platform: string;
  status: "shipped" | "in-progress" | "paused";
  summary: string;
  stack: string[];
  linkUrl: string | null;
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
  },
];
