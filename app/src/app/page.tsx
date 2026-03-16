"use client";

import { useCallback, useRef, useState } from "react";
import BlackHoleHero from "@/components/BlackHoleHero";
import Navbar from "@/components/Navbar";
import Fundadores from "@/components/sections/Fundadores";
import Proyectos from "@/components/sections/Proyectos";
import Contacto from "@/components/sections/Contacto";

export default function Home() {
  const [navbarVisible, setNavbarVisible] = useState(false);
  const wasVisible = useRef(false);

  const handleScrollProgress = useCallback((progress: number) => {
    const shouldShow = progress > 0.3;
    if (shouldShow !== wasVisible.current) {
      wasVisible.current = shouldShow;
      setNavbarVisible(shouldShow);
    }
  }, []);

  return (
    <main>
      <Navbar visible={navbarVisible} />
      <BlackHoleHero onScrollProgress={handleScrollProgress} />
      <Fundadores />
      <Proyectos />
      <Contacto />
    </main>
  );
}
