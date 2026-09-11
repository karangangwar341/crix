import { getAdminOrders } from "@/lib/dal";
import { adminOrders as fallbackOrders } from "@/lib/data/orders";
import OrdersClient from "./OrdersClient";

export default async function AdminOrdersPage() {
  const { orders } = await getAdminOrders();

  const mapped =
    orders.length > 0
      ? orders.map((o: any) => ({
          id: o.id,
          customer: o.customer?.name || o.customerName,
          date: new Date(o.createdAt).toLocaleDateString("en-GB", {
            month: "short",
            day: "numeric",
          }),
          items: o.items?.length || 1,
          total: o.totalAmount,
          status: o.status as any,
        }))
      : fallbackOrders;

  return <OrdersClient initialOrders={mapped} />;
}
