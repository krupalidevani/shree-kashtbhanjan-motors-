/**
 * Central business configuration.
 *
 * PLACEHOLDERS: Every value set to `null` below is real business information
 * that has not been provided yet. The UI shows a clearly marked placeholder
 * wherever a value is missing. Fill these in to make it live across the site.
 */

export type OpeningHours = {
  days: string;
  time: string;
};

export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  contact: {
    /** Display format, e.g. "+91 98765 43210". The first one is the main number. */
    phones: string[] | null;
    /** Digits only, with country code and no "+", e.g. "919876543210". */
    whatsapp: string | null;
    email: string | null;
    /** Full postal address, one line per array item. */
    address: string[] | null;
    hours: OpeningHours[] | null;
    /** Google Maps "Embed a map" iframe src for the garage location. */
    mapEmbedUrl: string | null;
    /** Google Maps share link, used for the "Get directions" button. */
    mapDirectionsUrl: string | null;
  };
};

/** Google Maps search for the garage's listing, used for the map and directions. */
const mapQuery = encodeURIComponent(
  "Shree Kashtbhanjan Motors, Gadhpur Rd, near Shiv Plaza, Sarthana Jakat Naka, Varachha, Surat, Gujarat 395013",
);

export const siteConfig: SiteConfig = {
  name: "Shree Kashtbhanjan Motors",
  tagline: "Car Repair, Servicing & Maintenance",
  description:
    "Shree Kashtbhanjan Motors is a car garage offering vehicle servicing, repairs and maintenance. Book a service online and confirm instantly on WhatsApp.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    phones: ["+91 99986 22128", "+91 93139 51154"],
    whatsapp: "919998622128",
    email: "shreekashtbhanjanmotors04@gmail.com",
    // From the garage's Google Business listing.
    address: [
      "Navjivan Hotel to Gadhpur Road, near Shiv Plaza",
      "Sarthana Jakat Naka, Varachha",
      "Surat, Gujarat 395013",
    ],
    hours: [{ days: "Monday – Sunday", time: "9:00 AM – 9:00 PM" }],
    mapEmbedUrl: `https://www.google.com/maps?q=${mapQuery}&output=embed`,
    mapDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`,
  },
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const bookingHref = "/book";
