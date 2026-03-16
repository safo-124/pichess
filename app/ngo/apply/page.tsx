import ApplyPage from "@/components/ngo/NGOApplyPage";
import { getSiteContent } from "@/lib/actions/admin";
import { defaultNGOApply, type NGOApplyContent } from "@/lib/ngo-content";

export const metadata = {
  title: "Partner with Us | PiChess Foundation",
  description:
    "Apply for free chess equipment, coaching, scholarships, and mentorship through the PiChess Foundation.",
};

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export default async function ApplyPageWrapper() {
  const raw = await getSiteContent("ngo_apply");
  const content = parse<NGOApplyContent>(raw, defaultNGOApply);
  return <ApplyPage content={content} />;
}
