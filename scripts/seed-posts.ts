/* eslint-disable @typescript-eslint/no-explicit-any */
import "dotenv/config";
import prisma from "../lib/prisma";

const POSTS = [
  {
    title: "PiChess Ghana Hosts Largest Regional Tournament Yet",
    slug: "pichess-largest-regional-tournament-" + Date.now().toString(36),
    content: `PiChess Ghana made history this weekend by hosting its largest regional chess tournament to date, bringing together over 150 players from across the Greater Accra, Ashanti, and Western regions.

The three-day event, held at the Accra International Conference Centre, featured categories ranging from Under-10 juniors to Open Masters. International arbiter Kwame Mensah oversaw nearly 600 individual games throughout the competition.

"This is a watershed moment for Ghanaian chess," said PiChess founder at the opening ceremony. "When we started this journey, we dreamed of bringing world-class chess events to Ghana. Today, that dream is becoming reality."

Highlights included a stunning comeback by 14-year-old Ama Darko in the Junior Girls category, where she recovered from a first-round loss to win five consecutive games and claim the gold medal. In the Open Masters section, defending champion Emmanuel Osei-Tutu retained his title after a dramatic final-round victory.

The tournament also featured simultaneous exhibitions by visiting Grandmaster from Nigeria, workshops on chess strategy, and a special ceremony honoring local chess educators.

Registration for next quarter's National Championship is now open on our website.`,
    excerpt: "Over 150 players competed in our biggest event yet, with stunning performances across all categories.",
    image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&h=500&fit=crop&q=80",
    type: "news",
    tags: ["tournament", "competition", "accra"],
    published: true,
  },
  {
    title: "5 Opening Strategies Every Beginner Should Master",
    slug: "5-opening-strategies-beginners-" + Date.now().toString(36),
    content: `If you're just starting your chess journey, the opening can feel overwhelming. With hundreds of named openings and thousands of variations, where do you even begin?

The good news is that you don't need to memorize long theoretical lines. Instead, focus on understanding these five fundamental opening principles that will serve you well at every level.

1. Control the Center
The four central squares (e4, d4, e5, d5) are the most important real estate on the board. Pieces placed in or near the center control more squares and have greater mobility. Start by advancing your e-pawn and d-pawn, then develop pieces toward the center.

2. Develop Your Pieces Early
Get your knights and bishops into the game within the first few moves. Each piece sitting on its starting square is a piece not contributing to your position. Aim to develop at least three minor pieces before move 10.

3. Castle Early for King Safety
Castling tucks your king behind a wall of pawns and activates your rook. In most games, you should castle within the first 10 moves. Delaying castling often leads to tactical vulnerabilities.

4. Don't Move the Same Piece Twice
Unless there's a specific tactical reason, avoid moving the same piece multiple times in the opening. Each move should bring a new piece into the game or improve your pawn structure.

5. Connect Your Rooks
Once you've castled and developed your minor pieces, your rooks should be able to "see" each other along the back rank. This means your development is complete, and you're ready for the middlegame.

Practice these principles in your games at the PiChess Academy, and you'll see rapid improvement in your results!`,
    excerpt: "Master these five fundamental opening principles and watch your game improve dramatically.",
    image: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=800&h=500&fit=crop&q=80",
    type: "blog",
    tags: ["strategy", "beginners", "tips", "academy"],
    published: true,
  },
  {
    title: "The Impact of Chess Education on Academic Performance in Ghana",
    slug: "chess-education-academic-performance-ghana-" + Date.now().toString(36),
    content: `A growing body of evidence suggests that chess education can significantly improve academic outcomes for children, and a new study conducted in partnership with PiChess Ghana adds compelling local data to this global conversation.

The Research
Over the 2024-2025 academic year, researchers tracked 200 students across five schools in Accra. Half received weekly chess instruction through the PiChess Foundation's school outreach program, while the control group followed their standard curriculum.

Key Findings
Students who received chess instruction showed measurable improvements in several areas:

Mathematics: Chess students improved their math scores by an average of 18% compared to 7% in the control group. Spatial reasoning and pattern recognition — skills central to both chess and mathematics — showed the strongest gains.

Reading Comprehension: Perhaps surprisingly, chess students also showed a 12% improvement in reading comprehension scores. Researchers attribute this to the sequential thinking and analytical skills that chess develops.

Concentration and Behavior: Teachers reported that students in the chess program demonstrated improved attention spans and fewer behavioral incidents. "The discipline required in chess seems to transfer to classroom behavior," noted one participating teacher.

Critical Thinking: When given novel problem-solving tasks, chess-trained students were 23% more likely to arrive at correct solutions and showed greater persistence when faced with difficult problems.

Why Chess Works
Chess is unique among educational interventions because it simultaneously engages multiple cognitive skills: pattern recognition, forward planning, memory, concentration, and decision-making under pressure. Unlike many academic subjects, students are intrinsically motivated to improve because chess is inherently enjoyable.

Dr. Adjei, the study's lead researcher, noted: "Chess provides a structured environment where making mistakes is part of learning. Children develop resilience and analytical thinking in a context that feels like play rather than work."

The Path Forward
Based on these findings, PiChess Foundation is expanding its school outreach program to 15 additional schools in 2026. The foundation is also developing a teacher training program to equip educators with the skills to integrate chess into their existing curricula.

If you'd like to bring chess education to your school, contact the PiChess Foundation through our website.`,
    excerpt: "New research from Accra schools reveals that chess instruction leads to significant gains in math, reading, and critical thinking skills.",
    image: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&h=500&fit=crop&q=80",
    type: "article",
    tags: ["education", "research", "foundation", "impact"],
    published: true,
  },
];

async function seed() {
  console.log("Seeding posts...");
  for (const post of POSTS) {
    const existing = await (prisma as any).content_Post.findFirst({ where: { title: post.title } });
    if (existing) {
      console.log(`  ⏭ Already exists: ${post.title}`);
      continue;
    }
    await (prisma as any).content_Post.create({ data: post });
    console.log(`  ✅ Created: ${post.title} (${post.type})`);
  }
  console.log("Done!");
}

seed()
  .catch(console.error)
  .finally(() => (prisma as any).$disconnect());
