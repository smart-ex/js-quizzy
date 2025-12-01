'use client';

import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { useQuestions } from '@/lib/useQuestions';
import { getCategories, getCategoryLabel, getCategoryDescription } from '@/lib/constants';

export default function QuizPage() {
  const { questions } = useQuestions();
  const categories = getCategories(questions);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Select a Category
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose a topic to test your JavaScript knowledge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <Link
              key={category}
              href={`/quiz/${category}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105"
            >
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                {getCategoryLabel(category)}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {getCategoryDescription(category)}
              </p>
              <div className="text-blue-600 dark:text-blue-400 font-semibold">
                Start Quiz →
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

