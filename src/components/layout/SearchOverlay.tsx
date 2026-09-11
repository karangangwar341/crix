"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Search } from "lucide-react";
import { useUIStore } from "@/lib/store/ui";
import { allProducts } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { formatPrice } from "@/lib/utils";
import { ProductVisual } from "@/components/product/ProductVisual";

const RECENT = ["Pro Elite X", "Batting gloves", "Kashmir willow"];
const POPULAR = ["Pro Elite X", "Vanguard Pro", "Titan Pro Helmet", "Pro Wheelie Kit Bag"];

export default function SearchOverlay() {
  const { searchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery("");
  }, [searchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allProducts.filter((p) => p.name.toLowerCase().includes(q) || p.series?.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      closeSearch();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex flex-col bg-bg"
        >
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 pt-24">
            <div className="flex items-center gap-4 border-b border-ink pb-4">
              <Search size={20} className="text-ink-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search bats, gloves, gear… (Press Enter)"
                className="flex-1 bg-transparent font-display text-2xl outline-none placeholder:text-ink-faint"
              />
              <button onClick={closeSearch} aria-label="Close search">
                <X size={22} />
              </button>
            </div>

            <div className="mt-8 flex-1 overflow-y-auto pb-16">
              {query.trim() ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                      {results.length} result{results.length !== 1 ? "s" : ""}
                    </p>
                    <button
                      onClick={() => {
                        closeSearch();
                        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                      }}
                      className="text-xs font-semibold text-ink underline"
                    >
                      View All Results →
                    </button>
                  </div>
                  {results.map((p) => (
                    <Link
                      key={p.id}
                      href={`/${p.category}/${p.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-4 border-b border-line-soft py-3 hover:bg-stone-50/50 px-2 rounded-xl transition-colors"
                    >
                      <div className="h-16 w-14 flex-shrink-0 bg-bg-alt rounded-lg overflow-hidden">
                        <ProductVisual product={p} angle="front" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-ink-faint">{p.series}</p>
                      </div>
                      <p className="text-sm font-medium">{formatPrice(p.price)}</p>
                    </Link>
                  ))}
                  {results.length === 0 && <p className="text-ink-soft">No results for &ldquo;{query}&rdquo;.</p>}
                </div>
              ) : (
                <div className="grid gap-10 sm:grid-cols-3">
                  <div>
                    <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-ink-faint">Recent</p>
                    <ul className="space-y-2 text-sm text-ink-soft">
                      {RECENT.map((r) => (
                        <li key={r}>
                          <button onClick={() => setQuery(r)} className="hover:text-ink">
                            {r}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-ink-faint">Popular</p>
                    <ul className="space-y-2 text-sm text-ink-soft">
                      {POPULAR.map((r) => (
                        <li key={r}>
                          <button onClick={() => setQuery(r)} className="hover:text-ink">
                            {r}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-ink-faint">Categories</p>
                    <ul className="space-y-2 text-sm text-ink-soft">
                      {categories.map((c) => (
                        <li key={c.id}>
                          <Link href={`/${c.id}`} onClick={closeSearch} className="hover:text-ink">
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
