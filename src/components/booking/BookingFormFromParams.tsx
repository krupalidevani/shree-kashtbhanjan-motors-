"use client";

import { useSearchParams } from "next/navigation";

import { services } from "@/data/services";

import { BookingForm } from "./BookingForm";

/** Pre-selects the service when linked as /book?service=<slug>. */
export function BookingFormFromParams() {
  const slug = useSearchParams().get("service");
  const service = services.find((item) => item.slug === slug)?.title ?? "";

  return <BookingForm key={service} initialService={service} />;
}
