// ─── FAQ Types & Defaults ───────────────────────────────────────────────────

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  items: FAQItem[];
}

export interface FAQPageContent {
  heading: string;
  headingHighlight: string;
  subtitle: string;
  categories: FAQCategory[];
}

export const defaultFAQContent: FAQPageContent = {
  heading: "Frequently Asked",
  headingHighlight: "Questions",
  subtitle:
    "Find answers to common questions about PiChess — from our Academy and Foundation programs to tournaments, the shop, and more.",
  categories: [
    {
      id: "general",
      name: "General",
      icon: "🏠",
      color: "#c9a84c",
      items: [
        {
          id: "g1",
          question: "What is PiChess?",
          answer:
            "PiChess is Ghana's premier chess platform combining an Academy for chess education, a Foundation (NGO) for community impact, tournaments for competitive play, and a shop for chess equipment.",
        },
        {
          id: "g2",
          question: "Who can join PiChess?",
          answer:
            "Anyone! We welcome players of all ages and skill levels — from complete beginners to advanced competitors. Our programs are designed for children, teens, and adults alike.",
        },
        {
          id: "g3",
          question: "Where is PiChess located?",
          answer:
            "We are based in Accra, Ghana. We offer both in-person and online programs to reach chess enthusiasts across the country and beyond.",
        },
      ],
    },
    {
      id: "academy",
      name: "Academy",
      icon: "🎓",
      color: "#c9a84c",
      items: [
        {
          id: "a1",
          question: "How do I enroll in the Academy?",
          answer:
            "Visit our Academy page and click 'Enquire' to fill out the enrollment form. Our team will get back to you with lesson schedules, pricing, and next steps.",
        },
        {
          id: "a2",
          question: "What skill levels do you teach?",
          answer:
            "We offer lessons for all levels — Beginner, Intermediate, and Advanced. Each student is assessed and placed in the appropriate group for the best learning experience.",
        },
        {
          id: "a3",
          question: "Do you offer online lessons?",
          answer:
            "Yes! We provide both in-person and online chess lessons. Online sessions are conducted via video call with interactive chess boards.",
        },
      ],
    },
    {
      id: "ngo",
      name: "NGO / Foundation",
      icon: "💚",
      color: "#2e7d5b",
      items: [
        {
          id: "n1",
          question: "How can I partner with the Foundation?",
          answer:
            "Visit our Foundation page, go to 'Partner with Us', and fill out the application form. We review applications on a rolling basis and respond within 2\u20133 weeks.",
        },
        {
          id: "n2",
          question: "How can I volunteer with PiChess Foundation?",
          answer:
            "Head to the Volunteer page under our Foundation section. Fill out the volunteer form with your details and skills, and our team will match you with the right program.",
        },
        {
          id: "n3",
          question: "How do I make a donation?",
          answer:
            "You can donate via Mobile Money (MoMo) or bank transfer. Visit our Donate page for full payment details and donation tiers.",
        },
      ],
    },
    {
      id: "tournaments",
      name: "Tournaments",
      icon: "🏆",
      color: "#f59e0b",
      items: [
        {
          id: "t1",
          question: "How do I register for a tournament?",
          answer:
            "Visit the Tournaments page, find an upcoming event, and click the registration link. Some tournaments require a fee, while others are free to enter.",
        },
        {
          id: "t2",
          question: "Are tournaments open to all skill levels?",
          answer:
            "Yes! We organize events for beginners, intermediates, and advanced players. Each tournament listing specifies the eligible categories.",
        },
      ],
    },
    {
      id: "shop",
      name: "Shop",
      icon: "🛒",
      color: "#a855f7",
      items: [
        {
          id: "s1",
          question: "What products do you sell?",
          answer:
            "We sell chess boards, pieces, clocks, books, and branded PiChess merchandise. Check out our Shop page for the full catalog.",
        },
        {
          id: "s2",
          question: "Do you deliver across Ghana?",
          answer:
            "Yes, we deliver nationwide. Delivery times and fees vary by location. Details are provided at checkout.",
        },
      ],
    },
  ],
};
