/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";

export const metadata = { title: "Academy Leads | Admin" };

async function getLeads() {
  try {
    return await (prisma as any).academy_Lead.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch { return []; }
}

const statusColors: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-600",
  CONTACTED: "bg-yellow-50 text-yellow-600",
  ENROLLED: "bg-green-50 text-green-600",
  CLOSED: "bg-zinc-100 text-zinc-500",
};

export default async function AdminAcademyPage() {
  const leads = await getLeads();
  const counts = { NEW: 0, CONTACTED: 0, ENROLLED: 0, CLOSED: 0 } as Record<string, number>;
  leads.forEach((l: any) => { if (counts[l.status] !== undefined) counts[l.status]++; });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-zinc-900">Academy Leads</h1>
        <p className="text-zinc-400 mt-1">Enquiries from the academy registration form.</p>
      </div>

      {/* Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-2xl font-black text-zinc-900">{count}</p>
            <p className={`text-xs font-semibold mt-1 inline-block px-2 py-0.5 rounded-full ${statusColors[status]}`}>{status}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Phone</th>
                <th className="text-left px-5 py-3">Program</th>
                <th className="text-left px-5 py-3">Age Group</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {leads.length === 0 ? (
                <tr><td colSpan={8} className="text-center text-zinc-400 py-12">No leads yet.</td></tr>
              ) : leads.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-zinc-900">{lead.name}</td>
                  <td className="px-5 py-3 text-zinc-500">{lead.email}</td>
                  <td className="px-5 py-3 text-zinc-500">{lead.phone || "—"}</td>
                  <td className="px-5 py-3 text-zinc-500">{lead.program || "—"}</td>
                  <td className="px-5 py-3 text-zinc-500">{lead.age_group || "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[lead.status] ?? "bg-zinc-100 text-zinc-500"}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-zinc-400 text-xs whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3">
                    <form action={async (fd) => {
                      "use server";
                      const status = fd.get("status") as string;
                      await (prisma as any).academy_Lead.update({ where: { id: lead.id }, data: { status } });
                    }}>
                      <select name="status" defaultValue={lead.status}
                        className="text-xs border border-zinc-200 rounded-lg px-2 py-1 bg-white text-zinc-700 mr-2"
                      >
                        {["NEW", "CONTACTED", "ENROLLED", "CLOSED"].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button type="submit" className="text-xs bg-zinc-900 text-white px-3 py-1 rounded-lg hover:bg-zinc-700 transition-colors">
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Messages */}
      {leads.filter((l: any) => l.message).length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-zinc-900">Messages</h2>
          {leads.filter((l: any) => l.message).map((lead: any) => (
            <div key={lead.id} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-zinc-900 text-sm">{lead.name}</span>
                <span className="text-zinc-400 text-xs">{lead.email}</span>
              </div>
              <p className="text-zinc-600 text-sm">{lead.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
