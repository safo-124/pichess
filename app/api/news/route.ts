/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await (prisma as any).content_Post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    });
    return NextResponse.json({ posts: JSON.parse(JSON.stringify(posts)) });
  } catch {
    return NextResponse.json({ posts: [] });
  }
}
