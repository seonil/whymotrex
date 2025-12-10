import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../types';
import { getAssetUrl } from '../utils';

interface InnovationScreenProps {
  setPage: (page: Page) => void;
  registerNextAction: (handler: (() => void) | null) => void;
  registerPrevAction: (handler: (() => void) | null) => void;
}

const SLIDE_STORAGE_KEY = 'whymotrex-innovation-slide';

const InnovationScreen: React.FC<InnovationScreenProps> = ({ setPage, registerNextAction, registerPrevAction }) => {
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
  const nextSlide = () => {
    if (currentSlide >= 3) {
      setPage(Page.Home);
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
      if (currentSlideRef.current >= 3) {
        // Last slide - go to home
        setPage(Page.Home);
      } else {
        setCurrentSlide((prev) => prev + 1);
      }
    };
    registerNextAction(handleNext);
    return () => registerNextAction(null);
  }, [registerNextAction, setPage]);

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
        backgroundColor: '#F5F7FA',
        fontFamily: "'Albert Sans', sans-serif",
      }}
    >
      {/* Navigation Controls (Floating Bottom Right) */}
      <div className="absolute bottom-12 right-16 flex gap-6 z-50">
        <button
          onClick={prevSlide}
          className="w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-gray-50 hover:scale-105 transition-all duration-300 border border-gray-100 opacity-80 hover:opacity-100"
          aria-label="Previous Slide"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button
          onClick={nextSlide}
          className="w-14 h-14 rounded-full bg-blue-600 shadow-xl flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all duration-300 border border-blue-500 opacity-80 hover:opacity-100"
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
            className={`h-2 rounded-full transition-all duration-500 ease-out ${currentSlide === idx ? 'w-12 bg-blue-600' : 'w-3 bg-gray-300 hover:bg-gray-400'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Header (Back Button) */}
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
        <Slide1_RnD isActive={currentSlide === 1} />
        <Slide2_CoreTech isActive={currentSlide === 2} />
        <Slide3_HMI isActive={currentSlide === 3} />
      </div>
    </div>
  );
};

// --- Slide 0: Intro ---
const Slide0_Intro = () => {
  return (
    <div className="relative w-[1920px] h-full flex-shrink-0 flex items-center overflow-hidden bg-black">
      {/* 1. Base Background Image (Fixed) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${getAssetUrl('/images/bg-1-1.png')})`,
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
          We Innovate the Process
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
          Innovation Driven <br />by Technology Leadership
        </h1>
      </div>
    </div>
  );
};

// --- Slide 1: MOTREX R&D ---
interface Slide1_RnDProps {
  isActive: boolean;
}

const Slide1_RnD: React.FC<Slide1_RnDProps> = ({ isActive }) => {
  // Wrapper style for entrance animation
  const getWrapperStyle = (delayMs: number) => {
    return {
      transitionProperty: 'opacity, transform',
      transitionDuration: '1500ms',
      transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      transitionDelay: `${delayMs}ms`,
      opacity: isActive ? 1 : 0,
      transform: isActive ? 'translateY(0)' : 'translateY(40px)',
    };
  };

  return (
    <div
      className="relative w-[1920px] h-full flex-shrink-0 box-border overflow-hidden"
      style={{
        backgroundImage: `url(${getAssetUrl('/images/bg-Connected.png')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      {/* Road SVG Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none translate-x-[100px] translate-y-[50px]">
        <style>{`
          @keyframes draw-road {
            from { stroke-dashoffset: 6000; }
            to { stroke-dashoffset: 0; }
          }
          .animate-road {
            stroke-dasharray: 6000;
            stroke-dashoffset: 6000;
            animation: draw-road 4.5s ease-in-out forwards;
          }
        `}</style>
        <svg className="overflow-visible" width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="paint0_linear_road" x1="738.056" y1="-53.1047" x2="1091.65" y2="1026.43" gradientUnits="userSpaceOnUse">
              <stop stopColor="#035EF5" />
              <stop offset="0.505" stopColor="#035EF5" />
              <stop offset="1" stopColor="#88CAFF" />
            </linearGradient>
            <mask id="road-dashed-mask">
              <path
                d="M-550 50L90.9977 368.16C121.686 383.705 196.49 410.397 250.2 392.805C317.337 370.814 354.291 318.496 371.26 293.517C398.63 253.229 476.731 182.649 577.515 237.298C690.86 298.758 674.055 436.015 613.417 504.917C527.824 602.174 479.657 764.549 642.966 849.118C806.274 933.688 907.84 804.696 932.721 653.684C946.25 571.569 976.835 437.372 1033.49 369.042C1058.17 339.278 1100.81 295.037 1196.98 324.117C1293.14 353.197 1307.7 467.561 1264.46 563.815C1240.37 617.454 1193.25 723.188 1325.88 791.226C1421.12 840.087 1516.13 750.608 1541.79 674.758C1577.03 570.575 1692.18 543.689 1776.88 596.847C1863.31 651.089 1949.24 710.922 1982.06 738.347"
                stroke="white"
                strokeWidth="30"
                strokeLinejoin="round"
                fill="none"
                className={isActive ? 'animate-road' : ''}
                style={{ animationDelay: '0.2s' }}
              />
            </mask>
          </defs>
          <g opacity="0.8">
            {/* Thick Gradient Path */}
            <path
              d="M-145.809 236.397L90.9977 368.16C121.686 383.705 196.49 410.397 250.2 392.805C317.337 370.814 354.291 318.496 371.26 293.517C398.63 253.229 476.731 182.649 577.515 237.298C690.86 298.758 674.055 436.015 613.417 504.917C527.824 602.174 479.657 764.549 642.966 849.118C806.274 933.688 907.84 804.696 932.721 653.684C946.25 571.569 976.835 437.372 1033.49 369.042C1058.17 339.278 1100.81 295.037 1196.98 324.117C1293.14 353.197 1307.7 467.561 1264.46 563.815C1240.37 617.454 1193.25 723.188 1325.88 791.226C1421.12 840.087 1516.13 750.608 1541.79 674.758C1577.03 570.575 1692.18 543.689 1776.88 596.847C1863.31 651.089 1949.24 710.922 1982.06 738.347"
              stroke="url(#paint0_linear_road)"
              strokeWidth="60"
              strokeLinejoin="round"
              className={isActive ? 'animate-road' : ''}
              style={{ animationDelay: '0.2s' }}
            />
            {/* White Dashed Path */}
            <path
              d="M-145.809 236.397L90.9977 368.16C121.686 383.705 196.49 410.397 250.2 392.805C317.337 370.814 354.291 318.496 371.26 293.517C398.63 253.229 476.731 182.649 577.515 237.298C690.86 298.758 674.055 436.015 613.417 504.917C527.824 602.174 479.657 764.549 642.966 849.118C806.274 933.688 907.84 804.696 932.72 653.684C946.25 571.569 976.835 437.372 1033.49 369.042C1058.17 339.278 1100.81 295.037 1196.98 324.117C1293.14 353.197 1307.7 467.561 1264.46 563.815C1240.37 617.454 1193.25 723.188 1325.88 791.226C1421.12 840.087 1516.13 750.608 1541.79 674.758C1577.03 570.575 1692.18 543.689 1776.88 596.847C1863.31 651.089 1949.24 710.922 1982.06 738.347"
              stroke="white"
              strokeWidth="8"
              strokeLinejoin="round"
              strokeDasharray="20 20"
              mask="url(#road-dashed-mask)"
            />
          </g>
        </svg>
      </div>

      {/* Header Title */}
      <div className="absolute top-[80px] left-[80px] z-20 flex items-start gap-12 w-[1760px]">
        <h1
          className="whitespace-nowrap"
          style={{
            color: '#000',
            fontFamily: '"42dot Sans", sans-serif',
            fontSize: '48px',
            fontStyle: 'normal',
            fontWeight: 800,
            lineHeight: '120%',
            letterSpacing: '-0.96px',
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'all 1s ease-out 0.2s',
          }}
        >
          MOTREX R&D
        </h1>
        <p
          style={{
            color: '#B3B1B9',
            fontFamily: '"42dot Sans", sans-serif',
            fontSize: '40px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: '120%',
            letterSpacing: '-0.8px',
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'all 1s ease-out 0.4s',
          }}
        >
          MOTREX has strengthened its R&D capability through advanced engineering, <br />
          agile processes, and OEM-grade quality assurance.
        </p>
      </div>

      {/* Roadmap Visualization */}
      <div className="relative w-full h-[550px] mt-8" style={{ perspective: '1000px' }}>

        {/* Column 1 */}
        <div className="absolute top-[394px] left-[70px] w-[565px] flex flex-col gap-3">
          {/* Card 01 - Top */}
          <div style={getWrapperStyle(900)}>
            <button className="relative overflow-visible bg-white/90 p-8 rounded-3xl shadow-xl border border-gray-100/50 hover:scale-105 transition-transform duration-300 text-left w-full group">
              <div className="absolute -top-[120px] left-8 w-[100px] h-[100px] flex flex-col justify-center items-center gap-[10px] bg-white rounded-full shadow-lg z-10" style={{ padding: '17px 15px' }}>
                <span style={{
                  color: '#1C6DF3',
                  textAlign: 'center',
                  fontFamily: '"Nanum Gothic"',
                  fontSize: '40px',
                  fontWeight: 700,
                  lineHeight: '26px'
                }}>01</span>
              </div>
              <h3 className="mb-4" style={{ color: '#005FF9', fontFamily: '"42dot Sans"', fontSize: '32px', fontWeight: 800, lineHeight: 'normal' }}>
                In-house technology<br />& development
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                  <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                    HMI, display controller, AI, connectivity solutions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                  <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                    End-to-end integration across AVN & Cluster
                  </span>
                </li>
              </ul>
            </button>
          </div>

          {/* Card 01 - Bottom */}
          <div style={getWrapperStyle(1200)}>
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border border-gray-100/50 hover:scale-105 transition-transform duration-300">
              <div className="mb-6">
                <h4 className="mb-3" style={{ color: '#005FF9', fontFamily: '"42dot Sans"', fontSize: '32px', fontWeight: 800, lineHeight: 'normal' }}>
                  Internal high-reliability technology
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                    <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                      HMI, display controller, AI, connectivity solutions
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                    <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                      End-to-end integration across AVN & Cluster
                    </span>
                  </li>
                </ul>
              </div>
              <div className="h-px bg-gray-200 my-6"></div>
              <div>
                <h4 className="mb-3" style={{ color: '#005FF9', fontFamily: '"42dot Sans"', fontSize: '32px', fontWeight: 800, lineHeight: 'normal' }}>
                  Agile development process
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                    <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                      Customer oriented design
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                    <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                      Flexible development process
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="absolute top-[358px] left-[677px] w-[565px] flex flex-col gap-3">
          {/* Card 02 - Top */}
          <div style={getWrapperStyle(1800)}>
            <button className="relative overflow-visible bg-white/90 p-8 rounded-3xl shadow-xl border border-gray-100/50 hover:scale-105 transition-transform duration-300 text-left w-full group">
              <div className="absolute -top-[120px] left-8 w-[100px] h-[100px] flex flex-col justify-center items-center gap-[10px] bg-white rounded-full shadow-lg z-10" style={{ padding: '17px 15px' }}>
                <span style={{
                  color: '#1C6DF3',
                  textAlign: 'center',
                  fontFamily: '"Nanum Gothic"',
                  fontSize: '40px',
                  fontWeight: 700,
                  lineHeight: '26px'
                }}>02</span>
              </div>
              <h3 className="mb-4" style={{ color: '#005FF9', fontFamily: '"42dot Sans"', fontSize: '32px', fontWeight: 800, lineHeight: 'normal' }}>
                Platform development<br />based on requirements
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                  <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                    HW/SW optimization development based on customer specifications
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                  <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                    Multi-display synchronization and UI/UX expertise
                  </span>
                </li>
              </ul>
            </button>
          </div>

          {/* Card 02 - Bottom */}
          <div style={getWrapperStyle(2100)}>
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border border-gray-100/50 hover:scale-105 transition-transform duration-300">
              <div className="mb-6">
                <h4 className="mb-3" style={{ color: '#005FF9', fontFamily: '"42dot Sans"', fontSize: '32px', fontWeight: 800, lineHeight: 'normal' }}>
                  Expertise in OS/AP/MCU
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                    <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                      Telechips / Qualcomm / Mediatek AP Development
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                    <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                      Experience with Linux / Android / QNX OS
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                    <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                      FPGA, MCU, and AP (1 to 8 ARM cores)
                    </span>
                  </li>
                </ul>
              </div>
              <div className="h-px bg-gray-200 my-6"></div>
              <div>
                <h4 className="mb-3" style={{ color: '#005FF9', fontFamily: '"42dot Sans"', fontSize: '32px', fontWeight: 800, lineHeight: 'normal' }}>
                  Comprehensive display solution
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                    <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                      Various display sizes and resolutions 6"~12.8
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                    <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                      Multiple Touch / Haptic / Knob on Display
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                    <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                      Own GUI engine solution - TIACORE
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="absolute top-[418px] left-[1274px] w-[565px] flex flex-col gap-3">
          {/* Card 03 - Top */}
          <div style={getWrapperStyle(2700)}>
            <button className="relative overflow-visible bg-white/90 p-8 rounded-3xl shadow-xl border border-gray-100/50 hover:scale-105 transition-transform duration-300 text-left w-full group">
              <div className="absolute -top-[120px] left-8 w-[100px] h-[100px] flex flex-col justify-center items-center gap-[10px] bg-white rounded-full shadow-lg z-10" style={{ padding: '17px 15px' }}>
                <span style={{
                  color: '#1C6DF3',
                  textAlign: 'center',
                  fontFamily: '"Nanum Gothic"',
                  fontSize: '40px',
                  fontWeight: 700,
                  lineHeight: '26px'
                }}>03</span>
              </div>
              <h3 className="mb-4" style={{ color: '#005FF9', fontFamily: '"42dot Sans"', fontSize: '32px', fontWeight: 800, lineHeight: 'normal' }}>
                Global standards &<br />R&D investment
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                  <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                    Global development system for security
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                  <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                    Internalizing new techs through R&D investment
                  </span>
                </li>
              </ul>
            </button>
          </div>

          {/* Card 03 - Bottom */}
          <div style={getWrapperStyle(3000)}>
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border border-gray-100/50 hover:scale-105 transition-transform duration-300">
              <div className="mb-6">
                <h4 className="mb-3" style={{ color: '#005FF9', fontFamily: '"42dot Sans"', fontSize: '32px', fontWeight: 800, lineHeight: 'normal' }}>
                  Global standard
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                    <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                      A-SPICE, AUTOSAR, Cyber Security
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                    <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                      Compliant with various OEM quality standards
                    </span>
                  </li>
                </ul>
              </div>
              <div className="h-px bg-gray-200 my-6"></div>
              <div>
                <h4 className="mb-3" style={{ color: '#005FF9', fontFamily: '"42dot Sans"', fontSize: '32px', fontWeight: 800, lineHeight: 'normal' }}>
                  Active R&D investment
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                    <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                      Investing 10% of annual revenue
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                    <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                      Investing in camera-based ADAS
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5" />
                    <span style={{ color: '#000', fontFamily: '"42dot Sans"', fontSize: '20px', fontWeight: 500, lineHeight: 'normal' }}>
                      Next tech (AI) / Advanced standards (A-SPICE)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Slide 2: Core Technology ---
interface Slide2_CoreTechProps {
  isActive: boolean;
}

const Slide2_CoreTech: React.FC<Slide2_CoreTechProps> = ({ isActive }) => {
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

  const cardInnerClass = "w-[686px] h-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-100 hover:scale-105 transition-transform duration-300 ease-out box-border";

  const titleStyle = {
    color: '#005FF9',
    fontFamily: '"42dot Sans"',
    fontSize: '32px',
    fontWeight: 800,
    lineHeight: 'normal',
    marginBottom: '16px',
  };

  const itemStyle = {
    color: '#000',
    fontFamily: '"42dot Sans"',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '1.4',
  };

  const listStyle = "space-y-3";
  const bulletStyle = "w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2.5";

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
      <div className="absolute top-[80px] left-[80px] z-20 flex items-start gap-12 w-[1760px]">
        <h1
          className="whitespace-nowrap"
          style={{
            color: '#000',
            fontFamily: '"42dot Sans", sans-serif',
            fontSize: '48px',
            fontStyle: 'normal',
            fontWeight: 800,
            lineHeight: '120%',
            letterSpacing: '-0.96px',
          }}
        >
          Core Technology
        </h1>
        <p
          style={{
            color: '#B3B1B9',
            fontFamily: '"42dot Sans", sans-serif',
            fontSize: '40px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: '120%',
            letterSpacing: '-0.8px',
          }}
        >
          MOTREX has successfully combined advanced software engineering, <br />
          multi-display UI/UX, and hardware design into a robust technology foundation.
        </p>
      </div>

      {/* Hexagon Ripple Animation - Center */}
      <style>{`
        @keyframes hex-ripple {
          0% {
            transform: scale(0.5);
            opacity: 0.6;
          }
          100% {
            transform: scale(3.5);
            opacity: 0;
          }
        }
        .hex-ripple-container {
          position: absolute;
          top: 600px;
          left: 50%;
          width: 900px;
          height: 900px;
          margin-left: -450px;
          margin-top: -450px;
          pointer-events: none;
        }
        .animate-hex-ripple {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          will-change: transform, opacity;
        }
        .animate-hex-ripple.active {
          animation: hex-ripple 6s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
        }
      `}</style>
      <div className="hex-ripple-container z-0">
        <img src={getAssetUrl('/images/hex_centered.svg')} alt="" className={`animate-hex-ripple ${isActive ? 'active' : ''}`} style={{ animationDelay: isActive ? '3s' : '0s' }} />
        <img src={getAssetUrl('/images/hex_centered.svg')} alt="" className={`animate-hex-ripple ${isActive ? 'active' : ''}`} style={{ animationDelay: isActive ? '5s' : '0s' }} />
        <img src={getAssetUrl('/images/hex_centered.svg')} alt="" className={`animate-hex-ripple ${isActive ? 'active' : ''}`} style={{ animationDelay: isActive ? '7s' : '0s' }} />
      </div>

      {/* Center Logo */}
      <div className="absolute top-[600px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-[242px]">
        <img src={getAssetUrl('/images/motrex-logo-blue.svg')} alt="Motrex Logo" className="w-full drop-shadow-lg" />
      </div>

      {/* Card 1 - SW Technology (Top Left) */}
      <div className="absolute top-[225px] left-[80px]" style={getWrapperStyle(500, 'left')}>
        <div className={cardInnerClass}>
          <h3 style={titleStyle}>SW Technology</h3>
          <ul className={listStyle}>
            <li className="flex items-start gap-3">
              <span className={bulletStyle} />
              <span style={itemStyle}>
                Cyber Security and advanced automotive SW tech development
              </span>
            </li>
            <li className="flex justify-center py-4">
              <img src={getAssetUrl('/images/core1.svg')} alt="Core Technology" className="w-[638px]" />
            </li>
            <li className="flex items-start gap-3">
              <span className={bulletStyle} />
              <span style={itemStyle}>
                Power-Saving mode via STR (Suspend to Ram), 3 sec boot-up
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Card 2 - UX/UI (Top Right) */}
      <div className="absolute top-[225px] left-[1154px]" style={getWrapperStyle(900, 'right')}>
        <div className={cardInnerClass}>
          <h3 style={titleStyle}>UX/UI</h3>
          <ul className={listStyle}>
            <li className="flex items-start gap-3">
              <span className={bulletStyle} />
              <span style={itemStyle}>
                Multi-resolution GUI design and mobile/cluster-integrated Ul development
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className={bulletStyle} />
              <span style={itemStyle}>
                TIACORE-based dynamic motion and 3D effect implementation
              </span>
            </li>
            <li className="flex justify-center py-4">
              <img src={getAssetUrl('/images/core2.svg')} alt="Core Technology 2" className="w-[638px]" />
            </li>
          </ul>
        </div>
      </div>

      {/* Card 3 - SOC (Bottom Left) */}
      <div className="absolute bottom-[100px] left-[80px]" style={getWrapperStyle(1300, 'left')}>
        <div className={cardInnerClass}>
          <h3 style={titleStyle}>SOC</h3>
          <ul className={listStyle}>
            <li className="flex items-start gap-3">
              <span className={bulletStyle} />
              <span style={itemStyle}>
                Telechips/ Qualcomm/ Mediatek AP reference
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className={bulletStyle} />
              <div className="flex flex-col">
                <span style={itemStyle}>
                  Android / Linux / QNX based OS reference
                </span>
                <span style={{ ...itemStyle, fontSize: '16px', color: '#6B7280', marginTop: '4px' }}>
                  Android 9,10,12 OS - Linux OS (w/Android Container)
                </span>
              </div>
            </li>
            <li className="flex justify-center py-4">
              <img src={getAssetUrl('/images/core3.svg')} alt="Core Technology 3" className="w-[638px]" />
            </li>
          </ul>
        </div>
      </div>

      {/* Card 4 - HW Technology (Bottom Right) */}
      <div className="absolute bottom-[100px] left-[1154px]" style={getWrapperStyle(1700, 'right')}>
        <div className={cardInnerClass}>
          <h3 style={titleStyle}>HW Technology</h3>
          <ul className={listStyle}>
            <li className="flex items-start gap-3">
              <span className={bulletStyle} />
              <span style={itemStyle}>
                Development of Touch / Haptic / Knob on Display
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className={bulletStyle} />
              <span style={itemStyle}>
                EMI/EMC design, and vibration/shock durability based on simulation
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className={bulletStyle} />
              <span style={itemStyle}>
                High-performance processor for Al and multi-platform design
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className={bulletStyle} />
              <span style={itemStyle}>
                Wireless connectivity (BLE, Wifi, LTE), know-how in global RF parameters
              </span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};

// --- Slide 3: HMI & RSE ---
// --- Slide 3: HMI & RSE ---
interface Slide3_HMIProps {
  isActive: boolean;
}

const Slide3_HMI: React.FC<Slide3_HMIProps> = ({ isActive }) => {
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
      {/* Label 1: Haptic Driven Control */}
      <div className={`absolute top-[380px] left-[650px] z-20 ${getAnimStyle('delay-[1200ms]', 'fade')}`} style={labelStyle}>
        Haptic Driven Control
      </div>

      {/* Label 2: RSE 2.0 */}
      <div className={`absolute top-[550px] right-[80px] z-20 ${getAnimStyle('delay-[1400ms]', 'fade')}`} style={labelStyle}>
        RSE 2.0
      </div>
      {/* Row 1: HMI Display */}
      <div className="flex-1 flex items-center w-full">
        {/* Image Left (No margin left) */}
        <div className={`flex-shrink-0 ${getAnimStyle('delay-[300ms]', 'slideLeft')}`}>
          <img src={getAssetUrl('/images/hmi.png')} alt="HMI Display" className="block w-[940px] mt-[100px]" />
        </div>
        {/* Text Right */}
        <div className={`flex-1 pl-20 pr-24 flex flex-col items-start text-left ${getAnimStyle('delay-[500ms]', 'slideUp')}`}>
          <h2 style={titleStyle}>HMI Display</h2>
          <p style={descStyle}>
            Haptic-driven controls minimize distractions for safer driving.
            Climate CAN integration ensures cleaner air and intelligent cabin comfort.
            OEM-validated durability, safety, and cybersecurity guarantee reliability on the road.
          </p>
        </div>
      </div>

      {/* Row 2: Rear Seat Entertainment */}
      <div className="flex-1 flex items-center w-full justify-end">
        {/* Text Left (Right aligned) */}
        <div className={`flex-1 pl-2 pr-32 mr-[-170px] flex flex-col items-end text-right ${getAnimStyle('delay-[700ms]', 'slideUp')}`}>
          <h2 style={titleStyle}>Rear Seat Entertainment</h2>
          <p style={descStyle}>
            Access to the full Google Play ecosystem offers a premium entertainment experience.
            Its slim, refined design blends seamlessly with the cabin interior.
            The Snapdragon 662 platform ensures stable performance and smooth multimedia playback.
          </p>
        </div>
        {/* Image Right (No margin right) */}
        <div className={`flex-shrink-0 ${getAnimStyle('delay-[900ms]', 'slideRight')}`}>
          <img src={getAssetUrl('/images/rse.png')} alt="Rear Seat Entertainment" className="block w-[1076px]" />
        </div>
      </div>
    </div>
  );
};

export default InnovationScreen;
