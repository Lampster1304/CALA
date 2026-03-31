"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Telescope, GraduationCap, Megaphone } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const proyectosData = [
  {
    title: "Noches de Observación",
    desc: "Sesiones regulares con telescopios avanzados para explorar planetas, nebulosas y galaxias distantes del cielo nocturno.",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
    accent: "from-violet-500/40",
    badge: "Principal",
    icon: Telescope,
  },
  {
    title: "Talleres Educativos",
    desc: "Formación en astronomía, astrofotografía y ciencias espaciales para todas las edades.",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",
    accent: "from-indigo-500/40",
    badge: "Educación",
    icon: GraduationCap,
  },
  {
    title: "Divulgación Científica",
    desc: "Charlas y eventos interactivos para democratizar el acceso al conocimiento cósmico.",
    image: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=800&q=80",
    accent: "from-amber-500/30",
    badge: "Divulgación",
    icon: Megaphone,
  },
];

export default function Proyectos() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header stagger
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
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Cards stagger
      gsap.fromTo(
        ".project-card",
        { opacity: 0, y: 80, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.18,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 55%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="proyectos"
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 sm:py-24 relative overflow-hidden"
      style={{
        scrollSnapAlign: "start",
        background:
          "linear-gradient(180deg, #000 0%, #020010 30%, #050018 50%, #030010 80%, #000 100%)",
      }}
    >
      {/* Decorative orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[10%] left-[15%] w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] rounded-full bg-violet-600/[0.05] blur-[80px] sm:blur-[130px]"
          style={{ animation: "float 25s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[15%] right-[10%] w-[180px] h-[180px] sm:w-[300px] sm:h-[300px] rounded-full bg-indigo-600/[0.05] blur-[80px] sm:blur-[120px]"
          style={{ animation: "float-reverse 22s ease-in-out infinite" }}
        />
      </div>

      <div className="max-w-7xl w-full relative z-10">

        {/* Header */}
        <div ref={headerRef} className="mb-14 md:mb-20">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-gradient-to-r from-violet-500 to-transparent" />
            <p className="font-[family-name:var(--font-orbitron)] text-[11px] tracking-[0.3em] text-violet-400/80 uppercase">
              Iniciativas
            </p>
          </div>
          <h2 className="font-[family-name:var(--font-orbitron)] text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            <span className="text-white">Nuestros</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-white to-amber-400">
              Proyectos
            </span>
          </h2>
          <p className="font-[family-name:var(--font-inter)] text-white/50 text-lg font-light mt-5 max-w-xl">
            Explorando las fronteras del conocimiento a través de la acción comunitaria.
          </p>
        </div>

        {/* Bento Grid: hero left (spans 2 rows) + 2 stacked right */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 lg:grid-rows-2 gap-5">
          {/* Hero card — spans left 3 cols, both rows */}
          {(() => {
            const HeroIcon = proyectosData[0].icon;
            return (
          <div className="project-card card-glow group relative md:col-span-2 lg:col-span-3 lg:row-span-2 min-h-[280px] sm:min-h-[350px] lg:min-h-0 rounded-2xl overflow-hidden cursor-pointer transition-transform duration-500 group-hover:-translate-y-1">
            <Image
              src={proyectosData[0].image}
              alt={proyectosData[0].title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105 brightness-[0.6] group-hover:brightness-[0.8]"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className={`absolute inset-0 bg-gradient-to-br ${proyectosData[0].accent} to-transparent opacity-30`} />

            {/* Badge */}
            <div className="absolute top-5 left-5 flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30 backdrop-blur-sm font-[family-name:var(--font-inter)] text-[11px] font-medium text-violet-300 tracking-wide uppercase">
                {proyectosData[0].badge}
              </span>
            </div>

            {/* Arrow icon on hover */}
            <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-0 translate-x-2 group-hover:translate-y-0 -translate-y-2">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-9 transition-transform duration-500 group-hover:translate-y-[-4px]">
              <div className="flex items-center gap-2 mb-3">
                <HeroIcon className="w-4 h-4 text-violet-400/70" />
                <div className="h-px w-5 bg-violet-400/60" />
                <span className="font-[family-name:var(--font-orbitron)] text-[10px] tracking-[0.2em] text-violet-400/70 uppercase">
                  Proyecto Principal
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-orbitron)] text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                {proyectosData[0].title}
              </h3>
              <p className="font-[family-name:var(--font-inter)] text-white/60 text-base font-light max-w-md transition-opacity duration-500">
                {proyectosData[0].desc}
              </p>
            </div>

            {/* Subtle border glow on hover */}
            <div className="absolute inset-0 rounded-2xl border border-white/[0.06] group-hover:border-violet-500/30 transition-colors duration-500" />
          </div>
            );
          })()}

          {/* Two smaller cards stacked on the right */}
          {proyectosData.slice(1).map((proy, idx) => {
            const Icon = proy.icon;
            return (
              <div
                key={idx}
                className="project-card card-glow group relative lg:col-span-2 min-h-[250px] rounded-2xl overflow-hidden cursor-pointer transition-transform duration-500 hover:-translate-y-1"
              >
                <Image
                  src={proy.image}
                  alt={proy.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105 brightness-[0.5] group-hover:brightness-[0.7]"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className={`absolute inset-0 bg-gradient-to-br ${proy.accent} to-transparent opacity-20`} />

                {/* Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 backdrop-blur-sm font-[family-name:var(--font-inter)] text-[10px] font-medium text-violet-300 tracking-wide uppercase">
                    {proy.badge}
                  </span>
                </div>

                {/* Arrow icon on hover */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-0 translate-x-2 group-hover:translate-y-0 -translate-y-2">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 transition-transform duration-500 group-hover:translate-y-[-3px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-3.5 h-3.5 text-violet-400/70" />
                    <div className="h-px w-4 bg-violet-400/40" />
                  </div>
                  <h3 className="font-[family-name:var(--font-orbitron)] text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                    {proy.title}
                  </h3>
                  <p className="font-[family-name:var(--font-inter)] text-white/50 text-sm font-light transition-opacity duration-500">
                    {proy.desc}
                  </p>
                </div>

                <div className="absolute inset-0 rounded-2xl border border-white/[0.06] group-hover:border-violet-500/30 transition-colors duration-500" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
