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
    <div className="min-h-screen bg-white pt-20">
      {/* Hero header */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-200/[0.12] blur-[180px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#c9a84c]/[0.06] blur-[150px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold uppercase tracking-widest mb-6">
              Instructors
            </span>
          </AnimatedSection>
          <TextReveal text="Our Team" className="text-5xl sm:text-7xl font-black text-gray-900 tracking-tight" />
          <AnimatedSection delay={0.2}>
            <p className="text-gray-400 max-w-xl mx-auto mt-4 text-lg leading-relaxed">
              World-class coaches dedicated to developing Ghana&apos;s next generation of chess champions.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Team grid */}
      <section className="py-8 pb-0 px-4">
        <div className="max-w-7xl mx-auto">
          {team.length === 0 ? (
            <AnimatedSection>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-20 text-center">
                <div className="text-5xl mb-4">♟</div>
                <p className="text-gray-400 text-lg">Team profiles coming soon.</p>
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <AnimatedSection key={member.id} delay={i * 0.1}>
                  <div className="group rounded-2xl border border-gray-200 bg-white p-8 text-center transition-all duration-500 hover:border-[#c9a84c]/30 hover:shadow-xl hover:shadow-[#c9a84c]/10 hover:-translate-y-1 relative overflow-hidden">
                    {/* Hover glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-[#c9a84c]/[0.06] to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-y-24" />

                    <div className="relative z-10">
                      <div className="w-28 h-28 bg-gradient-to-br from-[#c9a84c]/15 to-[#dbb95d]/10 rounded-2xl flex items-center justify-center text-5xl mx-auto mb-6 border-2 border-gray-200 group-hover:border-[#c9a84c]/25 group-hover:scale-105 transition-all duration-500 shadow-lg shadow-black/5">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                          <span className="group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 inline-block">♟</span>
                        )}
                      </div>
                      <h3 className="font-black text-gray-900 text-xl mb-1 group-hover:text-[#c9a84c] transition-colors">{member.name}</h3>
                      <p className="text-[#c9a84c] text-sm font-semibold mb-4">{member.role}</p>
                      {member.bio && (
                        <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
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
                <span className="absolute inset-0 bg-gradient-to-r from-[#c9a84c] via-[#d4b15a] to-[#dbb95d] group-hover:from-[#dbb95d] group-hover:to-[#c9a84c] transition-all" />
                <span className="relative z-10 text-white">Train With Us</span>
                <span className="relative z-10 text-white/60 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </MagneticButton>
          </AnimatedSection>
        </div>
      </section>

      {/* Dark CTA band */}
      <section className="py-20 bg-gray-900 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08),transparent_60%)]" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4">Join the Academy</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Our coaches are ready to help you reach your full potential. Start your chess journey today.</p>
          <MagneticButton>
            <Link
              href="/academy/enquire"
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#c9a84c] via-[#d4b15a] to-[#dbb95d] group-hover:from-[#dbb95d] group-hover:to-[#c9a84c] transition-all" />
              <span className="relative z-10 text-white font-bold">Enquire Now</span>
              <span className="relative z-10 text-white/60 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}
