import type { NextConfig } from "next";

// Support GitHub Pages deployment with basePath
// Set GITHUB_REPOSITORY environment variable in GitHub Actions
// Format: owner/repo-name -> basePath: /repo-name
const getBasePath = (): string | undefined => {
  const repo = process.env.GITHUB_REPOSITORY;
  if (repo) {
    const repoName = repo.split('/')[1];
    return `/${repoName}`;
  }
  // Allow manual override via NEXT_PUBLIC_BASE_PATH
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
