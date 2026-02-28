"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { AcademyLesson } from "@/lib/academy-content";

/* ── gradient accents per-item ── */
const gradients = [
  "from-amber-500/30 via-amber-500/10 to-transparent",
  "from-blue-500/30 via-blue-500/10 to-transparent",
  "from-purple-500/30 via-purple-500/10 to-transparent",
  "from-emerald-500/30 via-emerald-500/10 to-transparent",
  "from-rose-500/30 via-rose-500/10 to-transparent",
  "from-cyan-500/30 via-cyan-500/10 to-transparent",
  "from-orange-500/30 via-orange-500/10 to-transparent",
  "from-pink-500/30 via-pink-500/10 to-transparent",
  "from-teal-500/30 via-teal-500/10 to-transparent",
];

export default function LessonAccordion({ lessons }: { lessons: AcademyLesson[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const coreLessons = lessons.filter((l) => l.category === "core");
  const institutional = lessons.filter((l) => l.category === "institutional");

  return (
    <>
      {/* ── Core Lessons ── */}
      <div className="space-y-3">
        {coreLessons.map((lesson, i) => {
          const isOpen = openIdx === i;
          const grad = gradients[i % gradients.length];
          return (
            <div key={lesson.title + i}>
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className={`w-full text-left rounded-2xl border transition-all duration-300 overflow-hidden backdrop-blur-sm group ${
                  isOpen
                    ? "border-amber-500/25 bg-[#0f1628]/95 shadow-lg shadow-amber-500/5"
                    : "border-white/[0.06] bg-[#0f1628]/70 hover:border-white/[0.12] hover:bg-[#0f1628]/90"
                }`}
              >
                {/* Gradient top accent (visible when open) */}
                <div
                  className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${grad} transition-opacity duration-500 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                />

                <div className="relative px-6 py-5 flex items-center justify-between gap-4">
                  {/* Left: number + icon + title */}
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="shrink-0 w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-xs font-black text-amber-400/80">
                      {i + 1}
                    </span>
                    <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {lesson.icon}
                    </span>
                    <span className="text-base font-bold text-white truncate group-hover:text-amber-200 transition-colors">
                      {lesson.title}
                    </span>
                  </div>

                  {/* Right: chevron */}
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 text-white/30 text-lg"
                  >
                    ▾
                  </motion.span>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 ml-12">
                      <p className="text-white/45 text-sm leading-relaxed mb-5">
                        {lesson.desc}
                      </p>
                      <Link
                        href={`/academy/enquire?program=${encodeURIComponent(lesson.title)}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-bold hover:from-amber-300 hover:to-orange-400 transition-all hover:shadow-lg hover:shadow-amber-500/20"
                      >
                        Enquire About This Program
                        <span className="text-black/60">→</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* ── Institutional Programs ── */}
      {institutional.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/30">
              Institutional Programs
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {institutional.map((lesson, i) => (
              <div
                key={lesson.title}
                className="relative group rounded-2xl border border-white/[0.06] bg-[#0f1628]/80 backdrop-blur-sm p-6 transition-all duration-500 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5 overflow-hidden"
              >
                {/* Gradient accent */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500/40 via-blue-400/20 to-transparent" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-y-8 translate-x-8" />

                <div className="relative z-10">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {lesson.icon}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-white/40 text-sm leading-relaxed mt-1">{lesson.desc}</p>
                    </div>
                  </div>
                  <Link
                    href={`/academy/enquire?program=${encodeURIComponent(lesson.title)}`}
                    className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-full border border-blue-400/30 text-blue-300 text-xs font-bold hover:bg-blue-500/10 transition-all"
                  >
                    Enquire About This Program <span className="opacity-60">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
