import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import MagneticButton from "@/components/shared/MagneticButton";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Academy Team" };

async function getTeam() {
  try {
    return await prisma.academy_Team.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch { return []; }
}

export default async function AcademyTeamPage() {
  const team = await getTeam();

  return (
    <div className="min-h-screen bg-[#060a14] pt-20">
      {/* Hero header */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 chess-bg opacity-[0.02] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/[0.04] blur-[180px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/[0.03] blur-[150px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-widest mb-6">
              Instructors
            </span>
          </AnimatedSection>
          <TextReveal text="Our Team" className="text-5xl sm:text-7xl font-black text-white tracking-tight" />
          <AnimatedSection delay={0.2}>
            <p className="text-white/35 max-w-xl mx-auto mt-4 text-lg leading-relaxed">
              World-class coaches dedicated to developing Ghana&apos;s next generation of chess champions.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Team grid */}
      <section className="py-8 pb-28 px-4">
        <div className="max-w-7xl mx-auto">
          {team.length === 0 ? (
            <AnimatedSection>
              <div className="rounded-2xl border border-white/[0.06] bg-[#0f1628] p-20 text-center">
                <div className="text-5xl mb-4">♟</div>
                <p className="text-white/30 text-lg">Team profiles coming soon.</p>
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <AnimatedSection key={member.id} delay={i * 0.1}>
                  <div className="group rounded-2xl border border-white/[0.06] bg-[#0f1628] p-8 text-center transition-all duration-500 hover:border-amber-500/15 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 relative overflow-hidden">
                    {/* Hover glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-amber-500/[0.06] to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-y-24" />

                    <div className="relative z-10">
                      <div className="w-28 h-28 bg-gradient-to-br from-amber-500/15 to-orange-500/10 rounded-2xl flex items-center justify-center text-5xl mx-auto mb-6 border-2 border-white/[0.06] group-hover:border-amber-500/25 group-hover:scale-105 transition-all duration-500 shadow-lg shadow-black/20">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                          <span className="group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 inline-block">♟</span>
                        )}
                      </div>
                      <h3 className="font-black text-white text-xl mb-1 group-hover:text-amber-200 transition-colors">{member.name}</h3>
                      <p className="text-amber-400/70 text-sm font-semibold mb-4">{member.role}</p>
                      {member.bio && (
                        <p className="text-white/35 text-sm leading-relaxed">{member.bio}</p>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          <AnimatedSection delay={0.4} className="mt-20 text-center">
            <MagneticButton>
              <Link
                href="/academy/enquire"
                className="group relative inline-flex items-center gap-2 px-10 py-4 rounded-full text-base font-black transition-all overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 group-hover:from-amber-300 group-hover:to-orange-400 transition-all" />
                <span className="relative z-10 text-black">Train With Us</span>
                <span className="relative z-10 text-black/60 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </MagneticButton>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
