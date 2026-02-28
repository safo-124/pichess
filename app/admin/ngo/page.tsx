/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import {
  updateApplicationStatus, deleteApplication,
  updateVolunteerStatus, deleteVolunteer,
  deleteDonation, createNGOStory, deleteNGOStory,
} from "@/lib/actions/admin";
import AdminTabs from "@/components/admin/AdminTabs";

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

const inputCls = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2e7d5b]/40 focus:border-[#2e7d5b]/40 outline-none transition-all placeholder:text-zinc-300";
const btnCls = "px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2e7d5b] to-[#256b4d] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#2e7d5b]/20 transition-all";

export default async function AdminNGOPage() {
  const { applications, volunteers, donations, stories } = await getData();
  const totalDonations = donations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">NGO / Foundation</h1>
        <p className="text-zinc-400 mt-1 text-sm">Applications, volunteers, donations and impact stories.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Applications", value: applications.length, color: "#2e7d5b" },
          { label: "Volunteers", value: volunteers.length, color: "#2e7d5b" },
          { label: "Donations", value: donations.length, color: "#16a34a" },
          { label: "Total Raised", value: `GH₵ ${totalDonations.toLocaleString()}`, color: "#16a34a" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-zinc-200/80 p-4">
            <p className="text-2xl font-black text-zinc-900">{s.value}</p>
            <p className="text-xs text-zinc-400 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <AdminTabs
        accentColor="#2e7d5b"
        tabs={[
          { id: "applications", label: "Applications", icon: "📋", count: applications.length },
          { id: "volunteers", label: "Volunteers", icon: "🤝", count: volunteers.length },
          { id: "donations", label: "Donations", icon: "💰", count: donations.length },
          { id: "stories", label: "Impact Stories", icon: "📖", count: stories.length },
        ]}
      >
        {/* ═══ TAB: Applications ═══════════════════════════════════════ */}
        <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-bold text-zinc-800 text-sm">All Applications</h2>
            <span className="text-xs text-zinc-400">{applications.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/80 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
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
                  <tr><td colSpan={8} className="text-center text-zinc-300 py-16 text-sm">No applications yet</td></tr>
                ) : applications.map((a: any) => (
                  <tr key={a.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-zinc-800">{a.name}</td>
                    <td className="px-5 py-3 text-zinc-500 text-xs">{a.email}</td>
                    <td className="px-5 py-3 text-zinc-500 text-xs">{a.age || "—"}</td>
                    <td className="px-5 py-3 text-zinc-500 text-xs">{a.region || "—"}</td>
                    <td className="px-5 py-3 text-zinc-500 text-xs">{a.chess_level || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusStyle[a.status] ?? "bg-zinc-100 text-zinc-500"}`}>{a.status}</span>
                    </td>
                    <td className="px-5 py-3 text-zinc-400 text-[11px]">{new Date(a.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5 items-center">
                        <form action={updateApplicationStatus} className="flex gap-1 items-center">
                          <input type="hidden" name="id" value={a.id} />
                          <select name="status" defaultValue={a.status} className="text-[11px] border border-zinc-200 rounded-lg px-2 py-1 bg-white text-zinc-600">
                            {["PENDING", "APPROVED", "REJECTED"].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button type="submit" className="text-[11px] bg-zinc-800 text-white px-2 py-1 rounded-lg hover:bg-zinc-700 font-medium">Save</button>
                        </form>
                        <form action={deleteApplication}>
                          <input type="hidden" name="id" value={a.id} />
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

        {/* ═══ TAB: Volunteers ═════════════════════════════════════════ */}
        <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-bold text-zinc-800 text-sm">All Volunteers</h2>
            <span className="text-xs text-zinc-400">{volunteers.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/80 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
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
                  <tr><td colSpan={8} className="text-center text-zinc-300 py-16 text-sm">No volunteers yet</td></tr>
                ) : volunteers.map((v: any) => (
                  <tr key={v.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-zinc-800">{v.name}</td>
                    <td className="px-5 py-3 text-zinc-500 text-xs">{v.email}</td>
                    <td className="px-5 py-3 text-zinc-500 text-xs">{v.occupation || "—"}</td>
                    <td className="px-5 py-3 text-zinc-500 text-xs max-w-[140px] truncate">{v.skills || "—"}</td>
                    <td className="px-5 py-3 text-zinc-500 text-xs">{v.availability || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusStyle[v.status] ?? "bg-zinc-100 text-zinc-500"}`}>{v.status}</span>
                    </td>
                    <td className="px-5 py-3 text-zinc-400 text-[11px]">{new Date(v.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5 items-center">
                        <form action={updateVolunteerStatus} className="flex gap-1 items-center">
                          <input type="hidden" name="id" value={v.id} />
                          <select name="status" defaultValue={v.status} className="text-[11px] border border-zinc-200 rounded-lg px-2 py-1 bg-white text-zinc-600">
                            {["PENDING", "APPROVED", "REJECTED"].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button type="submit" className="text-[11px] bg-zinc-800 text-white px-2 py-1 rounded-lg hover:bg-zinc-700 font-medium">Save</button>
                        </form>
                        <form action={deleteVolunteer}>
                          <input type="hidden" name="id" value={v.id} />
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

        {/* ═══ TAB: Donations ══════════════════════════════════════════ */}
        <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-bold text-zinc-800 text-sm">All Donations</h2>
            <span className="text-xs font-bold text-[#16a34a]">GH₵ {totalDonations.toLocaleString()} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/80 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
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
                  <tr><td colSpan={7} className="text-center text-zinc-300 py-16 text-sm">No donations yet</td></tr>
                ) : donations.map((d: any) => (
                  <tr key={d.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-zinc-800">{d.anonymous ? "Anonymous" : (d.donor_name || "—")}</td>
                    <td className="px-5 py-3 font-bold text-[#16a34a]">GH₵ {d.amount}</td>
                    <td className="px-5 py-3 text-zinc-500 text-xs">{d.method || "—"}</td>
                    <td className="px-5 py-3 text-zinc-500 text-xs max-w-[140px] truncate">{d.message || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusStyle[d.status] ?? "bg-zinc-100 text-zinc-500"}`}>{d.status}</span>
                    </td>
                    <td className="px-5 py-3 text-zinc-400 text-[11px]">{new Date(d.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</td>
                    <td className="px-5 py-3">
                      <form action={deleteDonation}>
                        <input type="hidden" name="id" value={d.id} />
                        <button type="submit" className="text-[11px] bg-red-50 text-red-500 px-2 py-1 rounded-lg hover:bg-red-100 font-semibold">Delete</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ TAB: Impact Stories ═════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Create Story Form */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 p-6">
            <h2 className="text-base font-bold text-zinc-800 mb-4">Add Impact Story</h2>
            <form action={createNGOStory} className="grid sm:grid-cols-2 gap-4">
              <input name="title" required placeholder="Story title *" className={`col-span-full ${inputCls}`} />
              <textarea name="content" rows={4} required placeholder="Story content *" className={`col-span-full ${inputCls} resize-none`} />
              <input name="image" placeholder="Image URL" className={inputCls} />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                  <input type="checkbox" name="published" value="true" className="rounded border-zinc-300" /> Publish
                </label>
              </div>
              <div className="col-span-full">
                <button type="submit" className={btnCls}>Add Story</button>
              </div>
            </form>
          </div>

          {/* Stories List */}
          {stories.length > 0 && (
            <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
                <h3 className="font-bold text-zinc-800 text-sm">Impact Stories</h3>
                <span className="text-xs text-zinc-400">{stories.length} stories</span>
              </div>
              <div className="divide-y divide-zinc-50">
                {stories.map((s: any) => (
                  <div key={s.id} className="px-5 py-3 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                    <div className="min-w-0 mr-4">
                      <p className="font-semibold text-zinc-800 text-sm">{s.title}</p>
                      <p className="text-zinc-400 text-xs line-clamp-1">{s.content.slice(0, 100)}...</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${s.published ? "bg-green-50 text-green-600" : "bg-zinc-100 text-zinc-400"}`}>
                        {s.published ? "Published" : "Draft"}
                      </span>
                      <form action={deleteNGOStory}>
                        <input type="hidden" name="id" value={s.id} />
                        <button type="submit" className="text-[11px] bg-red-50 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-100 font-semibold">Delete</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AdminTabs>
    </div>
  );
}
