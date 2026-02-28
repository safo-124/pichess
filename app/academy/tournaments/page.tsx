import AnimatedSection from "@/components/shared/AnimatedSection";
import prisma from "@/lib/prisma";

export const metadata = { title: "Academy Tournaments" };

async function getAcademyTournaments() {
  try {
    return await prisma.tournament.findMany({
      where: { tags: { has: "academy" } },
      orderBy: { date: "asc" },
    });
  } catch { return []; }
}

export default async function AcademyTournamentsPage() {
  const tournaments = await getAcademyTournaments();

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 chess-bg opacity-5 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <AnimatedSection>
            <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest">Academy</span>
            <h1 className="text-5xl sm:text-6xl font-black text-white mt-2 mb-4">Tournaments</h1>
            <p className="text-white/40 max-w-xl">
              Academy-exclusive competitive events designed to develop and test our students.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-8 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {tournaments.length === 0 ? (
            <AnimatedSection>
              <div className="rounded-xl border border-[#c9a84c]/15 bg-zinc-900 p-16 text-center text-white/30">
                No academy tournaments found. Check back soon.
              </div>
            </AnimatedSection>
          ) : (
            <div className="space-y-4">
              {tournaments.map((t, i) => (
                <AnimatedSection key={t.id} delay={i * 0.08}>
                  <div className={`rounded-xl border ${t.status === "UPCOMING" ? "border-[#c9a84c]/30 bg-zinc-900" : "border-white/8 bg-zinc-900/50"} p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-[#c9a84c]/50 transition-all`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          t.status === "UPCOMING" ? "bg-[#c9a84c]/15 text-[#c9a84c]" :
                          t.status === "ONGOING" ? "bg-green-500/15 text-green-400" :
                          "bg-white/5 text-white/30"
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-lg">{t.title}</h3>
                      <p className="text-white/40 text-sm mt-1">
                        📅 {new Date(t.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        &nbsp;·&nbsp;📍 {t.location}
                      </p>
                    </div>
                    {t.registrationLink && t.status === "UPCOMING" && (
                      <a
                        href={t.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-5 py-2.5 rounded-full bg-[#c9a84c] text-black text-sm font-bold hover:bg-[#dbb95d] transition-all hover:scale-105"
                      >
                        Register →
                      </a>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
