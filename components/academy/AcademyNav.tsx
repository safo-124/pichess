"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowLeft } from "lucide-react";

const links = [
  { label: "Home", href: "/academy" },
  { label: "Programs", href: "/academy#programs" },
  { label: "Tournaments", href: "/academy/tournaments" },
  { label: "Our Team", href: "/academy/team" },
  { label: "Testimonials", href: "/academy#testimonials" },
];

export default function AcademyNav() {
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
          ? "bg-zinc-950/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-[#c9a84c]/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/academy" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-sm border-2 border-[#c9a84c] flex items-center justify-center font-black text-[#c9a84c] text-lg group-hover:bg-[#c9a84c] group-hover:text-black transition-all">
              ♟
            </div>
            <div className="leading-tight">
              <div className="font-black text-white text-base tracking-tight leading-none">
                PiChess
              </div>
              <div className="text-[10px] font-semibold text-[#c9a84c] tracking-[0.2em] uppercase">
                Academy
              </div>
            </div>
          </Link>

          {/* Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  pathname === l.href
                    ? "text-[#c9a84c] bg-[#c9a84c]/10"
                    : "text-white/70 hover:text-[#c9a84c] hover:bg-[#c9a84c]/8"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              <ArrowLeft size={12} />
              Main Site
            </Link>
            <Link
              href="/academy/enquire"
              className="px-4 py-2 rounded-full bg-[#c9a84c] hover:bg-[#dbb95d] text-black text-sm font-bold transition-all hover:scale-105 active:scale-95 animate-border-glow"
            >
              Enquire Now
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-white">
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
            className="lg:hidden overflow-hidden bg-zinc-950/98 border-t border-[#c9a84c]/20"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={l.href} onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-white/80 hover:text-[#c9a84c] font-medium transition-all">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <Link href="/academy/enquire" onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-full text-center text-sm font-bold bg-[#c9a84c] text-black">
                  Enquire Now
                </Link>
                <Link href="/" onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-full text-center text-xs text-white/40 border border-white/10">
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
