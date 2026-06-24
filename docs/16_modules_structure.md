# 📦 SDK Modules Structure

Complete overview of all SDK feature modules

---

## 🗂️ Module Organization

```
src/modules/
├── auth/              ✅ Authentication
├── navigation/        ✅ Routing & Navigation
├── products/          ✅ Products Management
├── cart/              ✅ Shopping Cart
└── index.ts           (Exports all modules)
```

---

## 🔐 Auth Module

**Purpose**: Handle user authentication

**Structure**:
```
modules/auth/
├── services/
│   └── AuthService.ts         (Singleton service)
├── hooks/
│   └── useAuth.ts            (React hook)
├── types/
│   └── auth.types.ts         (TypeScript types)
└── index.ts                  (Exports)
```

**Export**:
```typescript
export { authService, useAuth }
export type { AuthCredentials, AuthToken, AuthUser, AuthSession }
```

**Usage**:
```typescript
import { useAuth, authService } from 'fox-ecom';

const { session, login, logout, isAuthenticated } = useAuth();
await authService.init({ token: 'xxx' });
```

---

## 🗺️ Navigation Module

**Purpose**: Handle routing and navigation

**Structure**:
```
modules/navigation/
├── router.ts                (Router service)
├── hooks/
│   └── useNavigation.ts     (React hook)
├── deep-linking.ts          (URL handling)
├── types/
│   └── navigation.types.ts  (Types)
└── index.ts                 (Exports)
```

**Export**:
```typescript
export { sdkRouter, useNavigation }
export { handleDeepLink, parseDeepLink, createDeepLink }
export type { Route, ScreenName, RouteParams, NavigationState }
```

**Usage**:
```typescript
import { sdkRouter, useNavigation } from 'fox-ecom';

sdkRouter.registerRoutes(routes);
const { navigate, currentRoute, goBack } = useNavigation();
navigate('products', { category: 'electronics' });
```

---

## 📦 Products Module

**Purpose**: Manage products catalog

**Structure**:
```
modules/products/
├── services/
│   └── ProductService.ts      (Business logic, replaces cubit)
├── hooks/
│   └── useProducts.ts         (React hook)
├── types/
│   └── product.types.ts       (TypeScript types)
├── screens/
│   └── ProductsScreen.tsx     (Example screen)
└── index.ts                   (Exports)
```

**Types**:
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  rating?: number;
  stock?: number;
}

interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

type ProductState = 'idle' | 'loading' | 'success' | 'error';
```

**Export**:
```typescript
export { productService, useProducts }
export type { Product, ProductFilter, ProductListResponse, ProductState }
```

**Usage**:
```typescript
import { useProducts, productService } from 'fox-ecom';

const { products, fetchProducts, searchProducts, getByCategory } = useProducts();
await fetchProducts();
const electronics = await getByCategory('electronics');
```

**Service Methods**:
```typescript
// Fetch all products
getProducts(filter?: ProductFilter): Promise<ProductListResponse>

// Get product by ID
getProductById(productId: string): Promise<Product | null>

// Search products
searchProducts(query: string): Promise<Product[]>

// Get by category
getProductsByCategory(category: string): Promise<Product[]>

// Subscribe to changes
subscribe(listener: (products: Product[]) => void): () => void
```

---

## 🛒 Cart Module

**Purpose**: Manage shopping cart

**Structure**:
```
modules/cart/
├── services/
│   └── CartService.ts         (Business logic)
├── hooks/
│   └── useCart.ts            (React hook)
├── types/
│   └── cart.types.ts         (TypeScript types)
├── screens/
│   └── CartScreen.tsx        (Example screen)
└── index.ts                  (Exports)
```

**Types**:
```typescript
interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  addedAt: number;
}

interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  lastUpdated: number;
}

type CartState = 'idle' | 'loading' | 'success' | 'error';
```

**Export**:
```typescript
export { cartService, useCart }
export type { Cart, CartItem, AddToCartRequest, CartState }
```

**Usage**:
```typescript
import { useCart, cartService } from 'fox-ecom';

const { items, totalPrice, addToCart, removeFromCart, clearCart } = useCart();
addToCart(product, 1);
removeFromCart(productId);
```

**Service Methods**:
```typescript
// Add to cart
addToCart(item: CartItem): void

// Remove from cart
removeFromCart(productId: string): void

// Update quantity
updateQuantity(productId: string, quantity: number): void

// Clear cart
clearCart(): void

// Get cart
getCart(): Cart

// Subscribe to changes
subscribe(listener: (cart: Cart) => void): () => void
```

---

## 🎯 Module Pattern

Each module follows the same pattern:

```
module/
├── services/         ← Business logic (replaces Cubit)
│   └── ModuleService.ts
├── hooks/           ← React integration
│   └── useModule.ts
├── types/           ← TypeScript definitions
│   └── module.types.ts
├── screens/         ← UI screens (optional)
│   └── ModuleScreen.tsx
└── index.ts         ← Exports
```

### Service (replaces Flutter Cubit)
- Singleton class
- Business logic
- State management
- Observer pattern
- localStorage persistence

### Hook (React integration)
- Custom React hook
- Uses service internally
- Returns state + methods
- useEffect for subscriptions

### Types
- TypeScript interfaces
- Service types
- State types

### Screens
- React components
- Use hooks
- Display UI

---

## 📱 Usage Example

### Register Routes
```typescript
import { sdkRouter } from 'fox-ecom';
import { ProductsScreen } from 'fox-ecom/modules/products';
import { CartScreen } from 'fox-ecom/modules/cart';

const routes = [
  { name: 'products', path: '/products', component: ProductsScreen },
  { name: 'cart', path: '/cart', component: CartScreen },
];

sdkRouter.registerRoutes(routes);
```

### Use in App
```typescript
import { useNavigation } from 'fox-ecom';
import { useProducts } from 'fox-ecom/modules/products';
import { useCart } from 'fox-ecom/modules/cart';

function App() {
  const { navigate, currentRoute } = useNavigation();
  const { products, fetchProducts } = useProducts();
  const { items, totalPrice } = useCart();

  return (
    <div>
      {currentRoute === 'products' && <ProductsScreen />}
      {currentRoute === 'cart' && <CartScreen />}
    </div>
  );
}
```

---

## 🔄 Full Flow Example

```typescript
// 1. Initialize App
import { initializeApp } from 'fox-ecom';

await initializeApp({
  token: 'your-token',
  environment: 'production',
});

// 2. Setup Routes
import { sdkRouter } from 'fox-ecom';
sdkRouter.registerRoutes(routes);

// 3. Use Modules in Component
function Shop() {
  const { navigate } = useNavigation();
  const { products, fetchProducts } = useProducts();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products ({products.length})</h1>
      {products.map((product) => (
        <button key={product.id} onClick={() => addToCart(product)}>
          Add: {product.name}
        </button>
      ))}
      <button onClick={() => navigate('cart')}>View Cart</button>
    </div>
  );
}
```

---

## 🚀 Add New Module

To add new module (e.g., `orders`):

### 1. Create Structure
```bash
mkdir -p src/modules/orders/{services,hooks,types,screens}
```

### 2. Create Service
```typescript
// modules/orders/services/OrderService.ts
class OrderServiceImpl {
  // ... business logic
}
export const orderService = OrderServiceImpl.getInstance();
```

### 3. Create Hook
```typescript
// modules/orders/hooks/useOrders.ts
export function useOrders() {
  const [orders, setOrders] = useState([]);
  // ... hook logic
  return { orders, ... };
}
```

### 4. Export Module
```typescript
// modules/orders/index.ts
export { orderService } from './services/OrderService';
export { useOrders } from './hooks/useOrders';
export type { Order, OrderState } from './types/order.types';
```

### 5. Enable in modules/index.ts
```typescript
export * from './orders';
```

---

## 📊 Current Modules Status

| Module | Status | Service | Hook | Types | Screens | Tests |
|--------|--------|---------|------|-------|---------|-------|
| auth | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| navigation | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| products | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ |
| cart | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ |

---

## 🎯 Best Practices

✅ **DO**:
- One responsibility per module
- Export via index.ts only
- Use singleton services
- Subscribe to changes
- Store data locally
- Type everything

❌ **DON'T**:
- Cross-module imports (circular)
- Export internal files
- Duplicate logic
- Global state (use modules)
- Hardcode values

---

**Version**: 0.1.0  
**Last Updated**: 2026-06-24
