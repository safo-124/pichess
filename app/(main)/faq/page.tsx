import { getSiteContent } from "@/lib/actions/admin";
import { defaultFAQContent, type FAQPageContent } from "@/lib/faq-content";
import FAQClient from "./FAQClient";

export const metadata = {
  title: "FAQ | PiChess",
  description: "Find answers to frequently asked questions about PiChess Academy, Foundation, tournaments, shop, and more.",
};

export default async function FAQPage() {
  const raw = await getSiteContent("faq_content");
  let content: FAQPageContent = defaultFAQContent;
  if (raw) {
    try { content = JSON.parse(raw) as FAQPageContent; } catch { /* use default */ }
  }

  return <FAQClient content={content} />;
}
