"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { submitNGOApplication } from "@/lib/actions/ngo";
import type { NGOApplyContent } from "@/lib/ngo-content";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const regions = [
  "Greater Accra", "Ashanti", "Central", "Western", "Eastern",
  "Northern", "Volta", "Bono", "Upper East", "Upper West",
  "Oti", "Savannah", "Bono East", "Ahafo", "Western North", "North East",
];

const chessLevels = [
  { value: "beginner", label: "Beginner", desc: "I'm new to chess" },
  { value: "intermediate", label: "Intermediate", desc: "I know the rules and basic strategy" },
  { value: "advanced", label: "Advanced", desc: "I play competitively / rated" },
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

interface PartnerData { id: number; name: string; logo: string | null; website: string | null }

function AnimSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const inputCls =
  "w-full bg-white border-2 border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 text-sm font-medium placeholder:text-zinc-300 focus:outline-none focus:border-[#2e7d5b] focus:ring-4 focus:ring-[#2e7d5b]/10 transition-all duration-300";
const labelCls = "block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2.5";

/* ═══════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════ */

export default function ApplyPage({ content, partners = [] }: { content: NGOApplyContent; partners?: PartnerData[] }) {
  const { benefits, faqs, bottomCta, impactGallery } = content;
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form data
  const [form, setForm] = useState({
    name: "", email: "", phone: "", age: "", location: "",
    region: "", school: "", chess_level: "", guardian_name: "",
    guardian_phone: "", reason: "", essay: "",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const canSubmit = form.name && form.email && form.phone && form.reason;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, v));
    try {
      const res = await submitNGOApplication(fd);
      if (res?.error) { setStatus("error"); return; }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-white text-zinc-900 overflow-x-hidden">

      {/* ──── HERO ──── */}
      <section className="relative min-h-[50vh] sm:min-h-[55vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={content.heroImage}
            alt="Partner with PiChess"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/75" />
          <div className="absolute inset-0 bg-[#2e7d5b]/15" />
        </div>

        {/* Floating chess pieces */}
        <motion.div
          className="absolute top-[20%] left-[8%] text-5xl sm:text-6xl opacity-15 text-white pointer-events-none"
          animate={{ y: [0, -15, 0], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >♟</motion.div>
        <motion.div
          className="absolute top-[15%] right-[10%] text-4xl sm:text-5xl opacity-10 text-white pointer-events-none"
          animate={{ y: [0, -12, 0], rotate: [0, -6, 6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >♝</motion.div>
        <motion.div
          className="absolute bottom-[25%] right-[15%] text-5xl opacity-10 text-white pointer-events-none"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >♛</motion.div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/80 text-xs font-bold uppercase tracking-[0.2em] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#5cc99a] animate-pulse" />
              {content.heroBadge}
            </span>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
          >
            {content.heading.split(/\s(?=\S+$)/).map((part, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="bg-gradient-to-r from-[#5cc99a] via-[#8ce8be] to-[#5cc99a] bg-clip-text text-transparent">
                  {part}
                </span>
              ) : (
                <span key={i}>{part} </span>
              )
            )}
          </motion.h1>

          <motion.p
            className="max-w-xl mx-auto text-white/55 text-base sm:text-lg leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          >
            {content.subtitle}
          </motion.p>

          <motion.a
            href="#apply-form"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2e7d5b] hover:bg-[#3a9970] text-white font-bold text-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-[#2e7d5b]/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease }}
          >
            {content.ctaButtonText}
          </motion.a>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/25 flex justify-center">
            <motion.div className="w-1 h-2.5 rounded-full bg-white/40 mt-1.5"
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ──── PARTNERS MARQUEE ──── */}
      {partners.length > 0 && (
        <section className="py-10 bg-white border-b border-zinc-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
            <p className="text-zinc-300 text-[10px] font-bold uppercase tracking-[0.3em]">Trusted By</p>
          </div>
          <div className="relative">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...partners, ...partners].map((p, i) => (
                <div key={`${p.id}-${i}`} className="flex-shrink-0 mx-8 sm:mx-12 flex items-center gap-3">
                  {p.logo ? (
                    <img src={p.logo} alt={p.name} className="h-10 sm:h-14 object-contain transition-opacity hover:opacity-80 duration-500" />
                  ) : (
                    <span className="text-zinc-600 text-base font-bold hover:text-zinc-900 transition-colors duration-500">{p.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──── WHAT YOU GET ──── */}
      <section className="py-16 sm:py-20 bg-zinc-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2e7d5b]/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-4">
          <AnimSection className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-3">
              {content.benefitsBadge}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 tracking-tight">
              {content.benefitsHeading}
            </h2>
          </AnimSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((b, i) => (
              <AnimSection key={b.title} delay={i * 0.1}>
                <motion.div
                  className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-zinc-100 text-center shadow-sm hover:shadow-lg transition-all duration-500 h-full"
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <motion.div
                    className="text-3xl sm:text-4xl mb-3 sm:mb-4"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
                  >
                    {b.icon}
                  </motion.div>
                  <h3 className="text-sm sm:text-base font-black text-zinc-900 mb-1">{b.title}</h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{b.desc}</p>
                </motion.div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ──── SEE WHAT YOUR MONEY IS DOING ──── */}
      {impactGallery && impactGallery.images?.length > 0 && (
        <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2e7d5b]/20 to-transparent" />

          <div className="max-w-7xl mx-auto px-4">
            <AnimSection className="text-center mb-10 sm:mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-3">
                <span className="w-2 h-2 rounded-full bg-[#2e7d5b] animate-pulse" />
                {impactGallery.badge}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 tracking-tight mb-3">
                {impactGallery.heading}
              </h2>
              <p className="text-zinc-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                {impactGallery.description}
              </p>
            </AnimSection>

            {/* Masonry-style grid — mobile: 2 cols, tablet: 3 cols, desktop: 4 cols */}
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
              {impactGallery.images.map((img, i) => (
                <AnimSection key={`${img.src}-${i}`} delay={i * 0.06}>
                  <motion.div
                    className="break-inside-avoid rounded-2xl sm:rounded-3xl overflow-hidden relative group cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <div className={`relative ${i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"}`}>
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-white text-xs sm:text-sm font-semibold leading-snug drop-shadow-lg line-clamp-2">{img.alt}</p>
                      </div>
                    </div>
                    {/* Subtle green border glow */}
                    <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-black/5 group-hover:ring-[#2e7d5b]/30 transition-all duration-500" />
                  </motion.div>
                </AnimSection>
              ))}
            </div>

            {/* Bottom accent */}
            <AnimSection delay={0.3} className="text-center mt-10 sm:mt-14">
              <p className="text-zinc-400 text-xs sm:text-sm font-medium">
                📸 Every picture tells a story of transformation
              </p>
            </AnimSection>
          </div>
        </section>
      )}

      {/* ──── APPLICATION FORM (single page) ──── */}
      <section id="apply-form" className="py-16 sm:py-24 bg-white relative">
        <div className="max-w-3xl mx-auto px-4">

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease }}
                className="text-center py-16"
              >
                <motion.div
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#d4ede3] mx-auto mb-8 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, ease }}
                >
                  <motion.div
                    className="text-5xl sm:text-6xl"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4, ease }}
                  >
                    🌱
                  </motion.div>
                </motion.div>

                <motion.h2
                  className="text-2xl sm:text-4xl font-black text-zinc-900 mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, ease }}
                >
                  {content.successHeading}
                </motion.h2>
                <motion.p
                  className="text-zinc-500 max-w-md mx-auto mb-8 text-sm sm:text-base"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, ease }}
                >
                  {content.successMessage}
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-3 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, ease }}
                >
                  <Link
                    href="/ngo/programs"
                    className="px-6 py-3 rounded-full bg-[#2e7d5b] text-white font-bold text-sm hover:bg-[#3a9970] transition-all hover:scale-105"
                  >
                    Explore Programs
                  </Link>
                  <Link
                    href="/ngo"
                    className="px-6 py-3 rounded-full border-2 border-zinc-200 text-zinc-600 font-bold text-sm hover:border-[#2e7d5b] hover:text-[#2e7d5b] transition-all"
                  >
                    Back to Foundation
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
                {/* Header */}
                <div className="text-center mb-10 sm:mb-14">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-3">
                    {content.formBadgePrefix}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 tracking-tight">
                    {content.formHeading}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl border-2 border-zinc-100 shadow-sm p-6 sm:p-10 space-y-8">

                  {/* ── Personal Information ── */}
                  <div>
                    <div className="mb-5">
                      <h3 className="text-base sm:text-lg font-black text-zinc-900 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-[#2e7d5b] text-white flex items-center justify-center text-sm">👤</span>
                        Personal Information
                      </h3>
                      <p className="text-zinc-400 text-sm mt-1 ml-10">Tell us about the applicant.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls}>Full Name *</label>
                        <input value={form.name} onChange={set("name")} placeholder="e.g. Kwame Asante" className={inputCls} required />
                      </div>
                      <div>
                        <label className={labelCls}>Email Address *</label>
                        <input value={form.email} onChange={set("email")} type="email" placeholder="kwame@example.com" className={inputCls} required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
                      <div>
                        <label className={labelCls}>Phone Number *</label>
                        <input value={form.phone} onChange={set("phone")} type="tel" placeholder="024 XXXX XXX" className={inputCls} required />
                      </div>
                      <div>
                        <label className={labelCls}>Age</label>
                        <input value={form.age} onChange={set("age")} type="number" min="3" max="99" placeholder="e.g. 12" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Region</label>
                        <select value={form.region} onChange={set("region")} className={inputCls}>
                          <option value="">Select region</option>
                          {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                      <div>
                        <label className={labelCls}>Location / Community</label>
                        <input value={form.location} onChange={set("location")} placeholder="e.g. Nima, Accra" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>School / Institution</label>
                        <input value={form.school} onChange={set("school")} placeholder="e.g. Accra Academy" className={inputCls} />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-zinc-100" />

                  {/* ── Chess Background ── */}
                  <div>
                    <div className="mb-5">
                      <h3 className="text-base sm:text-lg font-black text-zinc-900 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-[#2e7d5b] text-white flex items-center justify-center text-sm">♟</span>
                        Chess Background
                      </h3>
                      <p className="text-zinc-400 text-sm mt-1 ml-10">Help us understand your chess experience.</p>
                    </div>

                    <label className={labelCls}>Chess Level</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {chessLevels.map((level) => (
                        <motion.button
                          key={level.value}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, chess_level: level.value }))}
                          className={`relative rounded-2xl border-2 p-4 sm:p-5 text-left transition-all duration-300 ${
                            form.chess_level === level.value
                              ? "border-[#2e7d5b] bg-[#2e7d5b]/5 shadow-sm"
                              : "border-zinc-200 bg-white hover:border-zinc-300"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {form.chess_level === level.value && (
                            <motion.div
                              className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#2e7d5b] flex items-center justify-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3, ease }}
                            >
                              <span className="text-white text-[10px] font-bold">✓</span>
                            </motion.div>
                          )}
                          <div className="text-sm font-black text-zinc-900">{level.label}</div>
                          <div className="text-xs text-zinc-400 mt-1">{level.desc}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-zinc-100" />

                  {/* ── Guardian Details ── */}
                  <div>
                    <div className="mb-5">
                      <h3 className="text-base sm:text-lg font-black text-zinc-900 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-[#2e7d5b] text-white flex items-center justify-center text-sm">👨‍👩‍👦</span>
                        Guardian Details
                      </h3>
                      <p className="text-zinc-400 text-sm mt-1 ml-10">Optional — recommended for applicants under 18.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls}>Guardian&apos;s Name</label>
                        <input value={form.guardian_name} onChange={set("guardian_name")} placeholder="e.g. Ama Asante" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Guardian&apos;s Phone</label>
                        <input value={form.guardian_phone} onChange={set("guardian_phone")} type="tel" placeholder="024 XXXX XXX" className={inputCls} />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-zinc-100" />

                  {/* ── Your Story ── */}
                  <div>
                    <div className="mb-5">
                      <h3 className="text-base sm:text-lg font-black text-zinc-900 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-[#2e7d5b] text-white flex items-center justify-center text-sm">📝</span>
                        Your Story
                      </h3>
                      <p className="text-zinc-400 text-sm mt-1 ml-10">Tell us why you need support and how chess can change your life.</p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className={labelCls}>Why do you want to partner with us? *</label>
                        <textarea
                          value={form.reason}
                          onChange={set("reason")}
                          rows={4}
                          placeholder="Tell us about your goals and how a partnership would help..."
                          className={`${inputCls} resize-none`}
                          required
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Additional Information (Optional)</label>
                        <textarea
                          value={form.essay}
                          onChange={set("essay")}
                          rows={3}
                          placeholder="Share anything else you'd like us to know..."
                          className={`${inputCls} resize-none`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-zinc-400 text-xs">Fields marked with * are required</p>
                    <motion.button
                      type="submit"
                      disabled={status === "loading" || !canSubmit}
                      className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2e7d5b] text-white text-sm font-bold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#3a9970] hover:scale-105 active:scale-95 shadow-lg shadow-[#2e7d5b]/20"
                      whileHover={canSubmit ? { scale: 1.05 } : {}}
                      whileTap={canSubmit ? { scale: 0.95 } : {}}
                    >
                      {status === "loading" ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Submitting...
                        </>
                      ) : (
                        <>Submit Application 🌱</>
                      )}
                    </motion.button>
                  </div>

                  {status === "error" && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm text-center mt-4 font-medium"
                    >
                      Something went wrong. Please try again.
                    </motion.p>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ──── FAQ ──── */}
      <section className="py-16 sm:py-24 bg-zinc-50 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2e7d5b]/20 to-transparent" />
        <div className="max-w-3xl mx-auto px-4">
          <AnimSection className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-3">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 tracking-tight">
              Common Questions
            </h2>
          </AnimSection>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <AnimSection key={faq.q} delay={i * 0.08}>
                <motion.div
                  className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden"
                  layout
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 text-left"
                  >
                    <span className="font-bold text-zinc-900 text-sm sm:text-base pr-4">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2e7d5b]/10 flex items-center justify-center"
                    >
                      <span className="text-[#2e7d5b] font-bold text-lg leading-none">+</span>
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 text-zinc-500 text-sm leading-relaxed border-t border-zinc-100 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ──── BOTTOM CTA ──── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimSection>
            <motion.div
              className="text-4xl sm:text-5xl mb-5"
              animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              {bottomCta.icon}
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-3 tracking-tight">
              {bottomCta.heading}
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base max-w-md mx-auto mb-8">
              {bottomCta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {bottomCta.links.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    i === 0
                      ? "px-6 py-3 rounded-full bg-[#2e7d5b] text-white font-bold text-sm hover:bg-[#3a9970] transition-all hover:scale-105 shadow-lg shadow-[#2e7d5b]/20"
                      : "px-6 py-3 rounded-full border-2 border-zinc-200 text-zinc-600 font-bold text-sm hover:border-[#2e7d5b] hover:text-[#2e7d5b] transition-all"
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </AnimSection>
        </div>
      </section>
    </div>
  );
}
