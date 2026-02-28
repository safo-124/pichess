"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { subscribeToNewsletter } from "@/lib/actions/contact";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    try {
      await subscribeToNewsletter(fd);
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch { setStatus("error"); }
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest">Get In Touch</span>
            <h1 className="text-5xl sm:text-7xl font-black mt-2 mb-4">Contact Us</h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Questions, partnerships, or just want to say hello? We&apos;re here.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Info */}
            <AnimatedSection direction="left">
              <div className="space-y-8">
                {[
                  { icon: "📍", label: "Location", value: "Accra, Ghana" },
                  { icon: "📧", label: "Email", value: "hello@pichess.com" },
                  { icon: "📱", label: "WhatsApp", value: "+233 XX XXX XXXX" },
                  { icon: "🏫", label: "Academy", value: "academy@pichess.com" },
                  { icon: "❤️", label: "Foundation", value: "ngo@pichess.com" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4 items-start">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-white/30 text-xs uppercase tracking-widest font-medium">{item.label}</p>
                      <p className="text-white font-semibold">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Newsletter form */}
            <AnimatedSection direction="right">
              <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8">
                <h2 className="text-xl font-black text-white mb-2">Stay Updated</h2>
                <p className="text-white/40 text-sm mb-6">Get tournament news, programs updates, and more.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    required
                    className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Your email"
                    required
                    className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
                  />
                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-lg bg-[#c9a84c] hover:bg-[#dbb95d] text-black font-bold transition-colors disabled:opacity-60"
                  >
                    {status === "loading" ? "Subscribing..." : "Subscribe →"}
                  </motion.button>
                  {status === "success" && <p className="text-green-400 text-sm text-center">✓ You&apos;re subscribed!</p>}
                  {status === "error" && <p className="text-red-400 text-sm text-center">Something went wrong. Try again.</p>}
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
