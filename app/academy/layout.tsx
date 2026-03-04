import AcademyNav from "@/components/academy/AcademyNav";
import ScrollPawn from "@/components/shared/ScrollPawn";
import MainFooter from "@/components/main/MainFooter";
import { getSiteContent } from "@/lib/actions/admin";

export const metadata = { title: "Academy | PiChess" };

export default async function AcademyLayout({ children }: { children: React.ReactNode }) {
  let footerData = null;
  try {
    const raw = await getSiteContent("site_footer");
    if (raw) footerData = JSON.parse(raw);
  } catch {}

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <AcademyNav />
      <ScrollPawn color="#c9a84c" />
      <main className="flex-1">{children}</main>
      <MainFooter footerData={footerData} />
    </div>
  );
}
