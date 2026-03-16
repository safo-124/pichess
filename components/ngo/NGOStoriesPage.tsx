"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NGOStoriesContent } from "@/lib/ngo-content";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ═══════════════════════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════════════════════ */

interface Story {
  id: number;
  title: string;
  content: string;
  image: string | null;
  createdAt: string | Date;
}

/* ═══════════════════════════════════════════════════════════
   HELPERS
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

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/* ═══════════════════════════════════════════════════════════
   FEATURED STORY CARD
   ═══════════════════════════════════════════════════════════ */

function FeaturedStoryCard({ story, index }: { story: Story; index: number }) {
  const isEven = index % 2 === 0;
  return (
    <AnimSection delay={0.1}>
      <motion.div
        className="group relative grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden bg-white border border-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-700"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.5, ease }}
      >
        {/* Image */}
        <div className={`relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px] overflow-hidden ${!isEven ? "lg:order-2" : ""}`}>
          {story.image ? (
            <Image
              src={story.image}
              alt={story.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#d4ede3] to-[#2e7d5b]/20 flex items-center justify-center">
              <span className="text-8xl opacity-20">♟</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Date badge */}
          <motion.div
            className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, ease }}
          >
            {formatDate(story.createdAt)}
          </motion.div>

          {/* Featured tag */}
          {index === 0 && (
            <motion.div
              className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#2e7d5b]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, ease }}
            >
              ✦ Featured
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className={`p-8 sm:p-12 flex flex-col justify-center ${!isEven ? "lg:order-1" : ""}`}>
          <motion.div
            className={`w-12 h-1 rounded-full bg-[#2e7d5b] mb-6 ${!isEven ? "lg:ml-auto" : ""}`}
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease }}
          />

          <h3 className={`text-2xl sm:text-3xl font-black text-zinc-900 mb-4 leading-tight tracking-tight ${!isEven ? "lg:text-right" : ""}`}>
            {story.title}
          </h3>

          <p className={`text-zinc-500 leading-relaxed mb-6 text-sm sm:text-base ${!isEven ? "lg:text-right" : ""}`}>
            {story.content.length > 300 ? story.content.slice(0, 300) + "..." : story.content}
          </p>

          <div className={`flex items-center gap-3 text-xs text-zinc-400 ${!isEven ? "lg:justify-end" : ""}`}>
            <span className="w-8 h-8 rounded-full bg-[#d4ede3] flex items-center justify-center text-[#2e7d5b] font-bold">♟</span>
            <span>{formatDate(story.createdAt)}</span>
          </div>
        </div>
      </motion.div>
    </AnimSection>
  );
}

/* ═══════════════════════════════════════════════════════════
   STORY GRID CARD
   ═══════════════════════════════════════════════════════════ */

function StoryGridCard({ story, index }: { story: Story; index: number }) {
  return (
    <AnimSection delay={index * 0.1}>
      <motion.article
        className="group relative rounded-3xl overflow-hidden bg-white border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease }}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {story.image ? (
            <Image
              src={story.image}
              alt={story.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#d4ede3] to-[#2e7d5b]/20 flex items-center justify-center">
              <span className="text-6xl opacity-20">♟</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Hover overlay */}
          <motion.div
            className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0"
          >
            <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold">
              {formatDate(story.createdAt)}
            </span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-lg font-black text-zinc-900 mb-3 leading-tight group-hover:text-[#2e7d5b] transition-colors duration-300">
            {story.title}
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 flex-1">
            {story.content}
          </p>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-100">
            <div className="w-6 h-6 rounded-full bg-[#d4ede3] flex items-center justify-center">
              <span className="text-[10px] text-[#2e7d5b]">♟</span>
            </div>
            <span className="text-xs text-zinc-400">{formatDate(story.createdAt)}</span>
          </div>
        </div>
      </motion.article>
    </AnimSection>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */

export default function NGOStoriesPage({ stories, content }: { stories: Story[]; content: NGOStoriesContent }) {
  const { galleryImages, impactQuotes } = content;
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  const featured = stories.slice(0, 2);
  const rest = stories.slice(2);

  return (
    <div className="bg-white text-zinc-900 overflow-x-hidden">

      {/* ──── HERO ──── */}
      <section ref={heroRef} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Parallax bg */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <Image
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80"
            alt="Community charity"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-[#2e7d5b]/15" />
        </motion.div>

        {/* Floating charity images */}
        {galleryImages.slice(0, 4).map((img, i) => {
          const positions = [
            "top-[12%] left-[4%] w-24 h-24 sm:w-32 sm:h-32 rotate-[-6deg]",
            "top-[8%] right-[5%] w-20 h-28 sm:w-28 sm:h-36 rotate-[4deg]",
            "bottom-[18%] left-[6%] w-20 h-20 sm:w-28 sm:h-28 rotate-[3deg]",
            "bottom-[12%] right-[4%] w-24 h-24 sm:w-32 sm:h-32 rotate-[-5deg]",
          ];
          return (
            <motion.div
              key={i}
              className={`absolute ${positions[i]} rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl hidden sm:block`}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 + i * 0.15, ease }}
            >
              <motion.div
                animate={{ y: [0, -8 - i * 2, 0], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="150px" />
              </motion.div>
            </motion.div>
          );
        })}

        {/* Floating chess pieces */}
        <motion.div
          className="absolute top-[30%] left-[20%] text-5xl opacity-15 text-white pointer-events-none"
          animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >♟</motion.div>
        <motion.div
          className="absolute bottom-[35%] right-[18%] text-4xl opacity-10 text-white pointer-events-none"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >♛</motion.div>

        {/* Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/80 text-xs font-bold uppercase tracking-[0.2em] mb-8">
              <span className="w-2 h-2 rounded-full bg-[#5cc99a] animate-pulse" />
              Stories of Impact
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
          >
            {content.heading}
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-white/55 text-lg sm:text-xl leading-relaxed mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          >
            {content.subtitle}
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-6 text-white/40 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, ease }}
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5cc99a]" />
              {stories.length} {stories.length === 1 ? "Story" : "Stories"}
            </span>
            <span className="w-px h-4 bg-white/20" />
            <span>Updated regularly</span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/25 flex justify-center">
            <motion.div
              className="w-1.5 h-3 rounded-full bg-white/40 mt-2"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ──── IMPACT QUOTES MARQUEE ──── */}
      <section className="py-8 bg-[#2e7d5b] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-conic-gradient(rgba(255,255,255,0.08) 0% 25%, transparent 0% 50%)`,
          backgroundSize: "30px 30px",
        }} />
        <div className="relative flex gap-12 animate-scroll-x whitespace-nowrap">
          {[...impactQuotes, ...impactQuotes].map((q, i) => (
            <div key={i} className="flex items-center gap-4 min-w-max px-6">
              <span className="text-white/30 text-3xl font-black">&ldquo;</span>
              <div>
                <p className="text-white/80 text-sm font-medium italic">{q.quote}</p>
                <p className="text-white/40 text-xs mt-0.5">— {q.name}, {q.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──── FEATURED STORIES ──── */}
      {featured.length > 0 && (
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <AnimSection className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-4">
                Featured
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight">
                Spotlight Stories
              </h2>
            </AnimSection>

            <div className="space-y-12">
              {featured.map((s, i) => (
                <FeaturedStoryCard key={s.id} story={s} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──── CHARITY PHOTO GALLERY ──── */}
      <section className="py-16 sm:py-20 bg-zinc-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2e7d5b]/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4">
          <AnimSection className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-4">
              Gallery
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight mb-3">
              Moments That Matter
            </h2>
            <p className="max-w-xl mx-auto text-zinc-500 text-base">
              Snapshots from our programs, tournaments, and community events across Ghana.
            </p>
          </AnimSection>

          {/* Masonry-style grid */}
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
            {galleryImages.map((img, i) => {
              const heights = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]", "aspect-square", "aspect-[5/4]", "aspect-[3/4]", "aspect-square"];
              return (
                <AnimSection key={img.src} delay={i * 0.08}>
                  <motion.div
                    className={`relative ${heights[i]} rounded-2xl overflow-hidden group break-inside-avoid`}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <motion.div
                      className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0"
                    >
                      <span className="text-white text-xs font-semibold">{img.alt}</span>
                    </motion.div>
                  </motion.div>
                </AnimSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── MORE STORIES GRID ──── */}
      {rest.length > 0 && (
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <AnimSection className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-4">
                More Stories
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight">
                From Our Community
              </h2>
            </AnimSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {rest.map((s, i) => (
                <StoryGridCard key={s.id} story={s} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──── EMPTY STATE ──── */}
      {stories.length === 0 && (
        <section className="py-32 bg-white text-center">
          <AnimSection>
            <motion.div
              className="text-7xl mb-6"
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              📖
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-3">Stories Coming Soon</h2>
            <p className="text-zinc-500 max-w-md mx-auto mb-8">
              We&apos;re collecting and writing stories from our beneficiaries. Check back soon for inspiring stories of impact.
            </p>
            <Link
              href="/ngo/programs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2e7d5b] text-white font-bold text-sm hover:bg-[#3a9970] transition-all hover:scale-105"
            >
              Explore Our Programs
            </Link>
          </AnimSection>
        </section>
      )}

      {/* ──── TESTIMONIALS ──── */}
      <section className="py-20 sm:py-24 bg-zinc-50 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2e7d5b]/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-4">
          <AnimSection className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-4">
              In Their Words
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight">
              Voices of Change
            </h2>
          </AnimSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {impactQuotes.map((q, i) => (
              <AnimSection key={q.name} delay={i * 0.15}>
                <motion.div
                  className="relative bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 hover:shadow-xl transition-all duration-500 h-full flex flex-col"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4, ease }}
                >
                  {/* Quote mark */}
                  <div className="absolute -top-4 left-8 w-10 h-10 rounded-xl bg-[#2e7d5b] flex items-center justify-center text-white text-xl font-black shadow-lg shadow-[#2e7d5b]/30">
                    &ldquo;
                  </div>

                  <p className="text-zinc-600 text-base leading-relaxed italic mt-4 mb-8 flex-1">
                    &ldquo;{q.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                    <div className="w-12 h-12 rounded-full bg-[#d4ede3] flex items-center justify-center text-xl">
                      ♟
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 text-sm">{q.name}</p>
                      <p className="text-zinc-400 text-xs">{q.location}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ──── LARGE CHARITY IMAGE BREAK ──── */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1600&q=80"
          alt="Volunteers and children"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 bg-[#2e7d5b]/10" />

        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <AnimSection>
            <motion.div
              className="text-5xl sm:text-6xl mb-4"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              💚
            </motion.div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
              Be Part of the{" "}
              <span className="bg-gradient-to-r from-[#5cc99a] to-[#8ce8be] bg-clip-text text-transparent">Story</span>
            </h2>
            <p className="text-white/50 text-base sm:text-lg max-w-lg mx-auto">
              Your support writes the next chapter for hundreds of children across Ghana.
            </p>
          </AnimSection>
        </div>
      </section>

      {/* ──── CTA ──── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimSection>
            <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 tracking-tight mb-4">
              Help Us Write More Stories
            </h2>
            <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Every donation, every volunteer hour, every shared story helps us reach one more child. Get involved today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/ngo/donate"
                className="group px-8 py-4 rounded-full bg-[#2e7d5b] hover:bg-[#3a9970] text-white font-bold text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-[#2e7d5b]/20"
              >
                <span className="flex items-center gap-2">
                  💚 Donate Now
                  <motion.span className="inline-block" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
                </span>
              </Link>
              <Link
                href="/ngo/volunteer"
                className="px-8 py-4 rounded-full border-2 border-zinc-200 text-zinc-700 font-bold text-base hover:border-[#2e7d5b] hover:text-[#2e7d5b] transition-all duration-300 hover:scale-105"
              >
                🤲 Volunteer
              </Link>
              <Link
                href="/ngo/apply"
                className="px-8 py-4 rounded-full border-2 border-zinc-200 text-zinc-700 font-bold text-base hover:border-[#2e7d5b] hover:text-[#2e7d5b] transition-all duration-300 hover:scale-105"
              >
                🤝 Partner with Us
              </Link>
            </div>
          </AnimSection>
        </div>
      </section>
    </div>
  );
}
