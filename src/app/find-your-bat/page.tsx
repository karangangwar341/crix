import { getProductsByCategory } from "@/lib/dal";
import FindYourBatClient from "./FindYourBatClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Your Bat — CRIX Cricket",
  description: "Take the 5-question bat recommender to match your batting style, sweet spot, and weight pickup with the right CRIX blade.",
};

export default async function FindYourBatPage() {
  const bats = await getProductsByCategory("bats");
  return <FindYourBatClient bats={bats} />;
}
