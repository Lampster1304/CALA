"use client";

import { useEffect, useRef, useState } from "react";

export default function PostHoleSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="stars-bg relative min-h-screen flex flex-col items-center justify-center px-6 py-24"
    >
      <div
        className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Decorative line */}
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mb-8" />

        <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-white mb-6">
          Bienvenido al Universo
        </h2>

        <p className="font-[family-name:var(--font-body)] text-lg md:text-xl text-gray-300/80 leading-relaxed mb-8">
          Somos un club dedicado a la observación, estudio y divulgación de la
          astronomía. Desde Las Américas, miramos hacia las estrellas para
          entender nuestro lugar en el cosmos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon="🔭"
            title="Observación"
            description="Noches de observación con telescopios profesionales"
          />
          <FeatureCard
            icon="🌌"
            title="Divulgación"
            description="Charlas y talleres abiertos a toda la comunidad"
          />
          <FeatureCard
            icon="🚀"
            title="Exploración"
            description="Viajes y expediciones a zonas de cielo oscuro"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="font-[family-name:var(--font-body)] text-sm text-gray-400">
        {description}
      </p>
    </div>
  );
}
