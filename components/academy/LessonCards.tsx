"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { AcademyLesson } from "@/lib/academy-content";

/* ── gradient accents per-item ── */
const gradients = [
  "from-amber-500 to-orange-500",
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-red-500",
  "from-cyan-500 to-blue-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-purple-500",
  "from-teal-500 to-emerald-500",
];

const bgGradients = [
  "from-amber-500/10 to-orange-500/5",
  "from-blue-500/10 to-cyan-500/5",
  "from-purple-500/10 to-pink-500/5",
  "from-emerald-500/10 to-teal-500/5",
  "from-rose-500/10 to-red-500/5",
  "from-cyan-500/10 to-blue-500/5",
  "from-orange-500/10 to-amber-500/5",
  "from-pink-500/10 to-purple-500/5",
  "from-teal-500/10 to-emerald-500/5",
];

/* ── Backdrop overlay ── */
function Backdrop({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999]"
    />
  );
}

/* ── Detail Modal ── */
function LessonDetail({
  lesson,
  index,
  onClose,
}: {
  lesson: AcademyLesson;
  index: number;
  onClose: () => void;
}) {
  const grad = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-x-[15%] lg:inset-y-[8%] z-[10000] overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-black/10"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all text-lg"
      >
        ✕
      </button>

      {/* Hero area with image or gradient */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        {lesson.image ? (
          <>
            <Image
              src={lesson.image}
              alt={lesson.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${bgGradients[index % bgGradients.length]}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
          </div>
        )}

        {/* Icon + title overlay */}
        <div className="absolute bottom-6 left-6 right-16">
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              lesson.category === "institutional"
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20"
            }`}>
              {lesson.category === "institutional" ? "Institutional" : "Core Program"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-5xl drop-shadow-lg">{lesson.icon}</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              {lesson.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-10 pb-10 pt-6">
        {/* Short desc */}
        <p className="text-gray-500 text-base leading-relaxed mb-6 font-medium">
          {lesson.desc}
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

        {/* Long description */}
        <div className="prose max-w-none">
          <p className="text-gray-400 text-[15px] leading-[1.8] whitespace-pre-line">
            {lesson.longDesc || lesson.desc}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href={`/academy/enquire?program=${encodeURIComponent(lesson.title)}`}
            className={`group relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all overflow-hidden`}
          >
            <span className={`absolute inset-0 bg-gradient-to-r ${grad} group-hover:opacity-90 transition-opacity`} />
            <span className="relative z-10 text-white">Enquire About This Program</span>
            <span className="relative z-10 text-white/60 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 font-semibold text-sm transition-all"
          >
            Back to All Lessons
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Component ── */
export default function LessonCards({ lessons }: { lessons: AcademyLesson[] }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const coreLessons = lessons.filter((l) => l.category === "core");
  const institutional = lessons.filter((l) => l.category === "institutional");

  return (
    <>
      {/* Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <>
            <Backdrop onClick={() => setSelectedIdx(null)} />
            <LessonDetail
              lesson={lessons[selectedIdx]}
              index={selectedIdx}
              onClose={() => setSelectedIdx(null)}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── Core Lessons Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {coreLessons.map((lesson, i) => {
          const globalIdx = lessons.indexOf(lesson);
          const grad = gradients[globalIdx % gradients.length];
          const bgGrad = bgGradients[globalIdx % bgGradients.length];

          return (
            <motion.div
              key={lesson.title + i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={() => setSelectedIdx(globalIdx)}
                className="group w-full text-left relative rounded-2xl border border-gray-200 bg-white backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-[#c9a84c]/30 hover:shadow-xl hover:shadow-[#c9a84c]/10 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/40"
              >
                {/* Image or gradient header */}
                <div className="relative h-40 overflow-hidden">
                  {lesson.image ? (
                    <>
                      <Image
                        src={lesson.image}
                        alt={lesson.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                    </>
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${bgGrad}`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-80" />
                    </div>
                  )}
                  {/* Number badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${grad} text-white text-xs font-black shadow-lg`}>
                      {i + 1}
                    </span>
                  </div>
                  {/* Icon floating */}
                  <div className="absolute bottom-3 right-4">
                    <span className="text-4xl drop-shadow-lg group-hover:scale-110 transition-transform duration-500 inline-block">
                      {lesson.icon}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#c9a84c] transition-colors mb-2 leading-tight">
                    {lesson.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                    {lesson.desc}
                  </p>
                  {/* Read more hint */}
                  <div className="mt-4 flex items-center gap-1.5 text-[#c9a84c]/60 group-hover:text-[#c9a84c] transition-colors text-xs font-semibold">
                    <span>Learn more</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>

                {/* Bottom gradient accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${grad} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* ── Institutional Programs ── */}
      {institutional.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400/50 px-2">
              Institutional Programs
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {institutional.map((lesson, i) => {
              const globalIdx = lessons.indexOf(lesson);
              return (
                <motion.div
                  key={lesson.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    onClick={() => setSelectedIdx(globalIdx)}
                    className="group w-full text-left relative rounded-2xl border border-gray-200 bg-white backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  >
                    {/* Image or gradient header */}
                    <div className="relative h-44 overflow-hidden">
                      {lesson.image ? (
                        <>
                          <Image
                            src={lesson.image}
                            alt={lesson.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5">
                          <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-80" />
                        </div>
                      )}
                      {/* Icon */}
                      <div className="absolute bottom-4 right-5">
                        <span className="text-5xl drop-shadow-lg group-hover:scale-110 transition-transform duration-500 inline-block">
                          {lesson.icon}
                        </span>
                      </div>
                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                          Institutional
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">
                        {lesson.desc}
                      </p>
                      <div className="flex items-center gap-1.5 text-blue-400/60 group-hover:text-blue-400 transition-colors text-xs font-semibold">
                        <span>Learn more</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
