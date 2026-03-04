"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

/* ── Floating image positions ── */
const floatingImages = [
  {
    src: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=400&q=80",
    alt: "Children playing chess outdoors",
    className: "absolute top-[8%] left-[3%] w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44",
    rotate: -8,
    delay: 0,
    duration: 6,
    yRange: [-12, 12],
  },
  {
    src: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&q=80",
    alt: "Chess coaching session",
    className: "absolute top-[5%] right-[4%] w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40",
    rotate: 6,
    delay: 0.8,
    duration: 7,
    yRange: [-10, 14],
  },
  {
    src: "https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=400&q=80",
    alt: "Community chess tournament",
    className: "absolute bottom-[18%] left-[2%] w-24 h-24 sm:w-30 sm:h-30 lg:w-36 lg:h-36",
    rotate: 5,
    delay: 1.2,
    duration: 8,
    yRange: [-8, 16],
  },
  {
    src: "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=400&q=80",
    alt: "Young chess player celebrating",
    className: "absolute bottom-[15%] right-[3%] w-28 h-28 sm:w-34 sm:h-34 lg:w-42 lg:h-42",
    rotate: -5,
    delay: 0.5,
    duration: 6.5,
    yRange: [-14, 10],
  },
  {
    src: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400&q=80",
    alt: "Chess pieces close-up",
    className: "absolute top-[40%] left-[8%] w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 hidden md:block",
    rotate: 12,
    delay: 1.8,
    duration: 9,
    yRange: [-6, 10],
  },
  {
    src: "https://images.unsplash.com/photo-1611195974226-a6a9be4a5b1e?w=400&q=80",
    alt: "Students learning chess",
    className: "absolute top-[38%] right-[6%] w-20 h-20 sm:w-26 sm:h-26 lg:w-32 lg:h-32 hidden md:block",
    rotate: -10,
    delay: 2.2,
    duration: 7.5,
    yRange: [-10, 8],
  },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function NGOHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-bleed blurred background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1600&q=80"
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
      {floatingImages.map((img, i) => (
        <motion.div
          key={i}
          className={`${img.className} z-[2]`}
          initial={{ opacity: 0, scale: 0.7, rotate: img.rotate }}
          animate={{ opacity: 1, scale: 1, rotate: img.rotate }}
          transition={{ duration: 1, delay: 0.3 + img.delay, ease }}
        >
          <motion.div
            animate={{ y: img.yRange }}
            transition={{
              duration: img.duration,
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
      ))}

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
          PiChess Foundation
        </motion.span>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-zinc-900 leading-[0.95] mb-6 drop-shadow-sm"
        >
          Chess for
          <br />
          <span className="bg-gradient-to-r from-[#2e7d5b] via-[#3a9970] to-[#2e7d5b] bg-clip-text text-transparent">
            Every Child.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-600 mb-12 leading-relaxed"
        >
          We bring chess to underserved communities across Ghana, using it as a
          tool for education, discipline, and opportunity.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/ngo/donate"
            className="group px-8 py-4 rounded-full bg-[#2e7d5b] hover:bg-[#3a9970] text-white font-bold text-base transition-all duration-300 hover:scale-105 shadow-xl shadow-[#2e7d5b]/25 hover:shadow-[#2e7d5b]/40"
          >
            Donate Now ❤️
          </Link>
          <Link
            href="/ngo/apply"
            className="px-8 py-4 rounded-full border-2 border-[#2e7d5b]/25 bg-white/70 backdrop-blur-sm text-[#2e7d5b] hover:bg-[#2e7d5b]/10 font-semibold text-base transition-all duration-300 hover:scale-105 hover:border-[#2e7d5b]/40"
          >
            Apply for Support
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
