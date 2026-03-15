"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import type { FAQPageContent } from "@/lib/faq-content";

export default function FAQClient({ content }: { content: FAQPageContent }) {
  const [activeCategory, setActiveCategory] = useState(content.categories[0]?.id ?? "");
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const activeCat = content.categories.find((c) => c.id === activeCategory);

  /* ── Search filter ─────────────────────────────────────────────── */
  const q = search.trim().toLowerCase();
  const filteredItems = q
    ? content.categories.flatMap((c) =>
        c.items
          .filter((item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q))
          .map((item) => ({ ...item, categoryName: c.name, categoryIcon: c.icon, categoryColor: c.color }))
      )
    : null;

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 pt-32 pb-20 lg:pt-40 lg:pb-28">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }} />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-amber-300 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
              <span>❓</span> Help Center
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-5">
              {content.heading}{" "}
              <span className="bg-gradient-to-r from-[#c9a84c] via-[#e8c95a] to-[#c9a84c] bg-clip-text text-transparent">
                {content.headingHighlight}
              </span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              {content.subtitle}
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 max-w-xl mx-auto"
          >
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a question…"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/30 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
        {/* Search results mode */}
        {filteredItems ? (
          <div className="space-y-4">
            <p className="text-sm text-zinc-400 mb-6">
              {filteredItems.length} result{filteredItems.length !== 1 && "s"} for &ldquo;{search}&rdquo;
            </p>
            {filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-zinc-500 text-lg font-medium">No questions match your search.</p>
                <p className="text-zinc-400 text-sm mt-2">Try different keywords or browse categories below.</p>
                <button
                  onClick={() => setSearch("")}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-amber-50 text-amber-700 font-semibold text-sm hover:bg-amber-100 transition-colors"
                >
                  Clear search
                </button>
              </div>
            ) : (
              filteredItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => toggle(item.id)}
                  color={item.categoryColor}
                  badge={`${item.categoryIcon} ${item.categoryName}`}
                />
              ))
            )}
          </div>
        ) : (
          <>
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-10">
              {content.categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setOpenId(null); }}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "text-white shadow-lg"
                        : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200/80"
                    }`}
                    style={isActive ? { backgroundColor: cat.color, boxShadow: `0 4px 14px ${cat.color}30` } : undefined}
                  >
                    <span>{cat.icon}</span>
                    {cat.name}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-zinc-200 text-zinc-400"}`}>
                      {cat.items.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Accordion */}
            <AnimatePresence mode="wait">
              {activeCat && (
                <motion.div
                  key={activeCat.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  {activeCat.items.length === 0 ? (
                    <p className="text-center text-zinc-400 py-12">No questions in this category yet.</p>
                  ) : (
                    activeCat.items.map((item) => (
                      <AccordionItem
                        key={item.id}
                        item={item}
                        isOpen={openId === item.id}
                        onToggle={() => toggle(item.id)}
                        color={activeCat.color}
                      />
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-4xl mx-auto px-6 py-16 lg:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight mb-3">
            Still have questions?
          </h2>
          <p className="text-zinc-500 mb-8 max-w-lg mx-auto">
            Can&apos;t find what you&apos;re looking for? Reach out to our team and we&apos;ll be happy to help.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-zinc-900 text-white font-semibold text-sm hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20"
            >
              Contact Us
            </Link>
            <Link
              href="/academy/enquire"
              className="px-6 py-3 rounded-xl bg-amber-50 text-amber-700 font-semibold text-sm hover:bg-amber-100 transition-colors"
            >
              Academy Enquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Accordion Item ────────────────────────────────────────────────── */
function AccordionItem({
  item,
  isOpen,
  onToggle,
  color,
  badge,
}: {
  item: { id: string; question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
  color: string;
  badge?: string;
}) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        isOpen ? "border-zinc-200 bg-white shadow-sm" : "border-zinc-100 bg-white hover:border-zinc-200"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          {badge && (
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-0.5 block">
              {badge}
            </span>
          )}
          <span className={`text-sm font-semibold ${isOpen ? "text-zinc-900" : "text-zinc-700"}`}>
            {item.question}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pl-[4.25rem]">
              <div className="h-px bg-zinc-100 mb-4" />
              <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
