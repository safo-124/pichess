 
import prisma from "@/lib/prisma";
import AdminHeroManager from "@/components/admin/AdminHeroManager";

export const metadata = { title: "Homepage | Admin" };

const defaultHomeStats = [
  { end: 500, suffix: "+", label: "Students Trained", href: "/academy", ariaLabel: "View Pi Chess Academy programs" },
  { end: 50, suffix: "+", label: "Tournaments Hosted", href: "/tournaments", ariaLabel: "View Pi Chess tournaments" },
  { end: 200, suffix: "+", label: "Lives Impacted", href: "/ngo", ariaLabel: "View Pi Chess Foundation impact" },
  { end: 15, suffix: "", label: "Expert Coaches", href: "/academy/team", ariaLabel: "Meet the Pi Chess expert coaches" },
];

async function getHeroData() {
  try {
    const row = await (prisma as any).siteContent.findUnique({ where: { key: "home_hero" } });
    return row?.value ? JSON.parse(row.value) : null;
  } catch {
    return null;
  }
}

async function getHomeStats() {
  try {
    const row = await (prisma as any).siteContent.findUnique({ where: { key: "home_stats" } });
    return row?.value ? JSON.parse(row.value) : defaultHomeStats;
  } catch {
    return defaultHomeStats;
  }
}

export default async function AdminHomepagePage() {
  const [heroData, homeStats] = await Promise.all([
    getHeroData(),
    getHomeStats(),
  ]);

  return <AdminHeroManager initialData={heroData} initialHomeStats={homeStats} />;
}
