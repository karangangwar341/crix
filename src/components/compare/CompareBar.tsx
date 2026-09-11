"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import { useCompare } from "@/lib/store/compare";
import { allProducts } from "@/lib/data/products";
import { ProductVisual } from "@/components/product/ProductVisual";

export default function CompareBar() {
  const [mounted, setMounted] = useState(false);
  const { ids, toggle, clear } = useCompare();

  useEffect(() => {
    setMounted(true);
  }, []);

  const products = mounted ? ids.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean) : [];

  return (
    <AnimatePresence>
      {mounted && products.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 shadow-[0_-10px_35px_rgba(0,0,0,0.06)] backdrop-blur"
        >
          <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-5 py-3 lg:px-10">
            <p className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">Compare ({products.length}/3)</p>
            <div className="flex flex-1 items-center gap-3 overflow-x-auto">
              {products.map((p) => (
                <div key={p!.id} className="flex items-center gap-2 rounded-full border border-line px-3 py-1">
                  <div className="h-8 w-6 bg-bg-alt">
                    <ProductVisual product={p!} angle="front" />
                  </div>
                  <span className="text-xs">{p!.name}</span>
                  <button onClick={() => toggle(p!.id)} aria-label="Remove">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={clear} className="text-xs uppercase text-ink-faint hover:text-ink">
              Clear
            </button>
            <Link
              href="/compare"
              className="bg-ink px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.06em] text-bg"
            >
              Compare
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
