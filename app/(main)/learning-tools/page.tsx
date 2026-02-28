import AnimatedSection from "@/components/shared/AnimatedSection";
import prisma from "@/lib/prisma";

export const metadata = { title: "Learning Tools" };

async function getPuzzle() {
  try {
    return await prisma.daily_Puzzle.findFirst({
      where: { published: true },
      orderBy: { date: "desc" },
    });
  } catch { return null; }
}

export default async function LearningToolsPage() {
  const puzzle = await getPuzzle();

  return (
    <div className="min-h-screen bg-black pt-20">
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 chess-bg opacity-5 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest">Train Your Mind</span>
            <h1 className="text-5xl sm:text-7xl font-black mt-2 mb-4">Learning Tools</h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Daily puzzles, engine play, and resources to sharpen your chess skills.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-8 pb-24 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Daily Puzzle */}
          <AnimatedSection delay={0} className="lg:col-span-2">
            <div className="rounded-2xl border border-[#c9a84c]/30 bg-zinc-900 p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🧩</span>
                <div>
                  <h2 className="text-xl font-black text-white">Daily Puzzle</h2>
                  <p className="text-white/40 text-sm">
                    {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                </div>
                {puzzle && (
                  <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${
                    puzzle.difficulty === "EASY" ? "bg-green-500/15 text-green-400" :
                    puzzle.difficulty === "HARD" ? "bg-red-500/15 text-red-400" :
                    "bg-[#c9a84c]/15 text-[#c9a84c]"
                  }`}>
                    {puzzle?.difficulty}
                  </span>
                )}
              </div>
              {puzzle ? (
                <div>
                  <h3 className="font-bold text-white text-lg mb-2">{puzzle.title || "Today's Puzzle"}</h3>
                  {puzzle.description && <p className="text-white/40 text-sm mb-4">{puzzle.description}</p>}
                  <div className="bg-zinc-800 rounded-lg p-4 font-mono text-xs text-white/50 break-all mb-4">
                    FEN: {puzzle.fen}
                  </div>
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-semibold text-[#c9a84c] hover:text-[#dbb95d] transition-colors list-none flex items-center gap-2">
                      <span>Reveal Solution</span>
                      <span className="group-open:rotate-180 transition-transform">↓</span>
                    </summary>
                    <div className="mt-3 p-4 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-white font-mono text-sm">
                      {puzzle.solution}
                    </div>
                  </details>
                </div>
              ) : (
                <div className="text-white/30 text-center py-8">No puzzle available today. Check back tomorrow.</div>
              )}
            </div>
          </AnimatedSection>

          {/* Play vs Engine */}
          <AnimatedSection delay={0.15}>
            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8 h-full flex flex-col">
              <span className="text-3xl mb-4">🤖</span>
              <h2 className="text-xl font-black text-white mb-2">Play vs Engine</h2>
              <p className="text-white/40 text-sm mb-6 flex-1">
                Practice against a chess engine in your browser. No account required.
              </p>
              <a
                href="https://lichess.org/ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-center px-5 py-3 rounded-xl bg-white/8 hover:bg-white/15 text-white font-semibold text-sm transition-all hover:scale-105"
              >
                Play on Lichess →
              </a>
            </div>
          </AnimatedSection>

          {/* Resources */}
          {[
            { icon: "📖", title: "Opening Explorer", desc: "Study opening theory and preparation.", href: "https://lichess.org/opening" },
            { icon: "🎯", title: "Tactics Trainer", desc: "Improve your tactical vision with daily exercises.", href: "https://lichess.org/training" },
            { icon: "📺", title: "Video Lessons", desc: "Watch instructional chess videos from top coaches.", href: "#" },
          ].map((r, i) => (
            <AnimatedSection key={r.title} delay={0.3 + i * 0.1}>
              <a href={r.href} target="_blank" rel="noopener noreferrer" className="group block rounded-2xl border border-white/10 bg-zinc-900 p-6 hover-lift h-full">
                <span className="text-3xl">{r.icon}</span>
                <h3 className="font-bold text-white text-lg mt-3 mb-1 group-hover:text-[#c9a84c] transition-colors">{r.title}</h3>
                <p className="text-white/40 text-sm">{r.desc}</p>
              </a>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </div>
  );
}
