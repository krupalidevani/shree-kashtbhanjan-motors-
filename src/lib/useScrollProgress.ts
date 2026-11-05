"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Reports how far the user has scrolled through a tall element, from 0 (its top
 * reaches the top of the viewport) to 1 (its bottom reaches the bottom of the viewport).
 * The callback runs at most once per animation frame, outside React rendering, so it
 * can write styles directly for smooth scroll-linked animation.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, onProgress: (progress: number) => void) {
  const callback = useRef(onProgress);

  useEffect(() => {
    callback.current = onProgress;
  });

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const progress = distance > 0 ? Math.min(Math.max(-rect.top / distance, 0), 1) : 0;
      callback.current(progress);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
}

export const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

/** Smooth ease-in-out for values between 0 and 1. */
export const smoothstep = (t: number) => t * t * (3 - 2 * t);
