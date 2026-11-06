import { CalendarCheck, ClipboardCheck, KeyRound, Search, Wrench } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const steps = [
  { icon: CalendarCheck, title: "Book", text: "Request a slot online or on WhatsApp — we can also pick up your car." },
  { icon: Search, title: "Inspect", text: "We check your car and find the real issue." },
  { icon: ClipboardCheck, title: "Approve", text: "You get a clear estimate before work starts." },
  { icon: Wrench, title: "Repair", text: "Our mechanics carry out the work with care." },
  { icon: KeyRound, title: "Deliver", text: "Your car is checked and handed back — or dropped at your place." },
];

/** Time for the line between two steps to fill; each step lights up as the line reaches it. */
const segmentMs = 400;

/**
 * The service process as a timeline: a line fills when the section comes into view
 * and each step lights up in turn. Horizontal on large screens, vertical below.
 */
export function ProcessSteps() {
  return (
    <section className="relative overflow-hidden bg-mist-50 py-20 sm:py-28" aria-labelledby="process-heading">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-mist-200)_1px,transparent_0)] bg-size-[24px_24px] mask-[linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]"
        aria-hidden
      />
      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow="How It Works"
            title={<span id="process-heading">A Simple, Transparent Process</span>}
            description="No surprises, no confusion — just a clear path from booking to delivery."
          />
        </Reveal>

        <Reveal className="group/process mx-auto mt-16 max-w-2xl lg:max-w-none">
          <ol className="relative grid gap-6 lg:grid-cols-5">
            {steps.map(({ icon: Icon, title, text }, index) => {
              const last = index === steps.length - 1;
              const delay = 200 + index * segmentMs;
              return (
                <li key={title} className="relative flex gap-5 lg:flex-col lg:items-center lg:gap-6 lg:text-center">
                  {!last && (
                    // Line to the next step: down to it below lg, across to it from lg.
                    <span
                      className="absolute left-8 top-8 h-[calc(100%+1.5rem)] w-1 -translate-x-1/2 bg-mist-200 lg:left-1/2 lg:h-1 lg:w-[calc(100%+1.5rem)] lg:translate-x-0 lg:-translate-y-1/2"
                      aria-hidden
                    >
                      <span
                        className="absolute inset-0 origin-top scale-y-0 bg-brand-500 transition-transform ease-linear group-[.is-visible]/process:scale-y-100 motion-reduce:transition-none lg:origin-left lg:scale-x-0 lg:scale-y-100 lg:group-[.is-visible]/process:scale-x-100"
                        style={{ transitionDuration: `${segmentMs}ms`, transitionDelay: `${delay}ms` }}
                      />
                    </span>
                  )}
                  <span
                    className={cn(
                      "relative z-10 grid size-16 shrink-0 place-items-center rounded-full border-2 border-mist-200 bg-white text-navy-300 ring-8 ring-mist-50 transition-all duration-500 motion-reduce:transition-none",
                      "group-[.is-visible]/process:border-brand-500 group-[.is-visible]/process:text-brand-500 group-[.is-visible]/process:shadow-lg group-[.is-visible]/process:shadow-brand-500/25",
                      last && "group-[.is-visible]/process:bg-brand-500 group-[.is-visible]/process:text-white",
                    )}
                    style={{ transitionDelay: `${delay}ms` }}
                  >
                    <Icon className="size-7" aria-hidden />
                  </span>

                  <div
                    className={cn(
                      "group relative flex-1 overflow-hidden rounded-2xl p-6 ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:w-full",
                      last
                        ? "bg-navy-900 text-white ring-navy-900 hover:shadow-navy-900/20"
                        : "bg-white ring-mist-200 hover:shadow-navy-900/5",
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none absolute -bottom-5 right-2 font-display text-8xl font-bold leading-none tabular-nums transition-colors duration-300",
                        last ? "text-white/5" : "text-mist-100 group-hover:text-brand-50",
                      )}
                      aria-hidden
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                      Step {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className={cn("relative mt-2 text-2xl font-bold uppercase", last ? "text-white" : "text-navy-900")}>
                      {title}
                    </h3>
                    <p className={cn("relative mt-2 leading-relaxed", last ? "text-navy-100" : "text-navy-500")}>{text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}
