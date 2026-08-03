export interface CraftSkillData {
  id: string;
  title: string;
  description: string;
  color: "yellow" | "pink" | "blue" | "green";
  font?: string;
}

export const CRAFT_SKILLS: CraftSkillData[] = [
  {
    id: "craft-shoe-mending",
    title: "Shoe mending",
    description: "Learned by watching cobblers work — then just tried it myself.",
    color: "green",
    font: "hand",
  },
  {
    id: "craft-machine-repair",
    title: "Stitching machine repair",
    description:
      "My mom's sewing machine broke more times than I can count. I'd trace the problem for hours — sometimes I fixed it, sometimes I didn't. That's how I learned.",
    color: "blue",
    font: "hand",
  },
  {
    id: "craft-charpai-weaving",
    title: "Charpai weaving",
    description:
      "Watched my grandfather weave for years. Tried it myself one day, and after a few charpais, it clicked.",
    color: "yellow",
    font: "hand",
  },
  {
    id: "craft-poetry",
    title: "Poetry",
    description: "Tried writing some, once. Did not go well. Retired undefeated, technically.",
    color: "pink",
    font: "hand",
  },
];
