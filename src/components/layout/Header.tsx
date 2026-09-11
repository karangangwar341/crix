"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, User, Heart, ShoppingBag, Menu } from "lucide-react";
import MegaMenu from "./MegaMenu";
import MobileNav from "./MobileNav";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import { useUIStore } from "@/lib/store/ui";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { name: "Bat", href: "/bats", mega: true },
  { name: "Bowling", href: "/accessories" },
  { name: "Protection", href: "/batting-pads" },
  { name: "Gloves", href: "/batting-gloves" },
  { name: "Helmets", href: "/helmets" },
  { name: "Bags", href: "/bags" },
  { name: "Accessories", href: "/accessories" },
];

const secondaryLinks = [
  { name: "New", href: "/collections?filter=new" },
  { name: "Bestsellers", href: "/collections?filter=bestsellers" },
  { name: "About", href: "/about" },
  { name: "Craft", href: "/craft" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const count = useCart((s) => s.count());
  const wishCount = useWishlist((s) => s.ids.length);
  const openCart = useCart((s) => s.open);
  const openSearch = useUIStore((s) => s.openSearch);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-black" onMouseLeave={() => setMegaOpen(false)}>
      <div
        className={cn(
          "mx-auto flex max-w-[1600px] items-center justify-between px-5 transition-all duration-300 lg:px-10",
          scrolled ? "py-3" : "py-4"
        )}
      >
        <button className="text-white lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>

        <Link href="/" className="font-display text-xl tracking-tight text-white">
          CRIX
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {primaryLinks.map((l) => (
            <div key={l.name} onMouseEnter={() => setMegaOpen(!!l.mega)}>
              <Link
                href={l.href}
                className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/70 transition-colors hover:text-white"
              >
                {l.name}
              </Link>
            </div>
          ))}
          <span className="mx-1 h-4 w-px bg-white/20" />
          {secondaryLinks.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/70 transition-colors hover:text-white"
            >
              {l.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-white">
          <button aria-label="Search" onClick={openSearch} className="transition-opacity hover:opacity-70">
            <Search size={18} />
          </button>
          <Link href="/account" aria-label="Account" className="hidden transition-opacity hover:opacity-70 sm:block">
            <User size={18} />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="relative hidden transition-opacity hover:opacity-70 sm:block">
            <Heart size={18} />
            {mounted && wishCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-semibold text-black">
                {wishCount}
              </span>
            )}
          </Link>
          <button aria-label="Cart" onClick={openCart} className="relative transition-opacity hover:opacity-70">
            <ShoppingBag size={18} />
            {mounted && count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-semibold text-black">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
      <MegaMenu open={megaOpen} />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
