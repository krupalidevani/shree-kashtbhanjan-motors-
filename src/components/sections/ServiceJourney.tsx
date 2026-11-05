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

/** Where on screen (fraction of viewport height) the car sits while scrolling. */
const markRatio = 0.55;

/**
 * The service journey as a road: a car drives down it as the page scrolls,
 * and each step lights up once the car reaches it. Cards alternate sides on
 * large screens; on small screens the road runs down the left edge.
 */
export function ServiceJourney() {
  const listRef = useRef<HTMLOListElement>(null);
  const nodeRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const mark = window.innerHeight * markRatio;
      const rect = list.getBoundingClientRect();
      list.style.setProperty("--road", String(clamp((mark - rect.top) / rect.height)));
      let count = 0;
      for (const node of nodeRefs.current) {
        if (!node) continue;
        const box = node.getBoundingClientRect();
        if (box.top + box.height / 2 <= mark) count++;
      }
      setReached(count);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
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

        <ol ref={listRef} className="relative mt-16 space-y-10 [--road:0] lg:mt-20 lg:space-y-16">
          {/* The road */}
          <span
            className="absolute inset-y-0 left-5 w-10 -translate-x-1/2 rounded-full bg-navy-900 shadow-inner lg:left-1/2 lg:w-14"
            aria-hidden
          >
            <span className="absolute inset-y-4 left-1/2 w-0.5 -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,rgb(255_255_255/0.45)_0_14px,transparent_14px_30px)]" />
            {/* Lane markings turn orange behind the car */}
            <span
              className="absolute left-1/2 top-4 w-1 -translate-x-1/2 rounded-full bg-[repeating-linear-gradient(to_bottom,var(--color-brand-400)_0_14px,transparent_14px_30px)]"
              style={{ height: "calc((100% - 2rem) * var(--road))" }}
            />
          </span>

          {/* The car */}
          <span
            className="pointer-events-none absolute left-5 z-20 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl bg-brand-500 text-white shadow-xl shadow-brand-500/40 ring-4 ring-white lg:left-1/2 lg:size-14"
            style={{ top: "calc(var(--road) * 100%)" }}
            aria-hidden
          >
            <CarFront className="size-5 lg:size-6" />
          </span>

          {steps.map((step, index) => {
            const Icon = step.icon;
            const on = index < reached;
            const right = index % 2 === 1;
            const number = String(index + 1).padStart(2, "0");
            return (
              <li key={step.title} className="relative pl-14 lg:grid lg:grid-cols-[1fr_8rem_1fr] lg:items-center lg:pl-0">
                {/* Stop on the road */}
                <span
                  ref={(node) => {
                    nodeRefs.current[index] = node;
                  }}
                  className={cn(
                    "absolute left-5 top-8 z-10 grid size-9 -translate-x-1/2 place-items-center rounded-full ring-4 ring-white transition-all duration-500 lg:static lg:col-start-2 lg:row-start-1 lg:size-12 lg:translate-x-0 lg:justify-self-center",
                    on ? "bg-brand-500 text-white shadow-lg shadow-brand-500/40" : "bg-navy-700 text-navy-200",
                  )}
                >
                  <Icon className="size-4 lg:size-5" aria-hidden />
                </span>

                {/* Big outlined number on the empty side */}
                <span
                  className={cn(
                    "hidden select-none font-display text-[9rem] font-bold leading-none text-transparent transition-all duration-700 lg:row-start-1 lg:block",
                    right ? "lg:col-start-1 lg:justify-self-end" : "lg:col-start-3 lg:justify-self-start",
                    on ? "[-webkit-text-stroke:2px_var(--color-brand-500)]" : "[-webkit-text-stroke:2px_var(--color-mist-200)]",
                  )}
                  aria-hidden
                >
                  {number}
                </span>

                <article
                  className={cn(
                    "group overflow-hidden rounded-3xl bg-white ring-1 transition-all duration-700 lg:row-start-1",
                    right ? "lg:col-start-3" : "lg:col-start-1",
                    on
                      ? "shadow-2xl shadow-navy-900/10 ring-brand-500/30"
                      : "shadow-lg shadow-navy-900/5 ring-mist-200 lg:translate-y-6 lg:opacity-60",
                  )}
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={step.image}
                      alt={step.imageAlt}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1024px) 34vw, 90vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-navy-950/70 via-navy-950/0 to-navy-950/0" aria-hidden />
                    <span className="absolute bottom-4 left-5 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
                      Step {number}
                    </span>
                  </div>
                  <div className="p-6 sm:p-7">
                    <h3 className="text-2xl font-bold uppercase leading-tight text-navy-900 sm:text-3xl">{step.title}</h3>
                    <p className="mt-3 leading-relaxed text-navy-500">{step.text}</p>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
