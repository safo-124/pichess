import AcademyNav from "@/components/academy/AcademyNav";
import ScrollPawn from "@/components/shared/ScrollPawn";
import MainFooter from "@/components/main/MainFooter";
import { getSiteContent } from "@/lib/actions/admin";

export const metadata = { title: "Academy | PiChess" };

export default async function AcademyLayout({ children }: { children: React.ReactNode }) {
  let footerData = null;
  let logoUrl = "";
  try {
    const raw = await getSiteContent("site_footer");
    if (raw) footerData = JSON.parse(raw);
    
    const rawLogo = await getSiteContent("site_logo");
    if (rawLogo) {
      const parsed = JSON.parse(rawLogo);
      logoUrl = parsed.logoUrl || "";
    }
  } catch {}

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <AcademyNav logoUrl={logoUrl} />
      <ScrollPawn color="#c9a84c" />
      <main className="flex-1">{children}</main>
      <MainFooter footerData={footerData} />
    </div>
  );
}
