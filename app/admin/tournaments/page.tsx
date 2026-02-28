/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { createTournament, updateTournament, deleteTournament } from "@/lib/actions/admin";

export const metadata = { title: "Tournaments | Admin" };

async function getTournaments() {
  try {
    return await (prisma as any).tournament.findMany({
      orderBy: { date: "desc" },
      include: { sponsors: true, photos: { take: 1 } },
    });
  } catch { return []; }
}

const statusStyle: Record<string, string> = {
  UPCOMING: "bg-blue-50 text-blue-600",
  ONGOING: "bg-green-50 text-green-600",
  COMPLETED: "bg-zinc-100 text-zinc-500",
};

export default async function AdminTournamentsPage() {
  const tournaments = await getTournaments();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">Tournaments</h1>
          <p className="text-zinc-400 mt-1">Create, edit and manage all chess tournaments.</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {["UPCOMING", "ONGOING", "COMPLETED"].map((s) => (
          <div key={s} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-2xl font-black text-zinc-900">{tournaments.filter((t: any) => t.status === s).length}</p>
            <p className={`text-xs font-semibold mt-1 inline-block px-2 py-0.5 rounded-full ${statusStyle[s]}`}>{s}</p>
          </div>
        ))}
      </div>

      {/* ── Create Tournament ───────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-bold text-zinc-900 mb-4">➕ Add New Tournament</h2>
        <form action={createTournament} className="grid sm:grid-cols-2 gap-4">
          <input name="title" required placeholder="Tournament title *" className="col-span-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
          <textarea name="description" rows={3} placeholder="Description" className="col-span-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none resize-none" />
          <input name="date" type="date" required className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
          <input name="location" required placeholder="Location *" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
          <input name="venue" placeholder="Venue" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
          <input name="registrationLink" placeholder="Registration URL" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
          <input name="tags" placeholder="Tags (comma-separated: open, ngo, academy)" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
          <div className="flex items-center gap-6">
            <select name="status" defaultValue="UPCOMING" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm">
              {["UPCOMING", "ONGOING", "COMPLETED"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
              <input type="checkbox" name="featured" value="true" className="rounded" /> Featured
            </label>
          </div>
          <div className="col-span-full">
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors">
              Create Tournament
            </button>
          </div>
        </form>
      </div>

      {/* ── Tournaments Table ───────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Location</th>
                <th className="text-left px-5 py-3">Tags</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Featured</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {tournaments.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-zinc-400 py-12">No tournaments yet. Create one above!</td></tr>
              ) : tournaments.map((t: any) => (
                <tr key={t.id} className="hover:bg-zinc-50/50 group">
                  <td className="px-5 py-3 font-medium text-zinc-900 max-w-[200px] truncate">{t.title}</td>
                  <td className="px-5 py-3 text-zinc-500 text-xs whitespace-nowrap">
                    {new Date(t.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3 text-zinc-500">{t.location}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {t.tags?.map((tag: string) => (
                        <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusStyle[t.status] ?? "bg-zinc-100 text-zinc-500"}`}>{t.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs ${t.featured ? "text-[#c9a84c] font-bold" : "text-zinc-300"}`}>
                      {t.featured ? "★ Featured" : "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2 items-center flex-wrap">
                      {/* Quick status/featured update */}
                      <form action={updateTournament} className="flex gap-1.5 items-center">
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="title" value={t.title} />
                        <input type="hidden" name="description" value={t.description ?? ""} />
                        <input type="hidden" name="date" value={new Date(t.date).toISOString().split("T")[0]} />
                        <input type="hidden" name="location" value={t.location} />
                        <input type="hidden" name="venue" value={t.venue ?? ""} />
                        <input type="hidden" name="registrationLink" value={t.registrationLink ?? ""} />
                        <input type="hidden" name="tags" value={(t.tags ?? []).join(",")} />
                        <select name="status" defaultValue={t.status} className="text-xs border border-zinc-200 rounded px-1.5 py-1 bg-white">
                          {["UPCOMING", "ONGOING", "COMPLETED"].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select name="featured" defaultValue={String(t.featured)} className="text-xs border border-zinc-200 rounded px-1.5 py-1 bg-white">
                          <option value="false">—</option>
                          <option value="true">★</option>
                        </select>
                        <button type="submit" className="text-xs bg-zinc-900 text-white px-2.5 py-1 rounded-lg hover:bg-zinc-700">Save</button>
                      </form>
                      {/* Delete */}
                      <form action={deleteTournament}>
                        <input type="hidden" name="id" value={t.id} />
                        <button type="submit" className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-100 font-semibold">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
