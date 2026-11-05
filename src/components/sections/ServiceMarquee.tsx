import { Sparkles } from "lucide-react";

import { services } from "@/data/services";

/** Endless band of service names between the hero and the next section. */
export function ServiceMarquee() {
  const items = services.map((service) => service.title);

  return (
    <div className="group relative overflow-hidden border-y border-brand-600 bg-brand-500 py-5 text-white" aria-label="Services we offer">
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="marquee flex w-max group-hover:[animation-play-state:paused]" aria-hidden>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((item) => (
              <span key={item} className="flex items-center font-display text-2xl font-bold uppercase tracking-wide sm:text-3xl">
                <span className="px-8">{item}</span>
                <Sparkles className="size-5 text-navy-950" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
