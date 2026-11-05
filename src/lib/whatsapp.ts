import { siteConfig } from "@/config/site";

/**
 * Builds a wa.me link with a pre-filled message.
 *
 * When the business WhatsApp number has not been configured yet, the link
 * still opens WhatsApp with the message, letting the user pick a recipient.
 */
export function buildWhatsAppUrl(message?: string) {
  const number = siteConfig.contact.whatsapp?.replace(/\D/g, "") ?? "";
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const defaultWhatsAppMessage = `Hello ${siteConfig.name}, I would like to enquire about a car service.`;
