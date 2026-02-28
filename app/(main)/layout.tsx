import MainNav from "@/components/main/MainNav";
import MainFooter from "@/components/main/MainFooter";
import ScrollPawn from "@/components/shared/ScrollPawn";
import FloatingPieces from "@/components/shared/FloatingPieces";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <MainNav />

      {/* Floating parallax chess pieces in background */}
      <FloatingPieces />

      {/* Scroll-tracking pawn on the right edge */}
      <ScrollPawn />

      <main>{children}</main>
      <MainFooter />
    </div>
  );
}
