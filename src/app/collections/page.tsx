import { getProducts, getNewProducts, getBestsellerProducts, getFeaturedProducts } from "@/lib/dal";
import ProductCard from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { Product } from "@/lib/types";

export default async function CollectionsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const params = await searchParams;
  const filter = typeof params.filter === "string" ? params.filter : undefined;

  let products: Product[] = [];
  let title = "Collections";

  if (filter === "new") {
    products = await getNewProducts();
    title = "New Arrivals";
  } else if (filter === "bestsellers") {
    products = await getBestsellerProducts();
    title = "Bestsellers";
  } else {
    const featured = await getFeaturedProducts();
    const bestsellers = await getBestsellerProducts();
    const combined = [...featured, ...bestsellers];
    const uniqueIds = new Set();
    products = combined.filter((p) => {
      if (uniqueIds.has(p.id)) return false;
      uniqueIds.add(p.id);
      return true;
    });
  }

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-14 lg:px-10">
      <Reveal className="mb-12 max-w-2xl">
        <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">Collections</p>
        <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
      </Reveal>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
