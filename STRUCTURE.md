# Project Structure - Clean Architecture

This document describes the project structure following **Clean Architecture** principles for the React Native SDK.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                 Presentation Layer                       │
│         (Components, Screens, UI Logic, Hooks)           │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                   Domain Layer                           │
│      (Entities, Use Cases, Repository Interfaces)        │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                    Data Layer                            │
│    (Repositories, Models, Data Sources, API)             │
└─────────────────────────────────────────────────────────┘
```

## Directory Structure

```
fox-ecom/
│
├── src/
│   ├── presentation/              # UI Components & Presentation Logic
│   │   ├── components/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── Cart.tsx
│   │   │   └── index.ts
│   │   ├── screens/               # Full-screen components
│   │   │   ├── ProductListScreen.tsx
│   │   │   └── CartScreen.tsx
│   │   ├── hooks/                 # Custom React hooks (UI logic)
│   │   │   ├── useCart.ts
│   │   │   ├── useProduct.ts
│   │   │   └── index.ts
│   │   └── styles/                # Shared styles & theme
│   │       ├── colors.ts
│   │       ├── spacing.ts
│   │       └── typography.ts
│   │
│   ├── domain/                    # Business Logic Layer
│   │   ├── entities/              # Core business objects
│   │   │   ├── product.entity.ts
│   │   │   ├── cart.entity.ts
│   │   │   ├── user.entity.ts
│   │   │   └── index.ts
│   │   ├── usecases/              # Business use cases
│   │   │   ├── product/
│   │   │   │   ├── get_products.usecase.ts
│   │   │   │   ├── get_product_by_id.usecase.ts
│   │   │   │   └── index.ts
│   │   │   ├── cart/
│   │   │   │   ├── add_to_cart.usecase.ts
│   │   │   │   ├── remove_from_cart.usecase.ts
│   │   │   │   ├── calculate_total.usecase.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── repositories/          # Abstract repository interfaces
│   │       ├── product.repository.ts
│   │       ├── cart.repository.ts
│   │       └── index.ts
│   │
│   ├── data/                      # Data Access Layer
│   │   ├── datasources/           # External data sources
│   │   │   ├── local/
│   │   │   │   ├── product_local_datasource.ts
│   │   │   │   └── index.ts
│   │   │   ├── remote/
│   │   │   │   ├── product_remote_datasource.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── models/                # Data transfer objects
│   │   │   ├── product.model.ts
│   │   │   ├── cart.model.ts
│   │   │   └── index.ts
│   │   ├── repositories/          # Concrete repository implementations
│   │   │   ├── product.repository.impl.ts
│   │   │   ├── cart.repository.impl.ts
│   │   │   └── index.ts
│   │   └── sources/               # API clients, DB connections
│   │       ├── api.ts
│   │       ├── database.ts
│   │       └── index.ts
│   │
│   ├── common/                    # Cross-cutting concerns
│   │   ├── utils/
│   │   │   ├── formatPrice.ts
│   │   │   ├── calculateDiscount.ts
│   │   │   └── index.ts
│   │   ├── constants/
│   │   │   ├── api.constants.ts
│   │   │   ├── app.constants.ts
│   │   │   └── index.ts
│   │   ├── errors/
│   │   │   ├── failures.ts
│   │   │   ├── exceptions.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   └── common.types.ts
│   │   └── validators/
│   │       ├── email.validator.ts
│   │       ├── price.validator.ts
│   │       └── index.ts
│   │
│   ├── di/                        # Dependency Injection
│   │   ├── service_locator.ts
│   │   └── injection.ts
│   │
│   └── index.ts                   # Main SDK export
│
├── __tests__/
│   ├── domain/
│   │   ├── usecases/
│   │   │   ├── product/
│   │   │   └── cart/
│   │   └── entities/
│   ├── data/
│   │   ├── repositories/
│   │   ├── datasources/
│   │   └── models/
│   ├── presentation/
│   │   ├── components/
│   │   ├── screens/
│   │   └── hooks/
│   └── common/
│       ├── utils/
│       └── validators/
│
├── example/                       # Example app demonstrating SDK
│   ├── App.tsx
│   ├── package.json
│   └── README.md
│
├── package.json
├── tsconfig.json
├── jest.config.js
├── babel.config.js
├── metro.config.js
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── CLAUDE.md                      # Development guide
├── STRUCTURE.md                   # This file
├── README.md                      # User documentation
└── CHANGELOG.md                   # Version history
```

## Layer Descriptions

### 🎨 Presentation Layer (`src/presentation/`)

**Purpose:** UI components and user interaction logic

**Components:**
- **components/**: Reusable UI components (ProductCard, Cart, etc.)
- **screens/**: Full-screen components for navigation
- **hooks/**: Custom React hooks for UI state management
- **styles/**: Theme, colors, spacing, typography

**Key Principles:**
- Components are **stateless** or contain only UI state
- No direct API calls or business logic
- Use hooks to delegate to domain layer
- Presentational logic only

**Example:**
```typescript
// src/presentation/components/ProductCard.tsx
export interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <View>
      <Text>{product.name}</Text>
      <Text>${product.price}</Text>
    </View>
  );
};
```

---

### 💼 Domain Layer (`src/domain/`)

**Purpose:** Business logic and rules (framework-independent)

**Components:**

1. **entities/**: Core business objects
   - Represents **domain concepts** (Product, Cart, User)
   - Framework-agnostic pure TypeScript classes
   - Contains business logic and validation rules

   ```typescript
   // src/domain/entities/product.entity.ts
   export class Product {
     constructor(
       public id: string,
       public name: string,
       public price: number,
       public description?: string,
     ) {}

     isAvailable(): boolean {
       return this.price > 0;
     }
   }
   ```

2. **usecases/**: Business use cases
   - Implements **specific business operations**
   - Uses repository interfaces (not implementations)
   - Returns domain entities
   - Independent of frameworks and UI

   ```typescript
   // src/domain/usecases/product/get_products.usecase.ts
   export class GetProductsUsecase {
     constructor(private productRepository: ProductRepository) {}

     async execute(): Promise<Product[]> {
       return await this.productRepository.getProducts();
     }
   }
   ```

3. **repositories/**: Repository interfaces
   - **Abstract interfaces** for data access
   - Defines contract between domain and data layers
   - Implementation lives in data layer

   ```typescript
   // src/domain/repositories/product.repository.ts
   export interface ProductRepository {
     getProducts(): Promise<Product[]>;
     getProductById(id: string): Promise<Product>;
   }
   ```

**Key Principles:**
- **Framework-independent**: No React, RN, or SDK imports
- **Business-focused**: Contains domain rules and validation
- **Single Responsibility**: Each use case does one thing
- **Testable**: Easy to unit test without mocks

---

### 📦 Data Layer (`src/data/`)

**Purpose:** Data access and external communication

**Components:**

1. **datasources/**: External data providers
   - **Remote**: API calls, REST endpoints, GraphQL
   - **Local**: AsyncStorage, SQLite, file system, cache
   - Pure functions or classes

   ```typescript
   // src/data/datasources/remote/product_remote_datasource.ts
   export class ProductRemoteDataSource {
     async getProducts(): Promise<ProductModel[]> {
       const response = await fetch('/api/products');
       return response.json();
     }
   }
   ```

2. **models/**: Data Transfer Objects (DTOs)
   - Map external data to domain entities
   - Include serialization/deserialization
   - May have different structure than entities

   ```typescript
   // src/data/models/product.model.ts
   export class ProductModel {
     constructor(
       public id: string,
       public name: string,
       public price: number,
     ) {}

     toDomain(): Product {
       return new Product(this.id, this.name, this.price);
     }
   }
   ```

3. **repositories/**: Concrete implementations
   - Implement **repository interfaces** from domain
   - Coordinate datasources
   - Handle caching, error handling, fallback logic

   ```typescript
   // src/data/repositories/product.repository.impl.ts
   export class ProductRepositoryImpl implements ProductRepository {
     constructor(
       private remoteDatasource: ProductRemoteDataSource,
       private localDatasource: ProductLocalDataSource,
     ) {}

     async getProducts(): Promise<Product[]> {
       try {
         const models = await this.remoteDatasource.getProducts();
         return models.map((m) => m.toDomain());
       } catch {
         const cached = await this.localDatasource.getProducts();
         return cached.map((m) => m.toDomain());
       }
     }
   }
   ```

4. **sources/**: API and database clients
   - HTTP client configuration
   - Database connections
   - Centralized external service setup

**Key Principles:**
- **Isolation**: External changes don't affect domain logic
- **Layering**: Datasources → Models → Repositories
- **Error Handling**: Convert errors to domain failures
- **Caching**: Implement at this layer

---

### 🛠️ Common Layer (`src/common/`)

**Purpose:** Shared utilities and infrastructure

**Components:**

1. **utils/**: Helper functions
   - `formatPrice.ts`: Currency formatting
   - `calculateDiscount.ts`: Price calculations
   - `validators.ts`: Input validation

2. **constants/**: Application constants
   - `api.constants.ts`: Base URLs, endpoints
   - `app.constants.ts`: App configuration

3. **errors/**: Custom error classes
   - `failures.ts`: Domain failure types
   - `exceptions.ts`: Custom exceptions

   ```typescript
   // src/common/errors/failures.ts
   export class NetworkFailure extends Error {
     constructor(message: string) {
       super(message);
       this.name = 'NetworkFailure';
     }
   }
   ```

4. **types/**: Common type definitions
   - Shared across layers
   - Request/response types
   - Configuration types

5. **validators/**: Input validation
   - Email, phone, price validation
   - Reusable across layers

---

### 🔌 Dependency Injection (`src/di/`)

**Purpose:** Centralized dependency management

```typescript
// src/di/service_locator.ts
class ServiceLocator {
  private static instance = new Map<string, any>();

  static register(key: string, factory: () => any): void {
    this.instance.set(key, factory());
  }

  static get<T>(key: string): T {
    return this.instance.get(key);
  }
}

// src/di/injection.ts
export function setupDependencies() {
  // Data sources
  ServiceLocator.register(
    'productRemoteDatasource',
    () => new ProductRemoteDataSource(),
  );

  // Repositories
  ServiceLocator.register('productRepository', () => {
    const remote = ServiceLocator.get('productRemoteDatasource');
    return new ProductRepositoryImpl(remote);
  });

  // Use cases
  ServiceLocator.register('getProductsUsecase', () => {
    const repo = ServiceLocator.get('productRepository');
    return new GetProductsUsecase(repo);
  });
}
```

---

## Data Flow Example: Get Products

```
1. Component renders
   ↓
2. Component calls hook: useProduct()
   ↓
3. Hook uses GetProductsUsecase (from DI)
   ↓
4. UseCase calls ProductRepository.getProducts()
   ↓
5. Repository tries RemoteDataSource (API)
   ├─ Success → Convert Model to Entity → Return
   └─ Failure → Fallback to LocalDataSource (Cache)
   ↓
6. Domain returns Product[] (entities)
   ↓
7. Hook updates state
   ↓
8. Component receives product data
   ↓
9. Component renders ProductCard components
```

---

## Testing Strategy by Layer

### Presentation Layer
- **Test**: Component rendering, user interactions
- **Mock**: Hooks, domain services
- **Tools**: React Native Testing Library, Jest

```typescript
// __tests__/presentation/components/ProductCard.test.tsx
test('should render product name', () => {
  const product = new Product('1', 'Test', 29.99);
  const { getByText } = render(<ProductCard product={product} />);
  expect(getByText('Test')).toBeTruthy();
});
```

### Domain Layer
- **Test**: Business logic, use cases, entities
- **Mock**: Repository interfaces only
- **Tools**: Jest only (no React/RN needed)

```typescript
// __tests__/domain/usecases/product/get_products.usecase.test.ts
test('should return products from repository', async () => {
  const mockRepo = { getProducts: jest.fn() };
  const usecase = new GetProductsUsecase(mockRepo);
  const result = await usecase.execute();
  expect(mockRepo.getProducts).toBeCalled();
});
```

### Data Layer
- **Test**: Repository logic, datasource coordination
- **Mock**: HTTP client, database
- **Tools**: Jest, MSW (Mock Service Worker) for API

```typescript
// __tests__/data/repositories/product.repository.test.ts
test('should return domain entities', async () => {
  const repo = new ProductRepositoryImpl(mockRemote);
  const result = await repo.getProducts();
  expect(result[0]).toBeInstanceOf(Product);
});
```

### Common Layer
- **Test**: Utilities, validators, error handling
- **Mock**: None (pure functions)
- **Tools**: Jest only

---

## Dependency Rule

**The golden rule of Clean Architecture:**

> **Source code dependencies must point inward, toward higher-level policies.**

```
Presentation → Domain ← Data
              ↑        ↓
        Common (Utilities)
```

- ✅ Presentation **depends on** Domain
- ✅ Data **depends on** Domain
- ✅ All layers **can depend on** Common
- ❌ Domain **never depends on** Presentation or Data
- ❌ Presentation **never depends on** Data

---

## File Naming Conventions

- **Entities**: `product.entity.ts`
- **Use Cases**: `get_products.usecase.ts`
- **Repositories**: `product.repository.ts` (interface), `product.repository.impl.ts` (impl)
- **Data Sources**: `product_remote_datasource.ts`, `product_local_datasource.ts`
- **Models**: `product.model.ts`
- **Tests**: `*.test.ts` or `*.spec.ts`
- **Barrel exports**: `index.ts` (re-export from each layer)

---

## Benefits of Clean Architecture

✅ **Testability**: Each layer independently testable  
✅ **Maintainability**: Clear separation of concerns  
✅ **Scalability**: Easy to add features without breaking existing code  
✅ **Flexibility**: Swap implementations without changing business logic  
✅ **Framework Independence**: Core logic not tied to React/RN  
✅ **Code Reusability**: SDK can be used in web, mobile, CLI  
✅ **Reduced Bugs**: Business logic tested in isolation  
✅ **Team Velocity**: Clear structure helps onboarding  

---

## References

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
