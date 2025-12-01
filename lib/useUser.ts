'use client';

import { useCallback } from 'react';
import type { User, QuizSession } from './types';
import { useStorage } from './useStorage';

function generateUserId(): string {
  // Generate a hash-based ID (12 characters)
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return (timestamp + random).substr(0, 12);
}

function generateUserName(userId: string): string {
  return `User${userId.substr(0, 4).toUpperCase()}`;
}

export function useUser() {
  const { getUser, saveUser } = useStorage();

  const getOrCreateUser = useCallback((): User => {
    let user = getUser();

    if (!user) {
      const id = generateUserId();
      user = {
        id,
        name: generateUserName(id),
        isVerified: false,
        createdAt: Date.now(),
      };
      saveUser(user);
    }

    return user;
  }, [getUser, saveUser]);

  const getShareUrl = useCallback((session: QuizSession): string => {
    const user = getOrCreateUser();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const params = new URLSearchParams({
      user: user.id,
      score: `${session.score}/${session.answers.length}`,
      category: session.category,
      date: new Date(session.date).toISOString().split('T')[0],
    });
    return `${origin}${basePath}/share?${params.toString()}`;
  }, [getOrCreateUser]);

  return {
    getOrCreateUser,
    getShareUrl,
    getUser,
  };
}

