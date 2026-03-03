"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToNewsletter, submitContactMessage } from "@/lib/actions/contact";

/* ── Animations ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0, 0, 0.2, 1] as const } }),
};
const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0, 0, 0.2, 1] as const } },
};
const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0, 0, 0.2, 1] as const } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const } },
};

/* ── Contact Items Data ─────────────────────────────────── */
const CONTACT_ITEMS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    label: "Visit Us",
    value: "Accra, Ghana",
    desc: "Our headquarters in the heart of Accra",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: "Email Us",
    value: "hello@pichess.com",
    desc: "We respond within 24 hours",
    color: "bg-emerald-50 text-emerald-600",
    href: "mailto:hello@pichess.com",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    label: "WhatsApp",
    value: "+233 XX XXX XXXX",
    desc: "Quick responses on WhatsApp",
    color: "bg-green-50 text-green-600",
    href: "https://wa.me/233XXXXXXXX",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    label: "Academy",
    value: "academy@pichess.com",
    desc: "Enrollment & lesson inquiries",
    color: "bg-purple-50 text-purple-600",
    href: "mailto:academy@pichess.com",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    label: "Foundation",
    value: "ngo@pichess.com",
    desc: "Donations & volunteer programs",
    color: "bg-rose-50 text-rose-600",
    href: "mailto:ngo@pichess.com",
  },
];

/* ── Quick Links ─────────────────────────────────────────── */
const QUICK_LINKS = [
  { label: "Academy Programs", href: "/academy", icon: "♟" },
  { label: "Tournaments", href: "/tournaments", icon: "🏆" },
  { label: "Foundation", href: "/ngo", icon: "❤️" },
  { label: "Shop", href: "/shop", icon: "🛍️" },
];

/* ── FAQ Data ────────────────────────────────────────────── */
const FAQS = [
  { q: "What age groups do you teach?", a: "We offer programs for all ages — from 5-year-olds in our Junior Academy to adult learners and competitive players. Each program is tailored to the appropriate skill level." },
  { q: "How can I register for a tournament?", a: "Visit our Tournaments page to see upcoming events. Registration is available online with details about entry fees, categories, and schedules." },
  { q: "Do you offer online classes?", a: "Yes! We provide both in-person and online chess instruction. Our online classes use interactive tools and video sessions with experienced coaches." },
  { q: "How can I support the Foundation?", a: "You can donate, volunteer, or sponsor a child's chess education through our NGO page. Every contribution helps bring chess to underserved communities." },
];

export default function ContactPage() {
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setContactStatus("loading");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await submitContactMessage(fd);
      if (res?.error) { setContactStatus("error"); return; }
      setContactStatus("success");
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setContactStatus("idle"), 5000);
    } catch { setContactStatus("error"); }
  }

  async function handleNewsletterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubStatus("loading");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await subscribeToNewsletter(fd);
      if (res?.error) { setSubStatus("error"); return; }
      setSubStatus("success");
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSubStatus("idle"), 5000);
    } catch { setSubStatus("error"); }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ═══ HERO ═══ */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-[#c9a84c]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-50 rounded-full blur-3xl" />
          <motion.div
            className="absolute top-32 left-[15%] text-6xl opacity-10"
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >♔</motion.div>
          <motion.div
            className="absolute top-48 right-[20%] text-5xl opacity-10"
            animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >♟</motion.div>
          <motion.div
            className="absolute bottom-20 left-[40%] text-4xl opacity-10"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >♞</motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block text-xs font-semibold text-[#c9a84c] uppercase tracking-[0.2em] mb-4"
          >
            Get In Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-5"
          >
            Let&apos;s <span className="text-[#c9a84c]">Connect</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Whether you have questions about our academy, want to sponsor a tournament, 
            or simply want to join the chess community — we&apos;d love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* ═══ CONTACT CARDS ═══ */}
      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CONTACT_ITEMS.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href || "#"}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                className="group relative bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 text-center transition-all duration-300 hover:border-[#c9a84c]/30 cursor-pointer"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                <p className="font-semibold text-gray-900 text-sm">{item.value}</p>
                <p className="text-[11px] text-gray-400 mt-1 hidden sm:block">{item.desc}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MAIN: FORM + MAP/INFO ═══ */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Contact Form — takes 3 cols */}
            <motion.div
              className="lg:col-span-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeLeft}
            >
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 lg:p-10">
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-black mb-2">Send a Message</h2>
                  <p className="text-gray-400 text-sm">Fill out the form and we&apos;ll get back to you shortly.</p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Name *</label>
                      <input
                        name="name"
                        type="text"
                        required
                        placeholder="Your full name"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email *</label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="your@email.com"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subject</label>
                    <select
                      name="subject"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c] transition-all appearance-none"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="academy">Academy & Lessons</option>
                      <option value="tournament">Tournaments</option>
                      <option value="foundation">Foundation / NGO</option>
                      <option value="partnership">Partnerships & Sponsorship</option>
                      <option value="shop">Shop & Orders</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message *</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us what's on your mind..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c] transition-all resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={contactStatus === "loading"}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-[#c9a84c] hover:bg-[#b89a3e] text-white font-bold text-sm transition-all disabled:opacity-60 shadow-lg shadow-[#c9a84c]/20"
                  >
                    {contactStatus === "loading" ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </span>
                    ) : "Send Message →"}
                  </motion.button>

                  <AnimatePresence>
                    {contactStatus === "success" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 rounded-xl px-4 py-3"
                      >
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Message sent successfully! We&apos;ll respond within 24 hours.
                      </motion.div>
                    )}
                    {contactStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3"
                      >
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        Something went wrong. Please try again.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>

            {/* Right sidebar — takes 2 cols */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeRight}
            >
              {/* Map placeholder */}
              <div className="relative rounded-3xl overflow-hidden border border-gray-100 shadow-sm h-56 sm:h-64 bg-gradient-to-br from-gray-100 to-gray-50">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-4xl mb-3"
                  >
                    📍
                  </motion.div>
                  <p className="font-bold text-gray-900">Accra, Ghana</p>
                  <p className="text-xs text-gray-400 mt-1">PiChess Headquarters</p>
                </div>
                {/* Decorative grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 40px)",
                }} />
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Newsletter</h3>
                    <p className="text-white/50 text-xs">Stay in the loop</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-5">Get tournament updates, chess tips, and program news delivered to your inbox.</p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
                  />
                  <motion.button
                    type="submit"
                    disabled={subStatus === "loading"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-[#c9a84c] hover:bg-[#dbb95d] text-black font-bold text-sm transition-colors disabled:opacity-60"
                  >
                    {subStatus === "loading" ? "Subscribing..." : "Subscribe to Newsletter →"}
                  </motion.button>
                  <AnimatePresence>
                    {subStatus === "success" && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-emerald-400 text-sm text-center">
                        ✓ You&apos;re subscribed!
                      </motion.p>
                    )}
                    {subStatus === "error" && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-400 text-sm text-center">
                        Failed to subscribe. Try again.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </form>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
                <div className="grid grid-cols-2 gap-3">
                  {QUICK_LINKS.map((link) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 bg-gray-50 hover:bg-[#c9a84c]/5 hover:border-[#c9a84c]/20 border border-gray-100 rounded-xl px-4 py-3 transition-all"
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span className="text-xs font-semibold text-gray-700">{link.label}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ SECTION ═══ */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className="text-center mb-10 sm:mb-14"
          >
            <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-[0.2em]">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2">Frequently Asked Questions</h2>
            <p className="text-gray-400 mt-3 text-sm sm:text-base">Quick answers to common questions</p>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base text-gray-900 pr-4">{faq.q}</span>
                  <motion.svg
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5 text-gray-400 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-gray-500 text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA FOOTER STRIP ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleIn}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 sm:p-14 relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#c9a84c]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#c9a84c]/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-5xl sm:text-6xl mb-5 inline-block"
              >
                ♚
              </motion.div>
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">Ready to Make Your Move?</h2>
              <p className="text-white/50 max-w-lg mx-auto mb-8 text-sm sm:text-base">
                Join hundreds of chess enthusiasts across Ghana. Whether you&apos;re a beginner or a grandmaster, there&apos;s a place for you at PiChess.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <motion.a
                  href="/academy"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#c9a84c] hover:bg-[#dbb95d] text-black font-bold text-sm transition-colors"
                >
                  Join the Academy
                </motion.a>
                <motion.a
                  href="/tournaments"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/20 hover:border-white/40 text-white font-bold text-sm transition-colors"
                >
                  View Tournaments
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
