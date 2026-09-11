"use client";

import { Category } from "@/lib/types";
import { Equipment3D } from "./Equipment3D";

/** Rich visual representation for non-bat categories */
export function EquipmentGlyph({ category, accent }: { category: Category; accent: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-4">
      <Equipment3D category={category} rotation={22} pitch={4} accent={accent} className="h-full w-full" />
    </div>
  );
}
