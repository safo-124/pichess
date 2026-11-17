"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@/components/shared/BrandLogo";
import { buildLessonWhatsAppUrl } from "@/lib/whatsapp";
import {
  Menu,
  X,
  GraduationCap,
  Heart,
  Trophy,
  ShoppingBag,
  Users,
  Phone,
  Home,
  ArrowRight,
  Lightbulb,
  BookOpen,
  MessageCircle,
} from "lucide-react";

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Academy", href: "/academy" },
  { label: "Tournaments", href: "/tournaments" },
  { label: "Shop", href: "/shop" },
  { label: "Foundation", href: "/ngo" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const academySubLinks = [
  { label: "Academy Home", href: "/academy" },
  { label: "Lesson Programs", href: "/academy/lessons" },
  { label: "Our Coaches", href: "/academy/team" },
  { label: "Reviews", href: "/academy#testimonials" },
];

const ngoSubLinks = [
  { label: "Foundation Home", href: "/ngo" },
  { label: "Our Mission", href: "/ngo/mission" },
  { label: "Programs", href: "/ngo/programs" },
  { label: "Stories", href: "/ngo/stories" },
  { label: "Volunteer", href: "/ngo/volunteer" },
  { label: "Partner", href: "/ngo/apply" },
  { label: "Donate", href: "/ngo/donate" },
];

const mobileDrawerLinks = [
  { label: "Home", subtitle: "Start here", href: "/", icon: Home },
  { label: "Academy", subtitle: "Classes & coaches", href: "/academy", icon: GraduationCap },
  { label: "Lessons", subtitle: "Kids, adults & schools", href: "/academy/lessons", icon: BookOpen },
  { label: "Tournaments", subtitle: "Upcoming events", href: "/tournaments", icon: Trophy },
  { label: "Shop", subtitle: "Boards, clocks & gear", href: "/shop", icon: ShoppingBag },
  { label: "Foundation", subtitle: "Community impact", href: "/ngo", icon: Heart },
  { label: "Practice", subtitle: "Puzzles & tools", href: "/learning-tools", icon: Lightbulb },
  { label: "About", subtitle: "Our story", href: "/about", icon: Users },
  { label: "Contact", subtitle: "055 453 4646", href: "/contact", icon: Phone },
];

export default function MainNav({ logoUrl }: { logoUrl?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 24);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActiveLink = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const subLinks = pathname.startsWith("/academy")
    ? { items: academySubLinks, accent: "gold" as const }
    : pathname.startsWith("/ngo")
      ? { items: ngoSubLinks, accent: "green" as const }
      : null;

  const whatsAppHref = buildLessonWhatsAppUrl();

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 w-full px-3 pt-2.5 sm:pt-3"
        style={{ zIndex: 99999 }}
      >
        {/* Main unified nav bar */}
        <div
          className={`mx-auto max-w-7xl rounded-xl border transition-all duration-300 ${
            scrolled
              ? "border-gray-200/90 bg-white/95 shadow-[0_12px_36px_rgba(15,23,42,0.08)] backdrop-blur-xl"
              : "border-gray-200/60 bg-white/88 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur-md"
          }`}
        >
          <div className="px-3 sm:px-5">
            <div className="flex h-16 items-center justify-between gap-4">
              {/* Left: Brand Logo */}
              <Link href="/" className="focus-ring flex items-center shrink-0 rounded-lg">
                <BrandLogo logoUrl={logoUrl} size="sm" />
              </Link>

              {/* Center: Consistent Single-Color Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
                {primaryLinks.map((l) => {
                  const active = isActiveLink(l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={`focus-ring relative px-3 py-2 text-[13px] font-semibold tracking-tight rounded-lg transition-colors whitespace-nowrap ${
                        active
                          ? "text-gray-950 font-bold"
                          : "text-gray-600 hover:text-gray-950 hover:bg-gray-100/70"
                      }`}
                    >
                      {l.label}
                      {active && (
                        <motion.div
                          layoutId="activeNavUnderline"
                          className="absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-[#c9a84c]"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Right: Always-visible WhatsApp CTA + Mobile Menu Toggle */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={whatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-gray-950 hover:bg-[#c9a84c] text-white hover:text-gray-950 px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold tracking-tight shadow-sm transition-all whitespace-nowrap"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#25D366] shrink-0" />
                  <span>Start Lessons</span>
                </a>

                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  className="focus-ring lg:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 transition-colors"
                  aria-label="Toggle menu"
                >
                  {open ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contextual sub-navigation strip for Academy & Foundation */}
        {subLinks && (
          <div className="mx-auto mt-1.5 max-w-7xl">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar rounded-xl border border-gray-200/80 bg-white/92 px-3 py-1.5 shadow-sm backdrop-blur-md">
              <span
                className={`hidden sm:inline-block shrink-0 text-[10px] font-black uppercase tracking-widest px-2 ${
                  subLinks.accent === "green" ? "text-[#2e7d5b]" : "text-[#a77d1b]"
                }`}
              >
                {subLinks.accent === "green" ? "Foundation" : "Academy"}:
              </span>
              {subLinks.items.map((item) => {
                const isExact = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all whitespace-nowrap ${
                      isExact
                        ? subLinks.accent === "green"
                          ? "bg-[#2e7d5b] text-white shadow-sm"
                          : "bg-[#c9a84c] text-gray-950 font-bold shadow-sm"
                        : "text-gray-600 hover:text-gray-950 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Mobile fullscreen drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 lg:hidden"
            style={{ zIndex: 100000 }}
          >
            <div className="absolute inset-0 bg-[#07111f]" />
            <div className="relative h-[100dvh] overflow-y-auto px-3 py-3">
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="relative min-h-full rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#07111f]/80 p-3">
                  <Link href="/" onClick={() => setOpen(false)} className="rounded-lg">
                    <BrandLogo logoUrl={logoUrl} tone="dark" size="sm" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="mt-4 grid grid-cols-2 gap-2.5">
                  {mobileDrawerLinks.map((l) => {
                    const Icon = l.icon;
                    const active = pathname === l.href;
                    return (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={`flex min-h-[88px] flex-col justify-between rounded-2xl border p-3.5 transition-all ${
                          active
                            ? "border-[#c9a84c] bg-[#c9a84c] text-gray-950"
                            : "border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.1]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon size={18} className={active ? "text-gray-950" : "text-[#d8bb62]"} />
                          <ArrowRight size={14} className={active ? "text-gray-950" : "text-white/40"} />
                        </div>
                        <div>
                          <span className="block text-base font-black leading-tight">{l.label}</span>
                          <span className={`block text-[11px] mt-0.5 ${active ? "text-gray-950/75" : "text-white/50"}`}>
                            {l.subtitle}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-4">
                  <a
                    href={whatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex min-h-14 w-full items-center justify-between rounded-2xl bg-[#25D366] px-5 text-sm font-black text-gray-950 shadow-lg"
                  >
                    <span className="flex items-center gap-2.5">
                      <MessageCircle className="h-5 w-5" />
                      Chat on WhatsApp — Start Lessons
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
