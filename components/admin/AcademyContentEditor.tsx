"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { saveSiteContent } from "@/lib/actions/admin";
import {
  type AcademyHero, type AcademyStat, type AcademyLesson, type AcademyFeature, type AcademyCTA, type AcademyLessonsHero,
  defaultHero, defaultStats, defaultLessons, defaultFeatures, defaultCTA, defaultLessonsHero,
} from "@/lib/academy-content";

// Re-export for convenience (but prefer importing from @/lib/academy-content in server components)
export type { AcademyHero, AcademyStat, AcademyLesson, AcademyFeature, AcademyCTA, AcademyLessonsHero };
export { defaultHero, defaultStats, defaultLessons, defaultFeatures, defaultCTA, defaultLessonsHero };

/* ────────────────────────────────────────────────────────
   Styling
   ──────────────────────────────────────────────────────── */

const inputCls =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/40 outline-none transition-all placeholder:text-zinc-300";
const labelCls = "text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block";
const sectionTitle = "text-sm font-bold text-zinc-800 flex items-center gap-2";
const cardCls = "rounded-2xl bg-white border border-zinc-200/80 p-5";

/* ────────────────────────────────────────────────────────
   Image Upload Component
   ──────────────────────────────────────────────────────── */

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) onChange(data.url);
        else alert(data.error || "Upload failed");
      } catch {
        alert("Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) upload(file);
    },
    [upload]
  );

  return (
    <div>
      <label className={labelCls}>{label}</label>
      {/* URL input */}
      <div className="flex gap-2 mb-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
          placeholder="https://... or upload below"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs font-semibold transition-all disabled:opacity-50 border border-zinc-200"
        >
          {uploading ? "Uploading…" : "📁 Browse"}
        </button>
      </div>
      {/* Drop zone / Preview */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-all overflow-hidden ${
          dragOver
            ? "border-[#c9a84c] bg-[#c9a84c]/5"
            : value
            ? "border-zinc-200 bg-zinc-50"
            : "border-zinc-200 bg-zinc-50"
        } ${value ? "h-32" : "h-24"}`}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white/90 text-zinc-700 text-xs font-semibold hover:bg-white"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-xs font-semibold hover:bg-red-500"
              >
                Remove
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <span className="text-2xl mb-1">📷</span>
            <span className="text-xs font-medium">
              {uploading ? "Uploading…" : "Drop image here or click Browse"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Drag-to-reorder helpers
   ──────────────────────────────────────────────────────── */

function useDragReorder<T>(items: T[], setItems: (next: T[]) => void) {
  const dragIdx = useRef<number | null>(null);

  const onDragStart = (i: number) => (e: React.DragEvent) => {
    dragIdx.current = i;
    e.dataTransfer.effectAllowed = "move";
    (e.currentTarget as HTMLElement).style.opacity = "0.5";
  };

  const onDragEnd = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = "1";
    dragIdx.current = null;
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (targetIdx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === targetIdx) return;
    const next = [...items];
    const [moved] = next.splice(dragIdx.current, 1);
    next.splice(targetIdx, 0, moved);
    setItems(next);
    dragIdx.current = null;
  };

  return { onDragStart, onDragEnd, onDragOver, onDrop };
}

function DragHandle() {
  return (
    <span className="cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 transition-colors select-none" title="Drag to reorder">
      ⠿
    </span>
  );
}

/* ────────────────────────────────────────────────────────
   Main Editor Component
   ──────────────────────────────────────────────────────── */

interface Props {
  initialHero: AcademyHero;
  initialStats: AcademyStat[];
  initialLessons: AcademyLesson[];
  initialFeatures: AcademyFeature[];
  initialCTA: AcademyCTA;
  initialLessonsHero: AcademyLessonsHero;
}

type Section = "hero" | "stats" | "lessons" | "features" | "cta" | "lessonsHero";

export default function AcademyContentEditor({
  initialHero,
  initialStats,
  initialLessons,
  initialFeatures,
  initialCTA,
  initialLessonsHero,
}: Props) {
  const [hero, setHero] = useState<AcademyHero>(initialHero);
  const [stats, setStats] = useState<AcademyStat[]>(initialStats);
  const [lessons, setLessons] = useState<AcademyLesson[]>(initialLessons);
  const [features, setFeatures] = useState<AcademyFeature[]>(initialFeatures);
  const [cta, setCTA] = useState<AcademyCTA>(initialCTA);
  const [lessonsHero, setLessonsHero] = useState<AcademyLessonsHero>(initialLessonsHero);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState<Section | null>(null);
  const [openSection, setOpenSection] = useState<Section>("hero");

  const statsDrag = useDragReorder(stats, setStats);
  const lessonsDrag = useDragReorder(lessons, setLessons);
  const featuresDrag = useDragReorder(features, setFeatures);

  async function save(section: Section) {
    startTransition(async () => {
      const map: Record<Section, { key: string; val: unknown }> = {
        hero: { key: "academy_hero", val: hero },
        stats: { key: "academy_stats", val: stats },
        lessons: { key: "academy_lessons", val: lessons },
        features: { key: "academy_features", val: features },
        cta: { key: "academy_cta", val: cta },
        lessonsHero: { key: "academy_lessons_hero", val: lessonsHero },
      };
      const { key, val } = map[section];
      await saveSiteContent(key, JSON.stringify(val));
      setSaved(section);
      setTimeout(() => setSaved(null), 2000);
    });
  }

  function SaveBtn({ section }: { section: Section }) {
    return (
      <button
        onClick={() => save(section)}
        disabled={pending}
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#b89843] text-white text-xs font-semibold hover:shadow-lg hover:shadow-[#c9a84c]/20 transition-all disabled:opacity-50"
      >
        {pending ? "Saving…" : saved === section ? "✓ Saved!" : "Save Changes"}
      </button>
    );
  }

  function Toggle({ id, label, icon }: { id: Section; label: string; icon: string }) {
    const isOpen = openSection === id;
    return (
      <button
        onClick={() => setOpenSection(id)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          isOpen
            ? "bg-[#c9a84c] text-white shadow-lg shadow-[#c9a84c]/20"
            : "bg-white border border-zinc-200/80 text-zinc-600 hover:bg-zinc-50"
        }`}
      >
        <span>{icon}</span> {label}
      </button>
    );
  }

  return (
    <div className="space-y-5">
      {/* Section toggles */}
      <div className="flex flex-wrap gap-2">
        <Toggle id="hero" label="Hero" icon="🎬" />
        <Toggle id="stats" label="Stats" icon="📊" />
        <Toggle id="lessonsHero" label="Lessons Page" icon="🖼" />
        <Toggle id="lessons" label="Lessons" icon="📚" />
        <Toggle id="features" label="Features" icon="⚡" />
        <Toggle id="cta" label="CTA" icon="🎯" />
      </div>

      {/* ═══ HERO ════════════════════════════════════════════════════ */}
      {openSection === "hero" && (
        <div className={cardCls}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={sectionTitle}>🎬 Hero Section</h3>
            <SaveBtn section="hero" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="col-span-full">
              <label className={labelCls}>Badge Text</label>
              <input value={hero.badge} onChange={(e) => setHero({ ...hero, badge: e.target.value })} className={inputCls} placeholder="Now Enrolling — 2026 Cohort" />
            </div>
            <div>
              <label className={labelCls}>Title Line 1</label>
              <input value={hero.title1} onChange={(e) => setHero({ ...hero, title1: e.target.value })} className={inputCls} placeholder="Train Like a" />
            </div>
            <div>
              <label className={labelCls}>Title Line 2 (Highlighted)</label>
              <input value={hero.title2} onChange={(e) => setHero({ ...hero, title2: e.target.value })} className={inputCls} placeholder="Champion." />
            </div>
            <div className="col-span-full">
              <label className={labelCls}>Description</label>
              <textarea value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} className={`${inputCls} resize-none`} rows={3} />
            </div>
            {/* Image uploads */}
            <ImageField
              label="Background Image"
              value={hero.bgImage}
              onChange={(url) => setHero({ ...hero, bgImage: url })}
            />
            <ImageField
              label="Side Image"
              value={hero.sideImage}
              onChange={(url) => setHero({ ...hero, sideImage: url })}
            />
            <div>
              <label className={labelCls}>Floating Stat Value</label>
              <input value={hero.floatStat} onChange={(e) => setHero({ ...hero, floatStat: e.target.value })} className={inputCls} placeholder="500+" />
            </div>
            <div>
              <label className={labelCls}>Floating Stat Label</label>
              <input value={hero.floatStatLabel} onChange={(e) => setHero({ ...hero, floatStatLabel: e.target.value })} className={inputCls} placeholder="Students Trained" />
            </div>
            <div>
              <label className={labelCls}>Floating Badge Icon</label>
              <input value={hero.floatBadgeIcon} onChange={(e) => setHero({ ...hero, floatBadgeIcon: e.target.value })} className={inputCls} placeholder="♛" />
            </div>
            <div>
              <label className={labelCls}>Floating Badge Label</label>
              <input value={hero.floatBadgeLabel} onChange={(e) => setHero({ ...hero, floatBadgeLabel: e.target.value })} className={inputCls} placeholder="Elite" />
            </div>
          </div>
        </div>
      )}

      {/* ═══ STATS ═══════════════════════════════════════════════════ */}
      {openSection === "stats" && (
        <div className={cardCls}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={sectionTitle}>📊 Stats Section</h3>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setStats([...stats, { end: 0, label: "", suffix: "", color: "gold" }])}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-600 text-xs font-semibold hover:bg-zinc-200 transition-colors"
              >
                + Add Stat
              </button>
              <SaveBtn section="stats" />
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 mb-3">Drag ⠿ to reorder</p>
          <div className="space-y-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                draggable
                onDragStart={statsDrag.onDragStart(i)}
                onDragEnd={statsDrag.onDragEnd}
                onDragOver={statsDrag.onDragOver}
                onDrop={statsDrag.onDrop(i)}
                className="grid grid-cols-[24px_1fr_1fr_100px_90px_auto] gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100 items-end"
              >
                <div className="flex items-center justify-center pb-2"><DragHandle /></div>
                <div>
                  <label className={labelCls}>Value</label>
                  <input
                    type="number"
                    value={stat.end}
                    onChange={(e) => {
                      const next = [...stats];
                      next[i] = { ...next[i], end: Number(e.target.value) };
                      setStats(next);
                    }}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Label</label>
                  <input
                    value={stat.label}
                    onChange={(e) => {
                      const next = [...stats];
                      next[i] = { ...next[i], label: e.target.value };
                      setStats(next);
                    }}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Suffix</label>
                  <input
                    value={stat.suffix}
                    onChange={(e) => {
                      const next = [...stats];
                      next[i] = { ...next[i], suffix: e.target.value };
                      setStats(next);
                    }}
                    className={inputCls}
                    placeholder="e.g. +"
                  />
                </div>
                <div>
                  <label className={labelCls}>Color</label>
                  <select
                    value={stat.color}
                    onChange={(e) => {
                      const next = [...stats];
                      next[i] = { ...next[i], color: e.target.value };
                      setStats(next);
                    }}
                    className={inputCls}
                  >
                    <option value="gold">Gold</option>
                    <option value="white">White</option>
                  </select>
                </div>
                <div>
                  {stats.length > 1 && (
                    <button
                      onClick={() => setStats(stats.filter((_, j) => j !== i))}
                      className="text-[11px] text-red-500 hover:text-red-700 font-semibold px-2 py-2.5"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ LESSONS PAGE HERO ═══════════════════════════════════════ */}
      {openSection === "lessonsHero" && (
        <div className={cardCls}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={sectionTitle}>🖼 Lessons Page Hero</h3>
            <SaveBtn section="lessonsHero" />
          </div>
          <p className="text-[11px] text-zinc-400 mb-4">Customize the hero section of the <strong>/academy/lessons</strong> page — badge text, title, description, and background image.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Badge Text</label>
              <input value={lessonsHero.badge} onChange={(e) => setLessonsHero({ ...lessonsHero, badge: e.target.value })} className={inputCls} placeholder="Curriculum" />
            </div>
            <div>
              <label className={labelCls}>Title</label>
              <input value={lessonsHero.title} onChange={(e) => setLessonsHero({ ...lessonsHero, title: e.target.value })} className={inputCls} placeholder="Lesson Packages" />
            </div>
            <div className="col-span-full">
              <label className={labelCls}>Description</label>
              <textarea value={lessonsHero.description} onChange={(e) => setLessonsHero({ ...lessonsHero, description: e.target.value })} className={`${inputCls} resize-none`} rows={3} placeholder="From private coaching to group classes — find the perfect lesson format for every player." />
            </div>
            <div className="col-span-full">
              <ImageField
                label="Background Image"
                value={lessonsHero.bgImage}
                onChange={(url) => setLessonsHero({ ...lessonsHero, bgImage: url })}
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══ LESSONS ═════════════════════════════════════════════ */}
      {openSection === "lessons" && (
        <div className={cardCls}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={sectionTitle}>📚 Lesson Packages</h3>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setLessons([...lessons, { title: "", desc: "", longDesc: "", icon: "♟", image: "", category: "core" }])}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-600 text-xs font-semibold hover:bg-zinc-200 transition-colors"
              >
                + Add Lesson
              </button>
              <SaveBtn section="lessons" />
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 mb-3">Drag ⠿ to reorder • Set category to control grouping on the page</p>
          <div className="space-y-4">
            {lessons.map((lesson, i) => (
              <div
                key={i}
                draggable
                onDragStart={lessonsDrag.onDragStart(i)}
                onDragEnd={lessonsDrag.onDragEnd}
                onDragOver={lessonsDrag.onDragOver}
                onDrop={lessonsDrag.onDrop(i)}
                className={`p-4 rounded-xl border space-y-3 ${lesson.category === "institutional" ? "bg-blue-50/50 border-blue-200/60" : "bg-zinc-50 border-zinc-100"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DragHandle />
                    <span className="text-xs font-bold text-zinc-400">Lesson {i + 1}</span>
                    {lesson.category === "institutional" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">Institutional</span>
                    )}
                  </div>
                  {lessons.length > 1 && (
                    <button
                      onClick={() => setLessons(lessons.filter((_, j) => j !== i))}
                      className="text-[11px] text-red-500 hover:text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Icon</label>
                    <input
                      value={lesson.icon}
                      onChange={(e) => {
                        const next = [...lessons];
                        next[i] = { ...next[i], icon: e.target.value };
                        setLessons(next);
                      }}
                      className={inputCls}
                      placeholder="♟"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Title</label>
                    <input
                      value={lesson.title}
                      onChange={(e) => {
                        const next = [...lessons];
                        next[i] = { ...next[i], title: e.target.value };
                        setLessons(next);
                      }}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Category</label>
                    <select
                      value={lesson.category}
                      onChange={(e) => {
                        const next = [...lessons];
                        next[i] = { ...next[i], category: e.target.value as "core" | "institutional" };
                        setLessons(next);
                      }}
                      className={inputCls}
                    >
                      <option value="core">Core Lesson</option>
                      <option value="institutional">Institutional</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Description (Short)</label>
                  <textarea
                    value={lesson.desc}
                    onChange={(e) => {
                      const next = [...lessons];
                      next[i] = { ...next[i], desc: e.target.value };
                      setLessons(next);
                    }}
                    className={`${inputCls} resize-none`}
                    rows={2}
                    placeholder="Brief summary shown on the card"
                  />
                </div>
                <div>
                  <label className={labelCls}>Long Description (Detail View)</label>
                  <textarea
                    value={lesson.longDesc || ""}
                    onChange={(e) => {
                      const next = [...lessons];
                      next[i] = { ...next[i], longDesc: e.target.value };
                      setLessons(next);
                    }}
                    className={`${inputCls} resize-none`}
                    rows={4}
                    placeholder="Detailed description shown when user clicks the card"
                  />
                </div>
                <ImageField
                  label="Lesson Image"
                  value={lesson.image || ""}
                  onChange={(url) => {
                    const next = [...lessons];
                    next[i] = { ...next[i], image: url };
                    setLessons(next);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ FEATURES ════════════════════════════════════════════════ */}
      {openSection === "features" && (
        <div className={cardCls}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={sectionTitle}>⚡ Features Strip</h3>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setFeatures([...features, { icon: "🎯", title: "", desc: "" }])}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-600 text-xs font-semibold hover:bg-zinc-200 transition-colors"
              >
                + Add Feature
              </button>
              <SaveBtn section="features" />
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 mb-3">Drag ⠿ to reorder</p>
          <div className="space-y-3">
            {features.map((feat, i) => (
              <div
                key={i}
                draggable
                onDragStart={featuresDrag.onDragStart(i)}
                onDragEnd={featuresDrag.onDragEnd}
                onDragOver={featuresDrag.onDragOver}
                onDrop={featuresDrag.onDrop(i)}
                className="grid grid-cols-[24px_60px_1fr_1fr_auto] gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100 items-end"
              >
                <div className="flex items-center justify-center pb-2"><DragHandle /></div>
                <div>
                  <label className={labelCls}>Icon</label>
                  <input
                    value={feat.icon}
                    onChange={(e) => {
                      const next = [...features];
                      next[i] = { ...next[i], icon: e.target.value };
                      setFeatures(next);
                    }}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Title</label>
                  <input
                    value={feat.title}
                    onChange={(e) => {
                      const next = [...features];
                      next[i] = { ...next[i], title: e.target.value };
                      setFeatures(next);
                    }}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <input
                    value={feat.desc}
                    onChange={(e) => {
                      const next = [...features];
                      next[i] = { ...next[i], desc: e.target.value };
                      setFeatures(next);
                    }}
                    className={inputCls}
                  />
                </div>
                <div>
                  {features.length > 1 && (
                    <button
                      onClick={() => setFeatures(features.filter((_, j) => j !== i))}
                      className="text-[11px] text-red-500 hover:text-red-700 font-semibold px-2 py-2.5"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ CTA ═════════════════════════════════════════════════════ */}
      {openSection === "cta" && (
        <div className={cardCls}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={sectionTitle}>🎯 CTA Section</h3>
            <SaveBtn section="cta" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title Line 1</label>
              <input value={cta.title1} onChange={(e) => setCTA({ ...cta, title1: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Title Line 2 (Highlighted)</label>
              <input value={cta.title2} onChange={(e) => setCTA({ ...cta, title2: e.target.value })} className={inputCls} />
            </div>
            <div className="col-span-full">
              <label className={labelCls}>Description</label>
              <textarea value={cta.description} onChange={(e) => setCTA({ ...cta, description: e.target.value })} className={`${inputCls} resize-none`} rows={2} />
            </div>
            <div>
              <label className={labelCls}>Button Text</label>
              <input value={cta.buttonText} onChange={(e) => setCTA({ ...cta, buttonText: e.target.value })} className={inputCls} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
