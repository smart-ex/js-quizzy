# Deployment Guide

This guide explains how to deploy JS Quizzy to GitHub Pages.

## Prerequisites

- GitHub account
- Repository with code pushed
- GitHub Actions enabled

## Automatic Deployment

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to GitHub Pages on every push to the `main` branch.

### Setup Steps

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select "GitHub Actions" as the source
   - Save

2. **Push to main branch**:
   ```bash
   git push origin main
   ```

3. **Monitor deployment**:
   - Go to Actions tab
   - Watch the workflow run
   - Deployment will be available at: `https://yourusername.github.io/js-quizzy/`

## Manual Deployment

If you prefer to deploy manually:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **The output will be in `/out` directory**

3. **Deploy to GitHub Pages**:
   ```bash
   npm install -g gh-pages
   gh-pages -d out
   ```

## Local Testing

Before deploying, test the static export locally:

1. **Build**:
   ```bash
   npm run build
   ```

2. **Serve locally** (using a static server):
   ```bash
   npx serve out
   ```

3. **Test offline functionality**:
   - Open DevTools → Application → Service Workers
   - Check "Offline" checkbox
   - Refresh and test the app

## Configuration

### Base Path

If deploying to a subdirectory (e.g., `/js-quizzy/`), update `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/js-quizzy',
  // ...
};
```

### Custom Domain

1. Add `CNAME` file to `public/` directory:
   ```
   yourdomain.com
   ```

2. Configure DNS:
   - Add CNAME record pointing to `yourusername.github.io`

## Troubleshooting

### Build Fails

- Check Node.js version (should be 20+)
- Ensure all dependencies are installed
- Check for TypeScript errors

### Service Worker Not Working

- Ensure HTTPS (GitHub Pages provides this)
- Check browser console for errors
- Verify `/sw.js` is accessible

### Questions Not Loading

- Verify `/questions/all.json` exists
- Check network tab for 404 errors
- Ensure questions are in `public/questions/`

### Routing Issues

- Verify `trailingSlash: true` in `next.config.ts`
- Check that all routes are properly exported
- Ensure client-side navigation works

## Post-Deployment

1. **Test the live site**:
   - Verify all pages load
   - Test quiz functionality
   - Check offline mode
   - Verify PWA installation

2. **Update README**:
   - Add live site URL
   - Update badges if needed

3. **Monitor**:
   - Check GitHub Actions for build status
   - Monitor error logs if available

## Continuous Deployment

The workflow automatically:
- Builds on every push to `main`
- Validates questions
- Deploys to GitHub Pages
- Updates the site within minutes

No manual intervention needed!

