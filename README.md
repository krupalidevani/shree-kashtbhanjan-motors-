# Shree Kashtbhanjan Motors

Business website for a car garage, built with Next.js (App Router), TypeScript, Tailwind CSS and Lucide icons. All pages are statically prerendered; there is no database or backend.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://www.example.com`) in production so canonical URLs, the sitemap and `robots.txt` use the real domain.

## Adding real business information

Placeholders are shown on the site wherever details are missing. Update these files:

| What | Where |
| --- | --- |
| Phone, WhatsApp number, email, address, opening hours, Google Maps embed & directions link | `src/config/site.ts` |
| Services offered | `src/data/services.ts` |
| Customer testimonials (currently **sample** content) — replace, then set `testimonialsAreSamples = false` | `src/data/testimonials.ts` |
| "Why choose us" points | `src/data/highlights.ts` |
| Garage history / founder details | `src/app/about/page.tsx` |

Until `whatsapp` is set, WhatsApp links open WhatsApp with the message pre-filled and let the user pick a recipient. Once set, messages go straight to the garage's number.

## Structure

```
src/
  app/            Routes: / , /services, /about, /book, /contact, sitemap, robots
  components/
    layout/       Navbar, Footer, floating WhatsApp button
    sections/     Homepage and shared page sections
    booking/      Booking form (validates, then opens WhatsApp)
    contact/      Contact details, contact form, map embed
    services/     Service card and detail row
    forms/        Shared form field
    ui/           Button, Container, SectionHeading, PageHero, Reveal, Placeholder, Logo
  config/site.ts  Business information
  data/           Services, testimonials, highlights
  lib/            WhatsApp link builder, validation, utilities
  assets/images/  Locally stored, optimised photos (Unsplash licence)
```
