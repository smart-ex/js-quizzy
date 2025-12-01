'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { CATEGORY_LABELS } from '@/lib/constants';

function ShareContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get('user');
  const score = searchParams.get('score');
  const category = searchParams.get('category');
  const date = searchParams.get('date');

  if (!user || !score || !category) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Invalid Share Link
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This share link is missing required information.
          </p>
          <Link
            href="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const [correct, total] = score.split('/').map(Number);
  const percentage = Math.round((correct / total) * 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Quiz Results
          </h1>
          
          <div className="mb-6">
            <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {score}
            </div>
            <div className="text-2xl text-gray-600 dark:text-gray-400">
              {percentage}% Accuracy
            </div>
          </div>

          <div className="space-y-2 text-gray-600 dark:text-gray-400 mb-8">
            <p>
              <span className="font-semibold">Category:</span>{' '}
              {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category}
            </p>
            {date && (
              <p>
                <span className="font-semibold">Date:</span> {new Date(date).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <Link
              href="/quiz"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Yourself
            </Link>
            <div>
              <Link
                href="/"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    }>
      <ShareContent />
    </Suspense>
  );
}

