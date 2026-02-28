"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, GraduationCap, Heart, Trophy, ShoppingBag,
  FileText, BarChart3, Settings, LogOut, ChevronRight,
} from "lucide-react";

const sections = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Academy", href: "/admin/academy", icon: GraduationCap, color: "text-[#c9a84c]" },
  { label: "NGO", href: "/admin/ngo", icon: Heart, color: "text-[#2e7d5b]" },
  { label: "Tournaments", href: "/admin/tournaments", icon: Trophy, color: "text-blue-400" },
  { label: "Shop", href: "/admin/shop", icon: ShoppingBag, color: "text-purple-400" },
  { label: "Content", href: "/admin/content", icon: FileText, color: "text-orange-400" },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, color: "text-pink-400" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-zinc-950 border-r border-white/8 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/8">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center font-black text-black">
            ♟
          </div>
          <div>
            <div className="font-black text-white text-sm">PiChess</div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest">Admin</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {sections.map((item, i) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/6"
                }`}
              >
                <Icon
                  size={16}
                  className={active ? (item.color ?? "text-white") : `group-hover:${item.color ?? "text-white"} transition-colors`}
                />
                {item.label}
                {active && (
                  <ChevronRight size={14} className="ml-auto text-white/40" />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/8 space-y-1">
        <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/6 transition-all">
          <Settings size={16} />
          Settings
        </Link>
        <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/8 transition-all">
          <LogOut size={16} />
          Logout
        </Link>
      </div>
    </aside>
  );
}
