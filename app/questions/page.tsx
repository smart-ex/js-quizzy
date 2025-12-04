'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/constants';
import type { Question } from '@/lib/types';
import { getQuestionsPath } from '@/lib/paths';

interface CategoryStats {
  name: string;
  count: number;
  easy: number;
  medium: number;
  hard: number;
}

interface DifficultyStats {
  easy: number;
  medium: number;
  hard: number;
}

export default function QuestionsStatsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const questionsPath = getQuestionsPath();
    fetch(questionsPath)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: Question[]) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load questions:', err);
        setLoading(false);
      });
  }, []);

  // Calculate stats
  const categoryStats: CategoryStats[] = [];
  const difficultyStats: DifficultyStats = { easy: 0, medium: 0, hard: 0 };
  const categoryMap = new Map<string, CategoryStats>();

  questions.forEach(q => {
    // Difficulty stats
    difficultyStats[q.difficulty]++;

    // Category stats
    if (!categoryMap.has(q.category)) {
      categoryMap.set(q.category, {
        name: q.category,
        count: 0,
        easy: 0,
        medium: 0,
        hard: 0,
      });
    }
    const cat = categoryMap.get(q.category)!;
    cat.count++;
    cat[q.difficulty]++;
  });

  categoryMap.forEach(cat => categoryStats.push(cat));
  categoryStats.sort((a, b) => b.count - a.count);

  const total = questions.length;
  const totalDifficulty = difficultyStats.easy + difficultyStats.medium + difficultyStats.hard;

  // Pie chart calculations
  const easyPercent = totalDifficulty > 0 ? (difficultyStats.easy / totalDifficulty) * 100 : 0;
  const mediumPercent = totalDifficulty > 0 ? (difficultyStats.medium / totalDifficulty) * 100 : 0;
  const hardPercent = totalDifficulty > 0 ? (difficultyStats.hard / totalDifficulty) * 100 : 0;

  // SVG pie chart segments
  const easyAngle = (easyPercent / 100) * 360;
  const mediumAngle = (mediumPercent / 100) * 360;

  function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Question Bank</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Overview of all JavaScript quiz questions
          </p>
        </div>

        {loading ? (
          <div className="glass-card p-12 text-center animate-fadeIn">
            <div className="spinner mx-auto mb-6" />
            <p className="text-[var(--text-secondary)]">Loading questions...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Total Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stats-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-[var(--accent-primary)] mb-1">{total}</div>
                <div className="text-sm text-[var(--text-muted)]">Total Questions</div>
              </div>

              <div className="stats-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-success)]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--accent-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-[var(--accent-success)] mb-1">{difficultyStats.easy}</div>
                <div className="text-sm text-[var(--text-muted)]">Easy</div>
              </div>

              <div className="stats-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-warning)]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--accent-warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-[var(--accent-warning)] mb-1">{difficultyStats.medium}</div>
                <div className="text-sm text-[var(--text-muted)]">Medium</div>
              </div>

              <div className="stats-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-error)]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--accent-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-[var(--accent-error)] mb-1">{difficultyStats.hard}</div>
                <div className="text-sm text-[var(--text-muted)]">Hard</div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Difficulty Distribution
                </h2>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* SVG Pie Chart */}
                <div className="relative">
                  <svg width="240" height="240" viewBox="0 0 240 240">
                    {/* Easy segment */}
                    {easyPercent > 0 && (
                      <path
                        d={describeArc(120, 120, 100, 0, easyAngle)}
                        fill="var(--accent-success)"
                        className="transition-all duration-500 hover:opacity-80"
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                      />
                    )}
                    {/* Medium segment */}
                    {mediumPercent > 0 && (
                      <path
                        d={describeArc(120, 120, 100, easyAngle, easyAngle + mediumAngle)}
                        fill="var(--accent-warning)"
                        className="transition-all duration-500 hover:opacity-80"
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                      />
                    )}
                    {/* Hard segment */}
                    {hardPercent > 0 && (
                      <path
                        d={describeArc(120, 120, 100, easyAngle + mediumAngle, 360)}
                        fill="var(--accent-error)"
                        className="transition-all duration-500 hover:opacity-80"
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                      />
                    )}
                    {/* Center circle for donut effect */}
                    <circle cx="120" cy="120" r="60" fill="var(--bg-card)" />
                    {/* Center text */}
                    <text x="120" y="115" textAnchor="middle" className="fill-[var(--text-primary)] text-3xl font-bold">
                      {total}
                    </text>
                    <text x="120" y="138" textAnchor="middle" className="fill-[var(--text-muted)] text-sm">
                      questions
                    </text>
                  </svg>
                </div>

                {/* Legend */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-[var(--accent-success)]" />
                    <div>
                      <div className="font-semibold text-[var(--text-primary)]">Easy</div>
                      <div className="text-sm text-[var(--text-muted)]">
                        {difficultyStats.easy} questions ({easyPercent.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-[var(--accent-warning)]" />
                    <div>
                      <div className="font-semibold text-[var(--text-primary)]">Medium</div>
                      <div className="text-sm text-[var(--text-muted)]">
                        {difficultyStats.medium} questions ({mediumPercent.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-[var(--accent-error)]" />
                    <div>
                      <div className="font-semibold text-[var(--text-primary)]">Hard</div>
                      <div className="text-sm text-[var(--text-muted)]">
                        {difficultyStats.hard} questions ({hardPercent.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-tertiary)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--accent-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Questions by Category
                </h2>
              </div>

              <div className="space-y-4">
                {categoryStats.map(cat => {
                  const percent = total > 0 ? (cat.count / total) * 100 : 0;
                  const iconPath = CATEGORY_ICONS[cat.name] || 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253';

                  return (
                    <div
                      key={cat.name}
                      className="p-4 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
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
                              {CATEGORY_LABELS[cat.name] || cat.name}
                            </h3>
                            <p className="text-xs text-[var(--text-muted)]">
                              {cat.count} question{cat.count !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-[var(--accent-primary)]">
                            {percent.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="progress-bar mb-3">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      {/* Difficulty breakdown */}
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[var(--accent-success)]" />
                          <span className="text-[var(--text-muted)]">{cat.easy} easy</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[var(--accent-warning)]" />
                          <span className="text-[var(--text-muted)]">{cat.medium} medium</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[var(--accent-error)]" />
                          <span className="text-[var(--text-muted)]">{cat.hard} hard</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

