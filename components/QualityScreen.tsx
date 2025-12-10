import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../types';
import { getAssetUrl } from '../utils';

interface QualityScreenProps {
  setPage: (page: Page) => void;
  registerNextAction: (handler: (() => void) | null) => void;
  registerPrevAction: (handler: (() => void) | null) => void;
}

const SLIDE_STORAGE_KEY = 'whymotrex-quality-slide';

const QualityScreen: React.FC<QualityScreenProps> = ({ setPage, registerNextAction, registerPrevAction }) => {
  // Initialize slide from localStorage
  const [currentSlide, setCurrentSlide] = useState(() => {
    const saved = localStorage.getItem(SLIDE_STORAGE_KEY);
    if (saved) {
      const num = parseInt(saved, 10);
      if (!isNaN(num) && num >= 0 && num < 6) {
        return num;
      }
    }
    return 0;
  });

  // Keep ref to curre  const videoRef2 = useRef<HTMLVideoElement>(null);
  const currentSlideRef = useRef(currentSlide);

  // Slide 2 inner step state
  const [slide2Step, setSlide2Step] = useState(0);

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  // Automatic step progression for Slide 2
  useEffect(() => {
    if (currentSlide !== 1) return;

    let timer: NodeJS.Timeout;

    if (slide2Step === 0) {
      // Step 0: Pins appearing (slower stagger). Wait for all to appear + pause.
      // 12 pins * 150ms = 1800ms + 1000ms initial delay = ~2800ms. Let's give it 3500ms.
      timer = setTimeout(() => {
        setSlide2Step(1);
      }, 3500);
    } else if (slide2Step === 1) {
      // Step 1: Group 1 active. Wait 5s.
      timer = setTimeout(() => {
        setSlide2Step(2);
      }, 5000);
    } else if (slide2Step === 2) {
      // Step 2: Group 2 active. Wait 5s.
      timer = setTimeout(() => {
        setSlide2Step(3);
      }, 5000);
    } else if (slide2Step === 3) {
      // Step 3: All active (Half size). Wait 5s then next slide.
      timer = setTimeout(() => {
        nextSlide();
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [currentSlide, slide2Step]);

  const [showVideo, setShowVideo] = useState(false);
  const [showVideo2, setShowVideo2] = useState(false);

  // Save slide to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(SLIDE_STORAGE_KEY, currentSlide.toString());
  }, [currentSlide]);

  // Slide navigation functions
  const nextSlide = () => {
    if (currentSlide === 1) {
      if (slide2Step < 3) {
        setSlide2Step(prev => prev + 1);
        return;
      }
    }
    if (currentSlide < 5) {
      setCurrentSlide((prev) => prev + 1);
      // Reset steps if leaving slide 2 (optional, but good for re-entry)
      if (currentSlide === 1) setSlide2Step(0);
    } else {
      setPage(Page.Home);
    }
  };

  const prevSlide = () => {
    if (currentSlide === 1 && slide2Step > 0) {
      setSlide2Step(prev => prev - 1);
      return;
    }
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
      if (currentSlide === 2) setSlide2Step(3); // Go to last step of slide 2 when coming back
    }
  };

  const handleSlideClick = () => {
    nextSlide();
  };

  // Register next action handler
  useEffect(() => {
    registerNextAction(() => nextSlide());
    return () => registerNextAction(null);
  }, [registerNextAction, currentSlide, slide2Step]); // Re-register when dependencies change

  // Register prev action handler
  useEffect(() => {
    const handlePrev = () => {
      if (currentSlideRef.current === 1 && slide2Step > 0) {
        setSlide2Step(prev => prev - 1);
        return;
      }
      if (currentSlideRef.current > 0) {
        setCurrentSlide((prev) => prev - 1);
        if (currentSlideRef.current === 2) setSlide2Step(3); // Go to last step of slide 2 when coming back
      }
    };
    registerNextAction(() => nextSlide());
    return () => registerNextAction(null);
  }, [registerNextAction, currentSlide, slide2Step]); // Re-register when dependencies change

  // Register prev action handler
  useEffect(() => {
    const handlePrev = () => {
      if (currentSlideRef.current === 1 && slide2Step > 0) {
        setSlide2Step(prev => prev - 1);
        return;
      }
      if (currentSlideRef.current > 0) {
        setCurrentSlide((prev) => prev - 1);
        if (currentSlideRef.current === 2) setSlide2Step(3); // Go to last step of slide 2 when coming back
      }
    };
    registerPrevAction(handlePrev);
    return () => registerPrevAction(null);
  }, [registerPrevAction, currentSlide, slide2Step]);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: '1920px',
        height: '1080px',
        backgroundColor: '#F5F7FA',
      }}
      onClick={handleSlideClick}
    >
      {/* Navigation Controls (Floating Bottom Right) */}
      <div className="absolute bottom-12 right-16 flex gap-6 z-50">
        <button
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          className="w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-gray-50 hover:scale-105 transition-all duration-300 border border-gray-100 opacity-80 hover:opacity-100"
          aria-label="Previous Slide"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          className="w-14 h-14 rounded-full bg-blue-600 shadow-xl flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all duration-300 border border-blue-500 opacity-80 hover:opacity-100"
          aria-label="Next Slide"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      {/* Pagination Indicators */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4 z-50">
        {[0, 1, 2, 3, 4, 5].map((idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); if (idx === 1) setSlide2Step(0); }}
            className={`h-2 rounded-full transition-all duration-500 ease-out ${currentSlide === idx ? 'w-12 bg-blue-600' : 'w-3 bg-gray-300 hover:bg-gray-400'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Header (Back Button) */}
      <div className="absolute top-0 left-0 p-10 z-50">
        <button
          onClick={(e) => { e.stopPropagation(); setPage(Page.Home); }}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-md hover:shadow-lg transition-all opacity-80 hover:opacity-100 group"
          aria-label="Go to Home"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
      </div>

      {/* Slides Viewport */}
      <div
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] h-full"
        style={{ transform: `translateX(-${currentSlide * 1920}px)` }}
      >
        <Slide1 />
        <Slide2 isActive={currentSlide === 1} step={slide2Step} />
        <Slide3 isActive={currentSlide === 2} />
        <Slide4 isActive={currentSlide === 3} />
        <Slide5 isActive={currentSlide === 4} />
        <Slide6 isActive={currentSlide === 5} />
      </div>
    </div>
  );
};

// --- Slide 1 ---
const Slide1 = () => {
  return (
    <div className="relative w-[1920px] h-full flex-shrink-0 flex items-center overflow-hidden bg-black">
      {/* 1. Base Background Image (Fixed) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${getAssetUrl('/images/bg-2-1.png')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* 2. Animated Mesh Background (Moving Left) */}
      <div className="absolute inset-0 z-1 flex opacity-60 mix-blend-color-dodge">
        <div className="flex w-[200%] h-full animate-mesh-slide">
          <img
            src={getAssetUrl('/images/mesh.svg')}
            alt=""
            className="w-1/2 h-full object-cover"
          />
          <img
            src={getAssetUrl('/images/mesh.svg')}
            alt=""
            className="w-1/2 h-full object-cover"
          />
        </div>
      </div>

      {/* 3. Subtle Gradient Overlay (Shimmer Effect) */}
      <div className="absolute inset-0 z-2 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none mix-blend-soft-light" />

      {/* Internal Styles for Animations */}
      <style>{`
        @keyframes mesh-slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-mesh-slide {
          animation: mesh-slide 60s linear infinite;
        }
        @keyframes shimmer {
          0% { opacity: 0.3; transform: translateX(-100%); }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 8s ease-in-out infinite;
        }
      `}</style>

      {/* Content */}
      <div
        className="relative z-10 flex flex-col"
        style={{
          paddingLeft: '160px',
        }}
      >
        <p
          style={{
            color: '#FFF',
            fontFamily: '"Albert Sans"',
            fontSize: '40px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 'normal',
            letterSpacing: '-1.2px',
            marginBottom: '16px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          We Innovate the Experience
        </p>
        <h1
          style={{
            color: '#FFF',
            fontFamily: '"Albert Sans"',
            fontSize: '92px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '110%',
            letterSpacing: '-1.84px',
            textShadow: '0 4px 10px rgba(0,0,0,0.3)',
          }}
        >
          Quality Excellence &<br />Manufacturing Reliability
        </h1>
      </div>
    </div>
  );
};

// --- Slide 2 ---
interface Slide2Props {
  isActive: boolean;
  step: number;
}

const Slide2: React.FC<Slide2Props> = ({ isActive, step }) => {
  // Finalized pin positions
  const pinPositions: { [key: string]: { left: number; bottom: number } } = {
    'pin1': { left: 222, bottom: 349 },
    'pin2': { left: 318, bottom: 270 },
    'pin3': { left: 428, bottom: 206 },
    'pin4': { left: 912, bottom: 367 },
    'pin5': { left: 1108, bottom: 339 },
    'pin6': { left: 1514, bottom: 339 },
    'pin7': { left: 503, bottom: 90 },
    'pin8': { left: 1487, bottom: 347 },
    'pin9': { left: 987, bottom: 418 },
    'pin10': { left: 826, bottom: 448 },
    'pin11': { left: 1250, bottom: 400 },
    'pin12': { left: 1407, bottom: 247 },
  };

  const GROUP_1 = ['pin1', 'pin2', 'pin3', 'pin4', 'pin8'];
  const GROUP_2 = ['pin5', 'pin6', 'pin7', 'pin9', 'pin10', 'pin11', 'pin12'];

  const getPinStyle = (key: string) => {
    const isGroup1 = GROUP_1.includes(key);
    let scale = 0.33;
    let grayscale = 1; // 1 = 100% grayscale

    if (step === 0) {
      // Entry: all scale 0.43, grayscale
      scale = 0.43;
      grayscale = 1;
    } else if (step === 1) {
      // Group 1 active: scale 1, color. Group 2 inactive.
      if (isGroup1) {
        scale = 1;
        grayscale = 0;
      } else {
        scale = 0.43;
        grayscale = 1;
      }
    } else if (step === 2) {
      // Group 2 active: scale 1, color. Group 1 inactive.
      if (!isGroup1) {
        scale = 1;
        grayscale = 0;
      } else {
        scale = 0.43;
        grayscale = 1;
      }
    } else if (step === 3) {
      // All active: scale 0.65 (30% larger than 0.5), color.
      scale = 0.65;
      grayscale = 0;
    }

    return {
      scale,
      grayscale,
    };
  };

  const getAnimStyle = (delay: string) => {
    return `transition-all duration-[2000ms] ease-out ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'} ${delay}`;
  };

  return (
    <div
      className="relative w-[1920px] h-full flex-shrink-0"
      style={{
        backgroundImage: `url(${getAssetUrl('/images/bg-2-2.png')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ top: '56px' }}
      >
        <div className={getAnimStyle('delay-[200ms]')}>
          <h1
            className="text-center mb-6"
            style={{
              color: '#000000',
              fontSize: '64px',
              fontWeight: 700,
              letterSpacing: '-1px',
            }}
          >
            Global Localization for Worldwide Mobility
          </h1>
        </div>
        <div className={getAnimStyle('delay-[500ms]')}>
          <p
            className="text-center"
            style={{
              color: '#6B7280',
              fontSize: '28px',
              fontWeight: 400,
              maxWidth: '1200px',
              lineHeight: '1.6',
              marginTop: '-30px',
            }}
          >
            Supporting 81 countries through advanced map & app customization and
            region-specific feature development across diverse mobility environments.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>

      {/* Pins - Sorted by bottom position for correct Z-layering */}
      {Object.entries(pinPositions)
        .sort(([, a], [, b]) => b.bottom - a.bottom) // Render from far (high bottom) to near (low bottom)
        .map(([key, pos]) => {
          const { scale, grayscale } = getPinStyle(key);
          const index = parseInt(key.replace('pin', '')) || 0;
          const entryDelay = isActive ? `${1000 + index * 150}ms` : '0ms'; // Slower appear (150ms)

          // Generate a pseudo-random delay based on the key
          const breatheDelay = `-${(index * 0.3) % 2}s`;

          return (
            <div
              key={key}
              className="absolute transition-all duration-700 ease-out origin-bottom group cursor-pointer"
              style={{
                left: `${pos.left}px`,
                bottom: `${pos.bottom}px`,
                transform: `scale(${scale})`,
                filter: `grayscale(${grayscale})`,
                zIndex: Math.round(1000 - pos.bottom),
                opacity: isActive ? 1 : 0,
                transitionDelay: step === 0 ? entryDelay : '0ms',
              }}
            >
              {/* Tooltip on Hover */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-white font-bold bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                {key}
              </span>
              <img
                src={getAssetUrl(`/images/local-${key}.svg`)}
                alt={`Location ${key}`}
                className=""
                style={{
                  animation: grayscale === 0 ? `breathe 3s ease-in-out infinite` : 'none',
                  animationDelay: breatheDelay,
                }}
              />
            </div>
          );
        })}

      {/* Count Local SVG - Appears at Step 3 */}
      <img
        src={getAssetUrl('/images/count-local.svg')}
        alt="Count Local"
        className={`transition-all duration-1000 ease-out ${step === 3 && isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-16'}`}
        style={{
          position: 'absolute',
          top: '270px',
          left: '810px',
          zIndex: 50,
        }}
      />
    </div>
  );
};

// --- Slide 3 ---
interface Slide3Props {
  isActive: boolean;
}

const Slide3: React.FC<Slide3Props> = ({ isActive }) => {
  const getAnimStyle = (delay: string) => {
    return `transition-all duration-[2000ms] ease-out ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'} ${delay}`;
  };

  const getVehicleAnim = (delay: string) => {
    return `transition-all duration-[1000ms] ease-out ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'} ${delay}`;
  };

  return (
    <div
      className="relative w-[1920px] h-full flex-shrink-0"
      style={{
        backgroundColor: '#F5F7FA',
      }}
    >
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ top: '56px' }}
      >
        <div className={getAnimStyle('delay-[200ms]')}>
          <h1
            className="text-center mb-6"
            style={{
              color: '#000000',
              fontSize: '64px',
              fontWeight: 700,
              letterSpacing: '-1px',
            }}
          >
            Scalable Architecure for Mutli Vehicle Integration
          </h1>
        </div>
        <div className={getAnimStyle('delay-[500ms]')}>
          <p
            className="text-center"
            style={{
              color: '#6B7280',
              fontSize: '28px',
              fontWeight: 400,
              maxWidth: '1200px',
              lineHeight: '1.6',
              marginTop: '-30px',
            }}
          >
            From commercial fleets to two-wheelers, MOTREX offers a unified software architecture scalable across all mobility segments.
          </p>
        </div>
      </div>

      <div
        className="absolute left-1/2 top-[600px] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      >
        <img src={getAssetUrl('/images/vehicle1.png')} alt="Vehicle 1" className={`relative z-0 ${getVehicleAnim('delay-[800ms]')}`} />
        <img src={getAssetUrl('/images/vehicle2.png')} alt="Vehicle 2" className={`-ml-[10px] relative z-10 ${getVehicleAnim('delay-[1100ms]')}`} />
        <img src={getAssetUrl('/images/vehicle3.png')} alt="Vehicle 3" className={`-ml-[10px] relative z-20 ${getVehicleAnim('delay-[1400ms]')}`} />
        <img src={getAssetUrl('/images/vehicle4.png')} alt="Vehicle 4" className={`-ml-[10px] relative z-30 ${getVehicleAnim('delay-[1700ms]')}`} />
        <img src={getAssetUrl('/images/vehicle5.png')} alt="Vehicle 5" className={`-ml-[10px] relative z-40 ${getVehicleAnim('delay-[2000ms]')}`} />
      </div>
    </div>
  );
};

// --- Slide 4 ---
interface Slide4Props {
  isActive: boolean;
}

const Slide4: React.FC<Slide4Props> = ({ isActive }) => {
  const [currentImage, setCurrentImage] = React.useState(0);
  const images = [
    getAssetUrl('/images/display0.png'),
    getAssetUrl('/images/display1.png'),
    getAssetUrl('/images/display2.png'),
    getAssetUrl('/images/display3.png'),
    getAssetUrl('/images/display4.png'),
    getAssetUrl('/images/display5.png'),
  ];

  React.useEffect(() => {
    if (!isActive) return;

    setCurrentImage(0);
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const getAnimStyle = (delay: string) => {
    return `transition-all duration-[2000ms] ease-out ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'} ${delay}`;
  };

  return (
    <div
      className="relative w-[1920px] h-full flex-shrink-0"
      style={{
        backgroundColor: '#F5F7FA',
      }}
    >
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ top: '56px' }}
      >
        <div className={getAnimStyle('delay-[200ms]')}>
          <h1
            className="text-center mb-6"
            style={{
              color: '#000000',
              fontSize: '64px',
              fontWeight: 700,
              letterSpacing: '-1px',
            }}
          >
            Display Evolution
          </h1>
        </div>
        <div className={getAnimStyle('delay-[500ms]')}>
          <p
            className="text-center"
            style={{
              color: '#6B7280',
              fontSize: '28px',
              fontWeight: 400,
              maxWidth: '1200px',
              lineHeight: '1.6',
              marginTop: '-30px',
            }}
          >
            Our display technology continues to evolve from compact 7-inch modules to 12.3-inch premium systems flexibly adapting to diverse vehicle platforms.
          </p>
        </div>
      </div>

      {/* Display Images with Fade Transition */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{
          bottom: '0px',
          width: '1920px',
          height: 'auto',
        }}
      >
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Display ${idx}`}
            className="absolute bottom-0 left-0"
            style={{
              width: '1920px',
              height: 'auto',
              display: currentImage === idx ? 'block' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// --- Slide 5 ---
interface Slide5Props {
  isActive: boolean;
}

const Slide5: React.FC<Slide5Props> = ({ isActive }) => {
  const getAnimStyle = (delay: string) => {
    return `transition-all duration-[2000ms] ease-out ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'} ${delay}`;
  };

  // Pin animation delays (staggered for natural appearance)
  // Blue pins (index 0-4): appear AFTER black pins
  // Black pins (index 5-16): appear FIRST
  const pinDelays = [
    6000, 6500, 7000, 7500, 8000,  // Blue pins (Pin 1-5) - later
    800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200  // Black pins (Pin 6-17) - first
  ];

  return (
    <div
      className="relative w-[1920px] h-full flex-shrink-0"
      style={{
        backgroundImage: `url(${getAssetUrl('/images/bg-2-5.png')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Pin Animation Styles */}
      <style>{`
        @keyframes pinRise {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.85);
          }
          80% {
            opacity: 1;
            transform: translateY(-3px) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .pin-animate {
          opacity: 0;
        }
        .pin-animate.active {
          animation: pinRise 1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
      `}</style>

      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ top: '56px' }}
      >
        <div className={getAnimStyle('delay-[200ms]')}>
          <h1
            className="text-center mb-6"
            style={{
              color: '#000000',
              fontSize: '64px',
              fontWeight: 700,
              letterSpacing: '-1px',
            }}
          >
            Global Network
          </h1>
        </div>
        <div className={getAnimStyle('delay-[500ms]')}>
          <p
            className="text-center"
            style={{
              color: '#6B7280',
              fontSize: '28px',
              fontWeight: 400,
              maxWidth: '1200px',
              lineHeight: '1.6',
              marginTop: '-30px',
            }}
          >
            With 5 global manufacturing hubs, MOTREX strengthens production engineering <br />
            and provides reliable EMS operations for automotive electronics.
          </p>
        </div>
      </div>

      {/* Global SVG with Animated Pins */}
      <svg
        width="1495"
        height="541"
        viewBox="0 0 1495 541"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-[230px]"
        style={{ width: '1490px', bottom: '80px' }}
      >
        <defs>
          <pattern id="pattern0_4484_6143" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image0_4484_6143" transform="matrix(0.00118709 0 0 0.00178571 -0.0816761 0)" />
          </pattern>
          <pattern id="pattern1_4484_6143" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image1_4484_6143" transform="matrix(0.00138889 0 0 0.00208333 0 -0.025)" />
          </pattern>
          <pattern id="pattern2_4484_6143" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image2_4484_6143" transform="scale(0.00111111 0.00166667)" />
          </pattern>
          <pattern id="pattern3_4484_6143" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image3_4484_6143" transform="scale(0.00111111 0.00166667)" />
          </pattern>
          <pattern id="pattern4_4484_6143" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image4_4484_6143" transform="matrix(0.00304478 0 0 0.0034 -1.13657 -0.333333)" />
          </pattern>
          <pattern id="pattern5_4484_6143" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image5_4484_6143" transform="matrix(0.0030371 0 0 0.00574713 -0.00112139 0)" />
          </pattern>
          <pattern id="pattern6_4484_6143" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image6_4484_6143" transform="matrix(0.000833333 0 0 0.00157692 0 -0.0913462)" />
          </pattern>
          <pattern id="pattern7_4484_6143" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image1_4484_6143" transform="matrix(0.00138889 0 0 0.00204678 0 -0.0157895)" />
          </pattern>
          <pattern id="pattern8_4484_6143" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image7_4484_6143" transform="matrix(0.00140476 0 0 0.00166667 -0.05 0)" />
          </pattern>
          <pattern id="pattern9_4484_6143" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image8_4484_6143" transform="matrix(0.00363636 0 0 0.00687747 0 -0.129289)" />
          </pattern>
          <pattern id="pattern10_4484_6143" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image0_4484_6143" transform="matrix(0.00118401 0 0 0.00178571 -0.080163 0)" />
          </pattern>
          <pattern id="pattern11_4484_6143" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image9_4484_6143" transform="matrix(0.00363636 0 0 0.00686869 0 -0.128485)" />
          </pattern>
          <pattern id="pattern12_4484_6143" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image4_4484_6143" transform="matrix(0.00304478 0 0 0.0034 -1.13657 -0.333333)" />
          </pattern>
          <pattern id="pattern13_4484_6143" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image3_4484_6143" transform="scale(0.00111111 0.00166667)" />
          </pattern>
          <pattern id="pattern14_4484_6143" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image10_4484_6143" transform="matrix(0.00709389 0 0 0.010303 0 -0.0260606)" />
          </pattern>
          <pattern id="pattern15_4484_6143" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image11_4484_6143" transform="matrix(0.00423822 0 0 0.00621118 -0.1654 0)" />
          </pattern>
          <pattern id="pattern16_4484_6143" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image12_4484_6143" transform="matrix(0.00363636 0 0 0.00689655 0 -0.131034)" />
          </pattern>
        </defs>

        {/* Blue Pin 1 - Mexico */}
        <g className={`pin-animate ${isActive ? 'active' : ''}`} style={{ animationDelay: `${pinDelays[0]}ms` }}>
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M158.254 388C138.636 388 124.234 381.526 124.004 372.62C123.911 369.503 125.619 366.557 128.896 364.056C134.759 359.638 145.514 357 157.746 357C177.318 357 191.719 363.44 191.996 372.346C192.089 375.463 190.427 378.409 187.15 380.909C181.287 385.328 170.532 388 158.3 388H158.254Z" fill="#005FF9" />
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M157.661 379C145.255 379 136.148 375.032 136.002 369.573C135.944 367.663 137.024 365.857 139.096 364.325C142.803 361.617 149.604 360 157.339 360C169.716 360 178.823 363.947 178.998 369.406C179.056 371.316 178.005 373.122 175.933 374.654C172.226 377.362 165.425 379 157.69 379H157.661Z" fill="#005FF9" />
          <path fillRule="evenodd" clipRule="evenodd" d="M166 367C166.046 369.209 162.285 371 157.585 371C152.884 371 149.047 369.209 149 367C148.954 364.791 152.73 363 157.415 363C162.1 363 165.953 364.791 166 367Z" fill="#005FF9" />
          <path d="M129 273H187L160.053 368H156.061L129 273Z" fill="#005FF9" />
          <mask id="mask0_4484_6143" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="98" y="159" width="120" height="120">
            <circle cx="158" cy="219" r="60" fill="#035EF5" />
          </mask>
          <g mask="url(#mask0_4484_6143)">
            <circle cx="158" cy="219" r="60" fill="white" />
            <image href={getAssetUrl('/images/mexico.png')} x="98" y="159" width="120" height="120" preserveAspectRatio="xMidYMid slice" />
          </g>
          <circle cx="158" cy="219" r="60" stroke="#005FF9" strokeWidth="8" />
          <path d="M114.051 113.376L119.971 130.72H120.099L126.179 113.376H131.555V136H127.747V119.808H127.619L121.987 136H118.051L112.515 119.808H112.419V136H108.579V113.376H114.051ZM136.681 126.272H146.281C146.238 125.013 145.886 124.032 145.225 123.328C144.585 122.603 143.668 122.24 142.473 122.24C141.044 122.24 139.998 122.656 139.337 123.488C138.676 124.32 138.345 125.739 138.345 127.744C138.345 129.792 138.665 131.232 139.305 132.064C139.945 132.875 141.076 133.28 142.697 133.28C143.828 133.28 144.628 133.12 145.097 132.8C145.566 132.48 145.865 132.021 145.993 131.424H150.025C149.812 132.853 149.108 134.027 147.913 134.944C146.718 135.861 144.98 136.32 142.697 136.32C140.009 136.32 137.961 135.595 136.553 134.144C135.166 132.672 134.473 130.56 134.473 127.808C134.473 125.035 135.177 122.912 136.585 121.44C137.993 119.947 139.956 119.2 142.473 119.2C144.82 119.2 146.686 119.915 148.073 121.344C149.481 122.752 150.185 124.885 150.185 127.744V128.96H136.649L136.681 126.272ZM166.825 119.552L160.329 128.928L158.121 126.688L162.601 119.552H166.825ZM150.729 136L157.289 126.528L159.433 129.312L154.985 136H150.729ZM155.017 119.552L159.145 126.24L160.745 127.36L166.857 136H162.601L158.377 129.696L156.649 128.288L150.761 119.552H155.017ZM173.433 119.552V136H169.561V119.552H173.433ZM169.465 113.024H173.529V117.056H169.465V113.024ZM184.337 136.32C181.67 136.32 179.644 135.573 178.257 134.08C176.892 132.587 176.209 130.485 176.209 127.776C176.209 125.045 176.902 122.933 178.289 121.44C179.697 119.947 181.692 119.2 184.273 119.2C185.638 119.2 186.854 119.456 187.921 119.968C189.009 120.48 189.873 121.173 190.513 122.048C191.174 122.901 191.516 123.883 191.537 124.992H187.633C187.612 124.331 187.345 123.733 186.833 123.2C186.342 122.645 185.5 122.368 184.305 122.368C182.748 122.368 181.66 122.816 181.041 123.712C180.422 124.587 180.113 125.941 180.113 127.776C180.113 129.589 180.422 130.944 181.041 131.84C181.66 132.715 182.748 133.152 184.305 133.152C185.478 133.152 186.321 132.928 186.833 132.48C187.345 132.011 187.633 131.381 187.697 130.592H191.601C191.58 131.573 191.27 132.501 190.673 133.376C190.097 134.251 189.265 134.965 188.177 135.52C187.11 136.053 185.83 136.32 184.337 136.32ZM201.448 136.32C198.909 136.32 196.915 135.584 195.464 134.112C194.013 132.619 193.288 130.517 193.288 127.808C193.288 125.077 194.013 122.965 195.464 121.472C196.936 119.957 198.931 119.2 201.448 119.2C203.944 119.2 205.928 119.947 207.4 121.44C208.893 122.912 209.64 125.035 209.64 127.808C209.64 130.56 208.904 132.672 207.432 134.144C205.96 135.595 203.965 136.32 201.448 136.32ZM201.448 133.152C202.899 133.152 203.976 132.715 204.68 131.84C205.384 130.965 205.736 129.621 205.736 127.808C205.736 124.181 204.307 122.368 201.448 122.368C198.611 122.368 197.192 124.181 197.192 127.808C197.192 129.621 197.544 130.965 198.248 131.84C198.952 132.715 200.019 133.152 201.448 133.152Z" fill="black" />
        </g>

        {/* Blue Pin 2 - Brazil */}
        <g className={`pin-animate ${isActive ? 'active' : ''}`} style={{ animationDelay: `${pinDelays[1]}ms` }}>
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M417.254 496C397.636 496 383.234 489.526 383.004 480.62C382.911 477.503 384.619 474.557 387.896 472.056C393.759 467.638 404.514 465 416.746 465C436.318 465 450.719 471.44 450.996 480.346C451.089 483.463 449.427 486.409 446.15 488.909C440.287 493.328 429.532 496 417.3 496H417.254Z" fill="#005FF9" />
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M417.661 488C405.255 488 396.148 483.614 396.002 477.581C395.944 475.47 397.024 473.474 399.096 471.78C402.803 468.787 409.604 467 417.339 467C429.716 467 438.823 471.362 438.998 477.396C439.056 479.507 438.005 481.503 435.933 483.197C432.226 486.19 425.425 488 417.69 488H417.661Z" fill="#005FF9" />
          <path fillRule="evenodd" clipRule="evenodd" d="M425 474C425.046 476.209 421.285 478 416.585 478C411.884 478 408.047 476.209 408 474C407.954 471.791 411.73 470 416.415 470C421.1 470 424.953 471.791 425 474Z" fill="#005FF9" />
          <path d="M387 380.5H445L418.053 474H414.061L387 380.5Z" fill="#005FF9" />
          <mask id="mask1_4484_6143" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="356" y="265" width="120" height="120">
            <circle cx="416" cy="325" r="60" fill="#035EF5" />
          </mask>
          <g mask="url(#mask1_4484_6143)">
            <circle cx="416" cy="325" r="60" fill="white" />
            <image href={getAssetUrl('/images/brazil.png')} x="356" y="265" width="120" height="120" preserveAspectRatio="xMidYMid slice" />
          </g>
          <circle cx="416" cy="325" r="60" stroke="#005FF9" strokeWidth="8" />
          <path d="M378.63 219.376H387.142C388.977 219.376 390.449 219.653 391.558 220.208C392.689 220.741 393.5 221.477 393.99 222.416C394.502 223.333 394.758 224.389 394.758 225.584C394.758 226.608 394.534 227.451 394.086 228.112C393.638 228.752 393.073 229.232 392.39 229.552C391.729 229.872 391.068 230.075 390.406 230.16V230.288C390.94 230.309 391.505 230.427 392.102 230.64C392.721 230.853 393.297 231.184 393.83 231.632C394.364 232.059 394.801 232.613 395.142 233.296C395.484 233.979 395.654 234.8 395.654 235.76C395.654 236.933 395.398 237.989 394.886 238.928C394.374 239.867 393.521 240.613 392.326 241.168C391.132 241.723 389.5 242 387.43 242H378.63V219.376ZM387.366 238.672C388.604 238.672 389.521 238.555 390.118 238.32C390.737 238.064 391.153 237.701 391.366 237.232C391.58 236.741 391.686 236.165 391.686 235.504C391.686 234.501 391.356 233.691 390.694 233.072C390.033 232.453 388.977 232.144 387.526 232.144H382.662V238.672H387.366ZM387.014 228.848C389.553 228.848 390.822 227.792 390.822 225.68C390.822 225.061 390.726 224.528 390.534 224.08C390.342 223.632 389.98 223.291 389.446 223.056C388.934 222.8 388.156 222.672 387.11 222.672H382.662V228.848H387.014ZM402.292 242H398.388V225.552H402.292L402.26 227.984C402.73 227.152 403.306 226.544 403.988 226.16C404.671 225.755 405.524 225.552 406.548 225.552H407.828V228.656H405.78C404.607 228.656 403.732 228.965 403.156 229.584C402.58 230.203 402.292 231.195 402.292 232.56V242ZM424.098 242H421.858C420.898 242 420.172 241.669 419.682 241.008C419.191 240.347 418.924 239.504 418.882 238.48H419.618C419.255 239.632 418.636 240.56 417.762 241.264C416.887 241.968 415.692 242.32 414.178 242.32C412.364 242.32 410.892 241.904 409.762 241.072C408.652 240.24 408.098 238.949 408.098 237.2C408.098 236.176 408.29 235.333 408.674 234.672C409.079 233.989 409.602 233.456 410.242 233.072C410.903 232.688 411.628 232.421 412.418 232.272C413.207 232.123 413.996 232.048 414.786 232.048H418.882V230.928C418.882 229.115 417.847 228.208 415.778 228.208C414.754 228.208 413.996 228.4 413.506 228.784C413.015 229.168 412.716 229.733 412.61 230.48H408.706C408.791 229.349 409.154 228.4 409.794 227.632C410.455 226.843 411.308 226.245 412.354 225.84C413.42 225.413 414.594 225.2 415.874 225.2C416.62 225.2 417.388 225.285 418.178 225.456C418.967 225.627 419.703 225.936 420.386 226.384C421.09 226.811 421.655 227.419 422.082 228.208C422.508 228.976 422.722 229.968 422.722 231.184V238.832H424.098V242ZM411.874 237.104C411.874 238.576 412.78 239.312 414.594 239.312C415.959 239.312 417.015 238.992 417.762 238.352C418.508 237.712 418.882 236.869 418.882 235.824V234.8H414.818C412.855 234.8 411.874 235.568 411.874 237.104ZM425.333 239.344L436.309 226.224L436.437 228.656H425.653V225.552H439.125V228.24L428.245 241.296L428.181 238.864H439.445V242H425.333V239.344ZM446.089 225.552V242H442.217V225.552H446.089ZM442.121 219.024H446.185V223.056H442.121V219.024ZM453.732 242H449.828V219.024H453.732V242Z" fill="#2D2D30" />
        </g>

        {/* Blue Pin 3 - Korea */}
        <g className={`pin-animate ${isActive ? 'active' : ''}`} style={{ animationDelay: `${pinDelays[2]}ms` }}>
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M1359.25 315C1339.64 315 1325.23 308.526 1325 299.62C1324.91 296.503 1326.62 293.557 1329.9 291.056C1335.76 286.638 1346.51 284 1358.75 284C1378.32 284 1392.72 290.44 1393 299.346C1393.09 302.463 1391.43 305.409 1388.15 307.909C1382.29 312.328 1371.53 315 1359.3 315H1359.25Z" fill="#005FF9" />
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M1358.66 307C1346.26 307 1337.15 302.614 1337 296.581C1336.94 294.47 1338.02 292.474 1340.1 290.78C1343.8 287.787 1350.6 286 1358.34 286C1370.72 286 1379.82 290.362 1380 296.396C1380.06 298.507 1379.01 300.503 1376.93 302.197C1373.23 305.19 1366.42 307 1358.69 307H1358.66Z" fill="#005FF9" />
          <path fillRule="evenodd" clipRule="evenodd" d="M1366 293C1366.05 295.209 1362.29 297 1357.58 297C1352.88 297 1349.05 295.209 1349 293C1348.95 290.791 1352.73 289 1357.42 289C1362.1 289 1365.95 290.791 1366 293Z" fill="#005FF9" />
          <path d="M1329 199.5H1387L1360.05 293H1356.06L1329 199.5Z" fill="#005FF9" />
          <circle cx="1358" cy="144" r="60" fill="white" />
          <mask id="mask2_4484_6143" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="1298" y="84" width="120" height="120">
            <circle cx="1358" cy="144" r="60" fill="#035EF5" />
          </mask>
          <g mask="url(#mask2_4484_6143)">
            <circle cx="1358" cy="144" r="60" fill="white" />
            <image href={getAssetUrl('/images/korea.png')} x="1298" y="84" width="120" height="120" preserveAspectRatio="xMidYMid slice" />
          </g>
          <circle cx="1358" cy="144" r="60" stroke="#005FF9" strokeWidth="8" />
          <path d="M1326.87 46.696L1336.66 61H1331.9L1324.25 49.832L1326.87 46.696ZM1322.78 61H1318.74V38.376H1322.78V61ZM1321.27 55.816V50.632L1331.45 38.376H1336.25L1321.27 55.816ZM1344.77 61.32C1342.23 61.32 1340.23 60.584 1338.78 59.112C1337.33 57.6187 1336.61 55.5173 1336.61 52.808C1336.61 50.0773 1337.33 47.9653 1338.78 46.472C1340.25 44.9573 1342.25 44.2 1344.77 44.2C1347.26 44.2 1349.25 44.9467 1350.72 46.44C1352.21 47.912 1352.96 50.0347 1352.96 52.808C1352.96 55.56 1352.22 57.672 1350.75 59.144C1349.28 60.5947 1347.28 61.32 1344.77 61.32ZM1344.77 58.152C1346.22 58.152 1347.29 57.7147 1348 56.84C1348.7 55.9653 1349.05 54.6213 1349.05 52.808C1349.05 49.1813 1347.62 47.368 1344.77 47.368C1341.93 47.368 1340.51 49.1813 1340.51 52.808C1340.51 54.6213 1340.86 55.9653 1341.57 56.84C1342.27 57.7147 1343.34 58.152 1344.77 58.152ZM1359.71 61H1355.8V44.552H1359.71L1359.68 46.984C1360.14 46.152 1360.72 45.544 1361.4 45.16C1362.09 44.7547 1362.94 44.552 1363.96 44.552H1365.24V47.656H1363.2C1362.02 47.656 1361.15 47.9653 1360.57 48.584C1360 49.2027 1359.71 50.1947 1359.71 51.56V61ZM1367.75 51.272H1377.35C1377.31 50.0133 1376.96 49.032 1376.3 48.328C1375.66 47.6027 1374.74 47.24 1373.54 47.24C1372.12 47.24 1371.07 47.656 1370.41 48.488C1369.75 49.32 1369.42 50.7387 1369.42 52.744C1369.42 54.792 1369.74 56.232 1370.38 57.064C1371.02 57.8747 1372.15 58.28 1373.77 58.28C1374.9 58.28 1375.7 58.12 1376.17 57.8C1376.64 57.48 1376.94 57.0213 1377.06 56.424H1381.1C1380.88 57.8533 1380.18 59.0267 1378.98 59.944C1377.79 60.8613 1376.05 61.32 1373.77 61.32C1371.08 61.32 1369.03 60.5947 1367.62 59.144C1366.24 57.672 1365.54 55.56 1365.54 52.808C1365.54 50.0347 1366.25 47.912 1367.66 46.44C1369.06 44.9467 1371.03 44.2 1373.54 44.2C1375.89 44.2 1377.76 44.9147 1379.14 46.344C1380.55 47.752 1381.26 49.8853 1381.26 52.744V53.96H1367.72L1367.75 51.272ZM1399 61H1396.76C1395.8 61 1395.07 60.6693 1394.58 60.008C1394.09 59.3467 1393.82 58.504 1393.78 57.48H1394.52C1394.16 58.632 1393.54 59.56 1392.66 60.264C1391.79 60.968 1390.59 61.32 1389.08 61.32C1387.26 61.32 1385.79 60.904 1384.66 60.072C1383.55 59.24 1383 57.9493 1383 56.2C1383 55.176 1383.19 54.3333 1383.57 53.672C1383.98 52.9893 1384.5 52.456 1385.14 52.072C1385.8 51.688 1386.53 51.4213 1387.32 51.272C1388.11 51.1227 1388.9 51.048 1389.69 51.048H1393.78V49.928C1393.78 48.1147 1392.75 47.208 1390.68 47.208C1389.65 47.208 1388.9 47.4 1388.41 47.784C1387.92 48.168 1387.62 48.7333 1387.51 49.48H1383.61C1383.69 48.3493 1384.05 47.4 1384.69 46.632C1385.36 45.8427 1386.21 45.2453 1387.25 44.84C1388.32 44.4133 1389.49 44.2 1390.77 44.2C1391.52 44.2 1392.29 44.2853 1393.08 44.456C1393.87 44.6267 1394.6 44.936 1395.29 45.384C1395.99 45.8107 1396.56 46.4187 1396.98 47.208C1397.41 47.976 1397.62 48.968 1397.62 50.184V57.832H1399V61ZM1386.77 56.104C1386.77 57.576 1387.68 58.312 1389.49 58.312C1390.86 58.312 1391.92 57.992 1392.66 57.352C1393.41 56.712 1393.78 55.8693 1393.78 54.824V53.8H1389.72C1387.76 53.8 1386.77 54.568 1386.77 56.104Z" fill="#2D2D30" />
        </g>

        {/* Blue Pin 4 - India */}
        <g className={`pin-animate ${isActive ? 'active' : ''}`} style={{ animationDelay: `${pinDelays[3]}ms` }}>
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M1118.25 380C1098.64 380 1084.23 373.526 1084 364.62C1083.91 361.503 1085.62 358.557 1088.9 356.056C1094.76 351.638 1105.51 349 1117.75 349C1137.32 349 1151.72 355.44 1152 364.346C1152.09 367.463 1150.43 370.409 1147.15 372.909C1141.29 377.328 1130.53 380 1118.3 380H1118.25Z" fill="#005FF9" />
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M1117.66 372C1105.26 372 1096.15 367.614 1096 361.581C1095.94 359.47 1097.02 357.474 1099.1 355.78C1102.8 352.787 1109.6 351 1117.34 351C1129.72 351 1138.82 355.362 1139 361.396C1139.06 363.507 1138.01 365.503 1135.93 367.197C1132.23 370.19 1125.42 372 1117.69 372H1117.66Z" fill="#005FF9" />
          <path fillRule="evenodd" clipRule="evenodd" d="M1125 358C1125.05 360.209 1121.29 362 1116.58 362C1111.88 362 1108.05 360.209 1108 358C1107.95 355.791 1111.73 354 1116.42 354C1121.1 354 1124.95 355.791 1125 358Z" fill="#005FF9" />
          <path d="M1088 263H1146L1119.05 358H1115.06L1088 263Z" fill="#005FF9" />
          <mask id="mask3_4484_6143" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="1057" y="149" width="120" height="120">
            <circle cx="1117" cy="209" r="60" fill="#035EF5" />
          </mask>
          <g mask="url(#mask3_4484_6143)">
            <circle cx="1117" cy="209" r="60" fill="white" />
            <image href={getAssetUrl('/images/india.png')} x="1057" y="149" width="120" height="120" preserveAspectRatio="xMidYMid slice" />
          </g>
          <circle cx="1118" cy="208" r="60" stroke="#005FF9" strokeWidth="8" />
          <path d="M1088.18 125H1084.15V102.376H1088.18V125ZM1080.85 105.672V102.376H1091.44V105.672H1080.85ZM1080.85 125V121.672H1091.44V125H1080.85ZM1098.28 125H1094.38V108.552H1098.28L1098.25 110.536C1098.74 109.811 1099.33 109.245 1100.01 108.84C1100.7 108.413 1101.59 108.2 1102.7 108.2C1103.92 108.2 1104.98 108.413 1105.9 108.84C1106.82 109.267 1107.53 109.971 1108.04 110.952C1108.56 111.912 1108.81 113.203 1108.81 114.824V125H1104.91V114.856C1104.91 113.64 1104.65 112.755 1104.14 112.2C1103.63 111.645 1102.86 111.368 1101.84 111.368C1100.64 111.368 1099.75 111.688 1099.15 112.328C1098.57 112.947 1098.28 113.949 1098.28 115.336V125ZM1123.88 102.024H1127.78V125H1123.88V102.024ZM1118.66 125.32C1116.53 125.32 1114.81 124.605 1113.51 123.176C1112.23 121.747 1111.59 119.613 1111.59 116.776C1111.59 114.771 1111.9 113.139 1112.52 111.88C1113.16 110.621 1114.01 109.693 1115.08 109.096C1116.15 108.499 1117.34 108.2 1118.66 108.2C1120.24 108.2 1121.51 108.573 1122.47 109.32C1123.45 110.067 1124.16 111.091 1124.58 112.392C1125.03 113.672 1125.25 115.133 1125.25 116.776C1125.25 118.397 1125.03 119.859 1124.58 121.16C1124.16 122.44 1123.45 123.453 1122.47 124.2C1121.51 124.947 1120.24 125.32 1118.66 125.32ZM1119.75 122.216C1122.5 122.216 1123.88 120.403 1123.88 116.776C1123.88 113.128 1122.5 111.304 1119.75 111.304C1116.91 111.304 1115.49 113.128 1115.49 116.776C1115.49 120.403 1116.91 122.216 1119.75 122.216ZM1135.44 108.552V125H1131.57V108.552H1135.44ZM1131.47 102.024H1135.54V106.056H1131.47V102.024ZM1154.19 125H1151.95C1150.99 125 1150.26 124.669 1149.77 124.008C1149.28 123.347 1149.01 122.504 1148.97 121.48H1149.71C1149.34 122.632 1148.72 123.56 1147.85 124.264C1146.97 124.968 1145.78 125.32 1144.27 125.32C1142.45 125.32 1140.98 124.904 1139.85 124.072C1138.74 123.24 1138.19 121.949 1138.19 120.2C1138.19 119.176 1138.38 118.333 1138.76 117.672C1139.17 116.989 1139.69 116.456 1140.33 116.072C1140.99 115.688 1141.72 115.421 1142.51 115.272C1143.29 115.123 1144.08 115.048 1144.87 115.048H1148.97V113.928C1148.97 112.115 1147.93 111.208 1145.87 111.208C1144.84 111.208 1144.08 111.4 1143.59 111.784C1143.1 112.168 1142.8 112.733 1142.7 113.48H1138.79C1138.88 112.349 1139.24 111.4 1139.88 110.632C1140.54 109.843 1141.4 109.245 1142.44 108.84C1143.51 108.413 1144.68 108.2 1145.96 108.2C1146.71 108.2 1147.48 108.285 1148.27 108.456C1149.05 108.627 1149.79 108.936 1150.47 109.384C1151.18 109.811 1151.74 110.419 1152.17 111.208C1152.6 111.976 1152.81 112.968 1152.81 114.184V121.832H1154.19V125ZM1141.96 120.104C1141.96 121.576 1142.87 122.312 1144.68 122.312C1146.05 122.312 1147.1 121.992 1147.85 121.352C1148.6 120.712 1148.97 119.869 1148.97 118.824V117.8H1144.91C1142.94 117.8 1141.96 118.568 1141.96 120.104Z" fill="#2D2D30" />
        </g>

        {/* Blue Pin 5 - Kazakhstan */}
        <g className={`pin-animate ${isActive ? 'active' : ''}`} style={{ animationDelay: `${pinDelays[4]}ms` }}>
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M939.254 283C919.636 283 905.234 276.526 905.004 267.62C904.911 264.503 906.619 261.557 909.896 259.056C915.759 254.638 926.514 252 938.746 252C958.318 252 972.719 258.44 972.996 267.346C973.089 270.463 971.427 273.409 968.15 275.909C962.287 280.328 951.532 283 939.3 283H939.254Z" fill="#005FF9" />
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M939.661 275C927.255 275 918.148 270.614 918.002 264.581C917.944 262.47 919.024 260.474 921.096 258.78C924.803 255.787 931.604 254 939.339 254C951.716 254 960.823 258.362 960.998 264.396C961.056 266.507 960.005 268.503 957.933 270.197C954.226 273.19 947.425 275 939.69 275H939.661Z" fill="#005FF9" />
          <path fillRule="evenodd" clipRule="evenodd" d="M947 261C947.046 263.209 943.285 265 938.585 265C933.884 265 930.047 263.209 930 261C929.954 258.791 933.73 257 938.415 257C943.1 257 946.953 258.791 947 261Z" fill="#005FF9" />
          <path d="M909 167.5H967L940.052 261H936.06L909 167.5Z" fill="#005FF9" />
          <mask id="mask4_4484_6143" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="878" y="52" width="120" height="120">
            <circle cx="938" cy="112" r="60" fill="#035EF5" />
          </mask>
          <g mask="url(#mask4_4484_6143)">
            <circle cx="938" cy="112" r="60" fill="white" />
            <image href={getAssetUrl('/images/Kazakhstan.png')} x="878" y="52" width="120" height="120" preserveAspectRatio="xMidYMid slice" />
          </g>
          <circle cx="938" cy="112" r="60" stroke="#005FF9" strokeWidth="8" />
          <path d="M865.627 14.696L875.419 29H870.651L863.003 17.832L865.627 14.696ZM861.531 29H857.499V6.376H861.531V29ZM860.027 23.816V18.632L870.203 6.376H875.003L860.027 23.816ZM891.424 29H889.184C888.224 29 887.499 28.6693 887.008 28.008C886.517 27.3467 886.251 26.504 886.208 25.48H886.944C886.581 26.632 885.963 27.56 885.088 28.264C884.213 28.968 883.019 29.32 881.504 29.32C879.691 29.32 878.219 28.904 877.088 28.072C875.979 27.24 875.424 25.9493 875.424 24.2C875.424 23.176 875.616 22.3333 876 21.672C876.405 20.9893 876.928 20.456 877.568 20.072C878.229 19.688 878.955 19.4213 879.744 19.272C880.533 19.1227 881.323 19.048 882.112 19.048H886.208V17.928C886.208 16.1147 885.173 15.208 883.104 15.208C882.08 15.208 881.323 15.4 880.832 15.784C880.341 16.168 880.043 16.7333 879.936 17.48H876.032C876.117 16.3493 876.48 15.4 877.12 14.632C877.781 13.8427 878.635 13.2453 879.68 12.84C880.747 12.4133 881.92 12.2 883.2 12.2C883.947 12.2 884.715 12.2853 885.504 12.456C886.293 12.6267 887.029 12.936 887.712 13.384C888.416 13.8107 888.981 14.4187 889.408 15.208C889.835 15.976 890.048 16.968 890.048 18.184V25.832H891.424V29ZM879.2 24.104C879.2 25.576 880.107 26.312 881.92 26.312C883.285 26.312 884.341 25.992 885.088 25.352C885.835 24.712 886.208 23.8693 886.208 22.824V21.8H882.144C880.181 21.8 879.2 22.568 879.2 24.104ZM892.659 26.344L903.635 13.224L903.763 15.656H892.979V12.552H906.451V15.24L895.571 28.296L895.507 25.864H906.771V29H892.659V26.344ZM924.175 29H921.935C920.975 29 920.25 28.6693 919.759 28.008C919.269 27.3467 919.002 26.504 918.959 25.48H919.695C919.333 26.632 918.714 27.56 917.839 28.264C916.965 28.968 915.77 29.32 914.255 29.32C912.442 29.32 910.97 28.904 909.839 28.072C908.73 27.24 908.175 25.9493 908.175 24.2C908.175 23.176 908.367 22.3333 908.751 21.672C909.157 20.9893 909.679 20.456 910.319 20.072C910.981 19.688 911.706 19.4213 912.495 19.272C913.285 19.1227 914.074 19.048 914.863 19.048H918.959V17.928C918.959 16.1147 917.925 15.208 915.855 15.208C914.831 15.208 914.074 15.4 913.583 15.784C913.093 16.168 912.794 16.7333 912.687 17.48H908.783C908.869 16.3493 909.231 15.4 909.871 14.632C910.533 13.8427 911.386 13.2453 912.431 12.84C913.498 12.4133 914.671 12.2 915.951 12.2C916.698 12.2 917.466 12.2853 918.255 12.456C919.045 12.6267 919.781 12.936 920.463 13.384C921.167 13.8107 921.733 14.4187 922.159 15.208C922.586 15.976 922.799 16.968 922.799 18.184V25.832H924.175V29ZM911.951 24.104C911.951 25.576 912.858 26.312 914.671 26.312C916.037 26.312 917.093 25.992 917.839 25.352C918.586 24.712 918.959 23.8693 918.959 22.824V21.8H914.895C912.933 21.8 911.951 22.568 911.951 24.104ZM933.538 17.768L942.306 29H937.634L930.818 20.04L933.538 17.768ZM930.402 29H926.498V6.024H930.402V29ZM929.858 19.4L936.77 12.552H941.442L929.922 23.624L929.858 19.4ZM948.2 29H944.296V6.024H948.2L948.168 14.536C948.658 13.8107 949.245 13.2453 949.928 12.84C950.61 12.4133 951.506 12.2 952.616 12.2C953.832 12.2 954.898 12.4133 955.816 12.84C956.733 13.2667 957.448 13.9707 957.96 14.952C958.472 15.912 958.728 17.2027 958.728 18.824V29H954.824V18.856C954.824 17.64 954.568 16.7547 954.056 16.2C953.544 15.6453 952.776 15.368 951.752 15.368C950.557 15.368 949.661 15.688 949.064 16.328C948.488 16.9467 948.2 17.9493 948.2 19.336V29ZM971.236 17.32C971.108 16.552 970.831 16.0293 970.404 15.752C969.999 15.4747 969.38 15.336 968.548 15.336C967.716 15.336 967.055 15.4747 966.564 15.752C966.074 16.008 965.828 16.4133 965.828 16.968C965.828 17.4373 965.999 17.8213 966.34 18.12C966.682 18.4187 967.247 18.664 968.036 18.856L970.34 19.464C971.983 19.8693 973.22 20.456 974.052 21.224C974.884 21.992 975.3 22.9947 975.3 24.232C975.3 25.7893 974.692 27.0267 973.476 27.944C972.282 28.8613 970.554 29.32 968.292 29.32C966.159 29.32 964.495 28.872 963.3 27.976C962.127 27.08 961.476 25.7893 961.348 24.104H965.38C965.487 24.8507 965.743 25.384 966.148 25.704C966.575 26.024 967.268 26.184 968.228 26.184C969.444 26.184 970.266 26.024 970.692 25.704C971.119 25.384 971.332 24.9467 971.332 24.392C971.332 23.9013 971.172 23.496 970.852 23.176C970.532 22.856 969.988 22.6 969.22 22.408L966.916 21.832C965.295 21.4053 964.058 20.808 963.204 20.04C962.372 19.272 961.956 18.3013 961.956 17.128C961.956 15.6347 962.543 14.44 963.716 13.544C964.89 12.648 966.5 12.2 968.548 12.2C970.511 12.2 972.068 12.648 973.22 13.544C974.372 14.44 974.97 15.6987 975.012 17.32H971.236ZM986.11 15.656H982.718V25.896H986.11V29H983.55C982.164 29 981.022 28.6693 980.126 28.008C979.252 27.3253 978.814 26.2373 978.814 24.744V15.656H976.222V12.552H978.814V7.816H982.718V12.552H986.11V15.656ZM1003.04 29H1000.8C999.838 29 999.112 28.6693 998.622 28.008C998.131 27.3467 997.864 26.504 997.822 25.48H998.558C998.195 26.632 997.576 27.56 996.702 28.264C995.827 28.968 994.632 29.32 993.118 29.32C991.304 29.32 989.832 28.904 988.702 28.072C987.592 27.24 987.038 25.9493 987.038 24.2C987.038 23.176 987.23 22.3333 987.614 21.672C988.019 20.9893 988.542 20.456 989.182 20.072C989.843 19.688 990.568 19.4213 991.358 19.272C992.147 19.1227 992.936 19.048 993.726 19.048H997.822V17.928C997.822 16.1147 996.787 15.208 994.718 15.208C993.694 15.208 992.936 15.4 992.446 15.784C991.955 16.168 991.656 16.7333 991.55 17.48H987.646C987.731 16.3493 988.094 15.4 988.734 14.632C989.395 13.8427 990.248 13.2453 991.294 12.84C992.36 12.4133 993.534 12.2 994.814 12.2C995.56 12.2 996.328 12.2853 997.118 12.456C997.907 12.6267 998.643 12.936 999.326 13.384C1000.03 13.8107 1000.6 14.4187 1001.02 15.208C1001.45 15.976 1001.66 16.968 1001.66 18.184V25.832H1003.04V29ZM990.814 24.104C990.814 25.576 991.72 26.312 993.534 26.312C994.899 26.312 995.955 25.992 996.702 25.352C997.448 24.712 997.822 23.8693 997.822 22.824V21.8H993.758C991.795 21.8 990.814 22.568 990.814 24.104ZM1009.26 29H1005.36V12.552H1009.26L1009.23 14.536C1009.72 13.8107 1010.31 13.2453 1010.99 12.84C1011.68 12.4133 1012.57 12.2 1013.68 12.2C1014.9 12.2 1015.96 12.4133 1016.88 12.84C1017.8 13.2667 1018.51 13.9707 1019.02 14.952C1019.54 15.912 1019.79 17.2027 1019.79 18.824V29H1015.89V18.856C1015.89 17.64 1015.63 16.7547 1015.12 16.2C1014.61 15.6453 1013.84 15.368 1012.82 15.368C1011.62 15.368 1010.73 15.688 1010.13 16.328C1009.55 16.9467 1009.26 17.9493 1009.26 19.336V29Z" fill="#2D2D30" />
        </g>

        {/* Small Black Pins - Various locations */}
        {/* Pin 6 */}
        <g className={`pin-animate ${isActive ? 'active' : ''}`} style={{ animationDelay: `${pinDelays[5]}ms` }}>
          <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M34.4196 306.359C22.8279 306.359 14.3182 302.411 14.1818 296.978C14.1272 295.077 15.1364 293.28 17.0729 291.755C20.5368 289.06 26.8918 287.451 34.1196 287.451C45.684 287.451 54.1937 291.379 54.3574 296.811C54.4119 298.712 53.43 300.509 51.4935 302.034C48.0297 304.73 41.6747 306.359 34.4469 306.359H34.4196Z" fill="#0F0F0F" />
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M34.3698 301.632C26.8693 301.632 21.363 298.917 21.2748 295.183C21.2395 293.876 21.8925 292.64 23.1455 291.592C25.3869 289.739 29.4989 288.633 34.1757 288.633C41.6586 288.633 47.1649 291.333 47.2708 295.068C47.3061 296.375 46.6707 297.61 45.4177 298.659C43.1764 300.512 39.0643 301.632 34.3875 301.632H34.3698Z" fill="#0F0F0F" />
          <path fillRule="evenodd" clipRule="evenodd" d="M40.1808 293.36C40.2193 295.318 37.0824 296.905 33.1613 296.905C29.2401 296.905 26.0389 295.318 26.0004 293.36C25.9618 291.402 29.1116 289.814 33.0199 289.814C36.9281 289.814 40.1422 291.402 40.1808 293.36Z" fill="#0F0F0F" />
          <path d="M17.7773 270.398H47.2384L33.5504 292.24H31.5225L17.7773 270.398Z" fill="#0F0F0F" />
          <mask id="mask5_4484_6143" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="213" width="66" height="66">
            <circle cx="32.5088" cy="245.509" r="32.5088" fill="#035EF5" />
          </mask>
          <g mask="url(#mask5_4484_6143)">
            <circle cx="32.5088" cy="245.509" r="32.5088" fill="#0F0F0F" />
            <image href={getAssetUrl('/images/flag-usa.png')} x="0" y="213" width="65" height="65" preserveAspectRatio="xMidYMid slice" />
            <circle cx="32.5088" cy="245.509" r="30.0088" stroke="#0F0F0F" strokeWidth="5" />
          </g>
        </g>

        {/* Pin 7 */}
        <g className={`pin-animate ${isActive ? 'active' : ''}`} style={{ animationDelay: `${pinDelays[6]}ms` }}>
          <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M361.42 540.359C349.828 540.359 341.318 536.411 341.182 530.978C341.127 529.077 342.136 527.28 344.073 525.755C347.537 523.06 353.892 521.451 361.12 521.451C372.684 521.451 381.194 525.379 381.357 530.811C381.412 532.712 380.43 534.509 378.494 536.034C375.03 538.73 368.675 540.359 361.447 540.359H361.42Z" fill="#0F0F0F" />
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M361.37 535.632C353.869 535.632 348.363 532.917 348.275 529.183C348.239 527.876 348.892 526.64 350.146 525.592C352.387 523.739 356.499 522.633 361.176 522.633C368.659 522.633 374.165 525.333 374.271 529.068C374.306 530.375 373.671 531.61 372.418 532.659C370.176 534.512 366.064 535.632 361.387 535.632H361.37Z" fill="#0F0F0F" />
          <path fillRule="evenodd" clipRule="evenodd" d="M367.181 527.36C367.219 529.318 364.082 530.905 360.161 530.905C356.24 530.905 353.039 529.318 353 527.36C352.962 525.402 356.112 523.814 360.02 523.814C363.928 523.814 367.142 525.402 367.181 527.36Z" fill="#0F0F0F" />
          <path d="M344.777 504.398H374.238L360.55 526.24H358.523L344.777 504.398Z" fill="#0F0F0F" />
          <mask id="mask6_4484_6143" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="327" y="447" width="66" height="66">
            <circle cx="359.509" cy="479.509" r="32.5088" fill="#035EF5" />
          </mask>
          <g mask="url(#mask6_4484_6143)">
            <circle cx="359.509" cy="479.509" r="32.5088" fill="#0F0F0F" />
            <image href={getAssetUrl('/images/pin7.png')} x="327" y="447" width="65" height="65" preserveAspectRatio="xMidYMid slice" />
            <circle cx="359.509" cy="479.509" r="30.0088" stroke="#0F0F0F" strokeWidth="5" />
          </g>
        </g>

        {/* Pin 8 */}
        <g className={`pin-animate ${isActive ? 'active' : ''}`} style={{ animationDelay: `${pinDelays[7]}ms` }}>
          <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M459.42 488.359C447.828 488.359 439.318 484.411 439.182 478.978C439.127 477.077 440.136 475.28 442.073 473.755C445.537 471.06 451.892 469.451 459.12 469.451C470.684 469.451 479.194 473.379 479.357 478.811C479.412 480.712 478.43 482.509 476.494 484.034C473.03 486.73 466.675 488.359 459.447 488.359H459.42Z" fill="#0F0F0F" />
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M459.37 483.632C451.869 483.632 446.363 480.917 446.275 477.183C446.239 475.876 446.892 474.64 448.146 473.592C450.387 471.739 454.499 470.633 459.176 470.633C466.659 470.633 472.165 473.333 472.271 477.068C472.306 478.375 471.671 479.61 470.418 480.659C468.176 482.512 464.064 483.632 459.387 483.632H459.37Z" fill="#0F0F0F" />
          <path fillRule="evenodd" clipRule="evenodd" d="M465.181 475.36C465.219 477.318 462.082 478.905 458.161 478.905C454.24 478.905 451.039 477.318 451 475.36C450.962 473.402 454.112 471.814 458.02 471.814C461.928 471.814 465.142 473.402 465.181 475.36Z" fill="#0F0F0F" />
          <path d="M442.777 452.398H472.238L458.55 474.24H456.523L442.777 452.398Z" fill="#0F0F0F" />
          <mask id="mask7_4484_6143" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="425" y="395" width="66" height="66">
            <circle cx="457.509" cy="427.509" r="32.5088" fill="#035EF5" />
          </mask>
          <g mask="url(#mask7_4484_6143)">
            <circle cx="457.509" cy="427.509" r="32.5088" fill="#0F0F0F" />
            <image href={getAssetUrl('/images/pin8.png')} x="425" y="395" width="65" height="65" preserveAspectRatio="xMidYMid slice" />
            <circle cx="457.509" cy="427.509" r="30.0088" stroke="#0F0F0F" strokeWidth="5" />
          </g>
        </g>

        {/* Pin 9 */}
        <g className={`pin-animate ${isActive ? 'active' : ''}`} style={{ animationDelay: `${pinDelays[8]}ms` }}>
          <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M945.42 404.359C933.828 404.359 925.318 400.411 925.182 394.978C925.127 393.077 926.136 391.28 928.073 389.755C931.537 387.06 937.892 385.451 945.12 385.451C956.684 385.451 965.194 389.379 965.357 394.811C965.412 396.712 964.43 398.509 962.494 400.034C959.03 402.73 952.675 404.359 945.447 404.359H945.42Z" fill="#0F0F0F" />
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M945.37 399.632C937.869 399.632 932.363 396.917 932.275 393.183C932.239 391.876 932.892 390.64 934.146 389.592C936.387 387.739 940.499 386.633 945.176 386.633C952.659 386.633 958.165 389.333 958.271 393.068C958.306 394.375 957.671 395.61 956.418 396.659C954.176 398.512 950.064 399.632 945.387 399.632H945.37Z" fill="#0F0F0F" />
          <path fillRule="evenodd" clipRule="evenodd" d="M951.181 391.36C951.219 393.318 948.082 394.905 944.161 394.905C940.24 394.905 937.039 393.318 937 391.36C936.962 389.402 940.112 387.814 944.02 387.814C947.928 387.814 951.142 389.402 951.181 391.36Z" fill="#0F0F0F" />
          <path d="M928.777 368.398H958.238L944.55 390.24H942.523L928.777 368.398Z" fill="#0F0F0F" />
          <mask id="mask8_4484_6143" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="911" y="311" width="66" height="66">
            <circle cx="943.509" cy="343.509" r="32.5088" fill="#035EF5" />
          </mask>
          <g mask="url(#mask8_4484_6143)">
            <circle cx="943.509" cy="343.509" r="32.5088" fill="#0F0F0F" />
            <image href={getAssetUrl('/images/pin9.png')} x="911" y="311" width="65" height="65" preserveAspectRatio="xMidYMid slice" />
            <circle cx="943.509" cy="343.509" r="30.0088" stroke="#0F0F0F" strokeWidth="5" />
          </g>
        </g>

        {/* Pin 10 */}
        <g className={`pin-animate ${isActive ? 'active' : ''}`} style={{ animationDelay: `${pinDelays[9]}ms` }}>
          <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M1252.42 378.359C1240.83 378.359 1232.32 374.411 1232.18 368.978C1232.13 367.077 1233.14 365.28 1235.07 363.755C1238.54 361.06 1244.89 359.451 1252.12 359.451C1263.68 359.451 1272.19 363.379 1272.36 368.811C1272.41 370.712 1271.43 372.509 1269.49 374.034C1266.03 376.73 1259.67 378.359 1252.45 378.359H1252.42Z" fill="#0F0F0F" />
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M1252.37 373.632C1244.87 373.632 1239.36 370.917 1239.27 367.183C1239.24 365.876 1239.89 364.64 1241.15 363.592C1243.39 361.739 1247.5 360.633 1252.18 360.633C1259.66 360.633 1265.16 363.333 1265.27 367.068C1265.31 368.375 1264.67 369.61 1263.42 370.659C1261.18 372.512 1257.06 373.632 1252.39 373.632H1252.37Z" fill="#0F0F0F" />
          <path fillRule="evenodd" clipRule="evenodd" d="M1258.18 365.36C1258.22 367.318 1255.08 368.905 1251.16 368.905C1247.24 368.905 1244.04 367.318 1244 365.36C1243.96 363.402 1247.11 361.814 1251.02 361.814C1254.93 361.814 1258.14 363.402 1258.18 365.36Z" fill="#0F0F0F" />
          <path d="M1235.78 342.398H1265.24L1251.55 364.24H1249.52L1235.78 342.398Z" fill="#0F0F0F" />
          <mask id="mask9_4484_6143" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="1218" y="285" width="66" height="66">
            <circle cx="1250.51" cy="317.509" r="32.5088" fill="#035EF5" />
          </mask>
          <g mask="url(#mask9_4484_6143)">
            <circle cx="1250.51" cy="317.509" r="32.5088" fill="#0F0F0F" />
            <image href={getAssetUrl('/images/pin10.png')} x="1218" y="285" width="65" height="65" preserveAspectRatio="xMidYMid slice" />
            <circle cx="1250.51" cy="317.509" r="30.0088" stroke="#0F0F0F" strokeWidth="5" />
          </g>
        </g>

        {/* Pin 11 */}
        <g className={`pin-animate ${isActive ? 'active' : ''}`} style={{ animationDelay: `${pinDelays[10]}ms` }}>
          <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M195.42 379.359C183.828 379.359 175.318 375.411 175.182 369.978C175.127 368.077 176.136 366.28 178.073 364.755C181.537 362.06 187.892 360.451 195.12 360.451C206.684 360.451 215.194 364.379 215.357 369.811C215.412 371.712 214.43 373.509 212.494 375.034C209.03 377.73 202.675 379.359 195.447 379.359H195.42Z" fill="#0F0F0F" />
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M195.37 374.632C187.869 374.632 182.363 371.917 182.275 368.183C182.239 366.876 182.892 365.64 184.146 364.592C186.387 362.739 190.499 361.633 195.176 361.633C202.659 361.633 208.165 364.333 208.271 368.068C208.306 369.375 207.671 370.61 206.418 371.659C204.176 373.512 200.064 374.632 195.387 374.632H195.37Z" fill="#0F0F0F" />
          <path fillRule="evenodd" clipRule="evenodd" d="M201.181 366.36C201.219 368.318 198.082 369.905 194.161 369.905C190.24 369.905 187.039 368.318 187 366.36C186.962 364.402 190.112 362.814 194.02 362.814C197.928 362.814 201.142 364.402 201.181 366.36Z" fill="#0F0F0F" />
          <path d="M178.777 343.398H208.238L194.55 365.24H192.523L178.777 343.398Z" fill="#0F0F0F" />
          <mask id="mask10_4484_6143" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="161" y="286" width="66" height="66">
            <circle cx="193.509" cy="318.509" r="32.5088" fill="#035EF5" />
          </mask>
          <g mask="url(#mask10_4484_6143)">
            <circle cx="193.509" cy="318.509" r="32.5088" fill="#0F0F0F" />
            <image href={getAssetUrl('/images/pin11.png')} x="161" y="286" width="65" height="65" preserveAspectRatio="xMidYMid slice" />
            <circle cx="193.509" cy="318.509" r="30.0088" stroke="#0F0F0F" strokeWidth="5" />
          </g>
        </g>

        {/* Pin 12 */}
        <g className={`pin-animate ${isActive ? 'active' : ''}`} style={{ animationDelay: `${pinDelays[11]}ms` }}>
          <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M789.42 181.359C777.828 181.359 769.318 177.411 769.182 171.978C769.127 170.077 770.136 168.28 772.073 166.755C775.537 164.06 781.892 162.451 789.12 162.451C800.684 162.451 809.194 166.379 809.357 171.811C809.412 173.712 808.43 175.509 806.494 177.034C803.03 179.73 796.675 181.359 789.447 181.359H789.42Z" fill="#0F0F0F" />
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M789.37 176.632C781.869 176.632 776.363 173.917 776.275 170.183C776.239 168.876 776.892 167.64 778.146 166.592C780.387 164.739 784.499 163.633 789.176 163.633C796.659 163.633 802.165 166.333 802.271 170.068C802.306 171.375 801.671 172.61 800.418 173.659C798.176 175.512 794.064 176.632 789.387 176.632H789.37Z" fill="#0F0F0F" />
          <path fillRule="evenodd" clipRule="evenodd" d="M795.181 168.36C795.219 170.318 792.082 171.905 788.161 171.905C784.24 171.905 781.039 170.318 781 168.36C780.962 166.402 784.112 164.814 788.02 164.814C791.928 164.814 795.142 166.402 795.181 168.36Z" fill="#0F0F0F" />
          <path d="M772.777 145.398H802.238L788.55 167.24H786.523L772.777 145.398Z" fill="#0F0F0F" />
          <mask id="mask11_4484_6143" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="755" y="88" width="66" height="66">
            <circle cx="787.509" cy="120.509" r="32.5088" fill="#035EF5" />
          </mask>
          <g mask="url(#mask11_4484_6143)">
            <circle cx="787.509" cy="120.509" r="32.5088" fill="#0F0F0F" />
            <image href={getAssetUrl('/images/pin12.png')} x="755" y="88" width="65" height="65" preserveAspectRatio="xMidYMid slice" />
            <circle cx="787.509" cy="120.509" r="30.0088" stroke="#0F0F0F" strokeWidth="5" />
          </g>
        </g>

        {/* Pin 13 */}
        <g className={`pin-animate ${isActive ? 'active' : ''}`} style={{ animationDelay: `${pinDelays[12]}ms` }}>
          <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M975.42 274.359C963.828 274.359 955.318 270.411 955.182 264.978C955.127 263.077 956.136 261.28 958.073 259.755C961.537 257.06 967.892 255.451 975.12 255.451C986.684 255.451 995.194 259.379 995.357 264.811C995.412 266.712 994.43 268.509 992.494 270.034C989.03 272.73 982.675 274.359 975.447 274.359H975.42Z" fill="#0F0F0F" />
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M975.37 269.632C967.869 269.632 962.363 266.917 962.275 263.183C962.239 261.876 962.892 260.64 964.146 259.592C966.387 257.739 970.499 256.633 975.176 256.633C982.659 256.633 988.165 259.333 988.271 263.068C988.306 264.375 987.671 265.61 986.418 266.659C984.176 268.512 980.064 269.632 975.387 269.632H975.37Z" fill="#0F0F0F" />
          <path fillRule="evenodd" clipRule="evenodd" d="M981.181 261.36C981.219 263.318 978.082 264.905 974.161 264.905C970.24 264.905 967.039 263.318 967 261.36C966.962 259.402 970.112 257.814 974.02 257.814C977.928 257.814 981.142 259.402 981.181 261.36Z" fill="#0F0F0F" />
          <path d="M958.777 238.398H988.238L974.55 260.24H972.523L958.777 238.398Z" fill="#0F0F0F" />
          <mask id="mask12_4484_6143" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="941" y="181" width="66" height="66">
            <circle cx="973.509" cy="213.509" r="32.5088" fill="#035EF5" />
          </mask>
          <g mask="url(#mask12_4484_6143)">
            <circle cx="973.509" cy="213.509" r="32.5088" fill="#0F0F0F" />
            <image href={getAssetUrl('/images/pin13.png')} x="941" y="181" width="65" height="65" preserveAspectRatio="xMidYMid slice" />
            <circle cx="973.509" cy="213.509" r="30.0088" stroke="#0F0F0F" strokeWidth="5" />
          </g>
        </g>

        {/* Pin 14 */}
        <g className={`pin-animate ${isActive ? 'active' : ''}`} style={{ animationDelay: `${pinDelays[13]}ms` }}>
          <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M1155.42 371.359C1143.83 371.359 1135.32 367.411 1135.18 361.978C1135.13 360.077 1136.14 358.28 1138.07 356.755C1141.54 354.06 1147.89 352.451 1155.12 352.451C1166.68 352.451 1175.19 356.379 1175.36 361.811C1175.41 363.712 1174.43 365.509 1172.49 367.034C1169.03 369.73 1162.67 371.359 1155.45 371.359H1155.42Z" fill="#0F0F0F" />
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M1155.37 366.632C1147.87 366.632 1142.36 363.917 1142.27 360.183C1142.24 358.876 1142.89 357.64 1144.15 356.592C1146.39 354.739 1150.5 353.633 1155.18 353.633C1162.66 353.633 1168.16 356.333 1168.27 360.068C1168.31 361.375 1167.67 362.61 1166.42 363.659C1164.18 365.512 1160.06 366.632 1155.39 366.632H1155.37Z" fill="#0F0F0F" />
          <path fillRule="evenodd" clipRule="evenodd" d="M1161.18 358.36C1161.22 360.318 1158.08 361.905 1154.16 361.905C1150.24 361.905 1147.04 360.318 1147 358.36C1146.96 356.402 1150.11 354.814 1154.02 354.814C1157.93 354.814 1161.14 356.402 1161.18 358.36Z" fill="#0F0F0F" />
          <path d="M1138.78 335.398H1168.24L1154.55 357.24H1152.52L1138.78 335.398Z" fill="#0F0F0F" />
          <mask id="mask13_4484_6143" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="1121" y="278" width="66" height="66">
            <circle cx="1153.51" cy="310.509" r="32.5088" fill="#035EF5" />
          </mask>
          <g mask="url(#mask13_4484_6143)">
            <circle cx="1153.51" cy="310.509" r="32.5088" fill="#0F0F0F" />
            <image href={getAssetUrl('/images/pin14.png')} x="1121" y="278" width="65" height="65" preserveAspectRatio="xMidYMid slice" />
            <circle cx="1153.51" cy="310.509" r="30.0088" stroke="#0F0F0F" strokeWidth="5" />
          </g>
        </g>

        {/* Pin 15 */}
        <g className={`pin-animate ${isActive ? 'active' : ''}`} style={{ animationDelay: `${pinDelays[14]}ms` }}>
          <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M1281.42 290.359C1269.83 290.359 1261.32 286.411 1261.18 280.978C1261.13 279.077 1262.14 277.28 1264.07 275.755C1267.54 273.06 1273.89 271.451 1281.12 271.451C1292.68 271.451 1301.19 275.379 1301.36 280.811C1301.41 282.712 1300.43 284.509 1298.49 286.034C1295.03 288.73 1288.67 290.359 1281.45 290.359H1281.42Z" fill="#0F0F0F" />
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M1281.37 285.632C1273.87 285.632 1268.36 282.917 1268.27 279.183C1268.24 277.876 1268.89 276.64 1270.15 275.592C1272.39 273.739 1276.5 272.633 1281.18 272.633C1288.66 272.633 1294.16 275.333 1294.27 279.068C1294.31 280.375 1293.67 281.61 1292.42 282.659C1290.18 284.512 1286.06 285.632 1281.39 285.632H1281.37Z" fill="#0F0F0F" />
          <path fillRule="evenodd" clipRule="evenodd" d="M1287.18 277.36C1287.22 279.318 1284.08 280.905 1280.16 280.905C1276.24 280.905 1273.04 279.318 1273 277.36C1272.96 275.402 1276.11 273.814 1280.02 273.814C1283.93 273.814 1287.14 275.402 1287.18 277.36Z" fill="#0F0F0F" />
          <path d="M1264.78 254.398H1294.24L1280.55 276.24H1278.52L1264.78 254.398Z" fill="#0F0F0F" />
          <mask id="mask14_4484_6143" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="1247" y="197" width="66" height="66">
            <circle cx="1279.51" cy="229.509" r="32.5088" fill="#035EF5" />
          </mask>
          <g mask="url(#mask14_4484_6143)">
            <circle cx="1279.51" cy="229.509" r="32.5088" fill="#0F0F0F" />
            <image href={getAssetUrl('/images/pin15.png')} x="1247" y="197" width="65" height="65" preserveAspectRatio="xMidYMid slice" />
            <circle cx="1279.51" cy="229.509" r="30.0088" stroke="#0F0F0F" strokeWidth="5" />
          </g>
        </g>

        {/* Pin 16 */}
        <g className={`pin-animate ${isActive ? 'active' : ''}`} style={{ animationDelay: `${pinDelays[15]}ms` }}>
          <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M1463.42 496.359C1451.83 496.359 1443.32 492.411 1443.18 486.978C1443.13 485.077 1444.14 483.28 1446.07 481.755C1449.54 479.06 1455.89 477.451 1463.12 477.451C1474.68 477.451 1483.19 481.379 1483.36 486.811C1483.41 488.712 1482.43 490.509 1480.49 492.034C1477.03 494.73 1470.67 496.359 1463.45 496.359H1463.42Z" fill="#0F0F0F" />
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M1463.37 491.632C1455.87 491.632 1450.36 488.917 1450.27 485.183C1450.24 483.876 1450.89 482.64 1452.15 481.592C1454.39 479.739 1458.5 478.633 1463.18 478.633C1470.66 478.633 1476.16 481.333 1476.27 485.068C1476.31 486.375 1475.67 487.61 1474.42 488.659C1472.18 490.512 1468.06 491.632 1463.39 491.632H1463.37Z" fill="#0F0F0F" />
          <path fillRule="evenodd" clipRule="evenodd" d="M1469.18 483.36C1469.22 485.318 1466.08 486.905 1462.16 486.905C1458.24 486.905 1455.04 485.318 1455 483.36C1454.96 481.402 1458.11 479.814 1462.02 479.814C1465.93 479.814 1469.14 481.402 1469.18 483.36Z" fill="#0F0F0F" />
          <path d="M1446.78 460.398H1476.24L1462.55 482.24H1460.52L1446.78 460.398Z" fill="#0F0F0F" />
          <mask id="mask15_4484_6143" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="1429" y="403" width="66" height="66">
            <circle cx="1461.51" cy="435.509" r="32.5088" fill="#035EF5" />
          </mask>
          <g mask="url(#mask15_4484_6143)">
            <circle cx="1461.51" cy="435.509" r="32.5088" fill="#0F0F0F" />
            <image href={getAssetUrl('/images/pin16.png')} x="1429" y="403" width="65" height="65" preserveAspectRatio="xMidYMid slice" />
            <circle cx="1461.51" cy="435.509" r="30.0088" stroke="#0F0F0F" strokeWidth="5" />
          </g>
        </g>

        {/* Pin 17 */}
        <g className={`pin-animate ${isActive ? 'active' : ''}`} style={{ animationDelay: `${pinDelays[16]}ms` }}>
          <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M1434.42 306.359C1422.83 306.359 1414.32 302.411 1414.18 296.978C1414.13 295.077 1415.14 293.28 1417.07 291.755C1420.54 289.06 1426.89 287.451 1434.12 287.451C1445.68 287.451 1454.19 291.379 1454.36 296.811C1454.41 298.712 1453.43 300.509 1451.49 302.034C1448.03 304.73 1441.67 306.359 1434.45 306.359H1434.42Z" fill="#0F0F0F" />
          <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M1434.37 301.632C1426.87 301.632 1421.36 298.917 1421.27 295.183C1421.24 293.876 1421.89 292.64 1423.15 291.592C1425.39 289.739 1429.5 288.633 1434.18 288.633C1441.66 288.633 1447.16 291.333 1447.27 295.068C1447.31 296.375 1446.67 297.61 1445.42 298.659C1443.18 300.512 1439.06 301.632 1434.39 301.632H1434.37Z" fill="#0F0F0F" />
          <path fillRule="evenodd" clipRule="evenodd" d="M1440.18 293.36C1440.22 295.318 1437.08 296.905 1433.16 296.905C1429.24 296.905 1426.04 295.318 1426 293.36C1425.96 291.402 1429.11 289.814 1433.02 289.814C1436.93 289.814 1440.14 291.402 1440.18 293.36Z" fill="#0F0F0F" />
          <path d="M1417.78 270.398H1447.24L1433.55 292.24H1431.52L1417.78 270.398Z" fill="#0F0F0F" />
          <mask id="mask16_4484_6143" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="1400" y="213" width="66" height="66">
            <circle cx="1432.51" cy="245.509" r="32.5088" fill="#035EF5" />
          </mask>
          <g mask="url(#mask16_4484_6143)">
            <circle cx="1432.51" cy="245.509" r="32.5088" fill="#0F0F0F" />
            <image href={getAssetUrl('/images/pin17.png')} x="1400" y="213" width="65" height="65" preserveAspectRatio="xMidYMid slice" />
            <circle cx="1432.51" cy="245.509" r="30.0088" stroke="#0F0F0F" strokeWidth="5" />
          </g>
        </g>
      </svg>

      {/* Count Global SVG - Front Layer */}
      <img
        src={getAssetUrl('/images/count-global.svg')}
        alt="Count Global"
        className={`transition-all duration-1000 ease-out ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-16'}`}
        style={{
          position: 'absolute',
          top: '270px',
          left: '810px',
          zIndex: 50,
          transitionDelay: isActive ? '9000ms' : '0ms',
        }}
      />
    </div>
  );
};

// --- Slide 6 ---
interface Slide6Props {
  isActive: boolean;
}

const Slide6: React.FC<Slide6Props> = ({ isActive }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const videoRef2 = React.useRef<HTMLVideoElement>(null);
  const [showVideo1, setShowVideo1] = React.useState(true);
  const [showVideo2, setShowVideo2] = React.useState(true);

  React.useEffect(() => {
    // Playback rate setting (always set just in case)
    if (videoRef.current) videoRef.current.playbackRate = 1.0;
    if (videoRef2.current) videoRef2.current.playbackRate = 1.0;

    // Reset and play on active
    if (isActive) {
      setShowVideo1(true);
      setShowVideo2(true);

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => { });
      }
      if (videoRef2.current) {
        videoRef2.current.currentTime = 0;
        videoRef2.current.play().catch(() => { });
      }
    }
  }, [isActive]);

  const getAnimStyle = (delay: string, type: 'fade' | 'slideLeft' | 'slideRight' | 'slideUp') => {
    const baseStyle = "transition-all duration-[2000ms] ease-out";
    let transformStyle = "";

    if (type === 'fade') {
      transformStyle = isActive ? "opacity-100" : "opacity-0";
    } else if (type === 'slideLeft') {
      transformStyle = isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-32";
    } else if (type === 'slideRight') {
      transformStyle = isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-32";
    } else if (type === 'slideUp') {
      transformStyle = isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16";
    }

    return `${baseStyle} ${transformStyle} ${delay}`;
  };

  const titleStyle = {
    color: '#2D2D30',
    fontFamily: '"42dot Sans"',
    fontSize: '40px',
    fontStyle: 'normal',
    fontWeight: 800,
    lineHeight: '120%',
    letterSpacing: '-0.8px',
    marginBottom: '24px',
  };

  const descStyle = {
    color: '#2D2D30',
    fontFamily: '"42dot Sans"',
    fontSize: '30px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '120%',
    letterSpacing: '-0.6px',
    whiteSpace: 'pre-line',
  };

  return (
    <div className="relative w-[1920px] h-full flex-shrink-0 bg-[#F5F9FF] flex flex-col font-['42dot_Sans'] justify-center overflow-hidden">

      {/* Row 1: Digital Cluster */}
      <div className="flex-1 flex items-center w-full min-h-[300px] mt-[100px]">
        {/* Image Left */}
        <div className={`flex-shrink-0 relative flex justify-center items-center ${getAnimStyle('delay-[500ms]', 'slideLeft')}`}>
          <img src={getAssetUrl('/images/product1.png')} alt="Digital Cluster" className="block w-[860px] object-contain ml-[100px]" />
          <video
            ref={videoRef}
            src={getAssetUrl('/images/hino.mp4')}
            autoPlay
            muted
            playsInline
            // onEnded removed so it stops at last frame
            className="absolute ml-[85px] -mt-[30px] transition-opacity duration-1000 ease-out"
            style={{
              width: '85%',
              height: 'auto',
              maxWidth: '860px',
              opacity: showVideo1 ? 1 : 0
            }}
          />
        </div>
        {/* Text Right */}
        <div className={`flex-1 pl-16 pr-24 flex flex-col items-start -mt-[170px] -ml-[70px] text-left ${getAnimStyle('delay-[1000ms]', 'slideUp')}`}>
          <h2 style={titleStyle}>Digital Cluster</h2>
          <p style={descStyle}>
            Supporting vehicle platforms from two-wheelers to commercial trucks, MOTREX delivers dynamic and expressive GUI experiences powered by its proprietary TIACORE graphics engine.
          </p>
        </div>
      </div>

      {/* Row 2: Dash Cam */}
      <div className="flex-1 flex items-center w-full justify-end min-h-[300px] -mt-[100px]">
        {/* Text Left (Right aligned) */}
        <div className={`flex-1 pl-48 pr-16 -mt-[50px] flex flex-col items-end text-right ${getAnimStyle('delay-[1500ms]', 'slideUp')}`}>
          <h2 style={titleStyle}>Dash Cam</h2>
          <p style={descStyle}>
            With wireless Wi-Fi linking to the AV/AVN platform, the Dash Cam enables real-time monitoring and easy access to key settings.
            Multi-exposure blending ensures clear, balanced footage for reliable evidence, even in high-contrast driving conditions.
          </p>
        </div>
        {/* Image Right */}
        <div className={`flex-shrink-0 ${getAnimStyle('delay-[2000ms]', 'slideRight')}`}>
          <img src={getAssetUrl('/images/product2.png')} alt="Dash Cam" className="block w-[409px] object-contain mr-[100px]" />
        </div>
      </div>

      {/* Row 3: Center Display */}
      <div className="flex-1 flex items-center w-full min-h-[300px]">
        {/* Image Left */}
        <div className={`flex-shrink-0 relative ${getAnimStyle('delay-[2500ms]', 'slideLeft')}`}>
          <img src={getAssetUrl('/images/product3.png')} alt="Center Display" className="block w-[860px] object-contain ml-[200px] -mt-[100px] " />
          <video
            ref={videoRef2}
            src={getAssetUrl('/images/worldcup.mp4')}
            muted
            playsInline
            onEnded={() => setShowVideo2(false)}
            className="absolute ml-[220px] -mt-[348px] transition-opacity duration-1000 ease-out"
            style={{
              width: '76%',
              height: 'auto',
              maxWidth: '860px',
              opacity: showVideo2 ? 1 : 0
            }}
          />
        </div>
        {/* Text Right */}
        <div className={`flex-1 pl-16 pr-24 -mt-[100px] -ml-[60px] flex flex-col items-start text-left ${getAnimStyle('delay-[3000ms]', 'slideUp')}`}>
          <h2 style={titleStyle}>Center Display</h2>
          <p style={descStyle}>
            With advanced map and app customization tailored to regional requirements, our Center Display supports diverse market needs and offers localized themed UI experiences, such as World Cup editions, to deliver an intuitive and region-optimized in-vehicle interface worldwide.
          </p>
        </div>
      </div>

    </div>
  );
};

export default QualityScreen;
