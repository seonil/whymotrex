import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_DURATION, SHOW_PROGRESS_BAR } from './config';

import HomeScreen from './components/HomeScreen';
import InnovationScreen from './components/InnovationScreen';
import QualityScreen from './components/QualityScreen';
import UnifiedStrengthScreen from './components/UnifiedStrengthScreen';
import MouseTracker from './components/MouseTracker';
import { Page } from './types';

const STORAGE_KEY = 'whymotrex-current-page';

function App() {
  // Initialize page from localStorage, fallback to Home
  const [page, setPage] = useState<Page>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && Object.values(Page).includes(saved as Page)) {
      return saved as Page;
    }
    return Page.Home;
  });
  const [scale, setScale] = useState(1);
  const nextActionRef = useRef<(() => void) | null>(null);
  const prevActionRef = useRef<(() => void) | null>(null);
  const [autoRollDelay, setAutoRollDelay] = useState(DEFAULT_DURATION);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Save page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, page);
  }, [page]);

  // Function for child components to register their "next action" handler
  const registerNextAction = useCallback((handler: (() => void) | null) => {
    nextActionRef.current = handler;
  }, []);

  // Function for child components to register their "prev action" handler
  const registerPrevAction = useCallback((handler: (() => void) | null) => {
    prevActionRef.current = handler;
  }, []);

  useEffect(() => {
    const updateScale = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate scale based on which dimension is the limiting factor
      const scaleX = viewportWidth / 1920;
      const scaleY = viewportHeight / 1080;

      // Use the smaller scale to ensure content fits within viewport
      setScale(Math.min(scaleX, scaleY));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Global "next/prev action" event listeners
  useEffect(() => {
    let autoRollInterval: NodeJS.Timeout | null = null;

    const triggerNextAction = () => {
      if (nextActionRef.current) {
        nextActionRef.current();
      }
    };

    const triggerPrevAction = () => {
      if (prevActionRef.current) {
        prevActionRef.current();
      }
    };

    // Start Auto Rolling Logic
    const startAutoRoll = () => {
      if (autoRollInterval) clearInterval(autoRollInterval);

      // Reset Progress Bar Animation
      if (progressBarRef.current && SHOW_PROGRESS_BAR) {
        const el = progressBarRef.current;
        el.style.animation = 'none';
        void el.offsetWidth; // Force Reflow
        el.style.animation = `progress-linear ${autoRollDelay}ms linear infinite`;
      }

      autoRollInterval = setInterval(() => {
        triggerNextAction();
      }, autoRollDelay);
    };

    // Handle Manual Interaction (Reset Timer)
    const handleManualInteraction = () => {
      // Simply restart the auto-roll timer
      // This clears the current interval and starts a new one with 'autoRollDelay'
      startAutoRoll();
    };

    // Initialize auto-roll on mount/update
    startAutoRoll();

    // Next action: Click, ArrowRight, ScrollDown, Enter, Space
    // Prev action: ArrowLeft, Backspace
    const handleKeyDown = (e: KeyboardEvent) => {
      // Reset timer on any meaningful key interaction
      if (['Enter', 'ArrowRight', ' ', 'ArrowLeft', 'Backspace'].includes(e.key)) {
        handleManualInteraction();
      }

      if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        triggerNextAction();
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault();
        triggerPrevAction();
      }
    };

    // Mouse click - next action (ignore clicks on buttons/interactive elements)
    const handleClick = (e: MouseEvent) => {
      // Reset timer on any click
      handleManualInteraction();

      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer')
      ) {
        // Even if we don't trigger next action, we still reset the timer (already done above)
        return;
      }
      triggerNextAction();
    };

    // Mouse wheel scroll down (next)
    const handleWheel = (e: WheelEvent) => {
      // Reset timer on scroll
      handleManualInteraction();

      if (e.deltaY > 0) {
        e.preventDefault();
        triggerNextAction();
      }
      // Scroll up does nothing (prev is only ArrowLeft/Backspace)
    };

    // Mouse move - reset timer
    const handleMouseMove = () => {
      handleManualInteraction();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (autoRollInterval) clearInterval(autoRollInterval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [autoRollDelay]); // Re-run when delay changes


  return (
    <div className="app-container">
      {/* <MouseTracker /> */}
      <style>{`
        @keyframes progress-linear {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>

      {SHOW_PROGRESS_BAR && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        >
          <div
            ref={progressBarRef}
            style={{
              height: '100%',
              backgroundColor: '#005FF9',
              width: '0%',
              // Animation is set via JS
            }}
          />
        </div>
      )}

      <div className="content-wrapper">
        <div className="canvas" style={{ transform: `scale(${scale})` }}>
          {page === Page.Home && <HomeScreen setPage={setPage} registerNextAction={registerNextAction} registerPrevAction={registerPrevAction} setAutoRollDelay={setAutoRollDelay} />}
          {page === Page.Innovation && <InnovationScreen setPage={setPage} registerNextAction={registerNextAction} registerPrevAction={registerPrevAction} setAutoRollDelay={setAutoRollDelay} />}
          {page === Page.Quality && <QualityScreen setPage={setPage} registerNextAction={registerNextAction} registerPrevAction={registerPrevAction} setAutoRollDelay={setAutoRollDelay} />}
          {page === Page.UnifiedStrength && <UnifiedStrengthScreen setPage={setPage} registerNextAction={registerNextAction} registerPrevAction={registerPrevAction} setAutoRollDelay={setAutoRollDelay} />}
        </div>
      </div>
    </div>
  );
}

export default App;

