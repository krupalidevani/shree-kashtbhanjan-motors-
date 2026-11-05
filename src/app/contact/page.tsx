import type { Metadata } from "next";

import mechanicEngineBay from "@/assets/images/mechanic-engine-bay.jpg";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Shree Kashtbhanjan Motors. Message us on WhatsApp, call, or visit the garage for car servicing and repairs.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        breadcrumb="Contact Us"
        eyebrow="Get In Touch"
        title={
          <>
            We&apos;re Here To <span className="text-brand-500">Help</span>
          </>
        }
        description="Questions about your car, a quote or a booking? Reach out on WhatsApp or send us a message below."
        image={mechanicEngineBay}
      />

      <section className="bg-mist-50 py-16 sm:py-24">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-10">
          <Reveal>
            <ContactDetails />
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-navy-900/5 ring-1 ring-mist-200 sm:p-10">
              <h2 className="text-3xl font-bold uppercase text-navy-900 sm:text-4xl">Send Us A Message</h2>
              <p className="mt-2 text-navy-500">We usually reply on WhatsApp as soon as possible.</p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24" aria-labelledby="location-heading">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Our Location" title={<span id="location-heading">Find The Garage</span>} />
          </Reveal>
          <Reveal delay={100}>
            <MapEmbed className="mt-12 aspect-[4/3] sm:aspect-[21/9]" />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
