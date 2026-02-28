/* ────────────────────────────────────────────────────────
   Shared types & defaults for academy page content.
   Used by both the server-rendered academy page and
   the client-side admin editor.
   ──────────────────────────────────────────────────────── */

export interface AcademyHero {
  badge: string;
  title1: string;
  title2: string;
  description: string;
  bgImage: string;
  sideImage: string;
  floatStat: string;
  floatStatLabel: string;
  floatBadgeIcon: string;
  floatBadgeLabel: string;
}

export interface AcademyStat {
  end: number;
  label: string;
  suffix: string;
  color: string;
}

export interface AcademyProgram {
  title: string;
  age: string;
  desc: string;
  icon: string;
}

export interface AcademyFeature {
  icon: string;
  title: string;
  desc: string;
}

export interface AcademyCTA {
  title1: string;
  title2: string;
  description: string;
  buttonText: string;
}

/* ── Default values (current hardcoded values as fallbacks) ── */

export const defaultHero: AcademyHero = {
  badge: "Now Enrolling — 2026 Cohort",
  title1: "Train Like a",
  title2: "Champion.",
  description:
    "Ghana's premier chess academy. Expert coaches, structured programs, and a proven path to competitive excellence.",
  bgImage:
    "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=1920&q=80",
  sideImage:
    "https://images.unsplash.com/photo-1586165368502-1bad9cc4be3e?w=800&q=80",
  floatStat: "500+",
  floatStatLabel: "Students Trained",
  floatBadgeIcon: "♛",
  floatBadgeLabel: "Elite",
};

export const defaultStats: AcademyStat[] = [
  { end: 500, label: "Students Trained", suffix: "+", color: "gold" },
  { end: 15, label: "Expert Coaches", suffix: "", color: "white" },
  { end: 30, label: "Tournaments Won", suffix: "+", color: "gold" },
  { end: 5, label: "Programs Available", suffix: "", color: "white" },
];

export const defaultPrograms: AcademyProgram[] = [
  { title: "Junior Chess Program", age: "Ages 6–12", desc: "Foundational chess concepts, rules, and fun competitive play for young minds.", icon: "♟" },
  { title: "Intermediate Training", age: "Ages 12–18", desc: "Opening theory, endgame mastery, and tournament preparation for rising competitors.", icon: "♞" },
  { title: "Advanced Coaching", age: "18+", desc: "Elite competitive training with professional coaches and international exposure.", icon: "♛" },
  { title: "Weekend Intensive", age: "All Ages", desc: "Weekend-only accelerated programs for busy schedules seeking rapid improvement.", icon: "♜" },
];

export const defaultFeatures: AcademyFeature[] = [
  { icon: "🏆", title: "Tournament Ready", desc: "Regular competitions to sharpen your edge" },
  { icon: "🎯", title: "Personal Coaching", desc: "One-on-one sessions with titled players" },
  { icon: "📊", title: "Progress Tracking", desc: "Data-driven improvement methodology" },
  { icon: "🌍", title: "Global Network", desc: "Connect with chess communities worldwide" },
];

export const defaultCTA: AcademyCTA = {
  title1: "Ready to Start Your",
  title2: "Chess Journey?",
  description: "Fill out our enquiry form and a coach will get back to you within 24 hours.",
  buttonText: "Enquire Now",
};
