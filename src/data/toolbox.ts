import {
  SiFlutter,
  SiFirebase,
  SiNextdotjs,
  SiFigma,
  SiAndroidstudio,
  SiGit,
  SiPostman,
  SiSupabase,
} from "react-icons/si";
import { Code2, Bot } from "lucide-react";

export interface ToolData {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const TOOLS: ToolData[] = [
  { id: "flutter", name: "Flutter", icon: SiFlutter },
  { id: "firebase", name: "Firebase", icon: SiFirebase },
  { id: "nextjs", name: "Next.js", icon: SiNextdotjs },
  { id: "figma", name: "Figma", icon: SiFigma },
  { id: "android-studio", name: "Android Studio", icon: SiAndroidstudio },
  { id: "git", name: "Git", icon: SiGit },
  // No official VS Code / ChatGPT marks in the icon set — generic
  // stand-ins so we're not misrepresenting a brand mark.
  { id: "vscode", name: "VS Code", icon: Code2 },
  { id: "postman", name: "Postman", icon: SiPostman },
  { id: "supabase", name: "Supabase", icon: SiSupabase },
  { id: "chatgpt", name: "ChatGPT", icon: Bot },
];
