"use client";

export function BarChart({ data, color = "#050505" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex h-32 items-end gap-1.5">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all"
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: 0.35 + (v / max) * 0.65 }}
        />
      ))}
    </div>
  );
}

export function Sparkline({ data, color = "#050505" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / (max - min || 1)) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-10 w-24">
      <polyline points={points} fill="none" stroke={color} strokeWidth={3} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
