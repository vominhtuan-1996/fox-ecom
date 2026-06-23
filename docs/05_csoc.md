# 05 - Code Style & Organization Convention

Detailed code formatting, organization, and style guidelines.

## Code Formatting

### Prettier Configuration

**File**: `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "bracketSpacing": true
}
```

### Auto-format on Save

**VSCode** (`settings.json`):
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Run Formatting

```bash
# Format all files
npm run lint:fix

# Format specific file
npx prettier --write src/file.ts
```

---

## TypeScript Style Guide

### Variable Declarations

**Use `const` by default**:
```typescript
// ✅ Good
const name = 'Product';
const age = 25;

// ⚠️ Use let when reassignment needed
let counter = 0;
counter++;

// ❌ Avoid var
var outdated = 'old';  // Don't use
```

### Type Annotations

**Always annotate function signatures**:
```typescript
// ✅ Good
function calculatePrice(price: number, tax: number): number {
  return price * (1 + tax);
}

// ✅ With parameters
const products: Product[] = [];

// ❌ Bad - implicit any
function calculate(price, tax) {
  return price * (1 + tax);
}
```

### Null/Undefined Handling

**Use Optional chaining and Nullish coalescing**:
```typescript
// ✅ Good
const price = product?.price ?? 0;
const description = user?.profile?.bio ?? 'No bio';

// ❌ Bad
const price = product ? product.price : 0;
const description = user && user.profile ? user.profile.bio : 'No bio';
```

### Arrow Functions

**Use arrow functions in callbacks**:
```typescript
// ✅ Good
const doubled = numbers.map((n) => n * 2);

products.forEach((p) => {
  console.log(p.name);
});

// ❌ Bad
const doubled = numbers.map(function(n) { return n * 2; });
```

### Destructuring

**Destructure objects and arrays**:
```typescript
// ✅ Good
const { name, price } = product;
const [first, second] = items;

// Component props
interface Props {
  product: Product;
  onPress?: () => void;
}

export const ProductCard: React.FC<Props> = ({ product, onPress }) => {
  return <View>...</View>;
};

// ❌ Bad
const name = product.name;
const price = product.price;
```

### String Literals

**Use template literals**:
```typescript
// ✅ Good
const message = `Product ${name} costs $${price}`;
const multiline = `Line 1
Line 2
Line 3`;

// ❌ Bad
const message = 'Product ' + name + ' costs $' + price;
const multiline = 'Line 1\nLine 2\nLine 3';
```

### Classes

**Organize class members**:
```typescript
// ✅ Good organization
export class Product {
  // 1. Static properties
  static readonly MAX_PRICE = 10000;

  // 2. Constructor properties (public)
  constructor(
    readonly id: string,
    readonly name: string,
    readonly price: number,
  ) {}

  // 3. Public methods
  isAvailable(): boolean {
    return this.price > 0;
  }

  // 4. Private methods
  private validate(): void {
    if (this.price < 0) throw new Error('Invalid price');
  }
}
```

### Generics

**Use descriptive generic names**:
```typescript
// ✅ Good
interface Result<T, E = Error> {
  ok: boolean;
  value?: T;
  error?: E;
}

type AsyncResult<T> = Promise<Result<T>>;

// ❌ Bad - unclear names
interface Result<A, B> {
  ok: boolean;
  a?: A;
  b?: B;
}
```

---

## React & React Native Style

### Component Structure

**Organize component file**:
```typescript
// 1. Imports (external, then internal)
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Product } from '@/domain/entities';
import { colors, spacing } from '@/presentation/styles';

// 2. Props interface
interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
}

// 3. Component
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const handlePress = useCallback(() => {
    onPress?.(product);
  }, [product, onPress]);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
    </View>
  );
};

// 4. Styles
const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray900,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});
```

### Component Props

**Use interfaces for props**:
```typescript
// ✅ Good
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

// ❌ Bad
interface ButtonProps {
  [key: string]: any;
}
```

### Hooks Usage

**Organize hooks at top of component**:
```typescript
// ✅ Good
export const ProductListScreen: React.FC = () => {
  // 1. State
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 2. Context
  const theme = useContext(ThemeContext);

  // 3. Custom hooks
  const { products, isLoading, error, fetchProducts } = useProduct();
  const { cart, addItem } = useCart();

  // 4. Effects
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 5. Handlers
  const handleSelectProduct = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  // 6. Render
  return <View>...</View>;
};
```

### Conditional Rendering

**Use ternary for simple conditions**:
```typescript
// ✅ Good - simple
return isLoading ? <LoadingIndicator /> : <ProductList />;

// ✅ Good - complex
if (isLoading) {
  return <LoadingIndicator />;
}

if (error) {
  return <ErrorMessage error={error} />;
}

return <ProductList products={products} />;

// ❌ Bad - nested ternaries
return isLoading ? <Loading /> : error ? <Error /> : <List />;

// ❌ Bad - logical AND for elements
return isLoading && <LoadingIndicator />;  // Better use ternary
```

### Memoization

**Use memo for expensive components**:
```typescript
// ✅ Good
export const ProductCard = React.memo(
  ({ product, onPress }: ProductCardProps) => {
    return <View>...</View>;
  },
);

// ✅ useCallback for handlers
const handlePress = useCallback(() => {
  onPress?.();
}, [onPress]);

// ✅ useMemo for computed values
const filteredProducts = useMemo(
  () => products.filter((p) => p.price > min && p.price < max),
  [products, min, max],
);
```

---

## Object & Array Methods

### Array Methods

**Prefer modern array methods**:
```typescript
// ✅ Good
const doubled = numbers.map((n) => n * 2);
const evens = numbers.filter((n) => n % 2 === 0);
const total = numbers.reduce((sum, n) => sum + n, 0);
const found = items.find((item) => item.id === '1');

// ❌ Avoid old patterns
const doubled = [];
for (let i = 0; i < numbers.length; i++) {
  doubled.push(numbers[i] * 2);
}
```

### Object Methods

**Use Object utilities**:
```typescript
// ✅ Good
const keys = Object.keys(product);
const values = Object.values(product);
const entries = Object.entries(product);

const updated = { ...product, price: 99.99 };
const merged = { ...user, ...updates };

// ❌ Bad
const keys = [];
for (const key in product) {
  keys.push(key);
}
```

### Immutability

**Never mutate objects/arrays**:
```typescript
// ✅ Good - create new array
const items = [...oldItems, newItem];
const filtered = items.filter((item) => item.id !== toRemove);

// ✅ Good - create new object
const updated = { ...product, name: 'New Name' };

// ❌ Bad - mutation
items.push(newItem);
product.name = 'New Name';
items.splice(index, 1);
```

---

## Error Handling

### Try-Catch Structure

**Organize error handling**:
```typescript
// ✅ Good
async function fetchData() {
  try {
    const data = await api.get('/products');
    return data;
  } catch (error) {
    if (error instanceof NetworkError) {
      throw new NetworkFailure('Failed to fetch products');
    }
    throw new UnknownFailure('Unexpected error');
  }
}

// ❌ Bad
async function fetchData() {
  const data = await api.get('/products');  // No error handling
  return data;
}
```

### Custom Error Classes

**Extend base error**:
```typescript
// ✅ Good
export class Failure extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationFailure extends Failure {
  constructor(field: string, message: string) {
    super(`${field}: ${message}`);
  }
}

// Usage
if (!email) {
  throw new ValidationFailure('email', 'Email is required');
}
```

---

## Module Organization

### Import Organization

**Group imports logically**:
```typescript
// 1. React/React Native
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';

// 2. Third-party
import { useNavigation } from '@react-navigation/native';

// 3. Type imports (TypeScript)
import type { Product } from '@/domain/entities';
import type { ProductRepository } from '@/domain/repositories';

// 4. Internal imports (organized by layer)
import { GetProductsUsecase } from '@/domain/usecases';
import { ProductRepositoryImpl } from '@/data/repositories';
import { ProductCard } from '@/presentation/components';
import { colors, spacing } from '@/presentation/styles';
import { API_ENDPOINTS } from '@/common/constants';

// 5. Local imports
import { helper } from './helper';
```

### Barrel Exports

**Create barrel exports for folders**:
```typescript
// src/presentation/components/index.ts
export { ProductCard } from './ProductCard';
export { Cart } from './Cart';
export { Button } from './Button';

// Usage
import { ProductCard, Cart } from '@/presentation/components';
```

---

## Comment Style

### JSDoc Comments

**Use for public APIs**:
```typescript
/**
 * Calculates product price after discount
 * @param originalPrice - The original product price
 * @param discountPercent - Discount percentage (0-100)
 * @returns Discounted price
 * @throws ValidationFailure if discount is invalid
 * @example
 * const price = calculateDiscount(100, 10); // Returns 90
 */
export function calculateDiscount(
  originalPrice: number,
  discountPercent: number,
): number {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new ValidationFailure('Discount must be 0-100');
  }
  return originalPrice * (1 - discountPercent / 100);
}
```

### Inline Comments

**Use sparingly for non-obvious code**:
```typescript
// ✅ Good - explains why
if (price < 0) {
  // Negative prices not allowed by business logic
  throw new ValidationFailure('Price cannot be negative');
}

// ❌ Bad - states obvious
const sum = a + b;  // Add a and b
const name = product.name;  // Get product name
```

### TODO/FIXME Comments

**Use for tracking work**:
```typescript
// TODO: Implement API caching
// FIXME: Handle timeout edge case
// NOTE: This workaround is for Android issue #1234
// HACK: Temporary solution until API is updated
```

---

## Naming Style Details

### Boolean Variables

**Use `is`, `has`, `can` prefixes**:
```typescript
// ✅ Good
const isAvailable = product.price > 0;
const hasItems = cart.items.length > 0;
const canCheckout = user.isVerified && cart.total > 0;
const isFetching = isLoading || isSubmitting;

// ❌ Bad
const available = product.price > 0;
const itemCount = cart.items.length;
const checkout = user.isVerified;
```

### Functions

**Use verb prefixes**:
```typescript
// ✅ Good
function getProductById(id: string) {}
function calculateTotal(items: Product[]) {}
function validateEmail(email: string) {}
function handleProductPress(product: Product) {}
function mapModelToDomain(model: ProductModel) {}

// ❌ Bad
function product(id: string) {}
function total(items: Product[]) {}
function email(email: string) {}
function onProductPress(product: Product) {}
```

### Constants

**Use UPPER_SNAKE_CASE**:
```typescript
// ✅ Good
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 5000;
const API_ENDPOINTS = { PRODUCTS: '/products' };
const INITIAL_CART_VALUE = { items: [], total: 0 };

// ❌ Bad
const maxRetry = 3;
const defaultTimeout = 5000;
const api_endpoints = { products: '/products' };
```

---

## Spacing & Indentation

### Line Length

**Max 100 characters** (configured in `.prettierrc`):
```typescript
// ✅ Good - within 100 chars
const result = calculatePrice(
  basePrice,
  taxRate,
  discountPercent,
);

// ❌ Bad - too long
const result = calculatePrice(basePrice, taxRate, discountPercent, shippingCost, promoCode);
```

### Blank Lines

**Use for logical separation**:
```typescript
// ✅ Good
export class Product {
  constructor(readonly id: string, readonly name: string) {}

  // Blank line before method
  isAvailable(): boolean {
    return true;
  }

  // Blank line before next method
  getDiscount(percent: number): number {
    return this.price * (1 - percent / 100);
  }
}
```

### Indentation

**Use 2 spaces** (configured):
```typescript
// ✅ Good
function example() {
  if (condition) {
    doSomething();
  }
}

// ❌ Bad - 4 spaces or tabs
function example() {
    if (condition) {
        doSomething();
    }
}
```

---

## Code Complexity Guidelines

### Function Complexity

**Keep functions small and focused**:
```typescript
// ✅ Good - Single responsibility
async function getProduct(id: string): Promise<Product> {
  if (!id) throw new ValidationFailure('ID required');
  return await this.repository.getProductById(id);
}

// ❌ Bad - Multiple responsibilities
async function processProduct(id: string) {
  if (!id) throw new Error('Invalid');
  const product = await fetch(`/api/products/${id}`);
  const price = product.price * 1.1;
  await saveToStorage(product);
  sendAnalytics(product);
  return product;
}
```

### Cyclomatic Complexity

**Keep below 10**:
```typescript
// ✅ Good - Simple logic
function validate(value: number): boolean {
  return value >= 0 && value <= 100;
}

// ❌ Bad - Complex nested conditions
function process(a: any, b: any, c: any, d: any) {
  if (a) {
    if (b) {
      if (c) {
        if (d) {
          return true;
        }
      }
    }
  }
  return false;
}

// ✅ Better - Extract logic
const isValid = () => a && b && c && d;
```

---

## Summary

| Aspect | Style |
|--------|-------|
| **Formatter** | Prettier with semicolons |
| **Quote** | Single quotes (`'`) |
| **Trailing Comma** | All positions |
| **Tab Width** | 2 spaces |
| **Line Length** | 100 characters |
| **Arrow Parens** | Always include |
| **Functions** | Arrow functions in callbacks |
| **Destructuring** | Always when possible |
| **Immutability** | Never mutate |
| **Constants** | UPPER_SNAKE_CASE |
| **Booleans** | `is`, `has`, `can` prefixes |
| **Comments** | JSDoc for public, sparse inline |
| **Import Order** | External → Types → Internal → Local |
| **Class Members** | Static → Constructor → Public → Private |
| **Error Handling** | Custom error classes |
| **Array Methods** | map, filter, reduce preferred |
| **Template Literals** | Preferred over concatenation |
| **Nullish** | Optional chaining & nullish coalescing |

---

## Linting Commands

```bash
# Check for style issues
npm run lint

# Auto-fix style issues
npm run lint:fix

# Format with Prettier
npx prettier --write src/

# Check TypeScript
npm run type-check

# All at once
npm run lint:fix && npm run type-check && npm test
```

---

## IDE Setup Recommendations

### VSCode Extensions
- `ESLint` - Code quality
- `Prettier - Code formatter` - Auto-format
- `TypeScript Vue Plugin` - TypeScript support
- `Thunder Client` or `REST Client` - API testing

### VSCode Settings
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```
