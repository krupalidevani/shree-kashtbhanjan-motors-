import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const inputClasses = (hasIcon: boolean, hasError: boolean) =>
  cn(
    "block w-full rounded-xl border bg-white py-3.5 pr-4 text-navy-900 shadow-sm outline-none transition-all placeholder:text-navy-300",
    "focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15",
    hasIcon ? "pl-11" : "pl-4",
    hasError ? "border-red-400 bg-red-50/40" : "border-mist-200 hover:border-navy-200",
  );

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  icon?: LucideIcon;
  hint?: string;
  className?: string;
  /** Receives the input classes so the field can render any control. */
  children: (inputClassName: string) => ReactNode;
};

/** Label, icon, control and error message wrapper shared by all forms. */
export function FormField({ id, label, error, required, icon: Icon, hint, className, children }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-navy-800">
        {label}
        {required ? (
          <span className="ml-0.5 text-brand-500" aria-hidden>
            *
          </span>
        ) : (
          <span className="ml-1.5 font-normal text-navy-400">(optional)</span>
        )}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className={cn(
              "pointer-events-none absolute left-4 top-4 size-5",
              error ? "text-red-400" : "text-navy-300",
            )}
            aria-hidden
          />
        )}
        {children(inputClasses(Boolean(Icon), Boolean(error)))}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-sm text-navy-400">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

/** aria props linking a control to its FormField error or hint. */
export function fieldAria(id: string, error?: string, hint?: string) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  } as const;
}
