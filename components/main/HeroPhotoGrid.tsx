"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface HeroImage {
  src: string;
  alt: string;
}

/* ── Animation variants ─── */
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const shimmer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

export default function HeroPhotoGrid({ images }: { images: HeroImage[] }) {
  // Use provided images or defaults
  const photos = images?.length >= 4 ? images : [
    { src: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&h=700&fit=crop&q=80", alt: "Kids learning chess" },
    { src: "https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=600&h=400&fit=crop&q=80", alt: "Chess pieces" },
    { src: "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=600&h=700&fit=crop&q=80", alt: "Player concentrating" },
    { src: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=600&h=400&fit=crop&q=80", alt: "Chess coaching" },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="relative w-full"
    >
      {/* ── Desktop/Tablet: Asymmetric grid ── */}
      <div className="hidden sm:grid grid-cols-12 grid-rows-6 gap-3 h-[480px] lg:h-[540px]">
        {/* Large image — spans left 7 cols, full height */}
        <motion.div
          variants={item}
          className="col-span-7 row-span-6 relative rounded-3xl overflow-hidden group"
        >
          <Image
            src={photos[0].src}
            alt={photos[0].alt}
            fill
            priority
            className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
            sizes="(max-width: 1024px) 58vw, 400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          {/* Gold bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c9a84c] via-[#c9a84c]/60 to-transparent" />
          <motion.div
            variants={shimmer}
            className="absolute bottom-4 left-4 right-4"
          >
            <p className="text-white/90 text-xs sm:text-sm font-semibold drop-shadow-lg">{photos[0].alt}</p>
          </motion.div>
        </motion.div>

        {/* Top right image */}
        <motion.div
          variants={item}
          className="col-span-5 row-span-3 relative rounded-3xl overflow-hidden group"
        >
          <Image
            src={photos[1].src}
            alt={photos[1].alt}
            fill
            className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
            sizes="(max-width: 1024px) 42vw, 280px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#c9a84c]/60 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>

        {/* Bottom right — two images side by side */}
        <motion.div
          variants={item}
          className="col-span-3 row-span-3 relative rounded-3xl overflow-hidden group"
        >
          <Image
            src={photos[2].src}
            alt={photos[2].alt}
            fill
            className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
            sizes="(max-width: 1024px) 25vw, 160px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#c9a84c]/60 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>

        <motion.div
          variants={item}
          className="col-span-2 row-span-3 relative rounded-3xl overflow-hidden group"
        >
          <Image
            src={photos[3].src}
            alt={photos[3].alt}
            fill
            className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
            sizes="(max-width: 1024px) 17vw, 120px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </motion.div>
      </div>

      {/* ── Mobile: Stacked layout ── */}
      <div className="sm:hidden space-y-3">
        <motion.div variants={item} className="relative w-full h-48 rounded-2xl overflow-hidden">
          <Image
            src={photos[0].src}
            alt={photos[0].alt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c9a84c] to-transparent" />
          <p className="absolute bottom-3 left-3 text-white text-xs font-semibold drop-shadow-lg">{photos[0].alt}</p>
        </motion.div>
        <div className="grid grid-cols-3 gap-3">
          {photos.slice(1, 4).map((p, i) => (
            <motion.div key={i} variants={item} className="relative h-28 rounded-2xl overflow-hidden">
              <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="absolute -bottom-5 right-4 sm:-bottom-6 sm:right-0 lg:-right-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 z-20"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
          <span className="text-base sm:text-lg">♟</span>
        </div>
        <div>
          <p className="text-sm font-black text-gray-900">500+</p>
          <p className="text-[10px] text-gray-400 font-medium">Active Players</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
