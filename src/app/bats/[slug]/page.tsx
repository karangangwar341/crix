import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByCategory, getRelatedProducts, getProductReviews } from "@/lib/dal";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfoPanel from "@/components/product/ProductInfoPanel";
import Configurator from "@/components/product/Configurator";
import Bat360Viewer from "@/components/product/Bat360Viewer";
import SpecViz from "@/components/product/SpecViz";
import Anatomy from "@/components/product/Anatomy";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import { Reveal } from "@/components/ui/Reveal";
import { ProductJsonLd } from "@/components/seo/JsonLd";

export async function generateStaticParams() {
  const bats = await getProductsByCategory("bats");
  return bats.map((b) => ({ slug: b.slug }));
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

export default async function BatDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.category !== "bats") notFound();

  const specs = product.specifications;
  if (!specs) notFound();

  const markers = [
    { id: "willow", label: "Willow", x: "50%", y: "8%", title: `Grade ${specs.willowGrade} ${specs.willow}`, body: "Hand-selected and graded for grain straightness and colour before pressing." },
    { id: "edge", label: "Edge", x: "82%", y: "48%", title: `${specs.edge}mm Edge`, body: "Engineered for controlled power through the hitting zone." },
    { id: "sweetspot", label: "Sweet Spot", x: "50%", y: "55%", title: `${specs.sweetSpot} Sweet Spot`, body: "Positioned to match this bat's intended playing style." },
    { id: "handle", label: "Handle", x: "50%", y: "14%", title: `${specs.handle} Handle`, body: "Cane-sprung construction for shock absorption and feel." },
    { id: "spine", label: "Spine", x: "50%", y: "35%", title: "Pronounced Spine", body: `${specs.spine}mm spine geometry maximises hitting area while maintaining controlled pickup.` },
  ];

  const [related, reviews] = await Promise.all([
    getRelatedProducts(product.id, "bats", 4),
    getProductReviews(product.id),
  ]);

  return (
    <div>
      <ProductJsonLd product={product} />
      <div className="mx-auto max-w-[1600px] px-5 py-10 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <ProductGallery product={product} />
          <div>
            <ProductInfoPanel product={product} />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Configurator product={product} />
          <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
            <p className="mb-1 text-[11px] uppercase tracking-[0.14em] text-ink-faint">Specification</p>
            <h3 className="mb-6 font-display text-2xl">By the numbers.</h3>
            <SpecViz specs={specs} />
          </div>
        </div>
      </div>

      <section className="mt-24 border-y border-line bg-bg-alt">
        <div className="mx-auto max-w-[1600px] px-5 py-16 lg:px-10">
          <Reveal className="mb-8 text-center">
            <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-ink-faint">Explore Every Angle</p>
            <h2 className="font-display text-4xl sm:text-5xl">{product.name}, in full.</h2>
          </Reveal>
          <div className="overflow-hidden rounded-[32px] border border-line bg-white shadow-[var(--shadow-card)]">
            <Bat360Viewer product={product} markers={markers} height="72vh" />
          </div>
        </div>
      </section>

      <Anatomy product={product} />
      <ProductReviews product={product} initialReviews={reviews} />
      <RelatedProducts title="You May Also Like" products={related} />
    </div>
  );
}
