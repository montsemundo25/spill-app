import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import beso from '../assets/beso.svg';
import brillos from '../assets/brillos.svg';
import cake from '../assets/cake.svg';
import carta from '../assets/carta.svg';
import corazon from '../assets/corazon.svg';
import globos from '../assets/globos.svg';
import nube from '../assets/nube.svg';
import paleta from '../assets/paleta.svg';
import ramo from '../assets/ramo.svg';
import wine from '../assets/wine.svg';

// Widths at ~25% of each SVG's viewBox — preserves natural scale relationships.
const W = { beso: 24, brillos: 26, cake: 46, carta: 48, corazon: 35, globos: 44, nube: 63, paleta: 24, ramo: 63, wine: 21 };

// Positions are intentionally irregular — broken rows, clusters, large rotations,
// some elements partially off-edge. This creates the hand-drawn scattered look.
const DOODLES = [
  { src: ramo,    w: W.ramo,    top: '1%',   left: '-2%',  rotate: -25 },
  { src: nube,    w: W.nube,    top: '3%',   left: '24%',  rotate: 8   },
  { src: corazon, w: W.corazon, top: '0%',   left: '55%',  rotate: 32  },
  { src: cake,    w: W.cake,    top: '2%',   left: '73%',  rotate: -12 },
  { src: brillos, w: W.brillos, top: '-1%',  left: '91%',  rotate: 20  },

  { src: beso,    w: W.beso,    top: '10%',  left: '7%',   rotate: 18  },
  { src: paleta,  w: W.paleta,  top: '8%',   left: '34%',  rotate: -35 },
  { src: wine,    w: W.wine,    top: '12%',  left: '61%',  rotate: 25  },
  { src: globos,  w: W.globos,  top: '9%',   left: '82%',  rotate: -8  },

  { src: carta,   w: W.carta,   top: '20%',  left: '-1%',  rotate: -18 },
  { src: corazon, w: W.corazon, top: '18%',  left: '26%',  rotate: 28  },
  { src: ramo,    w: W.ramo,    top: '21%',  left: '58%',  rotate: -5  },
  { src: beso,    w: W.beso,    top: '17%',  left: '90%',  rotate: 35  },

  { src: nube,    w: W.nube,    top: '29%',  left: '10%',  rotate: 14  },
  { src: cake,    w: W.cake,    top: '27%',  left: '42%',  rotate: -28 },
  { src: paleta,  w: W.paleta,  top: '31%',  left: '70%',  rotate: 20  },
  { src: wine,    w: W.wine,    top: '28%',  left: '93%',  rotate: -30 },

  { src: brillos, w: W.brillos, top: '38%',  left: '3%',   rotate: -12 },
  { src: globos,  w: W.globos,  top: '40%',  left: '28%',  rotate: 30  },
  { src: corazon, w: W.corazon, top: '37%',  left: '54%',  rotate: -18 },
  { src: carta,   w: W.carta,   top: '39%',  left: '78%',  rotate: 10  },

  { src: ramo,    w: W.ramo,    top: '47%',  left: '7%',   rotate: 22  },
  { src: beso,    w: W.beso,    top: '50%',  left: '38%',  rotate: -28 },
  { src: nube,    w: W.nube,    top: '46%',  left: '64%',  rotate: 6   },
  { src: paleta,  w: W.paleta,  top: '49%',  left: '92%',  rotate: -20 },

  { src: cake,    w: W.cake,    top: '57%',  left: '-1%',  rotate: -8  },
  { src: wine,    w: W.wine,    top: '55%',  left: '24%',  rotate: 25  },
  { src: globos,  w: W.globos,  top: '59%',  left: '50%',  rotate: -32 },
  { src: brillos, w: W.brillos, top: '56%',  left: '80%',  rotate: 16  },

  { src: carta,   w: W.carta,   top: '66%',  left: '10%',  rotate: 30  },
  { src: corazon, w: W.corazon, top: '64%',  left: '40%',  rotate: -14 },
  { src: ramo,    w: W.ramo,    top: '67%',  left: '70%',  rotate: 5   },
  { src: beso,    w: W.beso,    top: '65%',  left: '94%',  rotate: -25 },

  { src: nube,    w: W.nube,    top: '75%',  left: '4%',   rotate: -20 },
  { src: paleta,  w: W.paleta,  top: '77%',  left: '35%',  rotate: 32  },
  { src: cake,    w: W.cake,    top: '74%',  left: '60%',  rotate: -6  },
  { src: wine,    w: W.wine,    top: '76%',  left: '87%',  rotate: 20  },

  { src: globos,  w: W.globos,  top: '84%',  left: '1%',   rotate: 14  },
  { src: brillos, w: W.brillos, top: '86%',  left: '28%',  rotate: -28 },
  { src: carta,   w: W.carta,   top: '83%',  left: '55%',  rotate: 22  },
  { src: corazon, w: W.corazon, top: '85%',  left: '83%',  rotate: -10 },

  { src: ramo,    w: W.ramo,    top: '92%',  left: '6%',   rotate: -18 },
  { src: beso,    w: W.beso,    top: '94%',  left: '32%',  rotate: 28  },
  { src: nube,    w: W.nube,    top: '91%',  left: '62%',  rotate: -35 },
  { src: paleta,  w: W.paleta,  top: '93%',  left: '90%',  rotate: 12  },
];

export const LoveDoodles: React.FC = () => {
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    const freqs = [0.010, 0.020, 0.015, 0.030, 0.012, 0.025, 0.018, 0.022, 0.010, 0.028];
    let i = 0;
    const intervalId = setInterval(() => {
      turbulenceRef.current?.setAttribute('baseFrequency', String(freqs[i % freqs.length]));
      i++;
    }, 150);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden>
        <defs>
          <filter id="love-boil" x="-20%" y="-20%" width="140%" height="140%">
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

      {DOODLES.map((doodle, i) => (
        <motion.img
          key={i}
          src={doodle.src}
          aria-hidden
          style={{
            position: 'absolute',
            top: doodle.top,
            left: doodle.left,
            width: doodle.w,
            height: 'auto',
            transform: `rotate(${doodle.rotate}deg)`,
            filter: 'url(#love-boil)',
            pointerEvents: 'none',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: i * 0.02, duration: 0.4 }}
        />
      ))}
    </div>
  );
};
