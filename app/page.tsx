'use client';

import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { PWAStatus } from '@/components/PWAStatus';
import { useQuestions } from '@/lib/useQuestions';
import { getCategories, getCategoryLabel, getCategoryDescription, CATEGORY_ICONS } from '@/lib/constants';

export default function Home() {
  const { questions } = useQuestions();
  const categories = getCategories(questions);

  return (
    <div className="min-h-screen">
      <Navigation />
      <PWAStatus />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-success)] animate-pulse" />
            Over 100+ JavaScript Questions
          </div>
          <h1 className="hero-title mb-6">
            <span className="text-[var(--text-primary)]">Master </span>
            <span className="gradient-text">JavaScript</span>
            <br />
            <span className="text-[var(--text-primary)]">One Quiz at a Time</span>
          </h1>
          <p className="hero-subtitle">
            Deep-dive into event loops, closures, async patterns, and more. 
            Track your progress and become a JavaScript expert.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quiz"
              className="glow-button text-lg px-10 py-4 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Quiz
            </Link>
            <Link
              href="/stats"
              className="px-10 py-4 rounded-xl border-2 border-[var(--border-medium)] text-[var(--text-secondary)] font-semibold text-lg hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Stats
            </Link>
          </div>
        </div>

        {/* Comprehensive Quiz Section */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Comprehensive Quiz
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-medium)] to-transparent" />
          </div>
          <p className="text-[var(--text-secondary)] mb-6 max-w-2xl">
            Test your knowledge across all topics with 20 questions at your chosen difficulty level.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { 
                difficulty: 'easy', 
                label: 'Easy', 
                description: 'Perfect for beginners', 
                color: 'from-green-500/20 to-emerald-500/5', 
                iconColor: 'text-green-500', 
                borderColor: 'border-green-500/30',
                iconPath: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
              },
              { 
                difficulty: 'medium', 
                label: 'Medium', 
                description: 'For intermediate learners', 
                color: 'from-yellow-500/20 to-amber-500/5', 
                iconColor: 'text-yellow-500', 
                borderColor: 'border-yellow-500/30',
                iconPath: 'M13 7l5 5m0 0l-5 5m5-5H6'
              },
              { 
                difficulty: 'hard', 
                label: 'Hard', 
                description: 'Challenge for experts', 
                color: 'from-red-500/20 to-rose-500/5', 
                iconColor: 'text-red-500', 
                borderColor: 'border-red-500/30',
                iconPath: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z'
              },
            ].map((level, index) => (
              <Link
                key={level.difficulty}
                href={`/quiz/comprehensive/${level.difficulty}`}
                className={`category-card opacity-0 animate-fadeInUp stagger-${index + 1} border-2 ${level.borderColor} hover:border-[var(--accent-primary)] transition-all`}
                style={{ animationFillMode: 'forwards' }}
              >
                <div className="flex items-start gap-3">
                  <div className={`icon-container flex-shrink-0 bg-gradient-to-br ${level.color} rounded-xl p-2`}>
                    <svg 
                      className={`w-6 h-6 ${level.iconColor}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2}
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d={level.iconPath}
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-1 text-[var(--text-primary)]">
                      {level.label} Level
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mb-2">
                      {level.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>20 questions from all topics</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Category Grid */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Choose Your Challenge
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-medium)] to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((category, index) => (
              <Link
                key={category}
                href={`/quiz/${category}`}
                className={`category-card opacity-0 animate-fadeInUp stagger-${Math.min(index + 1, 6)}`}
                style={{ animationFillMode: 'forwards' }}
              >
                <div className="flex items-start gap-3">
                  <div className="icon-container flex-shrink-0">
                    <svg 
                      className="w-5 h-5 text-[var(--accent-primary)]" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={1.5}
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d={CATEGORY_ICONS[category] || 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'} 
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-0.5 text-[var(--text-primary)]">
                      {getCategoryLabel(category)}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                      {getCategoryDescription(category)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center">
              <svg className="w-7 h-7 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">Deep Concepts</h3>
            <p className="text-sm text-[var(--text-secondary)]">Questions that test your understanding of JavaScript internals</p>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
              <svg className="w-7 h-7 text-[var(--accent-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">Track Progress</h3>
            <p className="text-sm text-[var(--text-secondary)]">Detailed statistics and performance analytics</p>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 flex items-center justify-center">
              <svg className="w-7 h-7 text-[var(--accent-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">Works Offline</h3>
            <p className="text-sm text-[var(--text-secondary)]">PWA support - practice anywhere, anytime</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">JS</span>
              </div>
              <span className="text-sm text-[var(--text-muted)]">JS Quizzy</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Built for JavaScript enthusiasts
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
