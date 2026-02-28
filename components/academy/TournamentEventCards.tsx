"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import RegistrationForm from "@/components/shared/RegistrationForm";

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
  maxSpots: number | null;
  registeredCount: number;
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
  UPCOMING: { bg: "bg-[#c9a84c]/10 border-[#c9a84c]/25", text: "text-[#c9a84c]", dot: "bg-[#c9a84c]", label: "Upcoming" },
  ONGOING: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-600", dot: "bg-emerald-500 animate-pulse", label: "Live Now" },
  COMPLETED: { bg: "bg-gray-100 border-gray-200", text: "text-gray-400", dot: "bg-gray-300", label: "Completed" },
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
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/25 text-[#c9a84c] text-[11px] font-bold tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
      {label}
    </span>
  );
}

/* ────────────────────────────────────────────────────────
   Detail Modal
   ──────────────────────────────────────────────────────── */

function SpotsIndicator({ maxSpots, registeredCount }: { maxSpots: number | null; registeredCount: number }) {
  if (!maxSpots) return (
    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 tracking-wider">
      {registeredCount} registered
    </span>
  );
  const remaining = Math.max(0, maxSpots - registeredCount);
  const pct = Math.min(100, (registeredCount / maxSpots) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden min-w-[60px]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            pct >= 90 ? "bg-red-400" : pct >= 70 ? "bg-amber-400" : "bg-emerald-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-[10px] font-bold ${
        remaining === 0 ? "text-red-500" : remaining <= 5 ? "text-amber-600" : "text-gray-400"
      }`}>
        {remaining === 0 ? "Full" : `${remaining} spot${remaining !== 1 ? "s" : ""} left`}
      </span>
    </div>
  );
}

function DetailModal({ item, onClose }: { item: TournamentItem; onClose: () => void }) {
  const sc = statusConfig[item.status] ?? statusConfig.UPCOMING;
  const [showRegister, setShowRegister] = useState(false);

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
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-gray-200 shadow-2xl shadow-black/10"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
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
            <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-500 text-xs font-bold">
              {typeIcons[item.type] || "🏆"} {item.type === "EVENT" ? "Event" : "Tournament"}
            </span>
            {item.featured && (
              <span className="px-3 py-1 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/25 text-[#c9a84c] text-xs font-bold">
                ★ Featured
              </span>
            )}
            {item.status === "UPCOMING" && <CountdownBadge date={item.date} />}
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            {item.title}
          </h2>

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center text-lg">📅</div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Date</p>
                <p className="text-sm text-gray-700">{formatDateRange(item.date, item.endDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-500">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-lg">📍</div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Location</p>
                <p className="text-sm text-gray-700">{item.location}{item.venue ? ` · ${item.venue}` : ""}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6">
              <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">{item.description}</p>
            </div>
          )}

          {/* Photo gallery */}
          {item.photos.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">Gallery</h3>
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

          {/* Spots indicator */}
          {(item.status === "UPCOMING" || item.status === "ONGOING") && (
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Registration</span>
                <span className="text-xs text-gray-400">
                  {item.registeredCount} registered{item.maxSpots ? ` / ${item.maxSpots}` : ""}
                </span>
              </div>
              {item.maxSpots && (
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.registeredCount / item.maxSpots >= 0.9 ? "bg-red-400" :
                      item.registeredCount / item.maxSpots >= 0.7 ? "bg-amber-400" : "bg-emerald-400"
                    }`}
                    style={{ width: `${Math.min(100, (item.registeredCount / item.maxSpots) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          {(item.status === "UPCOMING" || item.status === "ONGOING") && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowRegister(true); }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#c9a84c] via-[#d4b15a] to-[#dbb95d] text-white text-sm font-black hover:from-[#dbb95d] hover:to-[#c9a84c] transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#c9a84c]/20 active:scale-95"
            >
              {item.maxSpots && item.registeredCount >= item.maxSpots ? "Join Waitlist" : "Register Now"}
              <span className="text-white/60">→</span>
            </button>
          )}
        </div>

        {/* Inline registration form */}
        {showRegister && (
          <RegistrationForm
            tournament={{
              id: item.id,
              title: item.title,
              date: item.date,
              location: item.location,
              venue: item.venue,
              type: item.type,
              maxSpots: item.maxSpots,
              registeredCount: item.registeredCount,
              flyer: item.flyer,
            }}
            onClose={() => setShowRegister(false)}
          />
        )}
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
          ? "border-emerald-200 bg-white hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/10"
          : isUpcoming
          ? "border-[#c9a84c]/15 bg-white hover:border-[#c9a84c]/40 hover:shadow-2xl hover:shadow-[#c9a84c]/10"
          : "border-gray-200 bg-white/80 hover:border-gray-300"
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
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
          </>
        ) : (
          <div className={`w-full h-full ${
            isOngoing
              ? "bg-gradient-to-br from-emerald-50 to-white"
              : isUpcoming
              ? "bg-gradient-to-br from-[#c9a84c]/10 to-white"
              : "bg-gradient-to-br from-gray-100 to-white"
          }`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl opacity-20 group-hover:scale-125 group-hover:opacity-30 transition-all duration-500">
                {typeIcons[item.type] || "🏆"}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
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
            <span className="w-8 h-8 rounded-full bg-[#c9a84c]/20 backdrop-blur-md border border-[#c9a84c]/30 flex items-center justify-center text-sm">
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
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-gray-400 uppercase tracking-wider">
            {typeIcons[item.type]} {item.type === "EVENT" ? "Event" : "Tournament"}
          </span>
          {item.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/15 text-[#c9a84c]/70 uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#c9a84c] transition-colors leading-tight line-clamp-2">
          {item.title}
        </h3>

        {/* Meta */}
        <div className="space-y-1.5 text-sm text-gray-400">
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
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{item.description}</p>
        )}

        {/* Spots indicator */}
        {(isUpcoming || isOngoing) && (
          <SpotsIndicator maxSpots={item.maxSpots} registeredCount={item.registeredCount} />
        )}

        {/* Bottom bar */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-300 group-hover:text-[#c9a84c]/60 transition-colors">
            Click for details →
          </span>
          {(isUpcoming || isOngoing) && (
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              item.maxSpots && item.registeredCount >= item.maxSpots
                ? "text-red-500 bg-red-50"
                : "text-[#c9a84c] bg-[#c9a84c]/10"
            }`}>
              {item.maxSpots && item.registeredCount >= item.maxSpots ? "Waitlist" : "Register Open"}
            </span>
          )}
          {item.photos.length > 0 && (
            <span className="text-xs text-gray-300 flex items-center gap-1">
              📷 {item.photos.length}
            </span>
          )}
        </div>
      </div>

      {/* Hover glow effect */}
      <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${
        isOngoing
          ? "shadow-[inset_0_0_40px_rgba(16,185,129,0.03)]"
          : "shadow-[inset_0_0_40px_rgba(201,168,76,0.04)]"
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
                ? "bg-gradient-to-r from-[#c9a84c] to-[#dbb95d] text-white shadow-lg shadow-[#c9a84c]/20"
                : "bg-gray-100 border border-gray-200 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            }`}
          >
            <span className="mr-1.5">{t.icon}</span>
            {t.label}
            <span className={`ml-2 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
              tab === t.id ? "bg-white/20 text-white/80" : "bg-gray-200 text-gray-400"
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
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#c9a84c] to-[#dbb95d]" />
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Upcoming & Active</h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20">
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
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-gray-300 to-gray-200" />
            <h2 className="text-2xl font-black text-gray-400 tracking-tight">Past Events</h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 border border-gray-200">
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
          className="rounded-2xl border border-gray-200 bg-gray-50 p-20 text-center"
        >
          <div className="text-6xl mb-4">{tab === "events" ? "🎪" : "🏆"}</div>
          <p className="text-gray-400 text-lg font-medium">
            No {tab === "all" ? "tournaments or events" : tab} found yet.
          </p>
          <p className="text-gray-300 text-sm mt-2">Check back soon for updates!</p>
        </motion.div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
