"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { services } from "@/data/services";
import { useScrollProgress } from "@/lib/useScrollProgress";

const numberWords = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
const countWord = numberWords[services.length] ?? String(services.length);

/**
 * Services as a row of large cards. On large screens the section pins while
 * vertical scrolling slides the row sideways; on smaller screens it is a swipeable row.
 */
export function ServicesTrack() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [distance, setDistance] = useState(0);

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

  useScrollProgress(sectionRef, (progress) => {
    if (distance && trackRef.current) trackRef.current.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
  });

  const pinned = distance > 0;

  return (
    <section
      ref={sectionRef}
      className="relative bg-mist-50"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
      aria-labelledby="services-heading"
    >
      <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : "py-20 sm:py-28"}>
        <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
              <span className="h-px w-6 bg-brand-500" aria-hidden />
              Our Services
            </p>
            <h2 id="services-heading" className="mt-4 text-4xl font-bold uppercase leading-[1.05] text-navy-900 sm:text-5xl lg:text-6xl">
              {countWord} ways <span className="text-brand-500">we care.</span>
            </h2>
          </div>
          <ButtonLink href="/services" variant="outline-dark">
            View all services
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </Container>

        <ul
          ref={trackRef}
          className={
            pinned
              ? "mt-12 flex w-max gap-6 px-[max(2rem,calc((100vw-80rem)/2+2rem))] will-change-transform"
              : "no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-4 sm:scroll-px-6 sm:px-6 lg:scroll-px-8 lg:px-8"
          }
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <li key={service.slug} className="w-[80vw] shrink-0 snap-start sm:w-96 lg:w-[26rem]">
                <Link
                  href={`/services#${service.slug}`}
                  className="group relative flex h-[26rem] flex-col justify-end overflow-hidden rounded-3xl bg-navy-900 p-7 text-white shadow-xl shadow-navy-900/10 lg:h-[30rem]"
                >
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1024px) 26rem, (min-width: 640px) 24rem, 80vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-navy-700 via-navy-900 to-navy-950" aria-hidden>
                      <Icon className="absolute -right-6 -top-6 size-56 text-white/5" strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-navy-950 via-navy-950/60 to-navy-950/0" aria-hidden />

                  <span className="absolute left-7 top-6 font-display text-6xl font-bold text-white/15 tabular-nums" aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute right-6 top-6 grid size-11 place-items-center rounded-full bg-white/10 backdrop-blur-sm transition-colors duration-300 group-hover:bg-brand-500">
                    <ArrowUpRight className="size-5" aria-hidden />
                  </span>

                  <div className="relative">
                    <span className="grid size-12 place-items-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <h3 className="mt-5 text-2xl font-bold uppercase leading-tight">{service.title}</h3>
                    <p className="mt-2 leading-relaxed text-navy-100">{service.summary}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
