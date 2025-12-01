'use client';

import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { useQuestions } from '@/lib/useQuestions';
import { getCategories, getCategoryLabel, getCategoryDescription, CATEGORY_ICONS } from '@/lib/constants';

export default function QuizPage() {
  const { questions, loading } = useQuestions();
  const categories = getCategories(questions);

  // Count questions per category
  const categoryQuestionCounts = categories.reduce((acc, category) => {
    acc[category] = questions.filter(q => q.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Start Your Quiz</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Test your JavaScript knowledge with comprehensive quizzes across all topics or focus on specific categories. 
            Choose your challenge and improve your skills.
          </p>
        </div>

        {/* Comprehensive Quiz Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Comprehensive Quiz
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-medium)] to-transparent" />
          </div>
          <p className="text-[var(--text-secondary)] mb-6 max-w-2xl">
            Test your knowledge across all topics with 20 questions at your chosen difficulty level.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
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

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Choose Your Challenge
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-medium)] to-transparent" />
        </div>

        {/* Quick Stats Bar */}
        <div className="glass-card p-4 mb-10 flex flex-wrap items-center justify-center gap-6 text-center">
          <div>
            <span className="text-2xl font-bold text-[var(--accent-primary)]">{categories.length}</span>
            <span className="text-[var(--text-secondary)] ml-2">Categories</span>
          </div>
          <div className="w-px h-8 bg-[var(--border-subtle)] hidden sm:block" />
          <div>
            <span className="text-2xl font-bold text-[var(--accent-secondary)]">{questions.length}</span>
            <span className="text-[var(--text-secondary)] ml-2">Questions</span>
          </div>
          <div className="w-px h-8 bg-[var(--border-subtle)] hidden sm:block" />
          <div>
            <span className="text-2xl font-bold text-[var(--accent-tertiary)]">10</span>
            <span className="text-[var(--text-secondary)] ml-2">Per Quiz</span>
          </div>
        </div>

        {/* Category Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="spinner" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((category, index) => (
              <Link
                key={category}
                href={`/quiz/${category}`}
                className={`category-card group opacity-0 animate-fadeInUp stagger-${Math.min(index + 1, 6)}`}
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
                    <div className="flex items-start justify-between mb-1">
                      <h2 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                        {getCategoryLabel(category)}
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)] text-xs font-medium flex-shrink-0 ml-2">
                        {categoryQuestionCounts[category] || 0}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                      {getCategoryDescription(category)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="glow-button inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
