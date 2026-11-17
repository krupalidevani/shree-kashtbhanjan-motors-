import { ArrowDown, CalendarCheck, CalendarDays, Truck, Wrench } from "lucide-react";
import Image from "next/image";

import workshopTools from "@/assets/images/workshop-tools.jpg";
import { Car, DriverHead, Person, StoryDefs, palette } from "@/components/story/StoryArt";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroBreadcrumb } from "@/components/ui/PageHero";
import { bookingHref } from "@/config/site";
import { services } from "@/data/services";

const highlights = [
  { icon: Wrench, label: `${services.length} car services` },
  { icon: Truck, label: "Pickup & drop" },
  { icon: CalendarDays, label: "Open all 7 days" },
];

/** Floor line the car's wheels and the mechanic's feet stand on. */
const FLOOR = 500;

/** A small white card with a green tick, popping up over the car. */
function CheckChip({ x, label, className }: { x: number; label: string; className: string }) {
  const width = 24 + label.length * 9.5 + 34;
  return (
    <g transform={`translate(${x} 222)`}>
      <g className={`svc-anim ${className}`}>
        <rect x={-width / 2} y={-22} width={width} height={44} rx={22} fill="#fff" style={{ filter: "drop-shadow(0 8px 14px rgb(14 25 47 / 0.18))" }} />
        <circle cx={-width / 2 + 24} r={12} fill="#16a34a" />
        <path d={`M${-width / 2 + 18} 0 l4 4.5 l8 -9`} stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x={-width / 2 + 44} y={6} fill={palette.navy900} fontSize={17} fontWeight={700} className="font-display uppercase">
          {label}
        </text>
      </g>
    </g>
  );
}

/** Flat illustration of the service bay, animated with CSS on a 14 second loop. */
function ServiceBay() {
  return (
    <svg viewBox="0 0 900 600" className="svc-hero h-auto w-full" role="img" aria-labelledby="svc-bay-title">
      <title id="svc-bay-title">
        Illustration: a car drives into the workshop, is lifted and checked by a mechanic, and drives out ready.
      </title>
      <StoryDefs />
      <defs>
        <clipPath id="svc-bay">
          <rect x={0} y={0} width={900} height={600} rx={32} />
        </clipPath>
        <linearGradient id="svc-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f7fb" />
          <stop offset="1" stopColor="#dfe6f0" />
        </linearGradient>
        <linearGradient id="svc-scan-trail" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor={palette.orange} stopOpacity="0.35" />
          <stop offset="1" stopColor={palette.orange} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="svc-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4c2" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff4c2" stopOpacity="0" />
        </linearGradient>
        <pattern id="svc-holes" width={18} height={18} patternUnits="userSpaceOnUse">
          <circle cx={9} cy={9} r={2} fill="#b4c1d3" />
        </pattern>
      </defs>

      <g clipPath="url(#svc-bay)">
        {/* Back wall and garage sign */}
        <rect width={900} height={600} fill="url(#svc-wall)" />
        <rect width={900} height={86} fill={palette.navy900} />
        <rect y={86} width={900} height={6} fill={palette.orange} />
        <text x={450} y={55} textAnchor="middle" fill="#fff" fontSize={30} fontWeight={700} letterSpacing={3} className="font-display uppercase">
          Shree Kashtbhanjan Motors
        </text>
        {[60, 840].map((x) => (
          <circle key={x} cx={x} cy={43} r={7} fill={palette.orange} />
        ))}

        {/* Ceiling lamps */}
        {[300, 600].map((x) => (
          <g key={x}>
            <path className="svc-anim svc-lamp" d={`M${x - 34} 116 L${x + 34} 116 L${x + 150} ${FLOOR} L${x - 150} ${FLOOR} Z`} fill="url(#svc-light)" />
            <rect x={x - 2} y={92} width={4} height={14} fill="#7c8a9c" />
            <rect x={x - 40} y={104} width={80} height={14} rx={7} fill="#5b6778" />
            <rect className="svc-anim svc-lamp" x={x - 32} y={114} width={64} height={5} rx={2.5} fill="#fff4c2" />
          </g>
        ))}

        {/* Tool board on the wall */}
        <rect x={60} y={150} width={180} height={150} rx={12} fill="#d3dce8" />
        <rect x={60} y={150} width={180} height={150} rx={12} fill="url(#svc-holes)" />
        <g fill={palette.navy700}>
          <path d="M92 172 h10 v80 h-10 z M86 252 h22 v14 h-22 z" />
          <circle cx={140} cy={182} r={13} />
          <circle cx={140} cy={182} r={6} fill="#d3dce8" />
          <rect x={136} y={192} width={8} height={78} rx={4} />
          <rect x={172} y={172} width={8} height={56} rx={3} fill={palette.orange} />
          <rect x={170} y={228} width={12} height={42} rx={4} />
          <rect x={202} y={176} width={18} height={30} rx={4} fill={palette.orange} />
          <rect x={208} y={206} width={6} height={64} rx={3} />
        </g>

        {/* Tyre stack and tool cabinet */}
        <g transform={`translate(852 ${FLOOR})`}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(0 ${-i * 34})`}>
              <rect x={-52} y={-34} width={104} height={32} rx={14} fill="#1f2937" />
              <rect x={-36} y={-25} width={72} height={14} rx={7} fill="#374151" />
            </g>
          ))}
        </g>
        <g transform={`translate(70 ${FLOOR})`}>
          <rect x={-10} y={-120} width={110} height={120} rx={8} fill={palette.orange} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={-2} y={-112 + i * 38} width={94} height={30} rx={5} fill="#d95510" />
              <rect x={30} y={-100 + i * 38} width={30} height={5} rx={2.5} fill="#ffc49e" />
            </g>
          ))}
        </g>

        {/* Floor */}
        <rect y={FLOOR} width={900} height={100} fill="#c9d3e1" />
        <rect y={FLOOR} width={900} height={5} fill="#b4c1d3" />
        <path d={`M0 ${FLOOR + 62} H900`} stroke="#b4c1d3" strokeWidth={3} strokeDasharray="34 22" />

        {/* Lift posts (stay put) */}
        {[230, 670].map((x) => (
          <g key={x}>
            <rect x={x - 12} y={210} width={24} height={FLOOR - 210} rx={4} fill="#7c8a9c" />
            <rect x={x - 12} y={210} width={8} height={FLOOR - 210} fill="#94a3b8" />
            <rect x={x - 26} y={FLOOR - 8} width={52} height={10} rx={3} fill="#5b6778" />
            <rect x={x - 18} y={204} width={36} height={12} rx={4} fill={palette.navy700} />
          </g>
        ))}

        {/* Lift platform and car rise together */}
        <g className="svc-anim svc-lift">
          <rect x={250} y={FLOOR - 2} width={400} height={12} rx={4} fill="#5b6778" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <rect key={i} x={262 + i * 39} y={FLOOR + 1} width={18} height={6} fill="#facc15" transform={`skewX(-30)`} style={{ transformBox: "fill-box" }} />
          ))}
          <rect x={218} y={FLOOR - 4} width={44} height={10} rx={3} fill={palette.navy700} />
          <rect x={638} y={FLOOR - 4} width={44} height={10} rx={3} fill={palette.navy700} />

          <g transform={`translate(452 ${FLOOR - 2})`}>
            <g className="svc-anim svc-drive">
              <Car
                frontWheelKey="svc-wf"
                rearWheelKey="svc-wr"
                hoodKey="svc-hood"
                drivers={<DriverHead outfit="mechanic" headKey="svc-head" />}
              />
            </g>
          </g>

          {/* Scan line sweeping over the car */}
          <g className="svc-anim svc-scan">
            <rect x={222} y={FLOOR - 162} width={60} height={160} fill="url(#svc-scan-trail)" />
            <rect x={280} y={FLOOR - 170} width={4} height={176} rx={2} fill={palette.orange} filter="url(#ss-glow)" />
          </g>
        </g>

        {/* Mechanic at work */}
        <g transform={`translate(726 ${FLOOR + 4})`}>
          <g className="svc-anim svc-worker">
            <Person outfit="mechanic" flip armClass="story-wrench" hold="wrench" armAngle={-50} />
          </g>
        </g>

        {/* Checks popping up */}
        <CheckChip x={300} label="Engine" className="svc-check-1" />
        <CheckChip x={460} label="Brakes" className="svc-check-2" />
        <CheckChip x={612} label="Oil" className="svc-check-3" />

        {/* Ready badge */}
        <g transform="translate(452 230)">
          <g className="svc-anim svc-ready">
            <rect x={-130} y={-30} width={260} height={60} rx={30} fill="#16a34a" style={{ filter: "drop-shadow(0 10px 18px rgb(22 163 74 / 0.35))" }} />
            <text y={9} textAnchor="middle" fill="#fff" fontSize={24} fontWeight={700} letterSpacing={1.5} className="font-display uppercase">
              Ready to drive ✓
            </text>
          </g>
        </g>

        {/* Service progress */}
        <text x={60} y={FLOOR + 40} fill={palette.navy700} fontSize={14} fontWeight={700} letterSpacing={2} className="font-display uppercase">
          Service progress
        </text>
        <rect x={230} y={FLOOR + 30} width={610} height={10} rx={5} fill="#b4c1d3" />
        <rect className="svc-anim svc-progress" x={230} y={FLOOR + 30} width={610} height={10} rx={5} fill={palette.orange} />
      </g>
    </svg>
  );
}

/** Services page hero: copy on the left, the animated service bay on the right. */
export function ServicesHero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 pb-16 pt-32 sm:pb-20 sm:pt-40 lg:pb-24" aria-labelledby="services-hero-heading">
      <Image src={workshopTools} alt="" fill preload placeholder="blur" sizes="100vw" className="-z-30 object-cover opacity-15" />
      <div className="absolute inset-0 -z-20 bg-linear-to-br from-navy-950 via-navy-950/95 to-navy-900/80" aria-hidden />
      {/* Blueprint grid and a slow orange glow */}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_70%_50%,black,transparent_75%)]"
        aria-hidden
      />
      <div className="hero-glow absolute -right-40 top-10 -z-10 size-[36rem] rounded-full bg-brand-500/20 blur-3xl" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1 bg-linear-to-r from-brand-500 via-brand-400 to-transparent" aria-hidden />

      <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-10">
        <div>
          <HeroBreadcrumb current="Services" />
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-brand-400 animate-fade-up [animation-delay:100ms]">
            What We Do
          </p>
          <h1
            id="services-hero-heading"
            className="mt-4 text-4xl font-bold uppercase leading-[1.02] text-white animate-fade-up [animation-delay:150ms] sm:text-5xl lg:text-6xl"
          >
            Car Services <span className="text-brand-500">Done Right</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-100 animate-fade-up [animation-delay:250ms] sm:text-lg">
            From routine maintenance to complex repairs, explore the services we offer and book the one your car needs.
          </p>

          <div className="mt-8 flex flex-col gap-3 animate-fade-up [animation-delay:350ms] sm:flex-row">
            <ButtonLink href={bookingHref} size="lg">
              <CalendarCheck className="size-5" aria-hidden />
              Book a Service
            </ButtonLink>
            <ButtonLink href="#service-list" size="lg" variant="outline-light">
              Explore Services
              <ArrowDown className="size-5" aria-hidden />
            </ButtonLink>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 animate-fade-up [animation-delay:450ms]">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm font-semibold text-white">
                <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-brand-400 ring-1 ring-white/10">
                  <Icon className="size-4" aria-hidden />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative animate-fade-up [animation-delay:300ms]">
          <div className="absolute -inset-3 -z-10 rounded-[2.5rem] bg-linear-to-br from-brand-500/40 via-white/5 to-transparent blur-xl" aria-hidden />
          <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-black/40 ring-1 ring-white/10">
            <ServiceBay />
          </div>
        </div>
      </Container>
    </section>
  );
}
