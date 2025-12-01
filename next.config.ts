import type { NextConfig } from "next";

// Support GitHub Pages deployment with basePath
// PAGES_BASE_PATH is set automatically by GitHub Actions (actions/configure-pages)
// For local development, you can set NEXT_PUBLIC_BASE_PATH manually
const getBasePath = (): string | undefined => {
  // PAGES_BASE_PATH is set by GitHub Actions during build
  if (process.env.PAGES_BASE_PATH) {
    return process.env.PAGES_BASE_PATH;
  }
  // Fallback for local development or manual override
  return process.env.NEXT_PUBLIC_BASE_PATH;
};

const nextConfig: NextConfig = {
  output: 'export',
  basePath: getBasePath(),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
