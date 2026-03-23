"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "./SmoothScroll";
import { getIsNavigating } from "./Navbar";
import SobreNosotros from "./sections/SobreNosotros";
import Image from "next/image";

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
  const blackholeBgRef = useRef<HTMLDivElement>(null);
  const bhContentRef = useRef<HTMLDivElement>(null);
  const bhImageRef = useRef<HTMLDivElement>(null);
  const eddyImageRef = useRef<HTMLDivElement>(null);

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

    // Safari aggressively blocks autoplay — robust retry strategy
    let introStarted = false;
    const safeStartIntro = () => {
      if (introStarted) return;
      introStarted = true;
      startIntro();
    };

    const tryPlay = () => {
      video.muted = true;
      video.play().then(safeStartIntro).catch(() => {});
    };

    // Attempt 1: immediate
    tryPlay();
    // Attempt 2: after a tick (Safari sometimes needs DOM to settle)
    requestAnimationFrame(tryPlay);
    // Attempt 3: short delay
    const retryTimer = setTimeout(tryPlay, 300);
    // Attempt 4: on any user interaction (ultimate fallback)
    const interactionEvents = ["touchstart", "click", "scroll"] as const;
    const onInteraction = () => {
      tryPlay();
      interactionEvents.forEach((e) => document.removeEventListener(e, onInteraction));
    };
    interactionEvents.forEach((e) =>
      document.addEventListener(e, onInteraction, { once: true, passive: true })
    );

    // If video is already loaded, start intro even without play() succeeding
    if (video.readyState >= 3) safeStartIntro();
    else video.addEventListener("canplay", safeStartIntro, { once: true });

    // Fallback: if nothing fires after 2s, start intro anyway (video may play behind curtain)
    const fallbackTimer = setTimeout(safeStartIntro, 2000);

    return () => {
      clearTimeout(retryTimer);
      clearTimeout(fallbackTimer);
      video.removeEventListener("canplay", safeStartIntro);
      interactionEvents.forEach((e) => document.removeEventListener(e, onInteraction));
      gsap.killTweensOf([curtain, title, subtitle, vignette, indicator]);
    };
  }, []);

  // ── Scroll animation: Earth → Marte → Black Hole ──
  useEffect(() => {
    if (!introComplete) return;

    // Hoisted outside gsap.context so cleanup can access them
    let isLocked = false;
    let lockTween: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      const videoWrapper = videoWrapperRef.current;
      const stars = starsRef.current;
      const fadeToBlack = fadeToBlackRef.current;
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      const indicator = scrollIndicatorRef.current;
      const sobreNosotros = sobreNosotrosRef.current;
      const blackholeBg = blackholeBgRef.current;
      const bhContent = bhContentRef.current;
      const bhImage = bhImageRef.current;
      const eddyImage = eddyImageRef.current;
      if (!videoWrapper || !title) return;

      // Responsive breakpoint
      const isLg = window.innerWidth >= 1024;

      // Initial states
      if (stars) gsap.set(stars, { opacity: 0 });
      if (fadeToBlack) gsap.set(fadeToBlack, { opacity: 0 });
      if (sobreNosotros) gsap.set(sobreNosotros, { opacity: 0, y: 40 });
      if (blackholeBg) gsap.set(blackholeBg, { opacity: 0, scale: 1.2 });
      if (bhContent) gsap.set(bhContent.children, { opacity: 0, y: 30 });
      if (eddyImage) gsap.set(eddyImage, {
        opacity: 0,
        x: isLg ? -200 : 0,
        y: isLg ? 0 : -250,
        scale: 0,
      });

      // ══════════════════════════════════════════════════════════
      // TIMELINE — total 82 units
      // Phase 1 (0-10):   Title fades out
      // Phase 2 (8-28):   Earth is absorbed
      // Phase 3 (18-24):  Stars fade in
      // Phase 4 (20-24):  Sobre Nosotros (Marte) fades in
      // Hold    (24-36):  Sobre Nosotros visible
      // Phase 5 (36-44):  Cross-fade: Marte out → Black hole (right) + text (left)
      // Hold    (44-48):  Founder text visible
      // Phase 6 (48-54):  Gravitational drift — text pulled toward black hole
      // Phase 7 (54-62):  Devour — text sucked into black hole
      // Phase 8 (62-70):  Black hole slides left + Eddy appears right
      // Hold    (70-74):  Black hole left + Eddy right visible
      // Phase 9 (74-82):  Fade to black
      // ══════════════════════════════════════════════════════════

      // Autoscroll locks until Sobre Nosotros is firmly visible
      const transitionEnd = 32 / 82;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=225%",
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

                lockTween = gsap.to(scrollObj, {
                  y: transitionEndPos,
                  duration: 4.5,
                  ease: "power2.inOut",
                  onUpdate: () => {
                    window.scrollTo(0, scrollObj.y);
                    ScrollTrigger.update();
                  },
                  onComplete: () => {
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
        { scale: 0.02, duration: 20, ease: "power3.in" },
        8
      );
      tl.to(
        videoWrapper,
        { opacity: 0, duration: 14, ease: "power2.in" },
        10
      );

      // ── Phase 3 (18-24): Stars fade in ──
      if (stars) {
        tl.to(stars, { opacity: 1, duration: 6, ease: "power2.out" }, 18);
      }

      // ── Phase 4 (20-24): Sobre Nosotros (Marte) fades in ──
      if (sobreNosotros) {
        tl.to(
          sobreNosotros,
          { opacity: 1, y: 0, duration: 4, ease: "power2.out" },
          20
        );
      }

      // ── Phase 5 (36-44): Cross-fade Marte → Black Hole + Founder text ──
      if (sobreNosotros) {
        tl.to(
          sobreNosotros,
          { opacity: 0, y: -40, duration: 8, ease: "power2.in" },
          36
        );
      }
      if (blackholeBg) {
        tl.to(
          blackholeBg,
          { opacity: 1, scale: 1, duration: 8, ease: "power2.out" },
          36
        );
      }
      if (bhContent) {
        tl.to(
          bhContent.children,
          { opacity: 1, y: 0, duration: 6, stagger: 0.8, ease: "power3.out" },
          38
        );
      }
      if (stars) {
        tl.to(stars, { opacity: 0.3, duration: 8, ease: "power1.inOut" }, 36);
      }

      // ── Phase 6 (48-54): Gravitational drift — text pulled toward black hole ──
      // Desktop: text drifts right toward BH | Mobile: text drifts down toward BH
      if (bhContent) {
        tl.to(
          bhContent.children,
          {
            x: isLg ? 50 : 0,
            y: isLg ? 0 : 40,
            scale: 0.96,
            rotation: isLg ? 1.5 : 0,
            duration: 6,
            stagger: 0.3,
            ease: "power1.in",
          },
          48
        );
      }
      if (bhImage) {
        tl.to(bhImage, { scale: 1.08, duration: 6, ease: "power1.in" }, 48);
      }

      // ── Phase 7 (54-62): Devour — text sucked into the black hole ──
      // Desktop: text flies right into BH | Mobile: text flies down into BH
      if (bhContent) {
        tl.to(
          bhContent.children,
          {
            x: isLg ? 500 : 0,
            y: isLg ? 0 : 400,
            scale: 0,
            opacity: 0,
            rotation: isLg ? 8 : 0,
            duration: 8,
            stagger: 0.6,
            ease: "power3.in",
          },
          54
        );
      }
      if (bhImage) {
        tl.to(bhImage, { scale: 1.4, duration: 8, ease: "power2.in" }, 54);
      }

      // ── Phase 8 (62-72): BH moves + Eddy expelled ──
      // Desktop: BH slides left, Eddy appears right
      // Mobile: BH moves up to top, Eddy expelled downward below
      if (bhImage) {
        if (isLg) {
          tl.to(bhImage, { xPercent: -122, duration: 10, ease: "power2.inOut" }, 62);
        } else {
          tl.to(bhImage, { bottom: "auto", top: "8%", duration: 10, ease: "power2.inOut" }, 62);
        }
      }
      if (eddyImage) {
        tl.to(
          eddyImage,
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 8,
            ease: "back.out(1.2)",
          },
          65
        );
      }

      // ── Phase 9 (74-82): Fade to black ──
      if (blackholeBg) {
        tl.to(
          blackholeBg,
          { opacity: 0, duration: 8, ease: "power2.in" },
          74
        );
      }
      if (fadeToBlack) {
        tl.to(
          fadeToBlack,
          { opacity: 1, duration: 8, ease: "power2.in" },
          74
        );
      }
      if (stars) {
        tl.to(stars, { opacity: 0, duration: 6, ease: "power2.in" }, 76);
      }
    }, containerRef);

    return () => {
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
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black scroll-snap-align-start snap-section">
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
      />


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
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          {...({ "webkit-playsinline": "" } as any)}
          preload="auto"
          className="h-[60vh] sm:h-[75vh] md:h-[80vh] w-auto max-w-[100vw] object-cover"
        >
          <source src="/videos/blackhole.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Vignette */}
      <div
        ref={vignetteRef}
        className="vignette absolute inset-0 z-10 pointer-events-none"
      />

      {/* Black hole + Founder layout — revealed after Marte cross-fade */}
      <div
        ref={blackholeBgRef}
        className="absolute inset-0 z-[13] pointer-events-none opacity-0 flex items-center justify-center px-4 sm:px-6 lg:px-24"
        style={{
          willChange: "transform, opacity",
          transformOrigin: "center center",
        }}
      >
        <div className="max-w-7xl w-full relative" style={{ minHeight: "70vh" }}>

          {/* Founder info — mobile: centered top / desktop: absolute left */}
          <div
            ref={bhContentRef}
            className="absolute left-0 right-0 lg:right-auto top-[6%] lg:top-1/2 lg:-translate-y-1/2 w-full lg:w-[48%] space-y-3 sm:space-y-4 lg:space-y-6 lg:pr-8 text-center lg:text-left px-2 lg:px-0"
          >
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="h-px w-8 bg-gradient-to-r from-amber-500 to-transparent" />
              <span className="font-[family-name:var(--font-orbitron)] text-[10px] sm:text-[11px] tracking-[0.3em] text-amber-400/80 uppercase">
                Fundador
              </span>
            </div>

            <h2 className="font-[family-name:var(--font-orbitron)] text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
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

            <div className="h-px w-16 lg:w-20 bg-gradient-to-r from-amber-500/60 via-orange-500/30 to-transparent mx-auto lg:mx-0" />

            <div className="relative pl-4 lg:pl-5 border-l-2 border-amber-500/30 text-left mx-auto lg:mx-0 max-w-md lg:max-w-lg">
              <p className="font-[family-name:var(--font-inter)] text-sm sm:text-base lg:text-xl text-white/80 italic font-light leading-relaxed">
                &ldquo;Su misión ha sido inspirar a las nuevas generaciones a mirar hacia las estrellas y descubrir los misterios que nos rodean.&rdquo;
              </p>
            </div>

            <p className="font-[family-name:var(--font-inter)] text-xs sm:text-sm lg:text-base text-white/50 leading-relaxed max-w-md lg:max-w-lg font-light mx-auto lg:mx-0">
              Como fundador visionario de CALA, Eddy ha dedicado años de pasión a la divulgación
              científica. Su liderazgo es el núcleo gravitacional que mantiene unida a nuestra comunidad
              de exploradores.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 pt-1 justify-center lg:justify-start">
              {["Presidente", "Astrónomo", "Mentor"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-white/[0.04] border border-amber-500/15 text-white/60 text-xs sm:text-sm font-[family-name:var(--font-inter)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Black hole image — mobile: centered middle / desktop: absolute right */}
          <div
            ref={bhImageRef}
            className="absolute left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-0 bottom-[8%] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 w-[55%] sm:w-[50%] lg:w-[45%] flex justify-center"
          >
            <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-lg">
              {/* Ambient glow behind the black hole */}
              <div
                className="absolute inset-0 -m-6 lg:-m-8 rounded-full blur-[60px] lg:blur-[80px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(251,191,36,0.12) 0%, rgba(245,158,11,0.06) 40%, transparent 70%)",
                }}
              />
              <img
                src="/images/blackhole-bg.png"
                alt="Black hole"
                className="relative w-full h-auto"
              />
            </div>
          </div>

          {/* Eddy's photo — expelled from black hole: below (mobile) / right (desktop) */}
          <div
            ref={eddyImageRef}
            className="absolute left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-[5%] bottom-[5%] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 w-[42%] sm:w-[38%] lg:w-[35%] opacity-0"
          >
            <div className="relative w-full max-w-[200px] sm:max-w-xs lg:max-w-sm mx-auto lg:mx-0 lg:ml-auto">
              {/* Glow behind photo */}
              <div className="absolute -inset-2 bg-gradient-to-b from-amber-500/25 via-transparent to-orange-500/15 rounded-2xl blur-lg opacity-70" />

              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden">
                <Image
                  src="/images/DonEddy.png"
                  alt="Eddy Martínez"
                  fill
                  className="object-cover"
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

                {/* Name overlay at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-5">
                  <p className="font-[family-name:var(--font-orbitron)] text-[8px] sm:text-[9px] lg:text-[10px] tracking-[0.3em] text-amber-400/70 uppercase mb-1 sm:mb-1.5">
                    Fundador
                  </p>
                  <h3 className="font-[family-name:var(--font-orbitron)] text-base sm:text-lg lg:text-2xl font-bold text-white leading-tight">
                    Eddy
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
                  </h3>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Content overlay — only Sobre Nosotros remains on top of video */}
      <SobreNosotros ref={sobreNosotrosRef} />

      {/* Main Hero Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pointer-events-none">
        <div
          ref={titleRef}
          className="will-change-transform flex flex-col items-center"
        >
          <h1 className="text-glow font-[family-name:var(--font-orbitron)] text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] font-bold tracking-[0.15em] sm:tracking-[0.3em] text-white text-center leading-none">
            CALA
          </h1>

          <div ref={subtitleRef} className="mt-8 sm:mt-12 md:mt-16">
            <p className="font-[family-name:var(--font-orbitron)] text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.5em] text-white/60 uppercase text-center max-w-[280px] sm:max-w-none leading-relaxed">
              Club de Astronomía Las Américas
            </p>
          </div>
        </div>
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
