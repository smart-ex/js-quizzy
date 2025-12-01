# Questions Format

This directory contains JavaScript quiz questions organized by category.

## File Structure

- `[category].json` - Questions for a specific category
- `all.json` - Aggregated questions from all categories (generated)

## Question Format

Each question file is a JSON array of question objects:

```json
{
  "id": "unique_question_id",
  "category": "event-loop | closures | async | this | coercion | prototypes",
  "difficulty": "easy | medium | hard",
  "type": "multiple-choice | code-output | fill-gap",
  "title": "Short descriptive title",
  "question": "The question text",
  "code": "Optional code snippet (for code-output type)",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": 0,
  "explanation": "Why this answer is correct",
  "tags": ["tag1", "tag2"],
  "difficulty_votes": { "up": 0, "down": 0 },
  "created_at": 1733046000000,
  "author": "optional-github-username"
}
```

## Categories

Categories are **automatically discovered** from JSON files in this directory. Simply create a new `[category-name].json` file with questions, and it will be automatically included!

### Adding a New Category

1. Create a new JSON file named `[category-name].json` (e.g., `promises.json`)
2. Add questions following the format above
3. Make sure each question has `"category": "category-name"` matching the filename
4. Run `npm run generate-questions` to update `all.json`
5. The new category will automatically appear in the app!

### Default Categories

The app includes these default categories with labels and descriptions:
- `event-loop` - Event loop, call stack, task queues
- `closures` - Lexical scoping, closures, memory
- `async` - Promises, async/await, asynchronous patterns
- `this` - Context binding, arrow functions, method invocation
- `coercion` - Type conversion, truthy/falsy, implicit conversions
- `prototypes` - Prototype chain, inheritance, OOP patterns
- `hoisting` - Variable and function hoisting
- `scope` - Block, function, and global scope
- `destructuring` - Object and array destructuring
- `arrays` - Array methods and iteration
- `objects` - Object manipulation and properties

New categories will automatically get formatted labels (e.g., `my-category` → `My Category`).

## Validation

Run `npm run validate-questions` to validate all question files against the schema. This will automatically discover all category files.

## Generating all.json

Run `npm run generate-questions` to merge all category files into `all.json`. This script automatically discovers all category files in the directory.

