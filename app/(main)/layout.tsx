import MainNav from "@/components/main/MainNav";
import MainFooter from "@/components/main/MainFooter";
import ScrollPawn from "@/components/shared/ScrollPawn";
import FloatingPieces from "@/components/shared/FloatingPieces";
import { getSiteContent } from "@/lib/actions/admin";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  let footerData = null;
  try {
    const raw = await getSiteContent("site_footer");
    if (raw) footerData = JSON.parse(raw);
  } catch {}

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <MainNav />

      {/* Floating parallax chess pieces in background */}
      <FloatingPieces />

      {/* Scroll-tracking pawn on the right edge */}
      <ScrollPawn />

      <main>{children}</main>
      <MainFooter footerData={footerData} />
    </div>
  );
}
