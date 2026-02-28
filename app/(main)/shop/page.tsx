import AnimatedSection from "@/components/shared/AnimatedSection";
import prisma from "@/lib/prisma";

export const metadata = { title: "Shop" };

async function getProducts() {
  try {
    return await prisma.product.findMany({
      include: { category: true },
      where: { inStock: true },
      orderBy: { featured: "desc" },
    });
  } catch { return []; }
}

async function getCategories() {
  try { return await prisma.category.findMany(); }
  catch { return []; }
}

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="min-h-screen bg-black pt-20">
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 chess-bg opacity-5 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <AnimatedSection>
            <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest">Gear Up</span>
            <h1 className="text-5xl sm:text-7xl font-black mt-2 mb-4">Shop</h1>
            <p className="text-white/40 text-lg max-w-xl">
              Chess sets, boards, clocks, apparel, and more. Order via WhatsApp.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Category filters */}
          <AnimatedSection>
            <div className="flex flex-wrap gap-2 mb-10">
              <button className="px-4 py-2 rounded-full bg-[#c9a84c] text-black text-sm font-semibold">All</button>
              {categories.map((c) => (
                <button key={c.id} className="px-4 py-2 rounded-full border border-white/15 text-white/60 text-sm hover:border-white/30 hover:text-white transition-all">
                  {c.name}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {products.length === 0 ? (
            <AnimatedSection>
              <div className="rounded-xl border border-white/10 bg-zinc-900 p-16 text-center text-white/30">
                Products coming soon. Check back later.
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((p, i) => (
                <AnimatedSection key={p.id} delay={i * 0.07}>
                  <div className="group rounded-xl border border-white/10 bg-zinc-900 overflow-hidden hover-lift">
                    <div className="aspect-square bg-zinc-800 flex items-center justify-center text-5xl">
                      ♟️
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-white/30 mb-1 uppercase tracking-wide">{p.category.name}</p>
                      <h3 className="font-semibold text-white text-sm mb-2 leading-tight">{p.name}</h3>
                      <p className="font-black text-[#c9a84c] text-lg">GH₵ {p.price.toFixed(2)}</p>
                      <a
                        href={`https://wa.me/233000000000?text=I'd like to order: ${encodeURIComponent(p.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 block text-center text-xs font-semibold py-2 rounded-full bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors"
                      >
                        Order on WhatsApp
                      </a>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
