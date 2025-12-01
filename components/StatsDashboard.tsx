'use client';

import type { UserStats } from '@/lib/types';
import { CATEGORY_LABELS, QUESTIONS_PER_QUIZ } from '@/lib/constants';
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
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalQuizzes}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Quizzes</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {overallAccuracy}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Overall Accuracy</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {formatTime(stats.totalTime)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Time</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {stats.streak}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Day Streak</div>
        </div>
      </div>

      {/* Category Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Performance by Category
        </h2>
        <div className="space-y-4">
          {Object.entries(stats.byCategory).map(([category, catStats]) => {
            // Calculate accuracy: correct answers / total questions attempted
            // Each quiz has QUESTIONS_PER_QUIZ questions
            const totalQuestions = catStats.attempted * QUESTIONS_PER_QUIZ;
            const accuracy =
              totalQuestions > 0
                ? Math.min(100, Math.round((catStats.correct / totalQuestions) * 100))
                : 0;

            return (
              <div key={category} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {accuracy}% accuracy
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{catStats.attempted} attempted</span>
                  <span>{catStats.correct} correct</span>
                  <span>Avg: {formatTime(catStats.avgTime)}</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Difficulty Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Performance by Difficulty
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {(['easy', 'medium', 'hard'] as const).map(difficulty => {
            const diffStats = stats.difficulties[difficulty];
            const accuracy =
              diffStats.attempted > 0
                ? Math.round((diffStats.correct / diffStats.attempted) * 100)
                : 0;

            return (
              <div key={difficulty} className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 capitalize mb-1">
                  {difficulty}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  {accuracy}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-500">
                  {diffStats.correct}/{diffStats.attempted}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

