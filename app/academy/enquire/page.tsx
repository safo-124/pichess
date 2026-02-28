"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { submitAcademyLead } from "@/lib/actions/academy";

export default function EnquirePage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    try {
      await submitAcademyLead(fd);
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch { setStatus("error"); }
  }

  const programs = ["Junior Chess Program", "Intermediate Training", "Advanced Coaching", "Weekend Intensive", "Not Sure Yet"];

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <AnimatedSection className="text-center mb-10">
          <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest">Academy</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-2 mb-3">Enquire Now</h1>
          <p className="text-white/40">
            Tell us about yourself and we&apos;ll get back to you within 24 hours with the perfect program for you.
          </p>
        </AnimatedSection>

        {status === "success" ? (
          <AnimatedSection>
            <div className="rounded-2xl border border-[#c9a84c]/30 bg-zinc-900 p-12 text-center animate-border-glow">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-black text-white mb-2">Enquiry Received!</h2>
              <p className="text-white/50">A coach will contact you within 24 hours. Get ready to make your move!</p>
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedSection delay={0.1}>
            <div className="rounded-2xl border border-[#c9a84c]/20 bg-zinc-900 p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Full Name *</label>
                    <input name="name" type="text" required placeholder="e.g. Kofi Mensah"
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Email *</label>
                    <input name="email" type="email" required placeholder="you@example.com"
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Phone Number</label>
                  <input name="phone" type="tel" placeholder="+233 XX XXX XXXX"
                    className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Program of Interest</label>
                  <select name="program"
                    className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors appearance-none">
                    <option value="">Select a program</option>
                    {programs.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Message</label>
                  <textarea name="message" rows={4} placeholder="Tell us about your chess experience and goals..."
                    className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors resize-none" />
                </div>

                <motion.button
                  type="submit"
                  disabled={status === "loading"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-full bg-[#c9a84c] hover:bg-[#dbb95d] text-black font-black text-base transition-colors disabled:opacity-60"
                >
                  {status === "loading" ? "Submitting..." : "Submit Enquiry →"}
                </motion.button>

                {status === "error" && (
                  <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
                )}
              </form>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
