import { getSiteContent } from "@/lib/actions/admin";
import { defaultContactContent, type ContactPageContent } from "@/lib/contact-content";
import AdminContactEditor from "@/components/admin/AdminContactEditor";

export const metadata = { title: "Contact Page | Admin" };

export default async function AdminContactPage() {
  const raw = await getSiteContent("contact_content");
  let content: ContactPageContent = defaultContactContent;
  if (raw) {
    try { content = { ...defaultContactContent, ...JSON.parse(raw) }; } catch { /* use default */ }
  }

  return <AdminContactEditor initialData={content} />;
}
