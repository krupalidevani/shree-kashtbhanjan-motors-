import { ContactDetails } from "@/components/contact/ContactDetails";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ContactSection() {
  return (
    <section className="bg-mist-50 py-20 sm:py-28" aria-labelledby="contact-heading">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Contact & Location"
            title={<span id="contact-heading">Visit Or Reach Out Today</span>}
            description="Have a question about your car or want to book a visit? Message us on WhatsApp or drop by the garage."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <Reveal>
            <ContactDetails />
          </Reveal>
          <Reveal delay={150} className="h-full">
            <MapEmbed className="h-full min-h-96" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
