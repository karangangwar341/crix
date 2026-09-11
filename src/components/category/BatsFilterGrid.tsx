"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";
import { cn, formatPrice } from "@/lib/utils";

const SORTS = ["Featured", "Best Selling", "Newest", "Price Low → High", "Price High → Low"] as const;
type Sort = (typeof SORTS)[number];

const GRADES = [1, 2, 3, "Kashmir"] as const;
const PROFILES = ["Full Profile", "Mid Profile", "Thin Profile"] as const;
const SWEET_SPOTS = ["Low", "Mid", "High"] as const;
const PICKUPS = ["Light", "Balanced", "Powerful"] as const;
const HANDLES = ["Oval", "Semi-Oval", "Round", "Octagonal"] as const;
const STYLES = ["Power", "Control", "All-round"] as const;

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-line-soft py-4">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left">
        <span className="text-[12px] font-medium uppercase tracking-[0.1em]">{title}</span>
        <span className="text-ink-faint">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "mr-2 mb-2 inline-block rounded-full border px-3.5 py-1.5 text-xs transition-colors",
        active ? "border-black bg-black text-white" : "border-line text-ink-soft hover:border-ink"
      )}
    >
      {children}
    </button>
  );
}

export default function BatsFilterGrid({ products }: { products: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize from URL search params
  const paramGrade = searchParams.get("grade");
  const initialGrade = paramGrade === "Kashmir" ? "Kashmir" : paramGrade ? Number(paramGrade) : null;

  const [sort, setSortState] = useState<Sort>((searchParams.get("sort") as Sort) || "Featured");
  const [grade, setGradeState] = useState<(typeof GRADES)[number] | null>(initialGrade as any);
  const [profile, setProfileState] = useState<string | null>(searchParams.get("profile"));
  const [sweetSpot, setSweetSpotState] = useState<string | null>(searchParams.get("sweetSpot"));
  const [pickup, setPickupState] = useState<string | null>(searchParams.get("pickup"));
  const [handle, setHandleState] = useState<string | null>(searchParams.get("handle"));
  const [style, setStyleState] = useState<string | null>(searchParams.get("style"));
  const [maxPrice, setMaxPriceState] = useState(
    searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 100000
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (!val || (key === "sort" && val === "Featured") || (key === "maxPrice" && (val === "100000" || val === "90000"))) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const setSort = (s: Sort) => {
    setSortState(s);
    updateUrl({ sort: s });
  };

  const setGrade = (g: (typeof GRADES)[number] | null) => {
    setGradeState(g);
    updateUrl({ grade: g !== null ? String(g) : null });
  };

  const setProfile = (p: string | null) => {
    setProfileState(p);
    updateUrl({ profile: p });
  };

  const setSweetSpot = (sw: string | null) => {
    setSweetSpotState(sw);
    updateUrl({ sweetSpot: sw });
  };

  const setPickup = (pi: string | null) => {
    setPickupState(pi);
    updateUrl({ pickup: pi });
  };

  const setHandle = (h: string | null) => {
    setHandleState(h);
    updateUrl({ handle: h });
  };

  const setStyle = (st: string | null) => {
    setStyleState(st);
    updateUrl({ style: st });
  };

  const setMaxPrice = (p: number) => {
    setMaxPriceState(p);
    updateUrl({ maxPrice: String(p) });
  };

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const s = p.specifications;
      if (!s) return false;
      if (grade !== null && s.willowGrade !== grade) return false;
      if (profile && s.profile !== profile) return false;
      if (sweetSpot && s.sweetSpot !== sweetSpot) return false;
      if (pickup && s.pickup !== pickup) return false;
      if (handle && s.handle !== handle) return false;
      if (style && !s.playingStyle.includes(style as never)) return false;
      if (p.price > maxPrice) return false;
      return true;
    });

    switch (sort) {
      case "Best Selling":
        list = [...list].sort((a, b) => Number(b.bestseller) - Number(a.bestseller) || b.rating - a.rating);
        break;
      case "Newest":
        list = [...list].sort((a, b) => Number(b.new) - Number(a.new));
        break;
      case "Price Low → High":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "Price High → Low":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      default:
        list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [products, sort, grade, profile, sweetSpot, pickup, handle, style, maxPrice]);

  const clearAll = () => {
    setGradeState(null);
    setProfileState(null);
    setSweetSpotState(null);
    setPickupState(null);
    setHandleState(null);
    setStyleState(null);
    setMaxPriceState(100000);
    router.replace(pathname, { scroll: false });
  };

  const activeCount = [grade, profile, sweetSpot, pickup, handle, style].filter(Boolean).length + (maxPrice < 100000 ? 1 : 0);

  const filterPanel = (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">Filters</p>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-[11px] uppercase text-ink-faint underline">
            Clear ({activeCount})
          </button>
        )}
      </div>

      <FilterGroup title="Price">
        <input
          type="range"
          min={10000}
          max={100000}
          step={2000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[var(--ink)]"
        />
        <p className="text-xs text-ink-soft">Up to {formatPrice(maxPrice)}</p>
      </FilterGroup>

      <FilterGroup title="Willow Grade">
        {GRADES.map((g) => (
          <Chip key={g} active={grade === g} onClick={() => setGrade(grade === g ? null : g)}>
            {typeof g === "number" ? `Grade ${g}` : g}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup title="Profile">
        {PROFILES.map((p) => (
          <Chip key={p} active={profile === p} onClick={() => setProfile(profile === p ? null : p)}>
            {p}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup title="Sweet Spot">
        {SWEET_SPOTS.map((s) => (
          <Chip key={s} active={sweetSpot === s} onClick={() => setSweetSpot(sweetSpot === s ? null : s)}>
            {s}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup title="Pickup">
        {PICKUPS.map((p) => (
          <Chip key={p} active={pickup === p} onClick={() => setPickup(pickup === p ? null : p)}>
            {p}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup title="Handle">
        {HANDLES.map((h) => (
          <Chip key={h} active={handle === h} onClick={() => setHandle(handle === h ? null : h)}>
            {h}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup title="Playing Style">
        {STYLES.map((s) => (
          <Chip key={s} active={style === s} onClick={() => setStyle(style === s ? null : s)}>
            {s}
          </Chip>
        ))}
      </FilterGroup>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block">{filterPanel}</aside>

      <div>
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 border border-line px-3 py-2 text-xs uppercase lg:hidden"
          >
            <SlidersHorizontal size={13} /> Filters {activeCount > 0 && `(${activeCount})`}
          </button>
          <p className="hidden text-sm text-ink-soft lg:block">{filtered.length} bats</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="border border-line bg-transparent px-3 py-2 text-xs uppercase"
          >
            {SORTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="py-20 text-center text-ink-soft">No bats match these filters.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex-1 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="w-[85%] max-w-xs overflow-y-auto bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-lg">Filters</p>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            {filterPanel}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-4 w-full bg-ink py-3 text-[13px] font-medium uppercase tracking-[0.06em] text-bg"
            >
              Show {filtered.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
