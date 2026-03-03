"use client";
import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { createPost, updatePost, deletePost, deleteSubscriber } from "@/lib/actions/admin";

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

interface Subscriber {
  id: number;
  email: string;
  name: string | null;
  active: boolean;
  createdAt: string;
}

interface Props {
  initialPosts: Post[];
  initialSubscribers: Subscriber[];
}

const POST_TYPES = [
  { value: "news", label: "News", icon: "🗞️", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { value: "blog", label: "Blog", icon: "✍️", color: "bg-purple-50 text-purple-600 border-purple-100" },
  { value: "article", label: "Article", icon: "📄", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
];

/* ── ImageUpload ───────────────────────────────────────────── */
function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } catch { /* ignore */ }
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL or upload below"
          className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400/40 outline-none transition-all placeholder:text-zinc-300"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-zinc-100 text-zinc-600 text-sm font-medium hover:bg-zinc-200 transition-all disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "📁 Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
        />
      </div>
      {value && (
        <div className="relative inline-block">
          <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-zinc-200">
            <Image src={value} alt="Preview" fill className="object-cover" sizes="128px" />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────── */
export default function AdminNewsManager({ initialPosts, initialSubscribers }: Props) {
  const [tab, setTab] = useState<"posts" | "subscribers">("posts");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  // Form state
  const [form, setForm] = useState({
    title: "", excerpt: "", content: "", image: "", type: "news", tags: "", published: false,
  });
  const [editForm, setEditForm] = useState({
    title: "", excerpt: "", content: "", image: "", type: "news", tags: "", published: false,
  });

  const posts = initialPosts;
  const subscribers = initialSubscribers;
  const published = posts.filter((p) => p.published).length;
  const counts = {
    news: posts.filter((p) => p.type === "news").length,
    blog: posts.filter((p) => p.type === "blog").length,
    article: posts.filter((p) => p.type === "article").length,
  };

  function handleCreate() {
    const fd = new FormData();
    fd.set("title", form.title);
    fd.set("excerpt", form.excerpt);
    fd.set("content", form.content);
    fd.set("image", form.image);
    fd.set("type", form.type);
    fd.set("tags", form.tags);
    fd.set("published", form.published ? "true" : "false");
    startTransition(async () => {
      await createPost(fd);
      setForm({ title: "", excerpt: "", content: "", image: "", type: "news", tags: "", published: false });
    });
  }

  function startEdit(p: Post) {
    setEditingId(p.id);
    setEditForm({
      title: p.title,
      excerpt: p.excerpt ?? "",
      content: p.content,
      image: p.image ?? "",
      type: p.type,
      tags: p.tags.join(", "),
      published: p.published,
    });
  }

  function handleUpdate(id: number) {
    const fd = new FormData();
    fd.set("id", String(id));
    fd.set("title", editForm.title);
    fd.set("excerpt", editForm.excerpt);
    fd.set("content", editForm.content);
    fd.set("image", editForm.image);
    fd.set("type", editForm.type);
    fd.set("tags", editForm.tags);
    fd.set("published", editForm.published ? "true" : "false");
    startTransition(async () => {
      await updatePost(fd);
      setEditingId(null);
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this post?")) return;
    const fd = new FormData();
    fd.set("id", String(id));
    startTransition(() => deletePost(fd));
  }

  const inputCls = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400/40 outline-none transition-all placeholder:text-zinc-300";

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Content & News</h1>
        <p className="text-zinc-400 mt-1 text-sm">Manage news, blog posts, articles & newsletter subscribers.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Posts", value: posts.length, emoji: "📝" },
          { label: "Published", value: published, emoji: "✅" },
          { label: "Drafts", value: posts.length - published, emoji: "📋" },
          { label: "News", value: counts.news, emoji: "🗞️" },
          { label: "Blog", value: counts.blog, emoji: "✍️" },
          { label: "Articles", value: counts.article, emoji: "📄" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-zinc-200/80 p-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">{s.emoji}</span>
              <p className="text-2xl font-black text-zinc-900">{s.value}</p>
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        {[
          { id: "posts" as const, label: "Posts", icon: "📝", count: posts.length },
          { id: "subscribers" as const, label: "Subscribers", icon: "📧", count: subscribers.length },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.id
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            }`}
          >
            <span>{t.icon}</span> {t.label}
            <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              tab === t.id ? "bg-white/20" : "bg-zinc-200"
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* ═══ Posts Tab ═════════════════════════════════════════ */}
      {tab === "posts" && (
        <div className="space-y-6">
          {/* Create Post */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 p-6">
            <h2 className="text-base font-bold text-zinc-800 mb-4">Create New Post</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Post title *"
                className={`col-span-full ${inputCls}`}
              />
              <input
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Short excerpt / summary"
                className={`col-span-full ${inputCls}`}
              />
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={6}
                placeholder="Post content *"
                className={`col-span-full ${inputCls} resize-none`}
              />

              {/* Type selector */}
              <div>
                <label className="block text-xs text-zinc-500 font-medium mb-1.5">Post Type</label>
                <div className="flex gap-2">
                  {POST_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm({ ...form, type: t.value })}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition-all ${
                        form.type === t.value
                          ? "bg-orange-50 border-orange-300 text-orange-600"
                          : "border-zinc-200 text-zinc-400 hover:border-zinc-300"
                      }`}
                    >
                      <span>{t.icon}</span> {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Tags (comma-separated)"
                className={inputCls}
              />

              {/* Image upload */}
              <div className="col-span-full">
                <label className="block text-xs text-zinc-500 font-medium mb-1.5">Featured Image</label>
                <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
              </div>

              <div className="col-span-full flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="rounded border-zinc-300"
                  />
                  Publish immediately
                </label>
              </div>

              <div className="col-span-full">
                <button
                  onClick={handleCreate}
                  disabled={!form.title || !form.content || pending}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-50"
                >
                  {pending ? "Creating…" : "Create Post"}
                </button>
              </div>
            </div>
          </div>

          {/* Posts List — Desktop table */}
          <div className="hidden lg:block rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-zinc-800 text-sm">All Posts</h3>
              <span className="text-xs text-zinc-400">{posts.length} posts</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/80 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Image</th>
                    <th className="text-left px-5 py-3">Title</th>
                    <th className="text-left px-5 py-3">Type</th>
                    <th className="text-left px-5 py-3">Tags</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Date</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {posts.length === 0 ? (
                    <tr><td colSpan={7} className="text-center text-zinc-300 py-16 text-sm">No posts yet. Create one above!</td></tr>
                  ) : posts.map((p) => {
                    const tc = POST_TYPES.find((t) => t.value === p.type);
                    return (
                      <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors group">
                        <td className="px-5 py-3">
                          <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-zinc-100">
                            {p.image ? (
                              <Image src={p.image} alt="" fill className="object-cover" sizes="64px" />
                            ) : (
                              <div className="flex items-center justify-center h-full text-zinc-300 text-sm">{tc?.icon ?? "📝"}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3 font-semibold text-zinc-800 max-w-[260px]">
                          <p className="truncate">{p.title}</p>
                          {p.excerpt && <p className="text-[11px] text-zinc-400 truncate mt-0.5">{p.excerpt}</p>}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${tc?.color ?? ""}`}>
                            {tc?.icon} {p.type}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap gap-1">
                            {p.tags?.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-600 font-medium">{tag}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${p.published ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                            {p.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-zinc-400 text-[11px]">
                          {new Date(p.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => editingId === p.id ? setEditingId(null) : startEdit(p)}
                              className="text-[11px] bg-zinc-800 text-white px-2.5 py-1 rounded-lg hover:bg-zinc-700 font-medium"
                            >
                              {editingId === p.id ? "Cancel" : "Edit"}
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="text-[11px] bg-red-50 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-100 font-semibold"
                            >
                              Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Edit panel (desktop) */}
            {editingId && (
              <div className="border-t border-zinc-100 bg-zinc-50/50 p-6">
                <h4 className="font-bold text-zinc-800 text-sm mb-4">Edit Post</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Title *"
                    className={`col-span-full ${inputCls}`}
                  />
                  <input
                    value={editForm.excerpt}
                    onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                    placeholder="Excerpt"
                    className={`col-span-full ${inputCls}`}
                  />
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    rows={5}
                    placeholder="Content *"
                    className={`col-span-full ${inputCls} resize-none`}
                  />
                  <div>
                    <label className="block text-xs text-zinc-500 font-medium mb-1.5">Post Type</label>
                    <div className="flex gap-2">
                      {POST_TYPES.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setEditForm({ ...editForm, type: t.value })}
                          className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl border text-sm font-semibold transition-all ${
                            editForm.type === t.value
                              ? "bg-orange-50 border-orange-300 text-orange-600"
                              : "border-zinc-200 text-zinc-400"
                          }`}
                        >
                          <span>{t.icon}</span> {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    placeholder="Tags (comma-separated)"
                    className={inputCls}
                  />
                  <div className="col-span-full">
                    <label className="block text-xs text-zinc-500 font-medium mb-1.5">Featured Image</label>
                    <ImageUpload value={editForm.image} onChange={(url) => setEditForm({ ...editForm, image: url })} />
                  </div>
                  <div className="col-span-full flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.published}
                        onChange={(e) => setEditForm({ ...editForm, published: e.target.checked })}
                        className="rounded border-zinc-300"
                      />
                      Published
                    </label>
                    <button
                      onClick={() => handleUpdate(editingId)}
                      disabled={pending}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {pending ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Posts List — Mobile cards */}
          <div className="lg:hidden space-y-3">
            {posts.length === 0 ? (
              <div className="rounded-2xl bg-white border border-zinc-200/80 p-12 text-center text-zinc-300 text-sm">
                No posts yet.
              </div>
            ) : posts.map((p) => {
              const tc = POST_TYPES.find((t) => t.value === p.type);
              const isEditing = editingId === p.id;
              return (
                <div key={p.id} className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
                  <div className="flex gap-3 p-4">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                      {p.image ? (
                        <Image src={p.image} alt="" fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-zinc-300 text-2xl">{tc?.icon ?? "📝"}</div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase border ${tc?.color ?? ""}`}>
                          {p.type}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${p.published ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                          {p.published ? "Live" : "Draft"}
                        </span>
                      </div>
                      <p className="font-semibold text-zinc-800 text-sm truncate">{p.title}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {new Date(p.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                      <div className="flex gap-1.5 mt-2">
                        <button
                          onClick={() => isEditing ? setEditingId(null) : startEdit(p)}
                          className="text-[11px] bg-zinc-800 text-white px-2.5 py-1 rounded-lg font-medium"
                        >
                          {isEditing ? "Cancel" : "Edit"}
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-[11px] bg-red-50 text-red-500 px-2.5 py-1 rounded-lg font-semibold"
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Edit form (mobile) */}
                  {isEditing && (
                    <div className="border-t border-zinc-100 bg-zinc-50/50 p-4 space-y-3">
                      <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" className={inputCls} />
                      <input value={editForm.excerpt} onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })} placeholder="Excerpt" className={inputCls} />
                      <textarea value={editForm.content} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} rows={4} placeholder="Content" className={`${inputCls} resize-none`} />
                      <div className="flex gap-2">
                        {POST_TYPES.map((t) => (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => setEditForm({ ...editForm, type: t.value })}
                            className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-xl border text-xs font-semibold transition-all ${
                              editForm.type === t.value
                                ? "bg-orange-50 border-orange-300 text-orange-600"
                                : "border-zinc-200 text-zinc-400"
                            }`}
                          >
                            <span>{t.icon}</span> {t.label}
                          </button>
                        ))}
                      </div>
                      <input value={editForm.tags} onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })} placeholder="Tags" className={inputCls} />
                      <ImageUpload value={editForm.image} onChange={(url) => setEditForm({ ...editForm, image: url })} />
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm text-zinc-600">
                          <input type="checkbox" checked={editForm.published} onChange={(e) => setEditForm({ ...editForm, published: e.target.checked })} className="rounded border-zinc-300" />
                          Published
                        </label>
                        <button onClick={() => handleUpdate(p.id)} disabled={pending} className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold disabled:opacity-50">
                          {pending ? "Saving…" : "Save"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ Subscribers Tab ══════════════════════════════════ */}
      {tab === "subscribers" && (
        <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="font-bold text-zinc-800 text-sm">Newsletter Subscribers</h3>
            <span className="text-xs text-zinc-400">{subscribers.length} subscribers</span>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/80 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Email</th>
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {subscribers.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-zinc-300 py-16 text-sm">No subscribers yet.</td></tr>
                ) : subscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-zinc-800">{s.email}</td>
                    <td className="px-5 py-3 text-zinc-400">{s.name || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${s.active ? "bg-green-50 text-green-600" : "bg-zinc-100 text-zinc-400"}`}>
                        {s.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-zinc-400 text-[11px]">{new Date(s.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</td>
                    <td className="px-5 py-3">
                      <form action={deleteSubscriber}>
                        <input type="hidden" name="id" value={s.id} />
                        <button type="submit" className="text-[11px] bg-red-50 text-red-500 px-2 py-1 rounded-lg hover:bg-red-100 font-semibold">Remove</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-zinc-100">
            {subscribers.length === 0 ? (
              <p className="text-center text-zinc-300 py-12 text-sm">No subscribers yet.</p>
            ) : subscribers.map((s) => (
              <div key={s.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-zinc-800 text-sm">{s.email}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{s.name || "—"} · {new Date(s.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${s.active ? "bg-green-50 text-green-600" : "bg-zinc-100 text-zinc-400"}`}>
                  {s.active ? "Active" : "Off"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
