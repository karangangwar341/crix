import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByCategory, getRelatedProducts } from "@/lib/dal";
import SimpleProductDetail from "@/components/product/SimpleProductDetail";

export async function generateStaticParams() {
  const products = await getProductsByCategory("bags");
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — CRIX Cricket`,
    description: product.description,
    openGraph: {
      title: `${product.name} — CRIX Cricket`,
      description: product.description,
    }
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.category !== "bags") notFound();
  
  const related = await getRelatedProducts(product.id, "bags", 4);
  return <SimpleProductDetail product={product} related={related} />;
}
