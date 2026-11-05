import { Placeholder } from "@/components/ui/Placeholder";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type ContactKind = "phone" | "email" | "address" | "hours";

const placeholderLabels: Record<ContactKind, string> = {
  phone: "Phone number to be added",
  email: "Email to be added",
  address: "Garage address to be added",
  hours: "Opening hours to be added",
};

/**
 * Renders a piece of contact information from the site config,
 * or a clearly marked placeholder when it has not been provided yet.
 */
export function ContactValue({ kind, className }: { kind: ContactKind; className?: string }) {
  const { phones, email, address, hours } = siteConfig.contact;
  const linkClass = cn("transition-colors hover:text-brand-400", className);

  switch (kind) {
    case "phone":
      return phones?.length ? (
        <span className={cn("block space-y-1", className)}>
          {phones.map((number) => (
            <a key={number} href={`tel:${number.replace(/\s/g, "")}`} className={cn(linkClass, "block")}>
              {number}
            </a>
          ))}
        </span>
      ) : (
        <Placeholder label={placeholderLabels.phone} />
      );
    case "email":
      return email ? (
        <a href={`mailto:${email}`} className={linkClass}>
          {email}
        </a>
      ) : (
        <Placeholder label={placeholderLabels.email} />
      );
    case "address":
      return address ? (
        <address className={cn("not-italic", className)}>
          {address.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      ) : (
        <Placeholder label={placeholderLabels.address} />
      );
    case "hours":
      return hours ? (
        <span className={cn("block space-y-1", className)}>
          {hours.map((slot) => (
            <span key={slot.days} className="block">
              <span className="font-semibold">{slot.days}:</span> {slot.time}
            </span>
          ))}
        </span>
      ) : (
        <Placeholder label={placeholderLabels.hours} />
      );
  }
}
