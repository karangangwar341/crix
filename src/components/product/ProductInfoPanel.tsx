"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, Truck, ShieldCheck, Ruler, X, Check, Flame } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";

export default function ProductInfoPanel({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[Math.floor(product.variants.length / 2)]?.id);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const wishlist = useWishlist();
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const specs = product.specifications;

  const handleAddToCart = () => {
    addItem(product, variant.id, variant.label);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      {product.series && <p className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">{product.series}</p>}
      <h1 className="mt-1 font-display text-3xl sm:text-4xl">{product.name}</h1>

      <div className="mt-3 flex items-center gap-3 text-sm">
        <span className="flex items-center gap-1 font-medium">
          <Star size={14} fill="#050505" color="#050505" /> {product.rating}
        </span>
        <span className="text-ink-faint">({product.reviewCount} reviews)</span>
        <span className="text-line">•</span>
        {product.stock > 0 && product.stock <= 4 ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-neutral-900 bg-stone-100 px-2 py-0.5 rounded-md">
            <Flame size={12} className="text-black" /> Only {product.stock} left
          </span>
        ) : (
          <span className={product.stock > 0 ? "text-ink font-medium" : "text-ink-faint"}>
            {product.stock > 0 ? "In Stock" : "Backorder Available"}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <p className="text-2xl font-medium">{formatPrice(product.price)}</p>
        {product.compareAtPrice && <p className="text-base text-ink-faint line-through">{formatPrice(product.compareAtPrice)}</p>}
      </div>

      <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">{product.description}</p>

      {specs && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[12px] font-medium uppercase tracking-[0.08em]">Weight</p>
            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              className="flex items-center gap-1 text-xs font-medium text-ink underline hover:opacity-75"
            >
              <Ruler size={13} /> Sizing & Fit Guide
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariantId(v.id)}
                className={`border px-3.5 py-2 text-xs transition-colors rounded-xl ${
                  variant?.id === v.id ? "border-ink bg-ink text-bg font-semibold" : "border-line text-ink-soft hover:border-ink"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={variant?.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-4 grid grid-cols-3 gap-3 border-y border-line-soft py-4 text-xs"
            >
              <div>
                <p className="text-ink-faint">Selected Weight</p>
                <p className="font-medium mt-0.5">{variant?.label}</p>
              </div>
              <div>
                <p className="text-ink-faint">Profile Balance</p>
                <p className="font-medium mt-0.5">{specs.balance}</p>
              </div>
              <div>
                <p className="text-ink-faint">Pickup Response</p>
                <p className="font-medium mt-0.5">{specs.pickup}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Sizing & Fit Guide Modal Dialog */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="absolute right-5 top-5 text-ink-faint hover:text-ink"
            >
              <X size={20} />
            </button>

            <h3 className="font-display text-2xl font-medium text-ink">Cricket Bat Sizing Guide</h3>
            <p className="mt-1 text-xs text-ink-soft">
              Select the optimal blade size and weight pickup based on your stature and batting role.
            </p>

            <div className="mt-6 space-y-4 text-xs">
              <div className="overflow-hidden rounded-2xl border border-line">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b border-line text-[11px] uppercase tracking-wider text-ink-faint">
                    <tr>
                      <th className="p-3">Player Height</th>
                      <th className="p-3">Recommended Bat</th>
                      <th className="p-3">Blade Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-soft text-ink">
                    <tr>
                      <td className="p-3">5&apos;8&quot; – 6&apos;2&quot;</td>
                      <td className="p-3 font-semibold">Short Handle (SH)</td>
                      <td className="p-3">33.5 in / 85 cm</td>
                    </tr>
                    <tr>
                      <td className="p-3">6&apos;2&quot; and taller</td>
                      <td className="p-3 font-semibold">Long Handle (LH)</td>
                      <td className="p-3">34.25 in / 87 cm</td>
                    </tr>
                    <tr>
                      <td className="p-3">5&apos;5&quot; – 5&apos;8&quot;</td>
                      <td className="p-3 font-semibold">Harrow</td>
                      <td className="p-3">32.7 in / 83 cm</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 space-y-2 text-ink-soft">
                <p className="font-semibold text-ink text-xs">Pickup & Weight Guide:</p>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  <li><strong className="text-ink">2.7 – 2.9 lb (Light):</strong> Ideal for wristy strokeplay, fast bat-speed, and aggressive back-foot cuts.</li>
                  <li><strong className="text-ink">2.10 – 2.11 lb (Balanced):</strong> Perfect middle ground for all-round power and driving through extra cover.</li>
                  <li><strong className="text-ink">2.12+ lb (Power):</strong> Pronounced spine and thick 40mm+ edges for maximum power hitting.</li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSizeGuideOpen(false)}
              className="mt-6 w-full rounded-xl bg-ink py-2.5 text-xs font-semibold uppercase tracking-wider text-bg hover:opacity-90"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleAddToCart}
          className="flex-1 rounded-xl bg-ink py-3.5 text-[13px] font-medium uppercase tracking-[0.06em] text-bg hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          {added ? (
            <>
              <Check size={16} />
              <span>Added to Bag</span>
            </>
          ) : (
            <span>Add to Cart</span>
          )}
        </button>
        <button
          onClick={() => wishlist.toggle(product.id)}
          aria-label="Toggle wishlist"
          className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-xl border border-line hover:border-ink transition-colors"
        >
          <Heart size={18} fill={wishlist.has(product.id) ? "#050505" : "none"} color={wishlist.has(product.id) ? "#050505" : "currentColor"} />
        </button>
      </div>

      <div className="mt-5 space-y-2 text-xs text-ink-soft">
        <p className="flex items-center gap-2">
          <Truck size={14} /> Free delivery across India over ₹2,499 (2–4 working days)
        </p>
        <p className="flex items-center gap-2">
          <ShieldCheck size={14} /> 12-month craftsmanship guarantee & warranty
        </p>
      </div>
    </div>
  );
}
