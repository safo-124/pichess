/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { updateLeadStatus, deleteLead, createTeamMember, deleteTeamMember, createTestimonial, deleteTestimonial, createTournament, updateTournament, deleteTournament } from "@/lib/actions/admin";

export const metadata = { title: "Academy | Admin" };

async function getData() {
  try {
    const [leads, team, testimonials, tournaments] = await Promise.all([
      (prisma as any).academy_Lead.findMany({ orderBy: { createdAt: "desc" } }),
      (prisma as any).academy_Team.findMany({ orderBy: { order: "asc" } }),
      (prisma as any).academy_Testimonial.findMany({ orderBy: { createdAt: "desc" } }),
      (prisma as any).tournament.findMany({ orderBy: { date: "desc" }, include: { sponsors: true, photos: { take: 1 } } }),
    ]);
    return { leads, team, testimonials, tournaments };
  } catch { return { leads: [], team: [], testimonials: [], tournaments: [] }; }
}

const statusColors: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-600",
  CONTACTED: "bg-yellow-50 text-yellow-600",
  ENROLLED: "bg-green-50 text-green-600",
  CLOSED: "bg-zinc-100 text-zinc-500",
};

const tournamentStatusStyle: Record<string, string> = {
  UPCOMING: "bg-blue-50 text-blue-600",
  ONGOING: "bg-green-50 text-green-600",
  COMPLETED: "bg-zinc-100 text-zinc-500",
};

export default async function AdminAcademyPage() {
  const { leads, team, testimonials, tournaments } = await getData();
  const counts = { NEW: 0, CONTACTED: 0, ENROLLED: 0, CLOSED: 0 } as Record<string, number>;
  leads.forEach((l: any) => { if (counts[l.status] !== undefined) counts[l.status]++; });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-zinc-900">Academy Management</h1>
        <p className="text-zinc-400 mt-1">Tournaments, leads, team members and testimonials.</p>
      </div>

      {/* ── Tournaments Section ─────────────────────────────────────── */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-zinc-900">🏆 Tournaments</h2>

        {/* Tournament Summary */}
        <div className="grid grid-cols-3 gap-4">
          {["UPCOMING", "ONGOING", "COMPLETED"].map((s) => (
            <div key={s} className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="text-2xl font-black text-zinc-900">{tournaments.filter((t: any) => t.status === s).length}</p>
              <p className={`text-xs font-semibold mt-1 inline-block px-2 py-0.5 rounded-full ${tournamentStatusStyle[s]}`}>{s}</p>
            </div>
          ))}
        </div>

        {/* Create Tournament */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h3 className="text-lg font-bold text-zinc-900 mb-4">➕ Add New Tournament</h3>
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
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#c9a84c] text-white text-sm font-semibold hover:bg-[#b89843] transition-colors">
                Create Tournament
              </button>
            </div>
          </form>
        </div>

        {/* Tournaments Table */}
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
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${tournamentStatusStyle[t.status] ?? "bg-zinc-100 text-zinc-500"}`}>{t.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs ${t.featured ? "text-[#c9a84c] font-bold" : "text-zinc-300"}`}>
                        {t.featured ? "★ Featured" : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2 items-center flex-wrap">
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

      <hr className="border-zinc-200" />

      {/* ── Academy Leads Section ───────────────────────────────────── */}

      {/* Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-2xl font-black text-zinc-900">{count}</p>
            <p className={`text-xs font-semibold mt-1 inline-block px-2 py-0.5 rounded-full ${statusColors[status]}`}>{status}</p>
          </div>
        ))}
      </div>

      {/* ── Leads Table ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xl font-black text-zinc-900 mb-3">Leads ({leads.length})</h2>
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
                  <th className="text-left px-5 py-3">Actions</th>
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
                      <div className="flex gap-2 items-center flex-wrap">
                        <form action={updateLeadStatus} className="flex gap-1.5 items-center">
                          <input type="hidden" name="id" value={lead.id} />
                          <select name="status" defaultValue={lead.status} className="text-xs border border-zinc-200 rounded-lg px-2 py-1 bg-white text-zinc-700">
                            {["NEW", "CONTACTED", "ENROLLED", "CLOSED"].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button type="submit" className="text-xs bg-zinc-900 text-white px-2.5 py-1 rounded-lg hover:bg-zinc-700">Save</button>
                        </form>
                        <form action={deleteLead}>
                          <input type="hidden" name="id" value={lead.id} />
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

      {/* Messages */}
      {leads.filter((l: any) => l.message).length > 0 && (
        <section>
          <h2 className="font-bold text-zinc-900 mb-3">Lead Messages</h2>
          <div className="space-y-3">
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
        </section>
      )}

      {/* ── Add Team Member ─────────────────────────────────────────── */}
      <section>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-bold text-zinc-900 mb-4">👤 Add Team Member</h2>
          <form action={createTeamMember} className="grid sm:grid-cols-2 gap-4">
            <input name="name" required placeholder="Full name *" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
            <input name="role" required placeholder="Role (e.g. Head Coach) *" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
            <textarea name="bio" rows={2} placeholder="Short bio" className="col-span-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none resize-none" />
            <input name="image" placeholder="Photo URL" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
            <input name="order" type="number" defaultValue={0} placeholder="Display order" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
            <div className="col-span-full">
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#c9a84c] text-white text-sm font-semibold hover:bg-[#b89843] transition-colors">
                Add Team Member
              </button>
            </div>
          </form>
        </div>

        {/* Team List */}
        {team.length > 0 && (
          <div className="mt-4 rounded-xl border border-zinc-200 bg-white overflow-hidden">
            <div className="p-5 border-b border-zinc-100">
              <h3 className="font-bold text-zinc-900">Team Members ({team.length})</h3>
            </div>
            <div className="divide-y divide-zinc-50">
              {team.map((m: any) => (
                <div key={m.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="font-medium text-zinc-900 text-sm">{m.name}</p>
                    <p className="text-zinc-500 text-xs">{m.role} · Order: {m.order}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${m.published ? "bg-green-50 text-green-600" : "bg-zinc-100 text-zinc-400"}`}>
                      {m.published ? "Published" : "Hidden"}
                    </span>
                    <form action={deleteTeamMember}>
                      <input type="hidden" name="id" value={m.id} />
                      <button type="submit" className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-100 font-semibold">Delete</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Add Testimonial ─────────────────────────────────────────── */}
      <section>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-bold text-zinc-900 mb-4">⭐ Add Testimonial</h2>
          <form action={createTestimonial} className="grid sm:grid-cols-2 gap-4">
            <input name="name" required placeholder="Student / parent name *" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
            <input name="program" placeholder="Program (e.g. Junior, Elite)" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
            <textarea name="content" rows={3} required placeholder="Testimonial text *" className="col-span-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none resize-none" />
            <input name="image" placeholder="Photo URL" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
            <div className="flex items-center gap-6">
              <select name="rating" defaultValue="5" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm">
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{"★".repeat(r)} ({r})</option>)}
              </select>
              <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
                <input type="checkbox" name="published" value="true" className="rounded" /> Publish
              </label>
            </div>
            <div className="col-span-full">
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#c9a84c] text-white text-sm font-semibold hover:bg-[#b89843] transition-colors">
                Add Testimonial
              </button>
            </div>
          </form>
        </div>

        {/* Testimonials List */}
        {testimonials.length > 0 && (
          <div className="mt-4 rounded-xl border border-zinc-200 bg-white overflow-hidden">
            <div className="p-5 border-b border-zinc-100">
              <h3 className="font-bold text-zinc-900">Testimonials ({testimonials.length})</h3>
            </div>
            <div className="divide-y divide-zinc-50">
              {testimonials.map((t: any) => (
                <div key={t.id} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="font-medium text-zinc-900 text-sm">{t.name}</span>
                      <span className="text-zinc-400 text-xs ml-2">{t.program || ""} · {"★".repeat(t.rating)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${t.published ? "bg-green-50 text-green-600" : "bg-zinc-100 text-zinc-400"}`}>
                        {t.published ? "Published" : "Hidden"}
                      </span>
                      <form action={deleteTestimonial}>
                        <input type="hidden" name="id" value={t.id} />
                        <button type="submit" className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-100 font-semibold">Delete</button>
                      </form>
                    </div>
                  </div>
                  <p className="text-zinc-600 text-sm line-clamp-2">{t.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
