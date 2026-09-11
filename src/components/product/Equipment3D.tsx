"use client";

import React from "react";
import { Category } from "@/lib/types";

interface Equipment3DProps {
  category: Category;
  rotation?: number; // 0..360 horizontal degrees
  pitch?: number; // -30..30 vertical tilt degrees
  accent?: string;
  tone?: string;
  className?: string;
}

/**
 * Procedural 3D / 360° Equipment Visualizer Engine.
 * Renders true-to-scale, multi-layered equipment for non-bat categories
 * with dynamic lighting, perspective depth, and smooth rotation.
 */
export function Equipment3D({
  category,
  rotation = 0,
  pitch = 0,
  accent = "#8a1f2b",
  className = "w-full h-full",
}: Equipment3DProps) {
  // Normalize rotation to 0..360
  const r = ((rotation % 360) + 360) % 360;
  // Calculate lighting shift based on angle
  const lightShift = Math.sin((r * Math.PI) / 180);
  const isBackFacing = r > 90 && r < 270;

  switch (category) {
    case "batting-gloves":
      return <Gloves3D rotation={r} pitch={pitch} accent={accent} lightShift={lightShift} isBackFacing={isBackFacing} className={className} />;
    case "batting-pads":
      return <Pads3D rotation={r} pitch={pitch} accent={accent} lightShift={lightShift} isBackFacing={isBackFacing} className={className} />;
    case "helmets":
      return <Helmet3D rotation={r} pitch={pitch} accent={accent} lightShift={lightShift} isBackFacing={isBackFacing} className={className} />;
    case "bags":
      return <Bag3D rotation={r} pitch={pitch} accent={accent} lightShift={lightShift} isBackFacing={isBackFacing} className={className} />;
    case "accessories":
    default:
      return <Accessory3D rotation={r} pitch={pitch} accent={accent} lightShift={lightShift} className={className} />;
  }
}

/** 3D Interactive Model for Batting Gloves */
function Gloves3D({
  rotation,
  pitch,
  accent,
  lightShift,
  isBackFacing,
  className,
}: {
  rotation: number;
  pitch: number;
  accent: string;
  lightShift: number;
  isBackFacing: boolean;
  className?: string;
}) {
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const scaleX = Math.abs(cos) * 0.7 + 0.3;

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ perspective: 900 }}>
      {/* Dynamic floor shadow */}
      <div
        className="absolute bottom-6 h-8 rounded-full bg-black/15 blur-md transition-transform duration-75"
        style={{
          width: `${160 * scaleX}px`,
          transform: `translateX(${lightShift * 20}px) scaleY(${0.4 + Math.abs(pitch) * 0.01})`,
        }}
      />

      <div
        className="relative flex items-center justify-center transition-transform duration-75"
        style={{
          transform: `rotateY(${rotation}deg) rotateX(${-pitch}deg)`,
          transformStyle: "preserve-3d",
          width: "280px",
          height: "360px",
        }}
      >
        {!isBackFacing ? (
          /* FRONT FACE: Segmented high-density finger bars & carbon knuckle shields */
          <svg viewBox="0 0 280 360" className="w-full h-full drop-shadow-xl" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="glove-body" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#f4f4f6" />
                <stop offset="100%" stopColor="#d9d9de" />
              </linearGradient>
              <linearGradient id="glove-cuff" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#111111" />
                <stop offset="50%" stopColor="#222222" />
                <stop offset="100%" stopColor="#111111" />
              </linearGradient>
              <linearGradient id="finger-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#e5e5ea" />
                <stop offset="100%" stopColor="#c7c7cc" />
              </linearGradient>
            </defs>

            {/* Elasticated Wristband Cuff */}
            <rect x="75" y="275" width="130" height="55" rx="8" fill="url(#glove-cuff)" stroke="#333" strokeWidth="1.5" />
            {/* Wristband Velcro Pull Tab */}
            <rect x="95" y="305" width="90" height="18" rx="4" fill="#000" stroke="#444" strokeWidth="1" />
            <text x="140" y="318" fill="#fff" fontSize="9" fontWeight="700" letterSpacing="2" textAnchor="middle">
              CRIX TEST
            </text>
            <rect x="75" y="280" width="130" height="4" fill={accent} />

            {/* Main Hand Back Body */}
            <path
              d="M 70 170 Q 60 210 75 275 L 205 275 Q 220 210 210 170 Q 140 160 70 170 Z"
              fill="url(#glove-body)"
              stroke="#b5b5ba"
              strokeWidth="1.5"
            />

            {/* Breathable Mesh Side Inset */}
            <path d="M 68 190 Q 62 230 75 270 L 85 270 Q 75 225 80 190 Z" fill="#1c1c1e" opacity="0.85" />
            <path d="M 212 190 Q 218 230 205 270 L 195 270 Q 205 225 200 190 Z" fill="#1c1c1e" opacity="0.85" />

            {/* Knuckle Shield Bar */}
            <rect x="85" y="180" width="110" height="24" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
            <line x1="120" y1="180" x2="120" y2="204" stroke="#27272a" strokeWidth="1.5" />
            <line x1="160" y1="180" x2="160" y2="204" stroke="#27272a" strokeWidth="1.5" />

            {/* 4 Multi-Segment High-Density Finger Protectors */}
            {/* Little Finger */}
            <g transform="translate(80, 50)">
              <rect x="0" y="0" width="22" height="35" rx="7" fill="url(#finger-shadow)" stroke="#b5b5ba" strokeWidth="1" />
              <rect x="0" y="40" width="22" height="35" rx="7" fill="url(#finger-shadow)" stroke="#b5b5ba" strokeWidth="1" />
              <rect x="0" y="80" width="22" height="40" rx="7" fill="url(#finger-shadow)" stroke="#b5b5ba" strokeWidth="1" />
            </g>

            {/* Ring Finger */}
            <g transform="translate(108, 30)">
              <rect x="0" y="0" width="24" height="40" rx="8" fill="url(#finger-shadow)" stroke="#b5b5ba" strokeWidth="1" />
              <rect x="0" y="45" width="24" height="40" rx="8" fill="url(#finger-shadow)" stroke="#b5b5ba" strokeWidth="1" />
              <rect x="0" y="90" width="24" height="45" rx="8" fill="url(#finger-shadow)" stroke="#b5b5ba" strokeWidth="1" />
            </g>

            {/* Middle Finger (Longest) */}
            <g transform="translate(138, 20)">
              <rect x="0" y="0" width="25" height="42" rx="8" fill="url(#finger-shadow)" stroke="#b5b5ba" strokeWidth="1" />
              <rect x="0" y="47" width="25" height="42" rx="8" fill="url(#finger-shadow)" stroke="#b5b5ba" strokeWidth="1" />
              <rect x="0" y="94" width="25" height="48" rx="8" fill="url(#finger-shadow)" stroke="#b5b5ba" strokeWidth="1" />
            </g>

            {/* Index Finger (Reinforced Sausage Chamber) */}
            <g transform="translate(169, 32)">
              <rect x="0" y="0" width="25" height="42" rx="8" fill="url(#finger-shadow)" stroke="#b5b5ba" strokeWidth="1" />
              <rect x="0" y="47" width="25" height="42" rx="8" fill="url(#finger-shadow)" stroke="#b5b5ba" strokeWidth="1" />
              <rect x="0" y="94" width="25" height="44" rx="8" fill="url(#finger-shadow)" stroke="#b5b5ba" strokeWidth="1" />
              {/* Fiber insert line */}
              <line x1="12" y1="5" x2="12" y2="130" stroke={accent} strokeWidth="2" strokeDasharray="3 3" />
            </g>

            {/* Thumb Guard (Shark-Tooth Flex 2-Piece) */}
            <g transform="translate(202, 115) rotate(22)">
              <rect x="0" y="0" width="26" height="48" rx="8" fill="url(#finger-shadow)" stroke="#b5b5ba" strokeWidth="1" />
              <rect x="0" y="52" width="26" height="45" rx="8" fill="url(#finger-shadow)" stroke="#b5b5ba" strokeWidth="1" />
              <circle cx="13" cy="24" r="5" fill="#18181b" />
            </g>
          </svg>
        ) : (
          /* REAR/PALM FACE: Premium English Pittards Leather with Grip Perforations */
          <svg viewBox="0 0 280 360" className="w-full h-full drop-shadow-xl" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="palm-leather" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8dec8" />
                <stop offset="50%" stopColor="#decfae" />
                <stop offset="100%" stopColor="#cbb991" />
              </linearGradient>
            </defs>

            {/* Elasticated Wristband Back */}
            <rect x="75" y="275" width="130" height="55" rx="8" fill="#18181b" stroke="#333" strokeWidth="1.5" />
            <text x="140" y="310" fill="#999" fontSize="8" letterSpacing="1" textAnchor="middle">
              PITTARDS LEATHER
            </text>

            {/* Palm Outline */}
            <path
              d="M 68 150 Q 55 220 75 275 L 205 275 Q 225 220 212 150 Q 140 145 68 150 Z"
              fill="url(#palm-leather)"
              stroke="#9e8a60"
              strokeWidth="1.5"
            />

            {/* Reinforced Double-Layer Wear Patch */}
            <path
              d="M 125 180 Q 155 175 195 210 Q 185 260 145 265 Q 115 250 125 180 Z"
              fill="#c0ab7b"
              opacity="0.8"
              stroke="#877348"
              strokeWidth="1"
              strokeDasharray="2 2"
            />

            {/* Palm Ventilation Eyelets */}
            <circle cx="105" cy="200" r="2.5" fill="#4a3e22" />
            <circle cx="120" cy="205" r="2.5" fill="#4a3e22" />
            <circle cx="135" cy="200" r="2.5" fill="#4a3e22" />
            <circle cx="112" cy="225" r="2.5" fill="#4a3e22" />
            <circle cx="128" cy="225" r="2.5" fill="#4a3e22" />

            {/* Finger Undersides */}
            <path d="M 82 50 L 100 50 L 102 150 L 80 150 Z" fill="url(#palm-leather)" stroke="#9e8a60" strokeWidth="1" />
            <path d="M 110 30 L 130 30 L 132 150 L 108 150 Z" fill="url(#palm-leather)" stroke="#9e8a60" strokeWidth="1" />
            <path d="M 140 20 L 160 20 L 162 150 L 138 150 Z" fill="url(#palm-leather)" stroke="#9e8a60" strokeWidth="1" />
            <path d="M 170 32 L 190 32 L 192 150 L 168 150 Z" fill="url(#palm-leather)" stroke="#9e8a60" strokeWidth="1" />
            {/* Thumb Underside */}
            <path d="M 198 120 L 222 130 L 205 195 L 185 175 Z" fill="url(#palm-leather)" stroke="#9e8a60" strokeWidth="1" />
          </svg>
        )}
      </div>
    </div>
  );
}

/** 3D Interactive Model for Batting Pads (Leg Guards) */
function Pads3D({
  rotation,
  pitch,
  accent,
  lightShift,
  isBackFacing,
  className,
}: {
  rotation: number;
  pitch: number;
  accent: string;
  lightShift: number;
  isBackFacing: boolean;
  className?: string;
}) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ perspective: 900 }}>
      {/* Floor shadow */}
      <div
        className="absolute bottom-4 h-6 rounded-full bg-black/15 blur-md"
        style={{
          width: "180px",
          transform: `translateX(${lightShift * 18}px) scaleY(${0.5 + Math.abs(pitch) * 0.01})`,
        }}
      />

      <div
        className="relative flex items-center justify-center transition-transform duration-75"
        style={{
          transform: `rotateY(${rotation}deg) rotateX(${-pitch}deg)`,
          transformStyle: "preserve-3d",
          width: "240px",
          height: "380px",
        }}
      >
        {!isBackFacing ? (
          /* FRONT FACE: 7-Cane Bolsters, 3D Knee Roll, Instep Protection */
          <svg viewBox="0 0 240 380" className="w-full h-full drop-shadow-xl" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="pad-cane" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#f3f3f5" />
                <stop offset="100%" stopColor="#cfcfd4" />
              </linearGradient>
              <linearGradient id="pad-knee" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1c1c1e" />
                <stop offset="100%" stopColor="#2c2c2e" />
              </linearGradient>
            </defs>

            {/* Top Hat (Thigh/Above Knee Guard) */}
            <path
              d="M 50 40 C 60 15, 180 15, 190 40 L 195 90 C 140 98, 100 98, 45 90 Z"
              fill="url(#pad-cane)"
              stroke="#b5b5ba"
              strokeWidth="1.5"
            />
            {/* Top Hat Accent Line */}
            <path d="M 55 45 C 75 30, 165 30, 185 45" stroke={accent} strokeWidth="2.5" fill="none" />

            {/* 3-Section Molded Knee Roll */}
            <g transform="translate(38, 92)">
              <rect x="0" y="0" width="164" height="18" rx="5" fill="url(#pad-knee)" stroke="#3f3f46" strokeWidth="1" />
              <rect x="6" y="20" width="152" height="20" rx="6" fill="url(#pad-knee)" stroke="#3f3f46" strokeWidth="1" />
              <rect x="12" y="42" width="140" height="18" rx="5" fill="url(#pad-knee)" stroke="#3f3f46" strokeWidth="1" />
              <circle cx="82" cy="30" r="5" fill={accent} />
            </g>

            {/* 7 Vertical Cane Bolsters (Shin & Leg) */}
            {Array.from({ length: 7 }).map((_, i) => {
              const x = 45 + i * 21;
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y="155"
                    width="17"
                    height="175"
                    rx="8"
                    fill="url(#pad-cane)"
                    stroke="#b5b5ba"
                    strokeWidth="1.2"
                  />
                  {/* Subtle vertical center stitch highlight */}
                  <line x1={x + 8.5} y1="160" x2={x + 8.5} y2="325" stroke="#999" strokeWidth="0.8" strokeDasharray="4 2" />
                </g>
              );
            })}

            {/* Wing Protector Contour (Side Wrap) */}
            <path
              d="M 38 160 C 25 210, 25 270, 42 325 L 45 325 L 45 160 Z"
              fill="#27272a"
              opacity="0.9"
              stroke="#3f3f46"
              strokeWidth="1"
            />

            {/* Reinforced Instep Foot Bumper */}
            <path
              d="M 55 330 C 65 365, 175 365, 185 330 Z"
              fill="#18181b"
              stroke="#333"
              strokeWidth="1.5"
            />
            <text x="120" y="352" fill="#888" fontSize="8" fontWeight="700" letterSpacing="1.5" textAnchor="middle">
              CRIX
            </text>
          </svg>
        ) : (
          /* REAR/INTERIOR FACE: Cushion bolsters & dual hook-and-loop padded calf straps */
          <svg viewBox="0 0 240 380" className="w-full h-full drop-shadow-xl" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="pad-interior" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1e22" />
                <stop offset="100%" stopColor="#111113" />
              </linearGradient>
            </defs>

            {/* Interior Base Pad Shell */}
            <rect x="42" y="30" width="156" height="315" rx="18" fill="url(#pad-interior)" stroke="#333" strokeWidth="1.5" />

            {/* Ergonomic Deep Knee Cup Cushion */}
            <circle cx="120" cy="115" r="32" fill="#2a2a30" stroke="#444" strokeWidth="1.5" />
            <circle cx="120" cy="115" r="18" fill="#18181b" stroke={accent} strokeWidth="1" />
            <text x="120" y="118" fill="#aaa" fontSize="7" fontWeight="600" letterSpacing="1" textAnchor="middle">
              GEL CUP
            </text>

            {/* Knee Strap */}
            <rect x="25" y="150" width="190" height="24" rx="4" fill="#09090b" stroke="#333" strokeWidth="1" />
            <rect x="70" y="154" width="100" height="16" fill="#1c1c1e" />
            <text x="120" y="165" fill="#fff" fontSize="8" letterSpacing="1" textAnchor="middle">
              50MM QUICK RELEASE
            </text>

            {/* Padded Calf Pillow Cushions */}
            <rect x="58" y="185" width="124" height="60" rx="8" fill="#25252b" stroke="#383840" strokeWidth="1" />
            <line x1="120" y1="185" x2="120" y2="245" stroke="#1c1c20" strokeWidth="2" />

            {/* Calf Strap */}
            <rect x="20" y="255" width="200" height="28" rx="4" fill="#09090b" stroke="#333" strokeWidth="1" />
            <rect x="65" y="260" width="110" height="18" fill="#1c1c1e" />
            <text x="120" y="272" fill="#fff" fontSize="8" letterSpacing="1" textAnchor="middle">
              COMFORT CALF WRAP
            </text>

            {/* Ankle Strap */}
            <rect x="35" y="295" width="170" height="22" rx="4" fill="#09090b" stroke="#333" strokeWidth="1" />
          </svg>
        )}
      </div>
    </div>
  );
}

/** 3D Interactive Model for Helmets */
function Helmet3D({
  rotation,
  pitch,
  accent,
  lightShift,
  isBackFacing,
  className,
}: {
  rotation: number;
  pitch: number;
  accent: string;
  lightShift: number;
  isBackFacing: boolean;
  className?: string;
}) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ perspective: 900 }}>
      <div
        className="absolute bottom-8 h-8 rounded-full bg-black/20 blur-md"
        style={{
          width: "210px",
          transform: `translateX(${lightShift * 25}px) scaleY(${0.5 + Math.abs(pitch) * 0.01})`,
        }}
      />

      <div
        className="relative flex items-center justify-center transition-transform duration-75"
        style={{
          transform: `rotateY(${rotation}deg) rotateX(${-pitch}deg)`,
          transformStyle: "preserve-3d",
          width: "280px",
          height: "320px",
        }}
      >
        {!isBackFacing ? (
          /* FRONT/SIDE: Titanium Grille, Aerodynamic Shell, Peak Visor */
          <svg viewBox="0 0 280 320" className="w-full h-full drop-shadow-xl" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="helmet-shell" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#27272a" />
                <stop offset="50%" stopColor="#18181b" />
                <stop offset="100%" stopColor="#09090b" />
              </linearGradient>
              <linearGradient id="titanium-grille" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a1a1aa" />
                <stop offset="50%" stopColor="#f4f4f5" />
                <stop offset="100%" stopColor="#71717a" />
              </linearGradient>
            </defs>

            {/* Aerodynamic Shell Dome */}
            <path
              d="M 45 150 C 40 50, 240 50, 235 150 C 235 190, 215 210, 195 210 L 85 210 C 65 210, 45 190, 45 150 Z"
              fill="url(#helmet-shell)"
              stroke="#3f3f46"
              strokeWidth="2"
            />

            {/* Cooling Air Intake Vent Channels */}
            <path d="M 105 75 L 120 100 L 115 102 L 100 78 Z" fill="#09090b" stroke="#3f3f46" strokeWidth="0.8" />
            <path d="M 175 75 L 160 100 L 165 102 L 180 78 Z" fill="#09090b" stroke="#3f3f46" strokeWidth="0.8" />
            <path d="M 135 68 L 145 68 L 145 92 L 135 92 Z" fill="#09090b" stroke="#3f3f46" strokeWidth="0.8" />

            {/* Helmet Visor Peak */}
            <path d="M 48 145 Q 140 120 232 145 L 225 160 Q 140 140 55 160 Z" fill="#09090b" stroke={accent} strokeWidth="1.5" />

            {/* Ear Guard Plates */}
            <rect x="52" y="165" width="28" height="42" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
            <circle cx="66" cy="186" r="6" fill="#09090b" />
            <rect x="200" y="165" width="28" height="42" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
            <circle cx="214" cy="186" r="6" fill="#09090b" />

            {/* Titanium Wire Grille */}
            {/* Top Bar / Eye-line */}
            <path d="M 68 165 Q 140 148 212 165" stroke="url(#titanium-grille)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Mid Bar */}
            <path d="M 72 195 Q 140 180 208 195" stroke="url(#titanium-grille)" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Lower Chin Bar */}
            <path d="M 80 225 Q 140 215 200 225" stroke="url(#titanium-grille)" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Bottom Enclosing Loop */}
            <path d="M 95 255 Q 140 250 185 255" stroke="url(#titanium-grille)" strokeWidth="3.5" strokeLinecap="round" fill="none" />

            {/* Vertical Support Grille Struts */}
            <line x1="105" y1="162" x2="105" y2="255" stroke="url(#titanium-grille)" strokeWidth="3.5" />
            <line x1="140" y1="156" x2="140" y2="252" stroke="url(#titanium-grille)" strokeWidth="3.5" />
            <line x1="175" y1="162" x2="175" y2="255" stroke="url(#titanium-grille)" strokeWidth="3.5" />

            {/* Chin Cup Protection */}
            <rect x="110" y="248" width="60" height="20" rx="8" fill="#1c1c1e" stroke="#333" strokeWidth="1" />
            <text x="140" y="261" fill="#fff" fontSize="8" fontWeight="700" letterSpacing="1.5" textAnchor="middle">
              TITANIUM
            </text>
          </svg>
        ) : (
          /* REAR: Occipital Neck Shield, Dial Fit System, Air Exhaust */
          <svg viewBox="0 0 280 320" className="w-full h-full drop-shadow-xl" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="helmet-back" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#27272a" />
                <stop offset="100%" stopColor="#09090b" />
              </linearGradient>
            </defs>

            {/* Shell Rear Dome */}
            <path
              d="M 50 140 C 45 45, 235 45, 230 140 C 230 195, 205 225, 140 225 C 75 225, 50 195, 50 140 Z"
              fill="url(#helmet-back)"
              stroke="#3f3f46"
              strokeWidth="2"
            />

            {/* Dual Air Exhaust Vents */}
            <rect x="90" y="90" width="35" height="15" rx="3" fill="#09090b" stroke="#3f3f46" strokeWidth="1" />
            <rect x="155" y="90" width="35" height="15" rx="3" fill="#09090b" stroke="#3f3f46" strokeWidth="1" />

            {/* Occipital Pad Lower Extension */}
            <path d="M 85 200 C 100 240, 180 240, 195 200 Z" fill="#18181b" stroke="#333" strokeWidth="1.5" />

            {/* Micro-Dial Precision Fit Adjuster */}
            <g transform="translate(140, 195)">
              <circle cx="0" cy="0" r="18" fill="#09090b" stroke="#444" strokeWidth="2" />
              <circle cx="0" cy="0" r="14" fill="#27272a" />
              <circle cx="0" cy="0" r="6" fill={accent} />
              {/* Dial Grips */}
              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1="-14"
                  x2="0"
                  y2="-17"
                  stroke="#666"
                  strokeWidth="1.5"
                  transform={`rotate(${i * 45})`}
                />
              ))}
            </g>
            <text x="140" y="228" fill="#aaa" fontSize="7" fontWeight="600" letterSpacing="1" textAnchor="middle">
              DIAL-FIT SYSTEM
            </text>
          </svg>
        )}
      </div>
    </div>
  );
}

/** 3D Interactive Model for Kit Bags */
function Bag3D({
  rotation,
  pitch,
  accent,
  lightShift,
  isBackFacing,
  className,
}: {
  rotation: number;
  pitch: number;
  accent: string;
  lightShift: number;
  isBackFacing: boolean;
  className?: string;
}) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ perspective: 900 }}>
      <div
        className="absolute bottom-6 h-8 rounded-full bg-black/20 blur-md"
        style={{
          width: "230px",
          transform: `translateX(${lightShift * 22}px) scaleY(${0.5 + Math.abs(pitch) * 0.01})`,
        }}
      />

      <div
        className="relative flex items-center justify-center transition-transform duration-75"
        style={{
          transform: `rotateY(${rotation}deg) rotateX(${-pitch}deg)`,
          transformStyle: "preserve-3d",
          width: "280px",
          height: "360px",
        }}
      >
        {!isBackFacing ? (
          /* FRONT: Heavy 1680D Cordura luggage body, lockable zips, carry straps */
          <svg viewBox="0 0 280 360" className="w-full h-full drop-shadow-xl" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="bag-cordura" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#27272a" />
                <stop offset="60%" stopColor="#18181b" />
                <stop offset="100%" stopColor="#09090b" />
              </linearGradient>
            </defs>

            {/* Main Wheelie Luggage Trunk Body */}
            <rect x="45" y="40" width="190" height="270" rx="20" fill="url(#bag-cordura)" stroke="#3f3f46" strokeWidth="2" />

            {/* Corner Armor Scuff Bumper Protectors */}
            <path d="M 45 60 C 45 45, 60 45, 75 45 L 75 75 L 45 75 Z" fill="#09090b" stroke="#333" />
            <path d="M 235 60 C 235 45, 220 45, 205 45 L 205 75 L 235 75 Z" fill="#09090b" stroke="#333" />
            <path d="M 45 290 C 45 305, 60 310, 75 310 L 75 280 L 45 280 Z" fill="#09090b" stroke="#333" />
            <path d="M 235 290 C 235 305, 220 310, 205 310 L 205 280 L 235 280 Z" fill="#09090b" stroke="#333" />

            {/* Top Padded Grab Haul Handle */}
            <rect x="100" y="20" width="80" height="20" rx="6" fill="#09090b" stroke="#444" strokeWidth="1.5" />
            <line x1="140" y1="20" x2="140" y2="40" stroke={accent} strokeWidth="2" />

            {/* Front Utility Zipper Compartment */}
            <rect x="65" y="80" width="150" height="100" rx="10" fill="#141416" stroke="#2e2e32" strokeWidth="1.5" />
            <line x1="75" y1="95" x2="205" y2="95" stroke="#444" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="140" y="135" fill="#fff" fontSize="13" fontWeight="800" letterSpacing="4" textAnchor="middle">
              CRIX PRO
            </text>
            <text x="140" y="152" fill="#888" fontSize="8" fontWeight="600" letterSpacing="1.5" textAnchor="middle">
              1680D CORDURA
            </text>

            {/* Lower Ventilated Footwear Shoe Tunnel */}
            <rect x="65" y="200" width="150" height="90" rx="10" fill="#141416" stroke="#2e2e32" strokeWidth="1.5" />
            {/* Ventilation Eyelets */}
            <circle cx="100" cy="225" r="4" fill="#09090b" stroke="#444" strokeWidth="1" />
            <circle cx="125" cy="225" r="4" fill="#09090b" stroke="#444" strokeWidth="1" />
            <circle cx="150" cy="225" r="4" fill="#09090b" stroke="#444" strokeWidth="1" />
            <circle cx="175" cy="225" r="4" fill="#09090b" stroke="#444" strokeWidth="1" />
            <text x="140" y="260" fill="#666" fontSize="8" fontWeight="600" letterSpacing="1" textAnchor="middle">
              VENTILATED SHOE TUNNEL
            </text>

            {/* Lower Dual Heavy-Duty Tractor Wheels */}
            <g transform="translate(38, 285)">
              <rect x="0" y="0" width="14" height="34" rx="4" fill="#09090b" stroke="#444" strokeWidth="1.5" />
              <line x1="0" y1="10" x2="14" y2="10" stroke="#333" strokeWidth="1" />
              <line x1="0" y1="20" x2="14" y2="20" stroke="#333" strokeWidth="1" />
            </g>
            <g transform="translate(228, 285)">
              <rect x="0" y="0" width="14" height="34" rx="4" fill="#09090b" stroke="#444" strokeWidth="1.5" />
              <line x1="0" y1="10" x2="14" y2="10" stroke="#333" strokeWidth="1" />
              <line x1="0" y1="20" x2="14" y2="20" stroke="#333" strokeWidth="1" />
            </g>
          </svg>
        ) : (
          /* REAR/SIDE: Dual Internal Bat Cave Cavities & Chassis Skid Rails */
          <svg viewBox="0 0 280 360" className="w-full h-full drop-shadow-xl" style={{ overflow: "visible" }}>
            <rect x="45" y="40" width="190" height="270" rx="20" fill="#141417" stroke="#3f3f46" strokeWidth="2" />
            {/* Dual Telescopic Trolley Rails */}
            <rect x="85" y="40" width="16" height="260" rx="3" fill="#222" stroke="#333" strokeWidth="1" />
            <rect x="179" y="40" width="16" height="260" rx="3" fill="#222" stroke="#333" strokeWidth="1" />
            {/* Dual Bat Cave Compartment Sleeves */}
            <rect x="105" y="70" width="70" height="200" rx="8" fill="#09090b" stroke="#2e2e32" strokeWidth="1.5" />
            <line x1="140" y1="70" x2="140" y2="270" stroke="#222" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x="140" y="165" fill="#aaa" fontSize="8" fontWeight="600" letterSpacing="1" textAnchor="middle">
              2X BAT CAVE
            </text>
            <text x="140" y="180" fill="#777" fontSize="7" letterSpacing="0.5" textAnchor="middle">
              PADDED WILLOW CHAMBER
            </text>
          </svg>
        )}
      </div>
    </div>
  );
}

/** 3D Interactive Model for Accessories (Cricket Ball, Mallet, Care Kit) */
function Accessory3D({
  rotation,
  pitch,
  accent,
  lightShift,
  className,
}: {
  rotation: number;
  pitch: number;
  accent: string;
  lightShift: number;
  className?: string;
}) {
  const rad = (rotation * Math.PI) / 180;
  const seamShift = Math.sin(rad) * 45;

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ perspective: 900 }}>
      {/* Dynamic floor shadow */}
      <div
        className="absolute bottom-10 h-7 rounded-full bg-black/20 blur-md"
        style={{
          width: "160px",
          transform: `translateX(${lightShift * 20}px) scaleY(${0.4 + Math.abs(pitch) * 0.01})`,
        }}
      />

      <div
        className="relative flex items-center justify-center transition-transform duration-75"
        style={{
          transform: `rotateY(${rotation}deg) rotateX(${-pitch}deg)`,
          transformStyle: "preserve-3d",
          width: "260px",
          height: "280px",
        }}
      >
        <svg viewBox="0 0 260 280" className="w-full h-full drop-shadow-2xl" style={{ overflow: "visible" }}>
          <defs>
            <radialGradient id="ball-body" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#f4f4f6" />
              <stop offset="70%" stopColor="#cfcfd4" />
              <stop offset="100%" stopColor="#71717a" />
            </radialGradient>
            <radialGradient id="ball-gloss" cx="30%" cy="25%" r="40%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Spherical Ball Outer Contour */}
          <circle cx="130" cy="140" r="85" fill="url(#ball-body)" stroke="#999" strokeWidth="1.5" />

          {/* Specular Light Reflection */}
          <ellipse cx="105" cy="110" rx="35" ry="22" fill="url(#ball-gloss)" transform="rotate(-25 105 110)" />

          {/* Hand-Sewn 78-Stitch Dynamic Seam */}
          <g transform={`translate(${seamShift}, 0)`}>
            {/* Primary Seam Curve */}
            <path
              d="M 130 55 C 150 90, 150 190, 130 225"
              fill="none"
              stroke="#18181b"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Seam Stitch Ridges */}
            {Array.from({ length: 18 }).map((_, i) => {
              const y = 65 + i * 8.5;
              return (
                <line
                  key={i}
                  x1="126"
                  y1={y}
                  x2="136"
                  y2={y}
                  stroke="#ffffff"
                  strokeWidth="1.8"
                />
              );
            })}
            {/* Quarter Seam Marks */}
            <path d="M 95 100 Q 130 140 95 180" fill="none" stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M 165 100 Q 130 140 165 180" fill="none" stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" />
          </g>

          {/* CRIX Crest Brand Stamp */}
          <circle cx="130" cy="140" r="14" fill="none" stroke={accent} strokeWidth="1" opacity="0.8" />
          <text x="130" y="143" fill={accent} fontSize="8" fontWeight="800" letterSpacing="1" textAnchor="middle">
            CRIX
          </text>
        </svg>
      </div>
    </div>
  );
}
