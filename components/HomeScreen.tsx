import React, { useEffect } from 'react';
import { Page } from '../types';
import { getAssetUrl } from '../utils';

interface HomeScreenProps {
  setPage: (page: Page) => void;
  registerNextAction: (handler: (() => void) | null) => void;
  registerPrevAction: (handler: (() => void) | null) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setPage, registerNextAction, registerPrevAction }) => {
  const cards = [
    {
      title: 'Innovation Driven by Technology Leadership',
      page: Page.Innovation,
      bgImage: getAssetUrl('/images/bg-1-1.png')
    },
    {
      title: 'Quality Excellence & Manufacturing Reliability',
      page: Page.Quality,
      bgImage: getAssetUrl('/images/bg-2-1.png')
    },
    {
      title: 'Unified Strength for Future Mobility',
      page: Page.UnifiedStrength,
      bgImage: getAssetUrl('/images/bg-3-1.png')
    },
  ];

  // Disable all global actions on home screen - only button clicks work
  useEffect(() => {
    registerNextAction(null);
    return () => registerNextAction(null);
  }, [registerNextAction]);

  // Disable prev action on home screen
  useEffect(() => {
    registerPrevAction(null);
    return () => registerPrevAction(null);
  }, [registerPrevAction]);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: '1920px',
        height: '1080px',
        backgroundImage: 'linear-gradient(135deg, #0A0F1A 0%, #1a2332 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Title */}
      <h1
        className="text-white text-center font-bold absolute"
        style={{
          fontFamily: '"42dot Sans"',
          fontSize: '94px',
          fontWeight: 700,
          lineHeight: '103.4px',
          top: '144px',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
        }}
      >
        Why MOTREX
      </h1>

      {/* Subtitle */}
      <p
        className="text-white text-center absolute"
        style={{
          fontFamily: '"42dot Sans"',
          fontSize: '24px',
          top: '268px',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
        }}
      >
        Explore Our Core Strengths
      </p>

      {/* Cards Container - 3 cards centered */}
      <div
        className="absolute flex"
        style={{
          top: '410px',
          left: '50%',
          transform: 'translateX(-50%)',
          gap: '48px',
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              // Reset slide to 0 when navigating to a page
              if (card.page === Page.Innovation) {
                localStorage.setItem('whymotrex-innovation-slide', '0');
              } else if (card.page === Page.Quality) {
                localStorage.setItem('whymotrex-quality-slide', '0');
              } else if (card.page === Page.UnifiedStrength) {
                localStorage.setItem('whymotrex-unified-slide', '0');
              }
              setPage(card.page);
            }}
            className="cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              width: '520px',
              height: '480px',
              backgroundImage: `url(${card.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <h2
              className="text-white text-center font-semibold"
              style={{
                fontFamily: '"42dot Sans"',
                fontSize: '36px',
                fontWeight: 600,
                lineHeight: '1.4',
              }}
            >
              {card.title}
            </h2>
          </div>
        ))}
      </div>

      {/* Footer Logo */}
      <div
        className="absolute"
        style={{
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="text-white text-2xl font-semibold"
          style={{ fontFamily: '"42dot Sans"' }}
        >
          MOTREX 2026
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
