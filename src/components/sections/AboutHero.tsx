import { ArrowDown, CalendarCheck, Wrench } from "lucide-react";
import Image from "next/image";

import janakDevani from "@/assets/images/janak-devani.jpg";
import mechanicEngineBay from "@/assets/images/mechanic-engine-bay.jpg";
import wrenchHands from "@/assets/images/wrench-hands.jpg";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { HeroBreadcrumb } from "@/components/ui/PageHero";
import { bookingHref } from "@/config/site";
import { services } from "@/data/services";

const stats = [
  { value: 10, suffix: "+", label: "Years of experience" },
  { value: services.length, suffix: "", label: "Services we offer" },
  { value: 7, suffix: "", label: "Days a week open" },
];

/** Round badge with words turning around a wrench. */
function SpinningBadge() {
  return (
    <div className="relative grid size-32 place-items-center rounded-full bg-navy-900 shadow-2xl shadow-black/40 ring-1 ring-white/10 sm:size-36">
      <svg viewBox="0 0 160 160" className="about-spin absolute inset-0 size-full" aria-hidden>
        <defs>
          <path id="about-badge-circle" d="M80 80 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0" />
        </defs>
        <text fill="#fff" fontSize="13" fontWeight={700} className="font-display uppercase">
          {/* Stretched to exactly one lap of the circle (2π × 58) */}
          <textPath href="#about-badge-circle" textLength={362} lengthAdjust="spacing">
            Honest advice • Skilled hands • Real care •
          </textPath>
        </text>
      </svg>
      <span className="grid size-14 place-items-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/40">
        <Wrench className="size-6" aria-hidden />
      </span>
    </div>
  );
}

/** About page hero: story copy and counters on the left, a moving photo collage on the right. */
export function AboutHero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 pb-20 pt-32 sm:pb-24 sm:pt-40" aria-labelledby="about-hero-heading">
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_30%_40%,black,transparent_70%)]"
        aria-hidden
      />
      <div className="hero-glow absolute -left-40 top-20 -z-10 size-[34rem] rounded-full bg-brand-500/15 blur-3xl" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1 bg-linear-to-r from-brand-500 via-brand-400 to-transparent" aria-hidden />

      <Container className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
        <div>
          <HeroBreadcrumb current="About Us" />
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-brand-400 animate-fade-up [animation-delay:100ms]">
            Who We Are
          </p>
          <h1
            id="about-hero-heading"
            className="mt-4 text-4xl font-bold uppercase leading-[1.02] text-white animate-fade-up [animation-delay:150ms] sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Driven By <span className="text-brand-500">Care</span>
            <br />
            &amp; Craft
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-100 animate-fade-up [animation-delay:250ms] sm:text-lg">
            A car garage in Varachha, Surat built on honest advice, skilled hands and a commitment to getting every job
            done right.
          </p>

          <div className="mt-8 flex flex-col gap-3 animate-fade-up [animation-delay:350ms] sm:flex-row">
            <ButtonLink href={bookingHref} size="lg">
              <CalendarCheck className="size-5" aria-hidden />
              Book a Service
            </ButtonLink>
            <ButtonLink href="#our-story" size="lg" variant="outline-light">
              Our Story
              <ArrowDown className="size-5" aria-hidden />
            </ButtonLink>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 divide-x divide-white/10 animate-fade-up [animation-delay:450ms]">
            {stats.map((stat) => (
              <div key={stat.label} className="px-4 first:pl-0">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-4xl font-bold leading-none text-white sm:text-5xl">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </dd>
                <dd className="mt-2 text-xs font-semibold uppercase leading-snug tracking-wider text-navy-200" aria-hidden>
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Photo collage */}
        <div className="relative mx-auto h-[26rem] w-full max-w-xl animate-fade-up [animation-delay:250ms] sm:h-[32rem] lg:h-[36rem]">
          <div className="absolute right-0 top-0 h-[82%] w-[80%] overflow-hidden rounded-[2rem] shadow-2xl shadow-black/40 ring-1 ring-white/10">
            <Image
              src={wrenchHands}
              alt="Mechanic's hands working with a wrench"
              fill
              preload
              placeholder="blur"
              sizes="(min-width: 1024px) 36rem, 80vw"
              className="about-kenburns object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-navy-950/60 to-transparent" aria-hidden />
          </div>

          <div className="about-float-slow absolute bottom-0 left-0 h-[44%] w-[50%] overflow-hidden rounded-3xl shadow-2xl shadow-black/50 ring-8 ring-navy-950">
            <Image
              src={mechanicEngineBay}
              alt="Mechanic checking a car's engine bay"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 18rem, 50vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -left-2 top-6 sm:-left-6">
            <SpinningBadge />
          </div>

          {/* Owner card */}
          <div className="about-float absolute bottom-6 right-2 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-2xl shadow-black/30 sm:-right-4 sm:bottom-10">
            <span className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-brand-500">
              <Image src={janakDevani} alt="" fill sizes="3rem" className="object-cover object-[60%_20%]" />
            </span>
            <span>
              <span className="block font-display text-lg font-bold uppercase leading-tight text-navy-900">Janak Devani</span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-500">Owner · 10+ yrs</span>
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
