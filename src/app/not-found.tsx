import { ArrowLeft, Wrench } from "lucide-react";
import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-navy-950 pb-20 pt-36">
      <Container className="text-center">
        <span className="mx-auto grid size-20 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
          <Wrench className="size-9" aria-hidden />
        </span>
        <p className="mt-8 font-display text-7xl font-bold text-brand-500 sm:text-8xl">404</p>
        <h1 className="mt-4 text-3xl font-bold uppercase text-white sm:text-4xl">This page has broken down</h1>
        <p className="mx-auto mt-4 max-w-md text-navy-200">
          The page you are looking for does not exist or may have been moved.
        </p>
        <ButtonLink href="/" size="lg" className="mt-10">
          <ArrowLeft className="size-4" aria-hidden />
          Back to home
        </ButtonLink>
      </Container>
    </section>
  );
}
