// Centralized product & content data model.
// Designed so a future CMS/backend can populate these shapes without UI changes.

export type Category =
  | "bats"
  | "batting-gloves"
  | "batting-pads"
  | "helmets"
  | "bags"
  | "accessories";

export type BatAngle =
  | "front"
  | "front-right"
  | "right"
  | "back-right"
  | "back"
  | "back-left"
  | "left"
  | "front-left"
  | "toe"
  | "handle"
  | "grain-closeup"
  | "edge"
  | "spine"
  | "sticker";

export interface ProductImage {
  angle: BatAngle | string;
  /** seed used by the generative BatGlyph renderer in place of a real photo */
  seed?: string;
  /** Direct high-resolution photography URL */
  url?: string;
  alt?: string;
}

export interface BatSpecifications {
  willow: string;
  willowGrade: 1 | 2 | 3 | "Kashmir";
  weight: string; // display range, e.g. "2.10 - 2.12 lb"
  weightMinOz: number;
  weightMaxOz: number;
  bladeLength: number; // mm
  bladeWidth: number; // mm
  edge: number; // mm
  spine: number; // mm
  sweetSpot: "Low" | "Mid" | "High";
  pickup: "Light" | "Balanced" | "Powerful";
  balance: "Low" | "Mid" | "High";
  profile: "Full Profile" | "Mid Profile" | "Thin Profile";
  handle: "Oval" | "Semi-Oval" | "Round" | "Octagonal";
  toe: "Traditional" | "Rounded" | "Square";
  grains: string; // "8-10"
  playingStyle: ("Power" | "Control" | "All-round")[];
  experience: ("Beginner" | "Club" | "Professional")[];
}

export interface ProductVariant {
  id: string;
  label: string; // e.g. weight "2.10 lb" or size
  priceDelta: number;
  inStock: boolean;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  verified: boolean;
  rating: number;
  title: string;
  body: string;
  tags: ("Performance" | "Pickup" | "Balance" | "Looks")[];
  date: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  series?: string;
  category: Category;
  subcategory?: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  shortDescription: string;
  images: ProductImage[];
  imageUrl?: string;
  specifications?: BatSpecifications;
  variants: ProductVariant[];
  stock: number;
  rating: number;
  reviewCount: number;
  badges: string[];
  featured?: boolean;
  bestseller?: boolean;
  new?: boolean;
  colorway: {
    willowTone: string; // base wood tone hex
    accent: string; // sticker / accent hex
  };
}

export interface CategoryDef {
  id: Category;
  name: string;
  tagline: string;
  heroSeed: string;
  description: string;
}

export interface Player {
  id: string;
  name: string;
  role: string;
  batModel: string;
  quote: string;
  seed: string;
}

export interface HomepageContent {
  hero: {
    eyebrow: string;
    headline: string;
    subheading: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  bestsellerProductId: string;
}
