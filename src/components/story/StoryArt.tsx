import type { ReactNode } from "react";

/*
 * Flat vector characters and props for the service story. Every piece is drawn
 * around its own origin at the ground (feet / wheel bottoms), so the scene can
 * place it with a single translate.
 */

export const palette = {
  navy: "#0e192f",
  navySoft: "#1e3052",
  orange: "#f26a1b",
  orangeDark: "#d95510",
  skin: "#c98b5e",
  hair: "#1b1b1b",
  car: "#2f6db5",
  carDark: "#24568f",
  glass: "#bfe0f5",
  tyre: "#1b1f27",
  rim: "#c7ced8",
};

type ArmProps = {
  /** Static angle of the front arm, degrees (negative raises it forwards). */
  armAngle?: number;
  /** CSS animation class for the front arm (e.g. a wrench swing). */
  armClass?: string;
  /** Something held in the front hand. */
  hold?: "wrench" | "phone" | "key";
  /** data-k tag for the front arm, so the scene can rotate it. */
  armKey?: string;
};

type PersonProps = ArmProps & {
  shirt: string;
  pants?: string;
  cap?: string;
  /** Faces left instead of right. */
  flip?: boolean;
};

function HandItem({ hold }: { hold: ArmProps["hold"] }) {
  if (hold === "wrench")
    return (
      <g transform="translate(19.5 -52)">
        <rect x={-2.5} y={0} width={5} height={26} rx={2} fill="#9aa3b2" />
        <path d="M-7 24 a7 7 0 1 0 14 0 l-3 0 l0 4 l-8 0 l0 -4 z" fill="#9aa3b2" />
      </g>
    );
  if (hold === "phone")
    return <rect x={13} y={-60} width={12} height={20} rx={2.5} fill={palette.navy} stroke="#5d6b85" strokeWidth={1.5} />;
  if (hold === "key")
    return (
      <g transform="translate(19 -50)">
        <circle r={7} fill="none" stroke="#f5b301" strokeWidth={3.5} />
        <rect x={-2} y={6} width={4} height={16} fill="#f5b301" />
        <rect x={2} y={15} width={6} height={3} fill="#f5b301" />
      </g>
    );
  return null;
}

/** A person, about 135 units tall, feet at the origin, facing right. */
export function Person({ shirt, pants = palette.navySoft, cap, flip, armAngle = 0, armClass, hold, armKey }: PersonProps) {
  return (
    <g transform={flip ? "scale(-1 1)" : undefined}>
      <rect x={-13} y={-52} width={11} height={52} rx={4} fill={pants} />
      <rect x={2} y={-52} width={11} height={52} rx={4} fill={pants} />
      <rect x={-15} y={-4} width={14} height={6} rx={3} fill={palette.navy} />
      <rect x={1} y={-4} width={16} height={6} rx={3} fill={palette.navy} />
      <rect x={-24} y={-98} width={9} height={42} rx={4.5} fill={shirt} />
      <rect x={-17} y={-104} width={34} height={56} rx={11} fill={shirt} />
      <circle cy={-120} r={15} fill={palette.skin} />
      <circle cx={7} cy={-122} r={1.8} fill={palette.navy} />
      {cap ? (
        <>
          <path d="M-16 -124 a16 14 0 0 1 32 0 z" fill={cap} />
          <rect x={10} y={-127} width={15} height={4} rx={2} fill={cap} />
        </>
      ) : (
        <path d="M-15 -121 a15 15 0 0 1 30 0 q-8 -6 -15 -4 q-8 -2 -15 4 z" fill={palette.hair} />
      )}
      <g data-k={armKey} transform={`rotate(${armAngle} 19.5 -96)`}>
        <g className={armClass} style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}>
          <rect x={15} y={-98} width={9} height={44} rx={4.5} fill={shirt} />
          <circle cx={19.5} cy={-55} r={5} fill={palette.skin} />
          <HandItem hold={hold} />
        </g>
      </g>
    </g>
  );
}

function Wheel({ wheelKey, x }: { wheelKey: string; x: number }) {
  return (
    <g transform={`translate(${x} -32)`}>
      <g data-k={wheelKey}>
        <circle r={32} fill={palette.tyre} />
        <circle r={18} fill={palette.rim} />
        {[0, 60, 120].map((angle) => (
          <rect key={angle} x={-2.5} y={-17} width={5} height={34} fill="#8e98a8" transform={`rotate(${angle})`} />
        ))}
        <circle r={5} fill="#6b7586" />
      </g>
    </g>
  );
}

type CarProps = {
  /** data-k tags for the parts the scene animates. */
  frontWheelKey: string;
  rearWheelKey: string;
  hoodKey: string;
  /** Heads shown through the side window: whoever is driving. */
  drivers: ReactNode;
  /** Extras drawn behind the car body (speed lines). */
  behind?: ReactNode;
};

/** A small family hatchback, about 330 units long, wheels on the origin line, facing right. */
export function Car({ frontWheelKey, rearWheelKey, hoodKey, drivers, behind }: CarProps) {
  return (
    <g>
      {behind}
      <ellipse cx={0} cy={2} rx={170} ry={10} fill="#000" opacity={0.18} />
      {/* Cabin and glass */}
      <path d="M-120 -96 L-80 -150 Q-72 -158 -60 -158 L40 -158 Q56 -158 66 -146 L104 -100 Z" fill={palette.car} />
      <path d="M-104 -100 L-72 -144 L-12 -144 L-12 -100 Z" fill={palette.glass} />
      <path d="M-2 -100 L-2 -144 L40 -144 Q50 -144 56 -136 L86 -100 Z" fill={palette.glass} />
      {drivers}
      {/* Body */}
      <path
        d="M-160 -44 Q-162 -92 -126 -98 L112 -102 Q150 -100 162 -74 L166 -50 Q166 -30 150 -30 L-146 -30 Q-160 -30 -160 -44 Z"
        fill={palette.car}
      />
      <path d="M-150 -62 L156 -66" stroke={palette.carDark} strokeWidth={3} opacity={0.6} />
      <rect x={-20} y={-90} width={20} height={5} rx={2.5} fill={palette.carDark} />
      <rect x={-118} y={-90} width={20} height={5} rx={2.5} fill={palette.carDark} />
      <rect x={150} y={-82} width={14} height={12} rx={4} fill="#ffe7a3" />
      <rect x={-162} y={-82} width={10} height={14} rx={3} fill="#e0454b" />
      <rect x={140} y={-44} width={28} height={12} rx={5} fill={palette.navySoft} />
      <rect x={-166} y={-44} width={26} height={12} rx={5} fill={palette.navySoft} />
      {/* Bonnet: hinged at the windscreen so it can open */}
      <g data-k={hoodKey}>
        <path d="M100 -102 L112 -102 Q150 -100 162 -74 L100 -74 Z" fill={palette.carDark} />
      </g>
      <Wheel wheelKey={rearWheelKey} x={-100} />
      <Wheel wheelKey={frontWheelKey} x={100} />
    </g>
  );
}

/** Head and shoulders seen through the car window. */
export function DriverHead({ cap, shirt, headKey }: { cap?: string; shirt: string; headKey: string }) {
  return (
    <g data-k={headKey}>
      <rect x={-40} y={-112} width={30} height={16} rx={7} fill={shirt} />
      <circle cx={-25} cy={-122} r={12} fill={palette.skin} />
      {cap ? (
        <>
          <path d="M-38 -125 a13 11 0 0 1 26 0 z" fill={cap} />
          <rect x={-16} y={-127} width={12} height={3.5} rx={1.5} fill={cap} />
        </>
      ) : (
        <path d="M-37 -124 a12 12 0 0 1 24 0 q-6 -5 -12 -3 q-6 -2 -12 3 z" fill={palette.hair} />
      )}
    </g>
  );
}

/** A delivery scooter with a toolbox, wheels on the origin line, facing left. */
export function Scooter({ rider }: { rider?: ReactNode }) {
  return (
    <g>
      <ellipse cx={0} cy={2} rx={70} ry={7} fill="#000" opacity={0.16} />
      {rider}
      <g transform="scale(-1 1)">
        <rect x={-66} y={-88} width={34} height={28} rx={4} fill={palette.navy} />
        <rect x={-66} y={-78} width={34} height={5} fill={palette.orange} />
        <path d="M-52 -30 Q-58 -58 -24 -60 L18 -60 L34 -42 L52 -42 L56 -30 Z" fill={palette.orange} />
        <rect x={-34} y={-70} width={44} height={11} rx={5} fill={palette.navy} />
        <path d="M34 -42 L46 -92" stroke={palette.navy} strokeWidth={6} strokeLinecap="round" />
        <path d="M38 -92 L56 -92" stroke={palette.navy} strokeWidth={6} strokeLinecap="round" />
        <circle cx={-40} cy={-18} r={18} fill={palette.tyre} />
        <circle cx={-40} cy={-18} r={8} fill={palette.rim} />
        <circle cx={44} cy={-18} r={18} fill={palette.tyre} />
        <circle cx={44} cy={-18} r={8} fill={palette.rim} />
      </g>
    </g>
  );
}

/** A spinning gear made from a thick dashed ring. */
export function Gear({ r, x, y, reverse }: { r: number; x: number; y: number; reverse?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={reverse ? "story-spin-reverse" : "story-spin"} style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}>
        <circle r={r} fill="none" stroke={palette.orange} strokeWidth={r * 0.55} strokeDasharray={`${r * 0.42} ${r * 0.32}`} />
        <circle r={r * 0.62} fill={palette.orange} />
        <circle r={r * 0.25} fill="#fff" />
      </g>
    </g>
  );
}

export function Tree({ x, scale = 1 }: { x: number; scale?: number }) {
  return (
    <g transform={`translate(${x} 680) scale(${scale})`}>
      <rect x={-7} y={-70} width={14} height={70} rx={4} fill="#7a5a3d" />
      <circle cy={-100} r={44} fill="#4f9d69" />
      <circle cx={-28} cy={-78} r={30} fill="#5bb077" />
      <circle cx={30} cy={-82} r={32} fill="#468f5e" />
    </g>
  );
}

export function StreetLamp({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 690)`}>
      <rect x={-4} y={-240} width={8} height={240} fill="#55627a" />
      <path d="M0 -236 Q0 -260 40 -258" fill="none" stroke="#55627a" strokeWidth={7} />
      <rect x={28} y={-262} width={34} height={12} rx={5} fill="#3c475c" />
      <rect x={32} y={-252} width={26} height={5} rx={2} fill="#ffe7a3" />
    </g>
  );
}

/** Rounded speech bubble with a tail pointing down to (0, 0). */
export function Bubble({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  return (
    <g>
      <rect x={-width / 2} y={-height - 18} width={width} height={height} rx={22} fill="#fff" stroke="#e2e6ec" strokeWidth={2} />
      <path d="M-12 -20 L0 0 L12 -20 Z" fill="#fff" />
      <g transform={`translate(0 ${-height / 2 - 18})`}>{children}</g>
    </g>
  );
}
