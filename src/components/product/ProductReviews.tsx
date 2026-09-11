"use client";

import { useMemo, useState } from "react";
import { Star, BadgeCheck, PenLine, X, CheckCircle2 } from "lucide-react";
import { Product, Review } from "@/lib/types";
import { generateReviews } from "@/lib/data/reviews";
import { Reveal } from "@/components/ui/Reveal";
import { submitProductReview } from "@/app/actions/storefront";

const FILTERS = ["All", "Performance", "Pickup", "Balance", "Looks"] as const;

export default function ProductReviews({ product }: { product: Product }) {
  const initialReviews = useMemo(
    () => generateReviews(product.id, Math.min(12, product.reviewCount || 8), product.rating),
    [product]
  );
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [writeModalOpen, setWriteModalOpen] = useState(false);

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Performance"]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filtered =
    filter === "All"
      ? reviewsList
      : reviewsList.filter((r) => r.tags.includes(filter as Review["tags"][number]));

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviewsList.filter((r) => r.rating === star).length,
  }));

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const res = await submitProductReview({
      productId: product.id,
      author,
      rating,
      title,
      body,
      tags: selectedTags,
    });

    setSubmitting(false);

    if (res?.error) {
      setSubmitError(res.error);
      return;
    }

    // Add submitted review to local view
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      author,
      verified: true,
      rating,
      title,
      body,
      tags: selectedTags as any,
      date: new Date().toISOString(),
    };

    setReviewsList([newRev, ...reviewsList]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setWriteModalOpen(false);
      setAuthor("");
      setTitle("");
      setBody("");
    }, 2500);
  }

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10">
      <Reveal className="mb-10 text-center">
        <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-ink-faint">Reviews</p>
        <h2 className="font-display text-4xl sm:text-5xl">{product.rating} out of 5</h2>
        <p className="mt-2 text-sm text-ink-soft">Based on {reviewsList.length} reviews</p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setWriteModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-wider text-bg transition-all hover:opacity-90 shadow-sm"
          >
            <PenLine size={15} />
            <span>Write a Review</span>
          </button>
        </div>
      </Reveal>

      {/* Write a Review Modal Dialog */}
      {writeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setWriteModalOpen(false)}
              className="absolute right-5 top-5 text-ink-faint hover:text-ink"
            >
              <X size={20} />
            </button>

            <h3 className="font-display text-2xl font-medium text-ink">Review {product.name}</h3>
            <p className="mt-1 text-xs text-ink-soft">
              Share your on-pitch experience with fellow players.
            </p>

            {submitSuccess ? (
              <div className="mt-8 py-8 text-center">
                <CheckCircle2 size={40} className="mx-auto text-ink" />
                <h4 className="mt-4 font-display text-xl font-medium">Review Submitted</h4>
                <p className="mt-2 text-xs text-ink-soft">
                  Thank you for your feedback. Your review is now live.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4">
                {submitError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    {submitError}
                  </div>
                )}

                {/* Star Picker */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-faint mb-1.5">
                    Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 text-ink focus:outline-none"
                      >
                        <Star
                          size={22}
                          fill={(hoverRating || rating) >= star ? "#050505" : "none"}
                          color="#050505"
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-medium text-ink-soft">
                      {hoverRating || rating} / 5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-faint mb-1">
                    Your Name *
                  </label>
                  <input
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Jonathan T."
                    className="w-full rounded-xl border border-line px-4 py-2.5 text-sm text-ink outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-faint mb-1">
                    Headline / Summary *
                  </label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Crisp pickup and remarkable ping"
                    className="w-full rounded-xl border border-line px-4 py-2.5 text-sm text-ink outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-faint mb-1">
                    Detailed Review *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Describe the sweet spot, balance, weight feel, and durability..."
                    className="w-full rounded-xl border border-line px-4 py-2.5 text-sm text-ink outline-none focus:border-ink resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-faint mb-1.5">
                    Key Highlights
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Performance", "Pickup", "Balance", "Looks"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                          selectedTags.includes(tag)
                            ? "border-ink bg-ink text-bg"
                            : "border-line text-ink-soft hover:border-ink"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setWriteModalOpen(false)}
                    className="flex-1 rounded-xl border border-line py-2.5 text-xs font-semibold uppercase tracking-wider text-ink hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-xl bg-ink py-2.5 text-xs font-semibold uppercase tracking-wider text-bg hover:opacity-90 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Post Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
        <div>
          <div className="space-y-1.5">
            {distribution.map((d) => (
              <div key={d.star} className="flex items-center gap-2 text-xs">
                <span className="w-8 text-ink-faint">{d.star}★</span>
                <div className="h-1.5 flex-1 rounded-full bg-line-soft">
                  <div
                    className="h-full rounded-full bg-ink"
                    style={{
                      width: `${reviewsList.length ? (d.count / reviewsList.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="w-4 text-ink-faint">{d.count}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`border px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  filter === f ? "border-ink bg-ink text-bg" : "border-line text-ink-soft hover:border-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filtered.map((r) => (
            <div key={r.id} className="border-b border-line-soft pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      size={13}
                      fill={s < r.rating ? "#050505" : "none"}
                      color="#050505"
                    />
                  ))}
                </div>
                <p className="text-xs text-ink-faint">
                  {new Date(r.date).toLocaleDateString("en-GB", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p className="mt-2 font-medium">{r.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{r.body}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-faint">
                {r.author}
                {r.verified && (
                  <span className="flex items-center gap-1 text-ink-faint">
                    <BadgeCheck size={12} /> Verified Purchase
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
