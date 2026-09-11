"use client";

import Link from "next/link";
import { useWishlist } from "@/lib/store/wishlist";
import { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";

export default function WishlistClient({ products }: { products: Product[] }) {
  const { ids, clear } = useWishlist();
  const wishlistProducts = products.filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-14 lg:px-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl">Wishlist</h1>
          <p className="mt-1 text-xs text-ink-soft">
            {wishlistProducts.length} saved {wishlistProducts.length === 1 ? "item" : "items"}
          </p>
        </div>
        {wishlistProducts.length > 0 && (
          <button
            onClick={clear}
            className="text-xs font-semibold uppercase tracking-wider text-ink-faint hover:text-ink underline"
          >
            Clear All
          </button>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-ink-soft">Nothing saved in your wishlist yet.</p>
          <Link
            href="/bats"
            className="mt-6 inline-block bg-ink px-6 py-3 text-[13px] font-medium uppercase tracking-[0.06em] text-bg hover:opacity-90"
          >
            Explore Bats
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {wishlistProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
