'use client';

import { create } from 'zustand';
import type { QuizSession, Question, Category } from './types';
import { generateId } from './utils';
import { QUESTIONS_PER_QUIZ } from './constants';

interface QuizState {
  currentSession: QuizSession | null;
  currentQuestionIndex: number;
  answers: Map<string, number>;
  startTime: number | null;
  elapsedTime: number;
  isActive: boolean;

  startQuiz: (questions: Question[], category: string) => void;
  selectAnswer: (questionId: string, answerIndex: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  updateTimer: () => void;
  endQuiz: () => QuizSession | null;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  currentSession: null,
  currentQuestionIndex: 0,
  answers: new Map(),
  startTime: null,
  elapsedTime: 0,
  isActive: false,

  startQuiz: (questions: Question[], category: string) => {
    // Validate input
    if (!questions || questions.length === 0) {
      console.warn('startQuiz called with empty questions array');
      return;
    }

    // For comprehensive quiz, use all questions (up to 20, already limited by ComprehensiveQuizClient)
    // For category quizzes, limit to QUESTIONS_PER_QUIZ (10)
    const maxQuestions = category === 'comprehensive' 
      ? questions.length 
      : Math.min(QUESTIONS_PER_QUIZ, questions.length);
    const selectedQuestions = questions.slice(0, maxQuestions);
    const session: QuizSession = {
      id: generateId(),
      date: Date.now(),
      category: category as Category,
      questions: selectedQuestions.map(q => q.id),
      answers: [],
      score: 0,
      totalTime: 0,
    };

    set({
      currentSession: session,
      currentQuestionIndex: 0,
      answers: new Map(),
      startTime: Date.now(),
      elapsedTime: 0,
      isActive: true,
    });
  },

  selectAnswer: (questionId: string, answerIndex: number) => {
    set(state => {
      const newAnswers = new Map(state.answers);
      newAnswers.set(questionId, answerIndex);
      return { answers: newAnswers };
    });
  },

  nextQuestion: () => {
    set(state => {
      if (state.currentSession && state.currentQuestionIndex < state.currentSession.questions.length - 1) {
        return { currentQuestionIndex: state.currentQuestionIndex + 1 };
      }
      return state;
    });
  },

  previousQuestion: () => {
    set(state => {
      if (state.currentQuestionIndex > 0) {
        return { currentQuestionIndex: state.currentQuestionIndex - 1 };
      }
      return state;
    });
  },

  goToQuestion: (index: number) => {
    set(state => {
      if (!state.currentSession) return state;
      const maxIndex = state.currentSession.questions.length - 1;
      if (index >= 0 && index <= maxIndex) {
        return { currentQuestionIndex: index };
      }
      return state;
    });
  },

  updateTimer: () => {
    set(state => {
      if (state.startTime && state.isActive) {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        return { elapsedTime: elapsed };
      }
      return state;
    });
  },

  endQuiz: () => {
    const state = get();
    if (!state.currentSession) return null;

    const session = { ...state.currentSession };
    const questions = session.questions;
    
    // Build answers array with correctness
    session.answers = questions.map((questionId) => {
      const userAnswer = state.answers.get(questionId) ?? -1;
      // We'll need to check correctness when we have access to questions
      // For now, we'll mark it and update later
      return {
        questionId,
        userAnswer,
        correct: false, // Will be updated when we have question data
        timeSpent: 0, // Could track per-question time if needed
      };
    });

    session.totalTime = state.elapsedTime;
    session.score = 0; // Will be calculated when we have question data

    set({
      isActive: false,
      startTime: null,
    });

    return session;
  },

  reset: () => {
    set({
      currentSession: null,
      currentQuestionIndex: 0,
      answers: new Map(),
      startTime: null,
      elapsedTime: 0,
      isActive: false,
    });
  },
}));

