'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QuizInterface } from '@/components/QuizInterface';
import { Navigation } from '@/components/Navigation';
import { useQuestions } from '@/lib/useQuestions';
import { getRandomQuestions } from '@/lib/utils';
import { COMPREHENSIVE_QUIZ_QUESTIONS } from '@/lib/constants';
import type { Difficulty } from '@/lib/types';

interface ComprehensiveQuizClientProps {
  difficulty: string;
}

export function ComprehensiveQuizClient({ difficulty }: ComprehensiveQuizClientProps) {
  const router = useRouter();
  const { loading, error, getQuestionsByDifficulty } = useQuestions();

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="spinner mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="glass-card p-8 text-center max-w-md mx-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--accent-error)]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--accent-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Error Loading Questions</h2>
            <p className="text-[var(--accent-error)] mb-6">{error}</p>
            <button
              onClick={() => router.push('/quiz/')}
              className="glow-button"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validDifficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const difficultyLevel = validDifficulties.includes(difficulty as Difficulty) 
    ? (difficulty as Difficulty) 
    : null;

  if (!difficultyLevel) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="glass-card p-8 text-center max-w-md mx-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--accent-warning)]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--accent-warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Invalid Difficulty Level</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              The difficulty level "{difficulty}" is not valid. Please choose easy, medium, or hard.
            </p>
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
        </div>
      </div>
    );
  }

  const difficultyQuestions = getQuestionsByDifficulty(difficultyLevel);
  
  if (difficultyQuestions.length === 0) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="glass-card p-8 text-center max-w-md mx-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--accent-warning)]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--accent-warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Questions Available</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              There are no {difficultyLevel} questions available yet. Please try another difficulty level.
            </p>
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
        </div>
      </div>
    );
  }

  const selectedQuestions = getRandomQuestions(
    difficultyQuestions, 
    Math.min(COMPREHENSIVE_QUIZ_QUESTIONS, difficultyQuestions.length)
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <QuizInterface questions={selectedQuestions} category="comprehensive" />
    </div>
  );
}

