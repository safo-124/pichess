import AnimatedSection from "@/components/shared/AnimatedSection";
import StatsCounter from "@/components/shared/StatsCounter";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "PiChess Foundation" };

async function getStories() {
  try {
    return await prisma.nGO_Story.findMany({ where: { published: true }, take: 3, orderBy: { createdAt: "desc" } });
  } catch { return []; }
}

export default async function NGOPage() {
  const stories = await getStories();

  return (
    <div className="overflow-x-hidden text-zinc-900 bg-white">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #2e7d5b 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#2e7d5b]/8 blur-[120px]" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center pt-20">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#2e7d5b]/40 text-[#2e7d5b] text-xs font-semibold uppercase tracking-widest mb-6">
              PiChess Foundation
            </span>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-zinc-900 leading-none mb-6">
              Chess for
              <br />
              <span className="gradient-text-green">Every Child.</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="max-w-2xl mx-auto text-lg text-zinc-500 mb-10">
              We bring chess to underserved communities across Ghana, using it as a tool for education, discipline, and opportunity.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/ngo/donate" className="px-8 py-4 rounded-full bg-[#2e7d5b] hover:bg-[#3a9970] text-white font-bold text-base transition-all hover:scale-105 shadow-lg shadow-[#2e7d5b]/20">
                Donate Now ❤️
              </Link>
              <Link href="/ngo/apply" className="px-8 py-4 rounded-full border border-[#2e7d5b]/30 text-[#2e7d5b] hover:bg-[#2e7d5b]/8 font-semibold text-base transition-all hover:scale-105">
                Apply for Support
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Impact stats */}
      <section className="py-20 bg-[#2e7d5b] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 chess-bg pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <StatsCounter end={200} label="Beneficiaries" suffix="+" color="white" />
            <StatsCounter end={10} label="Communities" color="white" />
            <StatsCounter end={50} label="Donors" suffix="+" color="white" />
            <StatsCounter end={5} label="Years of Impact" color="white" />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <AnimatedSection direction="left">
            <span className="text-xs font-semibold text-[#2e7d5b] uppercase tracking-widest">Our Mission</span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 mt-2 mb-6">
              Empowering Youth Through the Royal Game
            </h2>
            <div className="space-y-4 text-zinc-500 leading-relaxed">
              <p>We operate in underserved communities to provide free chess education, materials, and mentorship to children who wouldn&apos;t otherwise have access.</p>
              <p>Chess teaches patience, critical thinking, and resilience — skills that transcend the board and impact every area of life.</p>
            </div>
            <Link href="/ngo/apply" className="mt-8 inline-block px-6 py-3 rounded-full bg-[#2e7d5b] text-white font-bold hover:scale-105 transition-transform">
              Apply for Support →
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "♟", title: "Free Equipment", desc: "Chess sets and boards for communities in need." },
                { icon: "🏫", title: "School Programs", desc: "In-school chess programs at no cost." },
                { icon: "🎓", title: "Scholarships", desc: "Pathway to funded Academy training." },
                { icon: "🤝", title: "Mentorship", desc: "Connecting youth with chess role models." },
              ].map((item, i) => (
                <div key={i} className="rounded-xl border border-[#2e7d5b]/15 bg-[#d4ede3] p-5">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h3 className="font-bold text-zinc-800 text-sm">{item.title}</h3>
                  <p className="text-zinc-500 text-xs mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-24 bg-zinc-50 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900">How We Help</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Apply for Support", href: "/ngo/apply", icon: "🙏", desc: "Are you or your child in need of chess support? Apply for our scholarship program.", cta: "Apply Now", color: "border-[#2e7d5b]/20 bg-[#d4ede3]" },
              { title: "Volunteer", href: "/ngo/volunteer", icon: "🤲", desc: "Share your time and skills to help us reach more communities across Ghana.", cta: "Volunteer", color: "border-zinc-200 bg-white" },
              { title: "Donate", href: "/ngo/donate", icon: "💚", desc: "Your donation funds chess sets, programs, and scholarships for underprivileged youth.", cta: "Donate Now", color: "border-[#2e7d5b]/20 bg-[#d4ede3]" },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <div className={`rounded-2xl border ${item.color} p-8 text-center hover-lift h-full flex flex-col`}>
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-black text-zinc-900 mb-3">{item.title}</h3>
                  <p className="text-zinc-500 text-sm mb-6 flex-1">{item.desc}</p>
                  <Link href={item.href} className="inline-block px-6 py-3 rounded-full bg-[#2e7d5b] text-white font-bold hover:bg-[#3a9970] transition-all hover:scale-105">
                    {item.cta} →
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      {stories.length > 0 && (
        <section id="stories" className="py-24 bg-white px-4">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-zinc-900">Stories of Impact</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stories.map((s, i) => (
                <AnimatedSection key={s.id} delay={i * 0.1}>
                  <article className="rounded-xl border border-zinc-100 bg-white overflow-hidden shadow-sm hover-lift">
                    {s.image && <div className="aspect-video bg-zinc-100 overflow-hidden"><img src={s.image} alt={s.title} className="w-full h-full object-cover" /></div>}
                    {!s.image && <div className="aspect-video bg-[#d4ede3] flex items-center justify-center text-5xl opacity-40">♟</div>}
                    <div className="p-5">
                      <h3 className="font-bold text-zinc-900 text-lg mb-2">{s.title}</h3>
                      <p className="text-zinc-500 text-sm line-clamp-3">{s.content}</p>
                    </div>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
