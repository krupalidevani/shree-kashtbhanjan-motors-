"use client";

import { ArrowRight, ArrowUpRight, CalendarCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { bookingHref } from "@/config/site";
import { services } from "@/data/services";
import { clamp, useScrollProgress } from "@/lib/useScrollProgress";
import { cn } from "@/lib/utils";

const numberWords = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
const countWord = numberWords[services.length] ?? String(services.length);
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Services as a row of large cards. On large screens the section pins while
 * vertical scrolling slides the row sideways; the card nearest the centre is
 * highlighted, a counter and progress bar follow along, and a large outlined
 * word drifts the other way behind. On smaller screens it is a swipeable row.
 */
export function ServicesTrack() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const wordRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);

  // Measure how far the row must travel; 0 disables pinning (small screens, reduced motion).
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const measure = () => {
      const track = trackRef.current;
      if (!track || !desktop.matches) {
        if (track) track.style.transform = "";
        setDistance(0);
        return;
      }
      setDistance(Math.max(track.scrollWidth - window.innerWidth, 0));
    };
    measure();
    // Pinning changes the row's padding, so measure again whenever its size changes.
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current, { box: "border-box" });
    window.addEventListener("resize", measure);
    desktop.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      desktop.removeEventListener("change", measure);
    };
  }, []);

  /**
   * Scale and dim cards by their distance from a focus point, and track the nearest one.
   * The focus point moves from left to right with progress, so the first and last cards
   * each get their turn even though they never reach the middle of the screen.
   */
  const highlight = (progress: number) => {
    const track = trackRef.current;
    if (!track) return;
    const centre = window.innerWidth * (0.25 + 0.5 * progress);
    let nearest = 0;
    let best = Infinity;
    Array.from(track.children).forEach((child, index) => {
      const card = child as HTMLElement;
      const box = card.getBoundingClientRect();
      const offset = Math.abs(box.left + box.width / 2 - centre);
      if (offset < best) {
        best = offset;
        nearest = index;
      }
      if (distance) {
        const t = clamp(offset / (window.innerWidth * 0.55));
        card.style.transform = `scale(${1 - t * 0.08})`;
        card.style.opacity = String(1 - t * 0.2);
      } else {
        card.style.transform = "";
        card.style.opacity = "";
      }
    });
    setActive(nearest);
  };

  useScrollProgress(sectionRef, (progress) => {
    if (distance && trackRef.current) trackRef.current.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
    if (wordRef.current) wordRef.current.style.transform = `translate3d(${(progress - 0.5) * 30}vw, 0, 0)`;
    if (barRef.current && distance) barRef.current.style.transform = `scaleX(${0.08 + progress * 0.92})`;
    highlight(progress);
  });

  // The swipeable row (small screens) updates the counter and bar as it is swiped.
  const onSwipe = () => {
    const track = trackRef.current;
    if (!track || distance) return;
    const max = track.scrollWidth - track.clientWidth;
    const ratio = max > 0 ? track.scrollLeft / max : 0;
    if (barRef.current) barRef.current.style.transform = `scaleX(${0.08 + ratio * 0.92})`;
    highlight(ratio);
  };

  const pinned = distance > 0;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-x-clip bg-mist-50"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
      aria-labelledby="services-heading"
    >
      <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : "relative overflow-hidden py-20 sm:py-28"}>
        {/* Large outlined word drifting behind the cards */}
        <p
          ref={wordRef}
          className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[22vw] font-bold uppercase leading-none text-transparent [-webkit-text-stroke:2px_rgb(14_25_47/0.06)] lg:text-[16vw]"
          aria-hidden
        >
          Our Services
        </p>

        <Container className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
              <span className="h-px w-6 bg-brand-500" aria-hidden />
              Our Services
            </p>
            <h2 id="services-heading" className="mt-4 text-4xl font-bold uppercase leading-[1.05] text-navy-900 sm:text-5xl lg:text-6xl">
              {countWord} ways <span className="text-brand-500">we care.</span>
            </h2>
          </div>
          <div className="flex w-full items-center gap-5 sm:w-auto">
            {/* Counter and progress */}
            <div className="flex flex-1 items-center gap-3 sm:flex-none" aria-hidden>
              <span className="font-display text-2xl font-bold tabular-nums text-navy-900">{pad(active + 1)}</span>
              <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-mist-200 sm:w-32 sm:flex-none">
                <span ref={barRef} className="absolute inset-0 origin-left rounded-full bg-brand-500" style={{ transform: "scaleX(0.08)" }} />
              </span>
              <span className="font-display text-2xl font-bold tabular-nums text-navy-300">{pad(services.length)}</span>
            </div>
            <div className="hidden sm:block">
              <ButtonLink href="/services" variant="outline-dark">
                View all services
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </Container>

        <ul
          ref={trackRef}
          onScroll={onSwipe}
          className={
            pinned
              ? "relative mt-12 flex w-max gap-6 px-[max(2rem,calc((100vw-80rem)/2+2rem))] will-change-transform"
              : "no-scrollbar relative mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-6 sm:scroll-px-6 sm:px-6 lg:scroll-px-8 lg:px-8"
          }
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            const isActive = index === active;
            return (
              <li
                key={service.slug}
                className="w-[82vw] shrink-0 snap-start transition-[transform,opacity] duration-300 ease-out sm:w-96 lg:w-[26rem]"
              >
                <article
                  className={cn(
                    "group relative flex h-[27rem] flex-col justify-end overflow-hidden rounded-3xl bg-navy-900 p-7 text-white shadow-xl transition-shadow duration-500 lg:h-[31rem]",
                    isActive ? "shadow-2xl shadow-navy-900/25" : "shadow-navy-900/10",
                  )}
                >
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1024px) 26rem, (min-width: 640px) 24rem, 82vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-navy-700 via-navy-900 to-navy-950" aria-hidden>
                      <Icon className="absolute -right-6 -top-6 size-56 text-white/5" strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-navy-950 via-navy-950/55 to-navy-950/5" aria-hidden />
                  <div
                    className="absolute inset-0 bg-linear-to-t from-brand-600/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden
                  />

                  {/* Top row: number badge and arrow */}
                  <div className="absolute inset-x-6 top-6 flex items-center justify-between">
                    <span className="rounded-full border border-white/25 bg-navy-950/40 px-3.5 py-1 font-display text-lg font-bold tracking-wider text-white backdrop-blur-sm">
                      <span className="text-brand-400">{pad(index + 1)}</span>
                      <span className="text-white/50"> / {pad(services.length)}</span>
                    </span>
                    <span className="grid size-11 place-items-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:rotate-45 group-hover:bg-brand-500">
                      <ArrowUpRight className="size-5" aria-hidden />
                    </span>
                  </div>

                  <div className="relative">
                    <span className="grid size-12 place-items-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/30 transition-transform duration-500 group-hover:-translate-y-1">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <h3 className="mt-5 text-2xl font-bold uppercase leading-tight">
                      {/* The whole card links to the service details */}
                      <Link href={`/services#${service.slug}`} className="after:absolute after:inset-0 after:content-['']">
                        {service.title}
                      </Link>
                    </h3>
                    <p className="mt-2 leading-relaxed text-navy-100">{service.summary}</p>

                    {/* Book button: always shown on touch screens, slides up on hover elsewhere */}
                    <div className="grid transition-all duration-500 lg:grid-rows-[0fr] lg:opacity-0 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100 lg:group-focus-within:grid-rows-[1fr] lg:group-focus-within:opacity-100">
                      <div className="min-h-0 overflow-hidden">
                        <Link
                          href={`${bookingHref}?service=${service.slug}`}
                          className="relative z-10 mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-navy-900 transition-colors hover:bg-brand-500 hover:text-white"
                        >
                          <CalendarCheck className="size-4" aria-hidden />
                          Book this service
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Orange line that grows on hover */}
                  <span
                    className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brand-500 transition-transform duration-500 group-hover:scale-x-100"
                    aria-hidden
                  />
                </article>
              </li>
            );
          })}
        </ul>

        <Container className="relative mt-6 sm:hidden">
          <ButtonLink href="/services" variant="outline-dark" className="w-full">
            View all services
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </Container>
      </div>
    </section>
  );
}
