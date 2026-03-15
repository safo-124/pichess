import prisma from "@/lib/prisma";
import NGOStoriesPage from "@/components/ngo/NGOStoriesPage";
import { getSiteContent } from "@/lib/actions/admin";
import { defaultNGOStoriesContent, type NGOStoriesContent } from "@/lib/ngo-content";

export const metadata = {
  title: "Our Stories | PiChess Foundation",
  description:
    "Read inspiring stories from children, families, and communities transformed through chess. Every move tells a story at PiChess Foundation.",
};

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export default async function StoriesPage() {
  const [stories, contentRaw] = await Promise.all([
    prisma.nGO_Story.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
    getSiteContent("ngo_stories_content"),
  ]);

  const content = parse<NGOStoriesContent>(contentRaw, defaultNGOStoriesContent);

  return (
    <NGOStoriesPage
      stories={stories.map((s) => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
      }))}
      content={content}
    />
  );
}
