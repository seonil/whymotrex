import React from 'react';
import { Page } from '../types';

interface BlankScreenProps {
  setPage: (page: Page) => void;
  title: string;
}

const BlankScreen: React.FC<BlankScreenProps> = ({ setPage, title }) => {
  return (
    <div
      className="relative"
      style={{
        width: '1920px',
        height: '1080px',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Header with Back Button */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between"
        style={{
          height: '100px',
          padding: '0 64px',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <button
          onClick={() => setPage(Page.Home)}
          className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
          style={{
            fontFamily: 'Albert Sans',
            fontSize: '20px',
            fontWeight: 500,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        <h1
          className="text-gray-900 font-semibold"
          style={{
            fontFamily: 'Albert Sans',
            fontSize: '32px',
            fontWeight: 600,
          }}
        >
          {title}
        </h1>

        <div style={{ width: '150px' }} /> {/* Spacer for centering */}
      </div>

      {/* Content Area - Blank White Space */}
      <div
        className="absolute"
        style={{
          top: '100px',
          left: '0',
          right: '0',
          bottom: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p
          className="text-gray-400"
          style={{
            fontFamily: 'Albert Sans',
            fontSize: '24px',
            fontWeight: 300,
          }}
        >
          Content coming soon...
        </p>
      </div>
    </div>
  );
};

export default BlankScreen;
