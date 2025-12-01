import * as fs from 'fs';
import * as path from 'path';
import { discoverCategories } from './discover-categories';

const QUESTIONS_DIR = path.join(process.cwd(), 'public', 'questions');

interface QuestionData {
  id?: string;
  category?: string;
  difficulty?: string;
  type?: string;
  title?: string;
  question?: string;
  code?: string;
  options?: unknown;
  correctAnswer?: number;
  explanation?: string;
  tags?: unknown;
  created_at?: unknown;
}

function validateQuestion(question: QuestionData, index: number, file: string, validCategories: string[]): string[] {
  const errors: string[] = [];
  const required = ['id', 'category', 'difficulty', 'type', 'title', 'question', 'options', 'correctAnswer', 'explanation', 'tags', 'created_at'];
  
  for (const field of required) {
    if (!(field in question)) {
      errors.push(`${file}[${index}]: Missing required field '${field}'`);
    }
  }

  if (question.category && !validCategories.includes(question.category)) {
    errors.push(`${file}[${index}]: Invalid category '${question.category}'. Valid categories: ${validCategories.join(', ')}`);
  }

  if (question.difficulty && !['easy', 'medium', 'hard'].includes(question.difficulty)) {
    errors.push(`${file}[${index}]: Invalid difficulty '${question.difficulty}'`);
  }

  if (question.type && !['multiple-choice', 'code-output', 'fill-gap'].includes(question.type)) {
    errors.push(`${file}[${index}]: Invalid type '${question.type}'`);
  }

  if (question.options && !Array.isArray(question.options)) {
    errors.push(`${file}[${index}]: 'options' must be an array`);
  }

  if (question.options && Array.isArray(question.options) && question.options.length !== 4) {
    errors.push(`${file}[${index}]: 'options' must have exactly 4 items`);
  }

  if (question.correctAnswer !== undefined && (question.correctAnswer < 0 || question.correctAnswer > 3)) {
    errors.push(`${file}[${index}]: 'correctAnswer' must be between 0 and 3`);
  }

  if (question.type === 'code-output' && !question.code) {
    errors.push(`${file}[${index}]: 'code-output' type requires 'code' field`);
  }

  return errors;
}

function validateFile(filePath: string, validCategories: string[]): string[] {
  const errors: string[] = [];
  const fileName = path.basename(filePath);

  if (!fs.existsSync(filePath)) {
    return [`File not found: ${filePath}`];
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const questions: QuestionData[] = JSON.parse(content);

    if (!Array.isArray(questions)) {
      return [`${fileName}: File must contain a JSON array`];
    }

    if (questions.length === 0) {
      errors.push(`${fileName}: File is empty`);
    }

    questions.forEach((question, index) => {
      errors.push(...validateQuestion(question, index, fileName, validCategories));
    });

    // Check for duplicate IDs
    const ids = questions.map(q => q.id).filter(Boolean);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length > 0) {
      errors.push(`${fileName}: Duplicate question IDs: ${[...new Set(duplicates)].join(', ')}`);
    }

  } catch (error) {
    if (error instanceof SyntaxError) {
      errors.push(`${fileName}: Invalid JSON - ${error.message}`);
    } else {
      errors.push(`${fileName}: Error reading file - ${error}`);
    }
  }

  return errors;
}

function main() {
  console.log('Validating question files...\n');

  // Discover categories dynamically
  const CATEGORIES = discoverCategories();
  console.log(`Discovered ${CATEGORIES.length} categories: ${CATEGORIES.join(', ')}\n`);

  const allErrors: string[] = [];

  // Validate category files
  for (const category of CATEGORIES) {
    const filePath = path.join(QUESTIONS_DIR, `${category}.json`);
    const errors = validateFile(filePath, CATEGORIES);
    allErrors.push(...errors);
    if (errors.length === 0) {
      console.log(`✓ ${category}.json`);
    }
  }

  // Validate all.json if it exists
  const allJsonPath = path.join(QUESTIONS_DIR, 'all.json');
  if (fs.existsSync(allJsonPath)) {
    const errors = validateFile(allJsonPath, CATEGORIES);
    allErrors.push(...errors);
    if (errors.length === 0) {
      console.log(`✓ all.json`);
    }
  }

  console.log('');

  if (allErrors.length > 0) {
    console.error('Validation failed:\n');
    allErrors.forEach(error => console.error(`  ✗ ${error}`));
    process.exit(1);
  } else {
    console.log('All question files are valid! ✓');
    process.exit(0);
  }
}

main();

