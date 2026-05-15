"use client";

import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  School,
  Target,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import type { AcademyLesson } from "@/lib/academy-content";
import { getAcademyLessonDetails } from "@/lib/academy-program-details";

type Choice = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const ageChoices: Choice[] = [
  { id: "child", label: "Child", icon: GraduationCap },
  { id: "teen", label: "Teen", icon: UserRound },
  { id: "adult", label: "Adult", icon: Users },
  { id: "school", label: "School", icon: School },
  { id: "company", label: "Company", icon: Building2 },
];

const levelChoices: Choice[] = [
  { id: "new", label: "New", icon: BookOpenCheck },
  { id: "improving", label: "Improving", icon: Target },
  { id: "competitive", label: "Competitive", icon: Trophy },
];

const goalChoices: Choice[] = [
  { id: "basics", label: "Learn basics", icon: BookOpenCheck },
  { id: "progress", label: "Build skill", icon: Target },
  { id: "private", label: "Personal coach", icon: UserRound },
  { id: "group", label: "Group class", icon: Users },
  { id: "tournament", label: "Win events", icon: Trophy },
  { id: "team", label: "Team training", icon: BriefcaseBusiness },
];

function findLesson(lessons: AcademyLesson[], text: string) {
  const needle = text.toLowerCase();
  return lessons.find((lesson) => lesson.title.toLowerCase().includes(needle));
}

function recommendLesson(lessons: AcademyLesson[], age: string, level: string, goal: string) {
  if (age === "school") return findLesson(lessons, "schools") ?? lessons[0];
  if (age === "company" || goal === "team") return findLesson(lessons, "companies") ?? lessons[0];
  if (goal === "private") return findLesson(lessons, "private") ?? lessons[0];
  if (goal === "group") return findLesson(lessons, "group") ?? lessons[0];
  if (goal === "tournament" || level === "competitive") return findLesson(lessons, "elite") ?? lessons[0];
  if (age === "child") return findLesson(lessons, "kids") ?? lessons[0];
  if (age === "adult" && level === "new") return findLesson(lessons, "adult beginner") ?? lessons[0];
  if (level === "new") return findLesson(lessons, "premium") ?? lessons[0];
  return findLesson(lessons, "premium") ?? lessons[0];
}

function SegmentedChoice({
  label,
  choices,
  value,
  onChange,
}: {
  label: string;
  choices: Choice[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
        {label}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {choices.map((choice) => {
          const Icon = choice.icon;
          const active = value === choice.id;
          return (
            <button
              key={choice.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(choice.id)}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-black transition-all ${
                active
                  ? "border-[#c9a84c] bg-[#c9a84c] text-white shadow-lg shadow-[#c9a84c]/20"
                  : "border-slate-200 bg-white text-slate-500 hover:border-[#c9a84c]/40 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{choice.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AcademyProgramFinder({ lessons }: { lessons: AcademyLesson[] }) {
  const [age, setAge] = useState("child");
  const [level, setLevel] = useState("new");
  const [goal, setGoal] = useState("progress");

  const recommended = useMemo(
    () => recommendLesson(lessons, age, level, goal),
    [age, goal, lessons, level]
  );

  if (!recommended) return null;

  const details = getAcademyLessonDetails(recommended);
  const enquiryHref = `/academy/enquire?program=${encodeURIComponent(recommended.title)}`;

  return (
    <section className="relative bg-white px-4 py-24">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 sm:p-8">
          <div className="mb-8">
            <span className="mb-4 inline-flex rounded-full border border-[#c9a84c]/25 bg-[#c9a84c]/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-[#b8963f]">
              Find Your Chess Path
            </span>
            <h2 className="max-w-2xl text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Match each student to the right Academy program.
            </h2>
          </div>

          <div className="space-y-7">
            <SegmentedChoice label="Who is this for?" choices={ageChoices} value={age} onChange={setAge} />
            <SegmentedChoice label="Current level" choices={levelChoices} value={level} onChange={setLevel} />
            <SegmentedChoice label="Main goal" choices={goalChoices} value={goal} onChange={setGoal} />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/15 sm:p-8">
          <div className="absolute inset-0 chess-bg opacity-[0.05]" />
          <div className="relative">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#d7bc63]">
                  Recommended
                </p>
                <h3 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  {recommended.title}
                </h3>
              </div>
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-4xl">
                {recommended.icon}
              </div>
            </div>

            <p className="text-base leading-7 text-slate-300">{recommended.desc}</p>

            <div className="my-8 grid gap-3 sm:grid-cols-2">
              {[
                ["Age", details.ageRange],
                ["Level", details.level],
                ["Format", details.format],
                ["Duration", details.duration],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
                  <p className="mt-1 text-sm font-bold text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-[#c9a84c]/30 bg-[#c9a84c]/10 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d7bc63]">Best for</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-white">{details.bestFor}</p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={enquiryHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a84c] px-6 py-4 text-sm font-black text-white transition-all hover:bg-[#b8963f]"
              >
                Enquire for this program
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/academy/lessons"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-4 text-sm font-black text-white transition-all hover:bg-white/10"
              >
                View all programs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
