import LearningToolsPage from "@/components/main/LearningToolsPage";
import prisma from "@/lib/prisma";

export const metadata = { title: "Learning Tools | PiChess" };

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
  const puzzle = await getPuzzle();
  return <LearningToolsPage puzzle={puzzle} />;
}
