"use client";

import Link from "next/link";
import { Star, ArrowUpRight } from "lucide-react";
import { allProducts } from "@/lib/data/products";
import { homepage } from "@/lib/data/homepage";
import { formatPrice } from "@/lib/utils";
import Bat360Viewer from "@/components/product/Bat360Viewer";
import { Reveal } from "@/components/ui/Reveal";

export default function BestsellerViewer() {
  const bestseller = allProducts.find((p) => p.id === homepage.bestsellerProductId)!;

  return (
    <section className="border-y border-line bg-bg-alt">
      <div className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10">
        <Reveal className="mb-8 text-center">
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-gold">The Icon</p>
          <h2 className="font-display text-4xl sm:text-5xl">{bestseller.name}</h2>
        </Reveal>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-[32px] border border-line bg-white shadow-[var(--shadow-card)]">
            <Bat360Viewer product={bestseller} height="64vh" />
          </div>

          <Reveal delay={0.15} className="lg:pl-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">{bestseller.series}</p>
            <h3 className="mt-1 font-display text-3xl">{bestseller.name}</h3>
            <p className="mt-2 text-sm text-ink-soft">
              {bestseller.specifications?.willow} · Grade {bestseller.specifications?.willowGrade}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <p className="text-2xl font-medium">{formatPrice(bestseller.price)}</p>
              <span className="flex items-center gap-1 text-sm text-ink-soft">
                <Star size={13} fill="#050505" color="#050505" /> {bestseller.rating}
              </span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-ink-soft">{bestseller.shortDescription}</p>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-xs">
              <div>
                <dt className="text-ink-faint">Balance</dt>
                <dd className="font-medium">{bestseller.specifications?.balance}</dd>
              </div>
              <div>
                <dt className="text-ink-faint">Pickup</dt>
                <dd className="font-medium">{bestseller.specifications?.pickup}</dd>
              </div>
              <div>
                <dt className="text-ink-faint">Edge</dt>
                <dd className="font-medium">{bestseller.specifications?.edge}mm</dd>
              </div>
              <div>
                <dt className="text-ink-faint">Sweet Spot</dt>
                <dd className="font-medium">{bestseller.specifications?.sweetSpot}</dd>
              </div>
            </dl>

            <Link
              href={`/bats/${bestseller.slug}`}
              className="mt-7 inline-flex items-center gap-2 border-b border-ink pb-1 text-[13px] font-medium uppercase tracking-[0.06em]"
            >
              View Product <ArrowUpRight size={14} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
