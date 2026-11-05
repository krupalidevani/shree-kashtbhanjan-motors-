import { CalendarCheck, CircleCheck } from "lucide-react";
import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { bookingHref } from "@/config/site";
import type { Service } from "@/data/services";
import { cn } from "@/lib/utils";

/** Full service description row used on the Services page; alternates image side. */
export function ServiceDetail({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  const reversed = index % 2 === 1;

  return (
    <article id={service.slug} className="scroll-mt-40" aria-labelledby={`${service.slug}-title`}>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className={cn(reversed && "lg:order-2")}>
          <div className="relative aspect-[16/11] overflow-hidden rounded-3xl bg-navy-900 shadow-xl shadow-navy-900/10">
            {service.image ? (
              <Image
                src={service.image}
                alt={`${service.title} at Shree Kashtbhanjan Motors`}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-navy-800 via-navy-900 to-navy-950">
                <div className="absolute -right-16 -top-16 size-64 rounded-full bg-brand-500/20 blur-3xl" aria-hidden />
                <Icon className="size-28 text-brand-500/90" strokeWidth={1.25} aria-hidden />
              </div>
            )}
            <span className="absolute left-5 top-5 rounded-full bg-navy-950/80 px-3 py-1 font-display text-sm font-bold tracking-wider text-white backdrop-blur">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </Reveal>

        <Reveal delay={100} className={cn(reversed && "lg:order-1")}>
          <span className="grid size-14 place-items-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
            <Icon className="size-6" aria-hidden />
          </span>
          <h2 id={`${service.slug}-title`} className="mt-6 text-3xl font-bold uppercase text-navy-900 sm:text-4xl">
            {service.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-navy-500">{service.description}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {service.includes.map((item) => (
              <li key={item} className="flex items-center gap-2.5 font-medium text-navy-700">
                <CircleCheck className="size-5 shrink-0 text-brand-500" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <ButtonLink href={`${bookingHref}?service=${service.slug}`} className="mt-8">
            <CalendarCheck className="size-4" aria-hidden />
            Book this service
          </ButtonLink>
        </Reveal>
      </div>
    </article>
  );
}
