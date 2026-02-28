"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { submitVolunteer } from "@/lib/actions/ngo";

export default function VolunteerPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitVolunteer(new FormData(e.currentTarget));
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch { setStatus("error"); }
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <AnimatedSection className="text-center mb-10">
          <span className="text-xs font-semibold text-[#2e7d5b] uppercase tracking-widest">Foundation</span>
          <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 mt-2 mb-3">Volunteer</h1>
          <p className="text-zinc-500">
            Share your passion, skills, and time to help us bring chess to more children across Ghana.
          </p>
        </AnimatedSection>

        {/* Benefits */}
        <AnimatedSection delay={0.05} className="grid grid-cols-3 gap-3 mb-10">
          {["Make Impact", "Learn & Grow", "Join Community"].map((b, i) => (
            <div key={b} className="rounded-xl bg-[#d4ede3] border border-[#2e7d5b]/15 p-4 text-center">
              <div className="text-2xl mb-1">{["❤️", "🌱", "🤝"][i]}</div>
              <p className="text-xs font-semibold text-zinc-700">{b}</p>
            </div>
          ))}
        </AnimatedSection>

        {status === "success" ? (
          <AnimatedSection>
            <div className="rounded-2xl border border-[#2e7d5b]/20 bg-[#d4ede3] p-12 text-center">
              <div className="text-6xl mb-4">🤲</div>
              <h2 className="text-2xl font-black text-zinc-900 mb-2">Thank You!</h2>
              <p className="text-zinc-500">Your volunteer application has been received. We&apos;ll reach out soon to discuss how you can contribute.</p>
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedSection delay={0.15}>
            <div className="rounded-2xl border border-[#2e7d5b]/20 bg-white shadow-sm p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Full Name *</label>
                    <input name="name" type="text" required className="ngo-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Email *</label>
                    <input name="email" type="email" required className="ngo-input" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Phone</label>
                  <input name="phone" type="tel" className="ngo-input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Skills / Background</label>
                  <input name="skills" type="text" placeholder="e.g. Teaching, Chess, Photography, Fundraising..."
                    className="ngo-input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Why do you want to volunteer?</label>
                  <textarea name="message" rows={4} className="ngo-textarea" />
                </div>
                <motion.button
                  type="submit" disabled={status === "loading"}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-full bg-[#2e7d5b] text-white font-black disabled:opacity-60 transition-all"
                >
                  {status === "loading" ? "Submitting..." : "Become a Volunteer →"}
                </motion.button>
                {status === "error" && <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>}
              </form>
            </div>
          </AnimatedSection>
        )}
      </div>

      <style jsx>{`
        .ngo-input {
          width: 100%;
          background: #f9fafb;
          border: 1px solid #e4e4e7;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          color: #111;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .ngo-input:focus { border-color: rgba(46,125,91,0.5); }
        .ngo-textarea {
          width: 100%;
          background: #f9fafb;
          border: 1px solid #e4e4e7;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          color: #111;
          font-size: 0.875rem;
          outline: none;
          resize: none;
          transition: border-color 0.2s;
          min-height: 100px;
        }
        .ngo-textarea:focus { border-color: rgba(46,125,91,0.5); }
      `}</style>
    </div>
  );
}
