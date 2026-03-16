"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Instagram, MapPin, Send, MessageSquare } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Contacto() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(content,
        { opacity: 0, scale: 0.9, y: 60 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="min-h-screen bg-black flex items-center justify-center px-6 py-24 relative overflow-hidden"
    >
      {/* Background Starfield Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-blue-900/5 rounded-full blur-[180px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div
        ref={contentRef}
        className="max-w-6xl w-full mx-auto relative z-10"
      >
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-[family-name:var(--font-orbitron)] tracking-[0.3em] uppercase mx-auto">
            <MessageSquare className="w-3 h-3" />
            <span>Contacto Directo</span>
          </div>
          <h2 className="font-[family-name:var(--font-orbitron)] text-5xl md:text-7xl font-bold text-white tracking-tight">
            Se Parte del <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Viaje</span>
          </h2>
        </div>

        <div className="glass-card rounded-[3rem] border border-white/5 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] relative bg-[#050505]/40 backdrop-blur-2xl">

          {/* Internal Glows */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]" />

          <div className="flex flex-col lg:flex-row min-h-[600px]">

            {/* Left Column: Connect */}
            <div className="flex-1 p-10 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5">
              <div className="space-y-12">
                <div>
                  <h3 className="font-[family-name:var(--font-orbitron)] text-2xl font-bold text-white mb-6 tracking-wide">
                    Conectar con CALA
                  </h3>
                  <p className="font-[family-name:var(--font-inter)] text-lg text-white/40 leading-relaxed font-light">
                    Estamos aquí para responder tus dudas sobre el cosmos, membresías o eventos próximos.
                  </p>
                </div>

                <div className="space-y-6">
                  <a href="mailto:contacto@calastronomia.org" className="group flex items-center gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                    <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-inter)] text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Email Oficial</p>
                      <p className="font-[family-name:var(--font-inter)] text-lg text-white/80 group-hover:text-white transition-colors">contacto@calastronomia.org</p>
                    </div>
                  </a>

                  <a href="https://instagram.com/calastronomia" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                    <div className="w-14 h-14 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                      <Instagram className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-inter)] text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Instagram</p>
                      <p className="font-[family-name:var(--font-inter)] text-lg text-white/80 group-hover:text-white transition-colors">@calastronomia</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/[0.01] border border-transparent">
                    <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-white/30">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-inter)] text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Ubicación</p>
                      <p className="font-[family-name:var(--font-inter)] text-lg text-white/50 italic">La Paz, Bolivia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Component */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-black/40 p-16">

              {/* Dynamic Abstract Visual */}
              <div className="relative w-full aspect-square max-w-[320px]">
                <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-[spin_60s_linear_infinite]" />
                <div className="absolute inset-[15%] rounded-full border border-dashed border-white/10 animate-[spin_40s_linear_infinite_reverse]" />
                <div className="absolute inset-[30%] rounded-full border border-indigo-500/20 animate-[spin_20s_linear_infinite]" />

                {/* Core pulse */}
                <div className="absolute inset-[40%] rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 blur-md opacity-20 animate-pulse" />
                <div className="absolute inset-[44%] rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl">
                  <Send className="w-12 h-12 text-white/40 group-hover:text-white transition-colors animate-bounce" style={{ animationDuration: '3s' }} strokeWidth={1} />
                </div>

                {/* Satellite dots */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] animate-[spin_10s_linear_infinite] origin-[50%_160px]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_#818cf8] animate-[spin_15s_linear_infinite_reverse] origin-[50%_-160px]" />
              </div>

              {/* Decorative text */}
              <div className="absolute bottom-8 right-8 text-right hidden md:block">
                <p className="font-[family-name:var(--font-orbitron)] text-[10px] text-white/20 tracking-[0.5em] uppercase">Status: Online</p>
                <p className="font-[family-name:var(--font-orbitron)] text-[10px] text-white/10 tracking-[0.5em] uppercase">Link: Active</p>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Footer Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-20 px-4 space-y-6 md:space-y-0">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent max-w-[200px] hidden md:block" />
          <p className="font-[family-name:var(--font-inter)] text-xs text-white/20 uppercase tracking-[0.4em] font-medium text-center">
            &copy; {new Date().getFullYear()} Club de Astronomía Las Américas <span className="mx-4 text-white/5 opacity-0 hidden md:inline">|</span> <br className="md:hidden" /> Divulgación Científica Regional
          </p>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-transparent max-w-[200px] hidden md:block" />
        </div>
      </div>
    </section>
  );
}
