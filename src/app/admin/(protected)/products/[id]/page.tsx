import { notFound } from "next/navigation";
import { getProductById } from "@/lib/dal";
import { allProducts } from "@/lib/data/products";
import EditProductClient from "./EditProductClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = (await getProductById(id)) || allProducts.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <EditProductClient initialProduct={product} />;
}
