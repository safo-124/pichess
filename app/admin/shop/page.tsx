/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { createProduct, updateProduct, deleteProduct, createCategory, deleteCategory } from "@/lib/actions/admin";
import AdminTabs from "@/components/admin/AdminTabs";

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

const inputCls = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/40 outline-none transition-all placeholder:text-zinc-300";
const btnCls = "px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all";

export default async function AdminShopPage() {
  const { products, categories } = await getData();
  const inStock = products.filter((p: any) => p.inStock).length;
  const featured = products.filter((p: any) => p.featured).length;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Shop</h1>
        <p className="text-zinc-400 mt-1 text-sm">Manage products and categories for the online store.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Products", value: products.length },
          { label: "In Stock", value: inStock },
          { label: "Out of Stock", value: products.length - inStock },
          { label: "Featured", value: featured },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-zinc-200/80 p-4">
            <p className="text-2xl font-black text-zinc-900">{s.value}</p>
            <p className="text-xs text-zinc-400 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <AdminTabs
        accentColor="#a855f7"
        tabs={[
          { id: "products", label: "Products", icon: "🛍️", count: products.length },
          { id: "categories", label: "Categories", icon: "📂", count: categories.length },
        ]}
      >
        {/* ═══ TAB: Products ═══════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Add Product Form */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 p-6">
            <h2 className="text-base font-bold text-zinc-800 mb-4">Add New Product</h2>
            <form action={createProduct} className="grid sm:grid-cols-2 gap-4">
              <input name="name" required placeholder="Product name *" className={`col-span-full ${inputCls}`} />
              <textarea name="description" rows={2} placeholder="Description" className={`col-span-full ${inputCls} resize-none`} />
              <input name="price" type="number" step="0.01" required placeholder="Price (GH₵) *" className={inputCls} />
              <select name="categoryId" required className={inputCls}>
                <option value="">Select category *</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input name="image" placeholder="Image URL" className={inputCls} />
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                  <input type="checkbox" name="inStock" value="true" defaultChecked className="rounded border-zinc-300" /> In Stock
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                  <input type="checkbox" name="featured" value="true" className="rounded border-zinc-300" /> Featured
                </label>
              </div>
              <div className="col-span-full">
                <button type="submit" className={btnCls}>Add Product</button>
              </div>
            </form>
          </div>

          {/* Products Table */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-zinc-800 text-sm">All Products</h3>
              <span className="text-xs text-zinc-400">{products.length} products</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/80 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
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
                    <tr><td colSpan={7} className="text-center text-zinc-300 py-16 text-sm">No products yet. Create one above!</td></tr>
                  ) : products.map((p: any) => (
                    <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-zinc-800">{p.name}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">{p.category?.name ?? "—"}</span>
                      </td>
                      <td className="px-5 py-3 font-bold text-zinc-900">GH₵ {p.price}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${p.inStock ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                          {p.inStock ? "In Stock" : "Out"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs ${p.featured ? "text-purple-500 font-bold" : "text-zinc-300"}`}>
                          {p.featured ? "★ Featured" : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-400 text-[11px]">{new Date(p.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1.5 items-center">
                          <form action={updateProduct} className="flex gap-1 items-center">
                            <input type="hidden" name="id" value={p.id} />
                            <input type="hidden" name="name" value={p.name} />
                            <input type="hidden" name="description" value={p.description ?? ""} />
                            <input type="hidden" name="price" value={p.price} />
                            <input type="hidden" name="image" value={p.image ?? ""} />
                            <input type="hidden" name="categoryId" value={p.categoryId} />
                            <select name="inStock" defaultValue={String(p.inStock)} className="text-[11px] border border-zinc-200 rounded-lg px-1.5 py-1 bg-white">
                              <option value="true">In Stock</option>
                              <option value="false">Out</option>
                            </select>
                            <select name="featured" defaultValue={String(p.featured)} className="text-[11px] border border-zinc-200 rounded-lg px-1.5 py-1 bg-white">
                              <option value="false">—</option>
                              <option value="true">★</option>
                            </select>
                            <button type="submit" className="text-[11px] bg-zinc-800 text-white px-2 py-1 rounded-lg hover:bg-zinc-700 font-medium">Save</button>
                          </form>
                          <form action={deleteProduct}>
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

        {/* ═══ TAB: Categories ═════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Add Category */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 p-6">
            <h2 className="text-base font-bold text-zinc-800 mb-4">Add Category</h2>
            <form action={createCategory} className="flex gap-3 items-end flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <input name="name" required placeholder="Category name *" className={inputCls} />
              </div>
              <div className="flex-1 min-w-[200px]">
                <input name="image" placeholder="Image URL (optional)" className={inputCls} />
              </div>
              <button type="submit" className={`${btnCls} whitespace-nowrap`}>+ Add Category</button>
            </form>
          </div>

          {/* Categories List */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-zinc-800 text-sm">All Categories</h3>
              <span className="text-xs text-zinc-400">{categories.length} categories</span>
            </div>
            <div className="p-5">
              {categories.length === 0 ? (
                <p className="text-zinc-300 text-sm text-center py-8">No categories yet. Add one above.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map((c: any) => (
                    <form key={c.id} action={deleteCategory} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 text-sm font-medium group hover:bg-purple-100 transition-colors">
                      <input type="hidden" name="id" value={c.id} />
                      <span>{c.name}</span>
                      <button type="submit" className="text-red-400 hover:text-red-600 font-bold ml-1 text-base leading-none" title="Delete category">×</button>
                    </form>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminTabs>
    </div>
  );
}
