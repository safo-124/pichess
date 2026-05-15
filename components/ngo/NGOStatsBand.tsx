import type { NGOStat } from "@/lib/ngo-content";

function statValue(stat: NGOStat) {
  return `${stat.value.toLocaleString()}${stat.suffix ?? ""}`;
}

export default function NGOStatsBand({ stats }: { stats: NGOStat[] }) {
  return (
    <section className="relative overflow-hidden bg-[#2e7d5b] py-16 sm:py-18">
      <div className="absolute inset-0 opacity-10 chess-bg pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div
              key={`${stat.label}-${index}`}
              className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-7 text-center backdrop-blur-sm"
            >
              <p className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                {statValue(stat)}
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/65 sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
