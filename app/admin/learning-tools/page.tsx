import { getSiteContent } from "@/lib/actions/admin";
import LearningToolsContentEditor from "@/components/admin/LearningToolsContentEditor";
import Link from "next/link";
import prisma from "@/lib/prisma";
import type {
  LearningPuzzle, LearningToolsHero, LearningTool, LearningTip, LearningToolsCTA, LearningToolsShowcase,
} from "@/lib/learning-tools-content";

export const metadata = { title: "Learning Tools | Admin" };

async function getLearningPuzzles() {
  try {
    return await (prisma as any).daily_Puzzle.findMany({ orderBy: { date: "desc" }, take: 30 });
  } catch {
    return [];
  }
}

export default async function AdminLearningToolsPage() {
  const keys = ["learning_hero", "learning_tools", "learning_tips", "learning_cta", "learning_showcase"];
  const [results, puzzles] = await Promise.all([
    Promise.all(keys.map((k) => getSiteContent(k))),
    getLearningPuzzles(),
  ]);

  const parse = <T,>(raw: string | null): T | undefined => {
    if (!raw) return undefined;
    try { return JSON.parse(raw) as T; } catch { return undefined; }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Learning Tools</h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Manage the board hero, right-side tool panel, coach notes, showcase, and call-to-action.
          </p>
        </div>
        <Link
          href="/learning-tools"
          className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-zinc-800"
        >
          Preview page
        </Link>
      </div>

      <LearningToolsContentEditor
        initialHero={parse<LearningToolsHero>(results[0])}
        initialTools={parse<LearningTool[]>(results[1])}
        initialTips={parse<LearningTip[]>(results[2])}
        initialCTA={parse<LearningToolsCTA>(results[3])}
        initialShowcase={parse<LearningToolsShowcase>(results[4])}
        initialPuzzles={puzzles.map((p: any): LearningPuzzle => ({
          id: p.id,
          fen: p.fen,
          solution: p.solution,
          difficulty: p.difficulty,
          date: p.date.toISOString(),
          title: p.title,
          description: p.description,
          published: p.published,
        }))}
      />
    </div>
  );
}
