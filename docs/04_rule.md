# 04 - Development Rules & Guidelines

Mandatory rules and guidelines for maintaining code quality and architecture integrity.

## Core Architecture Rules (Must Follow)

### 1. Dependency Rule - Golden Rule of Clean Architecture

> **Source code dependencies must point inward toward higher-level policies**

```
Presentation ──→ Domain ← Data ← (Sources)
       ↘            ↓            ↙
        └─→ Common ←─┘
```

**What this means**:

✅ **Allowed**:
- `Presentation` imports from `Domain`, `Common`, `DI`
- `Domain` imports from `Common` only
- `Data` imports from `Domain` (interfaces only), `Common`
- `Common` imports nothing (utilities only)
- `DI` imports from all layers (wires dependencies)

❌ **Forbidden**:
- `Domain` → `Presentation` (business never depends on UI)
- `Domain` → `Data` (only interfaces, never implementations)
- `Data` → `Presentation` (data never knows about UI)
- `Presentation` → `Data` (UI never calls data directly)
- `Common` → any layer (common is leaf node)

**Checking the rule**:
```bash
# Inspect imports in your files
grep -r "from.*presentation" src/domain/
grep -r "from.*data" src/domain/
```

### 2. No Business Logic in Presentation

**Rule**: Components and hooks contain only UI logic, no business rules.

✅ **Good**:
```typescript
// Hook delegates to use case
export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<Cart>(new Cart());
  
  const addItem = async (product: Product) => {
    const usecase = ServiceLocator.get<AddToCartUsecase>('AddToCartUsecase');
    const updated = await usecase.execute(product);
    setCart(updated);
  };
  
  return { cart, addItem };
};
```

❌ **Bad**:
```typescript
// Don't put business logic in components
export const useCart = () => {
  const addItem = (product: Product) => {
    // ❌ Business rule: calculate total
    const total = items.reduce((sum, item) => sum + item.price, 0);
    // This belongs in domain layer
  };
};
```

### 3. No I/O Operations in Domain

**Rule**: Domain layer contains zero I/O (no fetch, no storage, no file reads).

✅ **Good**:
```typescript
// Domain: Pure business logic
export class AddToCartUsecase {
  constructor(private cartRepository: CartRepository) {}
  
  async execute(product: Product): Promise<Cart> {
    // Call repository interface (abstract)
    const cart = await this.cartRepository.getCart();
    return cart.addItem(product);
  }
}
```

❌ **Bad**:
```typescript
// ❌ Don't do I/O in domain
export class AddToCartUsecase {
  async execute(product: Product) {
    // ❌ Direct API call
    const response = await fetch('/api/cart');
    
    // ❌ Direct storage
    await AsyncStorage.setItem('cart', JSON.stringify(cart));
  }
}
```

### 4. Repository Pattern - Always Use

**Rule**: All data access goes through repository interfaces.

✅ **Good**:
```typescript
// Domain: Interface
export interface ProductRepository {
  getProducts(): Promise<Product[]>;
}

// Data: Implementation
export class ProductRepositoryImpl implements ProductRepository {
  async getProducts(): Promise<Product[]> {
    const data = await this.remoteDataSource.getProducts();
    return data.map((m) => m.toDomain());
  }
}

// Presentation: Use via DI
const repo = ServiceLocator.get<ProductRepository>('ProductRepository');
const products = await repo.getProducts();
```

❌ **Bad**:
```typescript
// ❌ Direct data source usage
export const useProduct = () => {
  const fetchProducts = async () => {
    const response = await fetch('/api/products');
  };
};
```

### 5. Entities Must Have Business Logic

**Rule**: Entity classes contain methods for domain operations.

✅ **Good**:
```typescript
export class Product {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly price: number,
  ) {}

  // ✅ Business methods in entity
  isAvailable(): boolean {
    return this.price > 0;
  }

  getPriceAfterDiscount(percent: number): number {
    return this.price * (1 - percent / 100);
  }
}
```

❌ **Bad**:
```typescript
// ❌ Entity with no logic
export class Product {
  id: string;
  name: string;
  price: number;
}
```

### 6. Dependency Injection Must Be Used

**Rule**: Never instantiate dependencies manually, always use ServiceLocator.

✅ **Good**:
```typescript
// Setup once at app start
setupDependencies();

// Use anywhere
const usecase = ServiceLocator.get<GetProductsUsecase>('GetProductsUsecase');
```

❌ **Bad**:
```typescript
// ❌ Don't instantiate manually
const datasource = new ProductRemoteDataSource();
const repo = new ProductRepositoryImpl(datasource);
const usecase = new GetProductsUsecase(repo);
```

---

## Code Quality Rules

### 7. TypeScript Strict Mode - Always

**Rule**: Enable all TypeScript strict checks, no `any` types.

**Configuration** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true
  }
}
```

✅ **Good**:
```typescript
function calculatePrice(price: number, tax: number): number {
  return price * (1 + tax);
}

const result: number = calculatePrice(100, 0.1);
```

❌ **Bad**:
```typescript
// ❌ Using any
function calculate(price: any, tax: any): any {
  return price * (1 + tax);
}
```

### 8. No Console Logs in Production Code

**Rule**: Use proper logging framework, not console.

✅ **Good**:
```typescript
import { Logger } from './common/logger';

Logger.info('Product fetched');
Logger.error('Network error', error);
```

❌ **Bad**:
```typescript
console.log('Product fetched');
console.error('Network error', error);
```

### 9. Error Handling - Always

**Rule**: Handle all possible errors, use try-catch or error callbacks.

✅ **Good**:
```typescript
async execute(productId: string): Promise<Product | null> {
  try {
    return await this.repository.getProductById(productId);
  } catch (error) {
    throw new NotFoundFailure(`Product ${productId} not found`);
  }
}
```

❌ **Bad**:
```typescript
// ❌ No error handling
async execute(productId: string): Promise<Product> {
  return await this.repository.getProductById(productId);
}
```

### 10. Validation at Boundaries

**Rule**: Validate all inputs at system boundaries (API, user input).

✅ **Good**:
```typescript
async execute(productId: string): Promise<Product> {
  // Validate at boundary
  if (!productId || productId.trim().length === 0) {
    throw new ValidationFailure('Product ID cannot be empty');
  }
  
  // Domain trusts validated data
  return await this.repository.getProductById(productId);
}
```

❌ **Bad**:
```typescript
// ❌ No validation
async execute(productId: string): Promise<Product> {
  return await this.repository.getProductById(productId);
}
```

---

## Testing Rules

### 11. Unit Tests Required for Domain

**Rule**: All domain entities and use cases must have 80%+ test coverage.

**Coverage Threshold** (`jest.config.js`):
```javascript
{
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    },
    "src/domain/**": {
      "branches": 80,
      "functions": 80,
      "lines": 80
    }
  }
}
```

✅ **Good**:
```typescript
// __tests__/domain/usecases/product/get_products.usecase.test.ts
describe('GetProductsUsecase', () => {
  it('should return products from repository', async () => {
    const mockRepo = { getProducts: jest.fn() };
    const usecase = new GetProductsUsecase(mockRepo);
    await usecase.execute();
    expect(mockRepo.getProducts).toHaveBeenCalled();
  });
});
```

### 12. Integration Tests for Data Layer

**Rule**: Test repository implementations with real or mocked datasources.

✅ **Good**:
```typescript
// __tests__/data/repositories/product.repository.test.ts
describe('ProductRepositoryImpl', () => {
  it('should fall back to local when remote fails', async () => {
    const failingRemote = { getProducts: jest.fn().mockRejectedValue(new Error()) };
    const localCache = { getProducts: jest.fn().mockResolvedValue([...]) };
    const repo = new ProductRepositoryImpl(failingRemote, localCache);
    
    const result = await repo.getProducts();
    expect(result).toBeDefined();
  });
});
```

### 13. Component Tests - Snapshot + Behavior

**Rule**: Test component rendering and user interactions.

✅ **Good**:
```typescript
// __tests__/presentation/components/ProductCard.test.tsx
test('should render product name', () => {
  const product = new Product('1', 'Test', 29.99);
  const { getByText } = render(<ProductCard product={product} />);
  expect(getByText('Test')).toBeTruthy();
});

test('should call onPress when tapped', () => {
  const onPress = jest.fn();
  const { getByTestId } = render(<ProductCard product={...} onPress={onPress} />);
  fireEvent.press(getByTestId('card'));
  expect(onPress).toHaveBeenCalled();
});
```

### 14. Mock External Dependencies Only

**Rule**: Mock repositories and datasources, never mock domain entities.

✅ **Good**:
```typescript
const mockRepository = {
  getProducts: jest.fn().mockResolvedValue([...])
};
const usecase = new GetProductsUsecase(mockRepository);
```

❌ **Bad**:
```typescript
// ❌ Don't mock domain entities
jest.mock('src/domain/entities/Product');
```

---

## File & Module Rules

### 15. Barrel Exports for Public APIs

**Rule**: Each folder must have `index.ts` that exports public symbols.

✅ **Good**:
```typescript
// src/domain/entities/index.ts
export { Product } from './product.entity';
export { Cart } from './cart.entity';
export { User } from './user.entity';

// Usage
import { Product, Cart } from '@/domain/entities';
```

❌ **Bad**:
```typescript
// ❌ Don't import internal files
import Product from '@/domain/entities/product.entity';
```

### 16. One Use Case Per File

**Rule**: Each use case gets its own file.

✅ **Good**:
```
src/domain/usecases/cart/
  ├── add_to_cart.usecase.ts
  ├── remove_from_cart.usecase.ts
  ├── clear_cart.usecase.ts
  └── index.ts
```

❌ **Bad**:
```
src/domain/usecases/
  └── cart.usecases.ts  # ❌ Multiple use cases in one file
```

### 17. Keep Files Small

**Rule**: Follow these size guidelines:

| Type | Max Size |
|------|----------|
| Component | 300 lines |
| Hook | 150 lines |
| Use Case | 100 lines |
| Repository | 200 lines |
| Test | 250 lines |

**If exceeding**: Break into smaller pieces or extract utilities.

### 18. Model Layer Must Convert

**Rule**: Models must convert to/from domain entities.

✅ **Good**:
```typescript
export class ProductModel {
  constructor(readonly id: string, readonly name: string) {}
  
  // Must have conversion method
  toDomain(): Product {
    return new Product(this.id, this.name);
  }
}
```

❌ **Bad**:
```typescript
// ❌ Model doesn't convert to entity
export class ProductModel {
  constructor(readonly id: string, readonly name: string) {}
}
```

---

## API Design Rules

### 19. Repositories Define Business Operations

**Rule**: Repository methods reflect business intent, not HTTP verbs.

✅ **Good**:
```typescript
interface ProductRepository {
  getProducts(): Promise<Product[]>;        // Business: fetch products
  getProductById(id: string): Promise<...>; // Business: get one
  searchProducts(query: string): Promise<...>; // Business: search
}
```

❌ **Bad**:
```typescript
interface ProductRepository {
  get('/api/products'): Promise<...>;  // ❌ Technical verbs
  post('/api/products'): Promise<...>;
}
```

### 20. Use Cases Encapsulate Business Operations

**Rule**: Each use case implements one business operation.

✅ **Good**:
```typescript
// One operation per class
export class AddToCartUsecase {
  async execute(product: Product): Promise<Cart> {}
}

export class RemoveFromCartUsecase {
  async execute(productId: string): Promise<Cart> {}
}
```

❌ **Bad**:
```typescript
// ❌ Multiple operations in one class
export class CartUsecase {
  async add(product: Product): Promise<Cart> {}
  async remove(id: string): Promise<Cart> {}
  async clear(): Promise<Cart> {}
}
```

---

## Documentation Rules

### 21. JSDoc for Public APIs

**Rule**: All public functions/classes in domain must have JSDoc.

✅ **Good**:
```typescript
/**
 * Retrieves all products from the repository
 * @returns Promise of Product array sorted by name
 * @throws NetworkFailure if API call fails
 * @throws CacheFailure if local cache unavailable
 */
export class GetProductsUsecase {
  async execute(): Promise<Product[]> {}
}
```

### 22. README in Each Layer

**Rule**: Each major layer should have a README explaining its purpose.

✅ **Good**:
```
src/domain/
  ├── README.md  # Explain: business logic, entities, use cases
  ├── entities/
  ├── usecases/
  └── repositories/
```

### 23. No Commented Code

**Rule**: Delete dead code, don't comment it out.

❌ **Bad**:
```typescript
// const oldImplementation = (price: number) => price * 1.1;
const newImplementation = (price: number) => price * (1 + TAX_RATE);
```

✅ **Good**:
```typescript
const calculateTax = (price: number): number => price * (1 + TAX_RATE);
```

---

## Security Rules

### 24. No Secrets in Code

**Rule**: Never hardcode API keys, passwords, or tokens.

✅ **Good**:
```typescript
// .env
API_KEY=secret_key_from_env

// src/common/constants/api.constants.ts
export const API_KEY = process.env.API_KEY;
```

❌ **Bad**:
```typescript
const API_KEY = 'hardcoded_secret_key'; // ❌ SECURITY RISK
```

### 25. Validate All Inputs

**Rule**: Never trust external input (API, user, storage).

✅ **Good**:
```typescript
export const validatePrice = (price: number): boolean => {
  return price >= 0 && isFinite(price);
};

const price = parseFloat(userInput);
if (!validatePrice(price)) {
  throw new ValidationFailure('Invalid price');
}
```

### 26. Sanitize User Input

**Rule**: Clean user input before using in business logic.

✅ **Good**:
```typescript
const productId = userInput.trim().toLowerCase();
if (!productId) {
  throw new ValidationFailure('Product ID required');
}
```

---

## Git & Commit Rules

### 27. Atomic Commits

**Rule**: One logical change per commit.

✅ **Good**:
```
commit 1: Add Product entity with business logic
commit 2: Add GetProductsUsecase
commit 3: Add ProductRepository interface
```

❌ **Bad**:
```
commit 1: Add everything - entity, usecase, repo, component, test
```

### 28. Meaningful Commit Messages

**Rule**: Use present tense, describe what change does.

✅ **Good**:
```
Add Product entity with discount calculation
Update ProductRepository to support search
Fix cart total calculation for multiple items
```

❌ **Bad**:
```
fix bug
update stuff
changes
wip
```

### 29. No Direct Commits to Main

**Rule**: Always use feature branches, require PR review.

```bash
git checkout -b feature/add-search-usecase
# Make changes
git push origin feature/add-search-usecase
# Create PR on GitHub
# Get reviewed and approved
git merge to main
```

---

## Performance Rules

### 30. Lazy Loading & Code Splitting

**Rule**: Use lazy loading for large feature sets.

✅ **Good**:
```typescript
const CartScreen = React.lazy(() => import('@/presentation/screens/CartScreen'));
```

### 31. Memoization for Expensive Computations

**Rule**: Use `useMemo` and `useCallback` appropriately.

✅ **Good**:
```typescript
const discountedPrice = useMemo(
  () => calculateDiscount(price, discount),
  [price, discount]
);
```

### 32. Avoid N+1 Queries

**Rule**: Batch requests, don't loop and fetch.

✅ **Good**:
```typescript
// ✅ One batch request
const products = await repo.getProducts();

// ❌ N+1 queries
for (const id of productIds) {
  await repo.getProductById(id);  // N separate calls
}
```

---

## Summary Table

| # | Rule | Layer | Severity |
|---|------|-------|----------|
| 1-6 | Architecture | All | 🔴 CRITICAL |
| 7-10 | Code Quality | All | 🔴 CRITICAL |
| 11-14 | Testing | Domain/Data | 🟡 HIGH |
| 15-20 | Modules & APIs | All | 🟡 HIGH |
| 21-23 | Documentation | All | 🟢 MEDIUM |
| 24-26 | Security | All | 🔴 CRITICAL |
| 27-29 | Git Workflow | All | 🟡 HIGH |
| 30-32 | Performance | All | 🟢 MEDIUM |

---

## Checklist Before PR

- [ ] Code follows naming conventions (01_convention.md)
- [ ] Respects layer structure (02_structure.md)
- [ ] Uses correct tech stack (03_tech.md)
- [ ] Follows all must-follow rules (#1-6)
- [ ] Has 80%+ test coverage
- [ ] Passes `npm run lint`
- [ ] Passes `npm run type-check`
- [ ] Passes `npm test`
- [ ] Updated documentation
- [ ] No console.logs or commented code
