export interface GraveyardItemData {
  id: string;
  name: string;
  status: "paused" | "abandoned";
  reason: string;
  lesson: string;
  font?: string;
}

export const GRAVEYARD: GraveyardItemData[] = [
  {
    id: "batchbook",
    name: "BatchBook",
    status: "abandoned",
    reason: "Scope exploded. Tried to solve too many problems at once.",
    lesson: "Build for 10 users before planning for 10,000.",
    font: "hand",
  },
  {
    id: "expense-tracker",
    name: "Expense Tracker",
    status: "abandoned",
    reason: "Built because everyone builds one. Lost motivation halfway.",
    lesson: "Only build things I'd personally use.",
    font: "hand",
  },
  {
    id: "ai-study-buddy",
    name: "AI Study Buddy",
    status: "paused",
    reason: "The idea was good but the timing wasn't right.",
    lesson: "Validate early. Don't assume.",
    font: "hand",
  },
];
