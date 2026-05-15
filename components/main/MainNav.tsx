"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@/components/shared/BrandLogo";
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
  Lightbulb,
  Compass,
  MessageCircle,
} from "lucide-react";

const leftLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Academy", href: "/academy", icon: GraduationCap, accent: "#c9a84c" },
  { label: "Foundation", href: "/ngo", icon: Heart, accent: "#2e7d5b" },
  { label: "Tournaments", href: "/tournaments", icon: Trophy },
];

const rightLinks = [
  { label: "Learn", href: "/learning-tools", icon: Lightbulb, accent: "#8b5cf6" },
  { label: "Shop", href: "/shop", icon: ShoppingBag, accent: "#d97706" },
  { label: "News", href: "/news", icon: Newspaper },
  { label: "About", href: "/about", icon: Users },
  { label: "Contact", href: "/contact", icon: Phone },
];

const allLinks = [...leftLinks, ...rightLinks];

const mobileSubtitles: Record<string, string> = {
  "/": "Start",
  "/academy": "Training",
  "/ngo": "Impact",
  "/tournaments": "Events",
  "/learning-tools": "Practice",
  "/shop": "Gear",
  "/news": "Stories",
  "/about": "Team",
  "/contact": "Connect",
};

export default function MainNav({ logoUrl }: { logoUrl?: string }) {
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

  const isActiveLink = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  const NavLink = ({ l }: { l: typeof allLinks[number] }) => {
    const isActive = isActiveLink(l.href);
    return (
      <Link
        key={l.href}
        href={l.href}
        onMouseEnter={() => setHovered(l.href)}
        onMouseLeave={() => setHovered(null)}
        className="focus-ring relative px-3 py-2 text-[13px] font-semibold tracking-normal uppercase group"
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
              ? "text-gray-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
          style={!isActive && l.accent ? { color: l.accent } : undefined}
        >
          {l.label}
        </span>

        {/* Animated underline */}
        {isActive ? (
          <motion.div
            layoutId="activeUnderline"
            className={`absolute bottom-0 left-3 right-3 h-[2px] ${
              scrolled ? "bg-[#c9a84c]" : "bg-gray-900"
            }`}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        ) : hovered === l.href ? (
          <motion.div
            layoutId="hoverUnderline"
            className={`absolute bottom-0 left-3 right-3 h-[2px] ${
              scrolled ? "bg-gray-300" : "bg-gray-300"
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
        className="fixed top-0 left-0 right-0 w-full px-3 pt-3"
        style={{ zIndex: 99999 }}
      >
        {/* Main nav bar */}
        <motion.div
          animate={{
            backgroundColor: scrolled ? "rgba(255,255,255,0.94)" : "rgba(255,255,255,0.76)",
          }}
          transition={{ duration: 0.4 }}
          className={`mx-auto max-w-7xl rounded-lg border transition-all duration-500 ${
            scrolled
              ? "border-black/10 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl"
              : "border-white/70 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-md"
          }`}
        >
          <div className="px-3 sm:px-4 lg:px-5">
            <div className="flex items-center justify-between h-16 lg:justify-center relative">
              {/* Left nav (desktop) */}
              <nav className="hidden lg:flex items-center gap-0.5 absolute left-0">
                {leftLinks.map((l) => (
                  <NavLink key={l.href} l={l} />
                ))}
              </nav>

              {/* Center Logo */}
              <Link href="/" className="focus-ring flex items-center gap-3 group relative rounded-lg">
                <BrandLogo logoUrl={logoUrl} />
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
                        className="focus-ring flex items-center gap-2 rounded-md bg-black px-4 py-2 text-xs font-bold uppercase tracking-normal text-white transition-all duration-300 hover:bg-[#c9a84c] hover:text-black whitespace-nowrap"
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
                className={`focus-ring lg:hidden absolute right-0 w-10 h-10 flex items-center justify-center rounded-md transition-all ${
                  scrolled ? "text-gray-900 hover:bg-gray-50" : "text-gray-900 hover:bg-gray-100"
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
          className={`mx-auto max-w-7xl h-[1px] transition-opacity duration-500 bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent ${
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
            transition={{ duration: 0.25 }}
            className="fixed inset-0 lg:hidden"
            style={{ zIndex: 100000 }}
          >
            {/* Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#07111f]"
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(201,168,76,0.22),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(46,125,91,0.18),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.14),transparent_34%)]" />
            <div
              className="absolute inset-0 opacity-[0.055]"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, rgba(255,255,255,.55) 25%, transparent 25%, transparent 75%, rgba(255,255,255,.55) 75%), linear-gradient(45deg, rgba(255,255,255,.55) 25%, transparent 25%, transparent 75%, rgba(255,255,255,.55) 75%)",
                backgroundPosition: "0 0, 18px 18px",
                backgroundSize: "36px 36px",
              }}
            />

            {/* Content */}
            <div className="relative h-[100dvh] overflow-y-auto px-3 py-3">
              <motion.div
                initial={{ opacity: 0, y: -18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative min-h-full overflow-hidden rounded-[2rem] border border-white/[0.12] bg-white/[0.08] shadow-2xl shadow-black/30 backdrop-blur-2xl"
              >
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/70 to-transparent" />
                <div className="absolute -right-16 top-24 h-48 w-48 rounded-full border border-[#c9a84c]/15" />
                <div className="absolute -right-8 top-32 h-24 w-24 rounded-full border border-white/10" />

                <div className="relative p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3 rounded-[1.35rem] border border-white/10 bg-[#07111f]/70 p-3 shadow-lg shadow-black/10">
                    <Link href="/" onClick={() => setOpen(false)} className="focus-ring rounded-lg">
                      <BrandLogo logoUrl={logoUrl} tone="dark" />
                    </Link>
                    <button
                      onClick={() => setOpen(false)}
                      className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-white transition-all hover:bg-white/[0.14]"
                      aria-label="Close menu"
                    >
                      <X size={22} strokeWidth={2} />
                    </button>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-[#c9a84c]/20 bg-[#c9a84c]/10 p-4">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#d8bb62]">
                        <Compass className="h-4 w-4" />
                        Explore PiChess
                      </div>
                      <p className="mt-2 text-2xl font-black leading-tight text-white">
                        Choose your next move.
                      </p>
                    </div>
                  </div>

                  <nav className="mt-4 grid grid-cols-2 gap-2.5">
                    {allLinks.map((l, i) => {
                      const Icon = l.icon;
                      const isActive = isActiveLink(l.href);
                      return (
                        <motion.div
                          key={l.href}
                          initial={{ opacity: 0, y: 18, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.08 + i * 0.035, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Link
                            href={l.href}
                            onClick={() => setOpen(false)}
                            aria-current={isActive ? "page" : undefined}
                            className={`group relative flex min-h-[104px] flex-col justify-between overflow-hidden rounded-[1.35rem] border p-3.5 transition-all active:scale-[0.98] ${
                              isActive
                                ? "border-[#d8bb62]/70 bg-[#d8bb62] text-gray-950 shadow-lg shadow-[#c9a84c]/20"
                                : "border-white/10 bg-white/[0.055] text-white hover:border-white/20 hover:bg-white/[0.09]"
                            }`}
                          >
                            <span
                              className={`absolute -right-5 -top-5 h-16 w-16 rounded-full transition-all ${
                                isActive ? "bg-white/25" : "bg-white/[0.035] group-hover:bg-white/[0.06]"
                              }`}
                            />
                            <div className="relative flex items-center justify-between">
                              <span
                                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                                  isActive ? "bg-gray-950 text-white" : "bg-white/[0.08] text-white"
                                }`}
                              >
                                <Icon
                                  size={19}
                                  strokeWidth={1.9}
                                  style={!isActive && l.accent ? { color: l.accent } : undefined}
                                />
                              </span>
                              <ArrowRight
                                className={`h-4 w-4 transition-all ${
                                  isActive ? "text-gray-950" : "text-white/25 group-hover:translate-x-0.5 group-hover:text-white/60"
                                }`}
                              />
                            </div>
                            <div className="relative">
                              <span className={`block text-[11px] font-bold uppercase tracking-[0.18em] ${
                                isActive ? "text-gray-950/60" : "text-white/35"
                              }`}>
                                {mobileSubtitles[l.href]}
                              </span>
                              <span className="mt-1 block text-lg font-black leading-none tracking-tight">
                                {l.label}
                              </span>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.35 }}
                    className="mt-4 grid grid-cols-[1fr_auto] gap-2.5"
                  >
                    <Link
                      href="/academy/enquire"
                      onClick={() => setOpen(false)}
                      className="focus-ring flex min-h-14 items-center justify-between rounded-[1.35rem] bg-white px-4 text-sm font-black text-gray-950 shadow-lg shadow-black/15"
                    >
                      Join Academy
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setOpen(false)}
                      className="focus-ring flex h-14 w-14 items-center justify-center rounded-[1.35rem] border border-white/10 bg-white/[0.06] text-[#d8bb62]"
                      aria-label="Contact PiChess"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
