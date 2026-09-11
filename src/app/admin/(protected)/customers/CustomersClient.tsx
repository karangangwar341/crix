"use client";

import { useState } from "react";
import { AdminCustomer } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";
import { Users, Mail, ShoppingBag, DollarSign } from "lucide-react";

export default function CustomersClient({ initialCustomers }: { initialCustomers: AdminCustomer[] }) {
  const [customers] = useState<AdminCustomer[]>(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Customer Relationship (CRM)</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Profiles, purchase frequency, lifetime value (LTV), and account activity.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Table */}
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[550px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line bg-neutral-50 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Orders</th>
                  <th className="px-5 py-3.5">Lifetime Spend</th>
                  <th className="px-5 py-3.5">Member Since</th>
                  <th className="px-5 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className={`cursor-pointer transition-colors ${
                      selectedCustomer?.id === c.id ? "bg-neutral-50" : "hover:bg-neutral-50/50"
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-ink">{c.name}</div>
                      <div className="text-xs text-ink-soft">{c.email}</div>
                    </td>
                    <td className="px-5 py-4 text-xs font-medium">{c.orders} orders</td>
                    <td className="px-5 py-4 font-semibold text-ink">{formatPrice(c.spent)}</td>
                    <td className="px-5 py-4 text-xs text-ink-faint">{c.joined}</td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-xs font-semibold text-neutral-900 underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Customer Profile Drawer */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
          {selectedCustomer ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center font-display text-lg">
                  {selectedCustomer.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-display text-lg">{selectedCustomer.name}</h2>
                  <p className="text-xs text-ink-soft">{selectedCustomer.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-line p-3 bg-neutral-50/50">
                  <div className="flex items-center gap-1.5 text-ink-faint text-[11px] uppercase font-semibold">
                    <ShoppingBag size={13} /> Orders
                  </div>
                  <div className="mt-1 text-lg font-bold">{selectedCustomer.orders}</div>
                </div>

                <div className="rounded-xl border border-line p-3 bg-neutral-50/50">
                  <div className="flex items-center gap-1.5 text-ink-faint text-[11px] uppercase font-semibold">
                    <DollarSign size={13} /> Total Spend
                  </div>
                  <div className="mt-1 text-lg font-bold">{formatPrice(selectedCustomer.spent)}</div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
                  CRM Notes & VIP Status
                </h3>
                <div className="rounded-xl border border-line p-3 text-xs text-ink-soft bg-neutral-50/50">
                  {selectedCustomer.spent > 1500
                    ? "⭐ VIP Tier: High-value bespoke bat commissions & priority dispatch."
                    : "Standard customer account. Subscribed to product updates."}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
                  Contact Action
                </h3>
                <a
                  href={`mailto:${selectedCustomer.email}`}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-black px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors"
                >
                  <Mail size={14} /> Send Email
                </a>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center text-ink-soft text-xs">
              <Users size={32} className="text-neutral-300 mb-2" />
              Select a customer to view their CRM history and value metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
