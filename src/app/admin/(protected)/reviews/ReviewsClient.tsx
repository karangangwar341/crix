"use client";

import { useState } from "react";
import { Star, Trash2, CheckCircle, XCircle, Search } from "lucide-react";
import { deleteReview, toggleReviewPublish } from "@/app/actions/admin";

export interface AdminReviewItem {
  id: string;
  productId: string;
  productName: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  tags: string[];
  isSample: boolean;
  published: boolean;
  date: string;
}

export default function ReviewsClient({ initialReviews }: { initialReviews: AdminReviewItem[] }) {
  const [reviews, setReviews] = useState<AdminReviewItem[]>(initialReviews);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "user" | "sample">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = reviews.filter((r) => {
    const matchSearch =
      r.author.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.body.toLowerCase().includes(search.toLowerCase());

    if (filterType === "user") return matchSearch && !r.isSample;
    if (filterType === "sample") return matchSearch && r.isSample;
    return matchSearch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setDeletingId(id);
    const res = await deleteReview(id);
    setDeletingId(null);
    if (res?.success) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert("Failed to delete review");
    }
  };

  const handleTogglePublish = async (id: string, currentPublished: boolean) => {
    const nextPublished = !currentPublished;
    const res = await toggleReviewPublish(id, nextPublished);
    if (res?.success) {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, published: nextPublished } : r))
      );
    } else {
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Customer Reviews
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Manage, moderate, and inspect customer feedback across your catalog.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-ink">
            {reviews.filter((r) => !r.isSample).length} User Submitted
          </span>
          <span className="rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-ink-soft">
            {reviews.length} Total
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by author, headline, content, or product..."
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-xs text-ink outline-none focus:border-ink"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "user", "sample"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`rounded-xl border px-3.5 py-2 text-xs font-medium capitalize transition-colors ${
                filterType === t
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white text-ink-soft hover:border-ink"
              }`}
            >
              {t === "all" ? "All Reviews" : t === "user" ? "User Submitted" : "Sample Data"}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-neutral-50 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Author</th>
                <th className="px-5 py-3.5">Rating</th>
                <th className="px-5 py-3.5">Headline & Review</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-ink-faint">
                    No reviews found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-ink max-w-[160px] truncate">
                      {r.productName}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-ink">{r.author}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 font-semibold text-ink">
                        <Star size={13} fill="#050505" color="#050505" />
                        {r.rating}
                      </span>
                    </td>
                    <td className="px-5 py-4 max-w-sm">
                      <p className="font-medium text-ink truncate">{r.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-ink-soft text-[11px] leading-relaxed">
                        {r.body}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {r.isSample ? (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                          Sample
                        </span>
                      ) : (
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700">
                          User Review
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleTogglePublish(r.id, r.published)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors ${
                          r.published
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        }`}
                      >
                        {r.published ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {r.published ? "Published" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-ink-faint whitespace-nowrap">{r.date}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
                        className="rounded-lg p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label="Delete review"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
