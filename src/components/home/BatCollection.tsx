import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { bats } from "@/lib/data/products";
import ProductCard from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";

export default function BatCollection() {
  const featured = bats.filter((b) => b.featured || b.bestseller).slice(0, 4);
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10">
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">Bat Collection</p>
          <h2 className="font-display text-4xl sm:text-5xl">Engineered for every style.</h2>
        </div>
        <Link href="/bats" className="flex items-center gap-1 text-[13px] font-medium uppercase tracking-[0.06em]">
          Shop All Bats <ArrowUpRight size={14} />
        </Link>
      </Reveal>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((b, i) => (
          <Reveal key={b.id} delay={i * 0.06}>
            <ProductCard product={b} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
