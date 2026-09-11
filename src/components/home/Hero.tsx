"use client";

/**
 * Static, non-3D hero. No canvas, no rotation, no scroll-driven product
 * movement — a single fixed front render of the bat, sized against its
 * own natural aspect ratio so it can never be clipped or distorted.
 * Only a few px of cursor parallax is applied, as a position offset.
 */

import { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { homepage } from "@/lib/data/homepage";
import type { HomepageContent } from "@/lib/types";
import { getProductBySlug } from "@/lib/data/products";
import { MagneticButton } from "@/components/ui/Button";
import { BatFaceFront, toneFromProduct } from "@/components/product/BatGlyph";
import { RevealWords } from "@/components/ui/Reveal";

// The generative bat face is drawn on a fixed 140x560 viewBox (see
// BatGlyph.tsx) — keep the wrapper's aspect-ratio locked to that exact
// ratio so the whole bat, handle to toe, always fits with no crop.
const BAT_ASPECT = "140 / 560";

function HeroContent({ content }: { content: HomepageContent["hero"] }) {
  return (
    <div className="max-w-xl">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-[12px] font-medium uppercase tracking-[0.2em] text-gold"
      >
        {content.eyebrow}
      </motion.p>

      <h1 className="mt-3 font-display text-[clamp(48px,10vw,110px)] leading-[0.95] tracking-tight lg:text-[clamp(64px,5.5vw,110px)]">
        <RevealWords text={content.headline} />
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-7 max-w-[520px] text-[17px] leading-[1.55] text-ink-soft"
      >
        {content.subheading}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="mt-8 flex flex-wrap gap-4"
      >
        <MagneticButton href="/bats" variant="primary" withArrow>
          {content.ctaPrimary}
        </MagneticButton>
        <MagneticButton href="/craft" variant="secondary">
          {content.ctaSecondary}
        </MagneticButton>
      </motion.div>
    </div>
  );
}

export default function Hero({ content }: { content?: HomepageContent["hero"] }) {
  const heroData = content || homepage.hero;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const product = getProductBySlug("pro-elite-x")!;
  const specs = product.specifications!;
  const tone = toneFromProduct({
    id: product.id,
    willowTone: product.colorway.willowTone,
    accent: product.colorway.accent,
    grains: specs.grains,
    edge: specs.edge,
    spine: specs.spine,
    bladeWidth: specs.bladeWidth,
    series: product.series,
    grade: specs.willow,
  });

  function onMouseMove(e: MouseEvent) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x, y });
  }

  return (
    <section className="relative min-h-[90vh] w-full bg-white">
      <div className="mx-auto flex min-h-[90vh] w-full max-w-[1600px] flex-col justify-center gap-12 px-5 py-16 lg:flex-row lg:items-center lg:justify-start lg:gap-10 lg:px-10">
        {/* text column — sized to its own content, never competes for space */}
        <div className="lg:max-w-xl lg:flex-shrink-0">
          <HeroContent content={heroData} />
        </div>

        {/* product column — takes all remaining width */}
        <div
          ref={wrapRef}
          onMouseMove={onMouseMove}
          onMouseLeave={() => setOffset({ x: 0, y: 0 })}
          className="relative flex flex-1 items-center justify-center"
        >
          {/* subtle depth behind the product — no gradients, no color */}
          <div
            aria-hidden
            className="pointer-events-none absolute h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.05),transparent_72%)]"
          />

          <div className="relative flex flex-col items-center">
            <div className="relative">
              {/* grounding shadow */}
              <div
                aria-hidden
                className="absolute bottom-0 left-1/2 h-6 w-2/3 -translate-x-1/2 translate-y-2 rounded-full bg-black/10 blur-xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: offset.x * 10,
                  y: offset.y * 8,
                }}
                transition={{
                  opacity: { duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
                  scale: { duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
                  x: { type: "spring", stiffness: 90, damping: 20 },
                  y: { type: "spring", stiffness: 90, damping: 20 },
                }}
                className="relative h-[42vh] sm:h-[50vh] lg:h-[62vh]"
                style={{ aspectRatio: BAT_ASPECT }}
              >
                <BatFaceFront tone={tone} />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-6 w-56 rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-card)]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink">{product.series} Series</p>
              <p className="mt-1 text-[13px] font-medium text-ink">{product.name}</p>
              <p className="mt-1 text-[11px] text-ink-soft">{specs.willow}</p>
              <p className="text-[11px] text-ink-soft">{specs.weight}</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-5 z-10 flex items-center gap-2 lg:right-10">
        <span className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">Scroll</span>
        <span className="relative h-8 w-px overflow-hidden bg-line">
          <motion.span
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 top-0 h-1/2 bg-ink"
          />
        </span>
      </div>
    </section>
  );
}
