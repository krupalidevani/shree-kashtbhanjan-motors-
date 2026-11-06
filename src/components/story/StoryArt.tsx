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
  shirt: string;
  pants?: string;
  /** A mechanic: cap and reflective stripes on the uniform. */
  mechanic?: boolean;
  /** Faces left instead of right. */
  flip?: boolean;
  /** Static angle of the front arm, degrees (negative raises it forwards). */
  armAngle?: number;
  /** CSS animation class for the front arm (e.g. a wrench swing). */
  armClass?: string;
  /** Something held in the front hand. */
  hold?: "wrench" | "phone" | "key";
  /** data-k tag for the front arm, so the scene can rotate it. */
  armKey?: string;
};

function HandItem({ hold }: { hold: PersonProps["hold"] }) {
  if (hold === "wrench")
    return (
      <g transform="translate(20 -50)">
        <rect x={-2.5} y={0} width={5} height={28} rx={2.5} fill="#cbd5e1" />
        <path d="M-8 26 a8 8 0 1 0 16 0 l-4 0 l0 5 l-8 0 l0 -5 z" fill="#cbd5e1" />
      </g>
    );
  if (hold === "phone")
    return (
      <g transform="translate(13 -62)">
        <rect width={13} height={22} rx={3} fill="#0b1220" />
        <rect x={2} y={3} width={9} height={14} rx={1.5} fill="#7dd3fc" />
      </g>
    );
  if (hold === "key")
    return (
      <g transform="translate(20 -48)" filter="url(#ss-glow)">
        <circle r={7} fill="none" stroke={palette.warm} strokeWidth={3.5} />
        <rect x={-2} y={6} width={4} height={16} fill={palette.warm} />
        <rect x={2} y={15} width={6} height={3} fill={palette.warm} />
      </g>
    );
  return null;
}

/** A person about 140 units tall, feet at the origin, facing right. */
export function Person({ shirt, pants = "#1e293b", mechanic, flip, armAngle = 0, armClass, hold, armKey }: PersonProps) {
  return (
    <g transform={flip ? "scale(-1 1)" : undefined}>
      <ellipse cy={2} rx={26} ry={5} fill="#000" opacity={0.35} />
      {/* Legs and shoes */}
      <path d="M-14 -56 L-13 -4 L-3 -4 L-1 -56 Z" fill={pants} />
      <path d="M1 -56 L3 -4 L13 -4 L14 -56 Z" fill={pants} />
      <path d="M-16 -5 h15 q4 0 4 5 h-21 q0 -5 2 -5 z" fill="#0b1220" />
      <path d="M2 -5 h15 q5 0 6 5 h-23 q0 -5 2 -5 z" fill="#0b1220" />
      {mechanic && (
        <>
          <rect x={-14} y={-26} width={13} height={4} fill="#e2e8f0" opacity={0.85} />
          <rect x={2} y={-26} width={12} height={4} fill="#e2e8f0" opacity={0.85} />
        </>
      )}
      {/* Back arm */}
      <path d="M-17 -98 q-9 4 -9 14 l0 30 q0 5 5 5 q4 0 4 -5 l0 -28 z" fill={shirt} />
      <circle cx={-22} cy={-48} r={5} fill={palette.skin} />
      {/* Torso */}
      <path d="M-18 -100 Q-21 -64 -16 -52 L16 -52 Q21 -64 18 -100 Q0 -108 -18 -100 Z" fill={shirt} />
      <path d="M-18 -100 Q-21 -64 -16 -52 L-6 -52 Q-10 -76 -6 -104 Q-12 -103 -18 -100 Z" fill="#000" opacity={0.14} />
      {mechanic && (
        <>
          <rect x={-18} y={-80} width={36} height={4} fill="#e2e8f0" opacity={0.85} />
          <rect x={-17} y={-64} width={34} height={4} fill="#e2e8f0" opacity={0.85} />
        </>
      )}
      {/* Head */}
      <rect x={-5} y={-110} width={10} height={9} fill={palette.skin} />
      <circle cy={-122} r={15} fill={palette.skin} />
      <circle cx={-12} cy={-121} r={3.5} fill="#b47750" />
      <circle cx={7} cy={-123} r={1.8} fill="#1b1b1b" />
      <path d="M3 -114 q4 2 8 0" stroke="#7a4b2e" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      {mechanic ? (
        <>
          <path d="M-16 -126 a16 15 0 0 1 32 0 z" fill={palette.navy700} />
          <path d="M12 -128 q10 0 15 4 l-15 1 z" fill={palette.orange} />
          <circle cx={0} cy={-133} r={3} fill={palette.orange} />
        </>
      ) : (
        <path d="M-15 -123 q0 -16 15 -16 q15 0 15 13 q-7 -6 -15 -4 q-9 -2 -15 7 z" fill={palette.hair} />
      )}
      {/* Front arm */}
      <g data-k={armKey} transform={`rotate(${armAngle} 18 -97)`}>
        <g className={armClass} style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}>
          <path d="M13 -100 q9 2 10 12 l0 34 q0 5 -5 5 q-5 0 -5 -5 l0 -32 z" fill={shirt} />
          <circle cx={18} cy={-50} r={5.5} fill={palette.skin} />
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

/** Head and shoulders seen through the car window. */
export function DriverHead({ mechanic, shirt, headKey }: { mechanic?: boolean; shirt: string; headKey: string }) {
  return (
    <g data-k={headKey}>
      <path d="M8 -98 q0 -16 16 -16 q16 0 16 16 z" fill={shirt} />
      <circle cx={24} cy={-122} r={11} fill={palette.skin} />
      {mechanic ? (
        <>
          <path d="M12 -125 a12 11 0 0 1 24 0 z" fill={palette.navy700} />
          <path d="M32 -126 q7 0 11 3 l-11 1 z" fill={palette.orange} />
        </>
      ) : (
        <path d="M13 -123 q0 -12 11 -12 q11 0 11 10 q-5 -4 -11 -3 q-7 -1 -11 5 z" fill={palette.hair} />
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
