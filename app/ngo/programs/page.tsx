import NGOProgramsPage from "@/components/ngo/NGOProgramsPage";
import { getSiteContent } from "@/lib/actions/admin";
import {
  defaultNGOProgramsHero, defaultNGOPrograms, defaultNGOProcessSteps,
  defaultNGOTestimonials, defaultNGOTimeline, defaultNGOProgramsStats, defaultNGOCTA,
  type NGOProgramsHero, type NGOProgram, type NGOProcessStep,
  type NGOTestimonial, type NGOTimelineItem, type NGOProgramsImpactStat, type NGOCTA,
} from "@/lib/ngo-content";

export const metadata = {
  title: "Our Programs | PiChess Foundation",
  description:
    "Discover the six programs that power the PiChess Foundation — from free chess equipment and school programs to scholarships, mentorship, community hubs, and tournaments.",
};

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export default async function ProgramsPage() {
  const [heroRaw, programsRaw, stepsRaw, testimonialsRaw, timelineRaw, statsRaw, ctaRaw] = await Promise.all([
    getSiteContent("ngo_programs_hero"),
    getSiteContent("ngo_programs"),
    getSiteContent("ngo_process_steps"),
    getSiteContent("ngo_testimonials"),
    getSiteContent("ngo_timeline"),
    getSiteContent("ngo_programs_stats"),
    getSiteContent("ngo_cta"),
  ]);

  return (
    <NGOProgramsPage
      programsHero={parse<NGOProgramsHero>(heroRaw, defaultNGOProgramsHero)}
      programs={parse<NGOProgram[]>(programsRaw, defaultNGOPrograms)}
      processSteps={parse<NGOProcessStep[]>(stepsRaw, defaultNGOProcessSteps)}
      testimonials={parse<NGOTestimonial[]>(testimonialsRaw, defaultNGOTestimonials)}
      timeline={parse<NGOTimelineItem[]>(timelineRaw, defaultNGOTimeline)}
      impactStats={parse<NGOProgramsImpactStat[]>(statsRaw, defaultNGOProgramsStats)}
      cta={parse<NGOCTA>(ctaRaw, defaultNGOCTA)}
    />
  );
}
