// Helper to get asset URL with correct base path for GitHub Pages
export const getAssetUrl = (path: string): string => {
  const base = import.meta.env.BASE_URL;
  // Remove leading slash from path if base already ends with slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};
