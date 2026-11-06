"use client";

import { BadgeIndianRupee, CalendarCheck, ChevronDown, ShieldCheck, Wrench } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import carDusk from "@/assets/images/car-dusk.jpg";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { bookingHref } from "@/config/site";
import { clamp, useScrollProgress } from "@/lib/useScrollProgress";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// three.js only runs in the browser, and is loaded in its own bundle.
const CarScene = dynamic(() => import("@/components/hero/CarScene"), { ssr: false });

const promises = [
  { icon: Wrench, label: "Skilled mechanics" },
  { icon: BadgeIndianRupee, label: "Transparent pricing" },
  { icon: ShieldCheck, label: "Quality parts" },
];

/** Where the still view sits on the camera path when motion is reduced (the whole car). */
const STILL_PROGRESS = 0.7;

/**
 * Pinned 3D hero. Scrolling moves the camera from the glowing headlights in the
 * dark, over the bonnet, back to half and then the whole car, which finally
 * turns a full circle. Falls back to a photo if WebGL is not available.
 */
export function HeroCar() {
  const sectionRef = useRef<HTMLElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [still, setStill] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setStill(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useScrollProgress(sectionRef, (progress) => {
    progressRef.current = still ? STILL_PROGRESS : progress;
    if (hintRef.current) hintRef.current.style.opacity = String(1 - clamp(progress * 10));
  });

  useEffect(() => {
    if (still) progressRef.current = STILL_PROGRESS;
  }, [still]);

  const onReady = useCallback(() => setStatus("ready"), []);
  const onError = useCallback(() => setStatus("error"), []);

  return (
    <section
      ref={sectionRef}
      className={cn("relative bg-navy-950", still ? "h-svh" : "h-[420svh]")}
      aria-labelledby="hero-heading"
    >
      <div className="sticky top-0 isolate h-svh overflow-hidden">
        {/* 3D car, or the photo if 3D is not possible */}
        <div className="absolute inset-0 -z-20">
          {status === "error" ? (
            <Image
              src={carDusk}
              alt="Sports car with its headlights on at dusk"
              fill
              preload
              placeholder="blur"
              sizes="100vw"
              className="object-cover object-[center_60%] lg:object-[70%_60%]"
            />
          ) : (
            <>
              <div className={cn("absolute inset-0 transition-opacity duration-1000", status === "ready" ? "opacity-100" : "opacity-0")}>
                <CarScene progressRef={progressRef} onReady={onReady} onError={onError} />
              </div>
              {/* While the model loads: two headlights glowing in the dark */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 transition-opacity duration-700",
                  status === "ready" ? "opacity-0" : "opacity-100",
                )}
                aria-hidden
              >
                <div className="absolute left-1/2 top-[30%] flex -translate-x-1/2 gap-24 lg:left-[67%] lg:top-1/2 lg:-translate-y-1/2 lg:gap-40">
                  <span className="size-16 animate-pulse rounded-full bg-[radial-gradient(circle,rgb(219_231_255/0.9),rgb(219_231_255/0)_70%)]" />
                  <span className="size-16 animate-pulse rounded-full bg-[radial-gradient(circle,rgb(219_231_255/0.9),rgb(219_231_255/0)_70%)]" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Keep text readable */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-navy-950 from-30% via-navy-950/40 via-55% to-transparent lg:bg-linear-to-r lg:from-navy-950/85 lg:from-0% lg:via-navy-950/20 lg:via-45% lg:to-transparent"
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

        {!still && (
          <div
            ref={hintRef}
            className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 rounded-full bg-navy-950/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white ring-1 ring-white/15 backdrop-blur-sm lg:flex"
            aria-hidden
          >
            Scroll
            <ChevronDown className="size-4 animate-bounce" />
          </div>
        )}
      </div>
    </section>
  );
}
