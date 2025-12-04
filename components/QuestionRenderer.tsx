'use client';

import { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import type { Question } from '@/lib/types';
import { CodePlayground } from './CodePlayground';

interface QuestionRendererProps {
  question: Question;
  selectedAnswer?: number;
  onSelectAnswer?: (index: number) => void;
  showCorrect?: boolean;
  disabled?: boolean;
}

function QuestionRendererContent({
  question,
  selectedAnswer,
  onSelectAnswer,
  showCorrect = false,
  disabled = false,
}: QuestionRendererProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [usePlaygroundInternal, setUsePlaygroundInternal] = useState(false);
  
  // Derive usePlayground - disable if question requires non-strict mode
  const usePlayground = question.nonStrictMode ? false : usePlaygroundInternal;

  useEffect(() => {
    if (question.code && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [question.code]);

  // Re-apply Prism highlighting when switching back to static view
  useEffect(() => {
    if (!usePlayground && question.code && codeRef.current) {
      // Use requestAnimationFrame to ensure the element is rendered in the DOM
      const frameId = requestAnimationFrame(() => {
        if (codeRef.current) {
          // Remove any existing Prism classes to force re-highlighting
          const element = codeRef.current;
          element.className = element.className.replace(/prism-[^\s]*/g, '').trim();
          element.className = 'language-javascript text-sm';
          Prism.highlightElement(element);
        }
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [usePlayground, question.code]);

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

      {question.code && (
        <div className="rounded-lg overflow-hidden border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-[var(--bg-tertiary)] border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-[var(--text-muted)] font-mono ml-1">JavaScript</span>
            </div>
            {question.nonStrictMode ? (
              <div className="flex items-center gap-2 px-3 py-1 rounded-md text-xs text-[var(--text-muted)]" title="This code requires non-strict mode and cannot run in the interactive playground">
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Non-strict mode only</span>
              </div>
            ) : (
              <button
                onClick={() => setUsePlaygroundInternal(!usePlaygroundInternal)}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  usePlayground
                    ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                }`}
                title={usePlayground ? 'Switch to static view' : 'Switch to interactive playground'}
              >
                {usePlayground ? (
                  <>
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Static</span>
                  </>
                ) : (
                  <>
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <span>Interactive</span>
                  </>
                )}
              </button>
            )}
          </div>
          {usePlayground && !question.nonStrictMode ? (
            <CodePlayground key={question.id} code={question.code} />
          ) : (
            <pre className="!m-0 !rounded-none !border-0 overflow-x-auto !py-3 !px-4">
              <code 
                key={`${question.id}-static`}
                ref={codeRef} 
                className="language-javascript text-sm"
              >
                {question.code}
              </code>
            </pre>
          )}
        </div>
      )}

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
                <span className="option-letter-compact">
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

export function QuestionRenderer(props: QuestionRendererProps) {
  return <QuestionRendererContent key={props.question.id} {...props} />;
}
