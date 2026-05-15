import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  Gamepad2,
  GraduationCap,
  Target,
  Trophy,
} from "lucide-react";

const journey = [
  {
    title: "Assess",
    desc: "We understand the student's level, age, schedule, and chess goals.",
    icon: ClipboardCheck,
  },
  {
    title: "Plan",
    desc: "A coach matches them with the right program and learning pace.",
    icon: Target,
  },
  {
    title: "Train",
    desc: "Lessons combine guided instruction, puzzles, game review, and practice.",
    icon: GraduationCap,
  },
  {
    title: "Practice",
    desc: "Students sharpen ideas through homework, friendly games, and club play.",
    icon: Gamepad2,
  },
  {
    title: "Compete",
    desc: "Ready students enter events and learn how to handle real tournament pressure.",
    icon: Trophy,
  },
  {
    title: "Review",
    desc: "Progress reports and game analysis turn experience into stronger decisions.",
    icon: BarChart3,
  },
];

export default function AcademyJourney() {
  return (
    <section className="bg-white px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-4 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
              Student Journey
            </span>
            <h2 className="max-w-2xl text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              A clear path from first lesson to confident play.
            </h2>
          </div>
          <Link
            href="/academy/enquire"
            className="inline-flex items-center gap-2 text-sm font-black text-[#b8963f] hover:text-[#8d732f]"
          >
            Start an enquiry
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {journey.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-all hover:-translate-y-1 hover:border-[#c9a84c]/35 hover:bg-white hover:shadow-xl hover:shadow-[#c9a84c]/10"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white transition-all group-hover:bg-[#c9a84c]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-black text-slate-300">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
