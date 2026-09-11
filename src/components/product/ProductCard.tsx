"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Star, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { useWishlist } from "@/lib/store/wishlist";
import { useCompare } from "@/lib/store/compare";
import { ProductVisual } from "./ProductVisual";
import QuickView from "./QuickView";

export default function ProductCard({ product }: { product: Product }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const wishlist = useWishlist();
  const compare = useCompare();
  const isBat = product.category === "bats";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="group relative flex flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-hover)]"
    >
      {/* Product Image Area - Fills ~2/3 of the card with edge-to-edge coverage */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f3f4f6]">
        <Link href={`/${product.category}/${product.slug}`} className="absolute inset-0 block">
          <div className="relative h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
            <ProductVisual
              product={product}
              angle="front"
              preferPhoto={true}
              fillMode="cover"
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {product.badges.map((b) => (
            <span key={b} className="rounded-full bg-black/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur">
              {b}
            </span>
          ))}
          {product.new && (
            <span className="rounded-full bg-black/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            wishlist.toggle(product.id);
          }}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-[var(--shadow-sm)] backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-white"
        >
          <motion.span whileTap={{ scale: 1.3 }}>
            <Heart
              size={15}
              fill={wishlist.has(product.id) ? "#050505" : "none"}
              color="#050505"
            />
          </motion.span>
        </button>

        {/* Hover Quick Actions */}
        <div className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickViewOpen(true);
            }}
            className="rounded-full bg-white/95 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink shadow-[var(--shadow-sm)] backdrop-blur transition-colors hover:bg-black hover:text-white"
          >
            Quick View
          </button>
          {isBat && (
            <button
              onClick={(e) => {
                e.preventDefault();
                compare.toggle(product.id);
              }}
              className={cn(
                "rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] shadow-[var(--shadow-sm)] backdrop-blur transition-colors",
                compare.has(product.id)
                  ? "bg-black text-white"
                  : "bg-white/95 text-ink hover:bg-black hover:text-white"
              )}
            >
              {compare.has(product.id) ? "Added" : "Compare"}
            </button>
          )}
        </div>
      </div>

      {/* Info Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.1em] text-ink-faint">
            <span>{product.series ?? product.category.replace("-", " ")}</span>
            <span className="flex items-center gap-1 font-medium text-ink">
              <Star size={11} fill="#050505" color="#050505" />
              {product.rating}
              <span className="text-ink-faint">({product.reviewCount})</span>
            </span>
          </div>

          <h3 className="mt-1.5 font-display text-lg tracking-tight group-hover:text-ink">
            <Link href={`/${product.category}/${product.slug}`} className="hover:underline">
              {product.name}
            </Link>
          </h3>

          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-ink">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-ink-faint line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <Link
            href={`/${product.category}/${product.slug}`}
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.06em] text-ink transition-transform group-hover:translate-x-0.5"
          >
            <span>Explore</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      <QuickView product={product} open={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
    </motion.div>
  );
}
