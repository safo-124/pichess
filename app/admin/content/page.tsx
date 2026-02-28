/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { createPost, updatePost, deletePost, deleteSubscriber } from "@/lib/actions/admin";
import AdminTabs from "@/components/admin/AdminTabs";

export const metadata = { title: "Content | Admin" };

async function getData() {
  try {
    const [posts, subscribers] = await Promise.all([
      (prisma as any).content_Post.findMany({
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
      }),
      (prisma as any).subscriber.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    return { posts, subscribers };
  } catch { return { posts: [], subscribers: [] }; }
}

const inputCls = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400/40 outline-none transition-all placeholder:text-zinc-300";
const btnCls = "px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-orange-500/20 transition-all";

export default async function AdminContentPage() {
  const { posts, subscribers } = await getData();
  const published = posts.filter((p: any) => p.published).length;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Content</h1>
        <p className="text-zinc-400 mt-1 text-sm">Blog posts, news articles and newsletter subscribers.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Posts", value: posts.length },
          { label: "Published", value: published },
          { label: "Drafts", value: posts.length - published },
          { label: "Subscribers", value: subscribers.length },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-zinc-200/80 p-4">
            <p className="text-2xl font-black text-zinc-900">{s.value}</p>
            <p className="text-xs text-zinc-400 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <AdminTabs
        accentColor="#f97316"
        tabs={[
          { id: "posts", label: "Posts", icon: "📝", count: posts.length },
          { id: "subscribers", label: "Subscribers", icon: "📧", count: subscribers.length },
        ]}
      >
        {/* ═══ TAB: Posts ══════════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Create Post Form */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 p-6">
            <h2 className="text-base font-bold text-zinc-800 mb-4">Create New Post</h2>
            <form action={createPost} className="grid sm:grid-cols-2 gap-4">
              <input name="title" required placeholder="Post title *" className={`col-span-full ${inputCls}`} />
              <input name="excerpt" placeholder="Short excerpt / summary" className={`col-span-full ${inputCls}`} />
              <textarea name="content" rows={6} required placeholder="Post content (supports Markdown) *" className={`col-span-full ${inputCls} resize-none`} />
              <input name="image" placeholder="Featured image URL" className={inputCls} />
              <input name="tags" placeholder="Tags (comma-separated: news, academy, ngo)" className={inputCls} />
              <div className="col-span-full flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                  <input type="checkbox" name="published" value="true" className="rounded border-zinc-300" /> Publish immediately
                </label>
              </div>
              <div className="col-span-full">
                <button type="submit" className={btnCls}>Create Post</button>
              </div>
            </form>
          </div>

          {/* Posts Table */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-zinc-800 text-sm">All Posts</h3>
              <span className="text-xs text-zinc-400">{posts.length} posts</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/80 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Title</th>
                    <th className="text-left px-5 py-3">Author</th>
                    <th className="text-left px-5 py-3">Tags</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Date</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {posts.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-zinc-300 py-16 text-sm">No posts yet. Create one above!</td></tr>
                  ) : posts.map((p: any) => (
                    <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-zinc-800 max-w-[220px] truncate">{p.title}</td>
                      <td className="px-5 py-3 text-zinc-400 text-xs">{p.author?.name ?? "—"}</td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1">
                          {p.tags?.map((tag: string) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-600 font-medium">{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${p.published ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                          {p.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-400 text-[11px]">{new Date(p.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1.5 items-center">
                          <form action={updatePost} className="flex gap-1 items-center">
                            <input type="hidden" name="id" value={p.id} />
                            <input type="hidden" name="title" value={p.title} />
                            <input type="hidden" name="content" value={p.content} />
                            <input type="hidden" name="excerpt" value={p.excerpt ?? ""} />
                            <input type="hidden" name="image" value={p.image ?? ""} />
                            <input type="hidden" name="tags" value={(p.tags ?? []).join(",")} />
                            <select name="published" defaultValue={String(p.published)} className="text-[11px] border border-zinc-200 rounded-lg px-1.5 py-1 bg-white">
                              <option value="false">Draft</option>
                              <option value="true">Published</option>
                            </select>
                            <button type="submit" className="text-[11px] bg-zinc-800 text-white px-2 py-1 rounded-lg hover:bg-zinc-700 font-medium">Save</button>
                          </form>
                          <form action={deletePost}>
                            <input type="hidden" name="id" value={p.id} />
                            <button type="submit" className="text-[11px] bg-red-50 text-red-500 px-2 py-1 rounded-lg hover:bg-red-100 font-semibold">Del</button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ═══ TAB: Subscribers ════════════════════════════════════════ */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-zinc-800 text-sm">Newsletter Subscribers</h3>
              <span className="text-xs text-zinc-400">{subscribers.length} subscribers</span>
            </div>
            <div className="overflow-x-auto">
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
                  ) : subscribers.map((s: any) => (
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
          </div>
        </div>
      </AdminTabs>
    </div>
  );
}
