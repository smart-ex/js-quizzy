'use client';

import Link from 'next/link';
import type { QuizSession, Question } from '@/lib/types';
import { calculateAccuracy, formatTime } from '@/lib/utils';
import { QuestionRenderer } from './QuestionRenderer';
import { ShareButton } from './ShareButton';
import { getCategoryLabel } from '@/lib/constants';

interface ResultsPanelProps {
  session: QuizSession;
  questions: Question[];
}

export function ResultsPanel({ session, questions }: ResultsPanelProps) {
  const accuracy = calculateAccuracy(session);
  const totalQuestions = session.answers.length;
  const correctCount = session.answers.filter(a => a.correct).length;

  const getQuestion = (questionId: string) => {
    return questions.find(q => q.id === questionId);
  };

  const getPerformanceLevel = () => {
    if (accuracy >= 80) return { label: 'Excellent!', color: 'var(--accent-success)', emoji: '🎉' };
    if (accuracy >= 60) return { label: 'Good Job!', color: 'var(--accent-primary)', emoji: '👍' };
    if (accuracy >= 40) return { label: 'Keep Practicing', color: 'var(--accent-warning)', emoji: '💪' };
    return { label: 'Room to Grow', color: 'var(--accent-error)', emoji: '📚' };
  };

  const performance = getPerformanceLevel();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 md:p-10 mb-8 text-center animate-fadeInUp">
          <div className="text-6xl mb-4">{performance.emoji}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[var(--text-primary)]">
            Quiz Complete!
          </h1>
          <p className="text-xl mb-2" style={{ color: performance.color }}>
            {performance.label}
          </p>
          <p className="text-[var(--text-muted)] mb-8">
            Category: {getCategoryLabel(session.category)}
          </p>

          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="var(--bg-tertiary)"
                strokeWidth="8"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke={performance.color}
                strokeWidth="8"
                strokeDasharray={`${accuracy * 5.53} 553`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold" style={{ color: performance.color }}>
                {accuracy}%
              </span>
              <span className="text-[var(--text-muted)] text-sm mt-1">Accuracy</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]/50">
              <div className="text-3xl font-bold text-[var(--accent-primary)] font-mono">
                {correctCount}/{totalQuestions}
              </div>
              <div className="text-sm text-[var(--text-muted)] mt-1">Correct</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]/50">
              <div className="text-3xl font-bold text-[var(--accent-secondary)] font-mono">
                {formatTime(session.totalTime)}
              </div>
              <div className="text-sm text-[var(--text-muted)] mt-1">Time</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]/50">
              <div className="text-3xl font-bold text-[var(--accent-tertiary)]">
                {totalQuestions - correctCount}
              </div>
              <div className="text-sm text-[var(--text-muted)] mt-1">Missed</div>
            </div>
          </div>

          <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/5 border-2 border-[var(--accent-primary)]/20">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                🎯 Challenge Your Friends!
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Share your score and see if they can beat it!
              </p>
            </div>
            <ShareButton session={session} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quiz"
              className="glow-button flex items-center justify-center gap-2 text-center"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Take Another Quiz
            </Link>
            <Link
              href="/stats"
              className="px-8 py-3 rounded-xl border-2 border-[var(--border-medium)] text-[var(--text-secondary)] font-semibold hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Statistics
            </Link>
          </div>
        </div>

        <div className="glass-card p-6 md:p-8 mb-8 animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Review Your Answers
            </h2>
          </div>

          <div className="space-y-6">
            {session.answers.map((answer, index) => {
              const question = getQuestion(answer.questionId);
              if (!question) return null;

              return (
                <div
                  key={answer.questionId}
                  className={`p-5 md:p-6 rounded-xl border-2 ${
                    answer.correct
                      ? 'bg-[var(--accent-success)]/5 border-[var(--accent-success)]/20'
                      : 'bg-[var(--accent-error)]/5 border-[var(--accent-error)]/20'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-lg bg-[var(--bg-tertiary)] text-sm font-medium text-[var(--text-secondary)]">
                      Question {index + 1}
                    </span>
                    {answer.correct ? (
                      <span className="flex items-center gap-1 text-[var(--accent-success)] font-semibold">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[var(--accent-error)] font-semibold">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Incorrect
                      </span>
                    )}
                  </div>
                  <QuestionRenderer
                    question={question}
                    selectedAnswer={answer.userAnswer}
                    showCorrect={true}
                    disabled={true}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
