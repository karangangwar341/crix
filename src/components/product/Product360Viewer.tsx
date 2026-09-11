"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ZoomIn, ZoomOut, Info } from "lucide-react";
import { Product } from "@/lib/types";
import { Bat3D } from "./BatGlyph";
import { Equipment3D } from "./Equipment3D";
import { productTone } from "./ProductVisual";

interface Hotspot {
  id: string;
  label: string;
  x: string;
  y: string;
  title: string;
  body: string;
}

const CATEGORY_HOTSPOTS: Record<string, Hotspot[]> = {
  bats: [
    {
      id: "bat-grip",
      label: "Cane Handle",
      x: "48%",
      y: "14%",
      title: "12-Piece Cane Handle",
      body: "Multi-piece Sarawak cane with triple rubber spring dampeners to absorb high-impact vibrations.",
    },
    {
      id: "bat-sweetspot",
      label: "Sweet Spot",
      x: "54%",
      y: "55%",
      title: "Mid-Profile Sweet Spot",
      body: "Mass concentrated in the primary hitting zone for maximum kinetic energy transfer through the ball.",
    },
    {
      id: "bat-toe",
      label: "Toe Guard",
      x: "48%",
      y: "88%",
      title: "Hardened Toe Shield",
      body: "Pre-fitted polymer guard seals bottom grain against ground strike impact and moisture ingress.",
    },
  ],
  "batting-gloves": [
    {
      id: "glove-fingers",
      label: "Chamber Armor",
      x: "56%",
      y: "22%",
      title: "High-Density Segmented Bar",
      body: "Pre-curved multi-split finger chambers disperse 90mph ball impact while enabling fingertip dexterity.",
    },
    {
      id: "glove-thumb",
      label: "Shark-Tooth Guard",
      x: "72%",
      y: "45%",
      title: "2-Piece Articulated Thumb",
      body: "Dual-section fiber inserts guard bottom-hand thumb against rising deliveries off the shoulder.",
    },
    {
      id: "glove-palm",
      label: "Pittards Leather",
      x: "38%",
      y: "65%",
      title: "Grade 1 Pittards Leather",
      body: "Soft, durable English Pittards sheepskin palm ensures immaculate touch, grip and sweat resistance.",
    },
  ],
  "batting-pads": [
    {
      id: "pad-top",
      label: "Top Hat",
      x: "50%",
      y: "16%",
      title: "Molded Top-Hat Bolster",
      body: "High-density polyurethane extended thigh protection protects above the knee roll when driving.",
    },
    {
      id: "pad-knee",
      label: "3D Knee Roll",
      x: "50%",
      y: "35%",
      title: "Ergonomic 3-Section Roll",
      body: "Anatomical knee cup flexes naturally with running stride without shifting off the shin bone.",
    },
    {
      id: "pad-cane",
      label: "7-Cane Matrix",
      x: "50%",
      y: "66%",
      title: "7-Cane Impact Matrix",
      body: "Internal lightweight cane rods absorb fast bowling momentum and distribute load across shin padding.",
    },
  ],
  helmets: [
    {
      id: "hlm-grille",
      label: "Titanium Grille",
      x: "50%",
      y: "56%",
      title: "Grade 5 Titanium Grille",
      body: "Factory-fitted titanium wire provides uncompromising ballistic security with unobstructed eye-line sight.",
    },
    {
      id: "hlm-shell",
      label: "ABS Impact Shell",
      x: "48%",
      y: "28%",
      title: "High-Density Polymer Shell",
      body: "Molded aerodynamic shell dissipates energy through an expanded polystyrene (EPS) inner shock liner.",
    },
    {
      id: "hlm-dial",
      label: "Precision Dial",
      x: "48%",
      y: "75%",
      title: "Rotary Micro-Dial Fit",
      body: "Fine-tuning retention dial provides millimeter-accurate occipital lockdown for zero helmet wobble.",
    },
  ],
  bags: [
    {
      id: "bag-cordura",
      label: "Cordura Fabric",
      x: "52%",
      y: "36%",
      title: "1680D Ballistic Cordura",
      body: "Heavy industrial-grade weather-resistant weave resists abrasion, tears, and damp pitch changing rooms.",
    },
    {
      id: "bag-cave",
      label: "Internal Bat Cave",
      x: "36%",
      y: "62%",
      title: "Dual Bat Cave Sleeves",
      body: "Dedicated padded bat chambers isolate blades to prevent damage to willow edges from other equipment.",
    },
    {
      id: "bag-wheels",
      label: "All-Terrain Wheels",
      x: "82%",
      y: "85%",
      title: "Heavy-Duty Wheelie Base",
      body: "Oversized urethane tractor wheels with sealed bearings roll smoothly across turf, steps, and concrete.",
    },
  ],
  accessories: [
    {
      id: "acc-seam",
      label: "Hand-Sewn Seam",
      x: "54%",
      y: "45%",
      title: "78-Stitch Hand-Sewn Seam",
      body: "Pronounced four-piece seam crafted with heavy waxed thread for sharp deviation and swing durability.",
    },
    {
      id: "acc-finish",
      label: "Lacquer Glaze",
      x: "40%",
      y: "30%",
      title: "Alum-Tanned Glaze",
      body: "Traditional English wax polish maintains surface shine and core firmness over 80 competitive overs.",
    },
  ],
};

function getAngleLabel(rotation: number): string {
  const r = ((rotation % 360) + 360) % 360;
  if (r >= 335 || r < 25) return "0° · FRONT";
  if (r >= 25 && r < 70) return "45° · 3/4 ANGLE";
  if (r >= 70 && r < 115) return "90° · SIDE PROFILE";
  if (r >= 115 && r < 160) return "135° · REAR 3/4";
  if (r >= 160 && r < 205) return "180° · REAR / PALM";
  if (r >= 205 && r < 250) return "225° · REAR 3/4";
  if (r >= 250 && r < 295) return "270° · SIDE PROFILE";
  return "315° · 3/4 ANGLE";
}

export default function Product360Viewer({
  product,
  height = "68vh",
}: {
  product: Product;
  height?: string;
}) {
  const [rotation, setRotation] = useState(25);
  const [pitch, setPitch] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const isBat = product.category === "bats";
  const tone = isBat ? productTone(product) : undefined;
  const hotspots = CATEGORY_HOTSPOTS[product.category] || CATEGORY_HOTSPOTS.bats;

  const onPointerDown = useCallback((clientX: number, clientY: number) => {
    dragging.current = true;
    lastPos.current = { x: clientX, y: clientY };
  }, []);

  const onPointerMove = useCallback((clientX: number, clientY: number) => {
    if (!dragging.current) return;
    const deltaX = clientX - lastPos.current.x;
    const deltaY = clientY - lastPos.current.y;
    lastPos.current = { x: clientX, y: clientY };

    setRotation((r) => (r - deltaX * 0.65 + 360) % 360);
    setPitch((p) => Math.max(-18, Math.min(18, p + deltaY * 0.3)));
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => onPointerMove(e.clientX, e.clientY);
    const up = () => onPointerUp();
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [onPointerMove, onPointerUp]);

  return (
    <div className="relative w-full overflow-hidden rounded-[28px] border border-line bg-gradient-to-b from-bg to-bg-alt select-none shadow-[var(--shadow-card)]" style={{ height }}>
      {/* Top Header Badge */}
      <div className="absolute left-6 top-6 z-10 flex items-center gap-2.5">
        <span className="flex items-center gap-1.5 rounded-full border border-line bg-white/90 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink shadow-sm backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-black" />
          3D Visualizer
        </span>
        <span className="hidden sm:inline-flex rounded-full border border-line bg-surface/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-ink-faint backdrop-blur">
          Drag to Rotate · Wheel to Zoom
        </span>
      </div>

      {/* Rotation Status Badge */}
      <div className="absolute bottom-6 left-6 z-10 rounded-full border border-line bg-white/90 px-3.5 py-1 text-[10px] font-medium tracking-[0.12em] text-ink shadow-sm backdrop-blur">
        {getAngleLabel(rotation)}
      </div>

      {/* Control Tools Overlay */}
      <div className="absolute right-6 top-6 z-10 flex flex-col gap-2">
        <button
          onClick={() => setZoom((z) => Math.min(1.5, z + 0.15))}
          aria-label="Zoom in"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition-all hover:bg-black hover:text-white"
        >
          <ZoomIn size={15} />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
          aria-label="Zoom out"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition-all hover:bg-black hover:text-white"
        >
          <ZoomOut size={15} />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setRotation(25);
            setPitch(0);
          }}
          aria-label="Reset view"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition-all hover:bg-black hover:text-white"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div
        className="flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing"
        onPointerDown={(e) => onPointerDown(e.clientX, e.clientY)}
        onWheel={(e) => {
          e.preventDefault();
          setZoom((z) => Math.max(0.7, Math.min(1.5, z - e.deltaY * 0.001)));
        }}
      >
        <motion.div
          animate={{ scale: zoom }}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
          className="relative flex h-[82%] w-[82%] items-center justify-center"
        >
          {isBat && tone ? (
            <div className="relative h-full w-[45%]">
              <Bat3D tone={tone} rotation={rotation > 180 ? rotation - 360 : rotation} />
            </div>
          ) : (
            <Equipment3D
              category={product.category}
              rotation={rotation}
              pitch={pitch}
              accent={product.colorway.accent || "#8a1f2b"}
              className="h-full w-full"
            />
          )}

          {/* Technical Inspection Hotspots */}
          {hotspots.map((h) => (
            <div key={h.id} className="absolute" style={{ left: h.x, top: h.y }}>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setActiveHotspot(activeHotspot === h.id ? null : h.id)}
                className="relative flex h-5 w-5 items-center justify-center rounded-full bg-black text-white ring-4 ring-black/20 transition-transform hover:scale-110"
                aria-label={h.label}
              >
                <span className="absolute h-full w-full animate-ping rounded-full bg-black/40" />
                <Info size={11} strokeWidth={2.2} />
              </button>

              <AnimatePresence>
                {activeHotspot === h.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    className="absolute left-7 top-0 z-30 w-64 rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-hover)]"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black">
                      {h.title}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                      {h.body}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
