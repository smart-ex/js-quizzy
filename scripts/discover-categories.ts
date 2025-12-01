import * as fs from 'fs';
import * as path from 'path';

const QUESTIONS_DIR = path.join(process.cwd(), 'public', 'questions');

/**
 * Discovers all category files in the questions directory
 * Returns array of category names (without .json extension)
 */
export function discoverCategories(): string[] {
  if (!fs.existsSync(QUESTIONS_DIR)) {
    console.warn(`Questions directory not found: ${QUESTIONS_DIR}`);
    return [];
  }

  const files = fs.readdirSync(QUESTIONS_DIR);
  const categories = files
    .filter(file => file.endsWith('.json') && file !== 'all.json')
    .map(file => file.replace('.json', ''))
    .sort();

  return categories;
}

if (require.main === module) {
  const categories = discoverCategories();
  console.log('Discovered categories:', categories.join(', '));
  console.log(`Total: ${categories.length} categories`);
}

