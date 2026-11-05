import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/images/logo.png";
import { cn } from "@/lib/utils";

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn("group flex items-center gap-3", className)}
      aria-label="Shree Kashtbhanjan Motors — Home"
    >
      <Image
        src={logo}
        alt=""
        loading="eager"
        sizes="72px"
        className="h-12 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105 sm:h-14"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold uppercase tracking-wide text-white sm:text-xl">
          Shree Kashtbhanjan
        </span>
        <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-brand-400">Motors</span>
      </span>
    </Link>
  );
}
