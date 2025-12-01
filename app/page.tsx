'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStorage } from '@/lib/useStorage';
import { StatsDashboard } from '@/components/StatsDashboard';
import { Navigation } from '@/components/Navigation';
import { PWAStatus } from '@/components/PWAStatus';
import { useQuestions } from '@/lib/useQuestions';
import { getCategories, getCategoryLabel, getCategoryDescription, CATEGORY_ICONS } from '@/lib/constants';
import type { UserStats } from '@/lib/types';

export default function Home() {
  const { getStats } = useStorage();
  const { questions } = useQuestions();
  const categories = getCategories(questions);
  
  // Defer localStorage access until after hydration to prevent mismatch
  const [stats, setStats] = useState<UserStats | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats(getStats());
  }, [getStats]);

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
          <p className="hero-subtitle mb-10">
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

        {/* Category Grid */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Choose Your Challenge
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-medium)] to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((category, index) => (
              <Link
                key={category}
                href={`/quiz/${category}`}
                className={`category-card opacity-0 animate-fadeInUp stagger-${Math.min(index + 1, 6)}`}
                style={{ animationFillMode: 'forwards' }}
              >
                <div className="icon-container">
                  <svg 
                    className="w-7 h-7 text-[var(--accent-primary)]" 
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
                <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
                  {getCategoryLabel(category)}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                  {getCategoryDescription(category)}
                </p>
                <div className="flex items-center text-[var(--accent-primary)] font-medium text-sm group-hover:gap-3 transition-all">
                  Start Quiz
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Overview - Only render after client-side hydration */}
        {mounted && stats && stats.totalQuizzes > 0 && (
          <div className="mb-16 animate-fadeIn">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Your Progress
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-medium)] to-transparent" />
            </div>
            <StatsDashboard stats={stats} />
          </div>
        )}

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
              <span className="text-sm text-[var(--text-muted)]">JS Quiz Master</span>
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
