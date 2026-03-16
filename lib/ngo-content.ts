/* ═══════════════════════════════════════════════════════════
   NGO / Foundation — Default content & types
   Used as fallback when SiteContent entries are missing.
   ═══════════════════════════════════════════════════════════ */

// ── Hero ──
export interface NGOHeroData {
  badge: string;
  title1: string;
  title2: string;
  subtitle: string;
  backgroundImage: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
  floatingImages: { src: string; alt: string }[];
}

export const defaultNGOHero: NGOHeroData = {
  badge: "PiChess Foundation",
  title1: "Chess for",
  title2: "Every Child.",
  subtitle:
    "We bring chess to underserved communities across Ghana, using it as a tool for education, discipline, and opportunity.",
  backgroundImage:
    "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1600&q=80",
  cta1Text: "Donate Now ❤️",
  cta1Link: "/ngo/donate",
  cta2Text: "Apply for Support",
  cta2Link: "/ngo/apply",
  floatingImages: [
    { src: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=400&q=80", alt: "Children playing chess outdoors" },
    { src: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&q=80", alt: "Chess coaching session" },
    { src: "https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=400&q=80", alt: "Community chess tournament" },
    { src: "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=400&q=80", alt: "Young chess player celebrating" },
    { src: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400&q=80", alt: "Chess pieces close-up" },
    { src: "https://images.unsplash.com/photo-1611195974226-a6a9be4a5b1e?w=400&q=80", alt: "Students learning chess" },
  ],
};

// ── Stats ──
export interface NGOStat {
  value: number;
  label: string;
  suffix: string;
}

export const defaultNGOStats: NGOStat[] = [
  { value: 200, label: "Beneficiaries", suffix: "+" },
  { value: 10, label: "Communities", suffix: "" },
  { value: 50, label: "Donors", suffix: "+" },
  { value: 5, label: "Years of Impact", suffix: "" },
];

// ── Mission Teaser (homepage) ──
export interface NGOMissionTeaser {
  badge: string;
  heading: string;
  headingHighlight: string;
  description: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

export const defaultNGOMissionTeaser: NGOMissionTeaser = {
  badge: "Our Mission",
  heading: "Empowering Youth Through",
  headingHighlight: "the Royal Game",
  description:
    "We bring chess to underserved communities across Ghana — free equipment, school programs, scholarships, and mentorship for every child.",
  backgroundImage:
    "https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=1600&q=80",
  ctaText: "Learn About Our Mission",
  ctaLink: "/ngo/mission",
};

// ── Programs Teaser (homepage) ──
export interface NGOProgramsTeaser {
  badge: string;
  heading: string;
  description: string;
  tags: string[];
  ctaText: string;
  ctaLink: string;
}

export const defaultNGOProgramsTeaser: NGOProgramsTeaser = {
  badge: "Our Programs",
  heading: "Six Programs, One Goal",
  description:
    "From free chess equipment and school programs to scholarships, mentorship, community hubs, and tournaments — we build a complete support system for every child.",
  tags: ["♟ Equipment", "🏫 Schools", "🎓 Scholarships", "🤝 Mentorship", "🌍 Hubs", "🏆 Tournaments"],
  ctaText: "Explore All Programs",
  ctaLink: "/ngo/programs",
};

// ── Pillars (used on mission page) ──
export interface NGOPillar {
  icon: string;
  title: string;
  desc: string;
  image: string;
}

export const defaultNGOPillars: NGOPillar[] = [
  {
    icon: "♟",
    title: "Free Equipment",
    desc: "We distribute chess sets, boards, clocks, and learning materials to schools and community centres that can\u2019t afford them.",
    image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=600&q=80",
  },
  {
    icon: "🏫",
    title: "School Programs",
    desc: "Our trained coaches run regular in-school sessions, integrating chess into after-school activities and PE curricula at no cost.",
    image: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&q=80",
  },
  {
    icon: "🎓",
    title: "Scholarships",
    desc: "Talented players from underserved backgrounds receive fully funded spots at the PiChess Academy for advanced training.",
    image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&q=80",
  },
  {
    icon: "🤝",
    title: "Mentorship",
    desc: "We pair young players with experienced mentors — chess masters, educators, and community leaders — for ongoing guidance.",
    image: "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=600&q=80",
  },
];

// ── Values ──
export interface NGOValue {
  icon: string;
  title: string;
  desc: string;
}

export const defaultNGOValues: NGOValue[] = [
  { title: "Access", desc: "Every child deserves the chance to learn chess, regardless of their socioeconomic background.", icon: "🔓" },
  { title: "Discipline", desc: "Chess instils patience, focus and strategic thinking — skills that transfer to every area of life.", icon: "🎯" },
  { title: "Community", desc: "We build lasting bonds between players, coaches, schools, and families through the game.", icon: "🤗" },
  { title: "Excellence", desc: "We maintain high coaching standards so every student receives world-class chess education.", icon: "⭐" },
  { title: "Sustainability", desc: "We train local coaches and build self-sustaining chess clubs in every community we serve.", icon: "🌱" },
  { title: "Joy", desc: "Above all, chess should be fun. We keep the love of the game at the heart of everything.", icon: "😊" },
];

// ── Our Story (mission page) ──
export interface NGOStorySection {
  heading: string;
  paragraphs: string[];
  image: string;
  accentValue: string;
  accentLabel: string;
}

export const defaultNGOStorySection: NGOStorySection = {
  heading: "From a Single Board to a National Movement",
  paragraphs: [
    "PiChess Foundation started with a simple idea: every child in Ghana deserves the chance to learn chess. In 2021, we began with one chess set and a small group of eager students in Accra.",
    "Today, we serve over 200 beneficiaries across 10 communities, running free programs in schools, community centres, and public spaces. Our coaches — many of whom were once students themselves — lead sessions that teach far more than the game.",
    "Chess teaches patience, critical thinking, and resilience. For many of our students, it becomes a pathway to scholarships, competitions, and futures they never imagined possible.",
  ],
  image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=900&q=80",
  accentValue: "5",
  accentLabel: "Changing Lives",
};

// ── Programs (full page) ──
export interface NGOProgram {
  id: string;
  badge: string;
  icon: string;
  title: string;
  subtitle: string;
  desc: string;
  details: string[];
  impact: string;
  image: string;
  color: string;
}

export const defaultNGOPrograms: NGOProgram[] = [
  {
    id: "equipment", badge: "Core Program", icon: "♟", title: "Free Chess Equipment",
    subtitle: "Removing the first barrier to entry",
    desc: "We distribute professional-grade chess sets, boards, clocks, and learning materials to schools and community centres that can't afford them. Every child who wants to play chess should have the tools to do so.",
    details: ["Full tournament-standard chess sets & boards", "Digital chess clocks for competitive play", "Printed workbooks & puzzle sheets", "Storage bags & replacement pieces program"],
    impact: "2,000+ sets distributed",
    image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=800&q=80", color: "#2e7d5b",
  },
  {
    id: "schools", badge: "Education", icon: "🏫", title: "School Chess Programs",
    subtitle: "Bringing chess into the classroom",
    desc: "Our trained coaches run regular in-school sessions, integrating chess into after-school activities and PE curricula at no cost. We partner with schools to make chess a permanent part of their educational offering.",
    details: ["Weekly coaching sessions during school hours", "After-school chess clubs with supervision", "Inter-school tournaments & friendly matches", "Teacher training for chess instruction"],
    impact: "45+ schools enrolled",
    image: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=800&q=80", color: "#1a6847",
  },
  {
    id: "scholarships", badge: "Talent Development", icon: "🎓", title: "Chess Scholarships",
    subtitle: "Investing in exceptional talent",
    desc: "Talented players from underserved backgrounds receive fully funded spots at the PiChess Academy for advanced training. Our scholarship covers coaching fees, tournament entry, travel, and all equipment.",
    details: ["Full PiChess Academy tuition coverage", "National & international tournament sponsorship", "Travel & accommodation for competitions", "Ongoing mentorship & career guidance"],
    impact: "30+ scholars funded",
    image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&q=80", color: "#3a9970",
  },
  {
    id: "mentorship", badge: "Guidance", icon: "🤝", title: "Mentorship Network",
    subtitle: "Every player deserves a guide",
    desc: "We pair young players with experienced mentors — chess masters, educators, and community leaders — for ongoing guidance. Beyond chess skills, mentors help develop life skills, discipline, and academic focus.",
    details: ["1-on-1 pairing with titled players", "Monthly group mentoring sessions", "Life skills & academic support workshops", "Career pathway & educational guidance"],
    impact: "80+ active mentor pairs",
    image: "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=800&q=80", color: "#4db585",
  },
  {
    id: "community", badge: "Outreach", icon: "🌍", title: "Community Chess Hubs",
    subtitle: "Safe spaces to learn and play",
    desc: "We establish permanent chess hubs in community centres, libraries, and public spaces across Ghana. These hubs provide a safe, supervised environment where children can practise, socialise, and grow through chess.",
    details: ["Permanent setup in community centres", "Weekend open-play sessions for all ages", "Local chess leagues & ladder systems", "Community coach training programs"],
    impact: "10 hubs across Ghana",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80", color: "#2e7d5b",
  },
  {
    id: "tournaments", badge: "Competition", icon: "🏆", title: "Foundation Tournaments",
    subtitle: "Competitive play for everyone",
    desc: "We organise free-to-enter tournaments exclusively for foundation beneficiaries, giving underserved players their first taste of competitive chess in a supportive, encouraging environment.",
    details: ["Quarterly regional tournaments", "Annual PiChess Foundation Championship", "Prizes, medals & certificates for all", "Talent scouting for scholarship program"],
    impact: "12 events per year",
    image: "https://images.unsplash.com/photo-1611329857570-f02f340e7378?w=800&q=80", color: "#1a6847",
  },
];

// ── Programs page extras ──
export interface NGOProcessStep {
  num: string;
  title: string;
  desc: string;
}

export const defaultNGOProcessSteps: NGOProcessStep[] = [
  { num: "01", title: "Identify", desc: "Partner with schools and communities in underserved areas across Ghana." },
  { num: "02", title: "Equip", desc: "Deliver chess sets, materials, and set up dedicated chess spaces." },
  { num: "03", title: "Train", desc: "Deploy qualified coaches and train local teachers in chess instruction." },
  { num: "04", title: "Grow", desc: "Nurture talent, organise competitions, and award scholarships." },
];

export interface NGOTestimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

export const defaultNGOTestimonials: NGOTestimonial[] = [
  { quote: "Chess taught me to think three moves ahead — in the game and in life.", name: "Kwame A.", role: "Foundation Scholar, Age 14", avatar: "♚" },
  { quote: "My daughter's grades improved dramatically after joining the chess program.", name: "Abena M.", role: "Parent, Accra", avatar: "♛" },
  { quote: "The foundation gave our school something special. The kids can't wait for chess day.", name: "Mr. Osei", role: "Head Teacher, Kumasi", avatar: "♜" },
];

export interface NGOTimelineItem {
  year: string;
  title: string;
  desc: string;
}

export const defaultNGOTimeline: NGOTimelineItem[] = [
  { year: "2021", title: "The Beginning", desc: "Started with 10 chess sets donated to 2 schools in Accra." },
  { year: "2022", title: "First Expansion", desc: "Grew to 5 schools, launched our first scholarship program." },
  { year: "2023", title: "Community Hubs", desc: "Opened 4 community chess hubs and trained 12 local coaches." },
  { year: "2024", title: "National Reach", desc: "Expanded to 10 communities across 4 regions of Ghana." },
  { year: "2025", title: "Foundation Tournaments", desc: "Launched quarterly tournaments with 200+ participants." },
  { year: "2026", title: "The Future", desc: "Goal: 50 schools, 20 hubs, and 100 scholars by year's end." },
];

export interface NGOProgramsImpactStat {
  value: string;
  label: string;
  icon: string;
}

export const defaultNGOProgramsStats: NGOProgramsImpactStat[] = [
  { value: "2,000+", label: "Chess Sets Distributed", icon: "♟" },
  { value: "45+", label: "Partner Schools", icon: "🏫" },
  { value: "200+", label: "Active Beneficiaries", icon: "👦" },
  { value: "30+", label: "Scholars Funded", icon: "🎓" },
];

// ── Apply page ──
export interface NGOApplyContent {
  heading: string;
  subtitle: string;
  benefits: { icon: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

export const defaultNGOApply: NGOApplyContent = {
  heading: "Apply for Chess Support",
  subtitle:
    "Every child deserves the chance to learn chess. Fill out our application and we'll match you with the right program — completely free.",
  benefits: [
    { icon: "♟", title: "Free Equipment", desc: "Chess sets, boards, clocks & materials" },
    { icon: "🏫", title: "School Programs", desc: "Regular coaching at your school" },
    { icon: "🎓", title: "Scholarships", desc: "Funded spots at PiChess Academy" },
    { icon: "🤝", title: "Mentorship", desc: "Paired with experienced players" },
  ],
  faqs: [
    { q: "Who can apply?", a: "Anyone aged 5-25 who wants to learn or improve their chess skills. We prioritise applicants from underserved communities." },
    { q: "Is there a fee?", a: "No. All PiChess Foundation programs are completely free. We cover equipment, coaching, and tournament fees." },
    { q: "How long until I hear back?", a: "We review applications weekly. You'll receive an email response within 7 working days." },
    { q: "What if I don't have equipment?", a: "Don't worry! If accepted, we provide everything you need — chess set, board, workbook, and clock." },
    { q: "Can a parent apply on behalf of a child?", a: "Absolutely. Fill in the child's details and your own in the guardian section." },
  ],
};

// ── Volunteer page ──
export interface NGOVolunteerContent {
  heading: string;
  subtitle: string;
  benefits: { icon: string; title: string; desc: string }[];
}

export const defaultNGOVolunteer: NGOVolunteerContent = {
  heading: "Volunteer",
  subtitle:
    "Share your passion, skills, and time to help us bring chess to more children across Ghana.",
  benefits: [
    { icon: "❤️", title: "Make Impact", desc: "Directly change children's lives through chess" },
    { icon: "🌱", title: "Learn & Grow", desc: "Develop leadership and coaching skills" },
    { icon: "🤝", title: "Join Community", desc: "Be part of Ghana's chess movement" },
  ],
};

// ── Donate page ──
export interface NGODonateContent {
  heading: string;
  subtitle: string;
  tiers: { amount: string; desc: string }[];
  momoDetails: string;
  bankDetails: string;
  materialNote: string;
}

export const defaultNGODonate: NGODonateContent = {
  heading: "Make a Donation",
  subtitle:
    "Every donation goes directly to providing chess equipment, training, and opportunities for underprivileged youth in Ghana.",
  tiers: [
    { amount: "GH₵ 10", desc: "Buys chess materials for 1 child" },
    { amount: "GH₵ 50", desc: "Sponsors 1 month of training" },
    { amount: "GH₵ 100", desc: "Provides a full chess set" },
    { amount: "GH₵ 200", desc: "Sponsors a tournament entry" },
    { amount: "GH₵ 500", desc: "Funds a 3-month program" },
    { amount: "Any amount", desc: "Every cedi makes a difference" },
  ],
  momoDetails: "MTN MoMo: 0XX XXX XXXX\nName: PiChess Foundation\nReference: DONATE",
  bankDetails: "GCB Bank\nAccount Name: PiChess Foundation Ltd\nAccount No: XXXX XXXX XXXX",
  materialNote: "We also accept chess sets, boards, clocks, and books in good condition.",
};

// ── Stories page ──
export interface NGOStoriesContent {
  heading: string;
  subtitle: string;
  galleryImages: { src: string; alt: string }[];
  impactQuotes: { quote: string; name: string; location: string }[];
}

export const defaultNGOStoriesContent: NGOStoriesContent = {
  heading: "Every Move Tells a Story",
  subtitle:
    "Real stories from the children, families, and communities transformed by chess. Every story is a testament to the power of the royal game.",
  galleryImages: [
    { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80", alt: "Community gathering" },
    { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80", alt: "Children learning" },
    { src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&q=80", alt: "Chess lesson" },
    { src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80", alt: "Charity event" },
    { src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80", alt: "Young players" },
    { src: "https://images.unsplash.com/photo-1547347298-4f21aa2dfaee?w=600&q=80", alt: "Tournament" },
    { src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80", alt: "Volunteers" },
    { src: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&q=80", alt: "School program" },
  ],
  impactQuotes: [
    { quote: "Chess saved me from the streets. Now I dream of becoming a Grandmaster.", name: "Kofi, 13", location: "Nima, Accra" },
    { quote: "My children have somewhere safe to go after school now. It means everything.", name: "Ama, Parent", location: "Kumasi" },
    { quote: "The scholarship changed my entire future. I never imagined this was possible.", name: "Adjoa, 16", location: "Tamale" },
  ],
};

// ── Mission page CTA ──
export interface NGOCTA {
  heading: string;
  headingHighlight: string;
  description: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
  cta3Text: string;
  cta3Link: string;
}

export const defaultNGOCTA: NGOCTA = {
  heading: "Ready to Make a",
  headingHighlight: "Difference",
  description:
    "Whether you donate, volunteer, or simply share our story — every action helps put a chess board in front of a child who needs it.",
  cta1Text: "Donate Now ❤️",
  cta1Link: "/ngo/donate",
  cta2Text: "Volunteer With Us",
  cta2Link: "/ngo/volunteer",
  cta3Text: "Apply for Support",
  cta3Link: "/ngo/apply",
};

// ── Programs page hero ──
export interface NGOProgramsHero {
  badge: string;
  title: string;
  titleHighlight: string;
  titleEnd: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  sectionBadge: string;
  sectionHeading: string;
  sectionDescription: string;
}

export const defaultNGOProgramsHero: NGOProgramsHero = {
  badge: "Our Programs",
  title: "Changing Lives,",
  titleHighlight: "One Move",
  titleEnd: "at a Time",
  subtitle: "From free equipment to scholarships, our six programs work together to ensure every child in Ghana has access to chess — and the life skills it teaches.",
  backgroundImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80",
  ctaText: "Explore Programs ↓",
  ctaLink: "#programs",
  secondaryCtaText: "Apply for Support",
  secondaryCtaLink: "/ngo/apply",
  sectionBadge: "What We Do",
  sectionHeading: "Our Six Programs",
  sectionDescription: "Each program tackles a specific barrier that prevents children from accessing chess education. Together, they form a complete support system.",
};

// ── Mission page hero ──
export interface NGOMissionHero {
  badge: string;
  heading: string;
  headingHighlight: string;
  subtitle: string;
  backgroundImage: string;
}

export const defaultNGOMissionHero: NGOMissionHero = {
  badge: "Our Mission",
  heading: "Empowering Youth Through",
  headingHighlight: "the Royal Game",
  subtitle: "We bring chess to underserved communities across Ghana, using it as a tool for education, discipline, and opportunity.",
  backgroundImage: "https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=1600&q=80",
};
