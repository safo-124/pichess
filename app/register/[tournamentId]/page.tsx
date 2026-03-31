/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import InlineRegistrationForm from "@/components/shared/InlineRegistrationForm";
import Link from "next/link";

interface Props {
  params: Promise<{ tournamentId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { tournamentId } = await params;
  const tournament = await (prisma as any).tournament.findUnique({
    where: { id: Number(tournamentId) },
    select: { title: true },
  });
  return {
    title: tournament ? `Register — ${tournament.title}` : "Register — PiChess",
  };
}

async function getTournament(id: number) {
  const t = await (prisma as any).tournament.findUnique({
    where: { id },
    include: {
      registrations: { where: { status: "CONFIRMED" }, select: { id: true } },
    },
  });
  if (!t) return null;
  return {
    id: t.id,
    title: t.title,
    description: t.description,
    date: t.date instanceof Date ? t.date.toISOString() : String(t.date),
    endDate: t.endDate ? (t.endDate instanceof Date ? t.endDate.toISOString() : String(t.endDate)) : null,
    location: t.location,
    venue: t.venue,
    flyer: t.flyer,
    type: t.type ?? "TOURNAMENT",
    status: t.status,
    maxSpots: t.maxSpots ?? null,
    registeredCount: t.registrations?.length ?? 0,
  };
}

export default async function RegisterPage({ params }: Props) {
  const { tournamentId } = await params;
  const id = Number(tournamentId);
  if (isNaN(id)) notFound();

  const tournament = await getTournament(id);
  if (!tournament) notFound();

  const isCompleted = tournament.status === "COMPLETED";
  const eventDate = new Date(tournament.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1628] to-[#0a0e1a] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.06),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.03),transparent_50%)]" />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-12">
        {/* Logo / brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-black text-white tracking-tight">♟️ PiChess</h1>
          </Link>
        </div>

        {/* Tournament info card */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm p-6 mb-6">
          {tournament.flyer && (
            <div className="w-full aspect-[16/9] rounded-xl overflow-hidden mb-4">
              <img src={tournament.flyer} alt={tournament.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-300 uppercase tracking-wider">
              {tournament.type === "EVENT" ? "🎪 Event" : "🏆 Tournament"}
            </span>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              tournament.status === "UPCOMING"
                ? "bg-blue-500/15 border border-blue-500/25 text-blue-300"
                : tournament.status === "ONGOING"
                ? "bg-green-500/15 border border-green-500/25 text-green-300"
                : "bg-zinc-500/15 border border-zinc-500/25 text-zinc-400"
            }`}>
              {tournament.status}
            </span>
          </div>
          <h2 className="text-xl font-black text-white leading-tight mb-2">{tournament.title}</h2>
          {tournament.description && (
            <p className="text-white/40 text-sm mb-3 line-clamp-3">{tournament.description}</p>
          )}
          <div className="flex items-center gap-4 text-white/35 text-xs">
            <span>📅 {eventDate}</span>
            <span>📍 {tournament.location}{tournament.venue ? ` · ${tournament.venue}` : ""}</span>
          </div>
          {tournament.maxSpots && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Capacity</span>
                <span className="text-xs font-bold text-white/50">
                  {tournament.registeredCount} / {tournament.maxSpots} confirmed
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    tournament.registeredCount / tournament.maxSpots >= 0.9 ? "bg-red-400" :
                    tournament.registeredCount / tournament.maxSpots >= 0.7 ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                  style={{ width: `${Math.min(100, (tournament.registeredCount / tournament.maxSpots) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {isCompleted ? (
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-8 text-center">
            <span className="text-4xl mb-3 block">🏁</span>
            <h3 className="text-lg font-bold text-white mb-2">Event Completed</h3>
            <p className="text-white/40 text-sm">This tournament/event has already ended. Registrations are closed.</p>
            <Link href="/tournaments" className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 text-sm font-semibold hover:bg-amber-500/30 transition-colors">
              Browse Upcoming Events
            </Link>
          </div>
        ) : (
          <InlineRegistrationForm tournament={{
            id: tournament.id,
            title: tournament.title,
            date: tournament.date,
            location: tournament.location,
            venue: tournament.venue,
            type: tournament.type,
            maxSpots: tournament.maxSpots,
            registeredCount: tournament.registeredCount,
            flyer: tournament.flyer,
          }} />
        )}

        <div className="text-center mt-8">
          <Link href="/tournaments" className="text-white/30 text-xs hover:text-white/50 transition-colors">
            ← View all tournaments & events
          </Link>
        </div>
      </div>
    </div>
  );
}
