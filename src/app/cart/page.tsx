"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { getProductBySlug } from "@/lib/data/products";
import { ProductVisual } from "@/components/product/ProductVisual";

export default function CartPage() {
  const { lines, removeItem, setQuantity, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[1600px] px-5 py-32 text-center lg:px-10">
        <h1 className="font-display text-3xl">Your bag is empty.</h1>
        <Link href="/bats" className="mt-6 inline-block bg-ink px-6 py-3 text-[13px] font-medium uppercase tracking-[0.06em] text-bg">
          Explore Bats
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 lg:px-10">
      <h1 className="font-display text-4xl">Your Bag</h1>
      <div className="mt-10 divide-y divide-line-soft border-y border-line">
        {lines.map((line) => {
          const product = getProductBySlug(line.slug);
          return (
            <div key={`${line.productId}-${line.variantId}`} className="flex gap-5 py-6">
              <div className="h-32 w-24 flex-shrink-0 bg-bg-alt p-2">{product && <ProductVisual product={product} angle="front" />}</div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-lg">{line.name}</p>
                    <p className="text-sm text-ink-faint">{line.variantLabel}</p>
                  </div>
                  <button onClick={() => removeItem(line.productId, line.variantId)} aria-label="Remove">
                    <X size={16} className="text-ink-faint" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-line">
                    <button className="px-3 py-1.5" onClick={() => setQuantity(line.productId, line.variantId, line.quantity - 1)}>
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm">{line.quantity}</span>
                    <button className="px-3 py-1.5" onClick={() => setQuantity(line.productId, line.variantId, line.quantity + 1)}>
                      <Plus size={13} />
                    </button>
                  </div>
                  <p className="font-medium">{formatPrice(line.price * line.quantity)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-end gap-2">
        <div className="flex w-full max-w-xs items-center justify-between text-sm">
          <span className="text-ink-soft">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal())}</span>
        </div>
        <p className="w-full max-w-xs text-right text-xs text-ink-faint">Shipping and taxes calculated at checkout.</p>
        <Link
          href="/checkout"
          className="mt-3 w-full max-w-xs bg-ink py-3.5 text-center text-[13px] font-medium uppercase tracking-[0.06em] text-bg"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
