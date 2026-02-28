import AnimatedSection from "@/components/shared/AnimatedSection";
import StatsCounter from "@/components/shared/StatsCounter";
import TextReveal from "@/components/shared/TextReveal";
import MagneticButton from "@/components/shared/MagneticButton";
import ParallaxSection from "@/components/shared/ParallaxSection";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import {
  defaultHero, defaultStats, defaultLessons, defaultFeatures, defaultCTA,
  type AcademyHero, type AcademyStat, type AcademyLesson, type AcademyFeature, type AcademyCTA,
} from "@/lib/academy-content";

export const metadata = { title: "PiChess Academy" };

/* eslint-disable @typescript-eslint/no-explicit-any */
async function getData() {
  try {
    const [team, testimonials, heroRaw, statsRaw, lessonsRaw, featuresRaw, ctaRaw] = await Promise.all([
      prisma.academy_Team.findMany({ where: { published: true }, orderBy: { order: "asc" }, take: 4 }),
      prisma.academy_Testimonial.findMany({ where: { published: true }, take: 3 }),
      (prisma as any).siteContent.findUnique({ where: { key: "academy_hero" } }),
      (prisma as any).siteContent.findUnique({ where: { key: "academy_stats" } }),
      (prisma as any).siteContent.findUnique({ where: { key: "academy_lessons" } }),
      (prisma as any).siteContent.findUnique({ where: { key: "academy_features" } }),
      (prisma as any).siteContent.findUnique({ where: { key: "academy_cta" } }),
    ]);
    return {
      team, testimonials,
      hero: heroRaw ? JSON.parse(heroRaw.value) as AcademyHero : defaultHero,
      stats: statsRaw ? JSON.parse(statsRaw.value) as AcademyStat[] : defaultStats,
      lessons: lessonsRaw ? JSON.parse(lessonsRaw.value) as AcademyLesson[] : defaultLessons,
      features: featuresRaw ? JSON.parse(featuresRaw.value) as AcademyFeature[] : defaultFeatures,
      cta: ctaRaw ? JSON.parse(ctaRaw.value) as AcademyCTA : defaultCTA,
    };
  } catch { return { team: [], testimonials: [], hero: defaultHero, stats: defaultStats, lessons: defaultLessons, features: defaultFeatures, cta: defaultCTA }; }
}

export default async function AcademyPage() {
  const { team, testimonials, hero, stats, lessons, features, cta } = await getData();

  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════
          HERO — Immersive cinematic split
      ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#060a14]">
        {/* Background image */}
        <Image
          src={hero.bgImage}
          alt="Chess board close up"
          fill
          priority
          className="object-cover opacity-20"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a14] via-[#060a14]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-transparent to-[#060a14]/60" />
        {/* Decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-amber-500/[0.06] blur-[180px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/[0.04] blur-[150px] pointer-events-none" />
        {/* Grid pattern */}
        <div className="absolute inset-0 chess-bg opacity-[0.02] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center pt-24 pb-16 lg:pt-0 lg:pb-0 min-h-screen">
            {/* Left — Text */}
            <div className="max-w-2xl">
              <AnimatedSection delay={0}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-amber-300/90 text-xs font-semibold uppercase tracking-widest">
                    {hero.badge}
                  </span>
                </div>
              </AnimatedSection>

              <div className="mb-8">
                <TextReveal text={hero.title1} className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tight leading-[0.95]" as="div" />
                <TextReveal text={hero.title2} className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[0.95] bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent" delay={0.2} as="div" />
              </div>

              <AnimatedSection delay={0.3}>
                <p className="text-white/40 text-lg sm:text-xl leading-relaxed max-w-lg mb-10">
                  {hero.description}
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <MagneticButton>
                    <Link
                      href="/academy/enquire"
                      className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 group-hover:from-amber-300 group-hover:to-orange-400 transition-all" />
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
                      <span className="relative z-10 text-black">Enquire Now</span>
                      <span className="relative z-10 text-black/70 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </MagneticButton>
                  <MagneticButton>
                    <Link
                      href="/academy/team"
                      className="px-8 py-4 rounded-full border border-white/15 text-white/80 hover:text-white hover:bg-white/5 font-semibold text-base transition-all backdrop-blur-sm"
                    >
                      Meet Our Coaches
                    </Link>
                  </MagneticButton>
                </div>
              </AnimatedSection>
            </div>

            {/* Right — Image composition */}
            <AnimatedSection delay={0.2} direction="right" className="hidden lg:block">
              <div className="relative">
                <ParallaxSection speed={0.15} direction="down">
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/[0.06]">
                    <Image
                      src={hero.sideImage}
                      alt="Students training at PiChess Academy"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060a14]/60 to-transparent" />
                  </div>
                </ParallaxSection>

                {/* Floating stat card */}
                <ParallaxSection speed={0.3} direction="up">
                  <div className="absolute -bottom-6 -left-8 bg-[#0f1628]/90 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-5 shadow-xl shadow-black/40">
                    <div className="text-3xl font-black text-amber-400">{hero.floatStat}</div>
                    <div className="text-white/50 text-sm font-medium">{hero.floatStatLabel}</div>
                  </div>
                </ParallaxSection>

                {/* Floating badge */}
                <ParallaxSection speed={0.4} direction="up">
                  <div className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-4 shadow-lg shadow-amber-500/20">
                    <div className="text-black text-2xl font-black">{hero.floatBadgeIcon}</div>
                    <div className="text-black/70 text-[10px] font-bold uppercase tracking-wider">{hero.floatBadgeLabel}</div>
                  </div>
                </ParallaxSection>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/20 relative">
            <div className="w-1 h-2 bg-amber-400 rounded-full absolute top-1.5 left-1/2 -translate-x-1/2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURES — Quick horizontal strip
      ═══════════════════════════════════════════════════════ */}
      <section className="py-6 bg-gradient-to-r from-amber-500/10 via-[#0a0e1a] to-amber-500/10 border-y border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 sm:gap-14">
          {features.map((f, i) => (
            <AnimatedSection key={f.title} delay={i * 0.08}>
              <div className="flex items-center gap-3 text-white/60">
                <span className="text-xl">{f.icon}</span>
                <div>
                  <div className="text-sm font-bold text-white/80">{f.title}</div>
                  <div className="text-xs text-white/35">{f.desc}</div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS — Bold numbers
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#060a14] relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.04),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((s, i) => (
              <AnimatedSection key={s.label} delay={i * 0.1}>
                <div className="text-center"><StatsCounter end={s.end} label={s.label} suffix={s.suffix || undefined} color={s.color as "gold" | "white"} /></div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          LESSON PACKAGES — Teaser linking to /academy/lessons
      ═══════════════════════════════════════════════════════ */}
      <section id="lessons" className="py-28 bg-[#0a0e1a] px-4 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(245,158,11,0.03),transparent_60%)]" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-14">
            <AnimatedSection>
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-4">
                Curriculum
              </span>
            </AnimatedSection>
            <TextReveal text="Lesson Packages" className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight" />
            <AnimatedSection delay={0.2}>
              <p className="text-white/35 mt-4 max-w-lg mx-auto text-base">
                From private coaching to group classes — find the perfect lesson format for every player.
              </p>
            </AnimatedSection>
          </div>

          {/* Preview grid — show first 4 lessons as cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {lessons.slice(0, 4).map((lesson, i) => (
              <AnimatedSection key={lesson.title} delay={i * 0.08}>
                <Link href="/academy/lessons" className="group block rounded-2xl border border-white/[0.06] bg-[#0f1628]/80 overflow-hidden transition-all duration-500 hover:border-amber-500/15 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1">
                  {/* Image or gradient header */}
                  {lesson.image ? (
                    <div className="relative h-28 overflow-hidden">
                      <Image src={lesson.image} alt={lesson.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1628] via-[#0f1628]/30 to-transparent" />
                    </div>
                  ) : (
                    <div className="relative h-20 bg-gradient-to-br from-amber-500/10 to-orange-500/5">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1628] to-transparent opacity-70" />
                    </div>
                  )}
                  <div className="p-4 text-center -mt-6 relative">
                    <span className="text-3xl inline-block group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                      {lesson.icon}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-2 group-hover:text-amber-200 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-white/30 text-xs mt-1 line-clamp-2">{lesson.desc}</p>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          {/* "View all" + count */}
          <AnimatedSection delay={0.3}>
            <div className="text-center">
              <p className="text-white/25 text-sm mb-5">
                {lessons.length} lesson packages available — including private coaching, group classes, and institutional programs.
              </p>
              <MagneticButton>
                <Link
                  href="/academy/lessons"
                  className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-400/15 to-orange-500/15 border border-amber-500/25 rounded-full group-hover:from-amber-400/25 group-hover:to-orange-500/25 transition-all" />
                  <span className="relative z-10 text-amber-300 group-hover:text-amber-200 transition-colors">
                    View All Lessons
                  </span>
                  <span className="relative z-10 text-amber-400/60 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </MagneticButton>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TEAM PREVIEW — Coach cards with styled avatars
      ═══════════════════════════════════════════════════════ */}
      {team.length > 0 && (
        <section className="py-28 bg-[#060a14] px-4 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.03),transparent_60%)]" />
          <div className="max-w-7xl mx-auto relative">
            <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-14">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-widest mb-4">
                  Instructors
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Our Coaches</h2>
              </div>
              <Link href="/academy/team" className="text-amber-400 text-sm font-semibold hover:text-amber-300 transition-colors group">
                Full team <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </AnimatedSection>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {team.map((member, i) => (
                <AnimatedSection key={member.id} delay={i * 0.1}>
                  <div className="group rounded-2xl border border-white/[0.06] bg-[#0f1628] p-6 text-center transition-all duration-500 hover:border-amber-500/15 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-amber-500/15 group-hover:border-amber-500/30 group-hover:scale-105 transition-all">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full rounded-2xl object-cover" />
                      ) : (
                        <span className="group-hover:scale-110 transition-transform inline-block">♟</span>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-sm group-hover:text-amber-200 transition-colors">{member.name}</h3>
                    <p className="text-amber-400/70 text-xs mt-1 font-medium">{member.role}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          TESTIMONIALS — Refined cards
      ═══════════════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="py-28 bg-[#0a0e1a] px-4 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <AnimatedSection>
                <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-widest mb-4">
                  Testimonials
                </span>
              </AnimatedSection>
              <TextReveal text="What Students Say" className="text-3xl sm:text-5xl font-black text-white tracking-tight" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <AnimatedSection key={t.id} delay={i * 0.12}>
                  <div className="group rounded-2xl border border-white/[0.06] bg-[#0f1628] p-7 transition-all duration-500 hover:border-amber-500/15 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1 h-full flex flex-col">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <span key={j} className="text-amber-400 text-sm">★</span>
                      ))}
                    </div>
                    {/* Quote */}
                    <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1 italic">
                      &ldquo;{t.content}&rdquo;
                    </p>
                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center text-amber-400 font-black text-sm border border-amber-500/15">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{t.name}</p>
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
          CTA — Bold final card
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-4 bg-[#060a14] relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.06),transparent_60%)]" />
        <div className="max-w-3xl mx-auto text-center relative">
          <AnimatedSection>
            <div className="relative rounded-3xl border border-amber-500/15 bg-[#0f1628] p-12 sm:p-16 overflow-hidden">
              {/* Decorative grid */}
              <div className="absolute inset-0 chess-bg opacity-[0.02] pointer-events-none" />
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-gradient-to-b from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <TextReveal text={cta.title1} className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight" />
                <TextReveal text={cta.title2} className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent tracking-tight" delay={0.15} />
                <AnimatedSection delay={0.3}>
                  <p className="text-white/35 mt-4 mb-10 max-w-md mx-auto">
                    {cta.description}
                  </p>
                </AnimatedSection>
                <MagneticButton>
                  <Link
                    href="/academy/enquire"
                    className="group relative inline-flex items-center gap-2 px-10 py-5 rounded-full text-base font-black transition-all overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 group-hover:from-amber-300 group-hover:to-orange-400 transition-all" />
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.25),transparent_70%)]" />
                    <span className="relative z-10 text-black">{cta.buttonText}</span>
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
