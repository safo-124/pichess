"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard, GraduationCap, Heart, ShoppingBag,
  FileText, Trophy, Settings, LogOut, Crown,
  PanelLeftClose, PanelLeft, Globe, Puzzle, Users,
} from "lucide-react";

const mainNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, color: "#c9a84c" },
];

const manageSections = [
  { label: "Academy", href: "/admin/academy", icon: GraduationCap, color: "#c9a84c", desc: "Leads, team, testimonials" },
  { label: "Tournaments", href: "/admin/tournaments", icon: Trophy, color: "#f59e0b", desc: "Events & competitions" },
  { label: "NGO / Foundation", href: "/admin/ngo", icon: Heart, color: "#2e7d5b", desc: "Applications, volunteers" },
  { label: "Shop", href: "/admin/shop", icon: ShoppingBag, color: "#a855f7", desc: "Products & categories" },
];

const contentSections = [
  { label: "About Page", href: "/admin/about", icon: Users, color: "#6366f1", desc: "Hero, story, values" },
  { label: "Blog & News", href: "/admin/content", icon: FileText, color: "#f97316", desc: "Posts, subscribers" },
  { label: "Partners & Extras", href: "/admin/extras", icon: Puzzle, color: "#06b6d4", desc: "Partners, puzzles" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  const NavLink = ({ item }: { item: { label: string; href: string; icon: any; color: string; desc?: string } }) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        className={`group relative flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all duration-200 ${
          collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
        } ${
          active
            ? "bg-white/[0.08] text-white shadow-sm"
            : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
        }`}
      >
        {active && (
          <motion.div
            layoutId="adminSidebarActive"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
            style={{ background: item.color }}
            transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
          />
        )}
        <div
          className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
            active ? "bg-white/10" : "bg-transparent group-hover:bg-white/5"
          }`}
          style={active ? { color: item.color } : undefined}
        >
          <Icon size={15} />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="truncate">{item.label}</div>
          </div>
        )}
        {collapsed && (
          <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl border border-white/10">
            {item.label}
          </div>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={`${
        collapsed ? "w-[72px]" : "w-64"
      } min-h-screen bg-[#0a0a0f] border-r border-white/[0.06] flex flex-col transition-all duration-300 shrink-0`}
    >
      {/* Logo */}
      <div className={`${collapsed ? "p-3" : "p-5"} border-b border-white/[0.06]`}>
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#a8893d] flex items-center justify-center shadow-lg shadow-[#c9a84c]/20 shrink-0">
            <Crown size={16} className="text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="font-black text-white text-sm tracking-tight">PiChess</div>
              <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">Admin Panel</div>
            </motion.div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${collapsed ? "p-2" : "p-3"} space-y-5 overflow-y-auto`}>
        {/* Main */}
        <div className="space-y-0.5">
          {mainNav.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>

        {/* Manage */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-2">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em]">Manage</p>
            </div>
          )}
          <div className="space-y-0.5">
            {manageSections.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-2">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em]">Content</p>
            </div>
          )}
          <div className="space-y-0.5">
            {contentSections.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom */}
      <div className={`${collapsed ? "p-2" : "p-3"} border-t border-white/[0.06] space-y-0.5`}>
        {/* View Site */}
        <Link
          href="/"
          target="_blank"
          className={`flex items-center gap-3 rounded-xl text-[13px] font-medium text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all ${
            collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
          }`}
        >
          <Globe size={15} />
          {!collapsed && "View Site"}
        </Link>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center gap-3 rounded-xl text-[13px] font-medium text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all ${
            collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
          }`}
        >
          {collapsed ? <PanelLeft size={15} /> : <PanelLeftClose size={15} />}
          {!collapsed && "Collapse"}
        </button>

        {/* Logout */}
        <Link
          href="/login"
          className={`flex items-center gap-3 rounded-xl text-[13px] font-medium text-red-400/40 hover:text-red-400 hover:bg-red-500/[0.06] transition-all ${
            collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
          }`}
        >
          <LogOut size={15} />
          {!collapsed && "Logout"}
        </Link>
      </div>
    </aside>
  );
}
