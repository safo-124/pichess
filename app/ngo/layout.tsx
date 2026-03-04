import NGONav from "@/components/ngo/NGONav";
import ScrollPawn from "@/components/shared/ScrollPawn";
import MainFooter from "@/components/main/MainFooter";
import { getSiteContent } from "@/lib/actions/admin";

export const metadata = { title: "Foundation | PiChess NGO" };

export default async function NGOLayout({ children }: { children: React.ReactNode }) {
  let footerData = null;
  try {
    const raw = await getSiteContent("site_footer");
    if (raw) footerData = JSON.parse(raw);
  } catch {}

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col">
      <NGONav />
      <ScrollPawn color="#2e7d5b" light />
      <main className="flex-1">{children}</main>
      <MainFooter footerData={footerData} />
    </div>
  );
}
