import { CheckCheck, Clock, MapPin, Navigation, Phone } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import logo from "@/assets/images/logo.png";
import { Container } from "@/components/ui/Container";
import { HeroBreadcrumb } from "@/components/ui/PageHero";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";

const { phones, hours, mapDirectionsUrl } = siteConfig.contact;
const mainPhone = phones?.[0];
const openHours = hours?.[0];

type Action = {
  href: string;
  icon: ReactNode;
  title: string;
  detail: string;
  external?: boolean;
  accent: string;
};

const actions: Action[] = [
  {
    href: buildWhatsAppUrl(defaultWhatsAppMessage),
    icon: <WhatsAppIcon className="size-5" />,
    title: "WhatsApp",
    detail: "Chat with us",
    external: true,
    accent: "bg-[#25D366] shadow-[#25D366]/30",
  },
  ...(mainPhone
    ? [
        {
          href: `tel:${mainPhone.replace(/\s/g, "")}`,
          icon: <Phone className="size-5" aria-hidden />,
          title: "Call us",
          detail: mainPhone,
          accent: "bg-brand-500 shadow-brand-500/30",
        },
      ]
    : []),
  ...(mapDirectionsUrl
    ? [
        {
          href: mapDirectionsUrl,
          icon: <Navigation className="size-5" aria-hidden />,
          title: "Visit us",
          detail: "Get directions",
          external: true,
          accent: "bg-sky-500 shadow-sky-500/30",
        },
      ]
    : []),
];

/** One chat bubble. Customer messages sit on the right in WhatsApp green. */
function Bubble({ from, time, className, children }: { from: "you" | "garage"; time: string; className: string; children: ReactNode }) {
  const you = from === "you";
  return (
    <div className={cn("chat-anim overflow-hidden", className, you ? "self-end" : "self-start")}>
      <div
        className={cn(
          "mb-2 max-w-[15rem] rounded-2xl px-3.5 py-2 text-[13px] leading-snug text-navy-900 shadow-sm",
          you ? "rounded-tr-sm bg-[#d9fdd3]" : "rounded-tl-sm bg-white",
        )}
      >
        {children}
        <span className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-navy-400">
          {time}
          {you && <CheckCheck className="size-3.5 text-sky-500" aria-hidden />}
        </span>
      </div>
    </div>
  );
}

/** A phone showing a short chat with the garage, playing out on a loop. */
function ChatPhone() {
  return (
    <div
      className="relative mx-auto w-[17.5rem] rounded-[2.75rem] bg-navy-800 p-2.5 shadow-2xl shadow-black/50 ring-1 ring-white/10 sm:w-[19rem]"
      role="img"
      aria-label="Example WhatsApp chat: a customer asks for a pickup and the garage confirms."
    >
      <div className="absolute left-1/2 top-4 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-navy-950" aria-hidden />
      <div className="overflow-hidden rounded-[2.25rem] bg-[#efeae2]" aria-hidden>
        {/* Chat header */}
        <div className="flex items-center gap-2.5 bg-navy-900 px-4 pb-3 pt-10 text-white">
          <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-white">
            <Image src={logo} alt="" className="size-8 object-contain" sizes="2rem" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{siteConfig.name}</span>
            <span className="flex items-center gap-1.5 text-[11px] text-navy-200">
              <span className="size-1.5 rounded-full bg-[#25D366]" />
              online
            </span>
          </span>
        </div>

        {/* Messages */}
        <div className="flex h-[22rem] flex-col bg-[radial-gradient(rgb(14_25_47/0.06)_1px,transparent_1px)] bg-[size:14px_14px] px-3 pt-4 sm:h-[24rem]">
          <span className="mx-auto mb-3 rounded-md bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-navy-400">
            Today
          </span>
          <Bubble from="you" time="10:30" className="chat-1">
            Hi! My car needs a service. Can you pick it up from my place? 🚗
          </Bubble>
          <div className="chat-anim chat-typing self-start overflow-hidden">
            <div className="mb-2 flex gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
              {[0, 150, 300].map((delay) => (
                <span key={delay} className="chat-dot size-1.5 rounded-full bg-navy-400" style={{ animationDelay: `${delay}ms` }} />
              ))}
            </div>
          </div>
          <Bubble from="garage" time="10:31" className="chat-2">
            Yes, of course! 👍 We pick up your car and drop it back home after the service.
          </Bubble>
          <Bubble from="you" time="10:32" className="chat-3">
            Perfect, thank you! 🙏
          </Bubble>
          <Bubble from="garage" time="10:32" className="chat-4">
            <span className="mb-1.5 flex items-center gap-2 rounded-lg bg-mist-100 p-2 font-semibold">
              <span className="grid size-8 place-items-center rounded-md bg-brand-500 text-white">
                <MapPin className="size-4" />
              </span>
              Varachha, Surat
            </span>
            Here&apos;s our location. See you soon!
          </Bubble>
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 bg-[#efeae2] px-3 pb-5 pt-1">
          <span className="h-9 flex-1 rounded-full bg-white px-4 text-[12px] leading-9 text-navy-300">Message</span>
          <span className="grid size-9 place-items-center rounded-full bg-[#25D366] text-white">
            <WhatsAppIcon className="size-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

/** Contact page hero: ways to reach us on the left, an animated chat on the right. */
export function ContactHero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 pb-20 pt-32 sm:pb-24 sm:pt-40" aria-labelledby="contact-hero-heading">
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_70%_50%,black,transparent_72%)]"
        aria-hidden
      />
      <div className="hero-glow absolute -right-32 top-16 -z-10 size-[34rem] rounded-full bg-[#25D366]/10 blur-3xl" aria-hidden />
      <div className="hero-glow absolute -left-40 bottom-0 -z-10 size-[30rem] rounded-full bg-brand-500/15 blur-3xl" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1 bg-linear-to-r from-brand-500 via-brand-400 to-transparent" aria-hidden />

      <Container className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div>
          <HeroBreadcrumb current="Contact Us" />
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-brand-400 animate-fade-up [animation-delay:100ms]">
            Get In Touch
          </p>
          <h1
            id="contact-hero-heading"
            className="mt-4 text-4xl font-bold uppercase leading-[1.02] text-white animate-fade-up [animation-delay:150ms] sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            We&apos;re Here
            <br />
            To <span className="text-brand-500">Help</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-100 animate-fade-up [animation-delay:250ms] sm:text-lg">
            Questions about your car, a quote or a booking? Message us on WhatsApp, give us a call or drop by the garage.
          </p>

          <ul className="mt-10 grid gap-3 animate-fade-up [animation-delay:350ms] sm:grid-cols-3">
            {actions.map((action) => (
              <li key={action.title}>
                <a
                  href={action.href}
                  {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:ring-white/25 sm:flex-col sm:items-start"
                >
                  <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl text-white shadow-lg", action.accent)}>
                    {action.icon}
                  </span>
                  <span>
                    <span className="block font-display text-lg font-bold uppercase leading-tight text-white">{action.title}</span>
                    <span className="block text-sm text-navy-200 transition-colors group-hover:text-white">{action.detail}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {openHours && (
            <p className="mt-5 flex items-center gap-2 text-sm text-navy-200 sm:hidden">
              <Clock className="size-4 text-brand-400" aria-hidden />
              Open all week · {openHours.time}
            </p>
          )}
        </div>

        <div className="relative animate-fade-up [animation-delay:250ms]">
          <ChatPhone />

          {openHours && (
            <div className="about-float absolute top-10 hidden items-center gap-3 rounded-2xl bg-white p-3 pr-4 shadow-2xl shadow-black/30 sm:left-0 sm:flex lg:-left-4">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-500">
                <Clock className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-navy-400">Open all week</span>
                <span className="block font-display text-base font-bold uppercase leading-tight text-navy-900">
                  {openHours.time.replace(":00", "").replace(":00", "")}
                </span>
              </span>
            </div>
          )}

          <div className="about-float-slow absolute bottom-4 hidden items-center gap-3 rounded-2xl bg-white p-3 pr-4 shadow-2xl shadow-black/30 sm:right-0 sm:flex lg:-right-6">
            <span className="contact-bounce grid size-10 place-items-center rounded-xl bg-brand-500 text-white">
              <MapPin className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-navy-400">Find us in</span>
              <span className="block font-display text-base font-bold uppercase leading-tight text-navy-900">Varachha, Surat</span>
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
