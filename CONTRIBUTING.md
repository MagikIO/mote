# Contributing to Mote

Thank you for your interest in contributing to Mote! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and constructive in all interactions.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/mote.git
   cd mote
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/MagikIO/mote.git
   ```
4. **Install dependencies**:
   ```bash
   pnpm install
   ```

## Development Setup

### Prerequisites

- **Node.js**: v22.x (specified in package.json engines)
- **pnpm**: v9.10.0 or higher (specified in packageManager)

### Installation

```bash
# Install pnpm if you don't have it
npm install -g pnpm@9.10.0

# Install project dependencies
pnpm install
```

### Available Scripts

- `pnpm dev` - Start development server with Vite
- `pnpm build` - Build the library for production
- `pnpm clean` - Remove dist directory
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests with coverage
- `pnpm iterate` - Bump version, publish, and push (maintainers only)

## Project Structure

```
mote/
├── src/              # Source code
│   ├── El.ts         # Single element manipulation class
│   ├── All.ts        # Multiple element manipulation class
│   ├── Mote.ts       # Element creation class
│   └── index.ts      # Main entry point
├── types/            # TypeScript type definitions
│   └── index.d.ts    # Type declarations
├── dist/             # Build output (generated)
├── index.html        # Development demo page
├── package.json      # Package configuration
├── tsconfig.json     # TypeScript configuration
├── vite.config.js    # Vite configuration
├── eslint.config.js  # ESLint configuration
└── README.md         # Project documentation
```

## Development Workflow

### Creating a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes in the `src/` directory
2. Test your changes using the development server:
   ```bash
   pnpm dev
   ```
3. Open `http://localhost:5173` to test your changes
4. Run the linter to check for issues:
   ```bash
   pnpm lint
   ```

### Testing Your Changes

Update the `index.html` file to test your changes interactively:

```html
<script type="module">
  import { Mote, El, All } from './src/index.ts'

  // Test your changes here
  const test = new Mote('div#test')
    .text('Testing new feature')
    .appendTo('body');
</script>
```

## Coding Standards

### TypeScript

- Use TypeScript for all code
- Maintain strict type safety
- Document all public APIs with JSDoc comments
- Use generics where appropriate for type flexibility

### Code Style

We use ESLint with `@magik_io/lint_golem` for code style enforcement.

#### General Guidelines

- Use 2 spaces for indentation
- Use single quotes for strings
- Always use semicolons
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation

#### Naming Conventions

- **Classes**: PascalCase (e.g., `El`, `Mote`, `All`)
- **Functions**: camelCase (e.g., `addClass`, `removeClass`)
- **Variables**: camelCase (e.g., `element`, `className`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_LENGTH`)
- **Type Parameters**: Single uppercase letter or PascalCase (e.g., `E`, `ElementName`)

#### Method Chaining

All methods that modify the instance should return `this` for chaining:

```typescript
addClass(className: string): this {
  this.element.classList.add(className);
  return this; // Enable chaining
}
```

#### Type Safety

Always maintain generic type parameters through the chain:

```typescript
parent<ElementTag extends htmlTags = htmlTags>(): El<ElementTag, true> {
  // Implementation
}
```

### Documentation

#### JSDoc Comments

All public methods must have JSDoc comments:

```typescript
/**
 * Add a class or classes to the current HTML element.
 * @param {Array<string> | string} className - The class or classes to add.
 * @returns {this} The current instance for chaining.
 */
addClass(className: Array<string> | string): this {
  // Implementation
}
```

#### Code Examples

Include practical examples for complex features in the README.

## Testing

### Writing Tests

We use Vitest for testing. Place test files next to the source files with `.test.ts` extension.

```typescript
// El.test.ts
import { describe, it, expect } from 'vitest';
import { El } from './El';

describe('El', () => {
  it('should create an instance', () => {
    const div = document.createElement('div');
    div.id = 'test';
    document.body.appendChild(div);

    const el = new El('#test');
    expect(el.self()).toBe(div);
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

## Commit Guidelines

We follow conventional commit messages for clear history:

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(El): add support for dataset manipulation

fix(Mote): correct element creation with custom tags

docs(README): add examples for event handling

refactor(All): optimize iteration performance
```

## Pull Request Process

### Before Submitting

1. **Sync with upstream**:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run quality checks**:
   ```bash
   pnpm lint
   pnpm test
   pnpm build
   ```

3. **Update documentation** if you've added/changed APIs

### Submitting a Pull Request

1. **Push to your fork**:
   ```bash
   git push origin your-feature-branch
   ```

2. **Create a Pull Request** on GitHub

3. **Fill out the PR template** with:
   - Clear description of changes
   - Related issue numbers (if applicable)
   - Breaking changes (if any)
   - Testing performed

4. **Respond to review feedback** promptly

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] New code has tests (if applicable)
- [ ] Documentation updated (if applicable)
- [ ] Commit messages follow conventional format
- [ ] No breaking changes (or clearly documented)
- [ ] Branch is up to date with main

## Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported in [Issues](https://github.com/MagikIO/mote/issues)
2. Try to reproduce with the latest version
3. Gather relevant information (browser, OS, version, etc.)

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Create element '...'
2. Call method '...'
3. See error

**Expected behavior**
What you expected to happen.

**Code Sample**
```typescript
// Minimal code to reproduce
const el = new El('#test');
el.someMethod(); // Throws error
```

**Environment:**
- Mote version: [e.g., 1.6.7]
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14.0]
- TypeScript version: [e.g., 5.6.3]

**Additional context**
Any other context about the problem.
```

## Suggesting Enhancements

### Enhancement Proposal Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**API Design (if applicable)**
```typescript
// Proposed API
el.newMethod(params);
```

**Use Cases**
How would this be used in practice?

**Additional context**
Any other context or screenshots.
```

## Questions?

If you have questions that aren't covered in this guide:

- Open a [Discussion](https://github.com/MagikIO/mote/discussions)
- Ask in an [Issue](https://github.com/MagikIO/mote/issues)
- Check the [README](README.md) for usage examples

## License

By contributing to Mote, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Mote! Your efforts help make this library better for everyone.
