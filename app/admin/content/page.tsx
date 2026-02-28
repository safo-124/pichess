/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";

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

      {/* Posts */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-black text-zinc-900">Posts</h2>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Title</th>
                  <th className="text-left px-5 py-3">Author</th>
                  <th className="text-left px-5 py-3">Tags</th>
                  <th className="text-left px-5 py-3">Published</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {posts.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-zinc-400 py-12">No posts yet.</td></tr>
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
                      <form action={async (fd) => {
                        "use server";
                        await (prisma as any).content_Post.update({
                          where: { id: p.id },
                          data: { published: fd.get("published") === "true" },
                        });
                      }}>
                        <div className="flex gap-2 items-center">
                          <select name="published" defaultValue={String(p.published)} className="text-xs border border-zinc-200 rounded px-1.5 py-1 bg-white">
                            <option value="false">Draft</option>
                            <option value="true">Published</option>
                          </select>
                          <button type="submit" className="text-xs bg-zinc-900 text-white px-3 py-1 rounded-lg">Save</button>
                        </div>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Subscribers */}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {subscribers.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-zinc-400 py-12">No subscribers yet.</td></tr>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export hint */}
        <div className="mt-3 text-right">
          <p className="text-xs text-zinc-400">Export via Prisma Studio or direct DB query.</p>
        </div>
      </section>
    </div>
  );
}
