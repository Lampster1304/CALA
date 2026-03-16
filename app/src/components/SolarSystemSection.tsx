"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SolarSystemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const exitOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const image = imageRef.current;
      const curtain = curtainRef.current;
      const exitOverlay = exitOverlayRef.current;
      if (!image || !curtain || !exitOverlay) return;

      // Initial state
      gsap.set(curtain, { opacity: 1 });
      gsap.set(exitOverlay, { opacity: 0 });
      gsap.set(image, { scale: 1.15 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
        },
      });

      // Reveal from black (0% → 25%)
      tl.to(curtain, {
        opacity: 0,
        duration: 25,
        ease: "power2.inOut",
      }, 0);

      // Slow zoom during the whole section
      tl.to(image, {
        scale: 1.02,
        duration: 100,
        ease: "none",
      }, 0);

      // Exit to black (75% → 100%)
      tl.to(exitOverlay, {
        opacity: 1,
        duration: 25,
        ease: "power2.in",
      }, 75);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Mouse parallax
  useEffect(() => {
    const image = imageRef.current;
    const container = containerRef.current;
    if (!image || !container) return;

    const maxOffset = 8;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        image.style.translate = `${dx * maxOffset}px ${dy * maxOffset}px`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      {/* Solar system image */}
      <div
        ref={imageRef}
        className="absolute inset-0 solar-system-breathe"
        style={{
          backgroundImage: "url('/images/solar-system.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "translate 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)",
          willChange: "transform, translate",
        }}
      />

      {/* Nebula drift layers */}
      <div className="absolute inset-0 nebula-drift-1 pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 30% 60%, rgba(120,60,180,0.4) 0%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      <div className="absolute inset-0 nebula-drift-2 pointer-events-none opacity-25"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 70% 40%, rgba(40,100,200,0.35) 0%, transparent 65%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Twinkling stars */}
      <div className="absolute inset-0 pointer-events-none stars-twinkle" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ boxShadow: "inset 0 0 150px 60px rgba(0,0,0,0.5)" }}
      />

      {/* Entry curtain (fades out on scroll) */}
      <div ref={curtainRef} className="absolute inset-0 z-20 bg-black pointer-events-none" />

      {/* Exit overlay (fades in on scroll) */}
      <div ref={exitOverlayRef} className="absolute inset-0 z-20 bg-black pointer-events-none" />
    </div>
  );
}
