"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import { ProductVisual } from "@/components/product/ProductVisual";
import { Reveal } from "@/components/ui/Reveal";

export default function CategoryShowcase() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10">
      <Reveal>
        <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-ink-soft">Categories</p>
        <h2 className="font-display text-3xl sm:text-4xl">The full kit.</h2>
      </Reveal>

      <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
        {categories.map((cat, i) => {
          const sample = getProductsByCategory(cat.id)[0];
          return (
            <Reveal key={cat.id} delay={i * 0.04}>
              <Link
                href={`/${cat.id}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-line bg-neutral-900 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-hover)] hover:border-black"
              >
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                  {sample && <ProductVisual product={sample} angle="front" fillMode="cover" />}
                </div>
                <div className="absolute inset-0 bg-black/15 transition-colors duration-500 group-hover:bg-black/5" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3.5 pt-14 transition-transform duration-300 group-hover:-translate-y-0.5">
                  <p className="font-display text-base sm:text-lg font-semibold text-white leading-tight">{cat.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/80 line-clamp-1">
                    {cat.tagline}
                    <ArrowUpRight size={12} className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
