import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SplashScreenProps {
  onDismiss: () => void;
}

const CARDS = [
  { bg: '#5B072D', text: '#E8BFE9', label: 'ME',      question: "What pattern keeps repeating in your life?", rotate: -9,  x: -75, y: -8,  scale: 0.91 },
  { bg: '#2665D6', text: '#D2E823', label: 'WORK',    question: "What's your best work fun fact?",             rotate: -3,  x: -22, y: -3,  scale: 0.95 },
  { bg: '#D2E823', text: '#2665D6', label: 'FRIENDS', question: "What's the wildest dare you've taken?",       rotate:  3,  x:  22, y: -3,  scale: 0.98 },
  { bg: '#E8BFE9', text: '#5B072D', label: 'LOVE',    question: "What's your favorite memory together?",       rotate:  9,  x:  75, y: -8,  scale: 1.0  },
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  useEffect(() => {
    const handleKey = () => onDismiss();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onDismiss]);

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.82 },
      colors: ['#5B072D', '#2665D6', '#D2E823', '#E8BFE9', '#FFFFFF'],
      startVelocity: 48,
      gravity: 0.85,
      ticks: 220,
    });
    setTimeout(onDismiss, 680);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#131414] text-white overflow-hidden p-6 select-none cursor-pointer"
      onClick={onDismiss}
    >
      {/* Subtle grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <header className="w-full flex justify-between items-center z-10 pt-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-xs font-display tracking-[0.2em] uppercase font-bold text-[#E8BFE9]">
          <Sparkles className="w-4 h-4 text-[#D2E823] animate-pulse" />
          <span>SPILL</span>
        </div>
        <div className="text-[10px] sm:text-xs font-display text-white/40 tracking-wider">v1.2</div>
      </header>

      {/* Card fan + wordmark */}
      <main className="flex-grow flex flex-col justify-center items-center relative max-w-lg mx-auto w-full">

        {/* Fanned card stack */}
        <div className="relative w-full h-[200px] xs:h-[240px] sm:h-[280px] flex justify-center items-center">
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              className="absolute w-[150px] xs:w-[180px] sm:w-[215px] h-[100px] xs:h-[120px] sm:h-[150px] rounded-2xl sm:rounded-3xl card-shadow flex flex-col justify-between p-3.5 sm:p-4"
              style={{ backgroundColor: card.bg, color: card.text, zIndex: i + 10 }}
              initial={{ opacity: 0, y: 130, scale: 0.65, rotate: 0, x: 0 }}
              animate={{ opacity: 1, y: card.y, scale: card.scale, rotate: card.rotate, x: card.x }}
              whileHover={{ y: card.y - 18, scale: card.scale + 0.04, transition: { type: 'spring', stiffness: 320, damping: 10 } }}
              transition={{ type: 'spring', stiffness: 130, damping: 15, delay: i * 0.07 }}
            >
              <div className="flex justify-between items-center" style={{ opacity: 0.55 }}>
                <span className="font-display text-[8px] sm:text-[10px] font-bold tracking-[0.15em]">
                  {card.label}
                </span>
                <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ opacity: 0.5 }} />
              </div>
              <p className="font-display text-[10px] xs:text-[11px] sm:text-xs font-bold leading-snug">
                {card.question}
              </p>
              <div className="w-5 h-0.5 rounded" style={{ backgroundColor: 'currentColor', opacity: 0.25 }} />
            </motion.div>
          ))}
        </div>

        {/* Wordmark */}
        <motion.h1
          className="font-display text-4xl xs:text-5xl sm:text-6xl font-bold tracking-tight mt-8 sm:mt-10 bg-gradient-to-r from-white via-[#E8BFE9] to-white bg-clip-text text-transparent"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.52, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          SPILL
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="font-display text-xs sm:text-sm text-white/55 mt-2 sm:mt-3 text-center max-w-xs leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.78, duration: 0.45 }}
        >
          Break the ice with friends, your team, or dates.
        </motion.p>
      </main>

      {/* CTA */}
      <footer className="w-full flex flex-col items-center gap-3 z-10 pb-4 max-w-md mx-auto">
        <motion.button
          onClick={handleStart}
          className="w-full max-w-[320px] bg-[#D2E823] text-[#131414] font-display text-xs sm:text-sm font-bold py-4 rounded-full card-shadow flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.97] transition-transform duration-200 cursor-pointer"
          initial={{ opacity: 0, scale: 0.88, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <span>START PLAYING</span>
          <Sparkles className="w-4 h-4 text-[#5B072D]" />
        </motion.button>

        <motion.span
          className="font-display text-[10px] tracking-wider text-white/30 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          Press any key or click to skip
        </motion.span>
      </footer>
    </div>
  );
};
