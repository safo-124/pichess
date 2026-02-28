/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";

export const metadata = { title: "Shop | Admin" };

async function getData() {
  try {
    const [products, categories] = await Promise.all([
      (prisma as any).product.findMany({
        orderBy: { createdAt: "desc" },
        include: { category: { select: { name: true } } },
      }),
      (prisma as any).category.findMany({ orderBy: { name: "asc" } }),
    ]);
    return { products, categories };
  } catch { return { products: [], categories: [] }; }
}

export default async function AdminShopPage() {
  const { products, categories } = await getData();
  const inStock = products.filter((p: any) => p.inStock).length;
  const featured = products.filter((p: any) => p.featured).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">Shop</h1>
          <p className="text-zinc-400 mt-1">Manage products and categories.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: products.length },
          { label: "In Stock", value: inStock },
          { label: "Out of Stock", value: products.length - inStock },
          { label: "Featured", value: featured },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-2xl font-black text-zinc-900">{s.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h2 className="font-bold text-zinc-900 mb-2">Categories</h2>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c: any) => (
              <span key={c.id} className="text-xs px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-600 font-medium">{c.name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Products table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="p-5 border-b border-zinc-100">
          <h2 className="font-bold text-zinc-900">Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-left px-5 py-3">Price</th>
                <th className="text-left px-5 py-3">In Stock</th>
                <th className="text-left px-5 py-3">Featured</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {products.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-zinc-400 py-12">No products yet.</td></tr>
              ) : products.map((p: any) => (
                <tr key={p.id} className="hover:bg-zinc-50/50">
                  <td className="px-5 py-3 font-medium text-zinc-900">{p.name}</td>
                  <td className="px-5 py-3 text-zinc-500">{p.category?.name ?? "—"}</td>
                  <td className="px-5 py-3 font-bold text-zinc-900">GH₵ {p.price}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${p.inStock ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                      {p.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs ${p.featured ? "text-[#c9a84c] font-bold" : "text-zinc-300"}`}>
                      {p.featured ? "★ Featured" : "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-zinc-400 text-xs">{new Date(p.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="px-5 py-3">
                    <form action={async (fd) => {
                      "use server";
                      await (prisma as any).product.update({
                        where: { id: p.id },
                        data: {
                          inStock: fd.get("inStock") === "true",
                          featured: fd.get("featured") === "true",
                        }
                      });
                    }}>
                      <div className="flex gap-1.5 items-center">
                        <select name="inStock" defaultValue={String(p.inStock)} className="text-xs border border-zinc-200 rounded px-1.5 py-1 bg-white">
                          <option value="true">In Stock</option>
                          <option value="false">Out</option>
                        </select>
                        <select name="featured" defaultValue={String(p.featured)} className="text-xs border border-zinc-200 rounded px-1.5 py-1 bg-white">
                          <option value="false">—</option>
                          <option value="true">Featured</option>
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

      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
        <p className="text-zinc-400 text-sm">Product creation form coming soon. Use Prisma Studio to add products.</p>
      </div>
    </div>
  );
}
