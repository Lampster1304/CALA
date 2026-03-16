"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "./SmoothScroll";
import { getIsNavigating } from "./Navbar";
import SobreNosotros from "./sections/SobreNosotros";

gsap.registerPlugin(ScrollTrigger);

interface BlackHoleHeroProps {
  onScrollProgress?: (progress: number) => void;
}

export default function BlackHoleHero({ onScrollProgress }: BlackHoleHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const blackholeRef = useRef<HTMLDivElement>(null);
  const blackholeVideoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const fadeToBlackRef = useRef<HTMLDivElement>(null);

  // Section refs — only Sobre Nosotros remains as overlay
  const sobreNosotrosRef = useRef<HTMLDivElement>(null);

  const [introComplete, setIntroComplete] = useState(false);

  // Stable callback ref to avoid re-triggering the scroll effect
  const onScrollProgressRef = useRef(onScrollProgress);
  useEffect(() => {
    onScrollProgressRef.current = onScrollProgress;
  }, [onScrollProgress]);

  // ── Elegant fade-in entry ──
  useEffect(() => {
    const video = videoRef.current;
    const bhVideo = blackholeVideoRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const indicator = scrollIndicatorRef.current;
    const curtain = curtainRef.current;
    const vignette = vignetteRef.current;
    if (!video || !title || !curtain || !vignette) return;

    // Black hole video is scroll-driven, not autoplay
    if (bhVideo) {
      bhVideo.pause();
    }

    gsap.set(curtain, { opacity: 1 });
    gsap.set(title, { opacity: 0, y: 20 });
    if (subtitle) gsap.set(subtitle, { opacity: 0, y: 15 });
    if (indicator) gsap.set(indicator, { opacity: 0 });
    gsap.set(vignette, { opacity: 0 });

    const startIntro = () => {
      const intro = gsap.timeline({
        delay: 0.3,
        onComplete: () => setIntroComplete(true),
      });

      intro.to(curtain, { opacity: 0, duration: 1.8, ease: "power2.inOut" }, 0);
      intro.to(vignette, { opacity: 0.6, duration: 1.5 }, 0.3);
      intro.to(title, { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }, 1);
      if (subtitle) {
        intro.to(subtitle, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 1.4);
      }
      if (indicator) {
        intro.to(indicator, { opacity: 1, duration: 0.8 }, 2);
      }
    };

    if (video.readyState >= 3) startIntro();
    else video.addEventListener("canplay", startIntro, { once: true });

    return () => {
      video.removeEventListener("canplay", startIntro);
      gsap.killTweensOf([curtain, title, subtitle, vignette, indicator]);
    };
  }, []);

  // ── Black hole devours Earth — scroll animation ──
  useEffect(() => {
    if (!introComplete) return;

    // Hoisted outside gsap.context so cleanup can access them
    let rafId: number;
    let isLocked = false;
    let lockTween: gsap.core.Tween | null = null;
    let videoTargetTime = 0;
    let videoCurrentTime = 0;
    let videoOffset = 0; // offset from pre-play before scroll takes over

    const ctx = gsap.context(() => {
      const videoWrapper = videoWrapperRef.current;
      const blackhole = blackholeRef.current;
      const stars = starsRef.current;
      const fadeToBlack = fadeToBlackRef.current;
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      const indicator = scrollIndicatorRef.current;
      const sobreNosotros = sobreNosotrosRef.current;
      if (!videoWrapper || !blackhole || !title) return;

      // Black hole and stars start hidden, fade-to-black starts transparent
      gsap.set(blackhole, { opacity: 0, scale: 6 });
      if (stars) gsap.set(stars, { opacity: 0 });
      if (fadeToBlack) gsap.set(fadeToBlack, { opacity: 0 });

      // Sobre Nosotros starts hidden and shifted down
      if (sobreNosotros) gsap.set(sobreNosotros, { opacity: 0, y: 40 });

      // Smooth scroll-driven video: lerp toward target (high rate for responsiveness)
      const LERP_RATE = 0.18;
      const smoothVideoSeek = () => {
        const bhVideo = blackholeVideoRef.current;
        if (bhVideo && bhVideo.duration) {
          videoCurrentTime += (videoTargetTime - videoCurrentTime) * LERP_RATE;
          const clamped = Math.max(0, Math.min(videoCurrentTime, bhVideo.duration));
          if (Math.abs(bhVideo.currentTime - clamped) > 0.005) {
            bhVideo.currentTime = clamped;
          }
        }
        rafId = requestAnimationFrame(smoothVideoSeek);
      };
      rafId = requestAnimationFrame(smoothVideoSeek);

      // ══════════════════════════════════════════════════════════
      // TIMELINE — total ~66 units
      // Phase 1 (0-10):  Title fades out
      // Phase 2 (8-28):  Earth is absorbed
      // Phase 3 (24-36): Black hole appears + stars
      // Phase 4 (36-44): Pure video atmosphere zone
      // Phase 5 (42-66): Sobre Nosotros (fade in 6 → hold 12 → fade out 6)
      // Phase 6 (60-66): Fade to black final
      // ══════════════════════════════════════════════════════════

      // Transition ends at 36/66
      const transitionEnd = 36 / 66;
      // Sobre Nosotros ends at 66/66, video plays through this
      const sobreEnd = 1; // 66/66


      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%",
          scrub: 0.1,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            // Report progress to parent for navbar visibility
            if (onScrollProgressRef.current) {
              onScrollProgressRef.current(self.progress);
            }

            // ── Autoscroll: lock and auto-play the transition ──
            if (
              self.progress > 0.05 &&
              self.progress < transitionEnd &&
              !isLocked &&
              !getIsNavigating() &&
              self.direction === 1
            ) {
              isLocked = true;
              const lenis = getLenis();
              if (lenis) {
                lenis.stop();
                const transitionEndPos =
                  self.start + (self.end - self.start) * transitionEnd;
                const scrollObj = { y: window.scrollY };
                const autoscrollDuration = 4;

                // Play video in sync with autoscroll (whole duration)
                const bhVideo = blackholeVideoRef.current;
                const prePlaySeconds = 3;
                let videoPlayTween: gsap.core.Tween | null = null;
                if (bhVideo && bhVideo.duration) {
                  videoPlayTween = gsap.to(
                    { t: 0 },
                    {
                      t: prePlaySeconds,
                      duration: autoscrollDuration,
                      ease: "power2.inOut",
                      onUpdate() {
                        const t = this.targets()[0].t;
                        videoTargetTime = t;
                        videoOffset = t;
                      },
                    }
                  );
                }

                lockTween = gsap.to(scrollObj, {
                  y: transitionEndPos,
                  duration: autoscrollDuration,
                  ease: "power2.inOut",
                  onUpdate: () => {
                    window.scrollTo(0, scrollObj.y);
                    ScrollTrigger.update();
                  },
                  onComplete: () => {
                    if (videoPlayTween) videoPlayTween.kill();
                    lenis.start();
                    isLocked = false;
                    lockTween = null;
                  },
                });
              }
            }

            // ── Scroll-driven video: use RAW scroll position (bypass scrub delay) ──
            // Skip during autoscroll — pre-play tween handles video then
            if (isLocked) return;

            const bhVideo = blackholeVideoRef.current;
            if (!bhVideo || !bhVideo.duration) return;

            const rawProgress = Math.max(
              0,
              Math.min(
                1,
                (window.scrollY - self.start) / (self.end - self.start)
              )
            );

            if (rawProgress <= transitionEnd) {
              videoTargetTime = videoOffset;
            } else if (rawProgress <= sobreEnd) {
              // Map video across transition → end of Sobre Nosotros
              const videoProgress =
                (rawProgress - transitionEnd) / (sobreEnd - transitionEnd);
              videoTargetTime =
                videoOffset +
                videoProgress * (bhVideo.duration - videoOffset);
            } else {
              // Past Sobre Nosotros, hold at end
              videoTargetTime = bhVideo.duration;
            }
          },
        },
      });

      // ── Phase 1 (0-10): Title and UI fade out ──
      tl.to(
        title,
        { opacity: 0, y: -80, duration: 10, ease: "power2.in" },
        0
      );
      if (subtitle) {
        tl.to(
          subtitle,
          { opacity: 0, y: -50, duration: 8, ease: "power2.in" },
          0
        );
      }
      if (indicator) {
        tl.to(indicator, { opacity: 0, duration: 4 }, 0);
      }

      // ── Phase 2 (8-28): Earth gets pulled in ──
      tl.to(
        videoWrapper,
        {
          scale: 0.02,
          duration: 20,
          ease: "power3.in",
        },
        8
      );
      tl.to(
        videoWrapper,
        {
          opacity: 0,
          duration: 14,
          ease: "power2.in",
        },
        10
      );

      // ── Phase 3 (24-36): Black hole emerges + stars fade in ──
      tl.to(
        blackhole,
        {
          opacity: 1,
          duration: 10,
          ease: "power2.out",
        },
        26
      );
      tl.to(
        blackhole,
        {
          scale: 0.6,
          duration: 12,
          ease: "power2.out",
          force3d: true,
        },
        24
      );
      if (stars) {
        tl.to(
          stars,
          {
            opacity: 1,
            duration: 10,
            ease: "power2.out",
          },
          26
        );
      }

      // ── Phase 4 (36-44): Pure video atmosphere zone ──
      tl.to({}, { duration: 8 }, 36);

      // ── Phase 5 (42-66): Sobre Nosotros ──
      if (sobreNosotros) {
        // Fade in + slide up (6 units)
        tl.to(
          sobreNosotros,
          { opacity: 1, y: 0, duration: 6, ease: "power2.out" },
          42
        );
        // Hold (12 units — implicit, no animation needed)
        // Fade out + slide up (6 units)
        tl.to(
          sobreNosotros,
          { opacity: 0, y: -30, duration: 6, ease: "power2.in" },
          60
        );
      }

      // ── Phase 6 (60-66): Fade to black final ──
      if (fadeToBlack) {
        tl.to(
          fadeToBlack,
          {
            opacity: 1,
            duration: 6,
            ease: "power2.in",
          },
          60
        );
      }
      tl.to(
        blackhole,
        {
          opacity: 0,
          duration: 6,
          ease: "power2.in",
        },
        60
      );
      if (stars) {
        tl.to(
          stars,
          {
            opacity: 0,
            duration: 6,
            ease: "power2.in",
          },
          60
        );
      }
    }, containerRef);

    return () => {
      cancelAnimationFrame(rafId);
      if (lockTween) lockTween.kill();
      // Restore Lenis if component unmounts during autoscroll
      if (isLocked) {
        const lenis = getLenis();
        if (lenis) lenis.start();
      }
      ctx.revert();
    };
  }, [introComplete]);

  // ── Mouse parallax ──
  useEffect(() => {
    if (!introComplete) return;

    const videoWrapper = videoWrapperRef.current;
    if (!videoWrapper) return;

    const maxOffset = 10;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        videoWrapper.style.translate = `${dx * maxOffset}px ${dy * maxOffset}px`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [introComplete]);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      {/* Stars background — hidden at start, fades in with black hole */}
      <div ref={starsRef} className="absolute inset-0 z-0 opacity-0">
        <div className="absolute inset-0 stars-bg" />
        <div className="absolute inset-0 stars-twinkle" />
      </div>
      {/* Black hole video — behind Earth */}
      <div
        ref={blackholeRef}
        className="absolute inset-[-5%] z-[1] flex items-center justify-center"
        style={{
          transformOrigin: "center center",
          willChange: "transform, opacity",
          opacity: 0,
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
        {/* Edge fade overlays — blend video into black seamlessly */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(to right,  black 0%, transparent 12%),
              linear-gradient(to left,   black 0%, transparent 12%)
            `,
          }}
        />
        {/* Bottom-right corner fade — hides VEO watermark */}
        <div
          className="absolute bottom-0 right-0 w-[35%] h-[30%] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 100% 100%, black 0%, black 40%, transparent 75%)`,
          }}
        />
      </div>

      {/* Earth video wrapper — in front */}
      <div
        ref={videoWrapperRef}
        className="absolute inset-0 z-[2] flex items-center justify-center"
        style={{
          transition: "translate 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
          transformOrigin: "center center",
          willChange: "transform, opacity, translate",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="h-[80vh] w-auto"
        >
          <source src="/videos/blackhole.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Vignette */}
      <div
        ref={vignetteRef}
        className="vignette absolute inset-0 z-10 pointer-events-none"
      />

      {/* Content overlay — only Sobre Nosotros remains on top of video */}
      <SobreNosotros ref={sobreNosotrosRef} />

      {/* Title */}
      <div
        ref={titleRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center will-change-transform"
      >
        <h1 className="text-glow font-[family-name:var(--font-orbitron)] text-7xl md:text-9xl lg:text-[10rem] font-bold tracking-[0.3em] text-white text-center px-4">
          CALA
        </h1>
      </div>

      {/* Subtitle */}
      <div
        ref={subtitleRef}
        className="absolute inset-0 z-20 flex items-center justify-center pt-[13rem] md:pt-[16rem] lg:pt-[18rem] pointer-events-none"
      >
        <p className="font-[family-name:var(--font-orbitron)] text-xs md:text-sm tracking-[0.5em] text-white/60 uppercase">
          Club de Astronomía Las Américas
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="font-[family-name:var(--font-inter)] text-white/50 text-sm tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
      </div>

      {/* Fade to black — end of experience */}
      <div
        ref={fadeToBlackRef}
        className="absolute inset-0 z-[25] bg-black pointer-events-none opacity-0"
      />

      {/* Entry curtain */}
      <div
        ref={curtainRef}
        className="absolute inset-0 z-30 bg-black pointer-events-none"
      />
    </div>
  );
}
