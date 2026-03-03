"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/* ── types ─────────────────────────────────────────────────── */
interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  type: string;
  tags: string[];
  published: boolean;
  author: { name: string } | null;
  createdAt: string;
}

/* ── constants ─────────────────────────────────────────────── */
const TABS = [
  { key: "all", label: "All", icon: "📰" },
  { key: "news", label: "News", icon: "🗞️" },
  { key: "blog", label: "Blog", icon: "✍️" },
  { key: "article", label: "Articles", icon: "📄" },
];

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  news: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
  blog: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" },
  article: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
};

const HERO_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168d9c?w=1200&h=600&fit=crop&q=80";

/* ── page ──────────────────────────────────────────────────── */
export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.posts ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = posts;
    if (activeTab !== "all") list = list.filter((p) => p.type === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [posts, activeTab, search]);

  const featuredPost = posts.find((p) => p.type === "news" || p.type === "blog");
  const counts = {
    all: posts.length,
    news: posts.filter((p) => p.type === "news").length,
    blog: posts.filter((p) => p.type === "blog").length,
    article: posts.filter((p) => p.type === "article").length,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(201,168,76,0.06),transparent)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#c9a84c]/25 bg-[#c9a84c]/8 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                <span className="text-[#c9a84c] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]">
                  Latest Updates
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight">
                News & Insights
              </h1>
              <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-lg leading-relaxed">
                Stay updated with the latest news, blog posts, and in-depth articles from the PiChess community.
              </p>

              {/* Search */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-8"
              >
                <div className="relative max-w-md">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search news, blogs, articles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/60 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c]/40 transition-all"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block flex-shrink-0 w-[340px] xl:w-[420px]"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/80">
                <Image
                  src={HERO_IMAGE}
                  alt="Chess news and updates"
                  fill
                  sizes="420px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-1.5">
                        {["📰", "✍️", "📄"].map((e, i) => (
                          <span key={i} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm border-2 border-white">{e}</span>
                        ))}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c]">
                          News · Blog · Articles
                        </p>
                        <p className="text-xs text-gray-600 font-medium">
                          {posts.length} published post{posts.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 -bottom-3 -right-3 w-full h-full rounded-3xl bg-[#c9a84c]/10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Tabs ─────────────────────────────────────────── */}
      <section className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                {tab.label}
                <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-200/80 text-gray-400"
                }`}>
                  {counts[tab.key as keyof typeof counts]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Post (only when "All") ──────────────── */}
      {activeTab === "all" && !search && featuredPost && (
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FeaturedCard post={featuredPost} />
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Grid ─────────────────────────────────────────── */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs sm:text-sm text-gray-400">
              {loading ? "Loading..." : `${filtered.length} post${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-50 animate-pulse">
                  <div className="aspect-video rounded-t-2xl bg-gray-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-gray-100 rounded-full w-1/4" />
                    <div className="h-5 bg-gray-100 rounded-full w-3/4" />
                    <div className="h-3 bg-gray-100 rounded-full w-full" />
                    <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-20 sm:py-24 text-center"
            >
              <div className="text-5xl mb-4">📰</div>
              <p className="text-gray-400 font-medium">
                {search ? "No posts match your search." : "No posts available yet."}
              </p>
              {search && (
                <button onClick={() => setSearch("")} className="mt-3 text-sm text-[#c9a84c] font-semibold hover:underline">
                  Clear search
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <PostCard post={p} expanded={expandedPost === p.id} onToggle={() => setExpandedPost(expandedPost === p.id ? null : p.id)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Newsletter CTA ───────────────────────────────── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">Stay in the Loop</h2>
          <p className="text-gray-400 text-sm sm:text-base mb-6">
            Follow us for the latest chess news, tournament results, and community stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/233000000000?text=Hi%2C%20I%27d%20like%20to%20get%20PiChess%20updates"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-bold text-sm hover:bg-[#128C7E] transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Updates
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-100 transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Featured Card ─────────────────────────────────────────── */
function FeaturedCard({ post: p }: { post: Post }) {
  const [imgErr, setImgErr] = useState(false);
  const tc = TYPE_COLORS[p.type] ?? TYPE_COLORS.news;

  return (
    <div className="group rounded-3xl bg-white border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100 transition-all duration-300">
      <div className="flex flex-col lg:flex-row">
        {/* Image */}
        <div className="relative lg:w-1/2 aspect-video lg:aspect-auto lg:min-h-[340px] bg-gray-50 overflow-hidden">
          {p.image && !imgErr ? (
            <Image
              src={p.image}
              alt={p.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              onError={() => setImgErr(true)}
            />
          ) : (
            <Image
              src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&h=500&fit=crop&q=80"
              alt={p.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
            />
          )}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-[#c9a84c] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
              Featured
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tc.bg} ${tc.text} ${tc.border} border`}>
              {p.type}
            </span>
            <span className="text-gray-300 text-xs">·</span>
            <span className="text-gray-400 text-xs">
              {new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-3 group-hover:text-[#c9a84c] transition-colors">
            {p.title}
          </h2>
          {p.excerpt && (
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4 line-clamp-3">
              {p.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 mt-auto">
            {p.author?.name && (
              <span className="text-xs text-gray-500 font-medium">By {p.author.name}</span>
            )}
            {p.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {p.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 font-medium capitalize">{tag}</span>
                ))}
              </div>
            )}
          </div>
          <p className="text-sm font-semibold text-[#c9a84c] mt-4 group-hover:underline cursor-pointer">
            Read full story →
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Post Card ─────────────────────────────────────────────── */
function PostCard({ post: p, expanded, onToggle }: { post: Post; expanded: boolean; onToggle: () => void }) {
  const [imgErr, setImgErr] = useState(false);
  const tc = TYPE_COLORS[p.type] ?? TYPE_COLORS.news;

  const fallbacks: Record<string, string> = {
    news: "https://images.unsplash.com/photo-1504711434969-e33886168d9c?w=600&h=400&fit=crop&q=80",
    blog: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop&q=80",
    article: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&h=400&fit=crop&q=80",
  };

  return (
    <div
      className="group rounded-2xl bg-white border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 cursor-pointer"
      onClick={onToggle}
    >
      {/* Image */}
      <div className="relative aspect-video bg-gray-50 overflow-hidden">
        {p.image && !imgErr ? (
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgErr(true)}
          />
        ) : (
          <Image
            src={fallbacks[p.type] ?? fallbacks.news}
            alt={p.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
          />
        )}
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${tc.bg} ${tc.text} shadow-sm border ${tc.border} backdrop-blur-sm`}>
            {p.type}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-400 text-[10px] sm:text-xs font-medium">
            {new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          {p.author?.name && (
            <>
              <span className="text-gray-200">·</span>
              <span className="text-gray-400 text-[10px] sm:text-xs">{p.author.name}</span>
            </>
          )}
        </div>

        <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight mb-2 line-clamp-2 group-hover:text-[#c9a84c] transition-colors">
          {p.title}
        </h3>

        {p.excerpt && (
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2">
            {p.excerpt}
          </p>
        )}

        {/* Tags */}
        {p.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {p.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 font-medium capitalize">{tag}</span>
            ))}
          </div>
        )}

        <p className="text-xs font-semibold text-[#c9a84c]">
          {expanded ? "Show less ↑" : "Read more →"}
        </p>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-gray-100">
              <div className="prose prose-sm prose-gray max-w-none mt-3">
                {p.content.split("\n").map((line, i) => (
                  <p key={i} className="text-gray-600 text-sm leading-relaxed mb-2">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
