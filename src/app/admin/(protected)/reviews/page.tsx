import { prisma } from "@/lib/db";
import ReviewsClient, { AdminReviewItem } from "./ReviewsClient";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      product: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const mapped: AdminReviewItem[] = reviews.map((r) => ({
    id: r.id,
    productId: r.productId,
    productName: r.product?.name || r.productId,
    author: r.author,
    rating: r.rating,
    title: r.title,
    body: r.body,
    tags: (() => {
      try {
        return JSON.parse(r.tags || "[]");
      } catch {
        return [];
      }
    })(),
    isSample: r.isSample,
    published: r.published,
    date: new Date(r.createdAt).toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }));

  return <ReviewsClient initialReviews={mapped} />;
}
