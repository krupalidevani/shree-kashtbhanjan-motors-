import { cn } from "@/lib/utils";

/** Visibly marks business information that has not been provided yet. */
export function Placeholder({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-dashed border-brand-400/70 bg-brand-500/10 px-2 py-0.5 text-[0.8em] font-medium text-brand-600",
        className,
      )}
      title="Placeholder — business information to be added"
    >
      [{label}]
    </span>
  );
}
