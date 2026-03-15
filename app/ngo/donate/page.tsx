import AnimatedSection from "@/components/shared/AnimatedSection";
import Link from "next/link";
import { getSiteContent } from "@/lib/actions/admin";
import { defaultNGODonate, type NGODonateContent } from "@/lib/ngo-content";

export const metadata = { title: "Donate | PiChess Foundation" };

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export default async function DonatePage() {
  const raw = await getSiteContent("ngo_donate");
  const content = parse<NGODonateContent>(raw, defaultNGODonate);

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

        {/* Impact */}
        <AnimatedSection delay={0.1} className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
          {content.tiers.map((item) => (
            <div key={item.amount} className="rounded-xl bg-[#d4ede3] border border-[#2e7d5b]/15 p-4">
              <p className="font-black text-[#2e7d5b] text-lg">{item.amount}</p>
              <p className="text-zinc-600 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </AnimatedSection>

        {/* Donation methods */}
        <AnimatedSection delay={0.2}>
          <div className="rounded-2xl border border-[#2e7d5b]/20 bg-white shadow-sm overflow-hidden">
            <div className="p-8 border-b border-zinc-100">
              <h2 className="text-xl font-black text-zinc-900 mb-2">Choose a Method</h2>
              <p className="text-zinc-400 text-sm">Multiple convenient ways to donate.</p>
            </div>

            <div className="p-8 space-y-4">
              {/* Mobile Money */}
              <div className="rounded-xl border border-[#2e7d5b]/20 bg-[#d4ede3]/50 p-5">
                <h3 className="font-bold text-zinc-900 mb-1">📱 Mobile Money</h3>
                <p className="text-zinc-500 text-sm mb-2">Send your donation via MoMo.</p>
                <div className="bg-white rounded-lg p-3 font-mono text-sm text-zinc-700 border border-zinc-100 whitespace-pre-line">
                  {content.momoDetails}
                </div>
              </div>

              {/* Bank Transfer */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                <h3 className="font-bold text-zinc-900 mb-1">🏦 Bank Transfer</h3>
                <p className="text-zinc-500 text-sm mb-2">Transfer to our foundation account.</p>
                <div className="bg-white rounded-lg p-3 font-mono text-sm text-zinc-700 border border-zinc-100 whitespace-pre-line">
                  {content.bankDetails}
                </div>
              </div>

              {/* WhatsApp */}
              <Link
                href="https://wa.me/233000000000?text=I'd like to make a donation to PiChess Foundation"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-[#25D366]/30 bg-[#25D366]/8 p-5 hover:bg-[#25D366]/15 transition-colors"
              >
                <span className="text-2xl">💬</span>
                <div>
                  <h3 className="font-bold text-zinc-900">WhatsApp Us</h3>
                  <p className="text-zinc-500 text-sm">Contact us on WhatsApp to discuss your donation.</p>
                </div>
                <span className="ml-auto text-[#25D366] font-semibold text-sm">→</span>
              </Link>
            </div>

            <div className="p-6 border-t border-zinc-100 bg-zinc-50 text-center">
              <p className="text-zinc-400 text-sm">
                For donation receipts or questions, contact{" "}
                <Link href="mailto:donate@pichess.com" className="text-[#2e7d5b] hover:underline font-medium">donate@pichess.com</Link>
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Material donations */}
        <AnimatedSection delay={0.3} className="mt-8">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center">
            <h3 className="font-bold text-zinc-900 mb-2">Donating Materials?</h3>
            <p className="text-zinc-500 text-sm mb-4">
              {content.materialNote}
            </p>
            <Link href="/contact" className="inline-block px-5 py-2.5 rounded-full border border-[#2e7d5b] text-[#2e7d5b] text-sm font-semibold hover:bg-[#2e7d5b] hover:text-white transition-all">
              Contact Us About Materials
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
