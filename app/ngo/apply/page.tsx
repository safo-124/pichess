"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { submitNGOApplication } from "@/lib/actions/ngo";

export default function ApplyPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    try {
      await submitNGOApplication(fd);
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch { setStatus("error"); }
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <AnimatedSection className="text-center mb-10">
          <span className="text-xs font-semibold text-[#2e7d5b] uppercase tracking-widest">Foundation</span>
          <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 mt-2 mb-3">Apply for Support</h1>
          <p className="text-zinc-500">
            If you or your child needs chess support, apply here. We review every application with care.
          </p>
        </AnimatedSection>

        {status === "success" ? (
          <AnimatedSection>
            <div className="rounded-2xl border border-[#2e7d5b]/20 bg-[#d4ede3] p-12 text-center animate-border-glow-green">
              <div className="text-6xl mb-4">🌱</div>
              <h2 className="text-2xl font-black text-zinc-900 mb-2">Application Received!</h2>
              <p className="text-zinc-500">We&apos;ll review your application and get back to you within a week. Thank you for reaching out!</p>
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedSection delay={0.1}>
            <div className="rounded-2xl border border-[#2e7d5b]/20 bg-white shadow-sm p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Full Name *</label>
                    <input name="name" type="text" required
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 text-sm focus:outline-none focus:border-[#2e7d5b]/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Email *</label>
                    <input name="email" type="email" required
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 text-sm focus:outline-none focus:border-[#2e7d5b]/50 transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Phone</label>
                    <input name="phone" type="tel"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 text-sm focus:outline-none focus:border-[#2e7d5b]/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Age</label>
                    <input name="age" type="number" min="3" max="99"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 text-sm focus:outline-none focus:border-[#2e7d5b]/50 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Location / Community *</label>
                  <input name="location" type="text" required placeholder="e.g. Nima, Accra"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 text-sm focus:outline-none focus:border-[#2e7d5b]/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Why do you need support? *</label>
                  <textarea name="reason" rows={5} required placeholder="Tell us about your situation and how chess support would help..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 text-sm focus:outline-none focus:border-[#2e7d5b]/50 transition-colors resize-none" />
                </div>
                <motion.button
                  type="submit" disabled={status === "loading"}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-full bg-[#2e7d5b] hover:bg-[#3a9970] text-white font-black text-base transition-colors disabled:opacity-60"
                >
                  {status === "loading" ? "Submitting..." : "Submit Application →"}
                </motion.button>
                {status === "error" && <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>}
              </form>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
