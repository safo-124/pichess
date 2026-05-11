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

  const NavLink = ({ l }: { l: typeof allLinks[number] }) => {
    const isActive = pathname === l.href;
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
                <span className="text-[10px] font-bold tracking-normal uppercase text-[#c9a84c]">
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
                          className={`text-[22px] font-bold tracking-normal transition-colors ${
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

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
