"use client";

import { useEffect, useRef, useState } from "react";

import { Bubble, Car, DriverHead, Gear, Person, Scooter, StreetLamp, Tree, palette } from "@/components/story/StoryArt";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { clamp, useScrollProgress } from "@/lib/useScrollProgress";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Breakdown on the road", text: "Your car suddenly stops in the middle of the road? Don't worry." },
  { title: "Call us", text: `One call or WhatsApp message to ${siteConfig.name} and help is on the way.` },
  { title: "Fixed on the spot", text: "Our mechanic reaches you on a scooter with tools and gets your car running right there." },
  { title: "Driven to our garage", text: "For a full check-up, our team drives your car safely to the workshop." },
  { title: "Complete service", text: "Inspection, repairs and servicing with quality parts by skilled mechanics." },
  { title: "Wash & shine", text: "A careful foam wash, so your car looks as good as it runs." },
  { title: "Test drive", text: "We road-test the car to make sure everything works perfectly." },
  { title: "Delivered home", text: "Your car is dropped at your doorstep and the keys are handed back to you." },
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

/** Visible part of the street: a 16:9 window zoomed in on the road. */
const VIEW_W = 1160;
const VIEW_H = 652;
const VIEW_Y = 270;
const WORLD_W = 8100;
const ROAD_Y = 800;

const smooth = (t: number) => t * t * (3 - 2 * t);
/** 0 → 1 as p moves from a to b. */
const seg = (p: number, a: number, b: number) => smooth(clamp((p - a) / (b - a)));
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
 * The whole service told as a short side-scrolling cartoon: breakdown, call,
 * roadside repair, drive to the garage, service, wash, test drive and delivery
 * home. The section pins while scrolling moves the camera along the street.
 */
export function ServiceStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [step, setStep] = useState(0);

  useScrollProgress(sectionRef, (progress) => {
    progressRef.current = progress;
  });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let shown = progressRef.current;
    let lastDrawn = -1;
    let lastStep = -1;
    let frame = 0;
    let last = performance.now();
    let visible = true;

    // Every moving part is tagged with data-k; look them up once.
    const e: Record<string, SVGElement> = {};
    sectionRef.current?.querySelectorAll<SVGElement>("[data-k]").forEach((el) => {
      e[el.dataset.k ?? ""] = el;
    });
    const move = (key: string, x: number, y = 0, extra = "") => e[key]?.setAttribute("transform", `translate(${x} ${y})${extra}`);
    const fade = (key: string, value: number) => {
      const el = e[key];
      if (el) el.style.opacity = String(value);
    };

    const draw = (p: number) => {
      const x = carX(p);
      const lift = 110 * window01(p, 0.52, 0.56, 0.59, 0.62);
      const cam = clamp(x, VIEW_W / 2, WORLD_W - VIEW_W / 2);
      const shift = VIEW_W / 2 - cam;

      move("world", shift);
      move("skyline", shift * 0.45);
      move("clouds", shift * 0.15);

      // The car, its wheels and bonnet
      move("car", x, ROAD_Y - lift);
      const spin = ((x / 32) * 180) / Math.PI;
      e.wheelF?.setAttribute("transform", `rotate(${spin})`);
      e.wheelR?.setAttribute("transform", `rotate(${spin})`);
      e.hood?.setAttribute("transform", `rotate(${-42 * window01(p, 0.29, 0.31, 0.355, 0.375)} 100 -102)`);
      fade("driverCustomer", 1 - seg(p, 0.105, 0.12));
      fade("driverMechanic", window01(p, 0.37, 0.38, 0.94, 0.95));
      fade("speed", window01(p, 0.76, 0.78, 0.86, 0.88));

      // 1–2: breakdown and the call
      fade("smoke", window01(p, 0.095, 0.12, 0.32, 0.36));
      fade("customer", window01(p, 0.11, 0.13, 0.38, 0.41));
      const calling = window01(p, 0.13, 0.15, 0.24, 0.26);
      e.customerArm?.setAttribute("transform", `rotate(${-150 * calling} 19.5 -96)`);
      fade("call", calling);

      // 3: the mechanic arrives and fixes it
      move("scooter", 1750 + (1180 - 1750) * seg(p, 0.25, 0.29), ROAD_Y + 6);
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
      move("walker", x + 140 + (7540 - (x + 140)) * seg(p, 0.95, 0.975), ROAD_Y - 18);
      fade("key", seg(p, 0.97, 0.98));
      fade("heart", seg(p, 0.985, 0.995));

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
    draw(shown);
    frame = requestAnimationFrame(tick);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      last = performance.now();
    });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[800svh] bg-white" aria-labelledby="story-heading">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pb-6 pt-24">
        <Container className="flex flex-col gap-5 lg:gap-6">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                <span className="h-px w-6 bg-brand-500" aria-hidden />
                Roadside to doorstep
              </p>
              <h2 id="story-heading" className="mt-3 text-3xl font-bold uppercase leading-[1.05] text-navy-900 sm:text-4xl lg:text-5xl">
                We&apos;re with you <span className="text-brand-500">at every step.</span>
              </h2>
            </div>
            <p className="text-sm font-semibold text-navy-400">Scroll to follow the story</p>
          </div>

          {/* The animated street */}
          <div
            className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[#dff1fb] shadow-xl shadow-navy-900/10 ring-1 ring-mist-200 sm:aspect-[16/9]"
            style={{ maxWidth: "calc((100svh - 24rem) * 16 / 9)" }}
          >
            <svg
              viewBox={`0 ${VIEW_Y} ${VIEW_W} ${VIEW_H}`}
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 size-full"
              role="img"
              aria-label="Illustration: a car breaks down, the owner calls Shree Kashtbhanjan Motors, a mechanic fixes it on the spot, the car is serviced, washed, test-driven and delivered back home."
            >
              <defs>
                <linearGradient id="story-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#bfe3f7" />
                  <stop offset="1" stopColor="#f3f9fd" />
                </linearGradient>
              </defs>
              <rect y={VIEW_Y} width={VIEW_W} height={VIEW_H} fill="url(#story-sky)" />
              <circle cx={990} cy={360} r={52} fill="#ffd77a" opacity={0.9} />

              {/* Far layers move slower than the street */}
              <g data-k="clouds">
                {[200, 900, 1700, 2500, 3300].map((cx, i) => (
                  <g key={cx} transform={`translate(${cx} ${330 + (i % 2) * 50})`} fill="#fff" opacity={0.9}>
                    <ellipse rx={80} ry={26} />
                    <ellipse cx={-40} cy={10} rx={50} ry={20} />
                    <ellipse cx={50} cy={8} rx={56} ry={22} />
                  </g>
                ))}
              </g>
              <g data-k="skyline" fill="#b9cbe0">
                {Array.from({ length: 24 }, (_, i) => {
                  const w = 90 + ((i * 37) % 70);
                  const h = 160 + ((i * 53) % 190);
                  return <rect key={i} x={i * 190} y={640 - h} width={w} height={h} rx={6} />;
                })}
              </g>

              <g data-k="world">
                {/* Ground, pavement and road */}
                <rect x={-200} y={620} width={WORLD_W + 400} height={70} fill="#9fd08f" />
                <rect x={-200} y={680} width={WORLD_W + 400} height={30} fill="#d7dde6" />
                <rect x={-200} y={710} width={WORLD_W + 400} height={190} fill="#3a4354" />
                <line x1={-200} y1={716} x2={WORLD_W + 200} y2={716} stroke="#e8ecf2" strokeWidth={4} />
                <line x1={-200} y1={830} x2={WORLD_W + 200} y2={830} stroke="#fff" strokeWidth={6} strokeDasharray="70 60" />

                {[150, 1500, 1950, 2400, 5250, 5550, 6150, 6500, 6950, 8000].map((tx, i) => (
                  <Tree key={tx} x={tx} scale={0.85 + (i % 3) * 0.12} />
                ))}
                {[1100, 2550, 5100, 6300].map((lx) => (
                  <StreetLamp key={lx} x={lx} />
                ))}

                {/* The garage */}
                <g>
                  <rect x={2650} y={300} width={2300} height={400} fill="#f4f6f9" />
                  <rect x={2620} y={270} width={2360} height={40} rx={8} fill={palette.navy} />
                  <rect x={2700} y={318} width={1000} height={76} rx={12} fill={palette.navy} />
                  <text x={3200} y={370} textAnchor="middle" className="font-display" fontSize={44} fontWeight={700} fill="#fff" letterSpacing={2}>
                    SHREE KASHTBHANJAN <tspan fill={palette.orange}>MOTORS</tspan>
                  </text>
                  <rect x={4130} y={318} width={540} height={76} rx={12} fill={palette.orange} />
                  <text x={4400} y={370} textAnchor="middle" className="font-display" fontSize={44} fontWeight={700} fill="#fff" letterSpacing={3}>
                    CAR WASH
                  </text>
                  {/* Service bay with a tool wall */}
                  <rect x={2960} y={430} width={480} height={270} rx={10} fill="#26324a" />
                  {[2990, 3060, 3130, 3200, 3270, 3340].map((tx, i) => (
                    <rect key={tx} x={tx} y={455 + (i % 2) * 14} width={10} height={60 - (i % 3) * 10} rx={3} fill="#8e98a8" />
                  ))}
                  <rect x={2985} y={530} width={430} height={10} fill="#3b4762" />
                  {/* Wash bay */}
                  <rect x={4160} y={430} width={480} height={270} rx={10} fill="#2c3b57" />
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <rect key={i} x={4180 + i * 76} y={450} width={60} height={230} fill="#36486a" />
                  ))}
                  <rect x={4180} y={500} width={440} height={12} rx={6} fill="#9aa3b2" />
                  {/* Office windows */}
                  {[3560, 3760].map((wx) => (
                    <rect key={wx} x={wx} y={450} width={150} height={110} rx={8} fill="#bfe0f5" stroke="#d7dde6" strokeWidth={6} />
                  ))}
                  <rect x={3600} y={590} width={90} height={110} rx={6} fill={palette.orange} />
                </g>

                {/* Lift in front of the service bay */}
                <g data-k="lift" opacity={0}>
                  <rect x={3010} y={560} width={22} height={250} rx={4} fill={palette.orange} />
                  <rect x={3368} y={560} width={22} height={250} rx={4} fill={palette.orange} />
                  <g data-k="liftDeck">
                    <rect x={3020} y={ROAD_Y} width={360} height={14} rx={4} fill="#55627a" />
                  </g>
                </g>

                {/* Test drive sign and finish flag */}
                <g transform="translate(5400 690)">
                  <rect x={-5} y={-190} width={10} height={190} fill="#55627a" />
                  <rect x={-110} y={-250} width={220} height={70} rx={10} fill={palette.navy} />
                  <text y={-203} textAnchor="middle" className="font-display" fontSize={38} fontWeight={700} fill="#fff" letterSpacing={2}>
                    TEST DRIVE
                  </text>
                </g>
                <g transform="translate(6380 690)">
                  <rect x={-4} y={-200} width={8} height={200} fill="#55627a" />
                  {Array.from({ length: 12 }, (_, i) => (
                    <rect key={i} x={4 + (i % 4) * 22} y={-198 + Math.floor(i / 4) * 22} width={22} height={22} fill={(i + Math.floor(i / 4)) % 2 ? "#fff" : palette.navy} />
                  ))}
                </g>

                {/* The customer's home */}
                <g transform="translate(7350 0)">
                  <path d="M-30 470 L200 360 L430 470 Z" fill="#c2410c" />
                  <rect x={0} y={470} width={400} height={230} fill="#fdf2e4" />
                  <rect x={40} y={520} width={110} height={90} rx={6} fill="#bfe0f5" stroke="#e5d3bd" strokeWidth={6} />
                  <rect x={230} y={580} width={90} height={120} rx={6} fill={palette.navySoft} />
                  <circle cx={305} cy={645} r={5} fill="#f5b301" />
                  {Array.from({ length: 9 }, (_, i) => (
                    <rect key={i} x={-60 + i * 22} y={640} width={10} height={60} rx={3} fill="#fff" />
                  ))}
                </g>
                <g data-k="homeCustomer" opacity={0} transform={`translate(7600 ${ROAD_Y - 100})`}>
                  <Person shirt="#14b8a6" flip />
                </g>

                {/* Roadside: smoke, the customer and the call */}
                <g data-k="customer" opacity={0} transform={`translate(560 ${ROAD_Y - 18})`}>
                  <Person shirt="#14b8a6" hold="phone" armKey="customerArm" />
                </g>
                <g data-k="call" opacity={0} transform="translate(560 600)">
                  <Bubble width={330} height={110}>
                    <g transform="translate(-120 0)">
                      <circle r={30} fill="#25D366" className="story-ring" style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }} />
                      <path
                        d="M-10 -14 q-4 0 -4 5 q2 16 18 23 q5 1 7 -3 l2 -6 l-8 -4 l-4 4 q-6 -3 -9 -9 l4 -4 l-4 -8 z"
                        fill="#fff"
                      />
                    </g>
                    <text x={-70} y={-8} fontSize={24} fontWeight={700} fill={palette.navy}>
                      Calling…
                    </text>
                    <text x={-70} y={24} fontSize={22} fill="#56709e">
                      Kashtbhanjan Motors
                    </text>
                  </Bubble>
                </g>
                <g data-k="scooter" opacity={1}>
                  <Scooter
                    rider={
                      <g data-k="rider" transform="translate(8 -48)">
                        <Person shirt={palette.orange} cap={palette.navy} flip />
                      </g>
                    }
                  />
                </g>
                <g data-k="mechanic" opacity={0} transform={`translate(1010 ${ROAD_Y - 18})`}>
                  <Person shirt={palette.orange} cap={palette.navy} flip armAngle={-60} hold="wrench" armClass="story-wrench" />
                </g>
                <g data-k="fixed" opacity={0} transform="translate(800 560)">
                  <Bubble width={260} height={84}>
                    <circle cx={-80} r={22} fill="#16a34a" />
                    <path d="M-91 0 L-83 8 L-69 -8" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                    <text x={-46} y={10} fontSize={28} fontWeight={700} fill={palette.navy}>
                      Running!
                    </text>
                  </Bubble>
                </g>

                {/* Garage mechanic under the lifted car */}
                <g data-k="garageMechanic" opacity={0}>
                  <g transform={`translate(3120 ${ROAD_Y - 6})`}>
                    <Person shirt={palette.orange} cap={palette.navy} armAngle={-170} hold="wrench" armClass="story-wrench" />
                  </g>
                  <Gear r={26} x={3300} y={600} />
                  <Gear r={18} x={3345} y={570} reverse />
                </g>

                {/* The car */}
                <g data-k="car" transform={`translate(120 ${ROAD_Y})`}>
                  <g data-k="smoke" opacity={0}>
                    {[0, 1, 2, 3].map((i) => (
                      <circle
                        key={i}
                        cx={130 + i * 8}
                        cy={-110}
                        r={22 + i * 4}
                        fill="#9aa3b2"
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
                        <DriverHead headKey="driverCustomer" shirt="#14b8a6" />
                        <DriverHead headKey="driverMechanic" shirt={palette.orange} cap={palette.navy} />
                      </>
                    }
                    behind={
                      <g data-k="speed" opacity={0} stroke="#fff" strokeWidth={6} strokeLinecap="round">
                        <line x1={-200} y1={-120} x2={-300} y2={-120} />
                        <line x1={-190} y1={-80} x2={-330} y2={-80} />
                        <line x1={-200} y1={-40} x2={-290} y2={-40} />
                      </g>
                    }
                  />
                  {/* Test-drive checklist rides above the car */}
                  <g data-k="checklist" opacity={0} transform="translate(10 -172)">
                    <Bubble width={270} height={156}>
                      {["Brakes", "Engine", "AC & lights"].map((label, i) => (
                        <g key={label} transform={`translate(-100 ${-42 + i * 42})`}>
                          <rect x={0} y={-16} width={32} height={32} rx={8} fill="#eef1f5" />
                          <g data-k={`tick${i + 1}`} opacity={0}>
                            <path d="M7 0 L14 8 L26 -8" fill="none" stroke="#16a34a" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                          </g>
                          <text x={48} y={10} fontSize={26} fontWeight={600} fill={palette.navy}>
                            {label}
                          </text>
                        </g>
                      ))}
                    </Bubble>
                  </g>
                  {/* Wash: spray, foam and shine follow the car in the wash bay */}
                  <g data-k="spray" opacity={0} stroke="#7cc4ef" strokeWidth={5} strokeLinecap="round">
                    {[-140, -90, -40, 10, 60, 110].map((sx) => (
                      <line key={sx} x1={sx} y1={-290} x2={sx} y2={-170} strokeDasharray="14 14" className="story-spray" />
                    ))}
                  </g>
                  <g data-k="foam" opacity={0} fill="#fff">
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
                  <g data-k="shine" opacity={0} fill="#fff">
                    {[
                      [-60, -180],
                      [70, -170],
                      [150, -110],
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
                  <Person shirt={palette.orange} cap={palette.navy} armAngle={-70} hold="key" />
                </g>
                <g data-k="key" opacity={0} transform="translate(7570 540)">
                  <Bubble width={220} height={80}>
                    <text textAnchor="middle" y={10} fontSize={28} fontWeight={700} fill={palette.navy}>
                      Your keys!
                    </text>
                  </Bubble>
                </g>
                <g data-k="heart" opacity={0} transform="translate(7700 470)">
                  <path d="M0 18 C-30 -4 -22 -30 0 -16 C22 -30 30 -4 0 18 Z" fill="#e0454b" className="story-sparkle" style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }} />
                </g>
              </g>
            </svg>
          </div>

          {/* Caption and progress */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-[5.5rem] max-w-2xl" aria-live="polite">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                Step {String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </p>
              <h3 key={step} className="mt-1 animate-fade-up text-2xl font-bold uppercase text-navy-900 sm:text-3xl">
                {steps[step].title}
              </h3>
              <p key={`t${step}`} className="mt-1 animate-fade-up text-navy-500">
                {steps[step].text}
              </p>
            </div>
            <ol className="flex gap-1.5" aria-label="Story progress">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  className={cn("h-1.5 rounded-full transition-all duration-500", i === step ? "w-8 bg-brand-500" : i < step ? "w-3 bg-brand-300" : "w-3 bg-mist-200")}
                >
                  <span className="sr-only">{s.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </div>
    </section>
  );
}
