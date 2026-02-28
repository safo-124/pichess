import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import MagneticButton from "@/components/shared/MagneticButton";
import LessonCards from "@/components/academy/LessonCards";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import {
  defaultLessons,
  defaultLessonsHero,
  type AcademyLesson,
  type AcademyLessonsHero,
} from "@/lib/academy-content";

export const metadata = {
  title: "Lesson Packages — PiChess Academy",
  description:
    "From private coaching to group classes — find the perfect lesson format for every player.",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
async function getData(): Promise<{ lessons: AcademyLesson[]; lessonsHero: AcademyLessonsHero }> {
  try {
    const [lessonsRow, heroRow] = await Promise.all([
      (prisma as any).siteContent.findUnique({ where: { key: "academy_lessons" } }),
      (prisma as any).siteContent.findUnique({ where: { key: "academy_lessons_hero" } }),
    ]);
    return {
      lessons: lessonsRow ? (JSON.parse(lessonsRow.value) as AcademyLesson[]) : defaultLessons,
      lessonsHero: heroRow ? (JSON.parse(heroRow.value) as AcademyLessonsHero) : defaultLessonsHero,
    };
  } catch {
    return { lessons: defaultLessons, lessonsHero: defaultLessonsHero };
  }
}

export default async function LessonsPage() {
  const { lessons, lessonsHero } = await getData();
  const coreLessons = lessons.filter((l) => l.category === "core");
  const institutional = lessons.filter((l) => l.category === "institutional");

  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 bg-white overflow-hidden">
        {/* Background image */}
        {lessonsHero.bgImage && (
          <>
            <Image
              src={lessonsHero.bgImage}
              alt=""
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-white/80" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white" />
          </>
        )}

        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(201,168,76,0.06),transparent_60%)]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-blue-200/[0.1] blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] rounded-full bg-purple-200/[0.08] blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-6">
              {lessonsHero.badge}
            </span>
          </AnimatedSection>

          <TextReveal
            text={lessonsHero.title}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight"
          />

          <AnimatedSection delay={0.2}>
            <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
              {lessonsHero.description}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="w-3 h-3 rounded-full bg-gradient-to-br from-[#c9a84c]/40 to-[#dbb95d]/30 border border-[#c9a84c]/30" />
                <span>{coreLessons.length} Core Programs</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400/40 to-cyan-400/30 border border-blue-400/30" />
                <span>{institutional.length} Institutional Programs</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-300/40 to-gray-200/30 border border-gray-300" />
                <span>{lessons.length} Total</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          LESSON CARDS GRID
      ═══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 px-4 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.02),transparent_60%)]" />

        <div className="max-w-6xl mx-auto relative">
          <LessonCards lessons={lessons} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS — Simple 3-step strip
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-900 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.05),transparent_60%)]" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-14">
            <AnimatedSection>
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/10 text-gray-300 text-xs font-semibold uppercase tracking-widest mb-4">
                How It Works
              </span>
            </AnimatedSection>
            <TextReveal
              text="Start in 3 Simple Steps"
              className="text-3xl sm:text-4xl font-black text-white tracking-tight"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Choose Your Program",
                desc: "Browse our lesson packages and pick the one that fits your skill level and goals.",
                icon: "📋",
              },
              {
                step: "02",
                title: "Submit an Enquiry",
                desc: "Fill out a quick form and our team will reach out within 24 hours to schedule you.",
                icon: "✉️",
              },
              {
                step: "03",
                title: "Start Learning",
                desc: "Begin training with expert coaches and track your progress every step of the way.",
                icon: "🚀",
              },
            ].map((item, i) => (
              <AnimatedSection key={item.step} delay={i * 0.12}>
                <div className="group relative rounded-2xl border border-gray-700 bg-gray-800/50 p-8 transition-all duration-500 hover:border-[#c9a84c]/30 hover:shadow-lg hover:shadow-[#c9a84c]/10 hover:-translate-y-1 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold text-[#c9a84c]/60 uppercase tracking-widest mb-2">
                    Step {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#c9a84c] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-gray-900 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(201,168,76,0.08),transparent_60%)]" />
        <div className="max-w-2xl mx-auto text-center relative">
          <AnimatedSection>
            <div className="relative rounded-3xl border border-gray-700 bg-gray-800/50 p-12 sm:p-16 overflow-hidden">
              <div className="absolute inset-0 chess-bg opacity-[0.03] pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-gradient-to-b from-[#c9a84c]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <TextReveal
                  text="Found the Right Fit?"
                  className="text-3xl sm:text-4xl font-black text-white tracking-tight"
                />
                <AnimatedSection delay={0.2}>
                  <p className="text-gray-400 mt-4 mb-8 max-w-md mx-auto">
                    Submit an enquiry and a coach will get back to you within 24 hours
                    to get you started.
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
