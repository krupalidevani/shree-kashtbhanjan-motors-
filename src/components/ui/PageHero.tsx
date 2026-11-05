import { ChevronRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "./Container";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  image: StaticImageData;
  breadcrumb: string;
};

/** Compact hero banner used at the top of inner pages. */
export function PageHero({ eyebrow, title, description, image, breadcrumb }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 pb-20 pt-36 sm:pb-24 sm:pt-44">
      <Image src={image} alt="" fill preload placeholder="blur" sizes="100vw" className="-z-20 object-cover opacity-40" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950 via-navy-950/85 to-navy-950/40" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1 bg-linear-to-r from-brand-500 via-brand-400 to-transparent" aria-hidden />

      <Container>
        <nav aria-label="Breadcrumb" className="animate-fade-up">
          <ol className="flex items-center gap-1.5 text-sm text-navy-200">
            <li>
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-4" />
            </li>
            <li aria-current="page" className="font-medium text-brand-400">
              {breadcrumb}
            </li>
          </ol>
        </nav>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-brand-400 animate-fade-up [animation-delay:100ms]">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold uppercase leading-[1.02] text-white animate-fade-up [animation-delay:150ms] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-navy-100 animate-fade-up [animation-delay:250ms] sm:text-lg">
          {description}
        </p>
      </Container>
    </section>
  );
}
