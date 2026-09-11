"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/types";

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  series?: string;
  price: number;
  variantId: string;
  variantLabel: string;
  quantity: number;
  accent: string;
  willowTone: string;
  category: string;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  lastAdded: string | null;
  open: () => void;
  close: () => void;
  addItem: (product: Product, variantId: string, variantLabel: string, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  setQuantity: (productId: string, variantId: string, quantity: number) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      lastAdded: null,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addItem: (product, variantId, variantLabel, quantity = 1) => {
        set((state) => {
          const existing = state.lines.find((l) => l.productId === product.id && l.variantId === variantId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === product.id && l.variantId === variantId
                  ? { ...l, quantity: l.quantity + quantity }
                  : l
              ),
              isOpen: true,
              lastAdded: product.id,
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                series: product.series,
                price: product.price,
                variantId,
                variantLabel,
                quantity,
                accent: product.colorway.accent,
                willowTone: product.colorway.willowTone,
                category: product.category,
              },
            ],
            isOpen: true,
            lastAdded: product.id,
          };
        });
      },
      removeItem: (productId, variantId) =>
        set((state) => ({ lines: state.lines.filter((l) => !(l.productId === productId && l.variantId === variantId)) })),
      setQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.productId === productId && l.variantId === variantId ? { ...l, quantity: Math.max(1, quantity) } : l
          ),
        })),
      clear: () => set({ lines: [] }),
      subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
      count: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    { name: "crix-cart" }
  )
);
