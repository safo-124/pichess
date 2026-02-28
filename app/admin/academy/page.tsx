/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { updateLeadStatus, deleteLead, createTeamMember, deleteTeamMember, createTestimonial, deleteTestimonial } from "@/lib/actions/admin";
import AdminTabs from "@/components/admin/AdminTabs";
import AcademyContentEditor from "@/components/admin/AcademyContentEditor";
import {
  defaultHero, defaultStats, defaultLessons, defaultFeatures, defaultCTA,
  type AcademyHero, type AcademyStat, type AcademyLesson, type AcademyFeature, type AcademyCTA,
} from "@/lib/academy-content";

export const metadata = { title: "Academy | Admin" };

async function getData() {
  try {
    const [leads, team, testimonials, heroRaw, statsRaw, lessonsRaw, featuresRaw, ctaRaw] = await Promise.all([
      (prisma as any).academy_Lead.findMany({ orderBy: { createdAt: "desc" } }),
      (prisma as any).academy_Team.findMany({ orderBy: { order: "asc" } }),
      (prisma as any).academy_Testimonial.findMany({ orderBy: { createdAt: "desc" } }),
      (prisma as any).siteContent.findUnique({ where: { key: "academy_hero" } }),
      (prisma as any).siteContent.findUnique({ where: { key: "academy_stats" } }),
      (prisma as any).siteContent.findUnique({ where: { key: "academy_lessons" } }),
      (prisma as any).siteContent.findUnique({ where: { key: "academy_features" } }),
      (prisma as any).siteContent.findUnique({ where: { key: "academy_cta" } }),
    ]);
    return {
      leads, team, testimonials,
      hero: heroRaw ? JSON.parse(heroRaw.value) as AcademyHero : defaultHero,
      stats: statsRaw ? JSON.parse(statsRaw.value) as AcademyStat[] : defaultStats,
      lessons: lessonsRaw ? JSON.parse(lessonsRaw.value) as AcademyLesson[] : defaultLessons,
      features: featuresRaw ? JSON.parse(featuresRaw.value) as AcademyFeature[] : defaultFeatures,
      cta: ctaRaw ? JSON.parse(ctaRaw.value) as AcademyCTA : defaultCTA,
    };
  } catch { return { leads: [], team: [], testimonials: [], hero: defaultHero, stats: defaultStats, lessons: defaultLessons, features: defaultFeatures, cta: defaultCTA }; }
}

const statusColors: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-600",
  CONTACTED: "bg-yellow-50 text-yellow-600",
  ENROLLED: "bg-green-50 text-green-600",
  CLOSED: "bg-zinc-100 text-zinc-500",
};

const inputCls = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/40 outline-none transition-all placeholder:text-zinc-300";
const btnCls = "px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#b89843] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#c9a84c]/20 transition-all";

export default async function AdminAcademyPage() {
  const { leads, team, testimonials, hero, stats, lessons, features, cta } = await getData();
  const counts = { NEW: 0, CONTACTED: 0, ENROLLED: 0, CLOSED: 0 } as Record<string, number>;
  leads.forEach((l: any) => { if (counts[l.status] !== undefined) counts[l.status]++; });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Academy</h1>
        <p className="text-zinc-400 mt-1 text-sm">Manage leads, team members and testimonials for the academy.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="rounded-2xl bg-white border border-zinc-200/80 p-4">
            <p className="text-2xl font-black text-zinc-900">{count}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${statusColors[status]}`}>{status}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <AdminTabs
        accentColor="#c9a84c"
        tabs={[
          { id: "content", label: "Page Content", icon: "🎨", count: 0 },
          { id: "leads", label: "Leads", icon: "🎓", count: leads.length },
          { id: "team", label: "Team", icon: "👤", count: team.length },
          { id: "testimonials", label: "Testimonials", icon: "⭐", count: testimonials.length },
        ]}
      >
        {/* ═══ TAB: Page Content ════════════════════════════════════════ */}
        <AcademyContentEditor
          initialHero={hero}
          initialStats={stats}
          initialLessons={lessons}
          initialFeatures={features}
          initialCTA={cta}
        />

        {/* ═══ TAB: Leads ═══════════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Leads Table */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="font-bold text-zinc-800 text-sm">All Leads</h2>
              <span className="text-xs text-zinc-400">{leads.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/80 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Name</th>
                    <th className="text-left px-5 py-3">Email</th>
                    <th className="text-left px-5 py-3">Phone</th>
                    <th className="text-left px-5 py-3">Program</th>
                    <th className="text-left px-5 py-3">Age</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Date</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {leads.length === 0 ? (
                    <tr><td colSpan={8} className="text-center text-zinc-300 py-16 text-sm">No leads yet — they&apos;ll appear when people enquire through the academy page.</td></tr>
                  ) : leads.map((lead: any) => (
                    <tr key={lead.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-zinc-800">{lead.name}</td>
                      <td className="px-5 py-3 text-zinc-500 text-xs">{lead.email}</td>
                      <td className="px-5 py-3 text-zinc-500 text-xs">{lead.phone || "—"}</td>
                      <td className="px-5 py-3 text-zinc-500 text-xs">{lead.program || "—"}</td>
                      <td className="px-5 py-3 text-zinc-500 text-xs">{lead.age_group || "—"}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusColors[lead.status] ?? "bg-zinc-100 text-zinc-500"}`}>{lead.status}</span>
                      </td>
                      <td className="px-5 py-3 text-zinc-400 text-[11px] whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1.5 items-center">
                          <form action={updateLeadStatus} className="flex gap-1 items-center">
                            <input type="hidden" name="id" value={lead.id} />
                            <select name="status" defaultValue={lead.status} className="text-[11px] border border-zinc-200 rounded-lg px-2 py-1 bg-white text-zinc-600">
                              {["NEW", "CONTACTED", "ENROLLED", "CLOSED"].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <button type="submit" className="text-[11px] bg-zinc-800 text-white px-2 py-1 rounded-lg hover:bg-zinc-700 font-medium">Save</button>
                          </form>
                          <form action={deleteLead}>
                            <input type="hidden" name="id" value={lead.id} />
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

          {/* Messages */}
          {leads.filter((l: any) => l.message).length > 0 && (
            <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100">
                <h3 className="font-bold text-zinc-800 text-sm">Lead Messages</h3>
              </div>
              <div className="divide-y divide-zinc-50">
                {leads.filter((l: any) => l.message).map((lead: any) => (
                  <div key={lead.id} className="px-5 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-zinc-800 text-sm">{lead.name}</span>
                      <span className="text-zinc-400 text-[11px]">{lead.email}</span>
                    </div>
                    <p className="text-zinc-600 text-sm">{lead.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ═══ TAB: Team ════════════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Add Team Member Form */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 p-6">
            <h2 className="text-base font-bold text-zinc-800 mb-4">Add Team Member</h2>
            <form action={createTeamMember} className="grid sm:grid-cols-2 gap-4">
              <input name="name" required placeholder="Full name *" className={inputCls} />
              <input name="role" required placeholder="Role (e.g. Head Coach) *" className={inputCls} />
              <textarea name="bio" rows={2} placeholder="Short bio" className={`col-span-full ${inputCls} resize-none`} />
              <input name="image" placeholder="Photo URL" className={inputCls} />
              <input name="order" type="number" defaultValue={0} placeholder="Display order" className={inputCls} />
              <div className="col-span-full">
                <button type="submit" className={btnCls}>Add Team Member</button>
              </div>
            </form>
          </div>

          {/* Team List */}
          {team.length > 0 && (
            <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
                <h3 className="font-bold text-zinc-800 text-sm">Team Members</h3>
                <span className="text-xs text-zinc-400">{team.length} members</span>
              </div>
              <div className="divide-y divide-zinc-50">
                {team.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between px-5 py-3 hover:bg-zinc-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {m.image ? (
                        <div className="w-9 h-9 rounded-lg bg-zinc-100 overflow-hidden shrink-0">
                          <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c] font-bold text-sm shrink-0">
                          {m.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-zinc-800 text-sm">{m.name}</p>
                        <p className="text-zinc-400 text-xs">{m.role} · Order: {m.order}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${m.published ? "bg-green-50 text-green-600" : "bg-zinc-100 text-zinc-400"}`}>
                        {m.published ? "Published" : "Hidden"}
                      </span>
                      <form action={deleteTeamMember}>
                        <input type="hidden" name="id" value={m.id} />
                        <button type="submit" className="text-[11px] bg-red-50 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-100 font-semibold">Delete</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ═══ TAB: Testimonials ════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Add Testimonial Form */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 p-6">
            <h2 className="text-base font-bold text-zinc-800 mb-4">Add Testimonial</h2>
            <form action={createTestimonial} className="grid sm:grid-cols-2 gap-4">
              <input name="name" required placeholder="Student / parent name *" className={inputCls} />
              <input name="program" placeholder="Program (e.g. Junior, Elite)" className={inputCls} />
              <textarea name="content" rows={3} required placeholder="Testimonial text *" className={`col-span-full ${inputCls} resize-none`} />
              <input name="image" placeholder="Photo URL" className={inputCls} />
              <div className="flex items-center gap-6">
                <select name="rating" defaultValue="5" className={`${inputCls} !px-3`}>
                  {[5,4,3,2,1].map(r => <option key={r} value={r}>{"★".repeat(r)} ({r})</option>)}
                </select>
                <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer whitespace-nowrap">
                  <input type="checkbox" name="published" value="true" className="rounded border-zinc-300" /> Publish
                </label>
              </div>
              <div className="col-span-full">
                <button type="submit" className={btnCls}>Add Testimonial</button>
              </div>
            </form>
          </div>

          {/* Testimonials List */}
          {testimonials.length > 0 && (
            <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
                <h3 className="font-bold text-zinc-800 text-sm">Testimonials</h3>
                <span className="text-xs text-zinc-400">{testimonials.length} total</span>
              </div>
              <div className="divide-y divide-zinc-50">
                {testimonials.map((t: any) => (
                  <div key={t.id} className="px-5 py-3 hover:bg-zinc-50/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-800 text-sm">{t.name}</span>
                        <span className="text-zinc-400 text-[11px]">{t.program || ""}</span>
                        <span className="text-[#c9a84c] text-xs">{"★".repeat(t.rating)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${t.published ? "bg-green-50 text-green-600" : "bg-zinc-100 text-zinc-400"}`}>
                          {t.published ? "Published" : "Hidden"}
                        </span>
                        <form action={deleteTestimonial}>
                          <input type="hidden" name="id" value={t.id} />
                          <button type="submit" className="text-[11px] bg-red-50 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-100 font-semibold">Delete</button>
                        </form>
                      </div>
                    </div>
                    <p className="text-zinc-500 text-sm line-clamp-2">{t.content}</p>
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
