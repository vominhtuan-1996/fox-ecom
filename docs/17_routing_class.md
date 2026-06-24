# 🗺️ Routing Class - Route Declaration

Centralized route definitions and management

---

## 📋 Overview

**Routing Class** provides a centralized way to:
- Declare all routes in one place
- Manage route metadata
- Build URLs with parameters
- Navigate to screens
- Type-safe route handling

---

## 🎯 Quick Start

### Import Routing Class

```typescript
import { Routing } from 'fox-ecom';

// Access any route
Routing.routes.home        // { name: 'home', path: '/home', ... }
Routing.routes.products    // { name: 'products', path: '/products', ... }
Routing.routes.cart        // { name: 'cart', path: '/cart', ... }
```

### Register Routes with Navigation

```typescript
import { Routing } from 'fox-ecom';
import { sdkRouter } from 'fox-ecom';
import { HomeScreen, ProductsScreen, CartScreen } from './screens';

// Define component map
const componentMap = {
  home: HomeScreen,
  products: ProductsScreen,
  cart: CartScreen,
  // ... more screens
};

// Get routes and register
const routes = Routing.getRoutesWithComponents(componentMap);
sdkRouter.registerRoutes(routes);
```

### Navigate

```typescript
import { Routing } from 'fox-ecom';
import { useNavigation } from 'fox-ecom';

function MyComponent() {
  const { navigate } = useNavigation();

  // Navigate to home
  navigate(Routing.routes.home.name);

  // Navigate with params
  navigate(Routing.routes.productDetail.name, { productId: '123' });

  // Navigate using buildUrl
  const url = Routing.buildUrl('product-detail', { productId: '123' });
  // Result: "/product-detail?productId=123"
}
```

---

## 📦 Route Definition

### RouteDef Interface

```typescript
interface RouteDef {
  name: ScreenName;        // 'home', 'products', etc.
  path: string;            // '/home', '/products', etc.
  title?: string;          // Screen title
  description?: string;    // Screen description
}
```

### Example Routes

```typescript
// Home route
{
  name: 'home',
  path: '/home',
  title: 'Home',
  description: 'Home screen'
}

// Product detail route
{
  name: 'product-detail',
  path: '/product-detail',
  title: 'Product Detail',
  description: 'Product detail screen'
}

// Cart route
{
  name: 'cart',
  path: '/cart',
  title: 'Shopping Cart',
  description: 'Shopping cart screen'
}
```

---

## 🔧 API Reference

### Static Methods

#### `getAll(): RouteDef[]`
Get all routes as array

```typescript
const allRoutes = Routing.getAll();
// Returns array of all RouteDef objects
```

#### `getRoute(name: ScreenName): RouteDef | null`
Get route by name

```typescript
const homeRoute = Routing.getRoute('home');
// { name: 'home', path: '/home', title: 'Home', ... }
```

#### `getPath(name: ScreenName): string | null`
Get route path by name

```typescript
const path = Routing.getPath('products');
// '/products'
```

#### `getTitle(name: ScreenName): string | null`
Get route title by name

```typescript
const title = Routing.getTitle('cart');
// 'Shopping Cart'
```

#### `exists(name: ScreenName): boolean`
Check if route exists

```typescript
if (Routing.exists('products')) {
  // Route exists
}
```

#### `buildUrl(name: ScreenName, params?: RouteParams): string`
Build URL with parameters

```typescript
// Without params
Routing.buildUrl('home');
// '/home'

// With params
Routing.buildUrl('product-detail', { productId: '123', category: 'electronics' });
// '/product-detail?productId=123&category=electronics'
```

#### `getRoutesWithComponents(componentMap): Route[]`
Get routes with components for registration

```typescript
const componentMap = {
  home: HomeScreen,
  products: ProductsScreen,
  cart: CartScreen,
};

const routes = Routing.getRoutesWithComponents(componentMap);
sdkRouter.registerRoutes(routes);
```

#### `getNavOptions(name: ScreenName)`
Get navigation options for a route

```typescript
const options = Routing.getNavOptions('products');
// { title: 'Products', description: 'Products list' }
```

#### `addRoute(route: RouteDef): void`
Add custom route (for extensions)

```typescript
Routing.addRoute({
  name: 'wishlist',
  path: '/wishlist',
  title: 'Wishlist',
  description: 'My wishlist',
});
```

#### `getRouteNames(): ScreenName[]`
Get all route names

```typescript
const names = Routing.getRouteNames();
// ['home', 'login', 'products', 'product-detail', 'cart', ...]
```

#### `logAll(): void`
Log all routes (debugging)

```typescript
Routing.logAll();
// Console output:
// 📍 All Routes:
//   - home: /home (Home)
//   - products: /products (Products)
//   - cart: /cart (Shopping Cart)
//   ...
```

---

## 💡 Usage Examples

### Example 1: Navigate with useNavigation

```typescript
import { Routing } from 'fox-ecom';
import { useNavigation } from 'fox-ecom';

function ProductsScreen() {
  const { navigate } = useNavigation();

  const handleProductClick = (productId: string) => {
    navigate(Routing.routes.productDetail.name, { productId });
  };

  return (
    <div>
      <h1>{Routing.getTitle('products')}</h1>
      {/* Product list */}
      <button onClick={() => handleProductClick('123')}>
        View Product
      </button>
    </div>
  );
}
```

### Example 2: Setup Initial Routes

```typescript
import { Routing } from 'fox-ecom';
import { sdkRouter } from 'fox-ecom';
import * as Screens from './screens';

// Component map
const componentMap = {
  home: Screens.HomeScreen,
  login: Screens.LoginScreen,
  register: Screens.RegisterScreen,
  products: Screens.ProductsScreen,
  'product-detail': Screens.ProductDetailScreen,
  cart: Screens.CartScreen,
  checkout: Screens.CheckoutScreen,
  orders: Screens.OrdersScreen,
  'order-detail': Screens.OrderDetailScreen,
  profile: Screens.ProfileScreen,
  settings: Screens.SettingsScreen,
};

// Register all routes
function setupRoutes() {
  const routes = Routing.getRoutesWithComponents(componentMap);
  sdkRouter.registerRoutes(routes);
  
  console.log(`✅ Registered ${routes.length} routes`);
  Routing.logAll();
}

export default setupRoutes;
```

### Example 3: Add Custom Routes

```typescript
import { Routing } from 'fox-ecom';

// Add custom routes
Routing.addRoute({
  name: 'wishlist',
  path: '/wishlist',
  title: 'My Wishlist',
  description: 'Saved items',
});

Routing.addRoute({
  name: 'reviews',
  path: '/reviews',
  title: 'My Reviews',
  description: 'Product reviews',
});

// Now can use
navigate(Routing.routes.wishlist.name);
```

### Example 4: Type-Safe Navigation

```typescript
import { Routing } from 'fox-ecom';

// Get type-safe route names
type RouteNames = typeof Routing.routes;
type RouteName = keyof RouteNames;

function navigate(name: RouteName) {
  const route = Routing.getRoute(name);
  if (route) {
    // Navigate
  }
}

// Usage
navigate('home');          // ✅ Works
navigate('products');      // ✅ Works
navigate('unknown-route'); // ❌ TypeScript error
```

### Example 5: Breadcrumb Navigation

```typescript
import { Routing } from 'fox-ecom';
import { useNavigation } from 'fox-ecom';

function Breadcrumb() {
  const { currentRoute } = useNavigation();
  const route = Routing.getRoute(currentRoute);

  return (
    <nav>
      <a href="/">Home</a>
      {route && (
        <>
          <span> / </span>
          <span>{route.title || route.name}</span>
        </>
      )}
    </nav>
  );
}
```

### Example 6: Route Validation

```typescript
import { Routing } from 'fox-ecom';

// Check if route is valid
function isValidRoute(routeName: string): boolean {
  return Routing.exists(routeName);
}

// Validate before navigation
if (isValidRoute('products')) {
  navigate('products');
} else {
  console.error('Route not found');
}
```

---

## 🛣️ Predefined Routes

### Auth Routes
- `login` - Login screen
- `register` - Registration screen

### Product Routes
- `products` - Products list
- `productDetail` - Product detail

### Cart Routes
- `cart` - Shopping cart
- `checkout` - Checkout process

### Order Routes
- `orders` - Orders list
- `orderDetail` - Order detail

### User Routes
- `profile` - User profile
- `settings` - Settings

### Home Route
- `home` - Home screen

---

## 📝 Adding New Routes

### Step 1: Add to Routing Class

```typescript
// src/common/routing/routing.ts
static readonly routes = {
  // ... existing routes
  
  // New route
  reviews: {
    name: 'reviews',
    path: '/reviews',
    title: 'Reviews',
    description: 'Product reviews',
  } as RouteDef,
};
```

### Step 2: Create Screen Component

```typescript
// src/screens/ReviewsScreen.tsx
export function ReviewsScreen() {
  return <div>Reviews Screen</div>;
}
```

### Step 3: Add to Component Map

```typescript
const componentMap = {
  // ... existing
  reviews: ReviewsScreen,
};
```

### Step 4: Use in App

```typescript
navigate(Routing.routes.reviews.name);
const title = Routing.getTitle('reviews');
```

---

## 🎯 Best Practices

### ✅ DO:
- Declare all routes in Routing class
- Use `Routing.routes.name` for navigation
- Use `getRouteNames()` for validation
- Add metadata (title, description)
- Use `buildUrl()` for URL generation

### ❌ DON'T:
- Hardcode route names/paths
- Navigate without checking `exists()`
- Skip adding route metadata
- Create routes outside Routing class
- Use string literals for navigation

---

## 📚 Integration Example

**Complete app setup:**

```typescript
// src/app.tsx
import { Routing } from 'fox-ecom';
import { sdkRouter } from 'fox-ecom';
import * as Screens from './screens';

// 1. Setup routes
const componentMap = {
  home: Screens.HomeScreen,
  products: Screens.ProductsScreen,
  cart: Screens.CartScreen,
  // ... more
};

const routes = Routing.getRoutesWithComponents(componentMap);
sdkRouter.registerRoutes(routes);

// 2. Use in app
function App() {
  return (
    <AppContainer>
      <Navigation />
      <ScreenRenderer />
    </AppContainer>
  );
}

// 3. Navigate
function Navigation() {
  const { navigate } = useNavigation();

  return (
    <nav>
      <button onClick={() => navigate(Routing.routes.home.name)}>Home</button>
      <button onClick={() => navigate(Routing.routes.products.name)}>Products</button>
      <button onClick={() => navigate(Routing.routes.cart.name)}>Cart</button>
    </nav>
  );
}
```

---

**Version**: 0.1.0  
**Location**: `src/common/routing/`  
**Export**: `import { Routing } from 'fox-ecom'`  
**Last Updated**: 2026-06-24
