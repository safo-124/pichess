import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
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
    <div className="min-h-screen bg-[#060a14] pt-20">
      {/* Hero header */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 chess-bg opacity-[0.02] pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-amber-500/[0.04] blur-[180px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-6">
              Academy
            </span>
          </AnimatedSection>
          <TextReveal text="Tournaments" className="text-5xl sm:text-7xl font-black text-white tracking-tight" />
          <AnimatedSection delay={0.2}>
            <p className="text-white/35 max-w-xl mt-4 text-lg leading-relaxed">
              Academy-exclusive competitive events designed to develop and test our students at every level.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Tournaments list */}
      <section className="py-8 pb-28 px-4">
        <div className="max-w-7xl mx-auto">
          {tournaments.length === 0 ? (
            <AnimatedSection>
              <div className="rounded-2xl border border-white/[0.06] bg-[#0f1628] p-20 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <p className="text-white/30 text-lg">No academy tournaments found. Check back soon.</p>
              </div>
            </AnimatedSection>
          ) : (
            <div className="space-y-4">
              {tournaments.map((t, i) => (
                <AnimatedSection key={t.id} delay={i * 0.08}>
                  <div className={`group rounded-2xl border transition-all duration-500 ${
                    t.status === "UPCOMING"
                      ? "border-amber-500/15 bg-[#0f1628] hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5"
                      : "border-white/[0.06] bg-[#0f1628]/50"
                  } p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-4`}>
                    {/* Status & info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          t.status === "UPCOMING"
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                            : t.status === "ONGOING"
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                            : "bg-white/5 text-white/30 border border-white/[0.06]"
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-lg group-hover:text-amber-200 transition-colors">{t.title}</h3>
                      <p className="text-white/35 text-sm mt-1 flex items-center gap-2 flex-wrap">
                        <span>📅 {new Date(t.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                        <span className="text-white/15">·</span>
                        <span>📍 {t.location}</span>
                      </p>
                    </div>
                    {/* Register button */}
                    {t.registrationLink && t.status === "UPCOMING" && (
                      <a
                        href={t.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-bold hover:from-amber-300 hover:to-orange-400 transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95"
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
