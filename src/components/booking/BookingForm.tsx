"use client";

import {
  CalendarDays,
  CarFront,
  ChevronDown,
  CircleCheck,
  ClipboardList,
  Phone,
  RotateCcw,
  Send,
  UserRound,
  Wrench,
} from "lucide-react";
import { useState, useSyncExternalStore, type FormEvent } from "react";

import { FormField, fieldAria } from "@/components/forms/FormField";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig } from "@/config/site";
import { serviceTitles } from "@/data/services";
import { cn } from "@/lib/utils";
import {
  formatDisplayDate,
  normalizeIndianPhone,
  todayIsoDate,
  validateName,
  validatePhone,
} from "@/lib/validation";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type BookingValues = {
  name: string;
  phone: string;
  carModel: string;
  service: string;
  date: string;
  notes: string;
};

type BookingErrors = Partial<Record<keyof BookingValues, string>>;

const OTHER_SERVICE = "Other / Not sure";

function validate(values: BookingValues, today: string): BookingErrors {
  const errors: BookingErrors = {};

  errors.name = validateName(values.name);
  errors.phone = validatePhone(values.phone);

  const carModel = values.carModel.trim();
  if (!carModel) errors.carModel = "Please enter your car's make and model.";
  else if (carModel.length < 2) errors.carModel = "Car model looks too short.";

  if (!values.service) errors.service = "Please choose a service.";

  if (!values.date) errors.date = "Please choose a preferred date.";
  else if (values.date < today) errors.date = "Preferred date cannot be in the past.";

  if (values.notes.length > 500) errors.notes = "Please keep notes under 500 characters.";

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message)) as BookingErrors;
}

function buildBookingMessage(values: BookingValues) {
  const lines = [
    `Hello ${siteConfig.name}, I would like to book a car service.`,
    "",
    `*Name:* ${values.name.trim()}`,
    `*Phone:* +91 ${normalizeIndianPhone(values.phone)}`,
    `*Car Model:* ${values.carModel.trim()}`,
    `*Service:* ${values.service}`,
    `*Preferred Date:* ${formatDisplayDate(values.date)}`,
  ];
  if (values.notes.trim()) lines.push(`*Notes:* ${values.notes.trim()}`);
  lines.push("", "Please confirm my booking. Thank you!");
  return lines.join("\n");
}

const subscribeNoop = () => () => {};

export function BookingForm({ initialService = "" }: { initialService?: string }) {
  const [values, setValues] = useState<BookingValues>({
    name: "",
    phone: "",
    carModel: "",
    service: initialService,
    date: "",
    notes: "",
  });
  const [errors, setErrors] = useState<BookingErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string | null>(null);

  // Today's date is only known in the browser; the server render omits the `min` attribute.
  const today = useSyncExternalStore(subscribeNoop, todayIsoDate, () => undefined);

  const update = (field: keyof BookingValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (attempted) setErrors(validate(next, todayIsoDate()));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);

    const nextErrors = validate(values, todayIsoDate());
    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(`booking-${firstInvalid}`)?.focus();
      return;
    }

    const url = buildWhatsAppUrl(buildBookingMessage(values));
    setWhatsAppUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const reset = () => {
    setValues({ name: "", phone: "", carModel: "", service: "", date: "", notes: "" });
    setErrors({});
    setAttempted(false);
    setWhatsAppUrl(null);
  };

  if (whatsAppUrl) {
    return (
      <div className="flex flex-col items-center py-10 text-center" role="status">
        <span className="grid size-20 place-items-center rounded-full bg-[#25D366]/15 text-[#1aa84f]">
          <CircleCheck className="size-10" aria-hidden />
        </span>
        <h3 className="mt-6 text-3xl font-bold uppercase text-navy-900">Almost done!</h3>
        <p className="mt-3 max-w-md leading-relaxed text-navy-500">
          WhatsApp has opened with your booking details. Just press <strong>send</strong> to submit your request — we
          will confirm your slot on WhatsApp.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: "whatsapp", size: "lg" })}
          >
            <WhatsAppIcon className="size-5" />
            Open WhatsApp again
          </a>
          <button type="button" onClick={reset} className={buttonClasses({ variant: "outline-dark", size: "lg" })}>
            <RotateCcw className="size-4" aria-hidden />
            New booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6 sm:grid-cols-2" aria-label="Service booking form">
      <FormField id="booking-name" label="Full name" required icon={UserRound} error={errors.name}>
        {(className) => (
          <input
            id="booking-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            className={className}
            {...fieldAria("booking-name", errors.name)}
          />
        )}
      </FormField>

      <FormField id="booking-phone" label="Phone number" required icon={Phone} error={errors.phone}>
        {(className) => (
          <input
            id="booking-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="10-digit mobile number"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={className}
            {...fieldAria("booking-phone", errors.phone)}
          />
        )}
      </FormField>

      <FormField id="booking-carModel" label="Car model" required icon={CarFront} error={errors.carModel}>
        {(className) => (
          <input
            id="booking-carModel"
            name="carModel"
            type="text"
            placeholder="e.g. Maruti Swift, Hyundai Creta"
            value={values.carModel}
            onChange={(event) => update("carModel", event.target.value)}
            className={className}
            {...fieldAria("booking-carModel", errors.carModel)}
          />
        )}
      </FormField>

      <FormField id="booking-service" label="Service required" required icon={Wrench} error={errors.service}>
        {(className) => (
          <>
            <select
              id="booking-service"
              name="service"
              value={values.service}
              onChange={(event) => update("service", event.target.value)}
              className={cn(className, "appearance-none pr-11", !values.service && "text-navy-300")}
              {...fieldAria("booking-service", errors.service)}
            >
              <option value="" disabled>
                Select a service
              </option>
              {[...serviceTitles, OTHER_SERVICE].map((title) => (
                <option key={title} value={title} className="text-navy-900">
                  {title}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-4 size-5 text-navy-300" aria-hidden />
          </>
        )}
      </FormField>

      <FormField
        id="booking-date"
        label="Preferred date"
        required
        icon={CalendarDays}
        error={errors.date}
        className="sm:col-span-2"
      >
        {(className) => (
          <input
            id="booking-date"
            name="date"
            type="date"
            min={today}
            value={values.date}
            onChange={(event) => update("date", event.target.value)}
            className={cn(className, !values.date && "text-navy-300")}
            {...fieldAria("booking-date", errors.date)}
          />
        )}
      </FormField>

      <FormField
        id="booking-notes"
        label="Additional notes"
        icon={ClipboardList}
        error={errors.notes}
        hint="Describe any issue, noise or warning light you have noticed."
        className="sm:col-span-2"
      >
        {(className) => (
          <textarea
            id="booking-notes"
            name="notes"
            rows={4}
            maxLength={500}
            placeholder="Anything we should know about your car?"
            value={values.notes}
            onChange={(event) => update("notes", event.target.value)}
            className={cn(className, "resize-y")}
            {...fieldAria("booking-notes", errors.notes, "hint")}
          />
        )}
      </FormField>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm text-navy-400">
          <WhatsAppIcon className="size-4 text-[#25D366]" />
          Submitting opens WhatsApp with your booking details.
        </p>
        <button type="submit" className={buttonClasses({ size: "lg" })}>
          <Send className="size-4" aria-hidden />
          Book via WhatsApp
        </button>
      </div>
    </form>
  );
}
