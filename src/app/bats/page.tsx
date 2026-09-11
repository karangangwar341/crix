import { Suspense } from "react";
import { getProductsByCategory } from "@/lib/dal";
import BatsFilterGrid from "@/components/category/BatsFilterGrid";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = { title: "Bat Collection — CRIX" };

export default async function BatsPage() {
  const bats = await getProductsByCategory("bats");

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-14 lg:px-10">
      <Reveal className="mb-12 max-w-2xl">
        <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">Bat Collection</p>
        <h1 className="font-display text-4xl sm:text-5xl">Engineered for every style of play.</h1>
      </Reveal>
      <Suspense fallback={<div className="py-20 text-center text-xs text-ink-faint">Loading collection...</div>}>
        <BatsFilterGrid products={bats} />
      </Suspense>
    </div>
  );
}
