'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/constants';
import { verifyShareUrl, isTimestampValid } from '@/lib/signature';

function ShareContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get('user');
  const score = searchParams.get('score');
  const category = searchParams.get('category');
  const date = searchParams.get('date');
  const timestamp = searchParams.get('ts');
  const signature = searchParams.get('sig');
  
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!user || !score || !category || !timestamp || !signature) {
        setIsValid(false);
        setIsVerifying(false);
        return;
      }

      // Validate score format (must be "X/Y" where X and Y are numbers)
      const scoreMatch = score.match(/^(\d+)\/(\d+)$/);
      if (!scoreMatch) {
        setIsValid(false);
        setIsVerifying(false);
        return;
      }

      const correct = parseInt(scoreMatch[1], 10);
      const total = parseInt(scoreMatch[2], 10);
      if (isNaN(correct) || isNaN(total) || total === 0 || correct > total) {
        setIsValid(false);
        setIsVerifying(false);
        return;
      }

      const ts = parseInt(timestamp, 10);
      if (isNaN(ts) || !isTimestampValid(ts)) {
        setIsValid(false);
        setIsVerifying(false);
        return;
      }

      const valid = await verifyShareUrl(user, score, ts, signature);
      setIsValid(valid);
      setIsVerifying(false);
    };

    verify();
  }, [user, score, category, timestamp, signature]);

  if (isVerifying) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="spinner mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Verifying share link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !score || !category || !isValid) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="glass-card p-8 text-center max-w-md mx-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--accent-error)]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--accent-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
              Invalid Share Link
            </h1>
            <p className="text-[var(--text-secondary)] mb-6">
              {!isValid && isValid !== null
                ? 'This share link has been tampered with or is invalid.'
                : 'This share link is missing required information.'}
            </p>
            <Link
              href="/"
              className="glow-button inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Validate category exists
  const validCategories = Object.keys(CATEGORY_LABELS);
  if (!validCategories.includes(category)) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="glass-card p-8 text-center max-w-md mx-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--accent-error)]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--accent-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
              Invalid Category
            </h1>
            <p className="text-[var(--text-secondary)] mb-6">
              The category in this share link is not valid.
            </p>
            <Link
              href="/"
              className="glow-button inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const scoreMatch = score.match(/^(\d+)\/(\d+)$/);
  if (!scoreMatch) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="glass-card p-8 text-center max-w-md mx-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--accent-error)]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--accent-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
              Invalid Score Format
            </h1>
            <p className="text-[var(--text-secondary)] mb-6">
              The score in this share link is not in a valid format.
            </p>
            <Link
              href="/"
              className="glow-button inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const correct = parseInt(scoreMatch[1], 10);
  const total = parseInt(scoreMatch[2], 10);
  const percentage = Math.round((correct / total) * 100);
  const categoryLabel = CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category;
  const categoryIcon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];

  // Determine success level based on percentage
  const getSuccessLevel = () => {
    if (percentage >= 90) {
      return { 
        color: 'var(--accent-success)', 
        gradient: 'linear-gradient(135deg, #34d399 0%, #22d3ee 100%)',
        bgGradient: 'linear-gradient(135deg, rgba(52, 211, 153, 0.2) 0%, rgba(34, 211, 238, 0.05) 100%)',
        borderColor: 'rgba(52, 211, 153, 0.4)'
      };
    }
    if (percentage >= 70) {
      return { 
        color: 'var(--accent-warning)', 
        gradient: 'linear-gradient(135deg, #f472b6 0%, #fbbf24 100%)',
        bgGradient: 'linear-gradient(135deg, rgba(244, 114, 182, 0.2) 0%, rgba(251, 191, 36, 0.05) 100%)',
        borderColor: 'rgba(244, 114, 182, 0.4)'
      };
    }
    return { 
      color: 'var(--accent-error)', 
      gradient: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 50%, #f472b6 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(248, 113, 113, 0.2) 0%, rgba(34, 211, 238, 0.05) 100%)',
      borderColor: 'rgba(248, 113, 113, 0.4)'
    };
  };

  const successLevel = getSuccessLevel();

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-card p-8 md:p-12 text-center animate-fadeIn">
          {/* Success Icon */}
          <div className="mb-6">
            <div 
              className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: successLevel.bgGradient,
                border: `1px solid ${successLevel.borderColor}`
              }}
            >
              {percentage >= 90 ? (
                <svg className="w-10 h-10" style={{ color: successLevel.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : percentage >= 70 ? (
                <svg className="w-10 h-10" style={{ color: successLevel.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-10 h-10" style={{ color: successLevel.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--text-primary)]">
            Quiz Results
          </h1>
          
          {/* Score Display */}
          <div className="mb-8">
            <div 
              className="text-6xl md:text-7xl font-bold mb-3"
              style={{ 
                background: successLevel.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {score}
            </div>
            <div className="text-2xl md:text-3xl text-[var(--text-secondary)] font-semibold">
              {percentage}% Accuracy
            </div>
          </div>

          {/* Category Info */}
          <div className="glass-card p-6 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              {categoryIcon && (
                <div className="icon-container w-12 h-12">
                  <svg 
                    className="w-6 h-6 text-[var(--accent-primary)]" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={1.5}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d={categoryIcon} 
                    />
                  </svg>
                </div>
              )}
              <div className="text-left">
                <p className="text-sm text-[var(--text-muted)] mb-1">Category</p>
                <p className="text-lg font-semibold text-[var(--text-primary)]">
                  {categoryLabel}
                </p>
              </div>
            </div>
            {date && (
              <div className="pt-4 border-t border-[var(--border-subtle)]">
                <p className="text-sm text-[var(--text-muted)] mb-1">Date</p>
                <p className="text-base text-[var(--text-secondary)]">
                  {new Date(date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quiz"
              className="glow-button text-lg px-8 py-4 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Try Yourself
            </Link>
            <Link
              href="/"
              className="px-8 py-4 rounded-xl border-2 border-[var(--border-medium)] text-[var(--text-secondary)] font-semibold text-lg hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="spinner mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ShareContent />
    </Suspense>
  );
}

