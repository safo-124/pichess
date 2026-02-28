import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import MagneticButton from "@/components/shared/MagneticButton";
import TournamentEventCards, { type TournamentItem } from "@/components/academy/TournamentEventCards";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Tournaments & Events — PiChess Academy",
  description:
    "Academy tournaments, chess events, and competitive experiences for students at every level.",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
async function getData(): Promise<TournamentItem[]> {
  try {
    const rows = await (prisma as any).tournament.findMany({
      where: { tags: { has: "academy" } },
      orderBy: [{ status: "asc" }, { date: "desc" }],
      include: {
        photos: true,
        registrations: { where: { status: "CONFIRMED" }, select: { id: true } },
      },
    });
    return rows.map((t: any) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      date: t.date instanceof Date ? t.date.toISOString() : String(t.date),
      endDate: t.endDate ? (t.endDate instanceof Date ? t.endDate.toISOString() : String(t.endDate)) : null,
      location: t.location,
      venue: t.venue,
      flyer: t.flyer,
      registrationLink: t.registrationLink,
      type: t.type ?? "TOURNAMENT",
      tags: t.tags ?? [],
      status: t.status,
      featured: t.featured,
      maxSpots: t.maxSpots ?? null,
      registeredCount: t.registrations?.length ?? 0,
      photos: t.photos?.map((p: any) => ({ id: p.id, url: p.url, caption: p.caption })) ?? [],
    }));
  } catch {
    return [];
  }
}

export default async function AcademyTournamentsPage() {
  const items = await getData();

  const upcomingCount = items.filter((i) => i.status === "UPCOMING" || i.status === "ONGOING").length;
  const tournamentCount = items.filter((i) => i.type === "TOURNAMENT").length;
  const eventCount = items.filter((i) => i.type === "EVENT").length;

  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-28 bg-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.08),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.04),transparent_50%)]" />
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-[#c9a84c]/[0.04] blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-200/[0.08] blur-[150px] pointer-events-none" />

        {/* Floating decorative elements */}
        <div className="absolute top-28 right-[10%] w-20 h-20 rounded-2xl bg-[#c9a84c]/5 border border-[#c9a84c]/10 rotate-12 hidden lg:flex items-center justify-center text-4xl opacity-60">
          🏆
        </div>
        <div className="absolute bottom-16 left-[8%] w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 -rotate-6 hidden lg:flex items-center justify-center text-3xl opacity-40">
          🎪
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-6">
              Compete & Connect
            </span>
          </AnimatedSection>

          <TextReveal
            text="Tournaments & Events"
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight"
          />

          <AnimatedSection delay={0.2}>
            <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
              From academy-exclusive competitions to special chess events — test your skills,
              earn recognition, and be part of the PiChess community.
            </p>
          </AnimatedSection>

          {/* Stats strip */}
          <AnimatedSection delay={0.35}>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
              {[
                { value: items.length, label: "Total", icon: "📊" },
                { value: upcomingCount, label: "Upcoming", icon: "🔥" },
                { value: tournamentCount, label: "Tournaments", icon: "🏆" },
                { value: eventCount, label: "Events", icon: "🎪" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center text-base">
                    {stat.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-gray-900 font-black text-lg leading-none">{stat.value}</p>
                    <p className="text-gray-400 text-[11px] uppercase tracking-wider font-semibold">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MAIN CONTENT — Cards
      ═══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 px-4 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.02),transparent_50%)]" />

        <div className="max-w-6xl mx-auto relative">
          <TournamentEventCards items={items} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-gray-900 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(201,168,76,0.08),transparent_50%)]" />
        <div className="max-w-2xl mx-auto text-center relative">
          <AnimatedSection>
            <div className="relative rounded-3xl border border-gray-700 bg-gray-800/50 p-12 sm:p-16 overflow-hidden">
              <div className="absolute inset-0 chess-bg opacity-[0.03] pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-gradient-to-b from-[#c9a84c]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="text-5xl mb-4">🏆</div>
                <TextReveal
                  text="Ready to Compete?"
                  className="text-3xl sm:text-4xl font-black text-white tracking-tight"
                />
                <AnimatedSection delay={0.2}>
                  <p className="text-gray-400 mt-4 mb-8 max-w-md mx-auto">
                    Enroll in the academy to get access to exclusive tournaments, events,
                    and the chance to represent PiChess nationally and internationally.
                  </p>
                </AnimatedSection>
                <MagneticButton>
                  <Link
                    href="/academy/enquire"
                    className="group relative inline-flex items-center gap-2 px-10 py-5 rounded-full text-base font-black transition-all overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[#c9a84c] via-[#d4b15a] to-[#dbb95d] group-hover:from-[#dbb95d] group-hover:to-[#c9a84c] transition-all" />
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.25),transparent_70%)]" />
                    <span className="relative z-10 text-white">Enquire Now</span>
                    <span className="relative z-10 text-white/60 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
