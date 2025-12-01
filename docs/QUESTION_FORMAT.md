# Question Format Documentation

This document describes the JSON schema for quiz questions.

## Question Object Schema

```typescript
interface Question {
  id: string;                    // Unique identifier (e.g., "q1_event_loop_basics")
  category: Category;             // One of: event-loop, closures, async, this, coercion, prototypes
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple-choice' | 'code-output' | 'fill-gap';
  title: string;                  // Short descriptive title
  question: string;               // The question text
  code?: string;                  // Code snippet (required for code-output type)
  options: string[];              // Exactly 4 answer options
  correctAnswer: number;         // Index of correct answer (0-3)
  explanation: string;            // Why this answer is correct
  tags: string[];                 // Array of tags for categorization
  difficulty_votes?: {            // Optional community voting
    up: number;
    down: number;
  };
  created_at: number;             // Unix timestamp
  author?: string;                // GitHub username (optional)
}
```

## Example Question

```json
{
  "id": "q1_event_loop_basics",
  "category": "event-loop",
  "difficulty": "easy",
  "type": "code-output",
  "title": "Event Loop Basics",
  "question": "What will be logged to the console?",
  "code": "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nconsole.log('3');",
  "options": [
    "1, 2, 3",
    "1, 3, 2",
    "2, 1, 3",
    "3, 1, 2"
  ],
  "correctAnswer": 1,
  "explanation": "Synchronous code (console.log) runs first. setTimeout callbacks go to the macrotask queue and execute after the call stack is empty.",
  "tags": ["event-loop", "setTimeout", "timing"],
  "created_at": 1733046000000
}
```

## Question Types

### multiple-choice
Standard multiple choice question. No `code` field required.

### code-output
Question asks what the output of code will be. `code` field is required.

### fill-gap
Question with a code snippet missing a part. `code` field should include a placeholder.

## Categories

- `event-loop`: Event loop, call stack, task queues
- `closures`: Lexical scoping, closures, memory management
- `async`: Promises, async/await, asynchronous programming
- `this`: Context binding, arrow functions, method invocation
- `coercion`: Type conversion, truthy/falsy, implicit conversions
- `prototypes`: Prototype chain, inheritance, OOP patterns

## Validation Rules

- `id` must be unique across all questions
- `options` must have exactly 4 items
- `correctAnswer` must be between 0 and 3
- `code` is required for `code-output` type
- `created_at` should be a valid Unix timestamp
- All required fields must be present

## Validation

Run the validation script to check your questions:

```bash
npm run validate-questions
```

This will check:
- Required fields are present
- Correct data types
- Valid category, difficulty, and type values
- Unique question IDs
- Proper JSON format

