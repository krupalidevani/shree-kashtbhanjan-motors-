import { Info, Quote, UserRound } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials, testimonialsAreSamples } from "@/data/testimonials";

export function Testimonials() {
  return (
    <section className="bg-mist-50 py-20 sm:py-28" aria-labelledby="testimonials-heading">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Testimonials"
            title={<span id="testimonials-heading">What Our Customers Say</span>}
          />
          {testimonialsAreSamples && (
            <p className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full border border-dashed border-brand-400 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
              <Info className="size-4 shrink-0" aria-hidden />
              Sample testimonials shown — real customer reviews will be added soon.
            </p>
          )}
        </Reveal>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <li key={index}>
              <Reveal delay={index * 100} className="h-full">
                <figure className="relative flex h-full flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-mist-200 transition-shadow duration-500 hover:shadow-xl hover:shadow-navy-900/5">
                  {testimonialsAreSamples && (
                    <span className="absolute right-6 top-6 rounded-full bg-mist-100 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-navy-400">
                      Sample
                    </span>
                  )}
                  <Quote className="size-10 fill-brand-500 text-brand-500" aria-hidden />
                  <blockquote className="mt-6 flex-1 leading-relaxed text-navy-600">
                    <p>{testimonial.quote}</p>
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4 border-t border-mist-200 pt-6">
                    <span className="grid size-12 place-items-center rounded-full bg-navy-900 text-brand-400">
                      <UserRound className="size-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block font-bold text-navy-900">{testimonial.name}</span>
                      <span className="block text-sm text-navy-400">{testimonial.detail}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
