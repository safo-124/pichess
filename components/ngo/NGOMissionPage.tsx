"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type {
  NGOMissionHero, NGOStorySection, NGOPillar, NGOValue, NGOCTA, NGOStat,
} from "@/lib/ngo-content";
import StatsCounter from "@/components/shared/StatsCounter";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ═══ Section helper ═══ */
function AnimSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══ Main Component ═══ */
interface MissionPageProps {
  missionHero: NGOMissionHero;
  storySection: NGOStorySection;
  pillars: NGOPillar[];
  values: NGOValue[];
  stats: NGOStat[];
  cta: NGOCTA;
}

export default function NGOMissionPage({ missionHero, storySection, pillars, values, stats, cta }: MissionPageProps) {
  return (
    <div className="bg-white text-zinc-900 overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={missionHero.backgroundImage}
            alt="Children playing chess in community"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-[#2e7d5b]/15" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-28">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/80 text-xs font-semibold uppercase tracking-widest mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#2e7d5b] animate-pulse" />
            {missionHero.badge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1] mb-6"
          >
            {missionHero.heading}
            <br />
            <span className="bg-gradient-to-r from-[#5cc99a] via-[#2e7d5b] to-[#5cc99a] bg-clip-text text-transparent">
              {missionHero.headingHighlight}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="max-w-2xl mx-auto text-white/65 text-lg sm:text-xl leading-relaxed"
          >
            {missionHero.subtitle}
          </motion.p>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#2e7d5b]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STORY ── */}
      <section className="py-20 lg:py-28 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <AnimSection>
            <span className="text-xs font-bold text-[#2e7d5b] uppercase tracking-widest">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3 mb-6 text-zinc-900 leading-tight">
              {storySection.heading}
            </h2>
            <div className="space-y-4 text-zinc-500 leading-relaxed">
              {storySection.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </AnimSection>

          <AnimSection delay={0.15}>
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={storySection.image}
                  alt="Students learning chess"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              {/* Floating accent card */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-xl p-4 border border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2e7d5b] flex items-center justify-center text-white font-black text-sm">{storySection.accentValue}</div>
                  <div>
                    <p className="text-xs text-zinc-400">{storySection.accentLabel.split(" ").slice(0, -1).join(" ") || storySection.accentLabel}</p>
                    <p className="font-bold text-zinc-900 text-sm">{storySection.accentLabel.split(" ").pop()}</p>
                  </div>
                </div>
              </div>
              {/* Decorative corner */}
              <div className="absolute -top-4 -right-4 w-10 h-10 border-t-2 border-r-2 border-[#2e7d5b]/30 rounded-tr-xl" />
            </div>
          </AnimSection>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-[#2e7d5b] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='20' height='20' fill='%23fff'/%3E%3Crect x='20' y='20' width='20' height='20' fill='%23fff'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }} />
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <StatsCounter key={i} end={s.value} label={s.label} suffix={s.suffix} color="white" />
            ))}
          </div>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className="py-20 lg:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimSection className="text-center mb-16">
            <span className="text-xs font-bold text-[#2e7d5b] uppercase tracking-widest">What We Do</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3 text-zinc-900">Our Four Pillars</h2>
          </AnimSection>

          <div className="space-y-20">
            {pillars.map((p, i) => {
              const isEven = i % 2 === 0;
              return (
                <AnimSection key={p.title} delay={0.1}>
                  <div className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? "lg:direction-rtl" : ""}`}>
                    {/* Image */}
                    <div className={`${!isEven ? "lg:order-2" : ""}`}>
                      <div className="relative aspect-[3/2] rounded-2xl overflow-hidden shadow-xl group">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 1024px) 90vw, 45vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                        <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-2xl shadow-lg">
                          {p.icon}
                        </div>
                      </div>
                    </div>

                    {/* Text */}
                    <div className={`${!isEven ? "lg:order-1" : ""}`}>
                      <div className="w-14 h-14 rounded-xl bg-[#2e7d5b]/10 flex items-center justify-center text-3xl mb-5">
                        {p.icon}
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-4">{p.title}</h3>
                      <p className="text-zinc-500 text-base leading-relaxed mb-6">{p.desc}</p>
                      <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#2e7d5b] to-[#5cc99a]" />
                    </div>
                  </div>
                </AnimSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=1600&q=80"
            alt="Chess background"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85" />
          <div className="absolute inset-0 bg-[#2e7d5b]/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <AnimSection className="text-center mb-14">
            <span className="text-xs font-bold text-[#5cc99a] uppercase tracking-widest">Our Values</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3 text-white">What Guides Us</h2>
          </AnimSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <AnimSection key={v.title} delay={0.1 + i * 0.08}>
                <div className="group rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:border-[#2e7d5b]/40 p-6 transition-all duration-300 hover:bg-white/15 hover:-translate-y-1 h-full">
                  <div className="text-3xl mb-3">{v.icon}</div>
                  <h3 className="font-bold text-white text-lg mb-2">{v.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <AnimSection>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 mb-4">
              {cta.heading}{" "}
              {cta.headingHighlight && (
                <span className="bg-gradient-to-r from-[#2e7d5b] to-[#5cc99a] bg-clip-text text-transparent">
                  {cta.headingHighlight}
                </span>
              )}
            </h2>
            <p className="text-zinc-500 text-lg mb-10 leading-relaxed">
              {cta.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={cta.cta1Link}
                className="px-8 py-4 rounded-full bg-[#2e7d5b] hover:bg-[#3a9970] text-white font-bold text-base transition-all duration-300 hover:scale-105 shadow-xl shadow-[#2e7d5b]/25"
              >
                {cta.cta1Text}
              </Link>
              <Link
                href={cta.cta2Link}
                className="px-8 py-4 rounded-full border-2 border-[#2e7d5b]/25 text-[#2e7d5b] hover:bg-[#2e7d5b]/5 font-semibold text-base transition-all duration-300 hover:scale-105"
              >
                {cta.cta2Text}
              </Link>
              <Link
                href={cta.cta3Link}
                className="px-8 py-4 rounded-full border-2 border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-semibold text-base transition-all duration-300 hover:scale-105"
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
