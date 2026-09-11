import { getProducts } from "@/lib/dal";
import { allProducts as fallbackProducts } from "@/lib/data/products";
import ProductsClient from "./ProductsClient";

export default async function AdminProductsPage() {
  const products = await getProducts();
  const initialProducts = products.length > 0 ? products : fallbackProducts;

  return <ProductsClient initialProducts={initialProducts} />;
}
