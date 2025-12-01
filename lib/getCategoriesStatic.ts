import * as fs from 'fs';
import * as path from 'path';
import type { Question } from './types';
import { getCategoriesFromQuestions } from './constants';

/**
 * Gets categories from all.json file at build time for static generation
 * This is used by Next.js generateStaticParams
 */
export function getCategoriesForStaticGeneration(): string[] {
  try {
    const questionsPath = path.join(process.cwd(), 'public', 'questions', 'all.json');
    
    if (!fs.existsSync(questionsPath)) {
      console.warn('all.json not found, using default categories');
      return ['event-loop', 'closures', 'async', 'this', 'coercion', 'prototypes', 'hoisting', 'scope', 'destructuring', 'arrays', 'objects'];
    }

    const content = fs.readFileSync(questionsPath, 'utf-8');
    const questions: Question[] = JSON.parse(content);
    
    if (!Array.isArray(questions)) {
      console.warn('all.json is not a valid array, using default categories');
      return ['event-loop', 'closures', 'async', 'this', 'coercion', 'prototypes', 'hoisting', 'scope', 'destructuring', 'arrays', 'objects'];
    }

    return getCategoriesFromQuestions(questions);
  } catch (error) {
    console.error('Error reading categories for static generation:', error);
    // Fallback to default categories
    return ['event-loop', 'closures', 'async', 'this', 'coercion', 'prototypes', 'hoisting', 'scope', 'destructuring', 'arrays', 'objects'];
  }
}

