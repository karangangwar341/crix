import { searchProducts } from "@/lib/dal";
import ProductCard from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { Search } from "lucide-react";

export const metadata = {
  title: "Search Results — CRIX Cricket",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const products = q.trim() ? await searchProducts(q.trim()) : [];

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-14 lg:px-10 min-h-[65vh]">
      <Reveal className="mb-10 max-w-2xl">
        <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">Search</p>
        <h1 className="font-display text-4xl sm:text-5xl">
          {q ? `Results for “${q}”` : "Search Equipment"}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          {products.length} {products.length === 1 ? "match found" : "matches found"} in our catalog.
        </p>
      </Reveal>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <Search size={36} className="mx-auto text-ink-faint mb-3" />
          <h2 className="font-display text-xl">
            {q ? (
              <>No equipment found matching &ldquo;{q}&rdquo;</>
            ) : (
              <>Enter a search term to find equipment</>
            )}
          </h2>
          <p className="mt-2 text-sm text-ink-soft max-w-md mx-auto">
            Try searching for terms like &ldquo;English Willow&rdquo;, &ldquo;Titan Pro&rdquo;, &ldquo;Pads&rdquo;, &ldquo;Gloves&rdquo;, or browse our collections.
          </p>
        </div>
      )}
    </div>
  );
}
