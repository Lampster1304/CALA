"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "./SmoothScroll";

const NAV_LINKS = [
  { label: "Sobre Nosotros", id: "sobre-nosotros" },
  { label: "Fundadores", id: "fundadores" },
  { label: "Proyectos", id: "proyectos" },
  { label: "Contacto", id: "contacto" },
] as const;

// "Sobre Nosotros" midpoint in the 80-unit timeline: (42+66)/2 = 54 → 54/80
const SOBRE_NOSOTROS_PROGRESS = 54 / 80;

// Flag to signal BlackHoleHero that we're navigating (skip autoscroll lock)
let _isNavigating = false;
export function getIsNavigating() {
  return _isNavigating;
}

export default function Navbar({ visible }: { visible: boolean }) {
  const handleNav = (sectionId: string) => {
    const lenis = getLenis();
    if (!lenis) return;

    if (sectionId === "sobre-nosotros") {
      // Navigate via ScrollTrigger progress (inside pinned hero)
      const triggers = ScrollTrigger.getAll();
      const mainTrigger = triggers.find((t) => t.pin);
      if (!mainTrigger) return;

      const targetScroll =
        mainTrigger.start +
        (mainTrigger.end - mainTrigger.start) * SOBRE_NOSOTROS_PROGRESS;

      _isNavigating = true;
      lenis.scrollTo(targetScroll, {
        duration: 2,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        onComplete: () => {
          _isNavigating = false;
        },
      });
    } else {
      // Navigate to standalone DOM sections
      _isNavigating = true;
      lenis.scrollTo(`#${sectionId}`, {
        duration: 2,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        offset: 0,
        onComplete: () => {
          _isNavigating = false;
        },
      });
    }
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="glass-card flex items-center gap-1 md:gap-2 px-4 py-2 md:px-6 md:py-3">
        <span className="font-[family-name:var(--font-orbitron)] text-white/90 text-sm md:text-base font-bold tracking-[0.2em] mr-4 md:mr-6">
          CALA
        </span>
        {NAV_LINKS.map((link) => (
          <button
            key={link.id}
            onClick={() => handleNav(link.id)}
            className="font-[family-name:var(--font-inter)] text-white/60 hover:text-white/90 text-xs md:text-sm px-2 py-1 md:px-3 md:py-1.5 rounded-lg transition-colors duration-300 hover:bg-white/5"
          >
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
