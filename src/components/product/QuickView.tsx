"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X, Star, Check, ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";
import { ProductVisual } from "./ProductVisual";

export default function QuickView({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync variant ID when product changes
  useEffect(() => {
    if (product.variants?.length > 0) {
      setVariantId(product.variants[0].id);
    }
  }, [product]);

  // Lock body scroll and listen for ESC key
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const isBat = product.category === "bats";

  const handleAddToCart = () => {
    if (variant) {
      addItem(product, variant.id, variant.label);
    } else {
      addItem(product, product.id, "Standard");
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 750);
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[26px] border border-white/20 bg-white shadow-2xl md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-3.5 top-3.5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/90 text-ink shadow-sm backdrop-blur transition-all hover:bg-black hover:text-white"
              aria-label="Close quick view"
            >
              <X size={17} />
            </button>

            {/* Left: Product Visual / Image Showcase */}
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-neutral-100 sm:aspect-square md:aspect-auto md:w-1/2 md:min-h-[480px]">
              <ProductVisual product={product} angle="front" preferPhoto={true} fillMode="cover" />

              {/* Product Badges */}
              <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5">
                {product.new && (
                  <span className="rounded-full bg-black/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white shadow-sm backdrop-blur">
                    New Release
                  </span>
                )}
                {product.bestseller && (
                  <span className="rounded-full bg-black/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white shadow-sm backdrop-blur">
                    Bestseller
                  </span>
                )}
              </div>
            </div>

            {/* Right: Product Information & Quick Actions */}
            <div className="flex flex-1 flex-col overflow-y-auto p-6 sm:p-8">
              {/* Category & Series */}
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-ink-soft">
                <span>{product.series ?? product.category.replace("-", " ")}</span>
                <span>•</span>
                <span className="capitalize">{product.subcategory ?? "Signature"}</span>
              </div>

              {/* Title */}
              <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {product.name}
              </h2>

              {/* Rating & Stock Status */}
              <div className="mt-2.5 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 font-semibold text-ink">
                  <Star size={13} fill="#050505" color="#050505" />
                  <span>{product.rating}</span>
                  <span className="text-ink-soft">({product.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-ink">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-ink-faint line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {product.shortDescription || product.description}
              </p>

              {/* Bat Specifications if available */}
              {product.specifications && (
                <div className="mt-5 grid grid-cols-2 gap-2.5 rounded-xl border border-line bg-bg-alt/70 p-3 text-xs">
                  <div>
                    <span className="text-ink-faint uppercase text-[10px] tracking-wider block">Willow</span>
                    <span className="font-semibold text-ink">{product.specifications.willow}</span>
                  </div>
                  <div>
                    <span className="text-ink-faint uppercase text-[10px] tracking-wider block">Balance</span>
                    <span className="font-semibold text-ink">{product.specifications.balance}</span>
                  </div>
                  <div>
                    <span className="text-ink-faint uppercase text-[10px] tracking-wider block">Pickup</span>
                    <span className="font-semibold text-ink">{product.specifications.pickup}</span>
                  </div>
                  <div>
                    <span className="text-ink-faint uppercase text-[10px] tracking-wider block">Profile</span>
                    <span className="font-semibold text-ink">{product.specifications.profile}</span>
                  </div>
                </div>
              )}

              {/* Variants / Options */}
              {product.variants?.length > 1 && (
                <div className="mt-5">
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                    {isBat ? "Select Weight / Handle" : "Select Option"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const selected = variant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setVariantId(v.id)}
                          className={cn(
                            "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                            selected
                              ? "bg-black text-white shadow-sm ring-2 ring-black/20"
                              : "border border-line bg-white text-ink hover:border-black"
                          )}
                        >
                          {v.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={added}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[13px] font-semibold uppercase tracking-[0.08em] transition-all",
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-black text-white hover:bg-neutral-800 shadow-md hover:shadow-lg active:scale-[0.99]"
                  )}
                >
                  {added ? (
                    <>
                      <Check size={16} />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <span>Add to Cart</span>
                  )}
                </button>

                <Link
                  href={`/${product.category}/${product.slug}`}
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-line py-3 text-center text-[12px] font-semibold uppercase tracking-[0.08em] text-ink transition-all hover:bg-neutral-50 hover:border-black"
                >
                  <span>View Full Product Details</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Guarantees */}
              <div className="mt-5 flex items-center justify-between border-t border-line-soft pt-3.5 text-[11px] text-ink-faint">
                <span className="flex items-center gap-1.5">
                  <Truck size={13} /> Fast Dispatch Across India
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} /> 100% Genuine Cricket Gear
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

