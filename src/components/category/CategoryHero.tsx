import { CategoryDef } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

export default function CategoryHero({ category }: { category: CategoryDef }) {
  return (
    <Reveal className="mb-12 max-w-2xl">
      <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">{category.name}</p>
      <h1 className="font-display text-4xl sm:text-5xl">{category.tagline}</h1>
      <p className="mt-4 text-sm text-ink-soft">{category.description}</p>
    </Reveal>
  );
}
