"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface MegaMenuProps {
  open: boolean;
}

const featured = [
  { name: "English Willow", href: "/bats?willow=english", desc: "Grade 1 & 2 pressed blades" },
  { name: "Kashmir Willow", href: "/bats?willow=kashmir", desc: "Durable, high-volume play" },
  { name: "Player Series", href: "/bats?series=player", desc: "As used by our professionals" },
  { name: "Limited Edition", href: "/bats?series=limited", desc: "Numbered reserve willow" },
];

const shopBy = [
  { name: "By Weight", href: "/bats?sort=weight" },
  { name: "By Grade", href: "/bats?grade=1" },
  { name: "By Profile", href: "/bats?profile=full" },
  { name: "By Playing Style", href: "/bats?style=power" },
];

export default function MegaMenu({ open }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 right-0 top-full border-b border-line bg-white shadow-[var(--shadow-hover)]"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-8 py-10">
            <div className="col-span-7">
              <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">Featured</p>
              <div className="grid grid-cols-2 gap-6">
                {featured.map((f) => (
                  <Link key={f.name} href={f.href} className="group block">
                    <div className="mb-3 aspect-[4/3] w-full rounded-2xl bg-bg-alt transition-colors group-hover:bg-line-soft" />
                    <p className="font-display text-lg">{f.name}</p>
                    <p className="text-sm text-ink-soft">{f.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
            <div className="col-span-3">
              <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">Shop By</p>
              <ul className="space-y-3">
                {shopBy.map((s) => (
                  <li key={s.name}>
                    <Link href={s.href} className="group flex items-center gap-1 text-[15px] text-ink-soft hover:text-ink">
                      {s.name}
                      <ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 flex flex-col justify-between">
              <div>
                <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-soft">The Icon</p>
                <p className="font-display text-xl leading-snug">Pro Elite X</p>
                <p className="mt-1 text-sm text-ink-soft">From ₹49,900</p>
              </div>
              <Link href="/bats/pro-elite-x" className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium uppercase tracking-[0.06em]">
                View Bat <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
