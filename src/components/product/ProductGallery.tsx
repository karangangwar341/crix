"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Expand, X, ChevronLeft, ChevronRight, Camera, Orbit } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";
import Product360Viewer from "./Product360Viewer";
import { cn } from "@/lib/utils";

const ANGLE_LABELS: Record<string, string> = {
  front: "Front Face",
  back: "Rear Face",
  "front-right": "3/4 Angle",
  angle: "3/4 Angle",
  left: "Side Profile",
  side: "Side Profile",
  toe: "Toe Guard",
  handle: "Grip & Handle",
  "grain-closeup": "Willow Grain",
  detail: "Material Detail",
  edge: "Edge Profile",
  spine: "Spine Peak",
  sticker: "Embossed Badge",
  mallet: "Mallet Head",
  guard: "Shield Guard",
  rear: "Rear Harness",
};

export default function ProductGallery({
  product,
  initialMode = "gallery",
}: {
  product: Product;
  initialMode?: "gallery" | "3d";
}) {
  const images = product.images.length > 0 ? product.images : [{ angle: "front", seed: product.id }];
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<"gallery" | "3d">(initialMode);

  function next() {
    setActive((a) => (a + 1) % images.length);
  }
  function prev() {
    setActive((a) => (a - 1 + images.length) % images.length);
  }

  const currentAngle = images[active]?.angle || "front";
  const activeLabel = ANGLE_LABELS[currentAngle] || currentAngle;

  return (
    <div className="w-full">
      {/* Top View Mode Switcher */}
      <div className="mb-4 flex items-center justify-between">
        <div className="inline-flex rounded-full border border-line bg-surface p-1 shadow-sm">
          <button
            onClick={() => setViewMode("gallery")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-all",
              viewMode === "gallery"
                ? "bg-black text-white shadow-sm"
                : "text-ink-soft hover:text-black"
            )}
          >
            <Camera size={13} />
            <span>Studio Gallery</span>
          </button>
          <button
            onClick={() => setViewMode("3d")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-all",
              viewMode === "3d"
                ? "bg-black text-white shadow-sm"
                : "text-ink-soft hover:text-black"
            )}
          >
            <Orbit size={13} />
            <span>3D 360° Model</span>
          </button>
        </div>

        {viewMode === "gallery" && (
          <span className="text-[11px] uppercase tracking-[0.1em] text-ink-faint">
            {active + 1} of {images.length}
          </span>
        )}
      </div>

      {viewMode === "3d" ? (
        /* 3D 360° Interactive Visualizer */
        <Product360Viewer product={product} height="520px" />
      ) : (
        /* High-Definition Photographic Studio Gallery */
        <div>
          <div
            className="group relative aspect-square w-full overflow-hidden rounded-[28px] border border-line bg-bg-alt shadow-[var(--shadow-card)]"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") next();
              if (e.key === "ArrowLeft") prev();
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full w-full p-4 sm:p-6 flex items-center justify-center"
              >
                <ProductVisual product={product} angle={currentAngle} preferPhoto={true} fillMode="contain" />
              </motion.div>
            </AnimatePresence>

            {/* Fullscreen Button */}
            <button
              onClick={() => setFullscreen(true)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/90 shadow-sm backdrop-blur transition-all hover:bg-black hover:text-white"
              aria-label="View fullscreen"
            >
              <Expand size={14} />
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/90 shadow-sm backdrop-blur transition-all hover:bg-black hover:text-white opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/90 shadow-sm backdrop-blur transition-all hover:bg-black hover:text-white opacity-0 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            {/* Active Angle Badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-line bg-white/95 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-black shadow-sm backdrop-blur">
              {activeLabel}
            </div>
          </div>

          {/* Thumbnail Rail */}
          {images.length > 1 && (
            <div className="mt-3.5 flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {images.map((img, i) => (
                <button
                  key={`${img.angle}-${i}`}
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border bg-bg-alt p-1.5 transition-all",
                    active === i
                      ? "border-black ring-2 ring-black/10 scale-100 opacity-100"
                      : "border-line opacity-60 hover:opacity-100 hover:border-ink-soft"
                  )}
                  aria-label={`View ${ANGLE_LABELS[img.angle] || img.angle}`}
                >
                  {img.url ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={img.url}
                        alt={img.alt || product.name}
                        fill
                        sizes="80px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <ProductVisual product={product} angle={img.angle} preferPhoto={false} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Modal Lightbox */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-6 backdrop-blur-md"
            onClick={() => setFullscreen(false)}
          >
            <button
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
              onClick={() => setFullscreen(false)}
              aria-label="Close fullscreen"
            >
              <X size={20} />
            </button>

            <div
              className="relative flex h-[82vh] w-[82vw] max-w-4xl items-center justify-center p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <ProductVisual product={product} angle={currentAngle} preferPhoto={true} fillMode="contain" />
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur">
                <span>{activeLabel}</span>
                <span className="opacity-40">·</span>
                <span className="opacity-70">{active + 1} / {images.length}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
