"use client";

import { CalendarCheck, Car as CarIcon, Droplets, Flag, House, PhoneCall, TriangleAlert, Wrench, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  Bubble,
  Car,
  DriverHead,
  Gear,
  Person,
  Scooter,
  Skyline,
  StoryDefs,
  StreetLamp,
  Tree,
  palette,
} from "@/components/story/StoryArt";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { clamp, useScrollProgress } from "@/lib/useScrollProgress";
import { cn } from "@/lib/utils";

const steps: Array<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: TriangleAlert, title: "Breakdown on the road", text: "Your car suddenly stops in the middle of the road? Don't worry." },
  { icon: PhoneCall, title: "Call us", text: `One call or WhatsApp message to ${siteConfig.name} and help is on the way.` },
  { icon: Wrench, title: "Fixed on the spot", text: "Our mechanic reaches you on a scooter with tools and gets your car running right there." },
  { icon: CarIcon, title: "Driven to our garage", text: "For a full check-up, our team drives your car safely to the workshop." },
  { icon: CalendarCheck, title: "Complete service", text: "Inspection, repairs and servicing with quality parts by skilled mechanics." },
  { icon: Droplets, title: "Wash & shine", text: "A careful foam wash, so your car looks as good as it runs." },
  { icon: Flag, title: "Test drive", text: "We road-test the car to make sure everything works perfectly." },
  { icon: House, title: "Delivered home", text: "Your car is dropped at your doorstep and the keys are handed back to you." },
];

/** Scroll position where each step's caption takes over. */
const stepStarts = [0, 0.115, 0.25, 0.375, 0.5, 0.63, 0.75, 0.9];

/** The car's position along the street through the scroll; it pauses for each story beat. */
const carKeys: Array<[number, number]> = [
  [0, 120],
  [0.1, 800],
  [0.375, 800],
  [0.49, 3200],
  [0.62, 3200],
  [0.67, 4400],
  [0.75, 4400],
  [0.88, 6600],
  [0.94, 7250],
  [1, 7250],
];

const WORLD_W = 8100;
const ROAD_Y = 800;

const smooth = (t: number) => t * t * (3 - 2 * t);
/** 0 → 1 as p moves from a to b. */
const seg = (p: number, a: number, b: number) => smooth(clamp((p - a) / (b - a)));
/** Fades in over a→b and out over c→d. */
const window01 = (p: number, a: number, b: number, c: number, d: number) => seg(p, a, b) * (1 - seg(p, c, d));

function carX(p: number) {
  for (let i = 0; i < carKeys.length - 1; i++) {
    const [p0, x0] = carKeys[i];
    const [p1, x1] = carKeys[i + 1];
    if (p <= p1) return x0 + (x1 - x0) * smooth(clamp((p - p0) / (p1 - p0)));
  }
  return carKeys[carKeys.length - 1][1];
}

/**
 * The whole service told as a full-screen, night-time side-scrolling story:
 * breakdown, call, roadside repair, drive to the garage, service, wash, test
 * drive and delivery home. The section pins while scrolling moves the camera
 * along the street.
 */
export function ServiceStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const progressRef = useRef(0);
  const [step, setStep] = useState(0);

  useScrollProgress(sectionRef, (progress) => {
    progressRef.current = progress;
  });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const svg = svgRef.current;
    const stage = stageRef.current;
    let shown = progressRef.current;
    let lastDrawn = -1;
    let lastStep = -1;
    let frame = 0;
    let last = performance.now();
    let visible = true;
    let halfView = 750;
    let lookScale = 0.5;

    // Every moving part is tagged with data-k; look them up once.
    const e: Record<string, SVGElement> = {};
    sectionRef.current?.querySelectorAll<SVGElement>("[data-k]").forEach((el) => {
      e[el.dataset.k ?? ""] = el;
    });
    const move = (key: string, x: number, y = 0) => e[key]?.setAttribute("transform", `translate(${x} ${y})`);
    const fade = (key: string, value: number) => {
      const el = e[key];
      if (el) el.style.opacity = String(value);
    };

    // Fit the street to the screen: wide screens see more road, tall ones more sky.
    const fit = () => {
      if (!svg || !stage) return;
      const aspect = stage.clientWidth / Math.max(stage.clientHeight, 1);
      const wide = aspect >= 1.2;
      const width = wide ? 1500 : 640;
      const height = width / aspect;
      const top = ROAD_Y - height * (wide ? 0.64 : 0.6);
      lookScale = wide ? 0.5 : 1;
      svg.setAttribute("viewBox", `0 ${top} ${width} ${height}`);
      halfView = width / 2;
      lastDrawn = -1;
    };

    const draw = (p: number) => {
      const x = carX(p);
      const lift = 110 * window01(p, 0.52, 0.56, 0.59, 0.62);
      // Nudge the camera towards whoever matters in each beat (more on narrow screens).
      const look =
        -150 * window01(p, 0.11, 0.14, 0.24, 0.27) + 120 * window01(p, 0.25, 0.28, 0.37, 0.4) + 280 * seg(p, 0.9, 0.95);
      const cam = clamp(x + look * lookScale, halfView, WORLD_W - halfView);
      const shift = halfView - cam;

      move("world", shift);
      move("skylineNear", shift * 0.5);
      move("skylineFar", shift * 0.25);

      // The car, its wheels, bonnet and lights
      move("car", x, ROAD_Y - lift);
      const spin = ((x / 30) * 180) / Math.PI;
      e.wheelF?.setAttribute("transform", `rotate(${spin})`);
      e.wheelR?.setAttribute("transform", `rotate(${spin})`);
      e.hood?.setAttribute("transform", `rotate(${-40 * window01(p, 0.29, 0.31, 0.355, 0.375)} 112 -100)`);
      fade("beam", (1 - window01(p, 0.1, 0.11, 0.36, 0.38)) * (1 - window01(p, 0.5, 0.52, 0.74, 0.76)));
      fade("driverCustomer", 1 - seg(p, 0.105, 0.12));
      fade("driverMechanic", window01(p, 0.37, 0.38, 0.94, 0.95));
      fade("speed", window01(p, 0.76, 0.78, 0.86, 0.88));

      // 1–2: breakdown and the call
      fade("smoke", window01(p, 0.095, 0.12, 0.32, 0.36));
      fade("hazard", window01(p, 0.1, 0.11, 0.36, 0.38));
      fade("customer", window01(p, 0.11, 0.13, 0.38, 0.41));
      const calling = window01(p, 0.13, 0.15, 0.24, 0.26);
      e.customerArm?.setAttribute("transform", `rotate(${-150 * calling} 18 -97)`);
      fade("call", calling);

      // 3: the mechanic arrives and fixes it
      move("scooter", 1750 + (1150 - 1750) * seg(p, 0.25, 0.29), ROAD_Y + 6);
      fade("scooter", 1 - seg(p, 0.375, 0.4));
      fade("rider", 1 - seg(p, 0.29, 0.3));
      fade("mechanic", window01(p, 0.29, 0.3, 0.37, 0.38));
      fade("fixed", window01(p, 0.34, 0.355, 0.385, 0.4));

      // 5: service on the lift
      fade("lift", window01(p, 0.48, 0.5, 0.63, 0.65));
      move("liftDeck", 0, -lift);
      fade("garageMechanic", window01(p, 0.53, 0.55, 0.6, 0.62));

      // 6: wash
      fade("spray", window01(p, 0.67, 0.68, 0.72, 0.73));
      fade("foam", window01(p, 0.675, 0.69, 0.725, 0.74));
      fade("shine", window01(p, 0.73, 0.74, 0.76, 0.78));

      // 7: test drive checklist
      fade("checklist", window01(p, 0.79, 0.81, 0.9, 0.92));
      fade("tick1", seg(p, 0.81, 0.82));
      fade("tick2", seg(p, 0.835, 0.845));
      fade("tick3", seg(p, 0.86, 0.87));

      // 8: home and keys
      fade("homeCustomer", seg(p, 0.86, 0.88));
      fade("walker", seg(p, 0.945, 0.955));
      move("walker", x + 150 + (7545 - (x + 150)) * seg(p, 0.95, 0.975), ROAD_Y - 22);
      fade("key", seg(p, 0.97, 0.98));
      fade("heart", seg(p, 0.985, 0.995));

      // The heading introduces the story, then clears the view for the scene.
      fade("intro", 1 - seg(p, 0.07, 0.12));

      let current = 0;
      while (current < stepStarts.length - 1 && p >= stepStarts[current + 1]) current++;
      if (current !== lastStep) {
        lastStep = current;
        setStep(current);
      }
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const target = progressRef.current;
      shown = reduce ? target : shown + (target - shown) * (1 - Math.pow(0.002, dt));
      if (Math.abs(target - shown) < 0.0002) shown = target;
      if (Math.abs(shown - lastDrawn) > 0.00003) {
        draw(shown);
        lastDrawn = shown;
      }
    };

    fit();
    draw(shown);
    frame = requestAnimationFrame(tick);

    const resize = new ResizeObserver(fit);
    if (stage) resize.observe(stage);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      last = performance.now();
    });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
    };
  }, []);

  const StepIcon = steps[step].icon;

  return (
    <section ref={sectionRef} className="relative h-[800svh] bg-navy-950" aria-labelledby="story-heading">
      <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden">
        {/* Night sky */}
        <div className="absolute inset-0 bg-linear-to-b from-[#060c1a] via-[#0d1a35] to-[#1b2a4a]" aria-hidden />
        <div
          className="absolute inset-0 opacity-70 [background-image:radial-gradient(1.5px_1.5px_at_20px_30px,#fff,transparent),radial-gradient(1px_1px_at_90px_120px,#fff,transparent),radial-gradient(1.5px_1.5px_at_160px_60px,#cbd5e1,transparent),radial-gradient(1px_1px_at_230px_160px,#fff,transparent)] [background-size:260px_200px]"
          aria-hidden
        />
        <div className="absolute right-[12%] top-[16%] size-20 rounded-full bg-[#f8f1d8] shadow-[0_0_60px_20px_rgb(248_241_216/0.25)] sm:size-24" aria-hidden />

        <svg
          ref={svgRef}
          viewBox="0 292 1180 708"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 size-full"
          role="img"
          aria-label="Illustration: a car breaks down at night, the owner calls Shree Kashtbhanjan Motors, a mechanic arrives on a scooter and fixes it, then the car is serviced, washed, test-driven and delivered back home."
        >
          <StoryDefs />

          <g data-k="skylineFar">
            <Skyline count={30} baseY={650} color="#12203d" windowOpacity={0.35} seed={7} />
          </g>
          <g data-k="skylineNear">
            <Skyline count={30} baseY={672} color="#182948" windowOpacity={0.6} seed={19} />
          </g>

          <g data-k="world">
            {/* Pavement, road and the ground in front */}
            <rect x={-400} y={672} width={WORLD_W + 800} height={40} fill="#26334f" />
            <rect x={-400} y={706} width={WORLD_W + 800} height={6} fill="#3b4a68" />
            <rect x={-400} y={712} width={WORLD_W + 800} height={200} fill="url(#ss-road)" />
            <line x1={-400} y1={722} x2={WORLD_W + 400} y2={722} stroke="#e2e8f0" strokeOpacity={0.35} strokeWidth={3} />
            <line x1={-400} y1={840} x2={WORLD_W + 400} y2={840} stroke={palette.warm} strokeOpacity={0.75} strokeWidth={5} strokeDasharray="70 60" />
            <rect x={-400} y={912} width={WORLD_W + 800} height={14} fill="#3b4a68" />
            <rect x={-400} y={926} width={WORLD_W + 800} height={1200} fill="#111a2d" />

            {[180, 1520, 1960, 2420, 5230, 5560, 6160, 6520, 6960, 8020].map((tx, i) => (
              <Tree key={tx} x={tx} scale={0.85 + (i % 3) * 0.12} />
            ))}
            {[60, 1120, 2560, 5080, 6320, 7900].map((lx) => (
              <StreetLamp key={lx} x={lx} />
            ))}

            {/* The garage */}
            <g>
              <rect x={2640} y={290} width={2320} height={420} rx={6} fill="url(#ss-building)" />
              <rect x={2610} y={262} width={2380} height={36} rx={8} fill="#0b1220" />
              <rect x={2700} y={314} width={1000} height={80} rx={14} fill="#0b1220" stroke={palette.orange} strokeOpacity={0.5} strokeWidth={2} />
              <text x={3200} y={368} textAnchor="middle" className="font-display" fontSize={46} fontWeight={700} fill="#fff" letterSpacing={2} filter="url(#ss-glow)">
                SHREE KASHTBHANJAN <tspan fill={palette.orange}>MOTORS</tspan>
              </text>
              <rect x={4130} y={314} width={540} height={80} rx={14} fill="#0b1220" stroke="#38bdf8" strokeOpacity={0.5} strokeWidth={2} />
              <text x={4400} y={368} textAnchor="middle" className="font-display" fontSize={46} fontWeight={700} fill="#7dd3fc" letterSpacing={4} filter="url(#ss-glow)">
                CAR WASH
              </text>

              {/* Service bay: warm-lit workshop with a tool wall and a half-open shutter */}
              <rect x={2960} y={420} width={480} height={290} rx={10} fill="url(#ss-workshop)" />
              <rect x={2960} y={420} width={480} height={290} rx={10} fill="#7c2d12" opacity={0.25} />
              <rect x={2990} y={470} width={420} height={90} rx={6} fill="#5b3a1b" opacity={0.45} />
              {[3010, 3060, 3110, 3160, 3210, 3260, 3310, 3360].map((tx, i) => (
                <rect key={tx} x={tx} y={480 + (i % 2) * 12} width={9} height={52 - (i % 3) * 10} rx={3} fill="#3f2a17" />
              ))}
              <rect x={2954} y={412} width={492} height={40} rx={6} fill="#334155" />
              {[0, 1, 2].map((i) => (
                <rect key={i} x={2954} y={418 + i * 11} width={492} height={3} fill="#475569" />
              ))}
              <ellipse cx={3200} cy={712} rx={300} ry={24} fill="#fbbf24" opacity={0.18} />

              {/* Wash bay: blue-lit */}
              <rect x={4160} y={420} width={480} height={290} rx={10} fill="url(#ss-washbay)" />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <rect key={i} x={4178 + i * 76} y={450} width={58} height={240} rx={4} fill="#0e7490" opacity={0.35} />
              ))}
              <rect x={4180} y={496} width={440} height={12} rx={6} fill="#cbd5e1" />
              <rect x={4154} y={412} width={492} height={40} rx={6} fill="#334155" />
              <ellipse cx={4400} cy={712} rx={300} ry={24} fill="#38bdf8" opacity={0.16} />

              {/* Office */}
              {[3560, 3760].map((wx) => (
                <rect key={wx} x={wx} y={450} width={150} height={110} rx={8} fill="#fde68a" opacity={0.85} stroke="#0b1220" strokeWidth={6} />
              ))}
              <rect x={3605} y={590} width={84} height={120} rx={6} fill={palette.orange} />
              <circle cx={3675} cy={652} r={4} fill="#0b1220" />
            </g>

            {/* Lift in front of the service bay */}
            <g data-k="lift" opacity={0}>
              <rect x={3010} y={560} width={24} height={250} rx={4} fill="url(#ss-orange)" />
              <rect x={3366} y={560} width={24} height={250} rx={4} fill="url(#ss-orange)" />
              <g data-k="liftDeck">
                <rect x={3022} y={ROAD_Y} width={356} height={14} rx={4} fill="#475569" />
                <rect x={3060} y={ROAD_Y - 6} width={40} height={8} rx={2} fill="#94a3b8" />
                <rect x={3300} y={ROAD_Y - 6} width={40} height={8} rx={2} fill="#94a3b8" />
              </g>
            </g>

            {/* Test drive sign and finish flag */}
            <g transform="translate(5400 700)">
              <rect x={-5} y={-190} width={10} height={190} fill="#334155" />
              <rect x={-118} y={-256} width={236} height={74} rx={12} fill="#0b1220" stroke={palette.orange} strokeOpacity={0.6} strokeWidth={2} />
              <text y={-206} textAnchor="middle" className="font-display" fontSize={40} fontWeight={700} fill="#fff" letterSpacing={3} filter="url(#ss-glow)">
                TEST <tspan fill={palette.orange}>DRIVE</tspan>
              </text>
            </g>
            <g transform="translate(6380 700)">
              <rect x={-4} y={-210} width={8} height={210} fill="#334155" />
              {Array.from({ length: 12 }, (_, i) => (
                <rect key={i} x={4 + (i % 4) * 22} y={-208 + Math.floor(i / 4) * 22} width={22} height={22} fill={(i + Math.floor(i / 4)) % 2 ? "#e2e8f0" : "#0b1220"} />
              ))}
            </g>

            {/* The customer's home: warm windows, porch light */}
            <g transform="translate(7350 0)">
              <path d="M-40 476 L200 356 L440 476 Z" fill="#7c2d12" />
              <path d="M-40 476 L200 356 L440 476" fill="none" stroke={palette.orange} strokeWidth={6} strokeLinejoin="round" />
              <rect x={0} y={476} width={400} height={236} fill="#1e2c48" />
              <rect x={40} y={520} width={120} height={96} rx={6} fill="#fcd34d" opacity={0.9} filter="url(#ss-glow)" />
              <path d="M100 520 L100 616 M40 568 L160 568" stroke="#1e2c48" strokeWidth={6} />
              <rect x={228} y={584} width={92} height={128} rx={6} fill="#3a2414" />
              <rect x={236} y={594} width={76} height={50} rx={4} fill="#fcd34d" opacity={0.6} />
              <circle cx={306} cy={652} r={5} fill={palette.warm} />
              <circle cx={338} cy={570} r={8} fill="#ffe7a3" filter="url(#ss-glow)" />
              <ellipse cx={280} cy={716} rx={150} ry={20} fill="#fbbf24" opacity={0.16} />
              {Array.from({ length: 9 }, (_, i) => (
                <rect key={i} x={-70 + i * 22} y={648} width={10} height={64} rx={3} fill="#cbd5e1" opacity={0.75} />
              ))}
            </g>
            <g data-k="homeCustomer" opacity={0} transform={`translate(7605 ${ROAD_Y - 100})`}>
              <Person shirt={palette.teal} flip />
            </g>

            {/* Roadside: the customer and the call */}
            <g data-k="customer" opacity={0} transform={`translate(560 ${ROAD_Y - 22})`}>
              <Person shirt={palette.teal} hold="phone" armKey="customerArm" />
            </g>
            <g data-k="call" opacity={0} transform="translate(650 610)">
              <Bubble width={340} height={110}>
                <g transform="translate(-118 0)">
                  <circle r={30} fill="#25D366" className="story-ring" style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }} />
                  <path d="M-10 -14 q-4 0 -4 5 q2 16 18 23 q5 1 7 -3 l2 -6 l-8 -4 l-4 4 q-6 -3 -9 -9 l4 -4 l-4 -8 z" fill="#fff" />
                </g>
                <text x={-72} y={-8} fontSize={24} fontWeight={700} fill="#fff">
                  Calling…
                </text>
                <text x={-72} y={24} fontSize={21} fill={palette.orange}>
                  Kashtbhanjan Motors
                </text>
              </Bubble>
            </g>
            <g data-k="scooter">
              <Scooter
                rider={
                  <g data-k="rider" transform="translate(6 -52)">
                    <Person shirt="url(#ss-orange)" mechanic flip />
                  </g>
                }
              />
            </g>
            <g data-k="mechanic" opacity={0} transform={`translate(1020 ${ROAD_Y - 22})`}>
              <Person shirt="url(#ss-orange)" mechanic flip armAngle={-60} hold="wrench" armClass="story-wrench" />
            </g>
            <g data-k="fixed" opacity={0} transform="translate(800 570)">
              <Bubble width={250} height={84}>
                <circle cx={-78} r={22} fill="#16a34a" />
                <path d="M-89 0 L-81 8 L-67 -8" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                <text x={-44} y={10} fontSize={28} fontWeight={700} fill="#fff">
                  Running!
                </text>
              </Bubble>
            </g>

            {/* Garage mechanic under the lifted car */}
            <g data-k="garageMechanic" opacity={0}>
              <g transform={`translate(3125 ${ROAD_Y - 8})`}>
                <Person shirt="url(#ss-orange)" mechanic armAngle={-170} hold="wrench" armClass="story-wrench" />
              </g>
              <Gear r={24} x={3300} y={590} />
              <Gear r={16} x={3342} y={562} reverse />
            </g>

            {/* The car */}
            <g data-k="car" transform={`translate(120 ${ROAD_Y})`}>
              <g data-k="smoke" opacity={0}>
                {[0, 1, 2, 3].map((i) => (
                  <circle
                    key={i}
                    cx={136 + i * 8}
                    cy={-108}
                    r={22 + i * 4}
                    fill="#94a3b8"
                    opacity={0.7}
                    className="story-smoke"
                    style={{ animationDelay: `${i * 0.45}s`, transformBox: "fill-box", transformOrigin: "50% 50%" }}
                  />
                ))}
              </g>
              <Car
                frontWheelKey="wheelF"
                rearWheelKey="wheelR"
                hoodKey="hood"
                beamKey="beam"
                drivers={
                  <>
                    <DriverHead headKey="driverCustomer" shirt={palette.teal} />
                    <DriverHead headKey="driverMechanic" shirt={palette.orange} mechanic />
                  </>
                }
                behind={
                  <g data-k="speed" opacity={0} stroke="#fff" strokeOpacity={0.6} strokeWidth={5} strokeLinecap="round">
                    <line x1={-200} y1={-120} x2={-310} y2={-120} />
                    <line x1={-195} y1={-82} x2={-350} y2={-82} />
                    <line x1={-205} y1={-44} x2={-300} y2={-44} />
                  </g>
                }
              />
              {/* Hazard lights blink while broken down */}
              <g data-k="hazard" opacity={0}>
                <g className="story-blink">
                  <circle cx={170} cy={-48} r={14} fill={palette.orange} opacity={0.6} filter="url(#ss-glow)" />
                  <circle cx={-166} cy={-56} r={14} fill={palette.orange} opacity={0.6} filter="url(#ss-glow)" />
                </g>
              </g>
              {/* Test-drive checklist rides above the car */}
              <g data-k="checklist" opacity={0} transform="translate(10 -176)">
                <Bubble width={270} height={156}>
                  {["Brakes", "Engine", "AC & lights"].map((label, i) => (
                    <g key={label} transform={`translate(-100 ${-42 + i * 42})`}>
                      <rect x={0} y={-15} width={30} height={30} rx={8} fill="#1e293b" stroke="#334155" />
                      <g data-k={`tick${i + 1}`} opacity={0}>
                        <path d="M7 0 L13 7 L24 -7" fill="none" stroke="#22c55e" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                      <text x={46} y={9} fontSize={26} fontWeight={600} fill="#fff">
                        {label}
                      </text>
                    </g>
                  ))}
                </Bubble>
              </g>
              {/* Wash: spray, foam and shine */}
              <g data-k="spray" opacity={0} stroke="#7dd3fc" strokeWidth={5} strokeLinecap="round">
                {[-140, -90, -40, 10, 60, 110].map((sx) => (
                  <line key={sx} x1={sx} y1={-300} x2={sx} y2={-160} strokeDasharray="14 14" className="story-spray" />
                ))}
              </g>
              <g data-k="foam" opacity={0} fill="#f8fafc">
                {[-150, -110, -70, -30, 10, 50, 90, 130].map((fx, i) => (
                  <circle
                    key={fx}
                    cx={fx}
                    cy={-150 + (i % 3) * 30}
                    r={20 + (i % 2) * 8}
                    className="story-foam"
                    style={{ animationDelay: `${i * 0.2}s`, transformBox: "fill-box", transformOrigin: "50% 50%" }}
                  />
                ))}
              </g>
              <g data-k="shine" opacity={0} fill="#fff" filter="url(#ss-glow)">
                {[
                  [-60, -180],
                  [70, -172],
                  [158, -110],
                ].map(([sx, sy]) => (
                  <path
                    key={sx}
                    d={`M${sx} ${sy - 18} L${sx + 5} ${sy - 5} L${sx + 18} ${sy} L${sx + 5} ${sy + 5} L${sx} ${sy + 18} L${sx - 5} ${sy + 5} L${sx - 18} ${sy} L${sx - 5} ${sy - 5} Z`}
                    className="story-sparkle"
                    style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
                  />
                ))}
              </g>
            </g>

            {/* Handing over the keys */}
            <g data-k="walker" opacity={0}>
              <Person shirt="url(#ss-orange)" mechanic armAngle={-70} hold="key" />
            </g>
            <g data-k="key" opacity={0} transform="translate(7575 545)">
              <Bubble width={220} height={80}>
                <text textAnchor="middle" y={10} fontSize={28} fontWeight={700} fill={palette.warm}>
                  Your keys!
                </text>
              </Bubble>
            </g>
            <g data-k="heart" opacity={0} transform="translate(7705 470)">
              <path
                d="M0 18 C-30 -4 -22 -30 0 -16 C22 -30 30 -4 0 18 Z"
                fill="#ef4444"
                filter="url(#ss-glow)"
                className="story-sparkle"
                style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
              />
            </g>
          </g>
        </svg>

        {/* Keep the text readable over the scene */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-linear-to-b from-navy-950/90 to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-linear-to-t from-navy-950 via-navy-950/70 to-transparent" aria-hidden />

        <Container className="relative flex h-full flex-col justify-between pb-8 pt-24 sm:pb-10 lg:pt-28">
          <div data-k="intro">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-400">
              <span className="h-px w-6 bg-brand-500" aria-hidden />
              Roadside to doorstep
            </p>
            <h2 id="story-heading" className="mt-3 text-3xl font-bold uppercase leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              We&apos;re with you <span className="text-brand-500">at every step.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex max-w-xl items-start gap-4 sm:gap-5" aria-live="polite">
              <span className="font-display text-6xl font-bold leading-none text-brand-500 tabular-nums sm:text-7xl">
                {String(step + 1).padStart(2, "0")}
              </span>
              <div key={step} className="animate-fade-up">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-navy-200">
                  <StepIcon className="size-4 text-brand-400" aria-hidden />
                  Step {step + 1} of {steps.length}
                </p>
                <h3 className="mt-1 text-2xl font-bold uppercase text-white sm:text-3xl">{steps[step].title}</h3>
                <p className="mt-1 text-navy-100">{steps[step].text}</p>
              </div>
            </div>

            <ol className="flex gap-2" aria-label="Story progress">
              {steps.map(({ icon: Icon, title }, i) => (
                <li
                  key={title}
                  className={cn(
                    "grid place-items-center rounded-full transition-all duration-500",
                    "size-2.5 lg:size-10",
                    i === step
                      ? "bg-brand-500 text-white shadow-lg shadow-brand-500/40 max-lg:w-8"
                      : i < step
                        ? "bg-brand-500/30 text-brand-300 lg:ring-1 lg:ring-brand-500/40"
                        : "bg-white/10 text-navy-300 lg:ring-1 lg:ring-white/10",
                  )}
                >
                  <Icon className="hidden size-4 lg:block" aria-hidden />
                  <span className="sr-only">{title}</span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </div>
    </section>
  );
}
