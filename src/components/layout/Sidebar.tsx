"use client";

import { useState } from "react";
import {
  Home,
  User,
  GitBranch,
  FolderKanban,
  Laptop,
  Skull,
  Lightbulb,
  NotebookPen,
  Wrench,
  Sparkles,
  BookOpen,
  CalendarDays,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#home", label: "Home", icon: Home },
  { href: "#about", label: "About Me", icon: User },
  { href: "#timeline", label: "Timeline", icon: GitBranch },
  { href: "#projects", label: "Projects", icon: FolderKanban },
  { href: "#current-desk", label: "Current Desk", icon: Laptop },
  { href: "#graveyard", label: "Graveyard", icon: Skull },
  { href: "#ideas", label: "Ideas", icon: Lightbulb },
  { href: "#notebook", label: "Notebook", icon: NotebookPen },
  { href: "#toolbox", label: "Toolbox", icon: Wrench },
  { href: "#random-facts", label: "Random Facts", icon: Sparkles },
  { href: "#guestbook", label: "Guestbook", icon: BookOpen },
  { href: "#now", label: "Now", icon: CalendarDays },
];

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavList = (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          href={href}
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded px-3 py-2 text-sm text-(--color-ink-soft) transition-colors hover:bg-(--color-paper-dark) hover:text-(--color-ink)"
        >
          <Icon size={16} />
          {label}
        </a>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed top-0 left-0 z-30 hidden h-full w-56 flex-col border-r border-(--color-paper-line) bg-(--color-paper) px-4 py-6 lg:flex">
        <div className="mb-6 px-3 font-(family-name:--font-display) text-lg font-bold">
          Hamza&apos;s Lab
        </div>
        {NavList}
        <div className="mt-auto px-3 pt-6 font-(family-name:--font-hand) text-sm text-(--color-ink-faint)">
          Built with ♥ and ☕
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed top-0 right-0 left-0 z-30 flex items-center justify-between border-b border-(--color-paper-line) bg-(--color-paper) px-4 py-3 lg:hidden">
        <span className="font-(family-name:--font-display) text-base font-bold">
          Hamza&apos;s Lab
        </span>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className="text-(--color-ink)"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="fixed top-[52px] right-0 left-0 z-30 border-b border-(--color-paper-line) bg-(--color-paper) px-4 pb-4 lg:hidden">
          {NavList}
        </div>
      )}
    </>
  );
}

/** Spacer that reserves room for the fixed sidebar / mobile bar. */
export function SidebarOffset({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("pt-16 lg:pt-0 lg:pl-56", className)}>{children}</div>;
}
