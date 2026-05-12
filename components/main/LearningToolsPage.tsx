"use client";

import { useMemo, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  ChevronRight,
  ExternalLink,
  Flame,
  GraduationCap,
  Lightbulb,
  Play,
  Puzzle,
  Sparkles,
  Star,
  Swords,
  Target,
  Zap,
} from "lucide-react";
import type {
  LearningTool,
  LearningTip,
  LearningToolsCTA,
  LearningToolsHero,
  LearningToolsShowcase,
} from "@/lib/learning-tools-content";
import {
  defaultCTA,
  defaultHero,
  defaultShowcase,
  defaultTips,
  defaultTools,
} from "@/lib/learning-tools-content";

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
  showcase?: LearningToolsShowcase;
}

const ICON_MAP: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  Target,
  BookOpen,
  Swords,
  Brain,
  GraduationCap,
  Zap,
  Lightbulb,
  Star,
  Puzzle,
  Play,
  Flame,
};

const PIECE_CHARS: Record<string, string> = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

const categories = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "practice", label: "Practice", icon: Target },
  { id: "study", label: "Study", icon: BookOpen },
  { id: "play", label: "Play", icon: Play },
];

const sampleMoves = [
  ["d4", "d5"],
  ["Nf3", "Nf6"],
  ["c4", "e6"],
  ["Nc3", "Be7"],
  ["Bg5", "O-O"],
  ["e3", "h6"],
  ["Bh4", "b6"],
  ["Bd3", "Bb7"],
];

function solutionToMoves(solution?: string) {
  return (solution || "")
    .replace(/\d+\.(\.\.)?/g, " ")
    .split(/\s+/)
    .map((move) => move.trim())
    .filter(Boolean);
}

function sideToMove(fen: string) {
  return fen.trim().split(/\s+/)[1] === "b" ? "black" : "white";
}

function buildMoveRows(moves: string[], fen: string) {
  if (moves.length === 0) return sampleMoves.map(([white, black]) => ({ white, black }));

  const rows: { white?: string; black?: string }[] = [];
  const startsWithBlack = sideToMove(fen) === "black";

  moves.forEach((move, index) => {
    const isBlackMove = startsWithBlack ? index % 2 === 0 : index % 2 === 1;
    if (!isBlackMove) {
      rows.push({ white: move });
      return;
    }

    if (rows.length === 0 || rows[rows.length - 1].black) rows.push({});
    rows[rows.length - 1].black = move;
  });

  return rows;
}

function parseFEN(fen: string): (string | null)[][] {
  const placement = fen.split(" ")[0] || "8/8/8/8/8/8/8/8";
  return placement.split("/").map((row) => {
    const squares: (string | null)[] = [];
    for (const ch of row) {
      if (/\d/.test(ch)) {
        for (let j = 0; j < Number(ch); j += 1) squares.push(null);
      } else {
        squares.push(ch);
      }
    }
    return squares.slice(0, 8);
  });
}

function Board({ fen }: { fen: string }) {
  const board = parseFEN(fen);
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

  return (
    <div className="relative aspect-square overflow-hidden rounded-sm bg-[#b88762] shadow-2xl shadow-zinc-900/15 ring-1 ring-zinc-200">
      <div className="grid h-full w-full grid-cols-8">
        {board.flat().map((piece, i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          const light = (row + col) % 2 === 0;
          const highlight = i === 27 || i === 36;

          return (
            <div
              key={i}
              className={`relative flex aspect-square items-center justify-center ${
                light ? "bg-[#f0d9b5]" : "bg-[#b88762]"
              }`}
            >
              {highlight && <span className="absolute inset-0 bg-[#ced26a]/55" />}
              {col === 0 && (
                <span className={`absolute left-1 top-0.5 text-[10px] font-bold ${light ? "text-[#b88762]" : "text-[#f0d9b5]"}`}>
                  {8 - row}
                </span>
              )}
              {row === 7 && (
                <span className={`absolute bottom-0.5 right-1 text-[10px] font-bold ${light ? "text-[#b88762]" : "text-[#f0d9b5]"}`}>
                  {files[col]}
                </span>
              )}
              {piece && (
                <span
                  className={`relative z-10 select-none text-[clamp(2rem,7vw,4.6rem)] leading-none ${
                    piece === piece.toUpperCase()
                      ? "text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]"
                      : "text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.45)]"
                  }`}
                >
                  {PIECE_CHARS[piece]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ToolRow({ tool, index }: { tool: LearningTool; index: number }) {
  const Icon = ICON_MAP[tool.icon] ?? Puzzle;

  return (
    <a
      href={tool.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 border-b border-zinc-100 px-4 py-3 transition-colors hover:bg-[#fff8e8]"
    >
      <span className="text-xs tabular-nums text-zinc-400">{String(index + 1).padStart(2, "0")}</span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <Icon size={15} className="shrink-0 text-[#b58b20]" />
          <span className="truncate text-sm font-semibold text-zinc-800 group-hover:text-[#9a6900]">{tool.title}</span>
        </span>
        <span className="mt-0.5 block truncate text-xs text-zinc-500">{tool.stats || tool.category}</span>
      </span>
      <ExternalLink size={14} className="text-zinc-300 transition-colors group-hover:text-[#b58b20]" />
    </a>
  );
}

export default function LearningToolsPage({
  puzzle,
  hero: heroData,
  tools: toolsData,
  tips: tipsData,
  cta: ctaData,
  showcase: showcaseData,
}: LearningToolsPageProps) {
  const hero = heroData ?? defaultHero;
  const toolsList = toolsData ?? defaultTools;
  const tipsList = tipsData ?? defaultTips;
  const cta = ctaData ?? defaultCTA;
  const showcase = showcaseData ?? defaultShowcase;

  const [activeCategory, setActiveCategory] = useState("all");
  const [showSolution, setShowSolution] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  const filteredTools = useMemo(
    () => (activeCategory === "all" ? toolsList : toolsList.filter((tool) => tool.category === activeCategory)),
    [activeCategory, toolsList],
  );

  const puzzleFen = puzzle?.fen || "rnbqkbnr/pppppppp/8/8/3Pp3/8/PPP2PPP/RNBQKBNR b KQkq d3 0 2";
  const selectedTip = tipsList[tipIndex] ?? tipsList[0];
  const solutionMoves = useMemo(() => solutionToMoves(puzzle?.solution), [puzzle?.solution]);
  const moveRows = useMemo(() => buildMoveRows(solutionMoves, puzzleFen), [puzzleFen, solutionMoves]);
  const activeMove = solutionMoves[currentMoveIndex];

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-zinc-900">
      <section className="relative overflow-hidden px-4 pb-12 pt-24 sm:px-6 sm:pt-28 lg:pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,191,135,0.34),transparent_34%),linear-gradient(180deg,#fffaf0_0%,#f6f3ec_58%,#efe9dc_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/80 to-transparent" />

        <div className="relative mx-auto max-w-[1680px]">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#dcc581]/50 bg-white/75 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#9a6900] shadow-sm">
                <Puzzle size={14} />
                Daily board
              </div>
              <h1 className="text-4xl font-black leading-[1.02] tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
                {hero.title} <span className="text-[#c9a84c]">{hero.highlight}</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">{hero.subtitle}</p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
              {categories.map((category) => {
                const Icon = category.icon;
                const active = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition-colors ${
                      active
                        ? "bg-[#2f8de4] text-white shadow-lg shadow-[#2f8de4]/25"
                        : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <Icon size={15} />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 lg:gap-5 xl:grid-cols-[minmax(260px,0.68fr)_minmax(500px,1.12fr)_minmax(300px,0.82fr)]">
            <aside className="order-3 space-y-4 xl:order-1">
              <div className="rounded-md bg-white p-5 shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-200">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-[#f2ead8] text-3xl text-[#9a6900]">
                    ♞
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">
                      Puzzle <span className="font-bold text-[#2f8de4]">#{puzzle?.id ?? "daily"}</span>
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-zinc-950">{puzzle?.title || "Board Vision Drill"}</h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      Rating: <span className="text-zinc-700">{puzzle?.difficulty || "hidden"}</span>
                    </p>
                    {puzzle?.date && (
                      <p className="mt-1 text-xs font-medium text-zinc-400">
                        {new Date(puzzle.date).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="my-5 h-px bg-zinc-100" />
                <p className="text-sm leading-6 text-zinc-600">
                  {puzzle?.description || "Train calculation, tactics, openings, and board vision from one focused chess desk."}
                </p>
              </div>

              <div className="rounded-md bg-white p-5 shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-200">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-900">Training focus</span>
                  <span className="rounded-full bg-[#d6bf87]/25 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8b650c]">
                    {activeCategory}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-md bg-zinc-50 p-3 ring-1 ring-zinc-100">
                    <p className="text-2xl font-black text-zinc-950">{toolsList.length}</p>
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500">Tools</p>
                  </div>
                  <div className="rounded-md bg-zinc-50 p-3 ring-1 ring-zinc-100">
                    <p className="text-2xl font-black text-zinc-950">{tipsList.length}</p>
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500">Tips</p>
                  </div>
                  <div className="rounded-md bg-zinc-50 p-3 ring-1 ring-zinc-100">
                    <p className="text-2xl font-black text-zinc-950">8x8</p>
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500">Board</p>
                  </div>
                </div>
              </div>

              <Link
                href={cta.primaryHref}
                className="flex items-center justify-between rounded-md border border-[#2f8de4]/25 bg-white px-5 py-4 text-sm font-bold text-[#1769b9] shadow-lg shadow-zinc-900/5 transition-colors hover:bg-[#edf6ff]"
              >
                {cta.primaryLabel}
                <ArrowRight size={16} />
              </Link>
            </aside>

            <main className="order-1 min-w-0 xl:order-2">
              <Board fen={puzzleFen} />
              <div className="mt-4 grid grid-cols-4 gap-2 text-zinc-500 sm:flex sm:items-center sm:justify-center sm:gap-3">
                <button
                  onClick={() => setCurrentMoveIndex(0)}
                  className="rounded-md bg-white px-3 py-2 text-sm font-bold ring-1 ring-zinc-200 hover:bg-zinc-50 disabled:opacity-40"
                  disabled={currentMoveIndex === 0}
                >
                  |&lt;
                </button>
                <button
                  onClick={() => setCurrentMoveIndex((value) => Math.max(value - 1, 0))}
                  className="rounded-md bg-white px-3 py-2 text-sm font-bold ring-1 ring-zinc-200 hover:bg-zinc-50 disabled:opacity-40"
                  disabled={currentMoveIndex === 0}
                >
                  &lt;
                </button>
                <button
                  onClick={() => {
                    setShowSolution(true);
                    setCurrentMoveIndex((value) => Math.min(value + 1, Math.max(solutionMoves.length - 1, 0)));
                  }}
                  className="rounded-md bg-[#2f8de4] px-3 py-2 text-sm font-bold text-white hover:bg-[#217ad0] disabled:opacity-40"
                  disabled={solutionMoves.length === 0 || currentMoveIndex >= solutionMoves.length - 1}
                >
                  &gt;
                </button>
                <button
                  onClick={() => {
                    setShowSolution(true);
                    setCurrentMoveIndex(Math.max(solutionMoves.length - 1, 0));
                  }}
                  className="rounded-md bg-white px-3 py-2 text-sm font-bold ring-1 ring-zinc-200 hover:bg-zinc-50 disabled:opacity-40"
                  disabled={solutionMoves.length === 0 || currentMoveIndex >= solutionMoves.length - 1}
                >
                  &gt;|
                </button>
              </div>
            </main>

            <aside className="order-2 overflow-hidden rounded-md bg-white shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-200 xl:order-3">
              <div className="grid max-h-[18rem] grid-cols-2 overflow-y-auto border-b border-zinc-100 sm:max-h-[22rem]">
                {moveRows.map((row, i) => {
                  const whiteIndex = sideToMove(puzzleFen) === "black" ? i * 2 - 1 : i * 2;
                  const blackIndex = sideToMove(puzzleFen) === "black" ? i * 2 : i * 2 + 1;
                  return (
                  <div key={`${row.white || "-"}-${row.black || "-"}-${i}`} className="contents">
                    <div className={`flex gap-3 px-4 py-2 ${currentMoveIndex === whiteIndex && showSolution ? "bg-[#fff4cf] text-[#8b650c]" : "text-zinc-700"}`}>
                      <span className="w-5 text-sm text-zinc-400">{i + 1}</span>
                      <span className="text-lg">{row.white || "..."}</span>
                    </div>
                    <div className={`px-4 py-2 text-lg ${currentMoveIndex === blackIndex && showSolution ? "bg-[#fff4cf] text-[#8b650c]" : "text-zinc-700"}`}>
                      {row.black || "..."}
                    </div>
                  </div>
                );})}
              </div>

              <div className="border-b border-zinc-100 p-6">
                <div className="flex items-center gap-4">
                  <span className="text-5xl leading-none">♚</span>
                  <div>
                    <h2 className="text-2xl font-black text-zinc-950">Your turn</h2>
                    <p className="mt-1 text-sm text-zinc-500">Find the strongest continuation.</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowSolution((value) => !value)}
                    className="inline-flex items-center gap-2 rounded-md bg-[#2f8de4] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#217ad0]"
                  >
                    {showSolution ? "Hide line" : "Show line"}
                    <ChevronRight size={15} className={showSolution ? "rotate-90 transition-transform" : "transition-transform"} />
                  </button>
                  <button
                    onClick={() => setTipIndex((value) => (value + 1) % Math.max(tipsList.length, 1))}
                    className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-200"
                  >
                    Next tip
                  </button>
                </div>
                <AnimatePresence>
                  {showSolution && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-4 rounded-md border border-[#d6bf87]/45 bg-[#fff8e8] p-4"
                    >
                      <p className="text-xs font-bold uppercase tracking-widest text-[#9a6900]">Current move</p>
                      <p className="mt-1 font-mono text-lg font-black text-zinc-950">
                        {activeMove ? `${currentMoveIndex + 1}. ${activeMove}` : puzzle?.solution || "Use the tool list to continue training."}
                      </p>
                      {puzzle?.solution && (
                        <p className="mt-2 text-xs font-medium text-zinc-600">Full line: {puzzle.solution}</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Learning tools</span>
                  <span className="text-xs font-bold text-zinc-500">{filteredTools.length}</span>
                </div>
                <div className="max-h-[21rem] overflow-y-auto">
                  {filteredTools.map((tool, index) => (
                    <ToolRow key={tool.id} tool={tool} index={index} />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a6900]">Study room</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">{showcase.title}</h2>
            <p className="mt-4 max-w-xl leading-7 text-zinc-600">{showcase.subtitle}</p>
          </div>
          <div className="overflow-hidden rounded-md bg-zinc-100 shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={showcase.image} alt={showcase.title} className="h-72 w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-md bg-white p-6 shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-200 sm:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-[#f2ead8] text-3xl">
                {selectedTip?.icon || "♟"}
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Coach note</p>
                <p className="mt-2 text-lg font-semibold leading-7 text-zinc-800">{selectedTip?.tip}</p>
              </div>
            </div>
            <div className="flex gap-2 md:justify-end">
              {tipsList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTipIndex(i)}
                  className={`h-2.5 rounded-full transition-all ${i === tipIndex ? "w-8 bg-[#c9a84c]" : "w-2.5 bg-zinc-200 hover:bg-zinc-300"}`}
                  aria-label={`Show tip ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-md bg-gradient-to-br from-[#f7df9c] to-[#d2aa45] p-8 text-[#17130d] shadow-xl shadow-zinc-900/10 sm:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight">{cta.heading}</h2>
              <p className="mt-2 max-w-2xl font-medium text-[#352611]/80">{cta.subtitle}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={cta.primaryHref} className="inline-flex items-center justify-center gap-2 rounded-md bg-[#17130d] px-5 py-3 text-sm font-black text-white">
                {cta.primaryLabel}
                <ArrowRight size={16} />
              </Link>
              <Link href={cta.secondaryHref} className="inline-flex items-center justify-center gap-2 rounded-md bg-white/55 px-5 py-3 text-sm font-black">
                {cta.secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
