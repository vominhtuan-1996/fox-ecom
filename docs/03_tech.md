# 03 - Technology Stack & Setup

Complete technology stack, dependencies, and development environment setup.

## Technology Stack

### Core Technologies

| Tech | Version | Purpose |
|------|---------|---------|
| **React Native** | 0.72+ | Mobile framework |
| **TypeScript** | 5.0+ | Type safety |
| **Node.js** | 16+ | Runtime environment |
| **npm** | 8+ | Package manager |

### Build & Compilation

| Tool | Version | Purpose |
|------|---------|---------|
| **Babel** | 7.22+ | JavaScript transpiler |
| **Metro** | 0.76+ | React Native bundler |
| **TypeScript Compiler** | 5.0+ | Type checking & compilation |

### Testing

| Tool | Version | Purpose |
|------|---------|---------|
| **Jest** | 29.5+ | Unit testing framework |
| **React Native Testing Library** | 12.0+ | Component testing |
| **@testing-library/jest-native** | - | Jest matchers for RN |

### Linting & Formatting

| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | 8.40+ | Code linting |
| **Prettier** | 2.8+ | Code formatting |
| **@typescript-eslint** | 6.0+ | TypeScript linting |

### Supporting Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **React** | 18.2+ | UI library |
| **React Navigation** | 6.0+ | Navigation (optional) |
| **AsyncStorage** | 1.17+ | Local storage |
| **axios** | 1.4+ | HTTP client (optional) |

---

## Project Setup

### Prerequisites

```bash
# Check Node.js version
node --version  # Should be 16.0.0 or higher

# Check npm version
npm --version   # Should be 8.0.0 or higher
```

### Installation

```bash
# 1. Clone or enter project directory
cd fox-ecom

# 2. Install dependencies
npm install

# 3. Verify installation
npm run type-check
```

### Verify Setup

```bash
# Run all checks
npm run lint
npm run type-check
npm run test
```

---

## NPM Scripts

### Development Scripts

```bash
# Type checking
npm run type-check

# Linting
npm run lint              # Check for errors
npm run lint:fix          # Auto-fix issues

# Testing
npm test                  # Run all tests
npm test -- --watch       # Watch mode
npm test -- --coverage    # With coverage report
npm test -- __tests__/path/to/test.test.ts  # Specific test
```

### Build Scripts

```bash
# Build SDK
npm run build             # Transpile TS + create tgz
npm run build:dev         # With source maps
npm run clean             # Remove dist/ and tgz files

# Package
npm pack                  # Create tarball
npm publish              # Publish to npm registry
```

### Example App

```bash
# From example/ directory
npm install
npm run ios               # Run on iOS simulator
npm run android           # Run on Android emulator
npm run start             # Start Metro bundler
```

---

## Configuration Files

### tsconfig.json

TypeScript configuration for compilation:

```json
{
  "compilerOptions": {
    "target": "ES2020",           // Target JavaScript version
    "module": "commonjs",          // Module system
    "lib": ["ES2020"],             // Type definitions
    "jsx": "react-native",         // JSX for React Native
    "strict": true,                // Strict type checking
    "esModuleInterop": true,       // CommonJS interop
    "moduleResolution": "node",    // Module resolution
    "baseUrl": ".",                // Base for absolute paths
    "paths": {
      "@/*": ["src/*"]             // Path aliases
    }
  }
}
```

**Key Options**:
- `strict: true` - Enable all strict type checking
- `jsx: "react-native"` - Parse JSX as React Native
- `paths` - Enable `@/` imports

### jest.config.js

Jest testing framework configuration:

```javascript
{
  "preset": "react-native",
  "testEnvironment": "node",
  "moduleFileExtensions": ["ts", "tsx", "js", "jsx"],
  "transform": {
    "^.+\\.(ts|tsx)$": "babel-jest"
  },
  "collectCoverageFrom": [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 50,
      "functions": 50,
      "lines": 50,
      "statements": 50
    }
  }
}
```

### babel.config.js

Babel transpiler configuration:

```javascript
module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining'
  ]
}
```

### metro.config.js

Metro bundler configuration for React Native:

```javascript
{
  "resolver": {
    "sourceExts": ["ts", "tsx", "js", "jsx"],
    "assetExts": ["png", "jpg", "jpeg", "gif", "svg"]
  },
  "transformer": {
    "babelTransformerPath": "metro-react-native-babel-transformer"
  }
}
```

### .eslintrc.json

ESLint configuration:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-native"
  ]
}
```

### .prettierrc

Prettier code formatting:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

---

## Build Process

### Compilation Flow

```
TypeScript (.ts)
    ↓
Babel (transpile)
    ↓
JavaScript (.js)
    ↓
Metro (bundle for RN)
    ↓
dist/ directory
    ↓
npm pack (create tgz)
    ↓
fox-ecom-x.x.x.tgz
```

### Build Output

**Files generated in `dist/`**:
```
dist/
├── index.js              # Main entry point
├── index.d.ts            # TypeScript definitions
├── presentation/         # Components, hooks, styles
├── domain/              # Entities, use cases
├── data/                # Repositories, models
└── common/              # Utils, constants, types
```

**Tarball contents**:
```
fox-ecom-0.1.0.tgz
├── dist/                # Compiled code
├── package.json         # Package metadata
└── package-lock.json    # Dependency lock
```

---

## Development Workflow

### Local Development

```bash
# 1. Start development
npm install

# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Make changes
# - Edit src/ files
# - Write tests in __tests__/

# 4. Run checks
npm run lint:fix
npm run type-check
npm test

# 5. Commit
git add .
git commit -m "Add my feature"

# 6. Push
git push origin feature/my-feature

# 7. Create pull request
```

### Testing Changes Locally

```bash
# Build and pack
npm run build              # Creates fox-ecom-x.x.x.tgz

# Install in test project
cd /path/to/test-project
npm install /path/to/fox-ecom/fox-ecom-0.1.0.tgz

# Use in code
import { ProductCard, useCart } from 'fox-ecom';
```

### Publishing

```bash
# 1. Update version
# Edit package.json: "version": "0.2.0"

# 2. Update CHANGELOG
# Document changes

# 3. Run tests
npm test

# 4. Build
npm run build

# 5. Publish to npm
npm publish

# 6. Tag release
git tag v0.2.0
git push origin v0.2.0
```

---

## Environment Configuration

### .env (Development)

```env
# .env
API_BASE_URL=https://api.dev.example.com
API_TIMEOUT=10000
LOG_LEVEL=debug
```

### .env.production

```env
API_BASE_URL=https://api.example.com
API_TIMEOUT=5000
LOG_LEVEL=error
```

### Usage in Code

```typescript
// src/common/constants/api.constants.ts
export const API_BASE_URL = process.env.API_BASE_URL || 'https://api.example.com';
```

---

## Dependency Management

### Peer Dependencies

```json
{
  "peerDependencies": {
    "react": ">=17.0.0",
    "react-native": ">=0.72.0"
  }
}
```

Consumer projects must install these themselves.

### Dev Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^8.40.0",
    "prettier": "^2.8.0",
    "jest": "^29.5.0"
  }
}
```

Consumed during development and testing, not bundled.

### Production Dependencies

Minimal dependencies for runtime:

```json
{
  "dependencies": {}
}
```

The SDK should have zero runtime dependencies if possible.

---

## Performance Considerations

### Bundle Size

- **Goal**: Keep dist/ < 100KB (gzipped)
- **Check**: `npm run build` shows size
- **Optimize**: Tree-shake unused exports, lazy load if needed

### TypeScript Configuration

- **`skipLibCheck: true`** - Faster compilation
- **`noImplicitAny: true`** - Catch type errors
- **`strict: true`** - All strict checks enabled

### Jest Configuration

- **Coverage threshold**: 50% minimum
- **Test timeout**: 5000ms default
- **Parallel tests**: Jest runs by default

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests & Lint

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run build
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `npm install` fails | Clear cache: `npm cache clean --force` |
| Port 8081 in use | Kill process: `lsof -i :8081` |
| Module not found | Check path aliases in tsconfig.json |
| TypeScript errors | Run `npm run type-check` |
| Jest tests fail | Check jest.config.js and jest.setup.js |
| Prettier conflicts | Run `npm run lint:fix` |

### Metro Bundler Issues

```bash
# Clear Metro cache
npm start -- --reset-cache

# Rebuild node_modules
rm -rf node_modules
npm install
```

### Type Definition Issues

```bash
# Reinstall @types packages
npm install --save-dev @types/react @types/react-native

# Check TypeScript version
npm ls typescript
```

---

## Version Management

### Semver Format

```
0.1.0
│ │ └─ Patch (bug fixes)
│ └─── Minor (new features, backwards compatible)
└───── Major (breaking changes)
```

### Versioning Strategy

- **0.x.y**: Pre-release, breaking changes allowed
- **1.x.y**: Stable release
- **x.y.0**: Minor release with features
- **x.y.z**: Patch release with fixes

---

## Publishing to npm

### Setup

```bash
# Login to npm
npm login

# Verify login
npm whoami
```

### Publish

```bash
# Automatic: npm run build includes npm pack
npm run build
npm publish

# Or manual
npm pack
npm publish ./fox-ecom-0.1.0.tgz
```

### Verify Published Package

```bash
# Check npm registry
npm info fox-ecom

# Install from npm
npm install fox-ecom

# Verify version
npm ls fox-ecom
```

---

## Summary

| Component | Version | Purpose |
|-----------|---------|---------|
| **React Native** | 0.72+ | Mobile framework |
| **TypeScript** | 5.0+ | Type safety |
| **Jest** | 29.5+ | Testing |
| **ESLint** | 8.40+ | Code quality |
| **Prettier** | 2.8+ | Formatting |
| **Babel** | 7.22+ | Transpilation |
| **Metro** | 0.76+ | Bundling |
