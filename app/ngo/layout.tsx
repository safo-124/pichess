import NGONav from "@/components/ngo/NGONav";
import Link from "next/link";

export const metadata = { title: "Foundation | PiChess NGO" };

function NGOFooter() {
  return (
    <footer className="bg-zinc-50 border-t border-[#2e7d5b]/20 text-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-black text-[#2e7d5b]">PiChess Foundation</span>
          <span className="text-zinc-300">–</span>
          <span className="text-zinc-400">Chess for Good.</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <Link href="/ngo/donate" className="hover:text-[#2e7d5b] transition-colors">Donate</Link>
          <Link href="/ngo/volunteer" className="hover:text-[#2e7d5b] transition-colors">Volunteer</Link>
          <Link href="/" className="hover:text-zinc-900 transition-colors">← Main Site</Link>
        </div>
      </div>
    </footer>
  );
}

export default function NGOLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col">
      <NGONav />
      <main className="flex-1">{children}</main>
      <NGOFooter />
    </div>
  );
}
