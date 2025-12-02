# JS Quizzy

A 100% open source, offline-first Progressive Web App (PWA) for testing your JavaScript knowledge. Focus on deep concepts like event loop, closures, async/await, this binding, type coercion, prototypes, ES2025 features, and more.

## Features

- **Offline-First**: Works completely offline after first visit
- **310+ Questions**: Covering 12 core JavaScript categories including ES2025
- **PWA Support**: Installable on mobile and desktop
- **Statistics Tracking**: Track your progress and performance
- **Share Results**: Share your quiz results with friends
- **No Backend**: 100% client-side, no server required
- **GitHub Pages Ready**: Deploy to GitHub Pages with one click

## Categories

| Category | Description |
|----------|-------------|
| **Event Loop** | Understanding JavaScript event loop, call stack, and task queues |
| **Closures** | Lexical scoping, closure patterns, and memory management |
| **Async/Await** | Promises, async/await, and asynchronous programming |
| **This Binding** | Context binding, arrow functions, and method invocation |
| **Type Coercion** | Type conversion, truthy/falsy values, and implicit conversions |
| **Prototypes** | Prototype chain, inheritance, and object-oriented patterns |
| **Hoisting** | Variable and function hoisting, temporal dead zone |
| **Scope** | Block, function, and global scope, scope chain |
| **Destructuring** | Object and array destructuring, rest/spread patterns |
| **Arrays** | Array methods, iteration, and common gotchas |
| **Objects** | Object manipulation, property descriptors, and edge cases |
| **ES2025 Features** | ECMAScript 2025 features: Iterator helpers, Set methods, JSON modules, RegExp enhancements, Promise.try(), and Float16Array |

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/xseman/js-quizzy.git

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Build static export
npm run build

# The output will be in the /out directory
```

### Validating Questions

```bash
# Validate all question files
npm run validate-questions

# Generate all.json from category files
npm run generate-questions
```

## Project Structure

```
js-quizzy/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Core logic and utilities
├── public/                 # Static assets and questions
│   ├── questions/          # Question JSON files
│   └── sw.js               # Service Worker
├── scripts/                # Build and validation scripts
└── docs/                   # Documentation
```

## Adding Questions

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines on adding questions.

Questions are stored in JSON files in `public/questions/`. Each category has its own file:

- `event-loop.json`
- `closures.json`
- `async.json`
- `this.json`
- `coercion.json`
- `prototypes.json`
- `hoisting.json`
- `scope.json`
- `destructuring.json`
- `arrays.json`
- `objects.json`
- `es2025.json`

## Deployment

### GitHub Pages

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to `main`.

1. Enable GitHub Pages in repository settings
2. Select "GitHub Actions" as the source
3. Push to `main` branch
4. Site will be available at `https://yourusername.github.io/js-quizzy/`

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

## Documentation

- [CONTRIBUTING.md](./docs/CONTRIBUTING.md) - How to contribute questions
- [QUESTION_FORMAT.md](./docs/QUESTION_FORMAT.md) - Question JSON schema
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Technical architecture
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Deployment guide

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Deployment**: GitHub Pages (static export)

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for details.

## Roadmap

- [ ] Interactive code playground
- [ ] Daily challenges
- [ ] Community question voting
- [ ] GitHub OAuth for verified users
- [ ] AI-powered explanations
