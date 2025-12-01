'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Question, Category } from './types';
import { useStorage } from './useStorage';
import { DATA_VERSION } from './constants';
import { logger } from './utils';

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const { getCachedQuestions, saveQuestions, getDataVersion } = useStorage();

  const loadQuestions = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Check if we have cached questions and they're up to date
      const cachedVersion = getDataVersion();
      const cached = getCachedQuestions();

      if (cached && cachedVersion === DATA_VERSION) {
        setQuestions(cached);
        setLoading(false);
        setIsOffline(false);
        return;
      }

      // Try to fetch from network
      try {
        const response = await fetch('/questions/all.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Question[] = await response.json();
        
        // Validate we got an array
        if (!Array.isArray(data)) {
          throw new Error('Invalid questions format');
        }

        setQuestions(data);
        saveQuestions(data);
        setIsOffline(false);
      } catch {
        // Network error, try to use cache
        setIsOffline(true);
        
        if (cached && cached.length > 0) {
          setQuestions(cached);
          logger.warn('Using cached questions due to network error');
        } else {
          throw new Error('No cached questions available and network request failed');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      logger.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  }, [getCachedQuestions, saveQuestions, getDataVersion]);

  const refreshQuestions = useCallback(async (): Promise<void> => {
    // Force refresh by clearing cache version
    try {
      const response = await fetch('/questions/all.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Question[] = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid questions format');
      }

      setQuestions(data);
      saveQuestions(data);
      setIsOffline(false);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  }, [saveQuestions]);

  const getQuestionsByCategory = useCallback((category: Category): Question[] => {
    return questions.filter(q => q.category === category);
  }, [questions]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  return {
    questions,
    loading,
    error,
    isOffline,
    loadQuestions,
    refreshQuestions,
    getQuestionsByCategory,
  };
}

