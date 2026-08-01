export interface IdeaData {
  id: string;
  title: string;
  category: string;
  note: string;
  color: "yellow" | "pink" | "blue" | "green";
}

export const IDEAS: IdeaData[] = [
  {
    id: "voice-notes",
    title: "Voice Notes App",
    category: "Productivity",
    note: "Maybe one day.",
    color: "yellow",
  },
  {
    id: "uni-companion",
    title: "University Companion",
    category: "Education",
    note: "Needs validation.",
    color: "blue",
  },
  {
    id: "ai-notes",
    title: "AI Notes",
    category: "AI",
    note: "Not convinced yet.",
    color: "pink",
  },
  {
    id: "offline-map-nust",
    title: "Offline Map for NUST",
    category: "Utility",
    note: "Interesting.",
    color: "green",
  },
];
