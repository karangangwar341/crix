"use client";

/**
 * Generative vector illustration system for cricket bats.
 * There is no product photography in this build, so every bat is rendered
 * from its own spec data (grain count, edge width, spine, tones) as a
 * consistent premium flat-vector illustration instead of mismatched stock
 * imagery. Faces are layered + rotated in real 3D (CSS) so viewers get a
 * continuously interpolated rotation rather than swapped static frames.
 */

export interface BatTone {
  willow: string; // base blade wood tone
  willowDark: string; // shading tone
  accent: string; // sticker / accent colour
  grains: number;
  edge: number; // mm, 32-48 typical
  spine: number; // mm, 55-70 typical
  bladeWidth: number; // mm, 108-125 typical -> visual width
  series?: string;
  grade?: string;
  seed: number;
}

// Pure per-(seed, index) hash — no shared mutable state, so it can never
// drift between renders. A stateful sequential PRNG called during render
// (mutating its closure as a side effect) is impure: React's Strict Mode
// double-invokes render in development specifically to catch this, and it
// did — the two invocations advanced the same generator twice, so the
// server's single-pass output and the client's diverged, producing a
// hydration mismatch on every bat's grain lines.
function jitterFor(seed: number, index: number) {
  const x = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
  const value = (x - Math.floor(x)) * 2 - 1; // range [-1, 1)
  // Math.sin can differ in the last few ULPs between JS engines (Node's
  // V8 vs a browser's V8 build) — rounding well above that noise floor
  // keeps the server- and client-rendered SVG path strings byte-identical.
  return Math.round(value * 1000) / 1000;
}

function bladeOutline(widthScale: number) {
  const w = 100 * widthScale;
  const shoulder = w * 0.86;
  const toe = w * 0.8;
  // symmetric outline, top at handle splice (y=0) to toe (y=360)
  return `M ${-shoulder / 2} 0
    C ${-w / 2} 30, ${-w / 2} 60, ${-w / 2} 110
    C ${-w / 2} 190, ${-w / 2} 230, ${-toe / 2} 300
    C ${-toe / 2} 330, ${-toe * 0.4} 356, 0 360
    C ${toe * 0.4} 356, ${toe / 2} 330, ${toe / 2} 300
    C ${w / 2} 230, ${w / 2} 190, ${w / 2} 110
    C ${w / 2} 60, ${w / 2} 30, ${shoulder / 2} 0
    Z`;
}

function GrainLines({ tone }: { tone: BatTone }) {
  const count = Math.max(6, Math.min(12, tone.grains));
  const lines = [];
  const spread = 100 * (tone.bladeWidth / 116) * 0.78;
  for (let i = 0; i < count; i++) {
    const x = -spread / 2 + (spread / (count - 1)) * i;
    const jitter = jitterFor(tone.seed, i) * 3;
    lines.push(
      <path
        key={i}
        d={`M ${x} 10 C ${x + jitter} 100, ${x - jitter} 220, ${x + jitter * 0.6} 348`}
        stroke={tone.willowDark}
        strokeWidth={0.6}
        opacity={0.35}
        fill="none"
      />
    );
  }
  return <>{lines}</>;
}

export function BatFaceFront({ tone, showSticker = true }: { tone: BatTone; showSticker?: boolean }) {
  const widthScale = tone.bladeWidth / 116;
  return (
    <svg viewBox="-70 -170 140 560" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`willow-${tone.seed}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={tone.willowDark} />
          <stop offset="12%" stopColor={tone.willow} />
          <stop offset="50%" stopColor="#fdf8ec" />
          <stop offset="88%" stopColor={tone.willow} />
          <stop offset="100%" stopColor={tone.willowDark} />
        </linearGradient>
      </defs>
      {/* handle */}
      <g>
        <rect x={-16} y={-170} width={32} height={150} rx={15} fill={`url(#willow-${tone.seed})`} stroke="#2a2118" strokeOpacity={0.15} strokeWidth={1} />
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={i} x1={-16} y1={-165 + i * 7.5} x2={16} y2={-161 + i * 7.5} stroke="#2a2118" strokeOpacity={0.18} strokeWidth={1} />
        ))}
        <rect x={-16} y={-60} width={32} height={16} fill={tone.accent} opacity={0.9} rx={2} />
      </g>
      {/* splice */}
      <path d="M -18 -20 Q 0 -6 18 -20 L 20 4 Q 0 18 -20 4 Z" fill="#3a2c1c" opacity={0.25} />
      {/* blade */}
      <g transform="translate(0,0)">
        <path d={bladeOutline(widthScale)} fill={`url(#willow-${tone.seed})`} stroke="#2a2118" strokeOpacity={0.2} strokeWidth={1.2} />
        <GrainLines tone={tone} />
        {/* edge shading */}
        <path d={bladeOutline(widthScale)} fill="none" stroke={tone.willowDark} strokeOpacity={0.3} strokeWidth={Math.max(2, tone.edge / 8)} />
        {showSticker && (
          <g transform="translate(0,70)">
            <rect x={-38} y={-22} width={76} height={44} rx={4} fill={tone.accent} />
            <rect x={-38} y={-22} width={76} height={44} rx={4} fill="none" stroke="#00000022" />
            <text x={0} y={-4} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff" letterSpacing={0.5}>
              {(tone.series ?? "SIGNATURE").toUpperCase()}
            </text>
            <text x={0} y={12} textAnchor="middle" fontSize={6.5} fill="#ffffffcc" letterSpacing={1.5}>
              {tone.grade ?? "GRADE 1 ENGLISH WILLOW"}
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}

export function BatFaceBack({ tone }: { tone: BatTone }) {
  const widthScale = tone.bladeWidth / 116;
  const spineW = Math.max(10, tone.spine / 4.5);
  return (
    <svg viewBox="-70 -170 140 560" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`willowback-${tone.seed}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={tone.willowDark} />
          <stop offset="30%" stopColor={tone.willow} />
          <stop offset="100%" stopColor={tone.willowDark} />
        </linearGradient>
        <radialGradient id={`spine-${tone.seed}`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#fffaf0" stopOpacity={0.9} />
          <stop offset="70%" stopColor={tone.willow} stopOpacity={0.4} />
          <stop offset="100%" stopColor={tone.willow} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={-16} y={-170} width={32} height={150} rx={15} fill={tone.willowDark} />
      <path d="M -18 -20 Q 0 -6 18 -20 L 20 4 Q 0 18 -20 4 Z" fill="#000" opacity={0.2} />
      <path d={bladeOutline(widthScale)} fill={`url(#willowback-${tone.seed})`} stroke="#2a2118" strokeOpacity={0.25} strokeWidth={1.2} />
      <ellipse cx={0} cy={160} rx={spineW} ry={170} fill={`url(#spine-${tone.seed})`} />
      <line x1={0} y1={0} x2={0} y2={340} stroke={tone.willowDark} strokeOpacity={0.4} strokeWidth={1} />
      <g transform="translate(0,-40)" opacity={0.85}>
        <text x={0} y={0} textAnchor="middle" fontSize={7} fill={tone.willowDark} letterSpacing={1.2}>
          {(tone.grade ?? "GRADE 1").toUpperCase()}
        </text>
      </g>
    </svg>
  );
}

export function BatFaceEdge({ tone }: { tone: BatTone }) {
  const edgeW = Math.max(14, tone.edge * 0.9);
  return (
    <svg viewBox="-40 -170 80 560" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`edgegrad-${tone.seed}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={tone.willowDark} />
          <stop offset="45%" stopColor="#fffaf0" />
          <stop offset="55%" stopColor="#fffaf0" />
          <stop offset="100%" stopColor={tone.willowDark} />
        </linearGradient>
      </defs>
      <rect x={-9} y={-170} width={18} height={150} rx={9} fill={tone.willowDark} />
      <path
        d={`M ${-edgeW / 2} 0 C ${-edgeW / 2 - 4} 120, ${-edgeW / 2 - 4} 240, ${-edgeW / 4} 340 C ${-edgeW / 8} 355, ${edgeW / 8} 355, ${edgeW / 4} 340 C ${edgeW / 2 + 4} 240, ${edgeW / 2 + 4} 120, ${edgeW / 2} 0 Z`}
        fill={`url(#edgegrad-${tone.seed})`}
        stroke="#2a2118"
        strokeOpacity={0.25}
      />
    </svg>
  );
}

/** Continuous-rotation 3D bat viewer built from three layered faces. */
export function Bat3D({
  tone,
  rotation,
  showSticker = true,
}: {
  tone: BatTone;
  rotation: number; // degrees, 0 = front
  showSticker?: boolean;
}) {
  const rad = (rotation * Math.PI) / 180;
  const frontOpacity = Math.max(0, Math.cos(rad));
  const backOpacity = Math.max(0, -Math.cos(rad));
  const edgeOpacity = 1 - Math.abs(Math.cos(rad));
  const scaleX = Math.max(0.06, Math.abs(Math.cos(rad)));

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: edgeOpacity,
          transform: `scaleX(${Math.max(0.5, edgeOpacity)})`,
          transition: "opacity 0.05s linear",
        }}
      >
        <BatFaceEdge tone={tone} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: frontOpacity,
          transform: `scaleX(${scaleX})`,
          transformOrigin: "center",
        }}
      >
        <BatFaceFront tone={tone} showSticker={showSticker} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: backOpacity,
          transform: `scaleX(${scaleX}) scaleX(-1)`,
          transformOrigin: "center",
        }}
      >
        <BatFaceBack tone={tone} />
      </div>
    </div>
  );
}

export function toneFromProduct(opts: {
  id: string;
  willowTone: string;
  accent: string;
  grains?: string;
  edge?: number;
  spine?: number;
  bladeWidth?: number;
  series?: string;
  grade?: string;
}): BatTone {
  let hash = 0;
  for (let i = 0; i < opts.id.length; i++) hash = (hash * 31 + opts.id.charCodeAt(i)) | 0;
  const grainNum = opts.grains ? parseInt(opts.grains.split("-")[1] ?? "9", 10) : 9;
  return {
    willow: opts.willowTone,
    willowDark: shade(opts.willowTone, -0.28),
    accent: opts.accent,
    grains: grainNum,
    edge: opts.edge ?? 40,
    spine: opts.spine ?? 62,
    bladeWidth: opts.bladeWidth ?? 116,
    series: opts.series,
    grade: opts.grade,
    seed: Math.abs(hash) % 1000,
  };
}

const DETAIL_REGIONS: Record<string, { scale: number; x: number; y: number; face: "front" | "back" }> = {
  toe: { scale: 3.2, x: 0, y: 82, face: "front" },
  handle: { scale: 2.6, x: 0, y: -25, face: "front" },
  "grain-closeup": { scale: 4.2, x: 10, y: 20, face: "front" },
  edge: { scale: 3, x: 0, y: 30, face: "front" },
  spine: { scale: 2.6, x: 0, y: 20, face: "back" },
  sticker: { scale: 2.4, x: 0, y: 12, face: "front" },
};

/** Zoomed crop of a bat face used for gallery detail shots (toe, handle, grain, edge, spine…). */
export function BatDetailShot({ tone, region }: { tone: BatTone; region: keyof typeof DETAIL_REGIONS }) {
  const cfg = DETAIL_REGIONS[region] ?? DETAIL_REGIONS.toe;
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${cfg.scale}) translate(${cfg.x}px, ${cfg.y}px)`,
          transformOrigin: "center",
        }}
      >
        {cfg.face === "front" ? <BatFaceFront tone={tone} /> : <BatFaceBack tone={tone} />}
      </div>
    </div>
  );
}

function shade(hex: string, amt: number) {
  const c = hex.replace("#", "");
  const num = parseInt(c, 16);
  let r = (num >> 16) + Math.round(255 * amt);
  let g = ((num >> 8) & 0xff) + Math.round(255 * amt);
  let b = (num & 0xff) + Math.round(255 * amt);
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
