"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────── */

interface TournamentInfo {
  id: number;
  title: string;
  date: string;
  location: string;
  venue: string | null;
  type: string;
  maxSpots: number | null;
  registeredCount: number;
  flyer: string | null;
}

interface Props {
  tournament: TournamentInfo;
  onClose: () => void;
}

/* ────────────────────────────────────────────────────────
   Registration Form Modal
   ──────────────────────────────────────────────────────── */

export default function RegistrationForm({ tournament, onClose }: Props) {
  const [step, setStep] = useState<"form" | "submitting" | "success" | "error">("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [regStatus, setRegStatus] = useState("");
  const [spotsLeft, setSpotsLeft] = useState<number | null>(null);

  const spotsRemaining = tournament.maxSpots
    ? Math.max(0, tournament.maxSpots - tournament.registeredCount)
    : null;

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStep("submitting");
      setErrorMsg("");

      const form = e.currentTarget;
      const data = {
        tournamentId: tournament.id,
        fullName: (form.elements.namedItem("fullName") as HTMLInputElement).value,
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
        phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
        whatsApp: (form.elements.namedItem("whatsApp") as HTMLInputElement).value || undefined,
        age: (form.elements.namedItem("age") as HTMLInputElement).value || undefined,
        rating: (form.elements.namedItem("rating") as HTMLInputElement).value || undefined,
        notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value || undefined,
      };

      try {
        const res = await fetch("/api/tournament-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
          setErrorMsg(result.error || "Registration failed");
          setStep("error");
          return;
        }

        setRegStatus(result.registration.status);
        setSpotsLeft(result.registration.spotsLeft);
        setStep("success");
      } catch {
        setErrorMsg("Network error. Please try again.");
        setStep("error");
      }
    },
    [tournament.id]
  );

  const eventDate = new Date(tournament.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0f1628] border border-white/[0.08] shadow-2xl shadow-black/50"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/70 transition-all"
          >
            ✕
          </button>

          {/* Header */}
          <div className="relative px-8 pt-8 pb-6 border-b border-white/[0.06]">
            {tournament.flyer && (
              <div className="absolute inset-0 overflow-hidden rounded-t-3xl">
                <img src={tournament.flyer} alt="" className="w-full h-full object-cover opacity-10 blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f1628]/60 to-[#0f1628]" />
              </div>
            )}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-300 uppercase tracking-wider">
                  {tournament.type === "EVENT" ? "🎪 Event" : "🏆 Tournament"}
                </span>
                {spotsRemaining !== null && (
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    spotsRemaining <= 5
                      ? "bg-red-500/15 border border-red-500/25 text-red-300"
                      : "bg-emerald-500/15 border border-emerald-500/25 text-emerald-300"
                  }`}>
                    {spotsRemaining === 0 ? "Waitlist Only" : `${spotsRemaining} spot${spotsRemaining !== 1 ? "s" : ""} left`}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-white leading-tight">{tournament.title}</h2>
              <div className="flex items-center gap-4 mt-2 text-white/35 text-xs">
                <span>📅 {eventDate}</span>
                <span>📍 {tournament.location}</span>
              </div>
            </div>
          </div>

          {/* Content based on step */}
          <div className="p-8">
            {step === "form" && (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5 block">
                    Full Name *
                  </label>
                  <input
                    name="fullName"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/30 outline-none transition-all"
                    placeholder="Your full name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5 block">
                      Email *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/30 outline-none transition-all"
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5 block">
                      Phone *
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/30 outline-none transition-all"
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5 block">
                    WhatsApp Number <span className="text-white/20">(if different)</span>
                  </label>
                  <input
                    name="whatsApp"
                    type="tel"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/30 outline-none transition-all"
                    placeholder="Same as phone if left empty"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5 block">
                      Age <span className="text-white/20">(optional)</span>
                    </label>
                    <input
                      name="age"
                      type="number"
                      min={4}
                      max={120}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/30 outline-none transition-all"
                      placeholder="e.g. 14"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5 block">
                      Chess Rating <span className="text-white/20">(optional)</span>
                    </label>
                    <input
                      name="rating"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/30 outline-none transition-all"
                      placeholder="e.g. 1200 FIDE"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5 block">
                    Notes <span className="text-white/20">(optional)</span>
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/30 outline-none transition-all resize-none"
                    placeholder="Any additional info, dietary needs, etc."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black text-sm font-black hover:from-amber-300 hover:to-orange-400 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/20 active:scale-[0.98]"
                >
                  {spotsRemaining === 0 ? "Join Waitlist" : "Register Now"} →
                </button>

                <p className="text-center text-white/15 text-[11px] mt-2">
                  You&apos;ll receive confirmation via email and WhatsApp
                </p>
              </motion.form>
            )}

            {step === "submitting" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
                </div>
                <p className="text-white/50 text-sm font-medium">Processing your registration...</p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6 space-y-6"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <span className="text-4xl">
                    {regStatus === "WAITLISTED" ? "⏳" : "📋"}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">
                    {regStatus === "WAITLISTED" ? "You're on the Waitlist!" : "Registration Received!"}
                  </h3>
                  <p className="text-white/40 text-sm mt-2 max-w-sm mx-auto">
                    {regStatus === "WAITLISTED"
                      ? "The event is full, but we've added you to the waitlist. We'll notify you if a spot opens up."
                      : "Your registration is pending review. You'll receive a WhatsApp confirmation message once approved by our team."}
                  </p>
                  {spotsLeft !== null && spotsLeft > 0 && (
                    <p className="text-amber-400/60 text-xs mt-2">
                      🎯 {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining
                    </p>
                  )}
                </div>

                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
                  <p className="text-amber-300 text-xs font-semibold">
                    📱 Keep an eye on your WhatsApp — we&apos;ll send you a confirmation once your registration is approved!
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 text-sm font-semibold transition-all"
                >
                  Close
                </button>
              </motion.div>
            )}

            {step === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <span className="text-3xl">😕</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Registration Failed</h3>
                  <p className="text-red-400/70 text-sm mt-2">{errorMsg}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("form")}
                    className="flex-1 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-sm font-bold transition-all"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 text-sm font-semibold transition-all"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
