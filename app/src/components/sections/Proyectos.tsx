"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Telescope, BookOpen, Users, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const proyectosData = [
  {
    icon: Telescope,
    title: "Noches de Observación",
    desc: "Sesiones regulares con telescopios para explorar planetas, nebulosas y galaxias distantes.",
    color: "from-blue-600/20 via-cyan-500/10 to-transparent",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
    accent: "bg-blue-500"
  },
  {
    icon: BookOpen,
    title: "Talleres Educativos",
    desc: "Formación en astronomía básica, astrofotografía y ciencias del espacio para todos.",
    color: "from-purple-600/20 via-pink-500/10 to-transparent",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    accent: "bg-purple-500"
  },
  {
    icon: Users,
    title: "Divulgación Comunitaria",
    desc: "Charlas y eventos abiertos en espacios públicos para acercar la ciencia a nuestra comunidad.",
    color: "from-amber-600/20 via-orange-500/10 to-transparent",
    border: "border-orange-500/30",
    iconColor: "text-orange-400",
    accent: "bg-orange-500"
  }
];

export default function Proyectos() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Cards stagger animation
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="proyectos"
      ref={sectionRef}
      className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl w-full relative z-10">
        <div ref={titleRef} className="text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-[family-name:var(--font-orbitron)] tracking-[0.2em] uppercase">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Exploración Continua</span>
          </div>

          <h2 className="font-[family-name:var(--font-orbitron)] text-5xl md:text-7xl font-bold text-white tracking-tight leading-none">
            Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">Proyectos</span>
          </h2>

          <p className="font-[family-name:var(--font-inter)] text-white/40 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            Iniciativas diseñadas para conectar la curiosidad humana con las maravillas infinitas del universo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {proyectosData.map((proy, idx) => (
            <div
              key={idx}
              ref={(el) => { if (el) cardsRef.current[idx] = el; }}
              className="group relative h-full"
            >
              {/* Card Glow Effect */}
              <div className={`absolute -inset-[1px] bg-gradient-to-b ${proy.color.replace('/20', '/40')} rounded-[2rem] blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className={`relative h-full flex flex-col bg-[#080808] border ${proy.border} rounded-[2rem] p-8 md:p-10 overflow-hidden transition-all duration-500 group-hover:translate-y-[-8px] group-hover:bg-[#0c0c0c]`}>

                {/* Accent line */}
                <div className={`absolute top-0 left-0 w-full h-[2px] ${proy.accent} opacity-30 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="mb-10 relative">
                  <div className={`w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                    <proy.icon className={`w-8 h-8 ${proy.iconColor}`} strokeWidth={1.5} />
                  </div>
                  {/* Subtle radial glow behind icon */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 ${proy.accent} rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity`} />
                </div>

                <h3 className="font-[family-name:var(--font-orbitron)] text-2xl font-bold text-white mb-4 tracking-wide group-hover:text-blue-100 transition-colors">
                  {proy.title}
                </h3>

                <p className="font-[family-name:var(--font-inter)] text-white/50 leading-relaxed font-light text-lg mb-8 flex-grow">
                  {proy.desc}
                </p>

                <div className="flex items-center gap-2 text-white/30 font-[family-name:var(--font-orbitron)] text-[10px] tracking-[0.3em] uppercase group-hover:text-white/60 transition-colors">
                  <div className={`w-1 h-1 rounded-full ${proy.accent}`} />
                  <span>Cala Project ID: {2024 + idx}</span>
                </div>

                {/* Decorative border reveal */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/[0.02] to-transparent rounded-full translate-x-16 translate-y-16 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
