import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";

import { ContactValue } from "@/components/contact/ContactValue";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";

const items: Array<{ kind: "phone" | "email" | "address" | "hours"; title: string; icon: LucideIcon }> = [
  { kind: "phone", title: "Call Us", icon: Phone },
  { kind: "email", title: "Email", icon: Mail },
  { kind: "address", title: "Visit The Garage", icon: MapPin },
  { kind: "hours", title: "Opening Hours", icon: Clock },
];

/** Stack of contact cards, each showing a value from the site config or a placeholder. */
export function ContactDetails() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      <li>
        <a
          href={buildWhatsAppUrl(defaultWhatsAppMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-5 rounded-2xl bg-[#25D366] p-5 text-white shadow-lg shadow-[#25D366]/20 transition-transform duration-300 hover:-translate-y-0.5"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/20">
            <WhatsAppIcon className="size-6" />
          </span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.2em] text-white/80">WhatsApp</span>
            <span className="mt-1 block text-lg font-bold">Chat with us instantly</span>
          </span>
        </a>
      </li>
      {items.map(({ kind, title, icon: Icon }) => (
        <li key={kind} className="flex gap-5 rounded-2xl bg-white p-5 ring-1 ring-mist-200">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-navy-900 text-brand-400">
            <Icon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-navy-400">{title}</p>
            <div className="mt-1.5 font-semibold text-navy-900">
              <ContactValue kind={kind} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
