import MainNav from "@/components/main/MainNav";
import MainFooter from "@/components/main/MainFooter";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <MainNav />
      <main className="flex-1">{children}</main>
      <MainFooter />
    </div>
  );
}
