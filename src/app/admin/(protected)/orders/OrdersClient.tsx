"use client";

import { useState } from "react";
import { AdminOrder } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";
import { updateOrderStatus } from "@/app/actions/admin";

const statuses: AdminOrder["status"][] = ["Processing", "Fulfilled", "Pending", "Refunded"];

const statusBadgeStyles: Record<AdminOrder["status"], string> = {
  Fulfilled: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Processing: "bg-blue-50 text-blue-700 border-blue-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Refunded: "bg-neutral-100 text-neutral-500 border-neutral-200 line-through",
};

export default function OrdersClient({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: AdminOrder["status"]) => {
    setUpdatingId(id);
    await updateOrderStatus(id, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    setUpdatingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Orders & Fulfillment</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Manage online customer purchases, dispatch status, and order details.
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-neutral-50 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Items</th>
                <th className="px-5 py-3.5">Total Amount</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-semibold text-xs text-ink">{o.id}</td>
                  <td className="px-5 py-4 font-medium text-ink">{o.customer}</td>
                  <td className="px-5 py-4 text-xs text-ink-soft">{o.date}</td>
                  <td className="px-5 py-4 text-xs">{o.items} {o.items === 1 ? "unit" : "units"}</td>
                  <td className="px-5 py-4 font-semibold text-ink">{formatPrice(o.total)}</td>
                  <td className="px-5 py-4">
                    <select
                      value={o.status}
                      disabled={updatingId === o.id}
                      onChange={(evt) =>
                        handleStatusChange(o.id, evt.target.value as AdminOrder["status"])
                      }
                      className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold outline-none cursor-pointer transition-colors ${
                        statusBadgeStyles[o.status] || ""
                      }`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s} className="bg-white text-black">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
