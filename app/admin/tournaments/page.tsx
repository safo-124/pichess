/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">Tournaments</h1>
          <p className="text-zinc-400 mt-1">Manage all chess tournaments.</p>
        </div>
        <a href="#add" className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors">
          + Add Tournament
        </a>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {["UPCOMING","ONGOING","COMPLETED"].map((s) => (
          <div key={s} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-2xl font-black text-zinc-900">{tournaments.filter((t: any) => t.status === s).length}</p>
            <p className={`text-xs font-semibold mt-1 inline-block px-2 py-0.5 rounded-full ${statusStyle[s]}`}>{s}</p>
          </div>
        ))}
      </div>

      {/* Table */}
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
                <th className="text-left px-5 py-3">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {tournaments.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-zinc-400 py-12">No tournaments yet.</td></tr>
              ) : tournaments.map((t: any) => (
                <tr key={t.id} className="hover:bg-zinc-50/50">
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
                    <form action={async (fd) => {
                      "use server";
                      await (prisma as any).tournament.update({
                        where: { id: t.id },
                        data: {
                          status: fd.get("status") as string,
                          featured: fd.get("featured") === "true",
                        }
                      });
                    }}>
                      <div className="flex gap-2 items-center">
                        <select name="status" defaultValue={t.status} className="text-xs border border-zinc-200 rounded px-1.5 py-1 bg-white">
                          {["UPCOMING","ONGOING","COMPLETED"].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select name="featured" defaultValue={String(t.featured)} className="text-xs border border-zinc-200 rounded px-1.5 py-1 bg-white">
                          <option value="false">—</option>
                          <option value="true">Featured</option>
                        </select>
                        <button type="submit" className="text-xs bg-zinc-900 text-white px-3 py-1 rounded-lg">Save</button>
                      </div>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add tournament notice */}
      <div id="add" className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
        <p className="text-zinc-400 text-sm">Tournament creation form coming soon.</p>
        <p className="text-zinc-400 text-xs mt-1">Use Prisma Studio or the API to add tournaments for now.</p>
        <a href="/admin/studio" className="inline-block mt-3 text-xs text-zinc-600 underline">Open Prisma Studio →</a>
      </div>
    </div>
  );
}
