# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation First - Required Reading

⚠️ **MANDATORY**: Before processing ANY request or prompt in this repository, **MUST read through all 5 documentation layers** in order:

1. **[docs/01_convention.md](docs/01_convention.md)** - Naming & code conventions
   - File naming, function naming, class naming, type naming
   - When to use camelCase, snake_case, PascalCase, UPPER_SNAKE_CASE

2. **[docs/02_structure.md](docs/02_structure.md)** - Project structure & organization
   - Where code goes (presentation, domain, data, common, di layers)
   - What can import what (dependency rule)
   - How to organize files

3. **[docs/03_tech.md](docs/03_tech.md)** - Technology stack & setup
   - Tools, versions, and configuration
   - How to build, test, lint
   - Development commands

4. **[docs/04_rule.md](docs/04_rule.md)** - Development rules & guidelines
   - 32 must-follow rules for code quality
   - Architecture rules (dependency rule, business logic placement)
   - Testing requirements (80%+ coverage)
   - Security guidelines

5. **[docs/05_csoc.md](docs/05_csoc.md)** - Code style & organization convention
   - Prettier formatting rules
   - TypeScript patterns and best practices
   - Component structure and organization
   - Error handling patterns

**How to use**: Read sequentially whenever you receive a prompt. Use Ctrl+F to search within documents for specific topics. Reference document sections in your responses using links.

**Quick reference**: See [docs/README.md](docs/README.md) for navigation by task.

---

## Project Overview

This is a **React Native SDK** designed to be distributed as an npm package (tarball/tgz format) for use in other projects. The SDK is published to npm and installed by consumers via `npm install`.

## Project Structure

```
fox-ecom/
├── src/
│   ├── components/          # Reusable React Native components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper functions and utilities
│   ├── types/              # TypeScript type definitions
│   └── index.ts            # Main entry point / barrel export
├── __tests__/              # Unit and integration tests
├── example/                # Example app demonstrating SDK usage
├── package.json            # Package metadata and dependencies
├── tsconfig.json           # TypeScript configuration
├── metro.config.js         # Metro bundler configuration
├── babel.config.js         # Babel transpiler configuration
└── README.md               # User-facing documentation
```

## Common Commands

### Development
```bash
# Install dependencies
npm install

# Run TypeScript type check
npm run type-check

# Run linter (ESLint)
npm run lint

# Fix linting issues
npm run lint:fix
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run a specific test file
npm test -- __tests__/path/to/test.test.ts

# Run tests with coverage report
npm test -- --coverage
```

### Building
```bash
# Build the SDK (transpile TypeScript, generate tgz)
npm run build

# Clean build artifacts
npm run clean

# Build in development mode (with source maps)
npm run build:dev
```

### Publishing
```bash
# Pack SDK as tarball (creates fox-ecom-x.x.x.tgz)
npm pack

# Test tarball installation locally
npm install ./fox-ecom-x.x.x.tgz

# Publish to npm registry (requires npm account and proper credentials)
npm publish
```

## Build Process & Distribution

### Build Output
- **Transpiled Code**: JavaScript files (ES6+ or configurable target) in `dist/` directory
- **TypeScript Declarations**: `.d.ts` files for type support
- **Tarball (tgz)**: Created via `npm pack`, can be:
  - Installed locally: `npm install ./fox-ecom-x.x.x.tgz`
  - Published to npm registry: `npm publish`
  - Hosted on private registries or CDN

### Package Configuration (package.json)
```json
{
  "name": "fox-ecom",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist/", "package.json"],
  "scripts": {
    "build": "tsc && npm pack",
    "clean": "rm -rf dist/ *.tgz",
    "lint": "eslint src/ __tests__/",
    "test": "jest",
    "type-check": "tsc --noEmit"
  }
}
```

### Key Distribution Points
1. **Source files**: Only `dist/` and `package.json` are included in the tarball
2. **Entry point**: Set via `main` field (typically `dist/index.js`)
3. **Types**: Set via `types` field for TypeScript support
4. **Exclude dev dependencies**: Only production dependencies are packaged

## Development Workflow

### Adding New Features
1. Create feature branch: `git checkout -b feature/my-feature`
2. Write code in `src/` with TypeScript
3. Add tests in `__tests__/` (mirror `src/` structure)
4. Run: `npm run lint:fix && npm test && npm run type-check`
5. Build and verify: `npm run build`
6. Commit and create pull request

### Testing Changes Locally
```bash
# Before publishing to npm registry
npm pack                    # Creates tarball
npm install ./fox-ecom-*.tgz  # Install in another project to test
```

### Publishing Workflow
1. Update version in `package.json` (follow semver)
2. Update `CHANGELOG.md` or release notes
3. Run tests: `npm test`
4. Build: `npm run build`
5. Publish: `npm publish` (or `npm publish ./fox-ecom-*.tgz` if testing first)
6. Tag release: `git tag v1.0.0`

## Entry Point & Exports

The SDK exports a **barrel file** (`src/index.ts`):
```typescript
// src/index.ts
export * from './components';
export * from './hooks';
export * from './utils';
export type { MyType } from './types';
```

Consumers import like:
```javascript
import { MyComponent, useMyHook } from 'fox-ecom';
```

## Key Considerations for SDK Development

- **Compatibility**: Ensure compatibility with supported React Native versions (document minimum version in README)
- **Tree Shaking**: Use ES6 modules; avoid default exports when possible for better tree-shaking
- **No Side Effects**: Components and utilities should be pure and not have initialization side effects
- **Peer Dependencies**: React and React Native are typically peer dependencies, not direct dependencies
- **Documentation**: Components should have JSDoc comments for IDE intellisense
- **Breaking Changes**: Follow semantic versioning; document breaking changes in release notes

## Metro Bundler & Babel

- **metro.config.js**: Configured for React Native transpilation and asset handling
- **babel.config.js**: Set to use React Native preset; may include additional plugins for advanced syntax
- Ensure `node_modules` is properly resolved for development

## Testing Strategy

- **Unit Tests**: Test individual components and utility functions
- **Integration Tests**: Test component interactions and hook usage
- **Test Libraries**: Jest + React Native Testing Library or similar
- Coverage goal: Minimum 80% for production code
