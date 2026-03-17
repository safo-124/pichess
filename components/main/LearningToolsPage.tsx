"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Puzzle, Brain, Swords, BookOpen, Play, Target, GraduationCap,
  ChevronRight, Star, Zap, ArrowRight, ExternalLink,
  Lightbulb, Flame, Sparkles,
} from "lucide-react";
import type {
  LearningToolsHero, LearningTool, LearningTip, LearningToolsCTA,
} from "@/lib/learning-tools-content";
import {
  defaultHero, defaultTools, defaultTips, defaultCTA,
} from "@/lib/learning-tools-content";

/* ═══ Types ═══ */
interface DailyPuzzle {
  id: number;
  fen: string;
  solution: string;
  difficulty: string;
  date: string;
  title: string | null;
  description: string | null;
}

interface LearningToolsPageProps {
  puzzle: DailyPuzzle | null;
  hero?: LearningToolsHero;
  tools?: LearningTool[];
  tips?: LearningTip[];
  cta?: LearningToolsCTA;
}

/* ═══ Icon map (string key → Lucide component) ═══ */
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Target, BookOpen, Swords, Brain, GraduationCap, Zap, Lightbulb, Star, Puzzle, Play, Flame,
};

/* ═══ Animation variants ═══ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/* ═══ Chess piece map for FEN rendering ═══ */
const PIECE_CHARS: Record<string, string> = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};

function parseFEN(fen: string): (string | null)[][] {
  const rows = fen.split(" ")[0].split("/");
  return rows.map((row) => {
    const squares: (string | null)[] = [];
    for (const ch of row) {
      if (/\d/.test(ch)) {
        for (let j = 0; j < parseInt(ch); j++) squares.push(null);
      } else {
        squares.push(ch);
      }
    }
    return squares;
  });
}

/* ═══ Mini Chessboard Component ═══ */
function MiniBoard({ fen }: { fen: string }) {
  const board = parseFEN(fen);
  return (
    <div className="grid grid-cols-8 rounded-xl overflow-hidden shadow-2xl shadow-black/15 border border-gray-200">
      {board.flat().map((piece, i) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const isLight = (row + col) % 2 === 0;
        return (
          <div
            key={i}
            className={`aspect-square flex items-center justify-center text-lg sm:text-xl md:text-2xl select-none ${
              isLight ? "bg-[#f0d9b5]" : "bg-[#b58863]"
            }`}
          >
            {piece && (
              <span className={piece === piece.toUpperCase() ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" : "text-gray-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]"}>
                {PIECE_CHARS[piece]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══ Tool categories ═══ */
const categories = [
  { id: "all", label: "All Tools", icon: Sparkles },
  { id: "practice", label: "Practice", icon: Target },
  { id: "study", label: "Study", icon: BookOpen },
  { id: "play", label: "Play", icon: Play },
];

/* ═══ Main Component ═══ */
export default function LearningToolsPage({
  puzzle,
  hero: heroData,
  tools: toolsData,
  tips: tipsData,
  cta: ctaData,
}: LearningToolsPageProps) {
  const hero = heroData ?? defaultHero;
  const toolsList = toolsData ?? defaultTools;
  const tipsList = tipsData ?? defaultTips;
  const cta = ctaData ?? defaultCTA;

  const [activeCategory, setActiveCategory] = useState("all");
  const [showSolution, setShowSolution] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const filteredTools = activeCategory === "all"
    ? toolsList
    : toolsList.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ═══ HERO ═══ */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-violet-100/60 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-to-tl from-[#c9a84c]/8 to-transparent blur-3xl" />

          {/* Floating chess pieces */}
          {["♔", "♟", "♞", "♗", "♖", "♕"].map((piece, i) => (
            <motion.div
              key={i}
              className="absolute text-gray-900/[0.04] select-none"
              style={{
                fontSize: `${40 + i * 15}px`,
                top: `${10 + (i * 17) % 80}%`,
                left: `${5 + (i * 19) % 90}%`,
              }}
              animate={{
                y: [0, -20 + i * 5, 0],
                rotate: [0, i % 2 === 0 ? 8 : -8, 0],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            >
              {piece}
            </motion.div>
          ))}

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-5 leading-[1.05]"
          >
            {hero.title}{" "}
            <span className="bg-gradient-to-r from-violet-600 via-[#c9a84c] to-amber-500 bg-clip-text text-transparent">
              {hero.highlight}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#daily-puzzle"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-sm transition-all hover:scale-105 shadow-lg shadow-violet-600/25"
            >
              <Puzzle size={16} />
              Today&apos;s Puzzle
            </a>
            <a
              href="#tools"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 font-semibold text-sm transition-all hover:scale-105"
            >
              Explore Tools
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ DAILY PUZZLE ═══ */}
      <section id="daily-puzzle" className="py-16 sm:py-24 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-50/40 to-transparent pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-3">
              <Flame size={14} />
              Daily Challenge
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              Puzzle of the Day
            </h2>
          </motion.div>

          {puzzle ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="grid lg:grid-cols-2 gap-8 items-center"
            >
              {/* Board */}
              <div className="max-w-md mx-auto lg:max-w-none w-full">
                <MiniBoard fen={puzzle.fen} />
              </div>

              {/* Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-600/25">
                    <Puzzle size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{puzzle.title || "Today's Puzzle"}</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date().toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                  <span
                    className={`ml-auto text-xs font-bold px-3 py-1.5 rounded-full ${
                      puzzle.difficulty === "EASY"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : puzzle.difficulty === "HARD"
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "bg-[#c9a84c]/10 text-[#b89a3e] border border-[#c9a84c]/20"
                    }`}
                  >
                    {puzzle.difficulty}
                  </span>
                </div>

                {puzzle.description && (
                  <p className="text-gray-500 leading-relaxed">{puzzle.description}</p>
                )}

                {/* FEN display */}
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Position (FEN)</p>
                  <p className="font-mono text-sm text-gray-600 break-all leading-relaxed">{puzzle.fen}</p>
                </div>

                {/* Solution toggle */}
                <div>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-600 font-semibold text-sm transition-all"
                  >
                    {showSolution ? "Hide Solution" : "Reveal Solution"}
                    <ChevronRight
                      size={16}
                      className={`transition-transform ${showSolution ? "rotate-90" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {showSolution && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[#c9a84c]/10 to-violet-50 border border-[#c9a84c]/20">
                          <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-wider mb-1">Solution</p>
                          <p className="font-mono text-gray-900 font-bold">{puzzle.solution}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-16 rounded-3xl bg-gray-50 border border-gray-100"
            >
              <Puzzle size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 text-lg font-medium">No puzzle available today</p>
              <p className="text-gray-300 text-sm mt-1">Check back tomorrow for a new challenge!</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══ TOOLS GRID ═══ */}
      <section id="tools" className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-violet-600 uppercase tracking-widest mb-3">
              <Zap size={14} />
              Resources
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mb-3">Learning Tools</h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Free, powerful tools to accelerate your chess improvement at any level.
            </p>
          </motion.div>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25"
                      : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-gray-200"
                  }`}
                >
                  <Icon size={15} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Tools grid */}
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool, i) => {
                const Icon = ICON_MAP[tool.icon] ?? Puzzle;
                return (
                  <motion.a
                    key={tool.id}
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    layout
                    custom={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="group relative rounded-2xl bg-white hover:bg-white border border-gray-100 hover:border-gray-200 p-6 transition-all cursor-pointer shadow-sm hover:shadow-lg"
                  >
                    {/* Badge */}
                    {tool.badge && (
                      <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c9a84c]/10 text-[#b89a3e] border border-[#c9a84c]/20">
                        {tool.badge}
                      </span>
                    )}

                    {/* Icon */}
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <Icon size={20} className="text-white" />
                    </div>

                    <h3 className="font-bold text-gray-900 text-base mb-1.5 group-hover:text-[#c9a84c] transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {tool.desc}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-gray-300 uppercase tracking-wider">
                        {tool.stats}
                      </span>
                      <ExternalLink
                        size={14}
                        className="text-gray-300 group-hover:text-[#c9a84c] transition-colors"
                      />
                    </div>
                  </motion.a>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ═══ CHESS TIPS CAROUSEL ═══ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-10"
          >
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3 inline-flex items-center gap-2">
              <Lightbulb size={14} />
              Quick Tips
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">Chess Wisdom</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl bg-gray-50 border border-gray-100 p-8 sm:p-12 text-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={tipIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-6xl sm:text-7xl mb-6 inline-block opacity-20">
                  {tipsList[tipIndex]?.icon}
                </div>
                <p className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed max-w-xl mx-auto">
                  &ldquo;{tipsList[tipIndex]?.tip}&rdquo;
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dots nav */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {tipsList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTipIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === tipIndex
                      ? "bg-[#c9a84c] w-6"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='20' height='20' fill='%23fff'/%3E%3Crect x='20' y='20' width='20' height='20' fill='%23fff'/%3E%3C/svg%3E")`,
              backgroundSize: "40px 40px",
            }} />

            <div className="relative p-8 sm:p-14 text-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="text-5xl sm:text-6xl mb-5 inline-block"
              >
                ♚
              </motion.div>
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
                {cta.heading}
              </h2>
              <p className="text-white/50 max-w-lg mx-auto mb-8 text-sm sm:text-base">
                {cta.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  href={cta.primaryHref}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#c9a84c] hover:bg-[#dbb95d] text-black font-bold text-sm transition-all hover:scale-105"
                >
                  <GraduationCap size={16} />
                  {cta.primaryLabel}
                </Link>
                <Link
                  href={cta.secondaryHref}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-white/20 hover:border-white/40 text-white font-bold text-sm transition-all hover:scale-105"
                >
                  {cta.secondaryLabel}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
