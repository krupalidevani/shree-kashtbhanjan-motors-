import { Eye, HeartHandshake, Target } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import janakDevani from "@/assets/images/janak-devani.jpg";
import wrenchHands from "@/assets/images/wrench-hands.jpg";
import { BookingCta } from "@/components/sections/BookingCta";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Shree Kashtbhanjan Motors — a car garage built on honest advice, skilled workmanship and customer-first service.",
  alternates: { canonical: "/about" },
};

const pillars = [
  {
    icon: Target,
    title: "Our Mission",
    text: "To keep every car we service safe, reliable and efficient, through honest advice and careful workmanship.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    text: "To be the garage local car owners trust first — known for quality work and straightforward service.",
  },
  {
    icon: HeartHandshake,
    title: "Our Values",
    text: "Honesty, accountability and respect for our customers' time, money and vehicles in everything we do.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb="About Us"
        eyebrow="Who We Are"
        title={
          <>
            Driven By <span className="text-brand-500">Care</span> &amp; Craft
          </>
        }
        description="A car garage built on honest advice, skilled hands and a commitment to getting every job done right."
        image={wrenchHands}
      />

      <section className="overflow-hidden bg-white py-20 sm:py-28" aria-labelledby="story-heading">
        <Container className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Our Story"
              title={<span id="story-heading">More Than Just A Garage</span>}
            />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-navy-500">
              <p>
                At Shree Kashtbhanjan Motors, we believe car care should be simple, honest and dependable. Whether it is
                a routine service or an unexpected breakdown, our goal is to get you back on the road with confidence.
              </p>
              <p>
                We take the time to understand the problem, explain the options clearly and carry out the work with
                attention to detail — treating every car as if it were our own.
              </p>
              <p>
                The garage is run by <strong className="font-semibold text-navy-900">Janak Devani</strong>, who brings
                over 10 years of hands-on experience in car repair and servicing. Every job at the workshop in Varachha,
                Surat is done under his eye — with the same care and honesty he would want for his own car.
              </p>
            </div>
          </Reveal>

          <Reveal delay={150} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <figure className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-navy-900/20">
              <Image
                src={janakDevani}
                alt="Janak Devani, owner of Shree Kashtbhanjan Motors"
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 45vw, 28rem"
                className="object-cover object-[60%_center]"
              />
              <figcaption className="absolute left-4 top-4 rounded-xl bg-navy-950/70 px-4 py-2.5 text-white backdrop-blur-sm">
                <span className="block font-display text-lg font-bold uppercase leading-tight">Janak Devani</span>
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-brand-400">Owner</span>
              </figcaption>
            </figure>
            <div className="absolute -bottom-6 -left-4 max-w-64 rounded-2xl bg-brand-500 p-6 text-white shadow-2xl shadow-brand-500/30 sm:-left-8">
              <p className="font-display text-5xl font-bold leading-none">10+</p>
              <p className="mt-2 font-display text-xl font-bold uppercase leading-tight">Years of hands-on experience</p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-mist-50 py-20 sm:py-28" aria-label="Mission, vision and values">
        <Container>
          <ul className="grid gap-6 md:grid-cols-3">
            {pillars.map(({ icon: Icon, title, text }, index) => (
              <li key={title}>
                <Reveal delay={index * 100} className="h-full">
                  <div className="group h-full rounded-2xl bg-white p-8 ring-1 ring-mist-200 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/5">
                    <span className="grid size-14 place-items-center rounded-2xl bg-navy-900 text-brand-400 transition-colors duration-500 group-hover:bg-brand-500 group-hover:text-white">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <h2 className="mt-6 text-2xl font-bold uppercase text-navy-900">{title}</h2>
                    <p className="mt-3 leading-relaxed text-navy-500">{text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <WhyChooseUs />
      <ProcessSteps />
      <BookingCta />
    </>
  );
}
