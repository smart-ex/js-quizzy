'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { StatsDashboard } from '@/components/StatsDashboard';
import { useStorage } from '@/lib/useStorage';
import Link from 'next/link';
import type { UserStats, QuizSession } from '@/lib/types';

export default function StatsPage() {
  const { getStats, getAllSessions } = useStorage();
  
  // Defer localStorage access until after hydration to prevent mismatch
  const [pageState, setPageState] = useState<{
    mounted: boolean;
    stats: UserStats | null;
    sessions: QuizSession[];
  }>({
    mounted: false,
    stats: null,
    sessions: [],
  });

  useEffect(() => {
    // Batch all initial values in a single state update
    // Note: localStorage must be read after mount to prevent hydration mismatch in Next.js
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageState({
      mounted: true,
      stats: getStats(),
      sessions: getAllSessions(),
    });
  }, [getStats, getAllSessions]);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Your Statistics</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Track your progress and see how you&apos;re improving over time.
          </p>
        </div>
        
        {!pageState.mounted ? (
          // Loading state during hydration
          <div className="glass-card p-12 text-center animate-fadeIn">
            <div className="spinner mx-auto mb-6" />
            <p className="text-[var(--text-secondary)]">Loading statistics...</p>
          </div>
        ) : pageState.stats && pageState.stats.totalQuizzes > 0 ? (
          <StatsDashboard stats={pageState.stats} sessions={pageState.sessions} />
        ) : (
          <div className="glass-card p-12 text-center animate-fadeIn">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
              No Statistics Yet
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
              Complete your first quiz to start tracking your progress. Statistics will appear here after you finish a quiz.
            </p>
            <Link
              href="/quiz"
              className="glow-button inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Your First Quiz
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
