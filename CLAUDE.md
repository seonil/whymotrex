# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite template for building responsive web applications with a fixed 16:9 aspect ratio (1920x1080 design canvas). The app uses state-based navigation without a router and scales responsively to fit any browser window while maintaining aspect ratio.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3006)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build
npm run preview
```

## Architecture

### Responsive Scaling System

The core architecture uses a three-layer scaling approach defined in [index.css](index.css):

1. **app-container**: Full viewport (100vw x 100vh) container
2. **content-wrapper**: Dynamically scales based on window aspect ratio
   - If window is wider than 16:9 → scales based on height: `width: calc(100vh * 16 / 9)`
   - If window is narrower than 16:9 → scales based on width: `height: calc(100vw * 9 / 16)`
3. **canvas**: All content components are designed at 1920x1080 pixels internally and scale automatically

### Navigation Pattern

State-based navigation without React Router:
- Pages are defined as enum values in [types.ts](types.ts)
- [App.tsx](App.tsx) manages a single `page` state variable
- All screen components receive `setPage` function as a prop
- Page switching is done via `setPage(Page.SomePage)`

### Component Design Convention

All UI components use **fixed pixel dimensions for 1920x1080**:
- Design components assuming a 1920x1080 canvas
- Use absolute positioning with pixel values
- The CSS scaling system handles responsive behavior automatically
- Example: A component at `width: '520px'` will scale proportionally on all screen sizes

### Styling Approach

- Tailwind CSS loaded via CDN in [index.html](index.html)
- Use inline styles for precise pixel positioning and dimensions
- Tailwind classes for colors, hover effects, transitions
- Albert Sans font from Google Fonts for typography
- Touch-optimized (text selection and context menus disabled)

## Adding New Pages

1. Add page enum to [types.ts](types.ts):
   ```typescript
   export enum Page {
     NewPage = 'NewPage',
   }
   ```

2. Create component in `components/` or use `BlankScreen`:
   ```typescript
   import { Page } from '../types';

   interface MyScreenProps {
     setPage: (page: Page) => void;
   }

   const MyScreen: React.FC<MyScreenProps> = ({ setPage }) => {
     return (
       <div style={{ width: '1920px', height: '1080px' }}>
         {/* Design for 1920x1080 */}
       </div>
     );
   };
   ```

3. Add case in [App.tsx](App.tsx):
   ```typescript
   {page === Page.NewPage && <MyScreen setPage={setPage} />}
   ```

## Key Files

- [App.tsx](App.tsx) - Main app component with page routing logic
- [types.ts](types.ts) - Page enum definitions
- [index.css](index.css) - Critical responsive scaling CSS (modify carefully)
- [vite.config.ts](vite.config.ts) - Dev server runs on port 3006, path alias `@/` points to root
- [components/HomeScreen.tsx](components/HomeScreen.tsx) - Landing page with navigation cards
- [components/BlankScreen.tsx](components/BlankScreen.tsx) - Reusable blank page template with header

## Configuration Notes

- Dev server configured for `0.0.0.0:3006` to allow network access
- Path alias `@/` resolves to project root (configured in both [vite.config.ts](vite.config.ts) and [tsconfig.json](tsconfig.json))
- TypeScript strict mode enabled
- Build target: ES2020+, output uses Terser minification with console logs preserved
