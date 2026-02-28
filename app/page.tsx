// The root / page renders the (main) homepage content wrapped in its layout.
// We import the layout pieces directly since app/page.tsx uses root layout, not (main)/layout.tsx.
import MainNav from "@/components/main/MainNav";
import MainFooter from "@/components/main/MainFooter";
import ScrollPawn from "@/components/shared/ScrollPawn";
import FloatingPieces from "@/components/shared/FloatingPieces";
import HomePage from "./(main)/page";

export default function RootPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <MainNav />
      <FloatingPieces />
      <ScrollPawn />
      <main>
        <HomePage />
      </main>
      <MainFooter />
    </div>
  );
}
