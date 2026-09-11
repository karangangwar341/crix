"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X, Star } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";
import { ProductVisual } from "./ProductVisual";

export default function QuickView({ product, open, onClose }: { product: Product; open: boolean; onClose: () => void }) {
  const [variantId, setVariantId] = useState(product.variants[Math.floor(product.variants.length / 2)]?.id);
  const addItem = useCart((s) => s.addItem);

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 z-[56] w-[92%] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-hover)]"
          >
            <button onClick={onClose} className="absolute right-4 top-4 z-10" aria-label="Close quick view">
              <X size={20} />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="relative aspect-square w-full overflow-hidden bg-bg-alt">
                <ProductVisual product={product} angle="front" preferPhoto={true} fillMode="cover" />
              </div>
              <div className="flex flex-col p-8">
                {product.series && <p className="text-[11px] uppercase tracking-[0.1em] text-ink-faint">{product.series}</p>}
                <h3 className="mt-1 font-display text-2xl">{product.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Star size={13} fill="#050505" color="#050505" /> {product.rating}
                  </span>
                  <span className="text-ink-faint">({product.reviewCount} reviews)</span>
                </div>
                <p className="mt-2 text-xl font-medium">{formatPrice(product.price)}</p>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">{product.shortDescription}</p>

                {product.specifications && (
                  <div className="mt-5 grid grid-cols-2 gap-3 border-y border-line-soft py-4 text-xs">
                    <div>
                      <p className="text-ink-faint">Willow</p>
                      <p className="font-medium">{product.specifications.willow}</p>
                    </div>
                    <div>
                      <p className="text-ink-faint">Balance</p>
                      <p className="font-medium">{product.specifications.balance}</p>
                    </div>
                    <div>
                      <p className="text-ink-faint">Pickup</p>
                      <p className="font-medium">{product.specifications.pickup}</p>
                    </div>
                    <div>
                      <p className="text-ink-faint">Profile</p>
                      <p className="font-medium">{product.specifications.profile}</p>
                    </div>
                  </div>
                )}

                <div className="mt-5">
                  <p className="mb-2 text-[11px] uppercase tracking-[0.1em] text-ink-faint">
                    {product.category === "bats" ? "Weight" : "Option"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setVariantId(v.id)}
                        className={`border px-3 py-1.5 text-xs ${
                          variant?.id === v.id ? "border-ink bg-ink text-bg" : "border-line text-ink-soft"
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-2 pt-6">
                  <button
                    onClick={() => {
                      addItem(product, variant.id, variant.label);
                      onClose();
                    }}
                    className="bg-ink py-3 text-[13px] font-medium uppercase tracking-[0.06em] text-bg"
                  >
                    Add to Cart
                  </button>
                  <Link
                    href={`/${product.category}/${product.slug}`}
                    onClick={onClose}
                    className="border border-ink py-3 text-center text-[13px] font-medium uppercase tracking-[0.06em]"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
