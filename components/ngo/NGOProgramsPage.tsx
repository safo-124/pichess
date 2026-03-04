"use client";

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const programs = [
  {
    id: "equipment",
    badge: "Core Program",
    icon: "♟",
    title: "Free Chess Equipment",
    subtitle: "Removing the first barrier to entry",
    desc: "We distribute professional-grade chess sets, boards, clocks, and learning materials to schools and community centres that can't afford them. Every child who wants to play chess should have the tools to do so.",
    details: [
      "Full tournament-standard chess sets & boards",
      "Digital chess clocks for competitive play",
      "Printed workbooks & puzzle sheets",
      "Storage bags & replacement pieces program",
    ],
    impact: "2,000+ sets distributed",
    image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=800&q=80",
    color: "#2e7d5b",
  },
  {
    id: "schools",
    badge: "Education",
    icon: "🏫",
    title: "School Chess Programs",
    subtitle: "Bringing chess into the classroom",
    desc: "Our trained coaches run regular in-school sessions, integrating chess into after-school activities and PE curricula at no cost. We partner with schools to make chess a permanent part of their educational offering.",
    details: [
      "Weekly coaching sessions during school hours",
      "After-school chess clubs with supervision",
      "Inter-school tournaments & friendly matches",
      "Teacher training for chess instruction",
    ],
    impact: "45+ schools enrolled",
    image: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=800&q=80",
    color: "#1a6847",
  },
  {
    id: "scholarships",
    badge: "Talent Development",
    icon: "🎓",
    title: "Chess Scholarships",
    subtitle: "Investing in exceptional talent",
    desc: "Talented players from underserved backgrounds receive fully funded spots at the PiChess Academy for advanced training. Our scholarship covers coaching fees, tournament entry, travel, and all equipment.",
    details: [
      "Full PiChess Academy tuition coverage",
      "National & international tournament sponsorship",
      "Travel & accommodation for competitions",
      "Ongoing mentorship & career guidance",
    ],
    impact: "30+ scholars funded",
    image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&q=80",
    color: "#3a9970",
  },
  {
    id: "mentorship",
    badge: "Guidance",
    icon: "🤝",
    title: "Mentorship Network",
    subtitle: "Every player deserves a guide",
    desc: "We pair young players with experienced mentors — chess masters, educators, and community leaders — for ongoing guidance. Beyond chess skills, mentors help develop life skills, discipline, and academic focus.",
    details: [
      "1-on-1 pairing with titled players",
      "Monthly group mentoring sessions",
      "Life skills & academic support workshops",
      "Career pathway & educational guidance",
    ],
    impact: "80+ active mentor pairs",
    image: "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=800&q=80",
    color: "#4db585",
  },
  {
    id: "community",
    badge: "Outreach",
    icon: "🌍",
    title: "Community Chess Hubs",
    subtitle: "Safe spaces to learn and play",
    desc: "We establish permanent chess hubs in community centres, libraries, and public spaces across Ghana. These hubs provide a safe, supervised environment where children can practise, socialise, and grow through chess.",
    details: [
      "Permanent setup in community centres",
      "Weekend open-play sessions for all ages",
      "Local chess leagues & ladder systems",
      "Community coach training programs",
    ],
    impact: "10 hubs across Ghana",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    color: "#2e7d5b",
  },
  {
    id: "tournaments",
    badge: "Competition",
    icon: "🏆",
    title: "Foundation Tournaments",
    subtitle: "Competitive play for everyone",
    desc: "We organise free-to-enter tournaments exclusively for foundation beneficiaries, giving underserved players their first taste of competitive chess in a supportive, encouraging environment.",
    details: [
      "Quarterly regional tournaments",
      "Annual PiChess Foundation Championship",
      "Prizes, medals & certificates for all",
      "Talent scouting for scholarship program",
    ],
    impact: "12 events per year",
    image: "https://images.unsplash.com/photo-1611329857570-f02f340e7378?w=800&q=80",
    color: "#1a6847",
  },
];

const processSteps = [
  { num: "01", title: "Identify", desc: "Partner with schools and communities in underserved areas across Ghana." },
  { num: "02", title: "Equip", desc: "Deliver chess sets, materials, and set up dedicated chess spaces." },
  { num: "03", title: "Train", desc: "Deploy qualified coaches and train local teachers in chess instruction." },
  { num: "04", title: "Grow", desc: "Nurture talent, organise competitions, and award scholarships." },
];

const testimonials = [
  { quote: "Chess taught me to think three moves ahead — in the game and in life.", name: "Kwame A.", role: "Foundation Scholar, Age 14", avatar: "♚" },
  { quote: "My daughter's grades improved dramatically after joining the chess program.", name: "Abena M.", role: "Parent, Accra", avatar: "♛" },
  { quote: "The foundation gave our school something special. The kids can't wait for chess day.", name: "Mr. Osei", role: "Head Teacher, Kumasi", avatar: "♜" },
];

/* ═══════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function AnimSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div style={{ y }} className="w-full h-[120%] relative">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
      </motion.div>
    </div>
  );
}

function FloatingShape({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay, ease }}
    >
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6 + delay * 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-full"
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROGRAM CARD (expandable)
   ═══════════════════════════════════════════════════════════ */

function ProgramCard({ program, index }: { program: typeof programs[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <AnimSection delay={0.1}>
      <div className="group relative">
        {/* Connector line to timeline */}
        <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-[#2e7d5b]/30 to-transparent" />

        <motion.div
          layout
          className={`grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-zinc-200/60 bg-white shadow-sm hover:shadow-xl transition-shadow duration-500 ${
            isEven ? "" : "lg:direction-rtl"
          }`}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.4, ease }}
        >
          {/* Image side */}
          <div className={`relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px] overflow-hidden ${!isEven ? "lg:order-2" : ""}`}>
            <Image
              src={program.image}
              alt={program.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Floating badge */}
            <motion.div
              className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase text-white/90 backdrop-blur-md"
              style={{ backgroundColor: `${program.color}cc` }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, ease }}
            >
              {program.badge}
            </motion.div>

            {/* Impact stat */}
            <motion.div
              className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, ease }}
            >
              <p className="text-2xl font-black text-white">{program.impact}</p>
            </motion.div>

            {/* Icon float */}
            <motion.div
              className="absolute top-4 right-4 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl"
              animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              {program.icon}
            </motion.div>
          </div>

          {/* Content side */}
          <div className={`p-8 lg:p-12 flex flex-col justify-center ${!isEven ? "lg:order-1 lg:text-right" : ""}`}>
            <motion.div
              className={`w-12 h-1 rounded-full mb-6 ${!isEven ? "lg:ml-auto" : ""}`}
              style={{ backgroundColor: program.color }}
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease }}
            />

            <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-2">{program.title}</h3>
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: program.color }}>
              {program.subtitle}
            </p>
            <p className="text-zinc-500 leading-relaxed mb-6">{program.desc}</p>

            {/* Expand/collapse details */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 text-sm font-bold transition-colors mb-4 self-start"
              style={{ color: program.color }}
            >
              {expanded ? "Show Less" : "See Details"}
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className={`overflow-hidden space-y-3 mb-6 ${!isEven ? "lg:ml-auto" : ""}`}
                >
                  {program.details.map((d, i) => (
                    <motion.li
                      key={d}
                      initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, ease }}
                      className={`flex items-start gap-3 text-sm text-zinc-600 ${!isEven ? "lg:flex-row-reverse lg:text-right" : ""}`}
                    >
                      <span className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: program.color }}>
                        ✓
                      </span>
                      {d}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimSection>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */

export default function NGOProgramsPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <div className="bg-white text-zinc-900 overflow-x-hidden">

      {/* ──── HERO ──── */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Parallax background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80"
            alt="Children learning chess together"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
          <div className="absolute inset-0 bg-[#2e7d5b]/20" />
        </motion.div>

        {/* Floating chess pieces */}
        <motion.div
          className="absolute top-[15%] left-[8%] text-6xl opacity-20 text-white"
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >♞</motion.div>
        <motion.div
          className="absolute top-[25%] right-[10%] text-5xl opacity-15 text-white"
          animate={{ y: [0, -15, 0], rotate: [0, -8, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >♝</motion.div>
        <motion.div
          className="absolute bottom-[20%] left-[15%] text-4xl opacity-10 text-white"
          animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >♜</motion.div>
        <motion.div
          className="absolute bottom-[30%] right-[5%] text-7xl opacity-10 text-white"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >♛</motion.div>

        {/* Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/80 text-xs font-bold uppercase tracking-[0.2em] mb-8">
              <span className="w-2 h-2 rounded-full bg-[#5cc99a] animate-pulse" />
              Our Programs
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
          >
            Changing Lives,{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-[#5cc99a] via-[#8ce8be] to-[#5cc99a] bg-clip-text text-transparent">
                One Move
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#5cc99a] to-transparent rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.8, ease }}
              />
            </span>{" "}
            at a Time
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-white/65 text-lg sm:text-xl leading-relaxed mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          >
            From free equipment to scholarships, our six programs work together to ensure every child in Ghana has access to chess — and the life skills it teaches.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
          >
            <Link
              href="#programs"
              className="px-8 py-4 rounded-full bg-[#2e7d5b] hover:bg-[#3a9970] text-white font-bold text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-[#2e7d5b]/30"
            >
              Explore Programs ↓
            </Link>
            <Link
              href="/ngo/apply"
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-base transition-all duration-300 hover:scale-105"
            >
              Apply for Support
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center">
            <motion.div
              className="w-1.5 h-3 rounded-full bg-white/50 mt-2"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ──── HOW IT WORKS ──── */}
      <section className="py-24 bg-zinc-50 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-[#2e7d5b]/5 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-[#2e7d5b]/3 blur-3xl" />

        <div className="max-w-6xl mx-auto px-4">
          <AnimSection className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-4">
              Our Process
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight">
              How We Make It Happen
            </h2>
          </AnimSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-14 left-[12%] right-[12%] h-px bg-gradient-to-r from-[#2e7d5b]/20 via-[#2e7d5b]/40 to-[#2e7d5b]/20" />

            {processSteps.map((step, i) => (
              <AnimSection key={step.num} delay={i * 0.15}>
                <div className="relative text-center group">
                  {/* Number circle */}
                  <motion.div
                    className="w-28 h-28 rounded-full mx-auto mb-6 relative flex items-center justify-center bg-white border-2 border-[#2e7d5b]/20 shadow-sm group-hover:shadow-lg group-hover:border-[#2e7d5b]/50 transition-all duration-500"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <span className="text-4xl font-black bg-gradient-to-br from-[#2e7d5b] to-[#5cc99a] bg-clip-text text-transparent">
                      {step.num}
                    </span>
                    {/* Pulse ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[#2e7d5b]/20"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    />
                  </motion.div>
                  <h3 className="text-xl font-black text-zinc-900 mb-2">{step.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ──── PROGRAMS GRID ──── */}
      <section id="programs" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimSection className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-4">
              What We Do
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight mb-4">
              Our Six Programs
            </h2>
            <p className="max-w-2xl mx-auto text-zinc-500 text-lg">
              Each program tackles a specific barrier that prevents children from accessing chess education. Together, they form a complete support system.
            </p>
          </AnimSection>

          <div className="space-y-12">
            {programs.map((p, i) => (
              <ProgramCard key={p.id} program={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ──── IMPACT NUMBERS (animated counters) ──── */}
      <section className="py-24 bg-[#2e7d5b] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-conic-gradient(rgba(255,255,255,0.08) 0% 25%, transparent 0% 50%)`,
            backgroundSize: "40px 40px",
          }} />
        </div>

        {/* Floating accents */}
        <motion.div
          className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full border border-white/10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[8%] w-24 h-24 rounded-full bg-white/5"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        <div className="relative max-w-6xl mx-auto px-4">
          <AnimSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Every number represents a life changed, a community strengthened, a future brightened.
            </p>
          </AnimSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "2,000+", label: "Chess Sets Distributed", icon: "♟" },
              { value: "45+", label: "Partner Schools", icon: "🏫" },
              { value: "200+", label: "Active Beneficiaries", icon: "👦" },
              { value: "30+", label: "Scholars Funded", icon: "🎓" },
            ].map((stat, i) => (
              <AnimSection key={stat.label} delay={i * 0.12}>
                <motion.div
                  className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all duration-500"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <motion.div
                    className="text-4xl mb-3"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="text-3xl sm:text-4xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-white/60 text-sm font-medium">{stat.label}</div>
                </motion.div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ──── TESTIMONIALS ──── */}
      <section className="py-24 bg-zinc-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2e7d5b]/20 to-transparent" />

        <div className="max-w-6xl mx-auto px-4">
          <AnimSection className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-4">
              Voices of Impact
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight">
              What They Say
            </h2>
          </AnimSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <AnimSection key={t.name} delay={i * 0.15}>
                <motion.div
                  className="relative bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 hover:shadow-xl transition-all duration-500 h-full flex flex-col"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4, ease }}
                >
                  {/* Quote mark */}
                  <div className="absolute -top-4 left-8 w-10 h-10 rounded-xl bg-[#2e7d5b] flex items-center justify-center text-white text-xl font-black shadow-lg shadow-[#2e7d5b]/30">
                    &ldquo;
                  </div>

                  <p className="text-zinc-600 text-base leading-relaxed italic mt-4 mb-8 flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                    <div className="w-12 h-12 rounded-full bg-[#d4ede3] flex items-center justify-center text-2xl">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 text-sm">{t.name}</p>
                      <p className="text-zinc-400 text-xs">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ──── TIMELINE ──── */}
      <section className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4">
          <AnimSection className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-xs font-bold uppercase tracking-widest mb-4">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight">
              Growing Year by Year
            </h2>
          </AnimSection>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#2e7d5b] via-[#5cc99a] to-[#2e7d5b]/20" />

            {[
              { year: "2021", title: "The Beginning", desc: "Started with 10 chess sets donated to 2 schools in Accra." },
              { year: "2022", title: "First Expansion", desc: "Grew to 5 schools, launched our first scholarship program." },
              { year: "2023", title: "Community Hubs", desc: "Opened 4 community chess hubs and trained 12 local coaches." },
              { year: "2024", title: "National Reach", desc: "Expanded to 10 communities across 4 regions of Ghana." },
              { year: "2025", title: "Foundation Tournaments", desc: "Launched quarterly tournaments with 200+ participants." },
              { year: "2026", title: "The Future", desc: "Goal: 50 schools, 20 hubs, and 100 scholars by year's end." },
            ].map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <AnimSection key={item.year} delay={i * 0.1}>
                  <div className={`relative flex items-center mb-12 ${isLeft ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                    {/* Dot */}
                    <motion.div
                      className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#2e7d5b] border-4 border-white shadow-md z-10"
                      whileInView={{ scale: [0, 1.3, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2, ease }}
                    />

                    {/* Content card */}
                    <div className={`ml-12 sm:ml-0 sm:w-[45%] ${isLeft ? "sm:pr-12 sm:text-right" : "sm:pl-12"}`}>
                      <motion.div
                        className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 hover:shadow-lg transition-all duration-500"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3, ease }}
                      >
                        <span className="inline-block px-3 py-1 rounded-full bg-[#2e7d5b]/10 text-[#2e7d5b] text-sm font-black mb-3">
                          {item.year}
                        </span>
                        <h3 className="text-lg font-black text-zinc-900 mb-2">{item.title}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                      </motion.div>
                    </div>
                  </div>
                </AnimSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── GET INVOLVED CTA ──── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80"
            alt="Community"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a3c2d]/90 via-[#2e7d5b]/85 to-[#1a3c2d]/90" />
        </div>

        {/* Animated grid */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <AnimSection>
            <motion.div
              className="text-6xl mb-6"
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              ♟
            </motion.div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
              Ready to Make a{" "}
              <span className="bg-gradient-to-r from-[#8ce8be] to-[#5cc99a] bg-clip-text text-transparent">
                Difference
              </span>
              ?
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Whether you donate, volunteer, or apply for support — every action moves us closer to a Ghana where every child can play chess.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/ngo/donate"
                className="group px-8 py-4 rounded-full bg-white text-[#2e7d5b] font-bold text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-black/20"
              >
                <span className="flex items-center gap-2">
                  💚 Donate Now
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >→</motion.span>
                </span>
              </Link>
              <Link
                href="/ngo/volunteer"
                className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-base transition-all duration-300 hover:scale-105"
              >
                🤲 Volunteer
              </Link>
              <Link
                href="/ngo/apply"
                className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-base transition-all duration-300 hover:scale-105"
              >
                🙏 Apply for Support
              </Link>
            </div>
          </AnimSection>
        </div>
      </section>
    </div>
  );
}
