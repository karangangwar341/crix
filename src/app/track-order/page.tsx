"use client";

import { useState } from "react";
import { Search, Package, Clock, CheckCircle2, Truck, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { trackGuestOrder } from "@/app/actions/storefront";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface TrackedOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: string | null;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

const STEPS = [
  { label: "Order Confirmed", desc: "Specifications verified & payment authorized" },
  { label: "Equipment Allocation", desc: "Willow cleft selected and prepped" },
  { label: "Quality Inspection", desc: "Balance tested & protective oiling" },
  { label: "Courier Dispatch", desc: "Handed to tracked courier service" },
  { label: "Delivered", desc: "Received at delivery destination" },
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackedOrder | null>(null);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const res = await trackGuestOrder(orderId, email);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else if (res?.order) {
      setResult(res.order);
    }
  }

  // Calculate current progress index based on status
  const getActiveStep = (status: string) => {
    switch (status.toLowerCase()) {
      case "fulfilled":
      case "delivered":
        return 4;
      case "dispatched":
      case "shipped":
        return 3;
      case "processing":
        return 2;
      default:
        return 1;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 lg:px-10">
      <div className="text-center">
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-ink-faint">
          Fulfillment Status
        </span>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Track Your Equipment</h1>
        <p className="mt-2 text-xs text-ink-soft max-w-md mx-auto">
          Enter your order reference code and email to follow the preparation and dispatch progress of your order.
        </p>
      </div>

      {/* Tracker Lookup Form */}
      <form
        onSubmit={handleTrack}
        className="mt-8 mx-auto max-w-xl rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-sm space-y-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-faint">
              Order Reference *
            </label>
            <input
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. CRIX-10245"
              className="w-full rounded-xl border border-line px-4 py-2.5 text-sm font-mono uppercase text-ink outline-none focus:border-ink"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-faint">
              Email Address *
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-line px-4 py-2.5 text-sm text-ink outline-none focus:border-ink"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-ink py-3 text-xs font-semibold uppercase tracking-wider text-bg hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg border-t-transparent" />
              Locating Shipment...
            </span>
          ) : (
            <>
              <Search size={14} />
              <span>Track Shipment</span>
            </>
          )}
        </button>
      </form>

      {/* Tracking Result Card */}
      {result && (
        <div className="mt-10 rounded-3xl border border-line bg-white p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-xl font-bold text-ink">{result.id}</h2>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
                  {result.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-faint">
                Placed on {new Date(result.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-ink-faint">Total Amount</span>
              <p className="font-display text-xl font-medium text-ink">{formatPrice(result.totalAmount)}</p>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-faint mb-6">
              Dispatch Progression
            </h3>
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {STEPS.map((step, idx) => {
                  const activeIdx = getActiveStep(result.status);
                  const isCompleted = idx < activeIdx;
                  const isCurrent = idx === activeIdx;

                  return (
                    <div key={step.label} className="relative flex flex-col items-start sm:items-center text-left sm:text-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                          isCompleted
                            ? "bg-ink text-bg"
                            : isCurrent
                            ? "border-2 border-ink bg-white text-ink"
                            : "border border-line bg-stone-50 text-ink-faint"
                        }`}
                      >
                        {isCompleted ? "✓" : idx + 1}
                      </div>
                      <p className="mt-2 text-xs font-semibold text-ink">{step.label}</p>
                      <p className="mt-0.5 text-[11px] text-ink-soft hidden sm:block">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-line pt-6 text-xs">
            <div className="rounded-2xl bg-stone-50 p-4">
              <span className="font-semibold uppercase tracking-wider text-ink-faint text-[10px] block mb-1">
                Destination Address
              </span>
              <p className="font-medium text-ink">{result.customerName}</p>
              <p className="text-ink-soft mt-0.5">{result.shippingAddress || "Standard Ground Delivery"}</p>
            </div>

            <div className="rounded-2xl bg-stone-50 p-4">
              <span className="font-semibold uppercase tracking-wider text-ink-faint text-[10px] block mb-1">
                Settlement & Tracking
              </span>
              <p className="font-medium text-ink">Payment Status: {result.paymentStatus}</p>
              <p className="text-ink-soft mt-0.5">Payment Method: {result.paymentMethod}</p>
              <p className="text-emerald-700 font-medium mt-1 flex items-center gap-1">
                <ShieldCheck size={13} /> Verified Delivery Chain
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-t border-line pt-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-faint mb-3">
              Equipment in this Shipment ({result.items.length})
            </h4>
            <div className="divide-y divide-line-soft rounded-2xl border border-line overflow-hidden">
              {result.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 text-xs bg-white">
                  <div>
                    <span className="font-medium text-ink">{item.title}</span>
                    <span className="ml-2 text-ink-faint">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-semibold text-ink">{formatPrice(item.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
