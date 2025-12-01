'use client';

import type { UserStats } from '@/lib/types';
import { CATEGORY_LABELS, QUESTIONS_PER_QUIZ, CATEGORY_ICONS } from '@/lib/constants';
import { formatTime } from '@/lib/utils';

interface StatsDashboardProps {
  stats: UserStats;
}

export function StatsDashboard({ stats }: StatsDashboardProps) {
  const overallAccuracy =
    stats.totalQuizzes > 0
      ? Math.round((stats.totalCorrect / (stats.totalQuizzes * QUESTIONS_PER_QUIZ)) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Overall Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stats-card group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--accent-primary)] mb-1">
            {stats.totalQuizzes}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Quizzes Completed</div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-success)]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--accent-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--accent-success)] mb-1">
            {overallAccuracy}%
          </div>
          <div className="text-sm text-[var(--text-muted)]">Overall Accuracy</div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-secondary)]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--accent-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--accent-secondary)] font-mono mb-1">
            {formatTime(stats.totalTime)}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Total Time</div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-warning)]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--accent-warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--accent-warning)] mb-1">
            {stats.streak}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Day Streak</div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Performance by Category
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(stats.byCategory).map(([category, catStats]) => {
            const totalQuestions = catStats.attempted * QUESTIONS_PER_QUIZ;
            const accuracy =
              totalQuestions > 0
                ? Math.min(100, Math.round((catStats.correct / totalQuestions) * 100))
                : 0;

            const iconPath = CATEGORY_ICONS[category] || 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253';

            return (
              <div 
                key={category} 
                className="p-4 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--bg-card)] flex items-center justify-center">
                      <svg 
                        className="w-5 h-5 text-[var(--accent-primary)]" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">
                        {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">
                        {catStats.attempted} quiz{catStats.attempted !== 1 ? 'zes' : ''} taken
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${accuracy >= 70 ? 'text-[var(--accent-success)]' : accuracy >= 40 ? 'text-[var(--accent-warning)]' : 'text-[var(--accent-error)]'}`}>
                      {accuracy}%
                    </span>
                  </div>
                </div>
                
                <div className="progress-bar mb-3">
                  <div
                    className="progress-bar-fill"
                    style={{ 
                      width: `${accuracy}%`,
                      background: accuracy >= 70 
                        ? 'var(--accent-success)' 
                        : accuracy >= 40 
                          ? 'var(--accent-warning)' 
                          : 'var(--accent-error)'
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span>{catStats.correct} correct answers</span>
                  <span>Avg: {formatTime(catStats.avgTime)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Difficulty Stats */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-tertiary)]/20 to-[var(--accent-warning)]/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--accent-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Performance by Difficulty
          </h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {(['easy', 'medium', 'hard'] as const).map(difficulty => {
            const diffStats = stats.difficulties[difficulty];
            const accuracy =
              diffStats.attempted > 0
                ? Math.round((diffStats.correct / diffStats.attempted) * 100)
                : 0;

            const colors = {
              easy: { bg: 'var(--accent-success)', text: 'var(--accent-success)' },
              medium: { bg: 'var(--accent-warning)', text: 'var(--accent-warning)' },
              hard: { bg: 'var(--accent-error)', text: 'var(--accent-error)' },
            };

            return (
              <div 
                key={difficulty} 
                className="text-center p-5 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)]"
              >
                <span 
                  className={`badge badge-${difficulty} mb-4 inline-block`}
                >
                  {difficulty}
                </span>
                <div 
                  className="text-4xl font-bold mb-2"
                  style={{ color: colors[difficulty].text }}
                >
                  {accuracy}%
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  {diffStats.correct}/{diffStats.attempted} correct
                </div>
                
                {/* Mini progress ring */}
                <div className="mt-4 mx-auto w-16 h-16 relative">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="var(--bg-tertiary)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke={colors[difficulty].bg}
                      strokeWidth="4"
                      strokeDasharray={`${accuracy * 1.76} 176`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
