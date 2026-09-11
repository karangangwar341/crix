"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { BatFaceFront } from "./BatGlyph";
import { productTone } from "./ProductVisual";
import { Reveal } from "@/components/ui/Reveal";

const HOTSPOTS = (specs: NonNullable<Product["specifications"]>) => [
  { id: "handle", x: "50%", y: "10%", title: "Handle", body: `${specs.handle} handle, cane-sprung for shock absorption and feel through the hands.` },
  { id: "shoulder", x: "50%", y: "30%", title: "Shoulder", body: "The transition from handle to blade — shaped to preserve pickup while maximising blade mass." },
  { id: "spine", x: "50%", y: "48%", title: "Spine", body: `A ${specs.spine}mm spine runs down the back of the blade, maximising the hitting area while keeping pickup controlled.` },
  { id: "edge", x: "78%", y: "55%", title: "Edges", body: `Engineered to ${specs.edge}mm for controlled power through the hitting zone without excess weight.` },
  { id: "sweetspot", x: "50%", y: "62%", title: "Sweet Spot", body: `Positioned ${specs.sweetSpot.toLowerCase()} on the blade to suit this bat's playing style.` },
  { id: "toe", x: "50%", y: "94%", title: "Toe", body: `${specs.toe} toe shape, balancing durability with a clean, classic profile.` },
  { id: "face", x: "28%", y: "45%", title: "Willow Face", body: `${specs.grains} straight grains of ${specs.willow}, hand-selected for even pressing.` },
];

export default function Anatomy({ product }: { product: Product }) {
  const [active, setActive] = useState<string | null>(null);
  const specs = product.specifications;
  if (!specs) return null;
  const hotspots = HOTSPOTS(specs);

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10">
      <Reveal className="mb-12 text-center">
        <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">Anatomy</p>
        <h2 className="font-display text-4xl sm:text-5xl">Built from the grain up.</h2>
      </Reveal>

      <div className="relative mx-auto h-[560px] w-[220px]">
        <BatFaceFront tone={productTone(product)} showSticker={false} />
        {hotspots.map((h) => (
          <div key={h.id} className="absolute" style={{ left: h.x, top: h.y }}>
            <button
              onClick={() => setActive(active === h.id ? null : h.id)}
              className="relative -translate-x-1/2 -translate-y-1/2"
              aria-label={h.title}
            >
              <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-ink/30" />
              <span className="relative block h-3 w-3 rounded-full border-2 border-surface bg-ink" />
            </button>
            {active === h.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute left-4 top-1/2 z-10 w-60 -translate-y-1/2 rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-hover)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink">{h.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{h.body}</p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
