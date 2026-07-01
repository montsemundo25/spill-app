import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  const [step, setStep] = useState(0);

  // Auto-dismiss or transition phases
  useEffect(() => {
    // Stage 0: Staggered entry of colors
    // Stage 1: Fan out and rotate
    // Stage 2: Click to start or auto start
    const timer1 = setTimeout(() => setStep(1), 500);
    const timer2 = setTimeout(() => setStep(2), 1200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const cardColors = [
    { bg: '#780016', text: '#E8BFE9', label: 'DEEP', rotate: -8, scale: 0.92, offset: -25 }, // Burgundy
    { bg: '#2665D6', text: '#D2E823', label: 'WORK', rotate: -4, scale: 0.95, offset: -10 }, // Blue
    { bg: '#D2E823', text: '#2665D6', label: 'FUN', rotate: 4, scale: 0.98, offset: 10 },    // Lime
    { bg: '#E8BFE9', text: '#780016', label: 'ALL', rotate: 8, scale: 1.0, offset: 25 },     // Lilac
  ];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#131414] text-white overflow-hidden p-6 select-none">
      {/* Decorative top grid details */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] pointer-events-none"></div>

      {/* Header */}
      <header className="w-full flex justify-between items-center z-10 pt-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-xs font-display tracking-[0.2em] uppercase font-bold text-[#E8BFE9]">
          <Sparkles className="w-4 h-4 text-[#D2E823] animate-pulse" />
          <span>SPILL</span>
        </div>
        <div className="text-[10px] sm:text-xs font-display text-white/50 tracking-wider">
          v1.2 · PREMIUM
        </div>
      </header>

      {/* Main Canvas Deck Preview */}
      <main className="flex-grow flex flex-col justify-center items-center relative my-8 max-w-lg mx-auto w-full">
        <div className="relative w-full h-[220px] xs:h-[260px] sm:h-[300px] flex justify-center items-center">
          <AnimatePresence>
            {cardColors.map((card, i) => {
              // Interactive fan-out rotation values
              const currentRotate = step >= 1 ? card.rotate : 0;
              const currentX = step >= 1 ? card.offset : 0;
              const currentY = step >= 1 ? (i % 2 === 0 ? -12 : -4) : 0;

              return (
                <motion.div
                  key={i}
                  className="absolute w-[180px] xs:w-[220px] sm:w-[265px] h-[120px] xs:h-[150px] sm:h-[180px] rounded-2xl sm:rounded-3xl card-shadow flex flex-col justify-between p-4 sm:p-5 border border-black/10"
                  style={{
                    backgroundColor: card.bg,
                    color: card.text,
                    zIndex: i + 10,
                  }}
                  initial={{ scale: 0.2, rotate: 0, opacity: 0, y: 150 }}
                  animate={{
                    scale: card.scale,
                    rotate: currentRotate,
                    x: currentX,
                    y: currentY,
                    opacity: 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 160,
                    damping: 15,
                    delay: i * 0.1,
                  }}
                >
                  <div className="flex justify-between items-center opacity-60">
                    <span className="font-display text-[8px] sm:text-[10px] font-bold tracking-[0.15em]">
                      {card.label}
                    </span>
                    <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 opacity-50" />
                  </div>
                  <h3 className="font-display text-xs xs:text-sm sm:text-base font-bold leading-tight tracking-tight mt-1">
                    {i === 0 && "¿Qué cambiarías hoy?"}
                    {i === 1 && "¿Cuál es tu mayor logro?"}
                    {i === 2 && "¿Cuál es tu placer culposo?"}
                    {i === 3 && "¿Cómo defines el éxito?"}
                  </h3>
                  <div className="w-6 h-1 rounded bg-current opacity-30"></div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Dynamic Text Information */}
        <div className="text-center mt-6 sm:mt-10 z-20 px-4">
          <motion.h1
            className="font-display text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight mb-2 sm:mb-3 bg-gradient-to-r from-white via-[#E8BFE9] to-white bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Spill
          </motion.h1>
          <motion.p
            className="font-display text-xs sm:text-sm text-white/70 max-w-sm mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Rompe el hielo con amigos, equipo o citas usando hermosas cartas interactivas y dinámicas.
          </motion.p>
        </div>
      </main>

      {/* Footer & Call to Action */}
      <footer className="w-full flex flex-col items-center gap-4 z-10 pb-4 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {step >= 2 ? (
            <motion.button
              key="start-btn"
              onClick={onDismiss}
              className="w-full bg-[#D2E823] text-[#131414] hover:bg-[#c2d71d] font-display text-xs sm:text-sm font-bold py-4 rounded-full card-shadow transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <span>EMPEZAR A JUGAR</span>
              <Sparkles className="w-4 h-4 text-[#780016]" />
            </motion.button>
          ) : (
            <motion.div
              key="loader"
              className="flex items-center gap-2 text-xs font-display text-white/50 py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-2 h-2 rounded-full bg-[#E8BFE9] animate-ping"></div>
              <span>Preparando baraja...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <span className="font-display text-[10px] tracking-wider text-white/30 uppercase">
          Presiona cualquier tecla o haz clic para omitir
        </span>
      </footer>
    </div>
  );
};
