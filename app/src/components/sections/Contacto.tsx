"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────── */
/*  Form Field — glass style with focus glow  */
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
  const baseClass =
    "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm font-[family-name:var(--font-inter)] px-5 py-4 outline-none placeholder:text-white/25 transition-all duration-300 hover:bg-white/[0.06] focus:border-violet-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_-5px_rgba(139,92,246,0.15)]";

  return (
    <div>
      <label className="block font-[family-name:var(--font-inter)] text-sm text-white/50 mb-2.5">
        {label}
      </label>
      {textarea ? (
        <textarea
          rows={4}
          placeholder={placeholder}
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────── */
/*  Info Card — glass panel with accent       */
/* ────────────────────────────────────────── */
function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden group hover:bg-white/[0.05] transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-violet-500/30 via-indigo-500/15 to-transparent" />
      <h3 className="font-[family-name:var(--font-inter)] text-sm font-semibold text-white mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ────────────────────────────────────────── */
/*  Main Contacto Component                   */
/* ────────────────────────────────────────── */
export default function Contacto() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);

  const [year, setYear] = useState<number | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setYear(new Date().getFullYear());
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
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
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (infoPanelRef.current) {
        gsap.fromTo(
          infoPanelRef.current.children,
          { opacity: 0, x: -30, y: 20 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 55%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (formCardRef.current) {
        gsap.fromTo(
          formCardRef.current,
          { opacity: 0, x: 40, scale: 0.97 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 55%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (fieldsRef.current) {
        gsap.fromTo(
          fieldsRef.current.children,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 45%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (sending) return;
      setSending(true);
      setTimeout(() => setSending(false), 2500);
    },
    [sending],
  );

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden"
      style={{
        scrollSnapAlign: "start",
        background:
          "linear-gradient(180deg, #000 0%, #030014 25%, #0a0118 50%, #060012 80%, #000 100%)",
      }}
    >
      {/* Animated ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-violet-600/[0.06] blur-[150px]"
          style={{ animation: "float 20s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[15%] right-[15%] w-[350px] h-[350px] rounded-full bg-indigo-600/[0.05] blur-[130px]"
          style={{ animation: "float-reverse 26s ease-in-out infinite" }}
        />
        <div
          className="absolute top-[50%] right-[40%] w-[200px] h-[200px] rounded-full bg-amber-500/[0.03] blur-[100px]"
          style={{ animation: "float 18s ease-in-out infinite 3s" }}
        />
      </div>

      <div className="max-w-6xl w-full mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="mb-14 md:mb-18">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-gradient-to-r from-violet-500 to-transparent" />
            <p className="font-[family-name:var(--font-orbitron)] text-[11px] tracking-[0.3em] text-violet-400/80 uppercase">
              Contacto
            </p>
          </div>
          <h2 className="font-[family-name:var(--font-orbitron)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
            <span className="text-white">Envíanos un</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-white to-amber-400">
              mensaje
            </span>
          </h2>
          <p className="font-[family-name:var(--font-inter)] text-white/50 text-lg font-light mt-5 max-w-xl">
            ¿Tienes preguntas sobre el cosmos o quieres ser parte de nuestra comunidad? Escríbenos.
          </p>
        </div>

        {/* Two-column: info (2/5) + form (3/5) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-14">
          {/* Info panel */}
          <div ref={infoPanelRef} className="lg:col-span-2 space-y-5">
            <InfoCard title="Ubicación">
              <p className="font-[family-name:var(--font-inter)] text-sm text-white/50 leading-relaxed">
                Bogotá, Colombia
                <br />
                <span className="text-white/30">4.6097° N · 74.0817° W</span>
              </p>
            </InfoCard>

            <InfoCard title="Redes Sociales">
              <div className="flex flex-col gap-2">
                {[
                  { name: "Facebook", url: "https://facebook.com" },
                  { name: "Twitter", url: "https://twitter.com" },
                  { name: "YouTube", url: "https://youtube.com" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-[family-name:var(--font-inter)] text-sm text-white/50 hover:text-violet-400 transition-colors duration-300"
                  >
                    {social.name} &rarr;
                  </a>
                ))}
              </div>
            </InfoCard>

            <InfoCard title="Horario de Observación">
              <p className="font-[family-name:var(--font-inter)] text-sm text-white/50 leading-relaxed">
                Viernes y sábados
                <br />
                7:00 PM — 11:00 PM
              </p>
            </InfoCard>
          </div>

          {/* Form in gradient-bordered glass card */}
          <div ref={formCardRef} className="lg:col-span-3">
            <div className="rounded-2xl bg-gradient-to-b from-violet-500/20 via-white/[0.06] to-amber-500/10 p-px">
              <div
                className="rounded-2xl backdrop-blur-xl p-6 sm:p-8"
                style={{ background: "rgba(5, 2, 20, 0.85)" }}
              >
                <form onSubmit={handleSubmit}>
                  <div ref={fieldsRef} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Nombre" placeholder="Tu nombre" />
                      <FormField
                        label="Email"
                        placeholder="tu@email.com"
                        type="email"
                      />
                    </div>

                    <FormField
                      label="Asunto"
                      placeholder="¿De qué quieres hablar?"
                    />

                    <FormField
                      label="Mensaje"
                      placeholder="Escribe tu mensaje aquí..."
                      textarea
                    />

                    {/* Animated gradient button */}
                    <button
                      type="submit"
                      disabled={sending}
                      className="group relative w-full mt-3 px-8 py-4 rounded-xl font-[family-name:var(--font-inter)] font-medium text-sm text-white overflow-hidden transition-all duration-500 disabled:opacity-50 hover:shadow-[0_0_40px_-8px_rgba(139,92,246,0.4)]"
                      style={{
                        background:
                          "linear-gradient(135deg, #7C3AED, #6366F1, #8B5CF6, #A78BFA)",
                        backgroundSize: "300% 300%",
                        animation: "gradient-x 4s ease infinite",
                      }}
                    >
                      <span className="relative z-10">
                        {sending ? "Enviando..." : "Enviar Mensaje"}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 relative">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/20 to-transparent mb-8" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-[family-name:var(--font-inter)] text-sm text-white/30">
              &copy; {year || new Date().getFullYear()} Centro Astronómico Las
              Américas
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
