import { CalendarCheck } from "lucide-react";
import Image from "next/image";

import carDusk from "@/assets/images/car-dusk.jpg";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { bookingHref } from "@/config/site";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";

export function BookingCta() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl bg-navy-900 px-6 py-14 sm:px-12 sm:py-16 lg:px-16">
            <Image
              src={carDusk}
              alt=""
              fill
              placeholder="blur"
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="-z-20 object-cover object-[center_60%] opacity-50"
            />
            <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950 via-navy-950/90 to-navy-950/30" aria-hidden />
            <div className="absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-brand-500/20 blur-3xl" aria-hidden />

            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold uppercase leading-tight text-white sm:text-4xl lg:text-5xl">
                Is Your Car Due For A <span className="text-brand-500">Service?</span>
              </h2>
              <p className="mt-4 text-lg text-navy-100">
                Pick a service and a date that suits you. Your booking request opens in WhatsApp, ready to send.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <ButtonLink href={bookingHref} size="lg">
                  <CalendarCheck className="size-5" aria-hidden />
                  Book a Service
                </ButtonLink>
                <ButtonLink href={buildWhatsAppUrl(defaultWhatsAppMessage)} external variant="whatsapp" size="lg">
                  <WhatsAppIcon className="size-5" />
                  WhatsApp Us
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
