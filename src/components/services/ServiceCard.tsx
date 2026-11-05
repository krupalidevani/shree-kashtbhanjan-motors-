import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { Service } from "@/data/services";

/** Compact service tile linking to the full description on the Services page. */
export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;

  return (
    <Link
      href={`/services#${service.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-mist-200 bg-white p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-transparent hover:shadow-2xl hover:shadow-navy-900/10"
    >
      <span
        className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brand-500 transition-transform duration-500 group-hover:scale-x-100"
        aria-hidden
      />
      <div className="flex items-start justify-between">
        <span className="grid size-14 place-items-center rounded-xl bg-navy-900 text-brand-400 transition-colors duration-500 group-hover:bg-brand-500 group-hover:text-white">
          <Icon className="size-6" aria-hidden />
        </span>
        <span className="font-display text-4xl font-bold text-mist-200 transition-colors duration-500 group-hover:text-brand-100">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-6 text-2xl font-bold uppercase text-navy-900">{service.title}</h3>
      <p className="mt-3 flex-1 leading-relaxed text-navy-500">{service.summary}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600">
        Learn more
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
