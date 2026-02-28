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
  ArrowRight,
} from "lucide-react";

const leftLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Academy", href: "/academy", icon: GraduationCap, accent: "#c9a84c" },
  { label: "Foundation", href: "/ngo", icon: Heart, accent: "#2e7d5b" },
  { label: "Tournaments", href: "/tournaments", icon: Trophy },
];

const rightLinks = [
  { label: "Shop", href: "/shop", icon: ShoppingBag, accent: "#d97706" },
  { label: "News", href: "/news", icon: Newspaper },
  { label: "About", href: "/about", icon: Users },
  { label: "Contact", href: "/contact", icon: Phone },
];

const allLinks = [...leftLinks, ...rightLinks];

/* Mini 2x2 chess pattern used in the logo */
function ChessPattern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor">
      <rect x="0" y="0" width="8" height="8" opacity="0.9" />
      <rect x="8" y="8" width="8" height="8" opacity="0.9" />
      <rect x="8" y="0" width="8" height="8" opacity="0.15" />
      <rect x="0" y="8" width="8" height="8" opacity="0.15" />
    </svg>
  );
}

export default function MainNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 30);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const NavLink = ({ l }: { l: typeof allLinks[number] }) => {
    const isActive = pathname === l.href;
    return (
      <Link
        key={l.href}
        href={l.href}
        onMouseEnter={() => setHovered(l.href)}
        onMouseLeave={() => setHovered(null)}
        className="relative px-3 py-2 text-[13px] font-semibold tracking-wide uppercase group"
      >
        <span
          className={`relative z-10 transition-colors duration-300 ${
            scrolled
              ? isActive
                ? "text-black"
                : l.accent && !isActive
                ? "hover:text-black"
                : "text-gray-400 hover:text-black"
              : isActive
              ? "text-white"
              : "text-white/70 hover:text-white"
          }`}
          style={scrolled && l.accent && !isActive ? { color: l.accent } : undefined}
        >
          {l.label}
        </span>

        {/* Animated underline */}
        {isActive ? (
          <motion.div
            layoutId="activeUnderline"
            className={`absolute bottom-0 left-3 right-3 h-[2px] ${
              scrolled ? "bg-[#c9a84c]" : "bg-white"
            }`}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        ) : hovered === l.href ? (
          <motion.div
            layoutId="hoverUnderline"
            className={`absolute bottom-0 left-3 right-3 h-[2px] ${
              scrolled ? "bg-gray-300" : "bg-white/40"
            }`}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        ) : null}
      </Link>
    );
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 w-full"
        style={{ zIndex: 99999 }}
      >
        {/* Top bar — visible only before scroll */}
        <AnimatePresence>
          {!scrolled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 32, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-black/40 backdrop-blur-sm text-white overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-8 text-[11px] tracking-widest uppercase">
                <span className="text-white/60">Ghana&apos;s Premier Chess Platform</span>
                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-white/70 hover:text-white transition-colors">
                    Sign In
                  </Link>
                  <span className="text-white/30">|</span>
                  <Link href="/academy/enquire" className="text-[#c9a84c] hover:text-[#dbb95d] transition-colors font-semibold">
                    Join Academy
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main nav bar */}
        <motion.div
          animate={{
            backgroundColor: scrolled ? "rgba(255,255,255,0.97)" : "rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.4 }}
          className={`transition-all duration-500 ${
            scrolled
              ? "shadow-[0_4px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl"
              : "shadow-none"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:justify-center relative">
              {/* Left nav (desktop) */}
              <nav className="hidden lg:flex items-center gap-0.5 absolute left-0">
                {leftLinks.map((l) => (
                  <NavLink key={l.href} l={l} />
                ))}
              </nav>

              {/* Center Logo */}
              <Link href="/" className="flex items-center gap-3 group relative">
                <div className="relative">
                  <div className={`w-11 h-11 rounded-lg overflow-hidden relative shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl ${
                    scrolled ? "bg-black shadow-black/10 group-hover:shadow-black/20" : "bg-white/10 backdrop-blur-sm shadow-white/10 group-hover:shadow-white/20 border border-white/20"
                  }`}>
                    <ChessPattern className={`absolute inset-0 w-full h-full ${
                      scrolled ? "text-[#c9a84c]" : "text-white/80"
                    }`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-black text-lg drop-shadow-md">♚</span>
                    </div>
                  </div>
                  {/* Gold corner dot */}
                  <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#c9a84c] border-2 shadow-sm ${
                    scrolled ? "border-white" : "border-black/30"
                  }`} />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-[24px] tracking-tight leading-none">
                    <span className={`transition-colors duration-300 ${
                      scrolled ? "text-gray-900" : "text-white"
                    }`}>Pi</span>
                    <span className="text-[#c9a84c]">Chess</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-[1px] bg-[#c9a84c]" />
                    <span className={`text-[8px] font-bold tracking-[0.3em] uppercase transition-colors duration-300 ${
                      scrolled ? "text-gray-400" : "text-white/50"
                    }`}>
                      Ghana
                    </span>
                    <div className="w-3 h-[1px] bg-[#c9a84c]" />
                  </div>
                </div>
              </Link>

              {/* Right nav (desktop) */}
              <nav className="hidden lg:flex items-center gap-0.5 absolute right-0">
                {rightLinks.map((l) => (
                  <NavLink key={l.href} l={l} />
                ))}

                {/* CTA button - only on scroll */}
                <AnimatePresence>
                  {scrolled && (
                    <motion.div
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <Link
                        href="/academy/enquire"
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c9a84c] hover:text-black transition-all duration-300 whitespace-nowrap"
                      >
                        Join
                        <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </nav>

              {/* Mobile: Logo left, hamburger right */}
              <button
                onClick={() => setOpen(!open)}
                className={`lg:hidden absolute right-0 w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                  scrolled ? "text-gray-900 hover:bg-gray-50" : "text-white hover:bg-white/10"
                }`}
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
                      <X size={22} strokeWidth={2} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={22} strokeWidth={2} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Gold line accent */}
        <div
          className={`h-[1px] transition-opacity duration-500 bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />
      </header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 lg:hidden"
            style={{ zIndex: 99998 }}
          >
            {/* Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white"
            />

            {/* Decorative chess pattern */}
            <div className="absolute top-20 right-0 w-48 h-48 opacity-[0.03]">
              <svg viewBox="0 0 8 8" className="w-full h-full">
                {Array.from({ length: 64 }).map((_, i) => (
                  <rect
                    key={i}
                    x={i % 8}
                    y={Math.floor(i / 8)}
                    width="1"
                    height="1"
                    fill={(i + Math.floor(i / 8)) % 2 === 0 ? "black" : "transparent"}
                  />
                ))}
              </svg>
            </div>

            {/* Content */}
            <div className="relative pt-28 px-8 pb-8 h-full overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mb-8"
              >
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#c9a84c]">
                  Navigation
                </span>
              </motion.div>

              <div className="space-y-1">
                {allLinks.map((l, i) => {
                  const Icon = l.icon;
                  const isActive = pathname === l.href;
                  return (
                    <motion.div
                      key={l.href}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.05, duration: 0.4, ease: "easeOut" }}
                    >
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-4 py-3.5 border-b transition-all duration-200 ${
                          isActive
                            ? "border-black"
                            : "border-gray-100 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                            isActive
                              ? "bg-black text-white"
                              : "bg-gray-50 text-gray-400"
                          }`}
                        >
                          <Icon
                            size={17}
                            strokeWidth={1.8}
                            style={
                              !isActive && l.accent
                                ? { color: l.accent }
                                : undefined
                            }
                          />
                        </div>
                        <span
                          className={`text-[22px] font-bold tracking-tight transition-colors ${
                            isActive ? "text-black" : "text-gray-300 hover:text-gray-600"
                          }`}
                        >
                          {l.label}
                        </span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-2 h-2 rounded-full bg-[#c9a84c]"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mt-10 space-y-3"
              >
                <Link
                  href="/academy/enquire"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-[#c9a84c] hover:text-black transition-all duration-300"
                >
                  Join the Academy
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-full py-4 rounded-xl text-sm font-semibold uppercase tracking-widest text-gray-400 border border-gray-200 hover:border-gray-400 hover:text-gray-600 transition-all"
                >
                  Sign In
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-10 flex items-center gap-2"
              >
                <div className="w-4 h-4">
                  <ChessPattern className="w-full h-full text-gray-200" />
                </div>
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-300">
                  Ghana&apos;s Premier Chess Platform
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
