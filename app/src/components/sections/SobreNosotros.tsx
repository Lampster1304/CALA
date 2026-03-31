"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import gsap from "gsap";

/* ────────────────────────────────────────── */
/*  Stats data                                */
/* ────────────────────────────────────────── */
const STATS = [
  { value: 50, suffix: "+", label: "Miembros" },
  { value: 12, suffix: "", label: "Eventos" },
  { value: 3, suffix: "", label: "Años" },
  { value: 100, suffix: "+", label: "Observaciones" },
];

/* ────────────────────────────────────────── */
/*  Mission pillars                           */
/* ────────────────────────────────────────── */
const PILLARS = [
  { title: "Observación", desc: "Telescopio y astrofotografía" },
  { title: "Divulgación", desc: "Talleres y charlas educativas" },
  { title: "Comunidad", desc: "Red activa de entusiastas" },
];

/* ────────────────────────────────────────── */
/*  Animated counter                          */
/* ────────────────────────────────────────── */
function CountUp({
  target,
  suffix,
  triggered,
}: {
  target: number;
  suffix: string;
  triggered: boolean;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!spanRef.current) return;
    if (triggered) {
      const obj = { val: 0 };
      tweenRef.current = gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power2.out",
        onUpdate() {
          if (spanRef.current) {
            spanRef.current.textContent = Math.round(obj.val) + suffix;
          }
        },
      });
    } else {
      tweenRef.current?.kill();
      if (spanRef.current) spanRef.current.textContent = "0" + suffix;
    }
    return () => {
      tweenRef.current?.kill();
    };
  }, [triggered, target, suffix]);

  return (
    <span ref={spanRef} className="tabular-nums">
      0{suffix}
    </span>
  );
}

/* ────────────────────────────────────────── */
/*  Orbital ring particles (small dots on     */
/*  the ring path)                            */
/* ────────────────────────────────────────── */
const RING_PARTICLES = [
  { angle: 0, ring: 1 },
  { angle: 90, ring: 1 },
  { angle: 180, ring: 1 },
  { angle: 270, ring: 1 },
  { angle: 45, ring: 2 },
  { angle: 135, ring: 2 },
  { angle: 225, ring: 2 },
  { angle: 315, ring: 2 },
];

/* ────────────────────────────────────────── */
/*  Main SobreNosotros                        */
/* ────────────────────────────────────────── */
const SobreNosotros = forwardRef<HTMLDivElement>(function SobreNosotros(
  _,
  forwardedRef,
) {
  const internalRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const hudRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [statsTriggered, setStatsTriggered] = useState(false);

  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
      }
    },
    [forwardedRef],
  );

  useEffect(() => {
    const root = internalRef.current;
    if (!root) return;

    const hudEls = hudRefs.current.filter(Boolean) as HTMLDivElement[];
    gsap.set(hudEls, { opacity: 0, y: 30 });

    const observer = new MutationObserver(() => {
      const opacity = parseFloat(root.style.opacity || "0");

      if (opacity > 0.1 && !hasAnimated.current) {
        hasAnimated.current = true;
        gsap.to(hudEls, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.3,
        });
        setStatsTriggered(true);
      } else if (opacity <= 0.05 && hasAnimated.current) {
        hasAnimated.current = false;
        gsap.set(hudEls, { opacity: 0, y: 30 });
        setStatsTriggered(false);
      }
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => observer.disconnect();
  }, []);

  const setHudRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      hudRefs.current[index] = el;
    },
    [],
  );

  return (
    <div
      ref={mergedRef}
      className="absolute inset-x-0 inset-y-0 z-[15] pointer-events-none opacity-0"
    >
      {/* ═══════════════════════════════════════════ */}
      {/*  LAYER 1: 3D depth effects BEHIND planet   */}
      {/* ═══════════════════════════════════════════ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* Deep space glow — large soft light behind the planet */}
        <div
          className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "min(120vmin, 90vw)",
            height: "min(120vmin, 90vw)",
            background:
              "radial-gradient(circle, rgba(255,140,50,0.12) 0%, rgba(220,100,30,0.06) 25%, rgba(180,60,20,0.03) 45%, transparent 65%)",
          }}
        />

        {/* Secondary corona glow — tighter, brighter */}
        <div
          className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "min(70vmin, 70vw)",
            height: "min(70vmin, 70vw)",
            background:
              "radial-gradient(circle, rgba(255,180,80,0.18) 0%, rgba(245,158,11,0.08) 40%, transparent 70%)",
            animation: "glow-pulse 6s ease-in-out infinite",
          }}
        />

        {/* Orbital rings, particles, arcs, dust — desktop only for perf */}
        <div className="hidden sm:contents">
          {/* Orbital ring 1 — large, slow */}
          <div
            className="absolute left-1/2 top-[38%] rounded-full"
            style={{
              width: "65vmin",
              height: "65vmin",
              marginLeft: "-32.5vmin",
              marginTop: "-32.5vmin",
              border: "1.5px solid rgba(251,191,36,0.15)",
              transform: "rotateX(75deg)",
              animation: "spin-ring 35s linear infinite",
            }}
          />

          {/* Orbital ring 2 — medium, reverse */}
          <div
            className="absolute left-1/2 top-[38%] rounded-full"
            style={{
              width: "85vmin",
              height: "85vmin",
              marginLeft: "-42.5vmin",
              marginTop: "-42.5vmin",
              border: "1px solid rgba(245,158,11,0.10)",
              transform: "rotateX(70deg)",
              animation: "spin-ring 55s linear infinite reverse",
            }}
          />

          {/* Orbital ring 3 — largest, subtle */}
          <div
            className="absolute left-1/2 top-[38%] rounded-full"
            style={{
              width: "110vmin",
              height: "110vmin",
              marginLeft: "-55vmin",
              marginTop: "-55vmin",
              border: "1px solid rgba(251,191,36,0.05)",
              transform: "rotateX(65deg)",
              animation: "spin-ring 80s linear infinite",
            }}
          />

          {/* Orbital ring 4 — tilted differently for depth */}
          <div
            className="absolute left-1/2 top-[38%] rounded-full"
            style={{
              width: "50vmin",
              height: "50vmin",
              marginLeft: "-25vmin",
              marginTop: "-25vmin",
              border: "1px solid rgba(255,200,100,0.08)",
              transform: "rotateX(80deg) rotateY(15deg)",
              animation: "spin-ring 28s linear infinite reverse",
            }}
          />

          {/* Light arc — crescent glow at planet edge (top-right) */}
          <div
            className="absolute"
            style={{
              left: "calc(50% + 8vmin)",
              top: "calc(38% - 14vmin)",
              width: "18vmin",
              height: "30vmin",
              background:
                "radial-gradient(ellipse at 30% 50%, rgba(255,200,120,0.15) 0%, transparent 60%)",
              transform: "rotate(-20deg)",
              filter: "blur(8px)",
            }}
          />

          {/* Light arc — opposite side (bottom-left) */}
          <div
            className="absolute"
            style={{
              left: "calc(50% - 22vmin)",
              top: "calc(38% + 6vmin)",
              width: "14vmin",
              height: "22vmin",
              background:
                "radial-gradient(ellipse at 70% 50%, rgba(255,160,80,0.10) 0%, transparent 60%)",
              transform: "rotate(25deg)",
              filter: "blur(6px)",
            }}
          />

          {/* Lens flare spots */}
          <div
            className="absolute rounded-full"
            style={{
              left: "calc(50% + 15vmin)",
              top: "calc(38% - 10vmin)",
              width: "4vmin",
              height: "4vmin",
              background:
                "radial-gradient(circle, rgba(255,240,200,0.3) 0%, transparent 70%)",
              animation: "glow-pulse 3s ease-in-out infinite",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              left: "calc(50% + 20vmin)",
              top: "calc(38% - 5vmin)",
              width: "2vmin",
              height: "2vmin",
              background:
                "radial-gradient(circle, rgba(255,220,150,0.25) 0%, transparent 70%)",
              animation: "glow-pulse 4s ease-in-out infinite 1s",
            }}
          />

          {/* Orbiting particles — small bright dots that appear to orbit */}
          {RING_PARTICLES.map((p, i) => (
            <div
              key={`rp-${i}`}
              className="absolute rounded-full"
              style={{
                left: "50%",
                top: "38%",
                width: `${p.ring === 1 ? 3 : 2}px`,
                height: `${p.ring === 1 ? 3 : 2}px`,
                background: p.ring === 1 ? "rgba(255,200,100,0.7)" : "rgba(251,191,36,0.5)",
                boxShadow: `0 0 ${p.ring === 1 ? 6 : 4}px rgba(255,180,80,0.4)`,
                transformOrigin: `0 ${p.ring === 1 ? "32.5vmin" : "42.5vmin"}`,
                transform: `rotate(${p.angle}deg)`,
                animation: `spin-particle ${p.ring === 1 ? 35 : 55}s linear infinite${p.ring === 2 ? " reverse" : ""}`,
              }}
            />
          ))}

          {/* Floating cosmic dust — various depths */}
          {[
            { x: "15%", y: "20%", s: 2.5, d: 18, o: 0.5 },
            { x: "78%", y: "15%", s: 2, d: 22, o: 0.4 },
            { x: "8%", y: "55%", s: 1.5, d: 20, o: 0.3 },
            { x: "88%", y: "60%", s: 2.5, d: 25, o: 0.5 },
            { x: "45%", y: "12%", s: 2, d: 17, o: 0.4 },
            { x: "25%", y: "70%", s: 1.5, d: 23, o: 0.3 },
            { x: "65%", y: "75%", s: 2, d: 19, o: 0.4 },
            { x: "35%", y: "30%", s: 1, d: 26, o: 0.25 },
            { x: "55%", y: "65%", s: 1.5, d: 21, o: 0.35 },
            { x: "90%", y: "35%", s: 1, d: 24, o: 0.2 },
          ].map((p, i) => (
            <div
              key={`dust-${i}`}
              className="absolute rounded-full"
              style={{
                left: p.x,
                top: p.y,
                width: `${p.s}px`,
                height: `${p.s}px`,
                background: `rgba(255,200,120,${p.o})`,
                boxShadow: `0 0 ${p.s * 2}px rgba(255,180,80,${p.o * 0.5})`,
                animation: `float ${p.d}s ease-in-out infinite`,
                animationDelay: `${i * 1.8}s`,
              }}
            />
          ))}

          {/* Radial light streaks from behind planet */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <div
              key={`ray-${angle}`}
              className="absolute"
              style={{
                left: "50%",
                top: "38%",
                width: "1px",
                height: "40vmin",
                background:
                  "linear-gradient(to bottom, rgba(255,180,80,0.08) 0%, transparent 100%)",
                transformOrigin: "top center",
                transform: `rotate(${angle}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/*  LAYER 2: Mars background                  */}
      {/* ═══════════════════════════════════════════ */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url(/images/Gemini_Generated_Image_tvr5zytvr5zytvr5.png)",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      />

      {/* ═══════════════════════════════════════════ */}
      {/*  LAYER 2.5: "MARTE" text — hard-clipped     */}
      {/*  by planet silhouette (T and E cut off)      */}
      {/* ═══════════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block"
      >
        <h2
          className="absolute font-[family-name:var(--font-orbitron)] font-black uppercase select-none"
          style={{
            fontSize: "clamp(4rem, 10vw, 12rem)",
            lineHeight: 0.9,
            color: "#C1440E",
            top: "16vh",
            left: "10vw",
            transform: "rotate(-30deg)",
            letterSpacing: "0.02em",
            textShadow: "0 0 40px rgba(200,100,40,0.15)",
          }}
        >
          MARTE
        </h2>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/*  LAYER 3: Gradient overlays for text        */}
      {/* ═══════════════════════════════════════════ */}
      {/* Radial darkening around edges — cinematic vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center 38%, transparent 20%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      {/* Bottom gradient for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 25%, transparent 45%)",
        }}
      />
      {/* Top subtle gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%)",
        }}
      />

      {/* ═══════════════════════════════════════════ */}
      {/*  LAYER 4: Centered content                  */}
      {/* ═══════════════════════════════════════════ */}
      <div className="absolute inset-0 flex flex-col justify-center items-center">
        <div className="w-full max-w-4xl mx-auto px-6 pointer-events-auto text-center mt-[25vh] sm:mt-[28vh]">

          {/* Heading */}
          <div ref={setHudRef(0)} className="mb-8">
            <p
              className="font-[family-name:var(--font-orbitron)] text-[10px] sm:text-[11px] tracking-[0.4em] uppercase mb-4"
              style={{ color: "#FBBF24" }}
            >
              Sobre Nosotros
            </p>

            <h2 className="font-[family-name:var(--font-orbitron)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight mb-5">
              <span className="text-white">Explorando el cosmos</span>
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #FBBF24, #F59E0B, #D97706)",
                }}
              >
                desde Las Am&eacute;ricas
              </span>
            </h2>

            <p className="font-[family-name:var(--font-inter)] text-sm sm:text-base text-white/70 leading-relaxed text-center">
              El{" "}
              <strong style={{ color: "#FCD34D" }} className="font-medium">
                Centro Astronómico Las Américas
              </strong>{" "}
              es un faro de conocimiento cósmico. Divulgación científica,
              curiosidad y comunidad bajo las estrellas.
            </p>
          </div>

          {/* Stats */}
          <div ref={setHudRef(1)} className="mb-8">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 justify-items-center sm:flex sm:justify-center sm:gap-14">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div
                    className="font-[family-name:var(--font-orbitron)] text-2xl sm:text-3xl md:text-4xl font-bold leading-none"
                    style={{ color: "#FBBF24" }}
                  >
                    <CountUp
                      target={stat.value}
                      suffix={stat.suffix}
                      triggered={statsTriggered}
                    />
                  </div>
                  <p className="font-[family-name:var(--font-inter)] text-[11px] sm:text-xs text-white/50 mt-1.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pillars */}
          <div ref={setHudRef(2)}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-0">
              {PILLARS.map((p, i) => (
                <div key={p.title} className="flex items-center">
                  {i > 0 && (
                    <div className="hidden sm:block w-px h-8 bg-amber-500/20 mx-8" />
                  )}
                  <div className="text-center">
                    <h3 className="font-[family-name:var(--font-inter)] text-sm font-semibold text-white leading-tight">
                      {p.title}
                    </h3>
                    <p className="font-[family-name:var(--font-inter)] text-xs text-white/40 mt-0.5">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
});

export default SobreNosotros;
