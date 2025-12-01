'use client';

import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import type { Question } from '@/lib/types';

interface QuestionRendererProps {
  question: Question;
  selectedAnswer?: number;
  onSelectAnswer?: (index: number) => void;
  showCorrect?: boolean;
  disabled?: boolean;
}

export function QuestionRenderer({
  question,
  selectedAnswer,
  onSelectAnswer,
  showCorrect = false,
  disabled = false,
}: QuestionRendererProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (question.code && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [question.code]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          {question.title}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {question.question}
        </p>
      </div>

      {question.code && (
        <div className="rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm font-mono">
            <code ref={codeRef} className="language-javascript">
              {question.code}
            </code>
          </pre>
        </div>
      )}

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const showFeedback = showCorrect && isSelected;

          let bgColor = 'bg-white dark:bg-gray-800';
          let borderColor = 'border-gray-300 dark:border-gray-600';
          const textColor = 'text-gray-900 dark:text-gray-100';

          if (disabled || showCorrect) {
            if (isCorrect) {
              bgColor = 'bg-green-100 dark:bg-green-900';
              borderColor = 'border-green-500 dark:border-green-600';
            } else if (isSelected && !isCorrect) {
              bgColor = 'bg-red-100 dark:bg-red-900';
              borderColor = 'border-red-500 dark:border-red-600';
            }
          } else if (isSelected) {
            bgColor = 'bg-blue-100 dark:bg-blue-900';
            borderColor = 'border-blue-500 dark:border-blue-600';
          }

          return (
            <button
              key={index}
              onClick={() => !disabled && onSelectAnswer?.(index)}
              disabled={disabled}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all
                ${bgColor} ${borderColor} ${textColor}
                ${!disabled ? 'hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer' : 'cursor-not-allowed'}
                ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400' : ''}
              `}
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-semibold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {showCorrect && isCorrect && (
                  <span className="text-green-600 dark:text-green-400 font-semibold">✓</span>
                )}
                {showFeedback && !isCorrect && (
                  <span className="text-red-600 dark:text-red-400 font-semibold">✗</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showCorrect && question.explanation && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Explanation:
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

