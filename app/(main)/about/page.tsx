import AnimatedSection from "@/components/shared/AnimatedSection";
import StatsCounter from "@/components/shared/StatsCounter";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hero */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 chess-bg opacity-5 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
              About <span className="gradient-text-gold">PiChess</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              We believe chess is more than a game. It&apos;s a discipline, a language, and a path to excellence — for everyone.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <AnimatedSection direction="left">
            <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 mb-6">
              Born in Ghana. <br />Built for Africa.
            </h2>
            <div className="space-y-4 text-white/50 leading-relaxed">
              <p>
                PiChess was founded with a single belief: that every young person in Ghana deserves access to world-class chess education.
              </p>
              <p>
                From a small club to a national platform, we&apos;ve grown into an ecosystem that serves students, communities, and champions.
              </p>
              <p>
                Our three pillars — the Academy, the Foundation, and Tournaments — work together to build future leaders through the board.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection direction="right">
            <div className="rounded-2xl border border-[#c9a84c]/20 bg-zinc-900 p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-[200px] leading-none opacity-5 font-black">♔</div>
              <div className="relative space-y-6">
                {[
                  { icon: "🎓", title: "Academy", desc: "Elite coaching for all levels, from beginner to competitive." },
                  { icon: "❤️", title: "Foundation", desc: "Free chess programs for underserved youth across Ghana." },
                  { icon: "🏆", title: "Tournaments", desc: "Local and national events that create champions." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <h3 className="font-bold text-white">{item.title}</h3>
                      <p className="text-white/40 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <StatsCounter end={500} label="Students" suffix="+" color="gold" />
            <StatsCounter end={8} label="Years Active" color="white" />
            <StatsCounter end={50} label="Tournaments" suffix="+" color="white" />
            <StatsCounter end={200} label="Beneficiaries" suffix="+" color="green" />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-8">
              Our Mission
            </h2>
            <blockquote className="text-2xl sm:text-3xl font-light text-white/60 italic leading-relaxed border-l-4 border-[#c9a84c] pl-8 text-left">
              &ldquo;To use chess as a transformative tool for developing disciplined, strategic, and empowered individuals across Ghana and beyond.&rdquo;
            </blockquote>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
