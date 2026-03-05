"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { submitNGOApplication } from "@/lib/actions/ngo";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const steps = [
  { id: 1, label: "Personal", icon: "👤" },
  { id: 2, label: "Chess", icon: "♟" },
  { id: 3, label: "Guardian", icon: "👨‍👩‍👦" },
  { id: 4, label: "Story", icon: "📝" },
];

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

const benefits = [
  { icon: "♟", title: "Free Equipment", desc: "Chess sets, boards, clocks & materials" },
  { icon: "🏫", title: "School Programs", desc: "Regular coaching at your school" },
  { icon: "🎓", title: "Scholarships", desc: "Funded spots at PiChess Academy" },
  { icon: "🤝", title: "Mentorship", desc: "Paired with experienced players" },
];

const faqs = [
  { q: "Who can apply?", a: "Anyone aged 5-25 who wants to learn or improve their chess skills. We prioritise applicants from underserved communities." },
  { q: "Is there a fee?", a: "No. All PiChess Foundation programs are completely free. We cover equipment, coaching, and tournament fees." },
  { q: "How long until I hear back?", a: "We review applications weekly. You'll receive an email response within 7 working days." },
  { q: "What if I don't have equipment?", a: "Don't worry! If accepted, we provide everything you need — chess set, board, workbook, and clock." },
  { q: "Can a parent apply on behalf of a child?", a: "Absolutely. Fill in the child's details and your own in the guardian section." },
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

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

export default function ApplyPage() {
  const [step, setStep] = useState(1);
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

  const canNext = () => {
    if (step === 1) return form.name && form.email && form.phone;
    if (step === 2) return true;
    if (step === 3) return true;
    if (step === 4) return form.reason;
    return true;
  };

  async function handleSubmit() {
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
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80"
            alt="Children learning chess"
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
              PiChess Foundation
            </span>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
          >
            Apply for{" "}
            <span className="bg-gradient-to-r from-[#5cc99a] via-[#8ce8be] to-[#5cc99a] bg-clip-text text-transparent">
              Chess Support
            </span>
          </motion.h1>

          <motion.p
            className="max-w-xl mx-auto text-white/55 text-base sm:text-lg leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          >
            Every child deserves the chance to learn chess. Fill out our application and we&apos;ll match you with the right program — completely free.
          </motion.p>

          <motion.a
            href="#apply-form"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2e7d5b] hover:bg-[#3a9970] text-white font-bold text-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-[#2e7d5b]/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease }}
          >
            Start Application ↓
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

      {/* ──── WHAT YOU GET ──── */}
      <section className="py-16 sm:py-20 bg-zinc-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2e7d5b]/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-4">
          <AnimSection className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-3">
              What You Get
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 tracking-tight">
              Free Support, Real Impact
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

      {/* ──── APPLICATION FORM ──── */}
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
                {/* Success animation */}
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
                  Application Received!
                </motion.h2>
                <motion.p
                  className="text-zinc-500 max-w-md mx-auto mb-8 text-sm sm:text-base"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, ease }}
                >
                  We&apos;ll review your application and get back to you within 7 working days. Thank you for reaching out to PiChess Foundation!
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
                    Step {step} of {steps.length}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 tracking-tight">
                    Application Form
                  </h2>
                </div>

                {/* Step indicator */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 sm:mb-14">
                  {steps.map((s, i) => {
                    const isActive = s.id === step;
                    const isDone = s.id < step;
                    return (
                      <div key={s.id} className="flex items-center gap-2 sm:gap-4">
                        <motion.button
                          onClick={() => {
                            if (isDone || isActive) setStep(s.id);
                          }}
                          className={`relative flex flex-col items-center gap-1 sm:gap-2 ${isDone || isActive ? "cursor-pointer" : "cursor-default"}`}
                          whileHover={isDone || isActive ? { scale: 1.05 } : {}}
                          whileTap={isDone || isActive ? { scale: 0.95 } : {}}
                        >
                          <motion.div
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl transition-all duration-500 ${
                              isActive
                                ? "bg-[#2e7d5b] shadow-lg shadow-[#2e7d5b]/30 text-white"
                                : isDone
                                ? "bg-[#d4ede3] text-[#2e7d5b]"
                                : "bg-zinc-100 text-zinc-300"
                            }`}
                            layout
                            transition={{ duration: 0.4, ease }}
                          >
                            {isDone ? (
                              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-lg">✓</motion.span>
                            ) : (
                              s.icon
                            )}
                          </motion.div>
                          <span className={`text-[10px] sm:text-xs font-bold tracking-wide ${
                            isActive ? "text-[#2e7d5b]" : isDone ? "text-[#2e7d5b]/60" : "text-zinc-300"
                          }`}>
                            {s.label}
                          </span>
                        </motion.button>
                        {i < steps.length - 1 && (
                          <div className="relative w-8 sm:w-16 h-0.5 bg-zinc-100 rounded-full overflow-hidden -mt-4 sm:-mt-5">
                            <motion.div
                              className="absolute inset-y-0 left-0 bg-[#2e7d5b] rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: isDone ? "100%" : "0%" }}
                              transition={{ duration: 0.5, ease }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-zinc-100 rounded-full mb-10 sm:mb-14 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#2e7d5b] to-[#5cc99a] rounded-full"
                    animate={{ width: `${(step / steps.length) * 100}%` }}
                    transition={{ duration: 0.5, ease }}
                  />
                </div>

                {/* Form card */}
                <div className="bg-white rounded-3xl border-2 border-zinc-100 shadow-sm p-6 sm:p-10">
                  <AnimatePresence mode="wait">
                    {/* ── Step 1: Personal ── */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.4, ease }}
                        className="space-y-5"
                      >
                        <div className="mb-6">
                          <h3 className="text-lg sm:text-xl font-black text-zinc-900 mb-1">Personal Information</h3>
                          <p className="text-zinc-400 text-sm">Tell us about the applicant.</p>
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className={labelCls}>Phone Number *</label>
                            <input value={form.phone} onChange={set("phone")} type="tel" placeholder="024 XXXX XXX" className={inputCls} required />
                          </div>
                          <div>
                            <label className={labelCls}>Age</label>
                            <input value={form.age} onChange={set("age")} type="number" min="3" max="99" placeholder="e.g. 12" className={inputCls} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className={labelCls}>Location / Community</label>
                            <input value={form.location} onChange={set("location")} placeholder="e.g. Nima, Accra" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Region</label>
                            <select value={form.region} onChange={set("region")} className={inputCls}>
                              <option value="">Select region</option>
                              {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ── Step 2: Chess ── */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.4, ease }}
                        className="space-y-5"
                      >
                        <div className="mb-6">
                          <h3 className="text-lg sm:text-xl font-black text-zinc-900 mb-1">Chess Background</h3>
                          <p className="text-zinc-400 text-sm">Help us understand your chess experience.</p>
                        </div>

                        <div>
                          <label className={labelCls}>School / Institution</label>
                          <input value={form.school} onChange={set("school")} placeholder="e.g. Accra Academy" className={inputCls} />
                        </div>

                        <div>
                          <label className={labelCls}>Chess Level</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
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
                      </motion.div>
                    )}

                    {/* ── Step 3: Guardian ── */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.4, ease }}
                        className="space-y-5"
                      >
                        <div className="mb-6">
                          <h3 className="text-lg sm:text-xl font-black text-zinc-900 mb-1">Guardian Details</h3>
                          <p className="text-zinc-400 text-sm">If the applicant is under 18, please provide a guardian&apos;s contact details.</p>
                        </div>

                        <div className="rounded-2xl bg-[#2e7d5b]/5 border border-[#2e7d5b]/10 p-4 sm:p-5 flex items-start gap-3 mb-2">
                          <span className="text-lg mt-0.5">ℹ️</span>
                          <p className="text-[#2e7d5b] text-sm leading-relaxed">
                            Guardian details are optional but recommended for applicants under 18. This helps us communicate effectively.
                          </p>
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
                      </motion.div>
                    )}

                    {/* ── Step 4: Story ── */}
                    {step === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.4, ease }}
                        className="space-y-5"
                      >
                        <div className="mb-6">
                          <h3 className="text-lg sm:text-xl font-black text-zinc-900 mb-1">Your Story</h3>
                          <p className="text-zinc-400 text-sm">Tell us why you need support and how chess can change your life.</p>
                        </div>

                        <div>
                          <label className={labelCls}>Why do you need support? *</label>
                          <textarea
                            value={form.reason}
                            onChange={set("reason")}
                            rows={4}
                            placeholder="Tell us about your situation and how chess support would help..."
                            className={`${inputCls} resize-none`}
                            required
                          />
                        </div>

                        <div>
                          <label className={labelCls}>Personal Essay (Optional)</label>
                          <textarea
                            value={form.essay}
                            onChange={set("essay")}
                            rows={4}
                            placeholder="Share your chess journey, dreams, or how chess has impacted you..."
                            className={`${inputCls} resize-none`}
                          />
                        </div>

                        {/* Review summary */}
                        <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-5 sm:p-6 mt-4">
                          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Application Summary</h4>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            {[
                              ["Name", form.name],
                              ["Email", form.email],
                              ["Phone", form.phone],
                              ["Age", form.age],
                              ["Region", form.region],
                              ["School", form.school],
                              ["Level", form.chess_level],
                              ["Guardian", form.guardian_name],
                            ].map(([label, val]) => (
                              <div key={label}>
                                <span className="text-zinc-400 text-xs">{label}</span>
                                <p className="font-semibold text-zinc-700 truncate">{val || "—"}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation buttons */}
                  <div className="flex items-center justify-between mt-8 sm:mt-10 pt-6 border-t border-zinc-100">
                    {step > 1 ? (
                      <motion.button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="flex items-center gap-2 px-5 py-3 rounded-full border-2 border-zinc-200 text-zinc-600 text-sm font-bold hover:border-[#2e7d5b] hover:text-[#2e7d5b] transition-all duration-300"
                        whileHover={{ x: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                        Back
                      </motion.button>
                    ) : (
                      <div />
                    )}

                    {step < 4 ? (
                      <motion.button
                        type="button"
                        onClick={() => canNext() && setStep(step + 1)}
                        disabled={!canNext()}
                        className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#2e7d5b] text-white text-sm font-bold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#3a9970] hover:scale-105 active:scale-95 shadow-lg shadow-[#2e7d5b]/20"
                        whileHover={canNext() ? { x: 2 } : {}}
                        whileTap={canNext() ? { scale: 0.95 } : {}}
                      >
                        Continue
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      </motion.button>
                    ) : (
                      <motion.button
                        type="button"
                        onClick={handleSubmit}
                        disabled={status === "loading" || !canNext()}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2e7d5b] text-white text-sm font-bold transition-all duration-300 disabled:opacity-50 hover:bg-[#3a9970] hover:scale-105 active:scale-95 shadow-lg shadow-[#2e7d5b]/20"
                        whileHover={canNext() ? { scale: 1.05 } : {}}
                        whileTap={canNext() ? { scale: 0.95 } : {}}
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
                    )}
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
                </div>
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
              ♟
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-3 tracking-tight">
              Not ready to apply yet?
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base max-w-md mx-auto mb-8">
              Explore our programs or get in touch — we&apos;re always here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/ngo/programs"
                className="px-6 py-3 rounded-full bg-[#2e7d5b] text-white font-bold text-sm hover:bg-[#3a9970] transition-all hover:scale-105 shadow-lg shadow-[#2e7d5b]/20"
              >
                View Programs
              </Link>
              <Link
                href="/ngo"
                className="px-6 py-3 rounded-full border-2 border-zinc-200 text-zinc-600 font-bold text-sm hover:border-[#2e7d5b] hover:text-[#2e7d5b] transition-all"
              >
                Back to Foundation
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full border-2 border-zinc-200 text-zinc-600 font-bold text-sm hover:border-[#2e7d5b] hover:text-[#2e7d5b] transition-all"
              >
                Contact Us
              </Link>
            </div>
          </AnimSection>
        </div>
      </section>
    </div>
  );
}
