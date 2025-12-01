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

// Category icons (SVG paths) - used with viewBox="0 0 24 24"
export const CATEGORY_ICONS: Record<string, string> = {
  'event-loop': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', // Clock
  closures: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', // Lock
  async: 'M13 10V3L4 14h7v7l9-11h-7z', // Lightning
  this: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122', // Cursor click
  coercion: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', // Arrows
  prototypes: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z', // Template
  hoisting: 'M7 11l5-5m0 0l5 5m-5-5v12', // Arrow up
  scope: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', // Grid
  destructuring: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z', // Duplicate
  arrays: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', // Collection
  objects: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', // Cube
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

