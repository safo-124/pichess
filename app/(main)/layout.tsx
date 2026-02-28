import MainNav from "@/components/main/MainNav";
import MainFooter from "@/components/main/MainFooter";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar — isolated stacking context so nothing can cover it */}
      <nav
        className="fixed top-0 left-0 right-0 z-[9999]"
        style={{ isolation: "isolate" }}
      >
        <MainNav />
      </nav>
      <main>{children}</main>
      <MainFooter />
    </div>
  );
}
