import AnimatedSection from "@/components/shared/AnimatedSection";
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
    <div className="min-h-screen bg-zinc-950 pt-20">
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 chess-bg opacity-5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#c9a84c]/6 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest">Instructors</span>
            <h1 className="text-5xl sm:text-6xl font-black text-white mt-2 mb-4">Our Team</h1>
            <p className="text-white/40 max-w-xl mx-auto">
              World-class coaches dedicated to developing Ghana&apos;s next generation of chess champions.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-8 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {team.length === 0 ? (
            <AnimatedSection>
              <div className="rounded-xl border border-[#c9a84c]/15 bg-zinc-900 p-16 text-center text-white/30">
                Team profiles coming soon.
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <AnimatedSection key={member.id} delay={i * 0.1}>
                  <div className="rounded-2xl border border-[#c9a84c]/15 bg-zinc-900 p-8 text-center hover-lift group">
                    <div className="w-24 h-24 bg-[#c9a84c]/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 border-2 border-[#c9a84c]/20 group-hover:border-[#c9a84c]/60 transition-all">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="group-hover:scale-110 transition-transform inline-block">♟</span>
                      )}
                    </div>
                    <h3 className="font-black text-white text-xl mb-1">{member.name}</h3>
                    <p className="text-[#c9a84c] text-sm font-semibold mb-4">{member.role}</p>
                    {member.bio && (
                      <p className="text-white/40 text-sm leading-relaxed">{member.bio}</p>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          <AnimatedSection delay={0.4} className="mt-16 text-center">
            <Link
              href="/academy/enquire"
              className="inline-block px-8 py-4 rounded-full bg-[#c9a84c] text-black font-black hover:scale-105 transition-transform"
            >
              Train With Us →
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
