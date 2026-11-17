"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, PhoneCall } from "lucide-react";
import HeroPhotoGrid from "./HeroPhotoGrid";
import { PICHESS_PHONE_LOCAL, buildLessonWhatsAppUrl } from "@/lib/whatsapp";

/* ── Defaults (used when no admin data) ─── */
const DEFAULTS = {
  background: "/uploads/1772297013069-i.jpg",
  images: [
    { src: "/uploads/1772297013069-i.jpg", alt: "Pi Chess coach guiding students at the board" },
    { src: "/uploads/1773531163801-photo_2026-03-14_23-30-27.jpg", alt: "Young Pi Chess student recording moves at a tournament" },
    { src: "/uploads/1772293918159-photo_5848045058580922524_y.jpg", alt: "Focused young chess player with digital clock" },
    { src: "/uploads/1772296915445-k.jpg", alt: "Pi Chess competitor thinking through her next move" },
  ],
  headline: "Build Sharper Minds",
  headlineAccent: "Through Chess.",
  subtitle:
    "Structured chess lessons for kids, teens, adults, and schools — in-person in Accra and live online with Ghana's trusted coaches.",
  stats: [
    { val: "500+", label: "Students Trained" },
    { val: "15+", label: "Expert Coaches" },
    { val: "50+", label: "Tournaments" },
  ],
};

interface HeroData {
  background?: string;
  images?: { src: string; alt: string }[];
  headline?: string;
  headlineAccent?: string;
  subtitle?: string;
  stats?: { val: string; label: string }[];
}

export default function HeroSection({ heroData }: { heroData?: HeroData | null }) {
  const d = { ...DEFAULTS, ...heroData };
  const bg = d.background || DEFAULTS.background;
  const images = d.images?.length ? d.images : DEFAULTS.images;
  const stats = d.stats?.length ? d.stats : DEFAULTS.stats;
  const whatsAppHref = buildLessonWhatsAppUrl();

  return (
    <section className="relative min-h-[88dvh] flex items-center overflow-hidden bg-white">
      {/* Background image with clean bright readable overlay */}
      <div className="absolute inset-0">
        <Image
          src={bg}
          alt="Pi Chess coaching session"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.95)_44%,rgba(255,255,255,0.72)_72%,rgba(255,255,255,0.35)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.28)_45%,rgba(255,255,255,0.96)_100%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          {/* Left: Clear Parent & Learner Messaging (Immediately Visible) */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/35 bg-white/95 px-4 py-1.5 shadow-sm mb-5 sm:mb-7">
              <span className="w-2 h-2 rounded-full bg-[#25D366]" />
              <span className="text-[#8a6b18] text-[11px] sm:text-xs font-bold tracking-wide">
                In-Person in Accra &amp; Online · Ages 5 to Adult
              </span>
            </div>

            <h1 className="text-[2.5rem] sm:text-5xl lg:text-[4.25rem] xl:text-[4.75rem] font-black tracking-tight text-gray-950 leading-[1.04] mb-5">
              {d.headline}
              <br />
              <span className="bg-gradient-to-r from-[#a77d1b] via-[#d5ae48] to-[#8c681a] bg-clip-text text-transparent">
                {d.headlineAccent}
              </span>
            </h1>

            <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-lg mb-8">
              {d.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring group inline-flex items-center justify-center gap-2.5 rounded-xl bg-gray-950 px-7 py-4 text-sm sm:text-base font-bold text-white shadow-lg shadow-black/15 transition-all hover:bg-[#c9a84c] hover:text-gray-950 active:scale-[0.98]"
              >
                <MessageCircle className="h-5 w-5 text-[#25D366] group-hover:text-gray-950 transition-colors" />
                Chat on WhatsApp to Start
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                href="/academy"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white/90 px-7 py-4 text-sm sm:text-base font-bold text-gray-900 shadow-sm transition-all hover:border-[#c9a84c] hover:bg-white"
              >
                Explore Lesson Programs
              </Link>
            </div>

            {/* Clean trust stats */}
            <div className="mt-9 grid grid-cols-3 gap-3 border-t border-gray-200/80 pt-5 sm:mt-11 sm:pt-6">
              {stats.map((s, i) => (
                <div key={i} className="rounded-xl border border-gray-200/80 bg-white/85 px-3 py-3 shadow-sm">
                  <p className="text-xl sm:text-3xl font-black text-gray-950">{s.val}</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-600">
              <PhoneCall className="h-3.5 w-3.5 text-[#c9a84c]" />
              <span>Kids (5–17), Adult Beginners, Private 1-on-1 &amp; Schools · WhatsApp {PICHESS_PHONE_LOCAL}</span>
            </div>
          </div>

          {/* Right: Photo grid */}
          <div className="relative">
            <HeroPhotoGrid images={images} />
          </div>
        </div>
      </div>
    </section>
  );
}
