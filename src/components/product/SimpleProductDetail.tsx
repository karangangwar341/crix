"use client";

import { useState } from "react";
import { Star, Heart, Truck, ShieldCheck } from "lucide-react";
import { Product, Review } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import ProductGallery from "./ProductGallery";
import ProductReviews from "./ProductReviews";
import RelatedProducts from "./RelatedProducts";

export default function SimpleProductDetail({
  product,
  related,
  initialReviews = [],
}: {
  product: Product;
  related: Product[];
  initialReviews?: Review[];
}) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const addItem = useCart((s) => s.addItem);
  const wishlist = useWishlist();
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  return (
    <div>
      <div className="mx-auto max-w-[1600px] px-5 py-10 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="w-full">
            <ProductGallery product={product} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">{product.subcategory ?? product.category.replace("-", " ")}</p>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1">
                <Star size={14} fill="#050505" color="#050505" /> {product.rating}
              </span>
              <span className="text-ink-faint">({product.reviewCount} reviews)</span>
              <span className={product.stock > 0 ? "text-ink" : "text-ink-faint"}>{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
            </div>
            <p className="mt-4 text-2xl font-medium">{formatPrice(product.price)}</p>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">{product.description}</p>

            {product.variants.length > 1 && (
              <div className="mt-6">
                <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.08em]">Option</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVariantId(v.id)}
                      className={`border px-3.5 py-2 text-xs ${variant?.id === v.id ? "border-ink bg-ink text-bg" : "border-line text-ink-soft"}`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => addItem(product, variant.id, variant.label)}
                className="flex-1 bg-ink py-3.5 text-[13px] font-medium uppercase tracking-[0.06em] text-bg"
              >
                Add to Cart
              </button>
              <button
                onClick={() => wishlist.toggle(product.id)}
                aria-label="Toggle wishlist"
                className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center border border-line"
              >
                <Heart size={18} fill={wishlist.has(product.id) ? "#050505" : "none"} color={wishlist.has(product.id) ? "#050505" : "currentColor"} />
              </button>
            </div>

            <div className="mt-5 space-y-2 text-xs text-ink-soft">
              <p className="flex items-center gap-2">
                <Truck size={14} /> Delivery in 2–4 working days
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck size={14} /> 12-month craftsmanship warranty
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProductReviews product={product} initialReviews={initialReviews} />
      <RelatedProducts title="You May Also Like" products={related} />
    </div>
  );
}
