import { ArrowRight, CircleCheck } from "lucide-react";
import Image from "next/image";

import mechanicSmiling from "@/assets/images/mechanic-smiling.jpg";
import wrenchHands from "@/assets/images/wrench-hands.jpg";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const points = [
  "Careful inspection before any work begins",
  "Clear explanation of every repair and cost",
  "Regular updates while your car is with us",
  "Easy booking and follow-up on WhatsApp",
];

export function AboutPreview() {
  return (
    <section className="overflow-hidden bg-white py-20 sm:py-28" aria-labelledby="about-heading">
      <Container className="grid items-center gap-16 lg:grid-cols-2">
        <Reveal className="relative pb-16 pr-10 sm:pb-20 sm:pr-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-navy-900/20">
            <Image
              src={mechanicSmiling}
              alt="Mechanic working on a car with the bonnet open"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 aspect-square w-1/2 overflow-hidden rounded-3xl border-8 border-white shadow-2xl shadow-navy-900/20">
            <Image
              src={wrenchHands}
              alt="Close-up of a mechanic's hands tightening a part in the engine bay"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 22vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -left-4 top-8 -z-10 size-32 rounded-3xl bg-brand-500/15 sm:-left-8" aria-hidden />
        </Reveal>

        <Reveal delay={150}>
          <SectionHeading
            align="left"
            eyebrow="About The Garage"
            title={
              <span id="about-heading">
                Built On <span className="text-brand-500">Trust</span> &amp; Workmanship
              </span>
            }
            description="Shree Kashtbhanjan Motors is a car garage dedicated to keeping local drivers on the road. We combine practical mechanical know-how with an honest, customer-first approach — so you always know what your car needs and why."
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {points.map((point) => (
              <li key={point} className="flex gap-3 text-navy-700">
                <CircleCheck className="mt-0.5 size-5 shrink-0 text-brand-500" aria-hidden />
                <span className="font-medium">{point}</span>
              </li>
            ))}
          </ul>
          <ButtonLink href="/about" variant="dark" size="lg" className="mt-10">
            More about us
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
