import AnimatedSection from "@/components/shared/AnimatedSection";
import StatsCounter from "@/components/shared/StatsCounter";
import NGOHero from "@/components/ngo/NGOHero";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { getSiteContent } from "@/lib/actions/admin";
import {
  defaultNGOHero, defaultNGOStats, defaultNGOMissionTeaser, defaultNGOProgramsTeaser,
  type NGOHeroData, type NGOStat, type NGOMissionTeaser, type NGOProgramsTeaser,
} from "@/lib/ngo-content";

export const metadata = { title: "PiChess Foundation" };

function parse<T>(raw: string | null, fallback: T): T {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}

async function getPageData() {
  try {
    const [stories, heroRaw, statsRaw, missionRaw, programsRaw] = await Promise.all([
      prisma.nGO_Story.findMany({ where: { published: true }, take: 3, orderBy: { createdAt: "desc" } }),
      getSiteContent("ngo_hero"),
      getSiteContent("ngo_stats"),
      getSiteContent("ngo_mission_teaser"),
      getSiteContent("ngo_programs_teaser"),
    ]);
    return {
      stories,
      hero: parse<NGOHeroData>(heroRaw, defaultNGOHero),
      stats: parse<NGOStat[]>(statsRaw, defaultNGOStats),
      mission: parse<NGOMissionTeaser>(missionRaw, defaultNGOMissionTeaser),
      programs: parse<NGOProgramsTeaser>(programsRaw, defaultNGOProgramsTeaser),
    };
  } catch {
    return { stories: [], hero: defaultNGOHero, stats: defaultNGOStats, mission: defaultNGOMissionTeaser, programs: defaultNGOProgramsTeaser };
  }
}

export default async function NGOPage() {
  const { stories, hero, stats, mission, programs } = await getPageData();

  return (
    <div className="overflow-x-hidden text-zinc-900 bg-white">
      {/* Hero */}
      <NGOHero data={hero} />

      {/* Impact stats */}
      <section className="py-20 bg-[#2e7d5b] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 chess-bg pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((s, i) => (
              <StatsCounter key={i} end={s.value} label={s.label} suffix={s.suffix} color="white" />
            ))}
          </div>
        </div>
      </section>

      {/* Mission Teaser */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={mission.backgroundImage}
            alt="Children playing chess in community"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/80" />
          <div className="absolute inset-0 bg-[#2e7d5b]/15" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/80 text-xs font-semibold uppercase tracking-widest mb-6">
              {mission.badge}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6">
              {mission.heading}{" "}
              <span className="bg-gradient-to-r from-[#5cc99a] via-[#2e7d5b] to-[#5cc99a] bg-clip-text text-transparent">{mission.headingHighlight}</span>
            </h2>
            <p className="max-w-2xl mx-auto text-white/60 text-lg leading-relaxed mb-10">
              {mission.description}
            </p>
            <Link href="/ngo/mission" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-base transition-all duration-300 hover:scale-105">
              {mission.ctaText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Programs Teaser */}
      <section className="py-24 bg-zinc-50 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2e7d5b]/20 to-transparent" />
        <div className="max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-6">
              {programs.badge}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight mb-4">{programs.heading}</h2>
            <p className="max-w-2xl mx-auto text-zinc-500 text-lg leading-relaxed mb-8">
              {programs.description}
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {programs.tags.map((p) => (
                <span key={p} className="px-4 py-2 rounded-full bg-white border border-zinc-200 text-zinc-700 text-sm font-semibold shadow-sm">{p}</span>
              ))}
            </div>
            <Link href="/ngo/programs" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#2e7d5b] hover:bg-[#3a9970] text-white font-bold text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-[#2e7d5b]/20">
              {programs.ctaText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Stories Teaser */}
      {stories.length > 0 && (
        <section id="stories" className="py-24 bg-zinc-50 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <AnimatedSection>
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-4">
                Stories of Impact
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight mb-4">Voices From Our Community</h2>
              <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto mb-10">
                Real stories from the children, families, and communities transformed by chess. {stories.length} stories and counting.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {stories.slice(0, 3).map((s) => (
                  <div key={s.id} className="rounded-2xl bg-white border border-zinc-100 p-5 text-left shadow-sm">
                    <h3 className="font-bold text-zinc-900 text-sm mb-2 line-clamp-1">{s.title}</h3>
                    <p className="text-zinc-400 text-xs line-clamp-2">{s.content}</p>
                  </div>
                ))}
              </div>
              <Link href="/ngo/stories" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#2e7d5b] hover:bg-[#3a9970] text-white font-bold text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-[#2e7d5b]/20">
                Read All Stories
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </AnimatedSection>
          </div>
        </section>
      )}
    </div>
  );
}
