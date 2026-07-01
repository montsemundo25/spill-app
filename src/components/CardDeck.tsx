import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimationControls } from 'motion/react';
import { Question } from '../types';

interface CardDeckProps {
  questions: Question[];
  onSwipe: () => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
}

export const CardDeck: React.FC<CardDeckProps> = ({
  questions,
  onSwipe,
  isAnimating,
  setIsAnimating
}) => {
  const displayCards = questions.slice(0, 3);
  const controls = useAnimationControls();
  const x = useMotionValue(0);

  // Responsive mobile state tracking
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Rotate the card as it drags
  const rotate = useTransform(x, [-300, 300], [-15, 15]);
  // Fade out slightly when dragged extremely far
  const opacity = useTransform(x, [-300, -200, 0, 200, 300], [0, 1, 1, 1, 0]);

  // If active card changes, handoff Card 1's state to Card 0 and zoom it forward!
  useEffect(() => {
    if (questions[0]?.id) {
      // Start exactly from Card 1's position to avoid sudden jumps
      controls.set({
        x: 0,
        y: isMobile ? -8 : -18,
        rotate: -2,
        scale: 0.97,
        opacity: 1
      });
      // Animate smoothly to Card 0's active front position (zoom-in + settle)
      controls.start({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }
      });
    }
  }, [questions[0]?.id, controls, isMobile]);

  const handleDragEnd = async (event: any, info: any) => {
    if (isAnimating) return;

    const threshold = 120;
    if (info.offset.x > threshold) {
      setIsAnimating(true);
      await controls.start({
        x: window.innerWidth * 0.8,
        rotate: 15,
        opacity: 0,
        transition: { duration: 0.3, ease: 'easeOut' }
      });
      onSwipe();
      setIsAnimating(false);
    } else if (info.offset.x < -threshold) {
      setIsAnimating(true);
      await controls.start({
        x: -window.innerWidth * 0.8,
        rotate: -15,
        opacity: 0,
        transition: { duration: 0.3, ease: 'easeOut' }
      });
      onSwipe();
      setIsAnimating(false);
    } else {
      controls.start({ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  const triggerProgrammaticSwipe = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Swipe out to the left
    await controls.start({
      x: -window.innerWidth * 0.8,
      rotate: -15,
      opacity: 0,
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
    });

    onSwipe();
    setIsAnimating(false);
  };

  React.useEffect(() => {
    const handleNextEvent = () => triggerProgrammaticSwipe();
    window.addEventListener('trigger-next-question', handleNextEvent);
    return () => {
      window.removeEventListener('trigger-next-question', handleNextEvent);
    };
  }, [isAnimating, onSwipe]);

  if (displayCards.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] sm:h-[400px] w-full max-w-[700px] bg-white/10 rounded-3xl border border-white/10 px-6">
        <p className="font-display text-base sm:text-lg text-white opacity-80 text-center">No hay preguntas disponibles.</p>
      </div>
    );
  }

  // Define position-based styling configs for back cards
  const getCardStyles = (index: number) => {
    if (index === 1) {
      // Middle card
      return {
        x: isMobile ? -6 : -10,
        y: isMobile ? -8 : -18,
        rotate: -2,
        scale: 0.97,
        zIndex: 10,
      };
    }
    // Back card (index === 2)
    return {
      x: isMobile ? 8 : 12,
      y: isMobile ? -16 : -32,
      rotate: 3,
      scale: 0.94,
      zIndex: 5,
    };
  };

  // Build list with original index to map properly from back to front (DOM layering)
  const cardsWithIndex = displayCards.map((card, index) => ({ card, index }));
  const reversedCards = [...cardsWithIndex].reverse();

  return (
    <div className="relative w-full max-w-[700px] h-[300px] xs:h-[350px] sm:h-[400px] md:h-[450px] flex justify-center items-center select-none">
      {reversedCards.map(({ card, index }) => {
        const isFront = index === 0;

        return (
          <motion.div
            key={card.id}
            className={`absolute inset-0 card-rounded card-shadow flex flex-col items-center justify-center text-center ${
              isFront ? 'p-5 xs:p-8 md:p-12 cursor-grab active:cursor-grabbing' : 'p-6 sm:p-8 pointer-events-none'
            }`}
            style={{
              backgroundColor: card.theme.bg,
              color: card.theme.text,
              zIndex: isFront ? 20 : (index === 1 ? 10 : 5),
              ...(isFront ? { x, rotate, opacity } : {}),
            }}
            // Only front card is draggable
            drag={isFront ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={isFront ? handleDragEnd : undefined}
            initial={isFront ? undefined : getCardStyles(index)}
            animate={isFront ? controls : getCardStyles(index)}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Atmosphere glow inside card */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="z-10 w-full pointer-events-none">
              <span
                className={`font-display text-[11px] sm:text-[14px] font-bold uppercase tracking-[0.2em] block mb-4 sm:mb-6 transition-opacity duration-300 ${
                  isFront ? 'opacity-100' : 'opacity-40'
                }`}
                style={{ color: card.theme.label }}
              >
                {card.category === 'royal-work' ? 'Work' : card.category === 'lime-fun' ? 'Fun' : 'Deep'}
              </span>

              {isFront ? (
                <h1 className="font-display text-[18px] xs:text-[23px] sm:text-[30px] md:text-[38px] lg:text-[44px] font-bold mb-2 min-h-[100px] xs:min-h-[130px] md:min-h-[160px] flex items-center justify-center leading-[1.15] sm:leading-[1.1] tracking-[-0.015em] sm:tracking-[-0.02em]">
                  {card.text}
                </h1>
              ) : (
                <h2
                  className={`font-display text-base xs:text-xl sm:text-2xl md:text-4xl font-bold mb-2 min-h-[100px] xs:min-h-[130px] md:min-h-[160px] flex items-center justify-center leading-tight tracking-tight transition-opacity duration-300 ${
                    index === 1 ? 'opacity-40' : 'opacity-20'
                  }`}
                >
                  {card.text}
                </h2>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
