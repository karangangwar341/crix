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
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers (CRM)", href: "/admin/customers", icon: Users },
  { name: "Enquiries", href: "/admin/enquiries", icon: Mail },
  { name: "CMS Pages", href: "/admin/cms", icon: LayoutTemplate },
  { name: "Media Library", href: "/admin/media", icon: ImageIcon },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {nav.map((n) => {
        const isActive =
          n.href === "/admin"
            ? pathname === "/admin"
            : pathname === n.href || pathname?.startsWith(n.href + "/");

        return (
          <Link
            key={n.name}
            href={n.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-white text-black font-semibold shadow-sm"
                : "text-white/65 hover:bg-white/10 hover:text-white"
            )}
          >
            <n.icon size={17} className={isActive ? "text-black" : "text-white/60"} />
            {n.name}
          </Link>
        );
      })}
    </nav>
  );
}
