import type { QuizSession, UserStats, Question } from './types';
import { getCategories } from './constants';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function calculateScore(session: QuizSession): number {
  return session.answers.filter(a => a.correct).length;
}

export function calculateAccuracy(session: QuizSession): number {
  if (session.answers.length === 0) return 0;
  const correct = session.answers.filter(a => a.correct).length;
  return Math.round((correct / session.answers.length) * 100);
}

export function initializeStats(questions?: Question[]): UserStats {
  const byCategory: UserStats['byCategory'] = {} as UserStats['byCategory'];
  const categories = getCategories(questions);
  
  for (const category of categories) {
    byCategory[category] = {
      attempted: 0,
      correct: 0,
      avgTime: 0,
    };
  }

  return {
    totalQuizzes: 0,
    totalCorrect: 0,
    totalTime: 0,
    byCategory,
    difficulties: {
      easy: { attempted: 0, correct: 0 },
      medium: { attempted: 0, correct: 0 },
      hard: { attempted: 0, correct: 0 },
    },
    streak: 0,
    lastQuizDate: 0,
  };
}

export function updateStatsFromSession(stats: UserStats, session: QuizSession, questions: Question[]): UserStats {
  const newStats = { ...stats };
  
  newStats.totalQuizzes += 1;
  newStats.totalCorrect += session.score;
  newStats.totalTime += session.totalTime;

  // Update category stats
  if (!newStats.byCategory[session.category]) {
    newStats.byCategory[session.category] = {
      attempted: 0,
      correct: 0,
      avgTime: 0,
    };
  }
  const categoryStats = newStats.byCategory[session.category];
  categoryStats.attempted += 1;
  categoryStats.correct += session.score;
  const avgTime = (categoryStats.avgTime * (categoryStats.attempted - 1) + session.totalTime) / categoryStats.attempted;
  categoryStats.avgTime = Math.round(avgTime);

  // Update difficulty stats
  for (const answer of session.answers) {
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      const diffStats = newStats.difficulties[question.difficulty];
      diffStats.attempted += 1;
      if (answer.correct) {
        diffStats.correct += 1;
      }
    }
  }

  // Update streak
  const today = new Date().setHours(0, 0, 0, 0);
  const lastDate = new Date(newStats.lastQuizDate).setHours(0, 0, 0, 0);
  const daysDiff = (today - lastDate) / (1000 * 60 * 60 * 24);

  if (daysDiff === 0) {
    // Same day, keep streak
  } else if (daysDiff === 1) {
    // Consecutive day, increment streak
    newStats.streak += 1;
  } else {
    // Streak broken, reset to 1
    newStats.streak = 1;
  }

  newStats.lastQuizDate = Date.now();

  return newStats;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomQuestions(questions: Question[], count: number): Question[] {
  return shuffleArray(questions).slice(0, count);
}

export function checkStorageQuota(): { available: number; used: number; quota: number } | null {
  if (typeof Storage === 'undefined' || !('estimate' in navigator.storage)) {
    return null;
  }

  // This is async, but we'll return a promise-based version if needed
  // For now, return null and handle gracefully
  return null;
}

/**
 * Logger utility that only logs in development mode
 */
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  error: (...args: unknown[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
};

