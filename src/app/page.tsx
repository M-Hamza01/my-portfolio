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
import { Contact } from "@/components/sections/Contact";
import { PageBreak } from "@/components/scrapbook/PageBreak";
import { FloatingNotesLayer } from "@/components/scrapbook/FloatingNotesLayer";
import {
  getTimeline,
  getFeaturedProjects,
  getAllProjects,
  getCurrentDesk,
  getGraveyard,
  getIdeas,
  getFailures,
  getLessons,
  getNotebookEntries,
  getNowStatus,
  getApprovedGuestbook,
  getSiteImages,
  getHeroStatus,
  getCraftSkills,
  getFloatingNotes,
} from "@/lib/supabase/queries";

export default async function Home() {
  const [
    timeline,
    projects,
    allProjects,
    currentDesk,
    graveyard,
    ideas,
    failures,
    lessons,
    notebookEntries,
    nowStatus,
    guestbookEntries,
    siteImages,
    heroStatus,
    craftSkills,
    floatingNotes,
  ] = await Promise.all([
    getTimeline(),
    getFeaturedProjects(),
    getAllProjects(),
    getCurrentDesk(),
    getGraveyard(),
    getIdeas(),
    getFailures(),
    getLessons(),
    getNotebookEntries(),
    getNowStatus(),
    getApprovedGuestbook(),
    getSiteImages(),
    getHeroStatus(),
    getCraftSkills(),
    getFloatingNotes(),
  ]);

  return (
    <>
      <Sidebar />
      <SidebarOffset>
        <main className="relative">
          <Hero siteImages={siteImages} heroStatus={heroStatus} />
          <PageBreak />
          <About siteImages={siteImages} craftSkills={craftSkills} />
          <PageBreak />
          <Timeline nodes={timeline} />
          <PageBreak />
          <FeaturedProjects projects={projects} />
          <PageBreak />
          <CurrentDesk desk={currentDesk} projects={allProjects} />
          <PageBreak />
          <Graveyard items={graveyard} />
          <PageBreak />
          <IdeaParkingLot ideas={ideas} />
          <PageBreak />
          <FailureWall failures={failures} siteImages={siteImages} />
          <PageBreak />
          <LessonsLearned lessons={lessons} />
          <PageBreak />
          <EngineeringNotebook entries={notebookEntries} />
          <PageBreak />
          <Toolbox />
          <PageBreak />
          <RandomFacts siteImages={siteImages} />
          <PageBreak />
          <Guestbook entries={guestbookEntries} />
          <PageBreak />
          <Now now={nowStatus} />
          <PageBreak />
          <Contact />

          <footer className="mx-auto max-w-5xl px-6 pt-4 pb-16 text-center">
            <p className="font-hand text-lg text-(--color-ink-faint)">
              This isn&apos;t a museum of finished work.
            </p>
            <p className="font-hand text-lg text-(--color-ink-faint)">
              It&apos;s a notebook of things I&apos;ve built, broken, abandoned, and learned from.
            </p>
            <p className="mt-4 font-(family-name:--font-mono) text-xs text-(--color-ink-faint)">
              Made with ♥ by Hamza
            </p>
          </footer>

          <FloatingNotesLayer notes={floatingNotes} />
        </main>
      </SidebarOffset>
    </>
  );
}
