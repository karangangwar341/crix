import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import { Reveal } from "@/components/ui/Reveal";

export default function RelatedProducts({ title, products }: { title: string; products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10">
      <Reveal className="mb-10">
        <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
