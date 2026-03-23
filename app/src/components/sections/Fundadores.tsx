"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Fundadores() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Image: slide in from left with scale
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, x: -60, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Staggered content reveals
      const contentEls = [
        labelRef.current,
        nameRef.current,
        dividerRef.current,
        quoteRef.current,
        descRef.current,
        tagsRef.current,
      ].filter(Boolean);

      gsap.fromTo(
        contentEls,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="fundadores"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-6 lg:px-24 relative overflow-hidden py-24"
    >
      {/* Black hole background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/images/blackhole-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Vignette overlay for depth */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Bottom gradient for seamless transition to next section */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 20%, transparent 40%)",
        }}
      />

      {/* Top gradient for seamless transition from hero */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 15%, transparent 35%)",
        }}
      />

      {/* Decorative floating orbs — warm amber tones */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
        <div
          className="absolute top-[15%] right-[10%] w-[400px] h-[400px] rounded-full bg-amber-500/[0.06] blur-[150px]"
          style={{ animation: "float 22s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[20%] left-[5%] w-[350px] h-[350px] rounded-full bg-orange-600/[0.05] blur-[130px]"
          style={{ animation: "float-reverse 28s ease-in-out infinite" }}
        />
        <div
          className="absolute top-[60%] right-[30%] w-[200px] h-[200px] rounded-full bg-yellow-500/[0.04] blur-[100px]"
          style={{ animation: "float 18s ease-in-out infinite 5s" }}
        />
      </div>

      <div className="max-w-7xl w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Image with gradient border effect */}
        <div ref={imageRef} className="relative flex justify-center lg:justify-start">
          <div className="relative group w-full max-w-md mx-auto lg:mx-0">
            {/* Animated glow behind image — amber tones */}
            <div className="absolute -inset-1 bg-gradient-to-b from-amber-500/30 via-transparent to-orange-500/20 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden">
              <Image
                src="/images/DonEddy.png"
                alt="Eddy Martínez"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-7">
          {/* Label */}
          <div ref={labelRef} className="flex items-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-amber-500 to-transparent" />
            <span className="font-[family-name:var(--font-orbitron)] text-[11px] tracking-[0.3em] text-amber-400/80 uppercase">
              Fundador
            </span>
          </div>

          {/* Name */}
          <h2
            ref={nameRef}
            className="font-[family-name:var(--font-orbitron)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight"
          >
            <span className="text-white">Eddy</span>
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #FBBF24, #F59E0B, #D97706)",
              }}
            >
              Martínez
            </span>
          </h2>

          {/* Divider */}
          <div
            ref={dividerRef}
            className="h-px w-20 bg-gradient-to-r from-amber-500/60 via-orange-500/30 to-transparent origin-left"
          />

          {/* Quote */}
          <div ref={quoteRef} className="relative pl-5 border-l-2 border-amber-500/30">
            <p className="font-[family-name:var(--font-inter)] text-lg sm:text-xl text-white/80 italic font-light leading-relaxed max-w-lg">
              &ldquo;Su misión ha sido inspirar a las nuevas generaciones a mirar hacia las estrellas y descubrir los misterios que nos rodean.&rdquo;
            </p>
          </div>

          {/* Description */}
          <p
            ref={descRef}
            className="font-[family-name:var(--font-inter)] text-base text-white/50 leading-relaxed max-w-lg font-light"
          >
            Como fundador visionario de CALA, Eddy ha dedicado años de pasión a la divulgación
            científica. Su liderazgo es el núcleo gravitacional que mantiene unida a nuestra comunidad
            de exploradores.
          </p>

          {/* Tags */}
          <div ref={tagsRef} className="flex flex-wrap gap-3 pt-2">
            {["Presidente", "Astrónomo", "Mentor"].map((tag) => (
              <span
                key={tag}
                className="px-5 py-2.5 rounded-full bg-white/[0.04] border border-amber-500/15 text-white/60 text-sm font-[family-name:var(--font-inter)] hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-white/80 transition-all duration-300 cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
