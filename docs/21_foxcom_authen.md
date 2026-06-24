# 🔐 FoxComAuthen - Simplified SDK Entry Point

One-function initialization for Fox eCommerce SDK

---

## 🎯 Overview

**FoxComAuthen** simplifies everything into one class:
- ✅ One constructor call
- ✅ One initialize call
- ✅ App handles auth & navigation automatically
- ✅ No complex setup needed

**Input:**
```
token + environment + routing + extra → FoxComAuthen
```

**Output:**
```
SDK fully initialized & ready to use
```

---

## 📋 Quick Start

### Step 1: Define Custom Screens

```typescript
// src/screens/index.ts
export { HomeScreen } from './HomeScreen';
export { LoginScreen } from './LoginScreen';
export { ProductsScreen } from './ProductsScreen';
export { CartScreen } from './CartScreen';
// ... more screens
```

### Step 2: Create FoxComAuthen Instance

```typescript
// src/main.tsx
import { FoxComAuthen } from 'fox-ecom';
import * as Screens from './screens';

// Create instance with config
const fox = new FoxComAuthen({
  token: process.env.REACT_APP_TOKEN || 'demo-token',
  environment: 'production',
  routing: {
    home: Screens.HomeScreen,
    login: Screens.LoginScreen,
    products: Screens.ProductsScreen,
    cart: Screens.CartScreen,
    // ... all your screens
  },
  extra: {
    userId: 'user-123',
    deviceId: 'device-456',
  },
  enableLogging: true, // optional
});

// Initialize (one call!)
await fox.initialize();

// ✅ Everything is ready!
```

### Step 3: Use in App

```typescript
// src/App.tsx
import { FoxComAuthen } from 'fox-ecom';

function App() {
  // Get navigation from FoxComAuthen
  const { navigate, Routing } = fox.getNavigation();
  const { useAuth } = fox.getAuth();
  const { useProducts } = fox.getProducts();

  // Use in components
  const { user, isAuthenticated } = useAuth();
  const { products } = useProducts();

  return (
    <div>
      {/* Your app */}
      <button onClick={() => navigate('products')}>
        View Products
      </button>
    </div>
  );
}
```

---

## 🔧 FoxComAuthenConfig

Configuration object passed to FoxComAuthen:

```typescript
interface FoxComAuthenConfig {
  /** Authentication token (required) */
  token: string;

  /** Environment: 'development' | 'staging' | 'production' */
  environment: 'development' | 'staging' | 'production';

  /** Custom screen routing (required) */
  routing: Record<string, React.ComponentType<any>>;

  /** Extra data (optional) */
  extra?: Record<string, any>;

  /** API base URL (optional) */
  apiBaseUrl?: string;

  /** Enable logging (optional) */
  enableLogging?: boolean;
}
```

---

## 📌 API Methods

### `initialize(): Promise<void>`
Initialize SDK - call once when app starts

```typescript
await fox.initialize();
```

### `getNavigation()`
Get everything for navigation

```typescript
const { navigate, Routing, sdkRouter } = fox.getNavigation();

navigate('products');
navigate('product-detail', { productId: '123' });
```

### `getAuth()`
Get everything for authentication

```typescript
const { useAuth } = fox.getAuth();

const { user, login, logout, isAuthenticated } = useAuth();
```

### `getProducts()`
Get everything for products

```typescript
const { useProducts } = fox.getProducts();

const { products, fetchProducts } = useProducts();
```

### `getCart()`
Get everything for cart

```typescript
const { useCart } = fox.getCart();

const { items, addToCart, removeFromCart, totalPrice } = useCart();
```

### `buildUrl(routeName, params?): string`
Build URL with parameters

```typescript
fox.buildUrl('product-detail', { productId: '123' });
// '/product-detail?productId=123'
```

### `hasRoute(routeName): boolean`
Check if route exists

```typescript
if (fox.hasRoute('products')) {
  navigate('products');
}
```

### `getRoutes()`
Get all available routes

```typescript
const routes = fox.getRoutes();
routes.forEach(route => console.log(route.name, route.path));
```

### `isInitialized(): boolean`
Check initialization status

```typescript
if (fox.isInitialized()) {
  // SDK is ready
}
```

### `getConfig()`
Get current config (read-only)

```typescript
const config = fox.getConfig();
console.log(config.token, config.environment);
```

---

## 💡 Complete Example

### File Structure

```
my-app/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── ProductsScreen.tsx
│   │   └── CartScreen.tsx
│   ├── App.tsx
│   └── main.tsx
├── .env
└── package.json
```

### main.tsx

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { FoxComAuthen } from 'fox-ecom';
import App from './App';
import * as Screens from './screens';
import './index.css';

// Create FoxComAuthen instance
const fox = new FoxComAuthen({
  token: process.env.REACT_APP_TOKEN || 'default-token',
  environment: (process.env.REACT_APP_ENV as any) || 'development',
  routing: {
    home: Screens.HomeScreen,
    login: Screens.LoginScreen,
    products: Screens.ProductsScreen,
    cart: Screens.CartScreen,
  },
  extra: {
    userId: localStorage.getItem('userId') || 'anonymous',
    deviceId: 'device-' + Math.random(),
  },
  enableLogging: true,
});

// Initialize and render
async function main() {
  try {
    await fox.initialize();
    console.log('✅ App ready!');

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App fox={fox} />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('❌ Failed to initialize:', error);
  }
}

main();
```

### App.tsx

```typescript
import { FoxComAuthen } from 'fox-ecom';

interface AppProps {
  fox: FoxComAuthen;
}

function App({ fox }: AppProps) {
  const { navigate, Routing } = fox.getNavigation();
  const { useAuth } = fox.getAuth();
  const { useProducts } = fox.getProducts();
  const { useCart } = fox.getCart();

  // Use hooks
  const { user, isAuthenticated, logout } = useAuth();
  const { products, fetchProducts } = useProducts();
  const { items, totalPrice } = useCart();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="app">
      <header>
        <h1>🛍️ Fox eCommerce</h1>
        <nav>
          <button onClick={() => navigate('home')}>Home</button>
          <button onClick={() => navigate('products')}>Products</button>
          <button onClick={() => navigate('cart')}>
            Cart ({items.length})
          </button>
          <button onClick={() => logout()}>Logout</button>
        </nav>
      </header>

      <main>
        {/* Your content */}
      </main>
    </div>
  );
}

export default App;
```

### HomeScreen.tsx

```typescript
import { FoxComAuthen } from 'fox-ecom';

// Get fox instance from context or props
export function HomeScreen({ fox }: { fox: FoxComAuthen }) {
  const { navigate } = fox.getNavigation();
  const { useProducts } = fox.getProducts();

  const { products, fetchProducts } = useProducts();

  return (
    <div className="home">
      <h1>Welcome!</h1>
      <button onClick={() => fetchProducts()}>Load Products</button>
      <button onClick={() => navigate('products')}>Shop Now</button>
    </div>
  );
}
```

---

## 🚀 Minimal Setup (3 Steps)

### Step 1: Create FoxComAuthen

```typescript
const fox = new FoxComAuthen({
  token: 'your-token',
  environment: 'production',
  routing: { home: Home, products: Products, cart: Cart },
});
```

### Step 2: Initialize

```typescript
await fox.initialize();
```

### Step 3: Use It

```typescript
const { navigate } = fox.getNavigation();
const { useAuth } = fox.getAuth();

navigate('products');
const { user } = useAuth();
```

**That's all you need!** ✅

---

## 📊 What FoxComAuthen Handles

### Automatically Initialize:
✅ Authentication (token + environment)
✅ DI Container (all services)
✅ Routing & Navigation
✅ Products Service
✅ Cart Service
✅ Logging

### App Only Needs to Provide:
- Token
- Environment
- Screen components (routing)
- Extra data (optional)

### Everything Else is Hidden:
- Internal service setup
- DI configuration
- Observable subscriptions
- LocalStorage persistence
- Navigation stack

---

## 🎯 Use Cases

### 1. Simple App
```typescript
const fox = new FoxComAuthen({
  token: 'my-token',
  environment: 'production',
  routing: { home: HomeScreen, products: ProductsScreen },
});
await fox.initialize();
```

### 2. With Extra Data
```typescript
const fox = new FoxComAuthen({
  token: 'my-token',
  environment: 'production',
  routing: { /* screens */ },
  extra: {
    userId: 'user-123',
    companyId: 'company-456',
    features: ['auth', 'products', 'payment'],
  },
});
await fox.initialize();
```

### 3. With Custom API Base URL
```typescript
const fox = new FoxComAuthen({
  token: 'my-token',
  environment: 'staging',
  routing: { /* screens */ },
  apiBaseUrl: 'https://api-staging.example.com',
  enableLogging: true,
});
await fox.initialize();
```

---

## ✨ Benefits

✅ **Simple** - One class, one initialization
✅ **Clean** - No complex setup code
✅ **Type-Safe** - Full TypeScript support
✅ **Flexible** - Bring your own screens
✅ **Powerful** - All SDK features available
✅ **Documented** - Everything included

---

## 🔄 Flow

```
App starts
    ↓
Create FoxComAuthen instance
    ↓
    await fox.initialize()
    ↓
  - Auth initialized ✅
  - Routing setup ✅
  - Services ready ✅
  - DI container ready ✅
    ↓
fox.getNavigation() → navigate()
fox.getAuth() → useAuth()
fox.getProducts() → useProducts()
fox.getCart() → useCart()
    ↓
App is ready to use! 🚀
```

---

## 📝 Error Handling

```typescript
try {
  const fox = new FoxComAuthen({
    token: process.env.REACT_APP_TOKEN,
    environment: 'production',
    routing: screenMap,
  });

  await fox.initialize();
  console.log('✅ SDK initialized');
} catch (error) {
  console.error('❌ Failed to initialize:', error);
  // Handle error
}
```

---

## 🎓 Migration Guide

### From Complex Setup
```typescript
// Before (complex)
await initializeApp({ token, environment });
await setupAppRouting(screenMap);
const { navigate } = useNavigation();
const { useAuth } = useAuth();

// After (simple)
const fox = new FoxComAuthen({ token, environment, routing });
await fox.initialize();
const { navigate } = fox.getNavigation();
const { useAuth } = fox.getAuth();
```

---

**Version**: 0.1.0  
**Status**: Simplified Entry Point  
**Last Updated**: 2026-06-24

---

## Quick Command Reference

```typescript
// Initialize
const fox = new FoxComAuthen(config);
await fox.initialize();

// Navigation
fox.getNavigation().navigate('screen-name');
fox.buildUrl('screen', { param: value });
fox.hasRoute('screen-name');

// Authentication
const { useAuth } = fox.getAuth();
const { user, login, logout } = useAuth();

// Products
const { useProducts } = fox.getProducts();
const { products, fetchProducts } = useProducts();

// Cart
const { useCart } = fox.getCart();
const { items, addToCart, removeFromCart } = useCart();

// Info
fox.isInitialized();
fox.getConfig();
fox.getRoutes();
```

---

**One class. One call. Everything ready.** ✨
