"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, PlaySquare, AtSign, ArrowRight } from "lucide-react";
import { subscribeNewsletter } from "@/app/actions/storefront";

const columns = [
  {
    title: "Shop",
    links: [
      { name: "Bats", href: "/bats" },
      { name: "Gloves", href: "/batting-gloves" },
      { name: "Protection", href: "/batting-pads" },
      { name: "Helmets", href: "/helmets" },
      { name: "Bags", href: "/bags" },
      { name: "Accessories", href: "/accessories" },
    ],
  },
  {
    title: "Explore",
    links: [
      { name: "Craft", href: "/craft" },
      { name: "Players", href: "/craft#players" },
      { name: "Technology", href: "/craft#technology" },
      { name: "About", href: "/about" },
      { name: "Find Your Bat", href: "/find-your-bat" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Track Order", href: "/track-order" },
      { name: "Contact", href: "/contact" },
      { name: "Shipping", href: "/contact" },
      { name: "Returns", href: "/contact" },
      { name: "Warranty", href: "/contact" },
      { name: "Bat Guide", href: "/find-your-bat" },
    ],
  },
  {
    title: "Business",
    links: [
      { name: "OEM", href: "/business" },
      { name: "Private Label", href: "/business" },
      { name: "Wholesale", href: "/business" },
      { name: "Custom Manufacturing", href: "/business" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    await subscribeNewsletter(email);
    setSubmitting(false);
    setSubscribed(true);
  }

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1600px] px-5 py-16 lg:px-10">
        <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-14 lg:flex-row lg:items-end">
          <p className="font-display max-w-lg text-3xl leading-[1.1] sm:text-5xl">Keep up with the game.</p>
          {subscribed ? (
            <p className="text-sm text-white/70">You&rsquo;re on the list.</p>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full max-w-sm items-center border-b border-white/30 pb-2"
            >
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR EMAIL"
                className="flex-1 bg-transparent text-[13px] uppercase tracking-[0.06em] text-white placeholder:text-white/40 outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1 text-[12px] font-medium uppercase tracking-[0.08em] text-white hover:opacity-80 disabled:opacity-50"
              >
                {submitting ? "..." : "Subscribe"} <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>

        <div className="grid grid-cols-2 gap-10 pt-14 md:grid-cols-6">
          <div className="col-span-2">
            <p className="font-display text-2xl">CRIX</p>
            <p className="mt-3 max-w-xs text-sm text-white/60">
              Precision cricket equipment, engineered for the moment. Hand-graded willow, professional protection,
              built for the crease.
            </p>
            <div className="mt-5 flex items-center gap-4 text-white/60">
              <Camera size={17} />
              <AtSign size={17} />
              <PlaySquare size={17} />
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.name}>
                    <Link href={l.href} className="text-sm text-white/70 transition-colors hover:text-white">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} CRIX Cricket Co. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <select className="border border-white/20 bg-transparent px-2 py-1 text-xs text-white/70" defaultValue="IN">
              <option className="text-black" value="IN">India · ₹ INR</option>
              <option className="text-black" value="GB">United Kingdom · £ GBP</option>
              <option className="text-black" value="AU">Australia · $ AUD</option>
              <option className="text-black" value="US">United States · $ USD</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
