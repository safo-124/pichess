import AnimatedSection from "@/components/shared/AnimatedSection";
import prisma from "@/lib/prisma";
import Link from "next/link";

async function getTournaments() {
  try {
    return await prisma.tournament.findMany({ orderBy: { date: "asc" } });
  } catch { return []; }
}

export const metadata = { title: "Tournaments" };

export default async function TournamentsPage() {
  const tournaments = await getTournaments();
  const upcoming = tournaments.filter((t) => t.status === "UPCOMING");
  const past = tournaments.filter((t) => t.status === "COMPLETED");

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Header */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 chess-bg opacity-6 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <AnimatedSection>
            <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest">Events</span>
            <h1 className="text-5xl sm:text-7xl font-black mt-2 mb-4">Tournaments</h1>
            <p className="text-white/40 text-lg max-w-xl">
              Compete. Grow. Dominate. Register for upcoming chess events across Ghana.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Upcoming */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="text-2xl font-black text-white mb-8">
              Upcoming <span className="gradient-text-gold">Events</span>
            </h2>
          </AnimatedSection>
          {upcoming.length === 0 ? (
            <AnimatedSection>
              <div className="rounded-xl border border-white/10 bg-zinc-900 p-12 text-center text-white/30">
                No upcoming tournaments yet. Check back soon.
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((t, i) => (
                <AnimatedSection key={t.id} delay={i * 0.1}>
                  <div className="rounded-xl border border-[#c9a84c]/20 bg-zinc-900 p-6 hover-lift h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#c9a84c]/15 text-[#c9a84c]">
                        {t.status}
                      </span>
                      {t.tags.map((tag) => (
                        <span key={tag} className="text-xs text-white/30 border border-white/10 px-2 py-0.5 rounded-full capitalize">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-white text-xl mb-2">{t.title}</h3>
                    {t.description && <p className="text-white/40 text-sm mb-3 flex-1">{t.description}</p>}
                    <div className="text-white/40 text-sm space-y-1 mb-4">
                      <p>📅 {new Date(t.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                      <p>📍 {t.venue ? `${t.venue}, ` : ""}{t.location}</p>
                    </div>
                    {t.registrationLink ? (
                      <a
                        href={t.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto block text-center px-4 py-2.5 rounded-full bg-[#c9a84c] hover:bg-[#dbb95d] text-black text-sm font-bold transition-all hover:scale-105"
                      >
                        Register Now →
                      </a>
                    ) : (
                      <span className="mt-auto block text-center px-4 py-2.5 rounded-full border border-white/10 text-white/30 text-sm">
                        Registration Opening Soon
                      </span>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <h2 className="text-2xl font-black text-white mb-8">Past Events</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {past.map((t, i) => (
                <AnimatedSection key={t.id} delay={i * 0.08}>
                  <div className="rounded-xl border border-white/6 bg-zinc-900/50 p-5 hover:border-white/15 transition-all">
                    <h3 className="font-semibold text-white/70 mb-1">{t.title}</h3>
                    <p className="text-white/30 text-xs">
                      {new Date(t.date).toLocaleDateString("en-GB")} – {t.location}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sponsor CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-10 text-center">
              <h3 className="text-2xl font-black text-white mb-3">Become a Tournament Sponsor</h3>
              <p className="text-white/40 mb-6">
                Support Ghana&apos;s chess community and get your brand in front of thousands of chess enthusiasts.
              </p>
              <Link
                href="/contact"
                className="inline-block px-6 py-3 rounded-full bg-[#c9a84c] text-black font-bold hover:scale-105 transition-transform"
              >
                Sponsor a Tournament →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
