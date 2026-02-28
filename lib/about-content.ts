// ─── About page content types & defaults ────────────────────────────────────

export interface AboutHero {
  title: string;
  highlight: string;
  subtitle: string;
  backgroundImage: string;
}

export interface AboutStory {
  label: string;
  title: string;
  paragraphs: string[];
}

export interface AboutPillar {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface AboutStat {
  value: number;
  suffix: string;
  label: string;
  color: "gold" | "green" | "white";
}

export interface AboutMission {
  title: string;
  quote: string;
}

export interface AboutValue {
  icon: string;
  title: string;
  description: string;
}

export interface AboutTimeline {
  year: string;
  title: string;
  description: string;
}

export interface AboutTeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

// ─── Defaults ─────────────────────────────────────────────

export const defaultHero: AboutHero = {
  title: "About",
  highlight: "PiChess",
  subtitle: "We believe chess is more than a game. It's a discipline, a language, and a path to excellence — for everyone.",
  backgroundImage: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=1920&q=80",
};

export const defaultStory: AboutStory = {
  label: "Our Story",
  title: "Born in Ghana. Built for Africa.",
  paragraphs: [
    "PiChess was founded with a single belief: that every young person in Ghana deserves access to world-class chess education.",
    "From a small club to a national platform, we've grown into an ecosystem that serves students, communities, and champions.",
    "Our three pillars — the Academy, the Foundation, and Tournaments — work together to build future leaders through the board.",
  ],
};

export const defaultPillars: AboutPillar[] = [
  { icon: "🎓", title: "Academy", description: "Elite coaching for all levels, from beginner to competitive.", color: "#c9a84c" },
  { icon: "❤️", title: "Foundation", description: "Free chess programs for underserved youth across Ghana.", color: "#2e7d5b" },
  { icon: "🏆", title: "Tournaments", description: "Local and national events that create champions.", color: "#f59e0b" },
];

export const defaultStats: AboutStat[] = [
  { value: 500, suffix: "+", label: "Students", color: "gold" },
  { value: 8, suffix: "", label: "Years Active", color: "white" },
  { value: 50, suffix: "+", label: "Tournaments", color: "white" },
  { value: 200, suffix: "+", label: "Beneficiaries", color: "green" },
];

export const defaultMission: AboutMission = {
  title: "Our Mission",
  quote: "To use chess as a transformative tool for developing disciplined, strategic, and empowered individuals across Ghana and beyond.",
};

export const defaultValues: AboutValue[] = [
  { icon: "♟", title: "Discipline", description: "Every move counts. We teach focus, patience, and the power of preparation." },
  { icon: "♜", title: "Community", description: "Chess connects people across age, background, and language — building bonds that last." },
  { icon: "♛", title: "Excellence", description: "We push for mastery in everything — on the board and off. Mediocrity is not in our playbook." },
  { icon: "♝", title: "Inclusivity", description: "Chess is for everyone. We break barriers and open doors for underserved communities." },
];

export const defaultTimeline: AboutTimeline[] = [
  { year: "2017", title: "The Beginning", description: "PiChess started as a small chess club with just 10 passionate players in Accra." },
  { year: "2019", title: "Academy Launch", description: "We launched our structured coaching academy, bringing professional training to young players." },
  { year: "2021", title: "Foundation Born", description: "The PiChess Foundation was established to bring chess to underserved communities." },
  { year: "2023", title: "National Reach", description: "Expanded to multiple regions, hosting over 50 tournaments across Ghana." },
  { year: "2025", title: "Digital Era", description: "Launched our digital platform connecting players, coaches, and events nationwide." },
];

export const defaultTeam: AboutTeamMember[] = [
  { name: "John Doe", role: "Founder & CEO", bio: "Visionary leader who founded PiChess with a passion for using chess to empower Ghana's youth.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { name: "Jane Smith", role: "Head of Academy", bio: "International chess master and educator with over 15 years of coaching experience.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
  { name: "Michael Owusu", role: "Foundation Director", bio: "Dedicated to expanding chess access to underserved communities across Ghana.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
  { name: "Sarah Mensah", role: "Tournament Director", bio: "Organizes world-class chess events that bring together the best players nationwide.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
];
