"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const pillars = [
  {
    icon: "♟",
    title: "Free Equipment",
    desc: "Chess sets and boards distributed to communities in need across Ghana.",
  },
  {
    icon: "🏫",
    title: "School Programs",
    desc: "In-school chess education at no cost, reaching hundreds of students.",
  },
  {
    icon: "🎓",
    title: "Scholarships",
    desc: "Pathways to funded PiChess Academy training for talented youth.",
  },
  {
    icon: "🤝",
    title: "Mentorship",
    desc: "Connecting young players with experienced chess role models.",
  },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function NGOMission() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="mission" ref={ref} className="relative overflow-hidden">
      {/* Full-width background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=1600&q=80"
          alt="Children playing chess in community"
          fill
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/80" />
        {/* Green tint */}
        <div className="absolute inset-0 bg-[#2e7d5b]/15" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        {/* Top: Label & Headline */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/80 text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#2e7d5b] animate-pulse" />
            Our Mission
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] mb-6"
          >
            Empowering Youth Through
            <br />
            <span className="bg-gradient-to-r from-[#5cc99a] via-[#2e7d5b] to-[#5cc99a] bg-clip-text text-transparent">
              the Royal Game
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="max-w-2xl mx-auto text-white/60 text-lg leading-relaxed"
          >
            We operate in underserved communities to provide free chess education,
            materials, and mentorship to children who wouldn&apos;t otherwise have access.
            Chess teaches patience, critical thinking, and resilience — skills that
            transcend the board and impact every area of life.
          </motion.p>
        </div>

        {/* Pillar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease }}
              className="group relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:border-[#2e7d5b]/40 p-6 text-center transition-all duration-300 hover:bg-white/15 hover:-translate-y-1"
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#2e7d5b]/5 blur-xl" />

              <div className="relative">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#2e7d5b]/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  {p.icon}
                </div>
                <h3 className="font-bold text-white text-base mb-2">{p.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7, ease }}
          className="text-center"
        >
          <Link
            href="/ngo/apply"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#2e7d5b] hover:bg-[#3a9970] text-white font-bold text-base transition-all duration-300 hover:scale-105 shadow-xl shadow-[#2e7d5b]/30"
          >
            Apply for Support
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
