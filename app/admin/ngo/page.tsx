/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";

export const metadata = { title: "NGO Management | Admin" };

async function getData() {
  try {
    const [applications, volunteers, donations] = await Promise.all([
      (prisma as any).nGO_Application.findMany({ orderBy: { createdAt: "desc" } }),
      (prisma as any).nGO_Volunteer.findMany({ orderBy: { createdAt: "desc" } }),
      (prisma as any).nGO_Donation.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    return { applications, volunteers, donations };
  } catch { return { applications: [], volunteers: [], donations: [] }; }
}

const statusStyle: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-600",
  APPROVED: "bg-green-50 text-green-600",
  REJECTED: "bg-red-50 text-red-500",
};

export default async function AdminNGOPage() {
  const { applications, volunteers, donations } = await getData();
  const totalDonations = donations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-zinc-900">NGO Management</h1>
        <p className="text-zinc-400 mt-1">Applications, volunteers and donations.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Applications", value: applications.length, color: "#2e7d5b" },
          { label: "Volunteers", value: volunteers.length, color: "#6366f1" },
          { label: "Donations", value: donations.length, color: "#f59e0b" },
          { label: "Total Raised", value: `GH₵ ${totalDonations.toLocaleString()}`, color: "#ec4899" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-2xl font-black text-zinc-900">{s.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Applications */}
      <section>
        <h2 className="text-xl font-black text-zinc-900 mb-3">Applications</h2>
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
                  <th className="text-left px-5 py-3">Update</th>
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
                      <form action={async (fd) => {
                        "use server";
                        await (prisma as any).nGO_Application.update({ where: { id: a.id }, data: { status: fd.get("status") } });
                      }}>
                        <select name="status" defaultValue={a.status} className="text-xs border border-zinc-200 rounded-lg px-2 py-1 bg-white mr-2">
                          {["PENDING","APPROVED","REJECTED"].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button type="submit" className="text-xs bg-zinc-900 text-white px-3 py-1 rounded-lg">Save</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Volunteers */}
      <section>
        <h2 className="text-xl font-black text-zinc-900 mb-3">Volunteers</h2>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {volunteers.length === 0 ? (
                  <tr><td colSpan={7} className="text-center text-zinc-400 py-8">No volunteers yet</td></tr>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Donations */}
      <section>
        <h2 className="text-xl font-black text-zinc-900 mb-3">Donations</h2>
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Donor</th>
                  <th className="text-left px-5 py-3">Amount</th>
                  <th className="text-left px-5 py-3">Method</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {donations.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-zinc-400 py-8">No donations yet</td></tr>
                ) : donations.map((d: any) => (
                  <tr key={d.id} className="hover:bg-zinc-50/50">
                    <td className="px-5 py-3 font-medium text-zinc-900">{d.anonymous ? "Anonymous" : (d.donor_name || "—")}</td>
                    <td className="px-5 py-3 font-bold text-[#2e7d5b]">GH₵ {d.amount}</td>
                    <td className="px-5 py-3 text-zinc-500">{d.method || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusStyle[d.status] ?? "bg-zinc-100 text-zinc-500"}`}>{d.status}</span>
                    </td>
                    <td className="px-5 py-3 text-zinc-400 text-xs">{new Date(d.createdAt).toLocaleDateString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
