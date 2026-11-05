import type { Metadata } from "next";

import { AboutPreview } from "@/components/sections/AboutPreview";
import { BookingCta } from "@/components/sections/BookingCta";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroReveal } from "@/components/sections/HeroReveal";
import { ServiceMarquee } from "@/components/sections/ServiceMarquee";
import { ServiceJourney } from "@/components/sections/ServiceJourney";
import { ServicesTrack } from "@/components/sections/ServicesTrack";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroReveal />
      <ServiceMarquee />
      <ServicesTrack />
      <ServiceJourney />
      <WhyChooseUs />
      <AboutPreview />
      {/* Testimonials hidden until real customer reviews are added: <Testimonials /> */}
      <BookingCta />
      <ContactSection />
    </>
  );
}
