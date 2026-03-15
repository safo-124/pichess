import { getSiteContent } from "@/lib/actions/admin";
import { defaultFAQContent, type FAQPageContent } from "@/lib/faq-content";
import AdminFAQManager from "@/components/admin/AdminFAQManager";

export const metadata = { title: "FAQ Manager | Admin" };

export default async function AdminFAQPage() {
  const raw = await getSiteContent("faq_content");
  let content: FAQPageContent = defaultFAQContent;
  if (raw) {
    try { content = JSON.parse(raw) as FAQPageContent; } catch { /* use default */ }
  }

  return <AdminFAQManager initialData={content} />;
}
