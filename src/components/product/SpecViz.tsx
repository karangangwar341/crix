"use client";

import { motion } from "framer-motion";
import { BatSpecifications } from "@/lib/types";

function ScaleBar({ label, value, min, max, unit, low, high, displayValue }: { label: string; value: number; min: number; max: number; unit: string; low: string; high: string; displayValue?: string }) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] uppercase tracking-[0.1em] text-ink-faint">{label}</p>
        <p className="text-sm font-medium">
          {displayValue ?? `${value}${unit}`}
        </p>
      </div>
      <div className="relative mt-2 h-1.5 w-full rounded-full bg-line-soft">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 rounded-full bg-ink"
        />
        <motion.div
          initial={{ left: 0 }}
          whileInView={{ left: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-ink bg-surface"
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.08em] text-ink-faint">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

function SweetSpotDiagram({ position }: { position: "Low" | "Mid" | "High" }) {
  const y = position === "Low" ? 78 : position === "Mid" ? 55 : 30;
  return (
    <div>
      <p className="mb-2 text-[11px] uppercase tracking-[0.1em] text-ink-faint">Sweet Spot</p>
      <div className="relative mx-auto h-32 w-14">
        <svg viewBox="0 0 56 130" className="h-full w-full">
          <path
            d="M 20 0 C 8 8, 8 20, 8 34 C 8 60, 8 80, 14 100 C 16 112, 24 122, 28 128 C 32 122, 40 112, 42 100 C 48 80, 48 60, 48 34 C 48 20, 48 8, 36 0 Z"
            fill="#f7f7f7"
            stroke="#e8e8e8"
          />
        </svg>
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="absolute left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/10 ring-2 ring-ink"
          style={{ top: `${y}%` }}
        />
      </div>
      <p className="mt-1 text-center text-sm font-medium">{position}</p>
    </div>
  );
}

export default function SpecViz({ specs }: { specs: BatSpecifications }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <ScaleBar label="Weight" value={specs.weightMaxOz} min={38} max={48} unit="oz" low="Light" high="Heavy" />
      <ScaleBar label="Edge" value={specs.edge} min={30} max={48} unit="mm" low="Thin" high="Thick" />
      <ScaleBar label="Spine" value={specs.spine} min={50} max={70} unit="mm" low="Low" high="High" />
      <ScaleBar
        label="Pickup"
        value={specs.pickup === "Light" ? 1 : specs.pickup === "Balanced" ? 2 : 3}
        min={1}
        max={3}
        unit=""
        low="Light"
        high="Powerful"
        displayValue={specs.pickup}
      />
      <ScaleBar
        label="Balance"
        value={specs.balance === "Low" ? 1 : specs.balance === "Mid" ? 2 : 3}
        min={1}
        max={3}
        unit=""
        low="Low"
        high="High"
        displayValue={specs.balance}
      />
      <SweetSpotDiagram position={specs.sweetSpot} />
    </div>
  );
}
