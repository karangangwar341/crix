"use client";

import { useState } from "react";
import { CheckCircle2, UploadCloud, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { createProduct } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.file) {
        setUploadedUrl(data.file.url);
      }
    } catch {
      // Non-fatal
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const res = await createProduct({
      name: fd.get("name") as string,
      series: fd.get("series") as string,
      categoryId: fd.get("categoryId") as string,
      price: Number(fd.get("price")),
      shortDescription: (fd.get("shortDescription") as string) || "",
      description: (fd.get("description") as string) || "",
      willowGrade: fd.get("willowGrade") as string,
      edge: Number(fd.get("edge")) || undefined,
      spine: Number(fd.get("spine")) || undefined,
      sweetSpot: fd.get("sweetSpot") as string,
      pickup: fd.get("pickup") as string,
      stock: Number(fd.get("stock")) || 0,
      imageUrl: uploadedUrl || undefined,
    });

    setSaving(false);
    if (res.error) {
      setError(res.error);
    } else {
      setSaved(true);
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Add Equipment / Bat</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Register new product specifications and upload imagery to Neon Object Storage.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="rounded-xl border border-line px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink hover:bg-neutral-50"
        >
          Cancel
        </Link>
      </div>

      {saved && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 size={16} /> Equipment entry saved successfully. Redirecting...
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Neon Object Storage Media Upload Section */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Product Photos (Neon S3 Object Storage)
          </p>

          <div className="flex items-center gap-4">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-line hover:border-black rounded-2xl h-36 w-36 cursor-pointer bg-neutral-50 transition-colors">
              <UploadCloud size={24} className="text-ink-faint" />
              <span className="text-[11px] font-medium text-ink-soft mt-1">
                {uploading ? "Uploading..." : "Upload Photo"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={handleFileUpload}
              />
            </label>

            {uploadedUrl && (
              <div className="relative h-36 w-36 overflow-hidden rounded-2xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadedUrl}
                  alt="Uploaded preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setUploadedUrl(null)}
                  className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-[10px] text-white hover:bg-black"
                >
                  ✕
                </button>
                <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] text-white">
                  Live Preview
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-line">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-faint mb-1.5">
              Or Direct Image URL (CDN / Unsplash / S3)
            </label>
            <input
              type="url"
              value={uploadedUrl || ""}
              onChange={(e) => setUploadedUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full rounded-xl border border-line bg-neutral-50 px-3.5 py-2 text-xs outline-none focus:border-black focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Basic Details */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)] space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Equipment Overview
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-ink-faint mb-1">Product Title</label>
              <input
                name="name"
                placeholder="e.g. Pro Elite Titanium"
                required
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-faint mb-1">Series Name</label>
              <input
                name="series"
                placeholder="e.g. Signature Series"
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-faint mb-1">Category</label>
              <select
                name="categoryId"
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
                defaultValue="bats"
              >
                <option value="bats">Bats</option>
                <option value="batting-gloves">Batting Gloves</option>
                <option value="batting-pads">Batting Pads</option>
                <option value="helmets">Helmets</option>
                <option value="bags">Bags</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-faint mb-1">Retail Price (₹)</label>
              <input
                name="price"
                placeholder="49900"
                type="number"
                step="0.01"
                required
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-faint mb-1">Short Summary</label>
            <input
              name="shortDescription"
              placeholder="e.g. The flagship full-profile bat built for players who hit through the line."
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-faint mb-1">Full Technical Description</label>
            <textarea
              name="description"
              placeholder="Detailed overview of cleft grading, handle construction, pressing..."
              rows={4}
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Bat Specs */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)] space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Cricket Bat Engineering Specifications
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-ink-faint mb-1">Willow Grade</label>
              <input
                name="willowGrade"
                placeholder="Grade 1 English Willow"
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-faint mb-1">Edge Thickness (mm)</label>
              <input
                name="edge"
                type="number"
                placeholder="40"
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-faint mb-1">Spine Height (mm)</label>
              <input
                name="spine"
                type="number"
                placeholder="64"
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-faint mb-1">Sweet Spot Position</label>
              <select
                name="sweetSpot"
                defaultValue="Mid"
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
              >
                <option>Low</option>
                <option>Mid</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-faint mb-1">Pickup Feel</label>
              <select
                name="pickup"
                defaultValue="Balanced"
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
              >
                <option>Light</option>
                <option>Balanced</option>
                <option>Powerful</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-faint mb-1">Warehouse Stock</label>
              <input
                name="stock"
                type="number"
                defaultValue={20}
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-70"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saving ? "Publishing..." : "Publish Product"}
        </button>
      </form>
    </div>
  );
}
