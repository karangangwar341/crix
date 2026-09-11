"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";

const HANDLE_OPTIONS = ["Semi-Oval", "Oval", "Round", "Octagonal"];
const GRIP_OPTIONS = ["Standard", "Chevron", "Cushioned", "Octopus"];
const TOE_OPTIONS = ["Traditional", "Rounded", "Square"];

export default function Configurator({ product }: { product: Product }) {
  const [weightId, setWeightId] = useState(product.variants[Math.floor(product.variants.length / 2)]?.id);
  const [handle, setHandle] = useState(product.specifications?.handle ?? HANDLE_OPTIONS[0]);
  const [grip, setGrip] = useState(GRIP_OPTIONS[0]);
  const [toe, setToe] = useState(product.specifications?.toe ?? TOE_OPTIONS[0]);
  const addItem = useCart((s) => s.addItem);

  const weightVariant = product.variants.find((v) => v.id === weightId) ?? product.variants[0];
  const specs = product.specifications;

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
      <p className="mb-1 text-[11px] uppercase tracking-[0.14em] text-gold">Configure Your Bat</p>
      <h3 className="font-display text-2xl">Build it your way.</h3>

      <div className="mt-6 space-y-6">
        <div>
          <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.08em]">Weight</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setWeightId(v.id)}
                className={`border px-3 py-2 text-xs ${weightVariant?.id === v.id ? "border-ink bg-ink text-bg" : "border-line text-ink-soft"}`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.08em]">Handle</p>
          <div className="flex flex-wrap gap-2">
            {HANDLE_OPTIONS.map((h) => (
              <button
                key={h}
                onClick={() => setHandle(h)}
                className={`border px-3 py-2 text-xs ${handle === h ? "border-ink bg-ink text-bg" : "border-line text-ink-soft"}`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.08em]">Grip</p>
          <div className="flex flex-wrap gap-2">
            {GRIP_OPTIONS.map((g) => (
              <button
                key={g}
                onClick={() => setGrip(g)}
                className={`border px-3 py-2 text-xs ${grip === g ? "border-ink bg-ink text-bg" : "border-line text-ink-soft"}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.08em]">Toe Shape</p>
          <div className="flex flex-wrap gap-2">
            {TOE_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setToe(t)}
                className={`border px-3 py-2 text-xs ${toe === t ? "border-ink bg-ink text-bg" : "border-line text-ink-soft"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-line-soft pt-5">
        <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-ink-faint">Your Bat</p>
        <AnimatePresence mode="wait">
          <motion.dl
            key={`${weightVariant?.label}-${handle}-${grip}-${toe}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm"
          >
            <dt className="text-ink-soft">Grade</dt>
            <dd className="text-right font-medium">{specs ? `Grade ${specs.willowGrade}` : "—"}</dd>
            <dt className="text-ink-soft">Weight</dt>
            <dd className="text-right font-medium">{weightVariant?.label}</dd>
            <dt className="text-ink-soft">Balance</dt>
            <dd className="text-right font-medium">{specs?.balance}</dd>
            <dt className="text-ink-soft">Handle</dt>
            <dd className="text-right font-medium">{handle}</dd>
            <dt className="text-ink-soft">Grip</dt>
            <dd className="text-right font-medium">{grip}</dd>
            <dt className="text-ink-soft">Toe</dt>
            <dd className="text-right font-medium">{toe}</dd>
          </motion.dl>
        </AnimatePresence>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-2xl font-medium">{formatPrice(product.price)}</p>
          <button
            onClick={() => addItem(product, weightVariant.id, `${weightVariant.label} · ${handle} · ${grip}`)}
            className="bg-ink px-6 py-3 text-[13px] font-medium uppercase tracking-[0.06em] text-bg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
