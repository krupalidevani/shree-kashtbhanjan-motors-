import type { StaticImageData } from "next/image";
import {
  BatteryCharging,
  Cog,
  Disc3,
  Droplet,
  Gauge,
  Snowflake,
  Sparkles,
  SprayCan,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import brakeDisc from "@/assets/images/brake-disc.jpg";
import carAc from "@/assets/images/car-ac.jpg";
import carBattery from "@/assets/images/car-battery.jpg";
import carWash from "@/assets/images/car-wash.jpg";
import engineBelts from "@/assets/images/engine-belts.jpg";
import mechanicEngineBay from "@/assets/images/mechanic-engine-bay.jpg";
import oilChange from "@/assets/images/oil-change.jpg";
import tyres from "@/assets/images/tyres.jpg";
import wrenchHands from "@/assets/images/wrench-hands.jpg";

export type Service = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  includes: string[];
  icon: LucideIcon;
  image?: StaticImageData;
};

/**
 * Services shown across the site and offered in the booking form.
 * Review this list so it matches the services the garage actually provides.
 */
export const services: Service[] = [
  {
    slug: "general-service",
    title: "General Car Service",
    summary: "Periodic servicing to keep your car running smoothly and reliably.",
    description:
      "A thorough, checklist-based periodic service covering the essentials your car needs to stay safe, efficient and dependable on the road.",
    includes: ["Multi-point inspection", "Fluid top-ups", "Filter checks", "Road test"],
    icon: Wrench,
    image: mechanicEngineBay,
  },
  {
    slug: "engine-repair",
    title: "Engine Diagnostics & Repair",
    summary: "Accurate fault diagnosis and repair for engine performance issues.",
    description:
      "From warning lights to rough idling and loss of power, we diagnose the root cause and repair it properly instead of guessing.",
    includes: ["Computer diagnostics", "Timing & belt work", "Engine tuning", "Leak repairs"],
    icon: Cog,
    image: engineBelts,
  },
  {
    slug: "oil-change",
    title: "Oil & Filter Change",
    summary: "Fresh engine oil and filters for better protection and mileage.",
    description:
      "Quality engine oil and filter replacement matched to your vehicle's specification to protect the engine and extend its life.",
    includes: ["Engine oil replacement", "Oil filter change", "Air filter check", "Level checks"],
    icon: Droplet,
    image: oilChange,
  },
  {
    slug: "brake-service",
    title: "Brake Repair & Service",
    summary: "Inspection and repair of pads, discs and brake fluid for safe stopping.",
    description:
      "Your safety depends on your brakes. We inspect, clean and replace brake components so your car stops confidently every time.",
    includes: ["Pad & shoe replacement", "Disc inspection", "Brake fluid service", "Brake noise fixes"],
    icon: Disc3,
    image: brakeDisc,
  },
  {
    slug: "ac-service",
    title: "Car AC Service & Repair",
    summary: "Cooling checks, gas top-up and repair for a comfortable cabin.",
    description:
      "Weak or no cooling? We check the complete AC system, find leaks, service components and restore comfortable cabin cooling.",
    includes: ["Cooling performance check", "AC gas refill", "Cabin filter cleaning", "Leak detection"],
    icon: Snowflake,
    image: carAc,
  },
  {
    slug: "wheel-care",
    title: "Tyres, Alignment & Balancing",
    summary: "Wheel alignment, balancing and tyre care for a smoother ride.",
    description:
      "Correct alignment and balanced wheels improve handling, reduce tyre wear and make every drive smoother and safer.",
    includes: ["Wheel alignment", "Wheel balancing", "Tyre rotation", "Puncture repair"],
    icon: Gauge,
    image: tyres,
  },
  {
    slug: "battery-electrical",
    title: "Battery & Electrical",
    summary: "Battery testing, replacement and electrical fault repair.",
    description:
      "Starting trouble or electrical faults? We test batteries, charging systems, lights and wiring and fix the issue at its source.",
    includes: ["Battery health test", "Battery replacement", "Alternator check", "Wiring & lights"],
    icon: BatteryCharging,
    image: carBattery,
  },
  {
    slug: "denting-painting",
    title: "Denting & Painting",
    summary: "Dent removal, scratch repair and paint work for a fresh look.",
    description:
      "From small dents and scratches to panel repairs, we restore your car's body and finish with careful paint matching.",
    includes: ["Dent removal", "Scratch repair", "Panel painting", "Bumper repair"],
    icon: SprayCan,
    image: wrenchHands,
  },
  {
    slug: "wash-detailing",
    title: "Car Wash & Detailing",
    summary: "Exterior wash, interior cleaning and polishing for a showroom shine.",
    description:
      "Bring back the shine with a careful wash, interior clean-up and polishing that leaves your car looking and feeling fresh.",
    includes: ["Exterior foam wash", "Interior vacuuming", "Dashboard polish", "Body polishing"],
    icon: Sparkles,
    image: carWash,
  },
];

export const serviceTitles = services.map((service) => service.title);
