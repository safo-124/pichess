"use client";

import { useState, useTransition } from "react";
import { saveSiteContent } from "@/lib/actions/admin";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { ContactPageContent, ContactItem, ContactQuickLink, ContactFAQ } from "@/lib/contact-content";

const inputCls =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 outline-none transition-all placeholder:text-zinc-300";
const btnCls =
  "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all";
const btnPrimary =
  `${btnCls} bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/20`;

const ICON_TYPES: ContactItem["iconType"][] = ["location", "email", "phone", "whatsapp", "academy", "foundation"];

export default function AdminContactEditor({ initialData }: { initialData: ContactPageContent }) {
  const [data, setData] = useState<ContactPageContent>(initialData);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("hero");

  function save() {
    startTransition(async () => {
      await saveSiteContent("contact_content", JSON.stringify(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  function toggle(section: string) {
    setOpenSection((s) => (s === section ? null : section));
  }

  /* ── hero helpers ─────────────────────────────────────── */
  function updateHero(field: string, value: string) {
    setData((d) => ({ ...d, hero: { ...d.hero, [field]: value } }));
  }

  /* ── contact items helpers ────────────────────────────── */
  function updateContactItem(idx: number, patch: Partial<ContactItem>) {
    setData((d) => ({
      ...d,
      contactItems: d.contactItems.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    }));
  }
  function addContactItem() {
    setData((d) => ({
      ...d,
      contactItems: [
        ...d.contactItems,
        { label: "New Contact", value: "", desc: "", href: "#", iconType: "email" as const, colorClass: "bg-blue-50 text-blue-600" },
      ],
    }));
  }
  function removeContactItem(idx: number) {
    setData((d) => ({ ...d, contactItems: d.contactItems.filter((_, i) => i !== idx) }));
  }

  /* ── quick links helpers ──────────────────────────────── */
  function updateQuickLink(idx: number, patch: Partial<ContactQuickLink>) {
    setData((d) => ({
      ...d,
      quickLinks: d.quickLinks.map((l, i) => (i === idx ? { ...l, ...patch } : l)),
    }));
  }
  function addQuickLink() {
    setData((d) => ({
      ...d,
      quickLinks: [...d.quickLinks, { label: "New Link", href: "/", icon: "🔗" }],
    }));
  }
  function removeQuickLink(idx: number) {
    setData((d) => ({ ...d, quickLinks: d.quickLinks.filter((_, i) => i !== idx) }));
  }

  /* ── FAQ helpers ──────────────────────────────────────── */
  function updateFaq(idx: number, patch: Partial<ContactFAQ>) {
    setData((d) => ({
      ...d,
      faqs: d.faqs.map((f, i) => (i === idx ? { ...f, ...patch } : f)),
    }));
  }
  function addFaq() {
    setData((d) => ({
      ...d,
      faqs: [...d.faqs, { q: "New question?", a: "Answer here." }],
    }));
  }
  function removeFaq(idx: number) {
    setData((d) => ({ ...d, faqs: d.faqs.filter((_, i) => i !== idx) }));
  }

  /* ── CTA helpers ──────────────────────────────────────── */
  function updateCta(field: string, value: string) {
    setData((d) => ({ ...d, cta: { ...d.cta, [field]: value } }));
  }

  /* ── Map info helpers ─────────────────────────────────── */
  function updateMapInfo(field: string, value: string) {
    setData((d) => ({ ...d, mapInfo: { ...d.mapInfo, [field]: value } }));
  }

  /* ── section header component ─────────────────────────── */
  function SectionHeader({ id, title }: { id: string; title: string }) {
    return (
      <button
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between py-4 px-1 text-left group"
      >
        <h3 className="text-lg font-bold text-zinc-800 group-hover:text-amber-600 transition-colors">{title}</h3>
        {openSection === id ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
      </button>
    );
  }

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800">Contact Page</h2>
          <p className="text-sm text-zinc-500 mt-1">Edit all sections of the contact page</p>
        </div>
        <button onClick={save} disabled={isPending} className={btnPrimary}>
          {isPending ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>

      {/* ═══ HERO ═══ */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="px-6">
          <SectionHeader id="hero" title="Hero Section" />
        </div>
        {openSection === "hero" && (
          <div className="px-6 pb-6 space-y-4 border-t border-zinc-100 pt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Badge Text</label>
                <input className={inputCls} value={data.hero.badge} onChange={(e) => updateHero("badge", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Heading</label>
                <input className={inputCls} value={data.hero.heading} onChange={(e) => updateHero("heading", e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Heading Highlight (gold text)</label>
              <input className={inputCls} value={data.hero.headingHighlight} onChange={(e) => updateHero("headingHighlight", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Subtitle</label>
              <textarea className={inputCls} rows={3} value={data.hero.subtitle} onChange={(e) => updateHero("subtitle", e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {/* ═══ CONTACT ITEMS ═══ */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="px-6">
          <SectionHeader id="contactItems" title="Contact Cards" />
        </div>
        {openSection === "contactItems" && (
          <div className="px-6 pb-6 space-y-4 border-t border-zinc-100 pt-4">
            {data.contactItems.map((item, idx) => (
              <div key={idx} className="border border-zinc-100 rounded-xl p-4 space-y-3 relative">
                <button
                  onClick={() => removeContactItem(idx)}
                  className="absolute top-3 right-3 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Label</label>
                    <input className={inputCls} value={item.label} onChange={(e) => updateContactItem(idx, { label: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Value</label>
                    <input className={inputCls} value={item.value} onChange={(e) => updateContactItem(idx, { value: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Icon Type</label>
                    <select
                      className={inputCls}
                      value={item.iconType}
                      onChange={(e) => updateContactItem(idx, { iconType: e.target.value as ContactItem["iconType"] })}
                    >
                      {ICON_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Description</label>
                    <input className={inputCls} value={item.desc} onChange={(e) => updateContactItem(idx, { desc: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Link (href)</label>
                    <input className={inputCls} value={item.href} onChange={(e) => updateContactItem(idx, { href: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Color Class</label>
                  <input className={inputCls} value={item.colorClass} onChange={(e) => updateContactItem(idx, { colorClass: e.target.value })} placeholder="e.g. bg-blue-50 text-blue-600" />
                </div>
              </div>
            ))}
            <button
              onClick={addContactItem}
              className="flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Contact Card
            </button>
          </div>
        )}
      </div>

      {/* ═══ QUICK LINKS ═══ */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="px-6">
          <SectionHeader id="quickLinks" title="Quick Links" />
        </div>
        {openSection === "quickLinks" && (
          <div className="px-6 pb-6 space-y-4 border-t border-zinc-100 pt-4">
            {data.quickLinks.map((link, idx) => (
              <div key={idx} className="flex items-end gap-3">
                <div className="flex-1 grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Label</label>
                    <input className={inputCls} value={link.label} onChange={(e) => updateQuickLink(idx, { label: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Link (href)</label>
                    <input className={inputCls} value={link.href} onChange={(e) => updateQuickLink(idx, { href: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Icon (emoji)</label>
                    <input className={inputCls} value={link.icon} onChange={(e) => updateQuickLink(idx, { icon: e.target.value })} />
                  </div>
                </div>
                <button
                  onClick={() => removeQuickLink(idx)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mb-0.5"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addQuickLink}
              className="flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Quick Link
            </button>
          </div>
        )}
      </div>

      {/* ═══ FAQs ═══ */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="px-6">
          <SectionHeader id="faqs" title="FAQs (Contact Page)" />
        </div>
        {openSection === "faqs" && (
          <div className="px-6 pb-6 space-y-4 border-t border-zinc-100 pt-4">
            {data.faqs.map((faq, idx) => (
              <div key={idx} className="border border-zinc-100 rounded-xl p-4 space-y-3 relative">
                <button
                  onClick={() => removeFaq(idx)}
                  className="absolute top-3 right-3 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Question</label>
                  <input className={inputCls} value={faq.q} onChange={(e) => updateFaq(idx, { q: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Answer</label>
                  <textarea className={inputCls} rows={3} value={faq.a} onChange={(e) => updateFaq(idx, { a: e.target.value })} />
                </div>
              </div>
            ))}
            <button
              onClick={addFaq}
              className="flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>
        )}
      </div>

      {/* ═══ CTA ═══ */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="px-6">
          <SectionHeader id="cta" title="CTA Footer Strip" />
        </div>
        {openSection === "cta" && (
          <div className="px-6 pb-6 space-y-4 border-t border-zinc-100 pt-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Heading</label>
              <input className={inputCls} value={data.cta.heading} onChange={(e) => updateCta("heading", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Description</label>
              <textarea className={inputCls} rows={3} value={data.cta.description} onChange={(e) => updateCta("description", e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Button 1 Text</label>
                <input className={inputCls} value={data.cta.cta1Text} onChange={(e) => updateCta("cta1Text", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Button 1 Link</label>
                <input className={inputCls} value={data.cta.cta1Link} onChange={(e) => updateCta("cta1Link", e.target.value)} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Button 2 Text</label>
                <input className={inputCls} value={data.cta.cta2Text} onChange={(e) => updateCta("cta2Text", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Button 2 Link</label>
                <input className={inputCls} value={data.cta.cta2Link} onChange={(e) => updateCta("cta2Link", e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ MAP INFO ═══ */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="px-6">
          <SectionHeader id="mapInfo" title="Map / Location Info" />
        </div>
        {openSection === "mapInfo" && (
          <div className="px-6 pb-6 space-y-4 border-t border-zinc-100 pt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Location</label>
                <input className={inputCls} value={data.mapInfo.location} onChange={(e) => updateMapInfo("location", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Subtitle</label>
                <input className={inputCls} value={data.mapInfo.subtitle} onChange={(e) => updateMapInfo("subtitle", e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* bottom save */}
      <div className="flex justify-end pt-2">
        <button onClick={save} disabled={isPending} className={btnPrimary}>
          {isPending ? "Saving…" : saved ? "✓ Saved!" : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
