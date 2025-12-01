import * as fs from 'fs';
import * as path from 'path';
import type { Question } from '../lib/types';
import { discoverCategories } from './discover-categories';

const QUESTIONS_DIR = path.join(process.cwd(), 'public', 'questions');
const OUTPUT_FILE = path.join(QUESTIONS_DIR, 'all.json');

function main() {
  console.log('Generating all.json...\n');

  // Discover categories dynamically from files
  const CATEGORIES = discoverCategories();
  
  if (CATEGORIES.length === 0) {
    console.error('No category files found in questions directory!');
    process.exit(1);
  }

  console.log(`Discovered ${CATEGORIES.length} categories: ${CATEGORIES.join(', ')}\n`);

  const allQuestions: Question[] = [];

  for (const category of CATEGORIES) {
    const filePath = path.join(QUESTIONS_DIR, `${category}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: ${category}.json not found, skipping...`);
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const questions: Question[] = JSON.parse(content);
      allQuestions.push(...questions);
      console.log(`✓ Loaded ${questions.length} questions from ${category}.json`);
    } catch (error) {
      console.error(`Error reading ${category}.json:`, error);
      process.exit(1);
    }
  }

  // Sort by category and created_at
  allQuestions.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.created_at - b.created_at;
  });

  try {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allQuestions, null, 2), 'utf-8');
    console.log(`\n✓ Generated all.json with ${allQuestions.length} total questions`);
  } catch (error) {
    console.error('Error writing all.json:', error);
    process.exit(1);
  }
}

main();

