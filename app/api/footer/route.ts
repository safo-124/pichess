import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_FOOTER = {
  description:
    "Building Minds Through Chess — structured chess lessons for kids, teens, adults, and schools across Accra and online.",
  contact: {
    email: "officialpichess@gmail.com",
    phone: "+233 55 453 4646",
    location: "Accra, Ghana",
  },
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    tiktok: "",
    linkedin: "",
    whatsapp: "",
  },
  hours: "Mon – Sat: 9 AM – 6 PM",
  cta: "Join the Pi Chess community and elevate your game today.",
  copyright: "Pi Chess. All rights reserved.",
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
