# 01 - Naming & Code Conventions

Complete naming and code conventions for Fox eCommerce SDK.

## File & Folder Naming

### Directory Structure
```
src/
├── presentation/      # PascalCase for component files
├── domain/           # snake_case for entity/usecase files
├── data/             # snake_case for datasource/model files
├── common/           # snake_case for utility files
└── di/               # PascalCase for service locator
```

### File Naming Patterns

| Type | Pattern | Example |
|------|---------|---------|
| Components | `PascalCase.tsx` | `ProductCard.tsx` |
| Screens | `PascalCase.tsx` | `ProductListScreen.tsx` |
| Hooks | `snake_case.ts` | `useCart.ts` |
| Entities | `snake_case.entity.ts` | `product.entity.ts` |
| Use Cases | `snake_case.usecase.ts` | `get_products.usecase.ts` |
| Repositories (Interface) | `snake_case.repository.ts` | `product.repository.ts` |
| Repositories (Impl) | `snake_case.repository.impl.ts` | `product.repository.impl.ts` |
| Data Sources | `snake_case_datasource.ts` | `product_remote_datasource.ts` |
| Models | `snake_case.model.ts` | `product.model.ts` |
| Utilities | `snake_case.ts` | `formatPrice.ts` |
| Constants | `snake_case.ts` | `api.constants.ts` |
| Validators | `snake_case.validator.ts` | `email.validator.ts` |
| Tests | `*.test.ts` or `*.spec.ts` | `useCart.test.ts` |
| Barrel Export | `index.ts` | `src/domain/index.ts` |

## TypeScript Naming Conventions

### Types & Interfaces
```typescript
// Interfaces use PascalCase
interface ProductRepository {
  getProducts(): Promise<Product[]>;
}

// Types use PascalCase
type AsyncResult<T> = { ok: true; value: T } | { ok: false; error: Error };

// Enums use PascalCase
enum ProductStatus {
  Available = 'AVAILABLE',
  OutOfStock = 'OUT_OF_STOCK',
}

// Generic types use T, U, V or descriptive names
type Result<T, E> = { ok: boolean; value?: T; error?: E };
```

### Variables & Functions
```typescript
// Variables use camelCase
const productName = 'Premium Product';
let cartTotal = 0;

// Constants use UPPER_SNAKE_CASE
const MAX_CART_ITEMS = 100;
const API_TIMEOUT = 10000;

// Functions use camelCase
function calculateDiscount(price: number, percent: number): number {
  return price * (1 - percent / 100);
}

// Private members use _leading underscore (optional)
private _validatePrice(price: number): boolean {
  return price >= 0;
}

// React Hooks use 'use' prefix
function useCart(): UseCartReturn {
  // hook logic
}
```

### Class Naming
```typescript
// Classes use PascalCase
class Product {
  constructor(id: string, name: string) {}
}

// Abstract classes use 'Abstract' prefix (optional)
abstract class BaseRepository {
  abstract execute(): Promise<any>;
}

// Service locator uses PascalCase
class ServiceLocator {
  static register<T>(key: string, factory: () => T) {}
}
```

## Domain/Data Layer Naming

### Entities
- Represent core business concepts
- Pure business logic only
- Example: `product.entity.ts`, `cart.entity.ts`

```typescript
export class Product {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly price: number,
  ) {}

  isAvailable(): boolean {
    return this.price > 0;
  }
}
```

### Use Cases
- One use case = One business operation
- Named as verb phrases: `GetProducts`, `AddToCart`
- Pattern: `{verb}_{noun}.usecase.ts`

```typescript
export class GetProductsUsecase {
  async execute(): Promise<Product[]> {}
}

export class AddToCartUsecase {
  async execute(product: Product): Promise<Cart> {}
}
```

### Repositories
- Interface: `product.repository.ts`
- Implementation: `product.repository.impl.ts`
- Methods are business-focused (getProducts, not fetchProductsFromAPI)

```typescript
// Interface
export interface ProductRepository {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
}

// Implementation
export class ProductRepositoryImpl implements ProductRepository {
  async getProducts(): Promise<Product[]> {}
}
```

### Data Sources
- Prefix indicates source: `remote_`, `local_`, `cache_`
- Naming: `{entity}_{source}_datasource.ts`

```typescript
export class ProductRemoteDataSource {
  async getProducts(): Promise<ProductModel[]> {}
}

export class ProductLocalDataSource {
  async getProducts(): Promise<ProductModel[]> {}
}
```

## Presentation Layer Naming

### Components
- PascalCase with .tsx extension
- Named as nouns (what they display)

```typescript
export const ProductCard: React.FC<ProductCardProps> = ({}) => {
  return <View>...</View>;
};

export const Cart: React.FC<CartProps> = ({}) => {
  return <FlatList>...</FlatList>;
};
```

### Hooks
- camelCase with `use` prefix
- Named as actions or states

```typescript
export const useCart = (): UseCartReturn => {};
export const useProduct = (): UseProductReturn => {};
export const useFetch = <T,>(url: string): UseFetchReturn<T> => {};
```

### Props Interfaces
- Component name + 'Props' suffix
- PascalCase

```typescript
interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
}

interface CartProps {
  cart: Cart;
  onRemove?: (productId: string) => void;
}
```

## Import Paths

### Absolute Imports (using tsconfig paths)
```typescript
// ✅ Preferred
import { Product } from '@/domain/entities';
import { useCart } from '@/presentation/hooks';
import { colors } from '@/presentation/styles';

// ❌ Avoid
import { Product } from '../../../domain/entities';
```

### Import Order
```typescript
// 1. External libraries
import React from 'react';
import { View, Text } from 'react-native';

// 2. Type imports
import type { Product } from '@/domain/entities';

// 3. Internal imports - organized by layer
import { ProductRepository } from '@/domain/repositories';
import { ProductRepositoryImpl } from '@/data/repositories';
import { colors } from '@/presentation/styles';

// 4. Relative imports (only within same module)
import { helper } from './helper';
```

## Exported Names

### Barrel Exports (index.ts)
```typescript
// src/domain/index.ts
export * from './entities';
export * from './repositories';
export * from './usecases';

// src/presentation/index.ts
export * from './components';
export * from './hooks';
export * from './styles';
```

### Re-exports
```typescript
// ✅ Explicit re-export
export { Product, Cart } from './entities';
export type { ProductRepository } from './repositories';

// ❌ Avoid wildcard for clarity
export * from './entities';  // Unless barrel file
```

## Comments & Documentation

### JSDoc for Public APIs
```typescript
/**
 * Fetches all products from the repository
 * @returns Promise of Product array
 * @throws NetworkFailure if API call fails
 */
export class GetProductsUsecase {
  async execute(): Promise<Product[]> {
    // implementation
  }
}
```

### Inline Comments - Sparingly
```typescript
// Only for non-obvious logic
if (discountPercent < 0 || discountPercent > 100) {
  // Normalize to 0-100 range (business requirement)
  throw new Error('Invalid discount');
}
```

### TODO/FIXME Comments
```typescript
// TODO: Replace with API call
// FIXME: Handle timeout properly
// NOTE: This is a workaround for Android issue
```

## Summary

| Category | Convention | Example |
|----------|-----------|---------|
| **Directories** | lowercase or PascalCase | `src/presentation`, `src/domain` |
| **Components** | PascalCase | `ProductCard.tsx` |
| **Hooks** | camelCase + `use` prefix | `useCart.ts` |
| **Entities** | snake_case | `product.entity.ts` |
| **Use Cases** | snake_case + `.usecase.ts` | `get_products.usecase.ts` |
| **Data Sources** | snake_case + `_datasource.ts` | `product_remote_datasource.ts` |
| **Utilities** | snake_case | `formatPrice.ts` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_ITEMS = 100` |
| **Types** | PascalCase | `ProductRepository`, `AsyncResult<T>` |
| **Variables** | camelCase | `productName`, `cartTotal` |
| **Functions** | camelCase | `calculateDiscount()` |
| **Classes** | PascalCase | `Product`, `ServiceLocator` |
