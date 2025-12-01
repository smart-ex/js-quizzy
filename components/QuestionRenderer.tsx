'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [showExplanation, setShowExplanation] = useState(false);

  // Reset explanation state when question changes
  useEffect(() => {
    setShowExplanation(false);
  }, [question.id]);

  useEffect(() => {
    if (question.code && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [question.code]);

  // Difficulty badge color
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'badge badge-easy';
      case 'medium':
        return 'badge badge-medium';
      case 'hard':
        return 'badge badge-hard';
      default:
        return 'badge badge-medium';
    }
  };

  return (
    <div className="space-y-4">
      {/* Question Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-tight">
            {question.title}
          </h2>
          <span className={`${getDifficultyBadge(question.difficulty)} flex-shrink-0`}>
            {question.difficulty}
          </span>
        </div>
        <p className="text-base text-[var(--text-secondary)] leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Code Block */}
      {question.code && (
        <div className="rounded-lg overflow-hidden border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-tertiary)] border-b border-[var(--border-subtle)]">
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-[var(--text-muted)] font-mono ml-1">JavaScript</span>
          </div>
          <pre className="!m-0 !rounded-none !border-0 overflow-x-auto !py-3 !px-4">
            <code ref={codeRef} className="language-javascript text-sm">
              {question.code}
            </code>
          </pre>
        </div>
      )}

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          
          let buttonClass = 'option-button-compact';
          
          if (disabled || showCorrect) {
            if (isCorrect) {
              buttonClass += ' correct';
            } else if (isSelected && !isCorrect) {
              buttonClass += ' incorrect';
            }
          } else if (isSelected) {
            buttonClass += ' selected';
          }

          return (
            <button
              key={index}
              onClick={() => !disabled && onSelectAnswer?.(index)}
              disabled={disabled}
              className={buttonClass}
            >
              <div className="flex items-center gap-3">
                <span className={`option-letter-compact ${isSelected || (showCorrect && isCorrect) ? '!bg-current !text-[var(--bg-primary)]' : ''}`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-left text-sm">{option}</span>
                {showCorrect && isCorrect && (
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--accent-success)]/20">
                    <svg className="w-4 h-4 text-[var(--accent-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
                {showCorrect && isSelected && !isCorrect && (
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--accent-error)]/20">
                    <svg className="w-4 h-4 text-[var(--accent-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation - Collapsible */}
      {showCorrect && question.explanation && (
        <div className="mt-4">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-2 text-sm text-[var(--accent-primary)] hover:text-[var(--accent-primary)]/80 transition-colors"
          >
            <svg 
              className={`w-4 h-4 transition-transform ${showExplanation ? 'rotate-90' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Show explanation</span>
          </button>
          
          {showExplanation && (
            <div className="mt-2 p-3 rounded-lg bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/5 border border-[var(--accent-primary)]/20 animate-fadeIn">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
