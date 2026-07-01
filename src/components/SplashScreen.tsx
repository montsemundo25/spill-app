import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import spillLogo from '../assets/spill-logo.svg';

interface SplashScreenProps {
  onDismiss: () => void;
}


export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    const handleKey = () => onDismiss();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onDismiss]);

  // Hand-drawn boil: cycle through baseFrequency values at ~12fps
  // feTurbulence generates Perlin noise; feDisplacementMap warps pixels using that noise
  useEffect(() => {
    const freqs = [0.010, 0.020, 0.015, 0.030, 0.012, 0.025, 0.018, 0.022, 0.010, 0.028];
    let i = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        turbulenceRef.current?.setAttribute('baseFrequency', String(freqs[i % freqs.length]));
        i++;
      }, 150);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

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
      {/* SVG filter definition — invisible, only used as CSS filter reference */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden>
        <defs>
          <filter id="splash-boil" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Subtle grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <header className="w-full flex justify-between items-center z-10 pt-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-xs font-display tracking-[0.2em] uppercase font-bold text-[#E8BFE9]">
          <span>SPILL</span>
        </div>
        <div className="text-[10px] sm:text-xs font-display text-white/40 tracking-wider">v1.2</div>
      </header>

      {/* Logo + wordmark */}
      <main className="flex-grow flex flex-col justify-center items-center relative max-w-lg mx-auto w-full z-10">

        <motion.img
          src={spillLogo}
          alt="Spill"
          className="w-[160px] xs:w-[200px] sm:w-[240px] h-auto"
          style={{ filter: 'url(#splash-boil)' }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            opacity: { duration: 0.4, delay: 0.1 },
            scale: { type: 'spring', stiffness: 180, damping: 14, delay: 0.1 },
          }}
        />

        {/* Wordmark */}
        <h1 className="font-display text-4xl xs:text-5xl sm:text-6xl font-bold tracking-tight mt-8 sm:mt-10 overflow-hidden flex">
          {'SPILL'.split('').map((letter, i) => (
            <motion.span
              key={i}
              className="bg-gradient-to-r from-white via-[#E8BFE9] to-white bg-clip-text text-transparent inline-block"
              initial={{ y: 48, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 14, delay: i * 0.07 }}
            >
              {letter}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          className="font-display text-xs sm:text-sm text-white/55 mt-2 sm:mt-3 text-center max-w-xs leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.48, duration: 0.45 }}
        >
          Break the ice with friends, your team, or dates.
        </motion.p>
      </main>

      {/* CTA */}
      <footer className="w-full flex flex-col items-center gap-3 z-10 pb-4 max-w-md mx-auto">
        <motion.button
          onClick={handleStart}
          className="w-full max-w-[320px] bg-[#D2E823] text-[#131414] font-display text-xs sm:text-sm font-bold py-4 rounded-full card-shadow flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.97] transition-transform duration-200 cursor-pointer"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <span>START PLAYING</span>
        </motion.button>

        <motion.span
          className="font-display text-[10px] tracking-wider text-white/30 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          Press any key or click to skip
        </motion.span>
      </footer>
    </div>
  );
};
