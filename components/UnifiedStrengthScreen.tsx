import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../types';
import { getAssetUrl } from '../utils';
import { getSlideDuration } from '../config';

interface UnifiedStrengthScreenProps {
  setPage: (page: Page) => void;
  registerNextAction: (handler: (() => void) | null) => void;
  registerPrevAction: (handler: (() => void) | null) => void;
  setAutoRollDelay: (delay: number) => void;
}

const SLIDE_STORAGE_KEY = 'whymotrex-unified-slide';

const UnifiedStrengthScreen: React.FC<UnifiedStrengthScreenProps> = ({ setPage, registerNextAction, registerPrevAction, setAutoRollDelay }) => {
  // Initialize slide from localStorage
  const [currentSlide, setCurrentSlide] = useState(() => {
    const saved = localStorage.getItem(SLIDE_STORAGE_KEY);
    if (saved) {
      const num = parseInt(saved, 10);
      if (!isNaN(num) && num >= 0 && num < 5) {
        return num;
      }
    }
    return 0;
  });

  // For fade transition when going from last slide to first
  const [isFading, setIsFading] = useState(false);

  // Keep ref to current slide for use in handlers
  const currentSlideRef = useRef(currentSlide);
  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  // Save slide to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(SLIDE_STORAGE_KEY, currentSlide.toString());
  }, [currentSlide]);

  // Update auto roll delay
  useEffect(() => {
    setAutoRollDelay(getSlideDuration(Page.UnifiedStrength, currentSlide));
  }, [currentSlide, setAutoRollDelay]);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const goToFirstSlide = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentSlide(0);
      setTimeout(() => setIsFading(false), 50);
    }, 500);
  };

  // Slide navigation functions (kept for potential button use)
  const nextSlide = () => {
    if (currentSlide >= 4) {
      // Last slide - fade transition to first slide
      goToFirstSlide();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  // Register next action handler
  useEffect(() => {
    const handleNext = () => {
      if (currentSlideRef.current >= 4) {
        // Last slide - fade transition to first slide
        goToFirstSlide();
      } else {
        setCurrentSlide((prev) => prev + 1);
      }
    };
    registerNextAction(handleNext);
    return () => registerNextAction(null);
  }, [registerNextAction]);

  // Register prev action handler
  useEffect(() => {
    const handlePrev = () => {
      if (currentSlideRef.current > 0) {
        setCurrentSlide((prev) => prev - 1);
      }
    };
    registerPrevAction(handlePrev);
    return () => registerPrevAction(null);
  }, [registerPrevAction]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (currentSlide === 4) {
      video.currentTime = 0;
      void video.play();
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [currentSlide]);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: '1920px',
        height: '1080px',
        backgroundColor: '#F5F9FF',
        fontFamily: "'42dot Sans', sans-serif",
      }}
    >
      {/* Navigation Controls (Floating Bottom Right) - HIDDEN */}
      {/* <div className="absolute bottom-12 right-16 flex gap-6 z-50">
        <button
          onClick={prevSlide}
          className="w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-gray-50 hover:scale-105 transition-all duration-600 border border-gray-100 opacity-80 hover:opacity-100"
          aria-label="Previous Slide"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button
          onClick={nextSlide}
          className="w-14 h-14 rounded-full bg-blue-600 shadow-xl flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all duration-600 border border-blue-500 opacity-80 hover:opacity-100"
          aria-label="Next Slide"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div> */}

      {/* Pagination Indicators - HIDDEN */}
      {/* <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4 z-50">
        {[0, 1, 2, 3].map((idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-500 ease-out ${currentSlide === idx ? 'w-12 bg-blue-600' : 'w-3 bg-gray-600 hover:bg-gray-400'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div> */}

      {/* Home Button (Top Right) */}
      <div className="absolute z-50" style={{ top: '30px', right: '30px' }}>
        <button
          onClick={() => setPage(Page.Home)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-md hover:shadow-lg transition-all opacity-80 hover:opacity-100 group"
          aria-label="Go to Home"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
      </div>

      {/* Slides Viewport with fade transition */}
      <div
        className={`flex h-full transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
        style={{
          transform: `translateX(-${currentSlide * 1920}px)`,
          transition: isFading ? 'opacity 0.5s ease-in-out' : 'transform 0.7s cubic-bezier(0.25,0.1,0.25,1.0), opacity 0.5s ease-in-out'
        }}
      >
        <Slide0_Intro />
        <Slide1_Affiliates isActive={currentSlide === 1} />
        <Slide2_Group />
        <Slide3_Product isActive={currentSlide === 3} />
        <Slide4_Video videoRef={videoRef} onEnded={goToFirstSlide} />
      </div>
    </div>
  );
};

// --- Slide 0: Intro ---
const Slide0_Intro = () => {
  return (
    <div className="relative w-[1920px] h-full flex-shrink-0 flex items-center overflow-hidden bg-black">
      {/* 1. Base Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${getAssetUrl('/images/bg-3-1.png')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* 2. Animated Mesh Background */}
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

      {/* 3. Subtle Gradient Overlay */}
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
            fontFamily: '"42dot Sans"',
            fontSize: '40px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 'normal',
            letterSpacing: '-1.2px',
            marginBottom: '16px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          We Innovate the In-Cabin
        </p>
        <h1
          style={{
            color: '#FFF',
            fontFamily: '"42dot Sans"',
            fontSize: '92px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '110%',
            letterSpacing: '-1.84px',
            textShadow: '0 4px 10px rgba(0,0,0,0.3)',
          }}
        >
          Integrated Solution <br />for Future Mobility
        </h1>
      </div>
    </div>
  );
};

// --- Slide 1: MOTREX Affiliates ---
interface Slide1_AffiliatesProps {
  isActive: boolean;
}

const Slide1_Affiliates: React.FC<Slide1_AffiliatesProps> = ({ isActive }) => {
  // Animation variants
  // Separated wrapper style for smoother entrance
  const getWrapperStyle = (delayMs: number, direction: 'left' | 'right') => ({
    transitionProperty: 'opacity, transform',
    transitionDuration: '1200ms',
    transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    transitionDelay: `${delayMs}ms`,
    opacity: isActive ? 1 : 0,
    transform: isActive ? 'translateX(0)' : `translateX(${direction === 'left' ? '-100px' : '100px'})`,
  });



  return (
    <div
      className="relative w-[1920px] h-full flex-shrink-0"
      style={{
        backgroundImage: `url(${getAssetUrl('/images/bg-Connected2.png')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Header Title */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center z-20"
        style={{ top: '56px' }}
      >
        <h1
          className="text-center mb-6"
          style={{
            color: '#000000',
            fontSize: '64px',
            fontWeight: 700,
            letterSpacing: '-1px',
            fontFamily: '"42dot Sans", sans-serif',
          }}
        >
          MOTREX Affiliates
        </h1>
        <p
          className="text-center"
          style={{
            color: '#6B7280',
            fontSize: '28px',
            fontWeight: 400,
            maxWidth: '1200px',
            lineHeight: '1.6',
            marginTop: '-10px',
            fontFamily: '"42dot Sans", sans-serif',
          }}
        >
          MOTREX advances mobility value through the synergy of our automotive affiliates.
        </p>
      </div>

      {/* Hexagon Ripple Animation - Center */}
      <style>{`
        @keyframes hex-ripple {
          0% { 
            transform: translate3d(-50%, -50%, 0) scale(0.5);
            opacity: 0.8;
          }
          100% { 
            transform: translate3d(-50%, -50%, 0) scale(3.5);
            opacity: 0;
          }
        }
        .animate-hex-ripple {
          animation: hex-ripple 4s ease-out infinite;
          position: absolute;
          top: 50%;
          left: 50%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          will-change: transform, opacity;
          outline: 1px solid transparent;
          opacity: 0;
          transform: translate3d(-50%, -50%, 0) scale(0.5);
        }
      `}</style>
      <div className="absolute top-[600px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] flex items-center justify-center pointer-events-none z-0">
        <img src={getAssetUrl('/images/hex_centered.svg')} alt="" className={`w-[900px] ${isActive ? 'animate-hex-ripple' : 'opacity-0'}`} style={{ animationDelay: '5000ms' }} />
        <img src={getAssetUrl('/images/hex_centered.svg')} alt="" className={`w-[900px] ${isActive ? 'animate-hex-ripple' : 'opacity-0'}`} style={{ animationDelay: '6600ms' }} />
        <img src={getAssetUrl('/images/hex_centered.svg')} alt="" className={`w-[900px] ${isActive ? 'animate-hex-ripple' : 'opacity-0'}`} style={{ animationDelay: '8200ms' }} />
      </div>

      {/* Center Logo */}
      <div className="absolute top-[600px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-[242px]">
        <img src={getAssetUrl('/images/motrex-logo-blue.svg')} alt="Motrex Logo" className="w-full drop-shadow-lg" />
      </div>

      {/* Card 1 */}
      <div className="absolute top-[325px] left-[80px]" style={getWrapperStyle(500, 'left')}>
        <img src={getAssetUrl('/images/aff1.svg')} alt="Affiliate 1" className="w-[871px] h-[301px] hover:scale-105 transition-transform duration-600 drop-shadow-xl" />
      </div>

      {/* Card 2 */}
      <div className="absolute top-[325px] left-[969px]" style={getWrapperStyle(1500, 'right')}>
        <img src={getAssetUrl('/images/aff2.svg')} alt="Affiliate 2" className="w-[871px] h-[301px] hover:scale-105 transition-transform duration-600 drop-shadow-xl" />
      </div>

      {/* Card 3 */}
      <div className="absolute bottom-[150px] left-[80px]" style={getWrapperStyle(2500, 'left')}>
        <img src={getAssetUrl('/images/aff3.svg')} alt="Affiliate 3" className="w-[871px] h-[301px] hover:scale-105 transition-transform duration-600 drop-shadow-xl" />
      </div>

      {/* Card 4 */}
      <div className="absolute bottom-[150px] left-[969px]" style={getWrapperStyle(3500, 'right')}>
        <img src={getAssetUrl('/images/aff4.svg')} alt="Affiliate 4" className="w-[871px] h-[301px] hover:scale-105 transition-transform duration-600 drop-shadow-xl" />
      </div>

    </div>
  );
};

// --- Slide 2: Group ---
const Slide2_Group = () => {
  // 육각형 데이터: 좌측 열 (DMS, SVM, Air Purifier), 우측 열 (e-Mirror, In-Cabin Health, Smart Carpet)
  const hexagonData = [
    { text: 'DMS', x: 188, y: 224, delay: 0 },           // 좌측 1행
    { text: 'e-Mirror', x: 1450, y: 224, delay: 120 },   // 우측 1행
    { text: 'SVM', x: 73, y: 446, delay: 240 },          // 좌측 2행
    { text: 'In-Cabin Health', x: 1555, y: 446, delay: 360 }, // 우측 2행
    { text: 'Air Purifier', x: 188, y: 672, delay: 480 }, // 좌측 3행
    { text: 'Smart Carpet', x: 1450, y: 672, delay: 600 }, // 우측 3행
  ];

  // Hexagon component
  const Hexagon = ({ text, x, y, delay }: { text: string; x: number; y: number; delay: number }) => (
    <div
      className="absolute flex items-center justify-center opacity-0"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: '280px',
        height: '300px',
        animation: 'hex-fade-in 800ms ease-out forwards',
        animationDelay: `${delay}ms`,
      }}
    >
      <img
        src={getAssetUrl('/images/star.svg')}
        alt=""
        style={{ width: '280px', height: '300px' }}
      />
      <span
        className="absolute text-center"
        style={{
          color: '#005FF9',
          fontFamily: '"42dot Sans"',
          fontSize: '32px',
          fontWeight: 800,
          lineHeight: 'normal',
          maxWidth: '200px',
          top: '47%',
          left: '48%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {text}
      </span>
    </div>
  );

  return (
    <div
      className="relative w-[1920px] h-full flex-shrink-0"
      style={{
        backgroundImage: `url(${getAssetUrl('/images/bg-3-3.png')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Title */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ top: '56px' }}
      >
        <h1
          className="text-center"
          style={{
            color: '#000',
            fontFamily: '"42dot Sans"',
            fontSize: '48px',
            fontStyle: 'normal',
            fontWeight: 800,
            lineHeight: '120%',
            letterSpacing: '-0.96px',
          }}
        >
          Total In-Cabin Solution Partner, Motrex group
        </h1>
      </div>

      {/* Hexagon appearance animation */}
      <style>{`
        @keyframes hex-fade-in {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      {/* Hexagons Container */}
      <div className="absolute inset-0">
        {hexagonData.map((item, index) => (
          <Hexagon key={index} text={item.text} x={item.x} y={item.y} delay={item.delay} />
        ))}
        {/* Air Purifier connector line */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
        >
          <polyline
            points="323,930 323,1005 832,1005"
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="1597,930 1597,1005 1088,1005"
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="834" cy="1004" r="7.5" fill="#ffffff" />
          <circle cx="1087" cy="1003" r="7.5" fill="#ffffff" />
        </svg>
      </div>
    </div>
  );
};

// --- Slide 3: Product Placeholder (Copy of Innovation Slide 3 structure) ---
interface Slide3_ProductProps {
  isActive: boolean;
}

const Slide3_Product: React.FC<Slide3_ProductProps> = ({ isActive }) => {
  const getAnimStyle = (delay: string, type: 'fade' | 'slideLeft' | 'slideRight' | 'slideUp') => {
    const baseStyle = "transition-all duration-1000 ease-out";
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

  const labelStyle = {
    color: '#2D2D30',
    fontFamily: '"42dot Sans"',
    fontSize: '28px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '120%',
    letterSpacing: '-0.56px',
    opacity: 0.4,
  };

  return (
    <div className="relative w-[1920px] h-full flex-shrink-0 bg-[#F5F9FF] flex flex-col font-['42dot_Sans']">


      {/* Row 1 */}
      <div className="flex-1 flex items-center w-full">
        <div className={`flex-shrink-0 ${getAnimStyle('delay-[300ms]', 'slideLeft')}`}>
          <img src={getAssetUrl('/images/product4.png')} alt="Product 4" className="block h-[600px] w-auto mt-[50px]" />
        </div>
        <div className={`flex-1 pl-20 pr-24 -mt-[50px] flex flex-col items-start text-left ${getAnimStyle('delay-[500ms]', 'slideUp')}`}>
          <h2 style={titleStyle}>AC Home Charger</h2>
          <p style={descStyle}>
            <strong>Up to 22 kW AC</strong> for home/light commercial installs with 110/220V input.<br />
            <strong>Type 1/Type 2/NACS</strong> plus <strong>app/cloud control</strong> with load balancing and OTA updates.<br />
            <strong>IP54 protection</strong> and <strong>CE/ARAI certifications</strong> for real-world use.
          </p>
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex-1 flex items-center w-full justify-end">
        <div className={`flex-1 pl-2 pr-24 max-w-[980px] flex flex-col items-end text-right ${getAnimStyle('delay-[700ms]', 'slideUp')}`}>
          <h2 style={titleStyle}>Portable Charger</h2>
          <p style={descStyle}>
            <strong>Up to 3.5 kW</strong> with a wide <strong>183-277 Vac</strong> input range.<br />
            <strong>Type 1/Type 2/NACS</strong>, <strong>5 m cable</strong>, and <strong>3-step current</strong> selection.<br />
            <strong>Temperature sensor</strong>, auto derating, and <strong>IEC 62752</strong> compliance.
          </p>
        </div>
        <div className={`flex-shrink-0 -mt-[30px] ${getAnimStyle('delay-[900ms]', 'slideRight')}`}>
          <img src={getAssetUrl('/images/product5.png')} alt="Product 5" className="block h-[500px] w-auto" />
        </div>
      </div>
    </div>
  );
};

// --- Slide 4: JUNJIN Solution Video ---
interface Slide4_VideoProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onEnded: () => void;
}

const Slide4_Video: React.FC<Slide4_VideoProps> = ({ videoRef, onEnded }) => {
  return (
    <div className="relative w-[1920px] h-full flex-shrink-0 bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={getAssetUrl('/video/JUNJIN-solution.mp4')}
        onEnded={onEnded}
        muted
        playsInline
      />
    </div>
  );
};

export default UnifiedStrengthScreen;
