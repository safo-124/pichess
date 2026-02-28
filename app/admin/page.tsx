/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  GraduationCap, Heart, ShoppingBag, FileText,
  Trophy, Users, HandHeart, DollarSign,
  ArrowUpRight, Clock, TrendingUp,
} from "lucide-react";

export const metadata = { title: "Admin Dashboard | PiChess" };

async function getStats() {
  try {
    const [leads, applications, volunteers, donations, tournaments, products, posts, subscribers, team, testimonials, partners, stories] = await Promise.all([
      (prisma as any).academy_Lead.count(),
      (prisma as any).nGO_Application.count(),
      (prisma as any).nGO_Volunteer.count(),
      (prisma as any).nGO_Donation.aggregate({ _sum: { amount: true }, _count: true }),
      (prisma as any).tournament.count(),
      (prisma as any).product.count(),
      (prisma as any).content_Post.count(),
      (prisma as any).subscriber.count(),
      (prisma as any).academy_Team.count(),
      (prisma as any).academy_Testimonial.count(),
      (prisma as any).partner.count(),
      (prisma as any).nGO_Story.count(),
    ]);
    return { leads, applications, volunteers, donations, tournaments, products, posts, subscribers, team, testimonials, partners, stories };
  } catch {
    return { leads: 0, applications: 0, volunteers: 0, donations: { _sum: { amount: 0 }, _count: 0 }, tournaments: 0, products: 0, posts: 0, subscribers: 0, team: 0, testimonials: 0, partners: 0, stories: 0 };
  }
}

async function getRecentActivity() {
  try {
    const [recentLeads, recentApplications, recentPosts, recentDonations] = await Promise.all([
      (prisma as any).academy_Lead.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, program: true, status: true, createdAt: true } }),
      (prisma as any).nGO_Application.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, status: true, createdAt: true } }),
      (prisma as any).content_Post.findMany({ take: 3, orderBy: { createdAt: "desc" }, select: { id: true, title: true, published: true, createdAt: true } }),
      (prisma as any).nGO_Donation.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, donor_name: true, amount: true, anonymous: true, createdAt: true } }),
    ]);
    return { recentLeads, recentApplications, recentPosts, recentDonations };
  } catch {
    return { recentLeads: [], recentApplications: [], recentPosts: [], recentDonations: [] };
  }
}

export default async function AdminDashboard() {
  const [stats, activity] = await Promise.all([getStats(), getRecentActivity()]);

  const primaryStats = [
    { label: "Academy Leads", value: stats.leads, icon: GraduationCap, color: "#c9a84c", bg: "from-[#c9a84c]/10 to-[#c9a84c]/5", href: "/admin/academy" },
    { label: "NGO Applications", value: stats.applications, icon: Heart, color: "#2e7d5b", bg: "from-[#2e7d5b]/10 to-[#2e7d5b]/5", href: "/admin/ngo" },
    { label: "Volunteers", value: stats.volunteers, icon: HandHeart, color: "#2e7d5b", bg: "from-[#2e7d5b]/10 to-[#2e7d5b]/5", href: "/admin/ngo" },
    { label: "Total Donations", value: `GH₵ ${((stats.donations as any)._sum?.amount ?? 0).toLocaleString()}`, icon: DollarSign, color: "#16a34a", bg: "from-green-500/10 to-green-500/5", href: "/admin/ngo", sub: `${(stats.donations as any)._count} gifts` },
    { label: "Tournaments", value: stats.tournaments, icon: Trophy, color: "#f59e0b", bg: "from-amber-500/10 to-amber-500/5", href: "/admin/tournaments" },
    { label: "Products", value: stats.products, icon: ShoppingBag, color: "#a855f7", bg: "from-purple-500/10 to-purple-500/5", href: "/admin/shop" },
    { label: "Blog Posts", value: stats.posts, icon: FileText, color: "#f97316", bg: "from-orange-500/10 to-orange-500/5", href: "/admin/content" },
    { label: "Subscribers", value: stats.subscribers, icon: Users, color: "#06b6d4", bg: "from-cyan-500/10 to-cyan-500/5", href: "/admin/content" },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Dashboard</h1>
          <p className="text-zinc-400 mt-1 text-sm">Welcome back. Here&apos;s an overview of PiChess.</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-zinc-400 bg-white rounded-lg px-3 py-1.5 border border-zinc-200/80">
          <Clock size={12} />
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {primaryStats.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group relative rounded-2xl bg-white border border-zinc-200/80 p-5 hover:shadow-lg hover:shadow-zinc-200/50 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
            >
              {/* Gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${card.color}15` }}>
                    <Icon size={18} style={{ color: card.color }} />
                  </div>
                  <ArrowUpRight size={14} className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                </div>
                <p className="text-2xl font-black text-zinc-900 tracking-tight">{card.value}</p>
                <p className="text-zinc-400 text-xs mt-1 font-medium">{card.label}</p>
                {card.sub && <p className="text-zinc-300 text-[10px] mt-0.5">{card.sub}</p>}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Secondary Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Team Members", value: stats.team, href: "/admin/academy" },
          { label: "Testimonials", value: stats.testimonials, href: "/admin/academy" },
          { label: "Partners", value: stats.partners, href: "/admin/extras" },
          { label: "Impact Stories", value: stats.stories, href: "/admin/ngo" },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="flex items-center gap-3 bg-white rounded-xl border border-zinc-200/80 px-4 py-3 hover:bg-zinc-50 transition-colors">
            <span className="text-xl font-black text-zinc-900">{s.value}</span>
            <span className="text-xs text-zinc-400 font-medium">{s.label}</span>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-zinc-400" />
          <h2 className="text-sm font-bold text-zinc-700 uppercase tracking-wider">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            { label: "Add Tournament", href: "/admin/tournaments", icon: "♟️", color: "#f59e0b" },
            { label: "Add Product", href: "/admin/shop", icon: "🛍️", color: "#a855f7" },
            { label: "Create Post", href: "/admin/content", icon: "📝", color: "#f97316" },
            { label: "Add Team Member", href: "/admin/academy", icon: "👤", color: "#c9a84c" },
            { label: "Add Story", href: "/admin/ngo", icon: "📖", color: "#2e7d5b" },
            { label: "Add Partner", href: "/admin/extras", icon: "🤝", color: "#06b6d4" },
            { label: "Add Puzzle", href: "/admin/extras", icon: "🧩", color: "#06b6d4" },
            { label: "View Leads", href: "/admin/academy", icon: "🎓", color: "#c9a84c" },
            { label: "View Applications", href: "/admin/ngo", icon: "🌱", color: "#2e7d5b" },
            { label: "Manage Shop", href: "/admin/shop", icon: "📦", color: "#a855f7" },
          ].map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200/80 text-[13px] font-medium text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 hover:shadow-sm transition-all"
            >
              <span className="text-base">{a.icon}</span>
              <span className="truncate">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Academy Leads */}
        <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#c9a84c]" />
              <h2 className="font-bold text-zinc-800 text-sm">Recent Academy Leads</h2>
            </div>
            <Link href="/admin/academy" className="text-xs text-[#c9a84c] hover:underline font-semibold">View all →</Link>
          </div>
          <div className="divide-y divide-zinc-50">
            {activity.recentLeads.length === 0 ? (
              <p className="text-zinc-400 text-sm text-center py-10">No leads yet</p>
            ) : activity.recentLeads.map((lead: any) => (
              <div key={lead.id} className="flex items-center justify-between px-5 py-3 hover:bg-zinc-50/50 transition-colors">
                <div className="min-w-0">
                  <p className="font-semibold text-zinc-800 text-sm truncate">{lead.name}</p>
                  <p className="text-zinc-400 text-xs truncate">{lead.email} {lead.program ? `· ${lead.program}` : ""}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    lead.status === "NEW" ? "bg-blue-50 text-blue-600" :
                    lead.status === "CONTACTED" ? "bg-yellow-50 text-yellow-600" :
                    lead.status === "ENROLLED" ? "bg-green-50 text-green-600" :
                    "bg-zinc-100 text-zinc-500"
                  }`}>{lead.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent NGO Applications */}
        <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#2e7d5b]" />
              <h2 className="font-bold text-zinc-800 text-sm">Recent NGO Applications</h2>
            </div>
            <Link href="/admin/ngo" className="text-xs text-[#2e7d5b] hover:underline font-semibold">View all →</Link>
          </div>
          <div className="divide-y divide-zinc-50">
            {activity.recentApplications.length === 0 ? (
              <p className="text-zinc-400 text-sm text-center py-10">No applications yet</p>
            ) : activity.recentApplications.map((app: any) => (
              <div key={app.id} className="flex items-center justify-between px-5 py-3 hover:bg-zinc-50/50 transition-colors">
                <div className="min-w-0">
                  <p className="font-semibold text-zinc-800 text-sm truncate">{app.name}</p>
                  <p className="text-zinc-400 text-xs truncate">{app.email}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ml-3 ${
                  app.status === "PENDING" ? "bg-yellow-50 text-yellow-600" :
                  app.status === "APPROVED" ? "bg-green-50 text-green-600" :
                  "bg-red-50 text-red-500"
                }`}>{app.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#f97316]" />
              <h2 className="font-bold text-zinc-800 text-sm">Recent Posts</h2>
            </div>
            <Link href="/admin/content" className="text-xs text-[#f97316] hover:underline font-semibold">View all →</Link>
          </div>
          <div className="divide-y divide-zinc-50">
            {activity.recentPosts.length === 0 ? (
              <p className="text-zinc-400 text-sm text-center py-10">No posts yet</p>
            ) : activity.recentPosts.map((post: any) => (
              <div key={post.id} className="flex items-center justify-between px-5 py-3 hover:bg-zinc-50/50 transition-colors">
                <p className="font-semibold text-zinc-800 text-sm truncate">{post.title}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-3 ${
                  post.published ? "bg-green-50 text-green-600" : "bg-zinc-100 text-zinc-400"
                }`}>{post.published ? "Published" : "Draft"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Donations */}
        <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
              <h2 className="font-bold text-zinc-800 text-sm">Recent Donations</h2>
            </div>
            <Link href="/admin/ngo" className="text-xs text-[#16a34a] hover:underline font-semibold">View all →</Link>
          </div>
          <div className="divide-y divide-zinc-50">
            {activity.recentDonations.length === 0 ? (
              <p className="text-zinc-400 text-sm text-center py-10">No donations yet</p>
            ) : activity.recentDonations.map((d: any) => (
              <div key={d.id} className="flex items-center justify-between px-5 py-3 hover:bg-zinc-50/50 transition-colors">
                <p className="font-semibold text-zinc-800 text-sm">{d.anonymous ? "Anonymous" : d.donor_name}</p>
                <span className="text-sm font-bold text-[#16a34a]">GH₵ {d.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
