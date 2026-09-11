"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareState {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => {
          if (state.ids.includes(id)) return { ids: state.ids.filter((i) => i !== id) };
          if (state.ids.length >= 3) return state;
          return { ids: [...state.ids, id] };
        }),
      clear: () => set({ ids: [] }),
      has: (id) => get().ids.includes(id),
    }),
    { name: "crix-compare" }
  )
);
