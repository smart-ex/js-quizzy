'use client';

import { useCallback } from 'react';
import type { QuizSession, UserStats, Question, User } from './types';
import { STORAGE_KEYS, DATA_VERSION } from './constants';
import { initializeStats, updateStatsFromSession, logger } from './utils';

export function useStorage() {
  const getAllSessions = useCallback((): QuizSession[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      logger.error('Error reading sessions:', error);
      return [];
    }
  }, []);

  const saveSession = useCallback((session: QuizSession): void => {
    try {
      const existing = getAllSessions();
      existing.push(session);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(existing));
    } catch (error) {
      logger.error('Error saving session:', error);
      throw error;
    }
  }, [getAllSessions]);

  const getSessionsByCategory = useCallback((category: string): QuizSession[] => {
    return getAllSessions().filter(s => s.category === category);
  }, [getAllSessions]);

  const getStats = useCallback((): UserStats => {
    if (typeof window === 'undefined') {
      return initializeStats();
    }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (!data) {
        const initial = initializeStats();
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch (error) {
      logger.error('Error reading stats:', error);
      return initializeStats();
    }
  }, []);

  const updateStats = useCallback((session: QuizSession, questions: Question[]): void => {
    try {
      const currentStats = getStats();
      const updatedStats = updateStatsFromSession(currentStats, session, questions);
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));
    } catch (error) {
      logger.error('Error updating stats:', error);
    }
  }, [getStats]);

  const saveQuestions = useCallback((questions: Question[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
      localStorage.setItem(STORAGE_KEYS.DATA_VERSION, DATA_VERSION);
    } catch (error) {
      logger.error('Error saving questions:', error);
      throw error;
    }
  }, []);

  const getCachedQuestions = useCallback((): Question[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      logger.error('Error reading cached questions:', error);
      return null;
    }
  }, []);

  const getDataVersion = useCallback((): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
    } catch (error) {
      logger.error('Error reading data version:', error);
      return null;
    }
  }, []);

  const saveUser = useCallback((user: User): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      logger.error('Error saving user:', error);
      throw error;
    }
  }, []);

  const getUser = useCallback((): User | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      logger.error('Error reading user:', error);
      return null;
    }
  }, []);

  const clearAllData = useCallback((): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      logger.error('Error clearing data:', error);
    }
  }, []);

  const checkStorageQuota = useCallback((): Promise<{ available: number; used: number; quota: number } | null> => {
    if (typeof Storage === 'undefined' || !('estimate' in navigator.storage)) {
      return Promise.resolve(null);
    }

    return navigator.storage.estimate().then(estimate => {
      if (!estimate.quota || !estimate.usage) return null;
      return {
        quota: estimate.quota,
        used: estimate.usage,
        available: estimate.quota - estimate.usage,
      };
    });
  }, []);

  return {
    saveSession,
    getAllSessions,
    getSessionsByCategory,
    getStats,
    updateStats,
    saveQuestions,
    getCachedQuestions,
    getDataVersion,
    saveUser,
    getUser,
    clearAllData,
    checkStorageQuota,
  };
}

