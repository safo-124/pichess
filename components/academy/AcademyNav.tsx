"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowLeft, Crown } from "lucide-react";

const links = [
  { label: "Home", href: "/academy" },
  { label: "Lessons", href: "/academy/lessons" },
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
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0e1a]/95 backdrop-blur-xl shadow-2xl shadow-black/40 border-b border-amber-500/10"
          : "bg-gradient-to-b from-[#0a0e1a]/80 to-transparent"
      }`}
      style={{ zIndex: 99999 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <Link href="/academy" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25"
            >
              <Crown size={20} className="text-white" />
            </motion.div>
            <div className="leading-tight">
              <div className="font-black text-white text-lg tracking-tight leading-none">
                PiChess
              </div>
              <div className="text-[10px] font-bold text-amber-400/90 tracking-[0.25em] uppercase">
                Academy
              </div>
            </div>
          </Link>

          {/* Desktop nav — pill style */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.04] backdrop-blur-sm rounded-full px-2 py-1.5 border border-white/[0.06]">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link key={l.href} href={l.href} className="relative px-4 py-2 text-sm font-medium transition-all">
                  {active && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/15 rounded-full border border-amber-400/20"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <span className={`relative z-10 ${active ? "text-amber-300" : "text-white/60 hover:text-white"}`}>
                    {l.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors"
            >
              <ArrowLeft size={12} />
              Main Site
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/academy/enquire"
                className="relative px-5 py-2.5 rounded-full text-sm font-bold transition-all overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 group-hover:from-amber-300 group-hover:via-amber-400 group-hover:to-orange-400 transition-all" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
                <span className="relative z-10 text-black">Enquire Now</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile toggle */}
          <motion.button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-white/80"
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-[#0a0e1a]/98 backdrop-blur-xl border-t border-white/[0.06]"
          >
            <div className="px-4 py-5 space-y-1">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, ease: "easeOut" }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      pathname === l.href
                        ? "text-amber-300 bg-amber-500/10"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="pt-4 border-t border-white/10 flex flex-col gap-2"
              >
                <Link
                  href="/academy/enquire"
                  onClick={() => setOpen(false)}
                  className="px-6 py-3 rounded-full text-center text-sm font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-black"
                >
                  Enquire Now →
                </Link>
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 text-center text-xs text-white/35 hover:text-white/60 transition-colors"
                >
                  ← Back to Main Site
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
