"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowLeft, Heart } from "lucide-react";

const links = [
  { label: "Home", href: "/ngo" },
  { label: "Our Mission", href: "/ngo#mission" },
  { label: "Programs", href: "/ngo#programs" },
  { label: "Apply for Support", href: "/ngo/apply" },
  { label: "Volunteer", href: "/ngo/volunteer" },
  { label: "Stories", href: "/ngo#stories" },
];

export default function NGONav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-[#2e7d5b]/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/ngo" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full border-2 border-[#2e7d5b] flex items-center justify-center group-hover:bg-[#2e7d5b] transition-all">
              <Heart size={16} className="text-[#2e7d5b] group-hover:text-white transition-colors" />
            </div>
            <div className="leading-tight">
              <div className={`font-black text-base tracking-tight leading-none ${scrolled ? "text-zinc-900" : "text-white"}`}>
                PiChess
              </div>
              <div className="text-[10px] font-semibold text-[#2e7d5b] tracking-[0.2em] uppercase">
                Foundation
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  pathname === l.href
                    ? "text-[#2e7d5b] bg-[#2e7d5b]/10"
                    : `${scrolled ? "text-zinc-600 hover:text-[#2e7d5b]" : "text-white/80 hover:text-white"} hover:bg-[#2e7d5b]/8`
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
              <ArrowLeft size={12} /> Main Site
            </Link>
            <Link
              href="/ngo/donate"
              className="px-4 py-2 rounded-full bg-[#2e7d5b] hover:bg-[#3a9970] text-white text-sm font-bold transition-all hover:scale-105 active:scale-95 animate-border-glow-green"
            >
              Donate Now
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} className={`lg:hidden p-2 ${scrolled ? "text-zinc-800" : "text-white"}`}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:hidden overflow-hidden bg-white/98 border-t border-[#2e7d5b]/20"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={l.href} onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-zinc-700 hover:text-[#2e7d5b] font-medium transition-all">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
                <Link href="/ngo/donate" onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-full text-center text-sm font-bold bg-[#2e7d5b] text-white">
                  Donate Now
                </Link>
                <Link href="/" onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-full text-center text-xs text-zinc-400 border border-zinc-200">
                  ← Back to Main Site
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
