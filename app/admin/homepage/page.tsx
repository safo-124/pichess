/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import AdminHeroManager from "@/components/admin/AdminHeroManager";

export const metadata = { title: "Homepage | Admin" };

async function getHeroData() {
  try {
    const row = await (prisma as any).siteContent.findUnique({ where: { key: "home_hero" } });
    return row?.value ? JSON.parse(row.value) : null;
  } catch {
    return null;
  }
}

export default async function AdminHomepagePage() {
  const heroData = await getHeroData();
  return <AdminHeroManager initialData={heroData} />;
}
