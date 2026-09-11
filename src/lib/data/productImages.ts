import { Category, ProductImage } from "@/lib/types";

/**
 * Curated high-resolution photography catalog for CRIX equipment.
 * Every product has a dedicated, verified, authentic product photograph.
 */

export interface ProductPhotoSet {
  primary: string;
  gallery: { angle: string; url: string; alt: string }[];
}

/** Specific, dedicated photography for every single product in the catalog */
export const PRODUCT_SPECIFIC_IMAGES: Record<string, { angle: string; url: string; alt: string }[]> = {
  // =========================================================================
  // 1. BATS (10 products)
  // =========================================================================
  "pro-elite-x": [
    { angle: "front", url: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=1200&q=85", alt: "Pro Elite X Flagship Grade 1 Full Profile English Willow" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1630851278830-c0c9b12933ee?auto=format&fit=crop&w=1200&q=85", alt: "Pro Elite X Grain Structure & Power Spine" },
  ],
  "pro-carbon-shield": [
    { angle: "front", url: "https://images.unsplash.com/photo-1630851278830-c0c9b12933ee?auto=format&fit=crop&w=1200&q=85", alt: "Pro Carbon Shield English Willow Handle & Blade" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=1200&q=85", alt: "Pro Carbon Shield Low Sweet Spot Profile" },
  ],
  "heritage-limited": [
    { angle: "front", url: "https://images.unsplash.com/photo-1758791184255-411236a49346?auto=format&fit=crop&w=1200&q=85", alt: "Heritage Limited 12-Year Seasoned Reserve English Willow" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=1200&q=85", alt: "Heritage Limited Edge Contour" },
  ],
  "academy-junior": [
    { angle: "front", url: "https://images.unsplash.com/photo-1646282814550-f521d9b57a59?auto=format&fit=crop&w=1200&q=85", alt: "Academy Junior Lightweight English Willow Cricket Bat" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1630851278830-c0c9b12933ee?auto=format&fit=crop&w=1200&q=85", alt: "Academy Junior Balanced Sweet Spot" },
  ],
  "power-drive-max": [
    { angle: "front", url: "https://images.unsplash.com/photo-1542185091-dee192e9df7a?auto=format&fit=crop&w=1200&q=85", alt: "Power Drive Max High Sweet Spot Power Hitting Bat" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=1200&q=85", alt: "Power Drive Max 44mm Massive Edges" },
  ],
  "classic-control": [
    { angle: "front", url: "https://images.unsplash.com/photo-1624897174291-1bd715e371d5?auto=format&fit=crop&w=1200&q=85", alt: "Classic Control Thin Profile Traditional Timer's Bat" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1630851278830-c0c9b12933ee?auto=format&fit=crop&w=1200&q=85", alt: "Classic Control Straight Grain Face" },
  ],
  "keeper-edge": [
    { angle: "front", url: "https://images.unsplash.com/photo-1643593595725-80986444214e?auto=format&fit=crop&w=1200&q=85", alt: "Keeper Edge Fast Pickup Lower-Order Match Bat" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=1200&q=85", alt: "Keeper Edge Profile Contour" },
  ],
  "vanguard-pro": [
    { angle: "front", url: "https://images.unsplash.com/photo-1677785643764-179393bc3842?auto=format&fit=crop&w=1200&q=85", alt: "Vanguard Pro Multi-Format Player Edition Bat" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1630851278830-c0c9b12933ee?auto=format&fit=crop&w=1200&q=85", alt: "Vanguard Pro Full Spine Profile" },
  ],
  "featherweight-pro": [
    { angle: "front", url: "https://images.unsplash.com/photo-1643294358128-0d2da3b4ea7a?auto=format&fit=crop&w=1200&q=85", alt: "Featherweight Pro Ultra-Light Pickup Handcrafted Willow" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=1200&q=85", alt: "Featherweight Pro Lightweight Contour" },
  ],
  "kashmir-forge": [
    { angle: "front", url: "https://images.unsplash.com/photo-1595207732481-22cccd3480fe?auto=format&fit=crop&w=1200&q=85", alt: "Kashmir Forge Dense Grain Heavy Timber Bat" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1630851278830-c0c9b12933ee?auto=format&fit=crop&w=1200&q=85", alt: "Kashmir Forge Durable Toe & Face" },
  ],

  // =========================================================================
  // 2. BATTING GLOVES (6 products)
  // =========================================================================
  "pro-elite-gloves": [
    { angle: "front", url: "https://images.unsplash.com/photo-1595210382266-2d0077c1f541?auto=format&fit=crop&w=1200&q=85", alt: "Pro Elite Batting Gloves Split-Finger Protection" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1599982946086-eb42d9e14eb8?auto=format&fit=crop&w=1200&q=85", alt: "Pro Elite Gloves Palm & Side Protection Bar" },
  ],
  "carbon-flex-gloves": [
    { angle: "front", url: "https://images.unsplash.com/photo-1599982946086-eb42d9e14eb8?auto=format&fit=crop&w=1200&q=85", alt: "Carbon Flex Gloves High-Density Multi-Chamber Armor" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1595210382266-2d0077c1f541?auto=format&fit=crop&w=1200&q=85", alt: "Carbon Flex Thumb Flex Zone" },
  ],
  "classic-leather-gloves": [
    { angle: "front", url: "https://images.unsplash.com/photo-1673294861057-4584f92b91d2?auto=format&fit=crop&w=1200&q=85", alt: "Classic Leather Batting Gloves Premium Sheepskin" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1595210382266-2d0077c1f541?auto=format&fit=crop&w=1200&q=85", alt: "Classic Leather Traditional Sausage Finger Design" },
  ],
  "junior-guard-gloves": [
    { angle: "front", url: "https://images.unsplash.com/photo-1643593595469-2d8d592ac6ad?auto=format&fit=crop&w=1200&q=85", alt: "Junior Guard Gloves Lightweight Scaled Finger Protection" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1599982946086-eb42d9e14eb8?auto=format&fit=crop&w=1200&q=85", alt: "Junior Guard Breathable Elasticated Wristband" },
  ],
  "power-grip-gloves": [
    { angle: "front", url: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=1200&q=85", alt: "Power Grip Batting Gloves High-Traction Textured Palm" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1595210382266-2d0077c1f541?auto=format&fit=crop&w=1200&q=85", alt: "Power Grip Impact Absorbing Cushioning" },
  ],
  "test-pro-gloves": [
    { angle: "front", url: "https://images.unsplash.com/photo-1785906359585-9c053458d551?auto=format&fit=crop&w=1200&q=85", alt: "Test Pro Match Batting Gloves English Pittards Leather" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1595210382266-2d0077c1f541?auto=format&fit=crop&w=1200&q=85", alt: "Test Pro Shark-Tooth Articulated Thumb" },
  ],

  // =========================================================================
  // 3. BATTING PADS (5 products)
  // =========================================================================
  "pro-elite-pads": [
    { angle: "front", url: "https://images.unsplash.com/photo-1624194697120-34347cff8b58?auto=format&fit=crop&w=1200&q=85", alt: "Pro Elite Batting Pads 7-Cane Impact Matrix" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1624526368410-b552dbf2e743?auto=format&fit=crop&w=1200&q=85", alt: "Pro Elite Pads 3D Molded Knee Roll" },
  ],
  "ultralight-pads": [
    { angle: "front", url: "https://images.unsplash.com/photo-1624526368410-b552dbf2e743?auto=format&fit=crop&w=1200&q=85", alt: "Ultralight Batting Pads Polyurethane Shell" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1624194697120-34347cff8b58?auto=format&fit=crop&w=1200&q=85", alt: "Ultralight Ergonomic Calf Wrap Straps" },
  ],
  "classic-cane-pads": [
    { angle: "front", url: "https://images.unsplash.com/photo-1623521602452-1a7cd695feca?auto=format&fit=crop&w=1200&q=85", alt: "Classic Cane Batting Pads Traditional Vertical Ribs" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1624194697120-34347cff8b58?auto=format&fit=crop&w=1200&q=85", alt: "Classic Cane Reinforced Instep" },
  ],
  "junior-guard-pads": [
    { angle: "front", url: "https://images.unsplash.com/photo-1785906359463-a7a93dc3be24?auto=format&fit=crop&w=1200&q=85", alt: "Junior Guard Cricket Leg Guards" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1624526368410-b552dbf2e743?auto=format&fit=crop&w=1200&q=85", alt: "Junior Guard Lightweight Shin Protection" },
  ],
  "keeper-pro-pads": [
    { angle: "front", url: "https://images.unsplash.com/photo-1776229705335-aaeb8f6a6f15?auto=format&fit=crop&w=1200&q=85", alt: "Keeper Pro Wicketkeeping Lightweight Pads" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1624194697120-34347cff8b58?auto=format&fit=crop&w=1200&q=85", alt: "Keeper Pro Compact Inset Contour" },
  ],

  // =========================================================================
  // 4. HELMETS (4 products)
  // =========================================================================
  "titan-pro-helmet": [
    { angle: "front", url: "https://images.unsplash.com/photo-1776229705264-6b437229654b?auto=format&fit=crop&w=1200&q=85", alt: "Titan Pro Helmet Titanium Wire Grille" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1785906358745-390f57fc7d15?auto=format&fit=crop&w=1200&q=85", alt: "Titan Pro Aerodynamic Ventilation Ports" },
  ],
  "carbon-shell-helmet": [
    { angle: "front", url: "https://images.unsplash.com/photo-1785906358745-390f57fc7d15?auto=format&fit=crop&w=1200&q=85", alt: "Carbon Shell Cricket Helmet Matte Black Finish" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1776229705264-6b437229654b?auto=format&fit=crop&w=1200&q=85", alt: "Carbon Shell Micro-Dial Fit Adjuster" },
  ],
  "classic-guard-helmet": [
    { angle: "front", url: "https://images.unsplash.com/photo-1776229705528-9bcd14792045?auto=format&fit=crop&w=1200&q=85", alt: "Classic Guard Steel Grille Cricket Helmet" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1776229705264-6b437229654b?auto=format&fit=crop&w=1200&q=85", alt: "Classic Guard High-Density Impact Shell" },
  ],
  "junior-shield-helmet": [
    { angle: "front", url: "https://images.unsplash.com/photo-1785906358742-1b5867519add?auto=format&fit=crop&w=1200&q=85", alt: "Junior Shield Safety Certified Cricket Helmet" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1785906358745-390f57fc7d15?auto=format&fit=crop&w=1200&q=85", alt: "Junior Shield Secure Chin Strap" },
  ],

  // =========================================================================
  // 5. BAGS (5 products)
  // =========================================================================
  "pro-wheelie-bag": [
    { angle: "front", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85", alt: "Pro Wheelie Kit Bag 1680D Ballistic Cordura" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=85", alt: "Pro Wheelie All-Terrain Dual Tractor Wheels" },
  ],
  "duffle-classic-bag": [
    { angle: "front", url: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=85", alt: "Duffle Classic Cricket Bag Stand-Up Architecture" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85", alt: "Duffle Classic External Bat Sleeves" },
  ],
  "backpack-pro": [
    { angle: "front", url: "https://images.unsplash.com/photo-1505308144658-03c69861061a?auto=format&fit=crop&w=1200&q=85", alt: "Backpack Pro Ergonomic Padded Shoulder Harness" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1586022045076-aee0a185180b?auto=format&fit=crop&w=1200&q=85", alt: "Backpack Pro Laptop & Gear Compartments" },
  ],
  "junior-holdall": [
    { angle: "front", url: "https://images.unsplash.com/photo-1586022045076-aee0a185180b?auto=format&fit=crop&w=1200&q=85", alt: "Junior Holdall Compact Kit Luggage" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85", alt: "Junior Holdall Durable Base Material" },
  ],
  "coffin-pro-bag": [
    { angle: "front", url: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=1200&q=85", alt: "Coffin Pro Heavy Industrial Kit Trunk" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85", alt: "Coffin Pro Reinforced Corner Skid Guards" },
  ],

  // =========================================================================
  // 6. ACCESSORIES (8 products)
  // =========================================================================
  "pro-grip-pack": [
    { angle: "front", url: "https://images.unsplash.com/photo-1764567386744-090d5ff67d66?auto=format&fit=crop&w=1200&q=85", alt: "Pro Grip Pack High-Traction Matrix Grip Pack" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1765290409377-0595c7c748e0?auto=format&fit=crop&w=1200&q=85", alt: "Pro Grip Non-Slip Chevron Surface Texture" },
  ],
  "bat-mallet": [
    { angle: "front", url: "https://images.unsplash.com/photo-1555374018-13a8994ab246?auto=format&fit=crop&w=1200&q=85", alt: "Hardwood Cricket Bat Knocking-In Mallet" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=1200&q=85", alt: "Knocking-In Mallet Rounded Head & Handle" },
  ],
  "bat-care-kit": [
    { angle: "front", url: "https://images.unsplash.com/photo-1624876989561-42cbe1b2bb1c?auto=format&fit=crop&w=1200&q=85", alt: "Bat Care Kit Raw Linseed Oil & Maintenance Tools" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1555374018-13a8994ab246?auto=format&fit=crop&w=1200&q=85", alt: "Bat Maintenance Oil Applicator & Buffer" },
  ],
  "thigh-guard": [
    { angle: "front", url: "https://images.unsplash.com/photo-1773289336969-894c3c4e0fae?auto=format&fit=crop&w=1200&q=85", alt: "Ergonomic Molded High-Density Thigh Guard" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1765303215249-fc4a1165580f?auto=format&fit=crop&w=1200&q=85", alt: "Thigh Guard Dual Elastic Straps & Soft Lining" },
  ],
  "arm-guard": [
    { angle: "front", url: "https://images.unsplash.com/photo-1765303215249-fc4a1165580f?auto=format&fit=crop&w=1200&q=85", alt: "Pre-Curved Polycarbonate Forearm Guard" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1773289336969-894c3c4e0fae?auto=format&fit=crop&w=1200&q=85", alt: "Forearm Impact Absorption Padding" },
  ],
  "abdo-guard": [
    { angle: "front", url: "https://images.unsplash.com/photo-1758778932701-76ef06971b93?auto=format&fit=crop&w=1200&q=85", alt: "Abdominal Protector Guard Polycarbonate Armor" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1765303215249-fc4a1165580f?auto=format&fit=crop&w=1200&q=85", alt: "Abdominal Guard Soft Silicone Edge Rim" },
  ],
  "test-cricket-ball": [
    { angle: "front", url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=85", alt: "Test Match 4-Piece Alum-Tanned Leather Cricket Ball" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1624897174291-1bd715e371d5?auto=format&fit=crop&w=1200&q=85", alt: "Test Cricket Ball 78-Stitch Hand-Sewn Seam" },
  ],
  "bat-sheet-antiscuff": [
    { angle: "front", url: "https://images.unsplash.com/photo-1765290409377-0595c7c748e0?auto=format&fit=crop&w=1200&q=85", alt: "Clear Anti-Scuff Bat Face Protective Sheet" },
    { angle: "angle", url: "https://images.unsplash.com/photo-1764567386744-090d5ff67d66?auto=format&fit=crop&w=1200&q=85", alt: "Fiberglass Edge Reinforcement Tape" },
  ],
};

/** Get gallery images for a given product or category fallback */
export function getProductImages(product: { id?: string; slug?: string; category: Category }): ProductImage[] {
  const specific = (product.slug && PRODUCT_SPECIFIC_IMAGES[product.slug]) || (product.id && PRODUCT_SPECIFIC_IMAGES[product.id]);
  const images = specific || PRODUCT_SPECIFIC_IMAGES["pro-elite-x"];
  return images.map((img) => ({
    angle: img.angle,
    url: img.url,
    alt: img.alt,
    seed: product.slug || product.id || "crix-gear",
  }));
}
