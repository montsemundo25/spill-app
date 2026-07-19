import React, { useEffect, useLayoutEffect } from 'react';
import { motion, useAnimationControls } from 'motion/react';
import swipeIcon from '../assets/swipe-icon.svg';
import { Question } from '../types';

interface CardDeckProps {
  questions: Question[];
  onSwipe: () => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  hintColor?: string;
}

export const CardDeck: React.FC<CardDeckProps> = ({
  questions,
  onSwipe,
  isAnimating,
  setIsAnimating,
  hintColor = '#131414'
}) => {
  const displayCards = questions.slice(0, 4);
  const controls = useAnimationControls();

  const [isMobile, setIsMobile] = React.useState(false);
  const [showHint, setShowHint] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 2700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Before paint: set new front card to the back-card's position.
  // scale:1 from the start → no "growing" animation.
  // opacity:1 explicitly → no grey flash from stale motion values.
  useLayoutEffect(() => {
    if (!questions[0]?.id) return;
    controls.set({
      x: isMobile ? -14 : -22,
      y: isMobile ? -12 : -24,
      rotate: -6,
      scale: 1,
      opacity: 1,
    });
  }, [questions[0]?.id, isMobile]);

  // Smooth spring settle to front position
  useEffect(() => {
    if (!questions[0]?.id) return;
    controls.start({
      x: 0, y: 0, rotate: 0, scale: 1, opacity: 1,
      transition: { type: 'spring', stiffness: 200, damping: 28 },
    });
  }, [questions[0]?.id]);

  // Update rotate + opacity on each drag frame (replaces useTransform)
  const handleDrag = (_event: any, info: any) => {
    const offset = info.offset.x;
    controls.set({
      rotate: Math.min(15, Math.max(-15, (offset / 300) * 15)),
      opacity: Math.max(0, 1 - (Math.abs(offset) - 200) / 100),
    });
  };

  const handleDragEnd = async (_event: any, info: any) => {
    if (isAnimating) return;

    const threshold = 120;
    if (info.offset.x > threshold) {
      setIsAnimating(true);
      await controls.start({
        x: window.innerWidth * 0.8,
        rotate: 15,
        opacity: 0,
        transition: { duration: 0.18, ease: 'easeIn' }
      });
      onSwipe();
      setIsAnimating(false);
    } else if (info.offset.x < -threshold) {
      setIsAnimating(true);
      await controls.start({
        x: -window.innerWidth * 0.8,
        rotate: -15,
        opacity: 0,
        transition: { duration: 0.18, ease: 'easeIn' }
      });
      onSwipe();
      setIsAnimating(false);
    } else {
      controls.start({
        x: 0, y: 0, rotate: 0, scale: 1, opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      });
    }
  };

  const triggerProgrammaticSwipe = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    await controls.start({
      x: -window.innerWidth * 0.8,
      rotate: -15,
      opacity: 0,
      transition: { duration: 0.18, ease: 'easeIn' }
    });
    onSwipe();
    setIsAnimating(false);
  };

  React.useEffect(() => {
    const handleNextEvent = () => triggerProgrammaticSwipe();
    window.addEventListener('trigger-next-question', handleNextEvent);
    return () => window.removeEventListener('trigger-next-question', handleNextEvent);
  }, [isAnimating, onSwipe]);

  if (displayCards.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] sm:h-[400px] w-full max-w-[700px] bg-white/10 rounded-3xl border border-white/10 px-6">
        <p className="font-display text-base sm:text-lg text-white opacity-80 text-center">No hay preguntas disponibles.</p>
      </div>
    );
  }

  const getCardStyles = (index: number) => {
    if (index === 1) {
      return { x: isMobile ? -14 : -22, y: isMobile ? -12 : -24, rotate: -6,  scale: 0.96, zIndex: 10 };
    }
    if (index === 2) {
      return { x: isMobile ? 18 : 30,   y: isMobile ? -22 : -44, rotate: 9,   scale: 0.91, zIndex: 5  };
    }
    // index === 3 — furthest back
    return   { x: isMobile ? -10 : -16, y: isMobile ? -32 : -62, rotate: -3,  scale: 0.86, zIndex: 2  };
  };

  const cardsWithIndex = displayCards.map((card, index) => ({ card, index }));
  const reversedCards = [...cardsWithIndex].reverse();

  const cardStack = (
    <div className="relative w-full max-w-[490px] aspect-[490/315] flex justify-center items-center select-none translate-y-4 sm:translate-y-8">
      {reversedCards.map(({ card, index }) => {
        const isFront = index === 0;

        return (
          <motion.div
            key={card.id}
            className={`absolute inset-0 card-rounded card-shadow flex flex-col items-center justify-center text-center ${
              isFront ? 'p-4 xs:p-6 md:p-8 cursor-grab active:cursor-grabbing' : 'p-4 sm:p-6 pointer-events-none'
            }`}
            style={{
              backgroundColor: card.theme.bg,
              color: card.theme.text,
              zIndex: isFront ? 20 : (index === 1 ? 10 : (index === 2 ? 5 : 2)),
            }}
            drag={isFront ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragStart={isFront ? () => setShowHint(false) : undefined}
            onDrag={isFront ? handleDrag : undefined}
            onDragEnd={isFront ? handleDragEnd : undefined}
            initial={isFront ? undefined : getCardStyles(index)}
            animate={isFront ? controls : getCardStyles(index)}
            transition={{ type: 'spring', stiffness: 140, damping: 30 }}
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="z-10 w-full pointer-events-none">
              <span
                className="font-display text-[11px] sm:text-[14px] font-bold uppercase tracking-[0.2em] block mb-4 sm:mb-6"
                style={{ color: card.theme.label }}
              >
                {card.subtheme}
              </span>

              <p className="font-display text-[14px] xs:text-[17px] sm:text-[22px] md:text-[27px] lg:text-[32px] font-bold mb-2 min-h-[70px] xs:min-h-[90px] md:min-h-[110px] flex items-center justify-center leading-[1.15] sm:leading-[1.1] tracking-[-0.015em] sm:tracking-[-0.02em]">
                {card.text}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full max-w-[490px]">
      {cardStack}

      {showHint && (
        <motion.div
          className="mt-4 sm:mt-6 flex flex-col items-center gap-1.5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.6, times: [0, 0.15, 0.8, 1], ease: 'easeInOut' }}
        >
          <motion.img
            src={swipeIcon}
            alt=""
            className="w-9 h-9 xs:w-10 xs:h-10"
            animate={{ x: [0, -20, 20, 0] }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
          />
          <span
            className="font-display text-[10px] xs:text-[11px] font-bold uppercase tracking-[0.15em]"
            style={{ color: hintColor, opacity: 0.6 }}
          >
            Desliza
          </span>
        </motion.div>
      )}
    </div>
  );
};
