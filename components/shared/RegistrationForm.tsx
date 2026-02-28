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
  const [whatsAppLinks, setWhatsAppLinks] = useState<{ userLink: string; adminLink: string } | null>(null);
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
        setWhatsAppLinks(result.whatsApp);
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
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <span className="text-4xl">
                    {regStatus === "WAITLISTED" ? "⏳" : "🎉"}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">
                    {regStatus === "WAITLISTED" ? "You're on the Waitlist!" : "Registration Confirmed!"}
                  </h3>
                  <p className="text-white/40 text-sm mt-2 max-w-sm mx-auto">
                    {regStatus === "WAITLISTED"
                      ? "The event is full, but we've added you to the waitlist. We'll notify you if a spot opens up."
                      : "You're all set! We've sent a confirmation to your email."}
                  </p>
                  {spotsLeft !== null && spotsLeft > 0 && (
                    <p className="text-amber-400/60 text-xs mt-2">
                      🎯 {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining
                    </p>
                  )}
                </div>

                {/* WhatsApp confirmation buttons */}
                {whatsAppLinks && (
                  <div className="space-y-2.5">
                    <p className="text-white/25 text-[11px] uppercase tracking-wider font-semibold">
                      Confirm via WhatsApp
                    </p>
                    <a
                      href={whatsAppLinks.userLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-[#25D366] text-sm font-bold transition-all hover:scale-[1.02]"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Send Yourself a Confirmation
                    </a>
                    <a
                      href={whatsAppLinks.adminLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 text-xs font-semibold transition-all"
                    >
                      📱 Notify PiChess Admin via WhatsApp
                    </a>
                  </div>
                )}

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
