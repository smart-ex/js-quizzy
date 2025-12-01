# Contributing to JS Quizzy

Thank you for your interest in contributing to JS Quizzy! This document provides guidelines for contributing questions and code.

## Adding Questions

The easiest way to contribute is by adding new questions. Questions are stored in JSON files in `public/questions/`.

### Process

1. **Fork the repository**
2. **Create a new branch** for your questions
3. **Add questions** to the appropriate category file (e.g., `public/questions/event-loop.json`)
4. **Validate your questions** by running:
   ```bash
   npm run validate-questions
   ```
5. **Generate all.json**:
   ```bash
   npm run generate-questions
   ```
6. **Submit a Pull Request**

### Question Guidelines

- Each question should test a specific JavaScript concept
- Include clear explanations
- Use appropriate difficulty levels (easy, medium, hard)
- Ensure code examples are correct and runnable
- Add relevant tags for categorization

See [QUESTION_FORMAT.md](./QUESTION_FORMAT.md) for the complete question schema.

## Code Contributions

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Ensure all code is client-side compatible (no server-side code)
- Test offline functionality

### Testing

- Test questions in the quiz interface
- Verify offline functionality
- Check responsive design on mobile/tablet/desktop

## Pull Request Process

1. Ensure your code follows the project structure
2. Run validation scripts
3. Test locally
4. Submit PR with a clear description
5. Respond to feedback

## Question Categories

- **event-loop**: Event loop, call stack, task queues
- **closures**: Lexical scoping, closures, memory
- **async**: Promises, async/await, asynchronous patterns
- **this**: Context binding, arrow functions, method invocation
- **coercion**: Type conversion, truthy/falsy, implicit conversions
- **prototypes**: Prototype chain, inheritance, OOP patterns

## Getting Help

If you have questions, please open an issue on GitHub.

