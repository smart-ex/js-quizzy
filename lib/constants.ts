import type { Category, Question } from './types';

export const STORAGE_KEYS = {
  SESSIONS: 'js_quiz_sessions',
  STATS: 'js_quiz_stats',
  QUESTIONS: 'js_quiz_questions',
  DATA_VERSION: 'js_quiz_data_version',
  USER: 'js_quiz_user',
  PREFERENCES: 'js_quiz_preferences',
} as const;

// Default categories for backwards compatibility and fallback
const DEFAULT_CATEGORIES: Category[] = [
  'event-loop',
  'closures',
  'async',
  'this',
  'coercion',
  'prototypes',
  'hoisting',
  'scope',
  'destructuring',
  'arrays',
  'objects',
];

// Category labels mapping
export const CATEGORY_LABELS: Record<string, string> = {
  'event-loop': 'Event Loop',
  closures: 'Closures',
  async: 'Async/Await',
  this: 'This Binding',
  coercion: 'Type Coercion',
  prototypes: 'Prototypes',
  hoisting: 'Hoisting',
  scope: 'Scope',
  destructuring: 'Destructuring',
  arrays: 'Arrays',
  objects: 'Objects',
};

// Category descriptions mapping
export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'event-loop': 'Understanding JavaScript event loop, call stack, and task queues',
  closures: 'Lexical scoping, closure patterns, and memory management',
  async: 'Promises, async/await, and asynchronous programming',
  this: 'Context binding, arrow functions, and method invocation',
  coercion: 'Type conversion, truthy/falsy values, and implicit conversions',
  prototypes: 'Prototype chain, inheritance, and object-oriented patterns',
  hoisting: 'Variable and function hoisting, temporal dead zone',
  scope: 'Block, function, and global scope, scope chain',
  destructuring: 'Object and array destructuring, rest/spread patterns',
  arrays: 'Array methods, iteration, and common gotchas',
  objects: 'Object manipulation, property descriptors, and edge cases',
};

/**
 * Discovers unique categories from questions array
 */
export function getCategoriesFromQuestions(questions: Question[]): Category[] {
  const categories = new Set<Category>();
  questions.forEach(q => {
    if (q.category) {
      categories.add(q.category);
    }
  });
  return Array.from(categories).sort();
}

/**
 * Gets categories - uses questions if provided, otherwise returns default categories
 * This allows dynamic category discovery at runtime
 */
export function getCategories(questions?: Question[]): Category[] {
  if (questions && questions.length > 0) {
    return getCategoriesFromQuestions(questions);
  }
  return DEFAULT_CATEGORIES;
}

/**
 * Gets category label with fallback to formatted category name
 */
export function getCategoryLabel(category: Category): string {
  return CATEGORY_LABELS[category] || formatCategoryName(category);
}

/**
 * Gets category description with fallback
 */
export function getCategoryDescription(category: Category): string {
  return CATEGORY_DESCRIPTIONS[category] || `Questions about ${formatCategoryName(category)}`;
}

/**
 * Formats a category name (e.g., "event-loop" -> "Event Loop")
 */
function formatCategoryName(category: Category): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Export default categories for backwards compatibility
export const CATEGORIES = DEFAULT_CATEGORIES;

export const DATA_VERSION = '1.0.1';

export const QUESTIONS_PER_QUIZ = 10;

export const QUIZ_TIMER_DEFAULT = 600; // 10 minutes in seconds

