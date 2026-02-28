/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { createPost, updatePost, deletePost, deleteSubscriber } from "@/lib/actions/admin";

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

export default async function AdminContentPage() {
  const { posts, subscribers } = await getData();
  const published = posts.filter((p: any) => p.published).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-zinc-900">Content</h1>
        <p className="text-zinc-400 mt-1">Posts, news articles and newsletter subscribers.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Posts", value: posts.length },
          { label: "Published", value: published },
          { label: "Drafts", value: posts.length - published },
          { label: "Subscribers", value: subscribers.length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-2xl font-black text-zinc-900">{s.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Create Post ─────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-bold text-zinc-900 mb-4">📝 Create New Post</h2>
        <form action={createPost} className="grid sm:grid-cols-2 gap-4">
          <input name="title" required placeholder="Post title *" className="col-span-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
          <input name="excerpt" placeholder="Short excerpt / summary" className="col-span-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
          <textarea name="content" rows={6} required placeholder="Post content (supports Markdown) *" className="col-span-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none resize-none" />
          <input name="image" placeholder="Featured image URL" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
          <input name="tags" placeholder="Tags (comma-separated: news, academy, ngo)" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
          <div className="col-span-full flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
              <input type="checkbox" name="published" value="true" className="rounded" /> Publish immediately
            </label>
          </div>
          <div className="col-span-full">
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors">
              Create Post
            </button>
          </div>
        </form>
      </div>

      {/* ── Posts Table ──────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xl font-black text-zinc-900 mb-3">Posts</h2>
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
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
                  <tr><td colSpan={6} className="text-center text-zinc-400 py-12">No posts yet. Create one above!</td></tr>
                ) : posts.map((p: any) => (
                  <tr key={p.id} className="hover:bg-zinc-50/50">
                    <td className="px-5 py-3 font-medium text-zinc-900 max-w-[220px] truncate">{p.title}</td>
                    <td className="px-5 py-3 text-zinc-500">{p.author?.name ?? "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.tags?.map((tag: string) => (
                          <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${p.published ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                        {p.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-zinc-400 text-xs">{new Date(p.createdAt).toLocaleDateString("en-GB")}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2 items-center flex-wrap">
                        {/* Toggle publish */}
                        <form action={updatePost} className="flex gap-1.5 items-center">
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="title" value={p.title} />
                          <input type="hidden" name="content" value={p.content} />
                          <input type="hidden" name="excerpt" value={p.excerpt ?? ""} />
                          <input type="hidden" name="image" value={p.image ?? ""} />
                          <input type="hidden" name="tags" value={(p.tags ?? []).join(",")} />
                          <select name="published" defaultValue={String(p.published)} className="text-xs border border-zinc-200 rounded px-1.5 py-1 bg-white">
                            <option value="false">Draft</option>
                            <option value="true">Published</option>
                          </select>
                          <button type="submit" className="text-xs bg-zinc-900 text-white px-2.5 py-1 rounded-lg hover:bg-zinc-700">Save</button>
                        </form>
                        {/* Delete */}
                        <form action={deletePost}>
                          <input type="hidden" name="id" value={p.id} />
                          <button type="submit" className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-100 font-semibold">
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Subscribers ──────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xl font-black text-zinc-900 mb-3">Newsletter Subscribers ({subscribers.length})</h2>
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Email</th>
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3">Active</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {subscribers.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-zinc-400 py-12">No subscribers yet.</td></tr>
                ) : subscribers.map((s: any) => (
                  <tr key={s.id} className="hover:bg-zinc-50/50">
                    <td className="px-5 py-3 font-medium text-zinc-900">{s.email}</td>
                    <td className="px-5 py-3 text-zinc-500">{s.name || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.active ? "bg-green-50 text-green-600" : "bg-zinc-100 text-zinc-400"}`}>
                        {s.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-zinc-400 text-xs">{new Date(s.createdAt).toLocaleDateString("en-GB")}</td>
                    <td className="px-5 py-3">
                      <form action={deleteSubscriber}>
                        <input type="hidden" name="id" value={s.id} />
                        <button type="submit" className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-100 font-semibold">
                          Remove
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
