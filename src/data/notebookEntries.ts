export interface NotebookEntryData {
  id: string;
  date: string;
  body: string;
  tag: string;
}

export const NOTEBOOK_ENTRIES: NotebookEntryData[] = [
  {
    id: "n1",
    date: "July 2, 2025",
    body: "Spent four hours fixing one animation. Found out the bug was one line. Worth it.",
    tag: "UI/UX",
  },
  {
    id: "n2",
    date: "July 7, 2025",
    body: "Redesigned BillCheck again. Removed half the UI. Looks much better.",
    tag: "Product",
  },
  {
    id: "n3",
    date: "July 14, 2025",
    body: "Published my first production fix. Nobody noticed. Exactly how it should be.",
    tag: "Reflection",
  },
];
