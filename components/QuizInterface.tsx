'use client';

import { useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Question } from '@/lib/types';
import { useQuizStore } from '@/lib/store';
import { useStorage } from '@/lib/useStorage';
import { formatTime, calculateScore } from '@/lib/utils';
import { QuestionRenderer } from './QuestionRenderer';
import { getCategoryLabel } from '@/lib/constants';

interface QuizInterfaceProps {
  questions: Question[];
  category: string;
}

export function QuizInterface({ questions, category }: QuizInterfaceProps) {
  const router = useRouter();
  const { saveSession, updateStats } = useStorage();
  const questionNavigatorRef = useRef<HTMLDivElement>(null);
  const currentQuestionButtonRef = useRef<HTMLButtonElement>(null);
  
  const currentSession = useQuizStore((state) => state.currentSession);
  const currentQuestionIndex = useQuizStore((state) => state.currentQuestionIndex);
  const elapsedTime = useQuizStore((state) => state.elapsedTime);
  const isActive = useQuizStore((state) => state.isActive);
  const answers = useQuizStore((state) => state.answers);
  
  const startQuiz = useQuizStore((state) => state.startQuiz);
  const selectAnswer = useQuizStore((state) => state.selectAnswer);
  const nextQuestion = useQuizStore((state) => state.nextQuestion);
  const previousQuestion = useQuizStore((state) => state.previousQuestion);
  const goToQuestion = useQuizStore((state) => state.goToQuestion);
  const updateTimer = useQuizStore((state) => state.updateTimer);
  const endQuiz = useQuizStore((state) => state.endQuiz);
  const reset = useQuizStore((state) => state.reset);

  useEffect(() => {
    if (questions.length > 0) {
      // Check if we need to recreate the session
      // Compare by category, question count, and first question ID (as questions are shuffled)
      const needsNewSession = !currentSession 
        || currentSession.category !== category 
        || currentSession.questions.length !== questions.length
        || (questions.length > 0 && currentSession.questions.length > 0 && questions[0].id !== currentSession.questions[0]);
      
      if (needsNewSession) {
        // Reset store state before starting new quiz
        // startQuiz() will create a new session, but reset() ensures clean state
        if (currentSession) {
          reset();
        }
        startQuiz(questions, category);
      }
    }
  }, [questions, category, currentSession, startQuiz, reset]);

  // Compute current question directly instead of storing in state
  const currentQuestion = currentSession && questions.length > 0
    ? questions.find(q => q.id === currentSession.questions[currentQuestionIndex]) || null
    : null;

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      updateTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, updateTimer]);

  const showFeedback = currentQuestion ? answers.has(currentQuestion.id) : false;

  useLayoutEffect(() => {
    if (currentQuestionIndex === 0 && questionNavigatorRef.current) {
      const container = questionNavigatorRef.current;
      container.scrollLeft = 0;
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (currentQuestionIndex === 0) return;
    
    if (currentQuestionButtonRef.current && questionNavigatorRef.current) {
      const button = currentQuestionButtonRef.current;
      const container = questionNavigatorRef.current;
      
      const scrollToCurrent = () => {
        const buttonRect = button.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollLeft = container.scrollLeft;
        
        const buttonLeft = buttonRect.left - containerRect.left + scrollLeft;
        const buttonWidth = buttonRect.width;
        const containerWidth = containerRect.width;
        
        const margin = 10;
        const isButtonVisible = 
          buttonLeft >= scrollLeft - margin && 
          buttonLeft + buttonWidth <= scrollLeft + containerWidth + margin;
        
        if (!isButtonVisible) {
          const targetScroll = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
          container.scrollTo({
            left: Math.max(0, targetScroll),
            behavior: 'smooth'
          });
        }
      };
      
      // Try multiple times to ensure it works after layout
      requestAnimationFrame(() => {
        scrollToCurrent();
        setTimeout(scrollToCurrent, 50);
        setTimeout(scrollToCurrent, 200);
      });
    }
  }, [currentQuestionIndex, currentSession]);

  const handleSelectAnswer = (index: number) => {
    if (!currentQuestion) return;
    selectAnswer(currentQuestion.id, index);
  };

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < (currentSession?.questions.length || 0) - 1) {
      nextQuestion();
    }
  }, [currentQuestionIndex, currentSession?.questions.length, nextQuestion]);

  // Handle keyboard shortcuts (Space for Next button)
  useEffect(() => {
    if (!currentSession || !currentQuestion) return;

    const selectedAnswer = answers.get(currentQuestion.id);
    const canFinish = currentQuestionIndex === currentSession.questions.length - 1 && selectedAnswer !== undefined;
    const isNextButtonActive = !canFinish && selectedAnswer !== undefined && showFeedback;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && isNextButtonActive) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSession, currentQuestion, currentQuestionIndex, answers, showFeedback, handleNext]);

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      previousQuestion();
    }
  };

  const handleFinish = () => {
    if (!currentSession || !currentQuestion) return;

    const session = endQuiz();
    if (!session) return;

    session.answers = session.answers.map(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      const isCorrect = question ? answer.userAnswer === question.correctAnswer : false;
      return {
        ...answer,
        correct: isCorrect,
      };
    });

    session.score = calculateScore(session);

    saveSession(session);
    updateStats(session, questions);

    router.push('/quiz/results');
  };

  if (!currentSession || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Preparing your quiz...</p>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / currentSession.questions.length) * 100;
  const selectedAnswer = answers.get(currentQuestion.id);
  const canFinish = currentQuestionIndex === currentSession.questions.length - 1 && selectedAnswer !== undefined;

  return (
    <div className="min-h-screen py-3 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="quiz-header mb-4 animate-fadeIn">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link 
                href="/quiz"
                className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
              <h1 className="text-base font-bold text-[var(--text-primary)]">
                {getCategoryLabel(category)}
              </h1>
              <span className="text-sm text-[var(--text-muted)]">
                {currentQuestionIndex + 1}/{currentSession.questions.length}
              </span>
            </div>
            <div className="timer-display-compact">
              {formatTime(elapsedTime)}
            </div>
          </div>
          
          <div className="mt-2">
            <div className="progress-bar h-1.5">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div 
            ref={questionNavigatorRef}
            className="flex items-center gap-1 sm:gap-1.5 mt-2 overflow-x-auto pb-1 question-navigator-scroll -mx-1 px-1 justify-start sm:justify-center"
          >
            {currentSession.questions.map((qId, idx) => {
              const isAnswered = answers.has(qId);
              const isCurrent = idx === currentQuestionIndex;
              
              let isCorrect: boolean | null = null;
              if (isAnswered) {
                const question = questions.find(q => q.id === qId);
                const userAnswer = answers.get(qId);
                if (question && userAnswer !== undefined) {
                  if (!isCurrent || showFeedback) {
                    isCorrect = userAnswer === question.correctAnswer;
                  }
                }
              }
              
              return (
                <button
                  key={qId}
                  ref={isCurrent ? currentQuestionButtonRef : null}
                  onClick={() => {
                    if (idx < currentQuestionIndex || (idx > currentQuestionIndex && isAnswered)) {
                      goToQuestion(idx);
                    }
                  }}
                  disabled={idx > currentQuestionIndex && !isAnswered}
                  className={`
                    w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center font-mono text-[10px] sm:text-xs font-semibold transition-all shrink-0
                    ${isCurrent 
                      ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] ring-1 ring-[var(--accent-primary)]' 
                      : isAnswered && isCorrect !== null
                        ? isCorrect === false
                          ? 'bg-[var(--accent-error)]/20 text-[var(--accent-error)] border border-[var(--accent-error)]/30'
                          : 'bg-[var(--accent-success)]/20 text-[var(--accent-success)] border border-[var(--accent-success)]/30'
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                    }
                    ${idx > currentQuestionIndex && !isAnswered ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                  `}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-4 md:p-6 mb-4 animate-fadeInUp">
          <QuestionRenderer
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
            showCorrect={showFeedback}
            disabled={showFeedback}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
              ${currentQuestionIndex === 0
                ? 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed'
                : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]'
              }
            `}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Previous
          </button>

          <div className="flex items-center gap-3">
            {canFinish ? (
              <button
                onClick={handleFinish}
                className="glow-button flex items-center gap-2 !bg-gradient-to-r !from-green-500 !to-emerald-600 !shadow-green-500/30"
              >
                Finish Quiz
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={selectedAnswer === undefined || !showFeedback}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                  ${selectedAnswer === undefined || !showFeedback
                    ? 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed'
                    : 'glow-button'
                  }
                `}
              >
                Next
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
