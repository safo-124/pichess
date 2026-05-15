import type { AcademyStat } from "@/lib/academy-content";

export default function AcademyStatsBand({ stats }: { stats: AcademyStat[] }) {
  return (
    <section className="bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-center sm:p-7"
          >
            <div className="text-4xl font-black tracking-tight text-[#d7bc63] sm:text-5xl">
              {stat.end.toLocaleString()}
              {stat.suffix}
            </div>
            <p className="mt-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/50">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
