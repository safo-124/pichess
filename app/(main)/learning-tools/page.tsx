import LearningToolsPage from "@/components/main/LearningToolsPage";
import prisma from "@/lib/prisma";
import { getSiteContent } from "@/lib/actions/admin";
import type {
  LearningToolsHero, LearningTool, LearningTip, LearningToolsCTA, LearningToolsShowcase,
} from "@/lib/learning-tools-content";

export const metadata = { title: "Learning Tools | PiChess" };

function parse<T>(raw: string | null): T | undefined {
  if (!raw) return undefined;
  try { return JSON.parse(raw) as T; } catch { return undefined; }
}

async function getPuzzle() {
  try {
    const p = await prisma.daily_Puzzle.findFirst({
      where: { published: true },
      orderBy: { date: "desc" },
    });
    if (!p) return null;
    return {
      id: p.id,
      fen: p.fen,
      solution: p.solution,
      difficulty: p.difficulty,
      date: p.date.toISOString(),
      title: p.title,
      description: p.description,
    };
  } catch { return null; }
}

export default async function Page() {
  const [puzzle, ...cms] = await Promise.all([
    getPuzzle(),
    getSiteContent("learning_hero"),
    getSiteContent("learning_tools"),
    getSiteContent("learning_tips"),
    getSiteContent("learning_cta"),
    getSiteContent("learning_showcase"),
  ]);

  return (
    <LearningToolsPage
      puzzle={puzzle}
      hero={parse<LearningToolsHero>(cms[0])}
      tools={parse<LearningTool[]>(cms[1])}
      tips={parse<LearningTip[]>(cms[2])}
      cta={parse<LearningToolsCTA>(cms[3])}
      showcase={parse<LearningToolsShowcase>(cms[4])}
    />
  );
}
