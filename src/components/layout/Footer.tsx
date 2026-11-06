import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { ContactValue } from "@/components/contact/ContactValue";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { bookingHref, navLinks, siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-navy-200">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand-500/60 to-transparent" aria-hidden />

      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:py-20 xl:grid-cols-12">
        <div className="xl:col-span-3">
          <Logo />
          <p className="mt-6 max-w-sm leading-relaxed">
            Reliable car repair, servicing and maintenance — with easy booking on WhatsApp.
          </p>
          <a
            href={buildWhatsAppUrl(defaultWhatsAppMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-[#25D366] hover:bg-[#25D366]"
          >
            <WhatsAppIcon className="size-4" />
            Chat on WhatsApp
          </a>
        </div>

        <div className="xl:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Quick Links</h3>
          <ul className="mt-5 space-y-3">
            {[...navLinks, { href: bookingHref, label: "Book a Service" }].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-brand-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="xl:col-span-3">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Services</h3>
          <ul className="mt-5 space-y-3">
            {services.slice(0, 6).map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services#${service.slug}`}
                  className="group inline-flex items-center gap-2 transition-colors hover:text-brand-400"
                >
                  <ArrowRight className="size-3.5 text-brand-500 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="xl:col-span-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Get in Touch</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
              <ContactValue kind="phone" />
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
              <ContactValue kind="email" />
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
              <ContactValue kind="address" />
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
              <ContactValue kind="hours" />
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-sm sm:flex-row">
          <p>&copy; {siteConfig.name}. All rights reserved.</p>
          <p className="text-navy-400">Car repair · Servicing · Maintenance</p>
        </Container>
        <Container className="pb-6 text-center text-xs text-navy-500 sm:text-left">
          3D car: “
          <a
            href="https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:text-navy-300 hover:underline"
          >
            Car Concept
          </a>
          ” by Eric Chadwick, Darmstadt Graphics Group,{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:text-navy-300 hover:underline"
          >
            CC BY 4.0
          </a>
          , modified.
        </Container>
      </div>
    </footer>
  );
}
