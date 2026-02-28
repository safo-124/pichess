import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/shared/AnimatedSection";
import StatsCounter from "@/components/shared/StatsCounter";
import ParallaxSection from "@/components/shared/ParallaxSection";
import TextReveal from "@/components/shared/TextReveal";
import MagneticButton from "@/components/shared/MagneticButton";
import prisma from "@/lib/prisma";

/* ── data fetchers ─────────────────────────────────────────── */
async function getTournaments() {
  try {
    return await prisma.tournament.findMany({
      where: { status: "UPCOMING", featured: true },
      orderBy: { date: "asc" },
      take: 3,
    });
  } catch { return []; }
}

async function getPartners() {
  try { return await prisma.partner.findMany({ orderBy: { order: "asc" } }); }
  catch { return []; }
}

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { featured: true, inStock: true },
      include: { category: { select: { name: true } } },
      take: 4,
      orderBy: { createdAt: "desc" },
    });
  } catch { return []; }
}

async function getTestimonials() {
  try {
    return await prisma.academy_Testimonial.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    });
  } catch { return []; }
}

async function getNGOStats() {
  try {
    const [apps, volunteers, donations] = await Promise.all([
      prisma.nGO_Application.count(),
      prisma.nGO_Volunteer.count(),
      prisma.nGO_Donation.aggregate({ _sum: { amount: true }, _count: true }),
    ]);
    return { apps, volunteers, totalDonated: donations._sum?.amount ?? 0, donorCount: donations._count ?? 0 };
  } catch { return { apps: 0, volunteers: 0, totalDonated: 0, donorCount: 0 }; }
}

/* ── page ──────────────────────────────────────────────────── */
export default async function HomePage() {
  const [tournaments, partners, products, testimonials, ngoStats] = await Promise.all([
    getTournaments(),
    getPartners(),
    getFeaturedProducts(),
    getTestimonials(),
    getNGOStats(),
  ]);

  return (
    <div className="relative">

      {/* ═══════════════════════════════════════════════════════
          HERO — Cinematic split with image
      ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-black">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1920&q=80"
          alt="Chess pieces on a board"
          fill
          priority
          className="object-cover opacity-30"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        {/* Decorative orbs */}
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-[#c9a84c]/8 blur-[200px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#2e7d5b]/6 blur-[180px] pointer-events-none" />
        {/* Subtle grid */}
        <div className="absolute inset-0 chess-bg opacity-[0.02] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-24 sm:pt-36 sm:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — Text */}
            <div>
              <AnimatedSection delay={0}>
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#c9a84c]/25 bg-[#c9a84c]/5 backdrop-blur-md mb-8 animate-glow-pulse">
                  <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse-dot" />
                  <span className="text-[#c9a84c] text-[11px] font-bold uppercase tracking-[0.25em]">
                    Ghana&apos;s Premier Chess Platform
                  </span>
                </div>
              </AnimatedSection>

              <h1 className="text-[2.75rem] sm:text-6xl lg:text-7xl font-black tracking-[-0.03em] text-white leading-[1.05] mb-6">
                <TextReveal text="Where Every" delay={0.1} />
                <br />
                <TextReveal text="Move" delay={0.25} />{" "}
                <span className="gradient-text-gold">
                  <TextReveal text="Matters." delay={0.35} />
                </span>
              </h1>

              <AnimatedSection delay={0.2}>
                <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-lg mb-10">
                  A world-class chess academy, a life-changing foundation, and a thriving
                  community — all united by the world&apos;s greatest game.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <MagneticButton>
                    <Link
                      href="/academy"
                      className="group relative inline-block px-8 py-4 rounded-full bg-[#c9a84c] text-black font-bold text-sm transition-all hover:shadow-[0_0_40px_rgba(201,168,76,0.4)] hover:scale-[1.03] active:scale-[0.97] text-center animated-border"
                    >
                      <span className="relative z-10 flex items-center gap-2">Join the Academy <span className="animate-wiggle inline-block">→</span></span>
                    </Link>
                  </MagneticButton>
                  <MagneticButton>
                    <Link
                      href="/ngo"
                      className="inline-block px-8 py-4 rounded-full border border-white/15 text-white font-semibold text-sm hover:bg-white/5 hover:border-white/25 transition-all backdrop-blur-sm text-center"
                    >
                      Support Our Mission
                    </Link>
                  </MagneticButton>
                </div>
              </AnimatedSection>

              {/* Mini stats row */}
              <AnimatedSection delay={0.45}>
                <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/8">
                  {[
                    { val: "500+", label: "Students" },
                    { val: "50+", label: "Events" },
                    { val: "15+", label: "Coaches" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-2xl sm:text-3xl font-black text-white">{s.val}</p>
                      <p className="text-white/30 text-xs font-medium uppercase tracking-wider mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* Right — Feature image composition with parallax */}
            <AnimatedSection delay={0.2} direction="right" className="hidden lg:block">
              <div className="relative">
                {/* Main image */}
                <ParallaxSection speed={0.15} direction="down">
                  <div className="relative rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl shadow-black/50">
                    <Image
                      src="https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=800&q=80"
                      alt="Chess training session"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                </ParallaxSection>
                {/* Floating badge — animated border */}
                <ParallaxSection speed={0.3} direction="up">
                  <div className="absolute -bottom-4 -left-6 rounded-2xl bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-5 shadow-2xl animate-breathe">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#c9a84c]/15 flex items-center justify-center">
                        <span className="text-[#c9a84c] text-xl">♔</span>
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">Next Tournament</p>
                        <p className="text-[#c9a84c] text-xs font-medium">Registering now</p>
                      </div>
                    </div>
                  </div>
                </ParallaxSection>
                {/* Floating green badge */}
                <ParallaxSection speed={0.4} direction="up">
                  <div className="absolute -top-3 -right-3 rounded-xl bg-[#2e7d5b] text-white p-4 shadow-xl shadow-[#2e7d5b]/20 animate-breathe" style={{ animationDelay: "1s" }}>
                    <p className="text-2xl font-black leading-none">200+</p>
                    <p className="text-white/80 text-[10px] font-semibold mt-1 uppercase tracking-wider">Lives Changed</p>
                  </div>
                </ParallaxSection>
                {/* Decorative ring */}
                <div className="absolute -z-10 inset-0 translate-x-4 translate-y-4 rounded-3xl border border-[#c9a84c]/15" />
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/20 text-[10px] font-semibold uppercase tracking-widest">Scroll</span>
            <div className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center pt-1.5">
              <div className="w-1 h-1.5 rounded-full bg-white/40 animate-bounce" />
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          TICKER — Scrolling achievements
      ═══════════════════════════════════════════════════════ */}
      <section className="py-4 bg-[#c9a84c] overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex items-center">
              {[
                "🏆 National Champions 2024",
                "♟ 500+ Students Trained",
                "🌍 Community Impact Award",
                "📚 FIDE Affiliated Academy",
                "❤️ 200+ Lives Transformed",
                "🎯 Expert-Led Training",
              ].map((item, i) => (
                <span key={`${setIdx}-${i}`} className="flex items-center gap-3 mx-8 text-black/80 text-sm font-bold">
                  {item}
                  <span className="w-1.5 h-1.5 rounded-full bg-black/30" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          ABOUT — Elegant intro
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-zinc-950 relative noise-bg">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <p className="text-white/20 text-xs font-bold uppercase tracking-[0.3em] mb-6">About PiChess</p>
          </AnimatedSection>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-8">
            <TextReveal text="Building Africa's Strongest" delay={0.1} />
            <br className="hidden sm:block" />
            <TextReveal text="Chess Ecosystem" delay={0.3} />
          </h2>
          <AnimatedSection delay={0.2}>
            <p className="text-lg sm:text-xl text-white/40 leading-relaxed max-w-3xl mx-auto">
              Founded in Accra, PiChess brings together{" "}
              <span className="text-[#c9a84c] font-semibold">elite training</span>,{" "}
              <span className="text-[#2e7d5b] font-semibold">community outreach</span>, and{" "}
              <span className="text-amber-400 font-semibold">premium chess gear</span>{" "}
              under one vision — chess as a tool for discipline, strategy, and excellence.
            </p>
          </AnimatedSection>
          {/* Decorative line */}
          <AnimatedSection delay={0.3}>
            <div className="mx-auto mt-10 w-16 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent" />
          </AnimatedSection>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          ACADEMY — Premium card showcase
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full bg-[#c9a84c]/4 blur-[200px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-16">
            <AnimatedSection>
              <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-[0.25em]">Academy</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-3 tracking-tight">
                <TextReveal text="Train Like a" /><br />
                <span className="gradient-text-gold"><TextReveal text="Grandmaster." delay={0.2} /></span>
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <p className="text-white/40 text-base sm:text-lg max-w-md leading-relaxed">
                Structured programs for beginners to advanced players, guided by Ghana&apos;s finest coaches.
              </p>
            </AnimatedSection>
          </div>

          {/* Program cards — 3 column featured layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Card 1 — Flagship */}
            <AnimatedSection delay={0} className="md:row-span-2">
              <div className="group relative h-full min-h-[400px] md:min-h-[520px] rounded-3xl overflow-hidden card-shine">
                <Image
                  src="https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=800&q=80"
                  alt="Chess training session"
                  fill
                  className="object-cover img-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] text-[10px] font-bold uppercase tracking-wider mb-3 backdrop-blur-sm border border-[#c9a84c]/20">
                    Flagship Program
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">Elite Chess Academy</h3>
                  <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                    From opening theory to endgame mastery — our coaches prepare students
                    for national and international competition.
                  </p>
                  <Link
                    href="/academy"
                    className="inline-flex items-center gap-2 mt-4 text-[#c9a84c] text-sm font-bold group-hover:gap-3 transition-all"
                  >
                    Learn more <span>→</span>
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            {/* Card 2 — Junior */}
            <AnimatedSection delay={0.12}>
              <div className="group relative h-60 md:h-full min-h-[240px] rounded-3xl overflow-hidden card-shine">
                <Image
                  src="https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=800&q=80"
                  alt="Junior chess program"
                  fill
                  className="object-cover img-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#c9a84c]/90 text-black text-[10px] font-bold uppercase tracking-wider">
                    Popular
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <h4 className="text-lg font-black text-white mb-1">Junior Program</h4>
                  <p className="text-white/50 text-sm">Ages 6–14 · Fundamentals &amp; tactics</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Card 3 — Tournament Prep */}
            <AnimatedSection delay={0.24}>
              <div className="group relative h-60 md:h-full min-h-[240px] rounded-3xl overflow-hidden card-shine">
                <Image
                  src="https://images.unsplash.com/photo-1586165368502-1bad9a092098?w=800&q=80"
                  alt="Tournament preparation"
                  fill
                  className="object-cover img-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <h4 className="text-lg font-black text-white mb-1">Tournament Prep</h4>
                  <p className="text-white/50 text-sm">Competition strategy &amp; mental game</p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Features row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { icon: "🎯", title: "Personalized Plans", desc: "Tailored to your skill level" },
              { icon: "🏆", title: "Tournaments", desc: "Regular competitive events" },
              { icon: "📊", title: "Progress Tracking", desc: "Watch your rating climb" },
              { icon: "👥", title: "Small Groups", desc: "Maximum attention per student" },
            ].map((f, i) => (
              <AnimatedSection key={f.title} delay={0.08 * i}>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5 sm:p-6 hover:border-[#c9a84c]/25 hover:bg-[#c9a84c]/[0.03] transition-all duration-500 h-full spotlight">
                  <span className="text-2xl block mb-3">{f.icon}</span>
                  <h4 className="font-bold text-white text-sm mb-1">{f.title}</h4>
                  <p className="text-white/35 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* CTA row */}
          <AnimatedSection delay={0.2} className="mt-12 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/academy"
              className="px-8 py-3.5 rounded-full bg-[#c9a84c] hover:bg-[#dbb95d] text-black font-bold text-sm transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] hover:scale-[1.03] active:scale-[0.97]"
            >
              Explore Programs →
            </Link>
            <Link
              href="/academy/enquire"
              className="px-8 py-3.5 rounded-full border border-[#c9a84c]/25 text-[#c9a84c] hover:bg-[#c9a84c]/8 font-semibold text-sm transition-all"
            >
              Enquire Now
            </Link>
          </AnimatedSection>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          STATS — Dramatic counter strip with background
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=1920&q=80"
          alt="Chess board dramatic lighting"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="absolute inset-0 chess-bg opacity-[0.03] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            <StatsCounter end={500} label="Students Trained" suffix="+" color="gold" />
            <StatsCounter end={50} label="Tournaments Hosted" suffix="+" color="white" />
            <StatsCounter end={200} label="Lives Impacted" suffix="+" color="green" />
            <StatsCounter end={15} label="Expert Coaches" color="white" />
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          TESTIMONIALS — Bold quote cards
      ═══════════════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="py-24 sm:py-32 bg-zinc-950 relative noise-bg">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-14">
              <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-[0.25em]">Testimonials</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mt-3 tracking-tight">
                What Our Students Say
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <AnimatedSection key={t.id} delay={i * 0.1}>
                  <div className="group rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7 sm:p-8 h-full flex flex-col hover:border-[#c9a84c]/20 transition-all duration-500 spotlight">
                    {/* Stars */}
                    <div className="flex gap-1 mb-5">
                      {Array.from({ length: t.rating }).map((_, si) => (
                        <span key={si} className="text-[#c9a84c] text-sm">★</span>
                      ))}
                    </div>
                    {/* Quote */}
                    <p className="text-white/60 text-[15px] leading-relaxed flex-1">
                      &ldquo;{t.content}&rdquo;
                    </p>
                    {/* Author */}
                    <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a84c]/30 to-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c] text-sm font-bold ring-2 ring-[#c9a84c]/10">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{t.name}</p>
                        {t.program && <p className="text-white/25 text-xs">{t.program}</p>}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ═══════════════════════════════════════════════════════
          FOUNDATION — Split layout with emotional imagery
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-black relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#2e7d5b]/5 blur-[200px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — Image composition */}
            <AnimatedSection direction="left">
              <div className="relative">
                {/* Main image */}
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl shadow-black/50">
                  <Image
                    src="https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=1000&q=80"
                    alt="Children learning chess"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2e7d5b]/20 to-transparent" />
                </div>
                {/* Floating stat card */}
                <div className="absolute -bottom-5 -right-4 sm:-right-6 rounded-2xl bg-gradient-to-br from-[#2e7d5b] to-[#1f5c40] text-white p-5 sm:p-6 shadow-2xl shadow-[#2e7d5b]/25">
                  <p className="text-3xl sm:text-4xl font-black leading-none">{ngoStats.apps + ngoStats.volunteers}+</p>
                  <p className="text-white/80 text-xs font-semibold mt-1.5 uppercase tracking-wider">Lives Touched</p>
                </div>
                {/* Secondary image — hidden on mobile */}
                <div className="hidden sm:block absolute -top-5 -left-5 w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden ring-4 ring-black shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?w=400&q=80"
                    alt="Chess piece closeup"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Decorative ring */}
                <div className="absolute -z-10 inset-0 -translate-x-4 translate-y-4 rounded-3xl border border-[#2e7d5b]/15" />
              </div>
            </AnimatedSection>

            {/* Right — Content */}
            <AnimatedSection direction="right">
              <span className="text-xs font-bold text-[#2e7d5b] uppercase tracking-[0.25em]">Foundation</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-3 tracking-tight leading-[1.05]">
                <TextReveal text="Chess Changes" />
                <br />
                <span className="gradient-text-green"><TextReveal text="Lives." delay={0.2} /></span>
              </h2>
              <p className="text-white/45 mt-6 text-base sm:text-lg leading-relaxed max-w-lg">
                Our foundation uses chess as a vehicle for education, discipline, and
                opportunity. We bring structured chess programs to underserved communities
                across Ghana, empowering young minds to think strategically about their futures.
              </p>

              {/* Impact metrics */}
              <div className="grid grid-cols-3 gap-4 mt-10">
                {[
                  { value: `${ngoStats.apps}+`, label: "Beneficiaries" },
                  { value: `${ngoStats.volunteers}+`, label: "Volunteers" },
                  { value: `GH₵${Math.round(ngoStats.totalDonated).toLocaleString()}`, label: "Raised" },
                ].map((m) => (
                  <div key={m.label}>
                    <p className="text-2xl sm:text-3xl font-black text-[#2e7d5b]">{m.value}</p>
                    <p className="text-white/30 text-xs font-medium mt-1 uppercase tracking-wider">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-10">
                <Link
                  href="/ngo/donate"
                  className="px-8 py-3.5 rounded-full bg-[#2e7d5b] hover:bg-[#3a9a73] text-white font-bold text-sm transition-all hover:shadow-[0_0_30px_rgba(46,125,91,0.3)] hover:scale-[1.03] active:scale-[0.97] text-center"
                >
                  Donate Now ❤️
                </Link>
                <Link
                  href="/ngo/volunteer"
                  className="px-8 py-3.5 rounded-full border border-[#2e7d5b]/25 text-[#2e7d5b] hover:bg-[#2e7d5b]/8 font-semibold text-sm transition-all text-center"
                >
                  Become a Volunteer
                </Link>
                <Link
                  href="/ngo/apply"
                  className="px-8 py-3.5 rounded-full border border-white/10 text-white/50 hover:bg-white/5 font-semibold text-sm transition-all text-center"
                >
                  Apply for Support
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          TOURNAMENTS — Upcoming events
      ═══════════════════════════════════════════════════════ */}
      {tournaments.length > 0 && (
        <section className="py-24 sm:py-32 bg-zinc-950 relative overflow-hidden noise-bg">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4">
              <div>
                <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-[0.25em]">Events</span>
                <h2 className="text-3xl sm:text-5xl font-black text-white mt-2 tracking-tight">
                  Upcoming Tournaments
                </h2>
                <p className="text-white/35 mt-2 text-base">Register early — limited spots available.</p>
              </div>
              <Link href="/academy/tournaments" className="text-[#c9a84c] text-sm font-bold hover:underline hidden sm:block whitespace-nowrap">
                See all events →
              </Link>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tournaments.map((t, i) => (
                <AnimatedSection key={t.id} delay={i * 0.12}>
                  <div className="group rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 sm:p-7 hover:border-[#c9a84c]/25 transition-all duration-500 hover-lift h-full flex flex-col spotlight">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        t.status === "UPCOMING"
                          ? "bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20"
                          : "bg-green-500/10 text-green-400 border border-green-500/20"
                      }`}>
                        {t.status}
                      </span>
                      {t.featured && (
                        <span className="text-xs text-amber-400 font-bold">★ Featured</span>
                      )}
                    </div>
                    <h3 className="font-black text-white text-lg mb-2 group-hover:text-[#c9a84c] transition-colors">{t.title}</h3>
                    <p className="text-white/30 text-sm mb-6 flex-1 leading-relaxed">
                      📅 {new Date(t.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      <br />📍 {t.location}
                    </p>
                    {t.registrationLink ? (
                      <a
                        href={t.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c9a84c]/8 hover:bg-[#c9a84c] hover:text-black text-[#c9a84c] text-xs font-bold transition-all w-fit border border-[#c9a84c]/15 hover:border-[#c9a84c]"
                      >
                        Register Now →
                      </a>
                    ) : (
                      <span className="text-white/15 text-xs font-medium">Registration opening soon</span>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/academy/tournaments" className="text-[#c9a84c] text-sm font-bold hover:underline">
                See all events →
              </Link>
            </div>
          </div>
        </section>
      )}


      {/* ═══════════════════════════════════════════════════════
          SHOP — Product showcase
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-500/4 blur-[180px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.25em]">PiChess Store</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mt-2 tracking-tight">
                Gear Up for <span className="text-amber-400">Victory.</span>
              </h2>
              <p className="text-white/35 mt-3 max-w-lg text-base sm:text-lg">
                Premium chess sets, clocks, books, and apparel — everything you need.
              </p>
            </div>
            <Link href="/shop" className="text-amber-400 text-sm font-bold hover:underline whitespace-nowrap">
              View all products →
            </Link>
          </AnimatedSection>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p, i) => (
                <AnimatedSection key={p.id} delay={i * 0.08}>
                  <div className="group rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-amber-500/25 transition-all duration-500 hover-lift h-full flex flex-col card-shine">
                    {/* Image */}
                    <div className="aspect-square bg-zinc-900/60 relative overflow-hidden">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover img-zoom" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
                          <span className="text-6xl opacity-15 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">♟</span>
                        </div>
                      )}
                      {p.featured && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-400/90 text-black text-[10px] font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1.5">
                        {(p as any).category?.name ?? "Chess"}
                      </span>
                      <h3 className="font-bold text-white text-sm sm:text-base mb-2 group-hover:text-amber-400 transition-colors flex-1">{p.name}</h3>
                      {p.description && (
                        <p className="text-white/25 text-xs leading-relaxed mb-3 line-clamp-2 hidden sm:block">{p.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                        <span className="text-lg sm:text-xl font-black text-amber-400">GH₵{p.price}</span>
                        <Link
                          href={`https://wa.me/233000000000?text=I'm interested in: ${p.name} (GH₵ ${p.price})`}
                          target="_blank"
                          className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-amber-400 hover:text-black text-white/40 text-[11px] font-bold transition-all border border-white/[0.08] hover:border-amber-400"
                        >
                          Order →
                        </Link>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection>
              <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-12 sm:p-16 text-center">
                <span className="text-6xl mb-4 block">🛍️</span>
                <h3 className="text-xl font-black text-white mb-2">Shop Coming Soon</h3>
                <p className="text-white/30 text-sm">We&apos;re curating the finest chess equipment. Check back soon!</p>
              </div>
            </AnimatedSection>
          )}

          {/* Trust bar */}
          <AnimatedSection delay={0.3} className="mt-12">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-white/20 text-[11px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">🚚 Delivery across Ghana</span>
              <span className="flex items-center gap-1.5">💬 WhatsApp ordering</span>
              <span className="flex items-center gap-1.5">✓ Quality guaranteed</span>
              <span className="flex items-center gap-1.5">🔄 Easy returns</span>
            </div>
          </AnimatedSection>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          ZONE CARDS — Explore pillars
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-zinc-950 relative noise-bg">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Explore PiChess
            </h2>
            <p className="text-white/30 mt-3 text-base sm:text-lg">Three pillars. One mission.</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                href: "/academy",
                icon: "♔",
                title: "Academy",
                desc: "Training, tournaments, and competitive chess development for all levels.",
                color: "#c9a84c",
                gradient: "gradient-text-gold",
                borderHover: "hover:border-[#c9a84c]/30",
                glowBg: "bg-[#c9a84c]/6",
              },
              {
                href: "/ngo",
                icon: "❤️",
                title: "Foundation",
                desc: "Using chess to empower underprivileged communities across Ghana.",
                color: "#2e7d5b",
                gradient: "gradient-text-green",
                borderHover: "hover:border-[#2e7d5b]/30",
                glowBg: "bg-[#2e7d5b]/6",
              },
              {
                href: "/shop",
                icon: "♟",
                title: "Shop",
                desc: "Premium chess sets, clocks, books, apparel, and accessories.",
                color: "#f59e0b",
                gradient: "",
                borderHover: "hover:border-amber-500/30",
                glowBg: "bg-amber-500/6",
              },
            ].map((zone, i) => (
              <AnimatedSection key={zone.title} delay={i * 0.12}>
                <Link href={zone.href} className="group block h-full">
                  <div className={`relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-7 sm:p-9 h-full hover-lift ${zone.borderHover} transition-all duration-500 spotlight`}>
                    <div className={`absolute top-0 right-0 w-48 h-48 rounded-full ${zone.glowBg} blur-[80px] group-hover:scale-[2] transition-transform duration-1000 pointer-events-none`} />
                    <span className="text-4xl sm:text-5xl block mb-5 relative z-10">{zone.icon}</span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-3 relative z-10">
                      {zone.gradient ? <span className={zone.gradient}>{zone.title}</span> : <span style={{ color: zone.color }}>{zone.title}</span>}
                    </h3>
                    <p className="text-white/35 text-sm leading-relaxed mb-6 relative z-10">{zone.desc}</p>
                    <span className="text-sm font-bold flex items-center gap-2 transition-all relative z-10" style={{ color: zone.color }}>
                      Explore <span className="group-hover:translate-x-2 transition-transform duration-300 inline-block">→</span>
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          PARTNERS — Logo marquee
      ═══════════════════════════════════════════════════════ */}
      {partners.length > 0 && (
        <section className="py-14 bg-black border-y border-white/[0.04] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">Trusted By</p>
          </div>
          <div className="relative">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...partners, ...partners].map((p, i) => (
                <div key={`${p.id}-${i}`} className="flex-shrink-0 mx-8 sm:mx-12 flex items-center gap-3">
                  {p.logo ? (
                    <img src={p.logo} alt={p.name} className="h-8 sm:h-10 object-contain opacity-30 hover:opacity-70 transition-opacity grayscale hover:grayscale-0 duration-500" />
                  ) : (
                    <span className="text-white/20 text-sm font-bold hover:text-white/50 transition-colors duration-500">{p.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ═══════════════════════════════════════════════════════
          CTA — Final dramatic banner
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-28 sm:py-36 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=1920&q=80"
          alt="Chess board dramatic lighting"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c9a84c]/5 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <div className="mb-6">
              <TextReveal text="Ready to Make" className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]" as="span" />
              <br className="hidden sm:block" />
              <TextReveal text="Your" className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]" delay={0.15} as="span" />
              {" "}
              <TextReveal text="Move?" className="text-4xl sm:text-6xl lg:text-7xl font-black gradient-text-gold tracking-tight leading-[1.05]" delay={0.25} as="span" />
            </div>
            <p className="text-white/45 text-base sm:text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              Join hundreds of students building discipline, critical thinking, and
              competitive excellence through the game of chess.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton>
                <Link
                  href="/academy/enquire"
                  className="animated-border w-full sm:w-auto px-10 py-4 rounded-full bg-[#c9a84c] hover:bg-[#dbb95d] text-black font-bold text-base transition-all hover:shadow-[0_0_50px_rgba(201,168,76,0.35)] hover:scale-[1.03] active:scale-[0.97] inline-block"
                >
                  Start Your Journey <span className="inline-block animate-wiggle">→</span>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-10 py-4 rounded-full border border-white/15 text-white hover:bg-white/8 font-semibold text-base transition-all backdrop-blur-sm inline-block"
                >
                  Visit the Shop
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="/ngo/apply"
                  className="w-full sm:w-auto px-10 py-4 rounded-full border border-white/15 text-white hover:bg-white/8 font-semibold text-base transition-all backdrop-blur-sm inline-block"
                >
                  Apply for Support
                </Link>
              </MagneticButton>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
