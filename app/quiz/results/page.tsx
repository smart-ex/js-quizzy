'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResultsPanel } from '@/components/ResultsPanel';
import { Navigation } from '@/components/Navigation';
import { useStorage } from '@/lib/useStorage';
import { useQuestions } from '@/lib/useQuestions';
import type { QuizSession } from '@/lib/types';

export default function ResultsPage() {
  const router = useRouter();
  const { getAllSessions } = useStorage();
  const { questions } = useQuestions();
  const session = useState<QuizSession | null>(() => {
    const sessions = getAllSessions();
    if (sessions.length === 0) {
      return null;
    }
    return sessions.sort((a, b) => b.date - a.date)[0];
  })[0];

  useEffect(() => {
    if (!session) {
      router.push('/quiz');
      return;
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <ResultsPanel session={session} questions={questions} />
    </div>
  );
}

