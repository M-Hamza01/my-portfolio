export interface FailureData {
  id: string;
  entry: string;
  font?: string;
}

export const FAILURES: FailureData[] = [
  { id: "f1", entry: "Deleted my .env file", font: "hand" },
  { id: "f2", entry: "Spent two weeks redesigning instead of shipping", font: "hand" },
  { id: "f3", entry: "Started rewriting instead of fixing", font: "hand" },
  { id: "f4", entry: "Shipped a broken build to testers 😅", font: "hand" },
  { id: "f5", entry: "Learned the hard way (many times)", font: "hand" },
];
