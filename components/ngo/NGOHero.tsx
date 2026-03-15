"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { NGOHeroData } from "@/lib/ngo-content";

/* ── Floating image positions ── */
const floatingPositions = [
  { className: "absolute top-[8%] left-[3%] w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44", rotate: -8, delay: 0, duration: 6, yRange: [-12, 12] as [number, number] },
  { className: "absolute top-[5%] right-[4%] w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40", rotate: 6, delay: 0.8, duration: 7, yRange: [-10, 14] as [number, number] },
  { className: "absolute bottom-[18%] left-[2%] w-24 h-24 sm:w-30 sm:h-30 lg:w-36 lg:h-36", rotate: 5, delay: 1.2, duration: 8, yRange: [-8, 16] as [number, number] },
  { className: "absolute bottom-[15%] right-[3%] w-28 h-28 sm:w-34 sm:h-34 lg:w-42 lg:h-42", rotate: -5, delay: 0.5, duration: 6.5, yRange: [-14, 10] as [number, number] },
  { className: "absolute top-[40%] left-[8%] w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 hidden md:block", rotate: 12, delay: 1.8, duration: 9, yRange: [-6, 10] as [number, number] },
  { className: "absolute top-[38%] right-[6%] w-20 h-20 sm:w-26 sm:h-26 lg:w-32 lg:h-32 hidden md:block", rotate: -10, delay: 2.2, duration: 7.5, yRange: [-10, 8] as [number, number] },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function NGOHero({ data }: { data: NGOHeroData }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-bleed blurred background image */}
      <div className="absolute inset-0">
        <Image
          src={data.backgroundImage}
          alt="Chess community background"
          fill
          priority
          className="object-cover blur-sm scale-105"
          sizes="100vw"
        />
        {/* White overlay for readability */}
        <div className="absolute inset-0 bg-white/70" />
        {/* Green-tinted gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2e7d5b]/10 via-transparent to-[#2e7d5b]/15" />
      </div>

      {/* Floating Images */}
      {data.floatingImages.map((img, i) => {
        const pos = floatingPositions[i % floatingPositions.length];
        return (
        <motion.div
          key={i}
          className={`${pos.className} z-[2]`}
          initial={{ opacity: 0, scale: 0.7, rotate: pos.rotate }}
          animate={{ opacity: 1, scale: 1, rotate: pos.rotate }}
          transition={{ duration: 1, delay: 0.3 + pos.delay, ease }}
        >
          <motion.div
            animate={{ y: pos.yRange }}
            transition={{
              duration: pos.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="relative w-full h-full"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl shadow-black/15 border-2 border-white/90 group">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 120px, 180px"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#2e7d5b]/20 to-transparent opacity-60 group-hover:opacity-0 transition-opacity duration-500" />
            </div>
          </motion.div>
        </motion.div>
        );
      })}

      {/* Center Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24 pb-16">
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#2e7d5b]/30 bg-white/80 backdrop-blur-md text-[#2e7d5b] text-xs font-semibold uppercase tracking-widest mb-8 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#2e7d5b] animate-pulse" />
          {data.badge}
        </motion.span>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-zinc-900 leading-[0.95] mb-6 drop-shadow-sm"
        >
          {data.title1}
          <br />
          <span className="bg-gradient-to-r from-[#2e7d5b] via-[#3a9970] to-[#2e7d5b] bg-clip-text text-transparent">
            {data.title2}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-600 mb-12 leading-relaxed"
        >
          {data.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href={data.cta1Link}
            className="group px-8 py-4 rounded-full bg-[#2e7d5b] hover:bg-[#3a9970] text-white font-bold text-base transition-all duration-300 hover:scale-105 shadow-xl shadow-[#2e7d5b]/25 hover:shadow-[#2e7d5b]/40"
          >
            {data.cta1Text}
          </Link>
          <Link
            href={data.cta2Link}
            className="px-8 py-4 rounded-full border-2 border-[#2e7d5b]/25 bg-white/70 backdrop-blur-sm text-[#2e7d5b] hover:bg-[#2e7d5b]/10 font-semibold text-base transition-all duration-300 hover:scale-105 hover:border-[#2e7d5b]/40"
          >
            {data.cta2Text}
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-zinc-500 uppercase tracking-widest">Explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-zinc-400 flex items-start justify-center pt-1.5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#2e7d5b]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
