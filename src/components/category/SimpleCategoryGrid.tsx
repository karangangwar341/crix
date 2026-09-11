"use client";

import { useMemo, useState } from "react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";

const SORTS = ["Featured", "Best Selling", "Price Low → High", "Price High → Low"] as const;

export default function SimpleCategoryGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Featured");

  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "Best Selling":
        return list.sort((a, b) => Number(b.bestseller) - Number(a.bestseller) || b.rating - a.rating);
      case "Price Low → High":
        return list.sort((a, b) => a.price - b.price);
      case "Price High → Low":
        return list.sort((a, b) => b.price - a.price);
      default:
        return list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
  }, [products, sort]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-ink-soft">{sorted.length} products</p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
          className="border border-line bg-transparent px-3 py-2 text-xs uppercase"
        >
          {SORTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {sorted.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
