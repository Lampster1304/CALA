"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { User, Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Fundadores() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    gsap.set(content, { opacity: 0, y: 60 });

    const ctx = gsap.context(() => {
      gsap.to(content, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 30%",
          scrub: 0.5,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="fundadores"
      ref={sectionRef}
      className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden py-32"
    >
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div
        ref={contentRef}
        className="max-w-5xl w-full mx-auto relative z-10"
      >
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-[family-name:var(--font-orbitron)] text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Fundadores</span>
          </h2>
          <p className="font-[family-name:var(--font-inter)] text-white/50 uppercase tracking-[0.2em] text-sm font-medium">
            Los pioneros de nuestro viaje cósmico
          </p>
        </div>

        <div className="glass-card p-[1px] max-w-4xl mx-auto shadow-2xl relative group rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 opacity-20 group-hover:opacity-50 transition-opacity duration-700 rounded-3xl" />

          <div className="relative bg-[#050505]/90 backdrop-blur-2xl rounded-3xl p-8 md:p-14 flex flex-col sm:flex-row gap-8 md:gap-12 items-center sm:items-start border border-white/5">

            {/* Avatar Section */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center p-[2px] border border-white/10 shadow-[0_0_40px_rgba(168,85,247,0.15)] group-hover:shadow-[0_0_60px_rgba(168,85,247,0.3)] transition-shadow duration-500">
                <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center overflow-hidden">
                  <User className="w-16 h-16 md:w-20 md:h-20 text-white/10" strokeWidth={1} />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center border-[4px] border-[#0a0a0a] text-white shadow-xl transform transition-transform group-hover:scale-110 duration-300">
                <Quote className="w-5 h-5 md:w-6 md:h-6 fill-white/20" />
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 text-center sm:text-left space-y-6 pt-2">
              <div className="space-y-2">
                <h3 className="font-[family-name:var(--font-orbitron)] text-2xl md:text-4xl font-bold text-white tracking-wide">
                  Don Eddy Martínez
                </h3>
                <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 text-purple-300 text-xs md:text-sm font-[family-name:var(--font-inter)] tracking-widest uppercase font-medium">
                  Fundador Visionario
                </div>
              </div>

              <div className="relative pt-4 pb-2">
                <Quote className="w-12 h-12 text-white/5 absolute -top-4 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:-left-4 pointer-events-none transform -scale-x-100" />
                <p className="font-[family-name:var(--font-inter)] text-lg md:text-xl text-white/90 leading-relaxed font-light relative z-10 italic">
                  "Visionario y apasionado por la astronomía, Don Eddy fundó CALA con la misión de inspirar a las nuevas generaciones a mirar hacia las estrellas y descubrir los misterios del universo."
                </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

              <p className="font-[family-name:var(--font-inter)] text-sm md:text-base text-white/50 leading-relaxed font-light">
                Su dedicación y liderazgo han sido la fuerza motriz detrás de cada observación, cada taller y cada momento de asombro compartido en nuestra comunidad a lo largo de los años.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
