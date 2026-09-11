import { getProducts } from "@/lib/dal";
import WishlistClient from "./WishlistClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist — CRIX Cricket",
  description: "View and manage your saved cricket equipment and accessories.",
};

export default async function WishlistPage() {
  const products = await getProducts();
  return <WishlistClient products={products} />;
}
