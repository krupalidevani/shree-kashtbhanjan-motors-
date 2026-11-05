import { MapPin, Navigation } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Generic placeholder map used until the garage's real location is configured. */
const PLACEHOLDER_MAP_URL = "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sIndia!6i5";

export function MapEmbed({ className }: { className?: string }) {
  const { mapEmbedUrl, mapDirectionsUrl } = siteConfig.contact;
  const isPlaceholder = !mapEmbedUrl;

  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-mist-100 ring-1 ring-mist-200", className)}>
      <iframe
        src={mapEmbedUrl ?? PLACEHOLDER_MAP_URL}
        title={isPlaceholder ? "Placeholder map — garage location to be added" : `${siteConfig.name} location`}
        className={cn("absolute inset-0 size-full border-0", isPlaceholder && "opacity-60 grayscale")}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />

      {isPlaceholder ? (
        <div className="absolute inset-x-4 top-4 flex items-start gap-3 rounded-2xl border border-dashed border-brand-400 bg-white/95 p-4 shadow-lg backdrop-blur sm:inset-x-auto sm:left-4 sm:max-w-sm">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-500 text-white">
            <MapPin className="size-5" aria-hidden />
          </span>
          <p className="text-sm text-navy-700">
            <span className="block font-bold text-navy-900">Map placeholder</span>
            The garage location will be shown here once the address is added.
          </p>
        </div>
      ) : (
        mapDirectionsUrl && (
          <a
            href={mapDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-brand-500"
          >
            <Navigation className="size-4" aria-hidden />
            Get directions
          </a>
        )
      )}
    </div>
  );
}
