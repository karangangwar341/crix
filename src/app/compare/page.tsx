import { getProductsByCategory } from "@/lib/dal";
import CompareClient from "./CompareClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Bats — CRIX Cricket",
  description: "Compare technical willow specifications, edge profiles, sweet spots, and weights across CRIX cricket bats.",
};

export default async function ComparePage() {
  const bats = await getProductsByCategory("bats");
  return <CompareClient bats={bats} />;
}
