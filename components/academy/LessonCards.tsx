"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import {
  getLessonAudienceTab,
  type AcademyAudienceTab,
  type AcademyLesson,
} from "@/lib/academy-content";
import { getAcademyLessonDetails } from "@/lib/academy-program-details";
import { buildLessonWhatsAppUrl } from "@/lib/whatsapp";

/* ── Audience Tabs ── */
const AUDIENCE_TABS: {
  id: AcademyAudienceTab;
  label: string;
  helper: string;
}[] = [
  {
    id: "kids",
    label: "Kids & Teens",
    helper: "Fun, structured weekly classes for ages 5–17 — tap WhatsApp on any program for current class times and fees.",
  },
  {
    id: "adults",
    label: "Adults & 1-on-1",
    helper: "Relaxed beginner courses and flexible 1-on-1 personal coaching — message us on WhatsApp for fees and open slots.",
  },
  {
    id: "schools",
    label: "Schools & Companies",
    helper: "Complete after-school clubs, coaches, equipment, and team chess workshops across Ghana.",
  },
];

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
  const details = getAcademyLessonDetails(lesson);
  const whatsAppHref = buildLessonWhatsAppUrl({ program: lesson.title });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 16 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-x-[15%] lg:inset-y-[8%] z-[10000] overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-black/20"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close program details"
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all text-lg font-bold"
      >
        ✕
      </button>

      <div className="relative h-48 sm:h-60 overflow-hidden">
        {lesson.image ? (
          <>
            <Image src={lesson.image} alt={lesson.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${bgGradients[index % bgGradients.length]}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
          </div>
        )}

        <div className="absolute bottom-6 left-6 right-16">
          <div className="flex items-center gap-4">
            <span className="text-4xl sm:text-5xl">{lesson.icon}</span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              {lesson.title}
            </h2>
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-10 pb-10 pt-4">
        <p className="text-gray-600 text-base leading-relaxed mb-6 font-medium">
          {lesson.desc}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            ["Age", details.ageRange],
            ["Level", details.level],
            ["Format", details.format],
            ["Schedule", details.duration],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
              <p className="mt-1 text-sm font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[#c9a84c]/25 bg-[#c9a84c]/10 p-4 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#8a6b18]">Best for</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-gray-800">{details.bestFor}</p>
        </div>

        <div className="h-px bg-gray-100 mb-6" />

        <p className="text-gray-600 text-[15px] leading-[1.8] whitespace-pre-line">
          {lesson.longDesc || lesson.desc}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href={whatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-gray-950 text-sm sm:text-base font-black transition-all shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            Ask About Fees &amp; Class Times on WhatsApp →
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3.5 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-semibold text-sm transition-all"
          >
            Back to Programs
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Component ── */
export default function LessonCards({
  lessons,
  initialTab = "kids",
}: {
  lessons: AcademyLesson[];
  initialTab?: AcademyAudienceTab;
}) {
  const [activeTab, setActiveTab] = useState<AcademyAudienceTab>(initialTab);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("tab");
    if (param === "kids" || param === "adults" || param === "schools") {
      setActiveTab(param);
    }
  }, []);

  const visibleLessons = lessons.filter((l) => getLessonAudienceTab(l) === activeTab);
  const activeMeta = AUDIENCE_TABS.find((t) => t.id === activeTab) ?? AUDIENCE_TABS[0];

  return (
    <>
      <AnimatePresence>
        {selectedIdx !== null && lessons[selectedIdx] && (
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

      {/* 3 Simple Audience Tabs */}
      <div className="mb-10 text-center">
        <div
          role="tablist"
          aria-label="Academy program groups"
          className="inline-flex flex-wrap justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm"
        >
          {AUDIENCE_TABS.map((tab) => {
            const count = lessons.filter((l) => getLessonAudienceTab(l) === tab.id).length;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black transition-all ${
                  isActive
                    ? "bg-gray-950 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    isActive ? "bg-[#c9a84c] text-gray-950" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-gray-600 max-w-xl mx-auto">{activeMeta.helper}</p>
      </div>

      {/* Program Cards for the Selected Tab */}
      <div className={`grid grid-cols-1 gap-6 ${visibleLessons.length === 2 ? "md:grid-cols-2 max-w-4xl mx-auto" : "sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto"}`}>
        {visibleLessons.map((lesson, i) => {
          const globalIdx = lessons.indexOf(lesson);
          const grad = gradients[globalIdx % gradients.length];
          const bgGrad = bgGradients[globalIdx % bgGradients.length];
          const details = getAcademyLessonDetails(lesson);
          const whatsAppHref = buildLessonWhatsAppUrl({ program: lesson.title });

          return (
            <div
              key={`${activeTab}-${lesson.title}-${i}`}
              className="group flex flex-col justify-between relative rounded-3xl border border-gray-200 bg-white overflow-hidden transition-all duration-300 hover:border-[#c9a84c]/50 hover:shadow-xl"
            >
              {/* Clickable Top Header to Open Program Details */}
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedIdx(globalIdx)}
                  className="w-full text-left focus:outline-none"
                >
                  <div className="relative h-36 overflow-hidden">
                    {lesson.image ? (
                      <>
                        <Image
                          src={lesson.image}
                          alt={lesson.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
                      </>
                    ) : (
                      <div className={`h-full w-full bg-gradient-to-br ${bgGrad}`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-80" />
                      </div>
                    )}
                    <div className="absolute top-3 left-4">
                      <span className="inline-flex items-center rounded-full bg-white/95 border border-gray-200 px-3 py-1 text-[11px] font-bold text-gray-800 shadow-sm">
                        {details.ageRange}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-4">
                      <span className="text-4xl inline-block group-hover:scale-110 transition-transform duration-300">
                        {lesson.icon}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 pt-4">
                    <h3 className="text-xl font-black text-gray-900 group-hover:text-[#a77d1b] transition-colors mb-2 leading-tight">
                      {lesson.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {lesson.desc}
                    </p>
                  </div>
                </button>

                <div className="px-6 pt-4 grid grid-cols-2 gap-2">
                  <span className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2 text-[11px] font-bold text-gray-600">
                    Level: {details.level}
                  </span>
                  <span className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2 text-[11px] font-bold text-gray-600">
                    {details.format}
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp + Details Row */}
              <div className="p-6 pt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <a
                  href={whatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 hover:bg-[#25D366] text-white hover:text-gray-950 px-4 py-3 text-xs font-bold transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Ask Fees &amp; Times on WhatsApp →
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedIdx(globalIdx)}
                  className="rounded-xl border border-gray-200 hover:border-gray-300 bg-white px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Read Details
                </button>
              </div>

              <div className={`h-[2px] w-full bg-gradient-to-r ${grad} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          );
        })}
      </div>
    </>
  );
}
