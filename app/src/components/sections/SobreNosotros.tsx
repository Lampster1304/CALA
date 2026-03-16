import { forwardRef } from "react";
import { Telescope, Sparkles } from "lucide-react";

const SobreNosotros = forwardRef<HTMLDivElement>(function SobreNosotros(_, ref) {
  return (
    <div
      ref={ref}
      className="absolute inset-0 z-[15] flex items-center justify-center pointer-events-none opacity-0 px-4"
    >
      <div className="glass-card text-video-overlay max-w-4xl w-full mx-auto p-[1px] shadow-2xl pointer-events-auto relative overflow-hidden group rounded-2xl">
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-purple-500/40 opacity-50 group-hover:opacity-100 transition-opacity duration-1000 blur-sm" />

        <div className="relative bg-black/60 backdrop-blur-2xl rounded-2xl p-8 md:p-14 flex flex-col md:flex-row gap-8 items-center h-full">
          <div className="flex-1 space-y-6 relative z-10 w-full text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-[family-name:var(--font-orbitron)] mx-auto md:mx-0">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Nuestra Misión</span>
            </div>

            <h2 className="font-[family-name:var(--font-orbitron)] text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60 tracking-tight leading-tight">
              Sobre <br className="hidden md:block" /> Nosotros
            </h2>

            <div className="h-px w-20 bg-gradient-to-r from-blue-500 to-transparent md:mr-auto mx-auto" />
          </div>

          <div className="flex-[1.5] space-y-6 relative z-10 text-center md:text-left w-full">
            <p className="font-[family-name:var(--font-inter)] text-lg md:text-xl text-white/80 leading-relaxed font-light">
              El <strong className="text-white font-medium">Club de Astronomía Las Américas (CALA)</strong> es un espacio dedicado a la exploración del cosmos, la divulgación científica y el fomento de la curiosidad por el universo que nos rodea.
            </p>
            <p className="font-[family-name:var(--font-inter)] text-base md:text-lg text-white/60 leading-relaxed">
              Desde nuestros inicios, hemos buscado acercar las maravillas del espacio a nuestra comunidad a través de observaciones, charlas, talleres y proyectos colaborativos. Creemos que mirar hacia arriba es el primer paso para descubrir quiénes somos.
            </p>
          </div>

          {/* Decorative faint icon in background */}
          <div className="absolute -bottom-16 -right-16 text-white/[0.03] pointer-events-none transform -rotate-12 transition-transform duration-1000 group-hover:rotate-0">
            <Telescope className="w-[300px] h-[300px]" strokeWidth={1} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default SobreNosotros;
