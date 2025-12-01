/**
 * Utility functions for handling paths with basePath support
 * Works in both server and client contexts
 */

/**
 * Gets the base path from environment variable
 * For GitHub Pages: /repo-name
 * PAGES_BASE_PATH is set by GitHub Actions during build
 * NEXT_PUBLIC_BASE_PATH can be used for local development
 */
export function getBasePath(): string {
  // PAGES_BASE_PATH is set by GitHub Actions (actions/configure-pages)
  // NEXT_PUBLIC_BASE_PATH is embedded at build time for client-side use
  // In Next.js, NEXT_PUBLIC_* variables are embedded at build time
  return process.env.NEXT_PUBLIC_BASE_PATH || process.env.PAGES_BASE_PATH || '';
}

/**
 * Creates a path with basePath prefix
 */
export function withBasePath(path: string): string {
  const basePath = getBasePath();
  // Remove leading slash from path if basePath already has trailing structure
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}

/**
 * Gets the questions JSON path
 */
export function getQuestionsPath(): string {
  return withBasePath('/questions/all.json');
}

/**
 * Gets the icon path
 */
export function getIconPath(filename: string): string {
  return withBasePath(`/icons/${filename}`);
}

