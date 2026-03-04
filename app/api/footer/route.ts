import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_FOOTER = {
  description:
    "Ghana's premier chess platform — training champions, building communities, and inspiring the next generation of strategic thinkers.",
  contact: {
    email: "info@pichess.com",
    phone: "+233 XX XXX XXXX",
    location: "Accra, Ghana",
  },
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    tiktok: "",
    linkedin: "",
  },
  hours: "Mon – Sat: 9 AM – 6 PM",
  cta: "Join the PiChess community and elevate your game today.",
  copyright: "PiChess. All rights reserved.",
};

export async function GET() {
  try {
    const row = await (prisma as any).siteContent.findUnique({
      where: { key: "site_footer" },
    });
    if (row?.value) {
      return NextResponse.json({ ...DEFAULT_FOOTER, ...JSON.parse(row.value) });
    }
    return NextResponse.json(DEFAULT_FOOTER);
  } catch {
    return NextResponse.json(DEFAULT_FOOTER);
  }
}
