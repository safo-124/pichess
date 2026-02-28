"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────── */

export interface TournamentItem {
  id: number;
  title: string;
  description: string | null;
  date: string;
  endDate: string | null;
  location: string;
  venue: string | null;
  flyer: string | null;
  registrationLink: string | null;
  type: string;
  tags: string[];
  status: string;
  featured: boolean;
  photos: { id: number; url: string; caption: string | null }[];
}

/* ────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────── */

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateRange(start: string, end: string | null) {
  if (!end) return formatDate(start);
  const s = new Date(start);
  const e = new Date(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()} – ${e.getDate()} ${s.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}

function daysUntil(d: string) {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff > 0) return `In ${diff} days`;
  return null;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  UPCOMING: { bg: "bg-amber-500/15 border-amber-500/25", text: "text-amber-300", dot: "bg-amber-400", label: "Upcoming" },
  ONGOING: { bg: "bg-emerald-500/15 border-emerald-500/25", text: "text-emerald-300", dot: "bg-emerald-400 animate-pulse", label: "Live Now" },
  COMPLETED: { bg: "bg-white/5 border-white/10", text: "text-white/40", dot: "bg-white/30", label: "Completed" },
};

const typeIcons: Record<string, string> = {
  TOURNAMENT: "🏆",
  EVENT: "🎪",
};

/* ────────────────────────────────────────────────────────
   Flyer / Card image with parallax-ish hover
   ──────────────────────────────────────────────────────── */

function FlyerImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl group/img">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 group-hover/img:scale-110"
        sizes="(max-width: 640px) 100vw, 400px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Countdown Badge
   ──────────────────────────────────────────────────────── */

function CountdownBadge({ date }: { date: string }) {
  const label = daysUntil(date);
  if (!label) return null;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-200 text-[11px] font-bold tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      {label}
    </span>
  );
}

/* ────────────────────────────────────────────────────────
   Detail Modal
   ──────────────────────────────────────────────────────── */

function DetailModal({ item, onClose }: { item: TournamentItem; onClose: () => void }) {
  const sc = statusConfig[item.status] ?? statusConfig.UPCOMING;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0f1628] border border-white/[0.08] shadow-2xl shadow-black/50"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/70 transition-all"
        >
          ✕
        </button>

        {/* Flyer hero */}
        {item.flyer && (
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-3xl">
            <Image
              src={item.flyer}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1628] via-transparent to-transparent" />
          </div>
        )}

        <div className="p-8 space-y-6">
          {/* Badges row */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full border text-xs font-bold ${sc.bg} ${sc.text}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle ${sc.dot}`} />
              {sc.label}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-bold">
              {typeIcons[item.type] || "🏆"} {item.type === "EVENT" ? "Event" : "Tournament"}
            </span>
            {item.featured && (
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
                ★ Featured
              </span>
            )}
            {item.status === "UPCOMING" && <CountdownBadge date={item.date} />}
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {item.title}
          </h2>

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-white/50">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-lg">📅</div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">Date</p>
                <p className="text-sm text-white/70">{formatDateRange(item.date, item.endDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white/50">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-lg">📍</div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-white/30 font-semibold">Location</p>
                <p className="text-sm text-white/70">{item.location}{item.venue ? ` · ${item.venue}` : ""}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6">
              <p className="text-white/50 text-sm leading-relaxed whitespace-pre-line">{item.description}</p>
            </div>
          )}

          {/* Photo gallery */}
          {item.photos.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {item.photos.map((p) => (
                  <div key={p.id} className="relative aspect-[4/3] rounded-xl overflow-hidden group/photo">
                    <Image src={p.url} alt={p.caption || ""} fill className="object-cover transition-transform duration-500 group-hover/photo:scale-110" sizes="200px" />
                    {p.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity">
                        <p className="text-[11px] text-white/80">{p.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {item.registrationLink && item.status === "UPCOMING" && (
            <a
              href={item.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black text-sm font-black hover:from-amber-300 hover:to-orange-400 transition-all hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20 active:scale-95"
            >
              Register Now
              <span className="text-black/60">→</span>
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────
   Card
   ──────────────────────────────────────────────────────── */

function TournamentCard({ item, index, onSelect }: { item: TournamentItem; index: number; onSelect: () => void }) {
  const sc = statusConfig[item.status] ?? statusConfig.UPCOMING;
  const isUpcoming = item.status === "UPCOMING";
  const isOngoing = item.status === "ONGOING";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-2xl border overflow-hidden transition-all duration-500 ${
        isOngoing
          ? "border-emerald-500/20 bg-[#0f1628] hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10"
          : isUpcoming
          ? "border-amber-500/10 bg-[#0f1628] hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10"
          : "border-white/[0.06] bg-[#0f1628]/60 hover:border-white/10"
      } hover:-translate-y-2`}
    >
      {/* Flyer / Gradient placeholder */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        {item.flyer ? (
          <>
            <Image
              src={item.flyer}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1628] via-[#0f1628]/30 to-transparent" />
          </>
        ) : (
          <div className={`w-full h-full ${
            isOngoing
              ? "bg-gradient-to-br from-emerald-900/50 to-[#0f1628]"
              : isUpcoming
              ? "bg-gradient-to-br from-amber-900/40 to-[#0f1628]"
              : "bg-gradient-to-br from-zinc-800/40 to-[#0f1628]"
          }`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl opacity-20 group-hover:scale-125 group-hover:opacity-30 transition-all duration-500">
                {typeIcons[item.type] || "🏆"}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1628] via-transparent to-transparent" />
          </div>
        )}

        {/* Floating status badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold backdrop-blur-md ${sc.bg} ${sc.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {sc.label}
          </span>
        </div>

        {/* Featured star */}
        {item.featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="w-8 h-8 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-500/30 flex items-center justify-center text-sm">
              ★
            </span>
          </div>
        )}

        {/* Countdown */}
        {isUpcoming && (
          <div className="absolute bottom-3 right-3 z-10">
            <CountdownBadge date={item.date} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Type badge */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 uppercase tracking-wider">
            {typeIcons[item.type]} {item.type === "EVENT" ? "Event" : "Tournament"}
          </span>
          {item.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/15 text-amber-300/60 uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors leading-tight line-clamp-2">
          {item.title}
        </h3>

        {/* Meta */}
        <div className="space-y-1.5 text-sm text-white/35">
          <div className="flex items-center gap-2">
            <span className="text-base">📅</span>
            <span>{formatDateRange(item.date, item.endDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">📍</span>
            <span>{item.location}{item.venue ? ` · ${item.venue}` : ""}</span>
          </div>
        </div>

        {/* Description preview */}
        {item.description && (
          <p className="text-white/25 text-sm leading-relaxed line-clamp-2">{item.description}</p>
        )}

        {/* Bottom bar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
          <span className="text-xs text-white/20 group-hover:text-amber-400/50 transition-colors">
            Click for details →
          </span>
          {item.registrationLink && isUpcoming && (
            <span className="text-xs font-bold text-amber-400/70 px-3 py-1 rounded-full bg-amber-400/10">
              Register Open
            </span>
          )}
          {item.photos.length > 0 && (
            <span className="text-xs text-white/20 flex items-center gap-1">
              📷 {item.photos.length}
            </span>
          )}
        </div>
      </div>

      {/* Hover glow effect */}
      <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${
        isOngoing
          ? "shadow-[inset_0_0_40px_rgba(16,185,129,0.05)]"
          : "shadow-[inset_0_0_40px_rgba(245,158,11,0.05)]"
      }`} />
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────────────────── */

type TabFilter = "all" | "tournaments" | "events";

export default function TournamentEventCards({ items }: { items: TournamentItem[] }) {
  const [tab, setTab] = useState<TabFilter>("all");
  const [selected, setSelected] = useState<TournamentItem | null>(null);

  const filtered = items.filter((item) => {
    if (tab === "tournaments") return item.type === "TOURNAMENT";
    if (tab === "events") return item.type === "EVENT";
    return true;
  });

  const upcoming = filtered.filter((i) => i.status === "UPCOMING" || i.status === "ONGOING");
  const past = filtered.filter((i) => i.status === "COMPLETED");

  const tournamentCount = items.filter(i => i.type === "TOURNAMENT").length;
  const eventCount = items.filter(i => i.type === "EVENT").length;

  const tabs: { id: TabFilter; label: string; count: number; icon: string }[] = [
    { id: "all", label: "All", count: items.length, icon: "🎯" },
    { id: "tournaments", label: "Tournaments", count: tournamentCount, icon: "🏆" },
    { id: "events", label: "Events", count: eventCount, icon: "🎪" },
  ];

  return (
    <>
      {/* Tab switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`group relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              tab === t.id
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/20"
                : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70"
            }`}
          >
            <span className="mr-1.5">{t.icon}</span>
            {t.label}
            <span className={`ml-2 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
              tab === t.id ? "bg-black/20 text-black/70" : "bg-white/10 text-white/30"
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Upcoming / Ongoing section */}
      {upcoming.length > 0 && (
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
            <h2 className="text-2xl font-black text-white tracking-tight">Upcoming & Active</h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
              {upcoming.length}
            </span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((item, i) => (
              <TournamentCard key={item.id} item={item} index={i} onSelect={() => setSelected(item)} />
            ))}
          </div>
        </div>
      )}

      {/* Past section */}
      {past.length > 0 && (
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-white/20 to-white/5" />
            <h2 className="text-2xl font-black text-white/60 tracking-tight">Past Events</h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/5 text-white/30 border border-white/10">
              {past.length}
            </span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {past.map((item, i) => (
              <TournamentCard key={item.id} item={item} index={i} onSelect={() => setSelected(item)} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/[0.06] bg-[#0f1628] p-20 text-center"
        >
          <div className="text-6xl mb-4">{tab === "events" ? "🎪" : "🏆"}</div>
          <p className="text-white/30 text-lg font-medium">
            No {tab === "all" ? "tournaments or events" : tab} found yet.
          </p>
          <p className="text-white/15 text-sm mt-2">Check back soon for updates!</p>
        </motion.div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
