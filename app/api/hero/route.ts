/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_HERO = {
  background: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1600&h=900&fit=crop&q=80",
  images: [
    { src: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&h=700&fit=crop&q=80", alt: "Kids learning chess together" },
    { src: "https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=600&h=400&fit=crop&q=80", alt: "Chess pieces during a game" },
    { src: "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=600&h=700&fit=crop&q=80", alt: "Young player concentrating" },
    { src: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=600&h=400&fit=crop&q=80", alt: "Chess coach teaching" },
  ],
  headline: "Where Every Move",
  headlineAccent: "Matters.",
  subtitle: "A world-class chess academy, a life-changing foundation, and a thriving community — all united by the world's greatest game.",
  stats: [
    { val: "500+", label: "Students" },
    { val: "50+", label: "Events" },
    { val: "15+", label: "Coaches" },
  ],
};

export async function GET() {
  try {
    const row = await (prisma as any).siteContent.findUnique({ where: { key: "home_hero" } });
    const data = row?.value ? JSON.parse(row.value) : DEFAULT_HERO;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(DEFAULT_HERO);
  }
}
