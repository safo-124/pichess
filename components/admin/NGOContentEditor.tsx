"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { saveSiteContent } from "@/lib/actions/admin";
import {
  type NGOHeroData, type NGOStat, type NGOMissionTeaser, type NGOProgramsTeaser,
  type NGOPillar, type NGOValue, type NGOStorySection, type NGOProgram,
  type NGOProcessStep, type NGOTestimonial, type NGOTimelineItem, type NGOProgramsImpactStat,
  type NGOApplyContent, type NGOVolunteerContent, type NGODonateContent, type NGOStoriesContent,
  type NGOCTA, type NGOProgramsHero, type NGOMissionHero,
  defaultNGOHero, defaultNGOStats, defaultNGOMissionTeaser, defaultNGOProgramsTeaser,
  defaultNGOPillars, defaultNGOValues, defaultNGOStorySection, defaultNGOPrograms,
  defaultNGOProcessSteps, defaultNGOTestimonials, defaultNGOTimeline, defaultNGOProgramsStats,
  defaultNGOApply, defaultNGOVolunteer, defaultNGODonate, defaultNGOStoriesContent,
  defaultNGOCTA, defaultNGOProgramsHero, defaultNGOMissionHero,
} from "@/lib/ngo-content";

/* ── Styling ── */
const inputCls = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2e7d5b]/40 focus:border-[#2e7d5b]/40 outline-none transition-all placeholder:text-zinc-300";
const labelCls = "text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block";
const btnCls = "px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2e7d5b] to-[#256b4d] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#2e7d5b]/20 transition-all";
const sectionHeader = "flex items-center justify-between cursor-pointer select-none py-4 px-5 hover:bg-zinc-50/50 transition-colors";

/* ── Image uploader ── */
function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const upload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
      else alert(data.error || "Upload failed");
    } catch { alert("Upload failed"); } finally { setUploading(false); }
  }, [onChange]);

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-2 mb-1">
        <input value={value} onChange={e => onChange(e.target.value)} className={inputCls} placeholder="Image URL or upload" />
      </div>
      <div
        onClick={() => ref.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f?.type.startsWith("image/")) upload(f); }}
        className="rounded-xl border-2 border-dashed border-zinc-200 hover:border-zinc-300 p-3 text-center cursor-pointer transition-all text-xs text-zinc-400"
      >
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); }} />
        {uploading ? "Uploading…" : value ? (
          <div className="flex items-center gap-2 justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="w-12 h-8 rounded object-cover" />
            <span className="truncate max-w-[200px]">{value.split("/").pop()}</span>
          </div>
        ) : "Click or drag image"}
      </div>
    </div>
  );
}

/* ── Collapsible section wrapper ── */
function Section({ id, title, icon, open, onToggle, children }: {
  id: string; title: string; icon: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
      <div className={sectionHeader} onClick={onToggle}>
        <span className="text-sm font-bold text-zinc-800 flex items-center gap-2">
          <span>{icon}</span> {title}
        </span>
        <span className={`text-zinc-300 text-xs transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
      </div>
      {open && <div className="px-5 pb-5 space-y-4 border-t border-zinc-100 pt-4">{children}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN EDITOR
   ══════════════════════════════════════════════════════════════ */

interface Props {
  initialData: Record<string, string | null>;
}

export default function NGOContentEditor({ initialData }: Props) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggle = (id: string) => setOpenSections(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  /* Parse helpers — return default if missing/invalid, merge to fill new fields */
  function parse<T>(key: string, fallback: T): T {
    try {
      if (!initialData[key]) return fallback;
      const parsed = JSON.parse(initialData[key]!);
      if (fallback && typeof fallback === "object" && !Array.isArray(fallback)) {
        return { ...fallback, ...parsed };
      }
      return parsed as T;
    } catch { return fallback; }
  }

  /* State for each section */
  const [hero, setHero] = useState<NGOHeroData>(parse("ngo_hero", defaultNGOHero));
  const [stats, setStats] = useState<NGOStat[]>(parse("ngo_stats", defaultNGOStats));
  const [missionTeaser, setMissionTeaser] = useState<NGOMissionTeaser>(parse("ngo_mission_teaser", defaultNGOMissionTeaser));
  const [programsTeaser, setProgramsTeaser] = useState<NGOProgramsTeaser>(parse("ngo_programs_teaser", defaultNGOProgramsTeaser));
  const [pillars, setPillars] = useState<NGOPillar[]>(parse("ngo_pillars", defaultNGOPillars));
  const [values, setValues] = useState<NGOValue[]>(parse("ngo_values", defaultNGOValues));
  const [storySection, setStorySection] = useState<NGOStorySection>(parse("ngo_story_section", defaultNGOStorySection));
  const [programs, setPrograms] = useState<NGOProgram[]>(parse("ngo_programs", defaultNGOPrograms));
  const [processSteps, setProcessSteps] = useState<NGOProcessStep[]>(parse("ngo_process_steps", defaultNGOProcessSteps));
  const [testimonials, setTestimonials] = useState<NGOTestimonial[]>(parse("ngo_testimonials", defaultNGOTestimonials));
  const [timeline, setTimeline] = useState<NGOTimelineItem[]>(parse("ngo_timeline", defaultNGOTimeline));
  const [programsStats, setProgramsStats] = useState<NGOProgramsImpactStat[]>(parse("ngo_programs_stats", defaultNGOProgramsStats));
  const applyParsed = parse("ngo_apply", defaultNGOApply);
  const [applyContent, setApplyContent] = useState<NGOApplyContent>({ ...applyParsed, bottomCta: { ...defaultNGOApply.bottomCta, ...(applyParsed.bottomCta ?? {}) } });
  const [volunteerContent, setVolunteerContent] = useState<NGOVolunteerContent>(parse("ngo_volunteer", defaultNGOVolunteer));
  const [donateContent, setDonateContent] = useState<NGODonateContent>(parse("ngo_donate", defaultNGODonate));
  const [storiesContent, setStoriesContent] = useState<NGOStoriesContent>(parse("ngo_stories_content", defaultNGOStoriesContent));
  const [ctaContent, setCTAContent] = useState<NGOCTA>(parse("ngo_cta", defaultNGOCTA));
  const [programsHero, setProgramsHero] = useState<NGOProgramsHero>(parse("ngo_programs_hero", defaultNGOProgramsHero));
  const [missionHero, setMissionHero] = useState<NGOMissionHero>(parse("ngo_mission_hero", defaultNGOMissionHero));

  /* Save all */
  const saveAll = () => {
    setMessage("");
    startTransition(async () => {
      try {
        const entries: [string, unknown][] = [
          ["ngo_hero", hero], ["ngo_stats", stats], ["ngo_mission_teaser", missionTeaser],
          ["ngo_programs_teaser", programsTeaser], ["ngo_pillars", pillars], ["ngo_values", values],
          ["ngo_story_section", storySection], ["ngo_programs", programs], ["ngo_process_steps", processSteps],
          ["ngo_testimonials", testimonials], ["ngo_timeline", timeline], ["ngo_programs_stats", programsStats],
          ["ngo_apply", applyContent], ["ngo_volunteer", volunteerContent], ["ngo_donate", donateContent],
          ["ngo_stories_content", storiesContent], ["ngo_cta", ctaContent],
          ["ngo_programs_hero", programsHero], ["ngo_mission_hero", missionHero],
        ];
        for (const [key, val] of entries) {
          await saveSiteContent(key, JSON.stringify(val));
        }
        setMessage("All NGO content saved!");
      } catch { setMessage("Save failed."); }
    });
  };

  const isOpen = (id: string) => openSections.has(id);

  return (
    <div className="space-y-4">
      {/* ═══ Hero ═══ */}
      <Section id="hero" title="Homepage Hero" icon="🏠" open={isOpen("hero")} onToggle={() => toggle("hero")}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Badge Text</label><input className={inputCls} value={hero.badge} onChange={e => setHero({ ...hero, badge: e.target.value })} /></div>
          <div><label className={labelCls}>Title Line 1</label><input className={inputCls} value={hero.title1} onChange={e => setHero({ ...hero, title1: e.target.value })} /></div>
          <div><label className={labelCls}>Title Line 2 (highlighted)</label><input className={inputCls} value={hero.title2} onChange={e => setHero({ ...hero, title2: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className={labelCls}>Subtitle</label><textarea className={`${inputCls} resize-none`} rows={2} value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })} /></div>
          <ImageField label="Background Image" value={hero.backgroundImage} onChange={v => setHero({ ...hero, backgroundImage: v })} />
          <div><label className={labelCls}>CTA 1 Text</label><input className={inputCls} value={hero.cta1Text} onChange={e => setHero({ ...hero, cta1Text: e.target.value })} /></div>
          <div><label className={labelCls}>CTA 1 Link</label><input className={inputCls} value={hero.cta1Link} onChange={e => setHero({ ...hero, cta1Link: e.target.value })} /></div>
          <div><label className={labelCls}>CTA 2 Text</label><input className={inputCls} value={hero.cta2Text} onChange={e => setHero({ ...hero, cta2Text: e.target.value })} /></div>
          <div><label className={labelCls}>CTA 2 Link</label><input className={inputCls} value={hero.cta2Link} onChange={e => setHero({ ...hero, cta2Link: e.target.value })} /></div>
        </div>
        <div className="mt-4">
          <label className={labelCls}>Floating Images ({hero.floatingImages.length})</label>
          {hero.floatingImages.map((img, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input className={`${inputCls} flex-1`} placeholder="Image URL" value={img.src} onChange={e => { const fi = [...hero.floatingImages]; fi[i] = { ...fi[i], src: e.target.value }; setHero({ ...hero, floatingImages: fi }); }} />
              <input className={`${inputCls} w-40`} placeholder="Alt text" value={img.alt} onChange={e => { const fi = [...hero.floatingImages]; fi[i] = { ...fi[i], alt: e.target.value }; setHero({ ...hero, floatingImages: fi }); }} />
              <button onClick={() => { const fi = hero.floatingImages.filter((_, j) => j !== i); setHero({ ...hero, floatingImages: fi }); }} className="text-red-400 hover:text-red-600 text-xs font-bold px-2">✕</button>
            </div>
          ))}
          <button onClick={() => setHero({ ...hero, floatingImages: [...hero.floatingImages, { src: "", alt: "" }] })} className="text-xs text-[#2e7d5b] font-bold">+ Add Image</button>
        </div>
      </Section>

      {/* ═══ Stats ═══ */}
      <Section id="stats" title="Impact Stats (Homepage)" icon="📊" open={isOpen("stats")} onToggle={() => toggle("stats")}>
        {stats.map((s, i) => (
          <div key={i} className="grid grid-cols-3 gap-3">
            <div><label className={labelCls}>Value</label><input type="number" className={inputCls} value={s.value} onChange={e => { const ns = [...stats]; ns[i] = { ...ns[i], value: Number(e.target.value) }; setStats(ns); }} /></div>
            <div><label className={labelCls}>Label</label><input className={inputCls} value={s.label} onChange={e => { const ns = [...stats]; ns[i] = { ...ns[i], label: e.target.value }; setStats(ns); }} /></div>
            <div><label className={labelCls}>Suffix</label><input className={inputCls} value={s.suffix} onChange={e => { const ns = [...stats]; ns[i] = { ...ns[i], suffix: e.target.value }; setStats(ns); }} /></div>
          </div>
        ))}
      </Section>

      {/* ═══ Mission Teaser ═══ */}
      <Section id="mission-teaser" title="Mission Section (Homepage)" icon="🎯" open={isOpen("mission-teaser")} onToggle={() => toggle("mission-teaser")}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Badge</label><input className={inputCls} value={missionTeaser.badge} onChange={e => setMissionTeaser({ ...missionTeaser, badge: e.target.value })} /></div>
          <div><label className={labelCls}>Heading</label><input className={inputCls} value={missionTeaser.heading} onChange={e => setMissionTeaser({ ...missionTeaser, heading: e.target.value })} /></div>
          <div><label className={labelCls}>Highlighted Text</label><input className={inputCls} value={missionTeaser.headingHighlight} onChange={e => setMissionTeaser({ ...missionTeaser, headingHighlight: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className={labelCls}>Description</label><textarea className={`${inputCls} resize-none`} rows={2} value={missionTeaser.description} onChange={e => setMissionTeaser({ ...missionTeaser, description: e.target.value })} /></div>
          <ImageField label="Background Image" value={missionTeaser.backgroundImage} onChange={v => setMissionTeaser({ ...missionTeaser, backgroundImage: v })} />
          <div><label className={labelCls}>CTA Text</label><input className={inputCls} value={missionTeaser.ctaText} onChange={e => setMissionTeaser({ ...missionTeaser, ctaText: e.target.value })} /></div>
        </div>
      </Section>

      {/* ═══ Programs Teaser ═══ */}
      <Section id="programs-teaser" title="Programs Section (Homepage)" icon="📦" open={isOpen("programs-teaser")} onToggle={() => toggle("programs-teaser")}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Badge</label><input className={inputCls} value={programsTeaser.badge} onChange={e => setProgramsTeaser({ ...programsTeaser, badge: e.target.value })} /></div>
          <div><label className={labelCls}>Heading</label><input className={inputCls} value={programsTeaser.heading} onChange={e => setProgramsTeaser({ ...programsTeaser, heading: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className={labelCls}>Description</label><textarea className={`${inputCls} resize-none`} rows={2} value={programsTeaser.description} onChange={e => setProgramsTeaser({ ...programsTeaser, description: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className={labelCls}>Tags (comma separated)</label><input className={inputCls} value={programsTeaser.tags.join(", ")} onChange={e => setProgramsTeaser({ ...programsTeaser, tags: e.target.value.split(",").map(t => t.trim()) })} /></div>
          <div><label className={labelCls}>CTA Text</label><input className={inputCls} value={programsTeaser.ctaText} onChange={e => setProgramsTeaser({ ...programsTeaser, ctaText: e.target.value })} /></div>
        </div>
      </Section>

      {/* ═══ Mission Page Hero ═══ */}
      <Section id="mission-hero" title="Mission Page — Hero" icon="🏔️" open={isOpen("mission-hero")} onToggle={() => toggle("mission-hero")}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Badge</label><input className={inputCls} value={missionHero.badge} onChange={e => setMissionHero({ ...missionHero, badge: e.target.value })} /></div>
          <div><label className={labelCls}>Heading</label><input className={inputCls} value={missionHero.heading} onChange={e => setMissionHero({ ...missionHero, heading: e.target.value })} /></div>
          <div><label className={labelCls}>Highlighted Text</label><input className={inputCls} value={missionHero.headingHighlight} onChange={e => setMissionHero({ ...missionHero, headingHighlight: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className={labelCls}>Subtitle</label><textarea className={`${inputCls} resize-none`} rows={2} value={missionHero.subtitle} onChange={e => setMissionHero({ ...missionHero, subtitle: e.target.value })} /></div>
          <ImageField label="Background Image" value={missionHero.backgroundImage} onChange={v => setMissionHero({ ...missionHero, backgroundImage: v })} />
        </div>
      </Section>

      {/* ═══ Our Story ═══ */}
      <Section id="story" title="Mission Page — Our Story" icon="📖" open={isOpen("story")} onToggle={() => toggle("story")}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className={labelCls}>Heading</label><input className={inputCls} value={storySection.heading} onChange={e => setStorySection({ ...storySection, heading: e.target.value })} /></div>
          {storySection.paragraphs.map((p, i) => (
            <div key={i} className="sm:col-span-2">
              <label className={labelCls}>Paragraph {i + 1}</label>
              <textarea className={`${inputCls} resize-none`} rows={3} value={p} onChange={e => { const ps = [...storySection.paragraphs]; ps[i] = e.target.value; setStorySection({ ...storySection, paragraphs: ps }); }} />
            </div>
          ))}
          <ImageField label="Story Image" value={storySection.image} onChange={v => setStorySection({ ...storySection, image: v })} />
          <div><label className={labelCls}>Accent Value</label><input className={inputCls} value={storySection.accentValue} onChange={e => setStorySection({ ...storySection, accentValue: e.target.value })} /></div>
          <div><label className={labelCls}>Accent Label</label><input className={inputCls} value={storySection.accentLabel} onChange={e => setStorySection({ ...storySection, accentLabel: e.target.value })} /></div>
        </div>
      </Section>

      {/* ═══ Pillars ═══ */}
      <Section id="pillars" title="Mission Page — Four Pillars" icon="🏛️" open={isOpen("pillars")} onToggle={() => toggle("pillars")}>
        {pillars.map((p, i) => (
          <div key={i} className="p-4 border border-zinc-100 rounded-xl space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div><label className={labelCls}>Icon</label><input className={inputCls} value={p.icon} onChange={e => { const np = [...pillars]; np[i] = { ...np[i], icon: e.target.value }; setPillars(np); }} /></div>
              <div className="col-span-2"><label className={labelCls}>Title</label><input className={inputCls} value={p.title} onChange={e => { const np = [...pillars]; np[i] = { ...np[i], title: e.target.value }; setPillars(np); }} /></div>
            </div>
            <div><label className={labelCls}>Description</label><textarea className={`${inputCls} resize-none`} rows={2} value={p.desc} onChange={e => { const np = [...pillars]; np[i] = { ...np[i], desc: e.target.value }; setPillars(np); }} /></div>
            <ImageField label="Image" value={p.image} onChange={v => { const np = [...pillars]; np[i] = { ...np[i], image: v }; setPillars(np); }} />
          </div>
        ))}
      </Section>

      {/* ═══ Values ═══ */}
      <Section id="values" title="Mission Page — Core Values" icon="💎" open={isOpen("values")} onToggle={() => toggle("values")}>
        {values.map((v, i) => (
          <div key={i} className="grid grid-cols-4 gap-3 p-3 border border-zinc-100 rounded-xl">
            <div><label className={labelCls}>Icon</label><input className={inputCls} value={v.icon} onChange={e => { const nv = [...values]; nv[i] = { ...nv[i], icon: e.target.value }; setValues(nv); }} /></div>
            <div><label className={labelCls}>Title</label><input className={inputCls} value={v.title} onChange={e => { const nv = [...values]; nv[i] = { ...nv[i], title: e.target.value }; setValues(nv); }} /></div>
            <div className="col-span-2"><label className={labelCls}>Description</label><input className={inputCls} value={v.desc} onChange={e => { const nv = [...values]; nv[i] = { ...nv[i], desc: e.target.value }; setValues(nv); }} /></div>
          </div>
        ))}
        <button onClick={() => setValues([...values, { icon: "🆕", title: "", desc: "" }])} className="text-xs text-[#2e7d5b] font-bold">+ Add Value</button>
      </Section>

      {/* ═══ CTA ═══ */}
      <Section id="cta" title="Mission Page — CTA Section" icon="📢" open={isOpen("cta")} onToggle={() => toggle("cta")}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className={labelCls}>Heading</label><input className={inputCls} value={ctaContent.heading} onChange={e => setCTAContent({ ...ctaContent, heading: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className={labelCls}>Description</label><textarea className={`${inputCls} resize-none`} rows={2} value={ctaContent.description} onChange={e => setCTAContent({ ...ctaContent, description: e.target.value })} /></div>
          <div><label className={labelCls}>CTA 1 Text</label><input className={inputCls} value={ctaContent.cta1Text} onChange={e => setCTAContent({ ...ctaContent, cta1Text: e.target.value })} /></div>
          <div><label className={labelCls}>CTA 1 Link</label><input className={inputCls} value={ctaContent.cta1Link} onChange={e => setCTAContent({ ...ctaContent, cta1Link: e.target.value })} /></div>
          <div><label className={labelCls}>CTA 2 Text</label><input className={inputCls} value={ctaContent.cta2Text} onChange={e => setCTAContent({ ...ctaContent, cta2Text: e.target.value })} /></div>
          <div><label className={labelCls}>CTA 2 Link</label><input className={inputCls} value={ctaContent.cta2Link} onChange={e => setCTAContent({ ...ctaContent, cta2Link: e.target.value })} /></div>
          <div><label className={labelCls}>CTA 3 Text</label><input className={inputCls} value={ctaContent.cta3Text} onChange={e => setCTAContent({ ...ctaContent, cta3Text: e.target.value })} /></div>
          <div><label className={labelCls}>CTA 3 Link</label><input className={inputCls} value={ctaContent.cta3Link} onChange={e => setCTAContent({ ...ctaContent, cta3Link: e.target.value })} /></div>
        </div>
      </Section>

      {/* ═══ Programs Page Hero ═══ */}
      <Section id="prog-hero" title="Programs Page — Hero" icon="🎬" open={isOpen("prog-hero")} onToggle={() => toggle("prog-hero")}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Badge</label><input className={inputCls} value={programsHero.badge} onChange={e => setProgramsHero({ ...programsHero, badge: e.target.value })} /></div>
          <div><label className={labelCls}>Title</label><input className={inputCls} value={programsHero.title} onChange={e => setProgramsHero({ ...programsHero, title: e.target.value })} /></div>
          <div><label className={labelCls}>Title Highlight</label><input className={inputCls} value={programsHero.titleHighlight} onChange={e => setProgramsHero({ ...programsHero, titleHighlight: e.target.value })} /></div>
          <div><label className={labelCls}>Title End</label><input className={inputCls} value={programsHero.titleEnd} onChange={e => setProgramsHero({ ...programsHero, titleEnd: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className={labelCls}>Subtitle</label><textarea className={`${inputCls} resize-none`} rows={2} value={programsHero.subtitle} onChange={e => setProgramsHero({ ...programsHero, subtitle: e.target.value })} /></div>
          <ImageField label="Background Image" value={programsHero.backgroundImage} onChange={v => setProgramsHero({ ...programsHero, backgroundImage: v })} />
          <div><label className={labelCls}>CTA Text</label><input className={inputCls} value={programsHero.ctaText} onChange={e => setProgramsHero({ ...programsHero, ctaText: e.target.value })} /></div>
          <div><label className={labelCls}>CTA Link</label><input className={inputCls} value={programsHero.ctaLink} onChange={e => setProgramsHero({ ...programsHero, ctaLink: e.target.value })} /></div>
          <div><label className={labelCls}>Secondary CTA Text</label><input className={inputCls} value={programsHero.secondaryCtaText} onChange={e => setProgramsHero({ ...programsHero, secondaryCtaText: e.target.value })} /></div>
          <div><label className={labelCls}>Secondary CTA Link</label><input className={inputCls} value={programsHero.secondaryCtaLink} onChange={e => setProgramsHero({ ...programsHero, secondaryCtaLink: e.target.value })} /></div>
        </div>
        <div className="border-t border-zinc-100 mt-5 pt-5">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Programs Section Heading</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Badge</label><input className={inputCls} value={programsHero.sectionBadge ?? "What We Do"} onChange={e => setProgramsHero({ ...programsHero, sectionBadge: e.target.value })} /></div>
            <div><label className={labelCls}>Heading</label><input className={inputCls} value={programsHero.sectionHeading ?? "Our Six Programs"} onChange={e => setProgramsHero({ ...programsHero, sectionHeading: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Description</label><textarea className={`${inputCls} resize-none`} rows={2} value={programsHero.sectionDescription ?? ""} onChange={e => setProgramsHero({ ...programsHero, sectionDescription: e.target.value })} /></div>
          </div>
        </div>
      </Section>

      {/* ═══ Programs ═══ */}
      <Section id="programs" title={`Programs Page — Programs (${programs.length})`} icon="🎯" open={isOpen("programs")} onToggle={() => toggle("programs")}>
        {programs.map((p, i) => (
          <details key={p.id} className="border border-zinc-100 rounded-xl overflow-hidden">
            <summary className="px-4 py-3 cursor-pointer hover:bg-zinc-50 font-semibold text-sm text-zinc-700 flex items-center gap-2">
              <span>{p.icon}</span> <span className="flex-1">{p.title || `Program ${i + 1}`}</span>
              <button onClick={e => { e.preventDefault(); setPrograms(programs.filter((_, j) => j !== i)); }} className="text-red-400 hover:text-red-600 text-xs font-bold px-2" title="Remove program">✕</button>
            </summary>
            <div className="p-4 space-y-3 bg-zinc-50/30">
              <div className="grid grid-cols-3 gap-3">
                <div><label className={labelCls}>Icon</label><input className={inputCls} value={p.icon} onChange={e => { const np = [...programs]; np[i] = { ...np[i], icon: e.target.value }; setPrograms(np); }} /></div>
                <div><label className={labelCls}>Badge</label><input className={inputCls} value={p.badge} onChange={e => { const np = [...programs]; np[i] = { ...np[i], badge: e.target.value }; setPrograms(np); }} /></div>
                <div><label className={labelCls}>Color</label><input type="color" className="h-10 w-full rounded-xl border border-zinc-200 cursor-pointer" value={p.color} onChange={e => { const np = [...programs]; np[i] = { ...np[i], color: e.target.value }; setPrograms(np); }} /></div>
              </div>
              <div><label className={labelCls}>Title</label><input className={inputCls} value={p.title} onChange={e => { const np = [...programs]; np[i] = { ...np[i], title: e.target.value }; setPrograms(np); }} /></div>
              <div><label className={labelCls}>Subtitle</label><input className={inputCls} value={p.subtitle} onChange={e => { const np = [...programs]; np[i] = { ...np[i], subtitle: e.target.value }; setPrograms(np); }} /></div>
              <div><label className={labelCls}>Description</label><textarea className={`${inputCls} resize-none`} rows={3} value={p.desc} onChange={e => { const np = [...programs]; np[i] = { ...np[i], desc: e.target.value }; setPrograms(np); }} /></div>
              <div><label className={labelCls}>Impact Stat</label><input className={inputCls} value={p.impact} onChange={e => { const np = [...programs]; np[i] = { ...np[i], impact: e.target.value }; setPrograms(np); }} /></div>
              <ImageField label="Image" value={p.image} onChange={v => { const np = [...programs]; np[i] = { ...np[i], image: v }; setPrograms(np); }} />
              <div>
                <label className={labelCls}>Details (bullet points)</label>
                {p.details.map((d, j) => (
                  <div key={j} className="flex gap-2 mb-1">
                    <input className={`${inputCls} flex-1`} value={d} onChange={e => { const np = [...programs]; const nd = [...np[i].details]; nd[j] = e.target.value; np[i] = { ...np[i], details: nd }; setPrograms(np); }} />
                    <button onClick={() => { const np = [...programs]; np[i] = { ...np[i], details: np[i].details.filter((_, k) => k !== j) }; setPrograms(np); }} className="text-red-400 text-xs font-bold px-2">✕</button>
                  </div>
                ))}
                <button onClick={() => { const np = [...programs]; np[i] = { ...np[i], details: [...np[i].details, ""] }; setPrograms(np); }} className="text-xs text-[#2e7d5b] font-bold">+ Add Detail</button>
              </div>
            </div>
          </details>
        ))}
        <button onClick={() => setPrograms([...programs, { id: Math.random().toString(36).slice(2, 10), badge: "New Program", icon: "♟", title: "", subtitle: "", desc: "", details: [], impact: "", image: "", color: "#2e7d5b" }])} className="text-xs text-[#2e7d5b] font-bold mt-2">+ Add Program</button>
      </Section>

      {/* ═══ Process Steps ═══ */}
      <Section id="process" title="Programs Page — Process Steps" icon="⚙️" open={isOpen("process")} onToggle={() => toggle("process")}>
        {processSteps.map((s, i) => (
          <div key={i} className="flex gap-2 items-start p-3 border border-zinc-100 rounded-xl">
            <div className="grid grid-cols-4 gap-3 flex-1">
              <div><label className={labelCls}>Number</label><input className={inputCls} value={s.num} onChange={e => { const ns = [...processSteps]; ns[i] = { ...ns[i], num: e.target.value }; setProcessSteps(ns); }} /></div>
              <div><label className={labelCls}>Title</label><input className={inputCls} value={s.title} onChange={e => { const ns = [...processSteps]; ns[i] = { ...ns[i], title: e.target.value }; setProcessSteps(ns); }} /></div>
              <div className="col-span-2"><label className={labelCls}>Description</label><input className={inputCls} value={s.desc} onChange={e => { const ns = [...processSteps]; ns[i] = { ...ns[i], desc: e.target.value }; setProcessSteps(ns); }} /></div>
            </div>
            <button onClick={() => setProcessSteps(processSteps.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-xs font-bold px-2 mt-6" title="Remove">✕</button>
          </div>
        ))}
        <button onClick={() => setProcessSteps([...processSteps, { num: String(processSteps.length + 1).padStart(2, "0"), title: "", desc: "" }])} className="text-xs text-[#2e7d5b] font-bold mt-2">+ Add Step</button>
      </Section>

      {/* ═══ Impact Stats ═══ */}
      <Section id="prog-stats" title="Programs Page — Impact Numbers" icon="📈" open={isOpen("prog-stats")} onToggle={() => toggle("prog-stats")}>
        {programsStats.map((s, i) => (
          <div key={i} className="flex gap-2 items-start p-3 border border-zinc-100 rounded-xl">
            <div className="grid grid-cols-3 gap-3 flex-1">
              <div><label className={labelCls}>Icon</label><input className={inputCls} value={s.icon} onChange={e => { const ns = [...programsStats]; ns[i] = { ...ns[i], icon: e.target.value }; setProgramsStats(ns); }} /></div>
              <div><label className={labelCls}>Value</label><input className={inputCls} value={s.value} onChange={e => { const ns = [...programsStats]; ns[i] = { ...ns[i], value: e.target.value }; setProgramsStats(ns); }} /></div>
              <div><label className={labelCls}>Label</label><input className={inputCls} value={s.label} onChange={e => { const ns = [...programsStats]; ns[i] = { ...ns[i], label: e.target.value }; setProgramsStats(ns); }} /></div>
            </div>
            <button onClick={() => setProgramsStats(programsStats.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-xs font-bold px-2 mt-6" title="Remove">✕</button>
          </div>
        ))}
        <button onClick={() => setProgramsStats([...programsStats, { icon: "📊", value: "", label: "" }])} className="text-xs text-[#2e7d5b] font-bold mt-2">+ Add Stat</button>
      </Section>

      {/* ═══ Testimonials ═══ */}
      <Section id="testimonials" title="Programs Page — Testimonials" icon="💬" open={isOpen("testimonials")} onToggle={() => toggle("testimonials")}>
        {testimonials.map((t, i) => (
          <div key={i} className="p-4 border border-zinc-100 rounded-xl space-y-3">
            <div className="flex items-start gap-2">
              <div className="grid grid-cols-3 gap-3 flex-1">
                <div><label className={labelCls}>Avatar (emoji)</label><input className={inputCls} value={t.avatar} onChange={e => { const nt = [...testimonials]; nt[i] = { ...nt[i], avatar: e.target.value }; setTestimonials(nt); }} /></div>
                <div><label className={labelCls}>Name</label><input className={inputCls} value={t.name} onChange={e => { const nt = [...testimonials]; nt[i] = { ...nt[i], name: e.target.value }; setTestimonials(nt); }} /></div>
                <div><label className={labelCls}>Role</label><input className={inputCls} value={t.role} onChange={e => { const nt = [...testimonials]; nt[i] = { ...nt[i], role: e.target.value }; setTestimonials(nt); }} /></div>
              </div>
              <button onClick={() => setTestimonials(testimonials.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-xs font-bold px-2 mt-6" title="Remove">✕</button>
            </div>
            <div><label className={labelCls}>Quote</label><textarea className={`${inputCls} resize-none`} rows={2} value={t.quote} onChange={e => { const nt = [...testimonials]; nt[i] = { ...nt[i], quote: e.target.value }; setTestimonials(nt); }} /></div>
          </div>
        ))}
        <button onClick={() => setTestimonials([...testimonials, { quote: "", name: "", role: "", avatar: "♟" }])} className="text-xs text-[#2e7d5b] font-bold">+ Add Testimonial</button>
      </Section>

      {/* ═══ Timeline ═══ */}
      <Section id="timeline" title="Programs Page — Timeline" icon="📅" open={isOpen("timeline")} onToggle={() => toggle("timeline")}>
        {timeline.map((t, i) => (
          <div key={i} className="flex gap-2 items-start p-3 border border-zinc-100 rounded-xl">
            <div className="grid grid-cols-4 gap-3 flex-1">
              <div><label className={labelCls}>Year</label><input className={inputCls} value={t.year} onChange={e => { const nt = [...timeline]; nt[i] = { ...nt[i], year: e.target.value }; setTimeline(nt); }} /></div>
              <div><label className={labelCls}>Title</label><input className={inputCls} value={t.title} onChange={e => { const nt = [...timeline]; nt[i] = { ...nt[i], title: e.target.value }; setTimeline(nt); }} /></div>
              <div className="col-span-2"><label className={labelCls}>Description</label><input className={inputCls} value={t.desc} onChange={e => { const nt = [...timeline]; nt[i] = { ...nt[i], desc: e.target.value }; setTimeline(nt); }} /></div>
            </div>
            <button onClick={() => setTimeline(timeline.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-xs font-bold px-2 mt-6" title="Remove">✕</button>
          </div>
        ))}
        <button onClick={() => setTimeline([...timeline, { year: "", title: "", desc: "" }])} className="text-xs text-[#2e7d5b] font-bold">+ Add Milestone</button>
      </Section>

      {/* ═══ Apply Page ═══ */}
      <Section id="apply" title="Partner with Us Page" icon="🤝" open={isOpen("apply")} onToggle={() => toggle("apply")}>
        {/* Hero */}
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Hero Section</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className={labelCls}>Hero Image URL</label><input className={inputCls} value={applyContent.heroImage} onChange={e => setApplyContent({ ...applyContent, heroImage: e.target.value })} /></div>
          <div><label className={labelCls}>Hero Badge</label><input className={inputCls} value={applyContent.heroBadge} onChange={e => setApplyContent({ ...applyContent, heroBadge: e.target.value })} /></div>
          <div><label className={labelCls}>CTA Button Text</label><input className={inputCls} value={applyContent.ctaButtonText} onChange={e => setApplyContent({ ...applyContent, ctaButtonText: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className={labelCls}>Heading</label><input className={inputCls} value={applyContent.heading} onChange={e => setApplyContent({ ...applyContent, heading: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className={labelCls}>Subtitle</label><textarea className={`${inputCls} resize-none`} rows={2} value={applyContent.subtitle} onChange={e => setApplyContent({ ...applyContent, subtitle: e.target.value })} /></div>
        </div>

        {/* Benefits */}
        <div className="mt-6 pt-4 border-t border-zinc-100">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Benefits Section</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-3">
            <div><label className={labelCls}>Badge</label><input className={inputCls} value={applyContent.benefitsBadge} onChange={e => setApplyContent({ ...applyContent, benefitsBadge: e.target.value })} /></div>
            <div><label className={labelCls}>Heading</label><input className={inputCls} value={applyContent.benefitsHeading} onChange={e => setApplyContent({ ...applyContent, benefitsHeading: e.target.value })} /></div>
          </div>
          <label className={labelCls}>Benefit Cards</label>
          {applyContent.benefits.map((b, i) => (
            <div key={i} className="flex gap-2 items-start mb-2">
              <div className="grid grid-cols-4 gap-2 flex-1">
                <input className={inputCls} placeholder="Icon" value={b.icon} onChange={e => { const nb = [...applyContent.benefits]; nb[i] = { ...nb[i], icon: e.target.value }; setApplyContent({ ...applyContent, benefits: nb }); }} />
                <input className={inputCls} placeholder="Title" value={b.title} onChange={e => { const nb = [...applyContent.benefits]; nb[i] = { ...nb[i], title: e.target.value }; setApplyContent({ ...applyContent, benefits: nb }); }} />
                <input className={`${inputCls} col-span-2`} placeholder="Description" value={b.desc} onChange={e => { const nb = [...applyContent.benefits]; nb[i] = { ...nb[i], desc: e.target.value }; setApplyContent({ ...applyContent, benefits: nb }); }} />
              </div>
              <button onClick={() => setApplyContent({ ...applyContent, benefits: applyContent.benefits.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-600 text-xs font-bold px-2 mt-2" title="Remove">✕</button>
            </div>
          ))}
          <button onClick={() => setApplyContent({ ...applyContent, benefits: [...applyContent.benefits, { icon: "", title: "", desc: "" }] })} className="text-xs text-[#2e7d5b] font-bold">+ Add Benefit</button>
        </div>

        {/* Form */}
        <div className="mt-6 pt-4 border-t border-zinc-100">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Form Section</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Badge Prefix (e.g. &quot;Step&quot;)</label><input className={inputCls} value={applyContent.formBadgePrefix} onChange={e => setApplyContent({ ...applyContent, formBadgePrefix: e.target.value })} /></div>
            <div><label className={labelCls}>Form Heading</label><input className={inputCls} value={applyContent.formHeading} onChange={e => setApplyContent({ ...applyContent, formHeading: e.target.value })} /></div>
          </div>
        </div>

        {/* Success */}
        <div className="mt-6 pt-4 border-t border-zinc-100">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Success State</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Success Heading</label><input className={inputCls} value={applyContent.successHeading} onChange={e => setApplyContent({ ...applyContent, successHeading: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Success Message</label><textarea className={`${inputCls} resize-none`} rows={2} value={applyContent.successMessage} onChange={e => setApplyContent({ ...applyContent, successMessage: e.target.value })} /></div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-6 pt-4 border-t border-zinc-100">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">FAQs</p>
          {applyContent.faqs.map((f, i) => (
            <div key={i} className="flex gap-2 items-start mb-3 p-3 border border-zinc-100 rounded-xl">
              <div className="grid sm:grid-cols-2 gap-2 flex-1">
                <div><label className={labelCls}>Question</label><input className={inputCls} value={f.q} onChange={e => { const nf = [...applyContent.faqs]; nf[i] = { ...nf[i], q: e.target.value }; setApplyContent({ ...applyContent, faqs: nf }); }} /></div>
                <div><label className={labelCls}>Answer</label><textarea className={`${inputCls} resize-none`} rows={2} value={f.a} onChange={e => { const nf = [...applyContent.faqs]; nf[i] = { ...nf[i], a: e.target.value }; setApplyContent({ ...applyContent, faqs: nf }); }} /></div>
              </div>
              <button onClick={() => setApplyContent({ ...applyContent, faqs: applyContent.faqs.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-600 text-xs font-bold px-2 mt-6" title="Remove">✕</button>
            </div>
          ))}
          <button onClick={() => setApplyContent({ ...applyContent, faqs: [...applyContent.faqs, { q: "", a: "" }] })} className="text-xs text-[#2e7d5b] font-bold">+ Add FAQ</button>
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 pt-4 border-t border-zinc-100">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Bottom CTA</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Icon (emoji)</label><input className={inputCls} value={applyContent.bottomCta.icon} onChange={e => setApplyContent({ ...applyContent, bottomCta: { ...applyContent.bottomCta, icon: e.target.value } })} /></div>
            <div><label className={labelCls}>Heading</label><input className={inputCls} value={applyContent.bottomCta.heading} onChange={e => setApplyContent({ ...applyContent, bottomCta: { ...applyContent.bottomCta, heading: e.target.value } })} /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Description</label><textarea className={`${inputCls} resize-none`} rows={2} value={applyContent.bottomCta.description} onChange={e => setApplyContent({ ...applyContent, bottomCta: { ...applyContent.bottomCta, description: e.target.value } })} /></div>
          </div>
          <div className="mt-3">
            <label className={labelCls}>Links</label>
            {applyContent.bottomCta.links.map((link, i) => (
              <div key={i} className="flex gap-2 items-center mb-2">
                <input className={`${inputCls} flex-1`} placeholder="Label" value={link.label} onChange={e => { const nl = [...applyContent.bottomCta.links]; nl[i] = { ...nl[i], label: e.target.value }; setApplyContent({ ...applyContent, bottomCta: { ...applyContent.bottomCta, links: nl } }); }} />
                <input className={`${inputCls} flex-1`} placeholder="Href (e.g. /ngo/programs)" value={link.href} onChange={e => { const nl = [...applyContent.bottomCta.links]; nl[i] = { ...nl[i], href: e.target.value }; setApplyContent({ ...applyContent, bottomCta: { ...applyContent.bottomCta, links: nl } }); }} />
                <button onClick={() => setApplyContent({ ...applyContent, bottomCta: { ...applyContent.bottomCta, links: applyContent.bottomCta.links.filter((_, j) => j !== i) } })} className="text-red-400 hover:text-red-600 text-xs font-bold px-2" title="Remove">✕</button>
              </div>
            ))}
            <button onClick={() => setApplyContent({ ...applyContent, bottomCta: { ...applyContent.bottomCta, links: [...applyContent.bottomCta.links, { label: "", href: "" }] } })} className="text-xs text-[#2e7d5b] font-bold">+ Add Link</button>
          </div>
        </div>
      </Section>

      {/* ═══ Volunteer Page ═══ */}
      <Section id="volunteer" title="Volunteer Page Content" icon="🤝" open={isOpen("volunteer")} onToggle={() => toggle("volunteer")}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className={labelCls}>Heading</label><input className={inputCls} value={volunteerContent.heading} onChange={e => setVolunteerContent({ ...volunteerContent, heading: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className={labelCls}>Subtitle</label><textarea className={`${inputCls} resize-none`} rows={2} value={volunteerContent.subtitle} onChange={e => setVolunteerContent({ ...volunteerContent, subtitle: e.target.value })} /></div>
        </div>
        <div className="mt-4">
          <label className={labelCls}>Benefits</label>
          {volunteerContent.benefits.map((b, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 mb-2">
              <input className={inputCls} placeholder="Icon" value={b.icon} onChange={e => { const nb = [...volunteerContent.benefits]; nb[i] = { ...nb[i], icon: e.target.value }; setVolunteerContent({ ...volunteerContent, benefits: nb }); }} />
              <input className={inputCls} placeholder="Title" value={b.title} onChange={e => { const nb = [...volunteerContent.benefits]; nb[i] = { ...nb[i], title: e.target.value }; setVolunteerContent({ ...volunteerContent, benefits: nb }); }} />
              <input className={inputCls} placeholder="Description" value={b.desc} onChange={e => { const nb = [...volunteerContent.benefits]; nb[i] = { ...nb[i], desc: e.target.value }; setVolunteerContent({ ...volunteerContent, benefits: nb }); }} />
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ Donate Page ═══ */}
      <Section id="donate" title="Donate Page Content" icon="💰" open={isOpen("donate")} onToggle={() => toggle("donate")}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className={labelCls}>Heading</label><input className={inputCls} value={donateContent.heading} onChange={e => setDonateContent({ ...donateContent, heading: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className={labelCls}>Subtitle</label><textarea className={`${inputCls} resize-none`} rows={2} value={donateContent.subtitle} onChange={e => setDonateContent({ ...donateContent, subtitle: e.target.value })} /></div>
        </div>
        <div className="mt-4">
          <label className={labelCls}>Donation Tiers</label>
          {donateContent.tiers.map((t, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 mb-2">
              <input className={inputCls} placeholder="Amount" value={t.amount} onChange={e => { const nt = [...donateContent.tiers]; nt[i] = { ...nt[i], amount: e.target.value }; setDonateContent({ ...donateContent, tiers: nt }); }} />
              <input className={inputCls} placeholder="Description" value={t.desc} onChange={e => { const nt = [...donateContent.tiers]; nt[i] = { ...nt[i], desc: e.target.value }; setDonateContent({ ...donateContent, tiers: nt }); }} />
            </div>
          ))}
          <button onClick={() => setDonateContent({ ...donateContent, tiers: [...donateContent.tiers, { amount: "", desc: "" }] })} className="text-xs text-[#2e7d5b] font-bold">+ Add Tier</button>
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Mobile Money Details</label><textarea className={`${inputCls} resize-none`} rows={3} value={donateContent.momoDetails} onChange={e => setDonateContent({ ...donateContent, momoDetails: e.target.value })} /></div>
          <div><label className={labelCls}>Bank Details</label><textarea className={`${inputCls} resize-none`} rows={3} value={donateContent.bankDetails} onChange={e => setDonateContent({ ...donateContent, bankDetails: e.target.value })} /></div>
        </div>
        <div><label className={labelCls}>Material Donation Note</label><textarea className={`${inputCls} resize-none`} rows={2} value={donateContent.materialNote} onChange={e => setDonateContent({ ...donateContent, materialNote: e.target.value })} /></div>
      </Section>

      {/* ═══ Stories Page ═══ */}
      <Section id="stories" title="Stories Page Content" icon="📸" open={isOpen("stories")} onToggle={() => toggle("stories")}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className={labelCls}>Heading</label><input className={inputCls} value={storiesContent.heading} onChange={e => setStoriesContent({ ...storiesContent, heading: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className={labelCls}>Subtitle</label><textarea className={`${inputCls} resize-none`} rows={2} value={storiesContent.subtitle} onChange={e => setStoriesContent({ ...storiesContent, subtitle: e.target.value })} /></div>
        </div>
        <div className="mt-4">
          <label className={labelCls}>Gallery Images</label>
          {storiesContent.galleryImages.map((g, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input className={`${inputCls} flex-1`} placeholder="Image URL" value={g.src} onChange={e => { const ng = [...storiesContent.galleryImages]; ng[i] = { ...ng[i], src: e.target.value }; setStoriesContent({ ...storiesContent, galleryImages: ng }); }} />
              <input className={`${inputCls} w-36`} placeholder="Alt" value={g.alt} onChange={e => { const ng = [...storiesContent.galleryImages]; ng[i] = { ...ng[i], alt: e.target.value }; setStoriesContent({ ...storiesContent, galleryImages: ng }); }} />
              <button onClick={() => setStoriesContent({ ...storiesContent, galleryImages: storiesContent.galleryImages.filter((_, j) => j !== i) })} className="text-red-400 text-xs font-bold px-2">✕</button>
            </div>
          ))}
          <button onClick={() => setStoriesContent({ ...storiesContent, galleryImages: [...storiesContent.galleryImages, { src: "", alt: "" }] })} className="text-xs text-[#2e7d5b] font-bold">+ Add Image</button>
        </div>
        <div className="mt-4">
          <label className={labelCls}>Impact Quotes</label>
          {storiesContent.impactQuotes.map((q, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 mb-2 p-3 border border-zinc-100 rounded-xl">
              <div className="col-span-3"><label className={labelCls}>Quote</label><textarea className={`${inputCls} resize-none`} rows={2} value={q.quote} onChange={e => { const nq = [...storiesContent.impactQuotes]; nq[i] = { ...nq[i], quote: e.target.value }; setStoriesContent({ ...storiesContent, impactQuotes: nq }); }} /></div>
              <div><label className={labelCls}>Name</label><input className={inputCls} value={q.name} onChange={e => { const nq = [...storiesContent.impactQuotes]; nq[i] = { ...nq[i], name: e.target.value }; setStoriesContent({ ...storiesContent, impactQuotes: nq }); }} /></div>
              <div><label className={labelCls}>Location</label><input className={inputCls} value={q.location} onChange={e => { const nq = [...storiesContent.impactQuotes]; nq[i] = { ...nq[i], location: e.target.value }; setStoriesContent({ ...storiesContent, impactQuotes: nq }); }} /></div>
            </div>
          ))}
          <button onClick={() => setStoriesContent({ ...storiesContent, impactQuotes: [...storiesContent.impactQuotes, { quote: "", name: "", location: "" }] })} className="text-xs text-[#2e7d5b] font-bold">+ Add Quote</button>
        </div>
      </Section>

      {/* ═══ Save All ═══ */}
      <div className="sticky bottom-4 z-20 flex items-center gap-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-lg">
        <button onClick={saveAll} disabled={isPending} className={`${btnCls} min-w-[160px] flex items-center justify-center`}>
          {isPending ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : "Save All NGO Content"}
        </button>
        {message && (
          <span className={`text-sm font-medium ${message.includes("saved") ? "text-green-600" : "text-red-500"}`}>{message}</span>
        )}
        <span className="text-xs text-zinc-400 ml-auto">19 content sections</span>
      </div>
    </div>
  );
}
