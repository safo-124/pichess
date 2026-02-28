import Link from "next/link";

export default function MainFooter() {
  return (
    <footer className="bg-black border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-white rounded-sm flex items-center justify-center font-black text-black text-lg">
                ♟
              </div>
              <span className="font-black text-xl">
                Pi<span className="text-[#c9a84c]">Chess</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Ghana&apos;s premier chess platform — training champions, empowering communities.
            </p>
          </div>

          {/* Main */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-widest text-white/40">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                ["Tournaments", "/tournaments"],
                ["Shop", "/shop"],
                ["News", "/news"],
                ["Learning Tools", "/learning-tools"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Zones */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-widest text-white/40">
              Zones
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                ["Academy", "/academy"],
                ["Enquire", "/academy/enquire"],
                ["NGO", "/ngo"],
                ["Apply for Support", "/ngo/apply"],
                ["Donate", "/ngo/donate"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-widest text-white/40">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                ["About", "/about"],
                ["Contact", "/contact"],
                ["Login", "/login"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© {new Date().getFullYear()} PiChess. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
            <span>Built in Ghana 🇬🇭</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
