import AnimatedSection from "@/components/shared/AnimatedSection";
import StatsCounter from "@/components/shared/StatsCounter";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "PiChess Academy" };

async function getData() {
  try {
    const [team, testimonials] = await Promise.all([
      prisma.academy_Team.findMany({ where: { published: true }, orderBy: { order: "asc" }, take: 4 }),
      prisma.academy_Testimonial.findMany({ where: { published: true }, take: 3 }),
    ]);
    return { team, testimonials };
  } catch { return { team: [], testimonials: [] }; }
}

const programs = [
  { title: "Junior Chess Program", age: "Ages 6–12", desc: "Foundational chess concepts, rules, and fun competitive play.", icon: "♟" },
  { title: "Intermediate Training", age: "Ages 12–18", desc: "Opening theory, endgame mastery, and tournament preparation.", icon: "♞" },
  { title: "Advanced Coaching", age: "18+", desc: "Elite competitive training with professional coaches.", icon: "♛" },
  { title: "Weekend Intensive", age: "All Ages", desc: "Weekend-only accelerated programs for busy schedules.", icon: "♜" },
];

export default async function AcademyPage() {
  const { team, testimonials } = await getData();

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 chess-bg opacity-6 pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-[#c9a84c]/6 blur-[100px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center pt-20">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-6">
              PiChess Academy
            </span>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-none mb-6">
              Train Like a<br />
              <span className="gradient-text-gold">Champion.</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="max-w-2xl mx-auto text-lg text-white/50 mb-10">
              Ghana&apos;s premier chess academy. Expert coaches. Structured programs. Competitive results.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/academy/enquire" className="px-8 py-4 rounded-full bg-[#c9a84c] hover:bg-[#dbb95d] text-black font-bold text-base transition-all hover:scale-105 shadow-lg shadow-[#c9a84c]/20">
                Enquire Now →
              </Link>
              <Link href="/academy/team" className="px-8 py-4 rounded-full border border-white/20 text-white hover:bg-white/8 font-semibold text-base transition-all hover:scale-105">
                Meet Our Coaches
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <StatsCounter end={500} label="Students Trained" suffix="+" color="gold" />
            <StatsCounter end={15} label="Expert Coaches" color="white" />
            <StatsCounter end={30} label="Tournaments Won" suffix="+" color="gold" />
            <StatsCounter end={5} label="Programs Available" color="white" />
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-24 bg-zinc-950 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest">Curriculum</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">Our Programs</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 0.1}>
                <div className="rounded-2xl border border-[#c9a84c]/20 bg-zinc-900 p-8 hover-lift group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{p.icon}</div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-black text-white">{p.title}</h3>
                    <span className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20">
                      {p.age}
                    </span>
                  </div>
                  <p className="text-white/50 mt-3 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team preview */}
      {team.length > 0 && (
        <section className="py-24 bg-black px-4">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection className="flex items-end justify-between mb-12">
              <div>
                <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest">Instructors</span>
                <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">Our Coaches</h2>
              </div>
              <Link href="/academy/team" className="text-[#c9a84c] text-sm font-semibold hover:underline hidden sm:block">
                Full team →
              </Link>
            </AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {team.map((member, i) => (
                <AnimatedSection key={member.id} delay={i * 0.1}>
                  <div className="rounded-xl border border-white/10 bg-zinc-900 p-6 text-center hover-lift">
                    <div className="w-16 h-16 bg-[#c9a84c]/10 rounded-full flex items-center justify-center text-2xl mx-auto mb-3 border border-[#c9a84c]/20">
                      {member.image ? <img src={member.image} alt={member.name} className="w-full h-full rounded-full object-cover" /> : "♟"}
                    </div>
                    <h3 className="font-bold text-white text-sm">{member.name}</h3>
                    <p className="text-[#c9a84c] text-xs mt-1">{member.role}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="py-24 bg-zinc-950 px-4">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-white">What Students Say</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <AnimatedSection key={t.id} delay={i * 0.1}>
                  <div className="rounded-xl border border-[#c9a84c]/15 bg-zinc-900 p-6 hover-lift">
                    <div className="flex text-[#c9a84c] mb-4">
                      {"★".repeat(t.rating)}
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed mb-6 italic">&ldquo;{t.content}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#c9a84c]/15 flex items-center justify-center text-[#c9a84c] font-black">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{t.name}</p>
                        {t.program && <p className="text-white/30 text-xs">{t.program}</p>}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <div className="rounded-2xl border border-[#c9a84c]/30 bg-zinc-900 p-12 relative overflow-hidden animate-border-glow">
              <div className="absolute inset-0 chess-bg opacity-5 pointer-events-none" />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                  Ready to Start Your <span className="gradient-text-gold">Chess Journey?</span>
                </h2>
                <p className="text-white/40 mb-8">
                  Fill out our enquiry form and a coach will get back to you within 24 hours.
                </p>
                <Link href="/academy/enquire" className="inline-block px-8 py-4 rounded-full bg-[#c9a84c] text-black font-black hover:scale-105 transition-transform">
                  Enquire Now →
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
