/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { createTournament, updateTournament, deleteTournament, addTournamentPhoto, deleteTournamentPhoto } from "@/lib/actions/admin";
import AdminTournamentManager from "@/components/admin/AdminTournamentManager";

export const metadata = { title: "Tournaments & Events | Admin" };

async function getTournaments() {
  try {
    const rows = await (prisma as any).tournament.findMany({
      orderBy: { date: "desc" },
      include: { photos: true },
    });
    return rows.map((t: any) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      date: t.date instanceof Date ? t.date.toISOString() : String(t.date),
      endDate: t.endDate ? (t.endDate instanceof Date ? t.endDate.toISOString() : String(t.endDate)) : null,
      location: t.location,
      venue: t.venue,
      flyer: t.flyer,
      registrationLink: t.registrationLink,
      type: t.type ?? "TOURNAMENT",
      tags: t.tags ?? [],
      status: t.status,
      featured: t.featured,
      photos: t.photos?.map((p: any) => ({ id: p.id, url: p.url, caption: p.caption })) ?? [],
    }));
  } catch {
    return [];
  }
}

export default async function AdminTournamentsPage() {
  const tournaments = await getTournaments();

  return (
    <AdminTournamentManager
      tournaments={tournaments}
      createAction={createTournament}
      updateAction={updateTournament}
      deleteAction={deleteTournament}
      addPhotoAction={addTournamentPhoto}
      deletePhotoAction={deleteTournamentPhoto}
    />
  );
}
