/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import {
  updateApplicationStatus, deleteApplication,
  updateVolunteerStatus, deleteVolunteer,
  deleteDonation, createNGOStory, deleteNGOStory,
} from "@/lib/actions/admin";

export const metadata = { title: "NGO Management | Admin" };

async function getData() {
  try {
    const [applications, volunteers, donations, stories] = await Promise.all([
      (prisma as any).nGO_Application.findMany({ orderBy: { createdAt: "desc" } }),
      (prisma as any).nGO_Volunteer.findMany({ orderBy: { createdAt: "desc" } }),
      (prisma as any).nGO_Donation.findMany({ orderBy: { createdAt: "desc" } }),
      (prisma as any).nGO_Story.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    return { applications, volunteers, donations, stories };
  } catch { return { applications: [], volunteers: [], donations: [], stories: [] }; }
}

const statusStyle: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-600",
  APPROVED: "bg-green-50 text-green-600",
  REJECTED: "bg-red-50 text-red-500",
};

export default async function AdminNGOPage() {
  const { applications, volunteers, donations, stories } = await getData();
  const totalDonations = donations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-zinc-900">NGO Management</h1>
        <p className="text-zinc-400 mt-1">Applications, volunteers, donations and impact stories.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Applications", value: applications.length },
          { label: "Volunteers", value: volunteers.length },
          { label: "Donations", value: donations.length },
          { label: "Total Raised", value: `GH₵ ${totalDonations.toLocaleString()}` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-2xl font-black text-zinc-900">{s.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Applications ────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xl font-black text-zinc-900 mb-3">Applications ({applications.length})</h2>
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3">Email</th>
                  <th className="text-left px-5 py-3">Age</th>
                  <th className="text-left px-5 py-3">Region</th>
                  <th className="text-left px-5 py-3">Level</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {applications.length === 0 ? (
                  <tr><td colSpan={8} className="text-center text-zinc-400 py-8">No applications yet</td></tr>
                ) : applications.map((a: any) => (
                  <tr key={a.id} className="hover:bg-zinc-50/50">
                    <td className="px-5 py-3 font-medium text-zinc-900">{a.name}</td>
                    <td className="px-5 py-3 text-zinc-500">{a.email}</td>
                    <td className="px-5 py-3 text-zinc-500">{a.age || "—"}</td>
                    <td className="px-5 py-3 text-zinc-500">{a.region || "—"}</td>
                    <td className="px-5 py-3 text-zinc-500">{a.chess_level || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusStyle[a.status] ?? "bg-zinc-100 text-zinc-500"}`}>{a.status}</span>
                    </td>
                    <td className="px-5 py-3 text-zinc-400 text-xs">{new Date(a.createdAt).toLocaleDateString("en-GB")}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2 items-center flex-wrap">
                        <form action={updateApplicationStatus} className="flex gap-1.5 items-center">
                          <input type="hidden" name="id" value={a.id} />
                          <select name="status" defaultValue={a.status} className="text-xs border border-zinc-200 rounded-lg px-2 py-1 bg-white">
                            {["PENDING", "APPROVED", "REJECTED"].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button type="submit" className="text-xs bg-zinc-900 text-white px-2.5 py-1 rounded-lg hover:bg-zinc-700">Save</button>
                        </form>
                        <form action={deleteApplication}>
                          <input type="hidden" name="id" value={a.id} />
                          <button type="submit" className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-100 font-semibold">Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Volunteers ──────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xl font-black text-zinc-900 mb-3">Volunteers ({volunteers.length})</h2>
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3">Email</th>
                  <th className="text-left px-5 py-3">Occupation</th>
                  <th className="text-left px-5 py-3">Skills</th>
                  <th className="text-left px-5 py-3">Availability</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {volunteers.length === 0 ? (
                  <tr><td colSpan={8} className="text-center text-zinc-400 py-8">No volunteers yet</td></tr>
                ) : volunteers.map((v: any) => (
                  <tr key={v.id} className="hover:bg-zinc-50/50">
                    <td className="px-5 py-3 font-medium text-zinc-900">{v.name}</td>
                    <td className="px-5 py-3 text-zinc-500">{v.email}</td>
                    <td className="px-5 py-3 text-zinc-500">{v.occupation || "—"}</td>
                    <td className="px-5 py-3 text-zinc-500 max-w-[150px] truncate">{v.skills || "—"}</td>
                    <td className="px-5 py-3 text-zinc-500">{v.availability || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusStyle[v.status] ?? "bg-zinc-100 text-zinc-500"}`}>{v.status}</span>
                    </td>
                    <td className="px-5 py-3 text-zinc-400 text-xs">{new Date(v.createdAt).toLocaleDateString("en-GB")}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2 items-center flex-wrap">
                        <form action={updateVolunteerStatus} className="flex gap-1.5 items-center">
                          <input type="hidden" name="id" value={v.id} />
                          <select name="status" defaultValue={v.status} className="text-xs border border-zinc-200 rounded-lg px-2 py-1 bg-white">
                            {["PENDING", "APPROVED", "REJECTED"].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button type="submit" className="text-xs bg-zinc-900 text-white px-2.5 py-1 rounded-lg hover:bg-zinc-700">Save</button>
                        </form>
                        <form action={deleteVolunteer}>
                          <input type="hidden" name="id" value={v.id} />
                          <button type="submit" className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-100 font-semibold">Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Donations ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xl font-black text-zinc-900 mb-3">Donations ({donations.length})</h2>
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Donor</th>
                  <th className="text-left px-5 py-3">Amount</th>
                  <th className="text-left px-5 py-3">Method</th>
                  <th className="text-left px-5 py-3">Message</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {donations.length === 0 ? (
                  <tr><td colSpan={7} className="text-center text-zinc-400 py-8">No donations yet</td></tr>
                ) : donations.map((d: any) => (
                  <tr key={d.id} className="hover:bg-zinc-50/50">
                    <td className="px-5 py-3 font-medium text-zinc-900">{d.anonymous ? "Anonymous" : (d.donor_name || "—")}</td>
                    <td className="px-5 py-3 font-bold text-[#2e7d5b]">GH₵ {d.amount}</td>
                    <td className="px-5 py-3 text-zinc-500">{d.method || "—"}</td>
                    <td className="px-5 py-3 text-zinc-500 max-w-[150px] truncate">{d.message || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusStyle[d.status] ?? "bg-zinc-100 text-zinc-500"}`}>{d.status}</span>
                    </td>
                    <td className="px-5 py-3 text-zinc-400 text-xs">{new Date(d.createdAt).toLocaleDateString("en-GB")}</td>
                    <td className="px-5 py-3">
                      <form action={deleteDonation}>
                        <input type="hidden" name="id" value={d.id} />
                        <button type="submit" className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-100 font-semibold">Delete</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Impact Stories ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-bold text-zinc-900 mb-4">📖 Add Impact Story</h2>
          <form action={createNGOStory} className="grid sm:grid-cols-2 gap-4">
            <input name="title" required placeholder="Story title *" className="col-span-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
            <textarea name="content" rows={4} required placeholder="Story content *" className="col-span-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none resize-none" />
            <input name="image" placeholder="Image URL" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
                <input type="checkbox" name="published" value="true" className="rounded" /> Publish
              </label>
            </div>
            <div className="col-span-full">
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#2e7d5b] text-white text-sm font-semibold hover:bg-[#256b4d] transition-colors">
                Add Story
              </button>
            </div>
          </form>
        </div>

        {stories.length > 0 && (
          <div className="mt-4 rounded-xl border border-zinc-200 bg-white overflow-hidden">
            <div className="p-5 border-b border-zinc-100">
              <h3 className="font-bold text-zinc-900">Impact Stories ({stories.length})</h3>
            </div>
            <div className="divide-y divide-zinc-50">
              {stories.map((s: any) => (
                <div key={s.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-zinc-900 text-sm">{s.title}</p>
                    <p className="text-zinc-500 text-xs line-clamp-1">{s.content.slice(0, 100)}...</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.published ? "bg-green-50 text-green-600" : "bg-zinc-100 text-zinc-400"}`}>
                      {s.published ? "Published" : "Draft"}
                    </span>
                    <form action={deleteNGOStory}>
                      <input type="hidden" name="id" value={s.id} />
                      <button type="submit" className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-100 font-semibold">Delete</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
