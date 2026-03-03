/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import AdminShopManager from "@/components/admin/AdminShopManager";

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
    return { products: JSON.parse(JSON.stringify(products)), categories: JSON.parse(JSON.stringify(categories)) };
  } catch { return { products: [], categories: [] }; }
}

export default async function AdminShopPage() {
  const { products, categories } = await getData();
  return <AdminShopManager initialProducts={products} initialCategories={categories} />;
}
