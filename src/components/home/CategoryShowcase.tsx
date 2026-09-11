"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import { ProductVisual } from "@/components/product/ProductVisual";
import { Reveal } from "@/components/ui/Reveal";

export default function CategoryShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <Reveal>
        <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-ink-soft">Categories</p>
        <h2 className="font-display text-3xl sm:text-4xl">The full kit.</h2>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {categories.map((cat, i) => {
          const sample = getProductsByCategory(cat.id)[0];
          return (
            <Reveal key={cat.id} delay={i * 0.04}>
              <Link
                href={`/${cat.id}`}
                className="group relative block h-[280px] sm:h-[330px] lg:h-[360px] w-full overflow-hidden rounded-[22px] border border-line bg-neutral-950 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-hover)] hover:border-black"
              >
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                  {sample && <ProductVisual product={sample} angle="front" fillMode="cover" />}
                </div>
                <div className="absolute inset-0 bg-black/25 transition-colors duration-500 group-hover:bg-black/15" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-16 sm:p-6 transition-transform duration-300 group-hover:-translate-y-0.5">
                  <p className="font-display text-xl sm:text-2xl font-semibold text-white leading-tight">{cat.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-white/80 line-clamp-1">
                    {cat.tagline}
                    <ArrowUpRight size={14} className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
