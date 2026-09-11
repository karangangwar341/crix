import { redirect } from "next/navigation";
import { getCustomerDashboardData } from "@/app/actions/customer";
import AccountClient from "./AccountClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account — CRIX Cricket & Sports",
  description: "View your equipment orders, update delivery addresses, and manage your account details.",
};

export default async function AccountPage() {
  const data = await getCustomerDashboardData();

  if (!data) {
    redirect("/login?callbackUrl=/account");
  }

  // Serialize dates for Client Component safety
  const serializedCustomer = data.customer
    ? {
        id: data.customer.id,
        name: data.customer.name,
        email: data.customer.email,
        phone: data.customer.phone,
        address: data.customer.address,
        totalSpent: data.customer.totalSpent,
        ordersCount: data.customer.ordersCount,
        createdAt: data.customer.createdAt.toISOString(),
      }
    : null;

  const serializedOrders = data.orders.map((o) => ({
    id: o.id,
    createdAt: o.createdAt.toISOString(),
    totalAmount: o.totalAmount,
    status: o.status,
    paymentStatus: o.paymentStatus,
    paymentMethod: o.paymentMethod,
    shippingAddress: o.shippingAddress,
    items: o.items.map((i) => ({
      id: i.id,
      title: i.title,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      total: i.total,
    })),
  }));

  return (
    <AccountClient
      customer={serializedCustomer}
      orders={serializedOrders}
      sessionUser={data.sessionUser}
    />
  );
}
