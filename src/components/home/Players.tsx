"use client";

import { useState } from "react";
import { players } from "@/lib/data/players";
import { Reveal } from "@/components/ui/Reveal";
import { motion } from "framer-motion";

export default function Players() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="players" className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10">
      <Reveal className="mb-12 text-center">
        <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">Trusted at the Highest Level</p>
        <h2 className="font-display text-4xl sm:text-5xl">Our players.</h2>
      </Reveal>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {players.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06}>
            <div
              onMouseEnter={() => setActive(p.id)}
              onMouseLeave={() => setActive(null)}
              className="group relative aspect-[3/4] overflow-hidden rounded-[24px] border border-line bg-bg-alt shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-hover)]"
            >
              <div
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle at 50% 30%, rgba(0,0,0,${0.06 + (i % 4) * 0.02}), transparent 70%)` }}
              />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-display text-lg text-ink">{p.name}</p>
                <p className="text-xs text-ink-faint">{p.role}</p>
                <motion.div
                  initial={false}
                  animate={{ height: active === p.id ? "auto" : 0, opacity: active === p.id ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.06em] text-gold">Plays: {p.batModel}</p>
                  <p className="mt-1 text-xs italic text-ink-soft">&ldquo;{p.quote}&rdquo;</p>
                </motion.div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
