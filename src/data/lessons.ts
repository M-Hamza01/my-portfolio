export interface LessonData {
  id: string;
  text: string;
  color: "yellow" | "pink" | "blue" | "green";
  font?: string;
}

export const LESSONS: LessonData[] = [
  { id: "l1", text: "Done > Perfect", color: "yellow", font: "hand" },
  { id: "l2", text: "Users don't care about architecture.", color: "blue", font: "hand" },
  { id: "l3", text: "The first version always looks bad.", color: "green", font: "hand" },
  { id: "l4", text: "Ship. Then improve.", color: "pink", font: "hand" },
  { id: "l5", text: "Most bugs happen because I assumed something.", color: "yellow", font: "hand" },
];
