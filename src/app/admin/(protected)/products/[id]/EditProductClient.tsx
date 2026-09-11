"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  UploadCloud,
  ExternalLink,
  Trash2,
  Save,
  ArrowLeft,
  Loader2,
  Plus,
} from "lucide-react";
import { Product } from "@/lib/types";
import { updateProduct, deleteProduct } from "@/app/actions/admin";

export default function EditProductClient({ initialProduct }: { initialProduct: Product }) {
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Images state
  const [images, setImages] = useState(initialProduct.images || []);
  const [activeImageUrl, setActiveImageUrl] = useState<string>(
    initialProduct.images?.[0]?.url || initialProduct.imageUrl || ""
  );
  const [newImageUrl, setNewImageUrl] = useState("");

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
        const uploadedUrl = data.file.url;
        setActiveImageUrl(uploadedUrl);
        setImages((prev) => [
          { angle: "front", seed: product.slug, url: uploadedUrl, alt: product.name },
          ...prev.filter((img) => img.url !== uploadedUrl),
        ]);
      }
    } catch {
      setError("Failed to upload image. You can also paste an image URL directly.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setActiveImageUrl(newImageUrl.trim());
    setImages((prev) => [
      { angle: "front", seed: product.slug, url: newImageUrl.trim(), alt: product.name },
      ...prev,
    ]);
    setNewImageUrl("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const res = await updateProduct({
      id: product.id,
      name: fd.get("name") as string,
      series: fd.get("series") as string,
      categoryId: fd.get("categoryId") as string,
      price: Number(fd.get("price")),
      compareAtPrice: fd.get("compareAtPrice") ? Number(fd.get("compareAtPrice")) : undefined,
      shortDescription: (fd.get("shortDescription") as string) || "",
      description: (fd.get("description") as string) || "",
      willowGrade: fd.get("willowGrade") as string,
      edge: Number(fd.get("edge")) || undefined,
      spine: Number(fd.get("spine")) || undefined,
      sweetSpot: fd.get("sweetSpot") as string,
      pickup: fd.get("pickup") as string,
      stock: Number(fd.get("stock")) || 0,
      imageUrl: activeImageUrl || undefined,
    });

    setSaving(false);
    if (res.error) {
      setError(res.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently remove "${product.name}"?`)) return;
    setDeleting(true);
    const res = await deleteProduct(product.id);
    setDeleting(false);
    if (res.error) {
      setError(res.error);
    } else {
      router.push("/admin/products");
    }
  };

  return (
    <div className="max-w-4xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-faint uppercase tracking-wider mb-1">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 hover:text-black transition-colors"
            >
              <ArrowLeft size={13} /> Product Catalog
            </Link>
            <span>/</span>
            <span>{product.category}</span>
          </div>
          <h1 className="font-display text-3xl text-ink">Edit {product.name}</h1>
          <p className="mt-0.5 text-xs text-ink-soft">
            ID: <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">{product.id}</code> · Slug:{" "}
            <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">{product.slug}</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${product.category}/${product.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-medium text-ink hover:bg-neutral-50 transition-colors shadow-sm"
          >
            <ExternalLink size={14} /> Storefront
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} /> {deleting ? "Removing..." : "Delete"}
          </button>
        </div>
      </div>

      {saved && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 size={16} /> Changes saved successfully! Updated in catalog and live storefront.
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* PRODUCT PHOTOS / GALLERY */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink">
                Product Imagery & Gallery
              </p>
              <p className="text-xs text-ink-faint mt-0.5">
                Active photography synced from CDN / S3 Storage. Click any photo to set as primary.
              </p>
            </div>
            {activeImageUrl && (
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold text-ink-soft">
                {images.length} Angle{images.length === 1 ? "" : "s"} Available
              </span>
            )}
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-5">
            {images.map((img, idx) => {
              const isSelected = activeImageUrl === img.url;
              return (
                <div
                  key={idx}
                  onClick={() => img.url && setActiveImageUrl(img.url)}
                  className={`group relative aspect-[3/4] rounded-xl border-2 overflow-hidden cursor-pointer transition-all bg-neutral-50 flex flex-col justify-end ${
                    isSelected
                      ? "border-black shadow-md ring-2 ring-black/10"
                      : "border-line hover:border-neutral-400"
                  }`}
                >
                  {img.url ? (
                    <Image
                      src={img.url}
                      alt={img.alt || `${product.name} angle`}
                      fill
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] text-ink-faint">
                      Procedural 3D
                    </div>
                  )}

                  <div className="relative z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider truncate">
                      {img.angle || `Angle ${idx + 1}`}
                    </p>
                    {isSelected && (
                      <span className="inline-block rounded bg-white px-1 py-0.2 text-[8px] font-black uppercase text-black mt-0.5">
                        Primary
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Upload Box */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-line hover:border-black rounded-xl aspect-[3/4] cursor-pointer bg-neutral-50 transition-colors p-3 text-center">
              {uploading ? (
                <Loader2 size={20} className="animate-spin text-ink-soft" />
              ) : (
                <>
                  <UploadCloud size={20} className="text-ink-faint mb-1" />
                  <span className="text-[10px] font-semibold text-ink">Upload Photo</span>
                  <span className="text-[9px] text-ink-faint mt-0.5">PNG, JPG, WebP</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Direct URL Input */}
          <div className="pt-3 border-t border-line flex flex-col sm:flex-row items-center gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Or paste an image URL (Unsplash, Cloudinary, S3)..."
              className="w-full flex-1 rounded-xl border border-line bg-neutral-50 px-3 py-2 text-xs outline-none focus:border-black focus:bg-white transition-colors"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink hover:bg-neutral-100 transition-colors"
            >
              <Plus size={13} /> Add Image
            </button>
          </div>
        </div>

        {/* EQUIPMENT OVERVIEW */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink">
            Equipment Overview & Pricing
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                Product Title
              </label>
              <input
                name="name"
                defaultValue={product.name}
                required
                className="mt-1 w-full rounded-xl border border-line bg-neutral-50 px-3.5 py-2.5 text-sm outline-none focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                Series Name
              </label>
              <input
                name="series"
                defaultValue={product.series || ""}
                placeholder="e.g. Signature Series, Pro Line"
                className="mt-1 w-full rounded-xl border border-line bg-neutral-50 px-3.5 py-2.5 text-sm outline-none focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                Category
              </label>
              <select
                name="categoryId"
                defaultValue={product.category}
                required
                className="mt-1 w-full rounded-xl border border-line bg-neutral-50 px-3.5 py-2.5 text-sm outline-none focus:border-black focus:bg-white"
              >
                <option value="bats">English Willow Bats</option>
                <option value="batting-gloves">Batting Gloves</option>
                <option value="batting-pads">Batting Pads</option>
                <option value="helmets">Helmets</option>
                <option value="bags">Bags & Luggage</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                Live Inventory (Warehouse Units)
              </label>
              <input
                name="stock"
                type="number"
                defaultValue={product.stock}
                min={0}
                required
                className="mt-1 w-full rounded-xl border border-line bg-neutral-50 px-3.5 py-2.5 text-sm outline-none focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                Retail Price (₹)
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={product.price}
                required
                className="mt-1 w-full rounded-xl border border-line bg-neutral-50 px-3.5 py-2.5 text-sm outline-none focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                Compare-At Price (₹) (Optional)
              </label>
              <input
                name="compareAtPrice"
                type="number"
                step="0.01"
                defaultValue={product.compareAtPrice || ""}
                placeholder="e.g. 54900.00"
                className="mt-1 w-full rounded-xl border border-line bg-neutral-50 px-3.5 py-2.5 text-sm outline-none focus:border-black focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* DESCRIPTIONS */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink">
            Editorial & Technical Copy
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                Short Summary (Card Caption)
              </label>
              <input
                name="shortDescription"
                defaultValue={product.shortDescription || ""}
                required
                className="mt-1 w-full rounded-xl border border-line bg-neutral-50 px-3.5 py-2.5 text-sm outline-none focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                Full Technical Overview
              </label>
              <textarea
                name="description"
                rows={4}
                defaultValue={product.description || ""}
                required
                className="mt-1 w-full rounded-xl border border-line bg-neutral-50 px-3.5 py-2.5 text-sm outline-none focus:border-black focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* BAT SPECIFICATIONS (IF CATEGORY IS BATS) */}
        {product.category === "bats" && (
          <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink">
              Bat Craftsmanship & Profiling
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  Willow Grade
                </label>
                <select
                  name="willowGrade"
                  defaultValue={product.specifications?.willowGrade?.toString() || "1"}
                  className="mt-1 w-full rounded-xl border border-line bg-neutral-50 px-3.5 py-2.5 text-sm outline-none focus:border-black focus:bg-white"
                >
                  <option value="1">Grade 1 Limited Edition</option>
                  <option value="2">Grade 2 Player Willow</option>
                  <option value="3">Grade 3 Club Standard</option>
                  <option value="Kashmir">Kashmir Willow</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  Edge Thickness (mm)
                </label>
                <input
                  name="edge"
                  type="number"
                  defaultValue={product.specifications?.edge || 40}
                  className="mt-1 w-full rounded-xl border border-line bg-neutral-50 px-3.5 py-2.5 text-sm outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  Spine Profile (mm)
                </label>
                <input
                  name="spine"
                  type="number"
                  defaultValue={product.specifications?.spine || 64}
                  className="mt-1 w-full rounded-xl border border-line bg-neutral-50 px-3.5 py-2.5 text-sm outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  Sweet Spot
                </label>
                <select
                  name="sweetSpot"
                  defaultValue={product.specifications?.sweetSpot || "Mid"}
                  className="mt-1 w-full rounded-xl border border-line bg-neutral-50 px-3.5 py-2.5 text-sm outline-none focus:border-black focus:bg-white"
                >
                  <option value="Low">Low (Front-Foot Dominant)</option>
                  <option value="Mid">Mid (All-Round Balance)</option>
                  <option value="High">High (Fast Bouncing Pitches)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  Pickup Rating
                </label>
                <select
                  name="pickup"
                  defaultValue={product.specifications?.pickup || "Balanced"}
                  className="mt-1 w-full rounded-xl border border-line bg-neutral-50 px-3.5 py-2.5 text-sm outline-none focus:border-black focus:bg-white"
                >
                  <option value="Light">Light & Featherweight</option>
                  <option value="Balanced">Balanced & Controlled</option>
                  <option value="Powerful">Powerful & End-Loaded</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/products"
            className="rounded-xl border border-line bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={15} /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
