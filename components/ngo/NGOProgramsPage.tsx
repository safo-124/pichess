"use client";

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type {
  NGOProgramsHero, NGOProgram, NGOProcessStep, NGOTestimonial,
  NGOTimelineItem, NGOProgramsImpactStat, NGOCTA,
} from "@/lib/ngo-content";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ═══════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function AnimSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div style={{ y }} className="w-full h-[120%] relative">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
      </motion.div>
    </div>
  );
}

function FloatingShape({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay, ease }}
    >
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6 + delay * 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-full"
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROGRAM CARD (expandable)
   ═══════════════════════════════════════════════════════════ */

function ProgramCard({ program, index }: { program: NGOProgram; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <AnimSection delay={0.1}>
      <div className="group relative">
        {/* Connector line to timeline */}
        <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-[#2e7d5b]/30 to-transparent" />

        <motion.div
          layout
          className={`grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-zinc-200/60 bg-white shadow-sm hover:shadow-xl transition-shadow duration-500 ${
            isEven ? "" : "lg:direction-rtl"
          }`}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.4, ease }}
        >
          {/* Image side */}
          <div className={`relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px] overflow-hidden ${!isEven ? "lg:order-2" : ""}`}>
            <Image
              src={program.image}
              alt={program.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Floating badge */}
            <motion.div
              className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase text-white/90 backdrop-blur-md"
              style={{ backgroundColor: `${program.color}cc` }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, ease }}
            >
              {program.badge}
            </motion.div>

            {/* Impact stat */}
            <motion.div
              className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, ease }}
            >
              <p className="text-2xl font-black text-white">{program.impact}</p>
            </motion.div>

            {/* Icon float */}
            <motion.div
              className="absolute top-4 right-4 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl"
              animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              {program.icon}
            </motion.div>
          </div>

          {/* Content side */}
          <div className={`p-8 lg:p-12 flex flex-col justify-center ${!isEven ? "lg:order-1 lg:text-right" : ""}`}>
            <motion.div
              className={`w-12 h-1 rounded-full mb-6 ${!isEven ? "lg:ml-auto" : ""}`}
              style={{ backgroundColor: program.color }}
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease }}
            />

            <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-2">{program.title}</h3>
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: program.color }}>
              {program.subtitle}
            </p>
            <p className="text-zinc-500 leading-relaxed mb-6">{program.desc}</p>

            {/* Expand/collapse details */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 text-sm font-bold transition-colors mb-4 self-start"
              style={{ color: program.color }}
            >
              {expanded ? "Show Less" : "See Details"}
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className={`overflow-hidden space-y-3 mb-6 ${!isEven ? "lg:ml-auto" : ""}`}
                >
                  {program.details.map((d, i) => (
                    <motion.li
                      key={d}
                      initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, ease }}
                      className={`flex items-start gap-3 text-sm text-zinc-600 ${!isEven ? "lg:flex-row-reverse lg:text-right" : ""}`}
                    >
                      <span className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: program.color }}>
                        ✓
                      </span>
                      {d}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimSection>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */

interface ProgramsPageProps {
  programsHero: NGOProgramsHero;
  programs: NGOProgram[];
  processSteps: NGOProcessStep[];
  testimonials: NGOTestimonial[];
  timeline: NGOTimelineItem[];
  impactStats: NGOProgramsImpactStat[];
  cta: NGOCTA;
}

export default function NGOProgramsPage({
  programsHero,
  programs,
  processSteps,
  testimonials,
  timeline,
  impactStats,
  cta,
}: ProgramsPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <div className="bg-white text-zinc-900 overflow-x-hidden">

      {/* ──── HERO ──── */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Parallax background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <Image
            src={programsHero.backgroundImage}
            alt={programsHero.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
          <div className="absolute inset-0 bg-[#2e7d5b]/20" />
        </motion.div>

        {/* Floating chess pieces */}
        <motion.div
          className="absolute top-[15%] left-[8%] text-6xl opacity-20 text-white"
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >♞</motion.div>
        <motion.div
          className="absolute top-[25%] right-[10%] text-5xl opacity-15 text-white"
          animate={{ y: [0, -15, 0], rotate: [0, -8, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >♝</motion.div>
        <motion.div
          className="absolute bottom-[20%] left-[15%] text-4xl opacity-10 text-white"
          animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >♜</motion.div>
        <motion.div
          className="absolute bottom-[30%] right-[5%] text-7xl opacity-10 text-white"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >♛</motion.div>

        {/* Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/80 text-xs font-bold uppercase tracking-[0.2em] mb-8">
              <span className="w-2 h-2 rounded-full bg-[#5cc99a] animate-pulse" />
              {programsHero.badge}
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
          >
            {programsHero.title}{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-[#5cc99a] via-[#8ce8be] to-[#5cc99a] bg-clip-text text-transparent">
                {programsHero.titleHighlight}
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#5cc99a] to-transparent rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.8, ease }}
              />
            </span>{" "}
            {programsHero.titleEnd}
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-white/65 text-lg sm:text-xl leading-relaxed mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          >
            {programsHero.subtitle}
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
          >
            <Link
              href={programsHero.ctaLink}
              className="px-8 py-4 rounded-full bg-[#2e7d5b] hover:bg-[#3a9970] text-white font-bold text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-[#2e7d5b]/30"
            >
              {programsHero.ctaText}
            </Link>
            <Link
              href={programsHero.secondaryCtaLink}
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-base transition-all duration-300 hover:scale-105"
            >
              {programsHero.secondaryCtaText}
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center">
            <motion.div
              className="w-1.5 h-3 rounded-full bg-white/50 mt-2"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ──── HOW IT WORKS ──── */}
      <section className="py-24 bg-zinc-50 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-[#2e7d5b]/5 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-[#2e7d5b]/3 blur-3xl" />

        <div className="max-w-6xl mx-auto px-4">
          <AnimSection className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-4">
              Our Process
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight">
              How We Make It Happen
            </h2>
          </AnimSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-14 left-[12%] right-[12%] h-px bg-gradient-to-r from-[#2e7d5b]/20 via-[#2e7d5b]/40 to-[#2e7d5b]/20" />

            {processSteps.map((step, i) => (
              <AnimSection key={step.num} delay={i * 0.15}>
                <div className="relative text-center group">
                  {/* Number circle */}
                  <motion.div
                    className="w-28 h-28 rounded-full mx-auto mb-6 relative flex items-center justify-center bg-white border-2 border-[#2e7d5b]/20 shadow-sm group-hover:shadow-lg group-hover:border-[#2e7d5b]/50 transition-all duration-500"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <span className="text-4xl font-black bg-gradient-to-br from-[#2e7d5b] to-[#5cc99a] bg-clip-text text-transparent">
                      {step.num}
                    </span>
                    {/* Pulse ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[#2e7d5b]/20"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    />
                  </motion.div>
                  <h3 className="text-xl font-black text-zinc-900 mb-2">{step.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ──── PROGRAMS GRID ──── */}
      <section id="programs" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimSection className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-4">
              {programsHero.sectionBadge || "What We Do"}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight mb-4">
              {programsHero.sectionHeading || "Our Six Programs"}
            </h2>
            <p className="max-w-2xl mx-auto text-zinc-500 text-lg">
              {programsHero.sectionDescription || "Each program tackles a specific barrier that prevents children from accessing chess education. Together, they form a complete support system."}
            </p>
          </AnimSection>

          <div className="space-y-12">
            {programs.map((p, i) => (
              <ProgramCard key={p.id} program={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ──── IMPACT NUMBERS (animated counters) ──── */}
      <section className="py-24 bg-[#2e7d5b] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-conic-gradient(rgba(255,255,255,0.08) 0% 25%, transparent 0% 50%)`,
            backgroundSize: "40px 40px",
          }} />
        </div>

        {/* Floating accents */}
        <motion.div
          className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full border border-white/10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[8%] w-24 h-24 rounded-full bg-white/5"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        <div className="relative max-w-6xl mx-auto px-4">
          <AnimSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Every number represents a life changed, a community strengthened, a future brightened.
            </p>
          </AnimSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, i) => (
              <AnimSection key={stat.label} delay={i * 0.12}>
                <motion.div
                  className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all duration-500"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <motion.div
                    className="text-4xl mb-3"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="text-3xl sm:text-4xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-white/60 text-sm font-medium">{stat.label}</div>
                </motion.div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ──── TESTIMONIALS ──── */}
      <section className="py-24 bg-zinc-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2e7d5b]/20 to-transparent" />

        <div className="max-w-6xl mx-auto px-4">
          <AnimSection className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-4">
              Voices of Impact
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight">
              What They Say
            </h2>
          </AnimSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <AnimSection key={t.name} delay={i * 0.15}>
                <motion.div
                  className="relative bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 hover:shadow-xl transition-all duration-500 h-full flex flex-col"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4, ease }}
                >
                  {/* Quote mark */}
                  <div className="absolute -top-4 left-8 w-10 h-10 rounded-xl bg-[#2e7d5b] flex items-center justify-center text-white text-xl font-black shadow-lg shadow-[#2e7d5b]/30">
                    &ldquo;
                  </div>

                  <p className="text-zinc-600 text-base leading-relaxed italic mt-4 mb-8 flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                    <div className="w-12 h-12 rounded-full bg-[#d4ede3] flex items-center justify-center text-2xl">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 text-sm">{t.name}</p>
                      <p className="text-zinc-400 text-xs">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ──── TIMELINE ──── */}
      <section className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4">
          <AnimSection className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-4">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight">
              Growing Year by Year
            </h2>
          </AnimSection>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#2e7d5b] via-[#5cc99a] to-[#2e7d5b]/20" />

            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <AnimSection key={item.year} delay={i * 0.1}>
                  <div className={`relative flex items-center mb-12 ${isLeft ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                    {/* Dot */}
                    <motion.div
                      className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#2e7d5b] border-4 border-white shadow-md z-10"
                      whileInView={{ scale: [0, 1.3, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2, ease }}
                    />

                    {/* Content card */}
                    <div className={`ml-12 sm:ml-0 sm:w-[45%] ${isLeft ? "sm:pr-12 sm:text-right" : "sm:pl-12"}`}>
                      <motion.div
                        className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 hover:shadow-lg transition-all duration-500"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3, ease }}
                      >
                        <span className="inline-block px-3 py-1 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-sm font-black mb-3">
                          {item.year}
                        </span>
                        <h3 className="text-lg font-black text-zinc-900 mb-2">{item.title}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                      </motion.div>
                    </div>
                  </div>
                </AnimSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── GET INVOLVED CTA ──── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80"
            alt="Community"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a3c2d]/90 via-[#2e7d5b]/85 to-[#1a3c2d]/90" />
        </div>

        {/* Animated grid */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <AnimSection>
            <motion.div
              className="text-6xl mb-6"
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              ♟
            </motion.div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
              {cta.heading}{" "}
              <span className="bg-gradient-to-r from-[#8ce8be] to-[#5cc99a] bg-clip-text text-transparent">
                {cta.headingHighlight}
              </span>
              ?
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              {cta.description}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={cta.cta1Link}
                className="group px-8 py-4 rounded-full bg-white text-[#2e7d5b] font-bold text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-black/20"
              >
                <span className="flex items-center gap-2">
                  {cta.cta1Text}
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >→</motion.span>
                </span>
              </Link>
              <Link
                href={cta.cta2Link}
                className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-base transition-all duration-300 hover:scale-105"
              >
                {cta.cta2Text}
              </Link>
              <Link
                href={cta.cta3Link}
                className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-base transition-all duration-300 hover:scale-105"
              >
                {cta.cta3Text}
              </Link>
            </div>
          </AnimSection>
        </div>
      </section>
    </div>
  );
}
