import { getSiteContent } from "@/lib/actions/admin";
import { defaultContactContent } from "@/lib/contact-content";
import type { ContactPageContent } from "@/lib/contact-content";
import ContactPage from "@/components/main/ContactPage";

export default async function ContactPageRoute() {
  let content: ContactPageContent = defaultContactContent;
  try {
    const raw = await getSiteContent("contact_content");
    if (raw) content = { ...defaultContactContent, ...JSON.parse(raw) };
  } catch {
    /* fallback to defaults */
  }
  return <ContactPage content={content} />;
}
