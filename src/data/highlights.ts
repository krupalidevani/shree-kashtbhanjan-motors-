import {
  BadgeIndianRupee,
  ClipboardCheck,
  Clock,
  HeartHandshake,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type Highlight = {
  title: string;
  description: string;
  icon: LucideIcon;
};

/** "Why choose us" points. Adjust the wording to reflect the garage's real strengths. */
export const highlights: Highlight[] = [
  {
    title: "Skilled Mechanics",
    description: "Hands-on technicians who treat every car with care and attention to detail.",
    icon: Wrench,
  },
  {
    title: "Transparent Pricing",
    description: "Clear estimates before work begins, with no hidden or surprise charges.",
    icon: BadgeIndianRupee,
  },
  {
    title: "Honest Diagnosis",
    description: "We explain what your car needs and why, so you can decide with confidence.",
    icon: ClipboardCheck,
  },
  {
    title: "On-Time Delivery",
    description: "We respect your time and keep you updated on the progress of your car.",
    icon: Clock,
  },
  {
    title: "Quality Parts",
    description: "Reliable parts and lubricants chosen to match your vehicle's requirements.",
    icon: ShieldCheck,
  },
  {
    title: "Customer First",
    description: "Friendly service and easy booking on WhatsApp, built around your convenience.",
    icon: HeartHandshake,
  },
];
