import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const onDark = tone === "dark";

  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p
        className={cn(
          "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-500",
          align === "center" && "justify-center",
        )}
      >
        <span className="h-px w-6 bg-brand-500" aria-hidden />
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-4 text-3xl font-bold uppercase leading-[1.05] sm:text-4xl lg:text-5xl",
          onDark ? "text-white" : "text-navy-900",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-5 text-base leading-relaxed sm:text-lg", onDark ? "text-navy-200" : "text-navy-500")}>
          {description}
        </p>
      )}
    </div>
  );
}
