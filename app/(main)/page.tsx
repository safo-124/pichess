import Link from "next/link";
import AnimatedSection from "@/components/shared/AnimatedSection";
import StatsCounter from "@/components/shared/StatsCounter";
import prisma from "@/lib/prisma";

async function getTournaments() {
  try {
    return await prisma.tournament.findMany({
      where: { status: "UPCOMING", featured: true },
      orderBy: { date: "asc" },
      take: 3,
    });
  } catch { return []; }
}

async function getPartners() {
  try { return await prisma.partner.findMany({ orderBy: { order: "asc" } }); }
  catch { return []; }
}

export default async function HomePage() {
  const [tournaments, partners] = await Promise.all([getTournaments(), getPartners()]);

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
        {/* Chess board bg */}
        <div className="absolute inset-0 chess-bg opacity-8 pointer-events-none" />
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#c9a84c]/8 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-white/4 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <AnimatedSection delay={0}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-6">
              Ghana&apos;s Premier Chess Platform
            </span>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-none">
              Move With
              <br />
              <span className="gradient-text-gold">Purpose.</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/50 mb-10 leading-relaxed">
              PiChess unites a world-class academy, a life-changing foundation, and
              a vibrant tournament community under one mission — chess as a tool for excellence.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/academy"
                className="px-8 py-4 rounded-full bg-[#c9a84c] hover:bg-[#dbb95d] text-black font-bold text-base transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#c9a84c]/25"
              >
                Join the Academy →
              </Link>
              <Link
                href="/ngo"
                className="px-8 py-4 rounded-full border border-white/20 text-white hover:bg-white/8 font-semibold text-base transition-all hover:scale-105 active:scale-95"
              >
                Visit Our Foundation
              </Link>
            </div>
          </AnimatedSection>

          {/* Floating chess pieces */}
          <AnimatedSection delay={0.5} className="mt-20">
            <div className="flex items-center justify-center gap-8 text-6xl sm:text-8xl opacity-10">
              {["♔", "♕", "♖", "♗", "♘", "♙"].map((p, i) => (
                <span
                  key={p}
                  className="animate-float select-none"
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  {p}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
          </div>
        </div>
      </section>

      {/* ── Zone Cards ── */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
              Three Worlds. One Mission.
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Each zone is a distinct experience built for a different purpose.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Academy Card */}
            <AnimatedSection delay={0} direction="left">
              <Link href="/academy" className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-[#c9a84c]/30 bg-zinc-900 p-8 h-72 hover-lift hover:border-[#c9a84c]/60 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#c9a84c]/8 blur-2xl group-hover:bg-[#c9a84c]/15 transition-all" />
                  <div className="text-5xl mb-4">🎓</div>
                  <h3 className="text-2xl font-black text-white mb-2">
                    <span className="gradient-text-gold">Academy</span>
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">
                    Elite chess training, structured programs, and competitive development for all levels.
                  </p>
                  <span className="text-[#c9a84c] text-sm font-semibold group-hover:gap-3 flex items-center gap-2 transition-all">
                    Explore Academy <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </span>
                </div>
              </Link>
            </AnimatedSection>

            {/* NGO Card */}
            <AnimatedSection delay={0.15}>
              <Link href="/ngo" className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-[#2e7d5b]/30 bg-zinc-900 p-8 h-72 hover-lift hover:border-[#2e7d5b]/60 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#2e7d5b]/8 blur-2xl group-hover:bg-[#2e7d5b]/15 transition-all" />
                  <div className="text-5xl mb-4">❤️</div>
                  <h3 className="text-2xl font-black text-white mb-2">
                    <span className="gradient-text-green">Foundation</span>
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">
                    Using chess to uplift underprivileged youth. Apply, volunteer, or donate to change lives.
                  </p>
                  <span className="text-[#2e7d5b] text-sm font-semibold flex items-center gap-2 transition-all">
                    Visit Foundation <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </span>
                </div>
              </Link>
            </AnimatedSection>

            {/* Tournaments Card */}
            <AnimatedSection delay={0.3} direction="right">
              <Link href="/tournaments" className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 p-8 h-72 hover-lift hover:border-white/25 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/4 blur-2xl group-hover:bg-white/8 transition-all" />
                  <div className="text-5xl mb-4">🏆</div>
                  <h3 className="text-2xl font-black text-white mb-2">Tournaments</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">
                    Compete in local and national chess competitions. Test your skills against the best.
                  </p>
                  <span className="text-white/70 text-sm font-semibold flex items-center gap-2">
                    View Tournaments <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 chess-bg opacity-5 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <StatsCounter end={500} label="Students Trained" suffix="+" color="gold" />
            <StatsCounter end={50} label="Tournaments Hosted" suffix="+" color="white" />
            <StatsCounter end={200} label="Beneficiaries" suffix="+" color="green" />
            <StatsCounter end={15} label="Expert Coaches" color="white" />
          </div>
        </div>
      </section>

      {/* ── Upcoming Tournaments ── */}
      {tournaments.length > 0 && (
        <section className="py-24 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white">Upcoming Tournaments</h2>
                <p className="text-white/40 mt-2">Register early. Limited spots available.</p>
              </div>
              <Link href="/tournaments" className="text-[#c9a84c] text-sm font-semibold hover:underline hidden sm:block">
                See all →
              </Link>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tournaments.map((t, i) => (
                <AnimatedSection key={t.id} delay={i * 0.1}>
                  <div className="rounded-xl border border-white/10 bg-zinc-900 p-6 hover-lift">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        t.status === "UPCOMING" ? "bg-[#c9a84c]/20 text-[#c9a84c]" : "bg-green-500/20 text-green-400"
                      }`}>
                        {t.status}
                      </span>
                      {t.tags.includes("academy") && (
                        <span className="text-xs text-white/30 border border-white/10 px-2 py-0.5 rounded-full">Academy</span>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-lg mb-1">{t.title}</h3>
                    <p className="text-white/40 text-sm mb-4">
                      📅 {new Date(t.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      &nbsp;·&nbsp;📍 {t.location}
                    </p>
                    {t.registrationLink && (
                      <a
                        href={t.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 rounded-full bg-white/8 hover:bg-white/15 text-white/80 text-xs font-semibold transition-all"
                      >
                        Register →
                      </a>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ── */}
      <section className="py-24 bg-[#c9a84c] relative overflow-hidden">
        <div className="absolute inset-0 chess-bg opacity-10 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tight mb-6">
              Ready to Make Your Move?
            </h2>
            <p className="text-black/60 text-lg mb-10 max-w-xl mx-auto">
              Join hundreds of students building discipline, critical thinking, and competitive excellence through chess.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/academy/enquire" className="px-8 py-4 rounded-full bg-black text-white font-bold hover:scale-105 transition-transform active:scale-95">
                Start Your Journey →
              </Link>
              <Link href="/ngo/apply" className="px-8 py-4 rounded-full border-2 border-black/30 text-black font-semibold hover:bg-black/10 transition-all">
                Apply for Support
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
