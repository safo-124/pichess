/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import AdminNewsManager from "@/components/admin/AdminNewsManager";

export const metadata = { title: "Content | Admin" };

async function getData() {
  try {
    const [posts, subscribers] = await Promise.all([
      (prisma as any).content_Post.findMany({
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
      }),
      (prisma as any).subscriber.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    return {
      posts: JSON.parse(JSON.stringify(posts)),
      subscribers: JSON.parse(JSON.stringify(subscribers)),
    };
  } catch { return { posts: [], subscribers: [] }; }
}

export default async function AdminContentPage() {
  const { posts, subscribers } = await getData();
  return <AdminNewsManager initialPosts={posts} initialSubscribers={subscribers} />;
}
  );
}
