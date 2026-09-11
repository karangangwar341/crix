import { Product } from "@/lib/types";

export function ProductJsonLd({ product }: { product: Product }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.shortDescription,
    image: product.images?.map((img: any) => img.url || `https://crixcricket.com/images/${product.slug}.jpg`) || [],
    brand: {
      "@type": "Brand",
      name: "CRIX Cricket",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://crixcricket.com/${product.category}/${product.slug}`,
    },
    aggregateRating:
      product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CRIX Cricket & Sports",
    url: "https://crixcricket.com",
    logo: "https://crixcricket.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+44 20 7946 0912",
      contactType: "customer service",
      areaServed: ["GB", "IN", "AU", "US"],
      availableLanguage: "en",
    },
    sameAs: [
      "https://instagram.com/crixcricket",
      "https://facebook.com/crixcricket",
      "https://youtube.com/@crixcricket",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
