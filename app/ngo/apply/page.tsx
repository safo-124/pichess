import ApplyPage from "@/components/ngo/NGOApplyPage";
import { getSiteContent } from "@/lib/actions/admin";
import { defaultNGOApply, type NGOApplyContent } from "@/lib/ngo-content";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Partner with Us | PiChess Foundation",
  description:
    "Apply for free chess equipment, coaching, scholarships, and mentorship through the PiChess Foundation.",
};

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Partial<T>;
    return { ...fallback, ...parsed };
  } catch { return fallback; }
}

export default async function ApplyPageWrapper() {
  const [raw, partners] = await Promise.all([
    getSiteContent("ngo_apply"),
    prisma.partner.findMany({ orderBy: { order: "asc" } }).catch(() => []),
  ]);
  const content = parse<NGOApplyContent>(raw, defaultNGOApply);
  const merged: NGOApplyContent = {
    ...content,
    bottomCta: { ...defaultNGOApply.bottomCta, ...content.bottomCta },
    impactGallery: { ...defaultNGOApply.impactGallery, ...(content.impactGallery ?? {}), images: content.impactGallery?.images ?? defaultNGOApply.impactGallery.images },
    formSections: content.formSections ?? defaultNGOApply.formSections,
    formLabels: { ...defaultNGOApply.formLabels, ...(content.formLabels ?? {}) },
    chessLevels: content.chessLevels ?? defaultNGOApply.chessLevels,
  };
  return <ApplyPage content={merged} partners={partners} />;
}
