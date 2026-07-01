import { useState, useEffect } from 'react';
import { CardDeck } from './components/CardDeck';
import { PRESET_QUESTIONS } from './data/questions';
import { Category, Theme, Question } from './types';
import { RefreshCw } from 'lucide-react';
import { SplashScreen } from './components/SplashScreen';
import { AnimatePresence, motion } from 'motion/react';

const THEMES: Record<string, Theme> = {
  'royal-work': { bg: '#2665D6', text: '#FFFFFF', label: 'rgba(255,255,255,0.6)' },
  'lime-fun': { bg: '#D2E823', text: '#131414', label: 'rgba(19,20,20,0.5)' },
  'oxblood-deep': { bg: '#780016', text: '#FFFFFF', label: 'rgba(255,255,255,0.6)' },
  'lilac-all': { bg: '#E8BFE9', text: '#131414', label: 'rgba(19,20,20,0.5)' }
};

// 6 distinct card combinations C1..C6:
const CARD_COMBINATIONS: Theme[] = [
  { bg: '#780016', text: '#E8BFE9', label: 'rgba(232, 191, 233, 0.6)' }, // C1: bg burgundy letra rosa
  { bg: '#D2E823', text: '#2665D6', label: 'rgba(38, 101, 214, 0.6)' }, // C2: bg lima letra azul
  { bg: '#E8BFE9', text: '#780016', label: 'rgba(120, 0, 22, 0.6)' },  // C3: bg rosa letra burgundy
  { bg: '#2665D6', text: '#D2E823', label: 'rgba(210, 232, 35, 0.6)' }, // C4: bg azul letra lima
  { bg: '#131414', text: '#FFFFFF', label: 'rgba(255, 255, 255, 0.6)' }, // C5: bg negro letra blanco
  { bg: '#FFFFFF', text: '#131414', label: 'rgba(19, 20, 20, 0.6)' }    // C6: bg blanco letra negro
];

function getRandomCardTheme(category: Category): Theme {
  const siteBg = THEMES[category].bg.toLowerCase();
  
  // Filter out any combination where the card's background matches the current site background
  const allowedCombinations = CARD_COMBINATIONS.filter(
    (combo) => combo.bg.toLowerCase() !== siteBg
  );

  // Fallback to all combinations if somehow filtered to empty
  const pool = allowedCombinations.length > 0 ? allowedCombinations : CARD_COMBINATIONS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('lilac-all');
  const [queue, setQueue] = useState<Question[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Initialize pool with guaranteed different consecutive themes
  const buildPool = (category: Category): Question[] => {
    let rawList: { text: string; category: 'royal-work' | 'lime-fun' | 'oxblood-deep' }[] = [];

    if (category === 'lilac-all') {
      // Merge all preset categories
      Object.entries(PRESET_QUESTIONS).forEach(([cat, questions]) => {
        questions.forEach((qText) => {
          rawList.push({
            text: qText,
            category: cat as 'royal-work' | 'lime-fun' | 'oxblood-deep'
          });
        });
      });
    } else {
      PRESET_QUESTIONS[category].forEach((qText) => {
        rawList.push({
          text: qText,
          category: category as 'royal-work' | 'lime-fun' | 'oxblood-deep'
        });
      });
    }

    // Shuffle the raw list of questions
    const shuffledList = [...rawList].sort(() => Math.random() - 0.5);

    // Get allowed card themes for the current category context (excluding site background)
    const siteBg = THEMES[category].bg.toLowerCase();
    const allowedCombinations = CARD_COMBINATIONS.filter(
      (combo) => combo.bg.toLowerCase() !== siteBg
    );
    const pool = allowedCombinations.length > 0 ? allowedCombinations : CARD_COMBINATIONS;

    // Sequentially assign themes so that consecutive cards don't have the same background
    let lastTheme: Theme | null = null;
    return shuffledList.map((item, index) => {
      let candidates = pool;
      if (lastTheme) {
        candidates = pool.filter((combo) => combo.bg.toLowerCase() !== lastTheme!.bg.toLowerCase());
      }
      if (candidates.length === 0) {
        candidates = pool;
      }
      const chosenTheme = candidates[Math.floor(Math.random() * candidates.length)];
      lastTheme = chosenTheme;

      return {
        id: `${category}-${index}-${Math.random()}`,
        text: item.text,
        category: item.category,
        theme: chosenTheme
      };
    });
  };

  // Build pool on initial mount and when category changes
  useEffect(() => {
    setQueue(buildPool(activeCategory));
  }, [activeCategory]);

  // Swipe logic: rotate first question to the back of the queue with a fresh theme
  const handleSwipe = () => {
    if (queue.length === 0) return;

    setQueue((prevQueue) => {
      if (prevQueue.length === 0) return prevQueue;
      const finished = prevQueue[0];
      
      // Ensure the recycled card appended to the back does not match the previous card's theme bg
      const lastCardInQueue = prevQueue[prevQueue.length - 1];
      const lastTheme = lastCardInQueue ? lastCardInQueue.theme : null;

      const siteBg = THEMES[activeCategory].bg.toLowerCase();
      const allowedCombinations = CARD_COMBINATIONS.filter(
        (combo) => combo.bg.toLowerCase() !== siteBg
      );
      const pool = allowedCombinations.length > 0 ? allowedCombinations : CARD_COMBINATIONS;

      let candidates = pool;
      if (lastTheme) {
        candidates = pool.filter((combo) => combo.bg.toLowerCase() !== lastTheme.bg.toLowerCase());
      }
      if (candidates.length === 0) {
        candidates = pool;
      }
      const chosenTheme = candidates[Math.floor(Math.random() * candidates.length)];

      const recycled: Question = {
        ...finished,
        id: `${finished.category}-${Date.now()}-${Math.random()}`, // Assign fresh unique ID for next rotation
        theme: chosenTheme // Recycled cards get a fresh colorful background
      };
      return [...prevQueue.slice(1), recycled];
    });
  };

  // Programmatic swipe via click
  const triggerNext = () => {
    if (isAnimating) return;
    window.dispatchEvent(new CustomEvent('trigger-next-question'));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSplash) {
        setShowSplash(false);
        return;
      }
      if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        triggerNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [queue, isAnimating, showSplash]);

  // Determine external text colors for optimum readability against the active category BG
  // Work and Deep (Dark BGs) -> cream text
  // Fun and All (Light BGs) -> dark charcoal text
  const isDarkCategory = activeCategory === 'royal-work' || activeCategory === 'oxblood-deep';
  const outsideTextColor = isDarkCategory ? 'text-[#F4F1EA]' : 'text-[#131414]';
  const navContainerBorder = isDarkCategory ? 'border-white/10' : 'border-[#131414]/10';
  const navContainerBg = isDarkCategory ? 'bg-white/10' : 'bg-[#131414]/5';

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[100]"
          >
            <SplashScreen onDismiss={() => setShowSplash(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="h-[100dvh] flex flex-col justify-between overflow-hidden transition-colors duration-700 ease-in-out px-4 py-4 sm:py-8"
        style={{ backgroundColor: THEMES[activeCategory].bg }}
      >
      {/* HEADER / NAVIGATION */}
      <header className="flex justify-center items-center w-full z-50 pt-1 sm:pt-2">
        <nav
          className={`backdrop-blur-md rounded-full p-1 sm:p-1.5 flex items-center relative border transition-colors duration-500 shadow-lg ${navContainerBg} ${navContainerBorder}`}
        >
          {(['royal-work', 'lime-fun', 'oxblood-deep', 'lilac-all'] as const).map((cat) => {
            const isActive = activeCategory === cat;
            const label = cat === 'royal-work' ? 'Work' : cat === 'lime-fun' ? 'Fun' : cat === 'oxblood-deep' ? 'Deep' : 'All';
            
            // Text coloring and scaling rules
            let textClass = '';
            if (isActive) {
              textClass = 'text-white font-bold scale-100';
            } else {
              textClass = isDarkCategory 
                ? 'text-white/75 hover:text-white hover:scale-105' 
                : 'text-[#131414]/75 hover:text-[#131414] hover:scale-105';
            }

            return (
              <button
                key={cat}
                className={`px-3 xs:px-5 md:px-7 py-1.5 sm:py-2 text-[10px] xs:text-xs md:text-sm font-display uppercase tracking-[0.05em] rounded-full transition-all duration-300 relative z-10 font-bold cursor-pointer ${textClass}`}
                onClick={() => {
                  if (!isAnimating) {
                    setActiveCategory(cat);
                  }
                }}
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

      {/* CORE DECK STACK */}
      <main className="flex-grow flex flex-col justify-center items-center relative mt-2 sm:mt-4">
        <CardDeck
          key={`${activeCategory}-${showSplash}`}
          questions={queue}
          onSwipe={handleSwipe}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
        />

        {/* BOTTOM ACTION BUTTON */}
        <div className="mt-4 sm:mt-8 md:mt-10 z-30">
          <button
            onClick={triggerNext}
            disabled={isAnimating}
            className="group flex items-center gap-2.5 sm:gap-3 bg-[#131414] text-white hover:opacity-90 font-display text-xs sm:text-sm md:text-base font-bold px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-full card-shadow transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <span>Siguiente pregunta</span>
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform duration-500 ${isAnimating ? 'animate-spin' : 'group-hover:rotate-180'}`} />
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className={`flex flex-col items-center justify-center gap-0.5 opacity-60 transition-colors duration-500 select-none ${outsideTextColor}`}>
        <span className="font-display text-[13px] font-bold tracking-[0.1em] uppercase">Spill</span>
        <p className="font-display text-[11px] font-medium tracking-wide">
          built with Gemini · vibe coded
        </p>
      </footer>
    </div>
    </>
  );
}
