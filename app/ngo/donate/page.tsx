import AnimatedSection from "@/components/shared/AnimatedSection";
import Link from "next/link";
import { getSiteContent } from "@/lib/actions/admin";
import { defaultNGODonate, type NGODonateContent } from "@/lib/ngo-content";
import {
  buildDonationWhatsAppUrl,
  buildWhatsAppUrl,
  PICHESS_EMAIL,
  PICHESS_PHONE_LOCAL,
} from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const metadata = { title: "Donate | Pi Chess Foundation" };

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

function hasRealPaymentDetails(value?: string | null): boolean {
  return Boolean(value && value.trim() && !/XXX|0XX/i.test(value));
}

export default async function DonatePage() {
  const raw = await getSiteContent("ngo_donate");
  const content = parse<NGODonateContent>(raw, defaultNGODonate);
  const showMomo = hasRealPaymentDetails(content.momoDetails);
  const showBank = hasRealPaymentDetails(content.bankDetails);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <span className="text-xs font-semibold text-[#2e7d5b] uppercase tracking-widest">Foundation</span>
          <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 mt-2 mb-3">{content.heading}</h1>
          <p className="text-zinc-500 max-w-lg mx-auto">
            {content.subtitle}
          </p>
        </AnimatedSection>

        {/* Impact Tiers — Tap any tier to pledge via WhatsApp */}
        <AnimatedSection delay={0.1} className="mb-12">
          <p className="text-center text-xs font-bold text-[#2e7d5b] uppercase tracking-wider mb-4">
            Tap any gift amount to pledge on WhatsApp
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {content.tiers.map((item) => (
              <a
                key={item.amount}
                href={buildDonationWhatsAppUrl(item.amount)}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl bg-[#d4ede3] border border-[#2e7d5b]/20 p-4 hover:border-[#2e7d5b] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <p className="font-black text-[#2e7d5b] text-lg">{item.amount}</p>
                  <p className="text-zinc-700 text-xs mt-1">{item.desc}</p>
                </div>
                <span className="mt-3 text-[11px] font-bold text-[#2e7d5b] group-hover:translate-x-0.5 transition-transform inline-block">
                  Give this amount →
                </span>
              </a>
            ))}
          </div>
        </AnimatedSection>

        {/* Donation methods */}
        <AnimatedSection delay={0.2}>
          <div className="rounded-2xl border border-[#2e7d5b]/20 bg-white shadow-sm overflow-hidden">
            <div className="p-8 border-b border-zinc-100">
              <h2 className="text-xl font-black text-zinc-900 mb-2">How to Donate</h2>
              <p className="text-zinc-500 text-sm">
                Message us on WhatsApp first to receive our verified MoMo or bank details and an official receipt.
              </p>
            </div>

            <div className="p-8 space-y-4">
              {/* Primary WhatsApp CTA */}
              <a
                href={buildDonationWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white p-5 shadow-lg shadow-[#25D366]/20 transition-all"
              >
                <span className="text-2xl">💬</span>
                <div>
                  <h3 className="font-black text-base">Donate via WhatsApp ({PICHESS_PHONE_LOCAL})</h3>
                  <p className="text-white/90 text-sm">Get verified MoMo / Bank details &amp; your official receipt immediately.</p>
                </div>
                <span className="ml-auto font-black text-sm shrink-0">Chat Now →</span>
              </a>

              {/* Mobile Money — only rendered if real details are configured */}
              {showMomo && (
                <div className="rounded-xl border border-[#2e7d5b]/20 bg-[#d4ede3]/50 p-5">
                  <h3 className="font-bold text-zinc-900 mb-1">📱 Mobile Money</h3>
                  <p className="text-zinc-500 text-sm mb-2">Send your donation via MoMo.</p>
                  <div className="bg-white rounded-lg p-3 font-mono text-sm text-zinc-700 border border-zinc-100 whitespace-pre-line">
                    {content.momoDetails}
                  </div>
                </div>
              )}

              {/* Bank Transfer — only rendered if real details are configured */}
              {showBank && (
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                  <h3 className="font-bold text-zinc-900 mb-1">🏦 Bank Transfer</h3>
                  <p className="text-zinc-500 text-sm mb-2">Transfer to our foundation account.</p>
                  <div className="bg-white rounded-lg p-3 font-mono text-sm text-zinc-700 border border-zinc-100 whitespace-pre-line">
                    {content.bankDetails}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-zinc-100 bg-zinc-50 text-center">
              <p className="text-zinc-500 text-sm">
                For donation receipts or sponsorship questions, email{" "}
                <Link href={`mailto:${PICHESS_EMAIL}`} className="text-[#2e7d5b] hover:underline font-medium">
                  {PICHESS_EMAIL}
                </Link>
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Material donations */}
        <AnimatedSection delay={0.3} className="mt-8">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center">
            <h3 className="font-bold text-zinc-900 mb-2">Donating Chess Sets or Books?</h3>
            <p className="text-zinc-500 text-sm mb-4">
              {content.materialNote}
            </p>
            <a
              href={buildWhatsAppUrl("Hi Pi Chess Foundation, I'd like to donate chess boards, clocks, or books.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2.5 rounded-full border border-[#2e7d5b] text-[#2e7d5b] text-sm font-semibold hover:bg-[#2e7d5b] hover:text-white transition-all"
            >
              Ask About Materials on WhatsApp →
            </a>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
