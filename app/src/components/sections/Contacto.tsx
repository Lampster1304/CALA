"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import {
  initSpaceAudio,
  playWhoosh,
  playLineDraw,
  playShimmer,
  playPop,
  playSoftTone,
} from "@/lib/spaceAudio";

gsap.registerPlugin(ScrollTrigger);

const NEPTUNE = {
  bright: "#22D3EE",
  mid: "#0EA5E9",
  deep: "#0284C7",
  glow: "rgba(34,211,238,0.6)",
};

/* ────────────────────────────────────────── */
/*  Minimal Field                             */
/* ────────────────────────────────────────── */
function MinimalField({
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

  const baseClass =
    "w-full bg-transparent text-white font-[family-name:var(--font-inter)] text-base font-light outline-none placeholder:text-white/20 py-3";

  return (
    <div>
      <label
        className="block font-[family-name:var(--font-orbitron)] text-[9px] tracking-[0.3em] uppercase mb-3 transition-colors duration-500"
        style={{ color: focused ? NEPTUNE.bright : "rgba(255,255,255,0.35)" }}
      >
        {label}
      </label>

      {textarea ? (
        <textarea
          rows={3}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${baseClass} resize-none`}
          style={{ caretColor: NEPTUNE.bright }}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={baseClass}
          style={{ caretColor: NEPTUNE.bright }}
        />
      )}

      {/* Line */}
      <div className="relative h-px w-full bg-white/[0.08]">
        <div
          className="absolute inset-0 h-px transition-all duration-700 ease-out origin-left"
          style={{
            transform: `scaleX(${focused ? 1 : 0})`,
            background: `linear-gradient(90deg, ${NEPTUNE.bright}, ${NEPTUNE.deep}, transparent)`,
          }}
        />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────── */
/*  Main Contacto                             */
/* ────────────────────────────────────────── */
export default function Contacto() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerLinesRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const footerLineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [year, setYear] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setYear(new Date().getFullYear());
    initSpaceAudio();
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(contentRef.current.children, { opacity: 0, y: 50 }, {
          opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out",
          onStart: () => playWhoosh(),
          scrollTrigger: { trigger: section, start: "top 65%", toggleActions: "play none none reverse" },
        });
      }

      if (headerLinesRef.current) {
        const lines = headerLinesRef.current.querySelectorAll(".header-line");
        gsap.fromTo(lines, { scaleX: 0 }, {
          scaleX: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
          onStart: () => playLineDraw(),
          scrollTrigger: { trigger: section, start: "top 65%", toggleActions: "play none none reverse" },
        });
      }

      if (orbsRef.current) {
        const orbs = orbsRef.current.children;
        if (orbs[0]) gsap.fromTo(orbs[0], { yPercent: 0 }, { yPercent: -25, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } });
        if (orbs[1]) gsap.fromTo(orbs[1], { yPercent: 0 }, { yPercent: 20, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } });
      }

      if (fieldsRef.current) {
        const children = gsap.utils.toArray<HTMLElement>(fieldsRef.current.children);
        const fieldItems = children.slice(0, -1);
        const buttonWrapper = children[children.length - 1];

        fieldItems.forEach((el, i) => {
          gsap.fromTo(el, { opacity: 0, y: 25 }, {
            opacity: 1, y: 0, duration: 0.6, delay: i * 0.1, ease: "power2.out",
            onStart: i === 0 ? () => playSoftTone() : undefined,
            scrollTrigger: { trigger: section, start: "top 50%", toggleActions: "play none none reverse" },
          });
        });

        if (buttonWrapper) {
          gsap.fromTo(buttonWrapper, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.7, delay: fieldItems.length * 0.1, ease: "back.out(1.7)",
            onStart: () => playPop(),
            scrollTrigger: { trigger: section, start: "top 50%", toggleActions: "play none none reverse" },
          });
        }
      }

      if (footerLineRef.current) {
        gsap.fromTo(footerLineRef.current, { scaleX: 0 }, {
          scaleX: 1, duration: 1, ease: "power3.out",
          onStart: () => playLineDraw(),
          scrollTrigger: { trigger: footerRef.current, start: "top 90%", toggleActions: "play none none reverse" },
        });
      }

      if (footerRef.current) {
        const footerText = footerRef.current.querySelector(".footer-text");
        if (footerText) {
          gsap.fromTo(footerText, { opacity: 0, y: 15 }, {
            opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out",
            onStart: () => playSoftTone(),
            scrollTrigger: { trigger: footerRef.current, start: "top 90%", toggleActions: "play none none reverse" },
          });
        }
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (sending || sent) return;
      playShimmer();
      setSending(true);
      setTimeout(() => {
        setSending(false);
        setSent(true);
        setTimeout(() => setSent(false), 4000);
      }, 2000);
    },
    [sending, sent]
  );

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center relative overflow-hidden"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* ── Background ── */}
      <div className="absolute inset-0">
        <Image src="/images/neptune-bg.jpg" alt="" fill className="object-cover" sizes="100vw" priority={false} />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black/70" />
      </div>

      {/* Ambient orbs */}
      <div ref={orbsRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[8%] w-[300px] h-[300px] rounded-full blur-[150px]" style={{ background: `${NEPTUNE.deep}08`, animation: "float 22s ease-in-out infinite" }} />
        <div className="absolute bottom-[15%] right-[8%] w-[250px] h-[250px] rounded-full blur-[120px]" style={{ background: `${NEPTUNE.mid}06`, animation: "float-reverse 28s ease-in-out infinite" }} />
      </div>

      {/* ── Content — centered, no card ── */}
      <div className="max-w-xl w-full mx-auto relative z-10 px-6 py-20 sm:py-28">
        <div ref={contentRef}>
          {/* Header */}
          <div ref={headerLinesRef} className="flex items-center gap-3 mb-6">
            <div className="header-line h-px w-8 origin-left" style={{ background: `linear-gradient(to right, ${NEPTUNE.mid}, transparent)` }} />
            <span className="font-[family-name:var(--font-orbitron)] text-[9px] tracking-[0.35em] uppercase" style={{ color: `${NEPTUNE.bright}88` }}>
              Contacto
            </span>
            <div className="header-line h-px w-8 origin-left" style={{ background: `linear-gradient(to left, ${NEPTUNE.mid}60, transparent)` }} />
          </div>

          <h2
            ref={headerRef}
            className="font-[family-name:var(--font-orbitron)] text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight mb-4"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}
          >
            <span className="text-white">Envíanos un </span>
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, ${NEPTUNE.bright}, ${NEPTUNE.mid})` }}>
              mensaje
            </span>
          </h2>

          <p className="font-[family-name:var(--font-inter)] text-white/45 text-sm font-light leading-relaxed mb-14" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
            ¿Tienes preguntas sobre el cosmos o quieres ser parte de nuestra comunidad?
          </p>
        </div>

        {/* Form — clean, no box */}
        <form onSubmit={handleSubmit}>
          <div ref={fieldsRef} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <MinimalField label="Nombre" placeholder="Tu nombre" />
              <MinimalField label="Email" placeholder="correo@dominio.com" type="email" />
            </div>

            <MinimalField label="Asunto" placeholder="Asunto de tu mensaje" />
            <MinimalField label="Mensaje" placeholder="Escribe tu mensaje aquí..." textarea />

            {/* Submit */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={sending || sent}
                className="group relative cursor-pointer disabled:cursor-default"
              >
                <span className="flex items-center gap-3">
                  {sent ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 8px rgba(52,211,153,0.5)" }} />
                      <span className="font-[family-name:var(--font-orbitron)] text-[11px] tracking-[0.25em] text-emerald-300 uppercase">
                        Mensaje Enviado
                      </span>
                    </>
                  ) : sending ? (
                    <>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ border: `1px solid ${NEPTUNE.mid}50`, borderTopColor: NEPTUNE.bright, animation: "spin 1s linear infinite" }}
                      />
                      <span className="font-[family-name:var(--font-orbitron)] text-[11px] tracking-[0.25em] text-white/50 uppercase">
                        Enviando
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="font-[family-name:var(--font-orbitron)] text-[11px] tracking-[0.25em] uppercase transition-colors duration-500"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        Enviar
                      </span>
                      <ArrowUpRight
                        className="w-4 h-4 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        style={{ color: NEPTUNE.bright }}
                      />
                    </>
                  )}
                </span>

                {/* Underline on hover */}
                <div className="mt-2 h-px w-full bg-white/[0.06] relative">
                  <div
                    className="absolute inset-0 h-px origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100"
                    style={{ background: `linear-gradient(90deg, ${NEPTUNE.bright}, transparent)` }}
                  />
                </div>
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div ref={footerRef} className="mt-20 pt-6 relative">
          <div ref={footerLineRef} className="h-px w-full mb-6 origin-center" style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)` }} />
          <div className="footer-text flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-[family-name:var(--font-inter)] text-[12px] text-white/25">
              &copy; {year || new Date().getFullYear()} Centro Astronómico Las Américas
            </p>
            <p className="font-[family-name:var(--font-inter)] text-[10px] text-white/15 tracking-wide">
              18.4861° N · 69.9312° W
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
