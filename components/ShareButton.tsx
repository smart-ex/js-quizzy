'use client';

import { useState } from 'react';
import type { QuizSession } from '@/lib/types';
import { useUser } from '@/lib/useUser';

interface ShareButtonProps {
  session: QuizSession;
}

export function ShareButton({ session }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const { getShareUrl } = useUser();
  const shareUrl = getShareUrl(session);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={shareUrl}
        readOnly
        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 text-sm"
      />
      <button
        onClick={handleCopy}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}

