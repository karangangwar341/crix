import { getAdminCustomers } from "@/lib/dal";
import { adminCustomers as fallbackCustomers } from "@/lib/data/orders";
import CustomersClient from "./CustomersClient";

export default async function AdminCustomersPage() {
  const { customers } = await getAdminCustomers();

  const mapped =
    customers.length > 0
      ? customers.map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          orders: c.ordersCount,
          spent: c.totalSpent,
          joined: new Date(c.createdAt).toLocaleDateString("en-GB", {
            month: "short",
            year: "numeric",
          }),
        }))
      : fallbackCustomers;

  return <CustomersClient initialCustomers={mapped} />;
}
