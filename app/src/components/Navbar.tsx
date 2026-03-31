"use client";

import { useState, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "./SmoothScroll";

const NAV_LINKS = [
  { label: "Nosotros", id: "sobre-nosotros", symbol: "◐" },
  { label: "Fundadores", id: "fundadores", symbol: "✦" },
  { label: "Proyectos", id: "proyectos", symbol: "◈" },
  { label: "Contacto", id: "contacto", symbol: "◉" },
] as const;

const SOBRE_NOSOTROS_PROGRESS = 54 / 80;

let _isNavigating = false;
export function getIsNavigating() {
  return _isNavigating;
}

export default function Navbar({ visible }: { visible: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Track active section
  useEffect(() => {
    const handleScroll = () => {
      const triggers = ScrollTrigger.getAll();
      const mainTrigger = triggers.find((t) => t.pin);
      if (mainTrigger) {
        const progress = mainTrigger.progress;
        if (progress > 0.3 && progress < 0.85) {
          setActiveSection("sobre-nosotros");
          return;
        }
      }

      const sections = NAV_LINKS.map((l) => ({
        id: l.id,
        el: document.getElementById(l.id),
      })).filter((s) => s.el);

      for (const section of sections.reverse()) {
        if (!section.el) continue;
        const rect = section.el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5) {
          setActiveSection(section.id);
          return;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      {/* ── Hamburger Button (fixed, top-right) ── */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-6 right-6 z-50 w-12 h-12 flex items-center justify-center transition-all duration-700 ${
          visible && !isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90 pointer-events-none"
        }`}
        aria-label="Open Menu"
      >
        {/* Outer orbital ring */}
        <div className="absolute inset-0 rounded-full border border-white/[0.08] hover:border-violet-400/30 transition-all duration-500" />
        <div
          className="absolute inset-[-4px] rounded-full border border-white/[0.03] hover:border-violet-400/10 transition-all duration-700"
          style={{ animation: "spin-ring 20s linear infinite", "--tilt": "0deg" } as React.CSSProperties}
        />

        {/* Glass background */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        />

        {/* Hamburger lines */}
        <div className="relative flex flex-col items-center gap-[5px]">
          <span className="block w-[18px] h-px bg-white/70" />
          <span className="block w-[12px] h-px bg-white/40" />
          <span className="block w-[18px] h-px bg-white/70" />
        </div>
      </button>

      {/* ── Fullscreen Menu Overlay ── */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-700 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, rgba(15,5,30,0.98) 0%, rgba(0,0,0,0.99) 70%)",
          }}
        />

        {/* Cosmic dust */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 15% 25%, rgba(167,139,250,0.6), transparent),
              radial-gradient(1px 1px at 45% 15%, white, transparent),
              radial-gradient(1.5px 1.5px at 75% 55%, rgba(251,191,36,0.5), transparent),
              radial-gradient(1px 1px at 25% 75%, white, transparent),
              radial-gradient(1px 1px at 85% 35%, rgba(167,139,250,0.4), transparent),
              radial-gradient(1px 1px at 55% 85%, white, transparent),
              radial-gradient(1px 1px at 35% 45%, rgba(251,191,36,0.3), transparent),
              radial-gradient(1.5px 1.5px at 65% 25%, white, transparent)
            `,
            backgroundSize: "300px 300px",
            animation: "twinkle 4s ease-in-out infinite alternate",
          }}
        />

        {/* Ambient glow */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)",
            animation: "float 20s ease-in-out infinite",
          }}
        />

        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className={`absolute top-6 right-6 z-20 w-12 h-12 flex items-center justify-center rounded-full border border-white/[0.08] hover:border-violet-400/30 transition-all duration-500 ${
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
          style={{
            transitionDelay: isOpen ? "300ms" : "0ms",
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(12px)",
          }}
          aria-label="Close Menu"
        >
          <div className="relative w-5 h-5">
            <span className="absolute top-1/2 left-0 w-full h-px bg-white/60 rotate-45" />
            <span className="absolute top-1/2 left-0 w-full h-px bg-white/60 -rotate-45" />
          </div>
        </button>

        {/* Navigation content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
          {/* Logo at top */}
          <div
            className="absolute top-7 left-6 transition-all duration-700"
            style={{
              transitionDelay: isOpen ? "100ms" : "0ms",
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateY(0)" : "translateY(-10px)",
            }}
          >
            <button
              onClick={() => {
                setIsOpen(false);
                const lenis = getLenis();
                if (lenis) lenis.scrollTo(0, { duration: 2 });
              }}
              className="font-[family-name:var(--font-orbitron)] text-[13px] font-semibold tracking-[0.3em] text-white/60 hover:text-white transition-colors duration-500"
            >
              CALA
            </button>
          </div>

          {/* Section links */}
          <div className="flex flex-col items-center gap-1">
            {NAV_LINKS.map((link, idx) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className="group relative py-5 px-8 transition-all duration-700"
                  style={{
                    transitionDelay: isOpen ? `${150 + idx * 70}ms` : "0ms",
                    transform: isOpen ? "translateY(0)" : "translateY(40px)",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  {/* Active background pill */}
                  {isActive && (
                    <div
                      className="absolute inset-x-2 inset-y-1 rounded-2xl border border-violet-500/10"
                      style={{
                        background: "rgba(167,139,250,0.04)",
                        animation: "glow-pulse 3s ease-in-out infinite",
                      }}
                    />
                  )}

                  <div className="relative flex items-center gap-5">
                    {/* Symbol */}
                    <span
                      className={`text-base transition-all duration-500 ${
                        isActive
                          ? "text-violet-400"
                          : "text-white/10 group-hover:text-white/30"
                      }`}
                    >
                      {link.symbol}
                    </span>

                    {/* Label */}
                    <span
                      className={`font-[family-name:var(--font-orbitron)] text-xl sm:text-2xl tracking-[0.2em] transition-all duration-500 ${
                        isActive
                          ? "text-white"
                          : "text-white/25 group-hover:text-white/70"
                      }`}
                    >
                      {link.label.toUpperCase()}
                    </span>

                    {/* Active indicator dot */}
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Coordinates decoration */}
          <p
            className="mt-20 font-[family-name:var(--font-inter)] text-[10px] tracking-[0.3em] text-white/8 transition-all duration-700"
            style={{
              transitionDelay: isOpen
                ? `${350 + NAV_LINKS.length * 70}ms`
                : "0ms",
              opacity: isOpen ? 1 : 0,
            }}
          >
            18.4861° N · 69.9312° W
          </p>
        </div>
      </div>
    </>
  );
}
