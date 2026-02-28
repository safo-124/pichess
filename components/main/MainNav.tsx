"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  GraduationCap,
  Heart,
  Trophy,
  ShoppingBag,
  Newspaper,
  Users,
  Phone,
  Home,
  ChevronRight,
  Crown,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Academy", href: "/academy", icon: GraduationCap, accent: "#c9a84c" },
  { label: "Foundation", href: "/ngo", icon: Heart, accent: "#2e7d5b" },
  { label: "Tournaments", href: "/tournaments", icon: Trophy },
  { label: "Shop", href: "/shop", icon: ShoppingBag, accent: "#d97706" },
  { label: "News", href: "/news", icon: Newspaper },
  { label: "About", href: "/about", icon: Users },
  { label: "Contact", href: "/contact", icon: Phone },
];

export default function MainNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_30px_rgba(0,0,0,0.04)]"
          : "bg-white/90 backdrop-blur-xl"
      }`}
      style={{ zIndex: 99999 }}
    >
      {/* Subtle top accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group relative">
            <div className="relative">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center transition-all duration-300 group-hover:rounded-xl group-hover:shadow-lg group-hover:shadow-black/20 group-hover:scale-105">
                <Crown className="w-5 h-5 text-[#c9a84c]" strokeWidth={2.5} />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#c9a84c] rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col -space-y-0.5">
              <span className="font-black text-[22px] tracking-tight leading-tight">
                <span className="text-gray-900">Pi</span>
                <span className="bg-gradient-to-r from-[#c9a84c] to-[#dbb95d] bg-clip-text text-transparent">
                  Chess
                </span>
              </span>
              <span className="text-[9px] font-semibold text-gray-400 tracking-[0.2em] uppercase">
                Ghana
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center">
            <div className="flex items-center bg-gray-50/80 rounded-full px-1.5 py-1 border border-gray-100">
              {navLinks.map((l) => {
                const isActive = pathname === l.href;
                const accentColor = l.accent;

                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="relative px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300 group"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navPill"
                        className="absolute inset-0 bg-black rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 flex items-center gap-1.5 transition-colors duration-200 ${
                        isActive
                          ? "text-white"
                          : accentColor
                          ? ""
                          : "text-gray-500 group-hover:text-gray-900"
                      }`}
                      style={
                        !isActive && accentColor
                          ? { color: accentColor }
                          : undefined
                      }
                    >
                      {l.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/academy/enquire"
              className="group relative px-5 py-2.5 rounded-full bg-black text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Join Academy
                <ChevronRight
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={2.5}
                />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#c9a84c] to-[#dbb95d] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute inset-0 z-10 flex items-center justify-center gap-1.5 text-black font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Join Academy
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-gray-900 hover:bg-gray-100 transition-all duration-200"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} strokeWidth={2.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} strokeWidth={2.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
              style={{ top: "70px", zIndex: -1 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 py-3 max-h-[calc(100vh-70px)] overflow-y-auto">
                <div className="space-y-0.5">
                  {navLinks.map((l, i) => {
                    const Icon = l.icon;
                    const isActive = pathname === l.href;
                    return (
                      <motion.div
                        key={l.href}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                      >
                        <Link
                          href={l.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-black text-white"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isActive
                                ? "bg-white/15"
                                : "bg-gray-100"
                            }`}
                          >
                            <Icon
                              size={16}
                              strokeWidth={2}
                              style={
                                !isActive && l.accent
                                  ? { color: l.accent }
                                  : undefined
                              }
                            />
                          </div>
                          <span className="text-[15px]">{l.label}</span>
                          {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="mt-4 pt-4 border-t border-gray-100 space-y-2"
                >
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl text-center text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/academy/enquire"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl text-center text-sm font-bold bg-black text-white hover:bg-gray-900 transition-all"
                  >
                    Join the Academy
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
