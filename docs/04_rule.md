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

### 7. Dùng React JS thuần — KHÔNG dùng TypeScript 🔴 CRITICAL

**Rule**: Toàn bộ source code viết bằng **JavaScript thuần (ES6+)**, không dùng TypeScript.

- File extension: `.js` và `.jsx` — **không dùng `.ts` / `.tsx`**
- Không cần `tsconfig.json`, không chạy `tsc`, không `type-check`
- Không dùng type annotation, interface, generic, enum TypeScript
- JSDoc comment (`/** @param */`) dùng để document nếu cần, không bắt buộc
- PropTypes (`prop-types` package) dùng thay TypeScript nếu cần validate props ở runtime

✅ **Đúng**:
```js
// OrderCard.jsx
import React from 'react';
import { View, Text } from 'react-native';

export function OrderCard({ order, onPress }) {
  return (
    <View>
      <Text>{order.itemDesc}</Text>
    </View>
  );
}
```

❌ **Sai — không dùng TypeScript**:
```tsx
// ❌ Không dùng .tsx, không dùng interface, type annotation
interface OrderCardProps {
  order: Order;
  onPress: () => void;
}
export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => { ... }
```

**Khi AI sinh code**: luôn sinh `.js`/`.jsx`, không sinh `.ts`/`.tsx`, không thêm type annotation.

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

### 21. All API Calls Must Use Core HttpClient

**Rule**: Tất cả API calls bắt buộc phải sử dụng `HttpClient` từ `src/data/sources/`.

**Why**: Centralized HTTP handling, consistent error handling, retry logic, auth token management, logging.

✅ **Good**:
```typescript
// Data source
export class ProductRemoteDataSource {
  constructor(private httpClient: HttpClient) {}

  async getProducts(): Promise<ProductModel[]> {
    try {
      const response = await this.httpClient.get<any>('/products');
      return response.data.map((item: any) => ProductModel.fromJson(item));
    } catch (error) {
      throw new NetworkFailure('Failed to fetch products');
    }
  }
}

// Repository
export class ProductRepositoryImpl implements ProductRepository {
  constructor(private datasource: ProductRemoteDataSource) {}

  async getProducts(): Promise<Product[]> {
    const models = await this.datasource.getProducts();
    return models.map((m) => m.toDomain());
  }
}
```

❌ **Bad**:
```typescript
// ❌ Direct fetch call
export class ProductRemoteDataSource {
  async getProducts(): Promise<ProductModel[]> {
    const response = await fetch('/products');  // ❌ No retry, no auth, no error mapping
    return response.json();
  }
}

// ❌ Using axios without core wrapper
import axios from 'axios';
export class ProductRemoteDataSource {
  async getProducts(): Promise<ProductModel[]> {
    const response = await axios.get('/products');  // ❌ Different error handling
  }
}

// ❌ HTTP calls in use case (should be in datasource)
export class GetProductsUsecase {
  async execute(): Promise<Product[]> {
    const response = await fetch('/products');  // ❌ Wrong layer
  }
}
```

**HttpClient Features**:
- ✅ Retry logic with exponential backoff
- ✅ Automatic token refresh on 401
- ✅ Timeout handling
- ✅ Consistent error mapping to domain exceptions
- ✅ Curl logging in dev mode
- ✅ Auth token management

**Setup**:
```typescript
// In DI setup
import { HttpClient } from '@/data/sources';

const httpClient = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  retryAttempts: 3,
});

httpClient.setAuthToken(token);
httpClient['retryAuth'].setRefreshHandler(refreshTokenFn);
```

---

## Documentation Rules

### 22. JSDoc for Public APIs

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

### 23. README in Each Layer

**Rule**: Each major layer should have a README explaining its purpose.

✅ **Good**:
```
src/domain/
  ├── README.md  # Explain: business logic, entities, use cases
  ├── entities/
  ├── usecases/
  └── repositories/
```

### 24. No Commented Code

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

### 25. No Secrets in Code

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

### 26. Validate All Inputs

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

### 27. Sanitize User Input

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

### 28. Atomic Commits

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

### 29. Meaningful Commit Messages

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

### 30. No Direct Commits to Main

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

### 31. Lazy Loading & Code Splitting

**Rule**: Use lazy loading for large feature sets.

✅ **Good**:
```typescript
const CartScreen = React.lazy(() => import('@/presentation/screens/CartScreen'));
```

### 32. Memoization for Expensive Computations

**Rule**: Use `useMemo` and `useCallback` appropriately.

✅ **Good**:
```typescript
const discountedPrice = useMemo(
  () => calculateDiscount(price, discount),
  [price, discount]
);
```

### 33. Avoid N+1 Queries

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

### 34. Mandatory Theme Usage for UI Values

**Rule**: All colors, text styles, and spacing values must come from `theme` system. Never hardcode them.

**Why**: Centralized styling enables:
- Brand consistency across app
- Easy theme switching (dark mode, white-label, etc.)
- Single source of truth for design tokens

✅ **Good**:
```typescript
import { colors, spacing, typography } from 'fox-ecom';

const styles = StyleSheet.create({
  button: {
    ...typography.bodyMedium,
    color: colors.white,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
  },
});
```

❌ **Bad**:
```typescript
const styles = StyleSheet.create({
  button: {
    fontSize: 16,
    color: '#FFF',
    backgroundColor: '#FF6B35',  // Hardcoded color
    paddingHorizontal: 12,        // Hardcoded spacing
  },
});
```

**Report When Missing**: If a design value isn't in the theme:
1. Add to appropriate theme file (colors.ts, typography.ts, spacing.ts)
2. Report in commit message that it was added
3. Never use hardcoded values as temporary workaround

**Available Theme Values**:
- `colors`: 25+ semantic colors (primary, secondary, neutral, success/warning/error, text variants)
- `typography`: display, h1-h3, body, label, caption with font sizes 12-36px
- `spacing`: xs-5xl (4px-48px), borderRadius, shadows (sm/md/lg/xl)
- `fontWeight`: light, normal, medium, semibold, bold, extrabold
- `lineHeight`: tight, normal, relaxed, loose

**Exception**: Data visualization (charts, custom algorithms) may use computed colors if theme doesn't provide that variant. Document the exception.

---

### 35. Kiểm tra tương thích trước khi cài thư viện mới

**Rule**: Trước khi chạy `npm install <package>`, bắt buộc kiểm tra tương thích với tech stack hiện tại.

**Tại sao**: Dự án dùng React Native **0.65.3** và React **17.0.2** — các phiên bản này cũ hơn nhiều so với mặc định của các thư viện mới. Cài nhầm phiên bản có thể:
- Gây lỗi native pod install không compile được
- Tạo peer dependency conflict không resolve được
- Buộc phải uninstall và tìm giải pháp thay thế (lãng phí thời gian)

**Ví dụ thực tế**:
```
❌ npm install @gorhom/bottom-sheet react-native-reanimated
→ react-native-reanimated@4.x yêu cầu react-native-worklets matching version
→ RNReanimated.podspec validate fail: "[Reanimated] Failed to validate worklets version"
→ Không tương thích với RN 0.65.3
→ Phải uninstall, dùng Animated + Modal thuần thay thế
```

**Checklist bắt buộc trước khi `npm install`**:

```
□ 1. Xem README của thư viện → mục "Requirements" hoặc "Compatibility"
□ 2. Kiểm tra peerDependencies trong package.json của thư viện:
       npm info <package> peerDependencies
□ 3. So sánh với tech đang dùng (xem 03_tech.md):
       - React Native: 0.65.3
       - React: 17.0.2
       - Node: 25.9.0
□ 4. Kiểm tra thư viện có cần native module không (pod install)
□ 5. Nếu có native module → kiểm tra CHANGELOG xem có breaking change với RN 0.65 không
□ 6. Nếu không chắc → tìm phiên bản cũ hơn tương thích:
       npm info <package> versions
       npm install <package>@<compatible-version>
```

**Cách kiểm tra nhanh**:
```bash
# Xem peer dependencies
npm info react-native-reanimated peerDependencies

# Xem tất cả versions
npm info react-native-reanimated versions --json | tail -1

# Cài phiên bản cụ thể an toàn hơn
npm install react-native-reanimated@2.x --legacy-peer-deps
```

**Bảng phiên bản tương thích đã kiểm chứng** (cập nhật khi thêm thư viện mới):

| Thư viện | Version tương thích | Version KHÔNG dùng | Ghi chú |
|----------|--------------------|--------------------|---------|
| react-native-svg | 15.15.5 | - | OK với RN 0.65.3 |
| react-native-svg-transformer | 1.5.3 | - | OK với Metro 0.66.2 |
| @react-native-async-storage/async-storage | 1.17.11 | 2.x+ | 2.x yêu cầu RN 0.71+ |
| react-native-reanimated | 2.x | **4.x, 3.x** | 3.x+ yêu cầu RN 0.68+ |
| @gorhom/bottom-sheet | 4.x | **5.x** | 5.x yêu cầu reanimated 3+ |
| react-native-gesture-handler | 2.x | 3.x | 3.x yêu cầu RN 0.68+ |

**Khi thư viện không tương thích, ưu tiên theo thứ tự**:
1. Tìm phiên bản cũ hơn của thư viện tương thích với RN 0.65.3
2. Tìm thư viện thay thế có cùng chức năng nhưng ít dependency hơn
3. **Tự implement bằng React Native built-in** (`Animated`, `Modal`, `PanResponder`, `StyleSheet`)

> Thư viện built-in không cần pod install, không có peer dependency conflict, không bị breaking change.

---

### 36. Không dùng text literal trực tiếp — phải dùng SdkStrings 🔴 CRITICAL

**Rule**: Mọi chuỗi hiển thị ra UI (label, placeholder, thông báo lỗi, tiêu đề, toast…) **bắt buộc** lấy từ `SdkStrings` tại `src/common/language/sdk_strings.ts`.

**Tại sao**:
- Tập trung quản lý toàn bộ copy text ở một nơi — dễ sửa, dễ đồng bộ
- Chuẩn bị nền tảng cho i18n/l10n sau này (chỉ cần swap implementation của `SdkStrings`)
- Tránh duplicate string rải rác khắp codebase

**Quy trình bắt buộc khi viết code có text**:

```
1. Tìm key phù hợp trong SdkStrings trước
2. Nếu có → dùng luôn: SdkStrings.<namespace>.<key>
3. Nếu chưa có → khai báo thêm vào đúng namespace trong sdk_strings.ts, rồi dùng
4. KHÔNG ĐƯỢC inline string trực tiếp trong component / alert / placeholder
```

**Namespace hiện có**:

| Namespace | Dùng cho |
|-----------|----------|
| `common` | ok, cancel, confirm, close, back, loading, error, success… |
| `auth` | login, username, password, token, error messages |
| `selector` | search placeholder, no data, all loaded |
| `dialog` | title mặc định, button labels, input placeholder |
| `toast` | success, error, warning, info message |
| `navigator` | back label, default title |
| `product` | add to cart, out of stock, price format |
| `cart` | title, empty state, checkout, total |

**Ví dụ ✅ đúng**:
```tsx
import { SdkStrings } from '@/common/language';

// Alert
Alert.alert(SdkStrings.common.error, SdkStrings.auth.errorEmptyUsername);

// Placeholder
<TextInput placeholder={SdkStrings.selector.searchPlaceholder} />

// Button label
<Text>{SdkStrings.common.confirm}</Text>
```

**Ví dụ ❌ sai** — vi phạm rule #36:
```tsx
Alert.alert('Lỗi', 'Vui lòng nhập username');   // ❌ hardcoded
<TextInput placeholder="Tìm kiếm..." />           // ❌ hardcoded
<Text>Xác nhận</Text>                             // ❌ hardcoded
```

**Ngoại lệ** (không cần SdkStrings):
- String trong code logic (enum values, API keys, route keys, log messages)
- String trong test file
- String trong `CLAUDE.md` / docs

---

### 37. Không tự ý hardcode màu sắc, font, spacing, typography — phải lấy từ Theme 🔴 CRITICAL

**Rule**: Mọi giá trị về màu sắc (`color`, `backgroundColor`, `borderColor`…), font (`fontSize`, `fontWeight`, `lineHeight`…), khoảng cách (`padding`, `margin`, `gap`…), border radius, và shadow đều **phải lấy từ theme** tại `src/common/theme/`.

**Tại sao**:
- Một token thay đổi trong theme → toàn bộ SDK cập nhật đồng bộ
- Hardcode gây ra màu/size không nhất quán, khó maintain
- Chuẩn bị cho dark mode, custom branding, white-label sau này

---

#### Quy trình bắt buộc khi viết style có màu / font / spacing

```
1. Kiểm tra trong theme xem đã có token phù hợp chưa
2. Nếu có → dùng luôn
3. Nếu chưa có → HỎI NGƯỜI DÙNG để bổ sung token vào file theme tương ứng
                  KHÔNG được tự ý đặt giá trị mới
4. Sau khi người dùng xác nhận → khai báo token, rồi dùng
```

> ⚠️ Bước 3 là bắt buộc: Claude KHÔNG được tự quyết định giá trị màu/font/spacing mới khi chưa có trong theme.

---

#### Theme hiện có — tham chiếu nhanh

**`src/common/theme/colors.ts`**

| Token | Giá trị | Dùng cho |
|-------|---------|----------|
| `colors.primary` | `#FF6B35` | CTA button, accent |
| `colors.secondary` | `#004E89` | Header, nav bar |
| `colors.secondaryLight` | `#1976D2` | Link, active state |
| `colors.background` | `#FFFFFF` | Screen background |
| `colors.surface` | `#F9FAFB` | Card, input background |
| `colors.text` | `#111827` | Body text |
| `colors.textSecondary` | `#6B7280` | Hint, subtitle |
| `colors.textTertiary` | `#9CA3AF` | Placeholder |
| `colors.textInverse` | `#FFFFFF` | Text trên nền tối |
| `colors.border` | `#E5E7EB` | Divider, border |
| `colors.success/warning/error/info` | semantic | Status indicators |
| `colors.gray50–gray900` | scale | Các sắc thái xám |

**`src/common/theme/spacing.ts`**

| Token | Value | Token | Value |
|-------|-------|-------|-------|
| `spacing.xs` | 4 | `spacing.xl` | 20 |
| `spacing.sm` | 8 | `spacing['2xl']` | 24 |
| `spacing.md` | 12 | `spacing['3xl']` | 32 |
| `spacing.lg` | 16 | `spacing['4xl']` | 40 |

`borderRadius`: `sm=4` · `md=8` · `lg=12` · `xl=16` · `full=9999`

`shadows`: `sm` · `md` · `lg` · `xl`

**`src/common/theme/typography.ts`**

| Token | fontSize | fontWeight |
|-------|----------|------------|
| `typography.display` | 36 | bold |
| `typography.h1` | 30 | bold |
| `typography.h2` | 24 | bold |
| `typography.h3` | 20 | semibold |
| `typography.body` | 16 | normal |
| `typography.bodyMedium` | 16 | medium |
| `typography.bodySm` | 14 | normal |
| `typography.label` | 14 | medium |
| `typography.labelSm` | 12 | medium |
| `typography.caption` | 12 | normal |

`fontSize` scale: `xs=12` · `sm=14` · `base=16` · `lg=18` · `xl=20` · `2xl=24` · `3xl=30` · `4xl=36`

`fontWeight`: `light=300` · `normal=400` · `medium=500` · `semibold=600` · `bold=700` · `extrabold=800`

---

#### Ví dụ ✅ đúng

```tsx
import { colors, spacing, typography, borderRadius, shadows } from '@/common/theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,       // ✅ từ theme
    padding: spacing.lg,                   // ✅ từ theme
    borderRadius: borderRadius.lg,         // ✅ từ theme
    ...shadows.md,                         // ✅ từ theme
  },
  title: {
    ...typography.h3,                      // ✅ từ theme
    color: colors.text,                    // ✅ từ theme
  },
  hint: {
    ...typography.caption,                 // ✅ từ theme
    color: colors.textTertiary,            // ✅ từ theme
  },
});
```

#### Ví dụ ❌ sai — vi phạm rule #37

```tsx
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9FAFB',   // ❌ hardcode — dùng colors.surface
    padding: 16,                  // ❌ hardcode — dùng spacing.lg
    borderRadius: 12,             // ❌ hardcode — dùng borderRadius.lg
  },
  title: {
    fontSize: 20,                 // ❌ hardcode — dùng typography.h3
    fontWeight: '600',            // ❌ hardcode — dùng typography.h3
    color: '#374151',             // ❌ hardcode — dùng colors.gray700
  },
});
```

#### Khi cần token chưa có trong theme

Nếu không tìm thấy giá trị phù hợp, **hỏi trước khi viết code**:

```
Token chưa có trong theme. Bạn muốn thêm token nào?

Gợi ý:
  colors.brandBlue = '#1565C0'  (primary header hiện tại)
  spacing['6xl'] = 64

→ Sau khi xác nhận, tôi sẽ khai báo vào theme rồi dùng.
```

#### Ngoại lệ (không bắt buộc dùng theme)

- Màu `transparent`, `'rgba(0,0,0,0)'` làm overlay backdrop
- Style trong `example/` (demo app, không phải SDK source)
- Animation interpolation values (e.g. `inputRange: [0, 1]`)

---

## Summary Table

| # | Rule | Layer | Severity |
|---|------|-------|----------|
| 1-6 | Architecture | All | 🔴 CRITICAL |
| 7 | Dùng JS thuần, không TypeScript | All | 🔴 CRITICAL |
| 8-10 | Code Quality | All | 🔴 CRITICAL |
| 11-14 | Testing | Domain/Data | 🟡 HIGH |
| 15-20 | Modules & APIs | All | 🟡 HIGH |
| 21 | Core HttpClient | Data | 🔴 CRITICAL |
| 22-24 | Documentation | All | 🟢 MEDIUM |
| 25-27 | Security | All | 🔴 CRITICAL |
| 28-30 | Git Workflow | All | 🟡 HIGH |
| 31-33 | Performance | All | 🟢 MEDIUM |
| 34 | Theme Usage | Presentation | 🟡 HIGH |
| 35 | Dependency Compatibility | All | 🔴 CRITICAL |
| 36 | No hardcoded text — dùng SdkStrings | Presentation | 🔴 CRITICAL |
| 37 | No hardcoded color/font/spacing — dùng theme | Presentation | 🔴 CRITICAL |

---

## Checklist Before PR

- [ ] Code follows naming conventions (01_convention.md)
- [ ] Respects layer structure (02_structure.md)
- [ ] Uses correct tech stack (03_tech.md)
- [ ] Kiểm tra tương thích trước khi cài thư viện mới (rule #35)
- [ ] Mọi text hiển thị UI đều lấy từ SdkStrings (rule #36)
- [ ] Mọi màu sắc, font, spacing đều lấy từ theme — nếu chưa có thì hỏi người dùng (rule #37)
- [ ] Follows all must-follow rules (#1-6)
- [ ] Has 80%+ test coverage
- [ ] Passes `npm run lint`
- [ ] File extension là `.js` / `.jsx` — không có `.ts` / `.tsx` (rule #7)
- [ ] Passes `npm test`
- [ ] Updated documentation
- [ ] No console.logs or commented code
