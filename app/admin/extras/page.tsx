/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { createPartner, deletePartner, createPuzzle, deletePuzzle } from "@/lib/actions/admin";

export const metadata = { title: "Settings & Extras | Admin" };

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

export default async function AdminExtrasPage() {
  const { partners, puzzles, inquiries } = await getData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-zinc-900">Settings &amp; Extras</h1>
        <p className="text-zinc-400 mt-1">Partners, daily puzzles and sponsor inquiries.</p>
      </div>

      {/* ── Partners ────────────────────────────────────────────────── */}
      <section>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-bold text-zinc-900 mb-4">🤝 Add Partner / Sponsor</h2>
          <form action={createPartner} className="grid sm:grid-cols-2 gap-4">
            <input name="name" required placeholder="Partner name *" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
            <input name="website" placeholder="Website URL" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
            <input name="logo" placeholder="Logo URL" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
            <input name="order" type="number" defaultValue={0} placeholder="Display order" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
            <div className="col-span-full">
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors">
                Add Partner
              </button>
            </div>
          </form>
        </div>

        {partners.length > 0 && (
          <div className="mt-4 rounded-xl border border-zinc-200 bg-white overflow-hidden">
            <div className="p-5 border-b border-zinc-100">
              <h3 className="font-bold text-zinc-900">Partners ({partners.length})</h3>
            </div>
            <div className="divide-y divide-zinc-50">
              {partners.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="font-medium text-zinc-900 text-sm">{p.name}</p>
                    <p className="text-zinc-400 text-xs">{p.website || "No website"} · Order: {p.order}</p>
                  </div>
                  <form action={deletePartner}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-100 font-semibold">Delete</button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Daily Puzzles ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-bold text-zinc-900 mb-4">🧩 Add Daily Puzzle</h2>
          <form action={createPuzzle} className="grid sm:grid-cols-2 gap-4">
            <input name="title" placeholder="Puzzle title (e.g. Mate in 2)" className="col-span-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
            <input name="fen" required placeholder="FEN string *" className="col-span-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-zinc-900 outline-none" />
            <input name="solution" required placeholder="Solution (e.g. Qh7+ Kf8 Qf7#) *" className="col-span-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
            <textarea name="description" rows={2} placeholder="Hint or description" className="col-span-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none resize-none" />
            <select name="difficulty" defaultValue="MEDIUM" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm">
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
              <input type="checkbox" name="published" value="true" className="rounded" /> Publish
            </label>
            <div className="col-span-full">
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors">
                Add Puzzle
              </button>
            </div>
          </form>
        </div>

        {puzzles.length > 0 && (
          <div className="mt-4 rounded-xl border border-zinc-200 bg-white overflow-hidden">
            <div className="p-5 border-b border-zinc-100">
              <h3 className="font-bold text-zinc-900">Daily Puzzles ({puzzles.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Title</th>
                    <th className="text-left px-5 py-3">Difficulty</th>
                    <th className="text-left px-5 py-3">Solution</th>
                    <th className="text-left px-5 py-3">Published</th>
                    <th className="text-left px-5 py-3">Date</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {puzzles.map((p: any) => (
                    <tr key={p.id} className="hover:bg-zinc-50/50">
                      <td className="px-5 py-3 font-medium text-zinc-900">{p.title || "Untitled"}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          p.difficulty === "EASY" ? "bg-green-50 text-green-600" :
                          p.difficulty === "HARD" ? "bg-red-50 text-red-500" :
                          "bg-yellow-50 text-yellow-600"
                        }`}>{p.difficulty}</span>
                      </td>
                      <td className="px-5 py-3 text-zinc-500 text-xs font-mono max-w-[200px] truncate">{p.solution}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${p.published ? "bg-green-50 text-green-600" : "bg-zinc-100 text-zinc-400"}`}>
                          {p.published ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-400 text-xs">{new Date(p.date).toLocaleDateString("en-GB")}</td>
                      <td className="px-5 py-3">
                        <form action={deletePuzzle}>
                          <input type="hidden" name="id" value={p.id} />
                          <button type="submit" className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-100 font-semibold">Delete</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ── Sponsor Inquiries ───────────────────────────────────────── */}
      {inquiries.length > 0 && (
        <section>
          <h2 className="text-xl font-black text-zinc-900 mb-3">Sponsor Inquiries ({inquiries.length})</h2>
          <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
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
                  {inquiries.map((i: any) => (
                    <tr key={i.id} className="hover:bg-zinc-50/50">
                      <td className="px-5 py-3 font-medium text-zinc-900">{i.companyName}</td>
                      <td className="px-5 py-3 text-zinc-500">{i.contactName}</td>
                      <td className="px-5 py-3 text-zinc-500">{i.email}</td>
                      <td className="px-5 py-3 text-zinc-500">{i.budget || "—"}</td>
                      <td className="px-5 py-3 text-zinc-500 max-w-[200px] truncate">{i.message || "—"}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${i.status === "NEW" ? "bg-blue-50 text-blue-600" : "bg-zinc-100 text-zinc-400"}`}>{i.status}</span>
                      </td>
                      <td className="px-5 py-3 text-zinc-400 text-xs">{new Date(i.createdAt).toLocaleDateString("en-GB")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
