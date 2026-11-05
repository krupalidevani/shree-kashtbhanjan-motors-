import type { Metadata } from "next";

import workshopTools from "@/assets/images/workshop-tools.jpg";
import { BookingCta } from "@/components/sections/BookingCta";
import { ServiceDetail } from "@/components/services/ServiceDetail";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Car Services",
  description:
    "Car servicing, engine repair, oil change, brake repair, AC service, wheel alignment, battery, denting & painting and detailing at Shree Kashtbhanjan Motors.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        breadcrumb="Services"
        eyebrow="What We Do"
        title={
          <>
            Car Services <span className="text-brand-500">Done Right</span>
          </>
        }
        description="From routine maintenance to complex repairs, explore the services we offer and book the one your car needs."
        image={workshopTools}
      />

      <nav aria-label="Service list" className="sticky top-[68px] z-30 border-b border-mist-200 bg-white/95 backdrop-blur">
        <Container>
          <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
            {services.map((service) => (
              <li key={service.slug} className="shrink-0">
                <a
                  href={`#${service.slug}`}
                  className="block rounded-full border border-mist-200 px-4 py-1.5 text-sm font-semibold text-navy-600 transition-colors hover:border-brand-500 hover:bg-brand-500 hover:text-white"
                >
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      <section className="bg-white py-20 sm:py-28">
        <Container className="space-y-24 sm:space-y-32">
          {services.map((service, index) => (
            <ServiceDetail key={service.slug} service={service} index={index} />
          ))}
        </Container>
      </section>

      <BookingCta />
    </>
  );
}
