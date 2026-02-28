import AcademyNav from "@/components/academy/AcademyNav";
import ScrollPawn from "@/components/shared/ScrollPawn";
import Link from "next/link";

export const metadata = { title: "Academy | PiChess" };

function AcademyFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#a8893d] flex items-center justify-center text-sm font-black text-white shadow-md shadow-[#c9a84c]/20">♛</div>
            <div>
              <span className="font-black text-gray-900 text-sm">PiChess <span className="text-[#c9a84c]">Academy</span></span>
              <span className="text-gray-300 mx-2">·</span>
              <span className="text-gray-400 text-xs">Train. Compete. Conquer.</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-gray-400 text-sm">
            <Link href="/academy/enquire" className="hover:text-[#c9a84c] transition-colors">Enquire</Link>
            <Link href="/academy/team" className="hover:text-[#c9a84c] transition-colors">Team</Link>
            <Link href="/academy/tournaments" className="hover:text-[#c9a84c] transition-colors">Tournaments</Link>
            <Link href="/" className="hover:text-gray-700 transition-colors">← Main Site</Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-300">
          © {new Date().getFullYear()} PiChess Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <AcademyNav />
      <ScrollPawn color="#c9a84c" />
      <main className="flex-1">{children}</main>
      <AcademyFooter />
    </div>
  );
}
