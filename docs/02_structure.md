# 02 - Project Structure & Organization

Complete project directory structure and how each layer is organized.

## Directory Tree

```
fox-ecom/
│
├── docs/                          # Documentation
│   ├── 01_convention.md          # Naming & code conventions
│   ├── 02_structure.md           # Project structure (this file)
│   ├── 03_tech.md                # Technology stack & setup
│   ├── 04_rule.md                # Development rules & guidelines
│   └── 05_csoc.md                # Code style & organization
│
├── src/                           # Source code
│   ├── presentation/              # UI Layer (Presentation/View)
│   │   ├── components/            # Reusable UI components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── Cart.tsx
│   │   │   └── index.ts
│   │   ├── screens/               # Full-screen components
│   │   │   ├── ProductListScreen.tsx
│   │   │   ├── CartScreen.tsx
│   │   │   └── index.ts
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useCart.ts
│   │   │   ├── useProduct.ts
│   │   │   └── index.ts
│   │   ├── styles/                # Shared theme & styles
│   │   │   ├── colors.ts
│   │   │   ├── spacing.ts
│   │   │   ├── typography.ts
│   │   │   └── index.ts
│   │   └── index.ts               # Barrel export
│   │
│   ├── domain/                    # Business Logic Layer
│   │   ├── entities/              # Core business objects
│   │   │   ├── product.entity.ts
│   │   │   ├── cart.entity.ts
│   │   │   ├── user.entity.ts
│   │   │   └── index.ts
│   │   ├── usecases/              # Business operations
│   │   │   ├── product/
│   │   │   │   ├── get_products.usecase.ts
│   │   │   │   ├── get_product_by_id.usecase.ts
│   │   │   │   └── index.ts
│   │   │   ├── cart/
│   │   │   │   ├── add_to_cart.usecase.ts
│   │   │   │   ├── remove_from_cart.usecase.ts
│   │   │   │   ├── clear_cart.usecase.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── repositories/          # Repository interfaces
│   │   │   ├── product.repository.ts
│   │   │   ├── cart.repository.ts
│   │   │   └── index.ts
│   │   └── index.ts               # Barrel export
│   │
│   ├── data/                      # Data Access Layer
│   │   ├── datasources/           # External data providers
│   │   │   ├── remote/            # API calls
│   │   │   │   ├── product_remote_datasource.ts
│   │   │   │   └── index.ts
│   │   │   ├── local/             # Local storage/cache
│   │   │   │   ├── product_local_datasource.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── models/                # Data Transfer Objects
│   │   │   ├── product.model.ts
│   │   │   ├── cart.model.ts
│   │   │   └── index.ts
│   │   ├── repositories/          # Repository implementations
│   │   │   ├── product.repository.impl.ts
│   │   │   ├── cart.repository.impl.ts
│   │   │   └── index.ts
│   │   ├── sources/               # API/DB clients
│   │   │   ├── api.ts
│   │   │   ├── database.ts
│   │   │   └── index.ts
│   │   └── index.ts               # Barrel export
│   │
│   ├── common/                    # Cross-cutting Concerns
│   │   ├── utils/                 # Helper functions
│   │   │   ├── formatPrice.ts
│   │   │   ├── calculateDiscount.ts
│   │   │   └── index.ts
│   │   ├── constants/             # Application constants
│   │   │   ├── api.constants.ts
│   │   │   ├── app.constants.ts
│   │   │   └── index.ts
│   │   ├── errors/                # Custom error classes
│   │   │   ├── failures.ts
│   │   │   └── index.ts
│   │   ├── types/                 # Shared type definitions
│   │   │   └── index.ts
│   │   ├── validators/            # Input validation
│   │   │   ├── email.validator.ts
│   │   │   ├── price.validator.ts
│   │   │   └── index.ts
│   │   └── index.ts               # Barrel export
│   │
│   ├── di/                        # Dependency Injection
│   │   ├── service_locator.ts
│   │   ├── injection.ts
│   │   └── index.ts
│   │
│   └── index.ts                   # Main SDK entry point
│
├── __tests__/                     # Test files
│   ├── domain/
│   │   ├── usecases/
│   │   │   ├── product/
│   │   │   │   └── get_products.usecase.test.ts
│   │   │   └── cart/
│   │   │       └── add_to_cart.usecase.test.ts
│   │   └── entities/
│   │       └── product.entity.test.ts
│   ├── data/
│   │   ├── repositories/
│   │   │   └── product.repository.test.ts
│   │   ├── datasources/
│   │   └── models/
│   ├── presentation/
│   │   ├── components/
│   │   │   └── ProductCard.test.tsx
│   │   ├── hooks/
│   │   │   └── useCart.test.ts
│   │   └── screens/
│   └── common/
│       ├── utils/
│       └── validators/
│
├── example/                       # Example application
│   ├── App.tsx
│   ├── package.json
│   └── README.md
│
├── .codebase-memory/              # Code knowledge graph (auto-generated)
│   └── graph.db.zst
│
├── .claude/                       # Claude Code configuration
│   └── settings.json
│
├── node_modules/                  # Dependencies (generated)
├── dist/                          # Build output (generated)
│
├── CLAUDE.md                      # Claude Code guidance
├── STRUCTURE.md                   # Clean Architecture overview
├── package.json                   # Package metadata & scripts
├── tsconfig.json                  # TypeScript configuration
├── jest.config.js                 # Jest test configuration
├── jest.setup.js                  # Jest setup file
├── babel.config.js                # Babel transpiler config
├── metro.config.js                # Metro bundler config
├── .eslintrc.json                 # ESLint configuration
├── .prettierrc                     # Prettier formatting
├── .gitignore                      # Git ignore patterns
├── .npmrc                          # npm configuration
├── README.md                       # User documentation
├── CHANGELOG.md                    # Version history
└── LICENSE                         # License file
```

## Layer Descriptions

### 🎨 Presentation Layer (`src/presentation/`)

**Responsibility**: User interface and user interaction logic

**Contains**:
- **components/**: Reusable, dumb UI components
  - Only render what they receive via props
  - No business logic
  - No API calls
  - Examples: `ProductCard`, `Cart`, `Button`, `Header`

- **screens/**: Full-screen components for navigation
  - Combine multiple components
  - Connect to hooks for state
  - Route handlers
  - Examples: `ProductListScreen`, `CartScreen`, `CheckoutScreen`

- **hooks/**: Custom React hooks for UI state & side effects
  - Delegate to domain use cases
  - Manage component-level state
  - Handle loading/error states
  - Examples: `useCart`, `useProduct`, `useFetch`

- **styles/**: Shared theme and styling
  - Design tokens (colors, spacing, typography)
  - No component-specific styles
  - Centralized for consistency
  - Files: `colors.ts`, `spacing.ts`, `typography.ts`

**Key Rules**:
- ✅ Use domain entities for data
- ✅ Delegate to use cases via hooks
- ✅ Component logic only
- ❌ No direct API calls
- ❌ No business logic
- ❌ No database access

---

### 💼 Domain Layer (`src/domain/`)

**Responsibility**: Business logic and rules (framework-independent)

**Contains**:
- **entities/**: Core business objects
  - Pure TypeScript classes
  - Business logic methods
  - No framework dependencies
  - Examples: `Product`, `Cart`, `User`, `Order`

- **usecases/**: Business operations/flows
  - One use case = One business operation
  - Orchestrate entities and repositories
  - No UI knowledge
  - Examples: `GetProducts`, `AddToCart`, `CheckoutOrder`

- **repositories/**: Repository interfaces
  - Abstract contracts for data access
  - Define what data operations are available
  - Implementation in data layer
  - Examples: `ProductRepository`, `CartRepository`

**Key Rules**:
- ✅ Pure business logic only
- ✅ Framework-independent (no React/RN)
- ✅ Highly testable
- ✅ No external dependencies
- ❌ No UI code
- ❌ No framework imports
- ❌ No I/O operations

---

### 📦 Data Layer (`src/data/`)

**Responsibility**: Data access and external communication

**Contains**:
- **datasources/**: External data providers
  - **remote/**: API calls, REST, GraphQL
  - **local/**: AsyncStorage, SQLite, Cache
  - Pure functions or classes
  - Handle network/storage errors

- **models/**: Data Transfer Objects (DTOs)
  - Map external data to domain entities
  - Serialization/deserialization
  - Different structure from entities
  - Examples: `ProductModel`, `CartModel`

- **repositories/**: Concrete implementations
  - Implement domain repository interfaces
  - Coordinate datasources
  - Caching, error handling, fallback logic
  - Examples: `ProductRepositoryImpl`, `CartRepositoryImpl`

- **sources/**: API and database clients
  - HTTP client configuration
  - Database connections
  - Centralized external service setup

**Key Rules**:
- ✅ Implement domain repositories
- ✅ Handle all I/O operations
- ✅ Implement caching strategy
- ✅ Error mapping to domain failures
- ❌ No business logic
- ❌ No UI knowledge
- ❌ No framework code

---

### 🛠️ Common Layer (`src/common/`)

**Responsibility**: Shared utilities and infrastructure

**Contains**:
- **utils/**: Helper functions
  - Pure functions
  - No side effects
  - Used across all layers
  - Examples: `formatPrice`, `validateEmail`, `debounce`

- **constants/**: Application constants
  - API endpoints
  - Configuration values
  - Magic strings/numbers
  - Examples: `API_TIMEOUT`, `MAX_CART_ITEMS`

- **errors/**: Custom error/failure classes
  - Domain-specific failures
  - Application-wide exceptions
  - Examples: `NetworkFailure`, `ValidationFailure`

- **types/**: Shared type definitions
  - Common interfaces
  - Generic types
  - Request/response shapes
  - Examples: `Result<T, E>`, `AsyncResult<T>`

- **validators/**: Input validation functions
  - Email, phone, price validation
  - Reusable across layers
  - Examples: `validateEmail`, `validatePrice`

**Key Rules**:
- ✅ Framework-independent utilities
- ✅ Pure functions preferred
- ✅ No I/O operations
- ✅ No business logic
- ❌ No layer-specific code

---

### 🔌 Dependency Injection (`src/di/`)

**Responsibility**: Centralized dependency management

**Contains**:
- **service_locator.ts**: Service registration & retrieval
- **injection.ts**: Setup and register all dependencies

**How it works**:
```typescript
setupDependencies();

// Later in your app
const usecase = ServiceLocator.get<GetProductsUsecase>('GetProductsUsecase');
```

---

## Import Dependencies

### Allowed Import Paths

```
Presentation ──→ Domain
Presentation ──→ Common
Presentation ──→ DI

Domain ──→ Common
Domain ──→ Errors

Data ──→ Domain (interfaces only)
Data ──→ Common
Data ──→ Models

Common ──→ Nothing (utilities only)

DI ──→ All layers (wires everything)
```

### NOT Allowed

```
❌ Domain → Presentation
❌ Domain → Data (only interfaces)
❌ Data → Presentation
❌ Common → Domain/Data/Presentation
```

---

## Test File Structure

Mirror source structure in `__tests__/`:

```
src/domain/usecases/product/
    └── get_products.usecase.ts

__tests__/domain/usecases/product/
    └── get_products.usecase.test.ts
```

**Test Locations**:
- Domain tests: `__tests__/domain/`
- Data tests: `__tests__/data/`
- Presentation tests: `__tests__/presentation/`
- Common tests: `__tests__/common/`

---

## Module Exports (index.ts)

Each layer has a barrel export:

```typescript
// src/domain/index.ts
export * from './entities';
export * from './repositories';
export * from './usecases';

// Usage in other layers
import { Product, GetProductsUsecase } from '@/domain';
```

---

## File Size Guidelines

| File Type | Recommended Size | Reason |
|-----------|------------------|--------|
| Component | < 300 lines | Reusability, testability |
| Hook | < 150 lines | Single responsibility |
| Use Case | < 100 lines | Clear business logic |
| Service | < 200 lines | Single concern |
| Test | < 250 lines | Focused testing |
| Model | < 150 lines | Data mapping only |

---

## Folder Organization Rules

1. **Flat structure for files** - avoid deep nesting
2. **Group by feature, not type** - organize by domain concept
3. **index.ts as barrel export** - each folder must have one
4. **README.md per layer** - optional but recommended
5. **Keep related files together** - entities + their tests nearby

---

## Summary

| Layer | Responsibility | Examples |
|-------|-----------------|----------|
| **Presentation** | UI & user interaction | Components, Hooks, Screens |
| **Domain** | Business logic | Entities, Use Cases, Interfaces |
| **Data** | Data access & I/O | Data Sources, Models, Repositories |
| **Common** | Shared utilities | Constants, Utils, Errors |
| **DI** | Dependency management | Service Locator, Setup |
