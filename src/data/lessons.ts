export interface LessonData {
  id: string;
  text: string;
  color: "yellow" | "pink" | "blue" | "green";
}

export const LESSONS: LessonData[] = [
  { id: "l1", text: "Done > Perfect", color: "yellow" },
  { id: "l2", text: "Users don't care about architecture.", color: "blue" },
  { id: "l3", text: "The first version always looks bad.", color: "green" },
  { id: "l4", text: "Ship. Then improve.", color: "pink" },
  { id: "l5", text: "Most bugs happen because I assumed something.", color: "yellow" },
];
