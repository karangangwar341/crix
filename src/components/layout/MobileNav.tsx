"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const links = [
  { name: "Bat", href: "/bats" },
  { name: "Batting Gloves", href: "/batting-gloves" },
  { name: "Batting Pads", href: "/batting-pads" },
  { name: "Helmets", href: "/helmets" },
  { name: "Bags", href: "/bags" },
  { name: "Accessories", href: "/accessories" },
  { name: "New", href: "/collections?filter=new" },
  { name: "Bestsellers", href: "/collections?filter=bestsellers" },
  { name: "About", href: "/about" },
  { name: "Craft", href: "/craft" },
  { name: "Business", href: "/business" },
];

export default function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 left-0 z-50 w-[86%] max-w-sm bg-surface p-6"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-xl">CRIX</span>
              <button onClick={onClose} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <ul className="space-y-1">
              {links.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    onClick={onClose}
                    className="block border-b border-line-soft py-3 text-[15px] uppercase tracking-[0.04em]"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
