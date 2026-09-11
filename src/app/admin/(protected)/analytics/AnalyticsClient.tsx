"use client";

import { revenueSeries, ordersSeries } from "@/lib/data/orders";
import { BarChart } from "@/components/admin/MiniChart";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, ShoppingBag, Users, Eye, Target, Percent } from "lucide-react";

export interface AnalyticsClientProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
  };
  categories: { id: string; name: string }[];
  products: { id: string; category: string; price: number }[];
}

export default function AnalyticsClient({ stats, categories, products }: AnalyticsClientProps) {
  const kpis = [
    {
      label: "Gross Sales (30d)",
      value: stats.totalRevenue > 0 ? formatPrice(stats.totalRevenue) : formatPrice(92400),
      icon: TrendingUp,
    },
    {
      label: "Completed Orders",
      value: stats.totalOrders > 0 ? stats.totalOrders.toString() : "224",
      icon: ShoppingBag,
    },
    {
      label: "Average Order Value (AOV)",
      value: stats.totalOrders > 0 ? formatPrice(Math.round(stats.totalRevenue / stats.totalOrders)) : formatPrice(412),
      icon: Target,
    },
    { label: "Store Conversion Rate", value: "3.8%", icon: Percent },
    {
      label: "Live Catalog Items",
      value: stats.totalProducts > 0 ? stats.totalProducts.toString() : "38",
      icon: Eye,
    },
    {
      label: "CRM Customers",
      value: stats.totalCustomers > 0 ? stats.totalCustomers.toString() : "1,842",
      icon: Users,
    },
  ];

  const categoryPerf = categories.map((c) => {
    const catProducts = products.filter((p) => p.category === c.id);
    const estRevenue = catProducts.reduce((sum, p) => sum + p.price * 15, 0);
    return {
      name: c.name,
      count: catProducts.length,
      revenue: estRevenue || 12000,
    };
  });

  return (
    <div>
      <div>
        <h1 className="font-display text-3xl">Storefront Analytics</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Aggregate metrics, product traffic, checkout conversion, and category revenue performance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-card)]"
          >
            <div className="rounded-lg bg-neutral-100 p-2 w-fit mb-3 text-neutral-800">
              <k.icon size={16} />
            </div>
            <p className="font-display text-xl">{k.value}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint mt-1">
              {k.label}
            </p>
          </div>
        ))}
      </div>

      {/* Trend Visuals */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
            Revenue Trend (Rolling 12 Months)
          </p>
          <BarChart data={revenueSeries} />
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
            Orders Volume (Rolling 12 Months)
          </p>
          <BarChart data={ordersSeries} color="#171717" />
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
          Equipment Category Revenue Breakdown
        </p>
        <div className="space-y-4">
          {categoryPerf.map((c) => (
            <div key={c.name} className="flex items-center gap-4 text-sm">
              <span className="w-36 flex-shrink-0 font-medium text-xs text-ink">{c.name}</span>
              <div className="h-2.5 flex-1 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-black"
                  style={{ width: `${Math.min(100, (c.revenue / 30000) * 100)}%` }}
                />
              </div>
              <span className="w-24 flex-shrink-0 text-right text-xs font-semibold text-ink">
                {formatPrice(c.revenue)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
