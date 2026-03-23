"use client";

import { useEffect, useRef } from "react";
import { getLenis } from "./SmoothScroll";

interface SnapScrollManagerProps {
  sectionIds: string[];
}

export default function SnapScrollManager({ sectionIds }: SnapScrollManagerProps) {
  const isSnapping = useRef(false);
  const accumulatedDelta = useRef(0);
  const decayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const DELTA_THRESHOLD = 80;
    const DECAY_MS = 250;
    const SNAP_DURATION = 1.4;
    const POST_SNAP_COOLDOWN = 600;

    const getCurrentSectionIndex = () => {
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];

      let currentIndex = -1;
      let maxRatio = 0;

      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        const visible =
          Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
        const ratio = visible / window.innerHeight;
        if (ratio > maxRatio) {
          maxRatio = ratio;
          currentIndex = i;
        }
      }

      return { currentIndex, maxRatio, sections };
    };

    const snapTo = (section: HTMLElement) => {
      const lenis = getLenis();
      if (!lenis) {
        isSnapping.current = false;
        return;
      }

      isSnapping.current = true;
      lenis.scrollTo(section, {
        duration: SNAP_DURATION,
        easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -12 * t)),
        onComplete: () => {
          setTimeout(() => {
            isSnapping.current = false;
            accumulatedDelta.current = 0;
          }, POST_SNAP_COOLDOWN);
        },
      });
    };

    const handleWheel = (e: WheelEvent) => {
      const { currentIndex, maxRatio, sections } = getCurrentSectionIndex();

      // Not inside a snap section — let normal scroll happen
      if (currentIndex === -1 || maxRatio < 0.4) return;

      // Block scroll while snapping
      if (isSnapping.current) {
        e.preventDefault();
        return;
      }

      e.preventDefault();

      // Accumulate scroll intent
      accumulatedDelta.current += e.deltaY;

      // Reset accumulator if the user pauses scrolling
      if (decayTimer.current) clearTimeout(decayTimer.current);
      decayTimer.current = setTimeout(() => {
        accumulatedDelta.current = 0;
      }, DECAY_MS);

      // Once intent is strong enough, snap
      if (Math.abs(accumulatedDelta.current) < DELTA_THRESHOLD) return;

      const direction = accumulatedDelta.current > 0 ? 1 : -1;
      const nextIndex = currentIndex + direction;
      accumulatedDelta.current = 0;

      if (nextIndex < 0 || nextIndex >= sections.length) return;

      snapTo(sections[nextIndex]);
    };

    // Touch handling for mobile
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isSnapping.current) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 50) return;

      const { currentIndex, maxRatio, sections } = getCurrentSectionIndex();
      if (currentIndex === -1 || maxRatio < 0.4) return;

      const direction = deltaY > 0 ? 1 : -1;
      const nextIndex = currentIndex + direction;

      if (nextIndex < 0 || nextIndex >= sections.length) return;

      snapTo(sections[nextIndex]);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      if (decayTimer.current) clearTimeout(decayTimer.current);
    };
  }, [sectionIds]);

  return null;
}
