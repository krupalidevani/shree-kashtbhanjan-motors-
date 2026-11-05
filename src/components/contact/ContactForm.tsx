"use client";

import { MessageSquareText, Phone, Send, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";

import { FormField, fieldAria } from "@/components/forms/FormField";
import { buttonClasses } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { normalizeIndianPhone, validateName, validatePhone } from "@/lib/validation";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type ContactValues = { name: string; phone: string; message: string };
type ContactErrors = Partial<Record<keyof ContactValues, string>>;

function validate(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {
    name: validateName(values.name),
    phone: validatePhone(values.phone),
  };
  const message = values.message.trim();
  if (!message) errors.message = "Please enter your message.";
  else if (message.length < 10) errors.message = "Please add a little more detail (at least 10 characters).";
  else if (message.length > 1000) errors.message = "Please keep your message under 1000 characters.";

  return Object.fromEntries(Object.entries(errors).filter(([, value]) => value)) as ContactErrors;
}

/** Enquiry form that validates input and opens WhatsApp with the message pre-filled. */
export function ContactForm() {
  const [values, setValues] = useState<ContactValues>({ name: "", phone: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (field: keyof ContactValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    setSent(false);
    if (attempted) setErrors(validate(next));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);

    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    const message = [
      `Hello ${siteConfig.name},`,
      "",
      values.message.trim(),
      "",
      `*Name:* ${values.name.trim()}`,
      `*Phone:* +91 ${normalizeIndianPhone(values.phone)}`,
    ].join("\n");

    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6 sm:grid-cols-2" aria-label="Contact form">
      <FormField id="contact-name" label="Full name" required icon={UserRound} error={errors.name}>
        {(className) => (
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            className={className}
            {...fieldAria("contact-name", errors.name)}
          />
        )}
      </FormField>

      <FormField id="contact-phone" label="Phone number" required icon={Phone} error={errors.phone}>
        {(className) => (
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="10-digit mobile number"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={className}
            {...fieldAria("contact-phone", errors.phone)}
          />
        )}
      </FormField>

      <FormField
        id="contact-message"
        label="Message"
        required
        icon={MessageSquareText}
        error={errors.message}
        className="sm:col-span-2"
      >
        {(className) => (
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            maxLength={1000}
            placeholder="How can we help you?"
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            className={cn(className, "resize-y")}
            {...fieldAria("contact-message", errors.message)}
          />
        )}
      </FormField>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-navy-400" role="status">
          {sent ? "WhatsApp opened — press send to deliver your message." : "Your message opens in WhatsApp, ready to send."}
        </p>
        <button type="submit" className={buttonClasses({ size: "lg" })}>
          <Send className="size-4" aria-hidden />
          Send via WhatsApp
        </button>
      </div>
    </form>
  );
}
