"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { getProductBySlug } from "@/lib/data/products";
import { ProductVisual } from "@/components/product/ProductVisual";

export default function CartDrawer() {
  const { isOpen, close, lines, removeItem, setQuantity, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={close}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-[-24px_0_60px_rgba(0,0,0,0.12)]"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <p className="font-display text-xl">Your Bag ({lines.length})</p>
              <button onClick={close} aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Progress Meter */}
            <div className="border-b border-line bg-stone-50 px-6 py-3">
              {subtotal() >= 2499 ? (
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-800">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">✓</span>
                  <span>You have unlocked Free Express Delivery across India!</span>
                </div>
              ) : (
                <div className="space-y-1.5 text-xs text-ink-soft">
                  <div className="flex justify-between">
                    <span>Free All-India Delivery over ₹2,499</span>
                    <span className="font-semibold text-ink">Add {formatPrice(2499 - subtotal())}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full bg-ink transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal() / 2499) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <p className="text-ink-soft">Your bag is empty.</p>
                  <Link href="/bats" onClick={close} className="text-sm font-medium uppercase tracking-wide underline">
                    Explore Bats
                  </Link>
                </div>
              ) : (
                <ul className="space-y-6">
                  {lines.map((line) => {
                    const product = getProductBySlug(line.slug);
                    const displayProduct = product || ({
                      id: line.productId,
                      slug: line.slug,
                      name: line.name,
                      category: (line.category as any) || "bats",
                      price: line.price,
                      description: "",
                      shortDescription: "",
                      images: [{ angle: "front" as any, seed: line.slug }],
                      variants: [],
                      stock: 10,
                      rating: 5,
                      reviewCount: 0,
                      badges: [],
                      colorway: { willowTone: line.willowTone || "#ead9ad", accent: line.accent || "#8a1f2b" },
                    } as any);
                    return (
                      <li key={`${line.productId}-${line.variantId}`} className="flex gap-4">
                        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-bg-alt">
                          <ProductVisual product={displayProduct} angle="front" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium">{line.name}</p>
                              <p className="text-xs text-ink-faint">{line.variantLabel}</p>
                            </div>
                            <button onClick={() => removeItem(line.productId, line.variantId)} aria-label="Remove item">
                              <X size={14} className="text-ink-faint" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center border border-line">
                              <button
                                className="px-2 py-1"
                                onClick={() => setQuantity(line.productId, line.variantId, line.quantity - 1)}
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-6 text-center text-xs">{line.quantity}</span>
                              <button
                                className="px-2 py-1"
                                onClick={() => setQuantity(line.productId, line.variantId, line.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <p className="text-sm font-medium">{formatPrice(line.price * line.quantity)}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-line px-6 py-5">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-ink-soft">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal())}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/cart"
                    onClick={close}
                    className="border border-ink py-3 text-center text-[13px] font-medium uppercase tracking-[0.06em]"
                  >
                    View Bag
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="bg-ink py-3 text-center text-[13px] font-medium uppercase tracking-[0.06em] text-bg"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
