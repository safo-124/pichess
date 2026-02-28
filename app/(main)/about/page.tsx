/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import StatsCounter from "@/components/shared/StatsCounter";
import { getSiteContent } from "@/lib/actions/admin";
import {
  type AboutHero, type AboutStory, type AboutPillar, type AboutStat,
  type AboutMission, type AboutValue, type AboutTimeline, type AboutTeamMember,
  defaultHero, defaultStory, defaultPillars, defaultStats,
  defaultMission, defaultValues, defaultTimeline, defaultTeam,
} from "@/lib/about-content";
import AboutAnimations from "@/components/about/AboutAnimations";

export const metadata = { title: "About | PiChess" };

async function getContent() {
  const keys = ["about_hero", "about_story", "about_pillars", "about_stats", "about_mission", "about_values", "about_timeline", "about_team"];
  const results = await Promise.all(keys.map(k => getSiteContent(k)));
  return {
    hero: results[0] ? JSON.parse(results[0]) as AboutHero : defaultHero,
    story: results[1] ? JSON.parse(results[1]) as AboutStory : defaultStory,
    pillars: results[2] ? JSON.parse(results[2]) as AboutPillar[] : defaultPillars,
    stats: results[3] ? JSON.parse(results[3]) as AboutStat[] : defaultStats,
    mission: results[4] ? JSON.parse(results[4]) as AboutMission : defaultMission,
    values: results[5] ? JSON.parse(results[5]) as AboutValue[] : defaultValues,
    timeline: results[6] ? JSON.parse(results[6]) as AboutTimeline[] : defaultTimeline,
    team: results[7] ? JSON.parse(results[7]) as AboutTeamMember[] : defaultTeam,
  };
}

export default async function AboutPage() {
  const { hero, story, pillars, stats, mission, values, timeline, team } = await getContent();

  return (
    <div className="min-h-screen bg-white">

      {/* ═══════════════════════════════════════════════════════
          HERO — Full-width image with overlay
      ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={hero.backgroundImage}
            alt="About PiChess"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 pt-32 pb-20">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
              <span className="text-white/70 text-[11px] font-bold uppercase tracking-[0.25em]">
                About Us
              </span>
            </div>
          </AnimatedSection>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6 text-white">
            <TextReveal text={hero.title} delay={0.1} />
            {" "}
            <span className="gradient-text-gold">
              <TextReveal text={hero.highlight} delay={0.3} />
            </span>
          </h1>

          <AnimatedSection delay={0.4}>
            <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              {hero.subtitle}
            </p>
          </AnimatedSection>

          {/* Scroll indicator */}
          <AnimatedSection delay={0.6}>
            <div className="mt-16 flex flex-col items-center gap-2">
              <span className="text-white/30 text-[10px] font-semibold uppercase tracking-widest">Discover</span>
              <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
                <div className="w-1 h-1.5 rounded-full bg-white/50 animate-bounce" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STORY — Two columns with pillars card
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-4 relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=1920&q=80"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px]" />
        </div>
        {/* Decorative blurs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a84c]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#2e7d5b]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative">
          <div>
            <AnimatedSection direction="left">
              <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-[0.3em]">
                {story.label}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mt-3 mb-6 tracking-tight leading-tight">
                {story.title.split(". ").map((part, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {part}{i < story.title.split(". ").length - 1 ? "." : ""}
                  </span>
                ))}
              </h2>
            </AnimatedSection>
            <div className="space-y-5">
              {story.paragraphs.map((p, i) => (
                <AnimatedSection key={i} delay={0.1 + i * 0.1}>
                  <p className="text-gray-500 leading-relaxed text-base">
                    {p}
                  </p>
                </AnimatedSection>
              ))}
            </div>
          </div>

          <AnimatedSection direction="right" delay={0.2}>
            <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 sm:p-10 relative overflow-hidden shadow-xl shadow-black/[0.03]">
              <div className="absolute top-0 right-0 text-[180px] leading-none opacity-[0.03] font-black pointer-events-none">♔</div>
              <div className="relative space-y-8">
                {pillars.map((item, i) => (
                  <AnimatedSection key={i} delay={0.3 + i * 0.15}>
                    <div className="flex gap-5 group">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                        <p className="text-gray-500 text-sm mt-1 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TIMELINE — Journey through the years
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=1920&q=80"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gray-50/[0.88] backdrop-blur-[2px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <AnimatedSection>
              <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-[0.3em]">Our Journey</span>
              <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mt-3 tracking-tight">
                A Path of Growth
              </h2>
            </AnimatedSection>
          </div>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#c9a84c]/30 via-[#c9a84c]/20 to-transparent hidden md:block" />

            <div className="space-y-12 md:space-y-0">
              {timeline.map((item, i) => (
                <AnimatedSection
                  key={i}
                  delay={i * 0.1}
                  direction={i % 2 === 0 ? "left" : "right"}
                >
                  <div className={`md:grid md:grid-cols-2 md:gap-12 items-center md:mb-16 ${
                    i % 2 === 0 ? "" : "md:direction-rtl"
                  }`}>
                    <div className={`${i % 2 === 0 ? "md:text-right md:pr-12" : "md:col-start-2 md:pl-12"}`}>
                      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-[#c9a84c]/30 transition-all duration-500 group">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9a84c]/10 mb-3">
                          <span className="text-[#c9a84c] font-black text-sm">{item.year}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#c9a84c] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                    {/* Center dot */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#c9a84c] border-4 border-white shadow-sm" style={{ top: `${i * 140 + 35}px` }} />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS — Dark dramatic section
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=1920&q=80"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/90" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <AnimatedSection>
              <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-[0.3em]">Impact</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mt-3 tracking-tight">
                Numbers That Matter
              </h2>
            </AnimatedSection>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((s, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <StatsCounter end={s.value} label={s.label} suffix={s.suffix} color={s.color} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          VALUES — Core values grid
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1920&q=80"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-white/[0.92] backdrop-blur-[2px]" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c9a84c]/[0.03] rounded-full blur-[200px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <AnimatedSection>
              <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-[0.3em]">What We Stand For</span>
              <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mt-3 tracking-tight">
                Our Core Values
              </h2>
            </AnimatedSection>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="group rounded-3xl border border-gray-200 bg-white p-7 h-full hover:shadow-xl hover:border-[#c9a84c]/30 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                  {/* Hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 group-hover:bg-[#c9a84c]/10 flex items-center justify-center text-3xl mb-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                      {v.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TEAM — Leadership & People
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a84c]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#2e7d5b]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <AnimatedSection>
              <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-[0.3em]">The People Behind PiChess</span>
              <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mt-3 tracking-tight">
                Meet Our Team
              </h2>
              <p className="text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
                Passionate leaders, coaches, and organizers working together to grow chess across Ghana.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <AnimatedSection key={i} delay={i * 0.12}>
                <div className="group text-center">
                  {/* Photo */}
                  <div className="relative w-48 h-48 mx-auto mb-6 rounded-3xl overflow-hidden border-2 border-gray-100 group-hover:border-[#c9a84c]/40 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-[#c9a84c]/10">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-5xl text-gray-300">👤</span>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Gold accent corner */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  {/* Info */}
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#c9a84c] transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-sm font-semibold text-[#c9a84c] mt-1">{member.role}</p>
                  {member.bio && (
                    <p className="text-gray-500 text-sm mt-2 leading-relaxed max-w-[220px] mx-auto">
                      {member.bio}
                    </p>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MISSION — Quote section
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1586165368502-1bad9cc98592?w=1920&q=80"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gray-50/[0.90] backdrop-blur-[2px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 relative">
          <AnimatedSection>
            <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-[0.3em]">{mission.title}</span>
            <div className="mt-8 relative">
              <div className="absolute -top-4 left-0 text-8xl text-[#c9a84c]/10 font-serif leading-none">&ldquo;</div>
              <blockquote className="text-2xl sm:text-4xl font-light text-gray-700 italic leading-relaxed relative z-10 px-8">
                {mission.quote}
              </blockquote>
              <div className="mt-6 w-16 h-1 bg-[#c9a84c] mx-auto rounded-full" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA — Call to action
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-28 sm:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1920&q=80"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/85" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <AnimatedSection>
            <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-[0.3em]">Get Involved</span>
            <h2 className="text-4xl sm:text-6xl font-black text-white mt-4 mb-6 tracking-tight">
              Ready to Make <span className="gradient-text-gold">Your Move?</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Whether you want to learn, compete, or give back — there&apos;s a place for you at PiChess.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/academy"
                className="px-10 py-4 rounded-full bg-[#c9a84c] hover:bg-[#dbb95d] text-black font-bold text-base transition-all hover:shadow-[0_0_50px_rgba(201,168,76,0.2)] hover:scale-[1.03] active:scale-[0.97] inline-block"
              >
                Join the Academy
              </Link>
              <Link
                href="/ngo"
                className="px-10 py-4 rounded-full border border-white/20 text-white hover:bg-white/10 font-semibold text-base transition-all backdrop-blur-sm inline-block"
              >
                Support the Foundation
              </Link>
              <Link
                href="/tournaments"
                className="px-10 py-4 rounded-full border border-white/20 text-white hover:bg-white/10 font-semibold text-base transition-all backdrop-blur-sm inline-block"
              >
                View Tournaments
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Client-side animations wrapper */}
      <AboutAnimations />
    </div>
  );
}
