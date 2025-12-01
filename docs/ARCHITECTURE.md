# Architecture Documentation

This document describes the technical architecture and design decisions for JS Quiz Master.

## Overview

JS Quiz Master is a fully client-side, offline-first Progressive Web App (PWA) built with Next.js 16. It requires no backend and works entirely in the browser using localStorage for persistence.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Deployment**: GitHub Pages (static export)

## Architecture Decisions

### Offline-First Design

- All data is stored in localStorage
- Questions are cached in service worker
- App works fully offline after first visit
- No server-side dependencies

### State Management

- **Zustand** for quiz session state (current question, answers, timer)
- **localStorage** for persistent data (sessions, stats, questions)
- **React hooks** for data fetching and UI state

### Data Flow

1. **Questions Loading**:
   - Try to fetch from network (`/questions/all.json`)
   - Cache in service worker
   - Fallback to localStorage cache
   - Fallback to empty state

2. **Quiz Session**:
   - User selects category
   - Random 10 questions selected
   - Zustand store manages session state
   - Answers stored in memory during quiz
   - On finish: session saved to localStorage, stats updated

3. **Statistics**:
   - Calculated from localStorage sessions
   - Updated after each quiz completion
   - Displayed in stats dashboard

## File Structure

```
js-quizzy/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with PWA setup
│   ├── page.tsx           # Landing page
│   ├── quiz/              # Quiz routes
│   ├── stats/             # Statistics page
│   └── share/             # Share results page
├── components/            # React components
│   ├── QuizInterface.tsx  # Main quiz component
│   ├── QuestionRenderer.tsx
│   ├── ResultsPanel.tsx
│   └── ...
├── lib/                   # Core logic
│   ├── types.ts          # TypeScript interfaces
│   ├── store.ts          # Zustand store
│   ├── useStorage.ts     # localStorage hooks
│   ├── useQuestions.ts   # Questions loader
│   └── utils.ts          # Helper functions
├── public/               # Static assets
│   ├── questions/        # Question JSON files
│   ├── sw.js            # Service Worker
│   └── manifest.json    # PWA manifest
└── scripts/              # Build scripts
    ├── validate-questions.ts
    └── generate-all-json.ts
```

## Key Components

### QuizInterface
Main quiz component that:
- Manages quiz flow
- Tracks timer
- Handles answer selection
- Navigates between questions
- Saves session on completion

### QuestionRenderer
Renders questions based on type:
- Multiple choice options
- Code blocks with syntax highlighting
- Answer feedback
- Explanations

### useStorage
Custom hook for localStorage operations:
- Session persistence
- Statistics tracking
- Question caching
- User data

### Service Worker
Handles offline functionality:
- Caches static assets
- Caches question JSON files
- Network-first strategy for questions
- Cache-first for static assets

## Data Storage

### localStorage Keys

- `js_quiz_sessions`: Array of QuizSession objects
- `js_quiz_stats`: UserStats object
- `js_quiz_questions`: Cached Question[] array
- `js_quiz_data_version`: Version string for cache invalidation
- `js_quiz_user`: User object
- `js_quiz_preferences`: User preferences

### Storage Limits

- Typical localStorage limit: 5-10MB
- Questions JSON: ~500KB
- Sessions: ~50KB per session
- Estimated capacity: 50-100 sessions

## Performance Considerations

- Questions loaded once and cached
- Service worker caches for offline access
- Minimal re-renders with Zustand
- Static export for fast loading
- Code splitting by Next.js

## Security & Privacy

- No user data sent to servers
- All data stored locally
- Share links are deterministic (no tracking)
- No external dependencies for data
- Open source for transparency

## Deployment

- Static export to `/out` directory
- GitHub Actions builds and deploys to `gh-pages` branch
- No build-time dependencies on external services
- Fully static HTML/CSS/JS

## Future Enhancements

- Interactive code playground
- Daily challenges
- Community question voting
- GitHub OAuth for verified users
- AI-powered explanations

