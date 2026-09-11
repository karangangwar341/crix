"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, BatAngle } from "@/lib/types";
import { Bat3D, BatDetailShot, BatFaceFront, toneFromProduct } from "./BatGlyph";
import { Equipment3D } from "./Equipment3D";
import { EquipmentGlyph } from "./EquipmentGlyph";

const ANGLE_ROTATION: Partial<Record<BatAngle, number>> = {
  front: 0,
  "front-right": 35,
  right: 90,
  "back-right": 145,
  back: 180,
  "back-left": 215,
  left: 270,
  "front-left": 325,
};

export function productTone(product: Product) {
  return toneFromProduct({
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
}

/** Renders a product's visual: either high-resolution studio photography
 * or dynamic 3D interactive model depending on mode and rotation state. */
export function ProductVisual({
  product,
  angle = "front",
  rotation,
  preferPhoto = true,
  fillMode = "cover",
}: {
  product: Product;
  angle?: BatAngle | string;
  rotation?: number;
  preferPhoto?: boolean;
  fillMode?: "cover" | "contain";
}) {
  const [imageError, setImageError] = useState(false);
  const isBat = product.category === "bats";
  const tone = isBat ? productTone(product) : undefined;

  // 1. If explicit interactive rotation is active, render the 3D model
  if (rotation !== undefined) {
    if (isBat && tone) {
      return <Bat3D tone={tone} rotation={rotation} />;
    }
    return (
      <Equipment3D
        category={product.category}
        rotation={rotation}
        accent={product.colorway.accent || "#8a1f2b"}
      />
    );
  }

  // 2. If photo mode is preferred, find the matching photography angle
  if (preferPhoto && !imageError) {
    const matchedImage =
      product.images.find((img) => img.angle === angle && img.url) ||
      product.images.find((img) => img.url) ||
      (product.imageUrl ? { url: product.imageUrl, alt: product.name } : null);

    if (matchedImage?.url) {
      return (
        <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
          <Image
            src={matchedImage.url}
            alt={matchedImage.alt || product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={
              fillMode === "cover"
                ? "object-cover object-center transition-transform duration-500 group-hover:scale-105"
                : "object-contain p-4 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
            }
            onError={() => setImageError(true)}
            priority={angle === "front"}
          />
        </div>
      );
    }
  }

  // 3. Fallback to procedural 3D model if photo fails or non-photo mode
  if (!isBat) {
    return <EquipmentGlyph category={product.category} accent={product.colorway.accent} />;
  }

  if (tone && ["toe", "handle", "grain-closeup", "edge", "spine", "sticker"].includes(angle as never)) {
    return <BatDetailShot tone={tone} region={angle as never} />;
  }

  const r = ANGLE_ROTATION[angle as BatAngle] ?? 0;
  return tone ? <Bat3D tone={tone} rotation={r} /> : null;
}

export function BatFrontStatic({ product }: { product: Product }) {
  return <BatFaceFront tone={productTone(product)} />;
}
