"use client";

import { useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "./SmoothScroll";
import { Menu, X, Rocket } from "lucide-react";

const NAV_LINKS = [
  { label: "Sobre Nosotros", id: "sobre-nosotros" },
  { label: "Fundadores", id: "fundadores" },
  { label: "Proyectos", id: "proyectos" },
  { label: "Contacto", id: "contacto" },
] as const;

const SOBRE_NOSOTROS_PROGRESS = 54 / 80;

let _isNavigating = false;
export function getIsNavigating() {
  return _isNavigating;
}

export default function Navbar({ visible }: { visible: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (sectionId: string) => {
    setIsOpen(false);
    const lenis = getLenis();
    if (!lenis) return;

    if (sectionId === "sobre-nosotros") {
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
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-black/60 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <span className="font-[family-name:var(--font-orbitron)] text-base font-bold tracking-[0.15em] text-white hover:text-violet-300 transition-colors duration-500 cursor-pointer">
              CALA
            </span>

            {/* Desktop Links + CTA */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className="group relative font-[family-name:var(--font-inter)] text-sm text-white/50 hover:text-white transition-colors duration-300 py-1"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left rounded-full" />
                </button>
              ))}

              {/* CTA Button */}
              <button
                onClick={() => handleNav("contacto")}
                className="relative flex items-center gap-2 px-5 py-2 rounded-full font-[family-name:var(--font-inter)] text-sm font-medium text-white overflow-hidden transition-all duration-500 hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.5)] hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #6366F1, #8B5CF6)",
                  backgroundSize: "200% 200%",
                  animation: "gradient-x 4s ease infinite",
                }}
              >
                <Rocket className="w-4 h-4" />
                Únete
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.1] transition-all duration-300"
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Animated gradient accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 flex flex-col items-center justify-center ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />

        {/* Decorative orbs */}
        <div
          className="absolute top-1/3 left-1/4 w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-violet-600/10 blur-[80px] sm:blur-[100px] pointer-events-none"
          style={{ animation: "float 20s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-indigo-600/10 blur-[60px] sm:blur-[80px] pointer-events-none"
          style={{ animation: "float-reverse 25s ease-in-out infinite" }}
        />

        <div className="relative z-10 flex flex-col items-center gap-5 sm:gap-8">
          {NAV_LINKS.map((link, idx) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className="font-[family-name:var(--font-inter)] text-2xl sm:text-3xl font-light text-white/50 hover:text-white transition-all duration-500"
              style={{
                transitionDelay: isOpen ? `${idx * 80}ms` : "0ms",
                transform: isOpen ? "translateY(0)" : "translateY(20px)",
                opacity: isOpen ? undefined : 0,
              }}
            >
              {link.label}
            </button>
          ))}

          {/* Mobile CTA */}
          <button
            onClick={() => handleNav("contacto")}
            className="mt-4 flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full font-[family-name:var(--font-inter)] text-base sm:text-lg font-medium text-white whitespace-nowrap transition-all duration-500"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #6366F1, #8B5CF6)",
              transitionDelay: isOpen ? `${NAV_LINKS.length * 80}ms` : "0ms",
              transform: isOpen ? "translateY(0)" : "translateY(20px)",
              opacity: isOpen ? undefined : 0,
            }}
          >
            <Rocket className="w-5 h-5" />
            Únete
          </button>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="relative z-10 mt-12 w-14 h-14 flex items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white hover:border-white/20 transition-all duration-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
