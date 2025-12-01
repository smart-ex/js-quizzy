'use client';

import { useState, useEffect } from 'react';
import type { QuizSession } from '@/lib/types';
import { useUser } from '@/lib/useUser';

interface ShareButtonProps {
  session: QuizSession;
}

export function ShareButton({ session }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const { getShareUrl } = useUser();

  useEffect(() => {
    getShareUrl(session).then(url => {
      setShareUrl(url);
      setLoading(false);
    });
  }, [session, getShareUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share && shareUrl) {
      try {
        const accuracy = Math.round((session.answers.filter(a => a.correct).length / session.answers.length) * 100);
        await navigator.share({
          title: `I scored ${accuracy}% on JS Quizzy!`,
          text: `I scored ${session.answers.filter(a => a.correct).length}/${session.answers.length} on ${session.category} quiz. Can you beat my score?`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }
  };

  const canUseNativeShare = typeof navigator !== 'undefined' && 'share' in navigator && shareUrl;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          type="text"
          value={loading ? 'Generating link...' : shareUrl}
          readOnly
          disabled={loading}
          className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg border border-[var(--border-subtle)] text-sm font-mono focus:outline-none focus:border-[var(--accent-primary)] disabled:opacity-50"
        />
        <button
          onClick={handleCopy}
          disabled={loading || !shareUrl}
          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 flex-shrink-0 ${
            copied
              ? 'bg-[var(--accent-success)] text-white'
              : 'bg-[var(--accent-primary)] text-white hover:shadow-lg hover:shadow-[var(--accent-primary)]/25'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </>
          )}
        </button>
      </div>
      {canUseNativeShare && (
        <button
          onClick={handleNativeShare}
          className="w-full px-6 py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white hover:shadow-lg hover:shadow-[var(--accent-primary)]/25 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share via...
        </button>
      )}
    </div>
  );
}
