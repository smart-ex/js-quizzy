'use client';

import Link from 'next/link';
import { useStorage } from '@/lib/useStorage';
import { StatsDashboard } from '@/components/StatsDashboard';
// import { Leaderboard } from '@/components/Leaderboard';
import { Navigation } from '@/components/Navigation';
import { PWAStatus } from '@/components/PWAStatus';
import { useQuestions } from '@/lib/useQuestions';
import { getCategories, getCategoryLabel, getCategoryDescription } from '@/lib/constants';

export default function Home() {
  const { getStats } = useStorage();
  const { questions } = useQuestions();
  const stats = getStats();
  const categories = getCategories(questions);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <PWAStatus />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            JS Quiz Master
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Test your JavaScript knowledge with deep-dive questions on event loop, closures, async/await, and more.
          </p>
          <Link
            href="/quiz"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
          >
            Start Quiz
          </Link>
        </div>

        {/* Category Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Choose a Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <Link
                key={category}
                href={`/quiz/${category}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  {getCategoryLabel(category)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getCategoryDescription(category)}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        {stats.totalQuizzes > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Your Statistics
            </h2>
            <StatsDashboard stats={stats} />
          </div>
        )}

        {/* Leaderboard - Hidden for now */}
        {/* <div className="mb-12">
          <Leaderboard />
        </div> */}
      </main>
    </div>
  );
}
