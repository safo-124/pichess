"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Academy", href: "/academy" },
  { label: "Foundation", href: "/ngo" },
  { label: "Shop", href: "/shop" },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];


export default function MainNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`w-full transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-black/70 backdrop-blur-md border-b border-white/10"
      }`}
      style={{ position: "relative", zIndex: 9999 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-white rounded-sm flex items-center justify-center font-black text-black text-lg group-hover:scale-105 transition-transform">
              ♟
            </div>
            <span className="font-black text-white text-xl tracking-tight">
              Pi<span className="text-[#c9a84c]">Chess</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => {
              const isZone = l.href === "/academy" || l.href === "/ngo" || l.href === "/shop";
              const zoneColor = l.href === "/academy" ? "text-[#c9a84c]" : l.href === "/ngo" ? "text-[#2e7d5b]" : l.href === "/shop" ? "text-amber-400" : "";
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    pathname === l.href
                      ? `${isZone ? zoneColor : "text-white"} bg-white/10`
                      : `${isZone ? zoneColor : "text-white/70"} hover:text-white hover:bg-white/8`
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Join / Login */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/academy/enquire"
              className="px-4 py-2 rounded-full bg-[#c9a84c] hover:bg-[#dbb95d] text-black text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Join Academy
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-black/98 border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/8 font-medium transition-all"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 rounded-full text-center text-sm font-semibold text-white border border-white/30"
                >
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
