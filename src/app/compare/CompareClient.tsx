"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useCompare } from "@/lib/store/compare";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { ProductVisual } from "@/components/product/ProductVisual";

const ROWS: { label: string; get: (b: Product) => string }[] = [
  { label: "Price", get: (b) => formatPrice(b.price) },
  { label: "Willow", get: (b) => b.specifications?.willow ?? "—" },
  { label: "Weight", get: (b) => b.specifications?.weight ?? "—" },
  { label: "Edge", get: (b) => b.specifications?.edge ? `${b.specifications.edge}mm` : "—" },
  { label: "Spine", get: (b) => b.specifications?.spine ? `${b.specifications.spine}mm` : "—" },
  { label: "Sweet Spot", get: (b) => b.specifications?.sweetSpot ?? "—" },
  { label: "Pickup", get: (b) => b.specifications?.pickup ?? "—" },
  { label: "Balance", get: (b) => b.specifications?.balance ?? "—" },
  { label: "Profile", get: (b) => b.specifications?.profile ?? "—" },
  { label: "Handle", get: (b) => b.specifications?.handle ?? "—" },
  { label: "Recommended For", get: (b) => b.specifications?.experience?.join(", ") ?? "—" },
];

export default function CompareClient({ bats }: { bats: Product[] }) {
  const { ids, toggle, clear } = useCompare();
  const products = ids.map((id) => bats.find((b) => b.id === id)).filter(Boolean) as Product[];

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-14 lg:px-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-ink-faint">
            Engineering Benchmarks
          </p>
          <h1 className="font-display text-4xl sm:text-5xl">Compare Bats.</h1>
        </div>
        {products.length > 0 && (
          <button onClick={clear} className="text-xs uppercase text-ink-faint underline hover:text-ink">
            Clear all
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-ink-soft">Add up to 3 bats from the collection to compare their specifications side-by-side.</p>
          <Link
            href="/bats"
            className="mt-6 inline-block bg-ink px-6 py-3 text-[13px] font-medium uppercase tracking-[0.06em] text-bg hover:opacity-90"
          >
            Browse Bats
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="w-40" />
                {products.map((p) => (
                  <th key={p.id} className="border-b border-line px-4 pb-4 text-left align-bottom">
                    <div className="relative h-32 w-24 bg-bg-alt p-3 rounded-xl overflow-hidden">
                      <ProductVisual product={p} angle="front" />
                      <button
                        onClick={() => toggle(p.id)}
                        aria-label={`Remove ${p.name} from comparison`}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <p className="mt-2 font-display text-lg">{p.name}</p>
                    <p className="text-xs text-ink-faint">{p.series}</p>
                    <Link
                      href={`/bats/${p.slug}`}
                      className="mt-1 inline-block text-xs font-semibold text-ink underline"
                    >
                      View Bat →
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft text-sm">
              {ROWS.map((r) => (
                <tr key={r.label}>
                  <td className="py-3 text-xs uppercase tracking-wider text-ink-faint">{r.label}</td>
                  {products.map((p) => (
                    <td key={p.id} className="px-4 py-3 font-medium">
                      {r.get(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
