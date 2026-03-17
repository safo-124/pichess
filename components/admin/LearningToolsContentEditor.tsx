/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { saveSiteContent } from "@/lib/actions/admin";
import {
  type LearningToolsHero, type LearningTool, type LearningTip, type LearningToolsCTA,
  defaultHero, defaultTools, defaultTips, defaultCTA,
} from "@/lib/learning-tools-content";
import { ChevronDown, ChevronUp, Plus, Trash2, Save, Loader2, CheckCircle } from "lucide-react";

/* ─── Styling ─────────────────────────────────────────── */
const inputCls = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/40 outline-none transition-all placeholder:text-zinc-300";
const labelCls = "text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block";
const cardCls = "rounded-2xl bg-white border border-zinc-200/80 p-5";
const btnSave = "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#dbb95d] text-black text-sm font-semibold hover:shadow-lg hover:shadow-[#c9a84c]/20 transition-all disabled:opacity-50";
const btnDanger = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-all";
const btnAdd = "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-zinc-300 text-zinc-400 text-xs font-semibold hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all";

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

/* ─── Icon options ────────────────────────────────────── */
const ICON_OPTIONS = ["Target", "BookOpen", "Swords", "Brain", "GraduationCap", "Zap", "Lightbulb", "Star", "Puzzle", "Play", "Flame"];
const CATEGORY_OPTIONS = ["practice", "study", "play"];
const GRADIENT_OPTIONS = [
  "from-orange-500 to-amber-500",
  "from-blue-500 to-cyan-500",
  "from-red-500 to-rose-500",
  "from-violet-500 to-purple-500",
  "from-emerald-500 to-green-500",
  "from-yellow-500 to-orange-400",
  "from-pink-500 to-rose-400",
  "from-teal-500 to-cyan-400",
];

/* ─── Main Editor Component ───────────────────────────── */
interface Props {
  initialHero?: LearningToolsHero;
  initialTools?: LearningTool[];
  initialTips?: LearningTip[];
  initialCTA?: LearningToolsCTA;
}

export default function LearningToolsContentEditor({
  initialHero, initialTools, initialTips, initialCTA,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState<string | null>(null);

  const [hero, setHero] = useState<LearningToolsHero>(initialHero ?? defaultHero);
  const [tools, setTools] = useState<LearningTool[]>(initialTools ?? defaultTools);
  const [tips, setTips] = useState<LearningTip[]>(initialTips ?? defaultTips);
  const [cta, setCTA] = useState<LearningToolsCTA>(initialCTA ?? defaultCTA);

  const save = (key: string, val: any) => {
    startTransition(async () => {
      await saveSiteContent(key, JSON.stringify(val));
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    });
  };

  const saveBtn = (sKey: string, val: any) => (
    <button onClick={() => save(sKey, val)} disabled={isPending} className={btnSave}>
      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved === sKey ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
      {saved === sKey ? "Saved!" : "Save"}
    </button>
  );

  /* ─── Tool helpers ──────────────────────────────────── */
  const updateTool = (idx: number, field: keyof LearningTool, value: string) => {
    const next = [...tools];
    next[idx] = { ...next[idx], [field]: value };
    setTools(next);
  };
  const removeTool = (idx: number) => setTools(tools.filter((_, i) => i !== idx));
  const addTool = () => setTools([...tools, {
    id: `tool-${Date.now()}`,
    title: "New Tool",
    desc: "Description of the tool.",
    icon: "Puzzle",
    category: "practice",
    href: "https://",
    color: "from-violet-500 to-purple-500",
    stats: "",
  }]);

  /* ─── Tip helpers ───────────────────────────────────── */
  const updateTip = (idx: number, field: keyof LearningTip, value: string) => {
    const next = [...tips];
    next[idx] = { ...next[idx], [field]: value };
    setTips(next);
  };
  const removeTip = (idx: number) => setTips(tips.filter((_, i) => i !== idx));
  const addTip = () => setTips([...tips, { icon: "♟", tip: "New chess tip..." }]);

  return (
    <div className="space-y-5">
      {/* ─── Hero ─────────────────────────────────────── */}
      <Section title="Hero Section" icon="🏔️" defaultOpen>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Title</label>
            <input value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} className={inputCls} placeholder="Level Up Your" />
          </div>
          <div>
            <label className={labelCls}>Highlight Text</label>
            <input value={hero.highlight} onChange={(e) => setHero({ ...hero, highlight: e.target.value })} className={inputCls} placeholder="Chess Game" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Subtitle</label>
          <textarea value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} rows={2} className={inputCls} />
        </div>
        {saveBtn("learning_hero", hero)}
      </Section>

      {/* ─── Tools ────────────────────────────────────── */}
      <Section title="Learning Tools" icon="🛠️">
        <p className="text-xs text-zinc-400 mb-3">Add, edit, or remove tools that appear on the Learning Tools page.</p>
        <div className="space-y-4">
          {tools.map((tool, idx) => (
            <div key={tool.id} className="rounded-xl border border-zinc-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-700">Tool #{idx + 1}</span>
                <button onClick={() => removeTool(idx)} className={btnDanger}><Trash2 size={12} /> Remove</button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Title</label>
                  <input value={tool.title} onChange={(e) => updateTool(idx, "title", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Link URL</label>
                  <input value={tool.href} onChange={(e) => updateTool(idx, "href", e.target.value)} className={inputCls} placeholder="https://..." />
                </div>
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea value={tool.desc} onChange={(e) => updateTool(idx, "desc", e.target.value)} rows={2} className={inputCls} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className={labelCls}>Icon</label>
                  <select value={tool.icon} onChange={(e) => updateTool(idx, "icon", e.target.value)} className={inputCls}>
                    {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select value={tool.category} onChange={(e) => updateTool(idx, "category", e.target.value)} className={inputCls}>
                    {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Color Gradient</label>
                  <select value={tool.color} onChange={(e) => updateTool(idx, "color", e.target.value)} className={inputCls}>
                    {GRADIENT_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Stats Label</label>
                  <input value={tool.stats} onChange={(e) => updateTool(idx, "stats", e.target.value)} className={inputCls} placeholder="e.g. 10,000+ puzzles" />
                </div>
              </div>

              <div>
                <label className={labelCls}>Badge (optional)</label>
                <input value={tool.badge ?? ""} onChange={(e) => updateTool(idx, "badge", e.target.value)} className={inputCls} placeholder="e.g. Most Popular" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-3">
          <button onClick={addTool} className={btnAdd}><Plus size={14} /> Add Tool</button>
          {saveBtn("learning_tools", tools)}
        </div>
      </Section>

      {/* ─── Chess Tips ───────────────────────────────── */}
      <Section title="Chess Tips" icon="💡">
        <p className="text-xs text-zinc-400 mb-3">Tips shown in the carousel section.</p>
        <div className="space-y-3">
          {tips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-xl border border-zinc-200 p-3">
              <div className="shrink-0 w-16">
                <label className={labelCls}>Icon</label>
                <input value={tip.icon} onChange={(e) => updateTip(idx, "icon", e.target.value)} className={inputCls} placeholder="♔" />
              </div>
              <div className="flex-1">
                <label className={labelCls}>Tip</label>
                <input value={tip.tip} onChange={(e) => updateTip(idx, "tip", e.target.value)} className={inputCls} />
              </div>
              <button onClick={() => removeTip(idx)} className={`${btnDanger} mt-5`}><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-3">
          <button onClick={addTip} className={btnAdd}><Plus size={14} /> Add Tip</button>
          {saveBtn("learning_tips", tips)}
        </div>
      </Section>

      {/* ─── CTA Section ──────────────────────────────── */}
      <Section title="Call to Action" icon="🎯">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Heading</label>
            <input value={cta.heading} onChange={(e) => setCTA({ ...cta, heading: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Subtitle</label>
            <input value={cta.subtitle} onChange={(e) => setCTA({ ...cta, subtitle: e.target.value })} className={inputCls} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Primary Button Label</label>
            <input value={cta.primaryLabel} onChange={(e) => setCTA({ ...cta, primaryLabel: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Primary Button Link</label>
            <input value={cta.primaryHref} onChange={(e) => setCTA({ ...cta, primaryHref: e.target.value })} className={inputCls} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Secondary Button Label</label>
            <input value={cta.secondaryLabel} onChange={(e) => setCTA({ ...cta, secondaryLabel: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Secondary Button Link</label>
            <input value={cta.secondaryHref} onChange={(e) => setCTA({ ...cta, secondaryHref: e.target.value })} className={inputCls} />
          </div>
        </div>
        {saveBtn("learning_cta", cta)}
      </Section>
    </div>
  );
}
