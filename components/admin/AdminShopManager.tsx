"use client";
import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  deleteCategory,
} from "@/lib/actions/admin";

/* ── types ─────────────────────────────────────────────────── */
interface Category {
  id: number;
  name: string;
}
interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  inStock: boolean;
  featured: boolean;
  categoryId: number;
  category: Category | null;
  createdAt: string;
}

/* ── image uploader ────────────────────────────────────────── */
function ImageUpload({
  current,
  onUploaded,
  label,
}: {
  current?: string | null;
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(current || "");

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setPreview(data.url);
        onUploaded(data.url);
      }
    } catch {
      /* ignore */
    }
    setUploading(false);
  };

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex items-center justify-center overflow-hidden hover:border-zinc-300 transition-colors relative"
        >
          {uploading ? (
            <div className="w-5 h-5 rounded-full border-2 border-zinc-300 border-t-zinc-600 animate-spin" />
          ) : preview ? (
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <span className="text-zinc-300 text-xl">+</span>
          )}
        </button>
        {preview && (
          <button
            type="button"
            onClick={() => {
              setPreview("");
              onUploaded("");
            }}
            className="text-[11px] text-red-400 hover:text-red-600 font-medium"
          >
            Remove
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}

/* ── main component ────────────────────────────────────────── */
export default function AdminShopManager({
  initialProducts,
  initialCategories,
}: {
  initialProducts: Product[];
  initialCategories: Category[];
}) {
  const [tab, setTab] = useState<"products" | "categories">("products");
  const [editId, setEditId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const products = initialProducts;
  const categories = initialCategories;
  const inStock = products.filter((p) => p.inStock).length;
  const featured = products.filter((p) => p.featured).length;

  const handleCreate = async (fd: FormData) => {
    if (imageUrl) fd.set("image", imageUrl);
    startTransition(async () => {
      await createProduct(fd);
      setImageUrl("");
      formRef.current?.reset();
    });
  };

  const handleUpdate = async (fd: FormData) => {
    if (editImageUrl) fd.set("image", editImageUrl);
    startTransition(async () => {
      await updateProduct(fd);
      setEditId(null);
      setEditImageUrl("");
    });
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
          Shop Manager
        </h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Add, edit, and remove products and categories.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Products", value: products.length, color: "text-zinc-900" },
          { label: "In Stock", value: inStock, color: "text-green-600" },
          { label: "Out of Stock", value: products.length - inStock, color: "text-red-500" },
          { label: "Featured", value: featured, color: "text-[#c9a84c]" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white border border-zinc-200/80 p-4"
          >
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-zinc-400 mt-1 font-medium uppercase tracking-wider">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-zinc-100 w-fit">
        {[
          { id: "products" as const, label: "Products", icon: "🛍️", count: products.length },
          { id: "categories" as const, label: "Categories", icon: "📂", count: categories.length },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              tab === t.id
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            <span>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                tab === t.id ? "bg-zinc-900 text-white" : "bg-zinc-200 text-zinc-500"
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          TAB: Products
      ═══════════════════════════════════════════════════════ */}
      {tab === "products" && (
        <div className="space-y-6">
          {/* Add Product Form */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 p-4 sm:p-6">
            <h2 className="text-base font-bold text-zinc-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-xs font-black">
                +
              </span>
              Add New Product
            </h2>
            <form ref={formRef} action={handleCreate} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  name="name"
                  required
                  placeholder="Product name *"
                  className="sm:col-span-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c]/30 outline-none transition-all placeholder:text-zinc-300"
                />
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Description"
                  className="sm:col-span-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c]/30 outline-none transition-all placeholder:text-zinc-300 resize-none"
                />
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  placeholder="Price (GH₵) *"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c]/30 outline-none transition-all placeholder:text-zinc-300"
                />
                <select
                  name="categoryId"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c]/30 outline-none transition-all text-zinc-600"
                >
                  <option value="">Select category *</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <ImageUpload
                label="Product Image"
                onUploaded={(url) => setImageUrl(url)}
              />
              <input type="hidden" name="image" value={imageUrl} />

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                  <input
                    type="checkbox"
                    name="inStock"
                    value="true"
                    defaultChecked
                    className="rounded border-zinc-300 accent-green-600"
                  />
                  In Stock
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    value="true"
                    className="rounded border-zinc-300 accent-[#c9a84c]"
                  />
                  Featured
                </label>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-all disabled:opacity-50"
              >
                {isPending ? "Adding..." : "Add Product"}
              </button>
            </form>
          </div>

          {/* Products list — mobile card, desktop table */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
            <div className="px-4 sm:px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-zinc-800 text-sm">All Products</h3>
              <span className="text-xs text-zinc-400">
                {products.length} product{products.length !== 1 ? "s" : ""}
              </span>
            </div>

            {products.length === 0 ? (
              <div className="p-12 text-center text-zinc-300 text-sm">
                No products yet. Create one above!
              </div>
            ) : (
              <>
                {/* ── Desktop table ────────────────────────── */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100 bg-zinc-50/80 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
                        <th className="text-left px-5 py-3">Product</th>
                        <th className="text-left px-5 py-3">Category</th>
                        <th className="text-left px-5 py-3">Price</th>
                        <th className="text-left px-5 py-3">Status</th>
                        <th className="text-left px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {products.map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-zinc-50/50 transition-colors"
                        >
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-zinc-100 overflow-hidden shrink-0 relative">
                                {p.image ? (
                                  <Image
                                    src={p.image}
                                    alt={p.name}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <span className="flex items-center justify-center h-full text-zinc-300 text-sm">
                                    ♟
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-zinc-800 text-sm">
                                  {p.name}
                                </p>
                                {p.description && (
                                  <p className="text-zinc-400 text-[11px] line-clamp-1 max-w-[200px]">
                                    {p.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-medium">
                              {p.category?.name ?? "—"}
                            </span>
                          </td>
                          <td className="px-5 py-3 font-bold text-zinc-900">
                            GH₵ {p.price}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  p.inStock
                                    ? "bg-green-50 text-green-600"
                                    : "bg-red-50 text-red-500"
                                }`}
                              >
                                {p.inStock ? "In Stock" : "Out"}
                              </span>
                              {p.featured && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#c9a84c]/10 text-[#c9a84c]">
                                  ★ Featured
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setEditId(editId === p.id ? null : p.id);
                                  setEditImageUrl(p.image || "");
                                }}
                                className="text-[11px] bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-lg hover:bg-zinc-200 font-medium transition-colors"
                              >
                                {editId === p.id ? "Cancel" : "Edit"}
                              </button>
                              <form action={deleteProduct}>
                                <input type="hidden" name="id" value={p.id} />
                                <button
                                  type="submit"
                                  className="text-[11px] bg-red-50 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-100 font-semibold transition-colors"
                                >
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

                {/* ── Mobile cards ─────────────────────────── */}
                <div className="lg:hidden divide-y divide-zinc-100">
                  {products.map((p) => (
                    <div key={p.id} className="p-4">
                      <div className="flex gap-3">
                        <div className="w-14 h-14 rounded-xl bg-zinc-100 overflow-hidden shrink-0 relative">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex items-center justify-center h-full text-zinc-300 text-lg">
                              ♟
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-zinc-800 text-sm leading-tight">
                                {p.name}
                              </p>
                              <p className="text-[11px] text-zinc-400 mt-0.5">
                                {p.category?.name}
                              </p>
                            </div>
                            <p className="font-black text-zinc-900 text-sm shrink-0">
                              GH₵ {p.price}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                p.inStock
                                  ? "bg-green-50 text-green-600"
                                  : "bg-red-50 text-red-500"
                              }`}
                            >
                              {p.inStock ? "In Stock" : "Out"}
                            </span>
                            {p.featured && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#c9a84c]/10 text-[#c9a84c]">
                                ★ Featured
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => {
                                setEditId(editId === p.id ? null : p.id);
                                setEditImageUrl(p.image || "");
                              }}
                              className="text-[11px] bg-zinc-100 text-zinc-600 px-3 py-1.5 rounded-lg hover:bg-zinc-200 font-medium transition-colors"
                            >
                              {editId === p.id ? "Cancel" : "Edit"}
                            </button>
                            <form action={deleteProduct}>
                              <input type="hidden" name="id" value={p.id} />
                              <button
                                type="submit"
                                className="text-[11px] bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 font-semibold transition-colors"
                              >
                                Delete
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>

                      {/* Inline edit form (mobile) */}
                      {editId === p.id && (
                        <form
                          action={handleUpdate}
                          className="mt-4 p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3"
                        >
                          <input type="hidden" name="id" value={p.id} />
                          <input
                            name="name"
                            defaultValue={p.name}
                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
                          />
                          <textarea
                            name="description"
                            defaultValue={p.description || ""}
                            rows={2}
                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm resize-none"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              name="price"
                              type="number"
                              step="0.01"
                              defaultValue={p.price}
                              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
                            />
                            <select
                              name="categoryId"
                              defaultValue={p.categoryId}
                              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
                            >
                              {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <ImageUpload
                            current={p.image}
                            label="Image"
                            onUploaded={(url) => setEditImageUrl(url)}
                          />
                          <input
                            type="hidden"
                            name="image"
                            value={editImageUrl}
                          />
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm text-zinc-600">
                              <input
                                type="checkbox"
                                name="inStock"
                                value="true"
                                defaultChecked={p.inStock}
                                className="accent-green-600"
                              />
                              In Stock
                            </label>
                            <label className="flex items-center gap-2 text-sm text-zinc-600">
                              <input
                                type="checkbox"
                                name="featured"
                                value="true"
                                defaultChecked={p.featured}
                                className="accent-[#c9a84c]"
                              />
                              Featured
                            </label>
                          </div>
                          <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-2 rounded-lg bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50"
                          >
                            {isPending ? "Saving..." : "Save Changes"}
                          </button>
                        </form>
                      )}
                    </div>
                  ))}
                </div>

                {/* Inline edit row (desktop) — shown below table */}
                {editId && (
                  <div className="hidden lg:block border-t border-zinc-200 bg-zinc-50/50 p-5">
                    {products
                      .filter((p) => p.id === editId)
                      .map((p) => (
                        <form
                          key={p.id}
                          action={handleUpdate}
                          className="space-y-4"
                        >
                          <input type="hidden" name="id" value={p.id} />
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-bold text-zinc-800">
                              Editing: {p.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditId(null)}
                              className="text-xs text-zinc-400 hover:text-zinc-600"
                            >
                              (cancel)
                            </button>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            <input
                              name="name"
                              defaultValue={p.name}
                              className="col-span-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm"
                              placeholder="Product name"
                            />
                            <input
                              name="price"
                              type="number"
                              step="0.01"
                              defaultValue={p.price}
                              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm"
                              placeholder="Price"
                            />
                            <select
                              name="categoryId"
                              defaultValue={p.categoryId}
                              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm"
                            >
                              {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <textarea
                            name="description"
                            defaultValue={p.description || ""}
                            rows={2}
                            placeholder="Description"
                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm resize-none"
                          />
                          <div className="flex items-center gap-6">
                            <ImageUpload
                              current={p.image}
                              label="Product Image"
                              onUploaded={(url) => setEditImageUrl(url)}
                            />
                            <input
                              type="hidden"
                              name="image"
                              value={editImageUrl}
                            />
                            <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                              <input
                                type="checkbox"
                                name="inStock"
                                value="true"
                                defaultChecked={p.inStock}
                                className="accent-green-600"
                              />
                              In Stock
                            </label>
                            <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                              <input
                                type="checkbox"
                                name="featured"
                                value="true"
                                defaultChecked={p.featured}
                                className="accent-[#c9a84c]"
                              />
                              Featured
                            </label>
                            <button
                              type="submit"
                              disabled={isPending}
                              className="ml-auto px-6 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-all"
                            >
                              {isPending ? "Saving..." : "Save Changes"}
                            </button>
                          </div>
                        </form>
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAB: Categories
      ═══════════════════════════════════════════════════════ */}
      {tab === "categories" && (
        <div className="space-y-6">
          {/* Add Category */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 p-4 sm:p-6">
            <h2 className="text-base font-bold text-zinc-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">
                +
              </span>
              Add Category
            </h2>
            <form
              action={createCategory}
              className="flex gap-3 items-end flex-wrap"
            >
              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
                  Name
                </label>
                <input
                  name="name"
                  required
                  placeholder="Category name *"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c]/30 outline-none transition-all placeholder:text-zinc-300"
                />
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
                  Image URL
                </label>
                <input
                  name="image"
                  placeholder="Optional"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c]/30 outline-none transition-all placeholder:text-zinc-300"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-all whitespace-nowrap"
              >
                + Add Category
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden">
            <div className="px-4 sm:px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-zinc-800 text-sm">All Categories</h3>
              <span className="text-xs text-zinc-400">
                {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
              </span>
            </div>
            <div className="p-4 sm:p-5">
              {categories.length === 0 ? (
                <p className="text-zinc-300 text-sm text-center py-8">
                  No categories yet. Add one above.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <form
                      key={c.id}
                      action={deleteCategory}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm font-medium group hover:bg-zinc-100 transition-colors"
                    >
                      <input type="hidden" name="id" value={c.id} />
                      <span>{c.name}</span>
                      <button
                        type="submit"
                        className="text-red-400 hover:text-red-600 font-bold ml-1 text-base leading-none"
                        title="Delete category"
                      >
                        ×
                      </button>
                    </form>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
