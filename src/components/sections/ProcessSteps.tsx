import { CalendarCheck, ClipboardCheck, KeyRound, Search, Wrench } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  { icon: CalendarCheck, title: "Book", text: "Request a slot online or on WhatsApp." },
  { icon: Search, title: "Inspect", text: "We check your car and find the real issue." },
  { icon: ClipboardCheck, title: "Approve", text: "You get a clear estimate before work starts." },
  { icon: Wrench, title: "Repair", text: "Our mechanics carry out the work with care." },
  { icon: KeyRound, title: "Deliver", text: "Your car is checked and handed back to you." },
];

export function ProcessSteps() {
  return (
    <section className="bg-white py-20 sm:py-28" aria-labelledby="process-heading">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="How It Works"
            title={<span id="process-heading">A Simple, Transparent Process</span>}
            description="No surprises, no confusion — just a clear path from booking to delivery."
          />
        </Reveal>

        <ol className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          <span
            className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-linear-to-r from-brand-500/0 via-brand-500/50 to-brand-500/0 lg:block"
            aria-hidden
          />
          {steps.map(({ icon: Icon, title, text }, index) => (
            <li key={title}>
              <Reveal delay={index * 100} className="flex flex-col items-center text-center">
                <span className="relative grid size-16 place-items-center rounded-2xl bg-navy-900 text-brand-400 shadow-xl shadow-navy-900/20">
                  <Icon className="size-7" aria-hidden />
                  <span className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white ring-4 ring-white">
                    {index + 1}
                  </span>
                </span>
                <h3 className="mt-6 text-2xl font-bold uppercase text-navy-900">{title}</h3>
                <p className="mt-2 max-w-56 text-navy-500">{text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
