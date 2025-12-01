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
            <span className="gradient-text">Select a Category</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Choose a topic to challenge your JavaScript knowledge. Each quiz contains 10 questions with detailed explanations.
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category}
                href={`/quiz/${category}`}
                className={`category-card group opacity-0 animate-fadeInUp stagger-${Math.min(index + 1, 6)}`}
                style={{ animationFillMode: 'forwards' }}
              >
                <div className="flex items-start justify-between mb-4">
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
                  <span className="px-3 py-1 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)] text-xs font-medium">
                    {categoryQuestionCounts[category] || 0} questions
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold mb-2 text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                  {getCategoryLabel(category)}
                </h2>
                <p className="text-[var(--text-secondary)] mb-6 line-clamp-2">
                  {getCategoryDescription(category)}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                  <span className="text-[var(--accent-primary)] font-semibold flex items-center gap-2">
                    Start Quiz
                    <svg 
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <div className="flex -space-x-1">
                    <div className="w-6 h-6 rounded-full bg-[var(--accent-success)]/20 border-2 border-[var(--bg-card)] flex items-center justify-center">
                      <span className="text-[10px] text-[var(--accent-success)]">E</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[var(--accent-warning)]/20 border-2 border-[var(--bg-card)] flex items-center justify-center">
                      <span className="text-[10px] text-[var(--accent-warning)]">M</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[var(--accent-error)]/20 border-2 border-[var(--bg-card)] flex items-center justify-center">
                      <span className="text-[10px] text-[var(--accent-error)]">H</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* All Categories Link */}
        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
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
