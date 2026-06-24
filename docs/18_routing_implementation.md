# 🚀 Routing Implementation - Complete Setup

Step-by-step guide to implement Routing class in your app

---

## 📋 Overview

The Routing implementation consists of:
1. **Routing Class** - Declare all routes
2. **ScreenRegistry** - Register screen components
3. **App Routing Setup** - Initialize routing on app start
4. **Usage** - Navigate and access routes

---

## 🎯 Step 1: Create Screen Components

Create your screen components in `src/screens/`:

```typescript
// src/screens/HomeScreen.tsx
export function HomeScreen() {
  return (
    <div className="screen home-screen">
      <h1>🏠 Home</h1>
      {/* Home content */}
    </div>
  );
}

// src/screens/ProductsScreen.tsx
export function ProductsScreen() {
  return (
    <div className="screen products-screen">
      <h1>📦 Products</h1>
      {/* Products content */}
    </div>
  );
}

// src/screens/CartScreen.tsx
export function CartScreen() {
  return (
    <div className="screen cart-screen">
      <h1>🛒 Cart</h1>
      {/* Cart content */}
    </div>
  );
}

// Add more screens...
```

---

## 🎯 Step 2: Create Screen Registry

Create `src/app/screen-map.ts`:

```typescript
// src/app/screen-map.ts
import * as Screens from '@/screens';

/**
 * Screen component map
 * Maps route names to components
 */
export const screenMap = {
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

export default screenMap;
```

---

## 🎯 Step 3: Setup App Initialization

Update `src/config/app.init.ts`:

```typescript
// src/config/app.init.ts
import { setupAppRouting } from '@/common/routing';
import { screenMap } from '@/app/screen-map';

export async function initializeApp(config?: any) {
  try {
    console.log('🚀 Initializing App...');

    // ... existing initialization code ...

    // Setup routing with screens
    await setupAppRouting(screenMap);

    console.log('✅ App initialized successfully');
    return true;
  } catch (error: any) {
    console.error('❌ App initialization failed:', error.message);
    throw error;
  }
}

export default initializeApp;
```

---

## 🎯 Step 4: Create App Component

Create `src/App.tsx`:

```typescript
// src/App.tsx
import React, { useEffect } from 'react';
import { useNavigation } from 'fox-ecom';
import { sdkRouter } from 'fox-ecom';
import { Routing } from '@/common/routing';
import './App.css';

function App() {
  const { currentRoute } = useNavigation();

  // Get current screen component
  const ScreenComponent = sdkRouter.getRouteComponent(currentRoute || 'home');

  return (
    <div className="app">
      <header>
        <h1>Fox eCommerce</h1>
        <nav>
          <NavLink route="home" label="🏠 Home" />
          <NavLink route="products" label="📦 Products" />
          <NavLink route="cart" label="🛒 Cart" />
          <NavLink route="profile" label="👤 Profile" />
        </nav>
      </header>

      <main>
        {ScreenComponent ? (
          <ScreenComponent />
        ) : (
          <div>Loading...</div>
        )}
      </main>
    </div>
  );
}

/**
 * Navigation Link Component
 */
function NavLink({ route, label }: { route: string; label: string }) {
  const { navigate, currentRoute } = useNavigation();
  const isActive = currentRoute === route;

  return (
    <button
      onClick={() => navigate(route as any)}
      className={`nav-link ${isActive ? 'active' : ''}`}
    >
      {label}
    </button>
  );
}

export default App;
```

---

## 🎯 Step 5: Create Entry Point

Create `src/index.tsx`:

```typescript
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeApp } from '@/config/app.init';
import App from './App';
import './index.css';

async function main() {
  try {
    // Initialize SDK and routing
    await initializeApp({
      token: process.env.REACT_APP_TOKEN || 'demo-token',
      environment: process.env.REACT_APP_ENV || 'development',
    });

    // Render app
    const root = ReactDOM.createRoot(document.getElementById('root')!);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to start app:', error);
  }
}

main();
```

---

## 🎯 Step 6: Use Routing in Components

Navigate using Routing class:

```typescript
// src/screens/HomeScreen.tsx
import { useNavigation } from 'fox-ecom';
import { Routing } from '@/common/routing';
import { useProducts } from '@/modules/products';

export function HomeScreen() {
  const { navigate } = useNavigation();
  const { products, fetchProducts } = useProducts();

  return (
    <div className="screen home-screen">
      <h1>🏠 Home</h1>

      <section>
        <h2>Featured Products</h2>
        <button onClick={() => fetchProducts()}>Load Products</button>
        <button onClick={() => navigate(Routing.routes.products.name)}>
          View All Products
        </button>
      </section>

      <section>
        <h2>Quick Links</h2>
        <button onClick={() => navigate(Routing.routes.cart.name)}>
          Go to Cart
        </button>
        <button onClick={() => navigate(Routing.routes.profile.name)}>
          View Profile
        </button>
      </section>
    </div>
  );
}
```

---

## 🎯 Step 7: Navigate with Parameters

```typescript
// src/screens/ProductsScreen.tsx
import { useNavigation } from 'fox-ecom';
import { Routing, buildRouteUrl } from '@/common/routing';

export function ProductsScreen() {
  const { navigate } = useNavigation();

  const handleProductClick = (productId: string) => {
    // Method 1: Direct navigate
    navigate(Routing.routes.productDetail.name, { productId });

    // Method 2: Build URL
    const url = buildRouteUrl('product-detail', { productId });
    console.log(`Navigating to: ${url}`);
  };

  return (
    <div className="screen products-screen">
      <h1>{Routing.getTitle('products')}</h1>
      {/* Product list */}
      <button onClick={() => handleProductClick('123')}>
        View Product
      </button>
    </div>
  );
}
```

---

## 🎯 Step 8: Access Route Information

```typescript
// src/components/Breadcrumb.tsx
import { useNavigation } from 'fox-ecom';
import { Routing, getRouteInfo } from '@/common/routing';

export function Breadcrumb() {
  const { currentRoute } = useNavigation();
  const routeInfo = getRouteInfo(currentRoute || '');

  return (
    <nav className="breadcrumb">
      <a href="#" onClick={() => navigate(Routing.routes.home.name)}>
        Home
      </a>
      {routeInfo && (
        <>
          <span> / </span>
          <span>{routeInfo.title || routeInfo.name}</span>
        </>
      )}
    </nav>
  );
}
```

---

## 📁 Complete Project Structure

```
src/
├── screens/
│   ├── HomeScreen.tsx
│   ├── ProductsScreen.tsx
│   ├── ProductDetailScreen.tsx
│   ├── CartScreen.tsx
│   ├── CheckoutScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── SettingsScreen.tsx
│   └── index.ts
├── app/
│   └── screen-map.ts          ← Screen component mapping
├── components/
│   ├── Breadcrumb.tsx
│   ├── NavLink.tsx
│   └── ...
├── config/
│   └── app.init.ts            ← App initialization
├── common/
│   └── routing/
│       ├── routing.ts         ← Route declarations
│       ├── screen-registry.ts ← Screen registration
│       ├── app-routing-setup.ts ← Setup function
│       └── index.ts           ← Exports
├── App.tsx                     ← Main app component
├── index.tsx                   ← Entry point
└── index.css
```

---

## 🚀 Complete Usage Example

```typescript
// src/App.tsx
import React from 'react';
import { useNavigation } from 'fox-ecom';
import { Routing, navigateTo, getRouteInfo } from '@/common/routing';

function App() {
  const { navigate, currentRoute } = useNavigation();

  const handleNavigate = (routeName: string) => {
    if (!Routing.exists(routeName as any)) {
      console.error('Route not found:', routeName);
      return;
    }
    navigate(routeName as any);
  };

  const currentRouteInfo = getRouteInfo(currentRoute || '');

  return (
    <div className="app">
      {/* Header with navigation */}
      <header>
        <h1>🛍️ {currentRouteInfo?.title || 'App'}</h1>
        <nav>
          {Routing.getRouteNames().map((routeName) => (
            <button
              key={routeName}
              onClick={() => handleNavigate(routeName)}
              className={currentRoute === routeName ? 'active' : ''}
            >
              {Routing.getTitle(routeName) || routeName}
            </button>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main>
        {/* Screen renders here */}
      </main>
    </div>
  );
}

export default App;
```

---

## ✨ Features Implemented

✅ **Centralized Routes** - All routes in Routing class
✅ **Screen Registry** - Map routes to components
✅ **Automatic Registration** - Setup function handles everything
✅ **Type-Safe Navigation** - Use `Routing.routes.name`
✅ **Parameter Building** - `buildRouteUrl()` with params
✅ **Route Info** - Get title, path, description
✅ **Route Validation** - Check if route exists
✅ **Debug Helpers** - `logAll()` for debugging

---

## 🎯 Best Practices

### ✅ DO:
```typescript
// Use Routing class
navigate(Routing.routes.products.name);

// Use setupAppRouting
await setupAppRouting(screenMap);

// Use helpers
Routing.exists('products')
buildRouteUrl('product', { id: '123' })
```

### ❌ DON'T:
```typescript
// Hardcode route names
navigate('products');  // Bad

// Skip setup
sdkRouter.registerRoutes(routes);  // Without setupAppRouting

// Forget to add to screen map
// Screen won't be available
```

---

## 📊 API Summary

| Function | Usage |
|----------|-------|
| `Routing.routes.name` | Get route definition |
| `navigate(Routing.routes.name.name)` | Navigate to route |
| `Routing.buildUrl(name, params)` | Build URL with params |
| `setupAppRouting(screenMap)` | Initialize routing |
| `getRouteInfo(name)` | Get route metadata |
| `ScreenRegistry.register()` | Register screen |

---

**Version**: 0.1.0  
**Status**: Complete Implementation  
**Last Updated**: 2026-06-24
