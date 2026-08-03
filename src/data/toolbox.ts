import {
  SiFirebase,
  SiNextdotjs,
  SiAndroidstudio,
  SiGit,
  SiGithub,
  SiSupabase,
  SiClaude,
  SiKotlin,
  SiCplusplus,
  SiCloudinary,
} from "react-icons/si";
import { Code2, Bot, Coffee } from "lucide-react";

export interface ToolData {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const TOOLS: ToolData[] = [
  { id: "kotlin", name: "Kotlin", icon: SiKotlin },
  { id: "java", name: "Java", icon: Coffee }, // no official mark available — a coffee cup felt like the honest joke anyway
  { id: "cplusplus", name: "C++", icon: SiCplusplus },
  { id: "android-studio", name: "Android Studio", icon: SiAndroidstudio },
  { id: "nextjs", name: "Next.js", icon: SiNextdotjs },
  { id: "firebase", name: "Firebase", icon: SiFirebase },
  { id: "supabase", name: "Supabase", icon: SiSupabase },
  { id: "cloudinary", name: "Cloudinary", icon: SiCloudinary },
  { id: "git", name: "Git", icon: SiGit },
  { id: "github", name: "GitHub", icon: SiGithub },
  // No official VS Code / ChatGPT / Claude marks available for all of
  // these — generic stand-ins so nothing here misrepresents a brand.
  { id: "vscode", name: "VS Code", icon: Code2 },
  { id: "chatgpt", name: "ChatGPT", icon: Bot },
  { id: "claude", name: "Claude", icon: SiClaude },
];
