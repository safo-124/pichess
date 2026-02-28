"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import { submitAcademyLead } from "@/lib/actions/academy";

export default function EnquirePage() {
  return (
    <Suspense>
      <EnquireForm />
    </Suspense>
  );
}

function EnquireForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const searchParams = useSearchParams();
  const preselected = searchParams.get("program") || "";
  const [selectedProgram, setSelectedProgram] = useState(preselected);

  useEffect(() => {
    if (preselected) setSelectedProgram(preselected);
  }, [preselected]);

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

  const programs = [
    "Premium Lessons",
    "Private Lessons",
    "Group Lessons",
    "Chess for Kids",
    "Adult Beginner Course",
    "Chess for Special Needs",
    "Grandmaster / Elite Lessons",
    "Chess in Schools Program",
    "Chess for Companies & Organizations",
    "Not Sure Yet",
  ];

  const inputClass =
    "w-full bg-[#0f1628] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all";

  return (
    <div className="min-h-screen bg-[#060a14] pt-24 pb-24 px-4 relative">
      {/* Decorative background */}
      <div className="absolute inset-0 chess-bg opacity-[0.015] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/[0.03] blur-[200px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/[0.03] blur-[180px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative">
        <div className="text-center mb-12">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-6">
              Academy
            </span>
          </AnimatedSection>
          <TextReveal text="Enquire Now" className="text-4xl sm:text-6xl font-black text-white tracking-tight" />
          <AnimatedSection delay={0.2}>
            <p className="text-white/35 mt-4 text-base leading-relaxed max-w-md mx-auto">
              Tell us about yourself and we&apos;ll get back to you within 24 hours with the perfect program for you.
            </p>
          </AnimatedSection>
        </div>

        {status === "success" ? (
          <AnimatedSection>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="rounded-3xl border border-amber-500/20 bg-[#0f1628] p-14 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-gradient-to-b from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="text-6xl mb-6">🎉</div>
                <h2 className="text-3xl font-black text-white mb-3">Enquiry Received!</h2>
                <p className="text-white/40 text-base">A coach will contact you within 24 hours. Get ready to make your move!</p>
              </div>
            </motion.div>
          </AnimatedSection>
        ) : (
          <AnimatedSection delay={0.15}>
            <div className="rounded-3xl border border-white/[0.06] bg-[#0f1628] p-8 sm:p-10 relative overflow-hidden">
              {/* Subtle top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-gradient-to-b from-amber-500/[0.06] to-transparent rounded-full blur-3xl pointer-events-none" />

              <form onSubmit={handleSubmit} className="space-y-6 relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2.5">Full Name *</label>
                    <input name="name" type="text" required placeholder="e.g. Kofi Mensah" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2.5">Email *</label>
                    <input name="email" type="email" required placeholder="you@example.com" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2.5">Phone Number</label>
                  <input name="phone" type="tel" placeholder="+233 XX XXX XXXX" className={inputClass} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2.5">Program of Interest</label>
                  <select
                    name="program"
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="">Select a program</option>
                    {programs.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2.5">Message</label>
                  <textarea name="message" rows={4} placeholder="Tell us about your chess experience and goals..." className={`${inputClass} resize-none`} />
                </div>

                <motion.button
                  type="submit"
                  disabled={status === "loading"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative w-full py-4 rounded-full text-base font-black transition-all overflow-hidden disabled:opacity-50"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 group-hover:from-amber-300 group-hover:to-orange-400 transition-all" />
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
                  <span className="relative z-10 text-black">
                    {status === "loading" ? "Submitting..." : "Submit Enquiry →"}
                  </span>
                </motion.button>

                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm text-center"
                  >
                    Something went wrong. Please try again.
                  </motion.p>
                )}
              </form>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
