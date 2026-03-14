import prisma from "@/lib/prisma";
import NGOStoriesPage from "@/components/ngo/NGOStoriesPage";

export const metadata = {
  title: "Our Stories | PiChess Foundation",
  description:
    "Read inspiring stories from children, families, and communities transformed through chess. Every move tells a story at PiChess Foundation.",
};

export default async function StoriesPage() {
  let stories: any[] = [];
  try {
    stories = await prisma.nGO_Story.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch stories:", error);
  }

  return (
    <NGOStoriesPage
      stories={stories.map((s) => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
      }))}
    />
  );
}
