"use client";

import { useState } from "react";
import { updateHeroSection } from "@/app/actions/admin";
import { Check, Sparkles, LayoutTemplate, Layers, HelpCircle } from "lucide-react";

const sections = [
  { id: "Hero", icon: LayoutTemplate },
  { id: "Categories", icon: Layers },
  { id: "Bestseller Spotlight", icon: Sparkles },
  { id: "FAQs", icon: HelpCircle },
] as const;

export interface CmsClientProps {
  initialHero: {
    eyebrow: string;
    headline: string;
    subheading: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  categories: { id: string; name: string }[];
  faqs: { id: string; question: string; category: string }[];
}

export default function CmsClient({ initialHero, categories, faqs }: CmsClientProps) {
  const [tab, setTab] = useState<string>("Hero");
  const [hero, setHero] = useState({
    eyebrow: initialHero.eyebrow,
    headline: initialHero.headline,
    subheading: initialHero.subheading,
    ctaPrimaryText: initialHero.ctaPrimary,
    ctaSecondaryText: initialHero.ctaSecondary,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleHeroSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    await updateHeroSection(hero);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Content Management (CMS)</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Manage storefront hero narratives, category banners, featured spotlights, and FAQs.
          </p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
            <Check size={14} /> Changes Persisted to DB
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-line pb-4">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setTab(s.id)}
            className={
              tab === s.id
                ? "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors bg-black text-white"
                : "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border border-line bg-white text-ink-soft hover:text-black"
            }
          >
            <s.icon size={14} />
            {s.id}
          </button>
        ))}
      </div>

      {/* Hero Tab */}
      {tab === "Hero" && (
        <form onSubmit={handleHeroSave} className="mt-6 max-w-2xl space-y-5">
          <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)] space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-ink-faint mb-1">
                Eyebrow Text
              </label>
              <input
                value={hero.eyebrow}
                onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-ink-faint mb-1">
                Main Headline
              </label>
              <input
                value={hero.headline}
                onChange={(e) => setHero({ ...hero, headline: e.target.value })}
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-ink-faint mb-1">
                Subheading Narrative
              </label>
              <textarea
                value={hero.subheading}
                onChange={(e) => setHero({ ...hero, subheading: e.target.value })}
                rows={3}
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-ink-faint mb-1">
                  Primary CTA Label
                </label>
                <input
                  value={hero.ctaPrimaryText}
                  onChange={(e) => setHero({ ...hero, ctaPrimaryText: e.target.value })}
                  className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-ink-faint mb-1">
                  Secondary CTA Label
                </label>
                <input
                  value={hero.ctaSecondaryText}
                  onChange={(e) => setHero({ ...hero, ctaSecondaryText: e.target.value })}
                  className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-black px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? "Saving to Neon DB..." : "Publish Hero Changes"}
          </button>
        </form>
      )}

      {/* Categories CMS */}
      {tab === "Categories" && (
        <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-base font-semibold mb-2">Category Hero Banners</h2>
          <p className="text-xs text-ink-soft mb-6">
            Configure taglines and high-resolution banner images for primary equipment categories.
          </p>

          <div className="space-y-4">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-line p-4 hover:border-black/30 transition-colors"
              >
                <div>
                  <p className="font-semibold text-sm">{c.name}</p>
                  <p className="text-xs text-ink-soft">Published on Storefront</p>
                </div>
                <button className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-neutral-50">
                  Active
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs */}
      {tab === "FAQs" && (
        <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Storefront FAQs ({faqs.length})</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="rounded-xl border border-line p-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                  {faq.category}
                </span>
                <p className="text-sm font-medium mt-1">{faq.question}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bestseller */}
      {tab === "Bestseller Spotlight" && (
        <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)] space-y-4 max-w-xl">
          <h2 className="text-base font-semibold">Bestseller Showcase Item</h2>
          <div>
            <label className="block text-xs font-medium text-ink-faint mb-1">Featured Flagship</label>
            <select className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black">
              <option value="pro-elite-x">Pro Elite X (Signature Series) - ₹49,900</option>
              <option value="carbon-shield">Pro Carbon Shield - ₹38,900</option>
              <option value="matrix-power">Matrix Power Strike - ₹44,900</option>
            </select>
          </div>
          <button className="rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white">
            Active Spotlight
          </button>
        </div>
      )}
    </div>
  );
}
