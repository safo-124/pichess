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
          ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-black/[0.04] border-b border-gray-200/60"
          : "bg-white/80 backdrop-blur-sm"
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
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a84c] via-[#d4b15a] to-[#a8893d] flex items-center justify-center shadow-lg shadow-[#c9a84c]/25"
            >
              <Crown size={20} className="text-white" />
            </motion.div>
            <div className="leading-tight">
              <div className="font-black text-gray-900 text-lg tracking-tight leading-none">
                PiChess
              </div>
              <div className="text-[10px] font-bold text-[#c9a84c] tracking-[0.25em] uppercase">
                Academy
              </div>
            </div>
          </Link>

          {/* Desktop nav — pill style */}
          <nav className="hidden lg:flex items-center gap-1 bg-gray-100/80 backdrop-blur-sm rounded-full px-2 py-1.5 border border-gray-200/60">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link key={l.href} href={l.href} className="relative px-4 py-2 text-sm font-medium transition-all">
                  {active && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-white rounded-full border border-gray-200 shadow-sm"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <span className={`relative z-10 ${active ? "text-[#c9a84c] font-bold" : "text-gray-500 hover:text-gray-800"}`}>
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
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft size={12} />
              Main Site
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/academy/enquire"
                className="relative px-5 py-2.5 rounded-full text-sm font-bold transition-all overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#c9a84c] via-[#d4b15a] to-[#c9a84c] group-hover:from-[#dbb95d] group-hover:to-[#c9a84c] transition-all" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
                <span className="relative z-10 text-white font-bold">Enquire Now</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile toggle */}
          <motion.button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-gray-600"
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
            className="lg:hidden overflow-hidden bg-white/98 backdrop-blur-xl border-t border-gray-200/60"
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
                        ? "text-[#c9a84c] bg-[#c9a84c]/10 font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
                className="pt-4 border-t border-gray-100 flex flex-col gap-2"
              >
                <Link
                  href="/academy/enquire"
                  onClick={() => setOpen(false)}
                  className="px-6 py-3 rounded-full text-center text-sm font-bold bg-gradient-to-r from-[#c9a84c] to-[#dbb95d] text-white"
                >
                  Enquire Now →
                </Link>
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
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
