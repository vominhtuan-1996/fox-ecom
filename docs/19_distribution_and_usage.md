# 📦 SDK Distribution & Usage Guide

Build SDK as tgz file and use in other apps

---

## 🎯 Complete Flow

```
Fox eCommerce SDK (This Project)
    ↓
    build & pack
    ↓
fox-ecom-0.1.0.tgz (Tarball file)
    ↓
    install in other app
    ↓
Other App
    ↓
    import { initializeApp, useAuth, Routing } from 'fox-ecom'
    ↓
    ✅ Ready to use!
```

---

## 🚀 Step 1: Build SDK as Tarball

### Method A: Using npm pack (Simplest)

```bash
cd /Users/tuanvm37/fox-ecom

# Build TypeScript to JavaScript
npm run build

# Create tarball
npm pack

# Result: fox-ecom-0.1.0.tgz (34 KB)
```

### Method B: Full build command

```bash
npm run build:dev    # Build with source maps (development)
npm pack            # Create tarball
```

---

## 📁 What's Inside Tarball

```
fox-ecom-0.1.0.tgz
├── dist/                          (Compiled JavaScript)
│   ├── index.js                  (Main entry point)
│   ├── index.d.ts                (TypeScript definitions)
│   ├── modules/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   └── navigation/
│   ├── domain/
│   ├── data/
│   ├── presentation/
│   ├── common/
│   │   └── routing/              (✅ Routing class)
│   └── ...
├── package.json
└── README.md
```

---

## 💻 Step 2: Install in Other App

### Option A: Local Tarball (For Testing)

```bash
# In your other app directory
cd /path/to/my-app

# Install from tarball file
npm install /path/to/fox-ecom-0.1.0.tgz

# Result: SDK added to node_modules
# In package.json: "fox-ecom": "file:../fox-ecom-0.1.0.tgz"
```

### Option B: Published to npm (Production)

```bash
# Publish to npm registry
cd /path/to/fox-ecom
npm publish

# In other app
npm install fox-ecom
```

### Option C: Git Repository

```bash
# Install from GitHub
npm install github:tuanvm37/fox-ecom#main
```

---

## ✅ Step 3: Verify Installation

```bash
# Check if SDK installed
npm ls fox-ecom

# Output:
# my-app@1.0.0 /path/to/my-app
# └── fox-ecom@0.1.0 (from tgz)
```

---

## 🎯 Step 4: Use SDK in Your App

### 4.1 Initialize App

```typescript
// src/main.tsx (or src/index.tsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeApp } from 'fox-ecom';
import App from './App';

async function main() {
  // Initialize SDK with auth
  await initializeApp({
    token: process.env.REACT_APP_TOKEN,
    environment: 'production',
    extra: {
      userId: 'user-123',
      deviceId: 'device-456',
    },
  });

  // Now app is ready with:
  // ✅ Authentication
  // ✅ Routing
  // ✅ Products
  // ✅ Cart
  // ✅ Navigation
  // ✅ DI Container

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
  );
}

main();
```

### 4.2 Use Authentication

```typescript
// src/hooks/useAuth.tsx
import { useAuth } from 'fox-ecom';

export function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <div>Welcome {user?.name}</div>;
  }

  return (
    <button onClick={() => login({ email: '', password: '' })}>
      Login with SDK
    </button>
  );
}
```

### 4.3 Use Routing

```typescript
// src/App.tsx
import { useNavigation } from 'fox-ecom';
import { Routing, setupAppRouting } from 'fox-ecom';
import * as Screens from './screens';

// Setup routing
const screenMap = {
  home: Screens.HomeScreen,
  products: Screens.ProductsScreen,
  cart: Screens.CartScreen,
};

setupAppRouting(screenMap);

function App() {
  const { navigate, currentRoute } = useNavigation();

  return (
    <div>
      <button onClick={() => navigate(Routing.routes.products.name)}>
        View Products
      </button>
      {/* Current screen renders here */}
    </div>
  );
}
```

### 4.4 Use Products

```typescript
// src/screens/ProductsScreen.tsx
import { useProducts } from 'fox-ecom';

export function ProductsScreen() {
  const { products, fetchProducts } = useProducts();

  return (
    <div>
      <button onClick={() => fetchProducts()}>Load Products</button>
      {products.map(p => <div key={p.id}>{p.name}</div>)}
    </div>
  );
}
```

### 4.5 Use Cart

```typescript
// src/screens/CartScreen.tsx
import { useCart } from 'fox-ecom';

export function CartScreen() {
  const { items, totalPrice, removeFromCart } = useCart();

  return (
    <div>
      <h1>Cart ({items.length})</h1>
      <p>Total: ${totalPrice}</p>
      {items.map(item => (
        <div key={item.productId}>
          {item.product.name} x{item.quantity}
          <button onClick={() => removeFromCart(item.productId)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎓 What Your App Gets From SDK

After installing fox-ecom, you have access to:

### ✅ Authentication
```typescript
import { useAuth, authService } from 'fox-ecom';

const { user, login, logout, isAuthenticated } = useAuth();
```

### ✅ Routing
```typescript
import { Routing, useNavigation, setupAppRouting } from 'fox-ecom';

const { navigate, currentRoute } = useNavigation();
navigate(Routing.routes.products.name);
```

### ✅ Products
```typescript
import { useProducts, productService } from 'fox-ecom';

const { products, fetchProducts } = useProducts();
```

### ✅ Shopping Cart
```typescript
import { useCart, cartService } from 'fox-ecom';

const { items, addToCart, removeFromCart } = useCart();
```

### ✅ Navigation (Deep Linking)
```typescript
import { handleDeepLink, createDeepLink } from 'fox-ecom';

handleDeepLink('/products?category=electronics');
```

### ✅ Dependency Injection
```typescript
import { di } from 'fox-ecom';

const service = di.get('authService');
```

---

## 📝 Example: New App Setup

### File Structure

```
my-app/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── ProductsScreen.tsx
│   │   └── CartScreen.tsx
│   ├── App.tsx
│   └── main.tsx
├── .env
├── package.json
└── tsconfig.json
```

### package.json

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "fox-ecom": "file:../fox-ecom-0.1.0.tgz"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  }
}
```

### .env

```
REACT_APP_TOKEN=your-auth-token
REACT_APP_ENV=production
```

### src/main.tsx

```typescript
import { initializeApp } from 'fox-ecom';
import { setupAppRouting } from 'fox-ecom';
import App from './App';
import * as Screens from './screens';

async function main() {
  // 1. Init auth & config
  await initializeApp({
    token: import.meta.env.REACT_APP_TOKEN,
    environment: import.meta.env.REACT_APP_ENV,
  });

  // 2. Setup routing
  await setupAppRouting({
    home: Screens.HomeScreen,
    products: Screens.ProductsScreen,
    cart: Screens.CartScreen,
  });

  // 3. Render app
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
}

main().catch(console.error);
```

### src/App.tsx

```typescript
import { useNavigation } from 'fox-ecom';
import { Routing } from 'fox-ecom';

function App() {
  const { currentRoute } = useNavigation();
  const Component = /* get current screen */;

  return (
    <div className="app">
      <header>
        <h1>My App</h1>
      </header>
      <main>
        <Component />
      </main>
    </div>
  );
}

export default App;
```

---

## 🔄 Summary: From SDK to Usage

### SDK Developer (You)

```bash
# 1. Build SDK
npm run build

# 2. Create tarball
npm pack
# → fox-ecom-0.1.0.tgz
```

### App Developer (Using Your SDK)

```bash
# 1. Install SDK
npm install /path/to/fox-ecom-0.1.0.tgz

# 2. Import and use
import { initializeApp, useAuth, useProducts } from 'fox-ecom';

# 3. That's it! ✅
```

---

## 📦 Version Management

### Update SDK Version

```typescript
// In fox-ecom package.json
{
  "version": "0.2.0"  // Bump version
}

// Build new tarball
npm pack
// → fox-ecom-0.2.0.tgz
```

### Update in Other App

```bash
# Install newer version
npm install /path/to/fox-ecom-0.2.0.tgz

# Or if published to npm
npm install fox-ecom@0.2.0
```

---

## 🎯 Publishing to npm (Optional)

If you want public distribution:

```bash
# 1. Create npm account
npm adduser

# 2. Publish
npm publish

# 3. Other apps install via
npm install fox-ecom
```

Then anyone can use:
```json
{
  "dependencies": {
    "fox-ecom": "^0.1.0"
  }
}
```

---

## ✅ Checklist: Ready for Distribution

- ✅ Source code complete
- ✅ TypeScript compiled to JavaScript
- ✅ Type definitions (.d.ts) generated
- ✅ package.json configured
- ✅ dist/ folder includes all modules
- ✅ Tarball created (fox-ecom-0.1.0.tgz)
- ✅ Documentation in place
- ✅ README with usage instructions

---

## 🎉 That's It!

Your SDK is now:
- **Complete** - All features implemented
- **Packaged** - Ready as tarball
- **Documented** - Full guide included
- **Distributable** - Can be installed in other apps
- **Usable** - Just import and use

---

**What other apps get:**

```typescript
// One import, complete ecommerce SDK
import {
  initializeApp,           // Initialize
  useAuth,                 // Authentication
  useProducts,             // Products
  useCart,                 // Shopping cart
  useNavigation,           // Navigation
  Routing,                 // Route management
  di,                      // DI container
} from 'fox-ecom';

// ✅ Ready to build ecommerce apps!
```

---

**Version**: 0.1.0  
**Status**: Production Ready  
**Format**: npm package (tgz)  
**Last Updated**: 2026-06-24
