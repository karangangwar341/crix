"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Product } from "@/lib/types";
import { Bat3D, toneFromProduct } from "./BatGlyph";

export default function Bat360Viewer({
  product,
  markers,
  height = "70vh",
}: {
  product: Product;
  markers?: { id: string; label: string; x: string; y: string; title: string; body: string }[];
  height?: string;
}) {
  const [rotation, setRotation] = useState(20);
  const [zoom, setZoom] = useState(1);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const dragging = useRef(false);
  const lastX = useRef(0);

  const tone = toneFromProduct({
    id: product.id,
    willowTone: product.colorway.willowTone,
    accent: product.colorway.accent,
    grains: product.specifications?.grains,
    edge: product.specifications?.edge,
    spine: product.specifications?.spine,
    bladeWidth: product.specifications?.bladeWidth,
    series: product.series,
    grade: product.specifications?.willow,
  });

  const onPointerDown = useCallback((clientX: number) => {
    dragging.current = true;
    lastX.current = clientX;
  }, []);

  const onPointerMove = useCallback((clientX: number) => {
    if (!dragging.current) return;
    const delta = clientX - lastX.current;
    lastX.current = clientX;
    setRotation((r) => (r - delta * 0.6 + 360) % 360);
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => onPointerMove(e.clientX);
    const up = () => onPointerUp();
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [onPointerMove, onPointerUp]);

  const displayRotation = rotation > 180 ? rotation - 360 : rotation;

  return (
    <div className="relative w-full select-none" style={{ height }}>
      <div className="absolute left-1/2 top-6 z-10 -translate-x-1/2 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-ink-faint backdrop-blur">
        360° · Drag to Explore
      </div>

      <div className="absolute right-6 top-6 z-10 flex flex-col gap-2">
        <button
          onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
          aria-label="Zoom in"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-sm transition-colors hover:bg-ink-soft"
        >
          <ZoomIn size={15} />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
          aria-label="Zoom out"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-sm transition-colors hover:bg-ink-soft"
        >
          <ZoomOut size={15} />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setRotation(20);
          }}
          aria-label="Reset view"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-sm transition-colors hover:bg-ink-soft"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      <div
        className="flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing"
        onPointerDown={(e) => onPointerDown(e.clientX)}
        onWheel={(e) => {
          e.preventDefault();
          setZoom((z) => Math.max(0.6, Math.min(1.6, z - e.deltaY * 0.001)));
        }}
      >
        <motion.div
          animate={{ scale: zoom }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="relative h-[85%] w-[46%]"
          style={{ perspective: 1000 }}
        >
          <Bat3D tone={tone} rotation={displayRotation} />

          {markers?.map((m) => (
            <div key={m.id} className="absolute" style={{ left: m.x, top: m.y }}>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setActiveMarker(activeMarker === m.id ? null : m.id)}
                className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black ring-4 ring-black/15 hover:ring-black/25"
                aria-label={m.label}
              >
                <span className="absolute h-full w-full animate-ping rounded-full bg-black/40" />
              </button>
              {activeMarker === m.id && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute left-5 top-0 z-20 w-56 rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-hover)]"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink">{m.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{m.body}</p>
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
