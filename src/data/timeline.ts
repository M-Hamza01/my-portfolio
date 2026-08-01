import type { DoodleName } from "@/lib/doodleLibrary";

export interface TimelineNodeData {
  id: string;
  label: string;
  date: string;
  icon: DoodleName;
}

export const TIMELINE: TimelineNodeData[] = [
  { id: "t1", label: "Learned C++", date: "Jan 2025", icon: "book1" },
  { id: "t2", label: "Built my first Android app", date: "Mar 2025", icon: "laptop" },
  { id: "t3", label: "Published NUST One", date: "May 2025", icon: "flag" },
  { id: "t4", label: "Started BillCheck", date: "Jun 2025", icon: "lab-flask" },
  { id: "t5", label: "Discovered I enjoy UI more than expected", date: "Jul 2025", icon: "sparkle" },
  { id: "t6", label: "Trying to build products, not projects", date: "Now", icon: "trophy" },
];
