"use client";

import { CalendarCheck, ClipboardCheck, KeyRound, Search, Sparkles, Wrench, type LucideIcon } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

import carDusk from "@/assets/images/car-dusk.jpg";
import carWash from "@/assets/images/car-wash.jpg";
import engineBelts from "@/assets/images/engine-belts.jpg";
import mechanicEngineBay from "@/assets/images/mechanic-engine-bay.jpg";
import mechanicSmiling from "@/assets/images/mechanic-smiling.jpg";
import workshopTools from "@/assets/images/workshop-tools.jpg";
import { Container } from "@/components/ui/Container";
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
    title: "Book & drop off",
    text: "Pick a slot online or on WhatsApp, then drop your car at the workshop at a time that suits you.",
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

/** Steps scroll past on one side while a pinned photo on the other follows the active step. */
export function ServiceJourney() {
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((step) => step && observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white py-20 sm:py-28" aria-labelledby="journey-heading">
      <Container>
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
            <span className="h-px w-6 bg-brand-500" aria-hidden />
            How It Works
          </p>
          <h2 id="journey-heading" className="mt-4 text-4xl font-bold uppercase leading-[1.05] text-navy-900 sm:text-5xl lg:text-6xl">
            From drop-off <span className="text-brand-500">to drive-off.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-navy-500">
            A clear path at every step — you always know what is happening with your car.
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Pinned photo (large screens) */}
          <div className="hidden lg:block">
            <div className="sticky top-28 aspect-4/5 max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-3xl bg-navy-900 shadow-2xl shadow-navy-900/20">
              {steps.map((step, index) => (
                <Image
                  key={step.title}
                  src={step.image}
                  alt={index === active ? step.imageAlt : ""}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 40vw, 0px"
                  className={cn(
                    "object-cover transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    index === active ? "scale-100 opacity-100" : "scale-110 opacity-0",
                  )}
                />
              ))}
              <div className="absolute inset-0 bg-linear-to-t from-navy-950/80 via-transparent to-transparent" aria-hidden />
              <div className="absolute inset-x-8 bottom-8 flex items-end justify-between text-white">
                <p className="font-display text-7xl font-bold leading-none tabular-nums">
                  {String(active + 1).padStart(2, "0")}
                  <span className="text-2xl text-white/50"> / {String(steps.length).padStart(2, "0")}</span>
                </p>
                <p className="max-w-40 text-right text-sm font-bold uppercase tracking-[0.2em] text-brand-300">{steps[active].title}</p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <ol className="relative lg:py-[12vh]">
            <span className="absolute bottom-0 left-6 top-0 w-px bg-navy-100" aria-hidden />
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === active;
              return (
                <li
                  key={step.title}
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                  data-index={index}
                  className="relative pb-14 pl-20 last:pb-0 lg:min-h-[38vh] lg:pb-0"
                >
                  <span
                    className={cn(
                      "absolute left-0 top-0 grid size-12 place-items-center rounded-2xl transition-all duration-500",
                      isActive
                        ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                        : "bg-navy-50 text-navy-400 ring-4 ring-white",
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">Step {String(index + 1).padStart(2, "0")}</p>
                  <h3
                    className={cn(
                      "mt-2 text-3xl font-bold uppercase transition-colors duration-500 sm:text-4xl",
                      isActive ? "text-navy-900" : "text-navy-200 max-lg:text-navy-900",
                    )}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-3 max-w-md text-lg leading-relaxed transition-colors duration-500",
                      isActive ? "text-navy-500" : "text-navy-300 max-lg:text-navy-500",
                    )}
                  >
                    {step.text}
                  </p>
                  <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl lg:hidden">
                    <Image src={step.image} alt={step.imageAlt} fill placeholder="blur" sizes="(min-width: 640px) 80vw, 90vw" className="object-cover" />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
