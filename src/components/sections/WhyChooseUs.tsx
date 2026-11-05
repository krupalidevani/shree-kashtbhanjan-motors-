import Image from "next/image";

import workshopTools from "@/assets/images/workshop-tools.jpg";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { highlights } from "@/data/highlights";

export function WhyChooseUs() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 py-20 sm:py-28" aria-labelledby="why-heading">
      <Image src={workshopTools} alt="" fill placeholder="blur" sizes="100vw" className="-z-20 object-cover opacity-15" />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-navy-950 via-navy-950/90 to-navy-950" aria-hidden />

      <Container>
        <Reveal>
          <SectionHeading
            tone="dark"
            eyebrow="Why Choose Us"
            title={<span id="why-heading">Service You Can Trust</span>}
            description="We look after your car the way we would look after our own — with honesty, skill and care at every step."
          />
        </Reveal>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map(({ title, description, icon: Icon }, index) => (
            <li key={title} className="bg-navy-950">
              <Reveal delay={(index % 3) * 100} className="h-full">
                <div className="group h-full p-8 transition-colors duration-500 hover:bg-navy-900 sm:p-10">
                  <span className="grid size-14 place-items-center rounded-2xl border border-brand-500/30 bg-brand-500/10 text-brand-400 transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-6 text-2xl font-bold uppercase text-white">{title}</h3>
                  <p className="mt-3 leading-relaxed text-navy-200">{description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
