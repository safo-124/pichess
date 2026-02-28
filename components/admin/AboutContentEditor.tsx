/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { saveSiteContent } from "@/lib/actions/admin";
import {
  type AboutHero, type AboutStory, type AboutPillar, type AboutStat,
  type AboutMission, type AboutValue, type AboutTimeline, type AboutTeamMember,
  defaultHero, defaultStory, defaultPillars, defaultStats,
  defaultMission, defaultValues, defaultTimeline, defaultTeam,
} from "@/lib/about-content";
import { ChevronDown, ChevronUp, Plus, Trash2, Save, Image as ImageIcon, Upload, Loader2, CheckCircle } from "lucide-react";

/* ─── Styling ─────────────────────────────────────────── */
const inputCls = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/40 outline-none transition-all placeholder:text-zinc-300";
const labelCls = "text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block";
const cardCls = "rounded-2xl bg-white border border-zinc-200/80 p-5";
const btnSave = "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#dbb95d] text-black text-sm font-semibold hover:shadow-lg hover:shadow-[#c9a84c]/20 transition-all disabled:opacity-50";
const btnDanger = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-all";
const btnAdd = "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-zinc-300 text-zinc-400 text-xs font-semibold hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all";

/* ─── Image Upload ────────────────────────────────────── */
function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
      else alert(data.error || "Upload failed");
    } catch { alert("Upload failed"); }
    finally { setUploading(false); }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) upload(file);
  }, [upload]);

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-2 mb-2">
        <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} placeholder="https://... or upload below" />
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${dragOver ? "border-[#c9a84c] bg-[#c9a84c]/5" : "border-zinc-200 hover:border-zinc-300"}`}
      >
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
        {uploading ? (
          <Loader2 className="w-5 h-5 mx-auto text-[#c9a84c] animate-spin" />
        ) : value ? (
          <div className="flex items-center gap-3">
            <div className="w-16 h-10 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-zinc-400 truncate flex-1">{value}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-2">
            <Upload className="w-5 h-5 text-zinc-300" />
            <span className="text-xs text-zinc-400">Click or drag to upload</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Collapsible Section ────────────────────────────── */
function Section({ title, icon, children, defaultOpen = false }: { title: string; icon: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cardCls}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
          <span className="text-lg">{icon}</span> {title}
        </h3>
        {open ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
      </button>
      {open && <div className="mt-5 space-y-4">{children}</div>}
    </div>
  );
}

/* ─── Main Editor Component ───────────────────────────── */

interface Props {
  initialHero?: AboutHero;
  initialStory?: AboutStory;
  initialPillars?: AboutPillar[];
  initialStats?: AboutStat[];
  initialMission?: AboutMission;
  initialValues?: AboutValue[];
  initialTimeline?: AboutTimeline[];
  initialTeam?: AboutTeamMember[];
}

export default function AboutContentEditor({
  initialHero, initialStory, initialPillars, initialStats,
  initialMission, initialValues, initialTimeline, initialTeam,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState<string | null>(null);

  const [hero, setHero] = useState<AboutHero>(initialHero ?? defaultHero);
  const [story, setStory] = useState<AboutStory>(initialStory ?? defaultStory);
  const [pillars, setPillars] = useState<AboutPillar[]>(initialPillars ?? defaultPillars);
  const [stats, setStats] = useState<AboutStat[]>(initialStats ?? defaultStats);
  const [mission, setMission] = useState<AboutMission>(initialMission ?? defaultMission);
  const [values, setValues] = useState<AboutValue[]>(initialValues ?? defaultValues);
  const [timeline, setTimeline] = useState<AboutTimeline[]>(initialTimeline ?? defaultTimeline);
  const [team, setTeam] = useState<AboutTeamMember[]>(initialTeam ?? defaultTeam);

  const save = (key: string, val: any) => {
    startTransition(async () => {
      await saveSiteContent(key, JSON.stringify(val));
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    });
  };

  const SaveBtn = ({ sKey, val }: { sKey: string; val: any }) => (
    <button onClick={() => save(sKey, val)} disabled={isPending} className={btnSave}>
      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved === sKey ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
      {saved === sKey ? "Saved!" : "Save"}
    </button>
  );

  return (
    <div className="space-y-5">
      {/* ─── Hero ─────────────────────────────────────── */}
      <Section title="Hero Section" icon="🏔️" defaultOpen>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Title</label>
            <input value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Highlight Text</label>
            <input value={hero.highlight} onChange={(e) => setHero({ ...hero, highlight: e.target.value })} className={inputCls} />
          </div>
          <div className="col-span-full">
            <label className={labelCls}>Subtitle</label>
            <textarea value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} className={`${inputCls} resize-none`} rows={3} />
          </div>
          <div className="col-span-full">
            <ImageField label="Background Image" value={hero.backgroundImage} onChange={(url) => setHero({ ...hero, backgroundImage: url })} />
          </div>
        </div>
        <SaveBtn sKey="about_hero" val={hero} />
      </Section>

      {/* ─── Story ────────────────────────────────────── */}
      <Section title="Our Story" icon="📖">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Section Label</label>
            <input value={story.label} onChange={(e) => setStory({ ...story, label: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Title</label>
            <input value={story.title} onChange={(e) => setStory({ ...story, title: e.target.value })} className={inputCls} />
          </div>
        </div>
        <div className="space-y-3">
          <label className={labelCls}>Paragraphs</label>
          {story.paragraphs.map((p, i) => (
            <div key={i} className="flex gap-2 items-start">
              <textarea
                value={p}
                onChange={(e) => {
                  const updated = [...story.paragraphs];
                  updated[i] = e.target.value;
                  setStory({ ...story, paragraphs: updated });
                }}
                className={`${inputCls} resize-none flex-1`}
                rows={2}
              />
              <button onClick={() => setStory({ ...story, paragraphs: story.paragraphs.filter((_, j) => j !== i) })} className={btnDanger}>
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button onClick={() => setStory({ ...story, paragraphs: [...story.paragraphs, ""] })} className={btnAdd}>
            <Plus className="w-3.5 h-3.5" /> Add Paragraph
          </button>
        </div>
        <SaveBtn sKey="about_story" val={story} />
      </Section>

      {/* ─── Pillars ──────────────────────────────────── */}
      <Section title="Three Pillars" icon="🏛️">
        <div className="space-y-4">
          {pillars.map((p, i) => (
            <div key={i} className="rounded-xl bg-zinc-50 p-4 space-y-3">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className={labelCls}>Icon</label>
                  <input value={p.icon} onChange={(e) => { const u = [...pillars]; u[i] = { ...p, icon: e.target.value }; setPillars(u); }} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Title</label>
                  <input value={p.title} onChange={(e) => { const u = [...pillars]; u[i] = { ...p, title: e.target.value }; setPillars(u); }} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Color</label>
                  <input value={p.color} onChange={(e) => { const u = [...pillars]; u[i] = { ...p, color: e.target.value }; setPillars(u); }} className={inputCls} />
                </div>
                <div className="flex items-end">
                  <button onClick={() => setPillars(pillars.filter((_, j) => j !== i))} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <input value={p.description} onChange={(e) => { const u = [...pillars]; u[i] = { ...p, description: e.target.value }; setPillars(u); }} className={inputCls} />
              </div>
            </div>
          ))}
          <button onClick={() => setPillars([...pillars, { icon: "⭐", title: "", description: "", color: "#c9a84c" }])} className={btnAdd}>
            <Plus className="w-3.5 h-3.5" /> Add Pillar
          </button>
        </div>
        <SaveBtn sKey="about_pillars" val={pillars} />
      </Section>

      {/* ─── Stats ────────────────────────────────────── */}
      <Section title="Statistics" icon="📊">
        <div className="space-y-3">
          {stats.map((s, i) => (
            <div key={i} className="grid grid-cols-5 gap-3 items-end">
              <div>
                <label className={labelCls}>Value</label>
                <input type="number" value={s.value} onChange={(e) => { const u = [...stats]; u[i] = { ...s, value: Number(e.target.value) }; setStats(u); }} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Suffix</label>
                <input value={s.suffix} onChange={(e) => { const u = [...stats]; u[i] = { ...s, suffix: e.target.value }; setStats(u); }} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Label</label>
                <input value={s.label} onChange={(e) => { const u = [...stats]; u[i] = { ...s, label: e.target.value }; setStats(u); }} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Color</label>
                <select value={s.color} onChange={(e) => { const u = [...stats]; u[i] = { ...s, color: e.target.value as any }; setStats(u); }} className={inputCls}>
                  <option value="gold">Gold</option>
                  <option value="white">White</option>
                  <option value="green">Green</option>
                </select>
              </div>
              <button onClick={() => setStats(stats.filter((_, j) => j !== i))} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
          <button onClick={() => setStats([...stats, { value: 0, suffix: "+", label: "", color: "gold" }])} className={btnAdd}>
            <Plus className="w-3.5 h-3.5" /> Add Stat
          </button>
        </div>
        <SaveBtn sKey="about_stats" val={stats} />
      </Section>

      {/* ─── Mission ──────────────────────────────────── */}
      <Section title="Mission Statement" icon="🎯">
        <div>
          <label className={labelCls}>Section Title</label>
          <input value={mission.title} onChange={(e) => setMission({ ...mission, title: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Quote</label>
          <textarea value={mission.quote} onChange={(e) => setMission({ ...mission, quote: e.target.value })} className={`${inputCls} resize-none`} rows={4} />
        </div>
        <SaveBtn sKey="about_mission" val={mission} />
      </Section>

      {/* ─── Values ───────────────────────────────────── */}
      <Section title="Core Values" icon="💎">
        <div className="space-y-4">
          {values.map((v, i) => (
            <div key={i} className="grid grid-cols-3 gap-3 items-end rounded-xl bg-zinc-50 p-4">
              <div>
                <label className={labelCls}>Icon</label>
                <input value={v.icon} onChange={(e) => { const u = [...values]; u[i] = { ...v, icon: e.target.value }; setValues(u); }} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Title</label>
                <input value={v.title} onChange={(e) => { const u = [...values]; u[i] = { ...v, title: e.target.value }; setValues(u); }} className={inputCls} />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className={labelCls}>Description</label>
                  <input value={v.description} onChange={(e) => { const u = [...values]; u[i] = { ...v, description: e.target.value }; setValues(u); }} className={inputCls} />
                </div>
                <button onClick={() => setValues(values.filter((_, j) => j !== i))} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          <button onClick={() => setValues([...values, { icon: "⭐", title: "", description: "" }])} className={btnAdd}>
            <Plus className="w-3.5 h-3.5" /> Add Value
          </button>
        </div>
        <SaveBtn sKey="about_values" val={values} />
      </Section>

      {/* ─── Timeline ─────────────────────────────────── */}
      <Section title="Timeline / Journey" icon="📅">
        <div className="space-y-4">
          {timeline.map((t, i) => (
            <div key={i} className="grid grid-cols-4 gap-3 items-end rounded-xl bg-zinc-50 p-4">
              <div>
                <label className={labelCls}>Year</label>
                <input value={t.year} onChange={(e) => { const u = [...timeline]; u[i] = { ...t, year: e.target.value }; setTimeline(u); }} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Title</label>
                <input value={t.title} onChange={(e) => { const u = [...timeline]; u[i] = { ...t, title: e.target.value }; setTimeline(u); }} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <input value={t.description} onChange={(e) => { const u = [...timeline]; u[i] = { ...t, description: e.target.value }; setTimeline(u); }} className={inputCls} />
              </div>
              <button onClick={() => setTimeline(timeline.filter((_, j) => j !== i))} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
          <button onClick={() => setTimeline([...timeline, { year: new Date().getFullYear().toString(), title: "", description: "" }])} className={btnAdd}>
            <Plus className="w-3.5 h-3.5" /> Add Timeline Entry
          </button>
        </div>
        <SaveBtn sKey="about_timeline" val={timeline} />
      </Section>

      {/* ─── Team Members ──────────────────────────────── */}
      <Section title="Team / Leadership" icon="👥">
        <p className="text-xs text-zinc-400 -mt-2 mb-3">Add your CEO, directors, coaches, and key people. Photos are recommended.</p>
        <div className="space-y-5">
          {team.map((m, i) => (
            <div key={i} className="rounded-xl bg-zinc-50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase">Member {i + 1}</span>
                <button onClick={() => setTeam(team.filter((_, j) => j !== i))} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /> Remove</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input value={m.name} onChange={(e) => { const u = [...team]; u[i] = { ...m, name: e.target.value }; setTeam(u); }} className={inputCls} placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className={labelCls}>Role / Title</label>
                  <input value={m.role} onChange={(e) => { const u = [...team]; u[i] = { ...m, role: e.target.value }; setTeam(u); }} className={inputCls} placeholder="e.g. Founder & CEO" />
                </div>
                <div className="col-span-full">
                  <label className={labelCls}>Short Bio</label>
                  <textarea value={m.bio} onChange={(e) => { const u = [...team]; u[i] = { ...m, bio: e.target.value }; setTeam(u); }} className={`${inputCls} resize-none`} rows={2} placeholder="A brief description of this person..." />
                </div>
                <div className="col-span-full">
                  <ImageField label="Photo" value={m.image} onChange={(url) => { const u = [...team]; u[i] = { ...m, image: url }; setTeam(u); }} />
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => setTeam([...team, { name: "", role: "", bio: "", image: "" }])} className={btnAdd}>
            <Plus className="w-3.5 h-3.5" /> Add Team Member
          </button>
        </div>
        <SaveBtn sKey="about_team" val={team} />
      </Section>
    </div>
  );
}
