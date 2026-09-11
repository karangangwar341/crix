"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";
import { updateSiteSettings } from "@/app/actions/admin";

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: {
    businessName: string;
    phone: string;
    whatsapp: string;
    email: string;
    address?: string | null;
    instagramUrl?: string | null;
    facebookUrl?: string | null;
    defaultSeoTitle?: string | null;
    defaultSeoDescription?: string | null;
  };
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    businessName: initialSettings.businessName || "CRIX Cricket & Sports Ltd",
    phone: initialSettings.phone || "+44 20 7946 0912",
    whatsapp: initialSettings.whatsapp || "442079460912",
    email: initialSettings.email || "support@crixcricket.com",
    address: initialSettings.address || "The Pavilion, St. John's Wood, London NW8 8QN",
    instagramUrl: initialSettings.instagramUrl || "https://instagram.com/crixcricket",
    facebookUrl: initialSettings.facebookUrl || "https://facebook.com/crixcricket",
    defaultSeoTitle: initialSettings.defaultSeoTitle || "CRIX | Professional Handcrafted Cricket Equipment & Accessories",
    defaultSeoDescription:
      initialSettings.defaultSeoDescription ||
      "Handcrafted English Willow bats, protective batting gear, luggage, and performance cricket accessories engineered with precision.",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    await updateSiteSettings(form);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Store Settings</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Configure contact details, social links, and SEO defaults stored in Neon DB.
          </p>
        </div>

        {success && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
            <Check size={14} /> Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)] space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
            Business & Contacts
          </h2>

          <div>
            <label className="block text-xs font-medium text-ink-faint mb-1">Company Name</label>
            <input
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-faint mb-1">Customer Support Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-faint mb-1">WhatsApp Hotline</label>
              <input
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-faint mb-1">Support Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-faint mb-1">HQ / Workshop Address</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)] space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
            Storefront SEO Defaults
          </h2>

          <div>
            <label className="block text-xs font-medium text-ink-faint mb-1">Default Meta Title</label>
            <input
              value={form.defaultSeoTitle}
              onChange={(e) => setForm({ ...form, defaultSeoTitle: e.target.value })}
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-faint mb-1">Default Meta Description</label>
            <textarea
              rows={3}
              value={form.defaultSeoDescription}
              onChange={(e) => setForm({ ...form, defaultSeoDescription: e.target.value })}
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-60"
        >
          <Save size={15} />
          <span>{loading ? "Saving..." : "Save Settings"}</span>
        </button>
      </form>
    </div>
  );
}
