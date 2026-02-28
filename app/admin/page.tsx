/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Admin Dashboard | PiChess" };

async function getStats() {
  try {
    const [leads, applications, volunteers, donations, tournaments, products, posts, subscribers] = await Promise.all([
      (prisma as any).academy_Lead.count(),
      (prisma as any).nGO_Application.count(),
      (prisma as any).nGO_Volunteer.count(),
      (prisma as any).nGO_Donation.aggregate({ _sum: { amount: true }, _count: true }),
      (prisma as any).tournament.count(),
      (prisma as any).product.count(),
      (prisma as any).content_Post.count(),
      (prisma as any).subscriber.count(),
    ]);
    return { leads, applications, volunteers, donations, tournaments, products, posts, subscribers };
  } catch {
    return { leads: 0, applications: 0, volunteers: 0, donations: { _sum: { amount: 0 }, _count: 0 }, tournaments: 0, products: 0, posts: 0, subscribers: 0 };
  }
}

async function getRecentActivity() {
  try {
    const [recentLeads, recentApplications] = await Promise.all([
      (prisma as any).academy_Lead.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, program: true, status: true, createdAt: true } }),
      (prisma as any).nGO_Application.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, status: true, createdAt: true } }),
    ]);
    return { recentLeads, recentApplications };
  } catch {
    return { recentLeads: [], recentApplications: [] };
  }
}

const statCards = [
  { label: "Academy Leads", key: "leads", href: "/admin/academy", color: "#c9a84c", icon: "🎓" },
  { label: "NGO Applications", key: "applications", href: "/admin/ngo", color: "#2e7d5b", icon: "🌱" },
  { label: "Volunteers", key: "volunteers", href: "/admin/ngo", color: "#2e7d5b", icon: "🤝" },
  { label: "Tournaments", key: "tournaments", href: "/admin/tournaments", color: "#6366f1", icon: "♟️" },
  { label: "Products", key: "products", href: "/admin/shop", color: "#f59e0b", icon: "🛍️" },
  { label: "Posts", key: "posts", href: "/admin/content", color: "#ec4899", icon: "📝" },
  { label: "Subscribers", key: "subscribers", href: "/admin/content", color: "#06b6d4", icon: "📧" },
];

export default async function AdminDashboard() {
  const [stats, activity] = await Promise.all([getStats(), getRecentActivity()]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-zinc-900">Dashboard</h1>
        <p className="text-zinc-400 mt-1">Welcome back. Here&apos;s what&apos;s happening across PiChess.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const value = card.key === "donations"
            ? `GH₵ ${(stats.donations._sum?.amount ?? 0).toLocaleString()}`
            : (stats as any)[card.key] ?? 0;

          return (
            <Link key={card.key} href={card.href}
              className="rounded-xl border border-zinc-200 bg-white p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
                <span className="text-xs font-semibold px-2 py-1 rounded-full text-white" style={{ background: card.color }}>
                  View
                </span>
              </div>
              <p className="text-3xl font-black text-zinc-900">{value}</p>
              <p className="text-zinc-400 text-sm mt-1">{card.label}</p>
            </Link>
          );
        })}

        {/* Total donations */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="text-2xl mb-3">💰</div>
          <p className="text-3xl font-black text-zinc-900">
            GH₵ {(stats.donations._sum?.amount ?? 0).toLocaleString()}
          </p>
          <p className="text-zinc-400 text-sm mt-1">Total Donations ({stats.donations._count} gifts)</p>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-bold text-zinc-900 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Add Tournament", href: "/admin/tournaments", icon: "♟️" },
            { label: "Add Product", href: "/admin/shop", icon: "🛍️" },
            { label: "Create Post", href: "/admin/content", icon: "📝" },
            { label: "View NGO Apps", href: "/admin/ngo", icon: "🌱" },
            { label: "View Leads", href: "/admin/academy", icon: "🎓" },
          ].map((a) => (
            <Link key={a.label} href={a.href}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
            >
              <span>{a.icon}</span> {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Academy Leads */}
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-zinc-100">
            <h2 className="font-bold text-zinc-900">Recent Academy Leads</h2>
            <Link href="/admin/academy" className="text-xs text-[#c9a84c] hover:underline font-medium">View all →</Link>
          </div>
          <div className="divide-y divide-zinc-50">
            {activity.recentLeads.length === 0 ? (
              <p className="text-zinc-400 text-sm text-center py-8">No leads yet</p>
            ) : activity.recentLeads.map((lead: any) => (
              <div key={lead.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium text-zinc-900 text-sm">{lead.name}</p>
                  <p className="text-zinc-400 text-xs">{lead.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  lead.status === "NEW" ? "bg-blue-50 text-blue-600" :
                  lead.status === "CONTACTED" ? "bg-yellow-50 text-yellow-600" :
                  lead.status === "ENROLLED" ? "bg-green-50 text-green-600" :
                  "bg-zinc-100 text-zinc-500"
                }`}>
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent NGO Applications */}
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-zinc-100">
            <h2 className="font-bold text-zinc-900">Recent NGO Applications</h2>
            <Link href="/admin/ngo" className="text-xs text-[#2e7d5b] hover:underline font-medium">View all →</Link>
          </div>
          <div className="divide-y divide-zinc-50">
            {activity.recentApplications.length === 0 ? (
              <p className="text-zinc-400 text-sm text-center py-8">No applications yet</p>
            ) : activity.recentApplications.map((app: any) => (
              <div key={app.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium text-zinc-900 text-sm">{app.name}</p>
                  <p className="text-zinc-400 text-xs">{app.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  app.status === "PENDING" ? "bg-yellow-50 text-yellow-600" :
                  app.status === "APPROVED" ? "bg-green-50 text-green-600" :
                  "bg-red-50 text-red-500"
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
