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

const inputCls = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 outline-none transition-all placeholder:text-zinc-300";
const btnCls = "px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-amber-500/20 transition-all";

export default async function AdminTournamentsPage() {
  const tournaments = await getTournaments();
  const upcoming = tournaments.filter((t: any) => t.status === "UPCOMING").length;
  const ongoing = tournaments.filter((t: any) => t.status === "ONGOING").length;
  const completed = tournaments.filter((t: any) => t.status === "COMPLETED").length;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Tournaments</h1>
        <p className="text-zinc-400 mt-1 text-sm">Create, edit and manage all chess tournaments.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: tournaments.length },
          { label: "Upcoming", value: upcoming, color: "text-blue-600 bg-blue-50" },
          { label: "Ongoing", value: ongoing, color: "text-green-600 bg-green-50" },
          { label: "Completed", value: completed, color: "text-zinc-500 bg-zinc-100" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-zinc-200/80 p-4">
            <p className="text-2xl font-black text-zinc-900">{s.value}</p>
            <p className="text-xs text-zinc-400 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Create Tournament */}
      <div className="rounded-2xl bg-white border border-zinc-200/80 p-6">
        <h2 className="text-base font-bold text-zinc-800 mb-4">Add New Tournament</h2>
        <form action={createTournament} className="grid sm:grid-cols-2 gap-4">
          <input name="title" required placeholder="Tournament title *" className={`col-span-full ${inputCls}`} />
          <textarea name="description" rows={3} placeholder="Description" className={`col-span-full ${inputCls} resize-none`} />
          <input name="date" type="date" required className={inputCls} />
          <input name="location" required placeholder="Location *" className={inputCls} />
          <input name="venue" placeholder="Venue" className={inputCls} />
          <input name="registrationLink" placeholder="Registration URL" className={inputCls} />
          <input name="tags" placeholder="Tags (comma-separated: open, ngo, academy)" className={inputCls} />
          <div className="flex items-center gap-6">
            <select name="status" defaultValue="UPCOMING" className={inputCls}>
              {["UPCOMING", "ONGOING", "COMPLETED"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer whitespace-nowrap">
              <input type="checkbox" name="featured" value="true" className="rounded border-zinc-300" /> Featured
            </label>
          </div>
          <div className="col-span-full">
            <button type="submit" className={btnCls}>Create Tournament</button>
          </div>
        </form>
      </div>

      {/* Tournaments Table */}
      <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="font-bold text-zinc-800 text-sm">All Tournaments</h3>
          <span className="text-xs text-zinc-400">{tournaments.length} tournaments</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/80 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
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
                <tr><td colSpan={7} className="text-center text-zinc-300 py-16 text-sm">No tournaments yet. Create one above!</td></tr>
              ) : tournaments.map((t: any) => (
                <tr key={t.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-5 py-3 font-semibold text-zinc-800 max-w-[200px] truncate">{t.title}</td>
                  <td className="px-5 py-3 text-zinc-400 text-[11px] whitespace-nowrap">
                    {new Date(t.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3 text-zinc-500 text-xs">{t.location}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {t.tags?.map((tag: string) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusStyle[t.status] ?? "bg-zinc-100 text-zinc-500"}`}>{t.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs ${t.featured ? "text-amber-500 font-bold" : "text-zinc-300"}`}>
                      {t.featured ? "★ Featured" : "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1.5 items-center">
                      <form action={updateTournament} className="flex gap-1 items-center">
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="title" value={t.title} />
                        <input type="hidden" name="description" value={t.description ?? ""} />
                        <input type="hidden" name="date" value={new Date(t.date).toISOString().split("T")[0]} />
                        <input type="hidden" name="location" value={t.location} />
                        <input type="hidden" name="venue" value={t.venue ?? ""} />
                        <input type="hidden" name="registrationLink" value={t.registrationLink ?? ""} />
                        <input type="hidden" name="tags" value={(t.tags ?? []).join(",")} />
                        <select name="status" defaultValue={t.status} className="text-[11px] border border-zinc-200 rounded-lg px-1.5 py-1 bg-white">
                          {["UPCOMING", "ONGOING", "COMPLETED"].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select name="featured" defaultValue={String(t.featured)} className="text-[11px] border border-zinc-200 rounded-lg px-1.5 py-1 bg-white">
                          <option value="false">—</option>
                          <option value="true">★</option>
                        </select>
                        <button type="submit" className="text-[11px] bg-zinc-800 text-white px-2 py-1 rounded-lg hover:bg-zinc-700 font-medium">Save</button>
                      </form>
                      <form action={deleteTournament}>
                        <input type="hidden" name="id" value={t.id} />
                        <button type="submit" className="text-[11px] bg-red-50 text-red-500 px-2 py-1 rounded-lg hover:bg-red-100 font-semibold">Del</button>
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
