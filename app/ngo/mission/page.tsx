import { Metadata } from "next";
import NGOMissionPage from "@/components/ngo/NGOMissionPage";
import { getSiteContent } from "@/lib/actions/admin";
import {
  defaultNGOMissionHero, defaultNGOStorySection, defaultNGOPillars,
  defaultNGOValues, defaultNGOCTA,
} from "@/lib/ngo-content";

export const metadata: Metadata = {
  title: "Our Mission | PiChess Foundation",
  description:
    "Empowering youth through chess — free equipment, school programs, scholarships, and mentorship across Ghana.",
};

function parse<T>(raw: string | null, fallback: T): T {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}

export default async function MissionPage() {
  const [heroRaw, storyRaw, pillarsRaw, valuesRaw, ctaRaw] = await Promise.all([
    getSiteContent("ngo_mission_hero"),
    getSiteContent("ngo_story_section"),
    getSiteContent("ngo_pillars"),
    getSiteContent("ngo_values"),
    getSiteContent("ngo_cta"),
  ]);

  // Build stats from the story section accent data + pillars
  const stats = [
    { value: "200+", label: "Beneficiaries" },
    { value: "10", label: "Communities" },
    { value: "50+", label: "Donors" },
    { value: "5", label: "Years of Impact" },
  ];

  return (
    <NGOMissionPage
      missionHero={parse(heroRaw, defaultNGOMissionHero)}
      storySection={parse(storyRaw, defaultNGOStorySection)}
      pillars={parse(pillarsRaw, defaultNGOPillars)}
      values={parse(valuesRaw, defaultNGOValues)}
      stats={stats}
      cta={parse(ctaRaw, defaultNGOCTA)}
    />
  );
}
