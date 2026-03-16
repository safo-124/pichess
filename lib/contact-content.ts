// ─── Contact page content types & defaults ───────────────────────────────────

export interface ContactHero {
  badge: string;
  heading: string;
  headingHighlight: string;
  subtitle: string;
}

export interface ContactItem {
  label: string;
  value: string;
  desc: string;
  href: string;
  iconType: "location" | "email" | "phone" | "academy" | "foundation";
  colorClass: string;
}

export interface ContactQuickLink {
  label: string;
  href: string;
  icon: string;
}

export interface ContactFAQ {
  q: string;
  a: string;
}

export interface ContactCTA {
  heading: string;
  description: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
}

export interface ContactMapInfo {
  location: string;
  subtitle: string;
}

export interface ContactPageContent {
  hero: ContactHero;
  contactItems: ContactItem[];
  quickLinks: ContactQuickLink[];
  faqs: ContactFAQ[];
  cta: ContactCTA;
  mapInfo: ContactMapInfo;
}

export const defaultContactContent: ContactPageContent = {
  hero: {
    badge: "Get In Touch",
    heading: "Let's",
    headingHighlight: "Connect",
    subtitle:
      "Whether you have questions about our academy, want to sponsor a tournament, or simply want to join the chess community — we'd love to hear from you.",
  },
  contactItems: [
    {
      label: "Visit Us",
      value: "Accra, Ghana",
      desc: "Our headquarters in the heart of Accra",
      href: "#",
      iconType: "location",
      colorClass: "bg-blue-50 text-blue-600",
    },
    {
      label: "Email Us",
      value: "hello@pichess.com",
      desc: "We respond within 24 hours",
      href: "mailto:hello@pichess.com",
      iconType: "email",
      colorClass: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "WhatsApp",
      value: "+233 XX XXX XXXX",
      desc: "Quick responses on WhatsApp",
      href: "https://wa.me/233XXXXXXXX",
      iconType: "phone",
      colorClass: "bg-green-50 text-green-600",
    },
    {
      label: "Academy",
      value: "academy@pichess.com",
      desc: "Enrollment & lesson inquiries",
      href: "mailto:academy@pichess.com",
      iconType: "academy",
      colorClass: "bg-purple-50 text-purple-600",
    },
    {
      label: "Foundation",
      value: "ngo@pichess.com",
      desc: "Donations & volunteer programs",
      href: "mailto:ngo@pichess.com",
      iconType: "foundation",
      colorClass: "bg-rose-50 text-rose-600",
    },
  ],
  quickLinks: [
    { label: "Academy Programs", href: "/academy", icon: "♟" },
    { label: "Tournaments", href: "/tournaments", icon: "🏆" },
    { label: "Foundation", href: "/ngo", icon: "❤️" },
    { label: "Shop", href: "/shop", icon: "🛍️" },
  ],
  faqs: [
    {
      q: "What age groups do you teach?",
      a: "We offer programs for all ages — from 5-year-olds in our Junior Academy to adult learners and competitive players. Each program is tailored to the appropriate skill level.",
    },
    {
      q: "How can I register for a tournament?",
      a: "Visit our Tournaments page to see upcoming events. Registration is available online with details about entry fees, categories, and schedules.",
    },
    {
      q: "Do you offer online classes?",
      a: "Yes! We provide both in-person and online chess instruction. Our online classes use interactive tools and video sessions with experienced coaches.",
    },
    {
      q: "How can I support the Foundation?",
      a: "You can donate, volunteer, or sponsor a child's chess education through our NGO page. Every contribution helps bring chess to underserved communities.",
    },
  ],
  cta: {
    heading: "Ready to Make Your Move?",
    description:
      "Join hundreds of chess enthusiasts across Ghana. Whether you're a beginner or a grandmaster, there's a place for you at PiChess.",
    cta1Text: "Join the Academy",
    cta1Link: "/academy",
    cta2Text: "View Tournaments",
    cta2Link: "/tournaments",
  },
  mapInfo: {
    location: "Accra, Ghana",
    subtitle: "PiChess Headquarters",
  },
};
