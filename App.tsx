import React, { useState, useEffect, useRef, useCallback } from 'react';
import HomeScreen from './components/HomeScreen';
import InnovationScreen from './components/InnovationScreen';
import QualityScreen from './components/QualityScreen';
import UnifiedStrengthScreen from './components/UnifiedStrengthScreen';
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

    // Keyboard events: Enter, ArrowRight, ArrowDown, Space (next), ArrowLeft, ArrowUp (prev)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        triggerNextAction();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        triggerPrevAction();
      }
    };



    // Mouse wheel scroll down (next), scroll up (prev)
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        e.preventDefault();
        triggerNextAction();
      } else if (e.deltaY < 0) {
        e.preventDefault();
        triggerPrevAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="canvas" style={{ transform: `scale(${scale})` }}>
          {page === Page.Home && <HomeScreen setPage={setPage} registerNextAction={registerNextAction} registerPrevAction={registerPrevAction} />}
          {page === Page.Innovation && <InnovationScreen setPage={setPage} registerNextAction={registerNextAction} registerPrevAction={registerPrevAction} />}
          {page === Page.Quality && <QualityScreen setPage={setPage} registerNextAction={registerNextAction} registerPrevAction={registerPrevAction} />}
          {page === Page.UnifiedStrength && <UnifiedStrengthScreen setPage={setPage} registerNextAction={registerNextAction} registerPrevAction={registerPrevAction} />}
        </div>
      </div>
    </div>
  );
}

export default App;
