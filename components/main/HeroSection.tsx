"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import HeroPhotoGrid from "./HeroPhotoGrid";

/* ── Defaults (used when no admin data) ─── */
const DEFAULTS = {
  background: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1600&h=900&fit=crop&q=80",
  images: [
    { src: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&h=700&fit=crop&q=80", alt: "Kids learning chess together" },
    { src: "https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=600&h=400&fit=crop&q=80", alt: "Chess pieces during a game" },
    { src: "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=600&h=700&fit=crop&q=80", alt: "Young player concentrating" },
    { src: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=600&h=400&fit=crop&q=80", alt: "Chess coaching session" },
  ],
  headline: "Where Every Move",
  headlineAccent: "Matters.",
  subtitle: "A world-class chess academy, a life-changing foundation, and a thriving community — all united by the world's greatest game.",
  stats: [
    { val: "500+", label: "Students" },
    { val: "50+", label: "Events" },
    { val: "15+", label: "Coaches" },
  ],
};

interface HeroData {
  background?: string;
  images?: { src: string; alt: string }[];
  headline?: string;
  headlineAccent?: string;
  subtitle?: string;
  stats?: { val: string; label: string }[];
}

/* ── Animation ─── */
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function HeroSection({ heroData }: { heroData?: HeroData | null }) {
  const d = { ...DEFAULTS, ...heroData };
  const bg = d.background || DEFAULTS.background;
  const images = d.images?.length ? d.images : DEFAULTS.images;
  const stats = d.stats?.length ? d.stats : DEFAULTS.stats;

  return (
    <section className="relative min-h-[90vh] lg:min-h-[100dvh] flex items-center overflow-hidden">
      {/* ── Full-bleed background image ── */}
      <div className="absolute inset-0">
        <Image
          src={bg}
          alt="PiChess hero background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Overlay — white on left fading to semi-transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40 lg:to-white/20" />
        {/* Extra bottom gradient for content readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent lg:via-transparent" />
        {/* Mobile: stronger overlay */}
        <div className="absolute inset-0 bg-white/60 sm:bg-transparent" />
      </div>

      {/* ── Decorative elements ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }} />
        {/* Floating shapes */}
        <motion.div
          className="absolute top-[18%] left-[5%] w-20 h-20 border border-[#c9a84c]/10 rotate-45 rounded-lg hidden lg:block"
          animate={{ rotate: [45, 50, 45], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[25%] left-[40%] w-3 h-3 rounded-full bg-[#c9a84c]/20 hidden lg:block"
          animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-12 sm:pt-36 sm:pb-20 lg:pt-0 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* ── Left: Text content ── */}
          <div className="max-w-xl">
            <motion.div {...fadeUp(0)}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#c9a84c]/30 bg-white/80 backdrop-blur-sm mb-6 sm:mb-8">
                <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
                <span className="text-[#c9a84c] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em]">
                  Ghana&apos;s Premier Chess Platform
                </span>
              </div>
            </motion.div>

            <motion.h1
              {...fadeUp(0.15)}
              className="text-[2.2rem] sm:text-5xl lg:text-[4.5rem] xl:text-[5.2rem] font-black tracking-[-0.03em] text-gray-900 leading-[1.05] mb-5 sm:mb-7"
            >
              {d.headline}
              <br />
              <span className="bg-gradient-to-r from-[#c9a84c] via-[#dbb95d] to-[#c9a84c] bg-clip-text text-transparent">
                {d.headlineAccent}
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.25)}
              className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mb-8 sm:mb-10"
            >
              {d.subtitle}
            </motion.p>

            <motion.div {...fadeUp(0.35)} className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/academy"
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:px-9 sm:py-4 rounded-full bg-[#c9a84c] text-white font-bold text-sm transition-all hover:bg-[#b89a3e] hover:shadow-[0_0_50px_rgba(201,168,76,0.3)] hover:scale-[1.03] active:scale-[0.97]"
              >
                Join the Academy
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/ngo"
                className="inline-flex items-center justify-center px-7 py-3.5 sm:px-9 sm:py-4 rounded-full border-2 border-gray-900/10 bg-white/60 backdrop-blur-sm text-gray-800 font-semibold text-sm hover:bg-white hover:border-[#c9a84c]/30 transition-all"
              >
                Support Our Mission
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              {...fadeUp(0.5)}
              className="flex items-center gap-6 sm:gap-10 mt-10 pt-7 sm:mt-14 sm:pt-8 border-t border-gray-200/60"
            >
              {stats.map((s, i) => (
                <div key={i}>
                  <p className="text-xl sm:text-3xl lg:text-4xl font-black text-gray-900">{s.val}</p>
                  <p className="text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Photo grid ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="relative hidden lg:block"
          >
            <HeroPhotoGrid images={images} />
          </motion.div>

          {/* Mobile photo strip — visible below text on small screens */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="lg:hidden"
          >
            <HeroPhotoGrid images={images} />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 hidden lg:flex"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-gray-300 flex items-start justify-center pt-1.5">
            <motion.div
              className="w-1 h-1.5 rounded-full bg-[#c9a84c]"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
