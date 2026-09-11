import { getCategoryById, getProductsByCategory } from "@/lib/dal";
import CategoryHero from "@/components/category/CategoryHero";
import SimpleCategoryGrid from "@/components/category/SimpleCategoryGrid";
import { notFound } from "next/navigation";

export const metadata = { title: "Kit Bags — CRIX" };

export default async function Page() {
  const category = await getCategoryById("bags");
  const products = await getProductsByCategory("bags");
  
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-14 lg:px-10">
      <CategoryHero category={category} />
      <SimpleCategoryGrid products={products} />
    </div>
  );
}
