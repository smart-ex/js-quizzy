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

      // Update meta tags for social sharing
      if (valid) {
        const percentage = Math.round((correct / total) * 100);
        const categoryLabel = CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category;
        const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        
        // Update document title
        document.title = `Scored ${score} (${percentage}%) on ${categoryLabel} Quiz - JS Quizzy`;
        
        // Update or create meta tags
        const updateMetaTag = (property: string, content: string) => {
          let meta = document.querySelector(`meta[property="${property}"]`) || 
                     document.querySelector(`meta[name="${property}"]`);
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', content);
        };

        const description = `I scored ${score} (${percentage}%) on ${categoryLabel} quiz! Can you beat my score?`;
        
        updateMetaTag('og:title', `Scored ${score} (${percentage}%) on ${categoryLabel} Quiz`);
        updateMetaTag('og:description', description);
        updateMetaTag('og:type', 'website');
        updateMetaTag('og:url', typeof window !== 'undefined' ? window.location.href : '');
        updateMetaTag('og:image', `${siteUrl}${basePath}/og-image.png`);
        
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', `Scored ${score} (${percentage}%) on ${categoryLabel} Quiz`);
        updateMetaTag('twitter:description', description);
        updateMetaTag('twitter:image', `${siteUrl}${basePath}/og-image.png`);
      }
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

  // Get emoji based on performance
  const getPerformanceEmoji = () => {
    if (percentage >= 90) return '🎉';
    if (percentage >= 70) return '👍';
    if (percentage >= 50) return '💪';
    return '📚';
  };

  const performanceEmoji = getPerformanceEmoji();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex items-center">
        <div className="glass-card p-6 md:p-8 text-center animate-fadeInUp w-full">
          {/* Compact Header with Emoji and Icon */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-5xl">{performanceEmoji}</div>
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
              style={{
                background: successLevel.bgGradient,
                border: `2px solid ${successLevel.borderColor}`
              }}
            >
              {percentage >= 90 ? (
                <svg className="w-8 h-8" style={{ color: successLevel.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : percentage >= 70 ? (
                <svg className="w-8 h-8" style={{ color: successLevel.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" style={{ color: successLevel.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-[var(--text-primary)]">
            Quiz Results
          </h1>
          
          {/* Compact Score Display with Circular Progress */}
          <div className="mb-4 relative inline-block">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="var(--bg-tertiary)"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke={successLevel.color}
                  strokeWidth="8"
                  strokeDasharray={`${percentage * 3.52} 352`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div 
                  className="text-3xl md:text-4xl font-bold mb-0.5"
                  style={{ 
                    background: successLevel.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {score}
                </div>
                <div className="text-sm text-[var(--text-muted)] font-medium">
                  {percentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Compact Challenge Section */}
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/5 border-2 border-[var(--accent-primary)]/20">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">
              🎯 Challenge Your Friends!
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-2">
              Share this result and see if they can beat your score of <span className="font-bold text-[var(--accent-primary)]">{score}</span>!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
              {categoryIcon && (
                <div className="icon-container w-6 h-6">
                  <svg 
                    className="w-4 h-4 text-[var(--accent-primary)]" 
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
              <span className="px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)]">
                {categoryLabel}
              </span>
              {date && (
                <span className="px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)]">
                  {new Date(date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Compact Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link
              href={`/quiz/${category}`}
              className="glow-button text-base px-6 py-3 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Try This Quiz
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl border-2 border-[var(--border-medium)] text-[var(--text-secondary)] font-semibold text-base hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

