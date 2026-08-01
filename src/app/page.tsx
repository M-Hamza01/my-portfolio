import { Sidebar, SidebarOffset } from "@/components/layout/Sidebar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Timeline } from "@/components/sections/Timeline";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { CurrentDesk } from "@/components/sections/CurrentDesk";
import { Graveyard } from "@/components/sections/Graveyard";
import { IdeaParkingLot } from "@/components/sections/IdeaParkingLot";
import { FailureWall } from "@/components/sections/FailureWall";
import { LessonsLearned } from "@/components/sections/LessonsLearned";
import { EngineeringNotebook } from "@/components/sections/EngineeringNotebook";
import { Toolbox } from "@/components/sections/Toolbox";
import { RandomFacts } from "@/components/sections/RandomFacts";
import { Guestbook } from "@/components/sections/Guestbook";
import { Now } from "@/components/sections/Now";
import { PageBreak } from "@/components/scrapbook/PageBreak";

const SECTIONS = [
  Hero,
  About,
  Timeline,
  FeaturedProjects,
  CurrentDesk,
  Graveyard,
  IdeaParkingLot,
  FailureWall,
  LessonsLearned,
  EngineeringNotebook,
  Toolbox,
  RandomFacts,
  Guestbook,
  Now,
];

export default function Home() {
  return (
    <>
      <Sidebar />
      <SidebarOffset>
        <main>
          {SECTIONS.map((Section, i) => (
            <div key={Section.name}>
              <Section />
              {i < SECTIONS.length - 1 && <PageBreak />}
            </div>
          ))}
          <footer className="mx-auto max-w-5xl px-6 pt-4 pb-16 text-center">
            <p className="font-(family-name:--font-hand) text-lg text-(--color-ink-faint)">
              This isn&apos;t a museum of finished work.
            </p>
            <p className="font-(family-name:--font-hand) text-lg text-(--color-ink-faint)">
              It&apos;s a notebook of things I&apos;ve built, broken, abandoned, and learned from.
            </p>
            <p className="mt-4 font-(family-name:--font-mono) text-xs text-(--color-ink-faint)">
              Made with ♥ by Hamza
            </p>
          </footer>
        </main>
      </SidebarOffset>
    </>
  );
}
