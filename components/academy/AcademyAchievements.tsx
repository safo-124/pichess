import Link from "next/link";
import { ArrowRight, CalendarCheck2, Medal, MessageSquareQuote, UsersRound } from "lucide-react";

type CompletedTournament = {
  id: number;
  title: string;
  date: Date;
  location: string;
  venue?: string | null;
};

export default function AcademyAchievements({
  completedTournaments,
  testimonialCount,
  coachCount,
}: {
  completedTournaments: CompletedTournament[];
  testimonialCount: number;
  coachCount: number;
}) {
  return (
    <section className="bg-slate-50 px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <span className="mb-4 inline-flex rounded-full border border-[#c9a84c]/25 bg-[#c9a84c]/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-[#b8963f]">
              Academy Proof
            </span>
            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Training connected to real competition.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-500 lg:ml-auto">
            The Academy should feel alive: coaches, student stories, and completed tournaments all point learners toward the next serious step.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <div className="mb-7 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <CalendarCheck2 className="h-5 w-5" />
              </div>
              <Link href="/tournaments" className="inline-flex items-center gap-1 text-xs font-black text-[#b8963f]">
                Completed tournaments
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <h3 className="text-xl font-black text-slate-950">Recent completed events</h3>
            <div className="mt-5 space-y-3">
              {completedTournaments.length > 0 ? (
                completedTournaments.slice(0, 3).map((event) => (
                  <Link
                    key={event.id}
                    href="/tournaments"
                    className="block rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-[#c9a84c]/35 hover:bg-white"
                  >
                    <p className="text-sm font-black text-slate-950">{event.title}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(event.date)}
                      {" · "}
                      {event.venue || event.location}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-400">
                  Completed Academy events will appear here once tournaments are added.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c9a84c] text-white">
              <MessageSquareQuote className="h-5 w-5" />
            </div>
            <p className="text-5xl font-black tracking-tight text-slate-950">{testimonialCount}</p>
            <h3 className="mt-3 text-xl font-black text-slate-950">Student stories</h3>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Published testimonials help families see the Academy through real student and parent experience.
            </p>
            <Link href="/academy#testimonials" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#b8963f]">
              Read testimonials
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-950 p-6 text-white">
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#d7bc63]">
              <UsersRound className="h-5 w-5" />
            </div>
            <p className="text-5xl font-black tracking-tight">{coachCount}</p>
            <h3 className="mt-3 text-xl font-black">Active coaches</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Coach profiles should lead with trust: role, experience, photos, and published visibility from admin.
            </p>
            <Link href="/academy/team" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#d7bc63]">
              Meet the team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-4 rounded-[2rem] border border-[#c9a84c]/25 bg-[#c9a84c]/10 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#c9a84c] text-white">
              <Medal className="h-5 w-5" />
            </div>
            <div>
            <h3 className="font-black text-slate-950">Every result becomes part of the path.</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
                Students learn from completed events, celebrate progress, and step into the next challenge with a clearer plan.
            </p>
            </div>
          </div>
          <Link
            href="/academy/enquire"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white sm:mt-0"
          >
            Join the Academy
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
