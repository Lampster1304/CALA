"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Send } from "lucide-react";
import {
  initSpaceAudio,
  playWhoosh,
  playLineDraw,
  playShimmer,
  playPop,
  playSoftTone,
} from "@/lib/spaceAudio";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────── */
/*  Minimal underline field                   */
/* ────────────────────────────────────────── */
function FormField({
  label,
  placeholder,
  type = "text",
  textarea = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  textarea?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  const inputClass =
    "w-full bg-transparent text-white font-[family-name:var(--font-inter)] text-[15px] font-light outline-none placeholder:text-white/20 caret-violet-400 pb-3 pt-1";

  return (
    <div className="relative">
      {/* Label */}
      <label className="block font-[family-name:var(--font-inter)] text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
        {label}
      </label>

      {textarea ? (
        <textarea
          rows={3}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={inputClass}
        />
      )}

      {/* Bottom line — static */}
      <div className="h-px w-full bg-white/[0.1]" />

      {/* Bottom line — animated accent on focus */}
      <div
        className={`absolute bottom-0 left-0 h-px bg-gradient-to-r from-violet-500 to-amber-400 transition-all duration-500 ease-out ${
          focused ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
      />
    </div>
  );
}

/* ────────────────────────────────────────── */
/*  Main Contacto Component                   */
/* ────────────────────────────────────────── */
export default function Contacto() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerLinesRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const cardBorderRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const planetRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const footerLineRef = useRef<HTMLDivElement>(null);

  const [year, setYear] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setYear(new Date().getFullYear());
    initSpaceAudio();
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      /* 1. Parallax on background planet image */
      if (planetRef.current) {
        gsap.fromTo(
          planetRef.current,
          { yPercent: 0 },
          {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      /* 2. Header children stagger (existing, preserved) */
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            onStart: () => playWhoosh(),
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      /* 2b. Header decorative lines draw-in */
      if (headerLinesRef.current) {
        const lines = headerLinesRef.current.querySelectorAll(".header-line");
        gsap.fromTo(
          lines,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            onStart: () => playLineDraw(),
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      /* 3. Orbs parallax on scroll */
      if (orbsRef.current) {
        const orbs = orbsRef.current.children;
        if (orbs[0]) {
          gsap.fromTo(
            orbs[0],
            { yPercent: 0 },
            {
              yPercent: -25,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
        if (orbs[1]) {
          gsap.fromTo(
            orbs[1],
            { yPercent: 0 },
            {
              yPercent: 20,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      }

      /* 4. Card gradient border reveal (before the card itself) */
      if (cardBorderRef.current) {
        gsap.fromTo(
          cardBorderRef.current,
          { opacity: 0, scale: 0.98 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            onStart: () => playShimmer(),
            scrollTrigger: {
              trigger: section,
              start: "top 58%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      /* 4b. Form card fade-in (existing, slightly delayed) */
      if (formCardRef.current) {
        gsap.fromTo(
          formCardRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            onStart: () => playWhoosh(),
            scrollTrigger: {
              trigger: section,
              start: "top 55%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      /* 5. Fields with alternating lateral stagger + 6. Button bounce */
      if (fieldsRef.current) {
        const children = gsap.utils.toArray<HTMLElement>(
          fieldsRef.current.children
        );
        const fieldItems = children.slice(0, -1); // all except the button wrapper
        const buttonWrapper = children[children.length - 1];

        fieldItems.forEach((el, i) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 25, x: i % 2 === 0 ? -20 : 20 },
            {
              opacity: 1,
              y: 0,
              x: 0,
              duration: 0.6,
              delay: i * 0.08,
              ease: "power2.out",
              onStart: i === 0 ? () => playSoftTone() : undefined,
              scrollTrigger: {
                trigger: section,
                start: "top 45%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        if (buttonWrapper) {
          gsap.fromTo(
            buttonWrapper,
            { opacity: 0, y: 25, scale: 1.08 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              delay: fieldItems.length * 0.08 + 0.1,
              ease: "back.out(1.7)",
              onStart: () => playPop(),
              scrollTrigger: {
                trigger: section,
                start: "top 45%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }

      /* 7. Footer line draw + text fade */
      if (footerLineRef.current) {
        gsap.fromTo(
          footerLineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            ease: "power3.out",
            onStart: () => playLineDraw(),
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (footerRef.current) {
        const footerText = footerRef.current.querySelector(".footer-text");
        if (footerText) {
          gsap.fromTo(
            footerText,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: 0.3,
              ease: "power2.out",
              onStart: () => playSoftTone(),
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (sending || sent) return;
      setSending(true);
      setTimeout(() => {
        setSending(false);
        setSent(true);
        setTimeout(() => setSent(false), 4000);
      }, 2000);
    },
    [sending, sent],
  );

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Planet background image */}
      <div ref={planetRef} className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1920&q=80"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
      </div>

      {/* Dark overlays for readability */}
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

      {/* Subtle ambient glow */}
      <div ref={orbsRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[30%] left-[20%] w-[180px] h-[180px] sm:w-[300px] sm:h-[300px] rounded-full bg-violet-600/[0.08] blur-[80px] sm:blur-[130px]"
          style={{ animation: "float 20s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[20%] right-[15%] w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] rounded-full bg-indigo-600/[0.06] blur-[80px] sm:blur-[120px]"
          style={{ animation: "float-reverse 26s ease-in-out infinite" }}
        />
      </div>

      <div className="max-w-2xl w-full mx-auto relative z-10 px-4 sm:px-6 py-16 sm:py-24">
        {/* Header — centered */}
        <div ref={headerRef} className="text-center mb-14">
          <div ref={headerLinesRef} className="flex items-center gap-3 mb-5 justify-center">
            <div className="header-line h-px w-8 bg-gradient-to-r from-transparent to-violet-500 origin-right" />
            <p className="font-[family-name:var(--font-orbitron)] text-[11px] tracking-[0.3em] text-violet-400/80 uppercase">
              Contacto
            </p>
            <div className="header-line h-px w-8 bg-gradient-to-r from-violet-500 to-transparent origin-left" />
          </div>
          <h2 className="font-[family-name:var(--font-orbitron)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight">
            <span className="text-white">Envíanos un</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-white to-amber-400">
              mensaje
            </span>
          </h2>
          <p className="font-[family-name:var(--font-inter)] text-white/50 text-base sm:text-lg font-light mt-5 text-center">
            ¿Tienes preguntas sobre el cosmos o quieres ser parte de nuestra comunidad?
          </p>
        </div>

        {/* Form card */}
        <div ref={formCardRef}>
          <div ref={cardBorderRef} className="rounded-3xl p-px bg-gradient-to-b from-violet-500/20 via-white/[0.06] to-amber-500/10">
            <div
              className="rounded-3xl backdrop-blur-2xl px-5 sm:px-8 md:px-12 py-8 sm:py-10 md:py-14"
              style={{ background: "rgba(5, 2, 20, 0.65)" }}
            >
              <form onSubmit={handleSubmit}>
                <div ref={fieldsRef} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <FormField label="Nombre" placeholder="" />
                    <FormField label="Email" placeholder="" type="email" />
                  </div>

                  <FormField label="Asunto" placeholder="" />

                  <FormField
                    label="Mensaje"
                    placeholder=""
                    textarea
                  />

                  {/* Submit button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={sending || sent}
                      className="group relative w-full cursor-pointer disabled:cursor-default"
                    >
                      {/* Outer glow */}
                      <div
                        className={`absolute -inset-px rounded-2xl blur-md transition-opacity duration-700 ${
                          sent
                            ? "bg-emerald-500/30 opacity-100"
                            : "bg-violet-500/25 opacity-0 group-hover:opacity-100"
                        }`}
                      />

                      {/* Button body */}
                      <div
                        className={`
                          relative rounded-2xl px-8 py-4 overflow-hidden
                          transition-all duration-500
                          ${sent ? "" : "group-hover:scale-[1.01] group-active:scale-[0.99]"}
                        `}
                        style={{
                          background: sent
                            ? "linear-gradient(135deg, #059669, #10B981, #34D399)"
                            : "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(99,102,241,0.1))",
                          border: sent
                            ? "1px solid rgba(16,185,129,0.3)"
                            : "1px solid rgba(139,92,246,0.2)",
                        }}
                      >
                        {/* Shine sweep */}
                        {!sent && !sending && (
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                            <div
                              className="absolute inset-0"
                              style={{
                                background:
                                  "linear-gradient(105deg, transparent 35%, rgba(139,92,246,0.1) 45%, rgba(255,255,255,0.05) 50%, transparent 60%)",
                                backgroundSize: "250% 100%",
                                animation: "gradient-x 3s ease infinite",
                              }}
                            />
                          </div>
                        )}

                        <span className="relative z-10 flex items-center justify-center gap-3 font-[family-name:var(--font-inter)] text-sm tracking-[0.15em] uppercase">
                          {sent ? (
                            <>
                              <Check className="w-5 h-5 text-white" />
                              <span className="text-white font-medium">Mensaje Enviado</span>
                            </>
                          ) : sending ? (
                            <>
                              <svg className="animate-spin w-5 h-5 text-violet-300" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span className="text-white/70 font-medium">Enviando</span>
                            </>
                          ) : (
                            <>
                              <span className="text-white/80 font-medium group-hover:text-white transition-colors duration-300">Enviar Mensaje</span>
                              <Send className="w-4 h-4 text-violet-400 group-hover:text-violet-300 transition-all duration-500 group-hover:translate-x-1" />
                            </>
                          )}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div ref={footerRef} className="mt-16 pt-8 relative">
          <div ref={footerLineRef} className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/20 to-transparent mb-8 origin-center" />
          <div className="footer-text flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-[family-name:var(--font-inter)] text-sm text-white/30">
              &copy; {year || new Date().getFullYear()} Centro Astronómico Las Américas
            </p>
            <p className="font-[family-name:var(--font-inter)] text-xs text-white/20">
              Mirando hacia las estrellas desde Bogotá, Colombia
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
