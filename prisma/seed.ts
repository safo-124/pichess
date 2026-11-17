import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─── Categories ────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "chess-sets" }, update: {}, create: { name: "Chess Sets", slug: "chess-sets" } }),
    prisma.category.upsert({ where: { slug: "books" }, update: {}, create: { name: "Books", slug: "books" } }),
    prisma.category.upsert({ where: { slug: "accessories" }, update: {}, create: { name: "Accessories", slug: "accessories" } }),
  ]);
  console.log(`✅ ${categories.length} categories`);

  // ─── Products ──────────────────────────────────────────────────────────────
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 1 }, update: {},
      create: { name: "Tournament Chess Set", description: "Standard wooden chess set for tournaments", price: 120, inStock: true, featured: true, categoryId: categories[0].id },
    }),
    prisma.product.upsert({
      where: { id: 2 }, update: {},
      create: { name: "Chess Fundamentals by Capablanca", description: "Classic chess book for beginners", price: 45, inStock: true, featured: false, categoryId: categories[1].id },
    }),
    prisma.product.upsert({
      where: { id: 3 }, update: {},
      create: { name: "Digital Chess Clock", description: "DGT 2010 tournament clock", price: 200, inStock: true, featured: true, categoryId: categories[2].id },
    }),
  ]);
  console.log(`✅ ${products.length} products`);

  // ─── Academy Team ──────────────────────────────────────────────────────────
  const team = await Promise.all([
    prisma.academy_Team.upsert({
      where: { id: 1 }, update: {},
      create: { name: "GM Emmanuel Quartey", role: "Head Coach", bio: "International Master with 20 years of coaching experience.", order: 1, published: true },
    }),
    prisma.academy_Team.upsert({
      where: { id: 2 }, update: {},
      create: { name: "FM Abena Mensah", role: "Academy Director", bio: "Former national champion and chess educator.", order: 2, published: true },
    }),
    prisma.academy_Team.upsert({
      where: { id: 3 }, update: {},
      create: { name: "CM Kwame Boateng", role: "Junior Coach", bio: "Specializes in youth development and online coaching.", order: 3, published: true },
    }),
  ]);
  console.log(`✅ ${team.length} academy team members`);

  // ─── Testimonials ──────────────────────────────────────────────────────────
  const testimonials = await Promise.all([
    prisma.academy_Testimonial.upsert({
      where: { id: 1 },
      update: {
        content: "Pi Chess Academy transformed my game. I went from beginner to winning regional competitions in 6 months!",
      },
      create: { name: "Ama Sarpong", content: "Pi Chess Academy transformed my game. I went from beginner to winning regional competitions in 6 months!", rating: 5, program: "Intermediate Program", published: true },
    }),
    prisma.academy_Testimonial.upsert({
      where: { id: 2 }, update: {},
      create: { name: "Kofi Asante", content: "The coaches here are world-class. My son improved dramatically and now represents our school.", rating: 5, program: "Youth Development", published: true },
    }),
  ]);
  console.log(`✅ ${testimonials.length} testimonials`);

  // ─── Tournaments ──────────────────────────────────────────────────────────
  const tournaments = await Promise.all([
    prisma.tournament.upsert({
      where: { id: 1 },
      update: {
        title: "Pi Chess National Rapid & Open 2026",
        description: "Ghana's premier open chess championship in Accra. Open, Intermediate, and Junior sections welcome.",
        date: new Date("2026-12-12"),
        location: "Accra, Ghana",
        venue: "Accra Sports Stadium / Osu Centre",
        flyer: "/uploads/1775035492024-Google_festival.jpg",
        registrationLink: null,
        tags: ["open", "national", "accra"],
        status: "UPCOMING",
        featured: true,
        maxSpots: 64,
      },
      create: {
        title: "Pi Chess National Rapid & Open 2026",
        description: "Ghana's premier open chess championship in Accra. Open, Intermediate, and Junior sections welcome.",
        date: new Date("2026-12-12"),
        location: "Accra, Ghana",
        venue: "Accra Sports Stadium / Osu Centre",
        flyer: "/uploads/1775035492024-Google_festival.jpg",
        tags: ["open", "national", "accra"],
        status: "UPCOMING",
        featured: true,
        maxSpots: 64,
      },
    }),
    prisma.tournament.upsert({
      where: { id: 2 },
      update: {
        title: "Pi Chess Academy Juniors Cup 2027",
        description: "Fun, friendly competitive tournament for academy students and school players aged 5–17.",
        date: new Date("2027-01-24"),
        location: "Accra, Ghana",
        venue: "Pi Chess Academy Hub, Accra",
        flyer: "/uploads/1778865742192-CLP_PICHESS.jpg",
        tags: ["academy", "juniors", "kids"],
        status: "UPCOMING",
        featured: true,
        maxSpots: 40,
      },
      create: {
        title: "Pi Chess Academy Juniors Cup 2027",
        description: "Fun, friendly competitive tournament for academy students and school players aged 5–17.",
        date: new Date("2027-01-24"),
        location: "Accra, Ghana",
        venue: "Pi Chess Academy Hub, Accra",
        flyer: "/uploads/1778865742192-CLP_PICHESS.jpg",
        tags: ["academy", "juniors", "kids"],
        status: "UPCOMING",
        featured: true,
        maxSpots: 40,
      },
    }),
    prisma.tournament.upsert({
      where: { id: 3 }, update: {},
      create: {
        title: "NGO Community Chess Day",
        description: "Free chess tournament for underprivileged youth across Ghana.",
        date: new Date("2025-08-05"),
        location: "Takoradi, Ghana",
        venue: "Community Centre",
        tags: ["ngo", "community", "free"],
        status: "COMPLETED",
        featured: false,
      },
    }),
  ]);
  console.log(`✅ ${tournaments.length} tournaments`);

  // ─── Partners ──────────────────────────────────────────────────────────────
  const partners = await Promise.all([
    prisma.partner.upsert({ where: { id: 1 }, update: {}, create: { name: "Ghana Chess Federation", website: "https://gcf.gov.gh", order: 1 } }),
    prisma.partner.upsert({ where: { id: 2 }, update: {}, create: { name: "Ministry of Youth & Sports", order: 2 } }),
    prisma.partner.upsert({ where: { id: 3 }, update: {}, create: { name: "Chess in Schools Ghana", order: 3 } }),
  ]);
  console.log(`✅ ${partners.length} partners`);

  // ─── Daily Puzzle ──────────────────────────────────────────────────────────
  await prisma.daily_Puzzle.upsert({
    where: { id: 1 }, update: {},
    create: {
      title: "Smothered Mate",
      fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
      solution: "Nd5",
      difficulty: "MEDIUM",
      description: "Find the best move for White. Hint: Think about domination.",
      published: true,
    },
  });
  console.log("✅ 1 daily puzzle");

  console.log("\n✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
