// ─── Learning Tools page content types & defaults ─────────────────────────

export interface LearningToolsHero {
  title: string;
  highlight: string;
  subtitle: string;
  image: string;
}

export interface LearningTool {
  id: string;
  title: string;
  desc: string;
  icon: string;      // key mapped to Lucide icon in component
  category: string;   // "practice" | "study" | "play"
  href: string;
  color: string;      // gradient classes e.g. "from-orange-500 to-amber-500"
  stats: string;
  badge?: string;
}

export interface LearningTip {
  icon: string;
  tip: string;
}

export interface LearningToolsCTA {
  heading: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export interface LearningToolsShowcase {
  image: string;
  title: string;
  subtitle: string;
}

// ─── Defaults ─────────────────────────────────────────────

export const defaultHero: LearningToolsHero = {
  title: "Level Up Your",
  highlight: "Chess Game",
  subtitle:
    "Interactive puzzles, engine analysis, opening theory, and more — everything you need to go from beginner to master.",  image: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=800&q=80",};

export const defaultTools: LearningTool[] = [
  {
    id: "tactics",
    title: "Tactics Trainer",
    desc: "Sharpen your tactical vision with thousands of puzzles sorted by theme and difficulty. Pattern recognition is the key to chess mastery.",
    icon: "Target",
    category: "practice",
    href: "https://lichess.org/training",
    color: "from-orange-500 to-amber-500",
    stats: "10,000+ puzzles",
    badge: "Most Popular",
  },
  {
    id: "openings",
    title: "Opening Explorer",
    desc: "Study millions of master games to find the best openings. Explore variations, learn theory, and build your repertoire.",
    icon: "BookOpen",
    category: "study",
    href: "https://lichess.org/opening",
    color: "from-blue-500 to-cyan-500",
    stats: "All major openings",
  },
  {
    id: "engine",
    title: "Play vs Engine",
    desc: "Challenge Stockfish at any level from beginner to grandmaster. Perfect for testing new ideas and practicing endgames.",
    icon: "Swords",
    category: "play",
    href: "https://lichess.org/ai",
    color: "from-red-500 to-rose-500",
    stats: "Adjustable difficulty",
  },
  {
    id: "analysis",
    title: "Game Analysis",
    desc: "Upload or paste your games for deep engine analysis. Identify mistakes, blunders, and missed brilliancies.",
    icon: "Brain",
    category: "study",
    href: "https://lichess.org/analysis",
    color: "from-violet-500 to-purple-500",
    stats: "Stockfish 16+",
  },
  {
    id: "endgame",
    title: "Endgame Practice",
    desc: "Master essential endgame positions. From basic king & pawn to complex rook endgames — build a solid foundation.",
    icon: "GraduationCap",
    category: "practice",
    href: "https://lichess.org/practice",
    color: "from-emerald-500 to-green-500",
    stats: "Guided lessons",
  },
  {
    id: "puzzleStorm",
    title: "Puzzle Storm",
    desc: "Solve as many puzzles as possible in 3 minutes! Compete against yourself and climb the leaderboard.",
    icon: "Zap",
    category: "practice",
    href: "https://lichess.org/storm",
    color: "from-yellow-500 to-orange-400",
    stats: "3-minute sprint",
    badge: "Fun",
  },
  {
    id: "coordinates",
    title: "Board Vision",
    desc: "Train your board vision by identifying coordinates quickly. Essential for reading notation and improving speed.",
    icon: "Lightbulb",
    category: "practice",
    href: "https://lichess.org/training/coordinate",
    color: "from-pink-500 to-rose-400",
    stats: "Speed drill",
  },
  {
    id: "studies",
    title: "Interactive Studies",
    desc: "Browse community-created studies on every topic imaginable. Learn from annotated games and interactive lessons.",
    icon: "Star",
    category: "study",
    href: "https://lichess.org/study",
    color: "from-teal-500 to-cyan-400",
    stats: "Community driven",
  },
];

export const defaultTips: LearningTip[] = [
  { icon: "♔", tip: "Always check for checks, captures, and threats before making your move." },
  { icon: "♞", tip: "Knights are strongest in closed positions. Place them on outposts in the center." },
  { icon: "♖", tip: "Rooks belong on open files. Connect your rooks and place them on the 7th rank." },
  { icon: "♗", tip: "The bishop pair is a powerful advantage in open positions." },
  { icon: "♟", tip: "Passed pawns must be pushed! They become more dangerous as they advance." },
  { icon: "♕", tip: "Don't bring your queen out too early — develop minor pieces first." },
];

export const defaultCTA: LearningToolsCTA = {
  heading: "Ready to Train?",
  subtitle:
    "Join PiChess Academy for structured coaching, weekly tournaments, and a community of passionate players.",
  primaryLabel: "Join the Academy",
  primaryHref: "/academy",
  secondaryLabel: "Get in Touch",
  secondaryHref: "/contact",
};

export const defaultShowcase: LearningToolsShowcase = {
  image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1200&q=80",
  title: "Train Smarter, Not Harder",
  subtitle:
    "Our curated tools and resources help you focus on what matters most \u2014 improving your game one move at a time.",
};
