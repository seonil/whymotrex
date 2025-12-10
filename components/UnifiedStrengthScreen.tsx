import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../types';

interface UnifiedStrengthScreenProps {
  setPage: (page: Page) => void;
  registerNextAction: (handler: (() => void) | null) => void;
  registerPrevAction: (handler: (() => void) | null) => void;
}

const SLIDE_STORAGE_KEY = 'whymotrex-unified-slide';

const UnifiedStrengthScreen: React.FC<UnifiedStrengthScreenProps> = ({ setPage, registerNextAction, registerPrevAction }) => {
  // Initialize slide from localStorage
  const [currentSlide, setCurrentSlide] = useState(() => {
    const saved = localStorage.getItem(SLIDE_STORAGE_KEY);
    if (saved) {
      const num = parseInt(saved, 10);
      if (!isNaN(num) && num >= 0 && num < 4) {
        return num;
      }
    }
    return 0;
  });

  // Keep ref to current slide for use in handlers
  const currentSlideRef = useRef(currentSlide);
  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  // Save slide to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(SLIDE_STORAGE_KEY, currentSlide.toString());
  }, [currentSlide]);

  // Slide navigation functions
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % 4);
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  // Register next action handler
  useEffect(() => {
    registerNextAction(() => setCurrentSlide((prev) => (prev + 1) % 4));
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

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: '1920px',
        height: '1080px',
        backgroundColor: '#F5F9FF',
        fontFamily: "'Albert Sans', sans-serif",
      }}
    >
      {/* Navigation Controls (Floating Bottom Right) */}
      <div className="absolute bottom-12 right-16 flex gap-6 z-50">
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
      </div>

      {/* Pagination Indicators */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4 z-50">
        {[0, 1, 2, 3].map((idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-500 ease-out ${currentSlide === idx ? 'w-12 bg-blue-600' : 'w-3 bg-gray-600 hover:bg-gray-400'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Header (Back to Home) */}
      <div className="absolute top-0 left-0 p-10 z-50">
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

      {/* Slides Viewport */}
      <div
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] h-full"
        style={{ transform: `translateX(-${currentSlide * 1920}px)` }}
      >
        <Slide0_Intro />
        <Slide1_Affiliates isActive={currentSlide === 1} />
        <Slide2_Group />
        <Slide3_Placeholder />
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
          backgroundImage: 'url(/images/bg-3-1.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* 2. Animated Mesh Background */}
      <div className="absolute inset-0 z-1 flex opacity-60 mix-blend-color-dodge">
        <div className="flex w-[200%] h-full animate-mesh-slide">
          <img
            src="/images/mesh.svg"
            alt=""
            className="w-1/2 h-full object-cover"
          />
          <img
            src="/images/mesh.svg"
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
          We Innovate the In-Cabin
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
          Unified Strength <br />for Future Mobility
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
        backgroundImage: 'url(/images/bg-Connected2.png)',
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
            fontFamily: '"Albert Sans", sans-serif',
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
            fontFamily: '"Albert Sans", sans-serif',
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
        <img src="/images/hex_centered.svg" alt="" className={`w-[900px] ${isActive ? 'animate-hex-ripple' : 'opacity-0'}`} style={{ animationDelay: '5000ms' }} />
        <img src="/images/hex_centered.svg" alt="" className={`w-[900px] ${isActive ? 'animate-hex-ripple' : 'opacity-0'}`} style={{ animationDelay: '6600ms' }} />
        <img src="/images/hex_centered.svg" alt="" className={`w-[900px] ${isActive ? 'animate-hex-ripple' : 'opacity-0'}`} style={{ animationDelay: '8200ms' }} />
      </div>

      {/* Center Logo */}
      <div className="absolute top-[600px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-[242px]">
        <img src="/images/motrex-logo-blue.svg" alt="Motrex Logo" className="w-full drop-shadow-lg" />
      </div>

      {/* Card 1 */}
      <div className="absolute top-[325px] left-[80px]" style={getWrapperStyle(500, 'left')}>
        <img src="/images/aff1.svg" alt="Affiliate 1" className="w-[871px] h-[301px] hover:scale-105 transition-transform duration-600 drop-shadow-xl" />
      </div>

      {/* Card 2 */}
      <div className="absolute top-[325px] left-[969px]" style={getWrapperStyle(1500, 'right')}>
        <img src="/images/aff2.svg" alt="Affiliate 2" className="w-[871px] h-[301px] hover:scale-105 transition-transform duration-600 drop-shadow-xl" />
      </div>

      {/* Card 3 */}
      <div className="absolute bottom-[150px] left-[80px]" style={getWrapperStyle(2500, 'left')}>
        <img src="/images/aff3.svg" alt="Affiliate 3" className="w-[871px] h-[301px] hover:scale-105 transition-transform duration-600 drop-shadow-xl" />
      </div>

      {/* Card 4 */}
      <div className="absolute bottom-[150px] left-[969px]" style={getWrapperStyle(3500, 'right')}>
        <img src="/images/aff4.svg" alt="Affiliate 4" className="w-[871px] h-[301px] hover:scale-105 transition-transform duration-600 drop-shadow-xl" />
      </div>

    </div>
  );
};

// --- Slide 2: Group ---
const Slide2_Group = () => {
  return (
    <div
      className="relative w-[1920px] h-full flex-shrink-0"
      style={{
        backgroundColor: '#F5F9FF',
      }}
    >
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ top: '56px' }}
      >
        <h1
          className="text-center mb-6"
          style={{
            color: '#000000',
            fontSize: '64px',
            fontWeight: 700,
            letterSpacing: '-1px',
          }}
        >
          Total In-Cabin Solution Partner, Motrex group
        </h1>
        {/* No subtitle provided for this slide, keeping structure if needed */}
      </div>
    </div>
  );
};

// --- Slide 3: Placeholder ---
const Slide3_Placeholder = () => {
  return (
    <div
      className="relative w-[1920px] h-full flex-shrink-0"
      style={{
        backgroundColor: '#F5F9FF',
      }}
    >
    </div>
  );
};

export default UnifiedStrengthScreen;
