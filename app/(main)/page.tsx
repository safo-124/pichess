import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import HeroSection from "@/components/main/HeroSection";
import HomeShopSection from "@/components/main/HomeShopSection";
import prisma from "@/lib/prisma";
import { getEffectiveTournamentStatus } from "@/lib/tournament-status";
import { buildLessonWhatsAppUrl, buildTournamentWhatsAppUrl } from "@/lib/whatsapp";

/* ── data fetchers ─────────────────────────────────────────── */
async function getTournaments() {
  try {
    const featuredRows = await prisma.tournament.findMany({
      where: { featured: true, status: { in: ["UPCOMING", "ONGOING"] } },
      include: {
        photos: { take: 1 },
        registrations: { where: { status: "CONFIRMED" }, select: { id: true } },
      },
      orderBy: { date: "asc" },
      take: 4,
    });
    const activeFeatured = featuredRows.filter(
      (t) => getEffectiveTournamentStatus({ status: t.status, date: t.date, endDate: t.endDate }) !== "COMPLETED"
    );
    if (activeFeatured.length > 0) return activeFeatured;

    const allRows = await prisma.tournament.findMany({
      where: { status: { in: ["UPCOMING", "ONGOING"] } },
      include: {
        photos: { take: 1 },
        registrations: { where: { status: "CONFIRMED" }, select: { id: true } },
      },
      orderBy: { date: "asc" },
      take: 4,
    });
    return allRows.filter(
      (t) => getEffectiveTournamentStatus({ status: t.status, date: t.date, endDate: t.endDate }) !== "COMPLETED"
    );
  } catch {
    return [];
  }
}

async function getPartners() {
  try {
    return await prisma.partner.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

async function getTestimonials() {
  try {
    return await prisma.academy_Testimonial.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

async function getNGOStats() {
  try {
    const [apps, volunteers, donations] = await Promise.all([
      prisma.nGO_Application.count(),
      prisma.nGO_Volunteer.count(),
      prisma.nGO_Donation.aggregate({ _sum: { amount: true }, _count: true }),
    ]);
    return {
      apps,
      volunteers,
      totalDonated: donations._sum?.amount ?? 0,
      donorCount: donations._count ?? 0,
    };
  } catch {
    return { apps: 0, volunteers: 0, totalDonated: 0, donorCount: 0 };
  }
}

async function getHeroData() {
  try {
    const row = await (prisma as any).siteContent.findUnique({ where: { key: "home_hero" } });
    return row?.value ? JSON.parse(row.value) : null;
  } catch {
    return null;
  }
}

const audiencePrograms = [
  {
    tab: "kids",
    badge: "Most Popular",
    title: "Kids & Teens",
    subtitle: "Ages 5–17 · Beginner to competitive",
    desc: "Fun, structured weekly lessons that build patience, focus, and confidence — plus adaptive classes and youth tournament prep.",
    image: "/uploads/1773531163801-photo_2026-03-14_23-30-27.jpg",
    programName: "Kids & Teens Chess Classes",
  },
  {
    tab: "adults",
    badge: "Flexible Schedule",
    title: "Adults & 1-on-1 Coaching",
    subtitle: "Complete beginners to serious players",
    desc: "Learn from scratch in a relaxed adult class or train 1-on-1 with a dedicated coach around your own schedule.",
    image: "/uploads/1772296915445-k.jpg",
    programName: "Adult & 1-on-1 Chess Coaching",
  },
  {
    tab: "schools",
    badge: "Organizations",
    title: "Schools & Companies",
    subtitle: "After-school clubs & team workshops",
    desc: "We supply trained coaches, chess boards, and organized inter-school or workplace competitions across Ghana.",
    image: "/uploads/1775035492024-Google_festival.jpg",
    programName: "School or Company Chess Program",
  },
];

/* ── page ──────────────────────────────────────────────────── */
export default async function HomePage() {
  const whatsApp = (process.env.ADMIN_WHATSAPP || "233554534646").replace(/\D/g, "");
  const [tournaments, partners, testimonials, ngoStats, heroData] = await Promise.all([
    getTournaments(),
    getPartners(),
    getTestimonials(),
    getNGOStats(),
    getHeroData(),
  ]);

  const generalLessonWhatsApp = buildLessonWhatsAppUrl();

  return (
    <div className="relative">
      {/* 1. HERO — Clear promise for parents, adult learners & schools */}
      <HeroSection heroData={heroData} />

      {/* 2. TRUST TICKER */}
      <section className="py-4 bg-gray-50 border-y border-gray-200 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex items-center">
              {[
                "♟ 500+ Students Trained",
                "📍 In-Person in Accra & Live Online",
                "🧒 Kids (Ages 5–17) & Adult Classes",
                "🏫 School Clubs & Workplace Workshops",
                "🏆 Rated & Open Tournaments",
                "🛒 Official Boards, Clocks & Gear",
              ].map((item, i) => (
                <span key={`${setIdx}-${i}`} className="flex items-center gap-3 mx-8 text-gray-700 text-sm font-bold">
                  {item}
                  <span className="w-1 h-1 rounded-full bg-[#c9a84c]/60" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 3. ACADEMY — 3 Clear Tracks (Kids & Teens, Adults & 1-on-1, Schools & Companies) */}
      <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12">
            <AnimatedSection>
              <span className="text-xs font-bold text-[#a77d1b] uppercase tracking-[0.25em]">Pi Chess Academy</span>
              <h2 className="text-3xl sm:text-5xl font-black text-gray-950 mt-2 tracking-tight">
                <TextReveal text="Programs Built for" />{" "}
                <span className="text-[#c9a84c]">Every Learner.</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <p className="text-gray-600 text-base sm:text-lg max-w-md leading-relaxed">
                Pick the group that fits best, then message us on WhatsApp for current class times and fees.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {audiencePrograms.map((card, i) => (
              <AnimatedSection key={card.tab} delay={i * 0.1}>
                <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-[#c9a84c]/50 hover:shadow-xl">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                    <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-gray-900 shadow-sm">
                      {card.badge}
                    </span>
                    <div className="absolute bottom-4 left-5 right-5">
                      <h3 className="text-2xl font-black text-white">{card.title}</h3>
                      <p className="text-white/80 text-xs font-semibold mt-0.5">{card.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-gray-600 text-sm leading-relaxed flex-1">{card.desc}</p>
                    <div className="mt-6 flex flex-col gap-2.5">
                      <a
                        href={buildLessonWhatsAppUrl({ program: card.programName })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 hover:bg-[#c9a84c] text-white hover:text-gray-950 px-4 py-3 text-xs font-bold transition-all"
                      >
                        Ask Fees &amp; Times on WhatsApp →
                      </a>
                      <Link
                        href={`/academy/lessons?tab=${card.tab}`}
                        className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
                      >
                        See Included Classes
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.2} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={generalLessonWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-gray-950 font-black text-sm transition-all shadow-md"
            >
              Chat on WhatsApp for Fees &amp; Class Times →
            </a>
            <Link
              href="/academy/lessons"
              className="w-full sm:w-auto text-center px-8 py-4 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-50 font-bold text-sm transition-all"
            >
              View All 9 Academy Programs
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* 4. TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-20 sm:py-24 bg-gray-50 relative">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-12">
              <span className="text-xs font-bold text-[#a77d1b] uppercase tracking-[0.25em]">Trusted by Families</span>
              <h2 className="text-3xl sm:text-5xl font-black text-gray-950 mt-2 tracking-tight">
                What Parents &amp; Students Say
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <AnimatedSection key={t.id} delay={i * 0.1}>
                  <div className="group rounded-3xl border border-gray-200 bg-white p-7 sm:p-8 h-full flex flex-col hover:border-[#c9a84c]/40 hover:shadow-lg transition-all duration-300">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, si) => (
                        <span key={si} className="text-[#c9a84c] text-sm">★</span>
                      ))}
                    </div>
                    <p className="text-gray-700 text-[15px] leading-relaxed flex-1">
                      &ldquo;{t.content}&rdquo;
                    </p>
                    <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#c9a84c]/15 flex items-center justify-center text-[#a77d1b] text-sm font-bold">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-gray-900 text-sm font-bold">{t.name}</p>
                        {t.program && <p className="text-gray-500 text-xs">{t.program}</p>}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. TOURNAMENTS — 1-Click WhatsApp Sign-Up */}
      {tournaments.length > 0 && (
        <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold text-[#a77d1b] uppercase tracking-[0.25em]">Compete &amp; Grow</span>
                <h2 className="text-3xl sm:text-5xl font-black text-gray-950 mt-2 tracking-tight">
                  Upcoming Tournaments &amp; Events
                </h2>
                <p className="text-gray-600 mt-2 text-base max-w-lg">
                  Reserve your seat in one click on WhatsApp — open to juniors and adults.
                </p>
              </div>
              <Link href="/tournaments" className="text-[#a77d1b] text-sm font-bold hover:underline hidden sm:block whitespace-nowrap">
                See all events →
              </Link>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {tournaments.map((t, i) => {
                const eventDate = new Date(t.date);
                const now = new Date();
                const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const isLive = t.status === "ONGOING";
                const regCount = (t as any).registrations?.length ?? 0;
                const spotsLeft = t.maxSpots ? Math.max(0, t.maxSpots - regCount) : null;
                const dateLabel = eventDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                const regWhatsAppHref = buildTournamentWhatsAppUrl({
                  title: t.title,
                  dateLabel,
                  isWaitlist: spotsLeft === 0,
                });

                return (
                  <AnimatedSection key={t.id} delay={i * 0.08}>
                    <div className="group rounded-3xl border border-gray-200 bg-white overflow-hidden hover:border-[#c9a84c]/50 transition-all duration-300 h-full flex flex-col hover:shadow-lg">
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        {t.flyer ? (
                          <img
                            src={t.flyer}
                            alt={t.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/15 via-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-6xl opacity-25">{t.type === "EVENT" ? "🎪" : "♔"}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              isLive ? "bg-emerald-500 text-white" : "bg-white/90 text-gray-800"
                            }`}
                          >
                            {isLive ? "Live Now" : "Upcoming"}
                          </span>
                        </div>
                        {!isLive && daysUntil > 0 && daysUntil <= 60 && (
                          <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-gray-800">
                            {daysUntil === 1 ? "Tomorrow" : `${daysUntil} days left`}
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-black text-gray-900 text-base mb-2.5 group-hover:text-[#a77d1b] transition-colors leading-tight line-clamp-2">
                          {t.title}
                        </h3>

                        <div className="space-y-1.5 mb-5 flex-1 text-xs text-gray-600">
                          <p className="flex items-center gap-1.5">
                            <span>📅</span>
                            {dateLabel}
                            {t.endDate && (
                              <span className="text-gray-400">
                                {" "}– {new Date(t.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                              </span>
                            )}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <span>📍</span>
                            {t.location}
                          </p>
                          {t.venue && (
                            <p className="flex items-center gap-1.5 text-gray-500">
                              <span>🏛</span>
                              {t.venue}
                            </p>
                          )}
                        </div>

                        {t.maxSpots && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] text-gray-500 font-semibold">{regCount} / {t.maxSpots} spots</span>
                              <span className={`text-[11px] font-bold ${spotsLeft === 0 ? "text-red-600" : "text-emerald-700"}`}>
                                {spotsLeft === 0 ? "Full" : `${spotsLeft} spots left`}
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  regCount / t.maxSpots >= 0.9 ? "bg-red-500" : "bg-emerald-500"
                                }`}
                                style={{ width: `${Math.min(100, (regCount / t.maxSpots) * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <a
                          href={regWhatsAppHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-950 hover:bg-[#c9a84c] text-white hover:text-gray-950 text-xs font-bold transition-all w-full"
                        >
                          {spotsLeft === 0 ? "Join Waitlist on WhatsApp →" : "Register on WhatsApp →"}
                        </a>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/tournaments" className="text-[#a77d1b] text-sm font-bold hover:underline">
                See all events →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6. SHOP */}
      <HomeShopSection whatsApp={whatsApp} />

      {/* 7. FOUNDATION — Community Impact */}
      <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection direction="left">
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-xl ring-1 ring-gray-200">
                  <Image
                    src="/uploads/1772297013069-i.jpg"
                    alt="Young students learning chess through Pi Chess Foundation"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2e7d5b]/25 to-transparent" />
                </div>
                <div className="absolute -bottom-5 -right-3 sm:-right-5 rounded-2xl bg-[#2e7d5b] text-white p-5 shadow-xl">
                  <p className="text-3xl font-black leading-none">{Math.max(200, ngoStats.apps + ngoStats.volunteers)}+</p>
                  <p className="text-white/85 text-xs font-semibold mt-1 uppercase tracking-wider">Youth Reached</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <span className="text-xs font-bold text-[#2e7d5b] uppercase tracking-[0.25em]">Pi Chess Foundation</span>
              <h2 className="text-3xl sm:text-5xl font-black text-gray-950 mt-2 tracking-tight leading-[1.08]">
                Bringing Chess to <span className="text-[#2e7d5b]">Every Child in Ghana.</span>
              </h2>
              <p className="text-gray-600 mt-5 text-base sm:text-lg leading-relaxed max-w-lg">
                Alongside our Academy, our charity arm provides free boards, school chess clubs, and coaching scholarships for underserved communities across Ghana.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-8">
                <Link
                  href="/ngo/donate"
                  className="px-7 py-3.5 rounded-full bg-[#2e7d5b] hover:bg-[#236348] text-white font-bold text-sm transition-all text-center shadow-sm"
                >
                  Support / Donate ❤️
                </Link>
                <Link
                  href="/ngo"
                  className="px-7 py-3.5 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-50 font-bold text-sm transition-all text-center"
                >
                  Explore Foundation
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 8. PARTNERS */}
      {partners.length > 0 && (
        <section className="py-12 bg-gray-50 border-y border-gray-200 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.25em]">Organizations We Work With</p>
          </div>
          <div className="relative">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...partners, ...partners].map((p, i) => (
                <div key={`${p.id}-${i}`} className="flex-shrink-0 mx-8 sm:mx-12 flex items-center gap-3">
                  {p.logo ? (
                    <img src={p.logo} alt={p.name} className="h-12 sm:h-16 object-contain" />
                  ) : (
                    <span className="text-gray-700 text-base font-bold">{p.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. FINAL WHATSAPP CTA */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight mb-5">
              Ready to Book Your First <span className="text-[#c9a84c]">Chess Lesson?</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-9 max-w-xl mx-auto leading-relaxed">
              Send us a quick WhatsApp message and our team will recommend the right class, share fees, and get you or your child started this week.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={generalLessonWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-gray-950 font-black text-base transition-all shadow-md"
              >
                Chat on WhatsApp (055 453 4646) →
              </a>
              <Link
                href="/shop"
                className="w-full sm:w-auto px-9 py-4 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-50 font-bold text-base transition-all"
              >
                Visit the Chess Shop
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
