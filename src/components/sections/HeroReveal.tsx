"use client";

import { BadgeIndianRupee, CalendarCheck, ChevronDown, ShieldCheck, Wrench } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

import carDusk from "@/assets/images/car-dusk.jpg";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { bookingHref } from "@/config/site";
import { clamp, smoothstep, useScrollProgress } from "@/lib/useScrollProgress";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";

const promises = [
  { icon: Wrench, label: "Skilled mechanics" },
  { icon: BadgeIndianRupee, label: "Transparent pricing" },
  { icon: ShieldCheck, label: "Quality parts" },
];

/**
 * Pinned hero: the car starts lit by a small circle of light in the dark, and
 * scrolling widens the light until the whole car is revealed. One image, one
 * continuous scroll-linked motion.
 */
export function HeroReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useScrollProgress(sectionRef, (progress) => {
    const reveal = smoothstep(progress);
    const stage = stageRef.current;
    if (stage) {
      // Light radius in vmax: starts around the car, ends past the screen corners.
      stage.style.setProperty("--light", `${24 + reveal * 120}vmax`);
      stage.style.setProperty("--zoom", String(1.18 - reveal * 0.18));
      stage.style.setProperty("--bright", String(0.75 + reveal * 0.35));
      stage.style.setProperty("--ring", String(1 - clamp(reveal * 1.6)));
    }
    if (hintRef.current) hintRef.current.style.opacity = String(1 - clamp(progress * 8));
  });

  return (
    <section ref={sectionRef} className="relative h-[200svh] bg-navy-950" aria-labelledby="hero-heading">
      <div
        ref={stageRef}
        className="hero-light sticky top-0 isolate h-svh overflow-hidden [--cx:50%] [--cy:37%] lg:[--cx:66%] lg:[--cy:56%]"
      >
        {/* Faint workshop grid in the dark area */}
        <div className="hero-grid absolute inset-0 -z-30" aria-hidden />

        {/* The car, shown through a widening circle of light. On phones it fills the top
            part of the screen so the text below does not cover it. */}
        <div className="hero-light-mask absolute inset-x-0 top-0 -z-20 h-[64%] [--cy:58%] lg:inset-0 lg:h-auto lg:[--cy:56%]">
          <Image
            src={carDusk}
            alt="Sports car with its headlights on at dusk"
            fill
            preload
            placeholder="blur"
            sizes="100vw"
            className="hero-light-image object-cover object-[center_60%]"
          />
        </div>
        <div className="hero-light-ring pointer-events-none absolute inset-0 -z-10" aria-hidden />

        {/* Keep text readable */}
        <div
          className="absolute inset-0 -z-10 bg-linear-to-t from-navy-950 from-40% via-navy-950/30 via-60% to-transparent lg:bg-linear-to-r lg:from-navy-950/90 lg:from-0% lg:via-navy-950/30 lg:via-50% lg:to-transparent"
          aria-hidden
        />

        <Container className="flex h-full flex-col justify-end pb-14 pt-28 lg:justify-center lg:pb-16">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-300 backdrop-blur-sm animate-fade-up">
              <span className="size-1.5 rounded-full bg-brand-400" aria-hidden />
              Car Garage &amp; Auto Services
            </p>

            <h1
              id="hero-heading"
              className="mt-6 text-5xl font-bold uppercase leading-[0.95] text-white sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
            >
              <span className="block overflow-hidden">
                <span className="block animate-[line-up_0.9s_cubic-bezier(0.22,1,0.36,1)_both]">Expert Care</span>
              </span>
              <span className="block overflow-hidden">
                <span className="block animate-[line-up_0.9s_cubic-bezier(0.22,1,0.36,1)_0.12s_both]">
                  For <span className="text-brand-500">Every Drive</span>
                </span>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100 animate-fade-up [animation-delay:250ms]">
              From routine servicing to engine repairs, washing and detailing — Shree Kashtbhanjan Motors keeps your
              car safe, smooth and road-ready. Book in minutes and confirm on WhatsApp.
            </p>

            <div className="mt-9 flex flex-col gap-4 animate-fade-up [animation-delay:350ms] sm:flex-row">
              <ButtonLink href={bookingHref} size="lg">
                <CalendarCheck className="size-5" aria-hidden />
                Book a Service
              </ButtonLink>
              <ButtonLink href={buildWhatsAppUrl(defaultWhatsAppMessage)} external variant="outline-light" size="lg">
                <WhatsAppIcon className="size-5" />
                Chat on WhatsApp
              </ButtonLink>
            </div>

            <ul className="mt-10 hidden flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-7 animate-fade-up [animation-delay:450ms] sm:flex">
              {promises.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm font-semibold text-white">
                  <span className="grid size-9 place-items-center rounded-lg bg-white/10 text-brand-400">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </Container>

        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 lg:flex"
          aria-hidden
        >
          Scroll
          <ChevronDown className="size-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
