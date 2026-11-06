"use client";

import { CalendarCheck, Car as CarIcon, Droplets, Flag, House, PhoneCall, TriangleAlert, Wrench, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  Bubble,
  Car,
  Cloud,
  Hedge,
  OUTLINE,
  DriverHead,
  Gear,
  Person,
  SHOULDER,
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

type CamKey = [number, (carX: number) => number, number];
const follow = (offset = 0) => (x: number) => x + offset;
const fixed = (cx: number) => () => cx;

/**
 * Where the camera looks through the scroll: its centre on the street and how
 * much of the scene above the road it shows. Small numbers zoom in on a moment;
 * at the garage it pulls back so the whole building and its sign are in view.
 */
const camKeys: CamKey[] = [
  [0, follow(), 470],
  [0.1, fixed(720), 430],
  [0.24, fixed(720), 430],
  [0.29, fixed(900), 440],
  [0.375, fixed(900), 440],
  [0.42, follow(), 560],
  [0.47, fixed(3200), 680],
  [0.62, fixed(3200), 680],
  [0.67, fixed(4250), 680],
  [0.75, fixed(4300), 660],
  [0.78, follow(60), 520],
  [0.88, follow(60), 520],
  [0.93, fixed(7430), 470],
  [1, fixed(7430), 470],
];

function camera(p: number, x: number) {
  for (let i = 0; i < camKeys.length - 1; i++) {
    const [p0, c0, h0] = camKeys[i];
    const [p1, c1, h1] = camKeys[i + 1];
    if (p <= p1) {
      const t = smooth(clamp((p - p0) / (p1 - p0)));
      const a = c0(x);
      return { cx: a + (c1(x) - a) * t, above: h0 + (h1 - h0) * t };
    }
  }
  const [, c, h] = camKeys[camKeys.length - 1];
  return { cx: c(x), above: h };
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
    let aspect = 1.6;
    let navFrac = 0.09;
    let wide = true;

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

    // Remember the screen shape; the camera works out the view every frame.
    const fit = () => {
      if (!stage) return;
      aspect = stage.clientWidth / Math.max(stage.clientHeight, 1);
      wide = aspect >= 1.2;
      navFrac = Math.min(96 / Math.max(stage.clientHeight, 1), 0.3);
      lastDrawn = -1;
    };

    const draw = (p: number) => {
      const x = carX(p);
      const lift = 165 * window01(p, 0.52, 0.56, 0.59, 0.62);
      // Frame the shot: the road sits low on screen, with `above` units of scene
      // visible between it and the menu bar.
      const view = camera(p, x);
      const roadFrac = wide ? 0.7 : 0.62;
      let height = view.above / (roadFrac - navFrac);
      let width = height * aspect;
      const minWidth = wide ? 0 : 620;
      if (width < minWidth) {
        width = minWidth;
        height = width / aspect;
      }
      const top = ROAD_Y - roadFrac * height;
      svg?.setAttribute("viewBox", `0 ${top} ${width} ${height}`);
      const half = width / 2;
      const cam = clamp(view.cx, half, WORLD_W - half);
      const shift = half - cam;
      if (e.bar) e.bar.style.transform = `scaleX(${p})`;

      move("world", shift);
      move("skylineNear", shift * 0.5);
      move("skylineFar", shift * 0.25);
      move("clouds", shift * 0.1);

      // The car, its wheels, bonnet and lights
      move("car", x, ROAD_Y - lift);
      const spin = ((x / 30) * 180) / Math.PI;
      e.wheelF?.setAttribute("transform", `rotate(${spin})`);
      e.wheelR?.setAttribute("transform", `rotate(${spin})`);
      e.hood?.setAttribute("transform", `rotate(${-40 * window01(p, 0.29, 0.31, 0.355, 0.375)} 112 -100)`);
      fade("driverCustomer", 1 - seg(p, 0.105, 0.12));
      fade("driverMechanic", window01(p, 0.37, 0.38, 0.94, 0.95));
      fade("speed", window01(p, 0.76, 0.78, 0.86, 0.88));

      // 1–2: breakdown and the call
      fade("smoke", window01(p, 0.095, 0.12, 0.32, 0.36));
      fade("hazard", window01(p, 0.1, 0.11, 0.36, 0.38));
      fade("customer", window01(p, 0.11, 0.13, 0.38, 0.41));
      const calling = window01(p, 0.13, 0.15, 0.24, 0.26);
      e.customerArm?.setAttribute("transform", `rotate(${-150 * calling} ${SHOULDER.x} ${SHOULDER.y})`);
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
      move("walker", x + 150 + (7490 - (x + 150)) * seg(p, 0.95, 0.975), ROAD_Y - 22);
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
        {/* Daytime sky */}
        <div className="absolute inset-0 bg-linear-to-b from-[#e3eaf4] via-[#eef2f8] to-[#f7f9fc]" aria-hidden />
        <svg
          ref={svgRef}
          viewBox="0 292 1180 708"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 size-full"
          role="img"
          aria-label="Illustration: a car breaks down at night, the owner calls Shree Kashtbhanjan Motors, a mechanic arrives on a scooter and fixes it, then the car is serviced, washed, test-driven and delivered back home."
        >
          <StoryDefs />

          <g data-k="clouds">
            <g className="story-drift">
            {[
              [120, 330, 1],
              [620, 400, 0.8],
              [1100, 340, 1.1],
              [1700, 410, 0.9],
              [2300, 350, 1],
              [2900, 390, 0.85],
              [3500, 340, 1.05],
            ].map(([cx, cy, sc]) => (
              <Cloud key={cx} x={cx} y={cy} scale={sc} />
            ))}
            </g>
          </g>
          <g data-k="skylineFar">
            <Skyline count={30} baseY={640} seed={7} />
          </g>
          <g data-k="skylineNear">
            <Skyline count={30} baseY={676} seed={19} detail />
          </g>

          <g data-k="world">
            {/* Hedge, striped pavement, road, and a grassy verge in front */}
            <Hedge from={-200} to={WORLD_W + 200} y={680} />
            <g stroke={OUTLINE} strokeWidth={3}>
              <rect x={-400} y={680} width={WORLD_W + 800} height={22} fill="#e5eaf1" />
              <rect x={-400} y={702} width={WORLD_W + 800} height={4} fill="#f26a1b" />
              <rect x={-400} y={706} width={WORLD_W + 800} height={10} fill="#cbd5e1" />
              <rect x={-400} y={716} width={WORLD_W + 800} height={196} fill="#4b5a72" />
              <rect x={-400} y={912} width={WORLD_W + 800} height={12} fill="#cbd5e1" />
            </g>
            <line x1={-400} y1={724} x2={WORLD_W + 400} y2={724} stroke="#6b7a91" strokeWidth={3} />
            <line x1={-400} y1={840} x2={WORLD_W + 400} y2={840} stroke="#fff" strokeWidth={7} strokeDasharray="70 60" />
            <rect x={-400} y={924} width={WORLD_W + 800} height={40} fill="#e5eaf1" />
            <rect x={-400} y={964} width={WORLD_W + 800} height={1200} fill="#eef2f7" />

            {[180, 1520, 1960, 2420, 5230, 5560, 6160, 6520, 6960, 8020].map((tx, i) => (
              <Tree key={tx} x={tx} scale={0.85 + (i % 3) * 0.12} />
            ))}
            {[60, 1120, 2560, 5080, 6320, 7900].map((lx) => (
              <StreetLamp key={lx} x={lx} />
            ))}

            {/* The garage */}
            <g stroke={OUTLINE} strokeWidth={3}>
              <rect x={2640} y={290} width={2320} height={390} fill="#ffffff" />
              <rect x={2610} y={264} width={2380} height={34} rx={6} fill={palette.navy800} />
              <rect x={2610} y={290} width={2380} height={10} fill={palette.orange} />
              <rect x={2700} y={316} width={1000} height={80} rx={14} fill={palette.navy800} />
              <rect x={4130} y={316} width={540} height={80} rx={14} fill={palette.orange} />
              {/* Service bay */}
              <rect x={2960} y={420} width={480} height={260} rx={8} fill="#1e3052" />
              <rect x={2985} y={450} width={430} height={84} rx={6} fill="#2a4068" />
              <rect x={2954} y={412} width={492} height={34} rx={6} fill="#cbd5e1" />
              {/* Wash bay */}
              <rect x={4160} y={420} width={480} height={260} rx={8} fill="#dbe6f2" />
              <rect x={4180} y={496} width={440} height={12} rx={6} fill="#94a3b8" />
              <rect x={4154} y={412} width={492} height={34} rx={6} fill="#cbd5e1" />
              {/* Office */}
              {[3560, 3760].map((wx) => (
                <rect key={wx} x={wx} y={450} width={150} height={110} rx={8} fill="#d4e2f0" />
              ))}
              <rect x={3605} y={570} width={84} height={110} rx={6} fill={palette.orange} />
            </g>
            {[3010, 3060, 3110, 3160, 3210, 3260, 3310, 3360].map((tx, i) => (
              <rect key={tx} x={tx} y={460 + (i % 2) * 10} width={9} height={52 - (i % 3) * 10} rx={3} fill="#e2e8f0" stroke={OUTLINE} strokeWidth={2} />
            ))}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x={4180 + i * 76} y={520} width={56} height={150} rx={4} fill="#c6d6e8" />
            ))}
            <circle cx={3675} cy={630} r={4} fill={palette.navy900} />
            <text x={3200} y={370} textAnchor="middle" className="font-display" fontSize={46} fontWeight={700} fill="#fff" letterSpacing={2}>
              SHREE KASHTBHANJAN <tspan fill={palette.orange}>MOTORS</tspan>
            </text>
            <text x={4400} y={370} textAnchor="middle" className="font-display" fontSize={46} fontWeight={700} fill="#fff" letterSpacing={4}>
              CAR WASH
            </text>

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
              <rect x={-5} y={-190} width={10} height={190} fill="#7c8a9c" stroke={OUTLINE} strokeWidth={3} />
              <rect x={-118} y={-256} width={236} height={74} rx={12} fill={palette.navy800} stroke={OUTLINE} strokeWidth={3} />
              <text y={-206} textAnchor="middle" className="font-display" fontSize={40} fontWeight={700} fill="#fff" letterSpacing={3}>
                TEST <tspan fill={palette.orange}>DRIVE</tspan>
              </text>
            </g>
            <g transform="translate(6380 700)">
              <rect x={-4} y={-210} width={8} height={210} fill="#7c8a9c" stroke={OUTLINE} strokeWidth={3} />
              {Array.from({ length: 12 }, (_, i) => (
                <rect key={i} x={4 + (i % 4) * 22} y={-208 + Math.floor(i / 4) * 22} width={22} height={22} fill={(i + Math.floor(i / 4)) % 2 ? "#e2e8f0" : "#0b1220"} />
              ))}
            </g>

            {/* The customer's home */}
            <g transform="translate(7350 0)" stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round">
              <rect x={150} y={410} width={36} height={50} fill="#e5eaf1" />
              <rect x={0} y={470} width={400} height={210} fill="#ffffff" />
              <path d="M-40 476 L200 356 L440 476 Z" fill="#1e3052" />
              <rect x={40} y={516} width={120} height={96} rx={6} fill="#d4e2f0" />
              <path d="M100 516 L100 612 M40 564 L160 564" fill="none" stroke="#ffffff" strokeWidth={6} />
              <rect x={228} y={560} width={92} height={120} rx={6} fill={palette.orange} />
              <circle cx={306} cy={624} r={5} fill="#fbbf24" />
              {Array.from({ length: 9 }, (_, i) => (
                <path key={i} d={`M${-70 + i * 22} 680 v-56 l5 -8 l5 8 v56 z`} fill="#cbd5e1" />
              ))}
              <rect x={-74} y={642} width={200} height={8} fill="#cbd5e1" />
            </g>
            <g data-k="homeCustomer" opacity={0} transform={`translate(7605 ${ROAD_Y - 100})`}>
              <Person outfit="suit" flip />
            </g>

            {/* Roadside: the customer and the call */}
            <g data-k="customer" opacity={0} transform={`translate(560 ${ROAD_Y - 22})`}>
              <Person outfit="suit" hold="phone" armKey="customerArm" />
            </g>
            <g data-k="call" opacity={0} transform="translate(650 562)">
              <Bubble width={340} height={110}>
                <g transform="translate(-118 0)">
                  <circle r={30} fill="#25D366" className="story-ring" style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }} />
                  <path d="M-10 -14 q-4 0 -4 5 q2 16 18 23 q5 1 7 -3 l2 -6 l-8 -4 l-4 4 q-6 -3 -9 -9 l4 -4 l-4 -8 z" fill="#fff" />
                </g>
                <text x={-72} y={-8} fontSize={24} fontWeight={700} fill={palette.navy900}>
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
                  <g data-k="rider" transform="translate(17 -4)">
                    <Person outfit="mechanic" flip seated />
                  </g>
                }
              />
            </g>
            <g data-k="mechanic" opacity={0} transform={`translate(1020 ${ROAD_Y - 22})`}>
              <Person outfit="mechanic" flip armAngle={-60} hold="wrench" armClass="story-wrench" />
            </g>
            <g data-k="fixed" opacity={0} transform="translate(800 570)">
              <Bubble width={250} height={84}>
                <circle cx={-78} r={22} fill="#16a34a" />
                <path d="M-89 0 L-81 8 L-67 -8" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                <text x={-44} y={10} fontSize={28} fontWeight={700} fill={palette.navy900}>
                  Running!
                </text>
              </Bubble>
            </g>

            {/* Garage mechanic under the lifted car */}
            <g data-k="garageMechanic" opacity={0}>
              <g transform={`translate(3125 ${ROAD_Y - 8})`}>
                <Person outfit="mechanic" armAngle={-170} hold="wrench" armClass="story-wrench" />
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
                    fill="#8a96a8"
                    opacity={0.75}
                    stroke={OUTLINE}
                    strokeWidth={2}
                    className="story-smoke"
                    style={{ animationDelay: `${i * 0.45}s`, transformBox: "fill-box", transformOrigin: "50% 50%" }}
                  />
                ))}
              </g>
              <Car
                frontWheelKey="wheelF"
                rearWheelKey="wheelR"
                hoodKey="hood"
                drivers={
                  <>
                    <DriverHead headKey="driverCustomer" outfit="suit" />
                    <DriverHead headKey="driverMechanic" outfit="mechanic" />
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
                      <rect x={0} y={-15} width={30} height={30} rx={8} fill="#eef2f7" stroke={OUTLINE} strokeWidth={2.5} />
                      <g data-k={`tick${i + 1}`} opacity={0}>
                        <path d="M7 0 L13 7 L24 -7" fill="none" stroke="#22c55e" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                      <text x={46} y={9} fontSize={26} fontWeight={600} fill={palette.navy900}>
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
              <g data-k="foam" opacity={0} fill="#ffffff" stroke={OUTLINE} strokeWidth={2.5}>
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
              <Person outfit="mechanic" armAngle={-70} hold="key" />
            </g>
            <g data-k="key" opacity={0} transform="translate(7575 492)">
              <Bubble width={220} height={80}>
                <text textAnchor="middle" y={10} fontSize={28} fontWeight={700} fill={palette.orangeDark}>
                  Your keys!
                </text>
              </Bubble>
            </g>
            <g data-k="heart" opacity={0} transform="translate(7705 420)">
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

        <Container className="relative flex h-full flex-col justify-between pb-24 pt-24 sm:pb-8 lg:pt-28 [@media(max-height:500px)]:pb-3 [@media(max-height:500px)]:pt-20">
          <div data-k="intro" className="mx-auto max-w-2xl [@media(max-height:500px)]:invisible rounded-2xl bg-white/90 px-6 py-5 text-center shadow-xl shadow-navy-900/10 ring-1 ring-mist-200 backdrop-blur sm:px-10">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              <span className="h-px w-6 bg-brand-500" aria-hidden />
              Roadside to doorstep
              <span className="h-px w-6 bg-brand-500" aria-hidden />
            </p>
            <h2 id="story-heading" className="mt-2 text-3xl font-bold uppercase leading-[1.05] text-navy-900 sm:text-5xl">
              We&apos;re with you <span className="text-brand-500">at every step.</span>
            </h2>
            <p className="mt-2 text-sm font-semibold text-navy-500">Scroll to follow the story</p>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div
              className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-5 shadow-2xl shadow-navy-900/15 ring-1 ring-mist-200 sm:p-6"
              aria-live="polite"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-brand-500 font-display shadow-lg shadow-brand-500/30 text-3xl font-bold text-white sm:size-16 sm:text-4xl">
                  {String(step + 1).padStart(2, "0")}
                </span>
                <div key={step} className="animate-fade-up">
                  <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                    <StepIcon className="size-4" aria-hidden />
                    Step {step + 1} of {steps.length}
                  </p>
                  <h3 className="mt-1 text-2xl font-bold uppercase leading-tight text-navy-900 sm:text-3xl">{steps[step].title}</h3>
                  <p className="mt-1 text-navy-600 [@media(max-height:500px)]:hidden">{steps[step].text}</p>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1.5 bg-mist-100">
                <div data-k="bar" className="h-full origin-left bg-brand-500" style={{ transform: "scaleX(0)" }} />
              </div>
            </div>

            <ol
              className="hidden gap-2 rounded-full bg-white p-2 shadow-xl shadow-navy-900/10 ring-1 ring-mist-200 lg:flex"
              aria-label="Story progress"
            >
              {steps.map(({ icon: Icon, title }, i) => (
                <li
                  key={title}
                  className={cn(
                    "grid size-10 place-items-center rounded-full border-2 transition-all duration-500",
                    i === step
                      ? "scale-110 border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                      : i < step
                        ? "border-brand-300 bg-brand-50 text-brand-600"
                        : "border-mist-200 bg-white text-navy-300",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
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
