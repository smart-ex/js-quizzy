import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  // Get basePath from Next.js config if available
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  return {
    name: 'JS Quiz Master',
    short_name: 'JS Quiz',
    description: 'Test your JavaScript knowledge with deep-dive questions',
    start_url: `${basePath}/`,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    orientation: 'portrait-primary',
    icons: [
      {
        src: `${basePath}/icons/icon-192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: `${basePath}/icons/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['education', 'games'],
  };
}

