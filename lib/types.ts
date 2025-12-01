// Category is now a string type to support dynamic categories
// Categories are discovered from question files at runtime
export type Category = string;

export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuestionType = 'multiple-choice' | 'code-output' | 'fill-gap';

export interface Question {
  id: string;
  category: Category;
  difficulty: Difficulty;
  type: QuestionType;
  title: string;
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  tags: string[];
  difficulty_votes?: {
    up: number;
    down: number;
  };
  created_at: number;
  author?: string;
}

export interface QuizSession {
  id: string;
  date: number;
  category: Category;
  questions: string[];
  answers: {
    questionId: string;
    userAnswer: number;
    correct: boolean;
    timeSpent: number;
  }[];
  score: number;
  totalTime: number;
}

export interface UserStats {
  totalQuizzes: number;
  totalCorrect: number;
  totalTime: number;
  byCategory: {
    [key in Category]: {
      attempted: number;
      correct: number;
      avgTime: number;
    };
  };
  difficulties: {
    easy: {
      attempted: number;
      correct: number;
    };
    medium: {
      attempted: number;
      correct: number;
    };
    hard: {
      attempted: number;
      correct: number;
    };
  };
  streak: number;
  lastQuizDate: number;
}

export interface User {
  id: string;
  name: string;
  isVerified: boolean;
  githubId?: string;
  githubUsername?: string;
  avatar?: string;
  createdAt: number;
}

export interface LeaderboardEntry {
  user: string;
  userId: string;
  score: number;
  total: number;
  category: Category;
  date: number;
  githubUsername?: string;
}

export interface Leaderboard {
  daily: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
  allTime: LeaderboardEntry[];
}

