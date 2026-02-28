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
      include: { photos: true },
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
      <section className="relative pt-32 pb-28 bg-[#060a14] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.08),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.04),transparent_50%)]" />
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-amber-500/[0.03] blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/[0.02] blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 chess-bg opacity-[0.02] pointer-events-none" />

        {/* Floating decorative elements */}
        <div className="absolute top-28 right-[10%] w-20 h-20 rounded-2xl bg-amber-500/5 border border-amber-500/10 rotate-12 hidden lg:flex items-center justify-center text-4xl opacity-60">
          🏆
        </div>
        <div className="absolute bottom-16 left-[8%] w-16 h-16 rounded-2xl bg-blue-500/5 border border-blue-500/10 -rotate-6 hidden lg:flex items-center justify-center text-3xl opacity-40">
          🎪
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-6">
              Compete & Connect
            </span>
          </AnimatedSection>

          <TextReveal
            text="Tournaments & Events"
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight"
          />

          <AnimatedSection delay={0.2}>
            <p className="text-white/40 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
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
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-base">
                    {stat.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-black text-lg leading-none">{stat.value}</p>
                    <p className="text-white/25 text-[11px] uppercase tracking-wider font-semibold">{stat.label}</p>
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
      <section className="py-20 bg-[#0a0e1a] px-4 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.02),transparent_50%)]" />

        <div className="max-w-6xl mx-auto relative">
          <TournamentEventCards items={items} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-[#060a14] relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.04),transparent_50%)]" />
        <div className="max-w-2xl mx-auto text-center relative">
          <AnimatedSection>
            <div className="relative rounded-3xl border border-amber-500/15 bg-[#0f1628] p-12 sm:p-16 overflow-hidden">
              <div className="absolute inset-0 chess-bg opacity-[0.02] pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-gradient-to-b from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="text-5xl mb-4">🏆</div>
                <TextReveal
                  text="Ready to Compete?"
                  className="text-3xl sm:text-4xl font-black text-white tracking-tight"
                />
                <AnimatedSection delay={0.2}>
                  <p className="text-white/35 mt-4 mb-8 max-w-md mx-auto">
                    Enroll in the academy to get access to exclusive tournaments, events,
                    and the chance to represent PiChess nationally and internationally.
                  </p>
                </AnimatedSection>
                <MagneticButton>
                  <Link
                    href="/academy/enquire"
                    className="group relative inline-flex items-center gap-2 px-10 py-5 rounded-full text-base font-black transition-all overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 group-hover:from-amber-300 group-hover:to-orange-400 transition-all" />
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.25),transparent_70%)]" />
                    <span className="relative z-10 text-black">Enquire Now</span>
                    <span className="relative z-10 text-black/60 group-hover:translate-x-1 transition-transform">→</span>
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
