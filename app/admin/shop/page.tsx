/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { createProduct, updateProduct, deleteProduct, createCategory, deleteCategory } from "@/lib/actions/admin";

export const metadata = { title: "Shop | Admin" };

async function getData() {
  try {
    const [products, categories] = await Promise.all([
      (prisma as any).product.findMany({
        orderBy: { createdAt: "desc" },
        include: { category: { select: { id: true, name: true } } },
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-zinc-900">Shop</h1>
        <p className="text-zinc-400 mt-1">Manage products and categories.</p>
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

      {/* ── Add Category ────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-bold text-zinc-900 mb-4">📂 Categories</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((c: any) => (
            <form key={c.id} action={deleteCategory} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium group">
              <input type="hidden" name="id" value={c.id} />
              <span>{c.name}</span>
              <button type="submit" className="text-red-400 hover:text-red-600 font-bold ml-1" title="Delete category">×</button>
            </form>
          ))}
          {categories.length === 0 && <p className="text-zinc-400 text-sm">No categories yet. Add one below.</p>}
        </div>
        <form action={createCategory} className="flex gap-3 items-end">
          <div className="flex-1">
            <input name="name" required placeholder="Category name *" className="w-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
          </div>
          <div className="flex-1">
            <input name="image" placeholder="Image URL (optional)" className="w-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
          </div>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors whitespace-nowrap">
            + Add Category
          </button>
        </form>
      </div>

      {/* ── Add Product ─────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-bold text-zinc-900 mb-4">🛍️ Add New Product</h2>
        <form action={createProduct} className="grid sm:grid-cols-2 gap-4">
          <input name="name" required placeholder="Product name *" className="col-span-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
          <textarea name="description" rows={2} placeholder="Description" className="col-span-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none resize-none" />
          <input name="price" type="number" step="0.01" required placeholder="Price (GH₵) *" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
          <select name="categoryId" required className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm">
            <option value="">Select category *</option>
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input name="image" placeholder="Image URL" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-900 outline-none" />
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
              <input type="checkbox" name="inStock" value="true" defaultChecked className="rounded" /> In Stock
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
              <input type="checkbox" name="featured" value="true" className="rounded" /> Featured
            </label>
          </div>
          <div className="col-span-full">
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors">
              Add Product
            </button>
          </div>
        </form>
      </div>

      {/* ── Products Table ──────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="p-5 border-b border-zinc-100">
          <h2 className="font-bold text-zinc-900">Products ({products.length})</h2>
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
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {products.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-zinc-400 py-12">No products yet. Create one above!</td></tr>
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
                    <div className="flex gap-2 items-center flex-wrap">
                      {/* Quick update */}
                      <form action={updateProduct} className="flex gap-1.5 items-center">
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="name" value={p.name} />
                        <input type="hidden" name="description" value={p.description ?? ""} />
                        <input type="hidden" name="price" value={p.price} />
                        <input type="hidden" name="image" value={p.image ?? ""} />
                        <input type="hidden" name="categoryId" value={p.categoryId} />
                        <select name="inStock" defaultValue={String(p.inStock)} className="text-xs border border-zinc-200 rounded px-1.5 py-1 bg-white">
                          <option value="true">In Stock</option>
                          <option value="false">Out</option>
                        </select>
                        <select name="featured" defaultValue={String(p.featured)} className="text-xs border border-zinc-200 rounded px-1.5 py-1 bg-white">
                          <option value="false">—</option>
                          <option value="true">★</option>
                        </select>
                        <button type="submit" className="text-xs bg-zinc-900 text-white px-2.5 py-1 rounded-lg hover:bg-zinc-700">Save</button>
                      </form>
                      {/* Delete */}
                      <form action={deleteProduct}>
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
    </div>
  );
}
