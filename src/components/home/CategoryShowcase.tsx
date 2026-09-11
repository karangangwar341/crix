"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import { ProductVisual } from "@/components/product/ProductVisual";
import { Reveal } from "@/components/ui/Reveal";

export default function CategoryShowcase() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10">
      <Reveal>
        <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">Categories</p>
        <h2 className="font-display text-4xl sm:text-5xl">The full kit.</h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => {
          const sample = getProductsByCategory(cat.id)[0];
          return (
            <Reveal key={cat.id} delay={i * 0.05}>
              <Link
                href={`/${cat.id}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-[28px] border border-line bg-bg-alt shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-hover)]"
              >
                <div className="absolute inset-0 p-10 transition-transform duration-700 ease-out group-hover:scale-105">
                  {sample && <ProductVisual product={sample} angle="front" />}
                </div>
                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-6 pt-16 transition-transform duration-500 group-hover:-translate-y-1">
                  <p className="font-display text-2xl text-white">{cat.name}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
                    {cat.tagline}
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
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
