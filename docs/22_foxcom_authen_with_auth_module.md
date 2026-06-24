# 🔐 FoxComAuthen + Auth Module Integration

Complete integration guide using the built-in auth module

---

## 🎯 Overview

FoxComAuthen uses the **auth module** internally to handle:
- ✅ Authentication logic
- ✅ Token management
- ✅ User session persistence
- ✅ Auth state

**Flow:**
```
FoxComAuthen
    ↓
initializeApp() + setupAppRouting()
    ↓
AuthService (from modules/auth)
    ↓
useAuth() hook in screens
```

---

## 📦 What's Included

### Auth Module Files
```
src/modules/auth/
├── services/
│   └── AuthService.ts       ← Singleton service
├── hooks/
│   └── useAuth.ts           ← React hook
├── types/
│   └── auth.types.ts        ← Types
└── index.ts                 ← Exports
```

### Example Screens
```
src/example-screens/
├── LoginScreen.tsx          ← Uses useAuth from auth module
├── HomeScreen.tsx           ← Uses useAuth + navigation
├── ExampleProductsScreen.tsx ← Uses products + cart
├── ExampleCartScreen.tsx    ← Uses cart
└── index.ts
```

---

## 🚀 Complete Setup

### Step 1: Define Routing

```typescript
// src/app/screen-map.ts
import * as ExampleScreens from '@/example-screens';

export const screenMap = {
  login: ExampleScreens.LoginScreen,
  home: ExampleScreens.HomeScreen,
  products: ExampleScreens.ExampleProductsScreen,
  cart: ExampleScreens.ExampleCartScreen,
};
```

### Step 2: Initialize FoxComAuthen

```typescript
// src/main.tsx
import { FoxComAuthen } from 'fox-ecom';
import { screenMap } from './app/screen-map';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

async function main() {
  // Create and initialize FoxComAuthen
  const fox = new FoxComAuthen({
    token: process.env.REACT_APP_TOKEN || 'demo-token',
    environment: (process.env.REACT_APP_ENV as any) || 'development',
    routing: screenMap,
    extra: {
      userId: localStorage.getItem('userId') || 'anonymous',
      deviceId: 'device-' + Math.random(),
    },
    enableLogging: true,
  });

  try {
    await fox.initialize();
    console.log('✅ FoxComAuthen initialized!');

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App fox={fox} />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('❌ Initialization failed:', error);
  }
}

main();
```

### Step 3: Use in App

```typescript
// src/App.tsx
import { FoxComAuthen } from 'fox-ecom';

interface AppProps {
  fox: FoxComAuthen;
}

function App({ fox }: AppProps) {
  const { navigate, Routing } = fox.getNavigation();
  const { useAuth } = fox.getAuth();

  // Use auth hook from auth module
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Show login screen from example-screens
    return <LoginScreen />;
  }

  return (
    <div className="app">
      <header>
        <h1>🛍️ Fox eCommerce</h1>
      </header>
      {/* App content */}
    </div>
  );
}

export default App;
```

---

## 📝 Auth Module Usage in Screens

### LoginScreen - Uses Auth Module

```typescript
// src/example-screens/LoginScreen.tsx
import { useAuth } from '@/modules/auth';

export function LoginScreen({ onLoginSuccess }) {
  // Use auth module's useAuth hook
  const { login, loading, error, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (isAuthenticated) {
    return <div>Already logged in</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // AuthService handles the logic internally
    const result = await login({ email, password });

    if (result.success) {
      onLoginSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### HomeScreen - Uses Auth + Navigation

```typescript
// src/example-screens/HomeScreen.tsx
import { useAuth } from '@/modules/auth';
import { useNavigation } from '@/modules/navigation';

export function HomeScreen() {
  // Use auth module
  const { user, logout, isAuthenticated } = useAuth();

  // Use navigation module
  const { navigate } = useNavigation();

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={() => navigate('products')}>
        View Products
      </button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

### ProductsScreen - Uses Products + Cart

```typescript
// src/example-screens/ExampleProductsScreen.tsx
import { useProducts } from '@/modules/products';
import { useCart } from '@/modules/cart';

export function ExampleProductsScreen() {
  // Use products module
  const { products, fetchProducts, isLoading } = useProducts();

  // Use cart module
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button onClick={() => addToCart(product, 1)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
```

### CartScreen - Uses Cart Module

```typescript
// src/example-screens/ExampleCartScreen.tsx
import { useCart } from '@/modules/cart';

export function ExampleCartScreen() {
  // Use cart module
  const { items, totalPrice, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return <div>Cart is empty</div>;
  }

  return (
    <div>
      <h1>Cart ({items.length} items)</h1>
      {items.map((item) => (
        <div key={item.productId}>
          <p>{item.product.name}</p>
          <p>${item.product.price * item.quantity}</p>
          <button onClick={() => removeFromCart(item.productId)}>
            Remove
          </button>
        </div>
      ))}
      <p>Total: ${totalPrice}</p>
      <button onClick={() => clearCart()}>Clear Cart</button>
    </div>
  );
}
```

---

## 🔄 Auth Flow

### Behind the Scenes:

1. **FoxComAuthen.initialize()**
   - Calls `initializeApp()`
   - Initializes AuthService from auth module
   - Sets up DI container

2. **Screen uses useAuth()**
   - Gets data from AuthService
   - Calls login/logout
   - AuthService manages token + session

3. **Auth State Changes**
   - AuthService notifies subscribers
   - useAuth hook updates
   - UI re-renders

```
FoxComAuthen
    ↓
initializeApp()
    ↓
DIContainer.registerSingleton(authService)
    ↓
Screen calls useAuth()
    ↓
useAuth subscribes to authService
    ↓
login() → authService.login()
    ↓
AuthService validates token + updates state
    ↓
Subscribers notified
    ↓
UI updates
```

---

## 📚 What Auth Module Provides

### AuthService (Singleton)
```typescript
// Handles auth logic
- login(credentials)
- logout()
- refreshToken()
- setExtra(data)
- getAccessToken()
- subscribe(listener)
```

### useAuth Hook
```typescript
// React hook for components
- session (AuthSession)
- user (AuthUser)
- token (AuthToken)
- isAuthenticated (boolean)
- loading (boolean)
- error (string | null)
- login(credentials)
- logout()
- refreshToken()
- setExtra(data)
- getExtra()
- getAccessToken()
```

### Auth Types
```typescript
- AuthCredentials
- AuthToken
- AuthUser
- AuthSession
- AuthExtra
- AuthResponse
```

---

## 🎯 Integration Checklist

- ✅ FoxComAuthen created with token + environment
- ✅ screenMap defined with example screens
- ✅ FoxComAuthen.initialize() called
- ✅ Example screens use useAuth from auth module
- ✅ LoginScreen calls login() from auth module
- ✅ HomeScreen checks isAuthenticated from auth module
- ✅ Other screens use other modules (products, cart)

---

## 🚀 Full Example (3 Files)

### main.tsx
```typescript
import { FoxComAuthen } from 'fox-ecom';
import { screenMap } from './app/screen-map';

const fox = new FoxComAuthen({
  token: 'your-token',
  environment: 'production',
  routing: screenMap,
});

await fox.initialize();

ReactDOM.render(<App fox={fox} />, root);
```

### App.tsx
```typescript
function App({ fox }) {
  const { useAuth } = fox.getAuth();
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <HomeScreen /> : <LoginScreen />;
}
```

### screens/LoginScreen.tsx
```typescript
import { useAuth } from 'fox-ecom';

export function LoginScreen() {
  const { login } = useAuth();
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      login({ email, password });
    }}>
      {/* form */}
    </form>
  );
}
```

---

## 📊 Architecture

```
FoxComAuthen (Entry Point)
    ↓
    ├── initializeApp()
    │   ├── setupDependencies()
    │   └── DIContainer.registerSingleton(AuthService)
    │
    ├── setupAppRouting(screenMap)
    │   └── Register screens
    │
    └── Ready to use!

Screens use modules via:
    ├── useAuth() → from AuthService (auth module)
    ├── useProducts() → from ProductService
    ├── useCart() → from CartService
    └── useNavigation() → from sdkRouter
```

---

## ✨ Benefits

✅ **Simple initialization** - Just FoxComAuthen
✅ **Uses existing auth module** - No duplication
✅ **Example screens** - Copy-paste ready
✅ **Complete flow** - Auth + products + cart
✅ **Type-safe** - Full TypeScript
✅ **Documented** - This guide

---

## 🎓 Migration from Manual Setup

### Before (Manual)
```typescript
await initializeApp({ token, environment });
await setupAppRouting(screenMap);
const { useAuth } = useAuth();
const { user } = useAuth();
```

### After (FoxComAuthen)
```typescript
const fox = new FoxComAuthen({ token, environment, routing: screenMap });
await fox.initialize();
const { useAuth } = fox.getAuth();
const { user } = useAuth();
```

---

## 🔐 Auth Module Features

✅ Token-based authentication
✅ Session management
✅ User info storage
✅ Observable pattern
✅ localStorage persistence
✅ Extra data support
✅ Token refresh
✅ Mock login (for demo)

---

**Version**: 0.1.0  
**Auth Module**: Complete  
**FoxComAuthen**: Simplified Entry Point  
**Example Screens**: Ready to Use  
**Last Updated**: 2026-06-24

---

## Quick Reference

```typescript
// Initialize
const fox = new FoxComAuthen({ token, environment, routing });
await fox.initialize();

// Get auth
const { useAuth } = fox.getAuth();
const { user, login, logout, isAuthenticated } = useAuth();

// Use auth in screens
function LoginScreen() {
  const { login } = useAuth();
  await login({ email, password });
}

// Auth module handles everything:
// - Token validation
// - Session persistence
// - User state management
```

**Auth module is built-in, FoxComAuthen uses it, screens integrate with it!** 🎉
