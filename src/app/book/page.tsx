import { CalendarCheck, Clock, MessageCircle, Phone, Send } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import carDusk from "@/assets/images/car-dusk.jpg";
import { BookingForm } from "@/components/booking/BookingForm";
import { BookingFormFromParams } from "@/components/booking/BookingFormFromParams";
import { ContactValue } from "@/components/contact/ContactValue";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Book a Car Service",
  description:
    "Book your car service at Shree Kashtbhanjan Motors. Choose a service and preferred date, then confirm your booking instantly on WhatsApp.",
  alternates: { canonical: "/book" },
};

const steps = [
  { icon: CalendarCheck, title: "Fill in the form", text: "Tell us about you, your car and the service you need." },
  { icon: Send, title: "Send on WhatsApp", text: "WhatsApp opens with your booking details pre-filled." },
  { icon: MessageCircle, title: "Get confirmation", text: "We reply on WhatsApp to confirm your slot." },
];

export default function BookPage() {
  return (
    <>
      <PageHero
        breadcrumb="Book a Service"
        eyebrow="Online Booking"
        title={
          <>
            Book Your <span className="text-brand-500">Car Service</span>
          </>
        }
        description="Choose a service and a date that suits you. It takes less than a minute and your request is sent straight to us on WhatsApp."
        image={carDusk}
      />

      <section className="bg-mist-50 py-16 sm:py-24">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10">
          <Reveal>
            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-navy-900/5 ring-1 ring-mist-200 sm:p-10">
              <h2 className="text-3xl font-bold uppercase text-navy-900 sm:text-4xl">Service Booking</h2>
              <p className="mt-2 text-navy-500">
                Fields marked <span className="font-semibold text-brand-500">*</span> are required.
              </p>
              <div className="mt-8">
                <Suspense fallback={<BookingForm />}>
                  <BookingFormFromParams />
                </Suspense>
              </div>
            </div>
          </Reveal>

          <aside className="space-y-6" aria-label="Booking information">
            <Reveal delay={100}>
              <div className="rounded-3xl bg-navy-950 p-8 text-white">
                <h2 className="text-2xl font-bold uppercase">How Booking Works</h2>
                <ol className="mt-6 space-y-6">
                  {steps.map(({ icon: Icon, title, text }, index) => (
                    <li key={title} className="flex gap-4">
                      <span className="relative grid size-12 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-400">
                        <Icon className="size-5" aria-hidden />
                        <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-brand-500 text-[0.65rem] font-bold text-white">
                          {index + 1}
                        </span>
                      </span>
                      <div>
                        <p className="font-bold">{title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-navy-200">{text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="rounded-3xl bg-white p-8 ring-1 ring-mist-200">
                <h2 className="text-2xl font-bold uppercase text-navy-900">Prefer To Talk?</h2>
                <ul className="mt-5 space-y-4 text-sm">
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
                    <span className="font-semibold text-navy-800">
                      <ContactValue kind="phone" />
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Clock className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
                    <span className="font-semibold text-navy-800">
                      <ContactValue kind="hours" />
                    </span>
                  </li>
                </ul>
                <ButtonLink
                  href={buildWhatsAppUrl(defaultWhatsAppMessage)}
                  external
                  variant="whatsapp"
                  className="mt-6 w-full"
                >
                  <WhatsAppIcon className="size-4" />
                  Chat on WhatsApp
                </ButtonLink>
              </div>
            </Reveal>
          </aside>
        </Container>
      </section>
    </>
  );
}
