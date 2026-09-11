import { getAdminDashboardStats, getCategories, getProducts } from "@/lib/dal";
import AnalyticsClient from "./AnalyticsClient";

export default async function AdminAnalyticsPage() {
  const [stats, categories, products] = await Promise.all([
    getAdminDashboardStats(),
    getCategories(),
    getProducts(),
  ]);

  return (
    <AnalyticsClient
      stats={stats}
      categories={categories}
      products={products.map((p) => ({ id: p.id, category: p.category, price: p.price }))}
    />
  );
}
