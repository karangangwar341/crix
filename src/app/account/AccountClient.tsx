"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  Package,
  MapPin,
  Heart,
  LogOut,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { updateCustomerProfile } from "@/app/actions/customer";
import { formatPrice } from "@/lib/utils";

const TABS = ["Orders", "Delivery Address", "Wishlist", "Account Details"] as const;

interface SerializedOrder {
  id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: string | null;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

interface AccountClientProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    totalSpent: number;
    ordersCount: number;
    createdAt: string;
  } | null;
  orders: SerializedOrder[];
  sessionUser: {
    name?: string | null;
    email?: string | null;
  };
}

export default function AccountClient({ customer, orders, sessionUser }: AccountClientProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Orders");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Profile Form State
  const [name, setName] = useState(customer?.name || sessionUser.name || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [address, setAddress] = useState(customer?.address || "");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveStatus(null);

    const res = await updateCustomerProfile({
      name,
      phone,
      address,
    });

    setSaving(false);
    if (res?.error) {
      setSaveStatus("Error: " + res.error);
    } else {
      setSaveStatus("Profile details updated successfully.");
      setTimeout(() => setSaveStatus(null), 4000);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "fulfilled":
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <CheckCircle2 size={12} /> Delivered
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            <Truck size={12} /> Processing
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
            <AlertCircle size={12} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 lg:px-10">
      {/* Header Profile Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-line bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-bg font-display text-xl">
            {(customer?.name || sessionUser.name || "C").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-medium text-ink">
                {customer?.name || sessionUser.name || "Valued Member"}
              </h1>
              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
                CRIX Club
              </span>
            </div>
            <p className="text-xs text-ink-soft">{customer?.email || sessionUser.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t border-line pt-4 text-xs sm:border-0 sm:pt-0">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-ink-faint">Total Orders</span>
            <span className="font-display text-base font-medium text-ink">
              {orders.length || customer?.ordersCount || 0}
            </span>
          </div>
          <div className="h-8 w-px bg-line" />
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-ink-faint">Lifetime Spend</span>
            <span className="font-display text-base font-medium text-ink">
              {formatPrice(customer?.totalSpent || orders.reduce((sum, o) => sum + o.totalAmount, 0))}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        {/* Navigation Sidebar */}
        <nav className="space-y-1 self-start rounded-2xl border border-line bg-white p-3">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-medium transition-colors ${
                tab === t
                  ? "bg-ink text-bg font-semibold"
                  : "text-ink-soft hover:bg-stone-50 hover:text-ink"
              }`}
            >
              {t === "Orders" && <Package size={15} />}
              {t === "Delivery Address" && <MapPin size={15} />}
              {t === "Wishlist" && <Heart size={15} />}
              {t === "Account Details" && <User size={15} />}
              <span>{t}</span>
            </button>
          ))}

          <div className="pt-3 border-t border-line-soft">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>

        {/* Tab Content Panel */}
        <div className="min-h-[400px]">
          {/* ORDERS TAB */}
          {tab === "Orders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-medium text-ink">Order History</h2>
                <span className="text-xs text-ink-faint">{orders.length} orders recorded</span>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white p-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-50 text-ink-faint">
                    <ShoppingBag size={24} />
                  </div>
                  <h3 className="mt-4 font-display text-base font-medium text-ink">No orders yet</h3>
                  <p className="mt-1 max-w-sm text-xs text-ink-soft">
                    You haven&apos;t placed any equipment orders yet. Explore our handcrafted bat collections and protective gear.
                  </p>
                  <Link
                    href="/bats"
                    className="mt-6 rounded-xl bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-bg hover:opacity-90"
                  >
                    Explore Handcrafted Bats
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => {
                    const isExpanded = expandedOrderId === o.id;
                    const dateStr = new Date(o.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });

                    return (
                      <div
                        key={o.id}
                        className="rounded-2xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-semibold text-ink">{o.id}</span>
                              {getStatusBadge(o.status)}
                            </div>
                            <p className="mt-1 text-xs text-ink-faint">Placed on {dateStr}</p>
                          </div>

                          <div className="flex items-center justify-between gap-4 sm:justify-end">
                            <div className="text-right">
                              <span className="text-xs text-ink-faint">Total</span>
                              <p className="font-display text-base font-semibold text-ink">
                                {formatPrice(o.totalAmount)}
                              </p>
                            </div>

                            <button
                              onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                              className="flex items-center gap-1 rounded-xl border border-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-stone-50"
                            >
                              <span>{isExpanded ? "Hide Details" : "View Items"}</span>
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </div>
                        </div>

                        {/* Expandable items breakdown */}
                        {isExpanded && (
                          <div className="mt-4 border-t border-line-soft pt-4">
                            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                              Items Ordered ({o.items.length})
                            </h4>
                            <div className="mt-2 divide-y divide-line-soft">
                              {o.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between py-2.5 text-xs"
                                >
                                  <div>
                                    <span className="font-medium text-ink">{item.title}</span>
                                    <span className="ml-2 text-ink-faint">Qty: {item.quantity}</span>
                                  </div>
                                  <span className="font-medium text-ink">
                                    {formatPrice(item.total)}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {o.shippingAddress && (
                              <div className="mt-3 rounded-xl bg-stone-50 p-3 text-xs text-ink-soft">
                                <span className="font-semibold text-ink">Shipping to:</span>{" "}
                                {o.shippingAddress}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* DELIVERY ADDRESS TAB */}
          {tab === "Delivery Address" && (
            <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="font-display text-lg font-medium text-ink">Default Shipping Address</h2>
              <p className="mt-1 text-xs text-ink-soft">
                This address will be pre-filled automatically during your future checkout sessions.
              </p>

              <form onSubmit={handleProfileSave} className="mt-6 space-y-4 max-w-lg">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-line px-4 py-2.5 text-sm text-ink outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7911 123456"
                    className="w-full rounded-xl border border-line px-4 py-2.5 text-sm text-ink outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    Postal Address
                  </label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, City, County, Postcode, Country"
                    className="w-full rounded-xl border border-line px-4 py-2.5 text-sm text-ink outline-none focus:border-ink resize-none"
                  />
                </div>

                {saveStatus && (
                  <div
                    className={`rounded-xl p-3 text-xs ${
                      saveStatus.startsWith("Error")
                        ? "bg-red-50 text-red-700"
                        : "bg-emerald-50 text-emerald-800"
                    }`}
                  >
                    {saveStatus}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-bg hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Delivery Address"}
                </button>
              </form>
            </div>
          )}

          {/* WISHLIST TAB */}
          {tab === "Wishlist" && (
            <div className="rounded-3xl border border-line bg-white p-8 shadow-sm text-center">
              <Heart size={32} className="mx-auto text-ink-faint" />
              <h3 className="mt-4 font-display text-base font-medium text-ink">Saved Equipment</h3>
              <p className="mt-1 text-xs text-ink-soft">
                View bats, gloves, and protective gear saved to your wishlist.
              </p>
              <Link
                href="/wishlist"
                className="mt-6 inline-block rounded-xl bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-bg hover:opacity-90"
              >
                Go to Wishlist Page →
              </Link>
            </div>
          )}

          {/* ACCOUNT DETAILS TAB */}
          {tab === "Account Details" && (
            <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="font-display text-lg font-medium text-ink">Profile & Security</h2>
              <p className="mt-1 text-xs text-ink-soft">Manage personal information and membership credentials.</p>

              <form onSubmit={handleProfileSave} className="mt-6 space-y-4 max-w-lg">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-line px-4 py-2.5 text-sm text-ink outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    Registered Email (Read-Only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={customer?.email || sessionUser.email || ""}
                    className="w-full rounded-xl border border-line bg-stone-100 px-4 py-2.5 text-sm text-ink-soft cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7911 123456"
                    className="w-full rounded-xl border border-line px-4 py-2.5 text-sm text-ink outline-none focus:border-ink"
                  />
                </div>

                {saveStatus && (
                  <div
                    className={`rounded-xl p-3 text-xs ${
                      saveStatus.startsWith("Error")
                        ? "bg-red-50 text-red-700"
                        : "bg-emerald-50 text-emerald-800"
                    }`}
                  >
                    {saveStatus}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-bg hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Profile Details"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
