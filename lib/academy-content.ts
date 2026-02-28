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

export interface AcademyLesson {
  title: string;
  desc: string;
  longDesc: string;
  icon: string;
  image: string;
  category: "core" | "institutional";
}

export interface AcademyFeature {
  icon: string;
  title: string;
  desc: string;
}

export interface AcademyLessonsHero {
  badge: string;
  title: string;
  description: string;
  bgImage: string;
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
  { end: 9, label: "Lesson Packages", suffix: "", color: "white" },
];

export const defaultLessons: AcademyLesson[] = [
  {
    title: "Premium Lessons",
    desc: "Structured weekly sessions, homework, and progress tracking. Ideal for serious learners (Adults & Kids).",
    longDesc: "Our Premium Lessons are the gold standard of chess education at PiChess Academy. Students receive structured weekly sessions that follow a carefully designed curriculum, progressing from foundational concepts to advanced strategies. Each session includes guided practice, tactical puzzles, and game analysis. Between sessions, students receive personalized homework assignments to reinforce what they've learned. Our progress tracking system ensures every student's development is monitored, with regular assessments and feedback reports shared with parents and guardians.",
    icon: "♛",
    image: "",
    category: "core",
  },
  {
    title: "Private Lessons",
    desc: "One-on-one coaching with a customized training plan.",
    longDesc: "Private Lessons offer the most personalized chess training experience. Work directly with one of our expert coaches who will assess your current skill level, identify areas for improvement, and create a fully customized training plan tailored to your goals. Whether you're preparing for a tournament, working on specific weaknesses, or accelerating your learning, private sessions provide the focused attention needed to make rapid progress. Sessions can be scheduled flexibly to fit your availability.",
    icon: "🎯",
    image: "",
    category: "core",
  },
  {
    title: "Group Lessons",
    desc: "Small interactive classes, affordable for multiple students.",
    longDesc: "Group Lessons bring together 4-8 students of similar skill levels for engaging, interactive chess classes. Students benefit from learning alongside peers, practicing with different playing styles, and developing competitive instincts in a supportive environment. Our coaches facilitate group discussions, team exercises, and friendly mini-tournaments within each session. Group lessons are an affordable way to receive quality chess instruction while building friendships and a sense of community.",
    icon: "👥",
    image: "",
    category: "core",
  },
  {
    title: "Chess for Kids",
    desc: "Fun, age-appropriate learning for children 5–12 years.",
    longDesc: "Chess for Kids is specially designed for young learners aged 5-12, transforming complex chess concepts into fun, age-appropriate activities. Using stories, puzzles, games, and colorful learning materials, our specially trained coaches make chess exciting and accessible for children. Beyond chess skills, kids develop critical thinking, patience, problem-solving abilities, and sportsmanship. Classes are structured with a mix of instruction, practice, and play to keep young minds engaged and enthusiastic about learning.",
    icon: "🧒",
    image: "",
    category: "core",
  },
  {
    title: "Adult Beginner Course",
    desc: "Designed for adults learning the game for the first time.",
    longDesc: "Never too late to start! Our Adult Beginner Course is crafted specifically for adults who are new to chess or returning after a long break. In a relaxed, judgment-free environment, you'll learn everything from the basic rules and piece movements to fundamental strategies and opening principles. The course covers chess etiquette, notation, time management, and essential tactical patterns. By the end of the program, you'll be confident enough to play complete games and continue your chess journey independently.",
    icon: "📖",
    image: "",
    category: "core",
  },
  {
    title: "Chess for Special Needs",
    desc: "Adaptive learning for neurodiverse students, small class sizes, individual support.",
    longDesc: "Our Chess for Special Needs program provides an inclusive and adaptive learning environment for neurodiverse students. With small class sizes of 2-4 students and dedicated individual support, our specially trained coaches use visual aids, tactile chess sets, simplified instructions, and positive reinforcement techniques. Chess has been shown to improve focus, memory, social interaction, and cognitive development in students with diverse learning needs. We work closely with parents and caregivers to tailor the experience to each student's unique strengths and challenges.",
    icon: "💜",
    image: "",
    category: "core",
  },
  {
    title: "Grandmaster / Elite Lessons",
    desc: "Advanced tournament preparation, high-level strategy, and performance coaching.",
    longDesc: "The Grandmaster / Elite program is designed for serious competitive players looking to reach the highest levels of chess. Work with our strongest coaches and titled players on advanced opening preparation, deep endgame theory, complex middlegame strategies, and psychological aspects of competitive play. Students receive detailed game analysis using engine-assisted tools, participate in simulated tournament conditions, and develop critical time management skills. This program includes access to premium databases, video analysis sessions, and preparation strategies for national and international competitions.",
    icon: "🏆",
    image: "",
    category: "core",
  },
  {
    title: "Chess in Schools Program",
    desc: "After-school clubs, structured curriculum, and inter-school competitions.",
    longDesc: "Transform your school's extracurricular offerings with our Chess in Schools Program. We provide everything needed to establish a thriving chess culture: trained instructors, structured age-appropriate curriculum, chess equipment, and organized inter-school competitions. Our program has been proven to improve students' academic performance, concentration, and critical thinking skills. We partner with schools across Ghana to deliver weekly after-school sessions, lunchtime clubs, and annual chess tournaments that bring the school community together.",
    icon: "🏫",
    image: "",
    category: "institutional",
  },
  {
    title: "Chess for Companies & Organizations",
    desc: "Corporate training, team-building workshops, executive coaching, and strategy seminars tailored for employees.",
    longDesc: "Bring the strategic thinking of chess into your workplace with our corporate chess programs. We offer team-building workshops that use chess as a framework for developing strategic planning, decision-making, and leadership skills. Our corporate packages include beginner-friendly workshops, executive coaching sessions, inter-departmental tournaments, and strategy seminars that draw parallels between chess principles and business management. Perfect for company retreats, team events, or ongoing employee development programs. We customize every engagement to align with your organization's goals and culture.",
    icon: "🏢",
    image: "",
    category: "institutional",
  },
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

export const defaultLessonsHero: AcademyLessonsHero = {
  badge: "Curriculum",
  title: "Lesson Packages",
  description: "From private coaching to group classes — find the perfect lesson format for every player. Click on any card to learn more.",
  bgImage: "",
};
