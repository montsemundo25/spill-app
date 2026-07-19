import { useState, useEffect } from 'react';
import { CardDeck } from './components/CardDeck';
import { PRESET_QUESTIONS } from './data/questions';
import { Category, Theme, Question } from './types';
import { RefreshCw } from 'lucide-react';
import { SplashScreen } from './components/SplashScreen';
import { LoveDoodles } from './components/LoveDoodles';
import { AnimatePresence, motion } from 'motion/react';

const THEMES: Record<Category, Theme> = {
  'work':    { bg: '#2665D6', text: '#FFFFFF', label: 'rgba(255,255,255,0.6)' },
  'me':      { bg: '#5B072D', text: '#FFFFFF', label: 'rgba(255,255,255,0.6)' },
  'friends': { bg: '#D2E823', text: '#131414', label: 'rgba(19,20,20,0.5)' },
  'love':    { bg: '#E8BFE9', text: '#131414', label: 'rgba(19,20,20,0.5)' },
};

const CARD_COMBINATIONS: Theme[] = [
  { bg: '#5B072D', text: '#E8BFE9', label: 'rgba(232, 191, 233, 0.6)' },
  { bg: '#D2E823', text: '#2665D6', label: 'rgba(38, 101, 214, 0.6)' },
  { bg: '#E8BFE9', text: '#5B072D', label: 'rgba(91, 7, 45, 0.6)' },
  { bg: '#2665D6', text: '#D2E823', label: 'rgba(210, 232, 35, 0.6)' },
  { bg: '#131414', text: '#FFFFFF', label: 'rgba(255, 255, 255, 0.6)' },
  { bg: '#FFFFFF', text: '#131414', label: 'rgba(19, 20, 20, 0.6)' },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('love');
  const [queue, setQueue] = useState<Question[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const buildPool = (category: Category): Question[] => {
    const siteBg = THEMES[category].bg.toLowerCase();
    const allowedCombinations = CARD_COMBINATIONS.filter(
      (combo) => combo.bg.toLowerCase() !== siteBg
    );
    const pool = allowedCombinations.length > 0 ? allowedCombinations : CARD_COMBINATIONS;

    const sourceQuestions = PRESET_QUESTIONS[category].map((q) => ({ ...q, category }));

    const shuffled = [...sourceQuestions].sort(() => Math.random() - 0.5);

    const recentThemes: Theme[] = [];
    return shuffled.map((item, index) => {
      const usedBgs = recentThemes.map((t) => t.bg.toLowerCase());
      let candidates = pool.filter((c) => !usedBgs.includes(c.bg.toLowerCase()));
      if (candidates.length === 0) candidates = pool;
      const chosenTheme = candidates[Math.floor(Math.random() * candidates.length)];
      recentThemes.push(chosenTheme);
      if (recentThemes.length > 3) recentThemes.shift();

      return {
        id: `${category}-${index}-${Math.random()}`,
        text: item.text,
        subtheme: item.subtheme,
        category: item.category,
        theme: chosenTheme,
      };
    });
  };

  useEffect(() => {
    setQueue(buildPool(activeCategory));
  }, [activeCategory]);

  const handleSwipe = () => {
    if (queue.length === 0) return;

    setQueue((prevQueue) => {
      if (prevQueue.length === 0) return prevQueue;
      const finished = prevQueue[0];

      const siteBg = THEMES[activeCategory].bg.toLowerCase();
      const allowed = CARD_COMBINATIONS.filter((c) => c.bg.toLowerCase() !== siteBg);
      const pool = allowed.length > 0 ? allowed : CARD_COMBINATIONS;

      // Avoid repeating any color already visible in the last 3 queue positions
      const recentBgs = prevQueue.slice(-3).map((q) => q.theme.bg.toLowerCase());
      let candidates = pool.filter((c) => !recentBgs.includes(c.bg.toLowerCase()));
      if (candidates.length === 0) candidates = pool;
      const chosenTheme = candidates[Math.floor(Math.random() * candidates.length)];

      const recycled: Question = {
        ...finished,
        id: `${finished.category}-${Date.now()}-${Math.random()}`,
        theme: chosenTheme,
      };
      return [...prevQueue.slice(1), recycled];
    });
  };

  const triggerNext = () => {
    if (isAnimating) return;
    window.dispatchEvent(new CustomEvent('trigger-next-question'));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSplash) { setShowSplash(false); return; }
      if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        triggerNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [queue, isAnimating, showSplash]);

  const isDark = activeCategory === 'work' || activeCategory === 'me';
  const outsideTextColor = isDark ? 'text-[#F4F1EA]' : 'text-[#131414]';
  const navContainerBorder = isDark ? 'border-white/10' : 'border-[#131414]/10';
  const navContainerBg = isDark ? 'bg-white/10' : 'bg-[#131414]/5';

  const NAV_ITEMS: { key: Category; label: string }[] = [
    { key: 'work',    label: 'Work' },
    { key: 'me',      label: 'Me' },
    { key: 'friends', label: 'Friends' },
    { key: 'love',    label: 'Love' },
  ];

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.15, 1] }}
            className="fixed inset-0 z-[100]"
          >
            <SplashScreen onDismiss={() => setShowSplash(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="h-[100dvh] flex flex-col justify-between overflow-hidden transition-colors duration-700 ease-in-out px-4 pt-6 pb-4 sm:pb-8"
        style={{ backgroundColor: THEMES[activeCategory].bg }}
      >
        {/* HEADER / NAVIGATION */}
        <header className="flex justify-center items-center w-full z-50 pt-1 sm:pt-2">
          <nav
            className={`backdrop-blur-md rounded-full p-1 sm:p-1.5 flex items-center relative border transition-colors duration-500 shadow-lg ${navContainerBg} ${navContainerBorder}`}
          >
            {NAV_ITEMS.map(({ key, label }) => {
              const isActive = activeCategory === key;
              let textClass = '';
              if (isActive) {
                textClass = 'text-white font-bold scale-100';
              } else {
                textClass = isDark
                  ? 'text-white/75 hover:text-white hover:scale-105'
                  : 'text-[#131414]/75 hover:text-[#131414] hover:scale-105';
              }

              return (
                <button
                  key={key}
                  className={`px-3 xs:px-5 md:px-7 py-1.5 sm:py-2 text-[10px] xs:text-xs md:text-sm font-display uppercase tracking-[0.05em] rounded-full transition-all duration-300 relative z-10 font-bold cursor-pointer ${textClass}`}
                  onClick={() => { if (!isAnimating) setActiveCategory(key); }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-[#131414] rounded-full shadow-md -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </header>

        {/* Love mode background doodles */}
        {/* {activeCategory === 'love' && <LoveDoodles />} */}

        {/* CORE DECK STACK */}
        <main className="flex-grow flex flex-col justify-center items-center relative">
          <CardDeck
            key={`${activeCategory}-${showSplash}`}
            questions={queue}
            onSwipe={handleSwipe}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
            hintColor={isDark ? '#F4F1EA' : '#131414'}
          />
        </main>

        {/* BUTTON + FOOTER — grouped so gap between them is exactly 24px */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={triggerNext}
            disabled={isAnimating}
            className="group flex items-center gap-2.5 sm:gap-3 bg-[#131414] text-white hover:opacity-90 font-display text-xs sm:text-sm md:text-base font-bold px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-full card-shadow transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <span>Next question</span>
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform duration-500 ${isAnimating ? 'animate-spin' : 'group-hover:rotate-180'}`} />
          </button>

          <footer className={`flex flex-col items-center justify-center gap-0.5 opacity-60 transition-colors duration-500 select-none ${outsideTextColor}`}>
            <span className="font-display text-[13px] font-bold tracking-[0.1em] uppercase">Spill</span>
            <p className="font-display text-[11px] font-medium tracking-wide">
              built with claude code · deployed with vercel
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
