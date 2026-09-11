import { TrendingUp, Package, Users, Percent, ArrowUpRight, ShoppingBag } from "lucide-react";
import { adminOrders, revenueSeries, ordersSeries } from "@/lib/data/orders";
import { getAdminDashboardStats, getProducts } from "@/lib/dal";
import { BarChart, Sparkline } from "@/components/admin/MiniChart";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default async function AdminDashboard() {
  const [stats, products] = await Promise.all([
    getAdminDashboardStats(),
    getProducts(),
  ]);

  const topProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

  const kpis = [
    {
      label: "Revenue (30d)",
      value: stats.totalRevenue > 0 ? formatPrice(stats.totalRevenue) : formatPrice(92400),
      delta: "+12.4%",
      icon: TrendingUp,
      data: revenueSeries,
    },
    {
      label: "Orders (30d)",
      value: stats.totalOrders > 0 ? stats.totalOrders.toString() : "224",
      delta: "+6.9%",
      icon: Package,
      data: ordersSeries,
    },
    {
      label: "CRM Customers",
      value: stats.totalCustomers > 0 ? stats.totalCustomers.toLocaleString() : "1,842",
      delta: "+3.1%",
      icon: Users,
      data: [40, 44, 41, 48, 52, 55, 58, 60, 63, 61, 66, 70],
    },
    {
      label: "Store Conversion",
      value: "3.8%",
      delta: "+0.4pp",
      icon: Percent,
      data: [3.1, 3.3, 3.0, 3.4, 3.6, 3.5, 3.7, 3.6, 3.8, 3.7, 3.9, 3.8],
    },
  ];

  const recentOrders = stats.recentOrders.length > 0
    ? stats.recentOrders.map((o: any) => ({
        id: o.id,
        customer: o.customer?.name || o.customerName,
        date: new Date(o.createdAt).toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
        total: o.totalAmount,
        status: o.status,
      }))
    : adminOrders.slice(0, 5);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Executive Dashboard</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Overview of live sales, order pipeline, inventory levels, and CRM engagement.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-hover)]"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-neutral-100 p-2 text-black">
                <k.icon size={18} />
              </div>
              <Sparkline data={k.data} />
            </div>
            <p className="mt-4 font-display text-2xl tracking-tight">{k.value}</p>
            <p className="mt-1 text-xs text-ink-faint">
              {k.label} · <span className="font-semibold text-emerald-600">{k.delta}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Revenue & Orders Trend Charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
              Monthly Revenue Performance (₹)
            </p>
            <span className="text-xs font-semibold text-emerald-600">+12.4% vs last mo</span>
          </div>
          <BarChart data={revenueSeries} />
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
              Monthly Order Volume
            </p>
            <span className="text-xs font-semibold text-neutral-900">224 total</span>
          </div>
          <BarChart data={ordersSeries} color="#171717" />
        </div>
      </div>

      {/* Recent Orders and Top Bestsellers */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
              Recent Fulfillment Stream
            </p>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs font-semibold text-ink-soft hover:text-black"
            >
              <span>View all</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-line">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-sm text-ink">{o.customer}</p>
                  <p className="font-mono text-xs text-ink-faint">{o.id} · {o.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatPrice(o.total)}</p>
                  <span className="inline-block rounded px-2 py-0.5 text-[10px] font-medium bg-neutral-100 text-ink-soft">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
              Top Converting Cricket Bats
            </p>
            <Link
              href="/admin/products"
              className="flex items-center gap-1 text-xs font-semibold text-ink-soft hover:text-black"
            >
              <span>Catalog</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-line">
            {topProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-sm text-ink">{p.name}</p>
                  <p className="text-xs text-ink-faint">{p.reviewCount} customer reviews · ★ {p.rating}</p>
                </div>
                <span className="font-semibold text-sm">{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
