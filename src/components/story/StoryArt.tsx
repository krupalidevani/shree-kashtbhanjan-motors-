import type { ReactNode } from "react";

/*
 * Night-time vector art for the service story, in the site's navy and orange.
 * Every piece is drawn around its own origin on the ground (feet / wheel
 * bottoms), so the scene places it with a single translate. Gradients and the
 * glow filter are defined once in <StoryDefs />.
 */

export const palette = {
  navy950: "#08101f",
  navy900: "#0e192f",
  navy800: "#15233f",
  navy700: "#1e3052",
  orange: "#f26a1b",
  orangeDark: "#c2410c",
  teal: "#0f9d8a",
  skin: "#c98b5e",
  hair: "#16110d",
  warm: "#fbbf24",
};

/** Shared gradients and filters. Render once inside the scene's <svg>. */
export function StoryDefs() {
  return (
    <defs>
      <linearGradient id="ss-car" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.45" stopColor="#e2e8f0" />
        <stop offset="1" stopColor="#8a96a8" />
      </linearGradient>
      <linearGradient id="ss-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#a9d4f5" />
        <stop offset="0.55" stopColor="#3f6c99" />
        <stop offset="1" stopColor="#1b2f4d" />
      </linearGradient>
      <radialGradient id="ss-rim" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#f8fafc" />
        <stop offset="1" stopColor="#64748b" />
      </radialGradient>
      <linearGradient id="ss-beam" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff3c4" stopOpacity="0.55" />
        <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="ss-beam-left" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stopColor="#fff3c4" stopOpacity="0.5" />
        <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="ss-cone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffd28a" stopOpacity="0.38" />
        <stop offset="1" stopColor="#ffd28a" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="ss-pool" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffd28a" stopOpacity="0.32" />
        <stop offset="1" stopColor="#ffd28a" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="ss-orange" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fb8a46" />
        <stop offset="1" stopColor="#d95510" />
      </linearGradient>
      <linearGradient id="ss-building" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1b2b4b" />
        <stop offset="1" stopColor="#101b33" />
      </linearGradient>
      <linearGradient id="ss-workshop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffe3a3" />
        <stop offset="1" stopColor="#f0a33a" />
      </linearGradient>
      <linearGradient id="ss-washbay" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7fe3f5" />
        <stop offset="1" stopColor="#167e9a" />
      </linearGradient>
      <linearGradient id="ss-road" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#222c3f" />
        <stop offset="1" stopColor="#141b2a" />
      </linearGradient>
      <radialGradient id="ss-red-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ff4d4d" stopOpacity="0.7" />
        <stop offset="1" stopColor="#ff4d4d" stopOpacity="0" />
      </radialGradient>
      <filter id="ss-glow" x="-30%" y="-60%" width="160%" height="220%">
        <feGaussianBlur stdDeviation="7" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

type PersonProps = {
  /** Outfit: a smart navy suit with an orange tie, or the garage's orange work uniform. */
  outfit: "suit" | "mechanic";
  /** Faces left instead of right. */
  flip?: boolean;
  /** Sitting (on the scooter): knees bent forward. */
  seated?: boolean;
  /** Static angle of the front arm, degrees (negative raises it forwards). */
  armAngle?: number;
  /** CSS animation class for the front arm (e.g. a wrench swing). */
  armClass?: string;
  /** Something held in the front hand. */
  hold?: "wrench" | "phone" | "key";
  /** data-k tag for the front arm, so the scene can rotate it. */
  armKey?: string;
};

/** Shoulder pivot of the front arm, for rotating it from outside. */
export const SHOULDER = { x: 19, y: -124 };

const skin = { face: "#f2bd84", shade: "#dc9c63" };
const outfits = {
  suit: { top: "#1a3657", topShade: "#152c48", lapel: "#21446b", legs: "#173048", shoes: "#4a2512" },
  mechanic: { top: "#f26a1b", topShade: "#d95510", lapel: "#c2410c", legs: "#c2410c", shoes: "#3a2414" },
};

function HandItem({ hold }: { hold: PersonProps["hold"] }) {
  if (hold === "wrench")
    return (
      <g transform="translate(19 -76)">
        <rect x={-2.5} y={0} width={5} height={30} rx={2.5} fill="#cbd5e1" />
        <path d="M-8 28 a8 8 0 1 0 16 0 l-4 0 l0 5 l-8 0 l0 -5 z" fill="#cbd5e1" />
      </g>
    );
  if (hold === "phone")
    return (
      <g transform="translate(12 -88)">
        <rect width={14} height={24} rx={3} fill="#0b1220" />
        <rect x={2} y={3} width={10} height={16} rx={1.5} fill="#7dd3fc" />
      </g>
    );
  if (hold === "key")
    return (
      <g transform="translate(20 -72)" filter="url(#ss-glow)">
        <circle r={7} fill="none" stroke={palette.warm} strokeWidth={3.5} />
        <rect x={-2} y={6} width={4} height={16} fill={palette.warm} />
        <rect x={2} y={15} width={6} height={3} fill={palette.warm} />
      </g>
    );
  return null;
}

/**
 * A friendly flat-style character, about 190 units tall with a big head and
 * long legs, feet at the origin, facing right.
 */
export function Person({ outfit, flip, seated, armAngle = 0, armClass, hold, armKey }: PersonProps) {
  const c = outfits[outfit];
  const mechanic = outfit === "mechanic";
  return (
    <g transform={flip ? "scale(-1 1)" : undefined}>
      {!seated && <ellipse cy={2} rx={30} ry={5} fill="#000" opacity={0.35} />}

      {/* Legs and shoes */}
      {seated ? (
        <>
          <path d="M-18 -76 L20 -76 L24 -38 L13 -38 L10 -64 L-18 -64 Z" fill={c.legs} />
          <path d="M8 -40 h18 q8 0 9 6 h-28 q0 -6 1 -6 z" fill={c.shoes} />
        </>
      ) : (
        <>
          <path d="M-18 -76 L-14 -6 L-3 -6 L-1 -76 Z" fill={c.legs} />
          <path d="M1 -76 L4 -6 L15 -6 L18 -76 Z" fill={c.legs} />
          <path d="M-1 -76 L1 -76 L3 -40 Z" fill="#000" opacity={0.15} />
          <path d="M-20 -7 q3 -6 15 -6 q6 0 6 6 v4 h-22 q-1 -2 1 -4 z" fill={c.shoes} />
          <path d="M3 -7 q3 -6 15 -6 q10 0 11 8 v2 h-26 z" fill={c.shoes} />
          {mechanic && (
            <>
              <rect x={-16.5} y={-34} width={14} height={4} fill="#e2e8f0" opacity={0.9} />
              <rect x={2.5} y={-34} width={14} height={4} fill="#e2e8f0" opacity={0.9} />
            </>
          )}
        </>
      )}

      {/* Back arm */}
      <path d="M-21 -128 q-10 3 -11 14 l-2 40 q0 6 6 6 q5 0 5 -6 l2 -38 z" fill={c.topShade} />
      <ellipse cx={-28} cy={-68} rx={6} ry={7} fill={skin.face} />

      {/* Jacket / uniform */}
      <path d="M-22 -130 Q-26 -130 -25 -120 L-22 -72 L22 -72 L25 -120 Q26 -130 22 -130 Z" fill={c.top} />
      <path d="M-22 -130 Q-26 -130 -25 -120 L-22 -72 L-10 -72 L-14 -128 Z" fill="#000" opacity={0.12} />
      {mechanic ? (
        <>
          <path d="M-9 -131 L0 -120 L9 -131 Z" fill={palette.navy700} />
          <rect x={-22} y={-104} width={44} height={5} fill="#e2e8f0" opacity={0.9} />
          <rect x={-22} y={-86} width={44} height={5} fill="#e2e8f0" opacity={0.9} />
          <rect x={6} y={-120} width={11} height={9} rx={2} fill={c.lapel} />
        </>
      ) : (
        <>
          <path d="M-9 -131 L0 -112 L9 -131 Z" fill="#f8fafc" />
          <path d="M-2.5 -126 L2.5 -126 L4.5 -98 L0 -92 L-4.5 -98 Z" fill={palette.orange} />
          <path d="M-9 -131 L-3 -96 L-12 -118 L-8 -122 Z" fill={c.lapel} />
          <path d="M9 -131 L3 -96 L12 -118 L8 -122 Z" fill={c.lapel} />
          <path d="M-1 -74 L1 -74 L1 -86 Z" fill="#000" opacity={0.2} />
        </>
      )}

      {/* Head */}
      <rect x={-6} y={-140} width={13} height={12} fill={skin.shade} />
      <ellipse cx={-19} cy={-160} rx={5} ry={7} fill={skin.shade} />
      <path d="M-18 -166 Q-20 -196 4 -196 Q26 -196 26 -168 Q26 -140 4 -138 Q-16 -138 -18 -166 Z" fill={skin.face} />
      <path d="M-3 -171 q5 -4 10 -1" stroke="#4b2e1e" strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M13 -172 q5 -3 9 0" stroke="#4b2e1e" strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M-1 -163 q4 -2 8 0" stroke="#1b1b1b" strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M14 -164 q3 -2 7 0" stroke="#1b1b1b" strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M12 -164 q3 7 2 11 q-2 2 -5 1" stroke={skin.shade} strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M4 -147 q7 5 14 -1" stroke="#e8550c" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {mechanic ? (
        <>
          <path d="M-20 -170 Q-20 -200 4 -200 Q28 -200 27 -172 Z" fill={palette.navy700} />
          <path d="M20 -174 q16 0 20 5 l-20 1 z" fill={palette.orange} />
          <circle cx={4} cy={-187} r={5} fill={palette.orange} />
          <path d="M-20 -170 Q-22 -158 -16 -150 L-14 -168 Z" fill="#4b2e1e" />
        </>
      ) : (
        <path
          d="M-21 -164 Q-24 -200 4 -201 Q30 -201 27 -176 Q24 -184 12 -182 Q-2 -180 -8 -172 Q-12 -166 -12 -156 Q-18 -156 -21 -164 Z"
          fill="#4b2e1e"
        />
      )}

      {/* Front arm, rotating at the shoulder */}
      <g data-k={armKey} transform={`rotate(${armAngle} ${SHOULDER.x} ${SHOULDER.y})`}>
        <g className={armClass} style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}>
          <path d="M13 -128 q11 2 12 14 l1 38 q0 6 -6 6 q-6 0 -6 -6 l-1 -36 z" fill={c.top} />
          <ellipse cx={20} cy={-72} rx={6.5} ry={7.5} fill={skin.face} />
          <HandItem hold={hold} />
        </g>
      </g>
    </g>
  );
}

function Wheel({ wheelKey, x }: { wheelKey: string; x: number }) {
  return (
    <g transform={`translate(${x} -30)`}>
      <g data-k={wheelKey}>
        <circle r={30} fill="#0b0f17" />
        <circle r={25} fill="none" stroke="#273142" strokeWidth={3} />
        <circle r={18} fill="url(#ss-rim)" />
        {[0, 72, 144, 216, 288].map((angle) => (
          <path key={angle} d="M-2.5 -4 L-4 -17 L4 -17 L2.5 -4 Z" fill="#94a3b8" transform={`rotate(${angle})`} />
        ))}
        <circle r={5} fill="#475569" />
        <path d="M-8 -14 a16 16 0 0 1 14 -3" stroke="#fff" strokeWidth={2} opacity={0.6} fill="none" />
      </g>
    </g>
  );
}

type CarProps = {
  /** data-k tags for the parts the scene animates. */
  frontWheelKey: string;
  rearWheelKey: string;
  hoodKey: string;
  beamKey: string;
  /** Heads shown through the side window: whoever is driving. */
  drivers: ReactNode;
  /** Extras drawn behind the car body (speed lines). */
  behind?: ReactNode;
};

/** A modern sedan, about 350 units long, wheels on the origin line, facing right, lights on. */
export function Car({ frontWheelKey, rearWheelKey, hoodKey, beamKey, drivers, behind }: CarProps) {
  return (
    <g>
      {behind}
      {/* Headlight beam on the road ahead */}
      <path data-k={beamKey} d="M172 -70 L560 -150 L560 30 Z" fill="url(#ss-beam)" />
      <ellipse cx={0} cy={3} rx={185} ry={12} fill="#000" opacity={0.45} />
      <ellipse cx={-178} cy={-72} rx={26} ry={18} fill="url(#ss-red-glow)" />
      {/* Body */}
      <path
        d="M-170 -40 C-172 -70 -160 -86 -130 -90 L-95 -96 C-75 -128 -50 -146 -10 -148 L45 -148 C75 -146 95 -128 115 -100 L150 -94 C168 -90 176 -76 176 -58 L176 -42 C176 -32 168 -28 158 -28 L-158 -28 C-166 -28 -170 -32 -170 -40 Z"
        fill="url(#ss-car)"
      />
      {/* Windows */}
      <path d="M-84 -98 C-66 -124 -46 -138 -14 -139 L-14 -98 Z" fill="url(#ss-glass)" />
      <path d="M-4 -98 L-4 -139 L42 -139 C66 -138 84 -124 102 -99 Z" fill="url(#ss-glass)" />
      {drivers}
      <path d="M-74 -104 C-60 -122 -44 -132 -24 -134" stroke="#fff" strokeWidth={3} opacity={0.5} fill="none" strokeLinecap="round" />
      {/* Panels, handles, mirror */}
      <path d="M-9 -98 L-9 -36 M74 -97 C78 -80 78 -52 72 -36" stroke="#94a3b8" strokeWidth={1.6} fill="none" />
      <rect x={-46} y={-86} width={18} height={4} rx={2} fill="#94a3b8" />
      <rect x={36} y={-86} width={18} height={4} rx={2} fill="#94a3b8" />
      <path d="M98 -104 q10 -6 16 2 l-4 5 z" fill="#cbd5e1" />
      <path d="M-160 -78 C-60 -84 60 -86 166 -80" stroke="#fff" strokeWidth={2.5} opacity={0.7} fill="none" />
      <path d="M-170 -46 L176 -46 L176 -40 C176 -32 168 -28 158 -28 L-158 -28 C-166 -28 -170 -32 -170 -40 Z" fill="#334155" />
      {/* Wheel arches */}
      <path d="M-142 -30 a38 38 0 0 1 76 0 Z M68 -30 a38 38 0 0 1 76 0 Z" fill="#0b1220" />
      {/* Lights */}
      <path d="M164 -82 L176 -78 L176 -66 L160 -68 Z" fill="#fff8db" />
      <rect x={-171} y={-84} width={9} height={16} rx={3} fill="#ef4444" />
      <rect x={150} y={-48} width={24} height={6} rx={3} fill={palette.orange} />
      {/* Bonnet: hinged at the windscreen so it can open */}
      <g data-k={hoodKey}>
        <path d="M112 -100 L150 -94 C166 -90 174 -80 176 -68 L114 -70 Z" fill="url(#ss-car)" stroke="#94a3b8" strokeWidth={1.2} />
      </g>
      <Wheel wheelKey={rearWheelKey} x={-104} />
      <Wheel wheelKey={frontWheelKey} x={106} />
    </g>
  );
}

/** Head and shoulders seen through the car window, in the same style as Person. */
export function DriverHead({ outfit, headKey }: { outfit: PersonProps["outfit"]; headKey: string }) {
  const mechanic = outfit === "mechanic";
  return (
    <g data-k={headKey}>
      <path d="M6 -98 q0 -14 18 -14 q18 0 18 14 z" fill={outfits[outfit].top} />
      <ellipse cx={24} cy={-122} rx={11} ry={13} fill={skin.face} />
      <path d="M26 -124 q3 -2 6 0" stroke="#1b1b1b" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d="M25 -114 q4 3 8 0" stroke="#e8550c" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      {mechanic ? (
        <>
          <path d="M12 -126 Q12 -138 24 -138 Q36 -138 36 -126 Z" fill={palette.navy700} />
          <path d="M32 -128 q9 0 12 3 l-12 1 z" fill={palette.orange} />
        </>
      ) : (
        <path d="M12 -122 Q11 -137 24 -137 Q37 -137 36 -126 Q32 -130 24 -129 Q17 -128 16 -118 Z" fill="#4b2e1e" />
      )}
    </g>
  );
}

/** A service scooter with a branded toolbox, wheels on the origin line, facing left. */
export function Scooter({ rider }: { rider?: ReactNode }) {
  return (
    <g>
      <ellipse cy={3} rx={75} ry={8} fill="#000" opacity={0.4} />
      <path d="M-62 -66 L-260 -120 L-260 -10 Z" fill="url(#ss-beam-left)" />
      {rider}
      <g transform="scale(-1 1)">
        {/* Toolbox */}
        <rect x={-74} y={-96} width={40} height={32} rx={5} fill={palette.navy800} stroke="#334155" strokeWidth={2} />
        <rect x={-74} y={-84} width={40} height={6} fill={palette.orange} />
        {/* Body */}
        <path d="M-58 -34 C-64 -60 -46 -70 -20 -68 L10 -68 C20 -68 22 -52 30 -46 L54 -44 C62 -44 64 -36 60 -30 Z" fill="url(#ss-orange)" />
        <path d="M30 -46 L44 -100 C46 -106 54 -106 54 -100 L52 -44 Z" fill="url(#ss-orange)" />
        <rect x={-40} y={-80} width={46} height={12} rx={6} fill="#0b1220" />
        <path d="M42 -100 L62 -104" stroke="#0b1220" strokeWidth={6} strokeLinecap="round" />
        <circle cx={56} cy={-90} r={5} fill="#fff8db" />
        <rect x={-30} y={-36} width={56} height={6} rx={3} fill="#334155" />
        {/* Wheels */}
        {[-42, 46].map((wx) => (
          <g key={wx} transform={`translate(${wx} -19)`}>
            <circle r={19} fill="#0b0f17" />
            <circle r={9} fill="url(#ss-rim)" />
          </g>
        ))}
      </g>
    </g>
  );
}

/** A spinning gear made from a thick dashed ring. */
export function Gear({ r, x, y, reverse }: { r: number; x: number; y: number; reverse?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} filter="url(#ss-glow)">
      <g className={reverse ? "story-spin-reverse" : "story-spin"} style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}>
        <circle r={r} fill="none" stroke={palette.orange} strokeWidth={r * 0.55} strokeDasharray={`${r * 0.42} ${r * 0.32}`} />
        <circle r={r * 0.62} fill={palette.orange} />
        <circle r={r * 0.25} fill={palette.navy900} />
      </g>
    </g>
  );
}

export function Tree({ x, scale = 1 }: { x: number; scale?: number }) {
  return (
    <g transform={`translate(${x} 690) scale(${scale})`}>
      <rect x={-6} y={-70} width={12} height={70} rx={4} fill="#1f1a17" />
      <circle cy={-104} r={44} fill="#123d2c" />
      <circle cx={-28} cy={-82} r={30} fill="#164a35" />
      <circle cx={30} cy={-86} r={32} fill="#0f3326" />
      <path d="M-30 -128 a40 40 0 0 1 40 -16" stroke="#2f7a58" strokeWidth={4} fill="none" opacity={0.6} strokeLinecap="round" />
    </g>
  );
}

/** Street lamp with its cone of light and a pool on the pavement. */
export function StreetLamp({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 700)`}>
      <ellipse cx={42} cy={8} rx={120} ry={26} fill="url(#ss-pool)" />
      <path d="M30 -244 L-60 6 L150 6 L56 -244 Z" fill="url(#ss-cone)" />
      <rect x={-4} y={-250} width={8} height={250} fill="#334155" />
      <path d="M0 -246 Q0 -270 40 -268" fill="none" stroke="#334155" strokeWidth={7} />
      <rect x={24} y={-272} width={38} height={12} rx={5} fill="#1e293b" />
      <rect x={28} y={-262} width={30} height={6} rx={3} fill="#ffe7a3" filter="url(#ss-glow)" />
    </g>
  );
}

/** Dark glass speech bubble with a tail pointing down to (0, 0). */
export function Bubble({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  return (
    <g>
      <rect x={-width / 2} y={-height - 18} width={width} height={height} rx={22} fill={palette.navy900} fillOpacity={0.92} stroke="#ffffff" strokeOpacity={0.14} strokeWidth={2} />
      <path d="M-12 -20 L0 0 L12 -20 Z" fill={palette.navy900} fillOpacity={0.92} />
      <g transform={`translate(0 ${-height / 2 - 18})`}>{children}</g>
    </g>
  );
}

/** A distant skyline of offices with a scattering of lit windows. */
export function Skyline({ count, baseY, color, windowOpacity, seed }: { count: number; baseY: number; color: string; windowOpacity: number; seed: number }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const w = 90 + ((i * 37 + seed) % 80);
        const h = 170 + ((i * 53 + seed * 3) % 230);
        const x = i * 175 + ((i * 29 + seed) % 40);
        const rows = Math.floor((h - 30) / 26);
        const cols = Math.floor((w - 20) / 22);
        return (
          <g key={i}>
            <rect x={x} y={baseY - h} width={w} height={h + 400} rx={4} fill={color} />
            {Array.from({ length: rows * cols }, (_, j) => {
              const on = (j * 7 + i * 13 + seed) % 5 === 0;
              if (!on) return null;
              const cx = x + 12 + (j % cols) * 22;
              const cy = baseY - h + 18 + Math.floor(j / cols) * 26;
              return <rect key={j} x={cx} y={cy} width={10} height={12} rx={1.5} fill={palette.warm} opacity={windowOpacity} />;
            })}
          </g>
        );
      })}
    </g>
  );
}
