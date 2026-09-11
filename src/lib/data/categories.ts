import { CategoryDef } from "@/lib/types";

export const categories: CategoryDef[] = [
  {
    id: "bats",
    name: "Bats",
    tagline: "Willow, engineered.",
    heroSeed: "bats",
    description:
      "English and Kashmir willow bats, graded and pressed by hand for a specific weight, pickup and profile.",
  },
  {
    id: "batting-gloves",
    name: "Batting Gloves",
    tagline: "Feel, protected.",
    heroSeed: "gloves",
    description: "Multi-density foam and premium leather palms for control without compromise.",
  },
  {
    id: "batting-pads",
    name: "Batting Pads",
    tagline: "Light. Fast. Certain.",
    heroSeed: "pads",
    description: "Ultra-light shell technology engineered for the modern game's speed.",
  },
  {
    id: "helmets",
    name: "Helmets",
    tagline: "Certified. Uncompromising.",
    heroSeed: "helmets",
    description: "British and Australian safety standard helmets with a titanium-reinforced grille.",
  },
  {
    id: "bags",
    name: "Kit Bags",
    tagline: "Carry it all, effortlessly.",
    heroSeed: "bags",
    description: "Wheeled and duffle kit bags built from technical fabrics for daily professional use.",
  },
  {
    id: "accessories",
    name: "Accessories",
    tagline: "The finer details.",
    heroSeed: "accessories",
    description: "Grips, bat mallets, care kits and the small tools of serious cricket.",
  },
];

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}
