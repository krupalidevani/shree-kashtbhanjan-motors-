import { useId } from "react";

/**
 * A car seen from above, facing down, with headlight beams ahead of it.
 * The body is 72 units long inside a 40×100 box; the beams fill the rest.
 */
export function CarTopView({ className }: { className?: string }) {
  const id = useId();
  const body = `${id}-body`;
  const glass = `${id}-glass`;
  const beam = `${id}-beam`;

  return (
    <svg viewBox="0 0 40 100" className={className} aria-hidden>
      <defs>
        <linearGradient id={body} x1="0" x2="1">
          <stop offset="0" stopColor="#cbd2dc" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="1" stopColor="#cbd2dc" />
        </linearGradient>
        <linearGradient id={glass} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15233f" />
          <stop offset="1" stopColor="#2a4068" />
        </linearGradient>
        <linearGradient id={beam} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4c2" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff4c2" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Headlight beams */}
      <path d="M8 68 L1 100 H17 L12 68 Z" fill={`url(#${beam})`} />
      <path d="M28 68 L23 100 H39 L32 68 Z" fill={`url(#${beam})`} />

      {/* Wheels */}
      <rect x="1" y="11" width="6" height="13" rx="2" fill="#08101f" />
      <rect x="33" y="11" width="6" height="13" rx="2" fill="#08101f" />
      <rect x="1" y="47" width="6" height="13" rx="2" fill="#08101f" />
      <rect x="33" y="47" width="6" height="13" rx="2" fill="#08101f" />

      {/* Body */}
      <rect x="4" y="2" width="32" height="68" rx="12" fill={`url(#${body})`} />
      {/* Racing stripes */}
      <rect x="16" y="2" width="3" height="68" fill="#f26a1b" />
      <rect x="21" y="2" width="3" height="68" fill="#f26a1b" />
      {/* Mirrors */}
      <ellipse cx="3.5" cy="43" rx="2.5" ry="1.6" fill="#cbd2dc" />
      <ellipse cx="36.5" cy="43" rx="2.5" ry="1.6" fill="#cbd2dc" />

      {/* Rear window, roof and windscreen */}
      <rect x="9" y="10" width="22" height="9" rx="3" fill={`url(#${glass})`} />
      <rect x="9" y="21" width="22" height="20" rx="4" fill="#eef1f5" />
      <rect x="12" y="24" width="16" height="2" rx="1" fill="#f26a1b" opacity="0.9" />
      <path d="M8 45 Q20 41 32 45 L30 56 Q20 54 10 56 Z" fill={`url(#${glass})`} />
      <path d="M11 46 Q16 44.5 20 44.5 L19 48 Q15 48 11.5 49 Z" fill="#ffffff" opacity="0.3" />

      {/* Lights */}
      <rect x="8" y="64" width="6" height="3" rx="1.5" fill="#fffbe6" />
      <rect x="26" y="64" width="6" height="3" rx="1.5" fill="#fffbe6" />
      <rect x="8" y="3.5" width="6" height="2" rx="1" fill="#b91c1c" />
      <rect x="26" y="3.5" width="6" height="2" rx="1" fill="#b91c1c" />
    </svg>
  );
}
