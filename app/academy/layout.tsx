import AcademyNav from "@/components/academy/AcademyNav";
import Link from "next/link";

export const metadata = { title: "Academy | PiChess" };

function AcademyFooter() {
  return (
    <footer className="bg-zinc-950 border-t border-[#c9a84c]/20 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-black text-[#c9a84c]">PiChess Academy</span>
          <span className="text-white/30">–</span>
          <span className="text-white/40">Train. Compete. Conquer.</span>
        </div>
        <div className="flex items-center gap-4 text-white/40">
          <Link href="/academy/enquire" className="hover:text-[#c9a84c] transition-colors">Enquire</Link>
          <Link href="/academy/team" className="hover:text-[#c9a84c] transition-colors">Team</Link>
          <Link href="/" className="hover:text-white transition-colors">← Main Site</Link>
        </div>
      </div>
    </footer>
  );
}

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <AcademyNav />
      <main className="flex-1">{children}</main>
      <AcademyFooter />
    </div>
  );
}
