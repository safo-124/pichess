// The root / page renders the (main) homepage content wrapped in its layout.
// We import the layout pieces directly since app/page.tsx uses root layout, not (main)/layout.tsx.
import MainNav from "@/components/main/MainNav";
import MainFooter from "@/components/main/MainFooter";
import ScrollPawn from "@/components/shared/ScrollPawn";
import FloatingPieces from "@/components/shared/FloatingPieces";
import HomePage from "./(main)/page";
import { getSiteContent } from "@/lib/actions/admin";

export default async function RootPage() {
  let logoUrl = "";
  let footerData = null;
  try {
    const rawLogo = await getSiteContent("site_logo");
    if (rawLogo) {
      const parsed = JSON.parse(rawLogo);
      logoUrl = parsed.logoUrl || "";
    }
    const rawFooter = await getSiteContent("site_footer");
    if (rawFooter) footerData = JSON.parse(rawFooter);
  } catch {}

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <MainNav logoUrl={logoUrl} />
      <FloatingPieces />
      <ScrollPawn />
      <main>
        <HomePage />
      </main>
      <MainFooter footerData={footerData} />
    </div>
  );
}
