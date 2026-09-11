import { Product, ProductImage, BatAngle } from "@/lib/types";
import { getProductImages } from "./productImages";

const BAT_ANGLES: BatAngle[] = [
  "front",
  "back",
  "front-right",
  "left",
  "toe",
  "handle",
  "grain-closeup",
  "edge",
  "spine",
  "sticker",
];

function batImages(seed: string, slug?: string): ProductImage[] {
  const photoImages = getProductImages({ slug: slug || seed, category: "bats" });
  const photoMap = new Map(photoImages.map((p) => [p.angle, p.url]));
  return BAT_ANGLES.map((angle) => ({
    angle,
    seed,
    url: photoMap.get(angle) || (angle === "front" || angle === "front-right" ? photoImages[0]?.url : photoImages[1]?.url),
  }));
}

function variant(weights: string[], base: number) {
  return weights.map((w, i) => ({
    id: `w-${w}`,
    label: `${w} lb`,
    priceDelta: i === Math.floor(weights.length / 2) ? 0 : 0,
    inStock: true,
  }));
}

export const bats: Product[] = [
  {
    id: "bat-pro-elite-x",
    slug: "pro-elite-x",
    name: "Pro Elite X",
    series: "Signature",
    category: "bats",
    price: 499,
    compareAtPrice: 579,
    shortDescription: "The flagship full-profile bat built for players who hit through the line.",
    description:
      "The Pro Elite X is our flagship signature bat, pressed from hand-selected Grade 1 English willow. A full profile and pronounced spine deliver a large, forgiving hitting area without sacrificing pickup, making it the bat of choice for professional order batters who want to dominate the middle overs.",
    images: batImages("pro-elite-x"),
    specifications: {
      willow: "Grade 1 English Willow",
      willowGrade: 1,
      weight: "2.10 - 2.12 lb",
      weightMinOz: 44.5,
      weightMaxOz: 45.5,
      bladeLength: 216,
      bladeWidth: 108,
      edge: 40,
      spine: 64,
      sweetSpot: "Mid",
      pickup: "Light",
      balance: "Mid",
      profile: "Full Profile",
      handle: "Semi-Oval",
      toe: "Traditional",
      grains: "8-10",
      playingStyle: ["Power", "All-round"],
      experience: ["Club", "Professional"],
    },
    variants: variant(["2.8", "2.9", "2.10", "2.11", "3.0"], 499),
    stock: 24,
    rating: 4.9,
    reviewCount: 182,
    badges: ["Bestseller", "Signature"],
    featured: true,
    bestseller: true,
    colorway: { willowTone: "#ead9ad", accent: "#8a1f2b" },
  },
  {
    id: "bat-carbon-shield",
    slug: "pro-carbon-shield",
    name: "Pro Carbon Shield",
    series: "Player",
    category: "bats",
    price: 389,
    shortDescription: "Mid-profile control bat with a low, punchy sweet spot.",
    description:
      "Designed for players who value timing over brute force, the Carbon Shield carries its sweet spot low on the blade, rewarding precise footwork with exceptional feel through the crease.",
    images: batImages("carbon-shield"),
    specifications: {
      willow: "Grade 1 English Willow",
      willowGrade: 1,
      weight: "2.9 - 2.11 lb",
      weightMinOz: 43,
      weightMaxOz: 44.5,
      bladeLength: 213,
      bladeWidth: 112,
      edge: 38,
      spine: 60,
      sweetSpot: "Low",
      pickup: "Balanced",
      balance: "Low",
      profile: "Mid Profile",
      handle: "Oval",
      toe: "Rounded",
      grains: "7-9",
      playingStyle: ["Control", "All-round"],
      experience: ["Club", "Professional"],
    },
    variants: variant(["2.7", "2.8", "2.9", "2.10"], 389),
    stock: 31,
    rating: 4.7,
    reviewCount: 96,
    badges: ["Player Series"],
    featured: true,
    colorway: { willowTone: "#e3d1a0", accent: "#14213d" },
  },
  {
    id: "bat-kashmir-forge",
    slug: "kashmir-forge",
    name: "Kashmir Forge",
    series: "Foundation",
    category: "bats",
    price: 179,
    shortDescription: "Durable Kashmir willow bat built for high-volume club cricket.",
    description:
      "Denser and more durable than English willow, the Kashmir Forge is built for players who train and play often. A powerful pickup rewards attacking strokeplay at a fraction of the price of our English willow range.",
    images: batImages("kashmir-forge"),
    specifications: {
      willow: "Premium Kashmir Willow",
      willowGrade: "Kashmir",
      weight: "2.11 - 3.0 lb",
      weightMinOz: 45,
      weightMaxOz: 48,
      bladeLength: 218,
      bladeWidth: 118,
      edge: 36,
      spine: 58,
      sweetSpot: "Mid",
      pickup: "Powerful",
      balance: "High",
      profile: "Full Profile",
      handle: "Round",
      toe: "Traditional",
      grains: "4-6",
      playingStyle: ["Power"],
      experience: ["Beginner", "Club"],
    },
    variants: variant(["2.9", "2.10", "2.11", "3.0"], 179),
    stock: 58,
    rating: 4.4,
    reviewCount: 214,
    badges: ["Best Value"],
    colorway: { willowTone: "#d8c48d", accent: "#3d3d3d" },
  },
  {
    id: "bat-limited-heritage",
    slug: "heritage-limited",
    name: "Heritage Limited",
    series: "Limited Edition",
    category: "bats",
    price: 899,
    shortDescription: "A numbered limited run of 100, pressed from 12-year-seasoned willow.",
    description:
      "Only 100 bats are pressed each season from our reserve stock of English willow, aged for twelve years in our Kent store. Each bat is individually numbered and hand-finished by our master craftsman.",
    images: batImages("heritage-limited"),
    specifications: {
      willow: "Grade 1+ Reserve English Willow",
      willowGrade: 1,
      weight: "2.10 - 2.11 lb",
      weightMinOz: 44.5,
      weightMaxOz: 45,
      bladeLength: 216,
      bladeWidth: 109,
      edge: 42,
      spine: 66,
      sweetSpot: "Mid",
      pickup: "Light",
      balance: "Mid",
      profile: "Full Profile",
      handle: "Semi-Oval",
      toe: "Traditional",
      grains: "10-12",
      playingStyle: ["Power", "Control", "All-round"],
      experience: ["Professional"],
    },
    variants: variant(["2.9", "2.10", "2.11"], 899),
    stock: 6,
    rating: 5.0,
    reviewCount: 28,
    badges: ["Limited Edition", "Numbered"],
    featured: true,
    new: true,
    colorway: { willowTone: "#f2e6c2", accent: "#b8860b" },
  },
  {
    id: "bat-junior-academy",
    slug: "academy-junior",
    name: "Academy Junior",
    series: "Foundation",
    category: "bats",
    price: 129,
    shortDescription: "Lightweight academy bat built for developing players.",
    description:
      "A true-to-scale, lightweight bat built for junior players learning technique. Light pickup and a generous profile forgive mistimed shots while technique develops.",
    images: batImages("academy-junior"),
    specifications: {
      willow: "Grade 2 English Willow",
      willowGrade: 2,
      weight: "2.4 - 2.7 lb",
      weightMinOz: 38,
      weightMaxOz: 43,
      bladeLength: 190,
      bladeWidth: 104,
      edge: 32,
      spine: 52,
      sweetSpot: "Mid",
      pickup: "Light",
      balance: "Mid",
      profile: "Full Profile",
      handle: "Round",
      toe: "Rounded",
      grains: "6-8",
      playingStyle: ["All-round"],
      experience: ["Beginner"],
    },
    variants: variant(["Harrow", "2.4", "2.5", "2.6"], 129),
    stock: 44,
    rating: 4.6,
    reviewCount: 71,
    badges: ["Junior"],
    colorway: { willowTone: "#e8dcae", accent: "#2f5233" },
  },
  {
    id: "bat-power-drive",
    slug: "power-drive-max",
    name: "Power Drive Max",
    series: "Player",
    category: "bats",
    price: 349,
    shortDescription: "A high sweet spot bat built for six-hitting power.",
    description:
      "Mass concentrated high on the blade turns the Power Drive Max into a lofted-shot specialist, built for batters who play white-ball cricket with intent from ball one.",
    images: batImages("power-drive"),
    specifications: {
      willow: "Grade 1 English Willow",
      willowGrade: 1,
      weight: "2.11 - 3.0 lb",
      weightMinOz: 45,
      weightMaxOz: 48,
      bladeLength: 217,
      bladeWidth: 120,
      edge: 44,
      spine: 68,
      sweetSpot: "High",
      pickup: "Powerful",
      balance: "High",
      profile: "Full Profile",
      handle: "Round",
      toe: "Square",
      grains: "7-9",
      playingStyle: ["Power"],
      experience: ["Club", "Professional"],
    },
    variants: variant(["2.10", "2.11", "3.0", "3.1"], 349),
    stock: 19,
    rating: 4.6,
    reviewCount: 63,
    badges: ["Player Series"],
    colorway: { willowTone: "#dfc98f", accent: "#8a1f2b" },
  },
  {
    id: "bat-classic-control",
    slug: "classic-control",
    name: "Classic Control",
    series: "Heritage",
    category: "bats",
    price: 429,
    shortDescription: "A thin-profile timer's bat with a traditional feel.",
    description:
      "Built for the purist. A thin profile and low pickup weight recall the classic bats of the game's great technicians, rewarding precise timing over raw power.",
    images: batImages("classic-control"),
    specifications: {
      willow: "Grade 1 English Willow",
      willowGrade: 1,
      weight: "2.7 - 2.9 lb",
      weightMinOz: 42,
      weightMaxOz: 44,
      bladeLength: 213,
      bladeWidth: 106,
      edge: 34,
      spine: 56,
      sweetSpot: "Low",
      pickup: "Light",
      balance: "Low",
      profile: "Thin Profile",
      handle: "Oval",
      toe: "Traditional",
      grains: "9-11",
      playingStyle: ["Control"],
      experience: ["Club", "Professional"],
    },
    variants: variant(["2.6", "2.7", "2.8", "2.9"], 429),
    stock: 15,
    rating: 4.8,
    reviewCount: 54,
    badges: ["Heritage"],
    colorway: { willowTone: "#f0e4bf", accent: "#14213d" },
  },
  {
    id: "bat-keeper-edge",
    slug: "keeper-edge",
    name: "Keeper Edge",
    series: "Player",
    category: "bats",
    price: 299,
    shortDescription: "A quick-handed mid-profile bat for lower-order keepers.",
    description:
      "Balanced for fast hands and improvised strokeplay, the Keeper Edge is designed with wicketkeeper-batters in mind — light enough for late overs, forgiving enough for the unexpected.",
    images: batImages("keeper-edge"),
    specifications: {
      willow: "Grade 2 English Willow",
      willowGrade: 2,
      weight: "2.8 - 2.10 lb",
      weightMinOz: 42.5,
      weightMaxOz: 44.5,
      bladeLength: 212,
      bladeWidth: 111,
      edge: 37,
      spine: 59,
      sweetSpot: "Mid",
      pickup: "Balanced",
      balance: "Mid",
      profile: "Mid Profile",
      handle: "Semi-Oval",
      toe: "Rounded",
      grains: "6-8",
      playingStyle: ["All-round", "Control"],
      experience: ["Club"],
    },
    variants: variant(["2.7", "2.8", "2.9", "2.10"], 299),
    stock: 27,
    rating: 4.5,
    reviewCount: 39,
    badges: [],
    colorway: { willowTone: "#e6d5a3", accent: "#3d3d3d" },
  },
  {
    id: "bat-vanguard-pro",
    slug: "vanguard-pro",
    name: "Vanguard Pro",
    series: "Player",
    category: "bats",
    price: 459,
    shortDescription: "All-round full profile bat balanced for every format.",
    description:
      "A do-it-all bat built for players who move between formats. Balanced pickup, a mid-to-high sweet spot and a full profile make the Vanguard Pro equally at home defending a red ball or clearing the rope.",
    images: batImages("vanguard-pro"),
    specifications: {
      willow: "Grade 1 English Willow",
      willowGrade: 1,
      weight: "2.9 - 2.11 lb",
      weightMinOz: 43,
      weightMaxOz: 45,
      bladeLength: 215,
      bladeWidth: 114,
      edge: 41,
      spine: 63,
      sweetSpot: "Mid",
      pickup: "Balanced",
      balance: "Mid",
      profile: "Full Profile",
      handle: "Semi-Oval",
      toe: "Traditional",
      grains: "8-10",
      playingStyle: ["All-round", "Power"],
      experience: ["Club", "Professional"],
    },
    variants: variant(["2.8", "2.9", "2.10", "2.11"], 459),
    stock: 22,
    rating: 4.8,
    reviewCount: 88,
    badges: ["Bestseller"],
    bestseller: true,
    colorway: { willowTone: "#ecd9ab", accent: "#8a1f2b" },
  },
  {
    id: "bat-featherweight-pro",
    slug: "featherweight-pro",
    name: "Featherweight Pro",
    series: "Player",
    category: "bats",
    price: 419,
    shortDescription: "Ultra-light pickup bat for the fastest hands in the game.",
    description:
      "Aggressive willow removal from the back of the blade drops the pickup weight dramatically without shrinking the profile, letting you generate bat speed most blades can't match.",
    images: batImages("featherweight-pro"),
    specifications: {
      willow: "Grade 1 English Willow",
      willowGrade: 1,
      weight: "2.7 - 2.8 lb",
      weightMinOz: 41.5,
      weightMaxOz: 43,
      bladeLength: 214,
      bladeWidth: 113,
      edge: 39,
      spine: 61,
      sweetSpot: "Mid",
      pickup: "Light",
      balance: "Low",
      profile: "Mid Profile",
      handle: "Oval",
      toe: "Rounded",
      grains: "9-11",
      playingStyle: ["Control", "All-round"],
      experience: ["Club", "Professional"],
    },
    variants: variant(["2.6", "2.7", "2.8"], 419),
    stock: 17,
    rating: 4.7,
    reviewCount: 45,
    badges: ["New"],
    new: true,
    colorway: { willowTone: "#eadec0", accent: "#14213d" },
  },
].map((b) => {
  const imgs = batImages(b.slug, b.slug);
  const inrPrice = b.price < 2000 ? b.price * 100 : b.price;
  const inrCompare = b.compareAtPrice ? (b.compareAtPrice < 2000 ? b.compareAtPrice * 100 : b.compareAtPrice) : undefined;
  return {
    ...b,
    price: inrPrice,
    compareAtPrice: inrCompare,
    images: imgs,
    imageUrl: imgs[0]?.url,
  } as Product;
});

interface SimpleProductInput {
  id: string;
  slug: string;
  name: string;
  category: Product["category"];
  subcategory?: string;
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  description: string;
  rating: number;
  reviewCount: number;
  stock: number;
  badges?: string[];
  featured?: boolean;
  bestseller?: boolean;
  new?: boolean;
  accent: string;
  tone: string;
}

function simpleProduct(input: SimpleProductInput): Product {
  const images = getProductImages({ id: input.id, slug: input.slug, category: input.category });
  const inrPrice = input.price < 2000 ? input.price * 100 : input.price;
  const inrCompare = input.compareAtPrice ? (input.compareAtPrice < 2000 ? input.compareAtPrice * 100 : input.compareAtPrice) : undefined;
  return {
    id: input.id,
    slug: input.slug,
    name: input.name,
    category: input.category,
    subcategory: input.subcategory,
    price: inrPrice,
    compareAtPrice: inrCompare,
    shortDescription: input.shortDescription,
    description: input.description,
    images: images.length > 0 ? images : [{ angle: "front", seed: input.id }],
    imageUrl: images[0]?.url,
    variants: [{ id: "os", label: "One Size", priceDelta: 0, inStock: true }],
    stock: input.stock,
    rating: input.rating,
    reviewCount: input.reviewCount,
    badges: input.badges ?? [],
    featured: input.featured,
    bestseller: input.bestseller,
    new: input.new,
    colorway: { willowTone: input.tone, accent: input.accent },
  };
}

export const battingGloves: Product[] = [
  { id: "glv-pro-elite", slug: "pro-elite-gloves", name: "Pro Elite Gloves", price: 89, rating: 4.8, reviewCount: 64, stock: 40, badges: ["Bestseller"], bestseller: true, accent: "#8a1f2b", tone: "#f4efe4" },
  { id: "glv-carbon-flex", slug: "carbon-flex-gloves", name: "Carbon Flex Gloves", price: 74, rating: 4.6, reviewCount: 38, stock: 33, accent: "#14213d", tone: "#f4efe4" },
  { id: "glv-classic-leather", slug: "classic-leather-gloves", name: "Classic Leather Gloves", price: 64, rating: 4.5, reviewCount: 51, stock: 28, accent: "#3d3d3d", tone: "#f4efe4" },
  { id: "glv-junior-guard", slug: "junior-guard-gloves", name: "Junior Guard Gloves", price: 39, rating: 4.4, reviewCount: 22, stock: 50, badges: ["Junior"], accent: "#2f5233", tone: "#f4efe4" },
  { id: "glv-power-grip", slug: "power-grip-gloves", name: "Power Grip Gloves", price: 79, rating: 4.7, reviewCount: 29, stock: 18, new: true, accent: "#b8860b", tone: "#f4efe4" },
  { id: "glv-test-pro", slug: "test-pro-gloves", name: "Test Pro Gloves", price: 99, rating: 4.9, reviewCount: 47, stock: 12, badges: ["Player Series"], accent: "#8a1f2b", tone: "#f4efe4" },
].map((g) => simpleProduct({ ...g, category: "batting-gloves", description: `${g.name} — engineered multi-density foam padding with a premium leather palm for control and protection.`, shortDescription: "Multi-density protection with premium feel." }));

export const battingPads: Product[] = [
  { id: "pad-pro-elite", slug: "pro-elite-pads", name: "Pro Elite Pads", price: 119, rating: 4.8, reviewCount: 58, stock: 30, bestseller: true, accent: "#8a1f2b", tone: "#f4efe4" },
  { id: "pad-ultralight", slug: "ultralight-pads", name: "Ultralight Pads", price: 139, rating: 4.7, reviewCount: 33, stock: 20, new: true, accent: "#14213d", tone: "#f4efe4" },
  { id: "pad-classic-cane", slug: "classic-cane-pads", name: "Classic Cane Pads", price: 99, rating: 4.5, reviewCount: 41, stock: 26, accent: "#3d3d3d", tone: "#f4efe4" },
  { id: "pad-junior-guard", slug: "junior-guard-pads", name: "Junior Guard Pads", price: 59, rating: 4.4, reviewCount: 19, stock: 44, badges: ["Junior"], accent: "#2f5233", tone: "#f4efe4" },
  { id: "pad-keeper-pro", slug: "keeper-pro-pads", name: "Keeper Pro Pads", price: 129, rating: 4.6, reviewCount: 24, stock: 15, accent: "#b8860b", tone: "#f4efe4" },
].map((p) => simpleProduct({ ...p, category: "batting-pads", description: `${p.name} — ultra-light shell technology with high-density protective inserts.`, shortDescription: "Light, fast, certain protection." }));

export const helmets: Product[] = [
  { id: "hlm-titan-pro", slug: "titan-pro-helmet", name: "Titan Pro Helmet", price: 179, rating: 4.9, reviewCount: 72, stock: 22, badges: ["Bestseller"], bestseller: true, accent: "#8a1f2b", tone: "#f4efe4" },
  { id: "hlm-carbon-shell", slug: "carbon-shell-helmet", name: "Carbon Shell Helmet", price: 219, rating: 4.8, reviewCount: 35, stock: 14, new: true, accent: "#14213d", tone: "#f4efe4" },
  { id: "hlm-classic-guard", slug: "classic-guard-helmet", name: "Classic Guard Helmet", price: 149, rating: 4.6, reviewCount: 48, stock: 25, accent: "#3d3d3d", tone: "#f4efe4" },
  { id: "hlm-junior-shield", slug: "junior-shield-helmet", name: "Junior Shield Helmet", price: 99, rating: 4.5, reviewCount: 27, stock: 30, badges: ["Junior"], accent: "#2f5233", tone: "#f4efe4" },
].map((h) => simpleProduct({ ...h, category: "helmets", description: `${h.name} — British safety standard certified shell with a titanium-reinforced grille.`, shortDescription: "Certified, uncompromising head protection." }));

export const bags: Product[] = [
  { id: "bag-pro-wheelie", slug: "pro-wheelie-bag", name: "Pro Wheelie Kit Bag", price: 249, rating: 4.8, reviewCount: 61, stock: 16, bestseller: true, accent: "#8a1f2b", tone: "#f4efe4" },
  { id: "bag-duffle-classic", slug: "duffle-classic-bag", name: "Duffle Classic Bag", price: 129, rating: 4.6, reviewCount: 44, stock: 24, accent: "#14213d", tone: "#f4efe4" },
  { id: "bag-backpack-pro", slug: "backpack-pro", name: "Backpack Pro", price: 99, rating: 4.7, reviewCount: 38, stock: 32, new: true, accent: "#3d3d3d", tone: "#f4efe4" },
  { id: "bag-junior-holdall", slug: "junior-holdall", name: "Junior Holdall", price: 69, rating: 4.4, reviewCount: 21, stock: 27, badges: ["Junior"], accent: "#2f5233", tone: "#f4efe4" },
  { id: "bag-coffin-pro", slug: "coffin-pro-bag", name: "Coffin Pro Bag", price: 349, rating: 4.9, reviewCount: 17, stock: 8, badges: ["Player Series"], accent: "#b8860b", tone: "#f4efe4" },
].map((b) => simpleProduct({ ...b, category: "bags", description: `${b.name} — technical fabric construction built for daily professional use.`, shortDescription: "Carry it all, effortlessly." }));

export const accessories: Product[] = [
  { id: "acc-grip-pro", slug: "pro-grip-pack", name: "Pro Grip Pack", price: 12, rating: 4.7, reviewCount: 112, stock: 200, bestseller: true, accent: "#8a1f2b", tone: "#f4efe4" },
  { id: "acc-mallet", slug: "bat-mallet", name: "Bat Mallet", price: 24, rating: 4.6, reviewCount: 88, stock: 60, accent: "#14213d", tone: "#f4efe4" },
  { id: "acc-care-kit", slug: "bat-care-kit", name: "Bat Care Kit", price: 34, rating: 4.8, reviewCount: 65, stock: 45, accent: "#3d3d3d", tone: "#f4efe4" },
  { id: "acc-thigh-guard", slug: "thigh-guard", name: "Thigh Guard", price: 29, rating: 4.5, reviewCount: 40, stock: 55, accent: "#2f5233", tone: "#f4efe4" },
  { id: "acc-arm-guard", slug: "arm-guard", name: "Arm Guard", price: 22, rating: 4.4, reviewCount: 31, stock: 58, accent: "#b8860b", tone: "#f4efe4" },
  { id: "acc-abdo-guard", slug: "abdo-guard", name: "Abdo Guard", price: 15, rating: 4.5, reviewCount: 24, stock: 70, accent: "#8a1f2b", tone: "#f4efe4" },
  { id: "acc-ball-test", slug: "test-cricket-ball", name: "Test Match Ball", price: 32, rating: 4.9, reviewCount: 53, stock: 90, badges: ["Pro Grade"], accent: "#14213d", tone: "#f4efe4" },
  { id: "acc-bat-sheet", slug: "bat-sheet-antiscuff", name: "Anti-Scuff Sheet", price: 9, rating: 4.3, reviewCount: 27, stock: 150, accent: "#3d3d3d", tone: "#f4efe4" },
].map((a) => simpleProduct({ ...a, category: "accessories", description: `${a.name} — the small tools of serious cricket, made to a professional standard.`, shortDescription: "The finer details." }));

export const allProducts: Product[] = [...bats, ...battingGloves, ...battingPads, ...helmets, ...bags, ...accessories];

export function getProductBySlug(slug: string) {
  return allProducts.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string) {
  return allProducts.filter((p) => p.category === category);
}

export function getRelatedBats(id: string, count = 4) {
  return bats.filter((b) => b.id !== id).slice(0, count);
}
