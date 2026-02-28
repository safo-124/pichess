import AcademyNav from "@/components/academy/AcademyNav";
import ScrollPawn from "@/components/shared/ScrollPawn";
import Link from "next/link";

export const metadata = { title: "Academy | PiChess" };

function AcademyFooter() {
  return (
    <footer className="bg-[#060a14] border-t border-white/[0.06] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-black text-white shadow-md shadow-amber-500/20">♛</div>
            <div>
              <span className="font-black text-white text-sm">PiChess <span className="text-amber-400">Academy</span></span>
              <span className="text-white/20 mx-2">·</span>
              <span className="text-white/30 text-xs">Train. Compete. Conquer.</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-white/35 text-sm">
            <Link href="/academy/enquire" className="hover:text-amber-400 transition-colors">Enquire</Link>
            <Link href="/academy/team" className="hover:text-amber-400 transition-colors">Team</Link>
            <Link href="/academy/tournaments" className="hover:text-amber-400 transition-colors">Tournaments</Link>
            <Link href="/" className="hover:text-white transition-colors">← Main Site</Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/[0.04] text-center text-xs text-white/20">
          © {new Date().getFullYear()} PiChess Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060a14] text-white flex flex-col">
      <AcademyNav />
      <ScrollPawn color="#f59e0b" />
      <main className="flex-1">{children}</main>
      <AcademyFooter />
    </div>
  );
}
