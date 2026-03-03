/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { saveSiteContent } from "@/lib/actions/admin";

interface HeroImage {
  src: string;
  alt: string;
}

interface HeroData {
  background: string;
  images: HeroImage[];
  headline: string;
  headlineAccent: string;
  subtitle: string;
  stats: { val: string; label: string }[];
}

const DEFAULTS: HeroData = {
  background: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1600&h=900&fit=crop&q=80",
  images: [
    { src: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&h=700&fit=crop&q=80", alt: "Kids learning chess together" },
    { src: "https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=600&h=400&fit=crop&q=80", alt: "Chess pieces during a game" },
    { src: "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=600&h=700&fit=crop&q=80", alt: "Young player concentrating" },
    { src: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=600&h=400&fit=crop&q=80", alt: "Chess coaching session" },
  ],
  headline: "Where Every Move",
  headlineAccent: "Matters.",
  subtitle: "A world-class chess academy, a life-changing foundation, and a thriving community — all united by the world's greatest game.",
  stats: [
    { val: "500+", label: "Students" },
    { val: "50+", label: "Events" },
    { val: "15+", label: "Coaches" },
  ],
};

const inputCls = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-400/40 focus:border-pink-400/40 outline-none transition-all placeholder:text-zinc-300";
const btnCls = "px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-pink-500/20 transition-all";

/* ── Image Upload Sub-component ─── */
function ImageUploadField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">{label}</label>
      {hint && <p className="text-[11px] text-zinc-400">{hint}</p>}

      {/* Preview */}
      {value && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50">
          <Image src={value} alt={label} fill className="object-cover" sizes="300px" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste image URL..."
          className={inputCls}
        />
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 text-xs font-semibold hover:bg-zinc-100 transition-all disabled:opacity-50"
        >
          {uploading ? "..." : "Upload"}
        </button>
      </div>
    </div>
  );
}

export default function AdminHeroManager({ initialData }: { initialData: HeroData | null }) {
  const [data, setData] = useState<HeroData>(initialData || DEFAULTS);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function update(patch: Partial<HeroData>) {
    setData((prev) => ({ ...prev, ...patch }));
    setSaved(false);
  }

  function updateImage(index: number, field: "src" | "alt", value: string) {
    const newImages = [...data.images];
    newImages[index] = { ...newImages[index], [field]: value };
    update({ images: newImages });
  }

  function updateStat(index: number, field: "val" | "label", value: string) {
    const newStats = [...data.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    update({ stats: newStats });
  }

  function handleSave() {
    startTransition(async () => {
      await saveSiteContent("home_hero", JSON.stringify(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  function handleReset() {
    setData(DEFAULTS);
    setSaved(false);
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Homepage Hero</h1>
          <p className="text-zinc-400 mt-1 text-sm">Manage the hero section — background, images, text & stats.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 text-sm font-semibold hover:bg-zinc-50 transition-all">
            Reset to Default
          </button>
          <button onClick={handleSave} disabled={isPending} className={btnCls}>
            {isPending ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Preview banner */}
      <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-zinc-200">
        {data.background ? (
          <Image src={data.background} alt="Hero preview" fill className="object-cover" sizes="800px" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-100 to-zinc-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <p className="text-2xl sm:text-3xl font-black text-zinc-900">{data.headline}</p>
            <p className="text-2xl sm:text-3xl font-black text-[#c9a84c]">{data.headlineAccent}</p>
            <p className="text-xs text-zinc-500 mt-2 max-w-xs line-clamp-2">{data.subtitle}</p>
          </div>
        </div>
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white text-[10px] font-semibold">
          PREVIEW
        </div>
      </div>

      {/* Sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Background Image */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-4">
          <h2 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500 text-sm">🖼</span>
            Background Image
          </h2>
          <ImageUploadField
            label="Hero background"
            value={data.background}
            onChange={(url) => update({ background: url })}
            hint="Recommended: 1600×900 or larger, landscape orientation"
          />
        </div>

        {/* Text Content */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-4">
          <h2 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500 text-sm">✏️</span>
            Text Content
          </h2>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Headline</label>
            <input className={inputCls} value={data.headline} onChange={(e) => update({ headline: e.target.value })} placeholder="Where Every Move" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Headline Accent <span className="text-zinc-300">(gold text)</span></label>
            <input className={inputCls} value={data.headlineAccent} onChange={(e) => update({ headlineAccent: e.target.value })} placeholder="Matters." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Subtitle</label>
            <textarea className={inputCls + " resize-none"} rows={3} value={data.subtitle} onChange={(e) => update({ subtitle: e.target.value })} placeholder="A world-class chess academy..." />
          </div>
        </div>
      </div>

      {/* Grid Images */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-5">
        <h2 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500 text-sm">📷</span>
          Photo Grid Images
          <span className="text-xs font-normal text-zinc-400 ml-2">4 images shown in the right-side grid</span>
        </h2>

        <div className="grid sm:grid-cols-2 gap-5">
          {data.images.map((img, i) => (
            <div key={i} className="space-y-3 p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-xs font-semibold text-zinc-600">
                  {i === 0 ? "Large (left column)" : i === 1 ? "Top right" : i === 2 ? "Bottom right small" : "Bottom right accent"}
                </span>
              </div>
              <ImageUploadField
                label={`Image ${i + 1}`}
                value={img.src}
                onChange={(url) => updateImage(i, "src", url)}
              />
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Alt text</label>
                <input className={inputCls} value={img.alt} onChange={(e) => updateImage(i, "alt", e.target.value)} placeholder="Describe this image..." />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-4">
        <h2 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500 text-sm">📊</span>
          Stats
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {data.stats.map((s, i) => (
            <div key={i} className="space-y-2 p-3 rounded-xl border border-zinc-100 bg-zinc-50/50">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Value</label>
                <input className={inputCls} value={s.val} onChange={(e) => updateStat(i, "val", e.target.value)} placeholder="500+" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Label</label>
                <input className={inputCls} value={s.label} onChange={(e) => updateStat(i, "label", e.target.value)} placeholder="Students" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile note */}
      <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-lg mt-0.5">📱</span>
        <div>
          <p className="text-sm font-semibold text-pink-800">Mobile View</p>
          <p className="text-xs text-pink-600/70 mt-0.5">
            On mobile, the background image shows with a stronger white overlay for readability. The photo grid displays as a stacked layout below the text. All content adapts automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
