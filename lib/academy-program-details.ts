import type { AcademyLesson } from "@/lib/academy-content";

export type AcademyLessonDetails = {
  ageRange: string;
  level: string;
  format: string;
  duration: string;
  bestFor: string;
};

const fallbackDetails: Record<string, AcademyLessonDetails> = {
  "premium lessons": {
    ageRange: "Kids, teens & adults",
    level: "Beginner to intermediate",
    format: "Weekly coached sessions",
    duration: "Ongoing term program",
    bestFor: "Students who want structure, homework, and visible progress.",
  },
  "private lessons": {
    ageRange: "All ages",
    level: "All levels",
    format: "1-on-1 coaching",
    duration: "Flexible schedule",
    bestFor: "Players who want personal attention or fast improvement.",
  },
  "group lessons": {
    ageRange: "Kids, teens & adults",
    level: "Beginner to intermediate",
    format: "Small group class",
    duration: "Weekly sessions",
    bestFor: "Learners who enjoy practice partners and social learning.",
  },
  "chess for kids": {
    ageRange: "Ages 5-12",
    level: "New to beginner",
    format: "Playful guided class",
    duration: "Weekly sessions",
    bestFor: "Young learners building confidence and thinking skills.",
  },
  "adult beginner course": {
    ageRange: "Adults",
    level: "New to beginner",
    format: "Beginner course",
    duration: "Short course",
    bestFor: "Adults starting chess or returning after a long break.",
  },
  "chess for special needs": {
    ageRange: "Kids & teens",
    level: "Adaptive",
    format: "Small supportive class",
    duration: "Personalized pace",
    bestFor: "Students who need calmer pacing and individual support.",
  },
  "grandmaster / elite lessons": {
    ageRange: "Teens & adults",
    level: "Advanced",
    format: "Elite performance coaching",
    duration: "Tournament cycles",
    bestFor: "Competitive players preparing for serious events.",
  },
  "chess in schools program": {
    ageRange: "Schools",
    level: "Beginner to club level",
    format: "School partnership",
    duration: "Term or year program",
    bestFor: "Schools building clubs, curriculum, and competitions.",
  },
  "chess for companies & organizations": {
    ageRange: "Companies & teams",
    level: "All levels",
    format: "Workshop or team program",
    duration: "Custom engagement",
    bestFor: "Organizations using chess for strategy and team-building.",
  },
};

export function getAcademyLessonDetails(lesson: AcademyLesson): AcademyLessonDetails {
  const fallback = fallbackDetails[lesson.title.toLowerCase()] ?? {
    ageRange: lesson.category === "institutional" ? "Groups & institutions" : "All ages",
    level: lesson.category === "institutional" ? "Custom level" : "All levels",
    format: lesson.category === "institutional" ? "Custom program" : "Coached lessons",
    duration: "Flexible",
    bestFor: lesson.desc || "Students looking for structured chess growth.",
  };

  return {
    ageRange: lesson.ageRange || fallback.ageRange,
    level: lesson.level || fallback.level,
    format: lesson.format || fallback.format,
    duration: lesson.duration || fallback.duration,
    bestFor: lesson.bestFor || fallback.bestFor,
  };
}
