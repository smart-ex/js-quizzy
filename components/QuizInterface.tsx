'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Question } from '@/lib/types';
import { useQuizStore } from '@/lib/store';
import { useStorage } from '@/lib/useStorage';
import { formatTime, calculateScore } from '@/lib/utils';
import { QuestionRenderer } from './QuestionRenderer';

interface QuizInterfaceProps {
  questions: Question[];
  category: string;
}

export function QuizInterface({ questions, category }: QuizInterfaceProps) {
  const router = useRouter();
  const { saveSession, updateStats } = useStorage();
  const {
    currentSession,
    currentQuestionIndex,
    answers,
    elapsedTime,
    isActive,
    startQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    updateTimer,
    endQuiz,
  } = useQuizStore();

  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (questions.length > 0 && !currentSession) {
      startQuiz(questions, category);
    }
  }, [questions, category, currentSession, startQuiz]);

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

  // Restore feedback state when navigating to a question that already has an answer
  useEffect(() => {
    if (currentQuestion) {
      const hasAnswer = answers.has(currentQuestion.id);
      setShowFeedback(hasAnswer);
    }
  }, [currentQuestion?.id, currentQuestionIndex, answers]);

  const handleSelectAnswer = (index: number) => {
    if (!currentQuestion) return;
    selectAnswer(currentQuestion.id, index);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < (currentSession?.questions.length || 0) - 1) {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      previousQuestion();
    }
  };

  const handleFinish = () => {
    if (!currentSession || !currentQuestion) return;

    const session = endQuiz();
    if (!session) return;

    // Calculate correct answers
    session.answers = session.answers.map(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      const isCorrect = question ? answer.userAnswer === question.correctAnswer : false;
      return {
        ...answer,
        correct: isCorrect,
      };
    });

    session.score = calculateScore(session);

    // Save session and update stats
    saveSession(session);
    updateStats(session, questions);

    // Navigate to results
    router.push('/quiz/results');
  };

  if (!currentSession || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / currentSession.questions.length) * 100;
  const selectedAnswer = answers.get(currentQuestion.id);
  const canFinish = currentQuestionIndex === currentSession.questions.length - 1 && selectedAnswer !== undefined;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Question {currentQuestionIndex + 1} of {currentSession.questions.length}
            </h1>
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {formatTime(elapsedTime)}
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <QuestionRenderer
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
            showCorrect={showFeedback}
            disabled={showFeedback}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Previous
          </button>

          {canFinish ? (
            <button
              onClick={handleFinish}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Finish Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={selectedAnswer === undefined || showFeedback === false}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

