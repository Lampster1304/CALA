"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "./SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

export default function NebulaSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blackholeRef = useRef<HTMLDivElement>(null);
  const blackholeVideoRef = useRef<HTMLVideoElement>(null);
  const nebulaRef = useRef<HTMLDivElement>(null);
  const nebulaVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let isLocked = false;
    let lockTween: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      const blackhole = blackholeRef.current;
      const nebula = nebulaRef.current;
      const nebulaVideo = nebulaVideoRef.current;
      const bhVideo = blackholeVideoRef.current;
      if (!blackhole || !nebula || !nebulaVideo) return;

      // Nebula starts hidden and zoomed in (like black hole did before)
      gsap.set(nebula, { opacity: 0, scale: 6 });

      // Black hole video starts at last frame (matches where previous section ended)
      if (bhVideo) {
        const setLastFrame = () => {
          bhVideo.currentTime = bhVideo.duration - 0.01;
        };
        if (bhVideo.readyState >= 1) setLastFrame();
        else bhVideo.addEventListener("loadedmetadata", setLastFrame, { once: true });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.1,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            // Autoscroll lock — same mechanic as Earth→black hole
            if (
              self.progress > 0.08 &&
              self.progress < 0.9 &&
              !isLocked &&
              self.direction === 1
            ) {
              isLocked = true;
              const lenis = getLenis();
              if (lenis) {
                lenis.stop();
                const endPos =
                  self.start + (self.end - self.start) * 0.95;
                const scrollObj = { y: window.scrollY };
                lockTween = gsap.to(scrollObj, {
                  y: endPos,
                  duration: 4,
                  ease: "power2.inOut",
                  onUpdate: () => {
                    window.scrollTo(0, scrollObj.y);
                    ScrollTrigger.update();
                  },
                  onComplete: () => {
                    // Start nebula video loop once transition completes
                    if (nebulaVideo) {
                      nebulaVideo.play();
                    }
                    lenis.start();
                    isLocked = false;
                    lockTween = null;
                  },
                });
              }
            }
          },
        },
      });

      // ── Phase 1 (0-20): Black hole shrinks and fades (like Earth did) ──
      tl.to(blackhole, {
        scale: 0.02,
        duration: 20,
        ease: "power3.in",
        force3d: true,
      }, 0);
      tl.to(blackhole, {
        opacity: 0,
        duration: 14,
        ease: "power2.in",
      }, 4);

      // ── Phase 2 (16-36): Nebula emerges from the void ──
      tl.to(nebula, {
        opacity: 1,
        duration: 10,
        ease: "power2.out",
      }, 18);
      tl.to(nebula, {
        scale: 1,
        duration: 12,
        ease: "power2.out",
        force3d: true,
      }, 16);

      // Padding to fill timeline
      tl.to({}, { duration: 4 }, 36);

    }, containerRef);

    return () => {
      if (lockTween) lockTween.kill();
      if (isLocked) {
        const lenis = getLenis();
        if (lenis) lenis.start();
      }
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[400vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Stars background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 stars-bg" />
          <div className="absolute inset-0 stars-twinkle" />
        </div>

        {/* Black hole — starts visible, shrinks away */}
        <div
          ref={blackholeRef}
          className="absolute inset-[-5%] z-[1] flex items-center justify-center"
          style={{
            transformOrigin: "center center",
            willChange: "transform, opacity",
          }}
        >
          <video
            ref={blackholeVideoRef}
            muted
            playsInline
            preload="auto"
            className="min-h-full min-w-full object-cover"
          >
            <source src="/videos/blackhole-vortex-seek.mp4" type="video/mp4" />
          </video>
          {/* Same edge fades as BlackHoleHero */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `
              linear-gradient(to right,  black 0%, transparent 12%),
              linear-gradient(to left,   black 0%, transparent 12%)
            `,
          }} />
          <div className="absolute bottom-0 right-0 w-[35%] h-[30%] pointer-events-none" style={{
            background: `radial-gradient(ellipse at 100% 100%, black 0%, black 40%, transparent 75%)`,
          }} />
        </div>

        {/* Nebula video — emerges from behind, then loops */}
        <div
          ref={nebulaRef}
          className="absolute inset-0 z-[2] flex items-center justify-center"
          style={{
            transformOrigin: "center center",
            willChange: "transform, opacity",
            opacity: 0,
          }}
        >
          <video
            ref={nebulaVideoRef}
            muted
            loop
            playsInline
            preload="auto"
            className="min-h-full min-w-full object-cover"
          >
            <source src="/videos/nebula.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
