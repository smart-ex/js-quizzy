'use client';

import { useRouter } from 'next/navigation';
import { QuizInterface } from '@/components/QuizInterface';
import { useQuestions } from '@/lib/useQuestions';
import { getRandomQuestions } from '@/lib/utils';
import { QUESTIONS_PER_QUIZ } from '@/lib/constants';
import type { Category } from '@/lib/types';

interface CategoryQuizClientProps {
  category: string;
}

export function CategoryQuizClient({ category }: CategoryQuizClientProps) {
  const router = useRouter();
  const { loading, error, getQuestionsByCategory } = useQuestions();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Error loading questions: {error}</p>
          <button
            onClick={() => router.push('/quiz/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const categoryQuestions = getQuestionsByCategory(category as Category);
  
  if (categoryQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No questions available for this category.</p>
          <button
            onClick={() => router.push('/quiz/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const selectedQuestions = getRandomQuestions(categoryQuestions, QUESTIONS_PER_QUIZ);

  return <QuizInterface questions={selectedQuestions} category={category} />;
}

