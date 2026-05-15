"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MessageCircle, RotateCcw, ShoppingBag, Truck } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  inStock: boolean;
  featured: boolean;
  category: Category | null;
  createdAt: string;
}

function formatPrice(price: number) {
  return `GH\u20b5${price.toFixed(2).replace(/\.00$/, "")}`;
}

function productMessage(product: Product) {
  return `Hi PiChess, I'm interested in: ${product.name} (${formatPrice(product.price)})`;
}

export default function HomeShopSection({ whatsApp }: { whatsApp: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/shop", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (!active) return;
        setProducts(Array.isArray(data.products) ? data.products : []);
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const featuredProducts = useMemo(
    () =>
      products
        .filter((product) => product.inStock && product.featured)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4),
    [products]
  );

  return (
    <section className="py-24 sm:py-32 bg-gray-50 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-[0.25em]">PiChess Store</span>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mt-2 tracking-tight">
              Gear Up for <span className="text-amber-600">Victory.</span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-lg text-base sm:text-lg">
              Premium chess sets, clocks, books, and apparel for every player.
            </p>
          </div>
          <Link href="/shop" className="text-amber-600 text-sm font-bold hover:underline whitespace-nowrap">
            View all products &rarr;
          </Link>
        </AnimatedSection>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-3xl border border-gray-200 bg-white overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="h-3 w-20 rounded-full bg-gray-100" />
                  <div className="h-4 w-3/4 rounded-full bg-gray-100" />
                  <div className="h-5 w-24 rounded-full bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product, index) => (
              <AnimatedSection key={product.id} delay={index * 0.08}>
                <ProductCard product={product} whatsApp={whatsApp} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-12 sm:p-16 text-center">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-amber-500" strokeWidth={1.8} />
              <h3 className="text-xl font-black text-gray-900 mb-2">Featured Products Coming Soon</h3>
              <p className="text-gray-400 text-sm">Browse the full shop for the latest chess gear.</p>
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection delay={0.3} className="mt-12">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              Delivery across Ghana
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp ordering
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Quality guaranteed
            </span>
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              Easy returns
            </span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function ProductCard({ product, whatsApp }: { product: Product; whatsApp: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const price = formatPrice(product.price);

  return (
    <div className="group rounded-3xl border border-gray-200 bg-white overflow-hidden hover:border-amber-500/40 transition-all duration-500 hover-lift h-full flex flex-col hover:shadow-lg">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {product.image && !imageFailed ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-cover img-zoom"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <ShoppingBag className="w-14 h-14 text-gray-300 transition-all duration-500 group-hover:scale-110 group-hover:text-amber-300" />
          </div>
        )}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-400/90 text-black text-[10px] font-bold uppercase tracking-wider">
          Featured
        </span>
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1.5">
          {product.category?.name ?? "Chess"}
        </span>
        <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-amber-600 transition-colors flex-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2 hidden sm:block">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
          <span className="text-lg sm:text-xl font-black text-amber-600">{price}</span>
          <Link
            href={`https://wa.me/${whatsApp}?text=${encodeURIComponent(productMessage(product))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-gray-50 hover:bg-amber-400 hover:text-black text-gray-500 text-[11px] font-bold transition-all border border-gray-200 hover:border-amber-400"
          >
            Order &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
