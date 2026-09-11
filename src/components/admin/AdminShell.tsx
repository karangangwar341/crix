"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  LayoutTemplate,
  Mail,
  Image as ImageIcon,
  Settings,
  ArrowUpRight,
  ShieldCheck,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/admin/LogoutButton";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers (CRM)", icon: Users },
  { href: "/admin/enquiries", label: "Enquiries", icon: Mail },
  { href: "/admin/cms", label: "CMS Pages", icon: LayoutTemplate },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-line bg-black px-5 py-7 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <Link href="/admin" className="font-display text-xl tracking-wider text-white">
              CRIX <span className="text-xs uppercase tracking-widest text-white/50 ml-1">Admin</span>
            </Link>
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/70">
              <ShieldCheck size={12} className="text-emerald-400" /> Protected
            </span>
          </div>

          <div className="mt-6 text-[10px] font-semibold uppercase tracking-wider text-white/40 px-3 mb-2">
            Management
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon size={17} className={active ? "text-black" : "text-white/60"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span>Live Storefront</span>
            <ArrowUpRight size={14} />
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top header */}
        <header className="flex items-center justify-between border-b border-line bg-black px-4 py-3.5 lg:hidden text-white">
          <Link href="/admin" className="font-display text-lg tracking-wider">
            CRIX <span className="text-white/50 text-xs">Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1 text-xs text-white/70 hover:text-white px-2 py-1"
            >
              <span>Storefront</span>
              <ArrowUpRight size={13} />
            </Link>
            <LogoutButton />
          </div>
        </header>

        {/* Mobile quick navigation tabs */}
        <nav className="flex overflow-x-auto border-b border-line bg-white px-2 py-2 text-xs lg:hidden no-scrollbar">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 font-medium",
                  active ? "bg-black text-white" : "text-ink-soft hover:text-ink"
                )}
              >
                <item.icon size={13} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="min-w-0 flex-1 p-6 lg:p-10 max-w-7xl">{children}</main>
      </div>
    </div>
  );
}
