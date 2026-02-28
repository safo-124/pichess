/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { createPartner, deletePartner, createPuzzle, deletePuzzle } from "@/lib/actions/admin";
import AdminTabs from "@/components/admin/AdminTabs";

export const metadata = { title: "Partners & Extras | Admin" };

async function getData() {
  try {
    const [partners, puzzles, inquiries] = await Promise.all([
      (prisma as any).partner.findMany({ orderBy: { order: "asc" } }),
      (prisma as any).daily_Puzzle.findMany({ orderBy: { date: "desc" }, take: 20 }),
      (prisma as any).sponsor_Inquiry.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    return { partners, puzzles, inquiries };
  } catch { return { partners: [], puzzles: [], inquiries: [] }; }
}

const inputCls = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 outline-none transition-all placeholder:text-zinc-300";
const btnCls = "px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all";

export default async function AdminExtrasPage() {
  const { partners, puzzles, inquiries } = await getData();

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Partners &amp; Extras</h1>
        <p className="text-zinc-400 mt-1 text-sm">Partners, daily puzzles and sponsor inquiries.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Partners", value: partners.length },
          { label: "Puzzles", value: puzzles.length },
          { label: "Inquiries", value: inquiries.length },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-zinc-200/80 p-4">
            <p className="text-2xl font-black text-zinc-900">{s.value}</p>
            <p className="text-xs text-zinc-400 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <AdminTabs
        accentColor="#06b6d4"
        tabs={[
          { id: "partners", label: "Partners", icon: "🤝", count: partners.length },
          { id: "puzzles", label: "Puzzles", icon: "🧩", count: puzzles.length },
          { id: "inquiries", label: "Inquiries", icon: "📨", count: inquiries.length },
        ]}
      >
        {/* ═══ TAB: Partners ═══════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Add Partner */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 p-6">
            <h2 className="text-base font-bold text-zinc-800 mb-4">Add Partner / Sponsor</h2>
            <form action={createPartner} className="grid sm:grid-cols-2 gap-4">
              <input name="name" required placeholder="Partner name *" className={inputCls} />
              <input name="website" placeholder="Website URL" className={inputCls} />
              <input name="logo" placeholder="Logo URL" className={inputCls} />
              <input name="order" type="number" defaultValue={0} placeholder="Display order" className={inputCls} />
              <div className="col-span-full">
                <button type="submit" className={btnCls}>Add Partner</button>
              </div>
            </form>
          </div>

          {/* Partners List */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-zinc-800 text-sm">All Partners</h3>
              <span className="text-xs text-zinc-400">{partners.length} partners</span>
            </div>
            {partners.length === 0 ? (
              <p className="text-zinc-300 text-sm text-center py-12">No partners yet. Add one above.</p>
            ) : (
              <div className="divide-y divide-zinc-50">
                {partners.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-zinc-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 text-sm font-bold shrink-0">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-800 text-sm">{p.name}</p>
                        <p className="text-zinc-400 text-[11px]">{p.website || "No website"} · Order: {p.order}</p>
                      </div>
                    </div>
                    <form action={deletePartner}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="text-[11px] bg-red-50 text-red-500 px-2 py-1 rounded-lg hover:bg-red-100 font-semibold">Delete</button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ═══ TAB: Puzzles ════════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Add Puzzle */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 p-6">
            <h2 className="text-base font-bold text-zinc-800 mb-4">Add Daily Puzzle</h2>
            <form action={createPuzzle} className="grid sm:grid-cols-2 gap-4">
              <input name="title" placeholder="Puzzle title (e.g. Mate in 2)" className={`col-span-full ${inputCls}`} />
              <input name="fen" required placeholder="FEN string *" className={`col-span-full ${inputCls} font-mono`} />
              <input name="solution" required placeholder="Solution (e.g. Qh7+ Kf8 Qf7#) *" className={`col-span-full ${inputCls}`} />
              <textarea name="description" rows={2} placeholder="Hint or description" className={`col-span-full ${inputCls} resize-none`} />
              <select name="difficulty" defaultValue="MEDIUM" className={inputCls}>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                <input type="checkbox" name="published" value="true" className="rounded border-zinc-300" /> Publish
              </label>
              <div className="col-span-full">
                <button type="submit" className={btnCls}>Add Puzzle</button>
              </div>
            </form>
          </div>

          {/* Puzzles Table */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-zinc-800 text-sm">Daily Puzzles</h3>
              <span className="text-xs text-zinc-400">{puzzles.length} puzzles</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/80 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Title</th>
                    <th className="text-left px-5 py-3">Difficulty</th>
                    <th className="text-left px-5 py-3">Solution</th>
                    <th className="text-left px-5 py-3">Published</th>
                    <th className="text-left px-5 py-3">Date</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {puzzles.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-zinc-300 py-16 text-sm">No puzzles yet. Add one above!</td></tr>
                  ) : puzzles.map((p: any) => (
                    <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-zinc-800">{p.title || "Untitled"}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          p.difficulty === "EASY" ? "bg-green-50 text-green-600" :
                          p.difficulty === "HARD" ? "bg-red-50 text-red-500" :
                          "bg-yellow-50 text-yellow-600"
                        }`}>{p.difficulty}</span>
                      </td>
                      <td className="px-5 py-3 text-zinc-400 text-[11px] font-mono max-w-[200px] truncate">{p.solution}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${p.published ? "bg-green-50 text-green-600" : "bg-zinc-100 text-zinc-400"}`}>
                          {p.published ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-400 text-[11px]">{new Date(p.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</td>
                      <td className="px-5 py-3">
                        <form action={deletePuzzle}>
                          <input type="hidden" name="id" value={p.id} />
                          <button type="submit" className="text-[11px] bg-red-50 text-red-500 px-2 py-1 rounded-lg hover:bg-red-100 font-semibold">Delete</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ═══ TAB: Inquiries ══════════════════════════════════════════ */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-zinc-800 text-sm">Sponsor Inquiries</h3>
              <span className="text-xs text-zinc-400">{inquiries.length} inquiries</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/80 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Company</th>
                    <th className="text-left px-5 py-3">Contact</th>
                    <th className="text-left px-5 py-3">Email</th>
                    <th className="text-left px-5 py-3">Budget</th>
                    <th className="text-left px-5 py-3">Message</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {inquiries.length === 0 ? (
                    <tr><td colSpan={7} className="text-center text-zinc-300 py-16 text-sm">No inquiries yet.</td></tr>
                  ) : inquiries.map((i: any) => (
                    <tr key={i.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-zinc-800">{i.companyName}</td>
                      <td className="px-5 py-3 text-zinc-500 text-xs">{i.contactName}</td>
                      <td className="px-5 py-3 text-zinc-500 text-xs">{i.email}</td>
                      <td className="px-5 py-3 text-zinc-500 text-xs">{i.budget || "—"}</td>
                      <td className="px-5 py-3 text-zinc-400 text-xs max-w-[200px] truncate">{i.message || "—"}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${i.status === "NEW" ? "bg-blue-50 text-blue-600" : "bg-zinc-100 text-zinc-400"}`}>
                          {i.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-400 text-[11px]">{new Date(i.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminTabs>
    </div>
  );
}
