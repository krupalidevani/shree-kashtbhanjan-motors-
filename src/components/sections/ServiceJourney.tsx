"use client";

import { CalendarCheck, CarFront, ClipboardCheck, KeyRound, Search, Sparkles, Wrench, type LucideIcon } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

import carDusk from "@/assets/images/car-dusk.jpg";
import carWash from "@/assets/images/car-wash.jpg";
import engineBelts from "@/assets/images/engine-belts.jpg";
import mechanicEngineBay from "@/assets/images/mechanic-engine-bay.jpg";
import mechanicSmiling from "@/assets/images/mechanic-smiling.jpg";
import workshopTools from "@/assets/images/workshop-tools.jpg";
import { Container } from "@/components/ui/Container";
import { clamp } from "@/lib/useScrollProgress";
import { cn } from "@/lib/utils";

type JourneyStep = {
  icon: LucideIcon;
  title: string;
  text: string;
  image: StaticImageData;
  imageAlt: string;
};

const steps: JourneyStep[] = [
  {
    icon: CalendarCheck,
    title: "Book, drop off or get picked up",
    text: "Pick a slot online or on WhatsApp, then drop your car at the workshop at a time that suits you. Can't come in? We can pick up your car too — pickup is available with advance payment.",
    image: mechanicSmiling,
    imageAlt: "Mechanic welcoming a car into the workshop",
  },
  {
    icon: Search,
    title: "Inspect",
    text: "We check the car thoroughly and run diagnostics to find the real cause, not just the symptom.",
    image: mechanicEngineBay,
    imageAlt: "Mechanic inspecting an engine bay",
  },
  {
    icon: ClipboardCheck,
    title: "Approve the estimate",
    text: "You get a clear, itemised estimate. No work starts until you say yes — no surprise charges.",
    image: workshopTools,
    imageAlt: "Organised workshop tool wall",
  },
  {
    icon: Wrench,
    title: "Service & repair",
    text: "Our mechanics carry out the work with quality parts, and keep you updated along the way.",
    image: engineBelts,
    imageAlt: "Close-up of engine belts and pulleys",
  },
  {
    icon: Sparkles,
    title: "Wash & detail",
    text: "A careful foam wash and clean-up so your car leaves looking as good as it now runs.",
    image: carWash,
    imageAlt: "Car being hand washed with foam",
  },
  {
    icon: KeyRound,
    title: "Drive off",
    text: "A final road test and quality check, then the keys are back in your hands.",
    image: carDusk,
    imageAlt: "Clean, shining car ready to drive",
  },
];

/** Where on screen (fraction of viewport height) the car heads for while scrolling. */
const markRatio = 0.55;
/** How quickly the car catches up with the scroll position each frame (1 = instantly). */
const easing = 0.12;

/**
 * The service journey as a road: a car glides down it as the page scrolls,
 * and each step comes alive once the car reaches it. Photo and text sit on
 * opposite sides of the road on large screens; on small screens the road
 * runs down the left edge.
 */
export function ServiceJourney() {
  const listRef = useRef<HTMLOListElement>(null);
  const carRef = useRef<HTMLSpanElement>(null);
  const trailRef = useRef<HTMLSpanElement>(null);
  const nodeRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ease = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : easing;
    let target = 0;
    let current = 0;
    let frame = 0;

    const measure = () => {
      const rect = list.getBoundingClientRect();
      // The car parks at the last stop rather than running off the end of the road.
      const lastStop = nodeRefs.current[steps.length - 1]?.getBoundingClientRect();
      const end = lastStop ? (lastStop.top + lastStop.height / 2 - rect.top) / rect.height : 1;
      target = clamp((window.innerHeight * markRatio - rect.top) / rect.height, 0, end);
    };

    const tick = () => {
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.0004) current = target;

      const rect = list.getBoundingClientRect();
      const y = current * rect.height;
      if (carRef.current) carRef.current.style.transform = `translate3d(-50%, calc(${y}px - 50%), 0)`;
      if (trailRef.current) trailRef.current.style.clipPath = `inset(0 0 ${(1 - current) * 100}% 0)`;

      const carY = rect.top + y;
      let count = 0;
      for (const node of nodeRefs.current) {
        if (!node) continue;
        const box = node.getBoundingClientRect();
        if (box.top + box.height / 2 <= carY + 1) count++;
      }
      setReached(count);

      frame = current === target ? 0 : requestAnimationFrame(tick);
    };

    const onScroll = () => {
      measure();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    measure();
    current = target;
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28" aria-labelledby="journey-heading">
      <div
        className="pointer-events-none absolute -right-40 top-20 size-[32rem] rounded-full bg-brand-500/10 blur-3xl"
        aria-hidden
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
            <span className="h-px w-6 bg-brand-500" aria-hidden />
            How It Works
            <span className="h-px w-6 bg-brand-500" aria-hidden />
          </p>
          <h2 id="journey-heading" className="mt-4 text-4xl font-bold uppercase leading-[1.05] text-navy-900 sm:text-5xl lg:text-6xl">
            From drop-off <span className="text-brand-500">to drive-off.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-navy-500">
            A clear path at every step — you always know what is happening with your car.
          </p>
        </div>

        <ol ref={listRef} className="relative mt-16 flex flex-col gap-14 lg:mt-24 lg:gap-28">
          {/* The road */}
          <span
            className="absolute inset-y-0 left-5 w-10 -translate-x-1/2 rounded-full bg-navy-900 shadow-inner lg:left-1/2 lg:w-14"
            aria-hidden
          >
            <span className="absolute inset-y-4 left-1/2 w-0.5 -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,rgb(255_255_255/0.45)_0_14px,transparent_14px_30px)]" />
            {/* Lane markings turn orange behind the car */}
            <span className="absolute inset-y-4 left-1/2 w-1 -translate-x-1/2 overflow-hidden">
              <span
                ref={trailRef}
                style={{ clipPath: "inset(0 0 100% 0)" }}
                className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,var(--color-brand-400)_0_14px,transparent_14px_30px)]"
              />
            </span>
          </span>

          {/* The car — positioned every frame from the scroll effect */}
          <span
            ref={carRef}
            className="pointer-events-none absolute left-5 top-0 z-20 grid size-11 place-items-center rounded-2xl bg-brand-500 text-white shadow-xl shadow-brand-500/40 ring-4 ring-white will-change-transform lg:left-1/2 lg:size-14"
            style={{ transform: "translate3d(-50%, -50%, 0)" }}
            aria-hidden
          >
            <CarFront className="size-5 lg:size-6" />
          </span>

          {steps.map((step, index) => {
            const Icon = step.icon;
            const on = index < reached;
            const photoLeft = index % 2 === 0;
            const number = String(index + 1).padStart(2, "0");
            return (
              <li key={step.title} className="relative pl-14 lg:grid lg:grid-cols-[1fr_7rem_1fr] lg:items-center lg:pl-0">
                {/* Stop on the road */}
                <span
                  ref={(node) => {
                    nodeRefs.current[index] = node;
                  }}
                  className={cn(
                    "absolute left-5 top-3 z-10 grid size-9 -translate-x-1/2 place-items-center rounded-full ring-4 ring-white transition-all duration-700 ease-out lg:static lg:col-start-2 lg:row-start-1 lg:size-12 lg:translate-x-0 lg:justify-self-center",
                    on ? "scale-110 bg-brand-500 text-white shadow-lg shadow-brand-500/40" : "bg-navy-700 text-navy-200",
                  )}
                >
                  <Icon className="size-4 lg:size-5" aria-hidden />
                </span>

                {/* Text */}
                <div
                  className={cn(
                    "transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] lg:row-start-1",
                    photoLeft ? "lg:col-start-3" : "lg:col-start-1 lg:text-right",
                    on ? "opacity-100" : "lg:translate-y-8 lg:opacity-30",
                  )}
                >
                  <div className={cn("max-w-md", !photoLeft && "lg:ml-auto")}>
                    <p
                      className={cn(
                        "font-display text-6xl font-bold leading-none tabular-nums transition-colors duration-700 lg:text-7xl",
                        on ? "text-brand-500" : "text-mist-200",
                      )}
                      aria-hidden
                    >
                      {number}
                    </p>
                    <p className="sr-only">Step {number}</p>
                    <h3 className="mt-3 text-2xl font-bold uppercase leading-tight text-navy-900 sm:text-3xl lg:text-4xl">{step.title}</h3>
                    <span
                      className={cn(
                        "mt-4 block h-1 w-12 rounded-full bg-brand-500 transition-transform duration-700 ease-out",
                        photoLeft ? "origin-left" : "origin-left lg:ml-auto lg:origin-right",
                        on ? "scale-x-100" : "scale-x-0",
                      )}
                      aria-hidden
                    />
                    <p className="mt-4 text-lg leading-relaxed text-navy-500">{step.text}</p>
                  </div>
                </div>

                {/* Photo */}
                <figure
                  className={cn(
                    "relative mt-6 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] lg:row-start-1 lg:mt-0",
                    photoLeft ? "lg:col-start-1" : "lg:col-start-3",
                    on ? "opacity-100" : "lg:translate-y-10 lg:scale-95 lg:opacity-50",
                  )}
                >
                  {/* Offset frame that slides out from behind the photo */}
                  <span
                    className={cn(
                      "absolute inset-0 rounded-[2rem] border-2 border-brand-500/40 transition-transform duration-1000 ease-out",
                      on ? (photoLeft ? "-translate-x-3 translate-y-3" : "translate-x-3 translate-y-3") : "translate-0",
                    )}
                    aria-hidden
                  />
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-navy-900 shadow-2xl shadow-navy-900/15">
                    <Image
                      src={step.image}
                      alt={step.imageAlt}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1024px) 34vw, 90vw"
                      className={cn(
                        "object-cover transition-all duration-1000 ease-out",
                        on ? "scale-100 grayscale-0" : "scale-110 lg:grayscale",
                      )}
                    />
                  </div>
                </figure>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
