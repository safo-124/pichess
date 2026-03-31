"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

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
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/30 outline-none transition-all";
const labelCls =
  "text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5 block";

export default function InlineRegistrationForm({ tournament }: Props) {
  const [step, setStep] = useState<"form" | "submitting" | "success" | "error">("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [regStatus, setRegStatus] = useState("");

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
        setStep("success");
      } catch {
        setErrorMsg("Network error. Please try again.");
        setStep("error");
      }
    },
    [tournament.id]
  );

  if (step === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-8 text-center"
      >
        <span className="text-5xl mb-4 block">{regStatus === "WAITLISTED" ? "⏳" : "📋"}</span>
        <h3 className="text-xl font-bold text-white mb-2">
          {regStatus === "WAITLISTED" ? "You're on the Waitlist" : "Registration Received!"}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed mb-4">
          {regStatus === "WAITLISTED"
            ? "The event is currently full, but we'll notify you via WhatsApp if a spot opens up."
            : "Your registration is pending review by our team. You'll receive a WhatsApp confirmation message once approved."}
        </p>
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
          <p className="text-amber-300 text-xs font-semibold">
            📱 Keep an eye on your WhatsApp for the confirmation message from PiChess!
          </p>
        </div>
        <button
          onClick={() => { setStep("form"); setRegStatus(""); }}
          className="mt-6 px-5 py-2.5 rounded-xl bg-white/10 text-white/60 text-sm font-semibold hover:bg-white/15 transition-colors"
        >
          Register Another Person
        </button>
      </motion.div>
    );
  }

  if (step === "error") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/[0.04] border border-red-500/20 p-8 text-center"
      >
        <span className="text-4xl mb-3 block">❌</span>
        <h3 className="text-lg font-bold text-white mb-2">Registration Failed</h3>
        <p className="text-white/50 text-sm mb-4">{errorMsg}</p>
        <button
          onClick={() => setStep("form")}
          className="px-5 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 text-sm font-semibold hover:bg-amber-500/30 transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6"
    >
      <h3 className="text-lg font-bold text-white mb-1">Register Now</h3>
      <p className="text-white/30 text-xs mb-6">Fill in your details below. Your registration will be reviewed and confirmed via WhatsApp.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Full Name *</label>
          <input name="fullName" required className={inputCls} placeholder="Your full name" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Email *</label>
            <input name="email" type="email" required className={inputCls} placeholder="you@email.com" />
          </div>
          <div>
            <label className={labelCls}>Phone *</label>
            <input name="phone" type="tel" required className={inputCls} placeholder="+233 XX XXX XXXX" />
          </div>
        </div>

        <div>
          <label className={labelCls}>WhatsApp Number <span className="text-white/20">(if different)</span></label>
          <input name="whatsApp" type="tel" className={inputCls} placeholder="Same as phone if left blank" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Age</label>
            <input name="age" type="number" min={3} max={99} className={inputCls} placeholder="e.g. 12" />
          </div>
          <div>
            <label className={labelCls}>Chess Rating</label>
            <input name="rating" className={inputCls} placeholder="e.g. 1200 or Beginner" />
          </div>
        </div>

        <div>
          <label className={labelCls}>Notes / Message</label>
          <textarea name="notes" rows={2} className={`${inputCls} resize-none`} placeholder="Anything else you'd like us to know?" />
        </div>

        <button
          type="submit"
          disabled={step === "submitting"}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === "submitting" ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting…
            </span>
          ) : (
            "Submit Registration"
          )}
        </button>

        <p className="text-center text-white/20 text-[10px]">
          Your registration will be reviewed by our team before confirmation.
        </p>
      </form>
    </motion.div>
  );
}
