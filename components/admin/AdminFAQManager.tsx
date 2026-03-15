/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { saveSiteContent } from "@/lib/actions/admin";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Pencil, Check, X } from "lucide-react";
import type { FAQPageContent, FAQCategory, FAQItem } from "@/lib/faq-content";

/* ── helpers ───────────────────────────────────────────────────────────── */
const uid = () => Math.random().toString(36).slice(2, 10);

const inputCls =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 outline-none transition-all placeholder:text-zinc-300";
const btnCls =
  "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all";
const btnPrimary =
  `${btnCls} bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/20`;
const btnDanger =
  `${btnCls} bg-red-50 text-red-500 hover:bg-red-100`;

const ICON_OPTIONS = ["🏠", "🎓", "💚", "🏆", "🛒", "❓", "📦", "💡", "🎯", "📚", "🌍", "⚡", "🎪", "🔧"];
const COLOR_OPTIONS = ["#c9a84c", "#2e7d5b", "#f59e0b", "#a855f7", "#ec4899", "#06b6d4", "#6366f1", "#f97316", "#10b981", "#64748b"];

/* ══════════════════════════════════════════════════════════════════════ */
export default function AdminFAQManager({ initialData }: { initialData: FAQPageContent }) {
  const [data, setData] = useState<FAQPageContent>(initialData);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(initialData.categories[0]?.id ?? null);
  const [editingCat, setEditingCat] = useState<string | null>(null);

  /* ── save ─────────────────────────────────────────────────────────── */
  function save() {
    startTransition(async () => {
      await saveSiteContent("faq_content", JSON.stringify(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  /* ── page-level fields ───────────────────────────────────────────── */
  function updateField(field: keyof FAQPageContent, value: string) {
    setData((d) => ({ ...d, [field]: value }));
  }

  /* ── category CRUD ───────────────────────────────────────────────── */
  function addCategory() {
    const id = uid();
    setData((d) => ({
      ...d,
      categories: [
        ...d.categories,
        { id, name: "New Category", icon: "❓", color: "#64748b", items: [] },
      ],
    }));
    setExpandedCat(id);
    setEditingCat(id);
  }

  function updateCategory(catId: string, patch: Partial<FAQCategory>) {
    setData((d) => ({
      ...d,
      categories: d.categories.map((c) => (c.id === catId ? { ...c, ...patch } : c)),
    }));
  }

  function removeCategory(catId: string) {
    setData((d) => ({
      ...d,
      categories: d.categories.filter((c) => c.id !== catId),
    }));
  }

  function moveCat(catId: string, dir: -1 | 1) {
    setData((d) => {
      const cats = [...d.categories];
      const i = cats.findIndex((c) => c.id === catId);
      const j = i + dir;
      if (j < 0 || j >= cats.length) return d;
      [cats[i], cats[j]] = [cats[j], cats[i]];
      return { ...d, categories: cats };
    });
  }

  /* ── FAQ item CRUD ───────────────────────────────────────────────── */
  function addItem(catId: string) {
    const id = uid();
    updateCategory(catId, {
      items: [
        ...(data.categories.find((c) => c.id === catId)?.items ?? []),
        { id, question: "", answer: "" },
      ],
    });
  }

  function updateItem(catId: string, itemId: string, patch: Partial<FAQItem>) {
    setData((d) => ({
      ...d,
      categories: d.categories.map((c) =>
        c.id === catId
          ? { ...c, items: c.items.map((q) => (q.id === itemId ? { ...q, ...patch } : q)) }
          : c
      ),
    }));
  }

  function removeItem(catId: string, itemId: string) {
    setData((d) => ({
      ...d,
      categories: d.categories.map((c) =>
        c.id === catId ? { ...c, items: c.items.filter((q) => q.id !== itemId) } : c
      ),
    }));
  }

  function moveItem(catId: string, itemId: string, dir: -1 | 1) {
    setData((d) => ({
      ...d,
      categories: d.categories.map((c) => {
        if (c.id !== catId) return c;
        const items = [...c.items];
        const i = items.findIndex((q) => q.id === itemId);
        const j = i + dir;
        if (j < 0 || j >= items.length) return c;
        [items[i], items[j]] = [items[j], items[i]];
        return { ...c, items };
      }),
    }));
  }

  const totalQuestions = data.categories.reduce((n, c) => n + c.items.length, 0);

  /* ══════════════════════════════════════════════════════════════════ */
  return (
    <div className="space-y-6 max-w-5xl">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">FAQ Manager</h1>
          <p className="text-zinc-400 mt-1 text-sm">
            {data.categories.length} categories · {totalQuestions} questions
          </p>
        </div>
        <button onClick={save} disabled={isPending} className={btnPrimary}>
          {isPending ? "Saving…" : saved ? "✓ Saved!" : "Save All Changes"}
        </button>
      </div>

      {/* ── Page-level Settings ─────────────────────────────────── */}
      <div className="rounded-2xl bg-white border border-zinc-200/80 p-6 space-y-4">
        <h2 className="text-base font-bold text-zinc-800">Page Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1 block">Heading</label>
            <input className={inputCls} value={data.heading} onChange={(e) => updateField("heading", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1 block">Heading Highlight</label>
            <input className={inputCls} value={data.headingHighlight} onChange={(e) => updateField("headingHighlight", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-500 mb-1 block">Subtitle</label>
          <textarea className={inputCls} rows={2} value={data.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} />
        </div>
      </div>

      {/* ── Categories ──────────────────────────────────────────── */}
      <div className="space-y-4">
        {data.categories.map((cat, catIdx) => {
          const isExpanded = expandedCat === cat.id;
          const isEditing = editingCat === cat.id;

          return (
            <div key={cat.id} className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
              {/* Category header */}
              <div
                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-zinc-50/50 transition-colors"
                onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
              >
                {/* Reorder */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveCat(cat.id, -1); }}
                    disabled={catIdx === 0}
                    className="text-zinc-300 hover:text-zinc-500 disabled:opacity-30"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveCat(cat.id, 1); }}
                    disabled={catIdx === data.categories.length - 1}
                    className="text-zinc-300 hover:text-zinc-500 disabled:opacity-30"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>

                {/* Icon & name */}
                <span className="text-xl">{cat.icon}</span>
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-semibold w-48"
                      value={cat.name}
                      onChange={(e) => updateCategory(cat.id, { name: e.target.value })}
                      autoFocus
                    />
                    {/* Icon picker */}
                    <div className="flex gap-1">
                      {ICON_OPTIONS.map((ic) => (
                        <button
                          key={ic}
                          onClick={() => updateCategory(cat.id, { icon: ic })}
                          className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                            cat.icon === ic ? "bg-zinc-200 ring-2 ring-amber-400" : "hover:bg-zinc-100"
                          }`}
                        >
                          {ic}
                        </button>
                      ))}
                    </div>
                    {/* Color picker */}
                    <div className="flex gap-1 ml-2">
                      {COLOR_OPTIONS.map((col) => (
                        <button
                          key={col}
                          onClick={() => updateCategory(cat.id, { color: col })}
                          className={`w-5 h-5 rounded-full transition-all ${
                            cat.color === col ? "ring-2 ring-offset-2 ring-amber-400" : ""
                          }`}
                          style={{ backgroundColor: col }}
                        />
                      ))}
                    </div>
                    <button onClick={() => setEditingCat(null)} className="ml-2 text-green-600 hover:text-green-700">
                      <Check size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center gap-2">
                    <span className="font-bold text-zinc-800">{cat.name}</span>
                    <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                      {cat.items.length} Q&A
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingCat(cat.id); }}
                      className="text-zinc-300 hover:text-zinc-500 ml-1"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeCategory(cat.id); }}
                    className="text-zinc-300 hover:text-red-500 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 size={15} />
                  </button>
                  <ChevronDown
                    size={16}
                    className={`text-zinc-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </div>
              </div>

              {/* Expanded: FAQ items */}
              {isExpanded && (
                <div className="border-t border-zinc-100 px-5 py-4 space-y-4 bg-zinc-50/30">
                  {cat.items.length === 0 && (
                    <p className="text-sm text-zinc-400 text-center py-4">
                      No questions yet. Click below to add one.
                    </p>
                  )}

                  {cat.items.map((item, idx) => (
                    <div key={item.id} className="rounded-xl bg-white border border-zinc-200/80 p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        {/* Reorder */}
                        <div className="flex flex-col gap-0.5 mt-2">
                          <button
                            onClick={() => moveItem(cat.id, item.id, -1)}
                            disabled={idx === 0}
                            className="text-zinc-300 hover:text-zinc-500 disabled:opacity-30"
                          >
                            <ChevronUp size={12} />
                          </button>
                          <GripVertical size={12} className="text-zinc-200" />
                          <button
                            onClick={() => moveItem(cat.id, item.id, 1)}
                            disabled={idx === cat.items.length - 1}
                            className="text-zinc-300 hover:text-zinc-500 disabled:opacity-30"
                          >
                            <ChevronDown size={12} />
                          </button>
                        </div>

                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="text-xs font-semibold text-zinc-500 mb-1 block">
                              Question #{idx + 1}
                            </label>
                            <input
                              className={inputCls}
                              value={item.question}
                              onChange={(e) => updateItem(cat.id, item.id, { question: e.target.value })}
                              placeholder="Enter the question…"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-zinc-500 mb-1 block">Answer</label>
                            <textarea
                              className={inputCls}
                              rows={3}
                              value={item.answer}
                              onChange={(e) => updateItem(cat.id, item.id, { answer: e.target.value })}
                              placeholder="Enter the answer…"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(cat.id, item.id)}
                          className="text-zinc-300 hover:text-red-500 transition-colors mt-2"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => addItem(cat.id)}
                    className="flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    <Plus size={16} /> Add Question
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add category button */}
        <button
          onClick={addCategory}
          className="w-full rounded-2xl border-2 border-dashed border-zinc-200 text-zinc-400 hover:border-amber-400 hover:text-amber-600 transition-all py-6 flex items-center justify-center gap-2 text-sm font-semibold"
        >
          <Plus size={18} /> Add New Category
        </button>
      </div>
    </div>
  );
}
