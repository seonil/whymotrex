# Responsive Template - 16:9 Web App

This is a reusable React template designed for web applications that need to maintain a 16:9 aspect ratio (1920x1080) while scaling responsively to fit any browser window size.

## Key Features

- **Responsive 16:9 Layout**: Automatically scales to fit any window size while maintaining aspect ratio
- **1920x1080 Design Canvas**: All content is designed for 1920x1080 pixels internally
- **Simple State-based Navigation**: Uses React state for page switching (no router needed)
- **Tailwind CSS via CDN**: Quick styling without build configuration
- **TypeScript**: Type-safe development
- **Vite**: Fast development and optimized builds

## Project Structure

```
template/
├── components/
│   ├── HomeScreen.tsx       # Main landing page with 3 cards
│   └── BlankScreen.tsx      # Reusable blank page component
├── public/                  # Static assets
├── App.tsx                  # Main app with page switching logic
├── main.tsx                 # React entry point
├── types.ts                 # Page enum definitions
├── index.html               # HTML entry with Tailwind CDN
├── index.css                # Responsive scaling & global styles
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## Getting Started

### Installation

```bash
cd template
npm install
```

### Development

```bash
npm run dev
```

The dev server runs at `http://localhost:3006` (or `http://0.0.0.0:3006`).

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm preview
```

## How It Works

### Responsive Scaling

The template uses CSS to maintain the 16:9 aspect ratio:

1. **App Container**: Full viewport (100vw x 100vh)
2. **Content Wrapper**: Scales based on available space
   - If window is wider than 16:9 → scale based on height
   - If window is taller than 16:9 → scale based on width
3. **Canvas**: Fixed 1920x1080 internal dimensions that scale with the wrapper

This is achieved through media queries in [index.css](index.css):

```css
@media (max-aspect-ratio: 16/9) {
  .content-wrapper {
    width: 100vw;
    height: calc(100vw * 9 / 16);
  }
}

@media (min-aspect-ratio: 16/9) {
  .content-wrapper {
    width: calc(100vh * 16 / 9);
    height: 100vh;
  }
}
```

### Navigation System

Pages are defined in [types.ts](types.ts):

```typescript
export enum Page {
  Home = 'Home',
  Innovation = 'Innovation',
  Quality = 'Quality',
  UnifiedStrength = 'UnifiedStrength',
}
```

Navigation is handled through a simple state variable in [App.tsx](App.tsx):

```typescript
const [page, setPage] = useState<Page>(Page.Home);
```

All screen components receive `setPage` as a prop to trigger navigation.

## Customization

### Adding New Pages

1. Add a new page to the `Page` enum in [types.ts](types.ts)
2. Create a new component in `components/` (or use `BlankScreen`)
3. Add the page case in [App.tsx](App.tsx)

### Styling

- **Global styles**: Edit [index.css](index.css)
- **Component styles**: Use inline Tailwind classes
- **Typography**: Uses Albert Sans font from Google Fonts

### Changing Card Content

Edit the `cards` array in [components/HomeScreen.tsx](components/HomeScreen.tsx:15-27).

## Design Notes

- All components are designed for **1920x1080 pixels** internally
- Use **fixed pixel values** for precise positioning
- The scaling system automatically handles different window sizes
- Touch-optimized (disabled text selection, context menus)

## Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS (via CDN)
- **Albert Sans** - Typography

## Browser Compatibility

Works in all modern browsers that support:
- CSS `aspect-ratio` media queries
- ES2020+ JavaScript
- CSS Grid and Flexbox

## License

MIT
