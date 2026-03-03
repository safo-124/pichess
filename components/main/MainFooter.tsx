import Link from "next/link";
import { getSiteContent } from "@/lib/actions/admin";

/* ── Social icons (inline SVGs for zero-dep) ── */
const socials: Record<string, React.ReactNode> = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><path fill="#0a0a0f" d="M9.545 15.568V8.432L15.818 12z"/></svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.16V11.7a4.83 4.83 0 01-3.59-1.42V6.69h3.59z"/></svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  ),
};

const platformLinks = [
  ["Tournaments", "/tournaments"],
  ["Shop", "/shop"],
  ["News", "/news"],
  ["Learning Tools", "/learning-tools"],
];

const zoneLinks = [
  ["Academy", "/academy"],
  ["Enquire", "/academy/enquire"],
  ["NGO / Foundation", "/ngo"],
  ["Apply for Support", "/ngo/apply"],
  ["Donate", "/ngo/donate"],
  ["Volunteer", "/ngo/volunteer"],
];

const companyLinks = [
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Login", "/login"],
];

interface FooterData {
  tagline: string;
  phone: string;
  email: string;
  address: string;
  socials: { platform: string; url: string }[];
  copyright: string;
}

const DEFAULTS: FooterData = {
  tagline: "Ghana's premier chess platform — training champions, empowering communities.",
  phone: "+233 XX XXX XXXX",
  email: "info@pichess.com",
  address: "Accra, Ghana",
  socials: [
    { platform: "facebook", url: "#" },
    { platform: "twitter", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "youtube", url: "#" },
  ],
  copyright: "PiChess. All rights reserved.",
};

export default async function MainFooter() {
  let data: FooterData = DEFAULTS;
  try {
    const raw = await getSiteContent("footer_config");
    if (raw) data = { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { /* use defaults */ }

  return (
    <footer className="relative bg-[#0a0a0f] text-white overflow-hidden">
      {/* Decorative gold top border */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: "32px 32px",
      }} />

      {/* ── CTA Banner ── */}
      <div className="relative border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ready to make your <span className="text-[#c9a84c]">move</span>?
            </h3>
            <p className="text-white/40 text-sm mt-1">Join Ghana&apos;s fastest-growing chess community today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/academy/enquire"
              className="px-6 py-2.5 bg-[#c9a84c] text-black font-semibold text-sm rounded-lg hover:bg-[#d4b65c] transition-colors shadow-lg shadow-[#c9a84c]/20"
            >
              Join Now
            </Link>
            <Link
              href="/contact"
              className="px-6 py-2.5 border border-white/20 text-white/70 font-medium text-sm rounded-lg hover:bg-white/5 hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-[#c9a84c] to-[#a8893d] rounded-lg flex items-center justify-center font-black text-white text-lg shadow-lg shadow-[#c9a84c]/20">
                ♟
              </div>
              <span className="font-black text-xl tracking-tight">
                Pi<span className="text-[#c9a84c]">Chess</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              {data.tagline}
            </p>

            {/* Contact Info */}
            <div className="space-y-2.5 text-sm">
              {data.email && (
                <div className="flex items-center gap-2.5 text-white/40">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#c9a84c]/60 shrink-0"><path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z"/><path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z"/></svg>
                  <a href={`mailto:${data.email}`} className="hover:text-white transition-colors">{data.email}</a>
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-2.5 text-white/40">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#c9a84c]/60 shrink-0"><path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd"/></svg>
                  <a href={`tel:${data.phone}`} className="hover:text-white transition-colors">{data.phone}</a>
                </div>
              )}
              {data.address && (
                <div className="flex items-center gap-2.5 text-white/40">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#c9a84c]/60 shrink-0"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.145 15.945 15.945 0 002.61-1.874c1.68-1.496 3.775-3.895 3.775-7.403a7 7 0 00-14 0c0 3.508 2.095 5.907 3.775 7.403a15.945 15.945 0 002.891 2.019zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd"/></svg>
                  <span>{data.address}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {data.socials.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                {data.socials.map(({ platform, url }) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all duration-200"
                    aria-label={platform}
                  >
                    {socials[platform] ?? <span className="text-xs uppercase font-bold">{platform[0]}</span>}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Platform Links */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-[0.2em] text-[#c9a84c]/60">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {platformLinks.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/45 hover:text-white hover:translate-x-0.5 transition-all duration-200 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Zone Links */}
          <div className="lg:col-span-3">
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-[0.2em] text-[#c9a84c]/60">
              Zones
            </h4>
            <ul className="space-y-2.5">
              {zoneLinks.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/45 hover:text-white hover:translate-x-0.5 transition-all duration-200 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-3">
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-[0.2em] text-[#c9a84c]/60">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/45 hover:text-white hover:translate-x-0.5 transition-all duration-200 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter mini */}
            <div className="mt-8">
              <h4 className="font-semibold mb-3 text-xs uppercase tracking-[0.2em] text-[#c9a84c]/60">
                Stay Updated
              </h4>
              <p className="text-white/30 text-xs mb-3">Get news and tournament updates.</p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 min-w-0 bg-white/[0.06] border border-white/10 rounded-l-lg px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#c9a84c]/40 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#c9a84c] text-black font-semibold text-sm rounded-r-lg hover:bg-[#d4b65c] transition-colors shrink-0"
                >
                  →
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="relative border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} {data.copyright}
          </p>
          <div className="flex items-center gap-4 text-xs text-white/25">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
              <span>Built in Ghana 🇬🇭</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
