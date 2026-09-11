"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, AlertTriangle } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { ProductVisual } from "@/components/product/ProductVisual";
import { updateProductStock } from "@/app/actions/admin";

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredProducts = products.filter((p) => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  const handleStockUpdate = async (id: string, delta: number) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const newStock = Math.max(0, target.stock + delta);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
    );
    await updateProductStock(id, newStock);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Product Catalog & Inventory</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Manage English Willow bats, protective batting gear, luggage, and live warehouse inventory.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-sm"
        >
          <Plus size={15} /> Add Equipment
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5 w-full">
          <Search size={16} className="text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bats, gloves, pads..."
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs font-medium outline-none focus:border-black w-full sm:w-auto"
        >
          <option value="all">All Categories</option>
          <option value="bats">Bats</option>
          <option value="batting-gloves">Batting Gloves</option>
          <option value="batting-pads">Batting Pads</option>
          <option value="helmets">Helmets</option>
          <option value="bags">Bags</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-neutral-50 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                <th className="px-5 py-3.5">Equipment</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Inventory</th>
                <th className="px-5 py-3.5">Rating / Reviews</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-9 flex-shrink-0 rounded-lg bg-neutral-100 p-1 flex items-center justify-center overflow-hidden">
                        <ProductVisual product={p} angle="front" />
                      </div>
                      <div>
                        <div className="font-semibold text-ink flex items-center gap-1.5">
                          {p.name}
                          {p.bestseller && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                              Bestseller
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-ink-faint">{p.series || "Standard Series"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-ink-soft capitalize">
                    {p.category.replace("-", " ")}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-ink">{formatPrice(p.price)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold ${
                          p.stock < 10 ? "text-red-600 flex items-center gap-1" : "text-ink"
                        }`}
                      >
                        {p.stock < 10 && <AlertTriangle size={12} />}
                        {p.stock} units
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStockUpdate(p.id, -1)}
                          className="h-5 w-5 rounded border border-line bg-neutral-50 text-xs font-bold text-ink-soft hover:bg-neutral-200"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleStockUpdate(p.id, 1)}
                          className="h-5 w-5 rounded border border-line bg-neutral-50 text-xs font-bold text-ink-soft hover:bg-neutral-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs">
                    <span className="font-bold text-ink">★ {p.rating}</span>{" "}
                    <span className="text-ink-faint">({p.reviewCount})</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-neutral-100 transition-colors"
                    >
                      Edit
                    </Link>
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
