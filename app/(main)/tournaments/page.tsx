import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import MagneticButton from "@/components/shared/MagneticButton";
import TournamentEventCards, { type TournamentItem } from "@/components/academy/TournamentEventCards";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { getEffectiveTournamentStatus } from "@/lib/tournament-status";
import { ArrowRight, BadgeCheck, Handshake, Megaphone, Trophy, Users } from "lucide-react";

export const metadata = {
  title: "Tournaments & Events — PiChess",
  description:
    "Chess tournaments, events, and competitive experiences for players at every level across Ghana.",
};

export const dynamic = "force-dynamic";

const sponsorshipBenefits = [
  {
    title: "Brand Visibility",
    desc: "Logo placement across flyers, recaps, boards, and match-day media.",
    icon: Megaphone,
  },
  {
    title: "Community Impact",
    desc: "Support junior entries, prizes, coaching access, and stronger events.",
    icon: Users,
  },
  {
    title: "Premium Moments",
    desc: "Connect your brand to trophies, awards, photos, and live experiences.",
    icon: Trophy,
  },
];

const sponsorSlots = ["Venue Partner", "Prize Sponsor", "Youth Champion"];

 
async function getData(): Promise<TournamentItem[]> {
  try {
    const rows = await (prisma as any).tournament.findMany({
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
      status: getEffectiveTournamentStatus({ status: t.status, date: t.date, endDate: t.endDate }),
      featured: t.featured,
      maxSpots: t.maxSpots ?? null,
      registeredCount: t.registrations?.length ?? 0,
      photos: t.photos?.map((p: any) => ({ id: p.id, url: p.url, caption: p.caption })) ?? [],
    }));
  } catch {
    return [];
  }
}

export default async function TournamentsPage() {
  const items = await getData();

  const upcomingCount = items.filter((i) => i.status === "UPCOMING" || i.status === "ONGOING").length;
  const completedCount = items.filter((i) => i.status === "COMPLETED").length;
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
              From exclusive competitions to special chess events — test your skills,
              earn recognition, and be part of the PiChess community.
            </p>
          </AnimatedSection>

          {/* Stats strip */}
          <AnimatedSection delay={0.35}>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
              {[
                { value: items.length, label: "Total", icon: "📊" },
                { value: upcomingCount, label: "Upcoming", icon: "🔥" },
                { value: completedCount, label: "Completed", icon: "✓" },
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
          SPONSOR CTA
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0d1421] px-4 py-24 sm:py-28">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(255,255,255,.14) 25%, transparent 25%, transparent 75%, rgba(255,255,255,.14) 75%), linear-gradient(45deg, rgba(255,255,255,.14) 25%, transparent 25%, transparent 75%, rgba(255,255,255,.14) 75%)",
            backgroundPosition: "0 0, 22px 22px",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/35 to-transparent" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/25 bg-[#c9a84c]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#d8bb62]">
              <Handshake className="h-4 w-4" />
              Partnership Opportunities
            </div>

            <TextReveal
              as="h2"
              text="Put Your Brand at the Center of Ghana Chess"
              className="mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
            />

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Sponsor PiChess tournaments and help create sharper events, stronger prizes,
              and memorable competition days for players, schools, families, and fans.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {sponsorshipBenefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9a84c]/15 text-[#d8bb62]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-black text-white">{benefit.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">{benefit.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <MagneticButton>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d8b84f] px-8 py-4 text-sm font-black text-gray-950 shadow-xl shadow-black/20 transition-all hover:bg-[#e5c866] hover:scale-[1.02] active:scale-[0.98]"
                >
                  Sponsor a Tournament
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MagneticButton>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-4 text-sm font-bold text-white transition-all hover:border-white/30 hover:bg-white/5"
              >
                Request a proposal
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15} direction="right">
            <div className="relative mx-auto w-full max-w-lg">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 bg-[#111b2b] shadow-2xl shadow-black/30">
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-80">
                  {Array.from({ length: 48 }).map((_, index) => (
                    <div
                      key={index}
                      className={(index + Math.floor(index / 8)) % 2 === 0 ? "bg-white/[0.035]" : "bg-[#c9a84c]/[0.035]"}
                    />
                  ))}
                </div>

                <div className="absolute left-6 right-6 top-6 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#d8bb62]">PiChess Partner</p>
                    <p className="mt-1 text-sm font-semibold text-white/80">Tournament sponsorship deck</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#c9a84c]/25 bg-[#c9a84c]/15 text-[#d8bb62]">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                </div>

                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-[#0d1421]/85 p-6 backdrop-blur-sm">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-4xl font-black text-white">2026</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Sponsor Season</p>
                    </div>
                    <Trophy className="h-12 w-12 text-[#d8bb62]" strokeWidth={1.7} />
                  </div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-2/3 rounded-full bg-[#d8b84f]" />
                  </div>
                  <div className="mt-5 grid gap-2">
                    {sponsorSlots.map((slot) => (
                      <div key={slot} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                        <span className="text-xs font-semibold text-slate-200">{slot}</span>
                        <span className="h-2 w-2 rounded-full bg-[#d8b84f]" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-xs font-semibold text-slate-300">Brand reach</span>
                  <span className="text-sm font-black text-white">Events / Media / Community</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
