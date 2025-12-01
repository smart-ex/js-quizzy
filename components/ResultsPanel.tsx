'use client';

import Link from 'next/link';
import type { QuizSession, Question } from '@/lib/types';
import { calculateAccuracy, formatTime } from '@/lib/utils';
import { QuestionRenderer } from './QuestionRenderer';
import { ShareButton } from './ShareButton';

interface ResultsPanelProps {
  session: QuizSession;
  questions: Question[];
}

export function ResultsPanel({ session, questions }: ResultsPanelProps) {
  const accuracy = calculateAccuracy(session);
  const totalQuestions = session.answers.length;

  const getQuestion = (questionId: string) => {
    return questions.find(q => q.id === questionId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Results Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Quiz Complete!
          </h1>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {session.score}/{totalQuestions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {accuracy}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {formatTime(session.totalTime)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Time</div>
            </div>
          </div>
          <div className="mt-6">
            <ShareButton session={session} />
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Review Your Answers
          </h2>
          <div className="space-y-8">
            {session.answers.map((answer, index) => {
              const question = getQuestion(answer.questionId);
              if (!question) return null;

              return (
                <div
                  key={answer.questionId}
                  className={`p-6 rounded-lg border-2 ${
                    answer.correct
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Question {index + 1}
                    </span>
                    {answer.correct ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        ✓ Correct
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-semibold">
                        ✗ Incorrect
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

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/quiz"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Take Another Quiz
          </Link>
          <Link
            href="/stats"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            View Statistics
          </Link>
        </div>
      </div>
    </div>
  );
}

