"use client";

import { useState } from "react";
import { UploadCloud, Image as ImageIcon, Check, Copy, ExternalLink } from "lucide-react";

export interface MediaItem {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export default function MediaClient({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMsg(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        if (data.file) {
          setItems((prev) => [
            {
              id: data.file.id,
              url: data.file.url,
              fileName: data.file.fileName,
              fileSize: data.file.fileSize,
              mimeType: data.file.mimeType,
              createdAt: new Date().toISOString(),
            },
            ...prev,
          ]);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload file to Neon Object Storage");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Media Library</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Uploaded assets are synchronized with Neon Object Storage (AWS S3-compatible).
          </p>
        </div>

        <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-sm">
          <UploadCloud size={16} />
          <span>{uploading ? "Uploading..." : "Upload New File"}</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {errorMsg && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Grid of media items */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-hover)]"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 flex items-center justify-center">
              {item.mimeType.startsWith("image") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt={item.fileName}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <ImageIcon size={32} className="text-neutral-400" />
              )}
            </div>

            <div className="p-3">
              <p className="truncate text-xs font-medium text-ink" title={item.fileName}>
                {item.fileName}
              </p>
              <p className="text-[11px] text-ink-faint">
                {(item.fileSize / 1024).toFixed(0)} KB
              </p>

              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyUrl(item.url, item.id)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-neutral-50 px-2.5 py-1.5 text-[11px] font-medium text-ink-soft hover:bg-neutral-100 transition-colors"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check size={12} className="text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-line bg-neutral-50 p-1.5 text-ink-soft hover:bg-neutral-100 transition-colors"
                  title="Open image"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
